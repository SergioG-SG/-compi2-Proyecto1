export enum Tipo2{
    ACCESO,
    ATRIBUTO,
    TEST,
    SIGNO
}

export class Acceso{
    valor : string;
    tipo: Tipo2;
    linea : number;
    columna : number;

    constructor(valor:string, tipo:Tipo2,linea:number,columna:number){
        this.valor=valor;
        this.tipo=tipo;
        this.linea=linea;
        this.columna=columna;
    }
}