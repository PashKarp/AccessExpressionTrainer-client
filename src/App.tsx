import {useContext, useEffect } from 'react';
import Blockly from 'blockly';
import './App.css';
import { TaskElContext } from './TaskContext';
import TaskZone from './TaskZone';

function App() {
    return (
    <TaskElContext>
      <TaskZone />
    </TaskElContext>
  );
}

export default App;
