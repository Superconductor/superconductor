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

//Given Backend implementation and abstract schedule, generate output
//based on original Generator, but changes loop handling
public class AbstractGenerator implements GeneratorI {

	public final boolean debug = true;
	
	private final Backend backend;
	public AbstractGenerator (Backend backend_) {
		backend = backend_;
	}
	
	
	//@Deprecated
	/*
	public static Vertex lookupAttribute(String lhsRaw, AGEval.Class cls) throws InvalidGrammarException {
		String lhs = lhsRaw.replace("$$", "").replace("$-", "").replace("$i", "");
		return lhs.split("@").length == 2 ? 
				(lhs.split("@")[0].equals("self") ? cls.findVertexByExtName(lhs.split("@")[1])						
				 : cls.getChildByName(lhs.split("@")[0]).findVertexByExtName(lhs.split("@")[1]))
				: cls.findVertexByExtName(lhs);					
	}
	*/
	
	public static ALEParser.ExtendedVertex extendedGet(ALEParser ast, AGEval.IFace cls, String prop) throws InvalidGrammarException {
		String uProp = prop.toLowerCase();
		
		for (Entry<String, ALEParser.ExtendedVertex> e : ast.extendedClasses.get(cls).extendedVertices.entrySet())
			if (e.getKey().toLowerCase().equals(uProp)) return e.getValue();		

		AGEval.IFace iface = cls.getInterface();
		if (iface == cls || iface == null) throw new InvalidGrammarException("Extended get on interface fail: " + cls.getName() + " for " + prop);		
		else
			for (Entry<String, ALEParser.ExtendedVertex> e : ast.extendedClasses.get(iface).extendedVertices.entrySet())
				if (e.getKey().toLowerCase().equals(uProp)) return e.getValue();		
		
		throw new InvalidGrammarException("Extended get on class fail: " + cls.getName() + " for " + prop);	
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
			AGEvaluator aleg,
			LoopRecoverer ir,
			HashMap<String, AGEval.Class> classMap, 
			HashMap<String, String> exprToCall,
			HashMap<String, String> exprPrinter, 
			int visitNum, 
			//Term pass, 
			HashMap<AGEval.Class, ArrayList<String>> childOrders,
			Schedule sched) throws InvalidGrammarException {
		//System.err.println("Visit.");

		HashMap<AGEval.Class, String>  visit = new HashMap<AGEval.Class, String> (aleg.classes.size());
		for (AGEval.Class cls : aleg.classes) {
			visit.put(cls, backend.visitHeader(cls, visitNum, sched._ast)); //e.g., function vbox0 {
		}
		
		for (Entry<AGEval.Class, Vector<LoopRecoverer.SingleVisitClean>> e : ir.visitsClean.entrySet()) {
			AGEval.Class cls = e.getKey();
			if (e.getValue().size() > visitNum) {
				LoopRecoverer.SingleVisitClean v  = e.getValue().get(visitNum);
				for (LoopRecoverer.Block block : v.blocks) {
					switch (block.blockType) {
						case UNKNOWN:
							for (String a : block.assignments)
								System.err.println("  " + a);
							throw new InvalidGrammarException("Unknown block type");
						case LOOP:		
							openLoopClean(cls, block.maybeLoopVar, sched, block, exprToCall, exprPrinter, visit);							
							for (String lhs : block.assignments) {
								if (lhs.contains("_recur")) {																		
									String childName = lhs.split("_")[0].replace("unrolln", "");									
									//System.err.println("Recur child name: "+ childName);									
									if (childrenContains(sched._ast.extendedClasses.get(cls).multiChildren.keySet(), childName)) {
										visit.put(cls, visit.get(cls) + backend.childrenRecur(cls, childName, visitNum, sched._ast));
										visit.put(cls, visit.get(cls) + backend.logStmt(6, 2, "resume loop visit " + cls.getName(), "" + visitNum));
									} else {
										throw new InvalidGrammarException(cls.getName() + "::" + lhs + ": Cannot do a single child recursion (" + lhs + ") within a loop (" + block.maybeLoopVar + ")");										
									}
								} else {
									if (lhs.contains("_step1") || lhs.contains("_step2")) continue;
									visitStatement(cls, sched, visit, lhs, true, exprToCall, exprPrinter);
								}
							}
							closeLoopClean(cls, block.maybeLoopVar, sched, block, exprToCall, exprPrinter, visit);
							break;
						case STATEMENT:
							for (String lhs : block.assignments) {
								if (lhs.contains("_recur")) {
									String childName = lhs.split("_")[0].replace("unrolln", "");
									if (childrenContains(sched._ast.extendedClasses.get(cls).multiChildren.keySet(), childName)) {
										throw new InvalidGrammarException(cls.getName() + "::" + lhs + ": Cannot do an array recursion (" + lhs + ") outside of a loop");
									} else {
										visit.put(cls, visit.get(cls) + "  " + backend.childRecur(cls, childName, visitNum));
										visit.put(cls, visit.get(cls) + backend.logStmt(2, 2, "resume visit " + cls.getName(), "" + visitNum));
									}

								} else {
									visitStatement(cls, sched, visit, lhs, false, exprToCall, exprPrinter);
								}
							}
							
					}
					//block or not?
				}
			}
		}
/*		
		//HashMap<AGEval.Class, ArrayList<String>> openLoopVars = new HashMap<AGEval.Class, ArrayList<String>>();		
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
*/		
		//System.err.println("(pass: " + pass + ")\n==\n");
		// Add the footer to each visit
		for (AGEval.Class cls : aleg.classes) {
			visit.put(cls, visit.get(cls) + backend.visitFooter(cls, visitNum, sched._ast));			
		}
		return visit;
	}
	
	public String visits(
			AGEvaluator aleg,
			LoopRecoverer ir,
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
			visits.add(visit(aleg, ir, classMap, exprToCall, exprPrinter, visitI, /*visit.arg(2).arg(2).arg(2).arg(2),*/ childOrder, sched));
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
	
	
	
	public void openLoopClean (AGEval.Class cls, String loopVar, 
			AGEvaluatorSwipl.Schedule sched, 
			LoopRecoverer.Block block,
			HashMap<String, String> exprToCall, HashMap<String, String> exprPrinter,
			HashMap<AGEval.Class, String>  soFar) throws InvalidGrammarException {
	
		ExtendedClass cls2 = sched._ast.extendedClasses.get(cls);
	    
		String res = "\n";
		for (String s : block.assignments) {
			if (!s.contains("_stepn")) continue;			
			String sClean = cls.getName().toLowerCase() + "_" + s.replace("_stepn", "_init");
			if (!exprToCall.containsKey(sClean)) continue; //FIXME what case is this?
			if (isPhantom(sClean, cls2)) continue;

			res += "  " + exprToCall.get(sClean).replace("\n", "\n  ") + ";\n";
			String log = exprPrinter.get(sClean);
			if (debug && log != null) 
				res += "  " + log.replace("\n", "\n  ");
			else 
				System.err.println("Missing log: " + sClean);				
		}		
		res += backend.openChildLoop(cls, loopVar, sched._ast);	
		soFar.put(cls, soFar.get(cls) + res);
	}
	
	public void closeLoopClean (AGEval.Class cls, String loopVar, 
			AGEvaluatorSwipl.Schedule sched, 
			LoopRecoverer.Block block,			
			HashMap<String, String> exprToCall, HashMap<String, String> exprPrinter,
			HashMap<AGEval.Class, String>  soFar) throws InvalidGrammarException {
		
		ExtendedClass cls2 = sched._ast.extendedClasses.get(cls);
	    

		String transfer = backend.openLastChild(cls, loopVar);		
		boolean hasAnyToCopy = false;
		for (String s : block.assignments) {
			if (!s.contains("_stepn")) continue;			
			String sClean = cls.getName().toLowerCase() + "_" + s.replace("_stepn", "_init");
			if (isPhantom(sClean, cls2)) {
				System.err.println("Phantom: " + sClean);
				continue;
			}
			if (handledTransfer(cls, sched, sClean, exprToCall, exprPrinter)) continue;
/*
			if (!exprToCall.containsKey(sClean)) { //transfer?
				System.err.println("Non transfer: " + sClean);
				for (String k : exprToCall.keySet()) System.err.println("  " + k);
				continue; //FIXME what case is this?
			}
*/			
			String cleanF = s.replace("_stepn", "").replace("_", "@");		
			//System.err.println("Checking for closure open var " + cleanF);
			//for (String s : schedule2.reductions.accessedAsLast.get(cls)) System.err.println("  " + s);
			if (sched.reductions.accessedAsLast.get(cls).contains(cleanF)) { //set: x, child@y, ...
				String base = AGEvaluatorSwipl.attribBase(cleanF);
				if (base.equals("self")) continue;
				hasAnyToCopy = true;			
				String attrib = cleanF.split("@")[1];
				String lastAttrib = (base + "_" + attrib + "_last").toLowerCase();
				String lastLhs = "self@" + lastAttrib;
				transfer  += "        " + backend.asgnS(backend.lhsToAddress(lastLhs, cls, sched._ast), backend.rhsToVal(cleanF, cls, sched._ast));
				transfer  += backend.logStmtVar(8,4,cleanF, sched._ast, cls, lastLhs, backend.rhsToVal(lastLhs, cls, sched._ast));
			} 
		}	
		transfer  += backend.closeLastChild();
	    
		String mainBody = "";
	    for (String s : block.assignments) {
	    	if (!s.contains("_stepn")) continue;
	    	String f = s.replace("_stepn", "_last");
			if (!isPhantom(cls.getName().toLowerCase() + "_" + f, cls2)) {
				if (exprToCall.containsKey(f + "_last")) {
					hasAnyToCopy = true;
					mainBody += exprToCall.get(f + "_last") + ";\n";
				}
			}
		}
		String res = (hasAnyToCopy ? transfer : "") + mainBody + backend.closeChildLoop() + "\n";	
		soFar.put(cls, soFar.get(cls) + res);
	}
	
	
	
	public static boolean childrenContains(Collection<String> rawCollection, String entry) {
		String entryClean = entry.toLowerCase();
		for (String s : rawCollection) {
			if (s.toLowerCase().equals(entryClean)) return true;
		}
		return false;
	}
	

	//true if transfer (externally defined)
	//false if not transfer (internally defined)
	//exn if not transfer and not handler
	public static Boolean handledTransfer 
	(AGEval.Class cls, Schedule sched,  String exprName, HashMap<String, String> exprToCall, HashMap<String, String> exprPrinter) 
	throws InvalidGrammarException {
		
		if (exprToCall.get(exprName) == null || exprPrinter.get(exprName) == null) {
			if (exprName.split("_").length == 4) { //loop
				String lhs = exprName.replace("_step", "");
				if (!sched.reductions.allClassWrites.get(cls).contains(lhs)) { //FIXME shouldn't be not !?
					//System.err.println("Check: " + lhs);
					for (String w : sched.reductions.allClassWrites.get(cls)) {
						String cmp = cls.getName().toLowerCase() + "_" + w.replace("@", "_");
						if (lhs.equals(cmp)) throw new InvalidGrammarException("Missing statement handler for write: " + cls.getName()+"::"+exprName);
					}
					return true;
				}	
			} else {
				if (AGEvaluatorSwipl.chainLoops) {					
					//might be a self loop
					/////// FIXME
					if (exprToCall.get(exprName+"_last") != null && exprPrinter.get(exprName+"_last") != null) return false;
					if (!sched.reductions.allClassWrites.get(cls).contains(exprName)) {
						//System.err.println("Check: " + lhs);
						for (String w : sched.reductions.allClassWrites.get(cls)) {  //FIXME shouldn't be not !?
							String cmp = cls.getName().toLowerCase() + "_" + w.replace("@", "_");
							if (exprName.equals(cmp)) throw new InvalidGrammarException("Missing statement handler for write: " + cls.getName()+"::"+exprName);
						}
						return true;
					}	
					///////									
					
					throw new InvalidGrammarException("Missing statement handler: " + cls.getName()+"::"+exprName);
				} else {
					System.err.println("Missing statement handler: " + cls.getName()+"::"+exprName);
				}
			}	
		}
		return false;
	}
		
public void visitStatement (AGEval.Class cls, Schedule sched,  HashMap<AGEval.Class, String>  visit, String exprNameRaw,
		boolean inLoop,
		HashMap<String, String> exprToCall, HashMap<String, String> exprPrinter) throws InvalidGrammarException {
	String exprName = 
			cls.getName().toLowerCase() + "_" 
					+ (exprNameRaw.contains("_stepn") ? 
							(exprNameRaw.replace("_stepn", "_step")) 
							: exprNameRaw.replace("@", "_"));
	
	
	if (visit.get(cls) == null) System.err.println("failed to get cls on Vertex " + exprName + ", " + cls.getName());
	else if (visit.get(cls).equals("null")) 
		System.err.println("Got null str on cls of Vertex " + exprName + ", " + cls.getName());	
	
	//skip transfer calls (needed for scheduling, but assigned externally)
	if (handledTransfer(cls, sched, exprName, exprToCall, exprPrinter)) return;
	
	/*
	if (exprToCall.get(exprName) == null || exprPrinter.get(exprName) == null) {
		System.err.println(cls.getName() + ": failed to get expr (" + exprName + ") -- " + (exprToCall.get(exprName) == null ? "expr" : "printer"));
		System.err.println("Calls: ");
		for (String k : exprToCall.keySet()) System.err.print("  " + k);
		System.err.println("\nPrints: ");
		for (String k : exprPrinter.keySet()) System.err.print("  " + k);
		System.err.println();
	}
	*/
	
	String padding = inLoop ? "      " : "  ";
	ExtendedClass cls2 = sched._ast.extendedClasses.get(cls);
	
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
		
		String fHeaders = functionHeaders(grammar.ast);
		
		long queryTime = -System.currentTimeMillis();
		System.err.println("Start time: " + queryTime + "ms");
		
		long timeSinceLastQuery = -System.currentTimeMillis();
		int found = 0;
		int cumQTime = 0;
		while (sched.hasNext()) {
			found++;
			binding = sched.moveNext();		
			
			//if (!sched.isAllParallel()) continue;
			
			long qTime = timeSinceLastQuery + System.currentTimeMillis();
			cumQTime += qTime;
			String seq = "";
			for (Term visit : sched.binding.get("P").toTermArray()) {
				seq += " " + visit.arg(2).arg(1).toString().replace("tdLtrU", "inorder");
			}
			System.err.println("sched: " + seq);
			System.err.println("find time: " + qTime + "ms");
			System.err.println("Running average: " + (cumQTime / found) + "ms/query (over " + found + " queries)");

			long compeTime = -System.currentTimeMillis();
			
			(new File(outputDir + File.separator + "variants/variant" + round)).mkdir();
			backend.generateParseFiles(grammar.ast, sched, outputDir + File.separator + "variants/variant" + round + File.separator, verbose, fHeaders);
			
			LoopRecoverer ir = new LoopRecoverer(sched);
			
			String visitOut = 
				backend.preVisits(grammar.alegEval, sched) 
				+ visits(sched._aleg, ir, binding, sched.computeVisitOrders(), sched.classMap, exprToCall, exprPrinter, sched) 
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
		
		
		long totalTime = -System.currentTimeMillis();
		
		
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
		
		System.err.println("Total time: " + ((totalTime + System.currentTimeMillis())/1000.0) + "s");

		String schedPath = outputDir +File.separator + baseName +".sched";
		AGEvaluatorSwipl.writeFile(schedPath, sched.printBinding());
		AGEvaluatorSwipl.writeFile(schedPath +"Summary", sched.printBindingShort());
		
		String mapPath = outputDir + File.separator + baseName + ".json";
		AGEvaluatorSwipl.writeFile(mapPath, new JSON(sched._ast).getJSON("  ", "  "));

		String fHeaders = functionHeaders(grammar.ast);
		
		backend.generateParseFiles(grammar.ast, sched, outputDir, verbose, fHeaders);
		
		LoopRecoverer ir = new LoopRecoverer(sched);
		
		
		HashMap<String, String> exprPrinter = genExprPrinter(sched._aleg, grammar.ast.condsTop, sched);
		HashMap<String, String> exprToCall = genExprToCall(sched._aleg, grammar.ast.condsTop, sched, exprPrinter);
		
		String visitOut = 
			backend.preVisits(grammar.alegEval, sched) 
			+ visits(sched._aleg, ir, binding, sched.computeVisitOrders(), sched.classMap, exprToCall, exprPrinter, sched) 
			+ backend.postVisits(grammar.alegEval, sched);
		String visitDispatches = visitDispatchers(sched.numVisits(), grammar.alegEval, sched.buSubInorderBuIn, sched.buSubInorderBus);
		
		backend.output(baseName, visitOut, visitDispatches, outputDir, true, verbose, grammar.ast, sched, fHeaders, binding, grammar.alegEval);
		
		return sched;
	}
	
	public static void main(String[] args) throws Exception {
		
		//=========================
		//String testName = "tdtdpost.ale";
		String testName = "../Examples/spiraldemo2.ftl";
		//String testName = "../Examples/horvbox.ale";
		//String testName ="crosschain3.ale";
		//String testName = "../../csssemantics/ftl/tablesideal.ftl.eric";
		boolean useCpp = false; //false => HTML5
		//=========================

		if (args.length != 3) {
			System.err.println("Expected 3 args:");
			System.err.println("  0: resourceDir (..-swipl/AGEvalSwipl)");
			System.err.println("  1: outputDir (..-ftl/)");
			System.err.println("  2: inputDir (..-swipl/Tests/");			
		}
		
		AGEvaluatorSwipl.Schedule sched;
		long loadTime = -System.currentTimeMillis();
		sched = AGEvaluatorSwipl.getSchedules(args[0] + File.separator,  args[2] + File.separator, testName,  args[1] + File.separator, false, true, false, true, 20, false);
		if (!sched.hasNext()) {
			System.err.println("  " + testName + ": no soln");
			throw new Exception("blah");
		}
		sched.moveNext();
		loadTime += System.currentTimeMillis();
		
		LoopRecoverer ir = new LoopRecoverer(sched);
		System.out.println("====Raw===");
		System.out.println(ir.toStringRaw());
		System.out.println("====Reconstructed===");
		System.out.println(ir.toStringClean());
		
		Backend backend = useCpp ? new CppGenerator() : new Html5Generator() ;
		AbstractGenerator irGen = new AbstractGenerator(backend);

		HashMap<String, String> exprPrinter = irGen.genExprPrinter(sched._aleg, sched._ast.condsTop, sched);
		HashMap<String, String> exprToCall = irGen.genExprToCall(sched._aleg, sched._ast.condsTop, sched, exprPrinter);
		
		
		String visitOut = 
				backend.preVisits(sched._aleg, sched) 
				+ irGen.visits(sched._aleg, ir, sched.binding, sched.computeVisitOrders(), sched.classMap, exprToCall, exprPrinter, sched) 
				+ backend.postVisits(sched._aleg, sched);
		String visitDispatches = irGen.visitDispatchers(sched.numVisits(), sched._aleg, sched.buSubInorderBuIn, sched.buSubInorderBus);

		System.out.println("=======VisitOut=====\n" + visitOut);
		System.out.println("=======VisitDispatches=====\n" + visitDispatches);
		System.out.println("Schedule time: " + loadTime + "ms");
	}
}
