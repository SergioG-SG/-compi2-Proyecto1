import { runInThisContext } from "vm";

export class graficarCST_XML {
    stackPdres: any[];
    stackHijos: any[];
    cont: number;
    codigo: string;

    constructor () {
        this.stackPdres = [];
        this.stackHijos = [];
        this.cont = 0;
        this.codigo = "";
    };

    agreparPadre(nombrePadre:String){
        this.stackPdres.push(nombrePadre);
    };

    agregarHijo(nombreHijo:String){
        this.stackHijos.push(nombreHijo);
    }
}