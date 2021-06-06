%lex

%options case-insensitive

%s                                  comment

%%
"<!--"                              this.begin('comment');
<comment>"-->"                      this.popState();
<comment>.                          /* ignora contenido de los comentarios*/
\s+                                 // ignora los espacios en blanco

"<?xml"                             return 'prologo';
"?>"                                return 'prologc';
"</"                                return 'etiqca';

"version"                           return 'RVERSION';
"encoding"                          return 'RENCODING'



/*"|"                                 return 'barra';
"°"                                 return 'degree';*/
([\u0021]|[\u0023-\u0026]|[\u0028-\u002F]|)+                           return 'simbolos1'


"/"                                 return 'div';
"<"                                 return 'lt';
">"                                 return 'gt';
"="                                 return 'asig';


/* Number literals */
\d+([.]\d*)?                        return 'DoubleLiteral';
\"[^\"]*\"                          return 'StringLiteral1'
\'[^\']*\'                          return 'StringLiteral2'
[a-zA-Z][a-zA-Z0-9_]*               return 'identifier';

//error lexico
.                                   {
                                        console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
                                    }

<<EOF>>                             return 'EOF'

/lex

// PRODUCCIÓN INICIAL
%start START

%%

/* Definición de la gramática */
START : XML EOF                                                                    { $$ = $1; return $$; }
      ;

XML: PROLOG ROOTS                                                                  
   | PROLOG
   | ROOTS
   ;

PROLOG: prologo RVERSION asig StringLiteral1 RENCODING asig StringLiteral1 prologc
	  ;


ROOTS: ROOTS ROOT                                                                  { $1.push($2); $$ = $1;}
     | ROOT                                                                        { $$ = [$1]; }
     ;

ROOT: lt identifier LIST_ATRIBUTOS gt      ROOTS         etiqca identifier gt      { ; }
    | lt identifier LIST_ATRIBUTOS gt      CONTENTS      etiqca identifier gt      { ; } 
    | lt identifier LIST_ATRIBUTOS gt                    etiqca identifier gt      { ; }
    | lt identifier LIST_ATRIBUTOS div     gt                                      { ; }
    ;

LIST_ATRIBUTOS: ATRIBUTOS                                                          { $$ = $1; }
              |                                                                    { $$ = []; }
              ;

ATRIBUTOS: ATRIBUTOS ATRIBUTO                                                      { $1.push($2); $$ = $1;}
         | ATRIBUTO                                                                { $$ = [$1]; }
         ;

ATRIBUTO: identifier asig StringLiteral1                                            {$$=$3; console.log($$);}
        | identifier asig StringLiteral2                                            {$$=$3; console.log($$);}
        ;

CONTENTS: CONTENTS BODY                                                            { $1=$1 + ' ' +$2 ; $$ = $1;}
         | BODY                                                                    { $$ = $1 }
         ;

BODY: identifier{ $$ = 'S' + $1 + 'G'; console.log($$); }
    | DoubleLiteral{ $$ = 'S' + $1 + 'G'; console.log($$); }
    | simbolos1  { $$ = 'S' + $1 + 'G'; console.log($$); }
    ;