
//=====================================================
//  IMPORTACIONES GENERALES
//=====================================================
import React from 'react'
// componentes MUI
import { Modal } from "@mui/material"
// logo
import logo from "../../RECURSOS/Imagenes/logo.png"
// css
import "./ModalCargandoMovil.css"





//=====================================================
//  INTERFACES
//=====================================================
interface Props 
{
    modalVisible: boolean ,
    texto: string
}

interface State 
{
}



//=====================================================
//  DEFINCION DEL COMPONENTE
//=====================================================
export default class ModalCargando extends React.Component<Props , State>
{
    constructor(props: Props)
    {
        super(props)
    }




    //======================================
    //  DEFINICION DEL HTML
    //======================================
    render() 
    {
    return(
        <Modal
            className="modalCargando"
            open={ this.props.modalVisible }
        >
            <div  className="contenidoModal" >
                <img  src={ logo } />
                <label> { this.props.texto } </label>
            </div>
        </Modal>
    )}
}

