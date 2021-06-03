//import {AST} from './AST';
import {Tipo} from './Tipo'
import {Entorno} from './Entorno'

export class Simbolo {
    public indentificador: string;
    private valor: any;
    private tipo: Tipo;
    linea: number;
    columna: number;

    constructor(tipo:Tipo, id:string, linea:number, columna:number){
        this.indentificador = id;
        this.linea = linea;
        this.columna = columna;
        this.tipo = tipo;
    }

    public ToString() :string
    {
        return String(this.valor);
    }
    
}