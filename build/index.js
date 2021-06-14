"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tipo_js_1 = require("./Simbolo/Tipo.js");
const Entorno_js_1 = require("./Simbolo/Entorno.js");
const Simbolo_js_1 = require("./Simbolo/Simbolo.js");
const GraficarAST_js_1 = require("./Graficador/GraficarAST.js");
const TError_js_1 = require("./Interprete/Util/TError.js");
const gramaticaXML = require('./Analizadores/gramaticaXML.js');
const gramaticaXMLD = require('./Analizadores/gramaticaXMLDSC.js');
const gramaticaXpath = require('./Analizadores/gramaticaXPath.js');
let ObjetosXML;
let resultadoxpath = "";
let cadenaReporteTS = ` <thead><tr><th scope="col">Nombre</th><th scope="col">Tipo</th><th scope="col">Ambito</th><th scope="col">Fila</th><th scope="col">Columna</th>
                        </tr></thead>`;
//Esta funcion es para mientras en lo que sincroniza con la pag
ejecutarXML(`
<?xml version="1.0" encoding="UTF-8" ?>

<biblioteca dir="calle 3>5<5" prop="Sergio's">
    <libro>
        <titulo>Libro A</titulo>
        <autor>Julio &amp;Tommy&amp; Garcia</autor>
        <fechapublicacion ano="2001" mes="Enero"/>
    </libro>

    <libro>
        <titulo>Libro B</titulo>
        <autor>Autor 2 &amp; Autor 3</autor>
        <descripcion> holi </descripcion>
        <fechapublicacion ano="2002" mes="Febrero"/>
    </libro>

</biblioteca>
`);
realizarGraficaAST();
//   tablaErroresFicticia()
//accionesEjecutables()
//tablaErroresFicticia()
function ejecutarXML(entrada) {
    cadenaReporteTS = ` <thead><tr><th scope="col">Nombre</th><th scope="col">Tipo</th><th scope="col">Ambito</th><th scope="col">Fila</th><th scope="col">Columna</th>
                        </tr></thead>`;
    //Parseo para obtener la raiz o raices  
    const objetos = gramaticaXML.parse(entrada);
    ObjetosXML = objetos;
    ejecutarXpath("/biblioteca");
    const entornoGlobal = new Entorno_js_1.Entorno(null);
    //funcion recursiva para manejo de entornos
    objetos.forEach((objeto) => {
        if (objeto.identificador1 == "?XML") {
            //Acciones para el prologo
        }
        else {
            cadenaReporteTS += `<tr>`;
            llenarTablaXML(objeto, entornoGlobal, null);
            cadenaReporteTS += `</tr>`;
        }
    });
    //esta es solo para debug jaja
    const ent = entornoGlobal;
    console.log(cadenaReporteTS);
    return cadenaReporteTS;
}
;
function recorrer(nodo) {
    if (nodo.texto != '') {
        resultadoxpath += nodo.texto + "\n";
    }
    //console.log(nodo.texto)
    if (nodo.listaObjetos.length != undefined) {
        if (nodo.listaObjetos.length > 0) {
            nodo.listaObjetos.forEach((objetoHijo) => {
                recorrer(objetoHijo);
            });
        }
    }
}
function ejecutarXpath(entrada) {
    const objetos = gramaticaXpath.parse(entrada);
    objetos[0][0][0][0][0].forEach((objeto1) => {
        console.log("el resultado de la consulta es: ");
        ObjetosXML.forEach((objeto2) => {
            if (objeto2.identificador1 == "?XML") {
            }
            else if (objeto1.valor == objeto2.identificador1) {
                recorrer(objeto2);
            }
        });
    });
    console.log(resultadoxpath + "ver");
}
;
function ejecutarXML_DSC(entrada) {
    const objetos = gramaticaXMLD.parse(entrada);
    ObjetosXML = objetos;
    const entornoGlobal = new Entorno_js_1.Entorno(null);
}
;
function llenarTablaXML(objeto, entorno, padre) {
    //Inicializamos los entornos del objeto
    const entornoObjeto = new Entorno_js_1.Entorno(null);
    //Verificamos si tiene atributos para asignarselos
    if (objeto.listaAtributos.length > 0) {
        objeto.listaAtributos.forEach((atributo) => {
            //ESto para el llenada
            const simbolo = new Simbolo_js_1.Simbolo(Tipo_js_1.Tipo.ATRIBUTO, atributo.identificador, atributo.linea, atributo.columna, atributo.valor.replace(/['"]+/g, ''), entornoObjeto);
            entornoObjeto.agregar(simbolo.indentificador, simbolo);
            //Esto es para la graficada de la tabla de simbolos
            cadenaReporteTS += `<tr>`;
            cadenaReporteTS += `<td>${simbolo.indentificador}</td><td>Atributo</td><td>${objeto.identificador1}</td><td>${atributo.linea}</td><td>${atributo.columna}</td>`;
            cadenaReporteTS += `<tr>`;
        });
    }
    //Verificamos si tiene texto para agregarselo
    if (objeto.texto != '') {
        const simbolo = new Simbolo_js_1.Simbolo(Tipo_js_1.Tipo.ATRIBUTO, 'textoInterno', objeto.linea, objeto.columna, objeto.texto, entornoObjeto);
        entornoObjeto.agregar(simbolo.indentificador, simbolo);
        //Esto es para la graficada de la tabla de simbolos
        // cadenaReporteTS+=`<td>${objeto.texto}</td><td>Atributo</td><td>${objeto.identificador1}</td><td>${objeto.linea}</td><td>${objeto.columna}</td>`
    }
    //Agregamos al entorno global
    objeto.entorno = entornoObjeto;
    const simbolo = new Simbolo_js_1.Simbolo(Tipo_js_1.Tipo.ETIQUETA, objeto.identificador1, objeto.linea, objeto.columna, objeto, entornoObjeto);
    entorno.agregar(simbolo.indentificador, simbolo);
    //Esto es para la graficada de la tabla de simbolos
    let ambitoTS = "";
    if (padre != null) {
        ambitoTS = padre.identificador1;
    }
    else {
        ambitoTS = "Global";
    }
    cadenaReporteTS += `<tr>`;
    cadenaReporteTS += `<td>${objeto.identificador1}</td><td>Objeto</td><td>${ambitoTS}</td><td>${objeto.linea}</td><td>${objeto.columna}</td>`;
    cadenaReporteTS += `</tr>`;
    //Verificamos si tiene mas hijos para recorrerlos recursivamente
    if (objeto.listaObjetos.length > 0) {
        objeto.listaObjetos.forEach((objetoHijo) => {
            const resultado = objetoHijo;
            llenarTablaXML(objetoHijo, entornoObjeto, objeto);
        });
    }
}
;
function realizarGraficaAST() {
    const graficador = new GraficarAST_js_1.GraficarAST;
    graficador.graficar(ObjetosXML);
}
;
function reporteTablaErrores() {
    let cadenaReporteTE = ` <thead><tr><th scope="col">Tipo</th><th scope="col">Descripcion</th><th scope="col">Archivo</th><th scope="col">Fila</th><th scope="col">Columna</th>
                        </tr></thead>`;
    TError_js_1.errorLex.forEach(element => {
        cadenaReporteTE += `<tr>`;
        cadenaReporteTE += `<td>${element.tipo}</td><td>Objeto</td><td>${element.descripcion}</td><td>${element.analizador}</td><td>${element.linea}</td><td>${element.columna}</td>`;
        cadenaReporteTE += `</tr>`;
    });
    TError_js_1.errorSin.forEach(element => {
        cadenaReporteTE += `<tr>`;
        cadenaReporteTE += `<td>${element.tipo}</td><td>Objeto</td><td>${element.descripcion}</td><td>${element.analizador}</td><td>${element.linea}</td><td>${element.columna}</td>`;
        cadenaReporteTE += `</tr>`;
    });
    TError_js_1.errorSem.forEach(element => {
        cadenaReporteTE += `<tr>`;
        cadenaReporteTE += `<td>${element.tipo}</td><td>Objeto</td><td>${element.descripcion}</td><td>${element.analizador}</td><td>${element.linea}</td><td>${element.columna}</td>`;
        cadenaReporteTE += `</tr>`;
    });
    return cadenaReporteTE;
}
;
/*ejecutarXML_DSC(`
<?xml version="1.0" encoding="UTF-8" ?>

<biblioteca dir="calle 3>5<5" prop="Sergio's">
    <libro>
        <titulo>Libro A</titulo>
        <autor>Julio &amp;Tommy&amp; Garcia</autor>
        <fechaPublicacion ano="2001" mes="Enero"/>
    </libro>

    <libro>
        <titulo>Libro B</titulo>
        <autor>Autor 2 &amp; Autor 3</autor>
        <descripcion> holi </descripcion>
        <fechaPublicacion ano="2002" mes="Febrero"/>
    </libro>

  
</biblioteca>

<hemeroteca dir="zona 21" prop="kev" estado="chilera">
    
</hemeroteca>
`);*/
module.exports = { ejecutarXML, realizarGraficaAST, reporteTablaErrores };
