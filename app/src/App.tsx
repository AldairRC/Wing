//=====================================================
//  IMPORTACIONES GENERALES
//=====================================================
import React from 'react'
import { Navigate, Route, Routes , useNavigate , BrowserRouter } from 'react-router-dom'
import './App.css'

// redux
import store from './Redux/store'
import { Provider } from 'react-redux'  
import { useReduxSelector , useReduxDispatch } from './Redux/hooks'


//=====================================================
//  IMPORTACIONES DE MIS COMPONENTES
//=====================================================
import PaginaAlmacenProductos from './Pages/Negocio/ListaProductos/PaginaAlmacenProductos'
import PaginaProducto from './Pages/Negocio/Producto/PaginaProducto'

import ModalCargando from './Components/ModalCargando/ModalCargando'
import ModalImagen from './Components/ModalImagen/ModalImagen'
import PaginaMarca from './Pages/Negocio/Marca/PaginaMarca'
import PaginaCategorias from './Pages/Negocio/Categorias/PaginaCategorias'






//=====================================================
//  INTERFACES PARA OBJETOS
//=====================================================
interface Props 
{
}




//=====================================================
//  DEFINICION DEL COMPONENTE <App>
//=====================================================
const App = (props: Props) =>
{
  return (
    <Provider  store={store} >

        <BrowserRouter>
            <Rutas />
        </BrowserRouter>
        
        <VentanaCargando />

    </Provider>
    )
}


//=====================================================
//  DEFINICION DEL COMPONENTE <VentanaCargando>

//  ESTE COMPONENTE ALBERGA EL MODAL CARGANDO
//=====================================================
const VentanaCargando = (props: Props) =>
{
    // hooks
    const stateReduxModal = useReduxSelector( state => state.controladorModal )
 
    // html
    return (
    <ModalCargando 
        modalVisible={ stateReduxModal.modalCargandoVisible }
        texto={ stateReduxModal.mensajeModalCargando }
    />
    )
}







//=====================================================
//  DEFINICION DEL COMPONENTE <Rutas>

// AQUI ESTARAN TODAS LAS PAGINAS DE LA APP
//=====================================================
const Rutas = (props: Props) =>
{
    //_____________________________
    // USO DE LOS HOOKS
    //_____________________________
    const navigate = useNavigate()
    const stateReduxPaginacion = useReduxSelector( state => state.controladorPaginacion )
    const stateReduxModal = useReduxSelector( state => state.controladorModal )
    const stateReduxProducto = useReduxSelector( state => state.controladorProducto )
    const dispatchRedux = useReduxDispatch()

    return (
        <Routes>
            <Route  
                path='/'  
                element=
                { 
                    <PaginaAlmacenProductos 
                        navigate={ navigate } 
                        stateReduxPaginacion={ stateReduxPaginacion }
                        stateReduxModal={ stateReduxModal }
                        stateReduxProducto={ stateReduxProducto }
                        dispatchRedux={ dispatchRedux } 
                    /> 
                } 
            />

            <Route  
                path='/Categorias'  
                element=
                { 
                    <PaginaCategorias
                        navigate={ navigate } 
                        stateReduxPaginacion={ stateReduxPaginacion }
                        stateReduxProducto={ stateReduxProducto }
                        stateReduxModal={ stateReduxModal }
                        dispatchRedux={ dispatchRedux } 
                    /> 
                } 
            />

            <Route  
                path='/Marcas'  
                element=
                { 
                    <PaginaMarca
                        navigate={ navigate } 
                        stateReduxPaginacion={ stateReduxPaginacion }
                        stateReduxProducto={ stateReduxProducto }
                        stateReduxModal={ stateReduxModal }
                        dispatchRedux={ dispatchRedux } 
                    /> 
                } 
            />

            <Route  
                path='/Producto'  
                element=
                { 
                    <PaginaProducto
                        navigate={ navigate } 
                        stateReduxPaginacion={ stateReduxPaginacion }
                        stateReduxModal={ stateReduxModal }
                        stateReduxProducto={ stateReduxProducto }
                        dispatchRedux={ dispatchRedux } 
                    /> 
                } 
            />      

            <Route  
                path='/MisProductos'  
                element=
                { 
                    <PaginaAlmacenProductos 
                        navigate={ navigate } 
                        stateReduxPaginacion={ stateReduxPaginacion }
                        stateReduxModal={ stateReduxModal }
                        stateReduxProducto={ stateReduxProducto }
                        dispatchRedux={ dispatchRedux } 
                    /> 
                } 
            />

            <Route  path='*'  element={ <Navigate  to='/' /> } />
        </Routes>
    
    )
}

export default App;
