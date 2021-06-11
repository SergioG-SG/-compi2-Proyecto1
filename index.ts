import { AST } from "./Simbolo/AST.js";
import { Tipo } from './Simbolo/Tipo.js'
import { Entorno } from "./Simbolo/Entorno.js";
import { Instruccion } from "./Interfaces/Instruccion.js";
import { Objeto } from "./Interprete/Expresion/Objeto.js";
import { Simbolo } from "./Simbolo/Simbolo.js";
import { Atributo } from "./Interprete/Expresion/Atributo.js";
import { GraficarAST } from "./Graficador/GraficarAST.js";
import { ELexico, ESintactico, errorLex, errorSem,errorSin } from "./Interprete/Util/TError.js";
const gramaticaXML = require('./Analizadores/gramaticaXML.js');
const gramaticaXMLD = require('./Analizadores/gramaticaXMLDSC.js');

let ObjetosXML :any

//Esta funcion es para mientras en lo que sincroniza con la pag
function accionesEjecutables() {

    ejecutarXML(`
<?XML version="1.0" encoding="UTF-8" ?>

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
`);
realizarGraficaAST()
tablaErroresFicticia()
}

accionesEjecutables()


function ejecutarXML(entrada: string) {

    //Parseo para obtener la raiz o raices  
    const objetos = gramaticaXML.parse(entrada);
    ObjetosXML = objetos;
    const entornoGlobal: Entorno = new Entorno(null);
    //funcion recursiva para manejo de entornos
    objetos.forEach((objeto: Objeto) => {
        if (objeto.identificador1 == "?XML") {
            //Acciones para el prologo
        } else {
            llenarTablaXML(objeto, entornoGlobal);
        }
    })
    //esta es solo para debug jaja
    const ent = entornoGlobal;
};

function ejecutarXML_DSC(entrada: string){
    const objetos = gramaticaXMLD.parse(entrada);
};

function llenarTablaXML(objeto: Objeto, entorno: Entorno) {

    //Inicializamos los entornos del objeto
    const entornoObjeto: Entorno = new Entorno(null)
    //Verificamos si tiene atributos para asignarselos
    if (objeto.listaAtributos.length > 0) {
        objeto.listaAtributos.forEach((atributo: Atributo) => {
            const simbolo: Simbolo = new Simbolo(Tipo.ATRIBUTO, atributo.identificador, atributo.linea, atributo.columna, atributo.valor.replace(/['"]+/g, ''), entornoObjeto)
            entornoObjeto.agregar(simbolo.indentificador, simbolo)
        })
    }
    //Verificamos si tiene texto para agregarselo
    if (objeto.texto != '') {
        const simbolo: Simbolo = new Simbolo(Tipo.ATRIBUTO, 'textoInterno', objeto.linea, objeto.columna, objeto.texto, entornoObjeto)
        entornoObjeto.agregar(simbolo.indentificador, simbolo)
    }
    //Agregamos al entorno global
    objeto.entorno = entornoObjeto
    const simbolo: Simbolo = new Simbolo(Tipo.ETIQUETA, objeto.identificador1, objeto.linea, objeto.columna, objeto, entornoObjeto)
    entorno.agregar(simbolo.indentificador, simbolo)
    //Verificamos si tiene mas hijos para recorrerlos recursivamente
    if (objeto.listaObjetos.length > 0) {
        objeto.listaObjetos.forEach((objetoHijo: Objeto) => {
            const resultado = objetoHijo;
            llenarTablaXML(objetoHijo, entornoObjeto);
        })
    }
};

function realizarGraficaAST() {
    const graficador: GraficarAST = new GraficarAST
    graficador.graficar(ObjetosXML)
}

function tablaErroresFicticia() {
    new ELexico('Lexico', "Caracter inesperado \'@\'", 'XML', 1, 1)
    new ELexico('Lexico', "Caracter inesperado \'$\'", 'XML', 1, 1)
    new ELexico('Lexico', "Caracter inesperado \'%\'", 'XML', 1, 1)
    new ELexico('Lexico', "Caracter inesperado \'+\'", 'Xpath', 1, 1)
    new ESintactico('Sintactico', "No se esperaba \'@\'", 'XML', 1, 1)

    let todosErrores=""
    errorLex.forEach(element => {
        todosErrores += "[error][ linea: " + element.linea + " columna: " + element.columna + " ] " + element.descripcion +", Tipo:" +element.tipo+"\n";
    });
    errorSin.forEach(element => {
        todosErrores += "[error][ linea: " + element.linea + " columna: " + element.columna + " ] " + element.descripcion +", Tipo:" +element.tipo+"\n";
    });
    console.log(todosErrores)
}

ejecutarXML_DSC(`
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
`);

module.exports = { ejecutarXML, realizarGraficaAST };