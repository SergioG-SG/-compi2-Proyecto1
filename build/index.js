"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AST_1 = require("./Simbolo/AST");
const Entorno_1 = require("./Simbolo/Entorno");
const gramaticaXML = require('./gramaticaXML');
function ejecutarXML(entrada) {
    const instrucciones = gramaticaXML.parse(entrada);
    const entornoGlobal = new Entorno_1.Entorno(null);
    const ast = new AST_1.AST(instrucciones);
    /*
        instrucciones.forEach((element:Instruccion) => {
            element.ejecutar(entornoGlobal,ast);
      });
    */
}
ejecutarXML(`
    print(1);
    print(true);
    print("hola mundo");
`);
