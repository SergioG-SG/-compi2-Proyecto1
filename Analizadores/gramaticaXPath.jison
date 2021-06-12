/* Definición Léxica */
%lex

%options case-insensitive

%%


\"[^\"]*\"               return 'todo1';
\'[^\']*\'              return 'todo2';

"."                      return '.';
".."                      return '..';
"::"                      return '::';
"/"                      return '/';
"["                      return '[';
"]"                      return ']';
"@"                      return '@';
"|"                      return '|';
"+"                      return '+';
"-"                      return '-';
"div"                    return 'div';
"*"                      return '*';
">="                     return '>=';
"<="                     return '<=';
"!="                      return '!=';
"="                      return '=';
">"                      return '>';
"<"                      return '<';
"or"                     return 'or';
"and"                    return 'and';
"mod"                    return 'mod';
"node()"                 return 'node()';
"text()"                 return 'text()';
"last()"                 return 'last()';
"position()"             return 'position()';
"parent"                 return 'parent';
"ancestor-or-self"       return 'ancestor-or-self';
"ancestor"               return 'ancestor';
"attribute"              return 'attribute';
"child"                  return 'child';
"descendant-or-self"     return 'descendant-or-self';
"descendant"             return 'descendant';
"following-sibling"      return 'following-sibling';
"following"              return 'following';
"namespace"              return 'namespace';
"preceding-sibling"      return 'preceding-sibling';
"preceding"              return 'preceding';
"self"                   return 'self';


[0-9]+("."[0-9]+)?\b       return 'digito';
([a-zA-Z])[a-zA-Z0-9_]*\b	 return 'nodename';



/* Espacios en blanco */
[ \r\t]+            {}
\n                  {}
/*-------------------*/




<<EOF>>                 return 'EOF';
.                       { console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }
/lex

%start XPATH

%% /* Definición de la gramática */

XPATH
	: EXPR EOF                                       {$$=$1;return $$;}
;

EXPR
	: EXPRSINGLE                                     {$$=$1;}
;

EXPRSINGLE
    : OREXPR                                         {$$=$1;}
;

OREXPR
    : OREXPR or ANDEXPR                                   { $1.push($3); $$=$1; } 
    | ANDEXPR                                            {$$=[$1];}
;

ANDEXPR
    : ANDEXPR and COMPARISONXPR                          { $1.push($3); $$=$1; } 
    | COMPARISONXPR                                     {$$=[$1];}

;

COMPARISONXPR
    : STRINGCONCATXPR GENERALCOMP STRINGCONCATXPR         

    | STRINGCONCATXPR                                   {$$=$1;}

;
GENERALCOMP
    : '='
    | '!='
    | '<'
    | '>'
    | '<='
    | '>='
;

STRINGCONCATXPR
    : RANGEXPR                                      { $$ = $1 ;} 
;

RANGEXPR
    : ADDITIVEEXPR                                  { $$=$1; } 
;

ADDITIVEEXPR
    : ADDITIVEEXPR '+' MULTIPLICATIVEEXPR       { $1.push($3); $$=$1; } 
    | ADDITIVEEXPR '-' MULTIPLICATIVEEXPR       { $1.push($3); $$=$1; } 
    | MULTIPLICATIVEEXPR                         {$$=[$1];}
;

MULTIPLICATIVEEXPR
    : UNIONEXPR                                    {$$=[$1];}      
    | MULTIPLICATIVEEXPR '*' UNIONEXPR       { $1.push($3); $$=$1; } 
    | MULTIPLICATIVEEXPR 'div' UNIONEXPR     { $1.push($3); $$=$1; } 
    | MULTIPLICATIVEEXPR 'mod' UNIONEXPR     { $1.push($3); $$=$1; } 
;

UNIONEXPR
    : UNIONEXPR '|' INTERSECTEXCEPTEXPR   { $1.push($3); $$=$1; }            
    | INTERSECTEXCEPTEXPR               {$$=[$1];}
;

INTERSECTEXCEPTEXPR
    : INSTANCEOFEXPR                    {$$=$1;}
;

INSTANCEOFEXPR
    : TREATEXPR                         {$$=$1;}
;

TREATEXPR
    : CASTABLEEXPR                      {$$=$1;}
;

CASTABLEEXPR
    : CASTEXPR                          {$$=$1;}
;

CASTEXPR
    : ARROWEXPR                         {$$=$1;}
;

ARROWEXPR
    : UNARYEXPR                         {$$=$1;}
;

UNARYEXPR
    : '-' VAlUEEXPR
    | '+' VAlUEEXPR
    | VAlUEEXPR                         {$$=$1;}
;

VAlUEEXPR
    : SIMPLEMAPEXPR                     {$$=$1;}
;

SIMPLEMAPEXPR
    : PATHEXPR                          {$$=$1;}
;

PATHEXPR
    : '/' '/' RELATIVEPATHEXPR 
    | '/' RELATIVEPATHEXPR              {$$=$1;}
    | RELATIVEPATHEXPR 
;

RELATIVEPATHEXPR
    : STEPEXPR                          {$$=[$1];}
    | RELATIVEPATHEXPR '/' STEPEXPR       { $1.push($3); $$=$1; }            
    | RELATIVEPATHEXPR '/' '/' STEPEXPR       { $1.push($4); $$=$1; }            
;

STEPEXPR
    : POSTFIXEXPR                        
    | AXISTEP                           {$$=$1;}
;

AXISTEP
    : REVERSESTEP PREDICATELIST
    | FORDWARDSTEP PREDICATELIST
    | REVERSESTEP
    | FORDWARDSTEP                      {$$=$1;}
;

PREDICATELIST
    : PREDICATELIST '[' EXPR ']' {console.log("dio");}
    | '[' EXPR ']' {console.log("dio");}
;

FORDWARDSTEP
    : FORDWARDAXIS NODETEST
    | ABBREVFORDWARDSTEP                {$$=$1;}
;

FORDWARDAXIS
    : child '::'
    | 'descendant-or-self' '::'
    | descendant '::'
    | attribute '::'
    | self '::'
    | 'following-sibling' '::'
    | following '::'
    | namespace '::'
;

ABBREVFORDWARDSTEP
    : '@' NODETEST
    | NODETEST                      {$$=$1;}
;

REVERSESTEP
    : REVERSEAXIS NODETEST
    | ABBREVREVERSESTEP
;

REVERSEAXIS
    : parent '::'
    | ancestor '::'
    | 'preceding-sibling' '::'
    | preceding '::'
    | 'ancestor-or-self' '::' 
;

ABBREVREVERSESTEP
    : '..'
;

NODETEST
    : KINDTEST
    | '*'
    | nodename {console.log($1);$$=$1;}
;

KINDTEST
    : 'text()'
    | 'node()'
;


POSTFIXEXPR
    : PRIMARYEXPR               
    | POSTFIXEXPR '[' EXPR ']' {console.log("dio2");} //es posible que nunca se use
;

PRIMARYEXPR
    : LITERAL                   
    | '.'
    | ARRAYCONSTRUCTOR
;

ARRAYCONSTRUCTOR
    : '[' ']'
    | '[' EXPRSINGLE ']' 
;

LITERAL
    : digito
    | todo1 
    | todo2 
    | 'last()'
    | 'position()'
;
