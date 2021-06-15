import { AST } from "./Simbolo/AST.js";
import { Tipo } from './Simbolo/Tipo.js'
import { Entorno } from "./Simbolo/Entorno.js";
import { Instruccion } from "./Interfaces/Instruccion.js";
import { Objeto } from "./Interprete/Expresion/Objeto.js";
import { Acceso, Tipo2} from "./Interprete/Expresion/Acceso";
import { Simbolo } from "./Simbolo/Simbolo.js";
import { Atributo } from "./Interprete/Expresion/Atributo.js";
import { GraficarAST } from "./Graficador/GraficarAST.js";
import { ELexico, ESintactico, errorLex, errorSem, errorSin } from "./Interprete/Util/TError.js";
import { access } from "fs";
const gramaticaXML = require('./Analizadores/gramaticaXML.js');
const gramaticaXMLD = require('./Analizadores/gramaticaXMLDSC.js');
const gramaticaXpath = require('./Analizadores/gramaticaXPath.js');
let ObjetosXML: any
let resultadoxpath: string=""
let contador: number
let cadenaReporteTS = ` <thead><tr><th scope="col">Nombre</th><th scope="col">Tipo</th><th scope="col">Ambito</th><th scope="col">Fila</th><th scope="col">Columna</th>
                        </tr></thead>`
                        
//Esta funcion es para mientras en lo que sincroniza con la pag
    ejecutarXML(`
<?xml version="1.0" encoding="UTF-8" ?>

<app>
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

    <libro>
        <titulo>Libro C</titulo>
        <autor>Autor 2 &amp; Autor 3</autor>
        <descripcion> holi </descripcion>
        <fechapublicacion ano="2002" mes="Febrero"/>
    </libro>

    <libro>
        <titulo>Libro D</titulo>
        <autor>Autor 2 &amp; Autor 3</autor>
        <descripcion> holi </descripcion>
        <fechapublicacion ano="2002" mes="Febrero"/>
    </libro>

</biblioteca>
<hem>
    <pdf>
        <titulo>Libro 2</titulo>
        <autor>Autor 2 &amp; Autor 3</autor>
        <descripcion> holi </descripcion>
        <fechapublicacion ano="2002" mes="Febrero"/>
    </pdf>
    <pdf2>
        <titulo>Libro 3</titulo>
        <autor>Autor 2 &amp; Autor 3</autor>
        <descripcion> holi </descripcion>
        <fechapublicacion ano="2002" mes="Febrero"/>
    </pdf2>
</hem>
</app>
`)

    realizarGraficaAST()
 //   tablaErroresFicticia()


//accionesEjecutables()
//tablaErroresFicticia()

function ejecutarXML(entrada: string) {
    cadenaReporteTS = ` <thead><tr><th scope="col">Nombre</th><th scope="col">Tipo</th><th scope="col">Ambito</th><th scope="col">Fila</th><th scope="col">Columna</th>
                        </tr></thead>`
    //Parseo para obtener la raiz o raices  
    const resultado = gramaticaXML.parse(entrada);
    const objetos = resultado.result;
    const reporteGramatical = resultado.reporteGram;

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
    ejecutarXpath("/app/biblioteca",entornoGlobal);
    console.log(    )
    return cadenaReporteTS
};




function recorrer(nodo: Objeto){

    if (nodo.texto!=''){
        resultadoxpath+="<"+nodo.identificador1+">"+nodo.texto+"</"+nodo.identificador1+">\n";
    }
    if (nodo.listaObjetos.length != undefined) {
        if (nodo.listaObjetos.length >0) {
            nodo.listaObjetos.forEach((objetoHijo: Objeto) => {
                recorrer(objetoHijo);
            })
         }
    }
    
}
function avanzar(en: Entorno, listac: Array<Acceso>){
    let llave: string=""
    
    if(listac[listac.length-1].tipo==Tipo2.ATRIBUTO){
      /*  llave= listac[listac.length-1].valor
        listac.pop()
        if(en.existe(llave)){
            resu
        }*/
    }else if(listac[listac.length-1].tipo==Tipo2.ACCESO){
        
    
        llave= listac[listac.length-1].valor
        listac.pop()
        
        if(en.existe(llave)){

            let simbolos :Array<Simbolo>=[] 
            simbolos.push(en.getSimbolo(llave))

            if(listac.length===0){

                simbolos.forEach((ob: Simbolo) => {

                    let nodo=ob.valor
                    recorrer(nodo);
                })

            }else{

                simbolos.forEach((ob: Simbolo) => {
                    let nodo=ob.valor
                    let entornoNodo: Entorno =nodo.entorno
                    avanzar(entornoNodo,listac)
                })
            }
        }
    }
    
}
function generarxml(nodo: Objeto){
    return  "<"+nodo.identificador1+">"+nodo.texto+"</"+nodo.identificador1+">\n";
}
function recursiva(en: Entorno, listac: Array<Acceso>){
    let llave: string=""
    llave= listac[listac.length-1].valor
    listac.pop()
    
    if(en.existeEnActual(llave)){

        let simbolos :Array<Simbolo>=[] 
        simbolos.push(en.getSimbolo(llave))

        if(listac.length===0){

            simbolos.forEach((ob: Simbolo) => {

                let nodo=ob.valor
                salida+=generarxml(nodo);
            })

        }else{

            simbolos.forEach((ob: Simbolo) => {
                let nodo=ob.valor
                let entornoNodo: Entorno =nodo.entorno
                salida+=recursiva(entornoNodo,listac)
            })
        }
    }
    return salida
}

function ejecutarXpath(entrada: string,en: Entorno){
    const objetos= gramaticaXpath.parse(entrada);
    resultadoxpath=""
    if (en.existeEnActual(objetos[0][0][0][0][0][0].valor)){
        let listac: Array<Acceso>=[]
        for (let i = objetos[0][0][0][0][0].length-1 ; i > -1; i--) {
            listac.push(objetos[0][0][0][0][0][i])
        }
        /*console.log(en)
        console.log(en.getSimbolo("app").entorno)*/
       //avanzar(en,listac)
       console.log(en.getSimbolo("libros").valor)
       console.log(en.getSimbolo("libros").entorno.tabla)
        console.log(recursiva(en,listac))
    }
    /*console.log("\n \n el resultado de la consulta es: ")
    console.log(resultadoxpath+"Fin consulta")*/
    
    
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
        <titulo>Libro Actual Nèvada</titulo>
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