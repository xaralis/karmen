import React from 'react';
import { Redirect } from 'react-router-dom';

import { BackLink } from '../components/back';
import { uploadGcode } from '../services/karmen-backend';

class AddGcode extends React.Component {
  state = {
    toUpload: null,
    path: '',
    submitting: false,
    message: null,
    messageOk: false,
  }

  constructor(props) {
    super(props);
    this.addCode = this.addCode.bind(this);
  }

  addCode(e) {
    e.preventDefault();
    const { toUpload, path } = this.state;
    if (!toUpload) {
      this.setState({
        message: 'You need to select a file!',
      });
      return;
    }
    this.setState({
      submitting: true,
      message: null,
      messageOk: false,
    });
    uploadGcode(path, toUpload)
      .then((r) => {
          switch(r) {
            case 201:
              this.setState({
                submitting: false,
                message: 'File uploaded',
                path: '',
                messageOk: true,
                redirect: true,
              });
              break;
            case 415:
              this.setState({
                message: 'This does not seem like a G-Code file.',
                submitting: false,
              });
              break;
            default:
              this.setState({
                message: 'Cannot upload G-Code, check server logs',
                submitting: false,
              });
          }
        });
  }

  render () {
    const { message, messageOk, redirect, submitting, path } = this.state;
    if (redirect) {
      return <Redirect to="/gcodes" />
    }
    return (
      <div className="standalone-page">
        <header>
          <h1 className="title">Add a G-Code</h1>
        </header>
        <form>
          {message && <p className={messageOk ? "message-success" : "message-error"}>{message}</p>}
          <p>
            <label htmlFor="file">Select your gcode</label>
            <input type="file" name="file" onChange={(e) => {
              this.setState({
                toUpload: e.target.files[0]
              });
            }} />
          </p>
          <p>
            <label htmlFor="path">Path (optional)</label>
            <input type="text" id="path" name="path" value={path} onChange={(e) => this.setState({
              path: e.target.value
            })} />
          </p>
          <div className="form-actions">
            <button type="submit" onClick={(e) => this.addCode(e)} disabled={submitting}>
              {submitting
                ? 'Uploading...'
                : 'Upload G-Code'
              }
            </button>
            <BackLink to="/gcodes" />
          </div>
        </form>
      </div>
    );
  }
}

export default AddGcode;