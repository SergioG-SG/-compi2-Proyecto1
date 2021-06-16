const CST_XML = require('./Analizadores/CSTXML.js');
let ObjetosNode: any;

function ejecutarXML(entrada: string) {
    //Parseo para obtener la raiz o raices  
    ObjetosNode = CST_XML.parse(entrada);
    console.log(ObjetosNode);
};

ejecutarXML(`
<app>
</app>
`);