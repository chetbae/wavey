import './App.css';
import React, { useState } from 'react';
import AudioInput from './components/audio_input.tsx';
function App() {
  const [f, setF] = useState("");

  return (
    <div className="App">
      <h1>🌊Waveform Visualizer🌊</h1><br/>
      <code><AudioInput f={f} setF={setF}/></code>
      <canvas/>
      <code class="bottom">written by Max Zhang, <a href="https://github.com/chetbae" rel="noreferrer" target="_blank">GitHub</a></code>
    </div>
  );
}

export default App;
