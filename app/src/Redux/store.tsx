//=====================================================
//  IMPORTACIONES
//=====================================================
import { configureStore } from '@reduxjs/toolkit'
import controladorPaginacion from  "./Controladores/controladorPaginacion"
import controladorModal from  "./Controladores/controladorModal"
import controladorProducto from "./Controladores/controladorProducto"





//=====================================================
//  CREACION DEL "store" (DATOS GLOBALES)
//=====================================================
const store = configureStore({
    reducer: 
    {
        controladorPaginacion: controladorPaginacion ,
        controladorModal: controladorModal ,
        controladorProducto: controladorProducto
    }
})




//=====================================================
//  EXPORTACION DE LOS TIPOS DE DATOS
//=====================================================
/*
    "RootState": TIPO DE DATO DEL "store.state"
    "AppDispatch": TIPO DE DATO DEL HOOKS "useDispatch"
*/
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store