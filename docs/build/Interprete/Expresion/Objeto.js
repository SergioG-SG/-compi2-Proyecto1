import { Entorno } from '../../Simbolo/Entorno.js';
export class Objeto {
    constructor(id, texto, linea, columna, listaA, listaO, ide) {
        this.identificador1 = id;
        this.texto = texto;
        this.linea = linea;
        this.columna = columna;
        this.listaAtributos = listaA;
        this.listaObjetos = listaO;
        this.identificador2 = ide;
        this.entorno = new Entorno(null);
    }
}
