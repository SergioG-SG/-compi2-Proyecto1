 /* segmento de codigo, es equivalente a la seccion parseCode que encontramos en CUP */
 /* aca podemos importar los módulos que vamos a utilizar, crear funciones, etc */
%{
	const { Objeto } = require('../build/Interprete/Expresion/Objeto');
    const { Atributo } = require('../build/Interprete/Expresion/Atributo');
%}


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
START : ROOTS EOF                                                                {$$=$1; return $$;}                                 
      ;

ROOTS: ROOTS ROOT                                                                {$1.push($2); $$=$1;}                                                 
     | ROOT                                                                      {$$ = [$1];}
     ;

ROOT: prologo RVERSION asig StringLiteral1 RENCODING asig StringLiteral1 prologc  {$$= new Objeto($1,'',@1.first_line,@1.first_column,[],[],$7);} 
    | lt identifier LIST_ATRIBUTOS gt      ROOTS         etiqca identifier gt     {$$= new Objeto($2,'',@1.first_line,@1.first_column,$3,$5,$7);}
    | lt identifier LIST_ATRIBUTOS gt      CONTENTS      etiqca identifier gt     {$$= new Objeto($2,$5,@1.first_line,@1.first_column,$3,[],$7) ; } 
    | lt identifier LIST_ATRIBUTOS gt                    etiqca identifier gt     {$$= new Objeto($2,'',@1.first_line,@1.first_column,$3,[],$7) ; }
    | lt identifier LIST_ATRIBUTOS etiqcc                                         {$$= new Objeto($2,'',@1.first_line,@1.first_column,$3,[],''); }                                    
    ;

LIST_ATRIBUTOS: ATRIBUTOS                           {$$=$1;}                               
              |                                     {$$=[];}                               
              ;

ATRIBUTOS: ATRIBUTOS ATRIBUTO                       {$$=$1;}                               
         | ATRIBUTO                                 {$$ = [$1];}                               
         ;

ATRIBUTO: identifier asig StringLiteral1            {$$ = new Atributo($1,$3,@1.first_line,@1.first_column);}                                
        | identifier asig StringLiteral2            {$$ = new Atributo($1,$3,@1.first_line,@1.first_column);}                              
        ;

CONTENTS: CONTENTS BODY                             {$1 = $1 + ' ' + $2; $$=$1;}                               
         | BODY                                     {$$ = $1;}                                                         
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