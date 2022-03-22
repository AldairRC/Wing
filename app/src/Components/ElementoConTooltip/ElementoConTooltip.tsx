
//=====================================================
//  IMPORTACIONES GENERALES
//=====================================================
import React from 'react'

// componentes MUI
import { 
    Tooltip , 
    Zoom , 
    ClickAwayListener , 
    IconButton 
} from '@mui/material'

// componente icono
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// css
import './TooltipPersonalizado.css'





//=====================================================
//  INTERFACES
//=====================================================
export interface Item
{
    texto: string ,
    icono: any ,
    accion: Function
}

interface Props 
{
    tituloTooltip: string ,
    descripcionTooltip: string ,
    texto: string ,
    icono: any ,
    tipoElemento: number ,
    CSS: string
}

interface State 
{
    tooltipVisible: boolean
}


//=====================================================
//  CONSTANTES
//=====================================================
export class classElementoConTooltip 
{
    static ELEMENTO_LABEL = 1
    static ELEMENTO_ICONO = 2
}




//=====================================================
//  DEFINCION DEL COMPONENTE
//=====================================================
export default class ElementoConTooltip extends React.Component<Props , State>
{
    constructor(props: Props)
    {
        super(props)
        this.state = {
            tooltipVisible: false
        }
    }


    renderizarTooltip() {  return (
        <div  className='divContenido'>
            <label  className='titulo'> { this.props.tituloTooltip } </label>
            <label  className='descripcion'> { this.props.descripcionTooltip } </label>
        </div>
    )}


    renderizarElemento()
    {
        // ELEMENTO_LABEL SE TOMA COMO DEFAULT
        let item: JSX.Element = ( 
        <div  
            className={ this.props.CSS }
            onClick={ (evento) => { this.mostrarTooltip( true ) }}
        >  
            { this.props.texto }  
        </div> )

        switch( this.props.tipoElemento )
        {
            case classElementoConTooltip.ELEMENTO_ICONO:
                item = ( 
                <div  
                    className={ this.props.CSS }
                    onClick={ (evento) => { this.mostrarTooltip( true ) }}
                >
                    <FontAwesomeIcon  icon={ this.props.icono } />
                </div> )
                break
        }
        return item
    }



    mostrarTooltip( visible: boolean )
    {
        this.setState({
            ...this.state ,
            tooltipVisible: visible
        })
    }








    
    //======================================
    //  DEFINICION DEL HTML
    //======================================
    render() 
    {
    return (
        <ClickAwayListener onClickAway={ (evento) => this.mostrarTooltip( false ) }>
        <Tooltip  
            title={ this.renderizarTooltip() }
            TransitionComponent={Zoom}  
            arrow  
            enterDelay={500} 
            leaveDelay={500} 
            disableFocusListener
            disableHoverListener
            disableTouchListener
            open={ this.state.tooltipVisible }
        >
            { this.renderizarElemento() }
        </Tooltip>
        </ClickAwayListener>
    )}

}