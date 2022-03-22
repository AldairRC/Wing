
//=====================================================
//  IMPORTACIONES GENERALES
//=====================================================
import React from 'react'

// componentes MUI
import { Button , IconButton , Modal } from "@mui/material"

// iconos
import { 
    faTimesCircle , 
    faCheckCircle ,
    faExclamationCircle,

    IconDefinition
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome'

// css
import "./ModalMensaje.css"








//=====================================================
//  INTERFACES
//=====================================================
export const MENSAJE_CORRECTO = 1
export const MENSAJE_ERROR = 2
export const MENSAJE_PREGUNTA = 3

interface Props 
{
    modalVisible: boolean ,
    handleClick_botonAceptar: Function ,
    handleClick_botonNO: Function ,
    handleClick_botonSI: Function ,
    titulo: string ,
    descripcion: string ,
    tipo: number
}

interface State 
{
}





//=====================================================
//  DEFINCION DEL COMPONENTE
//=====================================================
export default class ModalMensaje extends React.Component<Props , State>
{
    constructor(props: Props)
    {
        super(props)


        /*============================
            INICIALIZACION DEL ESTADO
        ==============================
        this.state = 
        {
        } */
    }






    renderizarIcono()
    {
        let divTipoMensaje = ""
        let divIcono = ""
        let icono: IconDefinition
        switch( this.props.tipo )
        {
            case MENSAJE_CORRECTO: 
                divTipoMensaje = "divTipoMensaje divTipoMensaje_verde"
                divIcono = "divIcono divIcono_verde"
                icono = faCheckCircle
                break
            
            case MENSAJE_ERROR:
                divTipoMensaje = "divTipoMensaje divTipoMensaje_rojo"
                divIcono = "divIcono divIcono_rojo"
                icono = faTimesCircle
                break

            default:
                divTipoMensaje = "divTipoMensaje divTipoMensaje_azul"
                divIcono = "divIcono divIcono_azul"
                icono = faExclamationCircle
                break
        }

        return (
        <div  className={ divTipoMensaje }>
            <div  className={ divIcono } >
                <FontAwesomeIcon  icon={ icono } />
            </div>
        </div> )
    }



    renderizarTitulo()
    {
        let labelTitulo = ""
        switch( this.props.tipo )
        {
            case MENSAJE_CORRECTO: 
                labelTitulo = "labelTitulo labelTitulo_verde"
                break
            
            case MENSAJE_ERROR:
                labelTitulo = "labelTitulo labelTitulo_rojo"
                break

            default:
                labelTitulo = "labelTitulo labelTitulo_azul"
                break
        }
        return (
        <label  className={ labelTitulo }>
            { this.props.titulo }
        </label> )
    }



    renderizarBotonAceptar()
    {
        if( this.props.tipo == MENSAJE_PREGUNTA ) return null

        let botonAceptarCSS = ""
        switch( this.props.tipo )
        {
            case MENSAJE_CORRECTO: 
                botonAceptarCSS = "boton botonVerde"
                break
            
            case MENSAJE_ERROR:
                botonAceptarCSS = "boton botonRojo"
                break

            default:
                botonAceptarCSS = "boton botonAzul"
                break
        }

        return (
        <Button  
            className={ botonAceptarCSS }
            onClick={ (evento) => {   this.props.handleClick_botonAceptar()  }}
        >
            Aceptar
        </Button> )
    }



    renderizarBotonNO()
    {
        if( this.props.tipo != MENSAJE_PREGUNTA ) return null

        return (
        <Button  
            className='boton botonRojo'
            onClick={ (evento) => {   this.props.handleClick_botonNO()  }}
        >
            No
        </Button> )
    }


    renderizarBotonSI()
    {
        if( this.props.tipo != MENSAJE_PREGUNTA ) return null

        return (
        <Button  
            className='boton botonVerde'
            onClick={ (evento) => {   this.props.handleClick_botonSI()  }}
        >
            Si
        </Button> )
    }








    //======================================
    //  DEFINICION DEL HTML
    //======================================
    render() 
    {
    return(
        <Modal 
            className='modalMensaje' 
            open={ this.props.modalVisible }
        >

        <div  className='contenidoModal' >

            { /* ==================================
                ICONO TIPO DE MENSAJE
            =================================== */ }
            { this.renderizarIcono() }

            
            {/*=========================
                TITULO
            =============================*/ }
            { this.renderizarTitulo() }


            {/*=========================
                DESCRIPCION
            =============================*/ }
            <label  className='labelDescripcion'>
                { this.props.descripcion }
            </label>


            {/*=========================
                CONTENEDOR DE BOTONES
            =============================*/ }
            <div  className='divBotones'>

                {/*=========================
                    BOTON ACEPTAR
                =============================*/ }
                { this.renderizarBotonAceptar() }


                {/*=========================
                    BOTON NO
                =============================*/ }
                { this.renderizarBotonNO() }


                {/*=========================
                    BOTON SI
                =============================*/ }
                { this.renderizarBotonSI() }

            </div>

        </div> 
        </Modal>
    )}
}

