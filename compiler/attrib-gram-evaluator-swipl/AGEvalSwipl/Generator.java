package AGEvalSwipl;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Map.Entry;
import java.util.Vector;

import jpl.Term;
import jpl.Variable;
import AGEval.AGEvaluator;
import AGEval.Function;
import AGEval.InvalidGrammarException;
import AGEvalSwipl.AGEvaluatorSwipl.Schedule;
import aleGrammar.ALEParser;
import aleGrammar.AleFrontend;
import aleGrammar.ALEParser.ExtendedClass;

//FIXME: @deprecated (this vs. abstractgenerator?)
public class Generator implements GeneratorI {

	public final boolean debug = true;
	
	private final Backend backend;
	public Generator (Backend backend_) {
		backend = backend_;
	}
	
	/*
	public static Vertex lookupAttribute(String lhsRaw, AGEval.Class cls) throws InvalidGrammarException {
		String lhs = lhsRaw.replace("$$", "").replace("$-", "").replace("$i", "");
		return lhs.split("@").length == 2 ? 
				(lhs.split("@")[0].equals("self") ? cls.findVertexByExtName(lhs.split("@")[1])						
				 : cls.getChildByName(lhs.split("@")[0]).findVertexByExtName(lhs.split("@")[1]))
				: cls.findVertexByExtName(lhs);					
	}
	*/
	
	public static AGEval.IFace getIFaceByEc(ALEParser ast, ExtendedClass ec) throws InvalidGrammarException {
		for (Entry<AGEval.IFace, ExtendedClass> e : ast.extendedClasses.entrySet())
			if (e.getValue() == ec) return e.getKey();
		throw new InvalidGrammarException("Cannot find name for ec");
	}
	public static ALEParser.ExtendedVertex extendedGet(ALEParser ast, AGEval.IFace clsRaw, String prop) throws InvalidGrammarException {
		String uProp = AGEvaluatorSwipl.attribName(prop).toLowerCase().replace("$$", "").replace("$-", "").replace("$i", "");
		//AGEval.IFace cls;
		String base = AGEvaluatorSwipl.attribBase(prop);
		ExtendedClass ec;
		if (base.equals("self")) {
			//cls = clsRaw;
			ec = ast.extendedClasses.get(clsRaw);
		} else {
			if (clsRaw instanceof AGEval.Class) {
				AGEval.Class clsC = (AGEval.Class) clsRaw;
				if (clsC.hasChildName(base)) { //singleton
					ec = ast.extendedClasses.get(clsC.getChildByName(base).getInterface());
				} else { //multichild
					ec = ast.extendedClasses.get(ast.interfaceTable.get(ast.extendedClasses.get(clsRaw).multiChildren.get(base)));					
				}
			} else {
				ec = ast.extendedClasses.get(clsRaw);
			}			
		}
		
		for (Entry<String, ALEParser.ExtendedVertex> e : ec.extendedVertices.entrySet())
			if (e.getKey().toLowerCase().equals(uProp)) return e.getValue();		
		
		AGEval.IFace cls = getIFaceByEc(ast, ec);
		if (cls instanceof AGEval.Class) return extendedGet(ast, cls.getInterface(), uProp); //retry on interface
		throw new InvalidGrammarException("Extended get on class fail: " + clsRaw.getName() + " (ec: " + cls.getName() + ") for " + prop);
		/*
		AGEval.IFace iface = cls.getInterface();
		if (iface == cls || iface == null) throw new InvalidGrammarException("Extended get on interface fail: " + cls.getName() + " for " + prop);		
		else
			for (Entry<String, ALEParser.ExtendedVertex> e : ast.extendedClasses.get(iface).extendedVertices.entrySet())
				if (e.getKey().toLowerCase().equals(uProp)) return e.getValue();		
		
		*/	
	}
	
	public static AGEval.IFace lookupChildGeneral(AGEval.Class cls, String child) throws InvalidGrammarException {
		AGEval.IFace res = cls.getChildByName(child);
		if (res != null) return res;
		else {
			for (Entry<String, AGEval.IFace> e: cls.getChildMappings().entrySet()) {
				if (e.getKey().toLowerCase().equals(child)) {
					if (e.getValue() != null) return e.getValue();
					else throw new InvalidGrammarException("Looked up null child: " + cls.getName() + "'s " + child);					
				}
			}
		}
		throw new InvalidGrammarException("Cannot find child " + child + " of " + cls.getName());
		
	}
	
	public static ALEParser.ExtendedVertex lookupAttributeExtended(String lhsRaw, AGEval.Class cls, ALEParser ast) throws InvalidGrammarException {
		String lhs = lhsRaw.toLowerCase().replace("$$", "").replace("$-", "").replace("$i", "").replace("_init", "").replace("_last", "").replace("_step", "");
		String rhsRaw = AGEvaluatorSwipl.attribName(lhs);
		String node;
		String prop;
		if (lhs.split("_").length == 2) { //child_prop or self@child_prop
			node = AGEvaluatorSwipl.attribName(lhsRaw).split("_")[0];
			prop = lhsRaw.split("_")[1];
		} else {
			node = AGEvaluatorSwipl.attribBase(lhs);
			prop = rhsRaw;
		}
		try {
			return extendedGet(ast, node.equals("self") ? cls : lookupChildGeneral(cls, node), prop);
		} catch (InvalidGrammarException e) {
			e.printStackTrace();
			throw new InvalidGrammarException("Bad lookupAttributeExtended: " + lhsRaw + " in class/interface " + cls.getName() + "\n" + e.getMessage());
		}
		
	}

	
	public HashMap<String, String> genExprPrinter(AGEvaluator aleg, HashMap<AGEval.Class, ArrayList<ALEParser.Cond>> conds, Schedule sched) throws InvalidGrammarException {
		HashMap<String, String> exprPrinter = new HashMap<String, String>();
		for (AGEval.Class cls : aleg.classes) {
			for (Function f : cls.getFunctions()) {
				String printArgs = "";
				for (String src : f.getStringSrcs())
					printArgs += backend.logStmtVar(2, 8, src.toString(), sched._ast, cls, src, backend.rhsToVal(src, cls, sched._ast)); 
				String printer = "";
				printer += backend.logStmtVar(2, 4, f.getName(), sched._ast, cls, f.myDest, backend.rhsToVal(f.myDest, cls, sched._ast));				
				exprPrinter.put(f.getName().toLowerCase(), printer + printArgs);
			}
		}
					
		for (ALEParser.Assignment asgn : sched._ast.assignments) {
			if (!"".equals(asgn.loopVar)) {
				AGEval.Class cls = asgn._class;
				String lhsRaw = asgn._sink;
				String lhs = lhsRaw.toLowerCase();
		   		boolean isParentAttrib = !lhsRaw.contains("@") || lhsRaw.split("@")[0].equals("self");
				////////
				if (asgn.isReduction) {
					//init
					String whoInit = cls.getName().toLowerCase() + "_" + lhsRaw.toLowerCase().replace("@", "_") + "_init";
					String initVar = isParentAttrib ? (lhsRaw + "_init") : ("self@" + AGEvaluatorSwipl.attribBase(lhsRaw) + "_" + AGEvaluatorSwipl.attribName(lhsRaw) + "_init");
					exprPrinter.put(whoInit, 
							backend.logStmtVar(
									0, 6, "init " + asgn._sink, sched._ast, cls, initVar,
									backend.rhsToVal(initVar, cls, sched._ast)));
					//last
					//String dupeLhs = backend.lhsToAddress((isParentAttrib ? AGEvaluatorSwipl.attribName(lhs) : (lhs.replace("@","_") + "_last")), cls, sched._ast);
					String dupe = isParentAttrib ? AGEvaluatorSwipl.attribName(lhs) : (lhs.replace("@","_") + "_last");
					exprPrinter.put(whoInit, 
							exprPrinter.get(whoInit)  + backend.logStmtVar(0, 4, "last init " + dupe, sched._ast, cls, dupe, backend.rhsToVal(dupe, cls, sched._ast)));
				}
				if (asgn._sink.contains("[-1]")) {
					String whoInit = cls.getName().toLowerCase() + "_" + lhsRaw.toLowerCase().replace("@", "_").replace("[-1]", "") + "_init";
					exprPrinter.put(whoInit, backend.logStmtVar(6, 9, "init " + lhsRaw, sched._ast, cls, lhsRaw, backend.rhsToVal(lhsRaw, cls, sched._ast)));
				} else {
					String whoStep = cls.getName().toLowerCase() + "_" + lhsRaw.toLowerCase().replace("@", "_") + "_step"; 
					exprPrinter.put(whoStep, backend.logStmtVar(6, 9, "step " + lhsRaw, sched._ast, cls, lhsRaw, backend.rhsToVal(lhsRaw, cls, sched._ast)));
				}
				if (asgn.isReduction) {
					String printVar = (isParentAttrib ? AGEvaluatorSwipl.attribName(lhs) : (lhs.replace("@","_"))) + "_last";
					exprPrinter.put(cls.getName().toLowerCase() + "_" + lhsRaw.toLowerCase().replace("@", "_") + "_last",
							backend.logStmtVar(0, 6, "last " + lhs, sched._ast, cls, printVar, backend.rhsToVal(printVar, cls, sched._ast)));

				}
			}
		}
		
		//NOTE: conds handled with exprToCall's invocation of addNestedConditionals
		
	    return exprPrinter;
	}
	
	
	public String nestedTernary(ALEParser.Case c, String lhs, AGEval.Class cls, Schedule sched) throws InvalidGrammarException {
		String res = ""; 
		if (!c.isElse) {		
			res += bindExpr(c.openBody, c.indexedVariables, cls, false, false, backend.toAcc(lhs, cls), sched);
			res += " ? ";
		} else {
			//res += " : ";
		}

		for (ALEParser.Assignment asgn : c.assignments) {
			if (asgn._sink.equals(lhs)) {
				res += "(" + bindExpr(asgn._indexedBody, asgn._variables, cls, false, false, backend.toAcc(lhs, cls), sched) + ")";
				return res + (c.isElse ? "" : ":");
			}
		}

		//not directly available, try from conds
		//FIXME only use cond that (recursively) covers lhs (should be exactly 1 -- verify?)
		for (ALEParser.Cond cnd : c.conditionals) {
			res += nestedTernary(cnd, lhs, cls, sched);
		}

		return res + (c.isElse ? "" : ":");
	}
		
	//navigate cases until got assignment
	public String nestedTernary(ALEParser.Cond c, String lhs, AGEval.Class cls, Schedule sched) throws InvalidGrammarException {
		String res = "(";
		res += nestedTernary(c.testCase, lhs, cls, sched);
		for (ALEParser.Case cs : c.elseifs) res += nestedTernary(cs, lhs, cls, sched);
		res += nestedTernary(c.elseCase, lhs, cls, sched);
		return res + ")";
	}

	
	public String nestedTernaryLoopStep(ALEParser.Case c, String lhsRaw, AGEval.Class cls, Schedule sched) throws InvalidGrammarException {
		  String res = ""; 
		  if (!c.isElse) {		
			  res += bindExpr(c.openBody, c.indexedVariables, cls, true, false, backend.toAcc(lhsRaw, cls), sched);
			  res += " ? ";
		  } else {
			//  res += " : ";
		  }
		  
		  for (ALEParser.Assignment asgn : c.assignments) {
			  if (asgn._sink.equals(lhsRaw)) {
				  return res += asgnLoopExpr(cls, asgn, lhsRaw, false, sched)  + (c.isElse ? "" : ":");
			  }
		  }
		  
		  for (ALEParser.Cond cnd : c.conditionals) {
			  res += nestedTernaryLoopStep(cnd, lhsRaw, cls, sched);
		  }
		  
		  return res  + (c.isElse ? "" : ":");
		}
		
		public String nestedTernaryLoopStep(ALEParser.Cond c, String lhsRaw, AGEval.Class cls, Schedule sched) throws InvalidGrammarException {
			String res = "(";
			res += nestedTernaryLoopStep(c.testCase, lhsRaw, cls, sched);
			for (ALEParser.Case cs : c.elseifs) res += nestedTernaryLoopStep(cs, lhsRaw, cls, sched);
			res += nestedTernaryLoopStep(c.elseCase, lhsRaw, cls, sched);
			return res + ")";
		}
		
	public String nestedTernaryLoopInit(ALEParser.Case c, String lhsRaw, AGEval.Class cls, Schedule sched) throws InvalidGrammarException {
		  String res = ""; 
		  if (!c.isElse) {		
			  //cppGen.checkInitable(sched.reductions, cls, c.indexedVariables, lhsRaw);
			  res += bindExpr(c.openBody, c.indexedVariables, cls, true, true, backend.toAcc(lhsRaw, cls), sched); 
			  res += " ? ";
		  } else {
			  //res += " : ";
		  }
		  
		  for (ALEParser.Assignment asgn : c.assignments) {
			  if (asgn._sink.equals(lhsRaw)) {
				  return res += asgnLoopExpr(cls, asgn, lhsRaw, true, sched) + (c.isElse ? "" : ":");
			  }
		  }
		  
		  for (ALEParser.Cond cnd : c.conditionals) {
			  res += nestedTernaryLoopInit(cnd, lhsRaw, cls, sched);
		  }
		  
		  return res + (c.isElse ? "" : ":");
		}
		
		public String nestedTernaryLoopInit(ALEParser.Cond c, String lhsRaw, AGEval.Class cls, Schedule sched) throws InvalidGrammarException {
			String res = "(";
			res += nestedTernaryLoopInit(c.testCase, lhsRaw, cls, sched);
			for (ALEParser.Case cs : c.elseifs) res += nestedTernaryLoopInit(cs, lhsRaw, cls, sched);
			res += nestedTernaryLoopInit(c.elseCase, lhsRaw, cls, sched);
			return res + ")";
		}
		
//	public static String bindExpr(String openBody, HashMap<String,String> indexedVariables, AGEval.Class cls) throws InvalidGrammarException {
	public String bindExpr(String openBody, HashMap<String,String> indexedVariables, AGEval.Class cls, boolean allowStep, boolean replaceStep, String acc, Schedule sched) throws InvalidGrammarException {		
		String res = backend.replaceTypeVals(openBody, sched._ast);
		for (Entry<String, String> e : indexedVariables.entrySet()) {
//			res = res.replaceAll(e.getValue() + " ", rhsToVal(e.getKey(), cls) + " ");
//			res = res.replaceAll(e.getValue() + "$", rhsToVal(e.getKey(), cls) + " ");
			if (!allowStep && (e.getKey().equals("$-") || e.getKey().contains("$i") || e.getKey().contains("$$"))) {
				throw new InvalidGrammarException("reduction variables ($ identifiers) must be in loop steps, error binding expression " 
						+ openBody + " with " + e.getKey() + " == " + e.getValue());
			}
			if (e.getKey().contains("$-")) {
				if (replaceStep) {
					//init
					throw new InvalidGrammarException("$acc must be in loop steps, error binding expression " 
							+ openBody + " with " + e.getKey() + " == " + e.getValue());
				} else {
					//step
					res = res.replaceAll(e.getValue() + " ", backend.rhsToVal(e.getKey(), cls, sched._ast) + " ");
					res = res.replaceAll(e.getValue() + ",", backend.rhsToVal(e.getKey(), cls, sched._ast) + ",");
					res = res.replaceAll(e.getValue() + "\\)", backend.rhsToVal(e.getKey(), cls, sched._ast)  + ")");					  
					res = res.replaceAll(e.getValue() + "$", backend.rhsToVal(e.getKey(), cls, sched._ast)  + " ");					  
				}
			} else if (e.getKey().contains("$i")) {		
				if (replaceStep) {
					//FIXME init $i => final 
					res = res.replaceAll(e.getValue() + " ", backend.rhsToVal(e.getKey(), cls, sched._ast).replace("$", "\\$")  + " ");
					res = res.replaceAll(e.getValue() + ",", backend.rhsToVal(e.getKey(), cls, sched._ast).replace("$", "\\$")  + ",");
					res = res.replaceAll(e.getValue() + "\\)", backend.rhsToVal(e.getKey(), cls, sched._ast).replace("$", "\\$")  + ")");
					res = res.replaceAll(e.getValue() + "$", backend.rhsToVal(e.getKey(), cls, sched._ast).replace("$", "\\$")  + " ");
					//FIXME data structure generation must provide (in case using more lax check than just isReduct...)
				} else {
					//step $i => child
					res = res.replaceAll(e.getValue() + " ", backend.rhsToVal(e.getKey(), cls, sched._ast).replace("$", "\\$")  + " ");
					res = res.replaceAll(e.getValue() + ",", backend.rhsToVal(e.getKey(), cls, sched._ast).replace("$", "\\$")  + ",");
					res = res.replaceAll(e.getValue() + "\\)", backend.rhsToVal(e.getKey(), cls, sched._ast).replace("$", "\\$")  + ")");					  
					res = res.replaceAll(e.getValue() + "$", backend.rhsToVal(e.getKey(), cls, sched._ast).replace("$", "\\$")  + " ");					  
				}
			} else {
				res = res.replaceAll(e.getValue() + " ", backend.rhsToVal(e.getKey(), cls, sched._ast).replace("$", "\\$")  + " ");
				res = res.replaceAll(e.getValue() + ",", backend.rhsToVal(e.getKey(), cls, sched._ast).replace("$", "\\$")  + ",");
				res = res.replaceAll(e.getValue() + "\\)", backend.rhsToVal(e.getKey(), cls, sched._ast).replace("$", "\\$")  + ")");
				res = res.replaceAll(e.getValue() + "$", backend.rhsToVal(e.getKey(), cls, sched._ast).replace("$", "\\$")  + " ");
			}			
		}
		return res;
	}
	
	
	public String asgnLoopExpr (AGEval.Class cls, ALEParser.Assignment asgn, String lhsRaw, boolean isInit, Schedule sched) throws InvalidGrammarException {
		String res = "";
		if (asgn.isReduction) {
			res += "(" + 
				bindExpr(
					isInit ? asgn.startBody : asgn.stepBody, 
					isInit ? asgn.startVariables : asgn.stepVariables, 
					cls, true, isInit, backend.toAcc(lhsRaw, cls), sched) + ")";
		} else {
			//if (sched.reductions.accessedAsLast.get(cls).contains(lhsRaw)) CppGenerator.checkInitable(sched.reductions, cls, asgn._variables, lhsRaw);			
			res += "(" + bindExpr(asgn._indexedBody, asgn._variables, cls, true, isInit, backend.toAcc(lhsRaw, cls), sched) + ")";
		}
		
		return res;
	}
	
	public void addAssign(String lhsRaw, AGEval.Class cls, AGEvaluatorSwipl.Schedule sched, boolean isReduction, 
			ALEParser.Assignment maybeAsgn, ALEParser.Cond maybeCond, HashMap<String, String> exprToCall) throws InvalidGrammarException {	
		  boolean isParentAttrib = !lhsRaw.contains("@") || lhsRaw.split("@")[0].equals("self");
		  String lhs = lhsRaw.toLowerCase();
		  if (isReduction) {
			  //init
			  String whoInit = cls.getName().toLowerCase() + "_" + lhsRaw.toLowerCase().replace("@", "_") + "_init";
			  String initLhs = backend.lhsToAddress(isParentAttrib ? (lhsRaw + "_init") : ("self@" + AGEvaluatorSwipl.attribBase(lhsRaw) + "_" + AGEvaluatorSwipl.attribName(lhsRaw) + "_init"), cls, sched._ast);
			  exprToCall.put(
					  whoInit,
					  backend.asgnE(initLhs, (maybeCond == null ? asgnLoopExpr(cls, maybeAsgn, lhsRaw, true, sched) 
							  : nestedTernaryLoopInit(maybeCond, lhsRaw, cls, sched))));
			  //last
			  String dupeLhs = backend.lhsToAddress((isParentAttrib ? AGEvaluatorSwipl.attribName(lhs) : (lhs.replace("@","_") + "_last")), cls, sched._ast);			        		
			  exprToCall.put(whoInit, exprToCall.get(whoInit) +
					  ";\n" 
					  + backend.asgnE(dupeLhs, 
							  backend.rhsToVal(isParentAttrib ? (lhsRaw + "_init") : ("self@" + AGEvaluatorSwipl.attribBase(lhsRaw) + "_" + AGEvaluatorSwipl.attribName(lhsRaw) + "_init"), cls, sched._ast)));

		  }
		  if (lhsRaw.contains("[-1]")) {
			  String whoInit = cls.getName().toLowerCase() + "_" + lhsRaw.toLowerCase().replace("@", "_").replace("[-1]","") + "_init";
			  String initLhs = backend.lhsToAddress(isParentAttrib ? (lhsRaw + "_init") : ("self@" + AGEvaluatorSwipl.attribBase(lhsRaw) + "_" + AGEvaluatorSwipl.attribName(lhsRaw).replace("[-1]","") + "_init"), cls, sched._ast);			  
			  exprToCall.put(
					  whoInit,
					  backend.asgnE(initLhs, (maybeCond == null ? asgnLoopExpr(cls, maybeAsgn, lhsRaw, true, sched) 
							  : nestedTernaryLoopInit(maybeCond, lhsRaw, cls, sched))));
		  } else {
			  String whoStep = cls.getName().toLowerCase() + "_" + lhsRaw.toLowerCase().replace("@", "_") + "_step"; 
			  exprToCall.put(whoStep, 
					  backend.asgnE(backend.lhsToAddress(lhsRaw, cls, sched._ast), (maybeCond == null ? asgnLoopExpr(cls, maybeAsgn, lhsRaw, false, sched) 
							  : nestedTernaryLoopStep(maybeCond, lhsRaw, cls, sched))));
		  }
		  if (isReduction) {
			  String dupeLhs = backend.lhsToAddress((isParentAttrib ? AGEvaluatorSwipl.attribName(lhs) : (lhs.replace("@","_"))) + "_last", cls, sched._ast);			        		
			  exprToCall.put(cls.getName().toLowerCase() + "_" + lhsRaw.toLowerCase().replace("@", "_") + "_last",
					  "      " + backend.asgnE(dupeLhs, backend.rhsToVal(lhsRaw, cls, sched._ast)));

		  }
	}
	
	public HashMap<String, String> genExprToCall(AGEvaluator aleg, HashMap<AGEval.Class, ArrayList<ALEParser.Cond>> conds, Schedule sched, HashMap<String, String> exprPrinter) throws InvalidGrammarException {
		HashMap<String, String> exprToCall = new HashMap<String, String>();
		for (AGEval.Class cls : aleg.classes) {
			for (Function f : cls.getFunctions()) {
				String lhs = backend.lhsToAddress(f.myDest, cls, sched._ast);
				String rhs = f.getName() + "(";
				boolean isFirst = true;
				for (String src : f.getStringSrcs()) {
					if (isFirst) isFirst = false;
					else rhs += ", ";
					rhs += backend.rhsToVal(src, cls, sched._ast);
				}
				rhs += ")";
				exprToCall.put(f.getName().toLowerCase(), backend.asgnE(lhs, rhs));
			}
		}
		for (ALEParser.Assignment asgn : sched._ast.assignments) {
			if (!"".equals(asgn.loopVar)) {
				addAssign(asgn._sink, asgn._class, sched, asgn.isReduction, asgn, null, exprToCall);
			}
		}
		addNestedConditionals(exprToCall, exprPrinter, conds, aleg, sched);
		return exprToCall;
	}
	
	public static void gatherVariables(ALEParser.Case c, HashSet<String> nonReductSinks, HashSet<String> reductSinks) {
		  for (ALEParser.Assignment asgn : c.assignments) {
			  if (asgn.isReduction) reductSinks.add(asgn._sink);
			  else nonReductSinks.add(asgn._sink);
		  }
		  for (ALEParser.Cond cnd : c.conditionals) {
			  gatherVariables(cnd, nonReductSinks, reductSinks);
		  }
		}
		public static void gatherVariables(ALEParser.Cond c, HashSet<String> nonReductSinks, HashSet<String> reductSinks) {
		  gatherVariables(c.testCase, nonReductSinks, reductSinks);
		  for (ALEParser.Case cs : c.elseifs) gatherVariables(cs, nonReductSinks, reductSinks);
		  gatherVariables(c.elseCase, nonReductSinks, reductSinks);
		}
		

	
	public void addNestedConditionals (
			HashMap<String, String> exprToCall, 
			HashMap<String, String> exprPrinter,
			HashMap<AGEval.Class, ArrayList<ALEParser.Cond>> conds, 
			AGEvaluator aleg,
			Schedule sched) throws InvalidGrammarException {			
		if (conds == null) return;		  
		for (AGEval.Class cls : aleg.classes) {
			if (conds.containsKey(cls)) {
				for (ALEParser.Cond cnd  : conds.get(cls)) {
					HashSet<String> nonReductSinks = new HashSet<String>();			  
					HashSet<String> reductSinks = new HashSet<String>();
					gatherVariables(cnd, nonReductSinks, reductSinks);
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
						String fname = cls.getName().toLowerCase() + "_" + lhs.replace("@", "_");
						String assign = backend.lhsToAddress(lhsRaw, cls, sched._ast);
						if (!inLoop) { 			        	  
							String rhs = nestedTernary(cnd, lhsRaw, cls, sched);
							exprToCall.put(fname, backend.asgnE(assign, rhs));
							exprPrinter.put(fname, backend.logStmtVar(0, 0, fname, sched._ast, cls,  lhs, backend.rhsToVal(lhs, cls, sched._ast)));
						} else {
							boolean isReduction = reductSinks.contains(lhsRaw);
							addAssign(lhsRaw, cls, sched, isReduction, null, cnd, exprToCall);							
							exprPrinter.put(fname+"_step", 
									backend.logStmtVar(0, 0, fname + "_step", sched._ast, cls, lhs, backend.rhsToVal(lhs, cls, sched._ast)));
						}
						if (reductSinks.contains(lhsRaw)) {
							String iLhs = "self@" 
								+ (AGEvaluatorSwipl.attribBase(lhsRaw).equals("self") ? "": (AGEvaluatorSwipl.attribBase(lhsRaw)+"_"))
								+ AGEvaluatorSwipl.attribName(lhsRaw) + "_init";								
							exprPrinter.put(fname+"_init", 
									backend.logStmtVar(0, 0, fname + "_init", sched._ast, cls, iLhs, backend.rhsToVal(iLhs, cls, sched._ast)));							
						}
					}
				}
			}
		}
	}
	
	
	// Each HashMap returned from this method is equivalent to one pass in generated visitors
	public HashMap<AGEval.Class, String> visit (
			AGEvaluator aleg, HashMap<String, AGEval.Class> classMap, 
			HashMap<String, String> exprToCall,
			HashMap<String, String> exprPrinter, 
			int visitNum, Term pass, HashMap<AGEval.Class, ArrayList<String>> childOrders,
			Schedule sched) throws InvalidGrammarException {
		//System.err.println("Visit.");

		HashMap<AGEval.Class, String>  visit = new HashMap<AGEval.Class, String> (aleg.classes.size());
		for (AGEval.Class cls : aleg.classes) {
			visit.put(cls, backend.visitHeader(cls, visitNum, sched._ast)); //e.g., function vbox0 {
		}
		
		HashMap<AGEval.Class, ArrayList<String>> openLoopVars = new HashMap<AGEval.Class, ArrayList<String>>();		
		int childI = 0;
		for (Term act : pass.toTermArray()) {
			if (act.isInteger()) {
				visitRecursion(sched, visitNum, childOrders, act, childI, openLoopVars, visit, exprToCall, exprPrinter);
				//System.err.println("Calling visit recursion on " + act.toString());
				childI++;
			} else { 
				visitAction(sched, act, openLoopVars, visit, exprToCall, exprPrinter);
				//System.err.println("Calling visit action on " + act.toString());
			}
		}
		
		//System.err.println("(pass: " + pass + ")\n==\n");
		// Add the footer to each visit
		for (AGEval.Class cls : aleg.classes) {
			if (openLoopVars.containsKey(cls)) 
				throw new InvalidGrammarException("End of visit with unclosed loop: " + cls.getName()+"::"+openLoopVars.get(cls).get(0));
				//closeLoop(cls, sched, openLoopVars, visit, exprToCall, exprPrinter);
			visit.put(cls, visit.get(cls) + backend.visitFooter(cls, visitNum, sched._ast));			
		}
		return visit;
	}
	
	public String visits(
			AGEvaluator aleg,
			Hashtable<Variable, Term> binding, HashMap<AGEval.Class, ArrayList<String>> childOrder,
			HashMap<String, AGEval.Class> classMap,
			HashMap<String, String> exprToCall,
			HashMap<String, String> exprPrinter,
			Schedule sched) throws InvalidGrammarException {
		String res = "";
		int numVisits = binding.get("P").toTermArray().length;
		ArrayList<HashMap<AGEval.Class, String> > visits = new ArrayList<HashMap<AGEval.Class, String> > (numVisits);			
		ArrayList<String> directions = new ArrayList<String>(numVisits);
		int visitI = 0;					 
		for (Term visit : binding.get("P").toTermArray()) {
			//System.out.println("Pass: " + visit);
			//(Visit, Direction, Previous, Assume, VisitO); car/cdr for each nesting
			String stencil = visit.arg(2).arg(1).toString(); 
			directions.add(stencil);
			visits.add(visit(aleg, classMap, exprToCall, exprPrinter, visitI, visit.arg(2).arg(2).arg(2).arg(2), childOrder, sched));
			visitI++;
		}

		//res += "\nStencil order: ";
		//for (String dir : directions) res += dir + " ";
		//res += "\n";
		for (HashMap<AGEval.Class, String>  pass : visits) {
			res += "///// pass /////\n";
			for (String visit : pass.values()) { 
				res += visit; 
			}
		}
		
		return res;
	}
	
	
	public boolean isPhantom(String f, ExtendedClass cls2) {
		String cleanF = f.replace("_step","").replace("_init","").replace("_last","");		
		String[] parts = cleanF.split("_");
		String nodeF;
		String attribF;
	    if (parts.length == 2) {
	    	nodeF = "self";
	    	attribF = parts[1];
	    } else {
	    	nodeF = parts[parts.length - 2];
	    	attribF = parts[parts.length - 1];
	    }
		String cmp = nodeF + "@" + attribF;
		if (cls2.phantomAttributes.contains(cmp)) {
//			System.err.println("skip phantom F: " + f);
			return true;
		} else {
//			System.err.println("do F: " + f);
			return false;
		}		
	}
	
	public void closeLoop (AGEval.Class cls, String loopVar, 
			AGEvaluatorSwipl.Schedule sched, HashMap<AGEval.Class, 
			ArrayList<String>> openLoops, HashMap<AGEval.Class, String>  soFar,
			HashMap<String, String> exprToCall, HashMap<String, String> exprPrinter) throws InvalidGrammarException {
		String res = "";
		//String loopVar = sched._ast.extendedClasses.get(cls).idToLoop.get(openLoops.get(cls).get(0).replace("_step", "").replace("_","@"));		
		ExtendedClass cls2 = sched._ast.extendedClasses.get(cls);
	    		
		res += backend.openLastChild(cls, loopVar);
		boolean hasAnyToCopy = false;
		if (!openLoops.containsKey(cls)) {
			String options = "";
			for (AGEval.Class c : openLoops.keySet()) options += "option: " + c.getName() + "\n";
			throw new InvalidGrammarException("No loop to close on class " + cls.getName() + ":" + options);
		}
		
		for (String f : openLoops.get(cls)) {
			String cleanF = f.replace("_step", "").replace("_", "@");		
			//System.err.println("Checking for closure open var " + cleanF);
			//for (String s : schedule2.reductions.accessedAsLast.get(cls)) System.err.println("  " + s);
			if (sched.reductions.accessedAsLast.get(cls).contains(cleanF)) { //set: x, child@y, ...
				String base = AGEvaluatorSwipl.attribBase(cleanF);
				if (base.equals("self")) continue;
				hasAnyToCopy = true;			
				String attrib = cleanF.split("@")[1];
				String lastAttrib = (base + "_" + attrib + "_last").toLowerCase();
				String lastLhs = "self@" + lastAttrib;
				res += "        " + backend.asgnS(backend.lhsToAddress(lastLhs, cls, sched._ast), backend.rhsToVal(cleanF, cls, sched._ast));
				res += backend.logStmtVar(8,4,cleanF, sched._ast, cls, lastLhs, backend.rhsToVal(lastLhs, cls, sched._ast));
			}
		}	
	    res += backend.closeLastChild();
	    
	    	    
		for (String f : openLoops.get(cls)) {
			if (!isPhantom(cls.getName().toLowerCase() + "_" + f, cls2)) {
				if (exprToCall.containsKey(f + "_last")) {
					hasAnyToCopy = true;
					res += exprToCall.get(f + "_last") + ";\n";
				}
			}
		}
		res = (hasAnyToCopy ? res : "") + backend.closeChildLoop() + "\n";
		
		String inits = "\n";
		for (String s : openLoops.get(cls)) {
			String sClean = cls.getName().toLowerCase() + "_" + s.replace("_step", "_init");
			//if (!schedule2.reductions.accessedAsReduction.get(cls).contains(s.replace("_step", "").replace("_", "@"))) {
				//System.err.println("Not accessed as reduction: " + s.replace("_step", "").replace("_", "@") + ", searching: ");
				//for (String o : schedule2.reductions.accessedAsReduction.get(cls)) System.err.println("  Option: " + o);
				//continue;
			//}				
			if (!exprToCall.containsKey(sClean)) { //FIXME prescreen
				//System.err.println("Missing " + s + " => " + sClean);
				//for (String o : exprToCall.keySet()) System.err.println("  opt: " + o);				
				continue;
			} 
			if (isPhantom(sClean, cls2)) continue;
			//else System.err.println("hit: "+ s + " => " + sClean);
		
			inits += "  " + exprToCall.get(sClean).replace("\n", "\n  ") + ";\n";
			String log = exprPrinter.get(sClean);
			if (debug && log != null) 
				inits += "  " + log.replace("\n", "\n  ");
			else 
				System.err.println("Missing log: " + sClean);				
		}
		
		inits += backend.openChildLoop(cls, loopVar, sched._ast);
		
		openLoops.remove(cls);
		
		soFar.put(cls, soFar.get(cls).replace("#openLoop# {\n", inits) + res);
	}
	
	
	public static boolean childrenContains(Collection<String> rawCollection, String entry) {
		String entryClean = entry.toLowerCase();
		for (String s : rawCollection) {
			if (s.toLowerCase().equals(entryClean)) return true;
		}
		return false;
	}
	
	public void visitRecursion(Schedule sched, int visitNum, HashMap<AGEval.Class, ArrayList<String>> childOrders, Term act, int childI, 
			HashMap<AGEval.Class, ArrayList<String>> openLoopVars, HashMap<AGEval.Class, String>  visit, HashMap<String, String> exprToCall, HashMap<String, String> exprPrinter) throws InvalidGrammarException {
		for (AGEval.Class cls : sched._aleg.classes) {
			if (cls.getChildMappings().size() > childI) {
				ArrayList<String> visitOrder = childOrders.get(cls);
				
				if (visitOrder == null) {
					String available = "";
					for (AGEval.Class key : childOrders.keySet()) { 
						available += key.getName().toLowerCase() + " ";
					}
					throw new InvalidGrammarException("No visit order for class " + cls.getName().toLowerCase() + ", available: " + available);
				}
				
				String childName = visitOrder.get(childI);
				if (childrenContains(sched._ast.extendedClasses.get(cls).multiChildren.keySet(), childName)) {
					boolean selfLoop = openLoopVars.get(cls) == null;
					if (selfLoop) { 
						visit.put(cls, visit.get(cls) + openLoop(cls, openLoopVars)); 
					}
					visit.put(cls, visit.get(cls) + backend.childrenRecur(cls, childName, visitNum, sched._ast));
					if (selfLoop) { 
						closeLoop(cls, childName, sched, openLoopVars, visit, exprToCall, exprPrinter); 
					}
				} else {
					visit.put(cls, visit.get(cls) + "  " + backend.childRecur(cls, childName, visitNum));
					visit.put(cls, visit.get(cls) + backend.logStmt(2, 2, "resume visit " + cls.getName(), "" + visitNum));
				}
			}
		}		
	}

	public static String openLoop (AGEval.Class cls, HashMap<AGEval.Class, ArrayList<String>> openLoops)  {
		// This string is later regex'ed into our actual open loop statement
		// (in the closeLoop method.)
		// Seriously??? Let this comment save you the three hours it took me to figure this out.
		String res = "  #openLoop# {\n";
		openLoops.put(cls, new ArrayList<String>());
		return res;
	}

	//Rather tricky: statements may or may not be in a loop, scheduler might interleave loop statements
	//1. loop opening/restarting:
	//  Currently: (assumes loops only over one child)
	//    track which loop is currently open (signaled by a _step), including order of loop vars (_steps) and recursions
	//    close when first _last is reached, flush open vars
	//    don't re-close if open vars is empty (TODO: check that close is of a last-flushed var?)
	//    error if in open loop and out of loop call (assuming screening of phantoms)
	//    careful to put recursion inside current loop or within its own loop if on a multichild
	//  Future: support loops over multiple children
	//    may need to commute loops to support multiple loop vars
	//2. if a child.x is used as an $-, introduce a local var for it
	//3. if a child.x is used as a $$, need to store last assign to it (up to lower-level compiler to remove #2 in this case)
	//All of these can be better optimized than currently done (e.g., no need for field if a priv class attrib is local to this visit)
	//FIXME concurrent loops may be open, need to stage them
	public void visitAction (Schedule schedule2, Term act, 
			HashMap<AGEval.Class, ArrayList<String>> openLoopVars, HashMap<AGEval.Class, String>  visit, 
			HashMap<String, String> exprToCall, HashMap<String, String> exprPrinter) throws InvalidGrammarException {
		
		AGEval.Class cls = schedule2.classMap.get(act.toTermArray()[0].toString());
		ExtendedClass cls2 = schedule2._ast.extendedClasses.get(cls);
		Term[] vertex = act.toTermArray()[1].toTermArray();
		String lhsVertex = 
			( vertex[0].toString().equals("self") ? "": (vertex[0].toString() + "@"))
			+ vertex[1].toString();
		String exprName = cls.getName().toLowerCase() + "_" + lhsVertex.replace("@","_"); 
		
		//screen:
		//  x such that x_step (assignment implicitly handled in x_step)
		//  x_step such that x is not locally assigned
		if (exprToCall.containsKey(exprName+"_step")) {
			return;
		} else if (exprToCall.get(exprName) == null && !exprName.contains("_last")) {
			if (exprName.contains("testpred") || exprName.contains("elsepred") || exprName.contains("elseifpred")) {
				//System.err.println(" (skip; is pred)");
				return;
			} else if (exprName.contains("_step")) {
				//do nothing if another class handles this child write
				if (exprName.split("_").length == 4) {
					//String c = exprName.split("_")[0];
					String child = exprName.split("_")[1];
					String fld = exprName.split("_")[2];
					boolean hasWrite = false;
					for (String w : schedule2.reductions.allClassWrites.get(cls)) {
						if (w.toLowerCase().equals(child + "@" + fld)) {
							hasWrite= true;
							break;
						}
					}
					if (!hasWrite) return;
				}				
				//return;
			}
			for (String s : exprToCall.keySet()) {				
				System.err.println("  option: " + s);
			}
			throw new InvalidGrammarException("Could not find action for " + exprName);
		}	

		
		//close loop
		String origLhs = (vertex[0].toString().equals("self") ? "": (vertex[0].toString() + "@"))
		+ (vertex[0].toString().equals("self") ? 
				  vertex[1].toString().replace("_step", "").replace("_last", "").replace("_", "@")
				: vertex[1].toString());
		
		String newLoopVar = schedule2._ast.extendedClasses.get(cls).idToLoop.get(origLhs);
		if (origLhs.contains("@init")) 
			newLoopVar = "";
		if (newLoopVar == null) 
			throw new InvalidGrammarException("could not find enclosing loop, if any: " + origLhs);
		if (vertex[1].toString().contains("_last")) {
			if (newLoopVar.equals("")) 
				throw new InvalidGrammarException("last variable " + cls.getName()+"::"+origLhs + " not in loop");
			if (openLoopVars.get(cls) == null) 
				return; //already closed
			else {
				if (openLoopVars.get(cls).size() == 0) 
					throw new InvalidGrammarException("Closing open loop with nothing in it");
				String oldLoopVar = "";
				if (openLoopVars.containsKey(cls)) {
					for (String lhsRaw : openLoopVars.get(cls)) {
						String lhs = lhsRaw.toLowerCase();
						oldLoopVar = schedule2._ast.extendedClasses.get(cls).idToLoop.get(lhs.replace("_step", "").replaceFirst("_", "@"));
						break;
					}				
				}
				if (!oldLoopVar.equals(newLoopVar)) 
					throw new InvalidGrammarException("Wrong loop var on closing " + cls.getName() + "::" + origLhs);
				closeLoop(cls, oldLoopVar, schedule2, openLoopVars, visit, exprToCall, exprPrinter);
				return;
			}			
		} else {
			boolean inLoop = vertex[1].toString().contains("_step"); 
			if (inLoop) {
				if (openLoopVars.get(cls) != null) {
					if (openLoopVars.get(cls).size() == 0) 
						throw new InvalidGrammarException("Continuing open loop that is empty on " + cls.getName()+ "::" + origLhs);
					String oldLoopVar = "";
					if (openLoopVars.containsKey(cls)) {
						for (String lhsRaw : openLoopVars.get(cls)) {
							String lhs = lhsRaw.toLowerCase();
							oldLoopVar = schedule2._ast.extendedClasses.get(cls).idToLoop.get(lhs.replace("_step", "").replaceFirst("_", "@"));
							break;
						}				
					}
					if (!oldLoopVar.equals(newLoopVar)) throw new InvalidGrammarException("Wrong loop var on continuing " + cls.getName() + "::" + origLhs);				
				} else {
					visit.put(cls, visit.get(cls) + openLoop(cls, openLoopVars));
				}
				openLoopVars.get(cls).add(lhsVertex);
			}
			
			if (visit.get(cls) == null) 
				System.err.println("failed to get cls on Vertex " + exprName + ", " + cls.getName());
			else if (visit.get(cls).equals("null")) 
				System.err.println("Got null str on cls of Vertex " + exprName + ", " + cls.getName());	
			
			if (exprToCall.get(exprName) == null || exprPrinter.get(exprName) == null) {
				//TODO horvbox's vbox_child_x_step printer because assigned as a (loop) conditional?
					System.err.println("failed to get expr (" + exprName + ") -- " + (exprToCall.get(exprName) == null ? "expr" : "printer"));
					System.err.println("  base: "+ vertex[0].toString());
					System.err.println("  name: " + vertex[1].toString());
					if (exprToCall.get(exprName) == null) {
						//for (String e : exprToCall.keySet()) 
						//	System.err.println("  c opt: " + e);
					} else {
						//for (String e : exprPrinter.keySet()) 
						//	System.err.println("  p opt: " + e);					
					}
			}
			
			String padding = inLoop ? "      " : "  ";
			//FIXME skip nullaries
			if (exprToCall.containsKey(exprName)) {
				boolean isP = isPhantom(exprName, cls2);
				String p = debug && !isP ? exprPrinter.get(exprName) : "";
				if (p == null) {
					System.err.println("Missing printer: " + cls.getName()+"::"+exprName);
					p="";
				}
				//System.err.println("putting: " + exprToCall.get(exprName));
				//System.err.println("print: " + p);
				String extra = isP ? "" : exprToCall.get(exprName).replace("\n", "\n      "); 
				visit.put(cls, visit.get(cls) + padding + extra + ";\n" + p);
			}
		}
	}
	
	public String visitDispatchers(int visits, AGEvaluator aleg, Vector<HashSet<AGEval.Class>> buSubInorderBuIns, Vector<HashSet<AGEval.Class>> buSubInorderBus) {
		String res = "";
		for (int i = 0; i < visits; i++) res += backend.visitDispatcher(i, aleg, buSubInorderBuIns.get(i), buSubInorderBus.get(i));
		return res;
	}
	
	
	
	public String functionHeaders (ALEParser g) throws InvalidGrammarException {
		//sort lifted expressions by class
		HashMap<AGEval.Class, ArrayList<ALEParser.Assignment>> assignments = new HashMap<AGEval.Class, ArrayList<ALEParser.Assignment>>();
		for (ALEParser.Assignment asgn : g.assignments) {
			if (!assignments.containsKey(asgn._class)) assignments.put(asgn._class, new ArrayList<ALEParser.Assignment>());
			if (!asgn.isReduction) assignments.get(asgn._class).add(asgn); 
		}
		String res = "";
		for (ArrayList<ALEParser.Assignment> cAssigns : assignments.values() ) {
			for (ALEParser.Assignment assign : cAssigns) res += backend.functionHeader(assign, g);
		}
		return res;
	}
	
	
	
	public Schedule synthesizeAll(String alePath, String outputDir, String resourceDir, boolean verbose, boolean isFixedChildOrder, boolean isExhaustive, int maxLen, boolean stripFloats) throws Exception {
		
		System.err.println("all");
		
		File variants = (new File(outputDir + File.separator + "variants"));
		if (variants != null && variants.isDirectory()) {
			for (File d : variants.listFiles()) {
				for (File f : d.listFiles()) f.delete();
				d.delete();
			}
			variants.delete();
		}

		///////////////////////////////////////////////////////////////
		
		AleFrontend grammar = new AleFrontend(alePath, AGEvaluatorSwipl.chainLoops, stripFloats);
		grammar.initFtl(!AGEvaluatorSwipl.chainLoops); //play with old alegen core
		
		String fHeaders = functionHeaders(grammar.ast);
		
		AGEvaluatorSwipl ages = new AGEvaluatorSwipl(grammar.alegEval, grammar.ast, verbose);		
		String prologGrammar = ages.alegAstToSwiplAst();
		
		File prettyGrammar = new File(alePath);
        String baseName = prettyGrammar.getName().split("\\.")[0];
		String prologGrammarPath = outputDir + File.separator + baseName + ".pl";
		AGEvaluatorSwipl.writeFile(prologGrammarPath, prologGrammar);
		if (verbose) System.out.println("=== PL GRAMMAR: === \n " + prologGrammar);
		ages.runGrammar(resourceDir, prologGrammarPath);
		
		Schedule sched = ages.generateVisits(isFixedChildOrder, isExhaustive, false, maxLen, grammar.alegEval, grammar.ast);		
		
		HashMap<String, String> exprPrinter = genExprPrinter(sched._aleg, grammar.ast.condsTop, sched);
		HashMap<String, String> exprToCall = genExprToCall(sched._aleg, grammar.ast.condsTop, sched, exprPrinter);

		////////////////////////////////////////////////////////////////
				
		Hashtable<Variable, Term> binding = null;
		int round = 0;		
		(new File(outputDir + File.separator + "variants")).mkdir();
		
		long queryTime = -System.currentTimeMillis();
		System.err.println("Start time: " + queryTime + "ms");
		
		long timeSinceLastQuery = -System.currentTimeMillis();
		int found = 0;
		int cumQTime = 0;
		int totLen = 0;
		double pcnt = 100;
		int pLen = 100;
		while (sched.hasNext()) {
			found++;
			binding = sched.moveNext();		
			
			//if (!sched.isAllParallel()) continue;
			
			long qTime = timeSinceLastQuery + System.currentTimeMillis();
			cumQTime += qTime;
			String seq = "";
			int sLen = 0;
			int numPar = 0;
			for (Term visit : sched.binding.get("P").toTermArray()) {
				String str = visit.arg(2).arg(1).toString();
				if (str.equals("td") || str.equals("bu")) numPar++;
				seq += " " + visit.arg(2).arg(1).toString().replace("tdLtrU", "inorder");
				sLen++;
			}
			double pPcnt = (0.0 + numPar) / (0.0 + sLen);
			pcnt = Math.min(pcnt,  pPcnt);
			
			totLen += sLen;
			System.out.println("sched: " + seq);
			System.out.println("find time: " + qTime + "ms");
			System.out.println("Running average: " + (cumQTime / found) + "ms/query (over " + found + " queries)");
			System.out.println("Avg len: " + (totLen / found));
			System.out.println("Pcnt self: " + pPcnt);
			System.out.println("Roll pcnt: " + pcnt);
			

			if (true) continue;
			
			long compeTime = -System.currentTimeMillis();
			
			(new File(outputDir + File.separator + "variants/variant" + round)).mkdir();

			backend.generateParseFiles(grammar.ast, sched, outputDir + File.separator + "variants/variant" + round + File.separator, verbose, fHeaders);
			
			String visitOut = 
				backend.preVisits(grammar.alegEval, sched) 
				+ visits(sched._aleg, binding, sched.computeVisitOrders(), sched.classMap, exprToCall, exprPrinter, sched) 
				+ backend.postVisits(grammar.alegEval, sched);
			String visitDispatches = visitDispatchers(sched.numVisits(), grammar.alegEval, sched.buSubInorderBuIn, sched.buSubInorderBus);
			
			backend.output(baseName, visitOut, visitDispatches, outputDir + File.separator + "variants/variant" + round + File.separator, true, verbose, grammar.ast, sched, fHeaders, binding, grammar.alegEval);
			AGEvaluatorSwipl.writeFile(outputDir + File.separator + "variants/variant" + round + File.separator + "schedule", seq);
			round++;
			//if (!isExhaustive) {
			//	System.err.println("(breaking early: not exhaustive");
			//	break;
			//}
			System.err.println("Code gen time: " + (compeTime + System.currentTimeMillis()) + " ms");
			timeSinceLastQuery = -System.currentTimeMillis();
			
		}
		//return;
		
		System.err.println("Total time: " + (queryTime + System.currentTimeMillis()) + "ms");

		return sched;
		
		
		
	}
	
	public Schedule synthesize(String alePath, String outputDir, String resourceDir, boolean verbose, boolean isFixedChildOrder, boolean isExhaustive, int maxLen, boolean stripFloats) throws Exception {
		
		AleFrontend grammar = new AleFrontend(alePath, AGEvaluatorSwipl.chainLoops, stripFloats);
		grammar.initFtl(!AGEvaluatorSwipl.chainLoops); //play with old alegen core
		
		AGEvaluatorSwipl ages = new AGEvaluatorSwipl(grammar.alegEval, grammar.ast, verbose);		
		String prologGrammar = ages.alegAstToSwiplAst();
		
		File prettyGrammar = new File(alePath);
        String baseName = prettyGrammar.getName().split("\\.")[0];
		String prologGrammarPath = outputDir + File.separator + baseName + ".pl";
		AGEvaluatorSwipl.writeFile(prologGrammarPath, prologGrammar);
		if (verbose) System.out.println("=== PL GRAMMAR: === \n " + prologGrammar);
		ages.runGrammar(resourceDir, prologGrammarPath);
		
		
		Schedule sched = ages.generateVisits(isFixedChildOrder, isExhaustive, true, maxLen, grammar.alegEval, grammar.ast);		
		
		////////////////////////////////////////////////////////////////
			
		Hashtable<Variable, Term> binding = null;
		//int vlen =  0;
		
		if (true) {
			while (sched.hasNext()) {
				

				binding = sched.moveNext();				
				String seq = "";
				//int len = 0;
				for (Term visit : sched.binding.get("P").toTermArray()) {
					//len++;
					seq += " " + visit.arg(2).arg(1).toString().replace("tdLtrU", "inorder");
				}
				System.err.println("sched: " + seq);
				//if (sched.isAllParallel()) break;
				break;
			} 
			//return;			
		} //else {
//
//			while (sched.hasNext()) {
//				Hashtable<Variable, Term> nextBinding = sched.moveNext(); 
//				int nextLen = sched.binding.get("P").toTermArray().length;
//				if (binding == null || nextLen < vlen) {
//					binding = nextBinding;
//					vlen = nextLen;
//				}
//				if (!sched.isAllParallel()) continue;
//				//break;
//			}
//		}

		
		String schedPath = outputDir +File.separator + baseName +".sched";
		AGEvaluatorSwipl.writeFile(schedPath, sched.printBinding());		
		AGEvaluatorSwipl.writeFile(schedPath +"Summary", sched.printBindingShort());

		String fHeaders = functionHeaders(grammar.ast);
		
		backend.generateParseFiles(grammar.ast, sched, outputDir, verbose, fHeaders);
		
		HashMap<String, String> exprPrinter = genExprPrinter(sched._aleg, grammar.ast.condsTop, sched);
		HashMap<String, String> exprToCall = genExprToCall(sched._aleg, grammar.ast.condsTop, sched, exprPrinter);
		
		String visitOut = 
			backend.preVisits(grammar.alegEval, sched) 
			+ visits(sched._aleg, binding, sched.computeVisitOrders(), sched.classMap, exprToCall, exprPrinter, sched) 
			+ backend.postVisits(grammar.alegEval, sched);
		String visitDispatches = visitDispatchers(sched.numVisits(), grammar.alegEval, sched.buSubInorderBuIn, sched.buSubInorderBus);
		
		backend.output(baseName, visitOut, visitDispatches, outputDir, true, verbose, grammar.ast, sched, fHeaders, binding, grammar.alegEval);
		
		return sched;
	}
}
