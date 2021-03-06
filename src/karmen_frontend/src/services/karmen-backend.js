const BASE_URL = window.env.BACKEND_BASE;

export const getPrinters = (fields = []) => {
  return fetch(`${BASE_URL}/printers?fields=${fields.join(',')}`)
    .then((response) => {
      if (response.status !== 200) {
        console.error(`Cannot get list of printers: ${response.status}`);
        return {};
      }
      return response.json()
    }).then((data) => {
      return data.items;
    }).catch((e) => {
      console.error(`Cannot get list of printers: ${e}`);
      return [];
    });
}

export const getPrinter = (ip, fields = []) => {
  return fetch(`${BASE_URL}/printers/${ip}?fields=${fields.join(',')}`)
    .then((response) => {
      if (response.status !== 200) {
        console.error(`Cannot get a printer: ${response.status}`);
        return;
      }
      return response.json();
    }).catch((e) => {
      console.error(`Cannot get a printer: ${e}`);
      return {};
    })
}

export const addPrinter = (ip, name) => {
  return fetch(`${BASE_URL}/printers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ip, name}),
  })
    .then((response) => {
      if (response.status !== 201) {
        console.error(`Cannot add a printer: ${response.status}`);
      }
      return response.status;
    }).catch((e) => {
      console.error(`Cannot add a printer: ${e}`);
      return 500;
    })
}

export const patchPrinter = (ip, data) => {
  return fetch(`${BASE_URL}/printers/${ip}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status !== 204) {
        console.error(`Cannot patch a printer: ${response.status}`);
      }
      return response.status;
    }).catch((e) => {
      console.error(`Cannot patch a printer: ${e}`);
      return 500;
    })
}

export const deletePrinter = (ip) => {
  return fetch(`${BASE_URL}/printers/${ip}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.status !== 204) {
        console.error(`Cannot remove a printer: ${response.status}`);
      }
      return response.status;
    }).catch((e) => {
      console.error(`Cannot remove a printer: ${e}`);
      return 500;
    })
}

export const changeCurrentJob = (ip, action) => {
  return fetch(`${BASE_URL}/printers/${ip}/current-job`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: action,
    }),
  })
    .then((response) => {
      if (response.status !== 204) {
        console.error(`Cannot change current job: ${response.status}`);
      }
      return response.status;
    }).catch((e) => {
      console.error(`Cannot change current job: ${e}`);
      return 500;
    });
}

export const changeSettings = (settings) => {
  return fetch(`${BASE_URL}/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  })
    .then((response) => {
      if (response.status !== 201) {
        console.error(`Cannot change a setting: ${response.status}`);
      }
      return response.status;
    }).catch((e) => {
      console.error(`Cannot change a setting: ${e}`);
      return 500;
    })
}

export const getSettings = (settings) => {
  return fetch(`${BASE_URL}/settings`)
    .then((response) => {
      if (response.status !== 200) {
        console.error(`Cannot get settings: ${response.status}`);
        return [];
      }
      return response.json();
    }).catch((e) => {
      console.error(`Cannot get settings: ${e}`);
      return [];
    })
}

export const heartbeat = () => {
  return fetch(`${BASE_URL}/`)
    .then((response) => {
      if (response.status !== 200) {
        console.error(`Heartbeat fail: ${response.status}`);
        return false;
      }
      return true;
    }).catch((e) => {
      console.error(`Heartbeat fail: ${e}`);
      return false;
    })
}

export const getGcodes = (startWith = null, orderBy = null, displayFilter = null, limit = 15) => {
  let uri = `${BASE_URL}/gcodes?limit=${limit}`;
  if (startWith) {
    uri += `&start_with=${startWith}`;
  }
  if (orderBy) {
    uri += `&order_by=${orderBy}`;
  }
  if (displayFilter) {
    uri += `&filter=display:${displayFilter}`;
  }
  return fetch(uri)
    .then((response) => {
      if (response.status !== 200) {
        console.error(`Cannot get list of gcodes: ${response.status}`);
        return {
          "items": []
        };
      }
      return response.json();
    }).catch((e) => {
      console.error(`Cannot get list of gcodes: ${e}`);
      return {
        "items": []
      };
    });
}

export const deleteGcode = (id) => {
  return fetch(`${BASE_URL}/gcodes/${id}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.status !== 204) {
        console.error(`Cannot remove a gcode: ${response.status}`);
      }
      return response.status;
    }).catch((e) => {
      console.error(`Cannot remove a gcode: ${e}`);
      return 500;
    });
}

export const uploadGcode = (path, file) => {
  var data = new FormData();
  data.append('file', file);
  data.append('path', path);
  return fetch(`${BASE_URL}/gcodes`, {
    method: 'POST',
    body: data,
  })
    .then((response) => {
      if (response.status !== 201) {
        console.error(`Cannot add a gcode: ${response.status}`);
      }
      return response.status;
    }).catch((e) => {
      console.error(`Cannot add a gcode: ${e}`);
      return 500;
    });
}


export const printGcode = (id, printer) => {
  return fetch(`${BASE_URL}/printjobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      gcode: id,
      printer: printer,
    }),
  })
    .then((response) => {
      if (response.status !== 201) {
        console.error(`Cannot start a printjob: ${response.status}`);
      }
      return response.status;
    }).catch((e) => {
      console.error(`Cannot start a printjob: ${e}`);
      return 500;
    });
}

export const getPrinterJobs = (startWith = null, orderBy = null, printerFilter = null, limit = 10) => {
    let uri = `${BASE_URL}/printjobs?limit=${limit}`;
  if (startWith) {
    uri += `&start_with=${startWith}`;
  }
  if (orderBy) {
    uri += `&order_by=${orderBy}`;
  }
  if (printerFilter) {
    uri += `&filter=printer_ip:${printerFilter}`;
  }
  return fetch(uri)
    .then((response) => {
      if (response.status !== 200) {
        console.error(`Cannot get list of printjobs: ${response.status}`);
        return {
          "items": []
        };
      }
      return response.json();
    }).catch((e) => {
      console.error(`Cannot get list of printjobs: ${e}`);
      return {
        "items": []
      };
    });
}