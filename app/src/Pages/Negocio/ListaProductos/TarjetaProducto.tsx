
//=====================================================
//  IMPORTACIONES GENERALES
//=====================================================
import React from 'react'

// componentes MUI
import { 
    Button , 
    IconButton , 
    Modal ,
    Tooltip , 
    Zoom , 
    ClickAwayListener 
} from '@mui/material'

// iconos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faImage
} from '@fortawesome/free-solid-svg-icons'

// carrusel
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore , {   Pagination , Navigation , EffectCreative } from 'swiper'
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/effect-creative"

// tooltip
import 
    ElementoConTooltip ,
    { classElementoConTooltip }
from '../../../Components/ElementoConTooltip/ElementoConTooltip'

// stateReduxProducto
import { Producto } from '../../../Redux/Controladores/controladorProducto'

// Utilerias
import Utilerias from "../../../Models/Utilerias"

// css
import './TarjetaProductoMovil.css'





//=====================================================
//  INTERFACES
//=====================================================
interface Props 
{
    producto: Producto ,
    handleClick_botonVer: ( id: string ) => void ,
    handleClick_imagen: ( imagenBase64: string ) => void
}

interface State 
{
    modalImagenVisible: boolean ,
    imagenSeleccionada: any
}



//=====================================================
//  INICIALIZAR CARRUSEL
//=====================================================
SwiperCore.use( [Pagination , Navigation , EffectCreative] )






//=====================================================
//  DEFINCION DEL COMPONENTE
//=====================================================
export default class TarjetaProducto extends React.Component<Props , State>
{
    constructor(props: Props)
    {
        super(props)

        this.state = 
        {
            modalImagenVisible: false ,
            imagenSeleccionada: null
        }
    }













    //===============================================================
    //  RENDERIZAR EL CARRUSEL DE IMAGENES
    //===============================================================
    renderizarImagenes()
    {
        if( this.props.producto.imagenes_base64!!.length == 0 ) 
        {
            return ( <div  className='iconoImagen'>
                <FontAwesomeIcon  icon={ faImage } />
            </div> )
        }

        // GENERADOR DE IMAGENES DEL CARRUSEL
        let slidesImagenes = this.props.producto.imagenes_base64!!.map( (img , index) => { return (
            <SwiperSlide  className="itemCarrusel"  key={ "imgCarrusel-" + index}>
                <img 
                    src={ img }
                    onClick={ (evento) => { this.props.handleClick_imagen( img )  }} 
                />
            </SwiperSlide> )})

        return ( <Swiper 
            className="carrusel"
            effect={"creative"}
            slidesPerView={1} 
            slidesPerGroup={1}
            loop={true} 
            autoHeight={true}
            creativeEffect={{
                prev: {
                    shadow: true,
                    translate: [ 0 , 0 , -600 ]
                } ,
                next: {
                    translate: [ "100%", 0, 0 ]
                }
            }}
            pagination={{ clickable: true }} 
            navigation={true} 
        >
        { 
            // IMAGENES DEL CARRUSEL
            slidesImagenes
        }
        </Swiper> )
    }





    





    //====================================================================================
    //                          DEFINICION DEL HTML
    //====================================================================================
    render() 
    {
        let labelDimension: JSX.Element | null = null
        if( this.props.producto.dimension_tipo!! != "N/A" ) {
            let dimension = Utilerias.getNumeroCompletoConComas( this.props.producto.dimension!! , 2 )
            dimension += "  " + this.props.producto.dimension_tipo!!
            labelDimension = ( <label  className='labelDimension'>
                { dimension }
            </label> )
        }

        let labelMarca:JSX.Element | null = null
        if( this.props.producto.marca_nombre!! != "" ) {
            labelMarca = ( <label  className='labelMarca'>
                { this.props.producto.marca_nombre!! + "  " }
            </label> )
        }

    return (
        <div  className='divTarjeta'>

            { /* ==========================
                CARRUSEL DE IMAGENES 
                ========================== */ }
            { this.renderizarImagenes() }


            { /*==========================
                CONTENEDOR DE INFORMACION
                ========================== 
            <div className='contenedorInfo'>
                <div  className='divTexto1'>
                    <ElementoConTooltip
                        descripcionTooltip={ this.props.producto.nombre!! }
                        tituloTooltip="Nombre del Producto"
                        texto={ this.props.producto.nombre!! }
                        icono={ "" }
                        CSS='nombre'
                        tipoElemento={ classElementoConTooltip.ELEMENTO_LABEL }
                    /> 
                    <ElementoConTooltip
                        descripcionTooltip={ this.props.producto.marca_nombre!! }
                        tituloTooltip="Marca del Producto"
                        texto={ this.props.producto.marca_nombre!! }
                        icono={ "" }
                        CSS='marca'
                        tipoElemento={ classElementoConTooltip.ELEMENTO_LABEL }
                    />
                </div>

                <div  className='divTexto2'>
                    <ElementoConTooltip
                        descripcionTooltip={ this.props.producto.dimension!! + "" }
                        tituloTooltip="Dimension del Producto"
                        texto={ this.props.producto.dimension!! + "" }
                        icono={ "" }
                        CSS='dimension'
                        tipoElemento={ classElementoConTooltip.ELEMENTO_LABEL }
                    />
                    <Button  
                        className="botonVer"
                        variant="contained"
                        onClick={ (evento) => alert("hola") }
                    >
                        Ver
                    </Button>
                </div>
            </div>   */ }


            { /*=====================================
                CONTENEDOR DE INFORMACION (EJEMPLO 2)
            =========================================*/ }
            <div className='contenedorInfo2'>
                
                <div  className='divTexto'>
                    <label  className='labelNombre'>
                        { this.props.producto.nombre!! + "  " }
                    </label>
                    
                    { labelMarca }

                    { labelDimension }
                </div>

                <Button  
                    className="botonVer"
                    variant="contained"
                    onClick={ (evento) => {
                        this.props.handleClick_botonVer( this.props.producto.id!! )
                    }}
                >
                    Ver
                </Button>

            </div>
        </div>
    )}
}