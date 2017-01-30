import React from 'react';
import ReactDOM from 'react-dom';

import Game from './index';

// TODO: figure out what's going on here
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Game />, div);
});
