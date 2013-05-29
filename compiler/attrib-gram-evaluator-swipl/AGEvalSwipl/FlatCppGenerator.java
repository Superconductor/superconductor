package AGEvalSwipl;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Map.Entry;
import java.util.Vector;

import jpl.Term;
import jpl.Variable;
import AGEval.AGEvaluator;
import AGEval.Class;
import AGEval.InvalidGrammarException;
import AGEvalSwipl.AGEvaluatorSwipl.Schedule;
import AGEvalSwipl.FlatCppFieldsHelper.Field;
import aleGrammar.ALEParser;
import aleGrammar.ALEParser.Assignment;

public class FlatCppGenerator implements Backend {
	static final String aleactions_filename = "aleactions.h";
	static final String fields_header_filename = "clustered_tree_generated_fields.h";
	static final String parse_body_filename = "clustered_tree_generated_parse.cpp";
	static final String unionvariants_filename = "unionvariants.h";
	static final String visit_header_filename = "clustered_tree_generated_visit.h";
	static final String visit_body_filename = "clustered_tree_generated_visit.cpp";
	
	private static final String generated_warning_header = "// Generated code. Modifcation to this file will be lost on next generation.\n\n";

	private FlatCppFieldsHelper fields;
	private Schedule sched;

	public static void main(String[] args) throws NumberFormatException, Exception {
		if (args.length == 7) {
			synthesizeFlatCpp(args[1], args[2], args[0], false, new Boolean(args[3]).booleanValue(), new Boolean(
					args[4]).booleanValue(), new Boolean(args[5]).booleanValue(), new Integer(args[6]).intValue());
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

	// Bootstrap the Generator to use this backend
	public static void synthesizeFlatCpp(String alePath, String outputDir, String resourceDir, boolean verbose,
			boolean isFixedChildOrder, boolean useFirstParallel, boolean isExhaustive, int maxLen) throws Exception {
		System.err.println("Setup for Flat C++ build: ");
		System.err.println("  Grammar: " + alePath);
		System.err.println("  Return first found: " + useFirstParallel);
		System.err.println("  Fixed child orders (lexical): " + isFixedChildOrder);
		System.err.println("  Include non-greedy schedules: " + isExhaustive);
		System.err.println("  Max number of visits: " + maxLen);
		System.err.println("  Algorithm: " + resourceDir);
		System.err.println("  Output dest: " + outputDir);
		System.err.println("  Chain loops: " + AGEvaluatorSwipl.chainLoops);
		GeneratorI g = AGEvaluatorSwipl.chainLoops ? new AbstractGenerator(new FlatCppGenerator()) : new Generator(
				new FlatCppGenerator());

		if (useFirstParallel)
			g.synthesize(alePath, outputDir, resourceDir, verbose, isFixedChildOrder, isExhaustive, maxLen, false);
		else
			g.synthesizeAll(alePath, outputDir, resourceDir, verbose, isFixedChildOrder, isExhaustive, maxLen, false);
	}

	@Override
	public void generateParseFiles(ALEParser ast, Schedule sched, String outputDir, boolean verbose,
			String functionHeaders) throws InvalidGrammarException {
		fields = new FlatCppFieldsHelper(ast, sched);
		this.sched = sched;
		
		try {
			AGEvaluatorSwipl.writeFile(outputDir + File.separator + aleactions_filename, generateAleHeader(functionHeaders));
			AGEvaluatorSwipl.writeFile(outputDir + File.separator + fields_header_filename, generateFieldsHeader());
			AGEvaluatorSwipl.writeFile(outputDir + File.separator + parse_body_filename, generateParseBody());
			AGEvaluatorSwipl.writeFile(outputDir + File.separator + unionvariants_filename, generateUnionvariants(ast, true));
		} catch (IOException e) {
			System.out.println("Failure to generate parse header into directory " + outputDir + ": " + e.toString());
			System.exit(1);
		}
			
		if (verbose) {
			System.out.println("=== Ale Actions ===: \n" + generateAleHeader(functionHeaders));
			System.out.println("=== Fields Declaration ===:\n" + generateFieldsHeader());
			System.out.println("=== Parse-related Function Definitions ===\n" + generateParseBody());
			System.out.println("=== Unionvariants Enum ===\n" + generateUnionvariants(ast, true));
		}
	}

	@Override
	public String output(String baseName, String visitOut, String visitDispatches, String outputDir, boolean write,
			boolean verbose, ALEParser ast, Schedule sched, String fHeaders, Hashtable<Variable, Term> binding,
			AGEvaluator aleg) throws IOException, InvalidGrammarException {
		if (write) {
			AGEvaluatorSwipl.writeFile(outputDir + File.separator + visit_header_filename,
					generateVisitHeader(sched._aleg));
			AGEvaluatorSwipl.writeFile(outputDir + File.separator + visit_body_filename,
					visitOut + visitDispatches);
		}
		if (verbose) {
			System.out.println("=== Visitor Header ===: \n" + generateVisitHeader(sched._aleg));
			System.out.println("=== Visitor Body ===: \n" + visitOut + visitDispatches);
		}
		return "(no Flat C++ out)";

	}

	@Override
	public String lhsToAddress(String lhs, Class cls, ALEParser ast) throws InvalidGrammarException {
		boolean isParent;
		String child;
		String prop;

		if (lhs.split("@").length == 2) {
			child = lhs.split("@")[0];
			isParent = child.equals("self");
			prop = lhs.split("@")[1];
		} else {
			child = ""; // silly Java
			isParent = true;
			prop = lhs;
		}

		if (isParent) {
			// If we're assigning the data to this node
			return fields.findCppField(cls, prop).getCppName() + "[index]";
		} else if (AbstractGenerator.childrenContains(ast.extendedClasses.get(cls).multiChildren.keySet(), child)) {			
			// If we're assigning to our multiple children inside a loop
			AGEval.IFace child_class = cls.getChildByName(child);
			return fields.findCppField(child_class, prop).getCppName() + "[current_node]";
		} else {
			// If we're assigning the data to our single child
			AGEval.IFace child_class = cls.getChildByName(child);
			FlatCppFieldsHelper.Field child_field = fields.findCppField(cls, "child_" + child + "_leftmost_child");
			String child_index = "GetAbsoluteIndex(" + child_field.getCppName() + ", index)";

			return fields.findCppField(child_class, prop).getCppName() + "[" + child_index + "]";
		}
	}

	@Override
	public String rhsToVal(String lhs, Class cls, ALEParser ast) throws InvalidGrammarException {
		boolean isParent;
		String child;
		String prop;

		// Determine if this is a parent or we're interested in this class, and
		// then determine the property name
		if (lhs.split("@").length == 2) {
			child = lhs.split("@")[0];
			isParent = child.equals("self");
			prop = lhs.split("@")[1];
		} else {
			if (ast.types.get("displayType").contains(lhs.toLowerCase()))
				return CppParserGenerator.toEnum(lhs);
			child = "self";
			isParent = true;
			prop = lhs;
		}

		String cleanProp = prop.replace("$-", "").replace("$$", "").replace("$i", "").toLowerCase();

		// $$ means access the last value calculated in a loop
		if (prop.contains("$$")) {
			if (isParent) {
				return fields.findCppField(cls, cleanProp).getCppRhsName() + "[index]";
			} else if (Generator.childrenContains(ast.extendedClasses.get(cls).multiChildren.keySet(), child)) {
				return fields.findCppField(cls, child + "_" + cleanProp + "_last").getCppRhsName() + "[index]";
			} else {
				throw new InvalidGrammarException("Cannot access $$ attrib of a non-multi child / self reduction: "
						+ lhs);
			}
			// $i means access the current iteration of a loop
		} else if (prop.contains("$i")) { // We're working with a multi child
			if (isParent) {
				throw new InvalidGrammarException("Cannot access $i of self attrib: " + lhs);
			} else if (Generator.childrenContains(ast.extendedClasses.get(cls).multiChildren.keySet(), child)) {
				AGEval.IFace child_class = cls.getChildByName(child);
				
				return fields.findCppField(child_class, cleanProp).getCppRhsName() + "[current_node]";
			} else {
				throw new InvalidGrammarException("Cannot access $i attrib of a non-multi child: " + lhs);
			}
			// $- means access the previous iteration of the loop
		} else if (prop.contains("$-")) {
			if (isParent) {
				return fields.findCppField(cls, cleanProp).getCppRhsName() + "[index]";
			} else if (Generator.childrenContains(ast.extendedClasses.get(cls).multiChildren.keySet(), child)) {
				String init = fields.findCppField(cls, child + "_" + cleanProp + "_last").getCppRhsName() + "[index]";
				String rest = fields.findCppField(cls.getChildByName(child), cleanProp).getCppRhsName() + "[PREV_FLATCPP()]";
				return "(STEP() == 1 ? (" + init + ") : (" + rest + "))";
			} else {
				throw new InvalidGrammarException("Cannot access $- attrib of a non-multi child: " + lhs);
			}
			// We're just working with regular variables
		} else {
			if (isParent) {
				return fields.findCppField(cls, cleanProp).getCppRhsName() + "[index]";
			} else if (ast.extendedClasses.get(cls).multiChildren.containsKey(child)) {
				return fields.findCppField(cls.getChildByName(child), cleanProp).getCppRhsName() + "[index]";
			} else {
				// If we're assigning the data to our single child
				FlatCppFieldsHelper.Field child_field = fields.findCppField(cls, "child_" + child + "_leftmost_child");
				String child_index = "GetAbsoluteIndex(" + child_field.getCppName() + ", index)";

				return fields.findCppField(cls.getChildByName(child), cleanProp).getCppRhsName() + "[" + child_index
						+ "]";
			}
		}
	}

	@Override
	public String asgnE(String lhs, String rhs) {
		 return lhs + " = " + rhs;
	}

	@Override
	public String asgnS(String lhs, String rhs) {
		return asgnE(lhs, rhs) + ";\n";
	}

	@Override
	public String toAcc(String lhsRaw, Class c) {
		String lhs = lhsRaw.toLowerCase();
		if (!lhs.contains("@")) return lhs + "_last";
		if (lhs.contains("self@")) return lhs.split("@")[1] + "_last";
		return lhs.replace("@", "_") + "_last";
	}

	@Override
	public String logStmt(int indentSrc, int indentOut, String msg, String rhs) {
		return "";
	}

	// Don't log anything
	@Override
	public String logStmtVar(int indentSrc, int indentOut, String msg, ALEParser ast, Class cls, String rhs,
			String rhsAddress) throws InvalidGrammarException {
		return "";
	}

	@Override
	public String printCurrentPipelineBuild(Hashtable<Variable, Term> binding) throws InvalidGrammarException {
		return "[printCurrentPipelineBuild]";
	}

	// Taken straight from the OpenCL backend
	@Override
	public String functionHeader(Assignment assign, ALEParser ast) throws InvalidGrammarException {
		StringBuilder contents = new StringBuilder();

		StringBuilder params = new StringBuilder();
		params.append("(");
		boolean isFirst = true;
		for (String arg : assign._variables.keySet()) {
			if (!isFirst) {
				params.append(", ");
			} else {
				isFirst = false;
			}

			ALEParser.ExtendedVertex ev = Generator.lookupAttributeExtended(arg, assign._class, ast);

			if (ev != null && ev.isMaybeType) {
				throw new InvalidGrammarException(
						"'maybe' types not currently implemented in Flat C++ backend. Yell at Matt.");
			} else {
				params.append(FlatCppFieldsHelper.typeStringToFlatCppType(Generator.extendedGet(ast, assign._class,
						arg).strType));
			}
			params.append(" " + assign._variables.get(arg));
		}
		params.append(")");

		contents.append("static ");
		contents.append(FlatCppFieldsHelper.typeStringToFlatCppType(Generator.extendedGet(ast, assign._class, assign._sink).strType));
		contents.append(" " + assign._class.getName().toLowerCase() + "_");
		contents.append(assign._sink.replace('.', '_').replace('@', '_') + " ");
		contents.append(params);
		contents.append(" { return " + assign._indexedBody + "; }\n");

		return contents.toString();
	}

	@Override
	public String visitHeader(Class cls, int visitNum, ALEParser ast) throws InvalidGrammarException {
		return "bool ClusteredTree::visit_" + cls.getName().toLowerCase() + "_" + visitNum 
				+ "(unsigned int index) {\n";
	}

	@Override
	public String visitFooter(Class cls, int visitNum, ALEParser ast) throws InvalidGrammarException {
		return "  return true;\n}\n\n";
	}

	@Override
	public String openChildLoop(Class parent_class, String loopVar, ALEParser ast) {
		return "SFORLOOPALIAS_FLATCPP(index, " + fields.findCppField(parent_class, "child_" + loopVar 
				+ "_leftmost_child").getCppName() + ", step) {\n";
	}

	@Override
	public String closeChildLoop() {
		return "  } SFORLOOPALIAS_FLATCPP_END();\n";
	}

	@Override
	public String openLastChild(Class cls, String loopVar) {
		return "    if (step == " + fields.findCppField(cls, "child_" + loopVar + "_count").getCppName() + "[index]) {\n"; 
	}

	@Override
	public String closeLastChild() {
		return "      break;\n    }\n";
	}

	@Override
	public String childrenRecur(Class cls, String childName, int visitNum, ALEParser ast)
			throws InvalidGrammarException {
		return "// Recur on current child\n\n  visit_" + visitNum + "(current_node);\n";
	}

	@Override
	public String childRecur(Class cls, String childName, int visitNum) throws InvalidGrammarException {
		FlatCppFieldsHelper.Field child_field = fields.findCppField(cls, "child_" + childName + "_leftmost_child");
		return "// Recur on fist child\n  visit_"+ visitNum + "(" + child_field.getCppName() + "[index]);\n";
	}

	@Override
	public String visitDispatcher(int visit, AGEvaluator aleg, HashSet<Class> buIns, HashSet<Class> bus) {
		// Flat C++ does not (yet) do suborder traversals
		if (buIns != null && buIns.size() > 0) {
			System.err.println("!!! FATAL ERROR !!! SubOrder traversals not supported in Flat C++");
			System.exit(-1);
		}
		if (bus != null && bus.size() > 0) {
			System.err.println("!!! FATAL ERROR !!! SubOrder traversals not supported in Flat C++");
			System.exit(-1);
		}
		
		StringBuilder contents = new StringBuilder();

		contents.append("bool ClusteredTree::visit_" + visit + "(unsigned int index) {\n");

		contents.append("\tswitch(" + fields.findCppField(null, "display").getCppRhsName() + "[index]) {\n");
		for (AGEval.Class cls : aleg.classes) {
			contents.append("\t\tcase TOK_" + cls.getName().toUpperCase() + ":\n");
			contents.append("\t\t\treturn visit_" + cls.getName().toLowerCase() + "_" + visit + "(index);\n");
		}
		
		contents.append("\t\tdefault:\n");
		contents.append("\t\t\tstd::cerr << \"Error: Node \" << index << \" has an unknown displayname of \"  << (enum unionvariants) displayname[index] << std::endl;\n");
		contents.append("\t\t\texit(-1);\n");
		
		contents.append("\t}\n}\n\n");

		return contents.toString();
	}

	@Override
	public String preVisits(AGEvaluator aleg, Schedule sched) {
		StringBuilder contents = new StringBuilder();
		contents.append(generated_warning_header);
		contents.append("#include \"clustered_tree.h\"\n");
		contents.append("#include \"sssmacros_flatcpp.h\"\n");
		contents.append("#include \"" + aleactions_filename + "\"\n");
		contents.append("#include <iostream>\n");
		contents.append("#include <cstdlib>\n\n");
		
		try {
			contents.append(generateRunTraversalsFunction(sched));
		} catch (InvalidGrammarException e) {
			System.err.println("!!!FATAL ERROR!!! Exception while attempting to generate _Gen_RunTraversals: " + e.getMessage());
			System.exit(-1);
		}
		
		return contents.toString();
	}

	@Override
	public String postVisits(AGEvaluator aleg, Schedule sched) throws InvalidGrammarException {
		return "";
	}

	@Override
	public String replaceTypeVals(String body, ALEParser ast) {
		return body;
	}
	
	
	///////////////////////////////////////////////////////////////////////////
	// Helper functions
	///////////////////////////////////////////////////////////////////////////
	
	// Copy+Paste from OpenCL backend
	// While the actual ale action functions are generated by functionHeaders() (whose results are correlated by the 
	// generator and handed back to us in generateParseFiles() and then sent here), this function adds includes and
	// other things needed to complete the header.
	private String generateAleHeader(String functionHeaders) {
		StringBuilder contents = new StringBuilder();

		contents.append("#ifndef ALEACTIONS_H\n");
		contents.append("#define ALEACTIONS_H\n\n");
		contents.append("// Shut compiler up about unused functions. There _will_ be unused functions.\n");
		contents.append("// Yes, kind of evil to do this, but useless compiler warnings are more evil.\n");
		contents.append("#pragma clang diagnostic ignored \"-Wunused-function\"\n\n");
		
		contents.append("#include \"pi.h\"\n");
		contents.append("#include \"paint_stubs.h\"\n");
		contents.append("#include <math.h>\n\n");

		contents.append(functionHeaders);

		contents.append("\n#endif // ALEACTIONS_H\n");

		return contents.toString();
	}
	

	private String generateFieldsHeader() {
		StringBuilder contents = new StringBuilder();
		contents.append(generated_warning_header);
		
		for(FlatCppFieldsHelper.Field field : fields.getFields()) {
			contents.append(field.getCppType() +"* ");
			contents.append(field.getCppName() + ";\n");
		}
		
		return contents.toString();
	}
	
	
	// Generated the clustered_tree_generated_parse.cpp file
	private String generateParseBody() {
		StringBuilder contents = new StringBuilder();
		contents.append(generated_warning_header);
		contents.append("#include \"clustered_tree.h\"\n\n");
		
		contents.append(generateConstructor());
		contents.append(generateDestructor());
		
		return contents.toString();
	}
	
	
	private String generateConstructor() {
		StringBuilder contents = new StringBuilder();
		
		contents.append("void ClusteredTree::ConstructGeneratedFields() {\n");
		
		for(FlatCppFieldsHelper.Field field : fields.getFields()) {
			contents.append("\t" + field.getCppName());
			contents.append(" = new " + field.getCppType() + "[_size];\n");
			
			// If this is a collection, fill it with empty data so that we don't accidentally loop over garbage 
			if(field.getCppName().contains("_count") || field.getCppName().contains("_leftmost_child")) {
				contents.append("\tstd::fill_n(" + field.getCppName() + ", _size, 0);\n");
			}
		}
		
		// Also fill right siblings with empty data
		contents.append("\tstd::fill_n(right_siblings, _size, 0);\n");
		
		contents.append("}\n\n\n");
		
		return contents.toString();
	}
	
	
	private String generateDestructor() {
		StringBuilder contents = new StringBuilder();
		
		contents.append("void ClusteredTree::DestructGeneratedFields() {\n");
		
		for(FlatCppFieldsHelper.Field field : fields.getFields()) {
			contents.append("\tdelete[] " + field.getCppName() + ";\n");
		}
		
		contents.append("}\n\n\n");
		
		return contents.toString();
	}
	
	
	
	public static HashMap<String, Integer> getTokens (HashMap<String, ArrayList<String>> types){
		HashMap<String, Integer> res = new HashMap<String, Integer>();				
		
		HashSet<String> names = new HashSet<String>();
		for (String name : types.keySet()) {
			for (String v : types.get(name)) {
				String token_name = CppParserGenerator.toEnum(v);
				names.add(token_name);
			}
		}
		
		Vector<String> sortedToks = new Vector<String>(names);
		Collections.sort(sortedToks);
		
		// Start the numbering at 5 so uninitialized data will be easier to detect when debugging
		int i = 5;
		for (String name : sortedToks){		
			res.put(name, i);
			i++;
		}
		
		return res;
	}
	
	
	public static String generateUnionvariants(ALEParser ast, boolean withWrapping) {
		StringBuilder contents = new StringBuilder();
		if (withWrapping){
			contents.append(generated_warning_header);
			contents.append("#ifndef UNIONVARIANTS_H\n");
			contents.append("#define UNIONVARIANTS_H\n\n");
		}

		contents.append("enum " + CppParserGenerator.clean("unionvariants") + " {");
		
		HashMap<String, Integer> tokens = getTokens(ast.types);
		boolean first = true;
		for (Entry<String, Integer>  entry : tokens.entrySet()) {
			if (first){ first = false; }
			else {
				contents.append(", ");
			}
			contents.append(entry.getKey());
			contents.append(" = ");
			contents.append(entry.getValue());
		}
		
		contents.append("};\n\n");
		
		if (withWrapping){
			contents.append("#endif // UNIONVARIANTS_H\n");
		}
		
		return contents.toString();
	}
	
	
	// Generates the contents of the header file for all the visit functions
	private String generateVisitHeader(AGEvaluator aleg) {
		StringBuilder contents = new StringBuilder();
		contents.append(generated_warning_header);
		contents.append("#ifndef CLUSTERED_TREE_VISIT_H\n");
		contents.append("#define CLUSTERED_TREE_VISIT_H\n\n");
		
		final int num_visits = sched.numVisits();

		for (int i = 0; i < num_visits; i++) {
			contents.append("bool visit_" + i + "(unsigned int index);\n");
			
			for (AGEval.Class cls : aleg.classes) {
				contents.append("bool visit_" + cls.getName().toLowerCase() + "_" + i);
				contents.append("(unsigned int index);\n");
			}
		}
		
		contents.append("\n#endif // CLUSTERED_TREE_VISIT_H\n");
		
		return contents.toString();
	}
	
	
	private String generateRunTraversalsFunction(Schedule sched) throws InvalidGrammarException {
		StringBuilder contents = new StringBuilder();

		contents.append("void ClusteredTree::_Gen_RunTraversals() {\n");
		Term[] visits = sched.binding.get("P").toTermArray();

		// The last traversal is the special render traversal, so don't write
		for (int i = 0; i < visits.length; i++) {
			String stencil = visits[i].arg(2).arg(1).toString();
			if (stencil.equals("tdLtrU")) {
				  contents.append("  visit_" + i + "(0);\n"); 
			} else if (stencil.equals("td")) {
				contents.append(generateTopDownTraversal("visit_" + i));
			} else if (stencil.equals("bu")) {
				contents.append(generateBottomUpTraversal("visit_" + i));
			} else {
				throw new InvalidGrammarException("Unsupported traversal order: " + stencil);
			}
		}
		contents.append("}\n\n\n");

		return contents.toString();
	}
	
	
	private String generateTopDownTraversal(String visitFunctionName) {
		StringBuilder contents = new StringBuilder();
		
		contents.append("\t// Top-down traversal\n");
		contents.append("\tfor (std::vector<ClusteredTree::level_info>::iterator i = levels.begin(); i < levels.end(); i++) {\n");
		contents.append("\t\tfor(unsigned int j = (i->start_idx); j < (i->start_idx) + (i->size); j++) {\n");
		contents.append("\t\t\t" + visitFunctionName + "(j);\n");
		contents.append("\t\t}\n");
		contents.append("\t}\n\n");
		
		return contents.toString();
	}
	
	
	private String generateBottomUpTraversal(String visitFunctionName) {
		StringBuilder contents = new StringBuilder();
		
		contents.append("\t// Bottom-up traversal\n");
		contents.append("\tfor (std::vector<ClusteredTree::level_info>::const_reverse_iterator i = levels.rbegin(); i != levels.rend(); i++) {\n");
		contents.append("\t\t\tfor(unsigned int j = (i->start_idx); j < (i->start_idx) + (i->size); j++) {\n");
		contents.append("\t\t\t" + visitFunctionName + "(j);\n");
		contents.append("\t\t}\n");
		contents.append("\t}\n\n");
		
		return contents.toString();
	}
}
