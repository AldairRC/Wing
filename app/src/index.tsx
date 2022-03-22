
//=====================================================
//  IMPORTACIONES
//=====================================================
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals' 









//=====================================================
//  RENDERIZADO DE LA APP
/*
    LA APP QUEDA ENVUELTA EN EL COMPONENTE "Provider"
    PARA QUE CUALQUIER COMPONENTE REACT PUEDA ACCEDER 
    A LA "store" (DATOS GLOBALES DE LA APP)

    LA APP QUEDA ENVUELTA EN EL COMPONENTE "BrowserRouter"
    PARA QUE LA APLICACION SE MANEJE A TRAVES DE RUTAS URL
    DEFINIDAS EN EL COMPONENTE "App"
*/
//=====================================================
ReactDOM.render
(
  <React.StrictMode>
        <App />
  </React.StrictMode> ,

  document.getElementById('root')
)


reportWebVitals();