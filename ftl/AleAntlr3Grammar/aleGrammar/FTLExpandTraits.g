//Expand classes to eliminate uses of traits
//Previous traversal guarantees trait/interface/class ordering
//Syntax check: no duplicate trait names (case sensitive)
//Need to rerun reordering pass after this to fix order within a class
grammar FTLExpandTraits;

options {
  tokenVocab=FTLSurface;
  output=AST;
  ASTLabelType=CommonTree;
}
//@header { package aleGrammar; }
//parse grammar
import FTLSurface;
@header {
  package aleGrammar;

  import java.util.Map;
  import java.util.ArrayList;
  import java.util.HashSet;
  
  import AGEval.*;
  import aleGrammar.GenSym;
}
@lexer::header { package aleGrammar; }

@members {
  public final List<String> errors = new java.util.LinkedList<String>();
  public void displayRecognitionError(String[] tokenNames,
                                        RecognitionException e) {
    String err = getErrorHeader(e) + " " + getErrorMessage(e, tokenNames);                                        
    System.err.println(err);
    errors.add(err);
  }

  public final java.util.HashMap<String, String> traits = new java.util.HashMap<String, String>();

  public String pullTrait (String cls, String trt) throws RecognitionException {
    String res = traits.get(trt);
    if (res == null) {
        System.err.println("Class " + cls + ": cannot find trait " + trt);
        throw new RecognitionException();
    }
    return res;
  }
  
  public FTLExpandTraitsParser parseStr (String str) {
     return new FTLExpandTraitsParser(new CommonTokenStream(new FTLExpandTraitsLexer(new ANTLRStringStream(str))));
  }
}


///////////////////////////////////////////////////////////////////////////
//eliminate traits
///////////////////////////////////////////////////////////////////////////

root:
    { Boolean hasSchedule = false; }
    (scheduleConstraints { hasSchedule = true;})? typedef* classTrait* iface* clss*
    ->  {hasSchedule}? ^(scheduleConstraints typedef+ iface+ clss+)
    ->  (typedef+)? (iface+)? (clss+)?
    ;


///////////////////////////////////////////////////////////////////////////
//normal top level
///////////////////////////////////////////////////////////////////////////

scheduleConstraints :	 SCHEDULE LBRACE STRING? RBRACE;
typedef : TYPE IDRAW EQ IDRAW (PIPE IDRAW )* SEMICOLON;
	
iface:	IFACE IDRAW LBRACE ifaceField* RBRACE ;

///////////////////////////////////////////////////////////////////////////
//hide trait call and mix them into body 
///////////////////////////////////////////////////////////////////////////

classTrait
	: TRT
	IDRAW 
	LBRACE 
	contents { 
	    if (traits.get($IDRAW.text) != null) {
	        System.err.println("Multiple copies of trait " + $IDRAW.text);
	        throw new RecognitionException();	    
	    }
	    traits.put($IDRAW.text, $contents.text);
	}
	RBRACE 	 
	;

contents : (  children | header | phantom | body )*;
	
clss :
{
    Boolean hasTraits = false;
    String trts = "";
}
	CLSS c=IDRAW (LPAREN 
	    (t0=IDRAW
	    { 
	        hasTraits = true; 
	        trts += "/* " + $t0.text + "*/ " + pullTrait($c.text, $t0.text);
	    } 
	    (COMMA ti=IDRAW
	    {  trts += "/* " + $ti.text + "*/ " + pullTrait($c.text, $ti.text); }   
	    )*
	    )?
	    RPAREN)? COLON i=IDRAW 
	LBRACE (originalBody+=header 
        | originalBody+=children
        | originalBody+=phantom 
        | originalBody+=body
	    )* RBRACE	
	-> {!hasTraits}?
	    CLSS $c COMMENT["/* class had no traits to expand */"] COLON $i
	    LBRACE $originalBody* RBRACE
	-> CLSS $c COMMENT["/* expanded traits: " + $t0.text + ", etc. */"] COLON $i
	LBRACE 
	    $originalBody+
	    COMMENT["/* traits */"]
	    { parseStr(trts).contents().getTree() }
	RBRACE
    ;

///////////////////////////////////////////////////////////////////////////
//the rest is normal
///////////////////////////////////////////////////////////////////////////
	

header: ATTRIBUTES LBRACE ( | (classField (SEMICOLON+ classField)*)) (|SEMICOLON) RBRACE;
children: CHILDREN LBRACE ( | (child (SEMICOLON+ child)*)) (|SEMICOLON) RBRACE;
phantom: PHANTOM LBRACE ( | (lhs (SEMICOLON+ lhs)*)) (|SEMICOLON) RBRACE;
body: ACTIONS LBRACE topStmt* RBRACE;


child:  IDRAW COLON IDRAW |  IDRAW COLON LBRACKET IDRAW RBRACKET ;


ifaceField
	: INPUT id COLON maybeType (EQ literal)? (AT INT)? SEMICOLON
	| INPUT id  COLON QUESTION IDRAW(EQ IDRAW)? (AT INT)? SEMICOLON
	| INPUT id  COLON IDRAW(| (EQ IDRAW)) (AT INT)? SEMICOLON
	| VAR IDRAW COLON type  (AT INT)? SEMICOLON
	| VAR IDRAW COLON IDRAW(AT INT)? SEMICOLON
	;

classField
	: INPUT id COLON maybeType  (EQ literal)?
	| INPUT id COLON QUESTION IDRAW(EQ IDRAW)?
	| INPUT id COLON IDRAW(EQ IDRAW)?
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
	 
type:	BOOL_KEYWORD | INT_KEYWORD | FLOAT_KEYWORD | COLOR_KEYWORD | STRING_KEYWORD | PX_KEYWORD | TAGGEDINT_KEYWORD | TAGGEDFLOAT_KEYWORD;

literal	: bl | INT | FLOAT | STRING | HEXCOLOR | LBRACE INT COMMA (INT|FLOAT) RBRACE;

bl	: TRUE | FALSE;