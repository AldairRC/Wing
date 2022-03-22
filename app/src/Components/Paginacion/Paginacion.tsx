
//=====================================================
//  IMPORTACIONES GENERALES
//=====================================================
import React from 'react'
// componentes MUI
import 
    { Button , IconButton } from '@mui/material'
// iconos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft , faCaretRight } from '@fortawesome/free-solid-svg-icons'
// carrusel
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
// clase Swiper
import SwiperClass from "swiper/types/swiper-class"
// modulos Swiper
// Redux
import { stateReduxPaginacion , setPaginaActual } from "../../Redux/Controladores/controladorPaginacion"
import { setModalCargandoVisible } from "../../Redux/Controladores/controladorModal"
import { AppDispatch } from "../../Redux/store"
// css
import './PaginacionMovil.css'




//=====================================================
//  INTERFACES
//=====================================================
interface Props 
{
    totalPaginas: number ,
    PaginasPorGrupo: number
    stateRedux: stateReduxPaginacion ,
    dispatchRedux: AppDispatch ,
    handleClick_botonPagina: ( pagina: number ) => void
}

interface State 
{
}





//=====================================================
//  DEFINCION DEL COMPONENTE
//=====================================================
export default class Paginacion extends React.Component<Props , State>
{
    carrusel: SwiperClass | null
    divPaginaActual: number
    totalDivsPaginas = Math.ceil( this.props.totalPaginas / this.props.PaginasPorGrupo )


    constructor(props: Props)
    {
        super(props)
        this.carrusel = null

        // encontrar el div pagina actual
        this.divPaginaActual = 1
        let encontrado = false
        while( !encontrado )
        {
            let limite = this.props.PaginasPorGrupo * this.divPaginaActual
            if( this.props.stateRedux.paginaActual <= limite ) encontrado = true
            else this.divPaginaActual++
        }
/*  
        this.state = 
        {
            carrusel: null
*/  
    }




    //======================================
    //  METODO PARA RENDERIZAR LAS OPCIONES
    //  DEL MENU PRINCIPAL
    //======================================
    renderizarPaginas()
    {
        let itemsCarrusel: JSX.Element[] = []
        let slider: JSX.Element [] = []
        let divsPaginas: JSX.Element[][] = []

        for( let pagina=1;  pagina<=this.props.totalPaginas;  pagina++ )
        {
            let clasesCSS = "botonPagina"
            if( this.props.stateRedux.paginaActual == pagina )   clasesCSS += " botonPaginaActual"
            let boton = (
                <Button 
                    className={ clasesCSS } 
                    key={ "botonPagina-" + pagina }
                    onClick={ (evento) => {
                        this.props.dispatchRedux( setPaginaActual( pagina ) )
                        this.props.handleClick_botonPagina( pagina )
                    }}
                >
                    { "" + pagina }
                </Button>
            )
            slider.push( boton )
            if( pagina % this.props.PaginasPorGrupo == 0 )
            {
                divsPaginas.push( slider.filter( (boton) => true ) )
                slider = []
            }
        }
        if( slider.length != 0 )  divsPaginas.push( slider.filter( (boton) => true ) )
        console.log( divsPaginas )

        for( let i=0; i<divsPaginas.length;  i++ )
        {
            let item = (
                <SwiperSlide  
                    className="itemCarrusel swiper-no-swiping"  
                    key={ "itemCarruselPaginacion-" + i }
                >
                    { divsPaginas[i] }
                </SwiperSlide>
            )
            itemsCarrusel.push( item )
        }
        return itemsCarrusel
    }




    //======================================
    //  METODO PARA RENDERIZAR EL ICONO ATRAS <=
    //======================================
    renderizarBotonAtras()
    {
        if( this.totalDivsPaginas <= 1 ) return
        let desactivar = false
        if( this.divPaginaActual == 1 ) desactivar = true

        return (
        <IconButton  
            className='iconoPaginacion'  
            disabled={desactivar}
            onClick={ (evento) => 
            {
                if( this.carrusel != null && this.divPaginaActual != 1 ) {
                    this.carrusel.slideTo( --this.divPaginaActual - 1 )
                    this.forceUpdate()
                }
            }}
        >
            <FontAwesomeIcon  icon={ faCaretLeft } />
        </IconButton>
        )
    }



    //======================================
    //  METODO PARA RENDERIZAR EL ICONO SIGUIENTE =>
    //======================================
    renderizarBotonSiguiente()
    {
        if( this.totalDivsPaginas <= 1 ) return
        let desactivar = false
        if( this.divPaginaActual == this.totalDivsPaginas ) desactivar = true

        return (
        <IconButton  
            className='iconoPaginacion'  
            disabled={desactivar}
            onClick={ (evento) => 
            {
                if( this.carrusel != null ) {
                    this.carrusel.slideTo( ++this.divPaginaActual - 1 )
                    this.forceUpdate()
                }
            }}
        >
            <FontAwesomeIcon  icon={ faCaretRight } />
        </IconButton>
        )
    }







    
    //==========================================================
    //  DEFINICION DEL HTML
    //==========================================================
    render() 
    {
    return (
        <div  className='ComponenteDivPaginacion'>
            { /* ==========================
                BOTON ATRAS  <=
                ========================== */ }
            { this.renderizarBotonAtras() }


            { /* ==========================
                CARRUSEL DE PAGINAS
                ========================== */ }
            <Swiper 
                className="carrusel"
                effect={"slide"}
                slidesPerView={ 1 } 
                slidesPerGroup={ 1 }
                spaceBetween={1}
                autoHeight={true}
                allowTouchMove={false}
                onSwiper={ ( carrusel ) => {
                    this.carrusel = carrusel 
                    this.carrusel.slideTo(this.divPaginaActual - 1)
                }}
            >
                { /* PAGINAS DEL CARRUSEL */ }
                { this.renderizarPaginas() }
            </Swiper>


            { /* ==========================
                BOTON SIGUIENTE  =>
                ========================== */ }
            { this.renderizarBotonSiguiente() }
        </div>
    )}
}