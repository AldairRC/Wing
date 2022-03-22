
//=====================================================
//  IMPORTACIONES GENERALES
//=====================================================
import React from 'react'

// componentes MUI
import { Button , IconButton , Modal } from "@mui/material"

// iconos
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// css
import "./ModalImagenMovil.css"








//=====================================================
//  INTERFACES
//=====================================================
interface Props 
{
    modalVisible: boolean ,
    botonEliminarVisible: boolean ,
    accionEliminar: Function ,
    accionX: Function ,
    accionClickImagen: Function ,
    imagenURL: string ,
    headerVisible: boolean
}

interface State 
{
}





//=====================================================
//  DEFINCION DEL COMPONENTE
//=====================================================
export default class ModalImagen extends React.Component<Props , State>
{
    constructor(props: Props)
    {
        super(props)


        /*============================
            INICIALIZACION DEL ESTADO
        ==============================*/
        this.state = 
        {
        }
    }






    renderizarBotonEliminar()
    {
        if( this.props.botonEliminarVisible == false ) return (<div></div> )
        return(
            <Button
                variant='text'
                className="botonEliminar"
                onClick={ (evento) => { 
                    this.props.accionEliminar()
                }}
            >
                Eliminar
            </Button>
        )
    }





    //======================================
    //  DEFINICION DEL HTML
    //======================================
    render() 
    {
    return(
        <Modal 
            className='modalImagen' 
            open={ this.props.modalVisible }
        >

        <div  className='contenidoModal' >

            { /* ==================================
                ENCABEZADO
            =================================== */ }
            <div  
                className={ ( this.props.headerVisible )? 'divHeader' : 'oculto'}
            >

                {/*=========================
                    BOTON ELIMINAR
                =============================*/ }
                { this.renderizarBotonEliminar() }


                {/*=========================
                    ICONO X
                =============================*/ }
                <IconButton  
                    className="iconoX"
                    onClick={ (evento) => {   this.props.accionX()  }}
                >
                    <FontAwesomeIcon  icon={ faTimes } />
                </IconButton>
            </div>

            <img  
                src={ this.props.imagenURL }   
                onClick={ (evento) => { this.props.accionClickImagen() }} />

        </div> 
        </Modal>
    )}
}

