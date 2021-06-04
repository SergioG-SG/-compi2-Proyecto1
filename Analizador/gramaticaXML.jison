%lex

%options case-insensitive

escapechar                          [\'\"\\bfnrtv]
escape                              \\{escapechar}
acceptedcharsdouble                 [^\"\\]+
stringdouble                        {escape}|{acceptedcharsdouble}
stringliteral                       \"{stringdouble}*\"

acceptedcharssingle                 [^\'\\]
stringsingle                        {escape}|{acceptedcharssingle}
charliteral                         \'{stringsingle}\'

BSL                                 "\\".
%s                                  comment

%%
"<!--"                              this.begin('comment');
<comment>"-->"                      this.popState();
<comment>.                          /* skip comment content*/
\s+

"/"                                 return 'div';
"<"                                 return 'lt';
">"                                 return 'gt';
"="                                 return 'asig';
"?"                                 return 'qmr';

"xml"                       return 'RXML';
"version"                   return 'RVERSION';
"encoding"                  return 'RENCODING'


/* Number literals */
(([0-9]+"."[0-9]*)|("."[0-9]+))     return 'DoubleLiteral';
[0-9]+                              return 'IntegerLiteral';

[a-zA-Z_][a-zA-Z0-9_ñÑ]*            return 'identifier';

{stringliteral}                     return 'StringLiteral'
{charliteral}                       return 'CharLiteral'


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
START : XML OEF                                                                    { $$ = $1; return $$; }
      ;

XML: PROLOG ROOTS                                                                  
   | ROOTS
   ;

PROLOG: lt qmr RXML ATRIB_PROLOG qmr gt
	 ;

ATRIB_PROLOG: RVERSION asig StringLiteral RENCODING asig STRINGLITERAL
		  | RVERSION asig StringLiteral
	       | RENCODING asig STRINGLITERAL
		  | RENCODING asig STRINGLITERAL RVERSION asig StringLiteral
		  ;

ROOTS: ROOTS ROOT                                                                  { $1.push($2); $$ = $1;}
	| ROOT                                                                        { $$ = [$1]; }
     ;

ROOT: lt identifier LIST_ATRIBUTOS gt ROOTS             lt div identifier gt       { ; }
    | lt identifier LIST_ATRIBUTOS gt LIST_ID_OB        lt div identifier gt       { ; }
    | lt identifier LIST_ATRIBUTOS div gt                                          { ; }
    ;

LIST_ATRIBUTOS: ATRIBUTOS                                                          { $$ = $1; }
              |                                                                    { $$ = []; }
              ;

ATRIBUTOS: ATRIBUTOS ATRIBUTO                                                      { $1.push($2); $$ = $1;}
         | ATRIBUTO                                                                { $$ = [$1]; }
         ;

ATRIBUTO: identifier asig StringLiteral                                            { ; }
        ;

LIST_ID_OBJ: LIST_ID_OBJ identifier                                                { $1=$1 + ' ' +$2 ; $$ = $1;}
           | identifier                                                            { $$ = $1 }
           ;
