import React from 'react';
import ReactDOM from 'react-dom';
import { server } from './types/server';
import { Home } from './views/Home';

(async () => {
  const servers = await (
    await fetch('https://dannyzolp.github.io/servers.json')
  ).json();

  ReactDOM.render(
    <Home servers={servers as server[]} />,
    document.getElementById('root')
  );
})();
