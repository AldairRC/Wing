
import Utilerias , { Utilerias_Resultado_getImagen } from "./Utilerias"




export default class Producto 
{
    static EXITOSO = 0
    static ERROR_LIMITE_MAX = 1
    static ERROR_NO_IMAGEN = 2
    static ERROR_TAMAÑO_MAX = 3
    

    imagenes: File[] = []
    imagenesURL: string[] = []





    async addImagenes( imgs: File[] )
    {
        let resultado: number[] = []
        for( let i=0;  i<imgs.length;  i++ )
        {
            let imagen: Utilerias_Resultado_getImagen = {
                codigoERROR: 0 ,
                mensajeERROR: "" ,
                base64: "" ,
                tipoImagen: ""
            }
            try {
                imagen = await Utilerias.getImagen( 
                    imgs[i] , 
                    [ "jpg" , "png" , "jpeg" ] , 
                    5000000 
                )
            }
            catch( ERROR ){ 
                console.log( ERROR ) 
                resultado.push( Producto.ERROR_NO_IMAGEN )
                continue
            }

            switch( imagen.codigoERROR ) {
                case Utilerias.ERROR_IMAGEN_TIPO: 
                case Utilerias.ERROR_IMAGEN_LECTURA:
                    resultado.push( Producto.ERROR_NO_IMAGEN )
                    continue

                case Utilerias.ERROR_IMAGEN_SIZE_MAX:
                    resultado.push( Producto.ERROR_TAMAÑO_MAX )
                    continue
            }

            //________________________
            // VERIFICAR SI IMAGENES == 4
            //________________________
            if( this.imagenes.length  == 4 )
            {
                resultado.push( Producto.ERROR_LIMITE_MAX )
                continue
            } 

            //________________________
            // TODO BIEN
            //________________________
                this.imagenesURL.push( imagen.base64 )
                resultado.push( Producto.EXITOSO )
                this.imagenes.push( imgs[i] )
        }
        return resultado
    }


    eliminarImagen( index: number) {
        this.imagenes.splice( index , 1 )
        let FilesEliminados = this.imagenesURL.splice( index , 1 )
        if( FilesEliminados.length != 0 ) return true
        return false
    }


    clonar() 
    {
        let nuevoProducto = new Producto()
        nuevoProducto.imagenes = this.imagenes.slice( 0 , this.imagenes.length )
        nuevoProducto.imagenesURL = this.imagenesURL.slice( 0 , this.imagenesURL.length )
        return nuevoProducto
    }
}