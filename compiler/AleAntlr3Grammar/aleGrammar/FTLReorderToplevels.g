// reorder: typedef Traits* Interfaces* Classes* (helps trait expansion)
// reorder: class { header children phantom body } (helps one-pass identifier checks)
grammar FTLReorderToplevels;

options {
  tokenVocab=FTLSurface;
  output=AST;
  ASTLabelType=CommonTree;
}
//import+header for parser grammar
import FTLSurface;
@header {
  package aleGrammar;

  import java.util.Map;
  import java.util.HashMap;
  import java.util.ArrayList;
  import java.util.HashSet;
  import java.util.LinkedList;

  import AGEval.*;
  import aleGrammar.GenSym;
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
///////////////////////////////////////////////////////////////////////////
//The main point of this pass
///////////////////////////////////////////////////////////////////////////

root:
    { Boolean hasSchedule = false; }
    (scheduleConstraints { hasSchedule = true;})? (typedef |  classTrait | iface | clss)+
    ->  {hasSchedule}? ^(scheduleConstraints (typedef+)? (classTrait+)? (iface+)? (clss+)?)
    ->  (typedef+)? (classTrait+)? (iface+)? (clss+)?
    ;

///////////////////////////////////////////////////////////////////////////
//The rest is the same as FTLSyntax (ANTLR fails when importing across grammar types)
///////////////////////////////////////////////////////////////////////////


scheduleConstraints :	 SCHEDULE LBRACE STRING? RBRACE;
typedef : TYPE IDRAW EQ IDRAW  (PIPE IDRAW  )* SEMICOLON;

iface: IFACE IDRAW LBRACE ifaceField* RBRACE ;

clss :
	CLSS IDRAW x=(LPAREN (IDRAW (COMMA IDRAW)*)? RPAREN)? COLON IDRAW
	LBRACE clsContents RBRACE;

clsContents:
    (header | children | phantom | body)*
    -> (header+)? (children+)? (phantom+)? (body+)?
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
