import { Acceso } from './Acceso'

export class Sacceso{
    tipoinicio: string;
    Nacceso: Array<Acceso>;
    linea : number;
    columna : number;

    constructor(tipoinicio: string, Nacceso: Array<Acceso>,linea:number,columna:number){
        this.tipoinicio=tipoinicio;
        this.Nacceso=Nacceso;
        this.linea=linea;
        this.columna=columna;
    }
}