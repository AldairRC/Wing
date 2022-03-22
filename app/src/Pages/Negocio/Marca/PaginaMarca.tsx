
//=====================================================
//  IMPORTACIONES GENERALES
//=====================================================
import React from 'react'
import { NavigateFunction } from 'react-router-dom'

// componentes MUI
import { 
    Button , 
    IconButton ,
    TextField
} from "@mui/material"

// mis componentes
import ModalMarca from './ModalMarca'
import ModalFormulario from './ModalFormulario'

// iconos
import { 
    faHome , 
    faClipboardList , 
    faDolly , 
    faBoxes , 
    faListUl , 
    faFilter , 
    faPlus ,
    faSearch ,
    faEllipsisH ,
    faImage
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// mis componentes
import Encabezado , { Item } from '../../../Components/Encabezado/Encabezado'
import Paginacion from '../../../Components/Paginacion/Paginacion'
import DivResultado from '../../../Components/DivResultado/DivResultado'
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
    ReduxProducto_setMarcaActual
} from "../../../Redux/Controladores/controladorProducto"
/*_________________
 redux store
___________________*/
import { AppDispatch } from "../../../Redux/store"

// utilerias
import Utilerias from "../../../Models/Utilerias"

// css
import "../../../CSS/TextField/TextField_E1.css"
import "./PaginaMarca.css"









//===========================================================================
//                          INTERFACES
//===========================================================================
interface Marca 
{
    id: string ,
    id_negocio: string ,
    nombre: string ,
    imagenBase64: string ,
    imagenTipo: string
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
    /*================================ 
        MODAL MARCA
    ==================================*/
    // PARTE GRAFICA
    modalMarca_visible: boolean ,
    modalMarca_headerVisible: boolean ,
    // DATOS
    modalMarca_id: string ,
    modalMarca_nombre: string ,
    modalMarca_imagenBase64: string ,  // data:image/png;base64,<...>
    modalMarca_imagenTipo: string ,


    /*================================ 
        MODAL FORMULARIO
    ==================================*/
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


    listaMarcas: Marca[] ,
    totalMarcas: number ,

    marcasXpagina: number
}





//=====================================================
//  DEFINCION DEL COMPONENTE
//=====================================================
export default class PaginaMarca extends React.Component<Props , State>
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
            // ========= MODAL MARCA ==============
            modalMarca_visible: false ,
            modalMarca_headerVisible: true ,
            modalMarca_id: "" ,
            modalMarca_nombre: "" ,
            modalMarca_imagenBase64: "" ,
            modalMarca_imagenTipo: "" ,


            // ========= MODAL FORMULARIO ==============
            modalFormulario_visible: false ,
            modalFormulario_id: "" ,
            modalFormulario_nombreOriginal: "" ,
            modalFormulario_inputNombre: "" ,
            modalFormulario_imagenBase64: "" ,
            modalFormulario_imagenTipo: "" ,


            // ========= MODAL MENSAJE ==============
            modalMensaje_visible: false ,
            modalMensaje_titulo: "" ,
            modalMensaje_descripcion: "" ,
            modalMensaje_tipo: MENSAJE_CORRECTO ,


            listaMarcas: [] ,
            totalMarcas: 0 ,
            marcasXpagina: 2
        }


        /*============================
            INICIALIZACION DE PROPIEDADES
        ==============================*/
        this.itemsMenuOpciones = [
            {
                texto: "Agregar Marca" ,
                icono: faPlus ,
                accion: () => {
                    this.setState( (STATE , PROPS) => { return {
                        modalFormulario_visible: true
                    }})
                }
            } ,
            {
                texto: "Filtrar Marcas" , 
                icono: faFilter ,
                accion: () => alert("/filtrar marcas")
            }
        ]

        // INICIALIZAR PAGINACION
        this.props.dispatchRedux( setPaginaActual( 1 ) )
    }




    componentDidMount() 
    {
        /*============================
            OBTENCION DE LAS MARCAS
        ==============================*/
        this.getMarcas( this.props.stateReduxPaginacion.paginaActual )

    }














    /*===============================================================================
                  OPERACIONES EN LA BASE DE DATOS
    ================================================================================*/
    getMarcas( pagina: number)
    {
        this.props.dispatchRedux( mostrarModalCargando( "Obteniendo marcas ..." ) )
        setTimeout( async () => 
        {
            let respuesta = await Utilerias.postHTTP( "api/negocios/marcas/buscar" , [
                { nombreCampo: "marcasXpagina" , valor: this.state.marcasXpagina + "" } ,
                { nombreCampo: "pagina" , valor: pagina + "" }
            ] )
            console.log( respuesta )
            
            if( respuesta.existeError ) 
            {  
                // ERROR AL OBTENER MARCAS
                this.props.dispatchRedux( ocultarModalCargando() )
                this.mostrar_modalMensajeError( 
                    respuesta.titulo , 
                    respuesta.descripcion ,
                    () => { this.ocultar_modalMensaje() } 
                )
                return
            }
            
            // MARCAS OBTENIDAS
            let query: {
                id: string ,
                id_negocio: string ,
                nombre: string ,
                imagenBase64: string ,
                imagenTipo: string ,
            }[] = []
            query = respuesta.datos.listaMarcas

            let marcasBD: Marca[] = [] 
            query.forEach( (marca) => { 
                marcasBD.push({
                    id: marca.id ,
                    id_negocio: marca.id_negocio ,
                    nombre: marca.nombre ,
                    imagenBase64: marca.imagenBase64 ,
                    imagenTipo: marca.imagenTipo
                })
            })
            this.setState( (STATE , PROPS) => { return {
                listaMarcas: marcasBD ,
                totalMarcas: respuesta.datos.totalMarcas
            }})
            this.props.dispatchRedux( ocultarModalCargando() )
        } , 900 )
    }


    insertarMarca()
    {
        this.props.dispatchRedux( mostrarModalCargando( "Agregando Marca ..." ) )
        setTimeout( async () => 
        {
            let respuesta = await Utilerias.postHTTP( "api/negocios/marcas/insertar" , [
                { nombreCampo: "id_negocio" , valor: "N/A" } ,
                { nombreCampo: "nombre" , valor: this.state.modalFormulario_inputNombre } ,
                { nombreCampo: "imagen" , valor: this.state.modalFormulario_imagenBase64 } ,
                { nombreCampo: "tipoImagen" , valor: this.state.modalFormulario_imagenTipo }
            ])
            console.log( respuesta )

            if( respuesta.existeError ) 
            {  
                // ERROR AL INSERTAR MARCA
                this.props.dispatchRedux( ocultarModalCargando() )
                this.mostrar_modalMensajeError( 
                    respuesta.titulo , 
                    respuesta.descripcion ,
                    () => { this.ocultar_modalMensaje() } 
                )
                return
            }
            
            // MARCA INSERTADA EN LA BD
            this.props.dispatchRedux( ocultarModalCargando() )

            this.mostrar_modalMensajeCorrecto( 
                respuesta.titulo ,
                respuesta.descripcion ,
                () => {
                    this.ocultar_modalMensaje()
                    this.ocultarModalFormulario()
                    this.getMarcas( this.props.stateReduxPaginacion.paginaActual )
                }
            )
        } , 900 )
    }


    actualizarMarca()
    {
        let nombreMarca = ""
        if( this.state.modalFormulario_inputNombre == "" ) nombreMarca = this.state.modalFormulario_nombreOriginal
        else nombreMarca = this.state.modalFormulario_inputNombre


        this.props.dispatchRedux( mostrarModalCargando( "Actualizando Marca ..." ) )
        setTimeout( async () => 
        {
            let respuesta = await Utilerias.postHTTP( "api/negocios/marcas/actualizar" , [
                { nombreCampo: "id_marca" , valor: this.state.modalFormulario_id } ,
                { nombreCampo: "nombre" , valor: nombreMarca } ,
                { nombreCampo: "imagen" , valor: this.state.modalFormulario_imagenBase64 } ,
                { nombreCampo: "imagenTipo" , valor: this.state.modalFormulario_imagenTipo }
            ])
            console.log( respuesta )

            if( respuesta.existeError ) 
            {  
                // ERROR AL ACTUALIZAR MARCA
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
            
            // MARCA ACTUALIZADA EN LA BD
            this.props.dispatchRedux( ocultarModalCargando() )

            this.mostrar_modalMensajeCorrecto( 
                respuesta.titulo ,
                respuesta.descripcion ,
                () => {
                    this.ocultar_modalMensaje()
                    this.ocultarModalFormulario()
                    this.getMarcas( this.props.stateReduxPaginacion.paginaActual )
                }
            )
        } , 900 )
    }



    eliminarMarca()
    {
        this.props.dispatchRedux( mostrarModalCargando( "Eliminando Marca ..." ) )
        setTimeout( async () => 
        {
            let respuesta = await Utilerias.postHTTP( "api/negocios/marcas/eliminar" , [
                { nombreCampo: "id_marca" , valor: this.state.modalMarca_id }
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
            
            // MARCA ELIMINADA EN LA BD
            //console.log( respuesta.datos )
            this.props.dispatchRedux( ocultarModalCargando() )

            this.mostrar_modalMensajeCorrecto( 
                respuesta.titulo , 
                respuesta.descripcion ,
                () => {
                    this.ocultar_modalMensaje()
                    this.ocultarModalMarca()
                    this.getMarcas( this.props.stateReduxPaginacion.paginaActual )
                }
            )
        } , 900 )
    }























    //=====================================================================
    //                  MODAL MARCA SELECCIONADA
    //=====================================================================
    modalMarca_handleClick_imagen() {
        //console.log( "click en imagen marca" )
        this.setState( (STATE, PROPS) => { return {
            modalMarca_headerVisible: !STATE.modalMarca_headerVisible
        }})
    }

    modalMarca_handleClick_X() { this.ocultarModalMarca()  }

    modalMarca_handleClick_itemMenuSeleccionar() {
        this.props.dispatchRedux( ReduxProducto_setMarcaActual({ 
            id: this.state.modalMarca_id ,
            nombre: this.state.modalMarca_nombre ,
            imagen: this.state.modalMarca_imagenBase64 ,
            imagenTipo: this.state.modalMarca_imagenTipo
        }))
        this.props.navigate( '/Producto' )
    }

    modalMarca_handleClick_itemMenuEditar() 
    {
        this.mostrarModalFormulario(
            this.state.modalMarca_id ,
            this.state.modalMarca_nombre ,
            this.state.modalMarca_imagenBase64 ,
            this.state.modalMarca_imagenTipo
        )
        this.ocultarModalMarca()
    }

    modalMarca_handleClick_itemMenuEliminar() 
    {
        this.mostrar_modalMensajePregunta(
            'Esta seguro de eliminar la marca "' + this.state.modalMarca_nombre + '" ?' ,
            "Esto causara que todos los productos que tengan esta marca asignada queden con N/A" ,
            () => {  // NO
                this.ocultar_modalMensaje()
            } ,
            () => {  // SI
                this.ocultar_modalMensaje()
                this.eliminarMarca()
            }
        )
    }



    mostrarModalMarca( idMarca: string , imagenBase64: string , imagenTipo: string ,
        nombre: string )
    {
        this.setState( (STATE , PROPS) => { return {
            modalMarca_id: idMarca ,
            modalMarca_imagenBase64: imagenBase64 ,
            modalMarca_imagenTipo: imagenTipo ,
            modalMarca_nombre: nombre ,
            modalMarca_visible: true ,
            modalMarca_headerVisible: true
        }})
    }

    ocultarModalMarca( )
    {
        this.setState( (STATE , PROPS) => { return {
            modalMarca_id: "" ,
            modalMarca_imagenBase64: "" ,
            modalMarca_imagenTipo: "" ,
            modalMarca_nombre: "" ,
            modalMarca_visible: false
        }})
    }

















    //=====================================================================
    //              HANDLES DEL MODAL MARCA FORMULARIO
    //=====================================================================
    modalFormulario_handleClick_botonOK()
    {
        //______________________________________________
        // CUANDO EL FORMULARIO ESPERA UNA MARCA NUEVA
        //______________________________________________
        if( this.state.modalFormulario_id == "" ) 
        {
            // VALIDAR NOMBRE
            //console.log( this.state.inputNombre_form )
            if( this.state.modalFormulario_inputNombre == "" ) 
            {
                this.mostrar_modalMensajeError( 
                    "Datos Incompletos" , 
                    "Establezca el nombre de la marca" ,
                    () => {  this.ocultar_modalMensaje()  }
                )
                return
            }

            // VALIDAR IMAGEN
            if( this.state.modalFormulario_imagenBase64 == "" ) {
                this.mostrar_modalMensajePregunta( 
                    "Imagen NO establecida" , 
                    "Desea guardar esta marca sin imagen?" ,
                    () => {   // BOTON NO
                        this.ocultar_modalMensaje()
                    } ,
                    () => {   // BOTON SI
                        this.ocultar_modalMensaje()
                        this.insertarMarca()
                    }
                )
                return
            }

            this.insertarMarca()
        }

        //______________________________________________
        // CUANDO EL FORMULARIO EDITA UNA MARCA
        //______________________________________________
        else
        {
            // VALIDAR IMAGEN
            if( this.state.modalFormulario_imagenBase64 == "" ) {
                this.mostrar_modalMensajePregunta( 
                    "Imagen NO establecida" , 
                    "Desea guardar esta marca sin imagen?" ,
                    () => {   // BOTON NO
                        this.ocultar_modalMensaje()
                    } ,
                    () => {   // BOTON SI
                        this.ocultar_modalMensaje()
                        this.actualizarMarca()
                    }
                )
                return
            }
            
            // DATOS COMPLETOS
            this.actualizarMarca()
        }
    }


    modalFormulario_handleChange_inputNombre( nuevoValor: string ) {
        this.setState( (STATE, PROPS) => {  return {
            modalFormulario_inputNombre: nuevoValor
        }})
    }


    modalFormulario_handleClick_X() {  this.ocultarModalFormulario()  }


    modalFormulario_handleClick_eliminarImagen() {
        this.setState( (STATE, PROPS) => {  return {
            modalFormulario_imagenBase64: "" ,
            modalFormulario_imagenTipo: ""
        }})
    }


    //____________________________________
    //  METODO QUE CONTROLA EL INPUT FILE
    //  CUANDO EL USUARIO ELIGE UNA IMAGEN MARCA
    //____________________________________
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
                        "Algo salio mal al cargar la imagen" ,
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
                    "Algo salio mal al cargar la imagen" ,
                    "Vuelva a intentarlo" ,
                    () => this.ocultar_modalMensaje()
                )
                console.log( "ERROR getImagen inputFileMarca: \n" + ERROR )
            }
        }
    }



    mostrarModalFormulario( id_marca: string = "" , nombreOriginal: string = "" ,
        imagenBase64: string = "" , imagenTipo: string = ""
    ) 
    {
        this.setState( (STATE, PROPS) => {  return {
            modalFormulario_visible: true ,
            modalFormulario_id: id_marca ,
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
    //  LISTA DE MARCAS
    //________________________________
    renderizarListaDeMarcas()
    {
        // GENERACION DE TARJETAS
        let tarjetas = this.state.listaMarcas.map( (marca , index) => {
            // EVALUAR IMAGEN
            let imagenMarca: JSX.Element = ( <img src={ marca.imagenBase64 } />  )
            if( marca.imagenBase64 == "" ) {
                imagenMarca = ( <div  className='iconoImagen'>
                    <FontAwesomeIcon  icon={ faImage } />
                </div> )
            }

            return (
            <div 
                className='tarjetaMarca'
                key={ "tarjetaMarca-" + index } 
                onClick={ (evento) => this.mostrarModalMarca( 
                    marca.id , 
                    marca.imagenBase64 , 
                    marca.imagenTipo , 
                    marca.nombre 
                )}
            >
                { imagenMarca }
                <div  className='labelMarca'> { marca.nombre } </div>
            </div>
        )})

        if( tarjetas.length == 0 ) return null
        return(
        <div  className="contenedorTarjetasMarca" >
            { tarjetas }
        </div> )
    }



    //________________________________
    //  CONTENEDOR DE PAGINACION < 1 - 2 - 3 ... >
    //________________________________
    addPaginacion()
    {
        let paginas = Math.ceil( this.state.totalMarcas / this.state.marcasXpagina )
        if( paginas > 1 ) return (
        <Paginacion 
            totalPaginas={ paginas }
            PaginasPorGrupo={ 4 }
            stateRedux={ this.props.stateReduxPaginacion }
            dispatchRedux={ this.props.dispatchRedux }
            handleClick_botonPagina={ this.getMarcas.bind(this) }
        /> )
    }


    addDivResultado()
    {
        let visible = false
        if( this.state.totalMarcas == 0 ) visible = true
        return (
        <DivResultado
            visible={ visible }
            icono={ faSearch }
            texto="No tienes registrada ninguna marca"
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
        <main className='contenedorPagina paginaMarca' >
            
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
                LISTA DE MARCAS
            ======================================== */ }
            { this.renderizarListaDeMarcas() }


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
            <ModalMarca 
                modalVisible={ this.state.modalMarca_visible }
                headerVisible={ this.state.modalMarca_headerVisible }
                imagen={ this.state.modalMarca_imagenBase64 }
                nombre={ this.state.modalMarca_nombre }

                handleClick_imagen={ this.modalMarca_handleClick_imagen.bind( this ) }
                handleClick_seleccionar={ this.modalMarca_handleClick_itemMenuSeleccionar.bind( this ) }
                handleClick_editar={ this.modalMarca_handleClick_itemMenuEditar.bind( this ) }
                handleClick_eliminar={ this.modalMarca_handleClick_itemMenuEliminar.bind( this ) }
                handleClick_X={ this.modalMarca_handleClick_X.bind( this ) }
            />


            { /*==============================
                MODAL MARCA FORMULARIO (EDITAR O NUEVO)
            ==================================*/}
            <ModalFormulario
                modalVisible={ this.state.modalFormulario_visible }
                ID_marca={ this.state.modalFormulario_id }
                imagen={ this.state.modalFormulario_imagenBase64 }
                nombreOriginal={ this.state.modalFormulario_nombreOriginal }
                nuevoNombre={ this.state.modalFormulario_inputNombre }

                handleClick_botonOK={ this.modalFormulario_handleClick_botonOK.bind( this ) }
                handleClick_X={ this.modalFormulario_handleClick_X.bind( this ) }
                handleChange_inputNombre={ this.modalFormulario_handleChange_inputNombre.bind( this ) }
                eliminarImagenMarca={ this.modalFormulario_handleClick_eliminarImagen.bind( this ) }
                handleInputFile_imagenMarca={ this.modalFormulario_handleChange_inputFileImagen.bind( this ) }
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

