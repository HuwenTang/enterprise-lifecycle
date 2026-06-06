import router from "../src/router";

import './App.css'
import {RouterProvider} from "react-router-dom";
import {useEffect} from "react";
import VConsole from "vconsole";

function App() {
    useEffect(() => {
        // 页面加载时检查是否需要显示vConsole
        if(localStorage.getItem('vConsoleDisplayed') === 'true') {
            new VConsole()
        }
    }, []);

  return (
      <div style={{width: '100%', backgroundColor: '#F4F9FE'}}>
          <RouterProvider router={router}>

          </RouterProvider>
      </div>
  )
}

export default App
