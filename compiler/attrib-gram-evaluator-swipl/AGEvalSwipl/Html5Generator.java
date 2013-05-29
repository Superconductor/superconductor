package AGEvalSwipl;

import java.io.File;
import java.io.IOException;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Map.Entry;

//import org.antlr.runtime.RecognitionException;

import aleGrammar.ALEParser;
import AGEval.AGEvaluator;
import AGEval.Class;
import AGEval.InvalidGrammarException;
import AGEvalSwipl.AGEvaluatorSwipl.Schedule;

import jpl.Term;
import jpl.Variable;

public class Html5Generator extends BackendBase implements Backend {	

	public String replaceTypeVals(String body, ALEParser ast) {
		String res = body;
		for (String t : ast.typeVals) 
			res = res.replace("ExtraDataHandler::TOK_" + t.toUpperCase(), "\"" + t.toLowerCase() + "\"");		
		return res;
	}
	
	public void generateParseFiles(ALEParser ast, Schedule sched, String outputDir, boolean verbose, String functionHeaders) throws InvalidGrammarException {
		//nothing
	}

	public String functionHeader(ALEParser.Assignment assign, ALEParser ast) {
		String fName = assign._class.getName().toLowerCase() + "_" + assign._sink.replace('.','_').replace('@','_').replace("[-1]", "_init");
		String params = "(";
		//String args = "(";				
		boolean isFirst = true;
		for (String arg : assign._variables.keySet()) {
			if (!isFirst) { 
				//args += ", "; 
				params += ", ";
				} else { 
					isFirst = false;
				}
			
			//args += arg;
			params +=  " " + assign._variables.get(arg);
		}
		params += ")";
		//args += ")";
		return //Vertex.typeToString(lookupAttribute(assign._sink, assign._class).myValueType)
			"//@type action\n" +
			"function " + fName + " " + params + " { return " + replaceTypeVals(assign._indexedBody, ast) + "; }\n";
//		System.out.println("// " + fName + args + ";");
	}
	
	public String visitHeader(Class cls, int visitNum, ALEParser ast) throws InvalidGrammarException {
		String res =
			"function visit_" + cls.getName().toLowerCase() + "_" + visitNum + "(node) {\n" 
			+ logStmt(2, 2, "visit " + " " + cls.getName() + " (id: \" + node.id + \")", "" + visitNum);
		return res;
	}
	
	public String visitFooter(Class cls, int visitNum, ALEParser ast) throws InvalidGrammarException {
		 return "  return true;\n}\n";
	}

	
	public String openChildLoop (AGEval.Class parent_class, String loopVar, ALEParser ast) {
		return   "(function () {\n"
			   + "    var children = getChildren(node, \"" + loopVar + "\", " + (anyVisitAllowsText(ast) ? "true" : "false") + ");\n"
			   + "    for (var i = 0; i < children.length; i++) {\n"
			   + "      var child = children[i]; \n";		
	}
	
	public String closeChildLoop() {
		return   "    }\n"
			   + "  })();\n";		
	}

	
	public String printCurrentPipelineBuild (Hashtable<Variable, Term> binding) throws InvalidGrammarException {
		String res = "function layout (root) {\n";
		int pass = 0;
		for (Term visit : binding.get("P").toTermArray()) {
			String stencil = visit.arg(2).arg(1).toString();
			if (stencil.equals("tdLtrU")) res += "  visit_" + pass + "(root); //inorder visitors handle recursion \n";				
			else if (stencil.equals("td")) res += "  inherit(visit_" + pass + ", root);\n";
			else if (stencil.equals("bu")) res += "  synthesize(visit_" + pass + ", root);\n";
			else if (stencil.equals("buSubInorder")) res += "  buSubInorder(visit_" + pass + ", root);\n";
			else throw new InvalidGrammarException("Unknown stencil type: " + stencil);
			pass++;			
		}			
		return res + "}\n";
	}
	
	
	public String logStmt(int indentSrc, int indentOut, String msg, String rhs) {
		String res = "";
		for (int i = 0; i < indentSrc; i++) res += " ";
		res += "logger.log(\"";
		for (int i = 0; i < indentOut; i++) res += " ";
		res += msg + ": \" + " + rhs + ")"; 
		return res + ";\n";
	}
	//JS can actually print nulls, hurray
	public String logStmtVar(int indentSrc, int indentOut, String msg, ALEParser ast, AGEval.Class cls, String rhs, String rhsAddress) throws InvalidGrammarException {
		return logStmt(indentSrc, indentOut, msg, rhsAddress);
	}
	
	public String asgnE(String lhs, String rhs) { return lhs + rhs + ")"; }
	public String asgnS(String lhs, String rhs) { return asgnE(lhs, rhs) + ";\n"; }
	
	
	public String lhsToAddress(String lhs, Class cls, ALEParser ast)
			throws InvalidGrammarException {
	  	boolean isParent;
	  	//boolean isParseData;
	  	String child;
	  	String prop;
	  	if (lhs.split("@").length == 2) {
	  		child = lhs.split("@")[0];
	  		isParent = child.equals("self");
	  		prop = lhs.split("@")[1];	  		
	  	} else {
	  		child = ""; //silly Java
	  		isParent = true;
	  		prop = lhs;
	  	}
	  	String childClean = child.toLowerCase();
	  	String propClean = prop.toLowerCase();
	  	//isParseData = (isParent ? cls : cls.getChildByName(child)).findVertexByExtName(prop).isVertexType(VertType.FIELD);	  		  	
	  	if (isParent) {
	  		return "setAttribSafe(node, \"" + propClean + "\", ";  
	  	} else if (Generator.childrenContains(ast.extendedClasses.get(cls).multiChildren.keySet(), child)) {
	  		return "setAttribSafe(child, \"" + propClean + "\", ";
	  	} else {
	  		return "setAttribSafe(getChildByRefName(node,\"" + childClean + "\"), \"" + propClean + "\", "; 
	  	}
	}


	public String getInputDefaultMaybe (AGEval.IFace cls, String cleanProp, ALEParser ast) {
		ALEParser.ExtendedVertex v = null;
		//class or interface
		try {
			for (Entry<String, ALEParser.ExtendedVertex> e : ast.extendedClasses.get(cls).extendedVertices.entrySet()) {			
				if (e.getKey().toLowerCase().equals(cleanProp)) {
					v = e.getValue();
					break;
				}
			}
		} catch (NullPointerException e) {
			System.err.println("null ptr ongetInputDefaultMaybe");
			System.err.println("prop: " + cleanProp);
			System.err.println("class: " + (cls == null ? "null" : cls.getName()));
			throw e;
		}
		if (v == null) {
			//interface
			for (Entry<String, ALEParser.ExtendedVertex> e : ast.extendedClasses.get(cls.getInterface()).extendedVertices.entrySet()) {
				if (e.getKey().toLowerCase().equals(cleanProp)) {
					v = e.getValue();
					break;
				}
			}
		}
		if (v == null || v.maybeDefault == null) return null;
		else {
			for (String t : ast.typeVals) 
				if (t.toLowerCase().equals(v.maybeDefault.toLowerCase())) 
					return "'" + t.toLowerCase() + "'";
			return "'" + v.maybeDefault + "'";		
		}
	}
	
	public String rhsToVal(String lhs, AGEval.Class cls, ALEParser ast)
			throws InvalidGrammarException {
		boolean isParent;
	  	String child;
	  	//AGEval.Class childInterface = null;
	  	String prop;
	  	if (lhs.split("@").length == 2) {
	  		child = lhs.split("@")[0];
	  		isParent = child.equals("self");
	  		prop = lhs.split("@")[1];	
	  		//if (prop.contains("$") && child.equals("self"))
	  		//	throw new InvalidGrammarException("Cannot use intra-reduction accessors (self$$, ...), caught on use " + child + " in " + lhs);
	  	} else {
	  		
	  		if (ast.types.get("displayType").contains(lhs)) return "'" + lhs.toLowerCase() + "'";
	  		
	  		child = ""; //silly Java
	  		isParent = true;
	  		prop = lhs;
	  	}
  		String cleanProp = prop.replace("$$", "").replace("$i","").replace("$-", "").replace("[-1]", "").toLowerCase();
	  	if (prop.contains("$$")) {
	  		if (isParent) {
		  		return "getAttribSafe(node, \"" + cleanProp + "\")";		  			
	  		} else if (Generator.childrenContains(ast.extendedClasses.get(cls).multiChildren.keySet(), child)) {
		  		return "getAttribSafe(node, \"" + child + "_" + cleanProp + "_last\")";		  			
	  		} else {
	  			throw new InvalidGrammarException("Cannot access $$ attrib of a non-multi child / self reduction: " + lhs);
	  		}
	  	} else if (prop.contains("$i")) {
	  		if (isParent) {
	  			//FIXME fine for reduction?...
	  			throw new InvalidGrammarException("Rhs: Cannot access $i of self attrib in class/interface " + cls.getName() + ": " + lhs);
	  			//return "getAttribSafe(node.getAttribute(\"" + cleanProp + "\"))";
	  		} else if (Generator.childrenContains(ast.extendedClasses.get(cls).multiChildren.keySet(), child)) {
	  			String maybeD = getInputDefaultMaybe(cls.getChildByName(child), cleanProp, ast);
	  			if (maybeD == null) {
	  				ALEParser.ExtendedVertex ev = Generator.lookupAttributeExtended(child + "@" + cleanProp, cls, ast);		
	  				return (ev != null && ev.isMaybeType) ? 
	  						("getInputMaybeAttribSafe(child, \"" + cleanProp + "\")")
	  						: ("getAttribSafe(child, \"" + cleanProp + "\")");
	  			} else return "getInputAttribSafe(child, \"" + cleanProp + "\", " + maybeD + ")";	  			
	  		} else {
	  			throw new InvalidGrammarException("Cannot access $i attrib of a non-multi child: " + lhs);
	  			//return "getAttribSafe(getChildByRefName(node,\"" + child + "\").getAttribute(\"" + cleanProp + "\"))";	
	  		}		  		
	  	} else if (prop.contains("$-")) {
	  		if (isParent) {
	  			return "getAttribSafe(node, \"" + cleanProp + "\")";
	  					//cleanProp + "_last"; //FIXME check acc assign happens last	
	  		} else if (Generator.childrenContains(ast.extendedClasses.get(cls).multiChildren.keySet(), child)) {
	  			return "getAttribSafe(i == 0 ? node : children[i-1], i == 0 ? (\"" + child.toLowerCase() + "_" + cleanProp + "_init\") : (\"" + cleanProp + "\"))";			  			
	  		} else {
	  			throw new InvalidGrammarException("Cannot access $- attrib of a non-multi child: " + lhs);
	  		}
	  	} else if (prop.contains("[-1]"))  {
	  		if (isParent) {
	  			throw new InvalidGrammarException("cannot use [-1] on a self attrib: " + lhs);	
	  		} else if (Generator.childrenContains(ast.extendedClasses.get(cls).multiChildren.keySet(), child)) {
	  			return "getAttribSafe(node, (\"" + child.toLowerCase() + "_" + cleanProp + "_init\"))";			  			
	  		} else {
	  			throw new InvalidGrammarException("Cannot access $- attrib of a non-multi child: " + lhs);
	  		}
	  		
	  	} else {
	  		if (isParent) {	  			
	  			String maybeD = getInputDefaultMaybe(cls, cleanProp, ast);
	  			if (maybeD == null) {
	  				ALEParser.ExtendedVertex ev = Generator.lookupAttributeExtended(prop, cls, ast);		
	  				return (ev != null && ev.isMaybeType) ? 
	  						("getInputMaybeAttribSafe(node, \"" + cleanProp + "\")") :
	  						("getAttribSafe(node, \"" + cleanProp+ "\")");
	  			}
	  			else return "getInputAttribSafe(node, \"" + cleanProp + "\", " + maybeD + ")";	  			
	  		} else if (Generator.childrenContains(ast.extendedClasses.get(cls).multiChildren.keySet(), child)) {
	  			//throw new InvalidGrammarException("Cannot read multichild attrib without indexer ($-, ...): " + cls.getName() + "::?? := ... " + lhs);
	  			//FIXME currently allowed because logging might read back on "loop ... { ... child.x := ... }"
	  			String maybeD = getInputDefaultMaybe(cls.getChildByName(child), cleanProp, ast);
	  			
	  			try {
		  			if (maybeD == null) {
		  				ALEParser.ExtendedVertex ev = Generator.lookupAttributeExtended(child + "@" + cleanProp, cls, ast);		
		  				return (ev != null && ev.isMaybeType) ? 
		  						("getInputMaybeAttribSafe(child, \"" + cleanProp + "\")") :
		  						("getAttribSafe(child, \"" + cleanProp + "\")");
		  			} else return "getInputAttribSafe(child, \"" + cleanProp + "\", " + maybeD + ")";
	  			} catch (InvalidGrammarException e) {
	  				throw new InvalidGrammarException("rhs val fail ( " + cls.getName() + "): " + lhs + " => " + prop + " => " + cleanProp + ", " + maybeD + "\n"
	  						+ e.getMessage());
	  			}
	  			
	  		} else {
  				String maybeD = getInputDefaultMaybe(cls.getChildByName(child), cleanProp, ast);
	  			if (maybeD == null) {
	  				ALEParser.ExtendedVertex ev = Generator.lookupAttributeExtended(child + "@" + cleanProp, cls, ast);		
	  				return (ev != null && ev.isMaybeType) ? 
	  						("getInputMaybeAttribSafe(getChildByRefName(node, \"" + child + "\"), \"" + cleanProp + "\")") :
	  						("getAttribSafe(getChildByRefName(node,\"" + child + "\"), \"" + cleanProp + "\")");
	  			} else  return "getInputAttribSafe(getChildByRefName(node, \"" + child + "\"), \"" + cleanProp + "\", " + maybeD + ")";	  			
	  		}
	  	}	
	}
	
	public String toAcc(String lhsRaw, AGEval.Class c) {
		String lhs = lhsRaw.toLowerCase();
		if (!lhs.contains("@")) return "getAttribSafe(node, \"" + lhs + "\")";
		if (lhs.contains("self@")) return "getAttribSafe(node, \"" + lhs + "\")";
		return lhs.replace("@", "_") + "_last";
	}
	
	
	
	
	
	public static void synthesizeHtml5(String alePath, String outputDir, String resourceDir, boolean verbose, boolean isFixedChildOrder, boolean useFirstParallel, boolean isExhaustive, int maxLen) throws Exception {
		System.err.println("Setup for HTML5 build: ");
		System.err.println("  Grammar: " + alePath);
		System.err.println("  Return first found: " + useFirstParallel);
		System.err.println("  Fixed child orders (lexical): " + isFixedChildOrder);
		System.err.println("  Include non-greedy schedules: " + isExhaustive);
		System.err.println("  Max number of visits: " + maxLen);
		System.err.println("  Algorithm: " + resourceDir);
		System.err.println("  Output dest: " + outputDir);
		System.err.println("  Chain loops: " + AGEvaluatorSwipl.chainLoops);
		GeneratorI g = AGEvaluatorSwipl.chainLoops ? new AbstractGenerator(new Html5Generator()) : new Generator(new Html5Generator());
		if (useFirstParallel)
			g.synthesize(alePath, outputDir, resourceDir, verbose, isFixedChildOrder, isExhaustive, maxLen, true);
		else 
			g.synthesizeAll(alePath, outputDir, resourceDir, verbose, isFixedChildOrder, isExhaustive, maxLen, true);
	}
	
	public static void main(String[] args) throws Exception {		
		if (args.length == 7) {
			synthesizeHtml5(args[1], args[2], args[0], false, new Boolean(args[3]).booleanValue(), new Boolean(args[4]).booleanValue(), new Boolean(args[5]).booleanValue(), new Integer(args[6]).intValue());
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

	public String openLastChild(AGEval.Class cls, String loopVar) {
		return "      if (i + 1 == children.length) {\n";
	}

	public String closeLastChild() {
		return "      }\n";
	}
	
	public boolean anyVisitAllowsText (ALEParser ast) {
		for (AGEval.Class c : ast.classes) if (c.getName().toLowerCase().equals("textbox")) return true;
		return false;
	}
	/*
	 * 
	public String visitAllowsText(AGEval.Class cls) throws InvalidGrammarException {
		
		AGEval.IFace f = null;
		for (Entry<String, AGEval.IFace> e : cls.getChildMappings().entrySet()) {
			if (e.getKey().toLowerCase().equals(childName.toLowerCase())) {
				f = e.getValue();
				break;
			}
		}
		if (f == null) throw new InvalidGrammarException("childrenRecur could not find child " + childName + " in " + cls.getName());
		boolean childCanBeText = false;
		for (AGEval.Class fc : f.getImplementingClasses()) {
			if (fc.getName().toLowerCase().equals("text")) {
				childCanBeText  = true;
				break;
			}
		}
		return ", " + (childCanBeText ? "true" : "false"); 

	}
	*/
	public String childrenRecur (AGEval.Class cls, String childName, int visitNum, ALEParser ast) throws InvalidGrammarException {		
			//  "  (function() {\n" 
			//+ "    var children = getChildren(node, \"" + childName + "\", " + (anyVisitAllowsText(ast) ? "true" : "false") + ");\n"
			//+ "    for (var i = 0; i < children.length; i++) {\n"
			//+ "      visit_" + visitNum+"(children[i]); //recur\n"
			//+ logStmt(6, 2, "resume visit " + cls.getName() + " (id: \" + node.id + \")", "" + visitNum)
			//+ "    }\n"
			//+ "  })();\n";
		return "      visit_" + visitNum + "(child, false, node); //recur\n";
	}
	public String childRecur(AGEval.Class cls, String childName, int visitNum) throws InvalidGrammarException {
		return "visit_" + visitNum + "(getChildByRefName(node, \"" + childName + "\"), false, node); //recur\n";
	}
	

	public String visitDispatcher(int visit, AGEvaluator aleg, HashSet<AGEval.Class> buIns, HashSet<AGEval.Class> bus) {
		HashSet<AGEval.Class> inIns = getInIns(aleg, bus, buIns);

		String res = 
			"function visit_"+ visit + " (node, isGlobalCall, parent) {\n" +
			"  if (node.nodeType == 1) {\n" +
			"    switch (node.tagName.toLowerCase()) {\n";
		boolean hasText = false;
		for (AGEval.Class cls : aleg.classes) {
			if (cls.getName().toLowerCase().equals("textbox")) {
				hasText = true;
				continue;
			} else {
				res += 
					"      case \"" + cls.getName().toLowerCase() + "\":\n";
				if (buIns != null && buIns.contains(cls)) { /* is inorder and may have bu parent: will be called 2x, need to dynamically filter out global variant*/
					res += 
					"        if (isGlobalCall && parent && isInorder(parent, " + visit + ")) return;\n";				
				} else if (buIns != null && inIns.contains(cls))	{
					res += 
					"        if (isGlobalCall && parent) return;\n";									
				}
				res += 
					"        logger.log(\"global: \" + isGlobalCall + \", parent: \" + parent);\n";
				res +=
					"        return visit_" + cls.getName().toLowerCase() + "_" + visit + "(node);\n";
			}
		}
		res += "    }\n";
		res += "  }\n";
		if (hasText) res += "  if (node.nodeType == 3) return visit_textbox_" + visit + "(node);\n";
		else res += "  if (node.nodeType == 3) { logger.log(\"skipping text node 2\"); return; }\n";
		res += "  throw (\"unknown node type for dispatch: \" + node.tagName);\n}\n";
		return res;
	}

	public String preVisits(AGEvaluator aleg, Schedule sched) {
		String res = 
			"function isInorder(node, pass) {\n" +
			"  switch (pass) {\n";
		for (int i = 0; i < sched.buSubInorderBuIn.size(); i++) {
			res += "    case " + i + ":\n";
			HashSet<AGEval.Class>bus = sched.buSubInorderBus.get(i);
			if (bus == null) {
				res += "     throw \"did not expect inorder call for pass " + i + "\";\n";
			} else {
				HashSet<AGEval.Class> ios = new HashSet<AGEval.Class>(aleg.classes);
				ios.removeAll(bus);
				res += "      switch (node.tagName.toLowerCase()) {\n";				
				for (AGEval.Class cls : ios)
					res += "        case \"" + cls.getName().toLowerCase() + "\": return true; \n";				
				res += "        default: return false;\n";
				res += "      }\n";
			}
		}
		res += "    default: throw (\"unknown pass \" + pass);\n";
		res += "  }\n";
		res += "}\n";
		return res;
	}

	public String postVisits(AGEvaluator aleg, Schedule sched) {
		return "";
	}

	public String output(String baseName, String visitOut, String visitDispatches, String outputDir, boolean write,
			boolean verbose, ALEParser ast, Schedule sched, String fHeaders, Hashtable<Variable, Term> binding, AGEvaluator aleg) throws IOException,
			InvalidGrammarException {
		String res = "";
		res += fHeaders;		
		res += visitOut;
		res += visitDispatches;
		res += printCurrentPipelineBuild(binding);
		
		AGEvaluatorSwipl.writeFile(outputDir + File.separator + baseName +".js", res);		
		return res;
	}

}
