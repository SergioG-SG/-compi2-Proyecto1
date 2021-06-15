"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graficarCST_XML = void 0;
class graficarCST_XML {
    constructor() {
        this.stackPdres = [];
        this.stackHijos = [];
        this.cont = 0;
        this.codigo = "";
    }
    ;
    agreparPadre(nombrePadre) {
        this.stackPdres.push(nombrePadre);
    }
    ;
    agregarHijo(nombreHijo) {
        this.stackHijos.push(nombreHijo);
    }
}
exports.graficarCST_XML = graficarCST_XML;
