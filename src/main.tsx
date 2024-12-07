import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import { HTML5Backend } from 'react-dnd-html5-backend'

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const options = {
  enableMouseEvents: true,
  enableTouchEvents: true,
  delayTouchStart: 0,
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend} options={options}>
      <App />
    </DndProvider>
  </React.StrictMode>,
)