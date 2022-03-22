
//=====================================================
//  IMPORTACIONES GENERALES
//=====================================================
import React from 'react'

// componentes MUI
import { 
    IconButton , 
    Modal ,
    Menu ,
    MenuItem 
} from "@mui/material"

// iconos
import { 
    faTimes , 
    faBars ,
    faPencilAlt ,
    faVoteYea ,
    faTrash ,
    faImage
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// css
import "./ModalCategoria.css"








//=====================================================
//  INTERFACES
//=====================================================
interface Props 
{
    modalVisible: boolean ,
    handleClick_imagen: Function ,
    handleClick_seleccionar: Function ,
    handleClick_editar: Function ,
    handleClick_eliminar: Function ,
    handleClick_X: Function ,
    headerVisible: boolean ,
    imagen: string ,
    nombre: string
}

interface State 
{
    menuVisible: boolean
}





//=====================================================
//  DEFINCION DEL COMPONENTE
//=====================================================
export default class ModalCategoria extends React.Component<Props , State>
{
    iconoMenu: React.RefObject<HTMLButtonElement> = React.createRef()



    constructor(props: Props)
    {
        super(props)


        /*============================
            INICIALIZACION DEL ESTADO
        ==============================*/
        this.state = 
        {
            menuVisible: false
        }
    }


    ocultarMenu()
    {
        this.setState( (STATE , PROPS) => {  return {
            menuVisible: false
        }})
    }


    renderizarImagenCategoria() {
        let imagen: JSX.Element = ( <img 
            src={ this.props.imagen } 
            onClick={ (evento) => { this.props.handleClick_imagen() }}
        />  )
        if( this.props.imagen == "" ) {
            imagen = ( <div  
                className='iconoImagen'
                onClick={ (evento) => { this.props.handleClick_imagen() }}
            >
                    <FontAwesomeIcon  icon={ faImage } />
            </div> )
        }
        return imagen
    }












    //======================================
    //  DEFINICION DEL HTML
    //======================================
    render() 
    {
    return(
        <Modal 
            className='modalCategoria' 
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
                    BOTON MENU DE ACCIONES
                =============================*/ }
                <IconButton  
                    className="iconoMenuCategoria"
                    ref={ this.iconoMenu }
                    onClick={ (evento) => { 
                        this.setState( (STATE , PROPS) => { return {
                            menuVisible: true
                        }})  
                    }}
                >
                    <FontAwesomeIcon  icon={ faBars } />
                </IconButton>


                {/*=========================
                    MENU
                =============================*/ }
                <Menu
                    className='menuCategoria'
                    anchorEl={ this.iconoMenu.current }
                    open={ this.state.menuVisible }
                    onClose={ (evento) => { this.ocultarMenu()  }}
                >
                    { /*=========== SELECCIONAR =========== */ }
                    <MenuItem 
                        className='itemMenu'
                        onClick={ (evento) => {
                            this.ocultarMenu()
                            this.props.handleClick_seleccionar()
                        }}
                    >
                        <div  className='icono'>
                            <FontAwesomeIcon  className='icono' icon={ faVoteYea } />
                        </div>
                        <label> Seleccionar </label>
                    </MenuItem>

                    { /*=========== EDITAR =========== */ }
                    <MenuItem 
                        className='itemMenu'
                        onClick={ (evento) => {
                            this.ocultarMenu()
                            this.props.handleClick_editar()
                        }}
                    >
                        <div  className='icono'>
                            <FontAwesomeIcon  icon={ faPencilAlt } />
                        </div>
                        <label> Editar </label>
                    </MenuItem>

                    { /*=========== ELIMINAR =========== */ }
                    <MenuItem 
                        className='itemMenu'
                        onClick={ (evento) => {
                            this.ocultarMenu()
                            this.props.handleClick_eliminar()
                        }}
                    >
                        <div  className='icono'>
                            <FontAwesomeIcon  icon={ faTrash } />
                        </div>
                        <label> Eliminar </label>
                    </MenuItem>
                </Menu>


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
                RENDERIZAR IMAGEN CATEGORIA
            =============================*/ }
            { this.renderizarImagenCategoria()  }


            {/*=========================
                NOMBRE MARCA
            =============================*/ }
            <div  className='divNombre'>
                { this.props.nombre }
            </div>

        </div> 
        </Modal>
    )}
}

