import React from 'react';
import { Router } from '@reach/router';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <div className="App">
      <Router>
        <LandingPage path="/" />
      </Router>
    </div>
  );
}

export default App;
