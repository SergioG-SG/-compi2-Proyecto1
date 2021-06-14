import { AST } from "./Simbolo/AST.js";
import { Tipo } from './Simbolo/Tipo.js'
import { Entorno } from "./Simbolo/Entorno.js";
import { Instruccion } from "./Interfaces/Instruccion.js";
import { Objeto } from "./Interprete/Expresion/Objeto.js";
import { Acceso} from "./Interprete/Expresion/Acceso";
import { Simbolo } from "./Simbolo/Simbolo.js";
import { Atributo } from "./Interprete/Expresion/Atributo.js";
import { GraficarAST } from "./Graficador/GraficarAST.js";
import { ELexico, ESintactico, errorLex, errorSem, errorSin } from "./Interprete/Util/TError.js";
const gramaticaXML = require('./Analizadores/gramaticaXML.js');
const gramaticaXMLD = require('./Analizadores/gramaticaXMLDSC.js');
const gramaticaXpath = require('./Analizadores/gramaticaXPath.js');
let ObjetosXML: any
let cadenaReporteTS = ` <thead><tr><th scope="col">Nombre</th><th scope="col">Tipo</th><th scope="col">Ambito</th><th scope="col">Fila</th><th scope="col">Columna</th>
                        </tr></thead>`
                        
//Esta funcion es para mientras en lo que sincroniza con la pag
/*
    ejecutarXML(`
<?xml version="1.0" encoding="UTF-8" ?>

<biblioteca dir="calle 3>5<5" prop="Sergio's">
    <libro>
        <titulo>Libro A</titulo>
        <autor>Julio& &amp;Tommy&amp; Garcia</autor>
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
`)
    realizarGraficaAST()
    tablaErroresFicticia()
*/

//accionesEjecutables()
//tablaErroresFicticia()

function ejecutarXML(entrada: string) {
    cadenaReporteTS = ` <thead><tr><th scope="col">Nombre</th><th scope="col">Tipo</th><th scope="col">Ambito</th><th scope="col">Fila</th><th scope="col">Columna</th>
                        </tr></thead>`
    //Parseo para obtener la raiz o raices  
    const objetos = gramaticaXML.parse(entrada);
    ObjetosXML = objetos;
    const entornoGlobal: Entorno = new Entorno(null);
    //funcion recursiva para manejo de entornos
    objetos.forEach((objeto: Objeto) => {
        if (objeto.identificador1 == "?XML") {
            //Acciones para el prologo
        } else {
            cadenaReporteTS += `<tr>`
            llenarTablaXML(objeto, entornoGlobal, null);
            cadenaReporteTS += `</tr>`
        }
    })
    //esta es solo para debug jaja
    const ent = entornoGlobal;
    console.log(cadenaReporteTS)
    return cadenaReporteTS
};

ejecutarXpath("/biblioteca")
function ejecutarXpath(entrada: string){
    const objetos= gramaticaXpath.parse(entrada);

    objetos[0][0][0][0][0].forEach((objeto: Acceso ) => {
    
        /*ObjetosXML.forEach((objeto: Objeto) => {
            let cadenaInterna: string = ""
            if (objeto.identificador1 == "?XML") {
                
            } else {
                
            }
            
        })*/

    })
};

function ejecutarXML_DSC(entrada: string) {
    const objetos = gramaticaXMLD.parse(entrada);
    ObjetosXML = objetos;
    const entornoGlobal: Entorno = new Entorno(null);
};

function llenarTablaXML(objeto: Objeto, entorno: Entorno, padre: Objeto | null) {

    //Inicializamos los entornos del objeto
    const entornoObjeto: Entorno = new Entorno(null)
    //Verificamos si tiene atributos para asignarselos
    if (objeto.listaAtributos.length > 0) {

        objeto.listaAtributos.forEach((atributo: Atributo) => {

            //ESto para el llenada
            const simbolo: Simbolo = new Simbolo(Tipo.ATRIBUTO, atributo.identificador, atributo.linea, atributo.columna, atributo.valor.replace(/['"]+/g, ''), entornoObjeto)
            entornoObjeto.agregar(simbolo.indentificador, simbolo)
            //Esto es para la graficada de la tabla de simbolos
            cadenaReporteTS += `<tr>`
            cadenaReporteTS += `<td>${simbolo.indentificador}</td><td>Atributo</td><td>${objeto.identificador1}</td><td>${atributo.linea}</td><td>${atributo.columna}</td>`
            cadenaReporteTS += `<tr>`
        })
    }
    //Verificamos si tiene texto para agregarselo
    if (objeto.texto != '') {
        const simbolo: Simbolo = new Simbolo(Tipo.ATRIBUTO, 'textoInterno', objeto.linea, objeto.columna, objeto.texto, entornoObjeto)
        entornoObjeto.agregar(simbolo.indentificador, simbolo)
        //Esto es para la graficada de la tabla de simbolos
        // cadenaReporteTS+=`<td>${objeto.texto}</td><td>Atributo</td><td>${objeto.identificador1}</td><td>${objeto.linea}</td><td>${objeto.columna}</td>`
    }
    //Agregamos al entorno global
    objeto.entorno = entornoObjeto
    const simbolo: Simbolo = new Simbolo(Tipo.ETIQUETA, objeto.identificador1, objeto.linea, objeto.columna, objeto, entornoObjeto)
    entorno.agregar(simbolo.indentificador, simbolo)
    //Esto es para la graficada de la tabla de simbolos
    let ambitoTS = ""
    if (padre != null) {
        ambitoTS = padre.identificador1
    } else {
        ambitoTS = "Global"
    }
    cadenaReporteTS += `<tr>`
    cadenaReporteTS += `<td>${objeto.identificador1}</td><td>Objeto</td><td>${ambitoTS}</td><td>${objeto.linea}</td><td>${objeto.columna}</td>`
    cadenaReporteTS += `</tr>`
    //Verificamos si tiene mas hijos para recorrerlos recursivamente
    if (objeto.listaObjetos.length > 0) {
        objeto.listaObjetos.forEach((objetoHijo: Objeto) => {
            const resultado = objetoHijo;

            llenarTablaXML(objetoHijo, entornoObjeto, objeto);
        })
    }
};

function realizarGraficaAST() {
    const graficador: GraficarAST = new GraficarAST
    graficador.graficar(ObjetosXML)
};

function reporteTablaErrores() {
    let cadenaReporteTE = ` <thead><tr><th scope="col">Tipo</th><th scope="col">Descripcion</th><th scope="col">Archivo</th><th scope="col">Fila</th><th scope="col">Columna</th>
                        </tr></thead>`
    errorLex.forEach(element => {
    cadenaReporteTE += `<tr>`
    cadenaReporteTE += `<td>${element.tipo}</td><td>Objeto</td><td>${element.descripcion}</td><td>${element.analizador}</td><td>${element.linea}</td><td>${element.columna}</td>`
    cadenaReporteTE += `</tr>`
    });
    errorSin.forEach(element => {
        cadenaReporteTE += `<tr>`
        cadenaReporteTE += `<td>${element.tipo}</td><td>Objeto</td><td>${element.descripcion}</td><td>${element.analizador}</td><td>${element.linea}</td><td>${element.columna}</td>`
        cadenaReporteTE += `</tr>`
    });
    errorSem.forEach(element => {
        cadenaReporteTE += `<tr>`
        cadenaReporteTE += `<td>${element.tipo}</td><td>Objeto</td><td>${element.descripcion}</td><td>${element.analizador}</td><td>${element.linea}</td><td>${element.columna}</td>`
        cadenaReporteTE += `</tr>`
    });
    return cadenaReporteTE    

};

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

module.exports = { ejecutarXML, realizarGraficaAST,reporteTablaErrores };