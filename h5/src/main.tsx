import { createRoot } from 'react-dom/client'
import './index.css'
import 'normalize.css'
import App from './App.tsx'
import '@ant-design/v5-patch-for-react-19';
import VConsole from 'vconsole';

// const vConsole = new VConsole();


createRoot(document.getElementById('root')!).render(
    <App />,
)
