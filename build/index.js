"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Entorno_1 = require("./Simbolo/Entorno");
const gramaticaXML = require('../Analizador/gramaticaXML');
function ejecutarXML(entrada) {
    const objetos = gramaticaXML.parse(entrada);
    const entornoGlobal = new Entorno_1.Entorno(null);
    //const ast:AST = new AST(instrucciones);
    /*
        instrucciones.forEach((element:Instruccion) => {
            element.ejecutar(entornoGlobal,ast);
      });
    */
}
ejecutarXML(`
<?XML version="1.0" encoding="UTF-8" ?>

<biblioteca dir="calle 3>5<5" prop="Sergio's">
    <libro>
        <titulo>Libro A</titulo>
        <autor>Autor 'A' Julio "Tommy" Garcia</autor>
        <fechaPublicacion ano="2001" mes="Enero"/>
    </libro>

    <libro>
        <titulo>Libro B</titulo>
        <autor>Autor 2</autor>
        <fechaPublicacion ano="2002" mes="Febrero"/>
    </libro>

    <libro>
        <titulo>Libro C</titulo>
        <autor>Autor 3.</autor>
        <fechaPublicacion  ano="2003" mes="Marzo"/>
    </libro>

    <libro>
        <titulo>Libro D/</titulo>
        <autor>Autor 4.4</autor>
        <fechaPublicacion  ano="2004" mes="Abril"/>
    </libro>

    <libro>
        <titulo>Libro E</titulo>
        <autor>Autor 5 !#$%&/()?¡=¿/asd>áé´ríóúÁÉÍÓÚ........</autor>
        <fechaPublicacion  ano="2004" mes="Abril"/>
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
