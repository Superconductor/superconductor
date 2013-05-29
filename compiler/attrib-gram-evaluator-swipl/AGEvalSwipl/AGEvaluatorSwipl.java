package AGEvalSwipl;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Vector;

import aleGrammar.ALEParser;
import aleGrammar.ALEParser.Assignment;
import aleGrammar.ALEParser.Cond;
import aleGrammar.AleFrontend;
import aleGrammar.GenSym;

import jpl.Query;
import jpl.Term;
import jpl.Variable;

import AGEval.AGEvaluator;
import AGEval.InvalidGrammarException;



public class AGEvaluatorSwipl {
	
	public final static boolean chainLoops = true; //new loop constraint implementation (no backend connected yet, so keep false in practice)
	public final static boolean chainLoopsChilds = chainLoops && true; //doing true allows splitting loop over multiple traversals..
																		//doing false misses transfer dependency in tdLtrU (becoming td or bu)
																		//step0 might be in a preloop now, so generally ignore
																		//creates child per expansion, and has four expansions (step0,1,2,n)
	public static boolean alreadyRan = true; 	//controls whether to tag assignments/5 as dynamic in first run 
												//set as true to allow to beginwith to allow asserts

	public final static String fakeAttribute = "gensymattrib"; //every class has, nullary funcs use this

	public final HashMap<Integer, ALEParser.Case> symToCase; //for recovering predicate from assignment
	
	public static String attribBase (String attrib) {		
		String[] s = attrib.split("@");
		return s.length == 1 ? "self" : s[0];
	}
	
	public static String attribName (String attrib) {
		String [] s = attrib.split("@");
		return s.length == 1 ? attrib : s[1];
	}

	//create fresh class var for every assignment lhs, treat as normal assignment except also:
	//1. all fresh flow into real
	//2. all (nested) conditions flow into fresh (chain together)
	//3. fresh assign name can be tracked back to cond (to codegen predicate -- clumped)
	
	public String addExpr (AGEval.Class clss, String destRaw, String[] srcsRaw) {
		String res = "";
		String dest = destRaw.replace('.','@');//.replace('@','_');
		dest = dest.replace("[-1]", "_init");
		for (String srcRaw : srcsRaw) {
			String src = srcRaw.replace('.','@');//.replace('@','_');
			  res += "assignment(" + clss.getName().toLowerCase() + ", " + 
			  attribBase(dest) + ", " + attribName(dest.toLowerCase()) + ", " +
			  attribBase(src) + ", " + attribName(src.toLowerCase()) + "). %a1\n";
		}
		return res;
	}
	
	public String caseAssignments(int superPred, AGEval.Class clss, ALEParser.Case c, GenSym genSym, Reductions reducts) throws InvalidGrammarException {
	  String res = "";
	  if (!c.isElse) {
		  res += addExpr(clss, genSym.asProlog(superPred),
				  c.indexedVariables.keySet().toArray(new String[c.indexedVariables.keySet().size()])); 
	  }
	  
	  for (Cond cond : c.conditionals) res += condAssignments(superPred, clss, cond, genSym, reducts);
	  for (ALEParser.Assignment asgn : c.assignments) {
		  if ("".equals((asgn.loopVar))) {
			  String dest = asgn._sink.replace('.','_').replace('@','_');
			  //int assignName = genSym.nextAttrib(genSym.makeVert(clss, dest));
			  res += "assignment(" + clss.getName().toLowerCase() + ", " + 
				  attribBase(dest) + ", " + attribName(dest) + ", " +
				  "self, " + genSym.asProlog(superPred) + "). %a2\n";
			  res += addExpr(clss, asgn._sink, (String[]) asgn._variables.keySet().toArray(new String[asgn._variables.keySet().size()]));
			  symToCase.put(superPred, c);
		  } else {
			  String dest = asgn._sink.replace('.','_').replace('@','_');
			  //int assignName = genSym.nextAttrib(genSym.makeVert(clss, dest));
			  res += "assignment(" + clss.getName().toLowerCase() + ", " + 
				  attribBase(dest) + ", " + attribName(dest.toLowerCase()) + "_step, " +
				  "self, " + genSym.asProlog(superPred) + "). %a3\n";
			  symToCase.put(superPred, c);
			  res += addLoopAsgn(asgn, ast, reducts);
		  }
	  }
	  return res;		
	}
	public String condAssignments(int superPred, AGEval.Class clss, ALEParser.Cond cond, GenSym genSym, Reductions reducts) throws InvalidGrammarException {
		//System.err.println("Cond case");
		String res = "";		
		int testPred = genSym.nextAttrib(genSym.makeVert(clss, "self@testPred"));			
		res += "classAttribute(" + clss.getName().toLowerCase() + ", " + genSym.asProlog(testPred) + ").\n";
		if (genSym.isValid(superPred))
			res += "assignment(" + clss.getName().toLowerCase() + ", self, " + genSym.asProlog(testPred) + ", self, " + genSym.asProlog(superPred) + "). %a4\n";
		else {
			res += "assignment(" + clss.getName().toLowerCase() + ", self, " + genSym.asProlog(testPred) + ", self, " + fakeAttribute + "). %a5\n";	
		}
		res += caseAssignments(testPred, clss, cond.testCase, genSym, reducts);
		int prevPred = testPred;
		for (ALEParser.Case cs : cond.elseifs) {
			int pred = genSym.nextAttrib(genSym.makeVert(clss, "self@elseifPred"));
			res += "classAttribute(" + clss.getName().toLowerCase() + ", " + genSym.asProlog(pred) + ").\n";
			res += "assignment(" + clss.getName().toLowerCase() + ", self, " + genSym.asProlog(pred) + ", self, " + genSym.asProlog(prevPred) + "). %a6\n";
			res += caseAssignments(pred, clss, cs, genSym, reducts);
			prevPred = pred;
		}
		int elsePred = genSym.nextAttrib(genSym.makeVert(clss, "self@elsePred"));			
		res += "classAttribute(" + clss.getName().toLowerCase() + ", " + genSym.asProlog(elsePred) + ").\n";
		res += "assignment(" + clss.getName().toLowerCase() + ", self, " + genSym.asProlog(elsePred) + ", self, " + genSym.asProlog(prevPred) + "). %a7\n";
		res += caseAssignments(elsePred, clss, cond.elseCase, genSym, reducts);			
		return res;
	}
	
	public final boolean verbose;
	public final AGEvaluator aleg;
	public final ALEParser ast;
	public AGEvaluatorSwipl (AGEvaluator aleg_, ALEParser ast_, boolean isVerbose) {
		symToCase = new HashMap<Integer, ALEParser.Case>();
		verbose = isVerbose;
		aleg = aleg_;
		ast = ast_;
	}			
	
	public static void checkReducible (ALEParser.Assignment asgn, String v, ALEParser ast, Reductions reducts) throws InvalidGrammarException {
		String cleanV = v.replace("$$", ""); 
		String parent = attribBase(cleanV);
		String attrib = attribName(cleanV);		
		boolean assignedAsReduce = false;
		boolean assignedNotAsReduce = false;		
		for (Assignment stmt : reducts.allLoopStatements) {
			if (attribBase(stmt._sink).equals(parent) && attribName(stmt._sink).equals(attrib)) {
				assignedAsReduce |= stmt.isReduction;
				assignedNotAsReduce |= !stmt.isReduction;
				if (assignedAsReduce && assignedNotAsReduce) break;
			}
		}		
		if (assignedNotAsReduce) {
			throw new InvalidGrammarException("Use of " + v + " in assignment to " + asgn._class.getName() + "::" + asgn._sink + " illegal: not all definitions of " + cleanV + " are reductions");
		} else if (!assignedAsReduce) {
			throw new InvalidGrammarException("Use of " + v + " in assignment to " + asgn._class.getName() + "::" + asgn._sink + " illegal: no local reduction definition of " + cleanV + "");
		}	
	}
	
	
	
	public static String addLoopAsgnBody(HashMap<String, String> variables, ALEParser.Assignment asgn, ALEParser ast, Reductions reducts) throws InvalidGrammarException{
		String res = "";
		
		
		//x = .. e_i
		//  v$i => v_step0 -> x_step0, v_step1 -> x_step1, v_stepn -> v_stepn  (x$i is rejected @ scheduler time)
		//  v$- => v_step0 -> x_step1, v_step1 -> x_stepn  unless v = x (ignore as ok dependency for left folds)
		//  v$$ => v_stepn -> x_step0
		//  v   => v -> x_step0
		//  c.x => c.x -> x_step0 
		for (String v : variables.keySet()) {
		  if (v.contains("$i")) {				  				  
			  if (attribBase(v).toLowerCase().equals(attribBase(asgn._sink).toLowerCase())
					  && attribName(v.replace("$i", "")).toLowerCase().equals(attribName(asgn._sink).toLowerCase())) 
				  throw new InvalidGrammarException("<x> = fold <e> .. ... <x>$i ...) on " + asgn._class.getName()+"::" + asgn._sink); //FIXME this should be a syntax check
			  String vClean = v.replace("$i", "");
			  res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
			  	+ "self, " 
			  	+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step0" + ", "
			  	+ "self, "
			  	+ (attribBase(v).equals("self") ? "": (attribBase(v).toLowerCase() + "_") ) + attribName(vClean).toLowerCase() +"_step0). %a8\n";														  
			  res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
					  	+ "self, " 
					  	+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step1" + ", "
					  	+ "self, "
					  	+ (attribBase(v).equals("self") ? "": (attribBase(v).toLowerCase() + "_") ) + attribName(vClean).toLowerCase() +"_step1). %a9\n";
			  if (chainLoopsChilds) {
				  res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
						  	+ "self, " 
						  	+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step2" + ", "
						  	+ "self, "
						  	+ (attribBase(v).equals("self") ? "": (attribBase(v).toLowerCase() + "_") ) + attribName(vClean).toLowerCase() +"_step2). %a10\n";				  
			  }
			  res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
					  	+ "self, " 
					  	+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_stepn" + ", "
					  	+ "self, "
					  	+ (attribBase(v).equals("self") ? "": (attribBase(v).toLowerCase() + "_") ) + attribName(vClean).toLowerCase() +"_stepn). %a11\n";														  
			  
		  } else if (v.contains("$-")) {
			  if (attribBase(v).toLowerCase().equals(attribBase(asgn._sink).toLowerCase())
					  && attribName(v.replace("$-", "")).toLowerCase().equals(attribName(asgn._sink).toLowerCase())) continue; //x- -> xi already known 
			  String vClean = v.replace("$-", "").replace("$i", "");
			  res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
				  	+ "self, " 
				  	+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step1" + ", "
				  	+ "self, "
				  	+ (attribBase(v).equals("self") ? "": (attribBase(v).toLowerCase() + "_") ) + attribName(vClean).toLowerCase() +"_step0). %a12\n";
			  if (chainLoopsChilds) {
				  res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
						  	+ "self, " 
						  	+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step2" + ", "
						  	+ "self, "
						  	+ (attribBase(v).equals("self") ? "": (attribBase(v).toLowerCase() + "_") ) + attribName(vClean).toLowerCase() +"_step1). %a13\n";				  
				  res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
						  	+ "self, " 
						  	+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_stepn" + ", "
						  	+ "self, "
						  	+ (attribBase(v).equals("self") ? "": (attribBase(v).toLowerCase() + "_") ) + attribName(vClean).toLowerCase() +"_step2). %a14\n";														  				  
			  } else {
				  res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
						  	+ "self, " 
						  	+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_stepn" + ", "
						  	+ "self, "
						  	+ (attribBase(v).equals("self") ? "": (attribBase(v).toLowerCase() + "_") ) + attribName(vClean).toLowerCase() +"_step1). %a15\n";														  				  
			  }
		  } else if (v.contains("$$")) {
				checkReducible(asgn, v, ast, reducts);
				res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
					+ "self, " + (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step0" + ", "
					+ "self, " + (attribBase(v).toLowerCase().equals("self") ? "" : (attribBase(v).toLowerCase() + "_")) + attribName(v).toLowerCase().replace("$$", "") + "_stepn). %a16\n";								  
		  } else {
				res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
					+ "self, " + (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step0" + ", "
					+ attribBase(v).toLowerCase() + ", " + attribName(v).toLowerCase() + "). %a17\n";
		  }
		}
		
		
		return res;	
	}
	
	public static String addLoopAsgnReduction(ALEParser.Assignment asgn, ALEParser ast, Reductions reducts) throws InvalidGrammarException{	
		if (chainLoops) {
			String res = "";
			//x = e_0 ..
			//  match y in e_0:
			//    $i, $-, children*.x => error
			//    v => v -> x_step0
			//    v$$ => v_stepn -> x_step0
			//    c.x => c.x -> x_step0
			for (String v : asgn.startVariables.keySet()) {
				if (v.contains("$i") || v.contains("$-"))
					throw new InvalidGrammarException("Initialization of " + asgn._class.getName()+"::"+asgn._sink + " reads non-initial variable" + v);
				if (!attribBase(v).equals("self") && Generator.childrenContains(ast.extendedClasses.get(asgn._class).multiChildren.keySet(), attribBase(v)))
					throw new InvalidGrammarException("Initialization of " + asgn._class.getName()+"::"+asgn._sink + " reads children variable" + v);
	
				if (v.contains("$$")) {
					checkReducible(asgn, v, ast, reducts);
					res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
						+ "self, " + (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step0" + ", "
						+ "self, " + (attribBase(v).toLowerCase().equals("self") ? "" : (attribBase(v).toLowerCase() + "_")) + attribName(v).toLowerCase().replace("$$", "") + "_stepn). %a17\n";					
				} else {					
					res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
						+ "self, " + (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step0" + ", "
						+ attribBase(v).toLowerCase() + ", " + attribName(v).toLowerCase() + "). %a18\n";						
				}
			}			
			
			res += addLoopAsgnBody(asgn.stepVariables, asgn, ast, reducts);
			
			return res;
			
		} else {
		
			
			String res = "";
			//x = e_0 ..
			//  v => v -> x_step
			//  $i, $-, children*.x => error
			//  v$$ => v_last -> x_step
			//  non-multi => non-multi
			for (String v : asgn.startVariables.keySet()) {
				if (v.contains("$i") || v.contains("$-"))
					throw new InvalidGrammarException("Initialization of " + asgn._class.getName()+"::"+asgn._sink + " reads non-initial variable" + v);
				if (!attribBase(v).equals("self") && Generator.childrenContains(ast.extendedClasses.get(asgn._class).multiChildren.keySet(), attribBase(v)))
					throw new InvalidGrammarException("Initialization of " + asgn._class.getName()+"::"+asgn._sink + " reads children variable" + v);
	
				if (v.contains("$$")) {
					checkReducible(asgn, v, ast, reducts);
					res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
						+ "self, " + (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step" + ", "
						+ "self, " + (attribBase(v).toLowerCase().equals("self") ? "" : (attribBase(v).toLowerCase() + "_")) + attribName(v).toLowerCase().replace("$$", "") + "_last). %a19\n";					
				} else {					
					res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
						+ "self, " + (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step" + ", "
						+ attribBase(v).toLowerCase() + ", " + attribName(v).toLowerCase() + "). %a20\n";						
				}
			}			
			
			//x = .. e_i
			//  v$i => v_step -> x_step  (x$i is rejected @ scheduler time)
			//  v$- => v_step -> x_step  unless v = x (ignore as ok dependency for left folds)
			//  v$$ => v_last -> x_step
			//  v  => v -> x_step
			for (String v : asgn.stepVariables.keySet()) {
			  if (v.contains("$i") || v.contains("$-")) {
				  if (v.contains("$-") 
						  && attribBase(v).toLowerCase().equals(attribBase(asgn._sink).toLowerCase())
						  && attribName(v.replace("$-", "")).toLowerCase().equals(attribName(asgn._sink).toLowerCase())) continue;
				  String vClean = v.replace("$-", "").replace("$i", "");
				  res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
				  	+ "self, " 
				  	+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step" + ", "
				  	+ "self, "
				  	+ (attribBase(v).equals("self") ? "": (attribBase(v).toLowerCase() + "_") ) + attribName(vClean).toLowerCase() +"_step). %a21\n";														  
			  } else if (v.contains("$$")) {
					checkReducible(asgn, v, ast, reducts);
					res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
						+ "self, " + (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step" + ", "
						+ "self, " + (attribBase(v).toLowerCase().equals("self") ? "" : (attribBase(v).toLowerCase() + "_")) + attribName(v).toLowerCase().replace("$$", "") + "_last). %a22\n";								  
			  } else {
					res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
						+ "self, " + (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step" + ", "
						+ attribBase(v).toLowerCase() + ", " + attribName(v).toLowerCase() + "). %a23\n";
			  }
			}
			return res;
		}
	}
		
	public static String addLoopAsgnAsgn (ALEParser.Assignment asgn, ALEParser ast, Reductions reducts) throws InvalidGrammarException {		
		//if (!asgn.loopVar.equals("")) {			
			//if (attribBase(asgn._sink).equals("self")) throw new InvalidGrammarException("loop <x> { self.<y> := ... } (must use a fold expression here): assignment to " + asgn._class.getName()+"::"+asgn._sink);
			//if (!attribBase(asgn._sink).equals(asgn.loopVar)) throw new InvalidGrammarException("loop <x> { <y>.<z> := ...} (y must equal x): assignment to " + asgn._class.getName()+"::"+asgn._sink);
		//}		
		String res = "";
		if (chainLoops) {
			res += addLoopAsgnBody(asgn._variables, asgn, ast, reducts);
		} else {
			//x = v
			//  v$i => v_step -> x_step (x$i is rejected @ scheduler time)
			//  v$- => v_step -> x_step (error if v is ever not a reduct) (unless v = x, ignore as ok dependency for left folds)
			//  x$$ => v_last -> x_step			
			for (String v : asgn._variables.keySet()) {								
				String lhs = "self, " + (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step" + ", ";
				  			
				if (v.contains("$i") || v.contains("$-")) {
					String vClean = v.replace("$-", "").replace("$i", "");
					  if (v.contains("$-") 
							  && attribBase(v).toLowerCase().equals(attribBase(asgn._sink).toLowerCase())
							  && attribName(vClean).toLowerCase().equals(attribName(asgn._sink).toLowerCase())) continue;
					if (v.contains("$-")) {
						for (Assignment vAsgn: reducts.allLoopStatements) {
							if (vAsgn._class != asgn._class) continue;
							if (!attribBase(vAsgn._sink).equals(attribBase(v)) || !attribName(vAsgn._sink).equals(attribName(vClean))) continue;
							if (!vAsgn.isReduction) {
								throw new InvalidGrammarException("Step of " + asgn._class.getName()+"::"+asgn._sink + " reads prev variable " + v + " which does not always exist for first step");
							}
						}
					}
					res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
						+ lhs
						+ "self, "
						+ (attribBase(v).equals("self") ? "": (attribBase(v).toLowerCase() + "_") ) + attribName(vClean).toLowerCase() + "_step). %a24\n";														  										
				} else if (v.contains("$$")) {
					checkReducible(asgn, v, ast, reducts);
					res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
						+ lhs
						+ "self, " + (attribBase(v).toLowerCase().equals("self") ? "" : (attribBase(v).toLowerCase() + "_")) + attribName(v).toLowerCase().replace("$$", "") + "_last). %a25\n";								  
	
				} else {
					res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
						+ lhs
						+ attribBase(v).toLowerCase() + ", " + attribName(v).toLowerCase() + "). %a26\n";				  
				}
			}
		}
		return res;		
	}
	
	//step0 -> step1 -> stepn
	public static String chain (AGEval.Class cls, String rhs) {
		String res = "";

		res += "assignment(" + cls.getName().toLowerCase() + ", "
			+ "self, " 
			+ (attribBase(rhs).equals("self") ? "": (attribBase(rhs).toLowerCase() + "_") ) + attribName(rhs).toLowerCase()+"_step0" + ", "
			+ "self, "
			+ fakeAttribute + "). %a27 " + rhs + "\n";
		res += "assignment(" + cls.getName().toLowerCase() + ", "
			+ "self, " 
			+ (attribBase(rhs).equals("self") ? "": (attribBase(rhs).toLowerCase() + "_") ) + attribName(rhs).toLowerCase()+"_step1" + ", "
			+ "self, "
			+ (attribBase(rhs).equals("self") ? "": (attribBase(rhs).toLowerCase() + "_") ) + attribName(rhs).toLowerCase()+"_step0). %a28\n";
		if (chainLoopsChilds) {
			res += "assignment(" + cls.getName().toLowerCase() + ", "
					+ "self, " 
					+ (attribBase(rhs).equals("self") ? "": (attribBase(rhs).toLowerCase() + "_") ) + attribName(rhs).toLowerCase()+"_step2" + ", "
					+ "self, "
					+ (attribBase(rhs).equals("self") ? "": (attribBase(rhs).toLowerCase() + "_") ) + attribName(rhs).toLowerCase()+"_step1). %a29\n";
			res += "assignment(" + cls.getName().toLowerCase() + ", "
					+ "self, " 
					+ (attribBase(rhs).equals("self") ? "": (attribBase(rhs).toLowerCase() + "_") ) + attribName(rhs).toLowerCase()+"_stepn" + ", "
					+ "self, "
					+ (attribBase(rhs).equals("self") ? "": (attribBase(rhs).toLowerCase() + "_") ) + attribName(rhs).toLowerCase()+"_step2). %a30\n";			
		} else {
			res += "assignment(" + cls.getName().toLowerCase() + ", "
				+ "self, " 
				+ (attribBase(rhs).equals("self") ? "": (attribBase(rhs).toLowerCase() + "_") ) + attribName(rhs).toLowerCase()+"_stepn" + ", "
				+ "self, "
				+ (attribBase(rhs).equals("self") ? "": (attribBase(rhs).toLowerCase() + "_") ) + attribName(rhs).toLowerCase()+"_step1). %a31a\n";
		}

		return res;
	}
	
	public static String addLoopAsgn (ALEParser.Assignment asgn, ALEParser ast, Reductions reducts) throws InvalidGrammarException {
		String res = "";

		if (asgn.isReduction) res = addLoopAsgnReduction(asgn, ast, reducts);
		else if (asgn._sink.contains("[-1]")) { throw new InvalidGrammarException("No orthogonal init support yet"); }			
		else res = addLoopAsgnAsgn(asgn, ast, reducts);

		if (chainLoops) {
			//step0 -> step1 -> stepn
			res += chain(asgn._class, asgn._sink);
			if (chainLoopsChilds) {
				if (!attribBase(asgn._sink).equals("self")) {
					res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
							+ attribBase(asgn._sink).toLowerCase() + "unroll0, " 
							+ attribName(asgn._sink).toLowerCase() + ", "
							+ "self, "
							+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step0). %a31b\n";
					res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
							+ attribBase(asgn._sink).toLowerCase() + "unroll1, " 
							+ attribName(asgn._sink).toLowerCase() + ", "
							+ "self, "
							+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step1). %a32\n";
					res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
							+ attribBase(asgn._sink).toLowerCase() + "unroll2, " 
							+ attribName(asgn._sink).toLowerCase() + ", "
							+ "self, "
							+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step2). %a33\n";					
					res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
							+ attribBase(asgn._sink).toLowerCase() + "unrolln, " 
							+ attribName(asgn._sink).toLowerCase() + ", "
							+ "self, "
							+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_stepn). %a34\n";
				} //else: step0..n
				if (attribBase(asgn._sink).equals("self")) {
					res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
							+ attribBase(asgn._sink).toLowerCase() + ", " 
							+ attribName(asgn._sink).toLowerCase() + ", "
							+ "self, "
							+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_stepn). %a35\n";
				}				
			} else {
				//assigned in loop, so stepn => last			
				res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
					+ attribBase(asgn._sink).toLowerCase() + ", " 
					+ attribName(asgn._sink).toLowerCase() + ", "
					+ "self, "
					+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_stepn). %a36\n";
			}
			//FIXME: gensym -> step0?
		} else {		
			res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
				+ "self, " 
				+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step" + ", "
				+ "self, "
				+ fakeAttribute + "). %a37\n";
			res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
				+ "self, " 
				+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_last" + ", "
				+ "self, "
				+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step). %a38\n";
			res += "assignment(" + asgn._class.getName().toLowerCase() + ", "
				+ attribBase(asgn._sink).toLowerCase() + ", " 
				+ attribName(asgn._sink).toLowerCase() + ", "
				+ "self, "
				+ (attribBase(asgn._sink).equals("self") ? "": (attribBase(asgn._sink).toLowerCase() + "_") ) + attribName(asgn._sink).toLowerCase()+"_step). %a39\n";
		}
		return res;
	}
			
	//loop writes (might not be an actual fold, includes self.list)
	public static HashSet<String> classReductions (Reductions reducts, AGEval.Class c) {	
		HashSet<String> reductSinks = new HashSet<String>();
		for (ALEParser.Assignment asgn : reducts.allLoopStatements) { //includes cases and folds
			if (asgn._class != c) continue;
			else reductSinks.add(attribBase(asgn._sink).toLowerCase() + "@" + attribName(asgn._sink).toLowerCase());
		}
		return reductSinks;
	}
	
	public static HashSet<String> nonLocalReads (AGEval.Class cls, Reductions reducts) {
		HashSet<String> res = new HashSet<String>();
		HashSet<String> loopWrites = classReductions(reducts, cls);
		for (String read : reducts.allClassLoopListReads.get(cls).keySet()) {
			String cleanRead = attribBase(read).toLowerCase() + "@" + attribName(read).toLowerCase();
			if (!loopWrites.contains(cleanRead)) {
				//System.err.println("Read " + cleanRead + " does not match writes:");
				//for (String write : loopWrites) System.err.println("    " + write);
				res.add(read);
			}
		}
		return res;
	}
		
	
	//1. $-, $i of self variable are only on fold over that variable 
	//2. self loops are reducibles  ( loop child { x = y$$ } is not allowed )
	public void surfaceChecks (Reductions reducts) throws InvalidGrammarException {
		//1. $-, $i of self variable are only on fold over that variable
		for (Assignment asgn : ast.assignments) {
			if (!asgn.loopVar.equals("")) {				
				if (asgn.isReduction) {
					for (String e : asgn.startVariables.keySet())
						if (attribBase(e).equals("self") && (e.contains("$i") || e.contains("$-"))) 							
							if (!(attribBase(asgn._sink).equals("self") && attribName(asgn._sink).equals(attribName(e).replace("$i", "").replace("$-", "")))) {
								throw new InvalidGrammarException(asgn._class.getName() + "::" + asgn._sink + ": reads fold step " + e + "; can only access $$");
							}
					for (String e : asgn.stepVariables.keySet())
						if (attribBase(e).equals("self") && (e.contains("$i") || e.contains("$-"))) 							
							if (!(attribBase(asgn._sink).equals("self") && attribName(asgn._sink).equals(attribName(e).replace("$i", "").replace("$-", "")))) {
								throw new InvalidGrammarException(asgn._class.getName() + "::" + asgn._sink + ": reads fold step " + e + "; can only access $$");
							}
				} else {
					for (String e : asgn._variables.keySet())
						if (attribBase(e).equals("self") && (e.contains("$i") || e.contains("$-"))) 							
							if (!(attribBase(asgn._sink).equals("self") && attribName(asgn._sink).equals(attribName(e).replace("$i", "").replace("$-", "")))) {
								throw new InvalidGrammarException(asgn._class.getName() + "::" + asgn._sink + ": reads fold step " + e + "; can only access $$");
							}					
				}
			} 
		}
		//2. self loops are reducibles  ( loop child { x = y$$ } is not allowed )
		for (Assignment asgn : ast.assignments) {
			if (!asgn.isReduction && !asgn.loopVar.equals("") && attribBase(asgn._sink).equals("self")) {
				System.err.println("loop " + asgn.loopVar + " { ... " + asgn._class + "::" + asgn._sink + " := <expr>");
				throw new InvalidGrammarException("Loop assignments to a self variable must be in a fold (or hoisted out of the loop)");
			}
		}
		
		
	}
	
	public String alegAstToSwiplAst () throws InvalidGrammarException {
		
		GenSym genSym = ast.genSym;
		
		Reductions reducts = new Reductions(ast);
		surfaceChecks(reducts);
		
		String res = "";
		
		for (AGEval.IFace i : aleg.interfaces) 
			res += "interface(" + i.getName().toLowerCase() + ").\n";
		if (aleg.interfaces.size() == 0) res += "interface(" + fakeAttribute  + ") :- false.\n";

		boolean hasIA = false;
		for (AGEval.IFace i : aleg.interfaces) for (String attrib : i.getPubAttributes().keySet()) {
			res += "interfaceAttribute(" + i.getName().toLowerCase() + ", " + attrib.toLowerCase() + ").\n";
			hasIA = true;
		}
		if (!hasIA) res += "interfaceAttribute(" + fakeAttribute  + ", " + fakeAttribute  + ") :- false.\n";

		for (AGEval.Class c : aleg.classes) 
			res += "class(" + c.getName().toLowerCase() + ", " + c.getInterface().getName().toLowerCase() + ").\n";		
		if (aleg.classes.size() == 0) res += "class(" + fakeAttribute  + ", " + fakeAttribute  + ") :- false.\n";
		
		boolean hasCC = false;
		for (AGEval.Class c : aleg.classes) for (String child : c.getChildMappings().keySet()) {
			if (chainLoopsChilds) {
				if ( ast.extendedClasses.get(c).multiChildren.containsKey(child)) {
					res += "classChild(" + c.getName().toLowerCase() + ", " + child.toLowerCase() + "unroll0, " + c.getChildByName(child).getName().toLowerCase() + ").\n";
					res += "classChild(" + c.getName().toLowerCase() + ", " + child.toLowerCase() + "unroll1, " + c.getChildByName(child).getName().toLowerCase() + ").\n";
					res += "classChild(" + c.getName().toLowerCase() + ", " + child.toLowerCase() + "unroll2, " + c.getChildByName(child).getName().toLowerCase() + ").\n";
					res += "classChild(" + c.getName().toLowerCase() + ", " + child.toLowerCase() + "unrolln, " + c.getChildByName(child).getName().toLowerCase() + ").\n";
				} else {
					res += "classChild(" + c.getName().toLowerCase() + ", " + child.toLowerCase() + ", " + c.getChildByName(child).getName().toLowerCase() + ").\n";					
				}
			} else {
				res += "classChild(" + c.getName().toLowerCase() + ", " + child.toLowerCase() + ", " + c.getChildByName(child).getName().toLowerCase() + ").\n";
			}
			hasCC = true;
		}
		if (!hasCC) res += "classChild(" + fakeAttribute  + ", " + fakeAttribute  + ", " + fakeAttribute  + ") :- false.\n";
		
		
		res += "classField(" + fakeAttribute  + ", " + fakeAttribute  + ") :- false.\n";
		for (AGEval.Class c : aleg.classes)  {
			res += "classField(" + c.getName().toLowerCase() + ", " + fakeAttribute + ").\n"; //used later to manipulate nullary functions
			for (String field : c.getPrivFields().keySet())		
				res += "classField(" + c.getName().toLowerCase() + ", " + field.toLowerCase() + ").\n";
		}		
		boolean hasIF = false;
		for (AGEval.IFace i : aleg.interfaces) for (String field : i.getPubFields().keySet()) {
				res += "interfaceField(" + i.getName().toLowerCase() + ", " + field.toLowerCase() + ").\n";
				hasIF = true;
		}
		if (!hasIF) res += "interfaceField(" + fakeAttribute  + ", " + fakeAttribute  + ") :- false.\n";
					
		
		if (!alreadyRan) res += ":- dynamic(assignment/5).\n"; //helps allow grammar to add phantom dependencies as part of query	 
		boolean hasAs = false;
		for (AGEval.Class c : aleg.classes)  {
			//simple assignments
			if (chainLoopsChilds) {
				for (Assignment a : ast.assignments) {
					if (a._class == c && a.loopVar.equals("")) {
						if (a.isReduction) throw new InvalidGrammarException("Reduction in non-loop!");
						if (a._variables.size() == 0) {						
							String asgn = "assignment(" + c.getName().toLowerCase() + ", "
									+ attribBase(a._sink).toLowerCase() + ", " + attribName(a._sink).toLowerCase() + ", "
									+ "self, " + fakeAttribute + "). %a40\n"; //force scheduling of nullary		 
								res += asgn;
	
						} else {
							for (String src : a._variables.keySet()) {
								if (src.contains("$$")) {
									boolean isChild = !attribBase(src).toLowerCase().equals("self"); 
									res += "assignment(" + c.getName().toLowerCase() + ", "
										+ attribBase(a._sink).toLowerCase() + ", " + attribName(a._sink).toLowerCase() + ", "
										+ "self, " + (isChild ? attribBase(src).toLowerCase() + "_" : "") + attribName(src.replace("$$", "_stepn")).toLowerCase() + "). %a41\n"; //change to _last?
								} else {
									res += "assignment(" + c.getName().toLowerCase() + ", "
											+ attribBase(a._sink).toLowerCase() + ", " + attribName(a._sink).toLowerCase() + ", "
											+ attribBase(src).toLowerCase() + ", " + attribName(src).toLowerCase() + "). %a42\n";		 										
								}
							}
						}
					}
				}
			} else {
				for (AGEval.Function func : c.getFunctions()) { 				
					for (String src : func.getStringSrcs()) {
						String asgn = "assignment(" + c.getName().toLowerCase() + ", "
							+ attribBase(func.myDest).toLowerCase() + ", " + func.getDestination().getExtVar().toLowerCase() + ", "
							+ attribBase(src).toLowerCase() + ", " + attribName(src).toLowerCase() + "). %a43\n";		 
						res += asgn;
					}
					if (func.getStringSrcs().length == 0) {
						String asgn = "assignment(" + c.getName().toLowerCase() + ", "
							+ attribBase(func.myDest).toLowerCase() + ", " + func.getDestination().getExtVar().toLowerCase() + ", "
							+ "self, " + fakeAttribute + "). %a44\n"; //force scheduling of nullary		 
						res += asgn;
					}
					hasAs = true;
				}
			}
			//conds
			if (ast.condsTop.containsKey(c)) {
				for (Cond cond : ast.condsTop.get(c)) {
					res += condAssignments(genSym.fake(), c, cond, genSym, reducts);
					throw new InvalidGrammarException("Deprecated: conditionals");				
				}
			}
			//loop assignments
			for (ALEParser.Assignment asgn : ast.assignments)
				if (asgn._class == c && !"".equals(asgn.loopVar))
					res += addLoopAsgn(asgn, ast, reducts);
			
			//loop reads (transfers for child.x, errors for non-written self.x$$)
			if (chainLoops) {
				//if read a non-locally written loop var:
				//		add x_step0-> x_step1 -> x_stepn (chain) 
				//		and x_step1 -> x -> x_stepn (transfer)
				//FIXME gensym -> x_step0?
				for (String read : nonLocalReads(c, reducts)) {
					res += chain(c, read); 
					//if (attribBase(read).equals("self")) { 
					//	throw new InvalidGrammarException(c.getName() + "::" + read + ": Cannot read if it was assigned by parent"); 
					//} else {
						if (chainLoopsChilds) {
							res += "assignment(" + c.getName().toLowerCase() + ", "
									+ "self, "
									+ (attribBase(read).equals("self") ? "": (attribBase(read).toLowerCase() + "_") ) + attribName(read).toLowerCase()+"_step0, "
									+ attribBase(read).toLowerCase() + "unroll0, " 
									+ attribName(read).toLowerCase() + "). %a45\n";
							res += "assignment(" + c.getName().toLowerCase() + ", "
									+ "self, "
									+ (attribBase(read).equals("self") ? "": (attribBase(read).toLowerCase() + "_") ) + attribName(read).toLowerCase()+"_step1, "
									+ attribBase(read).toLowerCase() + "unroll1, " 
									+ attribName(read).toLowerCase() + "). %a46\n";
							res += "assignment(" + c.getName().toLowerCase() + ", "
									+ "self, "
									+ (attribBase(read).equals("self") ? "": (attribBase(read).toLowerCase() + "_") ) + attribName(read).toLowerCase()+"_step2, "
									+ attribBase(read).toLowerCase() + "unroll2, " 
									+ attribName(read).toLowerCase() + "). %a47\n";
							res += "assignment(" + c.getName().toLowerCase() + ", "
									+ "self, "
									+ (attribBase(read).equals("self") ? "": (attribBase(read).toLowerCase() + "_") ) + attribName(read).toLowerCase()+"_stepn, "
									+ attribBase(read).toLowerCase() + "unrolln, " 
									+ attribName(read).toLowerCase() + "). %a48\n";
						} else {
							/*						 
							res += "assignment(" + c.getName().toLowerCase() + ", "
									+ attribBase(read).toLowerCase() + ", " 
									+ attribName(read).toLowerCase() + ", "
									+ "self, "
									+ (attribBase(read).equals("self") ? "": (attribBase(read).toLowerCase() + "_") ) + attribName(read).toLowerCase()+"_step1).\n";
							*/			
							res += "assignment(" + c.getName().toLowerCase() + ", "
									+ "self, "
									+ (attribBase(read).equals("self") ? "": (attribBase(read).toLowerCase() + "_") ) + attribName(read).toLowerCase()+"_stepn, "
									+ attribBase(read).toLowerCase() + ", " 
									+ attribName(read).toLowerCase() + "). %a49\n";
						}
					//}
				}
			} else {
				HashSet<String> accessed = new HashSet<String>();
				accessed.addAll(reducts.allClassReads.get(c));
				accessed.addAll(reducts.allClassWrites.get(c));
				for (String rawLhs : accessed) {
					if (!rawLhs.contains("@")) continue;				
					String child = rawLhs.split("@")[0];
					if (child.equals("self")) continue;
					if (!Generator.childrenContains(ast.extendedClasses.get(c).multiChildren.keySet(), child)) continue;
					String prop = attribName(rawLhs);				
					if (!reducts.allClassWrites.get(c).contains(rawLhs)) {
						//read-only child; step dep on child
						res += "assignment(" + c.getName().toLowerCase() + ", "
							+ "self, " + child.toLowerCase()+  "_" + prop.toLowerCase() + "_step, "
							+ child.toLowerCase() + ", " + prop.toLowerCase() + ").\n";
					}		
				}
			}			
		}
				
		if (!hasAs) res += "assignment(" + fakeAttribute  + ", " + fakeAttribute  + ", " + fakeAttribute + ", " + fakeAttribute + ", " + fakeAttribute + ") :- false.\n";

		boolean hasCA = false;
		for (AGEval.Class c : aleg.classes)  {
			String cleanCls = c.getName().toLowerCase();
			for (String attrib : c.getPrivAttributes().keySet()) { 
				res += "classAttribute(" + cleanCls + ", " + attrib.toLowerCase() + "). %s1\n";
				hasCA = true;
			}
			if (chainLoops) {
				HashSet<String> usedAsLoop = new HashSet<String>();
				for (String rawLhs : classReductions(reducts, c))
					usedAsLoop.add(attribBase(rawLhs).toLowerCase() + "@" + attribName(rawLhs).toLowerCase());
				for (String rawLhs : reducts.allClassLoopListReads.get(c).keySet())
					usedAsLoop.add(attribBase(rawLhs).toLowerCase() + "@" + attribName(rawLhs).toLowerCase());
				for (String rawLhs : usedAsLoop) { //skips self.attribs					
					String child = attribBase(rawLhs);
					String prop = attribName(rawLhs);
					String prefix = child.equals("self") ? "" : (child.toLowerCase() + "_");
					//System.err.println(c.getName() + prefix + "::" + rawLhs);
					res += "classAttribute(" + cleanCls + ", " + prefix + prop.toLowerCase() + "_step0). %s2 " + rawLhs + "\n";						
					res += "classAttribute(" + cleanCls + ", " + prefix + prop.toLowerCase() + "_step1). %s3\n";
					if (chainLoopsChilds) 
						res += "classAttribute(" + cleanCls + ", " + prefix + prop.toLowerCase() + "_step2). %s4\n";						
					res += "classAttribute(" + cleanCls + ", " + prefix + prop.toLowerCase() + "_stepn). %s5\n";						
				}
				if (usedAsLoop.size() > 0) hasCA = true;
			} else {
				HashSet<String> accessed = new HashSet<String>();
				accessed.addAll(reducts.allClassReads.get(c));
				accessed.addAll(reducts.allClassWrites.get(c));
				for (String rawLhs : accessed) { //skips self.attribs
					if (!rawLhs.contains("@")) continue;
					String child = rawLhs.split("@")[0];
					if (child.equals("self")) continue;
					if (!ast.extendedClasses.get(c).multiChildren.containsKey(child)) continue;
					String prop = attribName(rawLhs);
					if (!prop.toLowerCase().contains("[-1]")) {
						res += "classAttribute(" + cleanCls + ", " + child.toLowerCase() +  "_" + prop.toLowerCase() + "_step). %s6\n";
					}
					//FIXME what about folds on a self attib? (loop child { x[i] = ...) vs. (loop child { child[i].x = ...)
				}
			}

			HashSet<String> reductSinks = classReductions(reducts,  c);
			if (!chainLoops) {
				for (String cleanLhs : reductSinks) {				
					if (cleanLhs.contains("[-1]")) {
						res += "classAttribute(" + cleanCls + ", " + attribBase(cleanLhs) + "_" + attribName(cleanLhs).replace("[-1]", "") + "_init). %s7\n";
					} else if (!attribBase(cleanLhs).equals("self")) {
							res += "classAttribute(" + cleanCls + ", " + attribBase(cleanLhs) + "_" + attribName(cleanLhs) + "_step). %s8\n";
							res += "classAttribute(" + cleanCls + ", " + attribBase(cleanLhs) + "_" + attribName(cleanLhs) + "_last). %s9\n";
					} else {
							res += "classAttribute(" + cleanCls + ", " + attribName(cleanLhs) + "_step). %s10\n";
							res += "classAttribute(" + cleanCls + ", " + attribName(cleanLhs) + "_last). %s11\n";
					}
					hasCA = true;
				}	
			}
		}
		
		if (!hasCA) res += "classAttribute(" + fakeAttribute  + ", " + fakeAttribute  + ") :- false. %s12\n";
		//FIXME
		return res;//res.replace("_","uSCORE");
	}


	
	public void runGrammar (String resourceDir, String grammarPath) throws FileNotFoundException {	
		String algorithm = resourceDir + File.separator + "algorithm.pl";
		long loadTime = -System.currentTimeMillis();
		if (!(new Query("consult('" + grammarPath.replace('\\', '/') + "')")).hasSolution()) throw new FileNotFoundException("Could not find prolog grammar");
		if (!(new Query("consult('" + algorithm.replace('\\', '/') + "')")).hasSolution()) throw new FileNotFoundException("Could not find prolog algorithm");		
		loadTime += System.currentTimeMillis();
		if (verbose) System.out.println("Loaded input (" + loadTime + "ms)");
		
		alreadyRan = true;
	}
	
	public ScheduleSketch sketchSchedule(boolean isFixedOrder) {
		return new ScheduleSketch(isFixedOrder);
	}
	public class ScheduleSketch {
		private final Query schedules;
		public ScheduleSketch (boolean isFixedOrder) {
			long queryTime = -System.currentTimeMillis();
			schedules = new Query(
					(ast.scheduleConstraintStr != null ? ast.scheduleConstraintStr.replace("\"","") + ", \n" : "") +
					"sequenceClassesP(O,P) " + (isFixedOrder ? ", findall(GO, grammarOrder(GO), [O | _])" : ""));
			queryTime += System.currentTimeMillis();
			if (verbose) System.out.println("Loaded query (" + queryTime + "ms)");
			if (verbose) System.out.println("Using fixed (first) ordering of children: " + isFixedOrder);			
		}
		boolean hasNext () { return schedules.hasMoreSolutions(); }

		String printNext () {
			String res = "";

			long time = -System.currentTimeMillis();
			@SuppressWarnings("unchecked")
			Hashtable<Variable, Term> binding = (Hashtable<Variable, Term>) schedules.nextSolution();
			time += System.currentTimeMillis();

			res += "Solution (" + time + "ms): \n";
			res += "  Child order:";
			boolean isFirstClass = true;
			for (Term childOrder : binding.get("O").toTermArray()) {
				if (!isFirstClass) res += ", ";
				res += " " + childOrder.arg(1);
				if (childOrder.arg(2).listLength() > 0) {
					res += "(";
					boolean isFirstChild = true;
					for (Term child : childOrder.arg(2).toTermArray()) {
						if (!isFirstChild) res += ", ";
						res += child;
						isFirstChild = false;					
					}
					res += ")";
				}
				isFirstClass = false;
			}
			res += "\n  Stencil order:";
			for (Term stencil : binding.get("P").toTermArray()) res += " " + stencil;

			return res;
		}

	}
	
	
	public Schedule generateVisits(boolean isFixedOrder, boolean isExhaustive, boolean isSingle, int maxLen, AGEvaluator aleg, ALEParser ast) throws InvalidGrammarException {
		return new Schedule(new Reductions(ast), isFixedOrder, isExhaustive, isSingle, maxLen, aleg, ast.condsTop);
	}

	
	public class Schedule{
		public final ALEParser _ast;
		public CppGenerator cppGen = new CppGenerator(); 
		private final Query schedules;
		public final AGEvaluator _aleg;
		public final Reductions reductions;
		public final HashMap<AGEval.Class, ArrayList<Cond> > _conds;
		public final HashMap<String, AGEval.Class> classMap;
		
		//most recently iterated schedule
		public long time = 0;
		public Hashtable<Variable, Term> binding = null;
		public Vector<HashSet<AGEval.Class>> buSubInorderBuIn = null;
		public Vector<HashSet<AGEval.Class>> buSubInorderBus = null; 

		public Schedule (Reductions reducts, boolean isFixedOrder, boolean isExhaustive, boolean isSingle, int maxLen, AGEvaluator aleg, HashMap<AGEval.Class, ArrayList<Cond> > conds) throws InvalidGrammarException {
			reductions = reducts;
			_ast = ast;
			_aleg = aleg;
			_conds = conds;
			String queryString =
				(_ast.scheduleConstraintStr != null ? _ast.scheduleConstraintStr.replace("\"","") + ", \n" : "") +
				"sequenceClasses" + 
				(isFixedOrder ? "Fixed" + (isSingle ? "Single" :""):"") +				
				(isExhaustive ? "Exhaustive" : "") +
				"(O,P" +
				(isExhaustive ? (", " + maxLen) : "") +
				")";
			System.err.println("Query: " + queryString);
			long queryTime = -System.currentTimeMillis();
			Sanitizer s = new Sanitizer(true);
			s.allowTokens(_ast);
			s.simpleQuery(queryString);
			schedules = 
				new Query(queryString);
			//schedules = new Query("sequenceClasses" + (isFixedOrder ? "Fixed":"") + "(O,P)");
			queryTime += System.currentTimeMillis();
			if (verbose) System.out.println("Loaded query (" + queryTime + "ms)");
			if (verbose) System.out.println("Using fixed (first) ordering of children: " + isFixedOrder);
			
			classMap = new HashMap<String, AGEval.Class> (aleg.classes.size());
			for (AGEval.Class cls : aleg.classes) {
				 classMap.put(cls.getName().toLowerCase(), cls);
			}				
			
			
			if (!schedules.hasSolution()) {	
				throw new InvalidGrammarException("no solutions: " + new AGDebugger(AGEvaluatorSwipl.this).getError());
			}		
			
		}
		
		boolean hasNext () { return schedules.hasMoreSolutions(); }

		@SuppressWarnings("unchecked")
		Hashtable<Variable, Term>  moveNext () {
			time = -System.currentTimeMillis();
			binding = (Hashtable<Variable, Term>) schedules.nextSolution();
			time += System.currentTimeMillis();
			return binding;
		}
		
		boolean isAllParallel () {
			for (Term visit : binding.get("P").toTermArray()) {
				String stencil = visit.arg(2).arg(1).toString();
				if (stencil.equals("tdLtrU")) return false;
				//else System.err.println(stencil);
			}
			return true;
		}
		
		int numVisits () { return binding.get("P").toTermArray().length; }
		
		HashMap<AGEval.Class, ArrayList<String>> computeVisitOrders () throws InvalidGrammarException  {
			HashMap<String, AGEval.Class> cTable = new HashMap<String, AGEval.Class>(_aleg.classes.size());
			for (AGEval.Class c : _aleg.classes) cTable.put(c.getName().toLowerCase().replace("_", "uSCORE"), c);
			
			HashMap<AGEval.Class, ArrayList<String>> visitOrders = new HashMap<AGEval.Class, ArrayList<String> >(cTable.size());
			for (Term childOrder : binding.get("O").toTermArray()) {
				AGEval.Class c = cTable.get(childOrder.arg(1).toString());
				if (c == null) {
					throw new InvalidGrammarException("computeVisitOrders: Could not find: " + childOrder.arg(1));					
				}
				if (childOrder.arg(2).listLength() > 0) {
					ArrayList<String> visitOrder = new ArrayList<String>();
					for (Term child : childOrder.arg(2).toTermArray()) 
						visitOrder.add(child.toString());
					visitOrders.put(c, visitOrder);
				}
			}
			
			return visitOrders;			
		}
		
		public String printBindingShort (){
			Schedule sched = this;
			String res = "\n[";
			Boolean firstVisit = true;
			for (Term visit : sched.binding.get("P").toTermArray()) {
				
				if (firstVisit) firstVisit = false;
				else res += ", \n";
				
				res += "(";
				//0. Visit	
				res += "_,";
				//1. Direction
				String d = visit.arg(2).arg(1).toString();
				res += d + ",";
				//2. Prev
				res += "_,";				
				//3. Assume
				res += "_,";
				//4. VisitO classes
				res += "_)";
			}						
			return res + "]";
			
		}
		
		public String printBinding () {
			Schedule sched = this;
			
			String res = "\n[";
			Boolean firstVisit = true;
			for (Term visit : sched.binding.get("P").toTermArray()) {
				if (firstVisit) firstVisit = false;
				else res += ", \n";
				
				String d = visit.arg(2).arg(1).toString();
				res += "([";
				//Visit
				{
					Boolean first = true;
					for (Term t : visit.arg(1).toTermArray()) {
						if (first) first = false;
						else res += ",\n";
						String cls = t.arg(1).toString();
						res += "  [" + cls + ", ";
						Term[] node = t.arg(2).arg(1).toTermArray();
						res += "[" + node[0] + ", " + node[1] + ", " + node[2] + "]]";					
					}
				}
				//Direction
				res += "],\n " + d + ",";
				//Prev
				{
					//res += "_";
					
					res += "[";
					Boolean first = true;
					for (Term t : visit.arg(2).arg(2).arg(1).toTermArray()) {
						if (first) first = false;
						else res += ",\n";
						String cls = t.arg(1).toString();
						res += "  [" + cls + ", ";
						Term[] node = t.arg(2).arg(1).toTermArray();
						res += "[" + node[0] + ", " + node[1] + ", " + node[2] + "]]";					
					}
					res += "]";
				}
				//Assume
				res += ", ";
				{
					//res += "_";
					
					res += "[";
					Boolean first = true;
					for (Term t : visit.arg(2).arg(2).arg(2).arg(1).toTermArray()) {
						if (first) first = false;
						else res += ",\n";
						String cls = t.arg(1).toString();
						res += "  [" + cls + ", ";
						Term[] node = t.arg(2).arg(1).toTermArray();
						res += "[" + node[0] + ", " + node[1] + ", " + node[2] + "]]";					
					}
					res += "], ";
				}
				//VisitO classes
				{
					if (d.equals("buSubInorder")) {
						Term decomposition = visit.arg(2).arg(2).arg(2).arg(2);
						res += "\n((["; //BU
						{
							Boolean first = true;
							//System.err.println(decomposition.arg(1).arg(1).debugString());
							for (Term t : decomposition.arg(1).arg(1).toTermArray()) {
								if (first) first = false;
								else res += ",";
								res += t.toString();
							}				
						}
						res += "],["; //Inorder
						{
							Boolean first = true;
							//System.err.println(decomposition.arg(1).arg(2).debugString());
							for (Term t : decomposition.arg(1).arg(2).toTermArray()) {
								if (first) first = false;
								else res += ",";
								res += t.toString();
							}				
						}
						res += "]),(_,\n["; //BUInorder (subset of Inorder)
						{
							Boolean first = true;
							//System.err.println(decomposition.arg(2).arg(2).arg(1).debugString());
							for (Term t : decomposition.arg(2).arg(2).arg(1).toTermArray()) {
								if (first) first = false;
								else res += ",";
								res += t.toString();
							}				
						}
						res += "],_,_)))";
					} else {
						res += "\n_)";
					}
				}
				
				
				//======
			}
			
			
			return res + "]";
		}
		

	}


	public static void writeFile(String filePath, String val) throws IOException {
		FileWriter f = new FileWriter(new File(filePath));
		String tmp = filePath.endsWith(".pl") ? val : val.replace("uscore", "_");
		f.write(tmp);
		f.close();
		System.out.println("Generated: " + filePath);
	}

	
	public static Schedule getSchedules (String resourceDir, String friendlyGrammarDir, String grammarName, String outputDir, boolean write, boolean isFixedOrder, boolean isExhaustive, boolean isSingle, int maxLen, boolean verbose) throws Exception {
		final String friendlyGrammar = friendlyGrammarDir + grammarName;
		AleFrontend grammar = new AleFrontend(friendlyGrammar, AGEvaluatorSwipl.chainLoops, false);
		grammar.initFtl(!AGEvaluatorSwipl.chainLoops);
		AGEvaluatorSwipl ages = new AGEvaluatorSwipl(grammar.alegEval, grammar.ast, write);
		String prologGrammar = ages.alegAstToSwiplAst();		
		//int r = new Double(Math.random() * 1000000).intValue() % 1000000;
		File prettyGrammar = new File(friendlyGrammar);
		String prologGrammarPath = 
			outputDir + File.separator + 
			prettyGrammar.getName().split("\\.")[0] /*+ r*/ + ".pl";
		writeFile(prologGrammarPath, prologGrammar);
		if (verbose) {
			System.out.println("=== PL GRAMMAR ===\n" + prologGrammar);
		}
		ages.runGrammar(resourceDir, prologGrammarPath);
		return ages.generateVisits(isFixedOrder, isExhaustive, isSingle, maxLen, grammar.alegEval, grammar.ast);
		
	}	
	
}
