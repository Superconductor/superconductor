// reorder: typedef Traits* Interfaces* Classes*
grammar FTLSyntax;

options {
  output=AST;
}

import FTLSurface;

@header {
  package aleGrammar;
}
@lexer::header {
  package aleGrammar;
}

@members {
  public final List<String> errors = new java.util.LinkedList<String>();
  public void displayRecognitionError(String[] tokenNames,
                                        RecognitionException e) {
    String err = getErrorHeader(e) + " " + getErrorMessage(e, tokenNames);
    System.err.println(err);
    errors.add(err);
  }
}

root:
    scheduleConstraints? (typedef |  classTrait | iface | clss)*
    ;

scheduleConstraints :	 SCHEDULE LBRACE STRING? RBRACE;
typedef : TYPE IDRAW EQ IDRAW  (PIPE IDRAW  )* SEMICOLON;

iface:
    IFACE i=IDRAW
    LBRACE ifaceField* RBRACE
    ;

clss :
	CLSS IDRAW (LPAREN (IDRAW (COMMA IDRAW)*)? RPAREN)? COLON IDRAW
	LBRACE (header | children | phantom | body)* RBRACE
    ;

classTrait
	: TRT IDRAW
	LBRACE
	  (  (ATTRIBUTES LBRACE (SEMICOLON | classField)* RBRACE)
	   | (CHILDREN LBRACE  (SEMICOLON | child )* RBRACE)
	   | (ACTIONS LBRACE (SEMICOLON | topStmt)* RBRACE )
	   | (PHANTOM LBRACE (SEMICOLON | lhs )* RBRACE)
	  )*
	 RBRACE
	;

header: ATTRIBUTES LBRACE ( | (classField (SEMICOLON+ classField)*)) (|SEMICOLON) RBRACE;
children: CHILDREN LBRACE ( | (child (SEMICOLON+ child)*)) (|SEMICOLON) RBRACE;
phantom: PHANTOM LBRACE ( | (lhs (SEMICOLON+ lhs)*)) (|SEMICOLON) RBRACE;
body: ACTIONS LBRACE topStmt* RBRACE;


child:  IDRAW COLON IDRAW  |  IDRAW COLON LBRACKET IDRAW  RBRACKET ;


ifaceField
	: INPUT id COLON maybeType (EQ literal)? (AT INT)? SEMICOLON
	| INPUT id  COLON QUESTION IDRAW (EQ IDRAW)? (AT INT)? SEMICOLON
	| INPUT id  COLON IDRAW (| (EQ IDRAW )) (AT INT)? SEMICOLON
	| VAR IDRAW COLON type  (AT INT)? SEMICOLON
	| VAR IDRAW COLON IDRAW (AT INT)? SEMICOLON
	;

classField
	: INPUT id COLON maybeType  (EQ literal)?
	| INPUT id COLON QUESTION IDRAW (EQ IDRAW)?
	| INPUT id COLON IDRAW (EQ IDRAW)?
	| VAR IDRAW COLON type
	| VAR IDRAW COLON IDRAW
	;

topStmt
	 : cond
	 | constraint SEMICOLON
	 | loop
	 ;

loop : LOOP id LBRACE  (cond | constraint | SEMICOLON)* RBRACE;


cond
	: IF LPAREN
	  expr RPAREN LBRACE
	  (cond | constraint | SEMICOLON)*
	  (RBRACE ELSE IF
	    LPAREN expr RPAREN LBRACE
	    (cond | constraint | SEMICOLON)*
	  )*
	  RBRACE ELSE LBRACE
	    (cond | constraint | SEMICOLON)*
	  RBRACE
	;

constraint
    : lhs ASSIGN expr
    | lhs ASSIGN FOLD expr DOTDOT expr
    ;

expr : logExpr (QUESTION logExpr COLON logExpr )* ;


logExpr: relExpr (((PIPE PIPE)|(AND AND)) relExpr )* ;
relExpr: addExpr((LTE|LT|GTE|GT|EQ2|NEQ) addExpr)*;
addExpr: multExpr ((PLUS|MINUS) multExpr	)* ;
multExpr: signExpr ((STAR|DIV|MOD) signExpr)*;
signExpr: (PLUS | MINUS|  EXCLAMATION )* callExpr;
callExpr
	: IDRAW LPAREN  (expr (COMMA expr)*)? RPAREN
	| primitiveExpr
	;
primitiveExpr
	: literal
	| rhs
	| LPAREN expr RPAREN
	;

lhs
	: id
	| id DOT id
	;


rhs
    : id
    | id DOT id
	| id suffix DOT id
	| suffix DOT id
	;

suffix 	: '$i' | '$$' | '$-';

id
	: IDRAW
	| type
	;

maybeType
	: QUESTION type
	| type
	;

type:	BOOL_KEYWORD | INT_KEYWORD | FLOAT_KEYWORD | DOUBLE_KEYWORD | COLOR_KEYWORD | STRING_KEYWORD | PX_KEYWORD | TAGGEDINT_KEYWORD | TAGGEDFLOAT_KEYWORD | TAGGEDDOUBLE_KEYWORD;

literal	: bl | INT | FLOAT | STRING | HEXCOLOR | LBRACE INT COMMA (INT|FLOAT) RBRACE;

bl	: TRUE | FALSE;

