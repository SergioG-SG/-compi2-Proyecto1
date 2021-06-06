import { AST } from "./Simbolo/AST";
import { Entorno } from "./Simbolo/Entorno";
import { Instruccion } from "./Interfaces/Instruccion";

const gramaticaXML = require('../gramaticaXML');

function ejecutarXML(entrada:string){
    const instrucciones = gramaticaXML.parse(entrada);

    /*const entornoGlobal:Entorno = new Entorno(null);
    const ast:AST = new AST(instrucciones);

/*    
    instrucciones.forEach((element:Instruccion) => {
        element.ejecutar(entornoGlobal,ast);
  });
*/
}

ejecutarXML(`
<?XML encoding="UTF-8" version="1.0"?>

<biblioteca dir="calle 3" prop="Sergio">
    <libro>
        <titulo>Libro A</titulo>
        <autor>Autor A</autor>
        <fechaPublicacion año="2001" mes="Enero"/>
    </libro>

    <libro>
        <titulo>Libro B</titulo>
        <autor>Autor B</autor>
        <fechaPublicacion año="2002" mes="Febrero"/>
    </libro>

    <libro>
        <titulo>Libro C</titulo>
        <autor>Autor C</autor>
        <fechaPublicacion  año="2003" mes="Marzo"/>
    </libro>

    <libro>
        <titulo>Libro D</titulo>
        <autor>Autor D</autor>
        <fechaPublicacion  año="2004" mes="Abril"/>
    </libro>
</biblioteca>

<hemeroteca>
    <hemeroteca>
        <hemeroteca>
            <hemeroteca>
                <hemeroteca>
                    <hemeroteca>
                        <hemeroteca>
                            <hemeroteca>

                            </hemeroteca>
                        </hemeroteca>
                    </hemeroteca>
                </hemeroteca>
            </hemeroteca>
        </hemeroteca>
    </hemeroteca>
</hemeroteca>
`);