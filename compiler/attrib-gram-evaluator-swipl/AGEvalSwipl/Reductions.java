package AGEvalSwipl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map.Entry;
import java.util.Set;

import AGEval.InvalidGrammarException;
import aleGrammar.ALEParser;
import aleGrammar.ALEParser.Assignment;

public class Reductions {

	//schedule dependency generation
	public final ArrayList<Assignment> allLoopStatements = new ArrayList<Assignment>();
    public final HashMap<AGEval.Class, HashSet<String> > allClassReads = new HashMap<AGEval.Class, HashSet<String> >();
    public final HashMap<AGEval.Class, HashMap<String, String>> allClassLoopListReads = new HashMap<AGEval.Class, HashMap<String, String>>(); //class => read => loop (monomorphic in loop var)
    public final HashMap<AGEval.Class, HashSet<String> > allClassWrites = new HashMap<AGEval.Class, HashSet<String> >();
    
    //code generation (HTML5)
	public final HashMap<AGEval.Class, HashSet<String> > accessedAsLast = new HashMap<AGEval.Class, HashSet<String> >();
	public final HashMap<AGEval.Class, HashSet<String> > usesAcc = new HashMap<AGEval.Class, HashSet<String> >();
	public final HashMap<AGEval.Class, HashSet<String> > usesStep = new HashMap<AGEval.Class, HashSet<String> >();
	public final HashMap<AGEval.Class, HashMap<String, ArrayList<String> > > lastUses = new HashMap<AGEval.Class, HashMap<String, ArrayList<String> > >();

	//code generation (CPP)
	public final HashMap<AGEval.Class, HashSet<String> > sinks = new HashMap<AGEval.Class, HashSet<String>>();
	
	//public final HashMap<AGEval.Class, HashSet<String> > accessedAsAcc = new HashMap<AGEval.Class, HashSet<String> >();
		
	//public final ArrayList<Assignment> allStatements = new ArrayList<Assignment>();
	//public final ArrayList<Assignment> reductionStatements = new ArrayList<Assignment>();
	//public final HashMap<AGEval.Class, HashSet<String> > loopWrites = new HashMap<AGEval.Class, HashSet<String> >(); 
	//public final HashMap<AGEval.Class, HashSet<String> > loopReductionWrites = new HashMap<AGEval.Class, HashSet<String> >(); 
	//public final HashMap<AGEval.Class, HashSet<String> > accessedAsReduction = new HashMap<AGEval.Class, HashSet<String> >();
	
	public String getVarLoop(AGEval.Class c, String rhsRaw) throws Exception { //without annotations
		String rhs = rhsRaw.replace("_step1", "_step").replace("_step2", "_step").replace("_stepn", "_step").toLowerCase();
		if (rhs.contains("@") && !rhs.contains("self@")) return rhs.split("@")[0];
		if (rhs.contains("_step")) { //i_step or child_i_step
			if (rhs.split("_").length == 3) return rhs.split("_")[0];
			else rhs = rhs.replace("_step","");
		} else { //i or child_i
			if (rhs.split("_").length == 2) return rhs.split("_")[0];			
		}
		
		String read = allClassLoopListReads.get(c).get(rhs);
		if (read != null) return read;
		
		for (Assignment asgn : allLoopStatements) 
			if (asgn._class == c && asgn._sink.toLowerCase().equals(rhs))
				return asgn.loopVar;
		
		System.err.println("Cannot find loop var for: " + rhs);
		System.err.println(c.getName() + "::reads");
		for (Entry<String,String> e : allClassLoopListReads.get(c).entrySet()) {
			System.err.println("  " + e.getKey() + " => " + e.getValue());
		}
		System.err.println("Assigns: ");
		for (Assignment asgn : allLoopStatements) {
			if (asgn._class == c)
				System.err.println("  " + asgn._sink);
		}
		
		
		throw new Exception("Could not find loop for " + c.getName()+"::"+rhs);
	}
	
    public Reductions (ALEParser ast) throws InvalidGrammarException {    	
    	for (AGEval.Class cls : ast.classes) {
    		sinks.put(cls, new HashSet<String>());
    		accessedAsLast.put(cls, new HashSet<String>());
    		//accessedAsReduction.put(cls, new HashSet<String>());
    		usesAcc.put(cls, new HashSet<String>());
    		usesStep.put(cls, new HashSet<String>());
    		lastUses.put(cls, new HashMap<String, ArrayList<String> >()); //must end a loop where these are calc'd
    		allClassReads.put(cls, new HashSet<String>());
    		allClassLoopListReads.put(cls, new HashMap<String, String>());
    		allClassWrites.put(cls, new HashSet<String>());
    		//loopWrites.put(cls, new HashSet<String>());
    		//loopReductionWrites.put(cls, new HashSet<String>());
    		//accessedAsAcc.put(cls, new HashSet<String>());
    	}    	
    	gatherAssign(ast.assignments, /*sinks,*/ false, new ArrayList<String>()); //top-level assignments
    	gatherCond(ast.condsTop, /*sinks,*/ false, new ArrayList<String>());    	
    }
	
	private void gatherCase (ALEParser.Case cs, /*HashMap<AGEval.Class, HashSet<String>> sinks,*/ boolean liveStep, ArrayList<String> scopeLastUses) throws InvalidGrammarException  {
		gatherAssign(cs.assignments, /*sinks,*/ liveStep, scopeLastUses);	
	}

	private void gatherCond (HashMap<AGEval.Class, ArrayList<ALEParser.Cond> > cnds, /*HashMap<AGEval.Class, HashSet<String>> sinks,*/ 
			boolean liveStep, ArrayList<String> scopeLastUses) throws InvalidGrammarException  {
		for (ArrayList<ALEParser.Cond> cnda : cnds.values()) {
			for (ALEParser.Cond cnd : cnda) {
				boolean cndLiveStep = liveStep || variablesContains(cnd.testCase.indexedVariables.keySet(), "$i");
				ArrayList<String> cndLastUses = usesOfLast(cnd.testCase.indexedVariables.keySet());
				cndLastUses.addAll(scopeLastUses);				
				gatherCase(cnd.testCase, /*sinks,*/ cndLiveStep, cndLastUses);
				for (ALEParser.Case cs : cnd.elseifs) {
					cndLiveStep = cndLiveStep || variablesContains(cs.indexedVariables.keySet(), "$i"); //FIXME or do same for all cases?
					cndLastUses.addAll(usesOfLast(cs.indexedVariables.keySet()));
					gatherCase(cs, /*sinks, */cndLiveStep, cndLastUses);
				}
				//cndLiveStep = cndLiveStep || variablesContains(cnd.elseCase.indexedVariables.keySet(), "$i"); //FIXME or do same for all cases?
				//cndLastUses.addAll(usesOfLast(cnd.elseCase.indexedVariables.keySet()));
				gatherCase(cnd.elseCase, /*sinks,*/ cndLiveStep, cndLastUses);
			}
		}
	}

	private ArrayList<String> usesOfLast (Set<String> variables) {
		ArrayList<String> res = new ArrayList<String>();
		for (String v : variables) if (v.contains("$$")) res.add(v.replace("$$", ""));
		return res;
	}
	
	private boolean variablesContains (Set<String> variables, String suffix) {
		for (String v : variables) if (v.contains(suffix)) return true;
		return false;
	}
	private boolean asgnUsesStep (ALEParser.Assignment asgn) {
		if (usesStep.get(asgn._class).contains(asgn._sink.toLowerCase())) return true;
		if (asgn.isReduction) {
			if (variablesContains(asgn.startVariables.keySet(), "$i")) return true;
			if (variablesContains(asgn.stepVariables.keySet(), "$i")) return true;
		} else {
			if (variablesContains(asgn._variables.keySet(), "$i")) return true;
		}		
		return false;		
	}
	
	private boolean variablesUsesAcc(Set<String> variables) {
		for (String v : variables) if (v.contains("$-")) return true;
		return false;
	}
	private boolean asgnUsesAcc (ALEParser.Assignment asgn) {		
		if (usesAcc.get(asgn._class).contains(asgn._sink.toLowerCase())) return true;
		if (asgn.isReduction) {
			if (variablesUsesAcc(asgn.startVariables.keySet())) return true;
			if (variablesUsesAcc(asgn.stepVariables.keySet())) return true;
		} else {
			if (variablesUsesAcc(asgn._variables.keySet())) return true;
		}
		return false;		
	}
	
	
	
	//if reading self.loop- or self.loop$i, check in right loop
	//do not record read of self.x$$
	public void gatherAllReads(AGEval.Class cls, String lhs, HashMap<String, String> variables, String loopVar) throws InvalidGrammarException {
		if (variables == null) return;
		for (String v : variables.keySet()) {
			String cleanV = v.replace("$$", "").replace("$i", "").replace("$-", "").replace("[-1]", "");
			String cleanVFull = AGEvaluatorSwipl.attribBase(cleanV) + "@" + AGEvaluatorSwipl.attribName(cleanV); 
			allClassReads.get(cls).add(cleanV);
			if (!loopVar.equals("") && (v.contains("$$") || v.contains("$i") || v.contains("$-"))) {
				if (AGEvaluatorSwipl.attribBase(v).equals("self")) {
					String oldLoop = allClassLoopListReads.get(cls).get(cleanVFull);
					if (oldLoop != null && !oldLoop.equals(loopVar))
						throw new InvalidGrammarException("loop self::" + v + " var used in two different loops: " + loopVar + " and " + oldLoop);					
				}
				if (v.contains("$i") || v.contains("$-")) //ignore $$ 
					allClassLoopListReads.get(cls).put(cleanVFull, loopVar);
				else if (!allClassLoopListReads.get(cls).containsKey(cleanVFull)) 
					allClassLoopListReads.get(cls).put(cleanVFull, null); //might be from another loop
			}
		}
	}
	
	private void gatherAssign(HashSet<ALEParser.Assignment> assignments, /*HashMap<AGEval.Class, HashSet<String>> sinks,*/ 
			boolean liveStep, ArrayList<String> scopeLastUses) throws InvalidGrammarException {
					
		for (ALEParser.Assignment asgn : assignments) {
			//allStatements.add(asgn);
			allClassWrites.get(asgn._class).add(asgn._sink);
			gatherAllReads(asgn._class, asgn._sink, asgn._variables, asgn.loopVar);
			gatherAllReads(asgn._class, asgn._sink, asgn.startVariables, asgn.loopVar);
			gatherAllReads(asgn._class, asgn._sink, asgn.stepVariables, asgn.loopVar);
			
			if ("".equals(asgn.loopVar)) {
				for (String v : asgn._variables.keySet())
					  if (v.contains("$$")) accessedAsLast.get(asgn._class).add(v.replace("$$", "").toLowerCase());		
			} else {
				allLoopStatements.add(asgn);
				sinks.get(asgn._class).add(asgn._sink);
				if (asgn.isReduction) {
					//reductionStatements.add(asgn);
					//accessedAsReduction.get(asgn._class).add(asgn._sink.toLowerCase());
					//loopReductionWrites.get(asgn._class).add(AGEvaluatorSwipl.attribBase(asgn._sink) + "@"+ AGEvaluatorSwipl.attribName(asgn._sink));
				}
								
				//loopWrites.get(asgn._class).add(AGEvaluatorSwipl.attribBase(asgn._sink) + "@"+ AGEvaluatorSwipl.attribName(asgn._sink));

				boolean hasAcc = asgnUsesAcc(asgn); 
				if (hasAcc) usesAcc.get(asgn._class).add(asgn._sink.toLowerCase());
				if (liveStep || asgnUsesStep(asgn)) usesStep.get(asgn._class).add(asgn._sink.toLowerCase());

				if (!lastUses.get(asgn._class).containsKey(asgn._sink.toLowerCase())) 
					lastUses.get(asgn._class).put(asgn._sink.toLowerCase(), new ArrayList<String>());
				ArrayList<String> lasts = lastUses.get(asgn._class).get(asgn._sink.toLowerCase());
				lasts.addAll(scopeLastUses);
				if (asgn.isReduction) {
				  lasts.addAll(usesOfLast(asgn.startVariables.keySet()));
				  lasts.addAll(usesOfLast(asgn.stepVariables.keySet()));
				} else {
				  lasts.addAll(usesOfLast(asgn._variables.keySet()));
				}
				
				if (asgn.isReduction) {				  
				  for (String v : asgn.startVariables.keySet())
					  if (v.contains("$$")) accessedAsLast.get(asgn._class).add(v.replace("$$", ""));
				  for (String v : asgn.stepVariables.keySet())
					  if (v.contains("$$")) accessedAsLast.get(asgn._class).add(v.replace("$$", ""));				  
				} else {
				  for (String v : asgn._variables.keySet())
					  if (v.contains("$$")) accessedAsLast.get(asgn._class).add(v.replace("$$", ""));					
				}
				/*
				if (asgn.isReduction) {
					for (String v : asgn.startVariables.keySet())
						if (v.contains("$i")) accessedAsAcc.get(asgn._class).add(v.replace("$i", ""));
					for (String v : asgn.stepVariables.keySet())
						if (v.contains("$i")) accessedAsAcc.get(asgn._class).add(v.replace("$i", ""));				  
				} else {
					for (String v : asgn._variables.keySet())
						if (v.contains("$i")) accessedAsAcc.get(asgn._class).add(v.replace("$i", ""));					
				}
				*/
			}
		}	
	}

}
