package AGEvalSwipl;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Vector;

import jpl.Term;
import jpl.Variable;

import AGEvalSwipl.AGEvaluatorSwipl.Schedule;
import aleGrammar.ALEParser;

public class LoopRecoverer {
	public final ALEParser ast;	
	public final Hashtable<Variable, Term> binding;
	public final HashMap<AGEval.Class, ArrayList<String>> childOrders;	
	private final HashMap<AGEval.Class, Vector<SingleVisitRaw> > visitsRaw;
	public final HashMap<AGEval.Class, Vector<SingleVisitClean> > visitsClean;
	public final Reductions reducts;
	public enum Visits { PREORDER, POSTORDER, RECURSIVE, POSTORDERSUBRECURSIVE };
	public enum BlockType { LOOP, STATEMENT, UNKNOWN };
	
	public class Block {
		public final BlockType blockType;
		public final Vector<String> assignments;
		public final String maybeLoopVar; //may be null
		public Block (BlockType blockType_, Vector<String> assignments_) throws Exception {
			if (blockType_ == BlockType.LOOP) throw new Exception("Use loop constructor for loop");
			blockType = blockType_;
			assignments = assignments_;
			maybeLoopVar = null;
		}
		public Block (BlockType blockType_, Vector<String> assignments_, String loopVar) {
			blockType = blockType_;
			assignments = assignments_;
			maybeLoopVar = loopVar;
		}
	}
	public static String blockTypeToString (BlockType bt) {
		switch (bt) {
			case LOOP:
				return "LOOP";
			case STATEMENT:
				return "STATEMENT";
			case UNKNOWN:
				return "UNKNOWN";
			default:
				return "(invalid)";
		}
	}
	
	public String stencilToString (Visits mode) {
		return (mode == Visits.PREORDER) ? "td" : (mode == Visits.POSTORDER) ? "bu" : "inorder"; 
	}
	
	
	
	

	private AGEval.Class plNameToClass (Schedule sched, String name) {
		return sched.classMap.get(name);
		//for (AGEval.Class cls : ast.classes)
		//	if (cls.getName().toLowerCase().equals(name)) return cls;
		//throw new RuntimeException("Cannot deserialize pl class name: " + name);
	}
	
	private void handleStep (int visitI, Term action, HashSet<AGEval.Class> classFilter, AGEval.Class cls, HashMap<AGEval.Class, Vector<SingleVisitRaw> > res) {
		if (!classFilter.contains(cls)) return;
		
		Term[] vertex = action.toTermArray()[1].toTermArray();
		String lhsVertex = (vertex[0].toString().equals("self") ? "": (vertex[0].toString() + "@")) + vertex[1].toString();
		if (AGEvaluatorSwipl.chainLoopsChilds) {
			if (lhsVertex.contains("_step0")) return;
			if (lhsVertex.contains("unroll0@")) return;
			if (lhsVertex.contains("unroll1@")) return;
			if (lhsVertex.contains("unroll2@")) return;
			if (lhsVertex.contains("unrolln@")) return;
			if (res.get(cls).get(visitI).nodes.contains(lhsVertex+"_step2")) return;
			/*
			for (Assignment a : sched.reductions.allLoopStatements) { //FIXME do proper check for skipping self on self reductions (above + this are hacky)
				if (a._class == cls) {
					if ( (a._sink.replace("@", "_").toLowerCase()).equals(lhsVertex)) continue;								
				}
			}					
			*/	
		}
		res.get(cls).get(visitI).nodes.add(lhsVertex);		
	}
	
	private void handleRecur (int visitI, int childI, Term action, HashSet<AGEval.Class> classFilter, HashMap<AGEval.Class, Vector<SingleVisitRaw> > res) {
		//everybody recurs
		clss: for (AGEval.Class cls : classFilter) { //note diff class here
			ArrayList<String> visitOrder = childOrders.get(cls);
			if (visitOrder == null || visitOrder.size() <= childI) {
				continue clss;
			}						
			
			String childName = visitOrder.get(childI);
			if (AGEvaluatorSwipl.chainLoopsChilds) {
				if (childName.contains("unroll0")
						|| childName.contains("unroll1")
						|| childName.contains("unroll2")) continue;
			}
			
			res.get(cls).get(visitI).nodes.add(childName+"_recur");
			//if (Generator.childrenContains(sched._ast.extendedClasses.get(cls).multiChildren.keySet(), childName.replace("unroll0","")...));
		}			
	}
	
	private void handleMixed (Schedule sched, int visitI, HashSet<AGEval.Class> classFilter, Term visitO, HashMap<AGEval.Class, Vector<SingleVisitRaw> > res) {
		int childI = 0;			
		for (Term action : visitO.toTermArray()) { //.arg(2).arg(2).arg(2).arg(1).toTermArray()				
			if (action.isInteger()) {										
				//everybody recurs
				handleRecur(visitI, childI, action, classFilter, res);					
				childI++;
			} else { 
				handleStep(visitI, action, classFilter, sched.classMap.get(action.toTermArray()[0].toString()), res);
			}
		}
	}

	
	
	private void postorderSubInorderPass(Schedule sched, Term visit, int visitI, Visits mode, 
			HashMap<AGEval.Class, Vector<SingleVisitRaw> > res,  HashSet<AGEval.Class> bus, HashSet<AGEval.Class> buInorders) {
		Term visitO = visit.arg(2).arg(2).arg(2).arg(2);
				
		HashSet<AGEval.Class> postorderClasses = new HashSet<AGEval.Class>();
		HashSet<AGEval.Class> inorderWithPostorderParentClasses = new HashSet<AGEval.Class>();
		for (Term bu : visitO.arg(1).arg(1).toTermArray()) 
			postorderClasses.add(plNameToClass(sched, bu.toString()));
		for (Term buInorder : visitO.arg(2).arg(2).arg(1).toTermArray())
			inorderWithPostorderParentClasses.add(plNameToClass(sched, buInorder.toString()));
		HashSet<AGEval.Class> inorderWithInorderParentClasses = new HashSet<AGEval.Class>(ast.classes);
		inorderWithInorderParentClasses.removeAll(postorderClasses);
		inorderWithInorderParentClasses.removeAll(inorderWithPostorderParentClasses);
						
		for (AGEval.Class cls : ast.classes)			
			res.get(cls).add(new SingleVisitRaw(cls, postorderClasses.contains(cls.toString().toLowerCase()) ? Visits.POSTORDER : Visits.RECURSIVE));
						
		handleMixed(sched, visitI, postorderClasses, visitO.arg(2).arg(1), res);
		bus.addAll(postorderClasses);
		handleMixed(sched, visitI, inorderWithPostorderParentClasses, visitO.arg(2).arg(2).arg(2).arg(1), res);
		buInorders.addAll(inorderWithPostorderParentClasses);
		handleMixed(sched, visitI, inorderWithInorderParentClasses, visitO.arg(2).arg(2).arg(2).arg(2), res);
	}
	
	private HashMap<AGEval.Class, Vector<SingleVisitRaw> >  marshalRaw(Schedule sched) {
	/*			
		System.err.println("\n==================================\n");
		System.err.println("P= " + printBinding(sched));
		System.err.println("\n==================================\n");		
	*/	
		HashMap<AGEval.Class, Vector<SingleVisitRaw> > res = new HashMap<AGEval.Class, Vector<SingleVisitRaw> >();
		for (AGEval.Class cls : ast.classes) res.put(cls, new Vector<SingleVisitRaw>());		

		HashSet<AGEval.Class> allClasses = new HashSet<AGEval.Class>(ast.classes);		
		
		sched.buSubInorderBuIn = new Vector<HashSet<AGEval.Class>>();
		sched.buSubInorderBus = new Vector<HashSet<AGEval.Class>>();
		
		int visitI = 0;					 
		for (Term visit : binding.get("P").toTermArray()) {
			Visits mode = toStencil(visit.arg(2).arg(1).toString());
			if (mode == Visits.POSTORDERSUBRECURSIVE) {
				HashSet<AGEval.Class> buIns = new HashSet<AGEval.Class>();
				HashSet<AGEval.Class> bus = new HashSet<AGEval.Class>();
				postorderSubInorderPass(sched, visit, visitI, mode, res, bus, buIns);
				sched.buSubInorderBuIn.add(buIns);
				sched.buSubInorderBus.add(bus);												
			} else {
				sched.buSubInorderBuIn.add(null);
				sched.buSubInorderBus.add(null);
				for (AGEval.Class cls : ast.classes) 
					res.get(cls).add(new SingleVisitRaw(cls, mode));		
				handleMixed(sched, visitI, allClasses, visit.arg(2).arg(2).arg(2).arg(2), res);
			}
			visitI++;
		}	
		return res;
	}
	
	//convert SWI-PL schedule to something a little more legible
	public LoopRecoverer (Schedule sched) throws Exception {
		ast = sched._ast;
		binding = sched.binding;
		childOrders = sched.computeVisitOrders();
		reducts = new Reductions(ast);				
		visitsRaw = marshalRaw(sched);
		visitsClean = reconstructAll(visitsRaw);
/*
		System.out.println("=== outline");
		System.out.println(visitsRaw.toString());
		System.out.println("=== recovered");
		System.out.println(visitsClean.toString());
*/	
	}
	
	public static Visits toStencil (String stencil) throws ClassCastException {
		Visits mode;
		if (stencil.equals("td")) mode = Visits.PREORDER;
		else if (stencil.equals("bu")) mode = Visits.POSTORDER;
		else if (stencil.equals("tdLtrU")) mode = Visits.RECURSIVE;
		else if (stencil.equals("buSubInorder")) mode = Visits.POSTORDERSUBRECURSIVE;
		else throw new ClassCastException("Did not recognize stencil " + stencil);
		return mode;
	}
	
	public class SingleVisitRaw {
		public final AGEval.Class cls;
		public final Vector<String> nodes; //node or child_recur
		public final Visits mode;
		public SingleVisitRaw (AGEval.Class cls_, Visits mode_) {
			cls = cls_;
			nodes = new Vector<String>();			
			mode = mode_;
		}
		public String toString() { 
			String res = "";
			for (String a : nodes) res += (!a.contains("@") ? ("self@" + a) : a)  + "\n";
			return res;
		}
	}
	
	public class SingleVisitClean {
		public final AGEval.Class cls;
		public final Vector<Block> blocks; //node or child_recur
		public final Visits mode;
		public SingleVisitClean (AGEval.Class cls_, Visits mode_, Vector<Block> blocks_) {
			cls = cls_;
			blocks = blocks_;
			mode = mode_;
		}
				
		public String toString() { 
			String res = "";
			for (Block nodes : blocks) {				
				res += "block " + blockTypeToString(nodes.blockType) + " {\n";
				for (String a : nodes.assignments) res += "  " + (!a.contains("@") ? ("self@" + a) : a)  + "\n";
				res += "}\n";
			}
			return res;
		}
	}
	public SingleVisitClean toSingleVisitClean(SingleVisitRaw raw) throws Exception {
		return new SingleVisitClean(raw.cls, raw.mode, reconstructVisit (raw));
	}

	
	
	
	public String toStringRaw () {
		String res = "";
		int visit = 0;
		traversals: while (true) {
			AGEval.Class someC = visitsRaw.keySet().iterator().next();
			if (visitsRaw.get(someC).size() == visit) break traversals;
			res += "Visit " + visit + " (" + stencilToString(visitsRaw.get(someC).get(visit).mode) + ")\n";			
			for (AGEval.Class c : visitsRaw.keySet()) {				
				res += "  class " + c.getName() + "\n    " + visitsRaw.get(c).get(visit).toString().replace("\n", "\n    ") + "\n";
			}
			visit++;
		}
		return res;
	}
	public String toStringClean () {
		String res = "";
		int visit = 0;
		traversals: while (true) {
			AGEval.Class someC = visitsClean.keySet().iterator().next();
			if (visitsClean.get(someC).size() == visit) break traversals;
			res += "Visit " + visit + " (" + stencilToString(visitsClean.get(someC).get(visit).mode) + ")\n";			
			for (AGEval.Class c : visitsClean.keySet()) {				
				res += "  class " + c.getName() + "\n    " + visitsClean.get(c).get(visit).toString().replace("\n", "\n    ") + "\n";
			}
			visit++;
		}
		return res;
	}

	
	public HashSet<String> expandLoopVars(Collection<String> prefixes, Vector<String> nodes) {
		HashSet<String> res = new HashSet<String>();
		for (String pfx : prefixes) {
			if (nodes.contains(pfx+"_step0")) res.add(pfx + "_step0");
			if (nodes.contains(pfx+"_step1")) res.add(pfx + "_step1");
			if (AGEvaluatorSwipl.chainLoopsChilds) res.add(pfx + "_step2");
			if (nodes.contains(pfx+"_stepn")) res.add(pfx + "_stepn");
		}		
		return res;
	}
	
	//{ n | (k0|n0)...(k1|n1)...(kn|nn) }  where key is prefix (no _step*)
	//FIXME loop transfers?
	//intra-loop recurs are handled after
	public HashSet<String> loopChainEquiv (AGEval.Class c, String key, Vector<String> nodes) throws Exception {		
		if (!key.contains("_stepn")) throw new Exception("loopChain based on a _stepn key");
		if (key.contains("_stepn_stepn")) throw new Exception("loopChain contains _stepn_stepn key!");
		//System.err.println("Key: " + key);
		HashSet<String> res = new HashSet<String>();
		
		String keyName = key.replace("_stepn","");
		String keyLoop = reducts.getVarLoop(c, key.replace("_stepn", ""));

		int key0 = nodes.lastIndexOf(keyName+"_step0");
		int key1 = nodes.lastIndexOf(keyName+"_step1");
		int key2 = AGEvaluatorSwipl.chainLoopsChilds ? nodes.lastIndexOf(keyName+"_step2") : -1;		
		int keyn = nodes.lastIndexOf(keyName+"_stepn");
		for (String n : nodes) 
			if (n.contains("_step1")) {
				String nBase = n.replace("_step1", "");
				String nLoop = reducts.getVarLoop(c, nBase);
				if (!keyLoop.equals(nLoop)) continue;				
				int n0 = AGEvaluatorSwipl.chainLoopsChilds ? -1 : nodes.lastIndexOf(nBase + "_step0");
				int n1 = nodes.lastIndexOf(nBase + "_step1");
				int n2 = nodes.lastIndexOf(nBase + "_step2");
				int nn = nodes.lastIndexOf(nBase + "_stepn");
				if (AGEvaluatorSwipl.chainLoopsChilds) 
					if (!((n1 < key2) && (key1 < n2) && (n2 < keyn || keyn == -1) && (key2 < nn || nn == -1))) 
						continue;
				else
					if (!((n0 < key1) && (key0 < n1) && (n1 < keyn || keyn == -1) && (key1 < nn || nn == -1))) 
						continue;				
				res.add(nBase);				
			}		
		if (!res.contains(key.replace("_stepn", ""))) {
			for (String n : nodes) 
				System.err.println("  node: " + n);
			throw new Exception("Equiv loop for " + key + " lost self");
		}
		return res;		
	}
	
	

	public class TOSort implements Comparator<String> {
		public final Vector<String> TO;
		public TOSort(Vector<String> TO_) {
			TO = TO_;			
		}
		public int compare (String o1, String o2) {
			int o1i = TO.lastIndexOf(o1);
			int o2i = TO.lastIndexOf(o2);
			return o1i - o2i;
		}
		public Vector<String> sort (Collection<String> data) {
			Vector<String> res = new Vector<String>(new HashSet<String>(data));
			Collections.sort(res, this);
			return res;
		}
		public void inplaceSort(Vector<String> data) {
			Vector<String> res = sort(data);
			data.clear();
			data.addAll(res);
		}
	}
	
	public HashSet<String> subtract(Collection<String> orig, Collection<String> oper) {
		HashSet<String> res = new HashSet<String>();
		for (String s : orig) if (!oper.contains(s)) res.add(s);
		return res;		
	}
	
	//for c_step0  ... c_step1,  x* in ... that *must* move before
	//   let C = {c,d...} be loops chained with c
	//     any E = { e | e < c_step0 for c in C} //chain loop pre
	//     any D = { d | d_stepn < c_step0 for c in C } //guaranteed not to be chained to C
	//     any D' = { d | d chained with d' in D} //d'_step1 < c_step1, but d'_stepn may be anywhere
	//   PRE = E U D U D' (following original order)
	//     no need to expand search: d/d'_step0 is in (c_step0,c_step1) and therefore so are its E's	
	//Tricky: move any childsunrolln_recur from childs_x_step2 childsunrolln_recur childs_x_stepn  
	//
	public Vector<String> pre (AGEval.Class c, Vector<String> nodes) throws Exception {
		if (nodes.size() == 0 || !isLoopStart(nodes.get(0))) throw new Exception("Pre should start on a loop");			
		
		String endSeg = AGEvaluatorSwipl.chainLoopsChilds ? nodes.get(0).replace("_step1", "_step2") : nodes.get(0).replace("_step0", "_step1");
		Vector<String> E = new Vector<String>(); 	//D chain may depend on these (can refine, but no need)
													//may also contain transfers (is consistent) 
		Vector<String> D = new Vector<String>(); //stripped
		for (String n : nodes) { 
			if (n.equals(endSeg)) break; 
			if (n.contains("_stepn")) D.add(n.replace("_stepn", ""));
			else if (!n.contains("_step")) E.add(n);			
		}
		HashSet<String> DEquiv = new HashSet<String>();
		for (String d : D) 
			DEquiv.addAll(loopChainEquiv (c, d + "_stepn", nodes));		
		HashSet<String> unordered = new HashSet<String>(E);
		unordered.addAll(expandLoopVars(D, nodes));
		unordered.addAll(expandLoopVars(DEquiv, nodes));
		return new TOSort(nodes).sort(unordered);
	}
	
	public HashSet<String> loopRecurs(AGEval.Class c, Collection<String> loopEquivCanonical, Vector<String> nodes) throws Exception {		
		HashSet<String> res = new HashSet<String>();
		int maxPreN =  0;
		int maxPostN = 0;
		for (String l : loopEquivCanonical) {
			String preN = l + (AGEvaluatorSwipl.chainLoopsChilds ? "_step2" : "_step1"); 
			maxPreN = Math.max(maxPreN, nodes.indexOf(preN));
			maxPostN = Math.max(maxPostN, nodes.indexOf(l + "_stepn")); //FIXME none might not exist if pure writes: do between 1 and 2 instead?
		}
		String loopVar = reducts.getVarLoop(c, loopEquivCanonical.iterator().next());
		int recurIdx = nodes.indexOf(loopVar +"unrolln_recur"); 
		if (maxPreN < recurIdx && maxPostN > recurIdx) {
			res.add(nodes.get(recurIdx));
//			System.err.println("Hit!");
		} else {
//			System.err.println("Miss: " + loopVar +"unrolln_recur");
		}
		return res;
				
	}
	
	public void reconstructLoop(AGEval.Class c, Vector<String> nodes, Vector<String> pre, Vector<String> self, Vector<String> post) throws Exception {
		if (nodes.size() == 0 || !isLoopStart(nodes.get(0))) throw new Exception("reconstructLoop should start on a loop");			

		String nBase = AGEvaluatorSwipl.chainLoopsChilds ? nodes.get(0).replace("_step1","") : nodes.get(0).replace("_step0","");
		
		pre.addAll(pre(c, nodes));
		HashSet<String> loopEquivCanonical = loopChainEquiv(c, nBase + "_stepn", nodes);
		if (loopEquivCanonical.size() == 0) throw new Exception("Empty loop equiv! (should be one or more)"); 
		
		self.addAll(expandLoopVars(loopEquivCanonical, nodes));
		self.addAll(loopRecurs(c, loopEquivCanonical , nodes));
		post.addAll(subtract(subtract(nodes, pre), self));

		/*
		System.err.println("================");
		System.err.println("Nodes:");
		for (String n : nodes) System.err.print(" " + n);
		System.err.println("\n  ==Pre (unsorted)==>");
		for (String n : pre) System.err.print(" " + n);
		System.err.println();
		System.err.println("\n  ==Self (unsorted)==>");
		for (String n : self) System.err.print(" " + n);
		System.err.println();
		System.err.println("\n  ==Post (unsorted)==>");
		for (String n : post) System.err.print(" " + n);
		System.err.println("\n\n");
		*/
		if (pre.size() + self.size() + post.size() != nodes.size()) {
			System.err.println("Dropped/added nodes on loop reconstruction!");
			System.err.println("  Originally: "+ nodes.size());
			System.err.println("  => pre: " + pre.size());
			System.err.println("  => loop: " + self.size());
			System.err.println("  => post: " + post.size());
			throw new Exception("Bad move");
		}
		
		TOSort s = new TOSort(nodes);
		s.inplaceSort(pre);
		s.inplaceSort(self);
		s.inplaceSort(post);
/*		
		System.err.println("------------");
		System.err.println("Nodes:");
		for (String n : nodes) System.err.print(" " + n);
		System.err.println("\n  ==Pre (sorted)==>");
		for (String n : pre) System.err.print(" " + n);
		System.err.println();
		System.err.println("\n  ==Self (sorted)==>");
		for (String n : self) System.err.print(" " + n);
		System.err.println();
		System.err.println("\n  ==Post (sorted)==>");
		for (String n : post) System.err.print(" " + n);
		System.err.println("\n\n");
*/
	}
			
	public HashMap<AGEval.Class, Vector<SingleVisitClean> > reconstructAll (HashMap<AGEval.Class, Vector<SingleVisitRaw> > raw) throws Exception {
		HashMap<AGEval.Class, Vector<SingleVisitClean> > res = new HashMap<AGEval.Class, Vector<SingleVisitClean> >();
		for (AGEval.Class cls : ast.classes) {
			Vector<SingleVisitClean> clsV = new Vector<SingleVisitClean>();
			for (SingleVisitRaw vr : raw.get(cls)) clsV.add(toSingleVisitClean(vr));
			res.put(cls, clsV);
		}
		return res;
	}
	
	public static boolean isLoopStart (String n) {
		return AGEvaluatorSwipl.chainLoopsChilds ? n.contains("_step1") : n.contains("_step0");
	}
	public Vector<Block> reconstructVisit (SingleVisitRaw v) throws Exception {
		
		Vector<Block> blocks = new Vector<Block>();
		blocks.add(new Block(BlockType.UNKNOWN, v.nodes));
		if (v.nodes.size() == 0) {
			blocks.clear(); //remove empty UNKNOWN			
			return blocks;
		}
		HashSet<Block> done = new HashSet<Block>();
		while (true) {
			Vector<Block> nextBlocks = new Vector<Block>();
			boolean allDone = true;
			for (Block b  : blocks) {
				if (done.contains(b)) {
					if (b.blockType == BlockType.UNKNOWN) throw new Exception("adding unknown!");
					nextBlocks.add(b);
				} else {			
					Vector<String> nodes = b.assignments;
					String first = nodes.get(0);
					if (isLoopStart(first)) {
						Block pre = new Block(BlockType.UNKNOWN, new Vector<String>());	
						Block loop = new Block(BlockType.LOOP, new Vector<String>(), reducts.getVarLoop(v.cls, first));
						Block post = new Block(BlockType.UNKNOWN, new Vector<String>());
						reconstructLoop(v.cls, nodes, pre.assignments, loop.assignments, post.assignments);
						done.add(loop);						
						if (pre.assignments.size() > 0) {
							nextBlocks.add(pre);
							allDone = false;
						}
						if (loop.assignments.size() == 0) 
							throw new Exception("Empty loop for " + nodes.get(0) + "!");
						else {
							nextBlocks.add(loop); //done
						}
						if (post.assignments.size() > 0) {
							nextBlocks.add(post);
							allDone = false;
						}
					} else if (first.contains("unrolln_recur")) {
						Block loop = new Block(BlockType.LOOP, new Vector<String>(), first.split("unrolln_")[0]);
						loop.assignments.add(first);
						done.add(loop);
						nextBlocks.add(loop);
						if (nodes.size() > 1) {
							nodes.remove(0);
							nextBlocks.add(b);
							allDone = false;
						}
					} else {
						Block nonLoopPre = new Block(BlockType.STATEMENT, new Vector<String>());
						for (String n : nodes) {
							if (isLoopStart(n)) break;
							if(n.contains("unrolln_recur")) break;
							nonLoopPre.assignments.add(n);
						}
						Vector<String> rest = new Vector<String>(subtract(nodes, nonLoopPre.assignments));
						Collections.sort(rest, new TOSort(nodes));
						
						if (nonLoopPre.assignments.size() == 0) throw new Exception("Empty nonLoop pre!");
						done.add(nonLoopPre);
						nextBlocks.add(nonLoopPre);						
						if (rest.size() > 0) {
							nextBlocks.add(new Block(BlockType.UNKNOWN, rest));
							allDone = false;
						}
					}
				}
			}
			blocks = nextBlocks;
			if (allDone) break;			
		}
		return blocks;
	}
	
	
	public static void main(String[] args) throws Exception {
		if (args.length != 3) {
			System.err.println("Expected 3 args:");
			System.err.println("  0: resourceDir (..-swipl/AGEvalSwipl)");
			System.err.println("  1: outputDir (..-ftl/)");
			System.err.println("  2: inputDir (..-swipl/Tests/");			
		}
		String name = "crossChain3";
		String testName = name + ".ale";
		
		AGEvaluatorSwipl.Schedule sched;
		sched = AGEvaluatorSwipl.getSchedules(args[0] + File.separator,  args[2] + File.separator, testName,  args[1] + File.separator, false, true, false, true, 20, false);
		if (!sched.hasNext()) {
			System.err.println("  " + name + ": no soln");
			throw new Exception("blah");
		}
		sched.moveNext();
		
		LoopRecoverer lr = new LoopRecoverer(sched);
		
		System.out.println("====Raw===");
		System.out.println(lr.toStringRaw());
		System.out.println("====Reconstructed===");
		System.out.println(lr.toStringClean());
		
		
	}
	
}
