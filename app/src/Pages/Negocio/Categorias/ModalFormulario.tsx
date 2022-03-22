
//=====================================================
//  IMPORTACIONES GENERALES
//=====================================================
import React from 'react'

// componentes MUI
import { 
    Button , 
    IconButton ,
    Modal ,
    TextField 
} from "@mui/material"

// iconos
import { 
    faTimes
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// utilerias
import Utilerias from "../../../Models/Utilerias"

// css
import "../../../CSS/TextField/TextField_E1.css"
import "./ModalFormulario.css"








//=====================================================
//  INTERFACES
//=====================================================
interface Props 
{
    modalVisible: boolean ,
    handleClick_botonOK: Function ,
    handleClick_X: Function ,
    handleChange_inputNombre: ( nuevoValor: string ) => void ,
    handleClick_botonEliminarImagen: () => void ,
    handleInputFile_imagen: ( imagen: HTMLInputElement ) => void ,

    ID_categoria: string ,
    imagen: string ,
    nombreOriginal: string ,
    nuevoNombre: string
}

interface State 
{
}





//=====================================================
//  DEFINCION DEL COMPONENTE
//=====================================================
export default class ModalFormulario extends React.Component<Props , State>
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




    /*======================================================================================
                        FUNCIONALIDADES
    ========================================================================================*/
    corregirInputNombre()
    {
        let nombre = Utilerias.corregirTexto_quitarEspaciosEnBlanco( this.props.nuevoNombre )
        this.props.handleChange_inputNombre( nombre )
    }











    renderizarBotonesImagenCategoria()
    {
        let botonElegir: JSX.Element | null = null 
        if( this.props.imagen == "" ) {
            botonElegir = (
            <Button
                className='botonVerde'
                onClick={ (evento) => {
                    let selector = document.createElement('input')
                    selector.type = "file"
                    selector.multiple = false
                    selector.accept = "image/*"
                    selector.onchange = (evento) => this.props.handleInputFile_imagen( selector )
                    selector.click()
                }}
            >
                Elegir Imagen
            </Button> )
        }

        let botonEliminar: JSX.Element | null = null 
        if( this.props.imagen != "" ) {
            botonEliminar = (
            <Button
                className='botonRojo'
                onClick={ (evento) => {
                    this.props.handleClick_botonEliminarImagen()
                }}
            >
                Eliminar Imagen
            </Button> )
        }

        return(
        <div  className='divBotonesImagenCategoria'>
            { botonElegir }
            { botonEliminar }
        </div> )
    }







    //======================================
    //  DEFINICION DEL HTML
    //======================================
    render() 
    {
    return(
        <Modal 
            className='modalCategoriaFormulario' 
            open={ this.props.modalVisible }
        >

        <div  className='contenidoModal' >

            { /* ==================================
                ENCABEZADO
            =================================== */ }
            <div  
                className={ 'divHeader' }
            >

                {/*=========================
                    BOTON MENU DE ACCIONES
                =============================*/ }
                <Button  
                    className="botonOK"
                    onClick={ (evento) => { this.props.handleClick_botonOK() }}
                >
                    {
                    ( this.props.ID_categoria == '' )? "Agregar Categoria" : "Guardar Cambios"
                    }
                </Button>


                {/*=========================
                    ICONO X
                =============================*/ }
                <IconButton  
                    className="iconoX"
                    onClick={ (evento) => { this.props.handleClick_X() }}
                >
                    <FontAwesomeIcon  icon={ faTimes } />
                </IconButton>
            </div>

            {/*=========================
                NOMBRE CATEGORIA
            =============================*/ }
            <TextField 
                className={ "TextField_E1 inputNombre" }
                label={ "Nombre" } 
                helperText={ "" }
                placeholder={ (this.props.ID_categoria == "")? "Nombre de la Categoria" : this.props.nombreOriginal }
                variant="outlined"  
                type="text"
                required   
                value={ this.props.nuevoNombre }
                onChange={ (evento) =>  this.props.handleChange_inputNombre( evento.target.value ) }
                inputProps={{
                    autoComplete: 'off'
                }}
                onBlur= { (evento) => { this.corregirInputNombre()  }} 
                onKeyDown= { (evento) => { if( evento.key == "Tab" ) evento.preventDefault()  }} 
            />


            {/*=========================
                BOTONES DE ACCION DE LA IMAGEN CATEGORIA
            =============================*/ }
            { this.renderizarBotonesImagenCategoria() }


            {/*=========================
                IMAGEN CATEGORIA
            =============================*/ }
            <img  
                src={ this.props.imagen }
            />


        </div> 
        </Modal>
    )}
}

