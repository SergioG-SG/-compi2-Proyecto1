import { AST } from "./Simbolo/AST";
import { Entorno } from "./Simbolo/Entorno";
import { Instruccion } from "./Interfaces/Instruccion";

const gramaticaXML = require('./gramaticaXML');

function ejecutarXML(entrada:string){
    const instrucciones = gramaticaXML.parse(entrada);

    const entornoGlobal:Entorno = new Entorno(null);
    const ast:AST = new AST(instrucciones);

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