import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Animal from './Conventional';
import ContextAnimal from './Context';
import UpdateContextAnimal from './UpdateContext';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <div>
    <h1># Conventional method</h1>
    <Animal />
    
    <h1># Usinn New Context API</h1>
    <ContextAnimal />

    <h2>## Change State With New Context API</h2>
    <UpdateContextAnimal />
  </div>
  , document.getElementById('root')
);
registerServiceWorker();
