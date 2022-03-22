
/*===========================================================
    INTERFACES
=============================================================*/
interface DatoFetch {
    nombreCampo: string , 
    valor: string | Blob
}

interface RespuestaHTTP {
    existeError: boolean ,
    titulo: string ,
    descripcion: string ,
    datos: any
}

export interface Utilerias_Resultado_getImagen {
    codigoERROR: number , 
    mensajeERROR: string ,
    base64: string , 
    tipoImagen: string
}







/*==============================================================================================
                                    CLASE UTILERIAS
================================================================================================*/
export default class Utilerias 
{
    static SERVIDOR = "http://localhost:4000/"   //"http://wingmex.herokuapp.com/"  "http://192.168.8.17:4000/"

    static ERROR_IMAGEN_TIPO = 1
    static ERROR_IMAGEN_SIZE_MAX = 2
    static ERROR_IMAGEN_LECTURA = 3
    static ERROR_IMAGEN_MAX_IMAGENES = 4
    static LECTURA_IMAGEN_CORRECTA = 0





    /*==============================================
        OBTENER LA URL (string) DE UN ARCHIVO (FILE)
    ================================================*/
    static getImagen( imagen: File , extensionesValidas: string[] , sizeMax: number )
    {
        return new Promise< Utilerias_Resultado_getImagen >((EXITOSO , ERROR ) => 
        {
            /*__________________________________________
                VERIFICAR SI ES TIPO DE IMAGEN VALIDA
            /___________________________________________*/
            let nombre_extension = imagen.name.split('.')
            let extension = nombre_extension[ nombre_extension.length - 1 ]
            if( extensionesValidas.find( (ext) => ext == extension ) == undefined )
            {
                EXITOSO({ 
                    codigoERROR: Utilerias.ERROR_IMAGEN_TIPO , 
                    mensajeERROR: "NO es un tipo de imagen valido" ,
                    base64: "" ,
                    tipoImagen: ""
                })
                return
            }

            /*__________________________________________
                VERIFICAR TAMAÑO DE IMAGEN
            /___________________________________________*/
            if( imagen.size > sizeMax ) {
                EXITOSO({ 
                    codigoERROR: Utilerias.ERROR_IMAGEN_SIZE_MAX , 
                    mensajeERROR: "El tamaño de la imagen NO es valido" ,
                    base64: "" ,
                    tipoImagen: ""
                })
                return
            }

            let reader = new FileReader()
            reader.onloadend = () => EXITOSO({
                codigoERROR: Utilerias.LECTURA_IMAGEN_CORRECTA ,
                mensajeERROR: "" ,
                base64: reader.result as string ,
                tipoImagen: extension
            })
            reader.onerror = ( evento ) => {
                EXITOSO({
                    codigoERROR: Utilerias.ERROR_IMAGEN_LECTURA ,
                    mensajeERROR: "Vuelva a intentarlo" ,
                    base64: "" ,
                    tipoImagen: ""
                })
            }
            reader.readAsDataURL(imagen)
        })
    }




    /*==============================================
        OBTENER LAS URLs (string) DE LOS ARCHIVOS (FILE)
        Y SUS ESTATUS DE LECTURA
    ================================================*/
    static async getImagenes( imagenes: FileList , extensionesValidas: string[] , sizeMax: number ,
        maxImagenes: number , totalImagenesActuales: number )
    {
        let imagenesBase64: string[] = [] 
        let imagenesTipo: string[] = []
        let imagenesEstatus: number[] = []

        for( let i=0;  i<imagenes.length;  i++ )
        {
            if( totalImagenesActuales == maxImagenes ) {
                imagenesBase64.push( "" )
                imagenesTipo.push( "" )
                imagenesEstatus.push( Utilerias.ERROR_IMAGEN_MAX_IMAGENES )
                continue
            }

            let imagen = await Utilerias.getImagen( imagenes[i] , extensionesValidas , sizeMax )
            imagenesBase64.push( imagen.base64 )
            imagenesTipo.push( imagen.tipoImagen )
            imagenesEstatus.push( imagen.codigoERROR )

            if( imagen.codigoERROR == Utilerias.LECTURA_IMAGEN_CORRECTA ) totalImagenesActuales++
        }

        return {
            imagenesBase64: imagenesBase64 ,
            imagenesTipo: imagenesTipo ,
            imagenesEstatus: imagenesEstatus
        }
    }



    /*==============================================
        OBTENER UN NUMERO FORMATEADO CON COMAS
    ================================================*/
    static getNumeroConComas( numero: string ) {
        let cont = 1
        let num = ""
        for( let i=numero.length - 1;  i>=0;  i-- )
        {
            if( cont == 3 ) {
                cont = 1
                num = "," + numero.charAt( i ) + num
            }
            else {
                cont++
                num = numero.charAt( i ) + num
            }
        }
        if( numero.length != 0 && num.charAt( 0 ) == ',' )  num = num.substring( 1 , num.length )
        return num
    }





    /*==============================================
        OBTENER UN NUMERO (PE.PD) SIN COMAS
    ================================================*/
    static getNumero( PE: string , PD: string , digDecimales: number ) 
    {
        PE = PE.replace( ' ' , '' ).replace( ',' , '' )
        PD = Utilerias.getDecimal( Number(PD) , digDecimales )
        if( PE == "" ) PE = "0"
        if( PD == "" ) PD = "0"
        let numero = Number( PE + "." + PD )
        if( isNaN( numero ) ) return NaN
        else return numero
    }



    static getDecimal( numeroDecimal: number , limiteDigitos: number = -1 )
    {
        let decimal = numeroDecimal + ""
        if( limiteDigitos == -1 ){ return decimal }  
        else if( decimal.length >= limiteDigitos ) return decimal.substring( 0 , limiteDigitos )
        else {
            let dif = limiteDigitos - decimal.length
            return decimal + ("0").repeat( dif )
        }
    }




    static getNumeroCompletoConComas( numero : number , digDecimales: number = -1)
    {
        let PE = ""
        let PD = ""
        if( ( numero + "" ).indexOf( '.') == -1 ) { // SOLO PARTE ENTERA
            return Utilerias.getNumeroConComas( (numero + "") )
        }
        else {
            let partesNumero = (numero + "").split( '.' )
            PE = Utilerias.getNumeroConComas( partesNumero[0] )
            PD = Utilerias.getDecimal( Number( partesNumero[1] ) , digDecimales )
            return PE + "." + PD
        }
    }





    /*=========================================
        REALIZAR PETICION POST AL SERVIDOR
    ===========================================*/
    static async postHTTP( URL: string , datos: DatoFetch[] ):Promise<RespuestaHTTP>
    {
        let body = new FormData()
        datos.forEach( ( dato ) => { body.append( dato.nombreCampo , dato.valor ) })

        try{
            let respuesta = await fetch ( Utilerias.SERVIDOR + URL , 
                { 
                    method: 'POST' ,
                    body: body
                }
            )
            if( respuesta.ok ) // HTTP OK
            {   
                let datosServidor = await respuesta.json()
                return {
                    existeError: datosServidor.existeError ,
                    titulo:  datosServidor.titulo ,
                    descripcion: datosServidor.descripcion ,
                    datos: datosServidor.datos
                }
            }
            else {  // HTTP ERROR
                return {
                    existeError: true ,
                    titulo: "Algo salio mal" ,
                    descripcion: "Por favor verifique su conexion a internet y vuelva a intentarlo" ,
                    datos: respuesta.statusText
                }
            }
        }
        catch( ERROR: any ) { return {
            existeError: true ,
            titulo: "Algo salio mal" ,
            descripcion: "Por favor verifique su conexion a internet y vuelva a intentarlo" ,
            datos: ERROR.message
        }}
    }









    /*============================================================
        QUITAR ESPACIOS EN BLANCO INUTILES
    ==============================================================*/
    static corregirTexto_quitarEspaciosEnBlanco( texto: string )
    {
        let nuevoTexto = ""
        for( let i=0;  i<texto.length;  i++ ) 
        {
            let caracter = texto.charAt( i )
            if( caracter == " " ) {
                if( nuevoTexto == "" || nuevoTexto.charAt( nuevoTexto.length - 1 ) == " " ) continue
                nuevoTexto += caracter
            }
            else {
                nuevoTexto += caracter
            }
        }
        if( nuevoTexto != "" && nuevoTexto.charAt( nuevoTexto.length - 1 ) == " " )  {
            nuevoTexto = nuevoTexto.substring( 0 , nuevoTexto.length - 1 )
        }

        return nuevoTexto
    }
}

 