// Same-origin frame owns canvas geometry, input and the unmodified official application.
import {startCanvasEditor} from './app-loader.js';

const config = parent.FILMCRAFT_DELIVERY;
document.documentElement.lang = parent.document.documentElement.lang;
const report = detail => parent.postMessage({type: 'filmcraft-startup', ...detail}, location.origin);
document.addEventListener('editor-fatal', event => report({error: event.detail}));
try {
  const handle = await startCanvasEditor(config);
  if (!handle.state.error) {
    handle.state.ready = true;
    report({ready: true, canvasSizing: handle.state.canvasSizing});
  }
} catch (error) { report({error: String(error?.stack || error)}); }
