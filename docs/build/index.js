import { Tipo } from './Simbolo/Tipo.js';
import { Entorno } from "./Simbolo/Entorno.js";
import { Simbolo } from "./Simbolo/Simbolo.js";
import { GraficarAST } from "./Graficador/GraficarAST.js";
import { gramaticaXML } from'./Analizadores/gramaticaXML.js';
let ObjetosXML;
export function ejecutarXML(entrada) {
    //Parseo para obtener la raiz o raices  
    const objetos = gramaticaXML.parse(entrada);
    ObjetosXML = objetos;
    const entornoGlobal = new Entorno(null);
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
    //Inicializamos los entornos del objeto
    const entornoObjeto = new Entorno(null);
    //Verificamos si tiene atributos para asignarselos
    if (objeto.listaAtributos.length > 0) {
        objeto.listaAtributos.forEach((atributo) => {
            const simbolo = new Simbolo(Tipo.ATRIBUTO, atributo.identificador, atributo.linea, atributo.columna, atributo.valor.replace(/['"]+/g, ''), entornoObjeto);
            entornoObjeto.agregar(simbolo.indentificador, simbolo);
        });
    }
    //Verificamos si tiene texto para agregarselo
    if (objeto.texto != '') {
        const simbolo = new Simbolo(Tipo.ATRIBUTO, 'textoInterno', objeto.linea, objeto.columna, objeto.texto, entornoObjeto);
        entornoObjeto.agregar(simbolo.indentificador, simbolo);
    }
    //Agregamos al entorno global
    objeto.entorno = entornoObjeto;
    const simbolo = new Simbolo(Tipo.ETIQUETA, objeto.identificador1, objeto.linea, objeto.columna, objeto, entornoObjeto);
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
function realizarGraficaAST() {
    const graficador = new GraficarAST;
    graficador.graficar(ObjetosXML);
}
realizarGraficaAST();
