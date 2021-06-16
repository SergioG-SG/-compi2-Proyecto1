"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraficarCST_XML = void 0;
class GraficarCST_XML {
    constructor() {
        this.stackPadres = [];
        this.stackHijos = [];
        this.cont = 0;
        this.codigo = "";
    }
    ;
    agregarPadre(nombrePadre) {
        this.stackPadres.push(nombrePadre);
    }
    ;
    agregarHijo(nombreHijo) {
        this.stackHijos.push(nombreHijo);
    }
    ;
    generarCST() {
        while (this.stackHijos.length != 0) {
            var hijo = this.stackHijos.pop();
            var padre = this.stackPadres.pop();
            this.cont++;
            if (padre == "S") {
                this.codigo = 'graph SG {\n';
                this.codigo += '0 [label"S"];\n';
                this.codigo += this.cont + ' [label="' + hijo + '"];\n';
                this.codigo += '0--1;\n';
            }
            else {
                var padrePiv = this.stackPadres.pop();
                if (padrePiv == hijo) {
                    var contPiv = this.cont;
                    this.cont++;
                    this.codigo += this.cont + ' [label="' + hijo + '"];\n';
                    this.codigo += '0--1;\n';
                }
            }
            console.log(hijo, padre);
        }
        this.codigo += '}';
        console.log(this.codigo);
    }
    ;
}
exports.GraficarCST_XML = GraficarCST_XML;
