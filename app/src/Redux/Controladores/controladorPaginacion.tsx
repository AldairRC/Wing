
//=================================================================
//      IMPORTACIONES
//=================================================================
import { createSlice, PayloadAction } from '@reduxjs/toolkit'




//=================================================================
//      INTERFACES
//=================================================================
export interface stateReduxPaginacion {
    paginaActual: number
}

interface Payload {
    paginaActual: number
}


const stateInicial: stateReduxPaginacion = 
{
    paginaActual: 1
}




//=================================================================
//      FUNCION REDUCTORA
//=================================================================
export const controlador = createSlice({
    name: 'paginacion', 
    initialState: stateInicial ,
    reducers: 
    {
        setPaginaActual: ( state , accion: PayloadAction<number> ) => 
        {
            state.paginaActual = accion.payload
        }
    }
})



//=================================================================
//      EXPORTACION DE LAS ACCIONES 
//=================================================================
export const setPaginaActual = controlador.actions.setPaginaActual

// SE EXPORTA EL LA FUNCION REDUCTORA
export default controlador.reducer
