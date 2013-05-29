grammar ALE;

options {
  output=AST;
}

@header {
  package aleGrammar;

  import java.util.Map;
  import java.util.HashMap;
  import java.util.Vector;
  import java.util.HashSet;
  
  import AGEval.*;
  import aleGrammar.GenSym;
}

@lexer::header { 
  package aleGrammar;
}

@members {

  public boolean stripFloats = false;
  public String maybeStripFloat (String txt) {
    if (!stripFloats) return txt;
    else return txt.replace("f","");
  }


  public final HashMap<String, TraitInfo> traits = new HashMap<String, TraitInfo>();

//  public final Map<String, String> inputs = new HashMap<String, String>();
//  public final Map<String, String> defaults = new HashMap<String, String>();
  public final ArrayList<AGEval.Class> classes = new ArrayList<AGEval.Class>();
  public final ArrayList<IFace> interfaces = new ArrayList<IFace>();
  public final HashMap<String, AGEval.IFace> interfaceTable= new HashMap<String, AGEval.IFace>();  
  public final HashMap<String, AGEval.Class> classTable= new HashMap<String, AGEval.Class>();
  public final HashMap<String, ArrayList<String>> types = new HashMap<String, ArrayList<String>>();
  public final HashSet<String> typeVals = new HashSet<String>();
  public final HashMap<AGEval.Class, ArrayList<Cond> > condsTop = new HashMap<AGEval.Class, ArrayList<Cond> >();
  public final GenSym genSym = new GenSym();
  public final HashSet<Assignment> assignments = new HashSet<Assignment>(); //reductions here must be added 
  public String scheduleConstraintStr = null;

  public final HashMap<AGEval.IFace, ExtendedClass> extendedClasses = new HashMap<AGEval.IFace, ExtendedClass>();
  public static class ExtendedVertex {
    public final boolean isInput;
    public final String maybeDefault;
    public final String strType;    
    public final boolean isMaybeType; //
    public ExtendedVertex(Boolean isInput_, String strType_) {
      this(isInput_, strType_, null, false);
    }    
    public ExtendedVertex(Boolean isInput_, String strType_, boolean isMaybeType_) {
      this(isInput_, strType_, null, isMaybeType_);
    }    
    public ExtendedVertex(Boolean isInput_, String strType_, String maybeDefault_) {
      this(isInput_, strType_, maybeDefault_, false);
    }    
    public ExtendedVertex(Boolean isInput_, String strType_, String maybeDefault_, boolean isMaybeType_) {
      isInput = isInput_;
      strType = strType_;
      maybeDefault = maybeDefault_;
      isMaybeType = isMaybeType_;
    }
  }

  public static class ExtendedClass {
    public final HashMap<String, ExtendedVertex> extendedVertices = new HashMap<String, ExtendedVertex>();
    public final HashMap<Integer, String> positionedInputs = new HashMap<Integer, String>();
    public final HashMap<Integer, String> positionedVariables = new HashMap<Integer, String>();
    public final HashMap<String, String> multiChildren = new HashMap<String, String>(); //child id -> interface
    public final HashMap<String, String> idToLoop = new HashMap<String, String>();
    public final HashSet<String> phantomAttributes = new HashSet<String>();
    public final HashSet<TraitInfo> traits = new HashSet<TraitInfo>();

  }
  
  //FIXME static is evil
  public static int blockCounter = 0;

  public static class TraitInfo {
    public final String children;
    public final String actions;
    public final String attributes;
    public final String phantoms;
    public final HashSet<String> attribSet = new HashSet<String>();
    public final HashSet<String> childSet = new HashSet<String>();
    public TraitInfo(String children_, String attributes_, String actions_, String phantoms_) {
      children = children_;
      attributes = attributes_;
      actions = actions_;
      phantoms = phantoms_;
    }
  }


  public class Case {
    
    public final int id;
    public Cond cond; //parent
    public final String openBody;
    public final HashMap<String,String> indexedVariables;
    public final HashSet<Assignment> assignments;
    public final ArrayList<Cond> conditionals;
    public final boolean isElse;
    public final boolean hasAssignments;
    public Case (String openBody_, HashMap<String,String> indexedVariables_, HashSet<Assignment> assignments_, ArrayList<Cond> conditionals_) {
      id = blockCounter++;
      isElse = false;
      openBody = openBody_;
      indexedVariables = indexedVariables_;
      assignments = assignments_;
      conditionals = conditionals_;
      boolean anyHas = assignments.size() > 0;
      for (Cond cond : conditionals_) {
        cond.pred = this;
        if (cond.hasAssignments) {
          anyHas = true;
          break;
        }            
      }
      hasAssignments = anyHas;
    }
    public Case (HashSet<Assignment> assignments_, ArrayList<Cond> conditionals_) {
      id = blockCounter++;
      isElse = true;
      openBody = "";
      indexedVariables = null;
      assignments = assignments_;
      conditionals = conditionals_;
      boolean anyHas = assignments.size() > 0;
      for (Cond cond : conditionals_) {
        cond.pred = this;
        if (cond.hasAssignments) {
          anyHas = true;
          break;
        }       
      }     
      hasAssignments = anyHas;
    }   
  }
  
  public class Cond {
    public Case pred; //parent
    public final Case testCase;
    public final Case elseCase;
    public final ArrayList<Case> elseifs;
    public final boolean hasAssignments;
    public Cond(
      Case testCase_,
      Case elseCase_,
      ArrayList<Case> elseifs_) {        
        testCase = testCase_;
        testCase.cond = this;
        
        elseCase = elseCase_;
        elseCase.cond = this;
        
	elseifs = elseifs_;
	for (Case c : elseifs) c.cond = this;
	
	boolean anyHas = testCase.hasAssignments;
	if (!anyHas) anyHas = elseCase.hasAssignments;
	if (!anyHas)
	  for (Case c : elseifs)
	    if (c.hasAssignments) {
	      anyHas = true;
	      break;
	    }
	hasAssignments = anyHas;	  	
    }
  }
  
  public class Assignment {
    public final boolean isReduction;
    public final AGEval.Class _class;
    public final String _sink;
    public final HashMap<String, String> _variables;
    public final String _indexedBody; //arg1, arg2, ...
    public final String loopVar;
    public Assignment (AGEval.Class cls, String sink, HashMap<String, String> variables, String indexedBody, String loopVar_) {
      isReduction = false;
      startVariables = null;
      startBody = "";
      stepVariables = null;
      stepBody = "";
      
      _class = cls;
      _sink = sink;
      _variables = variables;
      _indexedBody = indexedBody;
      loopVar = loopVar_;
    }
    
    public final HashMap<String, String> startVariables;
    public final String startBody;    
    public final HashMap<String, String> stepVariables;
    public final String stepBody;
    public Assignment (AGEval.Class cls, String lhs_, HashMap<String, String> startVariables_, String startBody_, HashMap<String, String> stepVariables_, String stepBody_, String loopVar_) {
      isReduction = true;
      _variables = null;
      _indexedBody = null;
      
      _class = cls;
      _sink= lhs_;
      startVariables = startVariables_;
      startBody = startBody_;
      stepVariables = stepVariables_;
      stepBody = stepBody_;
      loopVar = loopVar_;
    }    
  }
  
  
}


root	: scheduleConstraints? (iface | clssTraits | clssFlat | typedef | classTrait)*;

scheduleConstraints :	 'schedule' '{' (s=STRING { scheduleConstraintStr = $s.text; })? '}';

	
typedef 
	: TYPE name=id '=' t0=id  
	  { ArrayList<String> variants = new ArrayList<String>(); variants.add($t0.text); typeVals.add($t0.text); }
	  ('|' ti=id { variants.add($ti.text); typeVals.add($ti.text); } )* ';'
	  { types.put($name.text, variants); };
	
iface:	
	IFACE id 
	{ IFace face;
	  try { face  = new IFace($id.text); }
	  catch (Exception e) { 
	    System.err.println("Failed semantic parse action: " + e.getMessage());
	    throw new RecognitionException(); 
	  } //FIXME err msg
	  interfaces.add(face);
	  interfaceTable.put($id.text, face);
 	  ExtendedClass clss2 = new ExtendedClass();
	  extendedClasses.put(face, clss2); } 
	'{' ifaceField[face, clss2]* '}';

clssFlat: 
	CLSS c=id //traits? 
	':' i=id 
	{AGEval.Class clss;	
	try { clss = new AGEval.Class($c.text, interfaceTable.get($i.text)); }
	catch (Exception e) { 
	  System.err.println("Failed semantic parse action: " + e.getMessage());
	  throw new RecognitionException(); 
	} //FIXME err msg
	 classes.add(clss); 
	 classTable.put($c.text, clss);
	 ExtendedClass clss2 = new ExtendedClass();
	 extendedClasses.put(clss, clss2);
	 }
	'{' (header[false, clss, clss2] | children[false, clss] | phantom[false, clss, clss2] | body[false, clss])* '}'
	;


clssTraits
@init { 
  CommonTree childrenTree = null; 
  CommonTree attributesTree = null; 
  CommonTree actionsTree = null; 
  CommonTree phantomsTree = null; 
  AGEval.Class clss = null;	
  ExtendedClass clss2 = null;
  String childrens = "";
  String attributes = "";
  String actions = "";
  String phantoms = "";
  HashSet<TraitInfo> localTraits = new HashSet<TraitInfo>();
}
:
	CLSS c=id 
	'('  
		t0=id { 
		  TraitInfo t0Info = traits.get($t0.text);
		  if (t0Info == null) {
		    System.err.println("Parse error: class " + $c.text + " has unknown trait " + $t0.text);
		    throw new RecognitionException();
		  }
		  localTraits.add(t0Info);
		  childrens += t0Info.children;
		  attributes += t0Info.attributes;
		  actions += t0Info.actions;
		  phantoms += t0Info.phantoms;
	//	  System.out.println("Trait: children::" + childrens + " ~~~ attributes::" + attributes + " ~~~~ actions::" + actions + " ~~~");
		}
		(',' ti=id { 
		  TraitInfo tInfo  = traits.get($ti.text);
		  if (tInfo == null) {
		    System.err.println("class " + $c.text + " has unknown trait " + $ti.text);
		    throw new RecognitionException();
		  }
		  localTraits.add(tInfo);
		  childrens += tInfo.children;
		  attributes += tInfo.attributes;
		  actions += tInfo.actions;
		  phantoms += tInfo.phantoms;
		
		})* 
	')'	
	':' i=id 
	{
	try { clss = new AGEval.Class($c.text, interfaceTable.get($i.text)); }
	catch (Exception e) { 
	  System.err.println("Failed semantic parse action: " + e.getMessage());
	  throw new RecognitionException(); 
	} //FIXME err msg
	 classes.add(clss); 
	 classTable.put($c.text, clss);
	 clss2 = new ExtendedClass();
	 clss2.traits.addAll(localTraits);
	 extendedClasses.put(clss, clss2);
	 try {
	      CharStream inputstream = null;
	      inputstream = new ANTLRStringStream("children { " + childrens + " }");
	      ALELexer innerlexer = new ALELexer(inputstream);
	      ALEParser innerparser = new ALEParser(new CommonTokenStream(innerlexer));
	      innerparser.extendedClasses.putAll(extendedClasses);
	      innerparser.classes.addAll(classes);
	      innerparser.classTable.putAll(classTable);
	      innerparser.interfaceTable.putAll(interfaceTable);
	      childrenTree = (CommonTree)(innerparser.children(false,clss).getTree());
	    } catch (Exception fnf) {
	      fnf.printStackTrace();
	      System.err.println("fail on parsing embedded traits: children");
	      System.err.println("expansion of class " + $c.text + " to add " + childrens);
	      throw new RecognitionException();
	    }
	  try {
	      CharStream inputstream = null;
	      inputstream = new ANTLRStringStream("attributes { " + attributes + " }");
	      ALELexer innerlexer = new ALELexer(inputstream);
	      ALEParser innerparser = new ALEParser(new CommonTokenStream(innerlexer));
	      attributesTree = (CommonTree)(innerparser.header(false, clss, clss2).getTree());
	    } catch (Exception fnf) {
	      fnf.printStackTrace();
	      System.err.println("fail on parsing embedded traits: attributes");
	      System.err.println("expansion of class " + $c.text + " to add " + attributes);
	      throw new RecognitionException();
 	    }
	  try {
	      CharStream inputstream = null;
	      inputstream = new ANTLRStringStream("phantom { " + phantoms + " }");
	      ALELexer innerlexer = new ALELexer(inputstream);
	      ALEParser innerparser = new ALEParser(new CommonTokenStream(innerlexer));
	      phantomsTree = (CommonTree)(innerparser.phantom(false, clss, clss2).getTree());
	    } catch (Exception fnf) {
	      fnf.printStackTrace();
	      System.err.println("fail on parsing embedded traits: phantom");
	      System.err.println("expansion of class " + $c.text + " to add " + phantoms);
	      throw new RecognitionException();
 	    }
 	    
	  try {
	      CharStream inputstream = null;
	      inputstream = new ANTLRStringStream("actions { " + actions+ " }");
	      ALELexer innerlexer = new ALELexer(inputstream);
	      ALEParser innerparser = new ALEParser(new CommonTokenStream(innerlexer));
	      innerparser.extendedClasses.putAll(extendedClasses);
	      innerparser.condsTop.putAll(condsTop);
	      innerparser.assignments.addAll(assignments);
	      actionsTree = (CommonTree)(innerparser.body(false, clss).getTree());
	      extendedClasses.putAll(innerparser.extendedClasses);
	      condsTop.putAll(innerparser.condsTop);
	      assignments.addAll(innerparser.assignments);
	    } catch (Exception fnf) {
	      System.err.println("fail on parsing embedded traits: actions");
	      System.err.println("expansion of class " + $c.text + " to add " + actions);
	      fnf.printStackTrace();
	      System.err.println("  (class: " + clss.getName());
	      throw new RecognitionException();	      
	  }
    
	 }
	'{' (header[false, clss, clss2] | children[false, clss] | phantom[false, clss, clss2] | body[false, clss])* '}'
 
  -> ^(CLSS $c ':' $i '{' children? {childrenTree} header? {attributesTree} {phantomsTree}  body? {actionsTree} '}')
;

classTrait
	: TRT name=id {
	  String children = "";
	  String actions = "";
	  String attributes = "";
	  String phantoms = "";
	  HashSet<String> localAttribs = new HashSet<String>();
	  HashSet<String> localChilds = new HashSet<String>();
	}
	'{' 
/*
	(	
		header[true, null, null]{attributes += $header.text;} 
		| children[true, null] {children += $children.text; }
		| body[true, null] { actions += $body.text;}
	 )* 
*/
	  (  (ATTRIBUTES '{' 
	  	(classField[true, null,null] { attributes +=  $classField.text; localAttribs.add($classField.text); })* 
	  	'}')
	   | (CHILDREN '{' 
	   	(';' | (child[true, null] { children +=  $child.text; localChilds.add($child.text); }) )* 
	   	'}') 
	   | (ACTIONS '{' 
	   	(topStmt[true, null] { actions +=  $topStmt.text; })* 
	   	'}' )
	   | (PHANTOM '{' 
	   	(';' | lhs { phantoms += $lhs.name; })* 
	   	'}')
	  )*
	 '}' 
	 { 
	   TraitInfo trait = new TraitInfo(children, attributes, actions, phantoms);
	   trait.attribSet.addAll(localAttribs);
	   trait.childSet.addAll(localChilds);	   
	   traits.put($name.text, trait); 
	 }
	;

header[Boolean pure, AGEval.Class clss, ExtendedClass clss2]: ATTRIBUTES '{' classField[$pure, $clss, $clss2]* '}';

children[Boolean pure, AGEval.Class clss]:	CHILDREN '{' (';' | child[$pure, $clss])* '}';

phantom[Boolean pure, AGEval.Class clss, ExtendedClass clss2]: 
	PHANTOM '{' 
	(';' | lhs { 
		if (!pure) {
		  //put in phantom assignment
		  String clean = $lhs.name.toLowerCase();
		  if (!clean.contains("@")) clean = "self@" + clean;
		  clss2.phantomAttributes.add(clean);

		  String loopVar = clean.split("@")[0].equals("self") ? "" : clean.split("@")[0];	
		  HashMap<String,String> atoms = new HashMap<String, String>();		  		  
		  Assignment abstr = new Assignment(clss, $lhs.name, atoms, "0", loopVar);	  
		  assignments.add(abstr);
		  if ("".equals(loopVar)) {
			clss.apply(clss.getName().toLowerCase() + "_" + $lhs.name.replace('.','_').replace('@','_'),
			  $lhs.name,
			  (String[]) atoms.keySet().toArray(new String[atoms.keySet().size()]));
		  }
		    if (extendedClasses.get(clss).idToLoop.containsKey($lhs.name.replace('.','@'))) {
		      String prev = extendedClasses.get(clss).idToLoop.get($lhs.name.replace('.','@'));
		      if ("".equals(prev)) {
		        //potentially elevate binding
		        extendedClasses.get(clss).idToLoop.put($lhs.name.replace('.','@').toLowerCase(), loopVar);
		      } else if ("".equals(loopVar)) { /* maintain binding */ }
		      else if (!prev.equals(loopVar)) {	      
		         System.err.println("assignment to variable " + clss.getName() + "::" + $lhs.name + " under mismatching loop variables (" + loopVar + " and " + prev + ")");
	       		 throw new RecognitionException();	      
		      } else {
		         //reuse binding
		      }
		    } else {
		      extendedClasses.get(clss).idToLoop.put($lhs.name.replace('.','@').toLowerCase(),loopVar);
		    }		 
	  	}
	} )*
	'}';

child[Boolean pure, AGEval.Class clss]
    :  i=id ':' t=id
    {
      try { 
        if (!$pure) $clss.addChild($i.text, interfaceTable.get($t.text)); 
      }
      catch (Exception e) {
        System.err.println("Semantic parse action: unknown child type for declaration " + clss.getName() + "::" + $i.text + " : " + $t.text +", " + e.getMessage());
        System.err.println("  Did you provide a Class rather than an Interface?");
        throw new RecognitionException();
      }
    }  
    
    |  i=id ':' '[' t=id  ']' 
    {
    	if (!$pure) {
    	      ExtendedClass ec = extendedClasses.get($clss);
    	      if (ec == null) {
    	        System.err.println("no ec for: " + $clss.getName());
    	      }
	      extendedClasses.get($clss).multiChildren.put($i.text, $t.text);
	      try { $clss.addChild($i.text, interfaceTable.get($t.text)); }
	      catch (Exception e) {
	        System.err.println("Semantic parse action: unknown child type for declaration " + clss.getName() + "::" + $i.text + " : [" + $t.text +"], " + e.getMessage());
	        System.err.println("  Did you provide a Class rather than an Interface?");
	        throw new RecognitionException();
	      }
      	}
    }  
  ;


ifaceField[IFace container, ExtendedClass eContainer] 
	: INPUT p=multiId ':' maybeType
		(({ eContainer.extendedVertices.put($p.text, new ExtendedVertex(true, $maybeType.text, $maybeType.isMaybe)); $container.addField($p.text, $maybeType.text); })
		| ('=' literal {  eContainer.extendedVertices.put($p.text, new ExtendedVertex(true, $maybeType.text, $literal.text, $maybeType.isMaybe)); $container.addField($p.text, $maybeType.text); }))
		('@' INT { eContainer.positionedInputs.put(Integer.parseInt($INT.text), $p.text); })?
		';'
	| INPUT p=multiId  ':' '?' t=id
		(({  eContainer.extendedVertices.put($p.text, new ExtendedVertex(true, $t.text, true)); $container.addField($p.text, "int"); })
		| ('=' v=id { eContainer.extendedVertices.put($p.text, new ExtendedVertex(true, $t.text, $v.text, true)); $container.addField($p.text, "int"); }))
		('@' INT { eContainer.positionedInputs.put(Integer.parseInt($INT.text), $p.text); })?
		';'
	| INPUT p=multiId  ':' t=id
		(({  eContainer.extendedVertices.put($p.text, new ExtendedVertex(true, $t.text)); $container.addField($p.text, "int"); })
		| ('=' v=id { eContainer.extendedVertices.put($p.text, new ExtendedVertex(true, $t.text, $v.text)); $container.addField($p.text, "int"); }))
		('@' INT { eContainer.positionedInputs.put(Integer.parseInt($INT.text), $p.text); })?
		';'
	| VAR p2=id ':' type { eContainer.extendedVertices.put($p2.text, new ExtendedVertex(false, $type.text)); $container.addAttribute($p2.text, $type.text); }
		('@' INT { eContainer.positionedVariables.put(Integer.parseInt($INT.text), $p2.text); })?
		';'
	| VAR p2=id ':' t=id { eContainer.extendedVertices.put($p2.text, new ExtendedVertex(false, $t.text)); $container.addAttribute($p2.text, "int"); }
		('@' INT { eContainer.positionedVariables.put(Integer.parseInt($INT.text), $p2.text); })?
		';'
	;

classField[Boolean pure, AGEval.Class container, ExtendedClass eContainer]
	: INPUT p=multiId  ':' mt=maybeType 
		((';' { 
		  if (!$pure) {
		    eContainer.extendedVertices.put($p.text, new ExtendedVertex(true, $mt.text, $mt.isMaybe)); 
		    $container.addField($p.text, $mt.text); 
		  }
		 })
		| ('=' literal ';' { 
		  if (!$pure) {
		    eContainer.extendedVertices.put($p.text, new ExtendedVertex(true, $mt.text, $literal.text, $mt.isMaybe)); 
		    $container.addField($p.text, $mt.text); 
		  }
		}))
	| INPUT p=multiId ':' '?' t=id 
		((';' {  
		  if (!$pure) {
		    eContainer.extendedVertices.put($p.text, new ExtendedVertex(true, $t.text, true)); 
		    $container.addField($p.text, "int"); 
		  }
		})
		| ('=' v=id ';' {  
		  if (!$pure) {
		    eContainer.extendedVertices.put($p.text, new ExtendedVertex(true, $t.text, $v.text, true)); 
		    $container.addField($p.text, "int"); 
		  }
		}))
	| INPUT p=multiId ':' t=id 
		((';' { 
		   if (!$pure) {
		     eContainer.extendedVertices.put($p.text, new ExtendedVertex(true, $t.text)); 
		     $container.addField($p.text, "int"); 
		   }
		 })
		| ('=' v=id ';' {
  		  if (!$pure) {		  
		    eContainer.extendedVertices.put($p.text, new ExtendedVertex(true, $t.text, $v.text)); 
		    $container.addField($p.text, "int");
		  }
		  }))
	| VAR p2=id ':' type ';' { 
		if (!$pure) {
			eContainer.extendedVertices.put($p2.text, new ExtendedVertex(false, $type.text)); 
			$container.addAttribute($p2.text, $type.text); 
		}
	}
	| VAR p2=id ':' t=id { 
		if (!$pure) {
			eContainer.extendedVertices.put($p2.text, new ExtendedVertex(false, $t.text)); 
			$container.addAttribute($p2.text, "int"); 
		}
	} ';'
	;
	
body[Boolean pure, AGEval.Class clss]  : ACTIONS '{' topStmt[$pure, $clss]* '}';	

topStmt[Boolean pure, AGEval.Class clss]
	:  cond[$pure, clss, false, ""]
	   { 
	   	if (!$pure) {
		   ArrayList<Cond> cur;	     
		     if (condsTop.containsKey(clss)) cur = condsTop.get(clss);
		     else { 
		       cur = new ArrayList<Cond>();
		       condsTop.put(clss, cur);
		     }
		     cur.add($cond.cond); 
		}
	     }
	 | constraint[$pure, clss, false, ""]
	 | loop[$pure, $clss, false, ""] 
	   { 
	   	if (!$pure) {
	 
		   ArrayList<Cond> cur;	     
		     if (condsTop.containsKey(clss)) cur = condsTop.get(clss);
		     else { 
		       cur = new ArrayList<Cond>();
		       condsTop.put(clss, cur);
		     }
		     cur.addAll($loop.conds);
		}	     
	   }
	 ;

loop[Boolean pure, AGEval.Class clss, boolean inCond, String loopVar] returns [ArrayList<Cond> conds, HashSet<Assignment> assigns]:
	LOOP l=id (STAR { System.err.println("star on loop is deprecated"); })?'{' 
	{ 
	  if (!"".equals(loopVar)) {
	    System.err.println("no nested loops: violation on " + $l.text);
	    throw new RecognitionException(); 
	  }
	  $conds = new ArrayList<Cond>();
	  $assigns = new HashSet<Assignment>();
	}
	(   cond[$pure, clss, inCond, $l.text] { $conds.add($cond.cond); } 
	  | constraint[$pure, $clss, inCond, $l.text] { $assigns.add($constraint.abstr); } )* 
	'}';

cond[Boolean pure, AGEval.Class clss, boolean inCond, String loopVar] returns [Cond cond]
	: IF '('
	  { ArrayList<Case> elseifs = new ArrayList<Case>();
	    HashMap<String, String> condVariables = new HashMap<String, String>(); 
	    HashSet<Assignment> assigns = new HashSet<Assignment>();
	    ArrayList<Cond> conds = new ArrayList<Cond>(); }
	  t=expr[condVariables] ')' '{' 
	    (tCond=cond[$pure, clss, true, loopVar] { conds.add($tCond.cond); } 
	     | tConstraint=constraint[$pure, clss, true, loopVar] { assigns.add($tConstraint.abstr); }
	     | tLoop=loop[$pure, clss, true, loopVar] { assigns.addAll($tLoop.assigns); conds.addAll($tLoop.conds); })*
	  ('}' ELSE IF 
	    {  HashMap<String, String> caseVariables = new HashMap<String,String>(); 
	       HashSet<Assignment> elifAssigns = new HashSet<Assignment>();
	       ArrayList<Cond> elifConds = new ArrayList<Cond>(); }
	    '(' elifE=expr[caseVariables] ')' '{' 
	    (elifCond=cond[$pure, clss, true, loopVar] { elifConds.add($elifCond.cond); } 
	     | elifConstraint=constraint[$pure, clss, true, loopVar] { elifAssigns.add($elifConstraint.abstr); }
	     | elifLoop=loop[$pure, clss, true, loopVar] {  elifAssigns.addAll($elifLoop.assigns); elifConds.addAll($elifLoop.conds);  })*
	    {  elseifs.add(new Case($elifE.openBody, caseVariables, elifAssigns, elifConds)); }
	  )*
	  '}' ELSE '{' 
	  { HashSet<Assignment> elseAssigns = new HashSet<Assignment>();
	    ArrayList<Cond> elseConds = new ArrayList<Cond>(); }
	    (elseCond=cond[$pure, clss, true, loopVar] { elseConds.add($elseCond.cond); } 
	     | elseConstraint=constraint[$pure, clss, true, loopVar] { elseAssigns.add($elseConstraint.abstr); }
	     | elseLoop=loop[$pure, clss, true, loopVar] {  elseAssigns.addAll($elseLoop.assigns); elseConds.addAll($elseLoop.conds);  })*
	  '}'
	  { $cond = new Cond(new Case($t.openBody, condVariables, assigns, conds), new Case(elseAssigns, elseConds), elseifs); }
	;

constraint[Boolean pure, AGEval.Class clss, boolean inCond, String loopVar] returns [Assignment abstr]
	: lhs ASSIGN { HashMap<String, String> atoms = new HashMap<String, String>(); } expr[atoms] ';'
	  { 
	    if ($lhs.name.contains("[-1]") && "".equals(loopVar)) {
	      System.err.println("Fold initializor must be in a loop");
	      throw new RecognitionException();
	    }
	  }
	  { $abstr = new Assignment(clss, $lhs.name, atoms, $expr.openBody, loopVar);
	  
		if (!$pure) {
		    if (!inCond) assignments.add($abstr);
		    if (!inCond && "".equals(loopVar)) {
			clss.apply(clss.getName().toLowerCase() + "_" + $lhs.name.replace('.','_').replace('@','_'),
			  $lhs.name,
			  (String[]) atoms.keySet().toArray(new String[atoms.keySet().size()]));		  
		    }
		    if (extendedClasses.get(clss).idToLoop.containsKey($lhs.name.replace('.','@'))) {
		      String prev = extendedClasses.get(clss).idToLoop.get($lhs.name.replace('.','@'));
		      if ("".equals(prev)) {
		        //potentially elevate binding
		        extendedClasses.get(clss).idToLoop.put($lhs.name.replace('.','@').toLowerCase(), loopVar);
		      } else if ("".equals(loopVar)) { /* maintain binding */ }
		      else if (!prev.equals(loopVar)) {	      
		         System.err.println("assignment to variable " + clss.getName() + "::" + $lhs.name + " under mismatching loop variables (" + loopVar + " and " + prev + ")");
	       		 throw new RecognitionException();	      
		      } else {
		         //reuse binding
		      }
		    } else {
		      extendedClasses.get(clss).idToLoop.put($lhs.name.replace('.','@').toLowerCase(),loopVar);
		    }
		}
	  }
	| i=lhs ASSIGN FOLD
	  { if ("".equals(loopVar)) {
 	      System.err.println("reduction must be in a loop: violation on " + $lhs.text);
	      throw new RecognitionException(); 	  
	    }
	    if ($lhs.name.contains("[-1]")) {
	      System.err.println("x[-1].x cannot yet be the left-hand side of a fold statement");
	      throw new RecognitionException();
	    }
	    HashMap<String, String> startVariables = new HashMap<String, String>();
	    HashMap<String, String> stepVariables = new HashMap<String, String>(); }
	  start=expr[startVariables] 
	  '..' 
	  step=expr[stepVariables]
	  {
		if (!$pure) { 
		    $abstr = new Assignment($clss, $i.name, startVariables, $start.openBody, stepVariables, $step.openBody, loopVar); 
		    if (!inCond) {
		      assignments.add($abstr); //up to runtime to do expansion
		    }
		    if (extendedClasses.get(clss).idToLoop.containsKey($lhs.name.replace('.','@'))) {
		      String prev = extendedClasses.get(clss).idToLoop.get($lhs.name.replace('.','@'));
		      if ("".equals(prev)) {
		        //potentially elevate binding
		        extendedClasses.get(clss).idToLoop.put($lhs.name.replace('.','@').toLowerCase(), loopVar);
		      } else if ("".equals(loopVar)) { /* maintain binding */ }
		      else if (!prev.equals(loopVar)) {	      
		         System.err.println("assignment to variable " + clss.getName() + "::" + $lhs.name + " under mismatching loop variables (" + loopVar + " and " + prev + ")");
	       		 throw new RecognitionException();	      
		      } else {
		         //reuse binding
		      }
		    } else {
		      extendedClasses.get(clss).idToLoop.put($lhs.name.replace('.','@').toLowerCase(),loopVar);
		    }
		}

	    
	  }
	  ';'
	;

expr[HashMap<String,String> indexedVariables] returns [String openBody]
	: c=logExpr[indexedVariables] { boolean hasAny = false; $openBody =  $c.openBody; }
		('?' t=logExpr[indexedVariables] ':' f=logExpr[indexedVariables] {$openBody += " ? " + $t.openBody + " : " + $f.openBody; } )*
	  { if (hasAny) $openBody = "(" + $openBody + ")"; } ;


logExpr[HashMap<String,String> indexedVariables] returns [String openBody]
	: a0=relExpr[indexedVariables] { boolean hasAny = false; $openBody = $a0.openBody; }
	(op=('&&'|'||') ai=relExpr[indexedVariables] { hasAny = true; $openBody += " " + $op.text + " " + $ai.openBody;  }
	)* { if (hasAny) $openBody = "(" + $openBody + ")"; } ;
relExpr[HashMap<String,String> indexedVariables] returns [String openBody]
	: a0=addExpr[indexedVariables] { boolean hasAny = false; $openBody = $a0.openBody; }
	(op=('<='|'<'|'>='|'>'|'=='|'!=') ai=addExpr[indexedVariables] { $openBody += " " + $op.text + " " + $ai.openBody;  }
	)* { if (hasAny) $openBody = "(" + $openBody + ")"; } ;
addExpr[HashMap<String,String> indexedVariables] returns [String openBody]
	: a0=multExpr[indexedVariables] { boolean hasAny = false; $openBody = $a0.openBody; }
	(op=('+'|'-') ai=multExpr[indexedVariables] { $openBody += " " + $op.text + " " + $ai.openBody;  }
	)* { if (hasAny) $openBody = "(" + $openBody + ")"; } ;
multExpr[HashMap<String,String> indexedVariables] returns [String openBody]
	: a0=signExpr[indexedVariables] { boolean hasAny = false; $openBody =  $a0.openBody; }
	  (op=(STAR|'/'|'%') ai=signExpr[indexedVariables] { $openBody += " " + $op.text + " " + $ai.openBody;  }
	  )* { if (hasAny) $openBody = "(" + $openBody + ")"; } ;
signExpr[HashMap<String,String> indexedVariables] returns [String openBody]
	: { String pfx = ""; } //FIXME some reason $x.text doesn't work...
	  x=(('+' { pfx += "+";} | '-' { pfx += "-"; }| '!' { pfx += "!"; })*) callExpr[indexedVariables] 
	  { $openBody = pfx.equals("") ? $callExpr.openBody : ("(" + pfx + " " + $callExpr.openBody + ")");  };
callExpr[HashMap<String,String> indexedVariables] returns [String openBody]
	: id '(' { $openBody = $id.text + "("; }
	(a0=expr[indexedVariables] { $openBody += $a0.openBody; }
	(',' ai=expr[indexedVariables] { $openBody += ", " + $ai.openBody; })*)?
	')' { $openBody += ")"; }
	| primitiveExpr[indexedVariables] { $openBody = $primitiveExpr.openBody; }
	;	
primitiveExpr[HashMap<String,String> indexedVariables] returns [String openBody]
	: literal {$openBody = $literal.text;}
	| rhs {
	    //FIXME make independent of backend
	    if (typeVals.contains($rhs.name)) $openBody = "ExtraDataHandler::TOK_" + $rhs.name.toUpperCase();
	    else if (indexedVariables.containsKey($rhs.name)) $openBody = indexedVariables.get($rhs.name);
	    else {
	      $openBody =  "_ale_arg" + indexedVariables.keySet().size();
 	      indexedVariables.put($rhs.name, $openBody);
	    }
	  }
	| '(' expr[indexedVariables] ')' { $openBody = "(" + $expr.openBody + ")";} 
	;
	
lhs returns [String name]	
	: multiId   { $name = $multiId.text; }
	//| n=id suffixNeg '.' c=multiId { $name = $n.text + "@" + $c.text + "[-1]";}
	| n=id '.' c=multiId  { $name = $n.text + "@" + $c.text; }
	;
	
rhs returns [String name]
	: lhs { $name = $lhs.name; }
	//FIXME check in appropriate reduction
	| n=id suffix '.' c=multiId  { $name = $n.text + "@" + $c.text + $suffix.text; }
	| suffix '.' c=multiId  { $name = $c.text + $suffix.text; }
	;

//suffixNeg  : '[' '-1' ']';
suffix 	: '$i' | '$$' | '$-'; 

multiId returns [String text] 
	: id { $text = $id.text; } 
	| type { $text = $type.text; }
	;

maybeType returns [boolean isMaybe, String text] 
	: '?' type { $isMaybe = true; $text = $type.text; }
	| type { $isMaybe = false; $text = $type.text; }
	;
	 
type:	BOOL_KEYWORD | INT_KEYWORD | FLOAT_KEYWORD | COLOR_KEYWORD | STRING_KEYWORD | PX_KEYWORD | TAGGEDINT_KEYWORD | TAGGEDFLOAT_KEYWORD;

literal	returns [String text]: 
	prettyFloat { $text = $prettyFloat.text; }
	| bl { $text = $bl.text; }
	| u =( INT  | STRING | HEXCOLOR) { $text = $u.text; }
	| LBRACE t=INT COMMA w=INT RBRACE { $text = "{" + $t.text + "," + $w.text + "}";}
	| LBRACE t=INT COMMA x=prettyFloat RBRACE { $text = "{" + $t.text + "," + $x.text + "}";}
	;

bl	returns [String text] : TRUE { $text = "true"; } | FALSE { $text = "false"; };

prettyFloat returns [String text] : FLOAT { $text = maybeStripFloat($FLOAT.text);  } ;

HEXCOLOR 
	:	 '#' HEX_DIGIT HEX_DIGIT HEX_DIGIT
	| 	 '#' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT
	| 	 '#' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT
	| 	 '#' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT
	;
	

STAR    : '*';

IF	: 'if';
ELSE	: 'else';

LOOP	: 'loop';
FOLD 	: 'fold';

TYPE	:	'type';
CHILDREN:	'children';
TRUE	: 'true';
FALSE	: 'false';

FUNCTIONS	: 'functions';
ASSIGN	:	':=';
INPUT 	:	'input';
CONST 	:	'const';
VAR 	:	'var';
LOCAL 	:	'local';
ACTIONS :	'actions';
CLSS 	:	'class';
CLSSNRML 	:	 'classNormal';
TRT:	 'trait';
ATTRIBUTES	: 'attributes';
IFACE	: 	'interface';
PHANTOM :	 'phantom';
BOOL_KEYWORD	:	'bool';
STRING_KEYWORD	:	'string';
INT_KEYWORD	:	'int';
FLOAT_KEYWORD	:	 'float';	
COLOR_KEYWORD	:	'color';
PX_KEYWORD	:	'px';
TIME_KEYWORD: 'time';
TAGGEDINT_KEYWORD: 'taggedInt';
TAGGEDFLOAT_KEYWORD: 'taggedFloat';
	
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
EXPONENT : ('e'|'E') ('+'|'-')? ('0'..'9')+ ;

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


LBRACE : '{';
RBRACE : '}';
COMMA : ',';

id returns [String text] : c=IDRAW { $text = $c.text.replace("_", "uscore");  } ;
IDRAW  :	('a'..'z'|'A'..'Z'|'_') ('a'..'z'|'A'..'Z'|'0'..'9'|'_'|'-')* ;
