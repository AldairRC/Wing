
//=====================================================
//  IMPORTACIONES GENERALES
//=====================================================
import React from 'react'
import { NavigateFunction } from 'react-router-dom'

// componentes MUI
import { 
    SwipeableDrawer , 
    Button , 
    IconButton , 
    Tooltip , 
    Zoom , 
    ClickAwayListener 
} from '@mui/material'

// iconos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faEllipsisV , 
    faChevronUp, 
    faChevronLeft ,
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons'

// css
import './EncabezadoMovil.css'




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
    habilitar_BotonRegresar: boolean ,
    habilitar_MenuPrincipal: boolean ,
    habilitar_MenuOpciones: boolean ,

    navigate: NavigateFunction ,
    botonRegresar_URL: string ,

    itemsMenuPrincipal: Item[] ,
    itemMenuP_seleccionado: string ,

    itemsMenuOpciones: Item[] ,
    itemMenuOp_seleccionado: string ,

    titulo: string ,
    tituloTooltip: string
}

interface State 
{
    menuPrincipalVisible: boolean ,
    menuOpcionesVisible: boolean ,
    tooltipTituloVisible: boolean ,
    itemMenuP_seleccionado: Item | undefined ,
    itemMenuOp_seleccionado: Item | undefined
}



//=====================================================
//  DEFINCION DEL COMPONENTE
//=====================================================
export default class Encabezado extends React.Component<Props , State>
{
    constructor(props: Props)
    {
        super(props)

        this.state = 
        {
            menuPrincipalVisible: false ,
            menuOpcionesVisible: false ,
            tooltipTituloVisible: false ,
            itemMenuP_seleccionado: 
                this.props.itemsMenuPrincipal.find( 
                    ( item ) => this.props.itemMenuP_seleccionado == item.texto 
                ) ,
            itemMenuOp_seleccionado: 
                this.props.itemsMenuOpciones.find( 
                    ( item ) => this.props.itemMenuOp_seleccionado == item.texto 
                )
        }
    }




    /*======================================
        METODO QUE RENDERIZA EL BOTON 
        DEL MENU PRINCIPAL
    //======================================*/
    renderizarBotonMenuPrincipal()
    {
        let icono = null
        if( this.state.itemMenuP_seleccionado != undefined ) {
            icono = this.state.itemMenuP_seleccionado.icono
        }

        if( this.props.habilitar_MenuPrincipal == false ) return null
        return (
        <IconButton  
            className='iconoMenu'  
            onClick={ (evento) => this.mostrarMenuLateralPrincipal( true ) }
        >
            <FontAwesomeIcon  icon={ icono } />
        </IconButton> )
    }




    //======================================
    //  METODO QUE RENDERIZA EL MENU PRINCIPAL
    //======================================
    renderizarMenuPrincipal()
    {
        if( this.props.habilitar_MenuPrincipal == false ) return null
        const noBorde = {border: 'none'}
        const styleVacio = {}
        return (
        <SwipeableDrawer
            anchor="left"
            className="menuLateralPrincipal"
            open={ this.state.menuPrincipalVisible }
            onClose={ (evento) => { this.mostrarMenuLateralPrincipal( false ) }}
            onOpen={ (evento) => { this.mostrarMenuLateralPrincipal( true )  }}
        >
            
            { /*_______________________________
                RENDERIZADO DE LAS OPCIONES 
            ____________________________________*/ }
            <div  className="divMenu"> {
                this.props.itemsMenuPrincipal.map( (item , index) => {  return (
                    <Button 
                        className={ (item.texto == this.props.itemMenuP_seleccionado)? "item itemSeleccionado" : "item" } 
                        variant="text"  
                        style={ (index+1 == this.props.itemsMenuPrincipal.length)? noBorde : styleVacio }
                        key={"itemMenuP-" + index}
                            startIcon={  <FontAwesomeIcon  icon={ item.icono } /> }
                            onClick={ (evento) => item.accion() }
                        >
                            
                            <label> {item.texto} </label>
                        </Button>
                    )})
            } </div>

            { /* CIERRE MANUAL DEL MENU LATERAL */ }
            <IconButton  
                className='iconoCerrarMenuLateral'  
                onClick={ (evento) => this.mostrarMenuLateralPrincipal( false ) }
            >   
                <FontAwesomeIcon  icon={ faChevronLeft } />
            </IconButton>

        </SwipeableDrawer> )
    }




    /*======================================
        METODO PARA RENDERIZAR EL BOTON 
        DEL MENU DE OPCIONES
    //======================================*/
    renderizarBotonMenuOpciones()
    {
        if( this.props.habilitar_MenuOpciones == false )  return null
        return (
        <IconButton  
            className="iconoOpciones"
            onClick={ (evento) => this.mostrarMenuLateralOpciones( true ) }
        >
            <FontAwesomeIcon  icon={ faEllipsisV } />
        </IconButton> )
    }



    /*======================================
        METODO PARA RENDERIZAR EL MENU
        LATERAL DE OPCIONES
    ======================================*/
    renderizarMenuOpciones()
    {
        const noBorde = {border: 'none'}
        const styleVacio = {}
        
        if( this.props.habilitar_MenuOpciones == false ) return null
        return (
        <SwipeableDrawer
            anchor="top"
            className="menuLateralOpciones"
            open={ this.state.menuOpcionesVisible }
            onClose={ (evento) => { this.mostrarMenuLateralOpciones( false ) }}
            onOpen={ (evento) => { this.mostrarMenuLateralOpciones( true )  }}
        >
            
            <div  className="divMenu">  
                { 
                // BOTONES ITEMS
                this.props.itemsMenuOpciones.map( (item , index) => {  return (
                <Button 
                    className={ (item.texto == this.props.itemMenuOp_seleccionado)? "item itemSeleccionado" : "item" } 
                    variant="text"  
                    style={ (index+1 == this.props.itemsMenuOpciones.length)? noBorde : styleVacio }
                    key={"itemMenuOp-" + index}
                    startIcon={  <FontAwesomeIcon  icon={ item.icono } />  }
                    onClick={ (evento) => { 
                        this.mostrarMenuLateralOpciones( false )
                        item.accion() 
                    }}
                >
                    <label> {item.texto} </label>
                </Button>  )}) 
                }

                { /* CIERRE MANUAL DEL MENU LATERAL */ }
                <IconButton  
                    className='iconoCerrarMenuLateral'  
                    onClick={ (evento) => this.mostrarMenuLateralOpciones( false ) }
                >
                    <FontAwesomeIcon  icon={ faChevronUp } />
                </IconButton>
            </div>

        </SwipeableDrawer> )
    }




    /*======================================
        METODO PARA RENDERIZAR EL MENU
        LATERAL DE OPCIONES
    ======================================*/
    renderizarBotonRegresar()
    {
        if( this.props.habilitar_BotonRegresar == false ) return null
        return (
        <IconButton  
            className="botonRegresar"
            onClick={ (evento) => this.props.navigate( this.props.botonRegresar_URL ) }
        >
            <FontAwesomeIcon  icon={ faArrowLeft } />
        </IconButton> )
    }





    mostrarTooltipTitulo( visible: boolean )
    {
        this.setState({
            ...this.state ,
            tooltipTituloVisible: visible
        })
    }

    mostrarMenuLateralPrincipal( visible: boolean )
    {
        this.setState({
            ...this.state ,
            menuPrincipalVisible: visible
        })
    }

    mostrarMenuLateralOpciones( visible: boolean )
    {
        this.setState({
            ...this.state ,
            menuOpcionesVisible: visible
        })
    }





    
    //======================================
    //  DEFINICION DEL HTML
    //======================================
    render() 
    {
        return (
        <header  className='ContenedorEncabezado'>
            { /* ==========================
                ICONO DEL MENU PRINCIPAL 
                ========================== */ }
            { this.renderizarBotonMenuPrincipal() }


            { /* ==========================
                ICONO DEL BOTON REGRESAR 
                ========================== */ }
            { this.renderizarBotonRegresar() }


            { /*==========================
                TITULO DEL ENCABEZADO 
                ==========================*/ }
            <ClickAwayListener onClickAway={ (evento) => this.mostrarTooltipTitulo( false ) }>
            <Tooltip  
                title={ 
                    <div  className='div-TooltipTitulo'>
                        <label  className='titulo'> { this.props.tituloTooltip } </label>
                        <label  className='descripcion'> { this.props.titulo } </label>
                    </div>
                }
                TransitionComponent={Zoom}  
                arrow  
                enterDelay={500} 
                leaveDelay={500} 
                disableFocusListener
                disableHoverListener
                disableTouchListener
                open={ this.state.tooltipTituloVisible }
            >
                <label  
                    className='titulo'
                    onClick={ (evento) => this.mostrarTooltipTitulo( true ) }
                >
                    { this.props.titulo }
                </label>
            </Tooltip>
            </ClickAwayListener>


            { /*========================================
                    ICONO DE SUB-OPCIONES 
                ( AGREGAR , GUARDAR CAMBIOS , ETC... )
            ============================================*/ }
            { this.renderizarBotonMenuOpciones() }


            { /* ================================
                MENU LATERAL PRINCIPAL
            ===================================== */ }
            { this.renderizarMenuPrincipal() }
                


            { /* ==================================
                MENU LATERAL DE SUB-OPCIONES
            ======================================= */ }
            { this.renderizarMenuOpciones() }

        </header> )
    }
}

/*
(event: React.KeyboardEvent | React.MouseEvent) => {
    }
    */