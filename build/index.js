"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tipo_1 = require("./Simbolo/Tipo");
const Entorno_1 = require("./Simbolo/Entorno");
const Simbolo_1 = require("./Simbolo/Simbolo");
const gramaticaXML = require('../Analizador/gramaticaXML');
function ejecutarXML(entrada) {
    //Parseo para obtener la raiz o raices  
    const objetos = gramaticaXML.parse(entrada);
    const entornoGlobal = new Entorno_1.Entorno(null);
    //funcion recursiva para manejo de entornos
    objetos.forEach((objeto) => {
        if (objeto.identificador1 == "?XML") {
            //Acciones para el prologo
        }
        else {
            llenarTablaXML(objeto, entornoGlobal);
        }
    });
    //esta es solo para debug jaja
    const ent = entornoGlobal;
}
function llenarTablaXML(objeto, entorno) {
    //Recorro todas las raices  DEBERIA SER RECURSIVA
    //Inicializamos los entornos del objeto
    const entornoObjeto = new Entorno_1.Entorno(null);
    //Verificamos si tiene atributos para asignarselos
    if (objeto.listaAtributos.length > 0) {
        objeto.listaAtributos.forEach((atributo) => {
            const simbolo = new Simbolo_1.Simbolo(Tipo_1.Tipo.ATRIBUTO, atributo.identificador, atributo.linea, atributo.columna, atributo.valor, entornoObjeto);
            entornoObjeto.agregar(simbolo.indentificador, simbolo);
        });
    }
    //Verificamos si tiene texto para agregarselo
    if (objeto.texto != '') {
        const simbolo = new Simbolo_1.Simbolo(Tipo_1.Tipo.ATRIBUTO, 'textoInterno', objeto.linea, objeto.columna, objeto.texto, entornoObjeto);
        entornoObjeto.agregar(simbolo.indentificador, simbolo);
    }
    //Agregamos al entorno global
    objeto.entorno = entornoObjeto;
    const simbolo = new Simbolo_1.Simbolo(Tipo_1.Tipo.ETIQUETA, objeto.identificador1, objeto.linea, objeto.columna, objeto, entornoObjeto);
    entorno.agregar(simbolo.indentificador, simbolo);
    //Verificamos si tiene mas hijos para recorrerlos recursivamente
    if (objeto.listaObjetos.length > 0) {
        objeto.listaObjetos.forEach((objetoHijo) => {
            const resultado = objetoHijo;
            llenarTablaXML(objetoHijo, entornoObjeto);
        });
    }
}
ejecutarXML(`
<?XML version="1.0" encoding="UTF-8" ?>

<biblioteca dir="calle 3>5<5" prop="Sergio's">
    <libro>
        <titulo>Libro A</titulo>
        <autor>Autor A Julio &quot;Tommy&quot; Garcia</autor>
        <fechaPublicacion ano="2001" mes="Enero"/>
    </libro>

    <libro>
        <titulo>Libro B</titulo>
        <autor>Autor 2 &amp; Autor 3</autor>
        <descripcion> !#$%/()=?¡¿°|´¨+*{}[],;.:-_ </descripcion>
        <fechaPublicacion ano="2002" mes="Febrero"/>
    </libro>

  
</biblioteca>

<hemeroteca>
    
</hemeroteca>
`);
