//rewrite conditionals into SSA-like form
//at end of conditional, transfer results out
//gen sym conditional test functions?

//handle nesting: flatten as you go

tree grammar FTLExpandConditionals;

options {
  tokenVocab=FTLSurface;
  output=AST;
  ASTLabelType=CommonTree;
}

//import FTLSurface;

@header {
  package aleGrammar;
    import java.util.HashMap;
    import java.util.HashSet;
    import java.util.Map.Entry;
}

//@lexer::header {  package aleGrammar; }

@members {
    public final List<String> errors = new java.util.LinkedList<String>();
    public void displayRecognitionError(String[] tokenNames,
                                        RecognitionException e) {
        String err = getErrorHeader(e) + " " + getErrorMessage(e, tokenNames);                                        
        System.err.println(err);
        errors.add(err);
    }
    
    
}

root: scheduleConstraints? typedef*  iface* clss*;

scheduleConstraints :	 SCHEDULE^ LBRACE STRING? RBRACE;
typedef : TYPE^ IDRAW EQ IDRAW  (PIPE IDRAW  )* SEMICOLON;
	
iface:	
    IFACE^ IDRAW
    LBRACE ifaceField* RBRACE
    ;

clss :
	CLSS^ c=IDRAW 
	COLON i=IDRAW 
	LBRACE (
	    header
	    | children
	    | phantom
	    | body
	)* RBRACE
    ;

header: 
    ATTRIBUTES^ LBRACE 
    ( | (classField (SEMICOLON+ classField)*)) (|SEMICOLON) 
    RBRACE;
children: 
    CHILDREN^ LBRACE 
    ( | (child (SEMICOLON+ child)*)) (|SEMICOLON) 
    RBRACE;
phantom: 
    PHANTOM^ LBRACE 
    ( | (lhs (SEMICOLON+ lhs)*)) (|SEMICOLON) 
    RBRACE;
body: ACTIONS LBRACE topStmt* RBRACE;

child:
    n=IDRAW COLON (i=IDRAW  |  LBRACKET i=IDRAW  RBRACKET) 
    ;

ifaceField
	: INPUT^ typeOrId COLON maybeType (EQ literal)? (AT INT)? SEMICOLON
	| INPUT^ typeOrId  COLON QUESTION IDRAW (EQ IDRAW)? (AT INT)? SEMICOLON
	| INPUT^ typeOrId  COLON IDRAW (| (EQ IDRAW )) (AT INT)? SEMICOLON
	| VAR^ i=IDRAW COLON type  (AT INT)? SEMICOLON
	| VAR^ i=IDRAW COLON IDRAW (AT INT)? SEMICOLON
	;

classField
	: INPUT^ typeOrId COLON maybeType  (EQ literal)?
	| INPUT^ typeOrId COLON QUESTION IDRAW (EQ IDRAW)?
	| INPUT^ typeOrId COLON IDRAW (EQ IDRAW)?
	| VAR^ i=IDRAW COLON type 
	| VAR^ i=IDRAW COLON IDRAW 
	;

topStmt
	 : cond
	 | constraint SEMICOLON
	 | loop
	 ;

loop : LOOP id LBRACE  (cond | constraint | SEMICOLON)* RBRACE;

cond: 
    IF LPAREN expr RPAREN LBRACE a=condCase RBRACE elseifs? ELSE LBRACE b=condCase RBRACE;
    

elseifs: elseif+;	    
elseif: ELSE^ IF LPAREN expr RPAREN LBRACE condCase RBRACE;

condCase: (cond | constraint | SEMICOLON)*;
    

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
	: typeOrId 
	| n=typeOrId DOT f=typeOrId 
	| typeOrId LBRACKET zero RBRACKET 
	| f=typeOrId LBRACKET ivar RBRACKET
	| f=typeOrId LBRACKET ivar GT zero RBRACKET 
	| f=typeOrId LBRACKET ivar MINUS one RBRACKET
	| n=typeOrId LBRACKET zero RBRACKET  DOT f=typeOrId 
	| n=typeOrId LBRACKET ivar RBRACKET  DOT f=typeOrId 
	| n=typeOrId LBRACKET ivar GT zero RBRACKET  DOT f=typeOrId 
	| n=typeOrId LBRACKET ivar MINUS one RBRACKET  DOT f=typeOrId
	;

ivar : IDRAW 
    ;
	
rhs 
	: typeOrId
	| IDRAW DOT typeOrId
	| typeOrId LBRACKET typeOrId RBRACKET  DOT typeOrId
	| typeOrId LBRACKET typeOrId MINUS one RBRACKET  DOT typeOrId
	;

zero : INT 
    { 
        if (!$INT.text.equals("0")) {
            System.out.println("Expected 0");
            throw new RecognitionException();
        }
    }
    ;

one : INT
    { 
        if (!$INT.text.equals("1")) {
            System.out.println("Expected 1");
            throw new RecognitionException();
        }
    }
    ;

typeOrId 
	: IDRAW 
	| type
	;

maybeType
	: QUESTION type 
	| type 
	;
	 
type:	BOOL_KEYWORD | INT_KEYWORD | FLOAT_KEYWORD | COLOR_KEYWORD | STRING_KEYWORD | PX_KEYWORD | TAGGEDINT_KEYWORD | TAGGEDFLOAT_KEYWORD;

literal	: bl | INT | FLOAT | STRING | HEXCOLOR | LBRACE INT COMMA (INT|FLOAT) RBRACE;

bl	: TRUE | FALSE;

