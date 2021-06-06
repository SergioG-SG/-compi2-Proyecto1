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
"/>"                                return 'etiqcc';

"version"                           return 'RVERSION';
"encoding"                          return 'RENCODING'

"<"                                 return 'lt';
">"                                 return 'gt';
"="                                 return 'asig';

/* Number literals */
\d+([.]\d*)?                        return 'DoubleLiteral';
\"[^\"]*\"                          return 'StringLiteral1'
\'[^\']*\'                          return 'StringLiteral2'
[a-zA-Z][a-zA-Z0-9_]*               return 'identifier';

([\u0021-\u002F]|[\u003A-\u003B]|[\u003F-\u0040]|[\u005B-\u0060]|[\u007B-\u007E]|[\u00A1-\u00AC]|[\u00AE-\uD7F0])+                  return 'simbolos1';
/*([\u003A-\u003B]|[\u003F-\u0040])+  return 'simbolos2';
([\u005B-\u0060]|[\u007B-\u007E])+  return 'simbolos3';
([\u00A1-\u00AC]|[\u00AE-\uD7F0])+  return 'simbolos4';*/

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
    | lt identifier LIST_ATRIBUTOS etiqcc                                          { ; }
    ;

LIST_ATRIBUTOS: ATRIBUTOS                                                          { $$ = $1; }
              |                                                                    { $$ = []; }
              ;

ATRIBUTOS: ATRIBUTOS ATRIBUTO                                                      { $1.push($2); $$ = $1;}
         | ATRIBUTO                                                                { $$ = [$1]; }
         ;

ATRIBUTO: identifier asig StringLiteral1                                            {;}
        | identifier asig StringLiteral2                                            {;}
        ;

CONTENTS: CONTENTS BODY                                                            { $1=$1 + ' ' +$2 ; $$ = $1;}
         | BODY                                                                    { $$ = $1 }
         ;

BODY: identifier { $$ = $1; console.log($$); }
    | DoubleLiteral { $$ = $1; console.log($$); }
    | StringLiteral1 { $$ = $1; console.log($$); }
    | StringLiteral2 { $$ = $1; console.log($$); }
    | simbolos1  { $$ = $1; console.log($$); }
    /*| simbolos2  { $$ = $1; console.log($$); }
    | simbolos3  { $$ = $1; console.log($$); }
    | simbolos4  { $$ = $1; console.log($$); }*/
    | gt { $$ = $1; console.log($$); }
    | asig { $$ = $1; console.log($$); }
    ;