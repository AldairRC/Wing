
//=================================================================
//      IMPORTACIONES
//=================================================================
import { createSlice, PayloadAction } from '@reduxjs/toolkit'




//=================================================================
//      INTERFACES
//=================================================================
export interface Producto
{
    id?: string ,
    id_negocio?: string ,
    nombre?: string ,
    descripcion?: string ,
    codigo_barras?: string ,
    precio?: number ,

    marca_id?: string ,
    marca_nombre?: string ,
    marca_imagen?: string ,
    marca_imagenTipo?: string ,

    categoria_id?: string ,
    categoria_nombre?: string ,
    categoria_imagen?: string ,
    categoria_imagenTipo?: string ,
    categoria_ubicacion?: string ,

    dimension?: number ,
    dimension_tipo?: string ,

    imagenes_base64?: string[] ,
    imagenes_tipo?: string[]
}


export interface stateReduxProducto 
{
    productoBD: Producto ,
    actual: Producto ,   // Info del Producto actual que se esta editando

    // DATOS CONTROLADOS POR LA PAGINA "PaginaProducto"
    seccionActual: number
}


const stateInicial: stateReduxProducto = 
{
    productoBD: 
    {
        id: "" ,
        id_negocio: "" ,
        nombre: "" ,
        descripcion: "" ,
        codigo_barras: "" ,
        precio: 0 ,

        marca_id: "" ,
        marca_nombre: "" ,
        marca_imagen: "" ,
        marca_imagenTipo: "" ,

        categoria_id: "" ,
        categoria_nombre: "" ,
        categoria_imagen: "" ,
        categoria_imagenTipo: "" ,
        categoria_ubicacion: "" ,

        dimension: 0 ,
        dimension_tipo: "N/A" ,

        imagenes_base64: [] ,
        imagenes_tipo: []
    } ,
    
    actual: 
    {
        id: "" ,
        id_negocio: "" ,
        nombre: "" ,
        descripcion: "" ,
        codigo_barras: "" ,
        precio: 0 ,

        marca_id: "" ,
        marca_nombre: "" ,
        marca_imagen: "" ,
        marca_imagenTipo: "" ,

        categoria_id: "" ,
        categoria_nombre: "" ,
        categoria_imagen: "" ,
        categoria_imagenTipo: "" ,
        categoria_ubicacion: "" ,

        dimension: 0 ,
        dimension_tipo: "N/A" ,

        imagenes_base64: [] ,
        imagenes_tipo: []
    } ,

    // DATOS CONTROLADOS POR LA PAGINA "PaginaProducto"
    seccionActual: 1
}




//=================================================================
//      FUNCION REDUCTORA
//=================================================================
export const controlador = createSlice({
    name: 'producto', 
    initialState: stateInicial ,
    reducers: 
    {
        limpiarProductoBD: ( state ) => 
        {
            state.productoBD =
            {
                id: "" ,
                id_negocio: "",
                nombre: "" ,
                descripcion: "" ,
                codigo_barras: "" ,
                precio: 0 ,

                marca_id: "" ,
                marca_nombre: "" ,
                marca_imagen: "" ,
                marca_imagenTipo: "" ,

                categoria_id: "" ,
                categoria_nombre: "" ,
                categoria_imagen: "" ,
                categoria_imagenTipo: "" ,
                categoria_ubicacion: "" ,

                dimension: 0 ,
                dimension_tipo: "N/A" ,

                imagenes_base64: [] ,
                imagenes_tipo: []
            }
        } ,

        limpiarProductoActual: ( state ) => 
        {
            state.actual =
            {
                id: "" ,
                id_negocio: "",
                nombre: "" ,
                descripcion: "" ,
                codigo_barras: "" ,
                precio: 0 ,

                marca_id: "" ,
                marca_nombre: "" ,
                marca_imagen: "" ,
                marca_imagenTipo: "" ,

                categoria_id: "" ,
                categoria_nombre: "" ,
                categoria_imagen: "" ,
                categoria_imagenTipo: "" ,
                categoria_ubicacion: "" ,

                dimension: 0 ,
                dimension_tipo: "N/A" ,

                imagenes_base64: [] ,
                imagenes_tipo: []
            }
        } ,

        setProductoBD_como_ProductoActual: ( state ) => 
        {
            state.actual =
            {
                id: state.productoBD.id ,
                id_negocio: state.productoBD.id_negocio ,
                nombre: state.productoBD.nombre ,
                descripcion: state.productoBD.descripcion ,
                codigo_barras: state.productoBD.codigo_barras ,
                precio: state.productoBD.precio ,

                marca_id: state.productoBD.marca_id ,
                marca_nombre: state.productoBD.marca_nombre ,
                marca_imagen: state.productoBD.marca_imagen ,
                marca_imagenTipo: state.productoBD.marca_imagenTipo ,

                categoria_id: state.productoBD.categoria_id ,
                categoria_nombre: state.productoBD.categoria_nombre ,
                categoria_imagen: state.productoBD.categoria_imagen ,
                categoria_imagenTipo: state.productoBD.categoria_imagenTipo ,
                categoria_ubicacion: state.productoBD.categoria_ubicacion ,

                dimension: state.productoBD.dimension ,
                dimension_tipo: state.productoBD.dimension_tipo ,

                imagenes_base64: state.productoBD.imagenes_base64 ,
                imagenes_tipo: state.productoBD.imagenes_tipo
            }
        } ,

        setProductoBD: ( state , accion: PayloadAction<{
            id: string ,
            nombre: string ,
            descripcion: string ,
            codigo_barras: string ,
            precio: number ,

            marca_id: string ,
            marca_nombre: string ,
            marca_imagen: string ,
            marca_imagenTipo: string ,

            categoria_id: string ,
            categoria_nombre: string ,
            categoria_imagen: string ,
            categoria_imagenTipo: string ,
            categoria_ubicacion: string ,

            dimension: number ,
            dimension_tipo: string ,

            imagenes_base64: string[] ,
            imagenes_tipo: string[]
        }> ) => 
        {
            state.productoBD = 
            {
                id: accion.payload.id ,
                nombre: accion.payload.nombre ,
                descripcion: accion.payload.descripcion ,
                codigo_barras: accion.payload.codigo_barras ,
                precio: accion.payload.precio ,

                marca_id: accion.payload.marca_id ,
                marca_nombre: accion.payload.marca_nombre ,
                marca_imagen: accion.payload.marca_imagen ,
                marca_imagenTipo: accion.payload.marca_imagenTipo ,

                categoria_id: accion.payload.categoria_id ,
                categoria_nombre: accion.payload.categoria_nombre ,
                categoria_imagen: accion.payload.categoria_imagen ,
                categoria_imagenTipo: accion.payload.categoria_imagenTipo ,
                categoria_ubicacion: accion.payload.categoria_ubicacion ,

                dimension: accion.payload.dimension ,
                dimension_tipo: accion.payload.dimension_tipo ,

                imagenes_base64: accion.payload.imagenes_base64 ,
                imagenes_tipo: accion.payload.imagenes_tipo
            }
        } ,

        setProductoActual: ( state , accion: PayloadAction<{
            nombre: string ,
            descripcion: string ,
            codigo_barras: string ,
            precio: number ,

            dimension: number ,
            dimension_tipo: string ,

            imagenes_base64: string[] ,
            imagenes_tipo: string[]
        }> ) => 
        {
            state.actual.nombre = accion.payload.nombre
            state.actual.descripcion = accion.payload.descripcion
            state.actual.codigo_barras = accion.payload.codigo_barras
            state.actual.precio = accion.payload.precio

            state.actual.dimension = accion.payload.dimension
            state.actual.dimension_tipo = accion.payload.dimension_tipo

            state.actual.imagenes_base64 = accion.payload.imagenes_base64
            state.actual.imagenes_tipo = accion.payload.imagenes_tipo
            
        } ,

        setMarcaActual: ( state , accion: PayloadAction<{
            id: string ,
            nombre: string ,
            imagen: string ,
            imagenTipo: string
        }> ) => 
        {
            state.actual.marca_id = accion.payload.id
            state.actual.marca_nombre = accion.payload.nombre
            state.actual.marca_imagen = accion.payload.imagen
            state.actual.marca_imagenTipo = accion.payload.imagenTipo
        } ,

        setCategoriaActual: ( state , accion: PayloadAction<{
            id: string ,
            nombre: string ,
            imagen: string ,
            imagenTipo: string ,
            ubicacion: string
        }> ) => 
        {
            state.actual.categoria_id = accion.payload.id
            state.actual.categoria_nombre = accion.payload.nombre
            state.actual.categoria_imagen = accion.payload.imagen
            state.actual.categoria_imagenTipo = accion.payload.imagenTipo
            state.actual.categoria_ubicacion = accion.payload.ubicacion
        } ,

        setSeccionActual: ( state , accion: PayloadAction<number> ) => {
            state.seccionActual = accion.payload
        }
    }
})



//=================================================================
//      EXPORTACION DE LAS ACCIONES 
//=================================================================
export const ReduxProducto_setMarcaActual = controlador.actions.setMarcaActual
export const ReduxProducto_setCategoriaActual = controlador.actions.setCategoriaActual

export const ReduxProducto_setProductoBD = controlador.actions.setProductoBD
export const ReduxProducto_setProductoActual = controlador.actions.setProductoActual
export const ReduxProducto_limpiarProductoBD = controlador.actions.limpiarProductoBD
export const ReduxProducto_limpiarProductoActual = controlador.actions.limpiarProductoActual
export const ReduxProducto_setProductoBD_como_ProductoActual = controlador.actions.setProductoBD_como_ProductoActual
export const ReduxProducto_setSeccionActual = controlador.actions.setSeccionActual


// SE EXPORTA EL LA FUNCION REDUCTORA
export default controlador.reducer