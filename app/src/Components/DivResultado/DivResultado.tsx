
//=====================================================
//  IMPORTACIONES GENERALES
//=====================================================
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// css
import "./DivResultadoMovil.css"





//=====================================================
//  INTERFACES
//=====================================================
interface Props 
{
    visible: boolean ,
    texto: string , 
    icono: any
}

interface State 
{
}



//=====================================================
//  DEFINCION DEL COMPONENTE
//=====================================================
export default class DivResultado extends React.Component<Props , State>
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
        if( this.props.visible ) 
        {
        return (
            <div  className="DivResultado" >
                <FontAwesomeIcon  icon={ this.props.icono }  className="icono" />
                <label> { this.props.texto } </label>
            </div>
        ) 
        }
        else{ return null }
    }
}
