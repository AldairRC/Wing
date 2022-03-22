
//=====================================================
//  IMPORTACIONES GENERALES
//=====================================================
import React from 'react'
import { NavigateFunction } from 'react-router-dom'

// iconos
import { 
    faHome , faClipboardList , faDolly , faBoxes , faListUl , faFilter , faPlus ,
    faSearch
} from '@fortawesome/free-solid-svg-icons'

// mis componentes
import Encabezado , { Item } from '../../../Components/Encabezado/Encabezado'
import Paginacion from '../../../Components/Paginacion/Paginacion'
import DivResultado from '../../../Components/DivResultado/DivResultado'
import ModalImagen from '../../../Components/ModalImagen/ModalImagen'
import TarjetaProducto from './TarjetaProducto'

import ModalMensaje , { 
    MENSAJE_CORRECTO ,
    MENSAJE_ERROR ,
    MENSAJE_PREGUNTA
} from '../../../Components/ModalMensaje/ModalMensaje'

// redux
import { 
    stateReduxPaginacion , 
    setPaginaActual 
} from "../../../Redux/Controladores/controladorPaginacion"

import 
{ 
    stateReduxModal , 
    mostrarModalCargando ,
    ocultarModalCargando
} 
from "../../../Redux/Controladores/controladorModal"

// redux producto
import { 
    Producto , 
    stateReduxProducto ,
    ReduxProducto_limpiarProductoBD ,
    ReduxProducto_setProductoBD_como_ProductoActual ,
    ReduxProducto_setSeccionActual ,
    ReduxProducto_setProductoBD
} from "../../../Redux/Controladores/controladorProducto"


import { AppDispatch } from "../../../Redux/store"

// Clase Utilerias
import Utilerias from '../../../Models/Utilerias'

// css
import "./PaginaAlmacenProductosMovil.css"





//=====================================================
//  INTERFACES
//=====================================================
interface Props 
{
    navigate: NavigateFunction ,
    stateReduxPaginacion: stateReduxPaginacion ,
    stateReduxModal: stateReduxModal ,
    stateReduxProducto: stateReduxProducto
    dispatchRedux: AppDispatch
}

interface State 
{
    listaProductos: Producto[] ,

    modalMensaje_visible: boolean ,
    modalMensaje_tipo: number ,
    modalMensaje_titulo: string ,
    modalMensaje_descripcion: string ,

    modalImagen_visible: boolean ,
    modalImagen_headerVisible: boolean ,
    modalImagen_imagen: string
}






//=====================================================
//  DEFINCION DEL COMPONENTE
//=====================================================
export default class PaginaAlmacenProductos extends React.Component<Props , State>
{
    itemsMenuPrincipal: Item[]
    itemsMenuOpciones: Item[]

    totalProductos: number
    productosXpagina: number

    modalMensaje_handleClick_botonAceptar: Function = () => {}
    modalMensaje_handleClick_botonNO: Function = () => {}
    modalMensaje_handleClick_botonSI: Function = () => {}





    constructor(props: Props)
    {
        super(props)

        /*============================
            INICIALIZACION DE PROPIEDADES
        ==============================*/
        this.totalProductos = 0
        this.productosXpagina = 4

        this.itemsMenuPrincipal = 
        [
            {
                texto: "Novedades" , 
                icono: faHome ,
                accion: () => alert("/")
            } ,
            {
                texto: "Ventas Locales" , 
                icono: faClipboardList ,
                accion: () => alert("/ventas-locales")
            } ,
            {
                texto: "Mis Productos" , 
                icono: faBoxes ,
                accion: () => alert("/lista-mis-productos")
            } ,
            {
                texto: "Proovedores" , 
                icono: faDolly ,
                accion: () => alert("/proveedores")
            }
        ]

        this.itemsMenuOpciones = [
            {
                texto: "Lista de mis Productos" ,
                icono: faListUl ,
                accion: () => alert("/lista-mis-productos")
            } ,
            {
                texto: "Filtrar Productos" , 
                icono: faFilter ,
                accion: () => alert("mostrar menu lateral de filtro")
            } ,
            {
                texto: "Agregar Producto" , 
                icono: faPlus ,
                accion: () => 
                {
                    this.props.dispatchRedux( ReduxProducto_limpiarProductoBD() )
                    this.props.dispatchRedux( ReduxProducto_setProductoBD_como_ProductoActual() )
                    this.props.dispatchRedux( ReduxProducto_setSeccionActual(1) )
                    this.props.navigate( '/Producto' )
                }
            }
        ]


        /*============================
            INICIALIZACION DEL ESTADO
        ==============================*/
        this.state = 
        {
            listaProductos: [] ,

            modalMensaje_visible: false ,
            modalMensaje_tipo: MENSAJE_CORRECTO ,
            modalMensaje_titulo: "" ,
            modalMensaje_descripcion: "" ,

            modalImagen_visible: false ,
            modalImagen_headerVisible: true ,
            modalImagen_imagen: ""
        }


        /*============================
            ESTABLECER QUE QUEREMOS LA PAGINA 1
        ==============================*/
        this.props.dispatchRedux( setPaginaActual( 1 ) )
    }



    componentDidMount()
    {
        // OBTENER LOS PRODUCTOS
        this.getProductos( 1 )
    }

 












    /*===============================================================================
                        OPERACIONES EN LA BASE DE DATOS
    =================================================================================*/
    getProductos( pagina: number )
    {
        this.props.dispatchRedux( mostrarModalCargando( "Obteniendo productos ..." ) )
        setTimeout( async () => 
        {
            let respuesta = await Utilerias.postHTTP( "api/negocios/productos/listaProductos" , [
                { nombreCampo: "productosXpagina" , valor: this.productosXpagina + "" } ,
                { nombreCampo: "pagina" , valor: pagina + "" }
            ] )
            console.log( respuesta )

            if( respuesta.existeError ) 
            {  
                // ERROR AL OBTENER PRODUCTOS
                this.props.dispatchRedux( ocultarModalCargando() )
                this.mostrar_modalMensajeError( 
                    respuesta.titulo , 
                    respuesta.descripcion ,
                    () => { this.ocultar_modalMensaje() } 
                )
                return
            }
            
            // PRODUCTOS OBTENIDOS
            let query: {
                id: string ,
                nombre: string ,
                marca: string ,
                imagenes_base64: string[] ,
                imagenes_tipo: string[] ,
                dimension: number ,
                dimensionTipo: string
            }[] = []
            query = respuesta.datos.listaProductos

            let productosBD: Producto[] = [] 
            query.forEach( (producto) => { 
                productosBD.push({
                    id: producto.id ,
                    nombre: producto.nombre ,
                    marca_nombre: producto.marca ,
                    imagenes_base64: producto.imagenes_base64 ,
                    imagenes_tipo: producto.imagenes_tipo ,
                    dimension: producto.dimension ,
                    dimension_tipo: producto.dimensionTipo
                })
            })

            this.totalProductos = respuesta.datos.totalProductos 
            this.setState( (STATE , PROPS) => { return {
                listaProductos: productosBD
            }})

            this.props.dispatchRedux( ocultarModalCargando() )
        } , 900 )
    }


    getProducto( id: string )
    {
        this.props.dispatchRedux( mostrarModalCargando( "Espere un momento ..." ) )
        setTimeout( async () => 
        {
            let respuesta = await Utilerias.postHTTP( "api/negocios/productos/getProductoByID" , [
                { nombreCampo: "id_producto" , valor: id }
            ] )
            console.log( respuesta )

            if( respuesta.existeError ) 
            {  
                // ERROR AL OBTENER PRODUCTO
                this.props.dispatchRedux( ocultarModalCargando() )
                this.mostrar_modalMensajeError( 
                    respuesta.titulo , 
                    respuesta.descripcion ,
                    () => { this.ocultar_modalMensaje() } 
                )
                return
            }
            
            // PRODUCTO OBTENIDO
            let producto: Producto = {} 
            try{ 
                producto = respuesta.datos
            }
            catch( ERROR ) {
                // ERROR AL RECEPTAR REGISTRO PRODUCTO
                this.props.dispatchRedux( ocultarModalCargando() )
                this.mostrar_modalMensajeError( 
                    respuesta.titulo , 
                    respuesta.descripcion ,
                    () => { this.ocultar_modalMensaje() } 
                )
                console.log( ERROR )
                return
            }

            this.props.dispatchRedux( ReduxProducto_setProductoBD({
                id: producto.id!! ,
                nombre: producto.nombre!! ,
                descripcion: producto.descripcion!! ,
                codigo_barras: producto.codigo_barras!! ,
                precio: producto.precio!! ,

                marca_id: producto.marca_id!! ,
                marca_nombre: producto.marca_nombre!! ,
                marca_imagen: producto.marca_imagen!! ,
                marca_imagenTipo: producto.marca_imagenTipo!! ,

                categoria_id: producto.categoria_id!! ,
                categoria_nombre: producto.categoria_nombre!! ,
                categoria_imagen: producto.categoria_imagen!! ,
                categoria_imagenTipo: producto.categoria_imagenTipo!! ,
                categoria_ubicacion: producto.categoria_ubicacion!! ,

                dimension: producto.dimension!! ,
                dimension_tipo: producto.dimension_tipo!! ,

                imagenes_base64: producto.imagenes_base64!! ,
                imagenes_tipo: producto.imagenes_tipo!!
            }))

            this.props.dispatchRedux( ReduxProducto_setProductoBD_como_ProductoActual() )
            this.props.dispatchRedux( ReduxProducto_setSeccionActual( 1 ) )
            this.props.dispatchRedux( ocultarModalCargando() )
            this.props.navigate( '/Producto' )
        } , 900 )
    }













    //=================================================================================
    //              FUNCIONALIDADES DEL MODAL IMAGEN
    //=================================================================================
    modalImagen_accionX() {  this.ocultarModalImagen()  }


    modalImagen_accionClickImagen() {
        this.setState( (STATE, PROPS) => { return {
            modalImagen_headerVisible: !STATE.modalImagen_headerVisible
        }})
    }


    ocultarModalImagen() {
        this.setState( (STATE, PROPS) => { return {
            modalImagen_visible: false ,
            modalImagen_headerVisible: true ,
            modalImagen_imagen: ""
        }})
    }


    mostrarModalImagen( imagenBase64: string ) {
        this.setState( (STATE , PROPS) => {  return {
            modalImagen_visible: true ,
            modalImagen_imagen: imagenBase64
        }})
    }


















    //=====================================================================
    //              HANDLES DEL MODAL MENSAJE
    //=====================================================================
    mostrar_modalMensajeCorrecto( titulo: string , descripcion: string , handleClick_botonAceptar: Function )
    {
        this.modalMensaje_handleClick_botonAceptar = handleClick_botonAceptar
        this.setState( (STATE , PROPS) => { return {
            modalMensaje_visible: true ,
            modalMensaje_tipo: MENSAJE_CORRECTO ,
            modalMensaje_titulo: titulo ,
            modalMensaje_descripcion: descripcion
        }})
    }

    mostrar_modalMensajeError( titulo: string , descripcion: string , handleClick_botonAceptar: Function )
    {
        this.modalMensaje_handleClick_botonAceptar = handleClick_botonAceptar
        this.setState( (STATE , PROPS) => { return {
            modalMensaje_visible: true ,
            modalMensaje_tipo: MENSAJE_ERROR ,
            modalMensaje_titulo: titulo ,
            modalMensaje_descripcion: descripcion
        }})
    }

    mostrar_modalMensajePregunta( titulo: string , descripcion: string ,
        handleClick_botonNO: Function , handleClick_botonSI: Function )
    {
        this.modalMensaje_handleClick_botonNO = handleClick_botonNO
        this.modalMensaje_handleClick_botonSI = handleClick_botonSI
        this.setState( (STATE , PROPS) => { return {
            modalMensaje_visible: true ,
            modalMensaje_tipo: MENSAJE_PREGUNTA ,
            modalMensaje_titulo: titulo ,
            modalMensaje_descripcion: descripcion
        }})
    }

    ocultar_modalMensaje()
    {
        this.setState( (STATE , PROPS) => { return {
            modalMensaje_visible: false
        }})
    }



















    /*===========================================================================
                        COMPONENTES INDIVIDUALES HTML
    =============================================================================*/
    addContenedorTarjetas()
    {
        if( this.totalProductos == 0 )  return null
        return (
        <div  className='contenedorTarjetas'>
        {
            this.state.listaProductos.map( ( producto , index ) => {  return (
                <TarjetaProducto  
                    producto={producto}  
                    key={ "tarjetaProducto-" + index }
                    handleClick_botonVer={ this.getProducto.bind( this ) }
                    handleClick_imagen={ this.mostrarModalImagen.bind( this ) }
                />
            )})
        }
        </div>
        )
    }


    addPaginacion()
    {
        let paginas = Math.ceil( this.totalProductos / this.productosXpagina )
        if( paginas > 1 ) return(
            <Paginacion 
                totalPaginas={ paginas }
                PaginasPorGrupo={ 4 }
                stateRedux={ this.props.stateReduxPaginacion }
                dispatchRedux={ this.props.dispatchRedux }
                handleClick_botonPagina={ this.getProductos.bind(this) }
            />
        )
    } 


    addDivResultado()
    {
        let visible = false
        if( this.totalProductos == 0 ) visible = true
        return (
        <DivResultado
            visible={ visible }
            icono={ faSearch }
            texto="No se encontro ningun producto"
        /> )
    }












    /*===========================================================================
                                DEFINICION DEL HTML
    =============================================================================*/
    render() 
    {
    
    return(
        <main className='contenedorPagina' >
            <Encabezado  
                { ...this.props } 
                habilitar_BotonRegresar={ false }
                habilitar_MenuPrincipal={ true }
                habilitar_MenuOpciones={ true }
                titulo="Papeleria Geraldine Papeleria Geraldine" 
                tituloTooltip="Nombre de tu Negocio"
                itemsMenuPrincipal={ this.itemsMenuPrincipal } 
                itemsMenuOpciones={ this.itemsMenuOpciones }
                itemMenuP_seleccionado={  "Mis Productos" }
                itemMenuOp_seleccionado={ "Lista de mis Productos" }
                botonRegresar_URL=''
            />

            { /*==============================
                CONTENEDOR DE LOS PRODUCTOS
            ==================================*/}
            { this.addContenedorTarjetas() }


            { /*==============================
                CONTENEDOR DE PAGINAS
            ==================================*/}
            { this.addPaginacion() }

            
            { /*==============================
                TEXTO QUE INDICA SI HAY O NO HAY
                PRODUCTOS
            ==================================*/}
            { this.addDivResultado() }



            { /*==============================
                MODAL MENSAJE
            ==================================*/}
            <ModalMensaje 
                titulo={ this.state.modalMensaje_titulo }
                descripcion={ this.state.modalMensaje_descripcion }
                tipo={ this.state.modalMensaje_tipo }
                modalVisible={ this.state.modalMensaje_visible }
                
                handleClick_botonAceptar={ this.modalMensaje_handleClick_botonAceptar.bind( this ) }
                handleClick_botonNO={ this.modalMensaje_handleClick_botonNO.bind( this ) }
                handleClick_botonSI={ this.modalMensaje_handleClick_botonSI.bind( this ) }
            />


            {/*==========================================
                MODAL QUE MUESTRA UNA IMAGEN SELECCIONADA
            =============================================*/}
            <ModalImagen
                modalVisible={ this.state.modalImagen_visible }
                botonEliminarVisible={ false }
                imagenURL={ this.state.modalImagen_imagen }
                accionX={ this.modalImagen_accionX.bind(this)  }
                accionEliminar={ ()=>{} }
                accionClickImagen={ this.modalImagen_accionClickImagen.bind(this) }
                headerVisible={ this.state.modalImagen_headerVisible }
            />
            
        </main>
    )}
}

