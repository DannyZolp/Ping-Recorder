import React from 'react';

interface propTypes {
  key: number;
  name: string;
  state: string;
  ip: string;
  ping?: number;
}

export function ServerRow({
  key,
  name,
  state,
  ip,
  ping,
}: propTypes): JSX.Element {
  if (ping === undefined) {
    return (
      <tr key={key}>
        <th>{state === 'online' ? '✅' : '❌'}</th>
        <th>{name}</th>
        <th>{ip}</th>
      </tr>
    );
  } else {
    return (
      <tr key={key}>
        <th>{state === 'online' ? '✅' : '❌'}</th>
        <th>{name}</th>
        <th>{ip}</th>
        <th>{ping > -1 ? `${ping}ms` : 'Loading...'}</th>
      </tr>
    );
  }
}
