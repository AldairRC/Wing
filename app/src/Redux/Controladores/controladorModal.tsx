
//=================================================================
//      IMPORTACIONES
//=================================================================
import { createSlice, PayloadAction } from '@reduxjs/toolkit'




//=================================================================
//      INTERFACES
//=================================================================
export interface stateReduxModal {
    modalCargandoVisible: boolean ,
    mensajeModalCargando: string
}


const stateInicial: stateReduxModal = 
{
    modalCargandoVisible: false ,
    mensajeModalCargando: ""
}




//=================================================================
//      FUNCION REDUCTORA
//=================================================================
export const controlador = createSlice({
    name: 'modal', 
    initialState: stateInicial ,
    reducers: 
    {
        setModalCargandoVisible: ( state , accion: PayloadAction<boolean> ) => 
        {
            state.modalCargandoVisible = accion.payload
        } ,
        setMensajeModalCargando: ( state , accion: PayloadAction<string> ) => 
        {
            state.mensajeModalCargando = accion.payload
        } ,
        mostrarModalCargando: ( state , accion: PayloadAction<string> ) => 
        {
            state.modalCargandoVisible = true
            state.mensajeModalCargando = accion.payload
        } ,
        ocultarModalCargando: ( state ) => 
        {
            state.modalCargandoVisible = false
            state.mensajeModalCargando = "Cargando ..."
        }
    }
})



//=================================================================
//      EXPORTACION DE LAS ACCIONES 
//=================================================================
export const setModalCargandoVisible = controlador.actions.setModalCargandoVisible
export const setMensajeModalCargando = controlador.actions.setMensajeModalCargando
export const mostrarModalCargando = controlador.actions.mostrarModalCargando
export const ocultarModalCargando = controlador.actions.ocultarModalCargando

// SE EXPORTA EL LA FUNCION REDUCTORA
export default controlador.reducer