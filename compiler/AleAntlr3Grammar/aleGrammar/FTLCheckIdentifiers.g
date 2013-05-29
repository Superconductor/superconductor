//checks identifiers after trait expansions
//Interfaces: 
//  unique name
//  disjoint set of identifiers
//Classes:
//  unique name
//  disjoint set of identifiers
//  implements a known interface
//  identifiers don't conflict with interface
//  unique children + they implement a known interface
//  TODO: check all attributes assigned by class or interface?
//Loops:
//  LHS: index variable is 0 | i - 1 | i | i > 0
grammar FTLCheckIdentifiers;

options {
  tokenVocab=FTLSurface;
  output=AST;
  ASTLabelType=CommonTree;
}

import FTLSurface;

@header {
  package aleGrammar;
    import java.util.HashMap;
    import java.util.HashSet;
    import java.util.Map.Entry;
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
    
    public HashMap<String,HashSet<String>> classesVars = new HashMap<String,HashSet<String>>();
    public HashMap<String,HashSet<String>> classesInputs = new HashMap<String,HashSet<String>>();
    public HashMap<String, String> classInterface = new HashMap<String, String>();
    public HashMap<String,HashSet<String>> interfacesVars = new HashMap<String,HashSet<String>>();
    public HashMap<String,HashSet<String>> interfacesInputs = new HashMap<String,HashSet<String>>();
    public HashMap<String, HashSet<String>> classSelfSinks = new HashMap<String, HashSet<String>>();
    public HashMap<String, HashMap<String, HashSet<String>>> classChildSinks = new HashMap<String, HashMap<String, HashSet<String>>>();
    // className => childName => interfaceName
    public HashMap<String, HashMap<String,String> > classChilds = new HashMap<String, HashMap<String,String> >();
    public void addUnique (String id, HashMap<String,HashSet<String>> store, String loc) throws RecognitionException {
        if (store.get(id) != null) {
            System.err.println(loc + ": multiple with name " + id);
            throw new RecognitionException();
        }
        store.put(id, new HashSet<String>());
    }
    public void addUniqueField(String id, HashSet<String> store, HashSet<String> store2, String label) throws RecognitionException {
        if (store.contains(id) || store2.contains(id)) {
            System.err.println("Field repeatedly declared in " + label +": "  + id);
            throw new RecognitionException();
        }
        store.add(id);    
    }
    public void checkUniqueField(String id, HashSet<String> store, HashSet<String> store2, String label) throws RecognitionException {
        if (store.contains(id) || store2.contains(id)) {
            System.err.println("Field repeatedly declared in " + label +": "  + id);
            throw new RecognitionException();
        }    
    }
	public void checkFieldExists(String id, HashSet<String> infIds, HashSet<String> clsIds, String lbl) throws RecognitionException {
	    if (!infIds.contains(id) && !clsIds.contains(id)) {
	        System.err.println("Cannot find inteface nor class variable for assignment to " + id + " (" + lbl  + ")");
	        throw new RecognitionException();
	    }
	}
	public void checkChildFieldExists(String fld, String child, HashMap<String, String> childMap, String lbl) throws RecognitionException {
	    String iface = childMap.get(child);
		if (iface == null) {
    	    	System.err.println("Child does not exist: " + child + " in " + child + "." + fld + " (" + lbl + ")");
    	    	throw new RecognitionException();
    	}	    
	    HashSet<String> attribs = interfacesVars.get(iface); //should not be null (made when iface created)
	    if (!attribs.contains(fld)) {
	        System.err.println("For access (" + child + "::" + iface + ")." + fld 
	            + ", fld is not a member of interface " + iface + "(" + lbl + ")");
	        throw new RecognitionException();
	    }
	}
	
	public void checkChildExists(String child, HashMap<String, String>childMap, String lbl) throws RecognitionException {
		String iface = childMap.get(child);
		if (iface == null) {
    	    	System.err.println("Child does not exist: " + child + " in loop " + child + " { ... } (" + lbl + ")");
    	    	throw new RecognitionException();
    	}
    }
	
	
	
	public Boolean doesParentAssign(String cls, String field, boolean isSelfAssign) {
	    Boolean parentAssign = false;
        String iface = classInterface.get(cls);
        for (Entry<String, HashMap<String,String>> p : classChilds.entrySet()) {
            for (Entry<String, String> child : p.getValue().entrySet()) {
                if (child.getValue().equals(iface)) {
                    parentAssign = classChildSinks.get(p.getKey()).get(child.getKey()).contains(field);
                    if (isSelfAssign && parentAssign) {
                        System.err.println("Double assignment; remove one: ");
                        System.err.println("  class " + cls + " : " + iface + " { ... " + field + " :=  ...");
                        System.err.println("  class " + p.getKey() + " { ... " + child.getKey() + "." + field + " := ..."); 
                        parentAssign = true;
                    }
                }
            }
        }
        return parentAssign;	
	}
	
	public void checkAssignments() throws RecognitionException {
	  Boolean allClear = true;
	  //vars are singly assigned
	  //Slow, but pairwise comparisons (better error messages)
      for (Entry<String, HashSet<String>> c : classesVars.entrySet()) {
        String iface = classInterface.get(c.getKey());
	    //check self variables against assignments by parent
	    //  (don't check children because they'll be checked inductively)
	    for (String classVarField : c.getValue()) {
	        Boolean selfAssign = classSelfSinks.get(c.getKey()).contains(classVarField);
	        Boolean parentAssign = doesParentAssign(c.getKey(), classVarField, selfAssign);
	        if (!selfAssign && !parentAssign) {
                System.err.println("Missing assignment to a class variable, add one: ");
                System.err.println("  class " + c.getKey() + " : " + iface + " { ... " + classVarField + " :=  ...");
	            allClear = false;
	        } else if (selfAssign && parentAssign) {
	            allClear = false;
	            System.err.println("Both parent class and self class assign to a class variable: " + c.getKey() + "::" + classVarField);
	            throw new RecognitionException();	        
	        }
	    }
	    //check self interface variables against assignments by parent
	    //  (don't check children because they'll be checked inductively)
	    for (String interfaceVarField : interfacesVars.get(iface)) {
	        Boolean selfAssign = classSelfSinks.get(c.getKey()).contains(interfaceVarField);
	        Boolean parentAssign = doesParentAssign(c.getKey(), interfaceVarField, selfAssign);
	        if (!selfAssign && !parentAssign) {
                System.err.println("Missing assignment to an interface variable, add one here or all parents: ");
                System.err.println("  class " + c.getKey() + " : " + iface + " { ... " + interfaceVarField + " :=  ...");
	            allClear = false;
	        } else if (selfAssign && parentAssign) {
	            allClear = false;
	            System.err.println("Both parent class and self class assign to an interface variable: " + c.getKey() + "::" + interfaceVarField);
	            throw new RecognitionException();	        
	        }
	    }
	    //class input fields are not assigned
	    //  (don't check children because they'll be checked inductively)
	    for (String classInputField : classesInputs.get(c.getKey())) {
	        if (classSelfSinks.get(c.getKey()).contains(classInputField)) { //selfAssign
	            System.err.println("Assignment to a class input field by self: " + c.getKey() + "::" + classInputField);
	        } else if (doesParentAssign(c.getKey(), classInputField, false)) {
	            System.err.println("Assignment to a class input field by parent: " + c.getKey() + "::" + classInputField);	        
	        }	       
	    }
	    //interface input fields are not assigned
	    //  (don't check children because they'll be checked inductively)
	    for (String interfaceInputField : interfacesInputs.get(iface)) {
	        if (classSelfSinks.get(c.getKey()).contains(interfaceInputField)) { //selfAssign
	            System.err.println("Assignment to a class input field by self: " + c.getKey() + "::" + interfaceInputField);
	        } else if (doesParentAssign(c.getKey(), interfaceInputField, false)) {
	            System.err.println("Assignment to a class input field by parent: " + c.getKey() + "::" + interfaceInputField);	        
	        }	       
	    }
	    
	  }
	  if (!allClear) throw new RecognitionException();
	}
}

root: scheduleConstraints? typedef*  iface* clss* { checkAssignments(); };

scheduleConstraints :	 SCHEDULE LBRACE STRING? RBRACE;
typedef : TYPE IDRAW EQ IDRAW  (PIPE IDRAW  )* SEMICOLON;
	
iface:	
    IFACE IDRAW { 
        addUnique($IDRAW.text, interfacesVars, "interfaces");
        interfacesInputs.put($IDRAW.text, new HashSet<String>());
    }
    LBRACE ifaceField[interfacesVars.get($IDRAW.text), interfacesInputs.get($IDRAW.text)]* RBRACE
    ;

clss :
	CLSS c=IDRAW { 
	    addUnique($c.text, classesVars, "classes");
	    classesInputs.put($c.text, new HashSet<String>());	    
	    classChilds.put($c.text, new HashMap<String,String>());
	    classSelfSinks.put($c.text, new HashSet<String>());
	    classChildSinks.put($c.text, new HashMap<String, HashSet<String>>());
	}
	COLON i=IDRAW 
	{ 
	    if (interfacesVars.get($i.text) == null) {
	        System.err.println("Class " + $c.text + ": implements unknown interface " + $i.text);
	        throw new RecognitionException();	
	    }
	    classInterface.put($c.text, $i.text);
	}
	LBRACE (
	    header[interfacesVars.get($i.text), interfacesInputs.get($i.text), classesVars.get($c.text), classesInputs.get($c.text)] 
	    | children[classChilds.get($c.text), classChildSinks.get($c.text)] 
	    | phantom[(HashSet<String>)interfacesVars.get($i.text), (HashSet<String>)classesVars.get($c.text), classChilds.get($c.text), classSelfSinks.get($c.text), classChildSinks.get($c.text) ] 
	    | body[ interfacesVars.get($i.text), 
	            interfacesInputs.get($i.text), 
	            classesVars.get($c.text), 
	            classesInputs.get($c.text), 
	            classChilds.get($c.text),
	            classSelfSinks.get($c.text),
	            classChildSinks.get($c.text)] 
	)* RBRACE
    ;

header[HashSet<String> infVars, HashSet<String> infInputs, HashSet<String> clsVars, HashSet<String> clsInputs]: 
    ATTRIBUTES LBRACE 
    ( | (classField[infVars, infInputs, clsVars, clsInputs] (SEMICOLON+ classField[infVars, infInputs, clsVars, clsInputs])*)) (|SEMICOLON) 
    RBRACE;
children[HashMap<String,String> childMap, HashMap<String, HashSet<String>> childSinks]: 
    CHILDREN LBRACE 
    ( | (child[childMap, childSinks] (SEMICOLON+ child[childMap, childSinks])*)) (|SEMICOLON) 
    RBRACE;
phantom[HashSet<String> infVarIds, HashSet<String> clsVarIds, HashMap<String, String> childMap, HashSet<String> selfSinks, HashMap<String, HashSet<String>> childSinks]: 
    PHANTOM LBRACE 
    ( | (lhs[infVarIds, clsVarIds, childMap, selfSinks, childSinks] (SEMICOLON+ lhs[infVarIds, clsVarIds, childMap, selfSinks, childSinks])*)) (|SEMICOLON) 
    RBRACE;
    
    
body[HashSet<String> infVarIds, HashSet<String> infInIds, HashSet<String> clsVarIds, HashSet<String> classInIds, HashMap<String, String> childMap, HashSet<String> selfSinks, HashMap<String, HashSet<String>> childSinks]: 
    ACTIONS LBRACE topStmt[infVarIds, clsVarIds, childMap, selfSinks, childSinks]* RBRACE;


child[HashMap<String,String> childMap, HashMap<String, HashSet<String>> childSinks]:  
    n=IDRAW COLON (i=IDRAW  |  LBRACKET i=IDRAW  RBRACKET) 
    {
        if (childMap.containsKey($n.text)) {
            System.err.println("Duplicate child name: " + $n.text);
            throw new RecognitionException();
        }
        if (!interfacesVars.containsKey($i.text)) {
            System.err.println("Child " + $n.text + " has interface of unknown type " + $i.text);
            throw new RecognitionException();
        }
        childMap.put($n.text, $i.text);
        childSinks.put($n.text, new HashSet<String>());
    }
    ;

ifaceField[HashSet<String> varAttribs, HashSet<String> inAttribs]
	: INPUT id COLON maybeType (EQ literal)? (AT INT)? SEMICOLON
	    { addUniqueField($id.text, inAttribs, varAttribs, "interface"); }
	| INPUT id  COLON QUESTION IDRAW (EQ IDRAW)? (AT INT)? SEMICOLON
	    { addUniqueField($id.text, inAttribs, varAttribs, "interface"); }
	| INPUT id  COLON IDRAW (| (EQ IDRAW )) (AT INT)? SEMICOLON
	    { addUniqueField($id.text, inAttribs, varAttribs, "interface"); }
	| VAR i=IDRAW COLON type  (AT INT)? SEMICOLON
	    { addUniqueField($i.text, varAttribs, inAttribs, "interface"); }
	| VAR i=IDRAW COLON IDRAW (AT INT)? SEMICOLON
	    { addUniqueField($i.text, varAttribs, inAttribs, "interface"); }
	;

classField[HashSet<String> infVars, HashSet<String> infInputs, HashSet<String> clsVars, HashSet<String> clsInputs]
	: INPUT id COLON maybeType  (EQ literal)?
	    {
	        checkUniqueField($id.text, infVars, infInputs, "(class field duplicates  interface field)");
    	    addUniqueField($id.text, clsInputs, clsVars, "class");
	    }
	| INPUT id COLON QUESTION IDRAW (EQ IDRAW)?
	    {
	        checkUniqueField($id.text, infVars, infInputs, "(class field duplicates  interface field)");
    	    addUniqueField($id.text, clsInputs, clsVars, "class");
	    }	
	| INPUT id COLON IDRAW (EQ IDRAW)?
	    {
	        checkUniqueField($id.text, infVars, infInputs, "(class field duplicates  interface field)");
    	    addUniqueField($id.text, clsInputs, clsVars, "class");
	    }	
	| VAR i=IDRAW COLON type 
	    {
	        checkUniqueField($i.text, infVars, infInputs, "(class field duplicates  interface field)");
    	    addUniqueField($i.text, clsVars, clsInputs, "class");
	    }	
	| VAR i=IDRAW COLON IDRAW 
	    {
	        checkUniqueField($i.text, infVars, infInputs, "(class field duplicates  interface field)");
    	    addUniqueField($i.text, clsVars, clsInputs, "class");
	    }	
	;

topStmt[HashSet<String> infVars, HashSet<String> clsVars, HashMap<String, String> childMap, HashSet<String> selfSinks, HashMap<String, HashSet<String>> childSinks]
	 : cond[infVars, clsVars, childMap, selfSinks, childSinks]
	 | constraint[infVars, clsVars, childMap, selfSinks, childSinks] SEMICOLON
	 | loop[infVars, clsVars, childMap, selfSinks, childSinks]
	 ;

loop[HashSet<String> infVars, HashSet<String> clsVars, HashMap<String, String> childMap, HashSet<String> selfSinks, HashMap<String, HashSet<String>> childSinks] 
    :   LOOP id { checkChildExists($id.text, childMap, "loop variable"); } LBRACE  
        (       cond[infVars, clsVars, childMap, selfSinks, childSinks] 
            |   constraint[infVars, clsVars, childMap, selfSinks, childSinks] | SEMICOLON)* 
        RBRACE
    ;

cond[HashSet<String> infVars, HashSet<String> clsVars, HashMap<String, String> childMap, HashSet<String> selfSinks, HashMap<String, HashSet<String>> childSinks]
	: IF LPAREN	
	  expr RPAREN LBRACE 
	  (cond[infVars, clsVars, childMap, selfSinks, childSinks] | constraint[infVars, clsVars, childMap, selfSinks, childSinks] | SEMICOLON)*
	  (RBRACE ELSE IF 
	    LPAREN expr RPAREN LBRACE 
	    (cond[infVars, clsVars, childMap, selfSinks, childSinks] | constraint[infVars, clsVars, childMap, selfSinks, childSinks] | SEMICOLON)*	    
	  )*
	  RBRACE ELSE LBRACE 
	    (cond[infVars, clsVars, childMap, selfSinks, childSinks] | constraint[infVars, clsVars, childMap, selfSinks, childSinks] | SEMICOLON)*
	  RBRACE	  
	;

constraint[HashSet<String> infVars, HashSet<String> clsVars, HashMap<String, String> childMap, HashSet<String> selfSinks, HashMap<String, HashSet<String>> childSinks] 
    : lhs[infVars, clsVars, childMap, selfSinks, childSinks] ASSIGN expr
    | lhs[infVars, clsVars, childMap, selfSinks, childSinks] ASSIGN FOLD expr DOTDOT expr
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


lhs [HashSet<String> infVars, HashSet<String> clsVars, HashMap<String, String> childMap, HashSet<String> selfSinks, HashMap<String, HashSet<String>> childSinks]
	: id
	    {  
            checkFieldExists($id.text, infVars, clsVars, "left-hand side of an assignment"); 
            selfSinks.add($id.text);
	    }
	| n=id DOT f=id 
	    { 
	        if (n.equals("self")) {
	            checkFieldExists($f.text, infVars, clsVars, "left-hand side of an assignment"); 
	            selfSinks.add($f.text);
	        } else {
	            checkChildFieldExists($f.text, $n.text, childMap, "left-hand side of an assignment"); 
	            childSinks.get($n.text).add($f.text);
	        }
	    }
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

