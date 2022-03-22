
//=====================================================
//  IMPORTACIONES GENERALES
//=====================================================
import React, { createRef } from 'react'
import { NavigateFunction } from 'react-router-dom'

// componentes MUI
import { 
    TextField ,
    Autocomplete , 
    Paper
} from "@mui/material"

// css
import "./TextFieldConSugerenciasMovil.css"





//===========================================================================
//                          INTERFACES
//===========================================================================
export interface TextoSugerencia
{
    label: string ,
    key: string ,
    categoria: string
}

interface Props 
{
    CSS: string ,
    sugerencias: TextoSugerencia[] ,
    titulo: string ,
    textoPredeterminado: string ,
    componenteAyuda: JSX.Element | null ,
    inputError: boolean ,
    esRequerido: boolean ,
    valorInput: string ,
    handleChange_valorInput: ( nuevoValor: string) => void ,
    handleEvento_keyDown: ( evento: React.KeyboardEvent<HTMLDivElement> ) => void ,
    handleEvento_focusPerdido: () => void
}

interface State 
{
    valorAutocomplete: TextoSugerencia | null
}





//=====================================================
//  DEFINCION DEL COMPONENTE
//=====================================================
export default class TextFieldConSugerencias extends React.Component<Props , State>
{
    constructor(props: Props)
    {
        super(props)

        /*============================
            INICIALIZACION DEL ESTADO
        ==============================*/
        this.state = 
        {
            valorAutocomplete: null
        }
    }










    //==========================================================================
    //                      LOGICA DE LA PAGINA
    //===========================================================================
    handleChange_input( nuevoValor: string )
    {
        let nuevoValorAutocomplete = this.state.valorAutocomplete
        if( nuevoValorAutocomplete != null && nuevoValor != nuevoValorAutocomplete.label ) {
            nuevoValorAutocomplete = null
        }
        this.props.handleChange_valorInput( nuevoValor )
        this.setState( (STATE , PROPS) => { return {
            valorAutocomplete: nuevoValorAutocomplete
        }})
    }



    //=======================================================================
    //                  DEFINICION DEL HTML
    //=======================================================================
    render() 
    {
        //ref={ this.props.refTextField } value={""}
    return(
    <div className={"InputTextoConSugerencia " + this.props.CSS } >
        <Autocomplete
            freeSolo
            options={this.props.sugerencias}
            groupBy={ (opcion) => opcion.categoria }
            getOptionLabel={ (opcion) => opcion.label  }

            inputValue={ this.props.valorInput }
            value={ this.state.valorAutocomplete }

            onInputChange={ ( evento , nuevoValor ) => { this.handleChange_input( nuevoValor ) }}
            onChange={ ( evento , nuevoValor ) => {
                this.setState( (STATE , PROPS) => {  return {
                    valorAutocomplete: nuevoValor as TextoSugerencia
                }})
            }}

            renderInput={ (params) => {
                return ( <TextField 
                    {...params}   
                    className="TextField_E1"  
                    label={ this.props.titulo }
                    error={ this.props.inputError }
                    required={ this.props.esRequerido }
                    autoComplete='off'
                    placeholder={ this.props.textoPredeterminado }
                />)
            }}  
            renderOption={ (props, opcion) => (
                <li  key={ opcion.key }  {...props} >
                    { opcion.label }
                </li>
            )}  
            PaperComponent={ ({ children }) => (
                <Paper  className="comboInputSugerencia"> {children} </Paper>
            )}   

            onKeyDown={ (evento ) => { this.props.handleEvento_keyDown( evento ) } } 
            onBlur={ (evento) => { this.props.handleEvento_focusPerdido() } }
        />

        { this.props.componenteAyuda }
    </div> )}
}

