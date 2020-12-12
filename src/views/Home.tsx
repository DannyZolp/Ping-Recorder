import React, { useState } from 'react';
import 'bulma';
import { server } from '../types/server';
import download from 'downloadjs';
import { ipcRenderer } from 'electron';
import { ServerRow } from '../components/ServerRow';

interface propTypes {
  servers: server[];
}

export const Home = ({ servers }: propTypes): JSX.Element => {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [progress, setProgress] = useState(0);

  const serverTable = servers.map((server: server) => {
    if (started) {
      return (
        <ServerRow
          key={server.key}
          name={server.name}
          state={server.status as string}
          ip={server.ip}
          ping={server.ping}
        />
      );
    } else {
      return (
        <ServerRow
          key={server.key}
          name={server.name}
          state={server.status as string}
          ip={server.ip}
        />
      );
    }
  });

  const startAnalysis = async () => {
    setFinished(false);
    setStarted(true);
    setProgress(0);
    for (const server of servers) {
      try {
        let averagePing = 0;
        for (let i = 0; i <= 10; i++) {
          averagePing += await ipcRenderer.invoke('ping', [server.ip]);
        }
        averagePing = averagePing / 10;
        server.ping = averagePing;
        setProgress((previousValue) => previousValue + 100 / servers.length);
      } catch (e) {
        console.log(e);
        server.status = 'offline';
      }
    }
    setFinished(true);
  };

  const submitResults = async () => {
    download(JSON.stringify({ servers }), 'pingdata.json');
  };

  return (
    <>
      <header className="header has-text-centered m-2 p-3">
        <h1 className="title">Ping Recorder</h1>
        <table className="table is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>Status</th>
              <th>Server</th>
              <th>IP</th>
              {started ? <th>Ping</th> : <></>}
            </tr>
          </thead>
          <tbody>{serverTable}</tbody>
        </table>
        <progress
          className="progress"
          value={progress}
          max="100"
          style={{ display: started ? '' : 'none' }}
        >
          {progress}%
        </progress>
        {finished ? (
          <div className="buttons is-centered">
            <button className="button is-link" onClick={submitResults}>
              Submit Results
            </button>
            <button className="button is-primary" onClick={startAnalysis}>
              Redo?
            </button>
          </div>
        ) : (
          <button
            className={
              started ? 'button is-primary is-loading' : 'button is-primary'
            }
            onClick={startAnalysis}
          >
            Click to start analysis
          </button>
        )}
      </header>
    </>
  );
};
