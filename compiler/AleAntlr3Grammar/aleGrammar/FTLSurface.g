lexer grammar FTLSurface;
/*
@lexer::header {
  package aleGrammar;
}
*/
HEXCOLOR
	:	 '#' HEX_DIGIT HEX_DIGIT HEX_DIGIT
	| 	 '#' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT
	| 	 '#' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT
	| 	 '#' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT
	;

STAR    : '*';
LTE :   '<=';
LT  :   '<';
GTE :   '>=';
GT  : '>';
NEQ :   '!=';
EQ2  :   '==';

MINUS : '-';
DIV : '/';
MOD :   '%';
IF	: 'if';
ELSE	: 'else';

TYPE	:	'type';
CHILDREN:	'children';
TRUE	: 'true';
FALSE	: 'false';

FOLD    :   'fold';
DOTDOT  :   '..';

FUNCTIONS	: 'functions';
ASSIGN	:	':=';
INPUT 	:	'input';
CONST 	:	'const';
VAR 	:	'var';
LOCAL 	:	'local';
ACTIONS :	'actions';
CLSS 	:	'class';
TRT:	 'trait';
ATTRIBUTES	: 'attributes';
IFACE	: 	'interface';
PHANTOM :	 'phantom';
BOOL_KEYWORD	:	'bool';
STRING_KEYWORD	:	'string';
INT_KEYWORD	:	'int';
FLOAT_KEYWORD	:	 'float';
DOUBLE_KEYWORD    : 'double';
COLOR_KEYWORD	:	'color';
PX_KEYWORD	:	'px';
TAGGEDINT_KEYWORD : 'taggedInt';
TAGGEDFLOAT_KEYWORD : 'taggedFloat';
TAGGEDDOUBLE_KEYWORD   : 'taggedDouble';
TIME_KEYWORD: 'time';
INT :	'0'..'9'+ ;
FLOAT
    :   ('0'..'9')+ '.' ('0'..'9')* EXPONENT? 'f'?
    |   '.' ('0'..'9')+ EXPONENT?
    |   ('0'..'9')+ EXPONENT
    ;
COMMENT
    :   '//' ~('\n'|'\r')* '\r'? '\n' {$channel=HIDDEN;}
    |   '/*' ( options {greedy=false;} : . )* '*/' {$channel=HIDDEN;}
    ;
WS  :   ( ' '
        | '\t'
        | '\r'
        | '\n'
        ) {$channel=HIDDEN;}
    ;
STRING	:  '"' ( ESC_SEQ | ~('\\'|'"') )* '"' ;
CHAR:  '\'' ( ESC_SEQ | ~('\''|'\\') ) '\'' ;

fragment
EXPONENT : ('e'|'E') ('+'|MINUS)? ('0'..'9')+ ;

fragment
HEX_DIGIT : ('0'..'9'|'a'..'f'|'A'..'F') ;

fragment
ESC_SEQ
    :   '\\' ('b'|'t'|'n'|'f'|'r'|'\"'|'\''|'\\')
    |   UNICODE_ESC
    |   OCTAL_ESC
    ;

fragment
OCTAL_ESC
    :   '\\' ('0'..'3') ('0'..'7') ('0'..'7')
    |   '\\' ('0'..'7') ('0'..'7')
    |   '\\' ('0'..'7')
    ;

fragment
UNICODE_ESC :   '\\' 'u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT ;

LOOP    : 'loop';
LBRACE : '{';
RBRACE : '}';
PIPE : '|';
AND :   '&';
SEMICOLON : ';';
EQ : '=';
SCHEDULE : 'schedule';
LPAREN : '(';
RPAREN : ')';
COMMA : ',';
DOT : '.';
LBRACKET : '[';
RBRACKET : ']';
AT : '@';
COLON : ':';
QUESTION : '?';
PLUS : '+';
EXCLAMATION : '!';
IDRAW  :	('a'..'z'|'A'..'Z'|'_') ('a'..'z'|'A'..'Z'|'0'..'9'|'_'|MINUS)* ;
