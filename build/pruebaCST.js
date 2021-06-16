"use strict";
const CST_XML = require('./Analizadores/CSTXML.js');
let ObjetosNode;
function ejecutarXML(entrada) {
    //Parseo para obtener la raiz o raices  
    ObjetosNode = CST_XML.parse(entrada);
    console.log(ObjetosNode);
}
;
ejecutarXML(`
<app>
</app>
`);
