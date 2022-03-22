
//=====================================================
//  IMPORTACIONES GENERALES
//=====================================================
import React from 'react'
import { NavigateFunction } from 'react-router-dom'

// componentes MUI
import { 
    Breadcrumbs,
    Button ,
    IconButton
} from "@mui/material"

// mis componentes
import ModalCategoria from './ModalCategoria'
import ModalFormulario from './ModalFormulario'

// iconos
import { 
    faListUl , 
    faFilter , 
    faPlus ,
    faSearch ,
    faEllipsisH ,
    faCaretRight ,
    faImage
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// mis componentes
import Encabezado , { Item } from '../../../Components/Encabezado/Encabezado'
import Paginacion from '../../../Components/Paginacion/Paginacion'
import DivResultado from '../../../Components/DivResultado/DivResultado'

import 
    ElementoConTooltip , 
    { classElementoConTooltip } 
from '../../../Components/ElementoConTooltip/ElementoConTooltip'

import ModalMensaje , { 
    MENSAJE_CORRECTO ,
    MENSAJE_ERROR ,
    MENSAJE_PREGUNTA
} from '../../../Components/ModalMensaje/ModalMensaje'

/*_________________
 redux paginacion
___________________*/
import { 
    stateReduxPaginacion , 
    setPaginaActual 
} from "../../../Redux/Controladores/controladorPaginacion"
/*_________________
 redux modal
___________________*/
import { 
    stateReduxModal , 
    mostrarModalCargando ,
    ocultarModalCargando
} from "../../../Redux/Controladores/controladorModal"
/*_________________
 redux producto
___________________*/
import { 
    stateReduxProducto ,
    ReduxProducto_setCategoriaActual
} from "../../../Redux/Controladores/controladorProducto"
/*_________________
 redux store
___________________*/
import { AppDispatch } from "../../../Redux/store"

// utilerias
import Utilerias from "../../../Models/Utilerias" 

// css
import "./PaginaCategorias.css"








//===========================================================================
//                          INTERFACES
//===========================================================================
interface Categoria
{
    id: string ,
    nombre: string ,
    imagenBase64: string ,
    imagenTipo: string ,
    ubicacion: string
}

interface Props 
{
    navigate: NavigateFunction ,
    stateReduxPaginacion: stateReduxPaginacion ,
    stateReduxProducto: stateReduxProducto ,
    stateReduxModal: stateReduxModal ,
    dispatchRedux: AppDispatch
}

interface State 
{
    /*===================================
        MODAL CATEGORIA SELECCIONADA
    ===================================== */
    // PARTE GRAFICA
    modalCategoria_visible: boolean ,
    modalCategoria_headerVisible: boolean ,
    // DATOS
    modalCategoria_id: string ,
    modalCategoria_nombre: string ,
    modalCategoria_imagenBase64: string ,
    modalCategoria_imagenTipo: string ,
    
    
    /*===================================
        MODAL FORMULARIO
    ===================================== */
    // PARTE GRAFICA
    modalFormulario_visible: boolean ,
    // DATOS
    modalFormulario_id: string ,
    modalFormulario_nombreOriginal: string ,
    modalFormulario_inputNombre: string ,
    modalFormulario_imagenBase64: string ,
    modalFormulario_imagenTipo: string ,


    modalMensaje_visible: boolean ,
    modalMensaje_titulo: string ,
    modalMensaje_descripcion: string ,
    modalMensaje_tipo: number ,

    listaCategorias: Categoria[] ,
    totalCategorias: number ,
    categoriasXpagina: number ,

    indicadorSubcategorias: Categoria[]
}





//=====================================================
//  DEFINCION DEL COMPONENTE
//=====================================================
export default class PaginaCategorias extends React.Component<Props , State>
{
    //___________________________
    //  PROPIEDADES
    //___________________________
    itemsMenuOpciones: Item[]

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
            modalCategoria_visible: false ,
            modalCategoria_headerVisible: true ,
            modalCategoria_id: "" ,
            modalCategoria_nombre: "" ,
            modalCategoria_imagenBase64: "" ,
            modalCategoria_imagenTipo: "" ,


            modalFormulario_visible: false ,
            modalFormulario_id: "" ,
            modalFormulario_nombreOriginal: "" ,
            modalFormulario_inputNombre: "" ,
            modalFormulario_imagenBase64: "" ,
            modalFormulario_imagenTipo: "" ,


            modalMensaje_visible: false ,
            modalMensaje_titulo: "" ,
            modalMensaje_descripcion: "" ,
            modalMensaje_tipo: MENSAJE_CORRECTO ,


            listaCategorias: [] ,
            totalCategorias: 0 ,
            categoriasXpagina: 2 ,

            indicadorSubcategorias: 
            [ 
                {
                    id: "" , 
                    nombre: "Principales" ,
                    imagenBase64: "" ,
                    imagenTipo: "" ,
                    ubicacion: ""
                }
            ]
        }


        /*============================
            INICIALIZACION DE PROPIEDADES
        ==============================*/
        this.itemsMenuOpciones = [
            {
                texto: "Agregar Categoria" ,
                icono: faPlus ,
                accion: () => {
                    this.setState( (STATE , PROPS) => { return {
                        modalFormulario_visible: true
                    }})
                }
            } ,
            {
                texto: "Filtrar Categorias" , 
                icono: faFilter ,
                accion: () => alert("/filtrar categorias")
            }
        ]

        // INICIALIZAR PAGINACION
        this.props.dispatchRedux( setPaginaActual( 1 ) )
    }




    componentDidMount() 
    {
        // OBTENCION DE LAS CATEGORIAS
        this.getCategorias( this.props.stateReduxPaginacion.paginaActual  )
    }


















    /*===============================================================================
                        FUNCIONES 
    =================================================================================*/
    getCategoriaPadre()
    {
        return this.state.indicadorSubcategorias[ this.state.indicadorSubcategorias.length - 1 ]
    }


    getUbicacionCategoria_nombres(){
        let categoriaPadre = this.getCategoriaPadre()
        return categoriaPadre.ubicacion + " / " + categoriaPadre.nombre 
    }

    getUbicacionCategoria_IDs(){
        let IDs: string[] = []
        this.state.indicadorSubcategorias.forEach( (categoria) => {
            if( categoria.id != "" ) IDs.push( categoria.id )
        })
        return IDs
    }







    /*===============================================================================
                        OPERACIONES EN LA BASE DE DATOS
    =================================================================================*/
    getCategorias( pagina: number )
    {
        this.props.dispatchRedux( mostrarModalCargando( "Obteniendo categorias ..." ) )
        setTimeout( async () => 
        {
            let respuesta = await Utilerias.postHTTP( "api/negocios/categorias/buscar" , [
                { nombreCampo: "categoriasXpagina" , valor: this.state.categoriasXpagina + "" } ,
                { nombreCampo: "pagina" , valor: pagina + "" } ,
                { nombreCampo: "id_categoria_padre" , valor: this.getCategoriaPadre().id }
            ] )
            console.log( respuesta )
            
            if( respuesta.existeError ) 
            {  
                // ERROR AL OBTENER CATEGORIAS
                this.props.dispatchRedux( ocultarModalCargando() )
                this.mostrar_modalMensajeError( 
                    respuesta.titulo , 
                    respuesta.descripcion ,
                    () => { this.ocultar_modalMensaje() } 
                )
                return
            }
            
            // CATEGORIAS OBTENIDAS
            let query: {
                id: string ,
                nombre: string ,
                imagenBase64: string ,
                imagenTipo: string ,
                ubicacion: string
            }[] = []
            query = respuesta.datos.listaCategorias

            let categoriasBD: Categoria[] = [] 
            query.forEach( (categoria) => { 
                categoriasBD.push({
                    id: categoria.id ,
                    nombre: categoria.nombre ,
                    imagenBase64: categoria.imagenBase64 ,
                    imagenTipo: categoria.imagenTipo ,
                    ubicacion: categoria.ubicacion
                })
            })
            this.setState( (STATE , PROPS) => { return {
                listaCategorias: categoriasBD ,
                totalCategorias: respuesta.datos.totalCategorias
            }})
            this.props.dispatchRedux( ocultarModalCargando() )
        } , 900 )
    }


    insertarCategoria()
    {
        this.props.dispatchRedux( mostrarModalCargando( "Agregando Categoria ..." ) )
        setTimeout( async () => 
        {
            let respuesta = await Utilerias.postHTTP( "api/negocios/categorias/insertar" , [
                { nombreCampo: "id_negocio" , valor: "N/A" } ,
                { nombreCampo: "categoria_nombre" , valor: this.state.modalFormulario_inputNombre } ,
                { nombreCampo: "categoria_imagen" , valor: this.state.modalFormulario_imagenBase64 } ,
                { nombreCampo: "categoria_tipoImagen" , valor: this.state.modalFormulario_imagenTipo } ,
                { nombreCampo: "id_categoria_padre" , valor: this.getCategoriaPadre().id } ,
                { nombreCampo: "categoria_ubicacion" , valor: JSON.stringify( this.getUbicacionCategoria_IDs() ) }
            ])
            console.log( respuesta )

            if( respuesta.existeError ) 
            {  
                // ERROR AL INSERTAR CATEGORIA
                this.props.dispatchRedux( ocultarModalCargando() )
                this.mostrar_modalMensajeError( 
                    respuesta.titulo , 
                    respuesta.descripcion ,
                    () => { this.ocultar_modalMensaje() } 
                )
                return
            }
            
            // CATEGORIA INSERTADA EN LA BD
            this.props.dispatchRedux( ocultarModalCargando() )

            this.mostrar_modalMensajeCorrecto( 
                respuesta.titulo , 
                respuesta.descripcion ,
                () => {
                    this.ocultar_modalMensaje()
                    this.ocultarModalFormulario()
                    this.getCategorias( this.props.stateReduxPaginacion.paginaActual )
                }
            )
        } , 900 )
    }


    actualizarCategoria()
    {
        let nombreCategoria = ""
        if( this.state.modalFormulario_inputNombre == "" ) nombreCategoria = this.state.modalFormulario_nombreOriginal
        else nombreCategoria = this.state.modalFormulario_inputNombre

        this.props.dispatchRedux( mostrarModalCargando( "Actualizando Categoria ..." ) )
        setTimeout( async () => 
        {
            let respuesta = await Utilerias.postHTTP( "api/negocios/categorias/actualizar" , [
                { nombreCampo: "id_categoria" , valor: this.state.modalFormulario_id } ,
                { nombreCampo: "id_categoria_padre" , valor: this.getCategoriaPadre().id } ,
                { nombreCampo: "categoria_nombre" , valor: nombreCategoria } ,
                { nombreCampo: "categoria_imagen" , valor: this.state.modalFormulario_imagenBase64 } ,
                { nombreCampo: "categoria_imagenTipo" , valor: this.state.modalFormulario_imagenTipo }
            ])
            console.log( respuesta )

            if( respuesta.existeError ) 
            {  
                // ERROR AL ACTUALIZAR CATEGORIA
                this.props.dispatchRedux( ocultarModalCargando() )
                this.mostrar_modalMensajeError( 
                    respuesta.titulo , 
                    respuesta.descripcion ,
                    () => { this.ocultar_modalMensaje() } 
                )
                return
            }

            if( respuesta.datos.existeAdvertencia ) 
            {  
                // MARCA ACTUALIZADA A MEDIAS
                this.props.dispatchRedux( ocultarModalCargando() )
                this.mostrar_modalMensajeError( 
                    respuesta.titulo ,
                    respuesta.descripcion ,
                    () => { 
                        this.ocultar_modalMensaje() 
                    } 
                )
                return
            }
            
            // CATEGORIA ACTUALIZADA EN LA BD
            this.props.dispatchRedux( ocultarModalCargando() )
            this.mostrar_modalMensajeCorrecto( 
                respuesta.titulo , 
                respuesta.descripcion ,
                () => {
                    this.ocultar_modalMensaje()
                    this.ocultarModalFormulario()
                    this.getCategorias( this.props.stateReduxPaginacion.paginaActual )
                }
            )
        } , 900 )
    }


    eliminarCategoria()
    {
        this.props.dispatchRedux( mostrarModalCargando( "Eliminando Categoria ..." ) )
        setTimeout( async () => 
        {
            let respuesta = await Utilerias.postHTTP( "api/negocios/categorias/eliminar" , [
                { nombreCampo: "id_categoria" , valor: this.state.modalCategoria_id }
            ])
            console.log( respuesta )

            if( respuesta.existeError ) 
            {  
                // ERROR AL ELIMINAR MARCA
                this.props.dispatchRedux( ocultarModalCargando() )
                this.mostrar_modalMensajeError( 
                    respuesta.titulo , 
                    respuesta.descripcion ,
                    () => { this.ocultar_modalMensaje() } 
                )
                return
            }
            
            // CATEGORIA ELIMINADA EN LA BD
            this.props.dispatchRedux( ocultarModalCargando() )

            this.mostrar_modalMensajeCorrecto( 
                respuesta.titulo , 
                respuesta.descripcion ,
                () => {
                    this.ocultar_modalMensaje()
                    this.ocultarModalCategoria()
                    this.getCategorias( this.props.stateReduxPaginacion.paginaActual )
                }
            )
        } , 900 )
    }























    //=================================================================================
    //              HANDLES DEL MODAL CATEGORIA SELECCIONADA
    //=================================================================================
    modalCategoria_handleClick_imagen() 
    {
        this.setState( (STATE, PROPS) => { return {
            modalCategoria_headerVisible: !STATE.modalCategoria_headerVisible
        }})
    }


    modalCategoria_handleClick_X() {  this.ocultarModalCategoria()   }


    modalCategoria_handleClick_itemMenuSeleccionar() 
    {
        let ubicacion = ""
        this.state.indicadorSubcategorias.forEach( (categoria) => {
            ubicacion += categoria.nombre + " / "
        })
        ubicacion += this.state.modalCategoria_nombre
        this.props.dispatchRedux( ReduxProducto_setCategoriaActual({ 
            id: this.state.modalCategoria_id ,
            nombre: this.state.modalCategoria_nombre ,
            imagen: this.state.modalCategoria_imagenBase64 ,
            imagenTipo: this.state.modalCategoria_imagenTipo ,
            ubicacion: ubicacion
        }))
        this.props.navigate( '/Producto' )
    }


    modalCategoria_handleClick_itemMenuEditar() 
    {
        this.mostrarModalFormulario(
            this.state.modalCategoria_id ,
            this.state.modalCategoria_nombre ,
            this.state.modalCategoria_imagenBase64 ,
            this.state.modalCategoria_imagenTipo
        )
        this.ocultarModalCategoria()
    }


    modalCategoria_handleClick_itemMenuEliminar() 
    {
        this.mostrar_modalMensajePregunta(
            'Esta seguro de eliminar la categoria "' + this.state.modalCategoria_nombre + '" ?' ,
            "Esto causara que todos los productos que tengan esta categoria asignada queden con N/A" ,
            () => {  // NO
                this.ocultar_modalMensaje()
            } ,
            () => {  // SI
                this.ocultar_modalMensaje()
                this.eliminarCategoria()
            }
        )
    }




    mostrarModalCategoria( idCategoria: string , imagenBase64: string , imagenTipo: string ,
        nombre: string )
    {
        this.setState( (STATE , PROPS) => { return {
            modalCategoria_id: idCategoria ,
            modalCategoria_imagenBase64: imagenBase64 ,
            modalCategoria_imagenTipo: imagenTipo ,
            modalCategoria_nombre: nombre ,
            modalCategoria_visible: true ,
            modalCategoria_headerVisible: true
        }})
    }


    ocultarModalCategoria( )
    {
        this.setState( (STATE , PROPS) => { return {
            modalCategoria_id: "" ,
            modalCategoria_imagenBase64: "" ,
            modalCategoria_imagenTipo: "" ,
            modalCategoria_nombre: "" ,
            modalCategoria_visible: false ,
            modalCategoria_headerVisible: true
        }})
    }

















    //======================================================================================
    //              HANDLES DEL MODAL MARCA FORMULARIO
    //======================================================================================
    modalFormulario_handleClick_botonOK()
    {
        //______________________________________________
        // CUANDO EL FORMULARIO ESPERA UNA CATEGORIA NUEVA
        //______________________________________________
        if( this.state.modalFormulario_id == "" ) 
        {
            // VALIDAR NOMBRE
            if( this.state.modalFormulario_inputNombre == "" ) 
            {
                this.mostrar_modalMensajeError( 
                    "Datos Incompletos" , 
                    "Establezca el nombre de la categoria" ,
                    () => {  this.ocultar_modalMensaje()  }
                )
                return
            }

            // VALIDAR IMAGEN
            if( this.state.modalFormulario_imagenBase64 == "" ) {
                this.mostrar_modalMensajePregunta( 
                    "Imagen NO establecida" , 
                    "Desea guardar esta categoria sin imagen?" ,
                    () => {   // BOTON NO
                        this.ocultar_modalMensaje()
                    } ,
                    () => {   // BOTON SI
                        this.ocultar_modalMensaje()
                        this.insertarCategoria()
                    }
                )
                return
            }

            this.insertarCategoria()
        }

        //______________________________________________
        // CUANDO EL FORMULARIO EDITA UNA CATEGORIA
        //______________________________________________
        else
        {
            // VALIDAR IMAGEN
            if( this.state.modalFormulario_imagenBase64 == "" ) {
                this.mostrar_modalMensajePregunta( 
                    "Imagen NO establecida" , 
                    "Desea guardar esta categoria sin imagen?" ,
                    () => {   // BOTON NO
                        this.ocultar_modalMensaje()
                    } ,
                    () => {   // BOTON SI
                        this.ocultar_modalMensaje()
                        this.actualizarCategoria()
                    }
                )
                return
            }
            
            // DATOS COMPLETOS
            this.actualizarCategoria()
        }
    }


    modalFormulario_handleChange_inputNombre( nuevoValor: string ) 
    {
        this.setState( (STATE, PROPS) => {  return {
            modalFormulario_inputNombre: nuevoValor
        }})
    }


    modalFormulario_handleClick_X() {  this.ocultarModalFormulario()  }


    modalFormulario_handleClick_botonEliminarImagen() 
    {
        this.setState( (STATE, PROPS) => {  return {
            modalFormulario_imagenBase64: "" ,
            modalFormulario_imagenTipo: ""
        }})
    }


    async modalFormulario_handleChange_inputFileImagen( selector: HTMLInputElement )
    {
        // CUANDO EXISTE (FileList) y existe imagen seleccionada
        if( selector.files && selector.files.length != 0 ) 
        {
            try {
                let img = await Utilerias.getImagen( 
                    selector.files[0] ,
                    [ "jpg" , "png" , "jpeg" ] ,
                    5000000 // 5MB
                )
                //console.log( img )

                if( img.codigoERROR != 0 ) {  // ERROR AL CARGAR IMAGEN
                    this.mostrar_modalMensajeError(
                        "Algo salio mal al cargar la imagen categoria" ,
                        img.mensajeERROR ,
                        () => this.ocultar_modalMensaje()
                    )
                    return
                }

                // IMAGEN LEIDA CON EXITO 
                this.setState( (STATE , PROPS) => { return {
                    modalFormulario_imagenBase64: img.base64 ,
                    modalFormulario_imagenTipo: img.tipoImagen
                }})
            }
            catch( ERROR ) {
                this.mostrar_modalMensajeError(
                    "Algo salio mal al cargar la imagen categoria" ,
                    "Vuelva a intentarlo" ,
                    () => this.ocultar_modalMensaje()
                )
                console.log( "ERROR getImagen inputFileMarca: \n" + ERROR )
            }
        }
    }




    mostrarModalFormulario( id_categoria: string = "" , nombreOriginal: string = "" ,
        imagenBase64: string = "" , imagenTipo: string = ""
    ) 
    {
        this.setState( (STATE, PROPS) => {  return {
            modalFormulario_visible: true ,
            modalFormulario_id: id_categoria ,
            modalFormulario_nombreOriginal: nombreOriginal ,
            modalFormulario_inputNombre: nombreOriginal ,
            modalFormulario_imagenBase64: imagenBase64 ,
            modalFormulario_imagenTipo: imagenTipo
        }})
    }


    ocultarModalFormulario() 
    {
        this.setState( (STATE, PROPS) => {  return {
            modalFormulario_visible: false ,
            modalFormulario_id: "" ,
            modalFormulario_nombreOriginal: "" ,
            modalFormulario_inputNombre: "" ,
            modalFormulario_imagenBase64: "" ,
            modalFormulario_imagenTipo: ""
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










    






    //=======================================================================
    //                 DISEÑOS INDIVIDUALES DE LA PAGINA
    //=======================================================================

    //________________________________
    //  INDICADOR DE SUBCATEGORIAS
    //________________________________
    renderizarIndicadorSubcategorias()
    {
        let itemPrincipal: JSX.Element | null = null
        let itemComprimido: JSX.Element | null = null
        let itemAnterior: JSX.Element | null = null
        let itemActual: JSX.Element | null = null

        switch( this.state.indicadorSubcategorias.length )
        {
            case 0:
            case 1:  //===========================================
                return null


            case 2:  //===========================================
                itemPrincipal = this.crearItem_indicadorSubcategoria( "BOTON" , 0 )
                itemActual = this.crearItem_indicadorSubcategoria( "" , 1 )
                break

            case 3:  //===========================================
                itemPrincipal = this.crearItem_indicadorSubcategoria( "BOTON" , 0 )
                itemAnterior = this.crearItem_indicadorSubcategoria( "BOTON" , 1 )
                itemActual = this.crearItem_indicadorSubcategoria( "" , 2 )
                break

            default:  //===========================================
                itemPrincipal = this.crearItem_indicadorSubcategoria( "BOTON" , 0 )
                itemComprimido = this.crearItem_indicadorSubcategoria( "ICONO_TOOLTIP" , -1 )
                itemAnterior = this.crearItem_indicadorSubcategoria( "BOTON" , this.state.indicadorSubcategorias.length - 2 )
                itemActual = this.crearItem_indicadorSubcategoria( ""  , this.state.indicadorSubcategorias.length - 1 )
                break
        }

        return (
        <Breadcrumbs
            className='divIndicadorSubcategorias'
            separator={ 
                <div  className='separador'>
                    <FontAwesomeIcon  icon={ faCaretRight } /> 
                </div>
            }
        >
            { itemPrincipal }
            { itemComprimido }
            { itemAnterior }
            { itemActual }

        </Breadcrumbs> )
    }



    crearItem_indicadorSubcategoria( tipo: string , indexCategoria: number  )
    {
        let item: JSX.Element | null = null 
        switch( tipo ) 
        {
            case "BOTON":
                item = (
                <Button
                    className="itemSubcategoria"
                    key={ "itemSubcategoria-" + indexCategoria }
                    variant='text'
                    onClick={ (evento) => {
                        this.setState( (STATE , PROPS) => {  return {
                            indicadorSubcategorias: STATE.indicadorSubcategorias.slice( 0 , indexCategoria+1 )
                        }})
                        this.props.dispatchRedux( setPaginaActual( 1 ) )
                        this.getCategorias( 1 ) 
                    }}
                >
                    { this.state.indicadorSubcategorias[ indexCategoria ].nombre }
                </Button> )
                break

            case "ICONO_TOOLTIP": 
                item = ( 
                <ElementoConTooltip 
                    tituloTooltip='Subcategoria Actual'
                    descripcionTooltip={ this.getUbicacionCategoria_nombres()  }
                    texto=''
                    icono={ faEllipsisH }
                    CSS='itemSubcategoriaIcono'
                    tipoElemento={ classElementoConTooltip.ELEMENTO_ICONO }
                /> )
                break

            default:
                item = ( 
                <div
                    className="itemSubcategoriaActual"
                    key={ "itemSubcategoria-A" }
                >
                    { this.state.indicadorSubcategorias[ indexCategoria ].nombre }
                </div> )
        }

        return item
    }









    //________________________________
    //  LISTA DE MARCAS
    //________________________________
    renderizarListaDeCategorias()
    {
        // GENERACION DE TARJETAS
        let tarjetas = this.state.listaCategorias.map( (categoria , index) => 
        {
            // EVALUAR IMAGEN
            let imagenCategoria: JSX.Element = ( <img 
                src={ categoria.imagenBase64 }
                onClick={ (evento) => {
                    this.mostrarModalCategoria(
                        categoria.id ,
                        categoria.imagenBase64 ,
                        categoria.imagenTipo ,
                        categoria.nombre
                    )
                }} 
            />  )
            if( categoria.imagenBase64 == "" ) {
                imagenCategoria = ( <div  
                    className='iconoImagen'
                    onClick={ (evento) => {
                        this.mostrarModalCategoria(
                            categoria.id ,
                            categoria.imagenBase64 ,
                            categoria.imagenTipo ,
                            categoria.nombre
                        )
                    }} 
                >
                    <FontAwesomeIcon  icon={ faImage } />
                </div> )
            }

            return ( <div 
                className='tarjetaCategoria'
                key={ "tarjetaCategoria-" + index } 
            > 
                { imagenCategoria }

                <div  
                    className='labelCategoria'
                    onClick={ (evento) => {
                        this.mostrarModalCategoria(
                            categoria.id ,
                            categoria.imagenBase64 ,
                            categoria.imagenTipo ,
                            categoria.nombre
                        )
                    }} 
                > { categoria.nombre }  </div>
                
                <Button  
                    className='botonSubcategorias'
                    variant='text'
                    onClick={ (evento) => {
                        let nuevoIndicador = this.state.indicadorSubcategorias.slice( 0 , this.state.indicadorSubcategorias.length )
                        nuevoIndicador.push( categoria )
                        this.setState( (STATE , PROPS) => { return {
                            indicadorSubcategorias: nuevoIndicador
                        }})
                        this.props.dispatchRedux( setPaginaActual( 1 ) )
                        this.getCategorias( 1 )
                    }}
                >
                    Subcategorias
                </Button>

            </div>
        )})

        if( tarjetas.length == 0 ) return null
        return(
        <div  className="contenedorTarjetasCategoria" >
            { tarjetas }
        </div> )
    }



    //________________________________
    //  CONTENEDOR DE PAGINACION < 1 - 2 - 3 ... >
    //________________________________
    addPaginacion()
    {
        let paginas = Math.ceil( this.state.totalCategorias / this.state.categoriasXpagina )
        if( paginas > 1 ) return (
        <Paginacion 
            totalPaginas={ paginas }
            PaginasPorGrupo={ 4 }
            stateRedux={ this.props.stateReduxPaginacion }
            dispatchRedux={ this.props.dispatchRedux }
            handleClick_botonPagina={ this.getCategorias.bind(this) }
        /> )
    }



    addDivResultado()
    {
        let visible = false
        if( this.state.totalCategorias == 0 ) visible = true
        return (
        <DivResultado
            visible={ visible }
            icono={ faSearch }
            texto="No tienes registrada ninguna categoria"
        /> )
    }

    








    









    //=======================================================================
    //              ACTUALIZACION DEL COMPONENTE
    //=======================================================================
    componentDidUpdate( prevProps: Readonly<Props>, prevState: Readonly<State> )
    {
       
    }
    






    //=======================================================================
    //                  DEFINICION DEL HTML
    //=======================================================================
    render() 
    { 
        return(
        <main className='contenedorPagina paginaCategorias' >
            
            <Encabezado  
                { ...this.props } 
                habilitar_BotonRegresar={ true }
                botonRegresar_URL='/Producto'

                habilitar_MenuPrincipal={ false }
                itemsMenuPrincipal={ [] } 
                itemMenuP_seleccionado={ "" }

                habilitar_MenuOpciones={ true }
                itemsMenuOpciones={ this.itemsMenuOpciones }
                itemMenuOp_seleccionado={ "" }

                titulo="Papeleria Geraldine Papeleria Geraldine" 
                tituloTooltip="Nombre de tu Negocio"
            />

            { /* ===================================
                INDICADOR DE SUBCATEGORIAS DE ...
            ======================================== */ }
            { this.renderizarIndicadorSubcategorias() }


            { /* ===================================
                LISTA DE MARCAS
            ======================================== */ }
            { this.renderizarListaDeCategorias() }


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
                MODAL QUE MUESTRA MARCA SELECCIONADA
            ==================================*/}
            <ModalCategoria
                modalVisible={ this.state.modalCategoria_visible }
                headerVisible={ this.state.modalCategoria_headerVisible }
                imagen={ this.state.modalCategoria_imagenBase64 }
                nombre={ this.state.modalCategoria_nombre }

                handleClick_imagen={ this.modalCategoria_handleClick_imagen.bind( this ) }
                handleClick_seleccionar={ this.modalCategoria_handleClick_itemMenuSeleccionar.bind( this ) }
                handleClick_editar={ this.modalCategoria_handleClick_itemMenuEditar.bind( this ) }
                handleClick_eliminar={ this.modalCategoria_handleClick_itemMenuEliminar.bind( this ) }
                handleClick_X={ this.modalCategoria_handleClick_X.bind( this ) }
            />


            { /*==============================
                MODAL MARCA FORMULARIO (EDITAR O NUEVO)
            ==================================*/}
            <ModalFormulario
                modalVisible={ this.state.modalFormulario_visible }
                ID_categoria={ this.state.modalFormulario_id }
                imagen={ this.state.modalFormulario_imagenBase64 }
                nombreOriginal={ this.state.modalFormulario_nombreOriginal }
                nuevoNombre={ this.state.modalFormulario_inputNombre }

                handleClick_botonOK={ this.modalFormulario_handleClick_botonOK.bind( this ) }
                handleClick_X={ this.modalFormulario_handleClick_X.bind( this ) }
                handleChange_inputNombre={ this.modalFormulario_handleChange_inputNombre.bind( this ) }
                handleInputFile_imagen={ this.modalFormulario_handleChange_inputFileImagen.bind( this ) }
                handleClick_botonEliminarImagen={ this.modalFormulario_handleClick_botonEliminarImagen.bind( this ) }
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

