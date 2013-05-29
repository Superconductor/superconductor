package AGEvalSwipl;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Map.Entry;
import java.util.Vector;

import jpl.Term;
import jpl.Variable;

import aleGrammar.ALEParser;
import aleGrammar.ALEParser.ExtendedVertex;

import AGEval.AGEvaluator;
import AGEval.Class;
import AGEval.Function;
import AGEval.InvalidGrammarException;
import AGEval.Vertex;
import AGEvalSwipl.AGEvaluatorSwipl.Schedule;

public class CppGenerator extends BackendBase  implements Backend {

	public String replaceTypeVals(String body, ALEParser ast) { return body; }

	
		//TODO FIXME
	public static String typeStringToCppType (String type) {
		String lType = type.toLowerCase();
		if (lType.equals("color")) return "int";
		if (lType.equals("px")) return "int";
		if (lType.equals("float")) return "float";
		if (lType.equals("bool")) return "bool";
		if (lType.equals("int")) return "int";
		if (lType.equals("string")) return "const char *";
		if (lType.equals("std::string")) return "const char *";
		if (lType.equals("const char *")) return "const char *";
		if (lType.equals("taggedint")) return "Tagged<int>";
		if (lType.equals("taggedfloat")) return "Tagged<float>";
		return "int"; //"ExtraDataHandler::" + type;
	}
	
	public String nestedTernary(ALEParser.Case c, String lhsRaw, AGEval.Class cls, ALEParser ast) throws InvalidGrammarException {
		  String res = ""; 
		  if (!c.isElse) {		
			  res += bindExpr(c.openBody, c.indexedVariables, cls, false, false, toAcc(lhsRaw, cls), ast);
			  res += " ? ";
		  } else {
			  res += " : ";
		  }
		  
		  for (ALEParser.Assignment asgn : c.assignments) {
			  if (asgn._sink.equals(lhsRaw)) {
				  res += "(" + bindExpr(asgn._indexedBody, asgn._variables, cls, false, false, toAcc(lhsRaw, cls), ast) + ")";
			  }
		  }
		  
		  for (ALEParser.Cond cnd : c.conditionals) {
			  res += nestedTernary(cnd, lhsRaw, cls, ast);
		  }
		  
		  return res;
		}
	
	//navigate cases until got assignment
	public String nestedTernary(ALEParser.Cond c, String lhsRaw, AGEval.Class cls, ALEParser ast) throws InvalidGrammarException {
		String res = "(";
		res += nestedTernary(c.testCase, lhsRaw, cls, ast);
		for (ALEParser.Case cs : c.elseifs) res += nestedTernary(cs, lhsRaw, cls, ast);
		res += nestedTernary(c.elseCase, lhsRaw, cls, ast);
		return res + ")";
	}
	
	public void addNestedConditionals (Schedule sched, HashMap<String, String> exprToCall, HashMap<String, String> exprPrinter) throws InvalidGrammarException {
	    if (sched._ast.condsTop == null) return;		  
		for (AGEval.Class cls : sched._aleg.classes) {
			if (sched._ast.condsTop.containsKey(cls)) {
			    for (ALEParser.Cond cnd  : sched._ast.condsTop.get(cls)) {
			      HashSet<String> nonReductSinks = new HashSet<String>();			  
			      HashSet<String> reductSinks = new HashSet<String>();
		    	  Generator.gatherVariables(cnd, nonReductSinks, reductSinks);
			      HashSet<String> sinks = new HashSet<String>();
			      sinks.addAll(nonReductSinks);
			      sinks.addAll(reductSinks);
			          for (String lhsRaw : sinks) {
			        	  String lhs = lhsRaw.toLowerCase();
			        	  String loop = sched._ast.extendedClasses.get(cls).idToLoop.get(lhs);
			        	  if (loop == null) {
			        		  System.err.println("- loop cnd asgn, class " + cls.getName() + ": lhs " + lhs);
			        		  for (String opt : sched._ast.extendedClasses.get(cls).idToLoop.keySet()) {
			        			  System.err.println("  option: " + opt);
			        		  }
			        		  throw new InvalidGrammarException("could not find enclosing loop");
			        	  }			        	  
			        	  
			        	  boolean inLoop = !"".equals(sched._ast.extendedClasses.get(cls).idToLoop.get(lhs));
			        	  if (!inLoop) { 			        	  
			        		  String fname = cls.getName().toLowerCase() + "_" + lhs;
			        		  String assign = lhsToAddress(lhsRaw, cls, sched._ast) + " = ";
			        		  String ternary = nestedTernary(cnd, lhsRaw, cls, sched._ast);
			        		  exprToCall.put(fname, assign + ternary);
			        		  exprPrinter.put(fname, "");
			        	  } else {
			        		  boolean isParentAttrib = !lhsRaw.contains("@") || lhsRaw.split("@")[0].equals("self");
			        		  String whoInit = cls.getName().toLowerCase() + "_" + lhsRaw.toLowerCase().replace("@", "_") + "_init";

			        		  String initLhs = isParentAttrib ? 
			        				  lhsToAddress(lhsRaw, cls, sched._ast) 
			        				  //: (Vertex.typeToString(Generator.lookupAttribute(lhsRaw, cls).myValueType) + " " + lhs.replace("@","_") + "_last");
			        				  : (typeStringToCppType(Generator.extendedGet(sched._ast, cls, lhsRaw).strType) + " " + lhs.replace("@","_") + "_last");

		 			          String dupeLhs = isParentAttrib ? "" : (lhs.replace("@","_") + "_last");

			        		  exprToCall.put(
			        				  whoInit, 
			        				  initLhs + " = " + nestedTernaryLoopInit(sched.reductions, cnd, lhsRaw, cls, sched._ast));
			        		  exprPrinter.put(whoInit, "");
			        		  String whoStep = cls.getName().toLowerCase() + "_" + lhsRaw.toLowerCase().replace("@", "_") + "_step"; 
			        		  exprToCall.put(
			        				  whoStep, 
			        				  lhsToAddress(lhsRaw, cls, sched._ast) 
			        				  + " = " + nestedTernaryLoopStep(sched.reductions, cnd, lhsRaw, cls, sched._ast));
			        		  exprPrinter.put(whoStep, "");
			        		  if (!isParentAttrib) {
			        			  exprToCall.put(whoStep, exprToCall.get(whoStep) +
			        					  ";\n" + dupeLhs + " = " + lhsToAddress(lhsRaw, cls, sched._ast));
			        			  exprPrinter.put(whoStep, exprPrinter.get(whoStep) + ""); 		
			        		  }

			        	  }
			          }
			    }
			}
		}
	}
	


	public void addToplevels (AGEvaluator aleg, Schedule sched, Reductions reducts, HashMap<String, String> exprToCall, HashMap<String, String> exprPrinter) throws InvalidGrammarException {
		for (AGEval.Class cls : aleg.classes) {
			for (Function f : cls.getFunctions()) {
				String call = 
					lhsToAddress(f.myDest, cls, sched._ast) + " = " +
					f.getName().replace(cls.getName().toLowerCase()+"_", cls.getName().toLowerCase()+"_toplevel_") + "(";
				String printArgs = "";
				boolean isFirst = true;
				for (String src : f.getStringSrcs()) {
					if (isFirst) isFirst = false;
					else call += ", ";
					call += lhsToAddress(src, cls, sched._ast);
					printArgs += "";//"#ifdef DEBUGY\n  cout << \"           " + src.toString() + ": \" << " + DataGenerator.lhsToAddress(src, cls) + " << endl;\n#endif //DEBUGY\n"; 
				}
				call += ")";
				//System.err.println("<+++ (" + f.getName() + "), " + call);
				//System.err.println("Adding nonloop top: " + f.getName());
				exprToCall.put(f.getName(), call);
				
				String printer = "";
				printer += "";//"#ifdef DEBUGY\n  cout << \"      "  + f.getName() + ": \" << " + DataGenerator.lhsToAddress(f.myDest, cls) + " << endl;\n#endif //DEBUGY\n";
				exprPrinter.put(f.getName(), printer + printArgs);
			}				
		}	
		
		for (ALEParser.Assignment asgn : sched._ast.assignments) {
			if (!"".equals(asgn.loopVar)) {
				AGEval.Class cls = asgn._class;
				String lhsRaw = asgn._sink;
				String lhs = lhsRaw.toLowerCase();
				//FIXME init assign loc..
		        //String fname = cls.getName().toLowerCase() + "_" + lhs;
	        	//System.err.println("Adding loop: " + cls.getName().toLowerCase() + "_" + lhsRaw.toLowerCase().replace("@", "_") + "_init");
	        	//System.err.println("Adding loop: " + cls.getName().toLowerCase() + "_" + lhsRaw.toLowerCase().replace("@", "_") + "_step");
		        boolean isParentAttrib = !lhsRaw.contains("@") || lhsRaw.split("@")[0].equals("self");
		        String whoInit = cls.getName().toLowerCase() + "_" + lhsRaw.toLowerCase().replace("@", "_") + "_init";
		        //String lhsInit = CppGenerator.lhsToAddress(isParentAttrib ? lhsRaw : (lhsRaw.replace("@", "_")+"_last"), cls);
		        
		        String initLhs = isParentAttrib ? 
		        		lhsToAddress(lhsRaw, cls, sched._ast) 
		        		: (typeStringToCppType(Generator.extendedGet(sched._ast, cls, lhsRaw).strType) + " " + lhs.replace("@","_") + "_last");
		        		
		        String dupeLhs = isParentAttrib ? "" : (lhs.replace("@","_") + "_last");
		        		
	            exprToCall.put(
	            		whoInit, 
	            		initLhs + " = " + asgnLoopExpr(cls, reducts, asgn, lhsRaw, true, sched._ast));
	            exprPrinter.put(whoInit, "");
		        String whoStep = cls.getName().toLowerCase() + "_" + lhsRaw.toLowerCase().replace("@", "_") + "_step"; 
	            exprToCall.put(
	            		whoStep, 
	            		lhsToAddress(lhsRaw, cls, sched._ast) 
	            			+ " = " + asgnLoopExpr(cls, reducts, asgn, lhsRaw, false, sched._ast));
	            exprPrinter.put(whoStep, ""); 		
	            if (!isParentAttrib) {
	            	exprToCall.put(whoStep, exprToCall.get(whoStep) +
	            			";\n" + dupeLhs + " = " + lhsToAddress(lhsRaw, cls, sched._ast));
		            exprPrinter.put(whoStep, exprPrinter.get(whoStep) + ""); 		
	            }
			}
		}
	}
	
	//============
	
	public String toAcc(String lhsRaw, AGEval.Class c) {
		String lhs = lhsRaw.toLowerCase();
		if (!lhs.contains("@")) return lhs + "_last";
		if (lhs.contains("self@")) return lhs.split("@")[1] + "_last";
		return lhs.replace("@", "_") + "_last";
	}
	
	public String bindExpr(String openBody, HashMap<String,String> indexedVariables, AGEval.Class cls, boolean allowStep, boolean replaceStep, String acc, ALEParser ast) throws InvalidGrammarException {
		String res = openBody;
		for (Entry<String, String> e : indexedVariables.entrySet()) {
			if (!allowStep && (e.getKey().equals("$acc") || e.getKey().contains("$i"))) {
				throw new InvalidGrammarException("reduction variables ($ identifiers) must be in loop steps, error binding expression " 
						+ openBody + " with " + e.getKey() + " == " + e.getValue());
			}
			if ("$acc".equals(e.getKey())) {
				if (replaceStep) {
					//init
					throw new InvalidGrammarException("$acc must be in loop steps, error binding expression " 
							+ openBody + " with " + e.getKey() + " == " + e.getValue());
				} else {
					//step
					res = res.replaceAll(e.getValue() + " ", 
							acc.replace("$", "\\$") + " ");
					res = res.replaceAll(e.getValue() + "$", acc.replace("$", "\\$")  + " ");					  
				}
			} else if (e.getKey().contains("$i")) {		
				if (replaceStep) {
					//FIXME init $i => final 
					res = res.replaceAll(e.getValue() + " ", lhsToAddress(e.getKey(), cls, ast).replace("$", "\\$")  + " ");
					res = res.replaceAll(e.getValue() + "$", lhsToAddress(e.getKey(), cls, ast).replace("$", "\\$")  + " ");
					//FIXME data structure generation must provide (in case using more lax check than just isReduct...)
				} else {
					//step $i => child
					res = res.replaceAll(e.getValue() + " ", lhsToAddress(e.getKey(), cls, ast).replace("$", "\\$")  + " ");
					res = res.replaceAll(e.getValue() + "$", lhsToAddress(e.getKey(), cls, ast).replace("$", "\\$")  + " ");					  
				}
			} else {
				res = res.replaceAll(e.getValue() + " ", lhsToAddress(e.getKey(), cls, ast).replace("$", "\\$")  + " ");
				res = res.replaceAll(e.getValue() + "$", lhsToAddress(e.getKey(), cls, ast).replace("$", "\\$")  + " ");
			}
		}
		return res;
	}

	//---

	public String nestedTernaryLoopStep(Reductions reducts, ALEParser.Case c, String lhsRaw, AGEval.Class cls, ALEParser ast) throws InvalidGrammarException {
	  String res = ""; 
	  if (!c.isElse) {		
		  res += bindExpr(c.openBody, c.indexedVariables, cls, true, false, toAcc(lhsRaw, cls), ast);
		  res += " ? ";
	  } else {
		  res += " : ";
	  }
	  
	  for (ALEParser.Assignment asgn : c.assignments) {
		  if (asgn._sink.equals(lhsRaw)) {
			  res += asgnLoopExpr(cls, reducts, asgn, lhsRaw, false, ast);
		  }
	  }
	  
	  for (ALEParser.Cond cnd : c.conditionals) {
		  res += nestedTernaryLoopStep(reducts, cnd, lhsRaw, cls, ast);
	  }
	  
	  return res;
	}
	
	public String nestedTernaryLoopStep(Reductions reducts, ALEParser.Cond c, String lhsRaw, AGEval.Class cls, ALEParser ast) throws InvalidGrammarException {
		String res = "(";
		res += nestedTernaryLoopStep(reducts, c.testCase, lhsRaw, cls, ast);
		for (ALEParser.Case cs : c.elseifs) res += nestedTernaryLoopStep(reducts, cs, lhsRaw, cls, ast);
		res += nestedTernaryLoopStep(reducts, c.elseCase, lhsRaw, cls, ast);
		return res + ")";
	}
	
	//---
	

	//	
	public void checkInitable(Reductions reducts, AGEval.Class cls, HashMap<String,String> variables, String lhsRaw) throws InvalidGrammarException {
		System.err.println("checkInitable..");
/*
		  for (String rawV : variables.keySet()) {
			  if ("$acc".equals(rawV) 					  
				  || (rawV.contains("$i") && !reducts.sinks.get(cls).contains(rawV.replace("$i", "")))) { //FIXME fixedpoint calc for better latter
				  throw new InvalidGrammarException("non-reduction assignment to " + cls.getName() + "::" + lhsRaw 
						  + " potentially used as a last value ($$), with unscheduble initialization dependency on " + rawV);							  
			  }
		  }
*/
	}
	
	public String asgnLoopExpr (AGEval.Class cls, Reductions reducts, ALEParser.Assignment asgn, String lhsRaw, boolean isInit, ALEParser ast) throws InvalidGrammarException {
		String res = "";
		if (asgn.isReduction) {
			res += "(" + 
				bindExpr(
					isInit ? asgn.startBody : asgn.stepBody, 
					isInit ? asgn.startVariables : asgn.stepVariables, 
					cls, true, isInit, toAcc(lhsRaw, cls), ast) + ")";
		} else {
			if (reducts.accessedAsLast.get(cls).contains(lhsRaw.toLowerCase())) {
				checkInitable(reducts, cls, asgn._variables, lhsRaw);
			}
			res += "(" + bindExpr(asgn._indexedBody, asgn._variables, cls, true, isInit, toAcc(lhsRaw, cls), ast) + ")";
		}
		
		return res;
	}
	public String nestedTernaryLoopInit(Reductions reducts, ALEParser.Case c, String lhsRaw, AGEval.Class cls, ALEParser ast) throws InvalidGrammarException {
	  String res = ""; 
	  if (!c.isElse) {		
		  checkInitable(reducts, cls, c.indexedVariables, lhsRaw);
		  res += bindExpr(c.openBody, c.indexedVariables, cls, true, true, toAcc(lhsRaw, cls), ast); 
		  res += " ? ";
	  } else {
		  res += " : ";
	  }
	  
	  for (ALEParser.Assignment asgn : c.assignments) {
		  if (asgn._sink.equals(lhsRaw)) {
			  res += asgnLoopExpr(cls, reducts, asgn, lhsRaw, true, ast);
		  }
	  }
	  
	  for (ALEParser.Cond cnd : c.conditionals) {
		  res += nestedTernaryLoopInit(reducts, cnd, lhsRaw, cls, ast);
	  }
	  
	  return res;
	}
	
	public String nestedTernaryLoopInit(Reductions reducts, ALEParser.Cond c, String lhsRaw, AGEval.Class cls, ALEParser ast) throws InvalidGrammarException {
		String res = "(";
		res += nestedTernaryLoopInit(reducts, c.testCase, lhsRaw, cls, ast);
		for (ALEParser.Case cs : c.elseifs) res += nestedTernaryLoopInit(reducts, cs, lhsRaw, cls, ast);
		res += nestedTernaryLoopInit(reducts, c.elseCase, lhsRaw, cls, ast);
		return res + ")";
	}
	
	//-----
	
	
	
	
	
	//============
	
	
	
	
	
	
	
	
	
	
	
	
	
	public String visitDispatcher(int visit, AGEvaluator aleg, HashSet<AGEval.Class>buIns, HashSet<AGEval.Class>bus) {
		HashSet<AGEval.Class> inIns = getInIns(aleg, bus, buIns);
		
		String res = 
			"bool visit_"+ visit + " (bool isGlobalCall, VISITPARAMS) {\n" +
			"  switch (s.data.parseData.display) {\n";
		for (AGEval.Class cls : aleg.classes) {
			res += "    case ExtraDataHandler::TOK_" + cls.getName().toUpperCase() + ":\n";
		
			if (buIns != null && buIns.contains(cls)) { /* is inorder and may have bu parent: will be called 2x, need to dynamically filter out global variant*/
				res += 
				"        if (isGlobalCall && (SPARENT != NULL) && isInorder(SPARENT, " + visit + ")) return true;\n";				
			} else if (buIns != null && inIns.contains(cls))	{
				res += 
				"        if (isGlobalCall && (SPARENT != NULL) ) return true;\n";									
			}
			res += 
				"      return visit_" + cls.getName().toLowerCase() + "_" + visit + "(VISITARGS(s, root, SPARENT));\n";
		}
		res += "  }\n";
		res += "  return true;\n}\n";
		return res;
	}
	public String visitDispatchers(int visits, AGEvaluator aleg, Vector<HashSet<AGEval.Class>> buSubInorderBuIns, Vector<HashSet<AGEval.Class>> buSubInorderBus) {
		String res = "";
		for (int i = 0; i < visits; i++) res += visitDispatcher(i, aleg, buSubInorderBuIns.get(i), buSubInorderBus.get(i));
		return res;
	}
	
	/*
  private static String getFieldByTag(AGEvaluator aleg, String prop, String type) {
	String res = "";
	res += 
		type + " get_dynamic_field_" + prop + "(SNode *n) {\n" +
		"  switch (n->data.computeData.tag) {\n";
	for (AGEval.Class cls : aleg.classes) {
		if (cls.getPrivAttributes().containsKey(prop) || cls.getPubAttributes().containsKey(prop)) {
			res += "    case aletags::TAG_" + cls.getName().toUpperCase() + ":\n" +
			  "      n->data.computeData.classData.ExtraSub" + cls.getName() + "." + prop + ";\n" +
			  "      break;\n";				
		}
	}
	res +=
		"    default: \n" +
		"      cout << \"no property " + prop + " to get\" << end;\n" +
		"      exit(1);\n" +
		"  }\n" +
		"}\n";
	return res;  
  }  
	
  private static String getFieldsByTag(AGEvaluator aleg) throws InvalidGrammarException {
	  String res = "";
	  HashMap<String, String> fields = new HashMap<String, String>();	 
	  for (AGEval.Class cls : aleg.classes) {
		  for (String attr : cls.getPubAttributes().keySet()) {
			  String type = Vertex.typeToString(cls.getPubAttributes().get(attr));
			  if (fields.containsKey(attr)) {
				  if (!fields.get(attr).equals(type)) throw new InvalidGrammarException("For now, require all same name attributes to be of same type");
				  continue;
			  }
			  fields.put(attr, type);			  
		  }
	  }
	  
	  for (String attr : fields.keySet()) {
		  String type = fields.get(attr);
		  res += getFieldByTag(aleg, attr, type);
	  }
	  
	  return res;
  }
    */

	
  public String lhsToAddress (String lhs, Class cls, ALEParser ast) throws InvalidGrammarException {
	  	boolean isParent;
	  	boolean isParseData;
	  	String child;
	  	String prop;
	  	if (lhs.split("@").length == 2) {
	  		child = lhs.split("@")[0];
	  		isParent = child.equals("self");
	  		prop = lhs.split("@")[1];	  		
//	  		if (prop.contains("$") && child.equals("self")) {
//	  			System.err.println("CppGen: Cannot use intra-reduction accessors (self$$, ...), caught on use " + child + " in " + lhs);
//	  			//throw new InvalidGrammarException("Cannot use intra-reduction accessors (self$$, ...), caught on use " + child + " in " + lhs);
//	  		}
	  	} else {
	  		child = ""; //silly Java
	  		isParent = true;
	  		prop = lhs;
	  	}
	  	String propClean = prop.toLowerCase();	  		  	
	  	try {
	  		if (propClean.contains("_init") || propClean.contains("_last")) { //loop vars
	  			isParseData = false;
	  		} else {
		  		ExtendedVertex v = Generator.extendedGet(ast, cls, lhs.replace("$$", "").replace("$i", "").replace("$-", ""));		  		
		  		if (v.isInput) throw new InvalidGrammarException("Accessing parse data as lhs: " + cls.getName() + "::" + lhs);
		  		else isParseData = false;
	  		}
	  	} catch (InvalidGrammarException e) {
	  		e.printStackTrace();
	  		isParseData = false;
	  	}
	  	if (isParent) {
	  		String base = isParseData ? ("parseData.genData.extraParse" + cls.getName()) : ("computeData.classData.Sub" + cls.getName());
	  		return base + "." + (isParseData ? "fld_" : "") + prop.toLowerCase();
	  	} else if (Generator.childrenContains(ast.extendedClasses.get(cls).multiChildren.keySet(), child)) {
	  		if (isParseData) return "loopChild->data.parseData.genData.extraParse" + cls.getChildByName(child).getName() + ".fld_" + propClean;
	  		else return "loopChild->data.computeData.classData.Sub" + cls.getChildByName(child) + "." + propClean;	  		
	  	} else {
	  		String base = 
	  			"#if defined(VERYSMALLTREEPOINTERS)\n" +
		  		"(&s + s.distanceToLeftmostChild + computeData.classData.Sub" + cls.getName() + ".child_" + child + ")\n" +
	  			"#elif defined(SMALLTREEPOINTERS)\n" +
		  		"(s.leftmostChild + computeData.classData.Sub" + cls.getName() + ".child_" + child + ")\n" +
	  			"#else\n" +
		  		"(computeData.classData.Sub" + cls.getName() + ".child_" + child + ")\n" +
	  			"#endif // ptrs\n";
	  		if (isParseData) 
	  			return base + "->data.parseData.genData.extraParse" + cls.getChildByName(child).getName() + ".fld_" + propClean;
	  		else 
	  			return base + "->data.computeData.classData.Sub" + cls.getChildByName(child) + "." + propClean;
	  	}
	  	
	  
  }
	
public static String assignAliases(AGEval.Class c, ALEParser ast) {
	if (c.getChildMappings() == null) throw new NullPointerException();
	if (ast.extendedClasses == null) throw new NullPointerException();
	if (ast.extendedClasses.get(c) == null) {
		System.err.println("EC has no class: " + c.getName());
		for (AGEval.IFace s : ast.extendedClasses.keySet()) {
			System.err.println("  option: "+ s.getName() + " => " + (ast.extendedClasses.get(s) == null ? "null" : "val"));
			if (s.getName().equals(c.getName())) {
				System.err.println("    same name!");
				System.err.println("    " + (s == c ? " same key " : " diff key"));
			}
		}
		throw new NullPointerException();
	}
	  int numSingle = c.getChildMappings().size() - ast.extendedClasses.get(c).multiChildren.keySet().size();
	
	  String res = "static void assignAliases_" + c.getName() + " (VISITPARAMS) {\n";
	  
	  if (numSingle == 0 && ast.extendedClasses.get(c).multiChildren.keySet().size() == 0) return res + "}\n";
	  
	  for (String n : ast.extendedClasses.get(c).multiChildren.keySet())
		  res += "  s.data.computeData.classData.Sub" + c.getName() + ".child_" + n.toLowerCase() + "_count = 0;\n";
	  	  
	  res += 
		  "#if defined(SMALLTREEPOINTERS) || defined(VERYSMALLTREEPOINTERS)\n" +
		  "  PTRBACKINGTYPE __assignAliasesOffset = 0;\n"+//s.distanceToLeftmostChild;\n" +
		  "#endif //small / vsmall ptrs\n" +
		  "#ifdef DEBUGY\n  int found = 0;\n#endif //DEBUGY\n" +
		  "  SFORLOOP(child, s) {\n" +
		  "    switch(child->data.parseData.refname) {\n";
	  for (String n : c.getChildMappings().keySet()) { //skip multichildren maps (instead dyn lookup) 		  
		  if (ast.extendedClasses.get(c).multiChildren.containsKey(n)) {
			  res += 
				  "      case ExtraDataHandler::TOK_" + n.toUpperCase() + ":\n" +
				  "        s.data.computeData.classData.Sub" + c.getName() + ".child_"+ n.toLowerCase() + "_count++;\n" +
				  "#if defined(DEBUGY)\n" +
				  "        cout << \"  found " + n + " alias\" << endl;\n" +
				  "#endif //DEBUGY\n" +			  				  
				  "#if defined(DEBUGY) && defined(VERYSMALLTREEPOINTERS)\n" +
				  "        if (child != (&s + s.distanceToLeftmostChild + __assignAliasesOffset)) {\n" +
				  "          cout << \"failed pointer compression/decompression \" << endl; exit(1); \n" +
				  "        }\n" +
				  "#endif //DEBUGY && VS\n" +			  
				  "        break; \n";
		  } else {
			  res += 
				  "      case ExtraDataHandler::TOK_" + n.toUpperCase() + ":\n" +
				  "#if defined(VERYSMALLTREEPOINTERS)\n" +
				  "        s.data.computeData.classData.Sub" + c.getName() + ".child_"+ n + " = __assignAliasesOffset;\n" +
				  "#elif defined(SMALLTREEPOINTERS)\n" +
				  "        s.data.computeData.classData.Sub" + c.getName() + ".child_"+ n + " = __assignAliasesOffset;\n" +
				  "#else\n" +
				  "        s.data.computeData.classData.Sub" + c.getName() + ".child_"+ n + " = child;\n" +
				  "#endif //ptrs\n" +
				  "#if defined(DEBUGY)\n" +
				  "        found++;\n" +
				  "#endif //DEBUGY\n" +			  
				  "#if defined(DEBUGY) && defined(VERYSMALLTREEPOINTERS)\n" +
				  "        if (child != (&s + s.distanceToLeftmostChild + __assignAliasesOffset)) {\n" +
				  "          cout << \"failed pointer compression/decompression \" << endl; exit(1); \n" +
				  "        }\n" +
				  "        cout << \"  found multi " + n + " alias\" << endl;\n" +
				  "#endif //DEBUGY\n" +			  
				  "        break; \n";
		  }
	  }
	  
	  String multiChecks;
	  /*
	  if (ast.extendedClasses.get(c).multiChildren.size() > 0) {
		  multiChecks =
			  "#ifdef DEBUGY\n" +
			  "        switch(child->data.parseData.displayname) {\n";
		  for (String iface : ast.extendedClasses.get(c).multiChildren.keySet())
			  multiChecks += 
				  "          case ExtraDataHandler::TOK_" + iface.toUpperCase() + ":\n" +
				  "            break;\n";			  
		  multiChecks +=
			  "          default: \n" +
			  "            cout << \"unknown refname/display type in " + c.getName() + 
			  ": \" << child->data.parseData.refname << \"/\" << child->data.parseData.displayname << endl;\n" +
			  "            exit(1);\n" +
			  "        }\n" +
			  "#endif //DEBUGY\n";

	  } else {
	  */
		  multiChecks = 		  
			  "#ifdef DEBUGY\n" +
			  "        cout << \"unknown refname type in " + c.getName() + ": \" << child->data.parseData.refname << endl;\n" +
			  "        exit(1);\n" +
			  "#endif //DEBUGY\n";		  
	  //}

	  res +=
		  "      default: \n" +
		  multiChecks + 
		  "        break;\n" +
		  "    }\n" +
		  "#if defined(SMALLTREEPOINTERS) || defined(VERYSMALLTREEPOINTERS)\n" +
		  "    __assignAliasesOffset++;\n" +
		  "#endif //small or vsmall pts\n" +
		  "  } SFORLOOPEND(child, s);\n" +
		  "#ifdef DEBUGY\n" +
		  "  if (found != " + numSingle + ") {\n" +
		  "    cout << \"Did not find expected singleton childs for class " + c.getName() + "; found \" << found << \" of " + numSingle + "\" << endl;\n" +
		  "    exit(1);\n" +
		  "  }\n" +
		  "#endif //DEBUGY\n";
	  res += "}\n";
	  return res;
  }


  public static String genInterfaceHeaderFields (AGEval.IFace i, HashMap<AGEval.IFace, ALEParser.ExtendedClass> extendedClasses) {
	  ALEParser.ExtendedClass ei = extendedClasses.get(i);
	  String res = "";
	  //sortedPubs = i.getPubAttributes().keySet().toArray(sortedPubs);
	  HashSet<String> pubs = new HashSet<String>();
	  for (Entry<String, ExtendedVertex> v : ei.extendedVertices.entrySet())  {
		  if (!v.getValue().isInput) pubs.add(v.getKey());
	  }
	  String[] sortedPubs = {}; 
	  sortedPubs = pubs.toArray(sortedPubs);
	  Arrays.sort(sortedPubs);
	  int counter = 0;
	  for (String n : sortedPubs) {
		  while (ei.positionedVariables.containsKey(new Integer(counter))) {
			  String prop = ei.positionedVariables.get(new Integer(counter));
			  //FIXME type lookup for extended types
			  res += "  " + typeStringToCppType(ei.extendedVertices.get(prop).strType) + " " + prop + ";\n";
			  counter++;
		  }
		  if (!ei.positionedVariables.containsValue(n)) {					  
			  //FIXME type lookup for extended types
			  res += "  " + typeStringToCppType(ei.extendedVertices.get(n).strType.replace("color", "int"))  + " " + n.toLowerCase() + ";\n";
			  counter++;
		  }
	  }
	  return res;
  }
  
  public static String interfaceHeader (AGEval.IFace i, HashMap<AGEval.IFace, ALEParser.ExtendedClass> extendedClasses) {
	  String res = "struct ExtraSub" + i.getName() + " {\n";
	  res += genInterfaceHeaderFields(i, extendedClasses); 
	  res += "};\n";	  
	  return res;
  }
  
  public static String classHeader (AGEval.Class c, HashMap<AGEval.IFace, ALEParser.ExtendedClass> extendedClasses, Schedule sched) throws InvalidGrammarException {
	  //ALEParser.ExtendedClass ei = extendedClasses.get(c.getInterface());
	  String res = "struct ExtraSub" + c.getName() + " {\n";
	  res += genInterfaceHeaderFields(c.getInterface(), extendedClasses); 
	  for (String n : c.getChildMappings().keySet()) {
		  if (extendedClasses.get(c).multiChildren.containsKey(n)) res += "  PTRBACKINGTYPE child_" + n.toLowerCase() + "_count;\n"; 
		  else res += "  PTRBACKINGTYPE child_" + n.toLowerCase() + ";\n";
	  }
	  for (String n : c.getPrivAttributes().keySet())
		  res += "  " + typeStringToCppType(Vertex.typeToString(c.getPrivAttributes().get(n))) + " " + n.toLowerCase() + ";\n";

	  
	  for (String sink : sched.reductions.sinks.get(c)) {
		  String type = typeStringToCppType(Generator.extendedGet(sched._ast, c, sink).strType);
		  
		  if (!sink.contains("@") || sink.contains("self@")) {
			  String propClean = AGEvaluatorSwipl.attribName(sink).toLowerCase();
			  res += "  " + type + " " + propClean + "_init;\n";
			  res += "  " + type + " " + propClean + "_last;\n";
		  } else {
			  String propClean = sink.replace("@", "_").toLowerCase();
			  res += "  " + type + " " + propClean + "_init;\n";
			  res += "  " + type + " " + propClean + "_last;\n";
		  }
	  }
	  /*
	  for (String f : reducts) {
	      if (!f.contains("@") || f.contains("self@")) continue;		
	  	  res += "  " + Vertex.typeToString(Generator.lookupAttribute(f, c).myValueType) + " " + f.replace("@", "_") + "_last;\n";
	  }
	  */
	  //res += assignAliases(c);
	  res += "};\n";	  
	  return res;
  }
  
  public static String classesHeader(ALEParser ast, int numVisits, Schedule sched) throws InvalidGrammarException {

	  String res = "";
	  for (AGEval.Class c : ast.classes) res += classHeader(c, ast.extendedClasses, sched);
	  for (AGEval.IFace i : ast.interfaces) res += interfaceHeader(i, ast.extendedClasses);

	  String union = "union ExtraAny {\n";
	  for (AGEval.Class c : ast.classes) 
		  union += "  ExtraSub" + c.getName() + " Sub" + c.getName() + ";\n";		  
	  for (AGEval.IFace i : ast.interfaces)
		  union += "  ExtraSub" + i.getName() + " Sub" + i.getName() + ";\n";

	  union += "};\n";

	  /*
	  String tags = "enum aletags { ";
	  boolean isFirst = true;
	  for (AGEval.Class c : aleg.classes) {
		  if (isFirst) isFirst = false;
		  else tags += ", ";
		  tags += "TOK_" + c.getName().toUpperCase();
	  }
	  tags += " };\n";	  
	  String getters = getFieldsByTag(aleg);
	   */

	  String visitHeaders = "";
	  for (int i = 0; i < numVisits; i++)
		  visitHeaders += "bool visit_" + i + "(bool isGlobalCall, VISITPARAMS);\n";

	  String body = res + union + /*tags + getters + */ visitHeaders;
	  String pre = 
			  "#ifndef VISITORS_H\n" +
					  "#define VISITORS_H\n" +
					  "#include \"constants.h\"\n" +
					  "#ifdef EXTRA_DATA\n\n\n" +
					  "struct SNode;\n" +
					  "#include \"sssmacros.h\"\n" +
					  //"#include \"extradatahandler.h\"\n" +
					  "\n";
	  String post = "\n#endif //EXTRA_DATA\n\n#endif //VISITORS_H\n";

	  return (pre + body + post);
  }

  public static String printCurrentPipelineBatch (Schedule schedule2) throws InvalidGrammarException {
	  String res = "#ifdef DEBUGY\n  tbb::tick_count::interval_t interval;\n";
	  //int step = 0;
	  for (int step = 0; step <= schedule2.binding.get("P").toTermArray().length; step++) {
		  res += "tbb::tick_count t" + step + ";\n";		  
	  }
	  //res += "\ntbb::tick_count t" + step + ";\n"; //last
	  res += "t0 = tbb::tick_count::now();\n#endif //DEBUGY\n\n";

	  int pass = 0;
	  int lockC = 0;	
	  for (Term visit : schedule2.binding.get("P").toTermArray()) {
		  String traversal = (lockC + 1) % 2 == 0 ? "false" : "true";

		  res += 
				  "#if defined(DEBUGY) && defined(BLOCKPARALLELTREE)\n" +
						  "  cout << \"batch " + pass + ": \" << endl;\n" +
						  "  resetOrdering(browser->rstree.second.second.second);\n" +
						  "#endif //DEBUGY\n";

		  String stencil = visit.arg(2).arg(1).toString();
		  if (stencil.equals("tdLtrU")) {
			  res += "  visit_" + pass + "(true, VISITARGS(*root, *root, NULL));\n"; 
		  } else if (stencil.equals("td")) {
			  res +=
					  "#if defined(TBBBLOCKPARALLELTREE) || defined(TBBBLOCKPARALLELTREEOPT) || defined(TBBBLOCKPARALLELTREECONT)\n" +
							  "  inheritVisitBlock<visit_" + pass + ", " + traversal + ">(root, sb);\n" +
							  "#elif defined(TBBGRAPHSOLVER)\n" +
							  "  parallelInheritFTL<inheritVisitBlockFlat<visit_" + pass + ", " + traversal + ">, visit_" + pass + ">(root, sb, numBlocks);\n" +
							  "#else\n" +
							  "  p.batch(v" + pass + ");\n" +
							  "#endif\n";			
			  lockC++;
		  } else if (stencil.equals("bu")) {
			  res += 
					  "#if defined(TBBBLOCKPARALLELTREE) || defined(TBBBLOCKPARALLELTREEOPT) || defined(TBBBLOCKPARALLELTREECONT)\n" +
							  "  synthesizeVisitBlock<visit_" + pass + ", true>(root, sb);\n" +
							  "#elif defined(TBBGRAPHSOLVER)\n" +
							  "  parallelSynthesizeFTL<synthesizeVisitBlockFlat<visit_" + pass + ", " + traversal + ">, visit_" + pass + ">(root, fringe, numBlocks);\n" +
							  "#else\n" +
							  "  p.batch(v" + pass + ");\n" +
							  "#endif\n";
			  lockC++;
		  } else if (stencil.equals("buSubInorder")) {
			  res += 
					  "#if defined(TBBBLOCKPARALLELTREE) || defined(TBBBLOCKPARALLELTREEOPT) || defined(TBBBLOCKPARALLELTREECONT)\n" +
							  "  synthesizeVisitBlock<visit_" + pass + ", true>(root, sb);\n" +
							  "#elif defined(TBBGRAPHSOLVER)\n" +
							  "  parallelSynthesizeFTL<synthesizeVisitBlockFlat<visit_" + pass + ", " + traversal + ">, visit_" + pass + ">(root, fringe, numBlocks);\n" +
							  "#else\n" +
							  "  p.batch(v" + pass + ");\n" +
							  "#endif\n";
			  lockC++;
		  } else {
			  throw new InvalidGrammarException("Unknown stencil type: " + stencil);
		  }
		  res += "#ifdef DEBUGY\n  cout << \"  (batch done.)\" << endl;\n#endif //DEBUGY\n";
		  pass++;
		  res += 
				  "#ifdef DEBUGY\nt" + pass + " = tbb::tick_count::now();\n#endif //DEBUGY\n";			
	  }
	  res += "\n";
	  res += "#ifdef DEBUGY\ndouble sum = 0;\n";	  
	  for (int step = 0; step <= schedule2.binding.get("P").toTermArray().length; step++) {
		  res += 
				  "interval = t" + (step+1) + " - t" + step + ";\n" +
						  "printf(\"Visit, " + step + ", %g\\n\", interval.seconds());\n" +
						  "sum += interval.seconds();\n";		
	  }
	  res += "printf(\"Final, %g\\n\", sum);\n#endif //DEBUGY\n";
	  return res;
  }

public static String printCurrentPipelineDelayedBatch (Schedule schedule2) throws InvalidGrammarException {
	String res = "#ifdef DEBUGY\ntbb::tick_count::interval_t interval;\n";
	//int step = 0;
	for (int step = 0; step <= schedule2.binding.get("P").toTermArray().length; step++) {
		res += "tbb::tick_count t" + step + ";\n";		
	}
	//res += "\ntbb::tick_count t" + step + ";\n"; //last
	res += "t0 = tbb::tick_count::now();\n#endif //DEBUGY\n\n";
	
	int pass = 0;
	int lockC = 0;	
	for (Term visit : schedule2.binding.get("P").toTermArray()) {
		String traversal = (lockC + 1) % 2 == 0 ? "false" : "true";

		res += 
			"#if defined(DEBUGY) && defined(BLOCKPARALLELTREE)\n" +
			"  cout << \"batch " + pass + ": \" << endl;\n" +
			"  resetOrdering(browser->rstree.second.second.second);\n" +
			"#endif //DEBUGY\n";
		
		String stencil = visit.arg(2).arg(1).toString();
		if (stencil.equals("tdLtrU")) {
			res += "  visit_" + pass + "(true, VISITARGS(*root, *root, NULL));\n"; 
		} else if (stencil.equals("td")) {
			res +=
				"#if defined(TBBBLOCKPARALLELTREE) || defined(TBBBLOCKPARALLELTREEOPT) || defined(TBBBLOCKPARALLELTREECONT)\n" +
				"  inheritVisitBlock<visit_" + pass + ", " + traversal + ">(root, sb);\n" +
				"#elif defined(TBBGRAPHSOLVER)\n" +
				"  parallelInheritFTL<inheritVisitBlockFlat<visit_" + pass + ", " + traversal + ">, visit_" + pass + ">(root, sb, numBlocks);\n" +
				"#else\n" +
				"  p.batchP(v" + pass + ");\n" +
				"#endif\n";			
			lockC++;
		} else if (stencil.equals("bu")) {
			res += 
				"#if defined(TBBBLOCKPARALLELTREE) || defined(TBBBLOCKPARALLELTREEOPT) || defined(TBBBLOCKPARALLELTREECONT)\n" +
				"  synthesizeVisitBlock<visit_" + pass + ", true>(root, sb);\n" +
				"#elif defined(TBBGRAPHSOLVER)\n" +
				"  parallelSynthesizeFTL<synthesizeVisitBlockFlat<visit_" + pass + ", " + traversal + ">, visit_" + pass + ">(root, fringe, numBlocks);\n" +
				"#else\n" +
				"  p.batchP(v" + pass + ");\n" +
				"#endif\n";
			lockC++;
		} else if (stencil.equals("buSubInorder")) {
			res += 
					"#if defined(TBBBLOCKPARALLELTREE) || defined(TBBBLOCKPARALLELTREEOPT) || defined(TBBBLOCKPARALLELTREECONT)\n" +
					"  synthesizeVisitBlock<visit_" + pass + ", true>(root, sb);\n" +
					"#elif defined(TBBGRAPHSOLVER)\n" +
					"  parallelSynthesizeFTL<synthesizeVisitBlockFlat<visit_" + pass + ", " + traversal + ">, visit_" + pass + ">(root, fringe, numBlocks);\n" +
					"#else\n" +
					"  p.batchP(v" + pass + ");\n" +
					"#endif\n";
				lockC++;
		} else {
			throw new InvalidGrammarException("Unknown stencil type: " + stencil);
		}
		res += "#ifdef DEBUGY\n  cout << \"  (batch done.)\" << endl;\n#endif //DEBUGY\n";
		pass++;
		res += 
			"#ifdef DEBUGY\nt" + pass + " = tbb::tick_count::now();\n#endif // DEBUGY\n";			
	}
	res += "\n";
	res += "#ifdef DEBUGY\ndouble sum = 0;\n";
	
	for (int step = 0; step < schedule2.binding.get("P").toTermArray().length; step++) {
		res += 
			"interval = t" + (step+1) + " - t" + step + ";\n" +
			"printf(\"Visit, " + step + ", %g\\n\", interval.seconds());\n" +
		    "sum += interval.seconds();\n";
		step++;
	}
	res += "printf(\"Final, %g\\n\", sum);\n#endif //DEBUGY\n";
	return res;
}

public String printCurrentPipelineHeaders (Hashtable<Variable, Term> binding) throws InvalidGrammarException {
	String res = "";
	int pass = 0;
	int lockC = 0;
	//FIXME fuse inh/syn
	for (Term visit : binding.get("P").toTermArray()) {
		//System.err.println(visit.toString());
		String stencil = visit.arg(2).arg(1).toString();
		String traversal = (lockC + 1) % 2 == 0 ? "false" : "true";
		if (stencil.equals("tdLtrU")) {
			System.out.println("Pass " + pass + ": inorder");
			//res += "  WSPiplineInorder<visit_" + pass + "> v" + pass + "(root);\n";
			res += "  //no setup for inorder visit " + pass + "\n";
		} else if (stencil.equals("td")) {
			System.out.println("Pass " + pass + ": td");
			res += 
				"#ifdef PTHREADWSBLOCKS\n" +
				"  WSPipelineInherit<visit_" + pass + ", " + traversal + "> *v" + pass + ";\n" +
				"#elif defined(BLOCKPARALLELTREE) && defined(PTHREADBLOCKS)\n" +
				"  WSPipelineInherit<visit_" + pass + ", " + traversal + "> *v" + pass + ";\n" +
				"#elif defined(BLOCKPARALLELTREE) && defined(PTHREADCOARSEBLOCKS)\n" +
				"  WSPipelineInherit<visit_" + pass + ", " + traversal + "> *v" + pass + ";\n" +
				"#elif defined(TBBBLOCKPARALLELTREE) || defined(TBBBLOCKPARALLELTREEOPT) || defined(TBBBLOCKPARALLELTREECONT) || defined(TBBGRAPHSOLVER)\n" +
				"  //no setup\n" +
				"#elif defined(BLOCKPARALLELTREE) || defined(PREALLOCATETREE)\n" +
				"  WSPipelineInherit<visit_" + pass + ", " + traversal + "> *v" + pass + ";\n" +
				"#elif defined(VECTORLAYOUT)\n" +
				"  WSPipelineInherit<visit_" + pass + ", " + traversal + "> *v" + pass + ";\n" +
				"#else\n" +
				"  ??\n" +
				"#endif\n";
			lockC++;
		} else if (stencil.equals("bu")) {
			System.out.println("Pass " + pass + ": bu");
			res += 
				"#ifdef PTHREADWSBLOCKS\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> *v" + pass + ";\n" +
				"#elif defined(BLOCKPARALLELTREE) && defined(PTHREADBLOCKS)\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> *v" + pass + ";\n" +
				"#elif defined(BLOCKPARALLELTREE) && defined(PTHREADCOARSEBLOCKS)\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> *v" + pass + ";\n" +
				"#elif defined(TBBBLOCKPARALLELTREE) || defined(TBBBLOCKPARALLELTREEOPT) || defined(TBBBLOCKPARALLELTREECONT) || defined(TBBGRAPHSOLVER)\n" +
				"  //no setup\n" +
				"#elif defined(BLOCKPARALLELTREE) || defined(PREALLOCATETREE)\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> *v" + pass + ";\n" +
				"#elif defined(VECTORLAYOUT)\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> *v" + pass + ";\n" +
				"#else\n" +
				"  ??\n" +
				"#endif\n";
			lockC++;
		} else if (stencil.equals("buSubInorder")) {
			System.out.println("Pass " + pass + ": buSubInorder");
			res += 
				"#ifdef PTHREADWSBLOCKS\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> *v" + pass + ";\n" +
				"#elif defined(BLOCKPARALLELTREE) && defined(PTHREADBLOCKS)\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> *v" + pass + ";\n" +
				"#elif defined(BLOCKPARALLELTREE) && defined(PTHREADCOARSEBLOCKS)\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> *v" + pass + ";\n" +
				"#elif defined(TBBBLOCKPARALLELTREE) || defined(TBBBLOCKPARALLELTREEOPT) || defined(TBBBLOCKPARALLELTREECONT) || defined(TBBGRAPHSOLVER)\n" +
				"  //no setup\n" +
				"#elif defined(BLOCKPARALLELTREE) || defined(PREALLOCATETREE)\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> *v" + pass + ";\n" +
				"#elif defined(VECTORLAYOUT)\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> *v" + pass + ";\n" +
				"#else\n" +
				"  ??\n" +
				"#endif\n";
			lockC++;
		} else {
			throw new InvalidGrammarException("Unknown stencil type: " + stencil);
		}
		pass++;
		
	}			
	return res;		
}

public String printCurrentPipelineBuild (Hashtable<Variable, Term> binding) throws InvalidGrammarException {
	String res = "";
	int pass = 0;
	int lockC = 0;
	//FIXME fuse inh/syn
	for (Term visit : binding.get("P").toTermArray()) {
		//System.err.println(visit.toString());
		String stencil = visit.arg(2).arg(1).toString();
		String traversal = (lockC + 1) % 2 == 0 ? "false" : "true";
		if (stencil.equals("tdLtrU")) {
			System.out.println("Pass " + pass + ": inorder");
			//res += "  WSPiplineInorder<visit_" + pass + "> v" + pass + "(root);\n";
			res += "  //no setup for inorder visit " + pass + "\n";
		} else if (stencil.equals("td")) {
			System.out.println("Pass " + pass + ": td");
			res += 
				"#ifdef PTHREADWSBLOCKS\n" +
				"  WSPipelineInherit<visit_" + pass + ", " + traversal + "> v" + pass + "(root, sb, steals);\n" +
				"#elif defined(BLOCKPARALLELTREE) && defined(PTHREADBLOCKS)\n" +
				"  WSPipelineInherit<visit_" + pass + ", " + traversal + "> v" + pass + "(root, sb);\n" +
				"#elif defined(BLOCKPARALLELTREE) && defined(PTHREADCOARSEBLOCKS)\n" +
				"  WSPipelineInherit<visit_" + pass + ", " + traversal + "> v" + pass + "(root, sched, numThreads);\n" +
				"#elif defined(TBBBLOCKPARALLELTREE) || defined(TBBBLOCKPARALLELTREEOPT) || defined(TBBBLOCKPARALLELTREECONT) || defined(TBBGRAPHSOLVER)\n" +
				"  //no setup\n" +
				"#elif defined(BLOCKPARALLELTREE) || defined(PREALLOCATETREE)\n" +
				"  WSPipelineInherit<visit_" + pass + ", " + traversal + "> v" + pass + "(root, treeSize);\n" +
				"#elif defined(VECTORLAYOUT)\n" +
				"  WSPipelineInherit<visit_" + pass + ", " + traversal + "> v" + pass + "(root, q);\n" +
				"#else\n" +
				"  ??\n" +
				"#endif\n";
			lockC++;
		} else if (stencil.equals("bu")) {
			System.out.println("Pass " + pass + ": bu");
			res += 
				"#ifdef PTHREADWSBLOCKS\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> v" + pass + "(root, sb, steals);\n" +
				"#elif defined(BLOCKPARALLELTREE) && defined(PTHREADBLOCKS)\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> v" + pass + "(root, sb);\n" +
				"#elif defined(BLOCKPARALLELTREE) && defined(PTHREADCOARSEBLOCKS)\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> v" + pass + "(root, sched, numThreads);\n" +
				"#elif defined(TBBBLOCKPARALLELTREE) || defined(TBBBLOCKPARALLELTREEOPT) || defined(TBBBLOCKPARALLELTREECONT) || defined(TBBGRAPHSOLVER)\n" +
				"  //no setup\n" +
				"#elif defined(BLOCKPARALLELTREE) || defined(PREALLOCATETREE)\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> v" + pass + "(root, treeSize);\n" +
				"#elif defined(VECTORLAYOUT)\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> v" + pass + "(root, q);\n" +
				"#else\n" +
				"  ??\n" +
				"#endif\n";
			lockC++;
		} else if (stencil.equals("buSubInorder")) {
			System.out.println("Pass " + pass + ": buSubInorder");
			res += 
				"#ifdef PTHREADWSBLOCKS\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> v" + pass + "(root, sb, steals);\n" +
				"#elif defined(BLOCKPARALLELTREE) && defined(PTHREADBLOCKS)\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> v" + pass + "(root, sb);\n" +
				"#elif defined(BLOCKPARALLELTREE) && defined(PTHREADCOARSEBLOCKS)\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> v" + pass + "(root, sched, numThreads);\n" +
				"#elif defined(TBBBLOCKPARALLELTREE) || defined(TBBBLOCKPARALLELTREEOPT) || defined(TBBBLOCKPARALLELTREECONT) || defined(TBBGRAPHSOLVER)\n" +
				"  //no setup\n" +
				"#elif defined(BLOCKPARALLELTREE) || defined(PREALLOCATETREE)\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> v" + pass + "(root, treeSize);\n" +
				"#elif defined(VECTORLAYOUT)\n" +
				"  WSPipelineSynthesize<visit_" + pass + ", " + traversal + "> v" + pass + "(root, q);\n" +
				"#else\n" +
				"  ??\n" +
				"#endif\n";
			lockC++;
		} else {
			throw new InvalidGrammarException("Unknown stencil type: " + stencil);
		}
		pass++;		
		
	}			
	return res;
}

public String printCurrentPipelineDelayedBuild (Hashtable<Variable, Term> binding) throws InvalidGrammarException {
	String res = "";
	int pass = 0;
	int lockC = 0;
	//FIXME fuse inh/syn
	for (Term visit : binding.get("P").toTermArray()) {
		//System.err.println(visit.toString());
		String stencil = visit.arg(2).arg(1).toString();
		String traversal = (lockC + 1) % 2 == 0 ? "false" : "true";
		if (stencil.equals("tdLtrU")) {
			System.out.println("Pass " + pass + ": inorder");
			//res += "  WSPiplineInorder<visit_" + pass + "> v" + pass + "(root);\n";
			res += "  //no setup for inorder visit " + pass + "\n";
		} else if (stencil.equals("td")) {
			System.out.println("Pass " + pass + ": td");
			res += 
				"#ifdef PTHREADWSBLOCKS\n" +
				"  v" + pass + " = new WSPipelineInherit<visit_" + pass + ", " + traversal + ">(root, sb, steals);\n" +
				"#elif defined(BLOCKPARALLELTREE) && defined(PTHREADBLOCKS)\n" +
				"  v" + pass + " = new WSPipelineInherit<visit_" + pass + ", " + traversal + ">(root, sb);\n" +
				"#elif defined(BLOCKPARALLELTREE) && defined(PTHREADCOARSEBLOCKS)\n" +
				"  v" + pass + " = new WSPipelineInherit<visit_" + pass + ", " + traversal + ">(root, sched, numThreads);\n" +
				"#elif defined(TBBBLOCKPARALLELTREE) || defined(TBBBLOCKPARALLELTREEOPT) || defined(TBBBLOCKPARALLELTREECONT) || defined(TBBGRAPHSOLVER)\n" +
				"  //no setup\n" +
				"#elif defined(BLOCKPARALLELTREE) || defined(PREALLOCATETREE)\n" +
				"  v" + pass + " = new WSPipelineInherit<visit_" + pass + ", " + traversal + ">(root, treeSize);\n" +
				"#elif defined(VECTORLAYOUT)\n" +
				"  v" + pass + " = new WSPipelineInherit<visit_" + pass + ", " + traversal + ">(root, q);\n" +
				"#else\n" +
				"  ??\n" +
				"#endif\n";
			lockC++;
		} else if (stencil.equals("bu")) {
			System.out.println("Pass " + pass + ": bu");
			res += 
				"#ifdef PTHREADWSBLOCKS\n" +
				"  v" + pass + " = new WSPipelineSynthesize<visit_" + pass + ", " + traversal + ">(root, sb, steals);\n" +
				"#elif defined(BLOCKPARALLELTREE) && defined(PTHREADBLOCKS)\n" +
				"  v" + pass + " = new WSPipelineSynthesize<visit_" + pass + ", " + traversal + ">(root, sb);\n" +
				"#elif defined(BLOCKPARALLELTREE) && defined(PTHREADCOARSEBLOCKS)\n" +
				"  v" + pass + " = new WSPipelineSynthesize<visit_" + pass + ", " + traversal + ">(root, sched, numThreads);\n" +
				"#elif defined(TBBBLOCKPARALLELTREE) || defined(TBBBLOCKPARALLELTREEOPT) || defined(TBBBLOCKPARALLELTREECONT) || defined(TBBGRAPHSOLVER)\n" +
				"  //no setup\n" +
				"#elif defined(BLOCKPARALLELTREE) || defined(PREALLOCATETREE)\n" +
				"  v" + pass + " = new WSPipelineSynthesize<visit_" + pass + ", " + traversal + ">(root, treeSize);\n" +
				"#elif defined(VECTORLAYOUT)\n" +
				"  v" + pass + " = new WSPipelineSynthesize<visit_" + pass + ", " + traversal + ">(root, q);\n" +
				"#else\n" +
				"  ??\n" +
				"#endif\n";
			lockC++;
		} else if (stencil.equals("buSubInorder")) {
			System.out.println("Pass " + pass + ": buSubInorder");
			res += 
				"#ifdef PTHREADWSBLOCKS\n" +
				"  v" + pass + " = new WSPipelineSynthesize<visit_" + pass + ", " + traversal + ">(root, sb, steals);\n" +
				"#elif defined(BLOCKPARALLELTREE) && defined(PTHREADBLOCKS)\n" +
				"  v" + pass + " = new WSPipelineSynthesize<visit_" + pass + ", " + traversal + ">(root, sb);\n" +
				"#elif defined(BLOCKPARALLELTREE) && defined(PTHREADCOARSEBLOCKS)\n" +
				"  v" + pass + " = new WSPipelineSynthesize<visit_" + pass + ", " + traversal + ">(root, sched, numThreads);\n" +
				"#elif defined(TBBBLOCKPARALLELTREE) || defined(TBBBLOCKPARALLELTREEOPT) || defined(TBBBLOCKPARALLELTREECONT) || defined(TBBGRAPHSOLVER)\n" +
				"  //no setup\n" +
				"#elif defined(BLOCKPARALLELTREE) || defined(PREALLOCATETREE)\n" +
				"  v" + pass + " = new WSPipelineSynthesize<visit_" + pass + ", " + traversal + ">(root, treeSize);\n" +
				"#elif defined(VECTORLAYOUT)\n" +
				"  v" + pass + " = new WSPipelineSynthesize<visit_" + pass + ", " + traversal + ">(root, q);\n" +
				"#else\n" +
				"  ??\n" +
				"#endif\n";
			lockC++;
		} else {
			throw new InvalidGrammarException("Unknown stencil type: " + stencil);
		}
		pass++;
		
	}			
	return res;
}

///////////////////////////////////////////////////////////////////////////////
// Visitors generator methods
///////////////////////////////////////////////////////////////////////////////

  
public void generateParseFiles(ALEParser ast, Schedule sched, String browserPath, boolean verbose, String functionHeadersRaw) throws InvalidGrammarException {
	//grammar.generateFiles(outputDir, verbose);
	//CSS parser
	
    final String fileName = "extradatahandler";
    final String exprName = "aleactions";
    
    String functionHeaders =
    	"#include \"ftlstdlib.h\"\n" +
    	"#include \"" + fileName + ".h\"\n" + functionHeadersRaw;
    	
    try {
    	FileWriter headerWriter = new FileWriter(new File(browserPath + File.separator + fileName +".h"));
    	headerWriter.write(CppParserGenerator.header(ast));
    	headerWriter.close();
    	if (verbose) {
    		System.out.println("=== PARSER HEADER ===\n" + CppParserGenerator.header(ast));
    	}
    } catch (IOException e) {
    	System.out.println("Failure to generate parser header: " + e.toString());
    	System.exit(1);
    }

    try {
    	FileWriter cppWriter = new FileWriter(new File (browserPath + File.separator + fileName + ".cpp"));
    	cppWriter.write(CppParserGenerator.body(ast));
    	cppWriter.close();
    	if (verbose) {
    		System.out.println("=== PARSER BODY ===\n" + CppParserGenerator.body(ast));
    	}
    } catch (IOException e) {
    	System.out.println("Failure to generate parser body: " + e.toString());
    	System.exit(1);
    }
    
    try {
    	FileWriter propWriter = new FileWriter(new File (browserPath + File.separator + fileName + ".properties"));
    	propWriter.write(CppParserGenerator.properties(ast.classes, ast.interfaces));
    	propWriter.close();
    	if (verbose) {
    		System.out.println("=== PROPERTIES ===\n" + CppParserGenerator.properties(ast.classes, ast.interfaces));
    	}
    } catch (IOException e) {
    	System.out.println("Failure to generate parser properties file: " + e.toString());
    	System.exit(1);        	
    }

    
    System.out.println("Generated parser extensions at " + browserPath + File.separator  + fileName + ".(h, cpp, properties)");
//ALEG
    
    try {
    	FileWriter exprWriter = new FileWriter(new File (browserPath + File.separator + exprName + ".h"));
    	exprWriter.write(functionHeaders);
    	exprWriter.close();
    	if (verbose) {
    		System.out.println("=== FUNCS ===\n" + functionHeaders);
    	}
    } catch (IOException e) {
    	System.out.println("Failure to generate expression (semantic actions) file: " + e.toString());
    	System.exit(1);        	
    }
    
    System.out.println("Generated expression semantic actions at " + browserPath + File.separator + exprName + ".h");
}

public String preVisits (AGEvaluator aleg, Schedule sched) {
	String visitPre =
		"#include \"constants.h\"\n" +
		"#ifdef EXTRA_DATA\n\n" + 
        "#include \"predefinedactions.h\"\n" +			
		"#include \"visitors.h\"\n" +
		"#include \"extradatahandler.h\"\n" +
		"#include \"aleactions.h\"\n" +
		"#include \"sss.h\"\n" +
		"#include \"sssmacros.h\"\n\n"; 
	
	String visitHelpers = "";
	for (AGEval.Class c : aleg.classes)
		visitHelpers += CppGenerator.assignAliases(c, sched._ast);

	
	visitHelpers += 
		"bool isInorder(SNode *node, int pass) {\n" +
		"  switch (pass) {\n";
	for (int i = 0; i < sched.buSubInorderBuIn.size(); i++) {
		visitHelpers  += "    case " + i + ":\n";
		HashSet<AGEval.Class>bus = sched.buSubInorderBus.get(i);
		if (bus == null) {
			visitHelpers += "#ifdef DEBUGY\n  cout << \" Did not expect inorder call for pass " + i + " \" << endl;\n#endif //DEBUGY\n";	
		} else {
			HashSet<AGEval.Class> ios = new HashSet<AGEval.Class>(aleg.classes);
			ios.removeAll(bus);
			visitHelpers  += "      switch (node->data.parseData.display) {\n";				
			for (AGEval.Class cls : ios)
				visitHelpers  += "        case ExtraDataHandler::TOK_" + cls.getName().toUpperCase() +": return true; \n";				
			visitHelpers  += "        default: return false;\n";
			visitHelpers  += "      }\n";
		}
	}
	visitHelpers  += "    default: \n";
	visitHelpers += "#ifdef DEBUGY\n    cout << \" Unknown pass \" << pass << endl;\n#endif //DEBUGY\n";	
	visitHelpers += "    return false;\n";
	visitHelpers  += "  }\n";
	visitHelpers  += "}\n";

	
	return visitPre + visitHelpers; 
}

public String postVisits (AGEvaluator aleg, Schedule sched) {
	return visitDispatchers(sched.numVisits(), aleg, sched.buSubInorderBuIn, sched.buSubInorderBus) + "\n#endif //EXTRA_DATA\n";	
}

public static String visitorFile ="visitors";
//final String dataFile = "unions";
public static String pipelineFile = "sequence";


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


@Override
public String rhsToVal(String lhs, Class cls, ALEParser ast) throws InvalidGrammarException {	
	boolean isParent;
	boolean isParseData;
	String child;
	String prop;
	if (lhs.split("@").length == 2) {
		child = lhs.split("@")[0];
		isParent = child.equals("self");
		prop = lhs.split("@")[1];	  		
//		if (prop.contains("$") && child.equals("self")) {
//			System.err.println("CppGen: Cannot use intra-reduction accessors (self$$, ...), caught on use " + child + " in " + lhs);
//			//throw new InvalidGrammarException("Cannot use intra-reduction accessors (self$$, ...), caught on use " + child + " in " + lhs);
//		}
	} else {
  		if (ast.types.get("displayType").contains(lhs.toLowerCase())) return "ExtraDataHandler::TOK_" + lhs.toUpperCase();  		
		child = "self";
		isParent = true;
		prop = lhs;
	}
	
	String cleanProp = prop.replace("$-", "").replace("$$", "").replace("$i", "").toLowerCase();
	
	try {
		//String checkProp = prop.replace("$i", "");
		ExtendedVertex v = Generator.extendedGet(ast, cls, lhs.replace("$-", "").replace("$$", "").replace("$i", ""));
  		isParseData = v.isInput;
  	} catch (InvalidGrammarException e) {
  		isParseData = false;
//  		String checkProp = prop.replace("$i", "");		
//  		System.err.println("failed rhs parse data on " + lhs + " (checkProp: " + checkProp + ")");
  	} catch (NullPointerException e) {
  		System.err.println("rhsToVal null pointer on " + cls.getName() + "::" + lhs);
  		e.printStackTrace();
  		throw e;
  	}

  	if (prop.contains("$$")) {
  		if (isParent) {
	  		return "computeData.classData.Sub" + cls.getName() + "." + cleanProp;		  			
  		} else if (Generator.childrenContains(ast.extendedClasses.get(cls).multiChildren.keySet(), child)) {
	  		return "computeData.classData.Sub" + cls.getName() + "." + child.toLowerCase() + "_" + cleanProp + "_last";		  			
  		} else {
  			throw new InvalidGrammarException("Cannot access $$ attrib of a non-multi child / self reduction: " + lhs);	
  		}
  	} else if (prop.contains("$i")) {
  		//throw new InvalidGrammarException("$i not handled in C++ backend yet");
  		//System.err.println("$i not handled in C++ backend yet");
  		if (isParent) {
  			throw new InvalidGrammarException("Cannot access $i of self attrib: " + lhs);
  			//return "computeData.classData.Sub" + cls.getName() + "." + cleanProp; 		
  		} else if (Generator.childrenContains(ast.extendedClasses.get(cls).multiChildren.keySet(), child)) {
  			if (isParseData) {  				
  				if (cleanProp.equals("display")) return "loopChild->data.parseData.display";
  				else return "loopChild->data.parseData.genData.extraParse" + cls.getChildByName(child).getName() + ".fld_" + cleanProp;
  			} 
  			else return "loopChild->data.computeData.classData.Sub" + cls.getChildByName(child) + "." + cleanProp;  			
  		} else {
  			throw new InvalidGrammarException("Cannot access $i attrib of a non-multi child: " + lhs);
  			//return "parseFloat(getChildByRefName(node,\"" + child + "\").getAttribute(\"" + cleanProp + "\"))";	
  		}		  		
  	} else if (prop.contains("$-")) {
  		if (isParent) {
  			//by definition, cannot be parse data (for now..)
  			//FIXME check sink is scheduled in same loop
  			return "computeData.classData.Sub" + cls.getName() + "." + cleanProp;
  		} else if (Generator.childrenContains(ast.extendedClasses.get(cls).multiChildren.keySet(), child)) {
  			String init = "computeData.classData.Sub" + cls.getName() + "." + child.toLowerCase() + "_" + cleanProp + "_init";
  			String step = "(PREV())->data.computeData.classData.Sub" + cls.getChildByName(child) + "." + cleanProp;
  			return "(STEP() == 1 ? (" + init + ") : (" + step + "))";
  			//return "(PREV())->data.computeData.classData.Sub" + cls.getChildByName(child) + "." + cleanProp;
  			//return " parseFloat((i == 0 ? node.getAttribute(\"" + child.toLowerCase() + "_" + cleanProp + "_init\")" + " : children[i-1].getAttribute(\"" + cleanProp + "\")))";
  		} else {
  			throw new InvalidGrammarException("Cannot access $- attrib of a non-multi child: " + lhs);
  			//by definition, cannot be parse data (for now..)
//  			System.err.println("check cpp prev child iter name"); //FIXME
//  			String init = "computeData.classData.Sub" + cls.getName() + "." + cleanProp + "_init";
//  			String cur = "(loopChild - 1)->data.computeData.classData.Sub" + cls.getChildByName(child) + "." + cleanProp;
//  			return "(i == 0 ? " + init + " : " + cur + ")";
  		}
  	} else {
  		if (isParent) {
  			if (isParseData && cleanProp.equals("display")) return "parseData.display"; 
  			else if (isParseData) return "parseData.genData.extraParse" + cls.getName() + "." + (isParseData ? "fld_" : "") + cleanProp;
  			else return  "computeData.classData.Sub" + cls.getName() + "." + (isParseData ? "fld_" : "") + cleanProp;
  			
  		} else if (ast.extendedClasses.get(cls).multiChildren.containsKey(child)) {
//  			throw new InvalidGrammarException("Cannot read multichild attrib without indexer ($-, ...): " + lhs);
  			//FIXME currently allowed because logging might read back on "loop ... { ... child.x := ... }"
  			if (isParseData && cleanProp.equals("display")) return "loopChild->data.parseData.display";
  			if (isParseData) return "loopChild->data.parseData.genData.extraParse" + cls.getChildByName(child).getName() + ".fld_" + cleanProp;
  			else return "loopChild->data.computeData.classData.Sub" + cls.getChildByName(child) + "." + cleanProp;  			
		} else {
			String base =
				"\n#if defined(VERYSMALLTREEPOINTERS)\n" +
		  		"(&s + s.distanceToLeftmostChild + computeData.classData.Sub" + cls.getName() + ".child_" + child + ")\n" +
	  			"#elif defined(SMALLTREEPOINTERS)\n" +
		  		"(s.leftmostChild + computeData.classData.Sub" + cls.getName() + ".child_" + child + ")\n" +
	  			"#else\n" +
		  		"(computeData.classData.Sub" + cls.getName() + ".child_" + child + ")\n" +
	  			"#endif // ptrs\n";
			
  			if (isParseData && cleanProp.equals("display")) return base + "->data.parseData.display";
  			else if (isParseData) return base + "->data.parseData.genData.extraParse" + cls.getChildByName(child).getName() + ".fld_" + cleanProp;
			else return base + "->data.computeData.classData.Sub" + cls.getChildByName(child) + "." + cleanProp;
  		}
  	}


}

public String logStmt(int indentSrc, int indentOut, String msg, String rhs) {
	String res = "#ifdef DEBUGY\n";
	for (int i = 0; i < indentSrc; i++) res += " ";
	String space = "";
	for (int i = 0; i < indentOut; i++) space += " ";
	res += "cout << \"" + space +  msg + ": \" << " + rhs + " << endl;\n"; 
	return res + "#endif //DEBUGY\n";
}
public String logStmtVar(int indentSrc, int indentOut, String msg, ALEParser ast, AGEval.Class cls, String rhs, String rhsAddress) throws InvalidGrammarException {
	ExtendedVertex v = Generator.lookupAttributeExtended(rhs, cls, ast);
	if (v == null) throw new InvalidGrammarException("logStmtVar cpp: could not find " + cls.getName() + "::" + rhs);
	boolean isMaybe = v.isMaybeType;
	boolean isString = v.strType.equals("string");

	String indent = "";
	for (int i = 0; i < indentSrc; i++) indent += " ";
	String space = "";
	for (int i = 0; i < indentOut; i++) space += " ";

	String res = "#ifdef DEBUGY\n";
	if (!isMaybe && isString) {
		 res +=
			 indent + "if (" + rhsAddress + " == NULL) {\n" +
			 indent + "  cout << \"" + space + msg + ": NULL\" << endl;\n" +
			 indent + "} else {\n" +
			 indent + "  cout << \"" + space +  msg + ": \" << " + rhsAddress + " << endl;\n" +
			 indent + "}\n";		 		
	} else res += "cout << \"" + space +  msg + ": \" << " + rhsAddress + " << endl;\n";
	return res + "#endif //DEBUGY\n";
}

public String functionHeader (ALEParser.Assignment assign, ALEParser ast) throws InvalidGrammarException {
	String fName = assign._class.getName().toLowerCase() + "_" + assign._sink.replace('.','_').replace('@','_');
	String params = "(";
	
	boolean isFirst = true;
	for (String arg : assign._variables.keySet()) {
		if (!isFirst) { 
			params += ", ";
		}
		else isFirst = false;
		String rawT = typeStringToCppType(Generator.extendedGet(ast, assign._class, arg).strType);
		ALEParser.ExtendedVertex ev = Generator.lookupAttributeExtended(arg, assign._class, ast);		
		params += (ev != null && ev.isMaybeType ? ("maybeT<" + rawT + ">") : rawT) + " " + assign._variables.get(arg);				
	}
	
	params += ")";
	
	return "static " + typeStringToCppType(Generator.extendedGet(ast, assign._class, assign._sink).strType) +
		" " + fName + " " + params + " { return " + assign._indexedBody + "; }\n";
}

public String openChildLoop(AGEval.Class parent_class, String loopVar, ALEParser ast) {
	return "  SFORLOOPALIAS(loopChild, s, ExtraDataHandler::TOK_" + loopVar.toUpperCase() + ", step) {\n";	  
}


public String closeChildLoop() {
	return "  } SFORLOOPALIASEND();";
}

public String openLastChild(AGEval.Class cls, String loopVar) {
	return "    if (step == s.data.computeData.classData.Sub" + cls.getName() + ".child_" + loopVar.toLowerCase() + "_count) {\n"; 
}

public String closeLastChild() {
	return
	    "      break;\n" +
		"    }\n";
}

public String childrenRecur	(Class cls, String childName, int visitNum, ALEParser ast) {	
	return 
		//"  SFORLOOP(child, s) {\n" +
		//"    visit_" + visitNum + "(VISITARGS(*child, root, &s)); //recur\n" +
		//"  } SFORLOOPEND(child, s);\n";
		"    visit_" + visitNum + "(false, VISITARGS(*loopChild, root, &s)); //recur\n";
}

public String childRecur(AGEval.Class cls, String childName, int visitNum) {
	
	String childLoc = 
		"{\n\n#if defined(VERYSMALLTREEPOINTERS)\n" +
  		"SNode *child" + visitNum + " = (&s + s.distanceToLeftmostChild + computeData.classData.Sub" + cls.getName() + ".child_" + childName + ");\n" +
			"#elif defined(SMALLTREEPOINTERS)\n" +
  		"SNode *child" + visitNum + " = (s.leftmostChild + computeData.classData.Sub" + cls.getName() + ".child_" + childName + ");\n" +
			"#else\n" +
  		"SNode *child" + visitNum + " = (computeData.classData.Sub" + cls.getName() + ".child_" + childName + ");\n" +
			"#endif // ptrs\n";
	return childLoc + "visit_" + visitNum + "(false, VISITARGS(*child" + visitNum + ", root, &s)); //recur\n}\n";
	//String childLoc = "*(&s + s.distanceToLeftmostChild + computeData.classData.Sub" + cls.getName() + ".child_" + childName + ")";
	//return "visit_" + visitNum + "(VISITARGS(" + childLoc + ", root, &s)); //recur\n";					
}

public String visitHeader(Class cls, int visitNum, ALEParser ast) throws InvalidGrammarException {
	String res = "";
	
	String preamble = 
		"  EXTRA_DATA_PARSE &parseData = s.data.parseData; \n" +
		"  EXTRA_DATA_COMPUTE &computeData = s.data.computeData;\n" +
		"  \n";
	
	String classPreamble = "#ifdef DEBUGY\n  cout << \"  "  + visitNum + " visit (" + cls.getName() + ")\" << endl;\n#endif //DEBUGY\n";
	//String classPreamble = "#ifdef DEBUGY\n  cout << \"  visit " + cls.getName() + " id: \" << s.data.parseData.id << endl;\n#endif DEBUGY //DEBUGGY\n";
	res += "bool visit_" + cls.getName().toLowerCase() + "_" + visitNum + "(VISITPARAMS) {\n" + classPreamble + preamble;

	if (visitNum == 0) {
		//set aliases and initialize nullaries
			String assignAliases = "  assignAliases_" + cls.getName() + "(VISITARGS(s, root, SPARENT));\n";
			res += assignAliases;
			/*
			for (Function f : cls.getFunctions()) {
				if (f.getSources().length == 0) {
					String call = "  ";// + cls.getName().toLowerCase();
					String lhs = lhsToAddress(f.myDest, cls, ast);
					call += lhs + " = " + f.getName() + "();\n";
					res += call;
				}
			}
			*/
	}		
	
	return res;
}

public String visitFooter(Class cls, int visitNum, ALEParser ast) throws InvalidGrammarException {
 String res = "#ifdef DEBUGY\n  cout << \"    (leaving "  + visitNum + " visit " + cls.getName() + ")\" << endl;\n#endif //DEBUGY\n";
 res += "  return true;\n}\n";
 return res;
}


public static void synthesizeCpp(String alePath, String outputDir, String resourceDir, boolean verbose, boolean isFixedChildOrder, boolean useFirstParallel, boolean isExhaustive, int maxLen, GeneratorI generator) throws Exception {
	System.err.println("Setup for CPP build: ");
	System.err.println("  Grammar: " + alePath);
	System.err.println("  Return first found: " + useFirstParallel);
	System.err.println("  Fixed child orders (lexical): " + isFixedChildOrder);
	System.err.println("  Include non-greedy schedules: " + isExhaustive);
	System.err.println("  Max number of visits: " + maxLen);
	System.err.println("  Algorithm: " + resourceDir);
	System.err.println("  Output dest: " + outputDir);
	System.err.println("  Chain loops: " + AGEvaluatorSwipl.chainLoops);
	if (useFirstParallel)
		generator.synthesize(alePath, outputDir, resourceDir, verbose, isFixedChildOrder, isExhaustive, maxLen, false);
	else 
		generator.synthesizeAll(alePath, outputDir, resourceDir, verbose, isFixedChildOrder, isExhaustive, maxLen, false);
}


public static void main(String[] args) throws Exception {
	if (args.length == 7) {
		synthesizeCpp(args[1], args[2], args[0], false, new Boolean(args[3]).booleanValue(), new Boolean(args[4]).booleanValue(), new Boolean(args[5]).booleanValue(), new Integer(args[6]).intValue(),
				AGEvaluatorSwipl.chainLoops ? new AbstractGenerator(new CppGenerator()) : new Generator(new CppGenerator()));
	} else {	
		System.err.println("Arg 0: resource dir (where to fine algorithm.pl");
		System.err.println("Arg 1: grammar path");
		System.err.println("Arg 2: output path");
		System.err.println("Arg 3: allow all child orderings?");
		System.err.println("Arg 4: use first parallel (vs. /variants subdirs)");
		System.err.println("Arg 5: exhaustive or greedy (first prefix)?");
		System.err.println("Arg 6: max length of traversal sequence");
		throw new Exception("Wrong number of arguments");
	}


}

public String output(String baseName, String visitOut, String visitDispatches, String outputDir, boolean write,
		boolean verbose, ALEParser ast, Schedule sched, String fHeaders, Hashtable<Variable, Term> binding, AGEvaluator aleg)
		throws IOException, InvalidGrammarException {

	if (write) {
		AGEvaluatorSwipl.writeFile(outputDir + File.separator + visitorFile + ".cpp", visitOut);
		AGEvaluatorSwipl.writeFile(outputDir + File.separator + visitorFile + ".h", CppGenerator.classesHeader(ast, sched.numVisits(), sched));
		
		//construct and call immediately
		AGEvaluatorSwipl.writeFile(outputDir + File.separator + pipelineFile + ".cpp.construct", printCurrentPipelineBuild(sched.binding));
		AGEvaluatorSwipl.writeFile(outputDir + File.separator + pipelineFile + ".cpp.call", printCurrentPipelineBatch(sched));

		//delayed
		AGEvaluatorSwipl.writeFile(outputDir + File.separator + pipelineFile + ".cpp.headers", printCurrentPipelineHeaders(sched.binding));
		AGEvaluatorSwipl.writeFile(outputDir + File.separator + pipelineFile + ".cpp.delayedConstruct", printCurrentPipelineDelayedBuild(sched.binding));
		AGEvaluatorSwipl.writeFile(outputDir + File.separator + pipelineFile + ".cpp.delayedCall", printCurrentPipelineDelayedBatch(sched));
		
	}
	if (verbose) {
		//System.out.println("=== PIPELINE: === \n" + schedule2.printCurrentPipelineBuild());
		System.out.println("=== HELPERS: === \n" + CppGenerator.classesHeader(ast, sched.numVisits(), sched));
		System.out.println("=== VISITS ===: \n" + visitOut);			
	}
	return "(no CPP out)"; //TODO
}

public String asgnE(String lhs, String rhs) { return lhs + " = " + rhs; }
public String asgnS(String lhs, String rhs) { return asgnE(lhs, rhs) + ";\n"; }

}
