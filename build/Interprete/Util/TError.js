export let errorSem = [];
export let errorSin = [];
export let errorLex = [];
function Error(tipo, desc, analizador, linea, col) {
    return {
        tipo: tipo,
        descripcion: desc,
        analizador: analizador,
        linea: linea,
        columna: col
    };
}
export class TError {
    constructor() {
        this.tablaErrores = [];
        this.semantico = [];
        this.lexic = [];
    }
    agregar(tipo, desc, analizador, linea, col) {
        const result = Error(tipo, desc, analizador, linea, col);
        this.tablaErrores.push(result);
        errorSem.push(result);
    }
    imprimir() {
        let todosErrores = "";
        this.tablaErrores.forEach(element => {
            todosErrores += "[error][ linea: " + element.linea + " columna: " + element.columna + " ] " + element.descripcion + "\n";
        });
        return todosErrores;
    }
    get() {
        return this.tablaErrores;
    }
}
export class ESintactico {
    constructor(tipo, descripcion, analizador, linea, columna) {
        const result = Error(tipo, descripcion, analizador, linea, columna);
        errorSin.push(result);
    }
}
export class ELexico {
    constructor(tipo, descripcion, analizador, linea, columna) {
        const result = Error(tipo, descripcion, analizador, linea, columna);
        errorLex.push(result);
    }
}
export function resetTE() {
    errorSem = [];
    errorSin = [];
    errorLex = [];
}
