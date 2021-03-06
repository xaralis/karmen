import React from 'react';
import { Link } from 'react-router-dom';
import BoxedModal from './boxed-modal';
import { WebcamStream } from './webcam-stream';
import { deletePrinter, changeCurrentJob } from '../services/karmen-backend';

export const Progress = ({ completion, printTime, printTimeLeft }) => {
  let progressBarWidth = {
    width: (printTime > 0 ? completion.toFixed(2) : '0')+'%',
  };
  let approxPrintTimeLeft = printTimeLeft;
  if (!approxPrintTimeLeft && printTime > 0) {
    approxPrintTimeLeft = (printTime / completion) * 100;
  }
  if (approxPrintTimeLeft) {
    // TODO use dayjs
    let d = new Date(null);
    d.setSeconds(approxPrintTimeLeft)
    approxPrintTimeLeft = `${d.toISOString().substr(11, 2)}h ${d.toISOString().substr(14, 2)}m`;
  }
  return (
    <React.Fragment>
      <div className="progress">
        <div className="progress-detail">
          {printTimeLeft
            ? <React.Fragment>{printTime > 0 ? completion.toFixed(2) : '0'}% ({approxPrintTimeLeft || '?'} remaining)</React.Fragment>
            : <React.Fragment></React.Fragment>
          }
        </div>
        <div className="progress-bar" style={progressBarWidth}></div>
      </div>
    </React.Fragment>
  );
}


export const Temperature = ({name, actual, target }) => {
  return <span> {name}: {actual}/{target} &#176;C</span>
}

export const PrinterActions = ({ ip, onPrinterDelete }) => {
    return (
      <div className="box-actions">
        <h2 className="hidden">Actions</h2>
        <Link to={`/printers/${ip}`}><i className="icon icon-cog"></i></Link>
        <button className="plain" onClick={onPrinterDelete}><i className="icon icon-bin"></i></button>
      </div>
    );
}

export const PrinterState = ({ printer }) => {
  return (
    <div className="printer-state">
      <h2 className="hidden">Current state</h2>
      <div className="tags">
        <span className="tag">{printer.client.connected ? "Connected" : "Disconnected"}</span>
        <span className="tag">{printer.status.state}</span>
       </div>
      {(!printer.status.temperature || (!printer.status.temperature.tool0 && !printer.status.temperature.bed)) && <>&nbsp;</>}
      {printer.status.temperature && printer.status.temperature.tool0 && <><Temperature name="Tool" {...printer.status.temperature.tool0} />,</>}
      {printer.status.temperature && printer.status.temperature.bed && <Temperature name="Bed" {...printer.status.temperature.bed} />}
      <p><strong>{(printer.job && printer.job.name) || '\u00A0'}</strong></p>
    </div>
  );
}

export const PrinterConnection = ({ printer }) => {
  return (
    <div className="printer-connection">
      <h2 className="hidden">Connection</h2>
      <ul>
          <li><strong>Status</strong>: {printer.client.connected ? 'Active' : 'Inactive'}</li>
          <li><strong>Client</strong>: {printer.client.name} (<code>{JSON.stringify(printer.client.version)}</code>)</li>
          <li><strong>Client IP</strong>: <a href={`http://${printer.ip}`} target="_blank" rel="noopener noreferrer">{printer.ip}</a></li>
          {printer.hostname && <li><strong>Hostname</strong>: <a href={`http://${printer.hostname}`} target="_blank" rel="noopener noreferrer">{printer.hostname}</a></li>}
      </ul>
    </div>
  );
}

export class PrinterView extends React.Component {
  state = {
    showDeleteModal: false,
    showCancelModal: false,
  }
  render() {
    const { showDeleteModal, showCancelModal } = this.state;
    const { printer, onPrinterDelete } = this.props;
    if (showDeleteModal) {
      return (
        <BoxedModal inverse onBack={() => {
          this.setState({
            showDeleteModal: false,
            showCancelModal: false,
          });
        }}>
          <h1>Are you sure?</h1>
            <p>You can add the printer back later by simply adding <code>{printer.ip}</code> again.</p>
            <button type="submit" onClick={() => {
              deletePrinter(printer.ip);
              onPrinterDelete(printer.ip);
            }}>Remove printer</button>
        </BoxedModal>
        );
    }
    if (showCancelModal) {
      return (
        <BoxedModal inverse backText="Keep printing" onBack={() => {
          this.setState({
            showDeleteModal: false,
            showCancelModal: false,
          });
        }}>
          <h1>Are you sure?</h1>
            <p>You are about to cancel the whole print!</p>
            <button type="submit" onClick={() => {
              changeCurrentJob(printer.ip, 'cancel')
                .then(() => {
                  this.setState({
                    showDeleteModal: false,
                    showCancelModal: false,
                  });
                })
            }}>Cancel the print</button>
        </BoxedModal>
        );
    }
    return (
      <>
        <div className="stream-wrapper">
          <WebcamStream {...printer.webcam} />
          <Progress {...printer.job} />
          {printer.status && ['Printing', 'Paused'].indexOf(printer.status.state) > -1 && (
            <div className="printer-controls">
              {printer.status.state === 'Paused'
                ? (
                <button className="plain" onClick={() => {
                  changeCurrentJob(printer.ip, 'toggle');
                }}>
                  <span className="icon-play"></span>
                </button>)
                : (
                <button className="plain" onClick={() => {
                  changeCurrentJob(printer.ip, 'toggle');
                }}>
                  <span className="icon-pause"></span>
                </button>)
              }
                <button className="plain" onClick={() => {
                  this.setState({
                    showCancelModal: true,
                  });
                }}>
                <span className="icon-stop"></span>
              </button>
            </div>
          )}
        </div>
        <div className="box-details">
          <div className="title">
            <a href={`http://${printer.ip}`} target="_blank" rel="noopener noreferrer">
              <strong>{printer.name}</strong>
            </a>
          </div>
          <PrinterState printer={printer} />
          <PrinterActions ip={printer.ip} onPrinterDelete={() => {
            this.setState({
              showDeleteModal: true,
            })
          }} />
        </div>
      </>
    );
  }
}

export default PrinterView;