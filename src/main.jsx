import React, { Profiler } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); 

root.render(
  <Profiler id="App" onRender={callback}>
    <App />
  </Profiler>
);

function callback() {}

