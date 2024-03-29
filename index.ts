import { AST } from "./Simbolo/AST.js";
import { Tipo } from './Simbolo/Tipo.js'
import { Entorno } from "./Simbolo/Entorno.js";
import { Instruccion } from "./Interfaces/Instruccion.js";
import { Objeto } from "./Interprete/Expresion/Objeto.js";
import { Acceso,Tipo2} from "./Interprete/Expresion/Acceso";
import { Sacceso} from "./Interprete/Expresion/Sacceso";
import { Simbolo } from "./Simbolo/Simbolo.js";
import { Atributo } from "./Interprete/Expresion/Atributo.js";
import { GraficarAST } from "./Graficador/GraficarAST.js";
import { GraficarCST_XML } from "./Graficador/GraficarCST_XML";
import { ELexico, ESintactico, ESemantico, errorLex, errorSem, errorSin } from "./Interprete/Util/TError.js";
import { access } from "fs";
const CST_XML = require('./Analizadores/CSTXML.js');
import { Gramatical } from "./Simbolo/Gramatical.js";
const gramaticaXML = require('./Analizadores/gramaticaXML.js');
const gramaticaXMLD = require('./Analizadores/gramaticaXMLDSC.js');
const gramaticaXpath = require('./Analizadores/gramaticaXPath.js');
let ObjetosNode: any;
var graficador = new GraficarCST_XML();
let resultadoxpath: string="";
let contador: number;

import { resetTE } from './Interprete/Util/TError';

let ObjetosXML: any
let cadenaReporteTS = ` <thead><tr><th scope="col">Nombre</th><th scope="col">Tipo</th><th scope="col">Ambito</th><th scope="col">Fila</th><th scope="col">Columna</th>
                        </tr></thead>`

let algo: any
let cadenaErrores: any
let reporteGramatical : any
let cadenaReporteGram : any
//Esta funcion es para mientras en lo que sincroniza con la pag

ejecutarXML(`
<?xml version="1.0" encoding="UTF-8" ?>

<app>
<biblioteca dir="calle 3>5<5" prop="Sergio's">
    <libro>
        <titulo>Libro A</titulo>
        <autor>&Julio &amp;Tommy&amp; Garcia</autor>
        <fechapublicacion ano="2001" mes="Enero"/>
    </libro>

    <libro>
        <titulo>Libro B</titulo>
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
    <libro>
        <titulo>Libro 3</titulo>
        <autor>Autor 2 &amp; Autor 3</autor>
        <descripcion> holi </descripcion>
        <fechapublicacion ano="2002" mes="Febrero"/>
    </libro>
</hem>
</app>
`)
realizarGraficaAST()
//   tablaErroresFicticia()


//accionesEjecutables()
//tablaErroresFicticia()

function ejecutarXML(entrada: string) {
    resetTE() // Metodo para resetear la tabla de errores
    vaciarTodo()
    cadenaReporteTS = ` <thead><tr><th scope="col">Nombre</th><th scope="col">Tipo</th><th scope="col">Ambito</th><th scope="col">Fila</th><th scope="col">Columna</th>
                        </tr></thead>`
    //Parseo para obtener la raiz o raices  
    const resultado = gramaticaXML.parse(entrada);
    const objetos = resultado.result;
    reporteGramatical = resultado.reporteGram;
    ObjetosXML = objetos;
    const entornoGlobal: Entorno = new Entorno(null);
    //funcion recursiva para manejo de entornos
    objetos.forEach((objeto: Objeto) => {
        if (objeto.identificador1 == "<?xml") {
            //Acciones para el prologo
        } else {
            cadenaReporteTS += `<tr>`
            llenarTablaXML(objeto, entornoGlobal, null);
            cadenaReporteTS += `</tr>`
        }
    })
    //esta es solo para debug jaja
    const ent = entornoGlobal;
    algo=entornoGlobal
   // ejecutarXpath("//libro")
   // console.log(cadenaReporteTS)
    return cadenaReporteTS
};

function validarEtiqueta(cadena1: string, cadena2: string): boolean {
    if (cadena2 === "") {//si solo es 1 etiqueta de abrir
        return true
    }
    if (cadena1 === cadena2) {//si vienen las 2 cadenas
        return true
    } else {
        return false
    }

}

/*

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
*/


function generarxml(nodo: Objeto) {
    let result2: string = ""
    if (nodo.texto != "") {
        let result: string = ""
        result = "<" + nodo.identificador1 + ">" + nodo.texto + "</" + nodo.identificador1 + ">\n";
        return result
    } else {
        if (nodo.listaObjetos.length > 0) {
            let result3: string = ""
            nodo.listaObjetos.forEach((objetoHijo: Objeto) => {
                result3 += generarxml(objetoHijo);
            })
            result2 += "<" + nodo.identificador1 + ">\n" + result3 + "</" + nodo.identificador1 + ">\n";
        }
    }
    return result2

};

function recursiva(en: Entorno, listac: Array<Acceso>){
    let llave: string=""
    llave= listac[listac.length-1].valor
    
    let salida: string=""
    let tiposlash:string=listac[listac.length-1].tiposlash
    listac.pop()
    
    if(tiposlash=="/" || tiposlash==""){
        if(en.existeEnActual(llave)){
            let simbolos :Array<Simbolo>=[]
            for(let i=0; i<en.tablita.length;i++){
                if(en.tablita[i].indentificador==llave){
                    simbolos.push(en.tablita[i]);
                }
            } 
            //console.log(simbolos)

            if(listac.length==0){

                simbolos.forEach((ob: Simbolo) => {
                    if(ob!=null){
                        let nodo=ob.valor
                        salida+=generarxml(nodo);
                    }
                    
                })

            }else{

                simbolos.forEach((ob: Simbolo) => {
                    if(ob!=null){
                        let nodo=ob.valor
                        let entornoNodo: Entorno =nodo.entorno
                        let listac2: Array<Acceso>=[]
                        for(let i=0; i<listac.length;i++){
                            listac2.push(listac[i])
                        }
                        salida+=recursiva(entornoNodo,listac2)
                    }
                })
            }
        }
    }else if(tiposlash=="//"){
        if(en.existeEnActual(llave)){

            let simbolos :Array<Simbolo>=[]
            for(let i=0; i<en.tablita.length;i++){
                if(en.tablita[i].indentificador==llave){
                    simbolos.push(en.tablita[i]);
                }
            }   

            if(listac.length==0){

                simbolos.forEach((ob: Simbolo) => {
                    if(ob!=null){
                        let nodo=ob.valor
                        salida+=generarxml(nodo);
                    }
                    
                })

            }else{

                simbolos.forEach((ob: Simbolo) => {
                    if(ob!=null){
                        let nodo=ob.valor
                        let entornoNodo: Entorno =nodo.entorno
                        let listac2: Array<Acceso>=[]
                        for(let i=0; i<listac.length;i++){
                            listac2.push(listac[i])
                        }
                        salida+=recursiva(entornoNodo,listac2)
                    }
                })
            }

        }else{
            let listac2: Array<Acceso>=[]
            for(let i=0; i<listac.length;i++){
                listac2.push(listac[i])
            }
            salida+=recursiva2(en,llave,listac2)
        }

    }
    
    return salida
};

function recursiva2(en: Entorno, nombre: string, listap: Array<Acceso>){
    let bo:string=""
    if(en.existeEnActual(nombre)){
    
        let simbolos :Array<Simbolo>=[]
        for(let i=0; i<en.tablita.length;i++){
            if(en.tablita[i].indentificador==nombre){
                simbolos.push(en.tablita[i]);
            }
        }  

        if(listap.length==0){

            simbolos.forEach((ob: Simbolo) => {
                if(ob!=null){
                    let nodo=ob.valor
                    bo+=generarxml(nodo);
                }

            })

        } else {

            simbolos.forEach((ob: Simbolo) => {
                if(ob!=null){
                    let nodo=ob.valor
                    let entornoNodo: Entorno =nodo.entorno
                    let listac3: Array<Acceso>=[]
                    for(let i=0; i<listap.length;i++){
                        listac3.push(listap[i])
                    }
                    bo+=recursiva(entornoNodo,listac3)
                }
            })
        }
        return bo
        
    }else{
        for(let i=0;i< en.tablita.length;i++){
            bo+=recursiva2(en.tablita[i].valor.entorno,nombre,listap)
        }
        return bo
    }
}

function ejecutarXpath(entrada: string){
    const en: Entorno= algo
    const objetos= gramaticaXpath.parse(entrada);
    resultadoxpath=""
    //console.log(objetos[0][0][0][0][0].Nacceso[0])
   
    let listac: Array<Acceso>=[]
    for (let i = objetos[0][0][0][0][0].Nacceso.length-1 ; i > -1; i--) {
        listac.push(objetos[0][0][0][0][0].Nacceso[i])
    }
    //console.log(en)
    //console.log(en.tablita[1])
    return recursiva(en,listac)
    
    
    
    /*
    contador=objetos[0][0][0][0][0].length


    for(let ob1 of objetos[0][0][0][0][0]){

        for(let ob2 of ObjetosXML){

            if (ob2.identificador1 == "?XML") {

            }else if(ob1.valor==ob2.identificador1){
                avanzar(ob2,ob1,objetos[0][0][0][0][0],contador)
            }
        }
    }*/
    /*
    objetos[0][0][0][0][0].forEach((objeto1: Acceso ) => {
    
        ObjetosXML.forEach((objeto2: Objeto) => {
            
            if (objeto2.identificador1 == "?XML") {
                
            } else if (objeto1.valor==objeto2.identificador1) {
                //avanzar(objeto2,contador)
            }
            
        })

    })*/

};

function ejecutarXML_DSC(entrada: string) {
    cadenaReporteTS = ` <thead><tr><th scope="col">Nombre</th><th scope="col">Tipo</th><th scope="col">Ambito</th><th scope="col">Fila</th><th scope="col">Columna</th>
                        </tr></thead>`
    //Parseo para obtener la raiz o raices  
    const resultado = gramaticaXMLD.parse(entrada);
    const objetos = resultado.result;
    const reporteG = resultado.reporteGram;
    ObjetosXML = objetos;
    const entornoGlobal: Entorno = new Entorno(null);
    //funcion recursiva para manejo de entornos
    objetos.forEach((objeto: Objeto) => {
        if (objeto.identificador1 == "<?xml") {
            //Acciones para el prologo
        } else {
            cadenaReporteTS += `<tr>`
            llenarTablaXML(objeto, entornoGlobal, null);
            cadenaReporteTS += `</tr>`
        }
    })
    //esta es solo para debug jaja
    const ent = entornoGlobal;
    algo = entornoGlobal
    // console.log(cadenaReporteTS)
    console.log(imprimirTablaErrores())
    return cadenaReporteTS
};

function llenarTablaXML(objeto: Objeto, entorno: Entorno, padre: Objeto | null) {
    if (!validarEtiqueta(objeto.identificador1, objeto.identificador2)) { //verificamos que las etiquetas sean iguales
        new ESemantico("Semantico", "No coinciden las etiquetas: '" + objeto.identificador1 + "' y '" + objeto.identificador2 + "'", "XML Asc", objeto.linea, objeto.columna);
        return
    }
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
        cadenaReporteTE += `<td>${element.tipo}</td><td>${element.descripcion}</td><td>${element.analizador}</td><td>${element.linea}</td><td>${element.columna}</td>`
        cadenaReporteTE += `</tr>`
    });
    errorSin.forEach(element => {
        cadenaReporteTE += `<tr>`
        cadenaReporteTE += `<td>${element.tipo}</td><td>${element.descripcion}</td><td>${element.analizador}</td><td>${element.linea}</td><td>${element.columna}</td>`
        cadenaReporteTE += `</tr>`
    });
    errorSem.forEach(element => {
        cadenaReporteTE += `<tr>`
        cadenaReporteTE += `<td>${element.tipo}</td><td>${element.descripcion}</td><td>${element.analizador}</td><td>${element.linea}</td><td>${element.columna}</td>`
        cadenaReporteTE += `</tr>`
    });
    return cadenaReporteTE

};

function realizarGraficaCST_XML(entrada: string){
    ObjetosNode = CST_XML.parse(entrada);
    var cadena = graficador.graficar(ObjetosNode);
    var direccion = encodeURI("https://dreampuf.github.io/GraphvizOnline/#" + cadena);
    window.open(direccion, '_blank');
};

function llenarReporteG() {
    let cadena :string;
   // console.log(reporteGramatical.listaReporte)
    cadena =  ` <thead><tr><th scope="col">Produccion</th><th scope="col">Regla Semántica</th>
    </tr></thead>`
    reporteGramatical.listaReporte.forEach((element: { produccion: any; regla: any; }) => {
        cadena += `<tr>`
        cadena += `<td>${element.produccion}</td><td>${element.regla}</td>`
        cadena += `</tr>`
    });
   // console.log(cadena)
    return cadena
}

function imprimirTablaErrores() {
    let cadenaR = ``
    errorLex.forEach(element => {
        cadenaR += `Tipo:${element.tipo} Descripcion: ${element.descripcion} Analizador: ${element.analizador} Linea: ${element.linea} Columna: ${element.columna}\n`
    });
    errorSin.forEach(element => {
        cadenaR += `Tipo:${element.tipo} Descripcion: ${element.descripcion} Analizador: ${element.analizador} Linea: ${element.linea} Columna: ${element.columna}\n`
    });
    errorSem.forEach(element => {
        cadenaR += `Tipo:${element.tipo} Descripcion: ${element.descripcion} Analizador: ${element.analizador} Linea: ${element.linea} Columna: ${element.columna}\n`
    });
    return cadenaR

};

function vaciarTodo(){
    cadenaReporteTS = ''
}
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

module.exports = { ejecutarXML, realizarGraficaAST, reporteTablaErrores, ejecutarXpath, realizarGraficaCST_XML,llenarReporteG,ejecutarXML_DSC };