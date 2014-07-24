//print full language (after
tree grammar FTLCondPrinter;
options {
    tokenVocab=FTLSurface;
    ASTLabelType=CommonTree;
    output=template;
}

/*
poly:   ^('+'  a=poly b=poly)   -> template(a={$a.st},b={$b.st}) "<a>+<b>"
    |   ^(MULT a=poly b=poly)   -> template(a={$a.st},b={$b.st}) "<a><b>"
    |   ^('^'  a=poly b=poly)   -> template(a={$a.st},b={$b.st}) "<a>^<b>"
    |   INT                     -> {%{$INT.text}}
    |   ID                      -> {%{$ID.text}}
    ;
*/

root: s=scheduleConstraints? (t+=typedef)*  (i+=iface)* (c+=clss)*
  -> root(s={$s.st}, t={$t}, iface={$i}, c={$c})
  ;

scheduleConstraints :	 SCHEDULE^ LBRACE s=STRING? RBRACE
  -> schedule(s={$s.st})

typedef : TYPE^ i=IDRAW EQ v0=IDRAW  (PIPE (vi+=IDRAW))* SEMICOLON
  -> typedef(n={$i.st}, v0={$v0.st}, vi={$vi})
  ;

iface: IFACE^ i=IDRAW LBRACE (fld+=ifaceField)* RBRACE
  -> iface(n={$i.st}, fld={$fld})
  ;

clss :
	CLSS^ c=IDRAW
	COLON i=IDRAW
	LBRACE (
	    h+=header
	    | ch+=children
	    | p+=phantom
	    | b+=body
	)* RBRACE
  ->
  clss(c={$c.st}, iface={$i.st}, h={$h}, ch={$ch}, p={$p}, b={$b})
  ;

header:
    ATTRIBUTES^ LBRACE
    ( | (c0=classField (SEMICOLON+ (ci+=classField))*)) (|SEMICOLON)
    RBRACE
    -> header(c0={$c0.st}, ci={$ci})
    ;

children:
    CHILDREN^ LBRACE
    ( | (c0=child (SEMICOLON+ (ci+=child))*)) (|SEMICOLON)
    RBRACE
    -> children(c0={$c0.st}, ci={$ci})
    ;
phantom:
    PHANTOM^ LBRACE
    ( | (p0=lhs (SEMICOLON+ (pi+=lhs))*)) (|SEMICOLON)
    RBRACE
    -> phantom(p0={$p0.st}, pi={$pi})
    ;
body:
    ACTIONS^ LBRACE
    ( | (t0=topStmt (SEMICOLON+ (ti+=topStmt))*)) (|SEMICOLON)
    RBRACE
    -> body(t0={$t0.st}, ti={$ti});

child:
    n=IDRAW COLON
      (i=IDRAW
        -> childAtom(n={$n.st}, iface={$i.st})
      |  LBRACKET i=IDRAW  RBRACKET
        -> childList(n={$n.st}, iface={$i.st}))
    ;

ifaceField
	: INPUT^ typeOrId COLON t=maybeType (EQ e=literal)? (AT INT)? SEMICOLON
	  -> field(mut={"input"}, n={$typeOrId.st}, t={$t.st}, e={$e.st})
	| INPUT^ typeOrId  COLON QUESTION t=IDRAW (EQ e=IDRAW)? (AT INT)? SEMICOLON
	  -> field(mut={"input"}, n={$typeOrId.st}, t={$t.st}, e={$e.st}, maybe={""})
	| INPUT^ typeOrId  COLON t=IDRAW (| (EQ e=IDRAW )) (AT INT)? SEMICOLON
	  -> field(mut={"input"}, n={$typeOrId.st}, t={$t.st}, e={$e.st})
	| VAR^ i=IDRAW COLON type  (AT INT)? SEMICOLON
	  -> field(mut={"var"}, n={$i.st}, t={$type.st})
	| VAR^ i=IDRAW COLON t=IDRAW (AT INT)? SEMICOLON
	  -> field(mut={"var"}, n={$i.st}, t={$t.st})
	;

classField
	: INPUT^ typeOrId COLON maybeType  (EQ e=literal)?
	  -> field(mut={"input"}, n={$typeOrId.st}, t={$maybeType.st}, e={$e.st})
	| INPUT^ typeOrId COLON QUESTION t=IDRAW (EQ e=IDRAW)?
	  -> field(mut={"input"}, n={$typeOrId.st}, t={$t.st}, e={$e.st}, maybe={""})
	| INPUT^ typeOrId COLON t=IDRAW (EQ e=IDRAW)?
	  -> field(mut={"input"}, n={$typeOrId.st}, t={$t.st}, e={$e.st})
	| VAR^ i=IDRAW COLON t=type
	  -> field(mut={"var"}, n={$IDRAW.st}, t={$t.st})
	| VAR^ i=IDRAW COLON t=IDRAW
	  -> field(mut={"var"}, n={$i.st}, t={$t.st})
	;

topStmt
	 : cond -> {$cond.st}
	 | constraint -> {$constraint.st}
	 ;

cond:
    IF LPAREN t0=expr RPAREN LBRACE c0=condCase RBRACE e=elseifs? ELSE LBRACE cn=condCase RBRACE
    -> cond(t0={$t0.st}, c0={$c0.st}, e={$e}, cn={$cn.st})
    ;


elseifs: (e+=elseif)+ -> elseifs($e);
elseif: ELSE^ IF LPAREN expr RPAREN LBRACE condCase RBRACE
  -> elseif(t={$expr.st},c={$condCase.st})
  ;

condCase: (ca+=cond | cb+=constraint | SEMICOLON)*
  -> condCase(ca={$ca},cb={$cb})
  ;

constraint : lhs ASSIGN^ expr -> constraint(lhs={$lhs.st}, rhs={$expr.st});

expr : e0=logExpr (QUESTION eli+=logExpr COLON eri+=logExpr )*
  -> ternExpr(e0={$e0.st}, eli={$eli}, eri={$eri})
  ;

logExpr: e0=relExpr (op+=('&&PIPE||') ei+=relExpr )*
  -> binExpr(e0={$e0.st}, op={$op}, ei={$ei})
  ;
relExpr: e0=addExpr (op+=('<=PIPE<PIPE>='|GT|'==PIPE!=') ei+=addExpr)*
  -> binExpr(e0={$e0.st}, op={$op}, ei={$ei})
  ;

addExpr: e0=multExpr (op+=(PLUS|MINUS) ei+=multExpr	)*
  -> binExpr(e0={$e0.st}, op={$op}, ei={$ei})
  ;

multExpr: e0+=signExpr (op+=(STAR|'/PIPE%') ei+=signExpr)*
  -> binExpr(e0={$e0.st}, op={$op}, ei={$ei})
  ;

signExpr: (op+=PLUS | op+=MINUS|  op+=EXCLAMATION )* e=callExpr;
  -> unExpr(op={$op}, e={$e.st})
  ;

callExpr
	: f=IDRAW LPAREN  (a+=expr (COMMA a+=expr)*)? RPAREN
    -> callExpr(f={$f.st}, a={$a})
	| primitiveExpr
	  -> {$primitiveExpr.st}
	;
primitiveExpr
	: literal -> {$literal.st}
	| rhs  -> {$rhs.st}
	| LPAREN expr RPAREN -> { $expr.st }
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

type:	BOOL_KEYWORD | INT_KEYWORD | FLOAT_KEYWORD | DOUBLE_KEYWORD | COLOR_KEYWORD | STRING_KEYWORD | PX_KEYWORD | TAGGEDINT_KEYWORD | TAGGEDFLOAT_KEYWORD | TAGGEDDOUBLE_KEYWORD;

literal	: bl | INT | FLOAT | STRING | HEXCOLOR | LBRACE INT COMMA (INT|FLOAT) RBRACE;

bl	: TRUE | FALSE;

