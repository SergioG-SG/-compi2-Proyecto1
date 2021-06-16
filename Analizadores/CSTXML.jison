 /* segmento de codigo, es equivalente a la seccion parseCode que encontramos en CUP */
 /* aca podemos importar los módulos que vamos a utilizar, crear funciones, etc */
%{

const { GraficarCST_XML } = require('../Graficador/GraficarCST_XML');
const { NodoCST } = require('../Graficador/NodoCST');
var cst = new GraficarCST_XML();
var raiz = new NodoCST;

%}


%lex

%s                                  comment

%%
"<!--"                              this.begin('comment');
<comment>"-->"                      this.popState();
<comment>.                          /* ignora contenido de los comentarios*/
\s+                                 // ignora los espacios en blanco

"<?xml"                             return 'prologo';
"?>"                                return 'prologc';
"</"                                return 'etiqca';
"/>"                                return 'etiqcc';

"version"                           return 'RVERSION';
"encoding"                          return 'RENCODING'

"&lt;"                              return 'less';
"&gt;"                              return 'greater';
"&amp;"                             return 'ampersand';
"&apos;"                            return 'apostrophe';
"&quot;"                            return 'quotation';

"<"                                 return 'lt';
">"                                 return 'gt';
"="                                 return 'asig';

/* Number literals */
\d+([.]\d*)?                        return 'DoubleLiteral';
\"[^\"]*\"                          return 'StringLiteral1'
\'[^\']*\'                          return 'StringLiteral2'
[a-zA-Z][a-zA-Z0-9_]*               return 'identifier';

([\u0021]|[\u0023-\u0025]|[\u0028-\u002F]|[\u003A-\u003B]|[\u003F-\u0040]|[\u005B-\u0060]|[\u007B-\u007E]|[\u00A1-\u00AC]|[\u00AE-\uD7F0])+                  return 'simbolos1';

//error lexico
.       {
            console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
        }

<<EOF>>                             return 'EOF'

/lex

// PRODUCCIÓN INICIAL
%start START

%%

/* Definición de la gramática */
START: ROOTS EOF                                                                    { var padre = new NodoCST('START', '');
                                                                                      padre.agregarHijo($1);
                                                                                      $$ = padre;
                                                                                      return $$; } 
     ;

ROOTS: ROOTS ROOT                                                                   { var padre = new NodoCST('ROOTS', '');
                                                                                      padre.agregarHijo($1);
                                                                                      $$ = padre; 
                                                                                    }                                                 
     | ROOT                                                                         { var padre = new NodoCST('ROOTS', '');
                                                                                      padre.agregarHijo($1);
                                                                                      $$ = padre; }
     ;

ROOT: prologo RVERSION asig StringLiteral1 RENCODING asig StringLiteral1 prologc    { /*$$ = ++yy.cont;*/ } 
    | lt identifier LIST_ATRIBUTOS gt      ROOTS         etiqca identifier gt       {/* yy.cont = yy.cont+8;
                                                                                      $$ = ++yy.cont;
                                                                                      /*yy.codigo += yy.cont + ' [label="<"];'+'\n';
                                                                                      yy.codigo += yy.cont + ' [label="' + $2 + '"];'+'\n';
                                                                                      yy.codigo += yy.cont + ' [label="LIST_ATRIBUTOS"];'+'\n';
                                                                                      yy.codigo += yy.cont + ' [label=">"];'+'\n';*/
                                                                                      /*yy.codigo += yy.cont-5 + ' [label="ROOTS"];'+'\n';
                                                                                      /*yy.codigo += yy.cont + ' [label="</"];'+'\n';
                                                                                      yy.codigo += yy.cont + ' [label="' + $7 + '"];'+'\n';
                                                                                      yy.codigo += yy.cont + ' [label=">"];'+'\n';
                                                                                      
                                                                                      yy.codigo += yy.cont + '--' + $1 + ';' + '\n';
                                                                                      yy.codigo += yy.cont + '--' + $2 + ';' + '\n';
                                                                                      yy.codigo += yy.cont + '--' + $3 + ';' + '\n';
                                                                                      yy.codigo += yy.cont + '--' + $4 + ';' + '\n';*/
                                                                                     /* yy.codigo += yy.cont + '--' + $5 + ';' + '\n';
                                                                                      /*yy.codigo += yy.cont + '--' + $6 + ';' + '\n';
                                                                                      //yy.codigo += yy.cont + '--' + $7 + ';' + '\n';
                                                                                      yy.codigo += yy.cont + '--' + $8 + ';' + '\n';*/
                                                                                    }
    | lt identifier LIST_ATRIBUTOS gt      CONTENTS      etiqca identifier gt       { /*$$ = ++yy.cont;*/ } 
    | lt identifier LIST_ATRIBUTOS gt                    etiqca identifier gt       { var padre = new NodoCST('Root', ''); $$ = padre; }
    | lt identifier LIST_ATRIBUTOS etiqcc                                           { /*$$ = ++yy.cont;*/ }                                    
    | error                                                                         { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); 
                                                                                      
                                                                                    }
    ;

LIST_ATRIBUTOS: ATRIBUTOS                           { /*$$ = ++yy.cont;*/ }                               
              |                                     { /*$$ = ++yy.cont;*/ }                               
              ;

ATRIBUTOS: ATRIBUTOS ATRIBUTO                       { /*$$ = ++yy.cont;*/ }                               
         | ATRIBUTO                                 { /*$$ = ++yy.cont;*/ }        

         ;

ATRIBUTO: identifier asig StringLiteral1            { /*$$ = ++yy.cont;*/ }                                
        | identifier asig StringLiteral2            { /*$$ = ++yy.cont;*/ }                              
        | error                                     { console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); 
                                                      
                                                    }
        ;

CONTENTS: CONTENTS BODY                             {  }                               
         | BODY                                     {  }                                                         
         ;

BODY: identifier                                    {  }
    | DoubleLiteral                                 {  }
    /*| StringLiteral1 { $$ = $1; console.log($$); }
    | StringLiteral2 { $$ = $1; console.log($$); }*/
    | less                                          {  }
    | greater                                       {  }
    | ampersand                                     {  }
    | apostrophe                                    {  }
    | quotation                                     {  }
    | simbolos1                                     {  }
    //| gt { $$ = $1; console.log($$); }
    | asig                                          {  }
    ;