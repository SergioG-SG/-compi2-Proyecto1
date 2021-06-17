export enum Tipo2{
    ACCESO,
    ATRIBUTO,
    TEST,
    SIGNO
}

export class Acceso{
    tiposlash: string;
    valor : string;
    tipo: Tipo2;
    linea : number;
    columna : number;

    constructor(tiposlash: string,valor:string, tipo:Tipo2,linea:number,columna:number){
        this.tiposlash=tiposlash;
        this.valor=valor;
        this.tipo=tipo;
        this.linea=linea;
        this.columna=columna;
    }
}