import React from 'react';
import { Router } from '@reach/router';
import { Home } from './components/Home';

window.onSpotifyWebPlaybackSDKReady = () => {};

function App() {
  return (
    <div className="App">
      <Router>
        <Home path="/" />
      </Router>
    </div>
  );
}

export default App;
