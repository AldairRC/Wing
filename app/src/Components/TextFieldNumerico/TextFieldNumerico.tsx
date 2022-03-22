
//=====================================================
//  IMPORTACIONES GENERALES
//=====================================================
import React, { createRef } from 'react'

// componentes MUI
import { 
    TextField ,
    InputAdornment
} from "@mui/material"

// UTILERIAS
import Utilerias from "../../Models/Utilerias"

// css
import "./TextFieldNumerico.css"





//===========================================================================
//                          INTERFACES
//===========================================================================
interface Props 
{
    clasesCSS: string ,
    maxCantidadDigitos: number ,
    titulo: string ,
    textoPredeterminado: string ,
    textoAdicional: string ,
    valorInput: string ,
    handleValorInput: (nuevoNumero : string) => void ,
    maxCantidadCaracteres: number ,
    bloqueado: boolean
}

interface State 
{
    valorInput: string
}





//=====================================================
//  DEFINCION DEL COMPONENTE
//=====================================================
export default class TextFieldNumerico extends React.Component<Props , State>
{
    inputHTML : React.RefObject<HTMLInputElement> = React.createRef()
    caretPosicion : number = 0
    valorInputAnterior: string


    constructor(props: Props)
    {
        super(props)

        /*============================
            INICIALIZACION DEL ESTADO
        ==============================*/
        this.valorInputAnterior = this.props.valorInput
    }



    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State> )
    {
        // ESTABLECER POSICION DEL CARET
        let offsetCaret = this.props.valorInput.length - this.valorInputAnterior.length
        let nuevaPosCaret = this.caretPosicion + offsetCaret
        this.setCaretPosicion( nuevaPosCaret )
        //console.log( "Nueva Posicion Caret: " + nuevaPosCaret )
    }










    //==========================================================================
    //                      LOGICA DE LA PAGINA
    //===========================================================================
    getNumero( numero: string )
    {
        let num = ""
        let digitos = "0123456789"
        for( let i=0;  i<numero.length; i++ ) {
            let caracter = numero.charAt(i)
            if( digitos.indexOf( caracter ) != -1 ) num += caracter
        }
        return num
    }


    setCaretPosicion( posicion : number )
    {
        if (
            (this.inputHTML != null && this.inputHTML != undefined) &&
            (this.inputHTML.current!!.selectionStart || this.inputHTML.current!!.selectionStart === 0 )) 
        {
            //this.inputHTML.current.focus()
            this.inputHTML.current!!.setSelectionRange( posicion , posicion )
        }
    }






    handleInputChange( inputHTML: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> )
    {
        //console.log( "Numero Inicial: " + nuevoNumero )
        let numeroSinComas = this.getNumero( inputHTML.target.value )
        //console.log( "Numero Sin Comas: " + numeroSinComas )
        

        // LIMITAR DIGITOS AL MAXIMO PERMITIDO
        if( numeroSinComas.length > this.props.maxCantidadDigitos ) {
            this.forceUpdate()
            return
        }
        

        // AGREGAR COMAS
        let numeroConComas = Utilerias.getNumeroConComas( numeroSinComas )
        //console.log( "Numero Con Comas : " + numeroConComas )


        // ACTUALIZAR INPUT
        this.props.handleValorInput( numeroConComas )
    }




    handleKeyDown( evento: React.KeyboardEvent<HTMLDivElement> )
    {
        //console.log( "Key: " + evento.key )
        let digitos = "0123456789"
        let caracteresEspeciales = [ "ArrowRight" , "ArrowLeft" , "Backspace" ]
        if( 
            caracteresEspeciales.find( (teclaESP) => teclaESP == evento.key ) == undefined &&
            digitos.indexOf( evento.key ) == -1
        ){
            evento.preventDefault()
        } 
        else {
            this.caretPosicion = this.inputHTML.current!!.selectionStart as number
            this.valorInputAnterior = this.props.valorInput
            //console.log( "\ncaret posicion: " + this.caretPosicion )
        }
    }







    //=======================================================================
    //                  DEFINICION DEL HTML
    //=======================================================================
    render() 
    {
        //ref={ this.props.refTextField } value={""}
        //console.log( "render ..." )
    return(
        <TextField
            className={ this.props.clasesCSS }
            inputRef={ this.inputHTML }
            label={ this.props.titulo } 
            helperText={ this.props.textoAdicional }
            placeholder={ this.props.textoPredeterminado }
            variant="outlined"  
            type="text"
            required   
            autoComplete='off'
            disabled={ this.props.bloqueado }
            inputProps={{ 
                inputMode: 'numeric', 
                pattern: '[0-9]*' ,
                size: this.props.maxCantidadCaracteres
            }} 
            value={ this.props.valorInput }
            onChange={ ( evento ) => {  this.handleInputChange( evento ) }}
            onKeyDown= { (evento) => { this.handleKeyDown( evento )  }} 
        />
    )}
}
