
//=====================================================
//  IMPORTACIONES GENERALES
//=====================================================
import React from 'react'
import { NavigateFunction } from 'react-router-dom'

// componentes MUI
import { 
    Button ,
    IconButton ,
    TextField ,
    Select ,
    MenuItem
} from "@mui/material"

// carrusel Swiper
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"

// clase Swiper
import SwiperClass from "swiper/types/swiper-class"

// Modulos Swiper
import SwiperCore , { Pagination , Navigation , EffectCreative } from 'swiper'
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/effect-creative"

// iconos
import { 
    faClipboardList , 
    faListUl , 
    faPlus ,    // +
    faEllipsisH ,    //  =>  ...
    faBarcode ,     // codigo de barras
    faDollarSign ,   // => $
    faExclamationTriangle ,   // advertencia ,
    faBroom ,   // brocha
    faPencilAlt , // lapiz (editar)
    faTrash ,  // basurero (eliminar)
    faImage // imagen

} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// mis componentes
import Encabezado , { Item } from '../../../Components/Encabezado/Encabezado'
import ModalImagen from '../../../Components/ModalImagen/ModalImagen'
import TextFieldNumerico from '../../../Components/TextFieldNumerico/TextFieldNumerico'
import ModalMensaje , { 
    MENSAJE_CORRECTO ,
    MENSAJE_ERROR ,
    MENSAJE_PREGUNTA
} from '../../../Components/ModalMensaje/ModalMensaje'

import 
    TextFieldConSugerencias , 
    { TextoSugerencia }
from '../../../Components/TextFieldConSugerencias/TextFieldConSugerencias'

import 
    ElementoConTooltip , 
    { classElementoConTooltip }
from '../../../Components/ElementoConTooltip/ElementoConTooltip'

/*________________
REDUX PAGINACION
__________________ */
import { 
    stateReduxPaginacion , 
    setPaginaActual 
} from "../../../Redux/Controladores/controladorPaginacion"

/*________________
REDUX MODAL
__________________ */
import { 
    stateReduxModal , 
    mostrarModalCargando ,
    ocultarModalCargando
} from "../../../Redux/Controladores/controladorModal"

/*________________
REDUX PRODUCTO
__________________ */
import { 
    stateReduxProducto , 
    Producto ,
    ReduxProducto_setSeccionActual ,
    ReduxProducto_setProductoBD_como_ProductoActual ,
    ReduxProducto_setProductoActual ,
    ReduxProducto_limpiarProductoBD ,
    ReduxProducto_setProductoBD ,
    ReduxProducto_setMarcaActual ,
    ReduxProducto_setCategoriaActual
} from '../../../Redux/Controladores/controladorProducto'

/*________________
REDUX <<STORE>>
__________________ */
import { AppDispatch } from "../../../Redux/store"

// models
import Utilerias from "../../../Models/Utilerias"

// css
import "../../../CSS/TextField/TextField_E1.css"
import "../../../CSS/Combo/Combo_E1.css"
import cssDimension from "./dimension.module.css"
import "./marca.css"
import "./seccion2.css"
import "./seccion3.css"
import "./PaginaProductoMovil.css"











//===========================================================================
//                          INTERFACES
//===========================================================================
interface Props 
{
    navigate: NavigateFunction ,
    stateReduxPaginacion: stateReduxPaginacion ,
    stateReduxModal: stateReduxModal ,
    stateReduxProducto: stateReduxProducto ,
    dispatchRedux: AppDispatch
}

interface State extends Producto
{
    // sugerencias del autoacompletado Nombre
    opcionesInputNombre: TextoSugerencia[] ,


    // MODAL QUE MUESTRA UNA IMAGEN SELECCIONADA
    modalImagen_visible: boolean ,
    modalImagen_imagen: string ,
    modalImagen_imagenIndex: number ,
    modalImagen_headerVisible: boolean ,


    inputDimensionPE: string ,      // ejemplo: 12,000
    inputDimensionPD: string ,      // ejemplo: 50


    inputPrecioPE: string ,
    inputPrecioPD: string


    // ========= MODAL MENSAJE ==============
    modalMensaje_visible: boolean ,
    modalMensaje_titulo: string ,
    modalMensaje_descripcion: string ,
    modalMensaje_tipo: number ,

    // ========= ERRORES FORMULARIO ==========
    error_nombre: JSX.Element | null ,
    error_dimension: JSX.Element | null ,
    error_codigoBarras: JSX.Element | null ,
    error_precio: JSX.Element | null
}












//=====================================================
//  DEFINCION DEL COMPONENTE
//=====================================================
export default class PaginaProducto extends React.Component<Props , State>
{
    //___________________________
    //  PROPIEDADES
    //___________________________
    carruselContenedorPagina: SwiperClass | null
    carruselImagenes: SwiperClass | null
    menuOpciones: Item[] = []

    modalMensaje_handleClick_botonAceptar: Function = () => {}
    modalMensaje_handleClick_botonNO: Function = () => {}
    modalMensaje_handleClick_botonSI: Function = () => {}
    




    constructor(props: Props)
    {
        super(props)

        /*============================
            INICIALIZACION DEL ESTADO
        ==============================*/
        this.state = 
        {
            opcionesInputNombre: [] ,

            modalImagen_visible: false ,
            modalImagen_imagen: '' ,
            modalImagen_imagenIndex: -1 ,
            modalImagen_headerVisible: true  ,

            inputDimensionPE: "" ,
            inputDimensionPD: "" ,

            inputPrecioPE: "" ,
            inputPrecioPD: "" ,

            // DATOS DEL PRODUCTO
            id: "" ,
            id_negocio: "" ,
            nombre: "" ,
            descripcion: "" ,
            precio: 0 ,
            codigo_barras: "" ,
            imagenes_base64: [] ,
            imagenes_tipo: [] ,
            dimension: 0 ,
            dimension_tipo: "" ,

            // ========= MODAL MENSAJE ==============
            modalMensaje_visible: false ,
            modalMensaje_titulo: "" ,
            modalMensaje_descripcion: "" ,
            modalMensaje_tipo: MENSAJE_CORRECTO ,

            // ========= MODAL MENSAJE ==============
            error_nombre: null ,
            error_dimension: null ,
            error_codigoBarras: null ,
            error_precio: null
        }


        /*============================
            INICIALIZACION DE PROPIEDADES
        ==============================*/
        this.carruselContenedorPagina = null
        this.carruselImagenes = null
    }













    /*================================================================================
                        FUNCIONALIDAD AL CREAR LA PAGINA
    ==================================================================================*/
    componentDidMount() 
    {
        /*==================================
        TRANSFERIR LOS DATOS DEL PRODUCTO 
        SELECCIONADO COMO VALORES INICIALES
        ====================================*/
        this.props.dispatchRedux( mostrarModalCargando( "Espere un momento..." ) )
        setTimeout( async () => 
        {
            // MENU DE OPCIONES

            //_______________
            // ITEM RESTABLECER
            //_______________
            this.menuOpciones.push({
                icono: faBroom ,
                texto: "Restablecer" ,
                accion: () => 
                {
                    this.restablecerFormulario()
                }
            })


            /*___________________
                ITEM GUARDAR
            _____________________*/
            if( this.props.stateReduxProducto.actual.id!! == "" ) 
            { 
                this.menuOpciones.push({
                    icono: faPlus ,
                    texto: "Guardar" ,
                    accion: () => 
                    {
                        if( this.formularioValido() ) 
                        {
                            let existeMarca = true
                            let existeCategoria = true
                            let existeDescripcion = true
                            let existeImagenes = true
        
                            // VERIFICAR CAMPOS NO REQUERIDOS
                            if( this.props.stateReduxProducto.actual.marca_id!! == "" ) 
                                existeMarca = false
                            
                            if( this.props.stateReduxProducto.actual.categoria_id!! == "" ) 
                                existeCategoria = false
                            
                            let descripcion = Utilerias.corregirTexto_quitarEspaciosEnBlanco( 
                                this.state.descripcion!! 
                            )
                            if( descripcion == "" ) existeDescripcion = false

                            if( this.state.imagenes_base64!!.length == 0 ) existeImagenes = false
        
                            if( existeMarca && existeCategoria && 
                                existeDescripcion && existeImagenes 
                            ) {
                                this.mostrar_modalMensajePregunta(
                                    "Desea guardar este nuevo producto?" ,
                                    "" ,
                                    () => { this.ocultar_modalMensaje() } ,
                                    () => { 
                                        this.ocultar_modalMensaje() 
                                        this.insertarProducto()
                                    }
                                )
                            }
                            else {
                                let mensaje = ""
                                if( !existeMarca ) 
                                    mensaje += "La marca del producto.\n\n"
                                if( !existeCategoria ) 
                                    mensaje += "La categoria del producto.\n\n"
                                if( !existeDescripcion ) 
                                    mensaje += "La descripcion o detalle del producto.\n\n"
                                if( !existeImagenes ) 
                                    mensaje += "Las imagenes del producto.\n\n"
                                mensaje = mensaje.substring( 0 , mensaje.length - 2 )
        
                                this.mostrar_modalMensajePregunta(
                                    "Los siguientes datos NO estan establecidos. ¿Desea Continuar?" ,
                                    mensaje ,
                                    () => { this.ocultar_modalMensaje() } ,
                                    () => { 
                                        this.ocultar_modalMensaje() 
                                        this.insertarProducto()
                                    }
                                )
                            }
                        }
                    } // fin accion
                })
            }


            /*________________________
                ITEM GUARDAR CAMBIOS
            __________________________*/
            if( this.props.stateReduxProducto.actual.id!! != "" ) 
            { 
                this.menuOpciones.push({
                    icono: faPencilAlt ,
                    texto: "Guardar Cambios" ,
                    accion: () => 
                    {
                        if( this.formularioValido() ) 
                        {
                            let existeMarca = true
                            let existeCategoria = true
                            let existeDescripcion = true
                            let existeImagenes = true
        
                            // VERIFICAR CAMPOS NO REQUERIDOS
                            if( this.props.stateReduxProducto.actual.marca_id!! == "" ) 
                                existeMarca = false
                            
                            if( this.props.stateReduxProducto.actual.categoria_id!! == "" ) 
                                existeCategoria = false
                            
                            let descripcion = Utilerias.corregirTexto_quitarEspaciosEnBlanco( 
                                this.state.descripcion!! 
                            )
                            if( descripcion == "" ) existeDescripcion = false

                            if( this.state.imagenes_base64!!.length == 0 ) existeImagenes = false
        
                            if( existeMarca && existeCategoria && 
                                existeDescripcion && existeImagenes 
                            ) {
                                this.mostrar_modalMensajePregunta(
                                    "Desea guardar los cambios del producto?" ,
                                    "" ,
                                    () => { this.ocultar_modalMensaje() } ,
                                    () => { 
                                        this.ocultar_modalMensaje() 
                                        this.actualizarProducto()
                                    }
                                )
                            }
                            else {
                                let mensaje = ""
                                if( !existeMarca ) 
                                    mensaje += "La marca del producto.\n\n"
                                if( !existeCategoria ) 
                                    mensaje += "La categoria del producto.\n\n"
                                if( !existeDescripcion ) 
                                    mensaje += "La descripcion o detalle del producto.\n\n"
                                if( !existeImagenes ) 
                                    mensaje += "Las imagenes del producto.\n\n"
                                mensaje = mensaje.substring( 0 , mensaje.length - 2 )
        
                                this.mostrar_modalMensajePregunta(
                                    "Los siguientes datos NO estan establecidos. ¿Desea Continuar?" ,
                                    mensaje ,
                                    () => { this.ocultar_modalMensaje() } ,
                                    () => { 
                                        this.ocultar_modalMensaje() 
                                        this.actualizarProducto()
                                    }
                                )
                            }
                        }
                    } // fin accion
                })
            }


            /*________________________
                ITEM ELIMINAR
            __________________________*/
            if( this.props.stateReduxProducto.actual.id!! != "" ) 
            { 
                this.menuOpciones.push({
                    icono: faTrash ,
                    texto: "Eliminar" ,
                    accion: () => 
                    {
                        this.mostrar_modalMensajePregunta(
                            "Desea eliminar este producto de su inventario?" ,
                            "" ,
                            () => { this.ocultar_modalMensaje() } ,
                            () => { 
                                this.ocultar_modalMensaje() 
                                this.eliminarProducto()
                            }
                        )
                    }
                })
            }

    


            this.setState( (STATE , PROPS) => {  return {
                id: this.props.stateReduxProducto.actual.id ,
                id_negocio: this.props.stateReduxProducto.actual.id_negocio ,
                nombre: this.props.stateReduxProducto.actual.nombre ,
                descripcion: this.props.stateReduxProducto.actual.descripcion ,
                precio: this.props.stateReduxProducto.actual.precio ,
                codigo_barras: this.props.stateReduxProducto.actual.codigo_barras ,
                imagenes_base64: this.props.stateReduxProducto.actual.imagenes_base64 ,
                imagenes_tipo: this.props.stateReduxProducto.actual.imagenes_tipo ,
                dimension: this.props.stateReduxProducto.actual.dimension ,
                dimension_tipo: this.props.stateReduxProducto.actual.dimension_tipo
            }})

            this.cargarDimension( this.props.stateReduxProducto.actual.dimension!! )
            this.cargarPrecio( this.props.stateReduxProducto.actual.precio!! )

            try {
                let nombresProductos = await this.getNombresDeProductos()
                this.setState( (STATE , PROPS) => { return {
                    opcionesInputNombre: nombresProductos
                }})
            }
            catch( ERROR ){  alert( "ERROR AL MONTAR COMPONENTE:\n" + ERROR ) }

            this.props.dispatchRedux( ocultarModalCargando() )
        } , 1200 )
    }







    /*================================================================================
                        FUNCIONALIDADES
    ==================================================================================*/
    restablecerFormulario()
    {
        this.props.dispatchRedux( mostrarModalCargando( "Espere un momento..." ) )
        setTimeout( async () => 
        {
            this.props.dispatchRedux( ReduxProducto_setProductoBD_como_ProductoActual() )

            this.setState( (STATE , PROPS) => {  return {
                id: this.props.stateReduxProducto.productoBD.id ,
                id_negocio: this.props.stateReduxProducto.productoBD.id_negocio ,
                nombre: this.props.stateReduxProducto.productoBD.nombre ,
                descripcion: this.props.stateReduxProducto.productoBD.descripcion ,
                precio: this.props.stateReduxProducto.productoBD.precio ,
                codigo_barras: this.props.stateReduxProducto.productoBD.codigo_barras ,
                imagenes_base64: this.props.stateReduxProducto.productoBD.imagenes_base64 ,
                imagenes_tipo: this.props.stateReduxProducto.productoBD.imagenes_tipo ,
                dimension: this.props.stateReduxProducto.productoBD.dimension ,
                dimension_tipo: this.props.stateReduxProducto.productoBD.dimension_tipo
            }})

            this.cargarDimension( this.props.stateReduxProducto.productoBD.dimension!! )
            this.cargarPrecio( this.props.stateReduxProducto.productoBD.precio!! )

            this.props.dispatchRedux( ocultarModalCargando() )
        } , 1200 )
    }


    cargarDimension( dimension: number )
    {
        let PE = ""
        let PD = ""
        let dimensionString = dimension + ""
        if( dimension > 0  ) {
            if( dimensionString.indexOf( '.' ) == -1 ) {
                // SOLO PARTE ENTERA
                PE = Utilerias.getNumeroConComas( dimensionString )
            }
            else {
                let partesDimension = dimensionString.split( '.' )
                PE = Utilerias.getNumeroConComas( partesDimension[0] )
                if( partesDimension[1].length == 1 ) PD = partesDimension[1] + "0"
                else PD = partesDimension[1].substring( 0 , 2)
            }
        }

        this.setState( (STATE , PROPS) => { return {
            inputDimensionPE: PE ,
            inputDimensionPD: PD
        }})
    }


    cargarPrecio( precio: number )
    {
        let PE = ""
        let PD = ""
        let precioString = precio + ""
        if( precio > 0  ) {
            if( precioString.indexOf( '.' ) == -1 ) {
                // SOLO PARTE ENTERA
                PE = Utilerias.getNumeroConComas( precioString )
            }
            else {
                let partesPrecio = precioString.split( '.' )
                PE = Utilerias.getNumeroConComas( partesPrecio[0] )
                if( partesPrecio[1].length == 1 ) PD = partesPrecio[1] + "0"
                else PD = partesPrecio[1].substring( 0 , 2)
            }
        }

        this.setState( (STATE , PROPS) => { return {
            inputPrecioPE: PE ,
            inputPrecioPD: PD
        }})
    }


    formularioValido()
    {
        // VERFICIAR SI NOMBRE ES VACIO
        let nombre = Utilerias.corregirTexto_quitarEspaciosEnBlanco( this.state.nombre!! )
        if( nombre == "" )
        {
            nombre = this.props.stateReduxProducto.productoBD.nombre!!
            if( nombre == "" ) {
                this.setState( (STATE , PROPS) => { return {
                    error_nombre: this.crearTextoError( "El nombre del producto NO debe estar vacio" )
                }})
                this.mostrar_modalMensajeError(
                    "Datos Incorrectos" ,
                    "El Nombre del producto NO esta establecido" ,
                    () => { this.ocultar_modalMensaje() }
                )
                return false
            }
        }

        // VERIFICAR SI NOMBRE CONTIENE CARACTERES INVALIDOS
        let caracteresNombre = "abcdefghijklmnñopqrstuvwxyz áéíóú äëïöü"
        for( let c=0;  c<nombre.length;  c++) 
        {
            let caracter = nombre.charAt(c)
            if( caracteresNombre.indexOf( caracter.toLowerCase() ) == -1 ) 
            {
                this.setState( (STATE , PROPS) => { return {
                    error_nombre: this.crearTextoError( 
                        "El nombre del producto solo debe tener letras o espacios" 
                    )
                }})
                this.mostrar_modalMensajeError(
                    "Datos Incorrectos" ,
                    "El Nombre del producto NO es valido" ,
                    () => { this.ocultar_modalMensaje() }
                )
                return false
            }
        }

        // VERIFICAR DIMENSION
        if( this.state.dimension_tipo!! != "N/A" && this.state.dimension!! == 0 )
        {
            this.setState( (STATE , PROPS) => { return {
                error_dimension: this.crearTextoError( 
                    "La dimension NO debe ser 0" 
                )
            }})
            this.mostrar_modalMensajeError(
                "Datos Incorrectos" ,
                "La dimension del producto NO debe ser 0" ,
                () => { this.ocultar_modalMensaje() }
            )
            return false
        }

        // VERFICIAR SI CODIGO DE BARRAS ES VACIO
        let codigoBarras = this.state.codigo_barras!!
        if( codigoBarras == "" )
        {
            codigoBarras = this.props.stateReduxProducto.productoBD.codigo_barras!!
            if( codigoBarras == "" ) {
                this.setState( (STATE , PROPS) => { return {
                    error_codigoBarras: this.crearTextoError( 
                        "El codigo de barras NO debe estar vacio" 
                    )
                }})
                this.mostrar_modalMensajeError(
                    "Datos Incorrectos" ,
                    "El Codigo de barras del producto NO esta establecido" ,
                    () => { this.ocultar_modalMensaje() }
                )
                return false
            }
        }

        // VERIFICAR SI CODIGO DE BARRAS CONTIENE CARACTERES INVALIDOS
        let caracteresCodigoBarras = "abcdefghijklmnñopqrstuvwxyz0123456789"
        for( let c=0;  c<codigoBarras.length;  c++) 
        {
            let caracter = codigoBarras.charAt(c)
            if( caracteresCodigoBarras.indexOf( caracter.toLowerCase() ) == -1 ) 
            {
                this.setState( (STATE , PROPS) => { return {
                    error_codigoBarras: this.crearTextoError( 
                        "El codigo de barras solo acepta letras y digitos" 
                    )
                }})
                this.mostrar_modalMensajeError(
                    "Datos Incorrectos" ,
                    "El codigo de barras del producto NO es valido" ,
                    () => { this.ocultar_modalMensaje() }
                )
                return false
            }
        }

        // VALIDAR PRECIO
        if( this.state.precio!! == 0 ) 
        {
            this.setState( (STATE , PROPS) => { return {
                error_precio: this.crearTextoError( 
                    "El precio NO debe ser 0" 
                )
            }})
            this.mostrar_modalMensajeError(
                "Datos Incorrectos" ,
                "El precio de venta del producto NO debe ser 0" ,
                () => { this.ocultar_modalMensaje() }
            )
            return false
        }

        return true
    }















    //==========================================================================
    //                     OPERACIONES A LA BASE DE DATOS
    //===========================================================================
    async getNombresDeProductos( )
    {
        let respuesta = await Utilerias.postHTTP( "api/negocios/productos/getNombresProductos" , [] )
        console.log( respuesta )

        if( respuesta.existeError )  return []
            
        // NOMBRES DE PRODUCTOS OBTENIDOS
        let listaNombresBD: string[] = respuesta.datos
        let listaNombresSugerencia: TextoSugerencia[] = []
        listaNombresBD.forEach( (nombre , index) => {
            listaNombresSugerencia.push({
                label: nombre ,
                key: "PaginaProducto-inputNombre-Opcion" + index ,
                categoria: nombre.charAt( 0 ).toUpperCase()
            })
        })
        return listaNombresSugerencia
    }


    insertarProducto()
    {
        this.props.dispatchRedux( mostrarModalCargando( "Agregando Producto ..." ) )
        setTimeout( async () => 
        {
            // OBTENER LOS DATOS
            // IMAGENES
            let imagenes = this.state.imagenes_base64!!
            let imagenesTipo = this.state.imagenes_tipo!!

            // NOMBRE
            let nombre = Utilerias.corregirTexto_quitarEspaciosEnBlanco( this.state.nombre!! )
            if( nombre == "" ) nombre = this.props.stateReduxProducto.productoBD.nombre!!
                
            // MARCA
            let id_marca = this.props.stateReduxProducto.actual.marca_id!!

            // DIMENSION
            let dimension = this.getDimension( 
                this.state.inputDimensionPE , 
                this.state.inputDimensionPD
            )
            if( this.state.dimension_tipo!! == "N/A" ) dimension = 0

            // TIPO DIMENSION
            let tipoDimension = this.state.dimension_tipo!!

            // CATEGORIA
            let id_categoria = this.props.stateReduxProducto.actual.categoria_id!!

            // CODIGO DE BARRAS
            let codigoBarras = this.state.codigo_barras!!
            if( codigoBarras == "" ) codigoBarras = this.props.stateReduxProducto.productoBD.codigo_barras!!

            // PRECIO
            let precio = this.getPrecio( this.state.inputPrecioPE , this.state.inputPrecioPD )

            // DESCRIPCION
            let descripcion = Utilerias.corregirTexto_quitarEspaciosEnBlanco( this.state.descripcion!! )

            // ENVIO DE DATOS
            let respuesta = await Utilerias.postHTTP( "api/negocios/productos/insertar" , 
            [
                { nombreCampo: "id_negocio" , valor: "N/A" } ,
                { nombreCampo: "nombre" , valor: nombre } ,
                { nombreCampo: "codigo_de_barras" , valor: codigoBarras } ,
                { nombreCampo: "descripcion" , valor: descripcion } ,
                { nombreCampo: "id_marca" , valor: id_marca } ,
                { nombreCampo: "id_categoria" , valor: id_categoria } ,
                { nombreCampo: "imagenes_base64" , valor: JSON.stringify(imagenes) } ,
                { nombreCampo: "imagenes_tipo" , valor: JSON.stringify(imagenesTipo) } ,
                { nombreCampo: "dimension" , valor: dimension + "" } ,
                { nombreCampo: "dimension_tipo" , valor: tipoDimension } ,
                { nombreCampo: "precio" , valor: precio + "" }
            ])
            console.log( respuesta )


            if( respuesta.existeError ) 
            {  
                // ERROR AL INSERTAR PRODUCTO
                this.props.dispatchRedux( ocultarModalCargando() )
                this.mostrar_modalMensajeError( 
                    respuesta.titulo , 
                    respuesta.descripcion ,
                    () => { this.ocultar_modalMensaje() } 
                )
                return
            } 
            
            // PRODUCTO ALMACENADO
            this.props.dispatchRedux( ocultarModalCargando() )
            this.mostrar_modalMensajeCorrecto( 
                respuesta.titulo , 
                respuesta.descripcion ,
                () => {
                    this.ocultar_modalMensaje()
                    this.props.dispatchRedux( ReduxProducto_limpiarProductoBD() )
                    this.restablecerFormulario()
                    this.props.dispatchRedux( ReduxProducto_setSeccionActual( 1 ) )
                }
            )
        } , 900 )
    }


    actualizarProducto()
    {
        this.props.dispatchRedux( mostrarModalCargando( "Actualizando Producto ..." ) )
        setTimeout( async () => 
        {
            // IMAGENES
            let imagenes = this.state.imagenes_base64!!
            let imagenesTipo = this.state.imagenes_tipo!!

            // NOMBRE
            let nombre = Utilerias.corregirTexto_quitarEspaciosEnBlanco( this.state.nombre!! )
            if( nombre == "" ) nombre = this.props.stateReduxProducto.productoBD.nombre!!
                
            // MARCA
            let id_marca = this.props.stateReduxProducto.actual.marca_id!!

            // DIMENSION
            let dimension = this.getDimension( 
                this.state.inputDimensionPE , 
                this.state.inputDimensionPD
            )
            if( this.state.dimension_tipo!! == "N/A" ) dimension = 0

            // TIPO DIMENSION
            let tipoDimension = this.state.dimension_tipo!!

            // CATEGORIA
            let id_categoria = this.props.stateReduxProducto.actual.categoria_id!!

            // CODIGO DE BARRAS
            let codigoBarras = this.state.codigo_barras!!
            if( codigoBarras == "" ) codigoBarras = this.props.stateReduxProducto.productoBD.codigo_barras!!

            // PRECIO
            let precio = this.getPrecio( this.state.inputPrecioPE , this.state.inputPrecioPD )

            // DESCRIPCION
            let descripcion = Utilerias.corregirTexto_quitarEspaciosEnBlanco( this.state.descripcion!! )

            // ENVIO DE DATOS
            let respuesta = await Utilerias.postHTTP( "api/negocios/productos/actualizar" , 
            [
                { nombreCampo: "id_producto" , valor: this.state.id!! } ,
                { nombreCampo: "nombre" , valor: nombre } ,
                { nombreCampo: "codigo_de_barras" , valor: codigoBarras } ,
                { nombreCampo: "descripcion" , valor: descripcion } ,
                { nombreCampo: "id_marca" , valor: id_marca } ,
                { nombreCampo: "id_categoria" , valor: id_categoria } ,
                { nombreCampo: "imagenes_base64" , valor: JSON.stringify(imagenes) } ,
                { nombreCampo: "imagenes_tipo" , valor: JSON.stringify(imagenesTipo) } ,
                { nombreCampo: "dimension" , valor: dimension + "" } ,
                { nombreCampo: "dimension_tipo" , valor: tipoDimension } ,
                { nombreCampo: "precio" , valor: precio + "" }
            ])
            console.log( respuesta )

            if( respuesta.existeError ) 
            {  
                // ERROR AL ACTUALIZAR PRODUCTO
                this.props.dispatchRedux( ocultarModalCargando() )
                this.mostrar_modalMensajeError( 
                    respuesta.titulo , 
                    respuesta.descripcion ,
                    () => { this.ocultar_modalMensaje() } 
                )
                return
            }
  
            
            // PRODUCTO ACTUALIZADO
            this.props.dispatchRedux( ReduxProducto_setProductoBD({
                id: this.state.id!! ,
                nombre: nombre ,
                descripcion: descripcion ,
                codigo_barras: codigoBarras ,
                precio: precio ,

                marca_id: this.props.stateReduxProducto.actual.marca_id!! ,
                marca_nombre: this.props.stateReduxProducto.actual.marca_nombre!! ,
                marca_imagen: this.props.stateReduxProducto.actual.marca_imagen!! ,
                marca_imagenTipo: this.props.stateReduxProducto.actual.marca_imagenTipo!! ,

                categoria_id: this.props.stateReduxProducto.actual.categoria_id!! ,
                categoria_nombre: this.props.stateReduxProducto.actual.categoria_nombre!! ,
                categoria_imagen: this.props.stateReduxProducto.actual.categoria_imagen!! ,
                categoria_imagenTipo: this.props.stateReduxProducto.actual.categoria_imagenTipo!! ,
                categoria_ubicacion: this.props.stateReduxProducto.actual.categoria_ubicacion!! ,

                dimension: dimension ,
                dimension_tipo: tipoDimension ,

                imagenes_base64: imagenes ,
                imagenes_tipo: imagenesTipo
            }))
            this.props.dispatchRedux( ReduxProducto_setProductoBD_como_ProductoActual() )
            this.props.dispatchRedux( ocultarModalCargando() )
            this.mostrar_modalMensajeCorrecto( 
                respuesta.titulo , 
                respuesta.descripcion ,
                () => {  this.ocultar_modalMensaje()  }
            )
        } , 900 )
    }


    eliminarProducto()
    {
        this.props.dispatchRedux( mostrarModalCargando( "Eliminando Producto ..." ) )
        setTimeout( async () => 
        {
            // ENVIO DE DATOS
            let respuesta = await Utilerias.postHTTP( "api/negocios/productos/eliminar" , 
            [
                { nombreCampo: "id_producto" , valor: this.state.id!! }
            ])
            console.log( respuesta )


            if( respuesta.existeError ) 
            {  
                // ERROR AL ELIMINAR PRODUCTO
                this.props.dispatchRedux( ocultarModalCargando() )
                this.mostrar_modalMensajeError( 
                    respuesta.titulo , 
                    respuesta.descripcion ,
                    () => { this.ocultar_modalMensaje() } 
                )
                return
            }  
            
            // PRODUCTO ELIMINADO
            this.props.dispatchRedux( ReduxProducto_limpiarProductoBD() )
            this.props.dispatchRedux( ReduxProducto_setProductoBD_como_ProductoActual() )
            this.props.dispatchRedux( ReduxProducto_setSeccionActual(1) )
            this.props.dispatchRedux( ocultarModalCargando() )
            this.mostrar_modalMensajeCorrecto( 
                respuesta.titulo , 
                respuesta.descripcion ,
                () => {
                    this.ocultar_modalMensaje()
                    this.props.navigate( '/MisProductos' )
                }
            )
        } , 900 )
    }



















    //==========================================================================
    //                 FUNCIONALIDADES DE LA SECCION 1
    //===========================================================================
    async handleChange_inputFileImagen( selector: HTMLInputElement )
    {
        if( selector.files != undefined && selector.files.length != 0 ) 
        {
            this.props.dispatchRedux( mostrarModalCargando( "Agregando imagenes" ) )
            let producto_imgsBase64 = this.state.imagenes_base64!!.slice( 0 , this.state.imagenes_base64!!.length )
            let producto_imgsTipo = this.state.imagenes_tipo!!.slice( 0 , this.state.imagenes_tipo!!.length )
            let imagenes_add = 0
            let imagenes_errorSize = 0
            let imagenes_errorTipo = 0
            let imagenes_errorLimite = 0
            let imagenes_errorLectura = 0

            let imagenes = await Utilerias.getImagenes(
                selector.files!! ,
                [ "jpg" , "png" , "jpeg" ] , 
                5000000 ,
                5 ,
                producto_imgsBase64.length
            )
            //console.log( imagenes ) 

            for( let i=0;  i<imagenes.imagenesBase64.length;  i++ )
            {
                //console.log( imagenes.imagenesEstatus[i] )
                switch( imagenes.imagenesEstatus[i] )
                {
                    case Utilerias.ERROR_IMAGEN_TIPO:
                        imagenes_errorTipo++
                        break

                    case Utilerias.ERROR_IMAGEN_SIZE_MAX:
                        imagenes_errorSize++
                        break

                    case Utilerias.ERROR_IMAGEN_MAX_IMAGENES:
                        imagenes_errorLimite++
                        break
                    
                    case Utilerias.ERROR_IMAGEN_LECTURA:
                        imagenes_errorLectura++
                        break

                    case Utilerias.LECTURA_IMAGEN_CORRECTA:
                        imagenes_add++
                        producto_imgsBase64.push( imagenes.imagenesBase64[i] )
                        producto_imgsTipo.push( imagenes.imagenesTipo[i] )
                        break

                    default:
                        imagenes_errorLectura++
                }
            }

            if( imagenes_add != 0 ) {
                this.setState( (STATE , PROPS) => { return {
                    imagenes_base64: producto_imgsBase64 ,
                    imagenes_tipo: producto_imgsTipo
                }})
            }

            this.props.dispatchRedux( ocultarModalCargando() )

            if( imagenes_errorSize == 0 && imagenes_errorTipo == 0 &&
                imagenes_errorLimite == 0 && imagenes_errorLectura == 0
            ) {
            }
            else {
                let mensaje = ""
                let msj = ""
                if( imagenes_errorSize != 0 ) {
                    msj = " imagenes superan el tamaño de 5Mb"
                    if( imagenes_errorSize == 1 ) msj = " imagen supera el tamaño de 5Mb"
                    mensaje += "(" + imagenes_errorSize + ")" + msj + ".\n\n"
                }
                if( imagenes_errorTipo != 0 ) {
                    msj = " archivos NO son tipo jpg , png o jpeg"
                    if( imagenes_errorTipo == 1 ) msj = " archivo NO es tipo jpg , png o jpeg"
                    mensaje += "(" + imagenes_errorTipo + ")" + msj + ".\n\n"
                }
                if( imagenes_errorLimite != 0 ) {
                    msj = " imagenes NO fueron añadidas por superar el limite de imagenes " +
                    "permitidas por producto"
                    if( imagenes_errorLimite == 1 ) msj = " imagen NO fue añadida por superar " +
                    "el limite de imagenes permitidas por producto"
                    mensaje += "(" + imagenes_errorLimite + ")" + msj + ".\n\n"
                }
                if( imagenes_errorLectura != 0 ) {
                    msj = " imagenes NO pudieron ser obtenidas"
                    if( imagenes_errorLectura == 1 ) msj = " imagen NO pudo ser obtenida"
                    mensaje += "(" + imagenes_errorLectura + ")" + msj + ".\n\n"
                }
                mensaje = mensaje.substring( 0 , mensaje.length - 2 )

                this.mostrar_modalMensajeError(
                    "Algo salio mal al agregar algunas imagenes" , mensaje ,
                    () => {
                        this.ocultar_modalMensaje()
                    }
                )
            }
        }
    }


    handleInputNombre( nuevoNombre: string )
    {
        this.setState( (STATE , PROPS) => { return {
            nombre: nuevoNombre ,
            error_nombre: null
        }})
    }


    handleEvento_keyDown_inputNombre( evento: React.KeyboardEvent<HTMLDivElement> )
    {
        let caracteresValidos = "abcdefghijklmnñopqrstuvwxyz áéíóúäëïöü"
        let caracteresEspeciales = [ "ArrowRight" , "ArrowLeft" , "Backspace" ]
        if( 
            caracteresEspeciales.find( (teclaESP) => teclaESP == evento.key ) == undefined &&
            caracteresValidos.indexOf( evento.key.toLowerCase() ) == -1
        ){
            evento.preventDefault()
        } 
        //console.log( "========= KeyDown inputNombre =======" )
        //console.log( evento.key )
    }

    handleEvento_focusPerdido_inputNombre()
    {
        this.setState( (STATE , PROPS) => { return {
            nombre: Utilerias.corregirTexto_quitarEspaciosEnBlanco( this.state.nombre!! )
        }})
    }


    handleInputDimensionPE( dimensionPE: string )
    {
        this.setState( (STATE , PROPS) => {  return {
            inputDimensionPE: dimensionPE ,
            dimension: this.getDimension( dimensionPE , this.state.inputDimensionPD ) ,
            error_dimension: null
        }})
    }


    handleInputDimensionPD( dimensionPD: string )
    {
        this.setState( (STATE , PROPS) => {  return {
            inputDimensionPD: dimensionPD ,
            dimension: this.getDimension( this.state.inputDimensionPE , dimensionPD ) ,
            error_dimension: null
        }})
    }


    handleComboDimension( tipo: string )
    {
        let valorDimensionPE = this.state.inputDimensionPE
        let valorDimensionPD = this.state.inputDimensionPD
        if( tipo == 'N/A' ) {
            valorDimensionPE = ""
            valorDimensionPD = ""
        }
        this.setState( ( STATE , PROPS ) => { return {
            dimension_tipo: tipo ,
            inputDimensionPE: valorDimensionPE ,
            inputDimensionPD: valorDimensionPD ,
            dimension: this.getDimension( valorDimensionPE , valorDimensionPD ) ,
            error_dimension: null
        }})
    }


    getDimensionPE_placeHolder()
    {
        let PE = "0"
        let dimensionBD = this.props.stateReduxProducto.productoBD.dimension!!
        let dimension = dimensionBD + ""

        if( this.state.dimension_tipo!! == "N/A" ||  dimensionBD == 0  )  return "0"
        else {
            if( dimension.indexOf( '.' ) == -1 ) return Utilerias.getNumeroConComas( dimension )
            return Utilerias.getNumeroConComas( dimension.split( '.' )[0] )
        }
    }


    getDimensionPD_placeHolder()
    {
        let PD = ""
        let dimensionBD = this.props.stateReduxProducto.productoBD.dimension!!
        let dimension = dimensionBD + ""

        if( this.state.dimension_tipo!! == "N/A" ||  dimensionBD == 0  )  return "00"
        else {
            if( dimension.indexOf( '.' ) == -1 ) return "00"
            PD = dimension.split( '.' )[1]
            if( PD.length == 1 ) return PD + "0"
            else return PD.substring( 0 , 2)
        }
    }


    getValorDimensionResumen() 
    {
        let dimension = ""
        // EVALUAR TIPO
        if( this.state.dimension_tipo!!  == "N/A" ) {
            dimension = "N/A"
        }
        else {
            // EVALUAR PARTE ENTERA
            if( this.state.inputDimensionPE == "" ) { dimension = "0 . " }
            else {
                let dimensionPE = Number( this.state.inputDimensionPE.replace( ',' , '' ).replace( ' ' , '' ) )
                if( dimensionPE == 0 ) dimension = "0 . "
                else  dimension = Utilerias.getNumeroConComas( dimensionPE + "" ) + " . "
            }

            // EVALUAR PARTE DECIMAL
            if( this.state.inputDimensionPD == "" ) { dimension += "00" }
            else {
                let dimPD = this.state.inputDimensionPD.replace( ',' , '' ).replace( ' ' , '' )
                switch( dimPD.length ) {
                    case 1: dimPD = dimPD + "0" ;  break;
                    case 2: break;
                    default: dimPD = dimPD.substring( 0 , 2 )
                }
                dimension += dimPD 
            }

            // ADD TIPO
            dimension += " " + this.state.dimension_tipo!!
        }
        
        return dimension
    }


    getDimension( PE: string , PD: string )
    {
        let dimension = Utilerias.getNumero( PE , PD , 2 )
        if( isNaN( dimension ) ) {
            console.log( "Dimension NO es numero" )
            return 0
        }
        else return dimension
    }















    //==========================================================================
    //                 FUNCIONALIDADES DE LA SECCION 2
    //===========================================================================
    handleEvento_keyDown_inputCodigoBarras( evento: React.KeyboardEvent<HTMLDivElement> )
    {
        let caracteresValidos = "abcdefghijklmnñopqrstuvwxyz1234567890"
        let caracteresEspeciales = [ "ArrowRight" , "ArrowLeft" , "Backspace" ]
        if( 
            caracteresEspeciales.find( (teclaESP) => teclaESP == evento.key ) == undefined &&
            caracteresValidos.indexOf( evento.key.toLowerCase() ) == -1
        ){
            evento.preventDefault()
        } 
        //console.log( "========= KeyDown inputNombre =======" )
        //console.log( evento.key )
    }

    
    handleEvento_focusPerdido_inputCodigoBarras()
    {
        this.setState( (STATE , PROPS) => { return {
            codigo_barras: Utilerias.corregirTexto_quitarEspaciosEnBlanco( this.state.codigo_barras!! )
        }})
    }


    handleInputPrecioPE( precioPE: string )
    {
        this.setState( (STATE , PROPS) => {  return {
            inputPrecioPE: precioPE ,
            precio: this.getPrecio( precioPE , this.state.inputPrecioPD ) ,
            error_precio: null
        }})
    }


    handleInputPrecioPD( precioPD: string )
    {
        this.setState( (STATE , PROPS) => {  return {
            inputPrecioPD: precioPD ,
            precio: this.getPrecio( this.state.inputPrecioPE , precioPD ) ,
            error_precio: null
        }})
    }


    getPrecioPE_placeHolder()
    {
        let precioBD = this.props.stateReduxProducto.productoBD.precio!!
        let precio = precioBD + ""

        if( precioBD == 0  )  return "0"
        else {
            if( precio.indexOf( '.' ) == -1 ) return Utilerias.getNumeroConComas( precio )
            return Utilerias.getNumeroConComas( precio.split( '.' )[0] )
        }
    }


    getPrecioPD_placeHolder()
    {
        let PD = ""
        let precioBD = this.props.stateReduxProducto.productoBD.precio!!
        let precio = precioBD + ""

        if( precioBD == 0  )  return "00"
        else {
            if( precio.indexOf( '.' ) == -1 ) return "00"
            PD = precio.split( '.' )[1]
            if( PD.length == 1 ) return PD + "0"
            else return PD.substring( 0 , 2)
        }
    }


    getValorPrecioResumen()
    {
        let precio = ""
        
        // EVALUAR PARTE ENTERA
        if( this.state.inputPrecioPE == "" ) { precio = "0 . " }
        else {
            let precioPE = Number( this.state.inputPrecioPE.replace( ',' , '' ).replace( ' ' , '' ) )
            if( precioPE == 0 ) precio = "0 . "
            else  precio = Utilerias.getNumeroConComas( precioPE + "" ) + " . "
        }

        // EVALUAR PARTE DECIMAL
        if( this.state.inputPrecioPD == "" ) { precio += "00" }
        else {
            let prePD = this.state.inputPrecioPD.replace( ',' , '' ).replace( ' ' , '' )
            switch( prePD.length ) {
                case 1: prePD = prePD + "0" ;  break;
                case 2: break;
                default: prePD = prePD.substring( 0 , 2 )
            }
            precio += prePD 
        }

        return precio
    }


    getPrecio( PE: string , PD: string )
    {
        let precio = Utilerias.getNumero( PE , PD , 2 )
        if( isNaN( precio ) ) {
            console.log( "Precio NO es numero" )
            return 0
        }
        else return precio
    }

    
    handleEvento_focusPerdido_inputDescripcion()
    {
        this.setState( (STATE , PROPS) => { return {
            descripcion: Utilerias.corregirTexto_quitarEspaciosEnBlanco( this.state.descripcion!! )
        }})
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


    modalImagen_accionEliminar() {
        let imagenesBase64 = this.state.imagenes_base64!!.filter( () => true )
        let imagenesTipo = this.state.imagenes_tipo!!.filter( () => true )
        let imagenBase64_eliminada = imagenesBase64.splice( this.state.modalImagen_imagenIndex , 1 )
        let imagenTipo_eliminada = imagenesTipo.splice( this.state.modalImagen_imagenIndex , 1 )

        if( imagenBase64_eliminada.length != 0 && imagenTipo_eliminada.length != 0 ) {
            this.setState( (STATE, PRODS) => {  return {
                imagenes_base64: imagenesBase64 ,
                imagenes_tipo: imagenesTipo
            }})
            this.ocultarModalImagen()
        }
        else {
            alert( "NO FUE POSIBLLE ELIMINAR LA IMAGEN" )
        }
    }


    ocultarModalImagen()
    {
        this.setState( (STATE, PROPS) => { return {
            modalImagen_visible: false ,
            modalImagen_headerVisible: true ,
            modalImagen_imagen: "" ,
            modalImagen_imagenIndex: -1
        }})
    }


    mostrarModalImagen( imagenBase64: string , index: number )
    {
        this.setState( (STATE , PROPS) => {  return {
            modalImagen_visible: true ,
            modalImagen_imagen: imagenBase64 ,
            modalImagen_imagenIndex: index
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
















    



    //===================================================================================
    //                  DISEÑOS INDIVIDUALES DE LA PAGINA
    //===================================================================================

    //_______________________________________
    //  NAVEGACION ejemplo:  (1)--(2)--(3)
    //_______________________________________
    renderizarNavegacion( cantidadItems: number )
    {
        let botones_lineas: JSX.Element[] = []
        for( let i=1;  i<=cantidadItems;  i++ )
        {
            let clasesCSS = "botonSeccionProducto"
            if( i == this.props.stateReduxProducto.seccionActual ) clasesCSS += " botonSeccionActual"
            let boton =
            <Button
                variant='text'
                className={ clasesCSS }
                key={ "paginaProducto-botonPag-" + i }
                onClick={ (evento) => {
                    if( this.carruselContenedorPagina != null ) 
                    {
                        this.carruselContenedorPagina.slideTo( i - 1 )
                        this.props.dispatchRedux( ReduxProducto_setSeccionActual( i ) )
                    }
                }}
            >
                { i }
            </Button>
            botones_lineas.push( boton )
            let linea = ( <div  className='linea'  key={ "paginaProducto-lineaPag-" + i }> </div> )
            botones_lineas.push( linea )
        }
        botones_lineas.pop()

        return (
        <div  className="divPaginacion" > {  botones_lineas  }  </div>
        )
    }


    //_______________________________________
    //  HTML DE UN BOTON DE ACCION
    //_______________________________________
    generarBoton( clasesCSS: string , texto: string , accion: Function )
    {
        return (
        <Button
            variant='text'
            className={ clasesCSS }
            onClick={ (evento) => accion() }
            key={ "paginaProducto-divBotones-" + texto }
        >
            { texto }
        </Button> )
    }


    //_______________________________________
    //  DIV QUE CONTIENE LOS BOTONES DE ACCION
    //_______________________________________
    renderizarBotones()
    {
        let botonesVisibles: JSX.Element[] = []

        //_______________
        // BOTON ATRAS
        //_______________
        if( this.props.stateReduxProducto.seccionActual != 1 ) 
        {
            botonesVisibles.push( this.generarBoton( "botonAzul" , "Atras" , () => {
                if( this.carruselContenedorPagina != null ) 
                {
                    this.carruselContenedorPagina.slideTo( this.props.stateReduxProducto.seccionActual - 2 )
                    this.props.dispatchRedux( ReduxProducto_setSeccionActual( this.props.stateReduxProducto.seccionActual - 1 ) )
                }
            }))
        }


        //_______________
        // BOTON SIGUIENTE
        //_______________
        if( this.props.stateReduxProducto.seccionActual != 3 ) 
        {
            botonesVisibles.push( this.generarBoton( "botonAzul" , "Siguiente" , () => {
                if( this.carruselContenedorPagina != null ) 
                {
                    this.carruselContenedorPagina.slideTo( this.props.stateReduxProducto.seccionActual )
                    this.props.dispatchRedux( ReduxProducto_setSeccionActual( this.props.stateReduxProducto.seccionActual + 1 ) )
                }
            }))
        }

        
        return(  <div  className='divBotones'> { botonesVisibles }  </div>  )
    }



    //_______________________________________
    //  CARRUSEL DE IMAGENES DEL PRODUCTO
    //_______________________________________
    renderizarImagenesCarrusel()
    {
        return this.state.imagenes_base64!!.map( (img , index) => { 
            let imagen: JSX.Element = ( 
            <div  className='iconoImagen'>
                <FontAwesomeIcon  icon={ faImage } />
            </div> )
            if( img != "" ) {
                imagen = ( 
                <img 
                    src={ img }
                    onClick={ (evento) => { this.mostrarModalImagen( img , index ) }}  
                /> )
            }    
            return (
            <SwiperSlide  className="itemCarrusel"  key={ "imgCarruselProducto-" + index}>
                { imagen }
            </SwiperSlide>  )
        })
    }


    //_______________________________________
    //  CARRUSEL DE IMAGENES DEL PRODUCTO (RESUMEN)
    //_______________________________________
    renderizarImagenesCarruselResumen()
    {
        return this.state.imagenes_base64!!.map( (img , index) => {  return (
        <SwiperSlide  className="itemCarrusel"  key={ "imgCarruselProductoResumen-" + index}>
            <img  src={ img }  />
        </SwiperSlide>  )})
    }


    //________________________________________
    // COMPONENTE DE TEXTO CON ICONO PARA ERRORES
    //________________________________________
    crearTextoError( texto: string)
    {
        return (
        <div  className='div_labelError'>
            <div  className='icono'>
                <FontAwesomeIcon  icon={ faExclamationTriangle } />
            </div>
    
            { texto }   
        </div> ) 
    }


















    /*======================================================================================
                            1º PANTALLA DEL FORMULARIO
    ========================================================================================*/
    renderizarSeccion1()
    {
        // EVALUAR IMAGEN MARCA
        let imagenMarca: JSX.Element | null = null
        if( this.props.stateReduxProducto.actual.marca_imagen!! != "" ) {
            imagenMarca = (
            <img  
                src={ this.props.stateReduxProducto.actual.marca_imagen!! }  
            /> )
        }

        // TEXTO PREDETERMINADO INPUT NOMBRE
        let textoDefault_inputNombre = this.props.stateReduxProducto.productoBD.nombre!! 
        if( textoDefault_inputNombre == "" ) textoDefault_inputNombre = "Nombre del Producto"

        // TEXTO PREDETERMINADO MARCA
        let textoDefault_marca = this.props.stateReduxProducto.productoBD.marca_nombre!!
        if( textoDefault_marca == "" ) textoDefault_marca = "N/A"


        return(
        <SwiperSlide  className="itemSeccion" >

            { /* =======================================
                SELECTOR DE IMAGENES
            ============================================ */ }
            <Button
                variant='text'
                className='botonVerde'
                onClick={ (evento) => {
                    let selector = document.createElement('input')
                    selector.type="file"
                    selector.multiple = true
                    selector.accept = "image/*"
                    selector.onchange = async (evento) => { await this.handleChange_inputFileImagen( selector ) }
                    selector.click()
                }}
            >
                Elegir Imagen
            </Button>


            { /* ==========================
                CARRUSEL DE IMAGENES 
            =============================== */ }
            <Swiper 
                className="carrusel"
                effect={"creative"}
                modules={ [ Pagination , Navigation , EffectCreative ] }
                slidesPerView={1} 
                slidesPerGroup={1}
                loop={true} 
                autoHeight={true}
                allowTouchMove={true}
                onSwiper={ ( carrusel ) => { this.carruselImagenes = carrusel  }}
                onSlideChangeTransitionEnd={ () => {
                    this.carruselContenedorPagina!!.slideReset( 500 )
                }}
                onSlideResetTransitionEnd={ () => {
                    this.carruselContenedorPagina!!.slideReset( 500 )
                }}
                creativeEffect={{
                    prev: {
                        shadow: true,
                        translate: [ 0 , 0 , -600 ]
                    } ,
                    next: {
                        translate: [ "100%", 0, 0 ]
                    }
                }}
                pagination={{ clickable: true }} 
                navigation={true} 
            >
                { /* IMAGENES DEL CARRUSEL */ }
                { this.renderizarImagenesCarrusel() }
            </Swiper>


            { /* ==========================
                INPUT NOMBRE 
            =============================== */ }
            <TextFieldConSugerencias
                CSS="inputNombre"
                sugerencias={ this.state.opcionesInputNombre }
                titulo={ "Nombre" }
                inputError={ (this.state.error_nombre != null)? true : false }
                esRequerido={ true }
                componenteAyuda={ this.state.error_nombre }
                textoPredeterminado={  textoDefault_inputNombre }
                valorInput={ this.state.nombre!! } 
                handleChange_valorInput={ this.handleInputNombre.bind( this ) }
                handleEvento_keyDown={ this.handleEvento_keyDown_inputNombre.bind( this ) }
                handleEvento_focusPerdido={ this.handleEvento_focusPerdido_inputNombre.bind( this ) }
            />

 

            { /* ==========================
                MARCA
            =============================== */ }
            <div  className='divMarca'>
                { imagenMarca }
            
                <TextField
                    className={ "TextField_E1 inputMarca" }
                    label={ "Marca" } 
                    helperText={ "" }
                    placeholder={ textoDefault_marca }
                    variant="outlined"  
                    type="text"   
                    InputProps={{ 
                        readOnly: true
                    }} 
                    value={ this.props.stateReduxProducto.actual.marca_nombre!! }
                    onClick={ (evento) => {
                        if( this.props.stateReduxProducto.actual.marca_id!! != "" ) {
                            this.mostrar_modalMensajePregunta(
                                "Desea quitar la marca del producto?" , "" ,
                                () => { this.ocultar_modalMensaje() } ,
                                () => {
                                    this.props.dispatchRedux( ReduxProducto_setMarcaActual({
                                        id: "" ,
                                        nombre: "" ,
                                        imagen: "" ,
                                        imagenTipo: ""
                                    }))
                                    this.ocultar_modalMensaje()
                                }
                            )
                        }
                    }}
                />

                <IconButton  
                    className='iconoSelectorMarca'  
                    onClick={ (evento) => {
                        this.props.dispatchRedux( ReduxProducto_setProductoActual({
                            nombre: this.state.nombre!! ,
                            imagenes_base64: this.state.imagenes_base64!! ,
                            imagenes_tipo: this.state.imagenes_tipo!! ,
                            dimension: this.state.dimension!! ,
                            dimension_tipo: this.state.dimension_tipo!! ,
                            codigo_barras: this.state.codigo_barras!! ,
                            precio: this.state.precio!! ,
                            descripcion: this.state.descripcion!!
                        }))
                        this.props.navigate( '/Marcas' ) 
                    }}
                >   
                    <FontAwesomeIcon  icon={ faEllipsisH } />
                </IconButton>
            </div>


            { /* ==========================
                DIMENSION
            =============================== */ }
            <div  className={ cssDimension.divDimension }>
                <div  className={ cssDimension.divContenido }>
                    <TextFieldNumerico
                    clasesCSS={ "TextField_E1 " + cssDimension.inputDimension_PE }
                    maxCantidadDigitos={ 5 }
                    titulo={ "Dimension" }
                    textoAdicional={ "" }
                    textoPredeterminado={ this.getDimensionPE_placeHolder() }
                    maxCantidadCaracteres={ -1 }
                    valorInput={ this.state.inputDimensionPE }
                    handleValorInput={ this.handleInputDimensionPE.bind( this ) }
                    bloqueado={ ( this.state.dimension_tipo!! == 'N/A' )? true : false }
                    />

                    <label  className={ cssDimension.labelPunto }>
                    .
                    </label>

                    <TextFieldNumerico
                    clasesCSS={ "TextField_E1 " + cssDimension.inputDimension_PD }
                    maxCantidadDigitos={ 2 }
                    maxCantidadCaracteres={ 2 }
                    titulo={ "" }
                    textoAdicional={ "" }
                    textoPredeterminado={ this.getDimensionPD_placeHolder() }
                    valorInput={ this.state.inputDimensionPD }
                    handleValorInput={ this.handleInputDimensionPD.bind( this ) }
                    bloqueado={ ( this.state.dimension_tipo!! == 'N/A' )? true : false }
                    />

                    <Select
                    className={'Combo_E1 ' + cssDimension.comboDimension }
                    MenuProps={{
                        className: 'menuCombo_E1'
                    }}
                    autoWidth
                    displayEmpty
                    value={ this.state.dimension_tipo!! }
                    onChange={ (evento) => {  this.handleComboDimension( evento.target.value )  }}
                >
                    <MenuItem value='N/A'> { "N/A" } </MenuItem>
                    <MenuItem value='L'> L </MenuItem>
                    <MenuItem value='ml'> ml </MenuItem>
                    <MenuItem value='kg'> kg </MenuItem>
                    <MenuItem value='gr'> gr </MenuItem>
                    <MenuItem value='mts'> mts </MenuItem>
                    <MenuItem value='cm'> cm </MenuItem>
                    <MenuItem value='mm'> mm </MenuItem>
                    </Select>
                </div>

                { this.state.error_dimension }
            </div>            

        </SwiperSlide>
        )
    }















    /*======================================================================================
                            2º PANTALLA DEL FORMULARIO
    ========================================================================================*/
    renderizarSeccion2()
    {
        // EVALUAR IMAGEN CATEGORIA
        let imagenCategoria: JSX.Element | null = null
        if( this.props.stateReduxProducto.actual.categoria_imagen!! != "" ) {
            imagenCategoria = (
            <img  
                src={ this.props.stateReduxProducto.actual.categoria_imagen!! }  
            /> )
        }

        // TEXTO PREDETERMINADO CODIGO DE BARRAS
        let textoDefault_codigoBarras = this.props.stateReduxProducto.productoBD.codigo_barras!!
        if( textoDefault_codigoBarras == "" ) textoDefault_codigoBarras = "N/A"

        // TEXTO PREDETERMINADO DESCRIPCION
        let textoDefault_descripcion = this.props.stateReduxProducto.productoBD.descripcion!!
        if( textoDefault_descripcion == "" ) textoDefault_descripcion = "Descripcion del producto"

        return(
        <SwiperSlide  className="itemSeccion" >
                
            { /* ==========================
                CATEGORIA
            =============================== */ }
            <div  className='divCategoria'>
                { imagenCategoria }
            
                <TextField
                    className={ "TextField_E1 inputCategoria" }
                    label={ "Categoria" } 
                    helperText={ "" }
                    placeholder={ "N/A" }
                    variant="outlined"  
                    type="text"  
                    InputProps={{ 
                        readOnly: true
                    }} 
                    value={ this.props.stateReduxProducto.actual.categoria_nombre!! }
                    onClick={ (evento) => {
                        if( this.props.stateReduxProducto.actual.categoria_id!! != "" ) {
                            this.mostrar_modalMensajePregunta(
                                "Desea quitar la categoria del producto?" , "" ,
                                () => { this.ocultar_modalMensaje() } ,
                                () => {
                                    this.props.dispatchRedux( ReduxProducto_setCategoriaActual({
                                        id: "" ,
                                        nombre: "" ,
                                        imagen: "" ,
                                        imagenTipo: "" ,
                                        ubicacion: ""
                                    }))
                                    this.ocultar_modalMensaje()
                                }
                            )
                        }
                    }}
                />

                <IconButton  
                    className='iconoSelectorCategoria'  
                    onClick={ (evento) => {
                        this.props.dispatchRedux( ReduxProducto_setProductoActual({
                            nombre: this.state.nombre!! ,
                            imagenes_base64: this.state.imagenes_base64!! ,
                            imagenes_tipo: this.state.imagenes_tipo!! ,
                            dimension: this.state.dimension!! ,
                            dimension_tipo: this.state.dimension_tipo!! ,
                            codigo_barras: this.state.codigo_barras!! ,
                            precio: this.state.precio!! ,
                            descripcion: this.state.descripcion!!
                        }))
                        this.props.navigate( '/Categorias' ) 
                    }}
                >   
                    <FontAwesomeIcon  icon={ faEllipsisH } />
                </IconButton>
            </div>


            { /* ==========================
                CODIGO DE BARRAS
            =============================== */ }
            <div  className='divCodigoDeBarras'>
                
                <div  className='divContenido'>
                    <div  className='divIcono'>
                        <FontAwesomeIcon  icon={ faBarcode } />
                    </div>

                    <TextField
                        className={ "TextField_E1 inputCodigoDeBarras" }
                        label={ "Codigo de Barras" } 
                        helperText={ "" }
                        placeholder={ textoDefault_codigoBarras }
                        variant="outlined"  
                        type="text" 
                        required
                        autoComplete='off'  
                        value={ this.state.codigo_barras!! }
                        onChange={ (evento) => {
                            this.setState( (STATE , PROPS) => { return {
                                codigo_barras: evento.target.value ,
                                error_codigoBarras: null
                            }})
                        }}
                        onKeyDown={ (evento) => { this.handleEvento_keyDown_inputCodigoBarras(evento) } }
                        onBlur={ (evento) => { this.handleEvento_focusPerdido_inputCodigoBarras() } }
                    />
                </div>

                { this.state.error_codigoBarras }
            </div>


            { /* ==========================
                PRECIO
            =============================== */ }
            <div  className={ 'divPrecio' }>

                <div className='divContenido'>
                    <div  className='divIcono'>
                        <FontAwesomeIcon  icon={ faDollarSign } />
                    </div>

                    <TextFieldNumerico
                        clasesCSS={ "TextField_E1 inputPrecio_PE" }
                        maxCantidadDigitos={ 5 }
                        titulo={ "Precio" }
                        textoAdicional={ "" }
                        textoPredeterminado={ this.getPrecioPE_placeHolder() }
                        maxCantidadCaracteres={ -1 }
                        valorInput={ this.state.inputPrecioPE }
                        handleValorInput={ this.handleInputPrecioPE.bind( this ) }
                        bloqueado={ false }
                    />

                    <label  className={ 'labelPunto' }>
                        .
                    </label>

                    <TextFieldNumerico
                        clasesCSS={ "TextField_E1 inputPrecio_PD" }
                        maxCantidadDigitos={ 2 }
                        maxCantidadCaracteres={ 2 }
                        titulo={ "" }
                        textoAdicional={ "" }
                        textoPredeterminado={ this.getPrecioPD_placeHolder() }
                        valorInput={ this.state.inputPrecioPD }
                        handleValorInput={ this.handleInputPrecioPD.bind( this ) }
                        bloqueado={ false }
                    />
                </div>

                { this.state.error_precio }

            </div>


            { /* ==========================
                DESCRIPCION
            =============================== */ }
            <TextField
                className={ "TextField_E1 inputDescripcion" }
                label={ "Descripcion" } 
                helperText={ "" }
                placeholder={ textoDefault_descripcion }
                variant="outlined"  
                type="text"   
                multiline
                autoComplete='off'
                rows={ 4 }
                value={ this.state.descripcion }
                onChange={ (evento) => {
                    this.setState( (STATE , PROPS) => { return {
                        descripcion: evento.target.value
                    }})
                }}
                onBlur={ (evento) => { this.handleEvento_focusPerdido_inputDescripcion() } }
            />

        </SwiperSlide> )
    }













    /*======================================================================================
                            3º PANTALLA DEL FORMULARIO (RESUMEN)
    ========================================================================================*/
    renderizarSeccion3()
    {
        // EVALUAR NOMBRE DEL PRODUCTO
        let nombre = this.state.nombre!!
        if( nombre == "" ) {
            if( this.props.stateReduxProducto.productoBD.nombre!! == "" ) nombre = "N/A"
            else nombre = this.props.stateReduxProducto.productoBD.nombre!!
        }

        // EVALUAR IMAGEN MARCA
        let imagenMarca: JSX.Element | null = null
        if( this.props.stateReduxProducto.actual.marca_imagen!! != "" ) {
            imagenMarca = ( <img  
                src={ this.props.stateReduxProducto.actual.marca_imagen!! }  
            /> )
        }

        // EVALUAR NOMBRE DE LA MARCA
        let nombreMarca = this.props.stateReduxProducto.actual.marca_nombre!!
        if( nombreMarca == "" ) nombreMarca = "N/A"

        // EVALUAR IMAGEN CATEGORIA
        let imagenCategoria: JSX.Element | null = null
        if( this.props.stateReduxProducto.actual.categoria_imagen!! != "" ) {
            imagenCategoria = ( <img  
                src={ this.props.stateReduxProducto.actual.categoria_imagen!! }  
            /> )
        }

        // EVALUAR NOMBRE DE LA CATEGORIA
        let nombreCategoria = this.props.stateReduxProducto.actual.categoria_nombre!!
        if( nombreCategoria == "" ) nombreCategoria = "N/A"

        // EVALUAR CODIGO DE BARRAS
        let codigoBarras = this.state.codigo_barras!!
        if( codigoBarras == "" ) {
            codigoBarras = this.props.stateReduxProducto.productoBD.codigo_barras!!
            if( codigoBarras == "" ) codigoBarras = "N/A"
        }

        // EVALUAR DESCRIPCION
        let descripcion = this.state.descripcion!!
        if( descripcion == "" )  descripcion = "N/A"

        return(
        <SwiperSlide  className="itemSeccion" >

            { /* ==========================
                TITULO DE LA SECCION
            =============================== */ }
            <label  className='labelTitulo'> Resumen del Producto </label>

            
            { /* ==========================
                CARRUSEL DE IMAGENES 
            =============================== */ }
            <Swiper 
                className="carrusel"
                effect={"creative"}
                modules={ [ Pagination , Navigation , EffectCreative ] }
                slidesPerView={1} 
                slidesPerGroup={1}
                loop={true} 
                autoHeight={true}
                allowTouchMove={true}
                creativeEffect={{
                    prev: {
                        shadow: true,
                        translate: [ 0 , 0 , -600 ]
                    } ,
                    next: {
                        translate: [ "100%", 0, 0 ]
                    }
                }}
                pagination={{ clickable: true }} 
                navigation={true} 
            >
                { /* IMAGENES DEL CARRUSEL */ }
                { this.renderizarImagenesCarruselResumen() }
            </Swiper>


            { /* ==========================
                NOMBRE
            =============================== */ }
            <div  className='divNombreResumen'>
                <label className='labelSubtitulo' > Nombre </label>
                <div  className='labelDato divDatoResumen labelNombre'> { nombre } </div>
            </div>


            { /* ==========================
                MARCA
            =============================== */ }
            <div  className='divMarcaResumen'>
                
                <label  className='labelSubtitulo'> Marca </label>

                <div  className='divDato'>
                    { imagenMarca }
            
                    <div  className='divDatoResumen labelMarca labelDato'> 
                        { nombreMarca }
                    </div>
                </div>
                
            </div>


            { /* ==========================
                DIMENSION - PRECIO
            =============================== */ }
            <div  className='divDimensionPrecioResumen'>
                
                <div  className='divDimensionResumen'>
                    <label  className='labelSubtitulo'> Dimension </label>
                    <div  className='labelDato divDatoResumen labelDimension'> 
                        { this.getValorDimensionResumen()  } 
                    </div>
                </div>

                <div  className='divPrecioResumen'>
                    <div  className='labelSubtitulo'> Precio </div>
                    
                    <div  className='divDatoResumen divDato' >
                        <div className='icono' >
                            <FontAwesomeIcon icon={ faDollarSign } />
                        </div>
                        <label className='labelDato' >  { this.getValorPrecioResumen()  }   </label>
                    </div>
            
                </div>
                
            </div>


            { /* ==========================
                CATEGORIA
            =============================== */ }
            <div  className='divCategoriaResumen'>
                
                <label  className='labelSubtitulo'> Categoria </label>

                <div  className='divDato'>
                    { imagenCategoria }
            
                    <ElementoConTooltip
                        tituloTooltip='Ubicacion de la categoria'
                        descripcionTooltip={ this.props.stateReduxProducto.actual.categoria_ubicacion!! }
                        texto={ nombreCategoria }
                        icono={ "" }
                        CSS='divDatoResumen labelCategoria labelDato'
                        tipoElemento={ classElementoConTooltip.ELEMENTO_LABEL }
                    /> 
                </div>
                
            </div>


            { /* ==========================
                CODIGO DE BARRAS
            =============================== */ }
            <div  className='divCodigoDeBarrasResumen'>
                <div  className='labelSubtitulo'> Codigo de Barras </div>
                    
                <div  className='divDatoResumen divDato' >
                    <div className='icono' >
                        <FontAwesomeIcon icon={ faBarcode } />
                    </div>
                    <label className='labelDato' >  { codigoBarras  }   </label>
                </div>
            </div>


            { /* ==========================
                DESCRIPCION
            =============================== */ }
            <div  className='divDescripcionResumen'>
                <div  className='labelSubtitulo'> Descripcion </div>
                    
                <div  className='divDatoResumen labelDato labelDescripcion' >
                    {  descripcion }
                </div>
            </div>

        </SwiperSlide>
        )
    }



    






    






    //=======================================================================
    //              ACTUALIZACION DEL COMPONENTE
    //=======================================================================
    componentDidUpdate( prevProps: Readonly<Props>, prevState: Readonly<State> )
    {
        this.carruselContenedorPagina!!.slideReset( 300 )
    }
    









    //=======================================================================
    //                  DEFINICION DEL HTML
    //=======================================================================
    render() 
    {
    return(
        <main className='contenedorPagina paginaProducto' >
            <Encabezado  
                { ...this.props } 
                habilitar_BotonRegresar={ true }
                habilitar_MenuPrincipal={ false }
                habilitar_MenuOpciones={ true }
                titulo="Papeleria Geraldine Papeleria Geraldine" 
                tituloTooltip="Nombre de tu Negocio"
                itemsMenuPrincipal={ [] } 
                itemsMenuOpciones={ this.menuOpciones }
                itemMenuP_seleccionado={  "" }
                itemMenuOp_seleccionado={ "" }
                botonRegresar_URL='/MisProductos'
            />


            { /* ===================================
                BOTONES DE PAGINACION
            ======================================== */ }
            { this.renderizarNavegacion( 3 ) }



            { /* ===================================
                CONTENEDOR DE LA PAGINA
            ======================================== */ }
            <Swiper 
                className="carruselPaginaProducto"
                effect={"slide"}
                slidesPerView={ 1 } 
                slidesPerGroup={ 1 }
                spaceBetween={ 1 }
                autoHeight={true}
                allowTouchMove={false}
                onSwiper={ ( carrusel ) => {
                    this.carruselContenedorPagina = carrusel 
                    this.carruselContenedorPagina.slideTo(this.props.stateReduxProducto.seccionActual - 1)
                }}
            >
                { /* SECCIONES DE LA PAGINA */ }
                { this.renderizarSeccion1() }
                { this.renderizarSeccion2() }
                { this.renderizarSeccion3() }
            </Swiper>


            {/*==========================================
                    DIV QUE CONTIENE LOS BOTONES DE ACCION
            =============================================*/}
            { this.renderizarBotones() }



            

            {/*==========================================
                MODAL QUE MUESTRA UNA IMAGEN SELECCIONADA
            =============================================*/}
            <ModalImagen
                modalVisible={ this.state.modalImagen_visible }
                botonEliminarVisible={ true }
                imagenURL={ this.state.modalImagen_imagen }
                accionX={ this.modalImagen_accionX.bind(this)  }
                accionEliminar={ this.modalImagen_accionEliminar.bind(this) }
                accionClickImagen={ this.modalImagen_accionClickImagen.bind(this) }
                headerVisible={ this.state.modalImagen_headerVisible }
            />


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

        </main>
    )}
}

