"use strict";
const CST_XML = require('./Analizadores/CSTXML.js');
function ejecutarXML(entrada) {
    //Parseo para obtener la raiz o raices  
    const cadena = CST_XML.parse(entrada);
    console.log(cadena);
}
;
ejecutarXML(`
<app>
</app>

<appp>
</appp>
`);
