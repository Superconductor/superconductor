package AGEvalSwipl;

// TODO: Get default values working
// TODO: Generate getters and setters for C++ class for all fields


import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Vector;

import jpl.Term;
import jpl.Variable;
import AGEval.AGEvaluator;
import AGEval.Class;
import AGEval.InvalidGrammarException;
import AGEvalSwipl.AGEvaluatorSwipl.Schedule;
import AGEvalSwipl.OpenCLFieldsHelper.Field;
import aleGrammar.ALEParser;
import aleGrammar.ALEParser.Assignment;

public class OpenCLGenerator implements Backend {
	static final String aleactions_filename = "cl_generated_aleactions.h";
	static final String buffer_info_filename = "cl_runner_generated_buffer_info.h";
	static final String clrunner_parse_header_filename = "cl_runner_generated_parse.h";
	static final String clrunner_parse_body_filename = "cl_runner_generated_parse.cpp";
	static final String clrunner_visit_header_filename = "cl_runner_generated_visit.h";
	static final String clrunner_visit_body_filename = "cl_runner_generated_visit.cpp";
	static final String traversals_filename = "traversals.cl";

	static final String generated_warning_header = "// Generated code. Modifcation to this file will be lost on next code generation.\n\n";
	static final String version = "0.1";
	static DateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
	static String generation_date = dateFormat.format(Calendar.getInstance().getTime());

	public OpenCLFieldsHelper fields;
	private Schedule sched;

	public static void main(String[] args) throws NumberFormatException, Exception {
		if (args.length == 7) {
			synthesizeOpenCL(args[1], args[2], args[0], false, new Boolean(args[3]).booleanValue(),
					new Boolean(args[4]).booleanValue(), new Boolean(args[5]).booleanValue(),
					new Integer(args[6]).intValue());
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
	public static void synthesizeOpenCL(String alePath, String outputDir, String resourceDir, boolean verbose,
			boolean isFixedChildOrder, boolean useFirstParallel, boolean isExhaustive, int maxLen) throws Exception {
		System.err.println("Setup for OpenCL build: ");
		System.err.println("  Grammar: " + alePath);
		System.err.println("  Return first found: " + useFirstParallel);
		System.err.println("  Fixed child orders (lexical): " + isFixedChildOrder);
		System.err.println("  Include non-greedy schedules: " + isExhaustive);
		System.err.println("  Max number of visits: " + maxLen);
		System.err.println("  Algorithm: " + resourceDir);
		System.err.println("  Output dest: " + outputDir);
		System.err.println("  Chain loops: " + AGEvaluatorSwipl.chainLoops);
		GeneratorI g = AGEvaluatorSwipl.chainLoops ? new AbstractGenerator(new OpenCLGenerator()) : new Generator(
				new OpenCLGenerator());
		if (useFirstParallel)
			g.synthesize(alePath, outputDir, resourceDir, verbose, isFixedChildOrder, isExhaustive, maxLen, false);
		else
			g.synthesizeAll(alePath, outputDir, resourceDir, verbose, isFixedChildOrder, isExhaustive, maxLen, false);
	}

	// //////////////////////////////////////////////////////////////////////////
	// Backend interface
	// //////////////////////////////////////////////////////////////////////////

	// Write out the files associated with the AST (fields, etc.)
	// First method called by generator, first to see AST
	@Override
	public void generateParseFiles(ALEParser ast, Schedule sched, String output_dir, boolean verbose, String ale_actions)
			throws InvalidGrammarException {
		fields = new OpenCLFieldsHelper(ast, sched);
		this.sched = sched;

		try {
			AGEvaluatorSwipl.writeFile(output_dir + File.separator + aleactions_filename, generateAleHeader(ale_actions, true));
			AGEvaluatorSwipl.writeFile(output_dir + File.separator + buffer_info_filename, generateBufferInfo(true));
			AGEvaluatorSwipl.writeFile(output_dir + File.separator + clrunner_parse_header_filename, generateCLRunnerHeader());
			AGEvaluatorSwipl.writeFile(output_dir + File.separator + clrunner_parse_body_filename, generateCLRunnerBody());
		} catch (IOException e1) {
			System.err.println("!!! FATAL ERROR !!! Could not write parse files into directory " + output_dir);
		}
		
		if(verbose) {
			System.out.println("=== Ale Actions ===\n" + generateAleHeader(ale_actions, true));
			System.out.println("=== Buffer Info ===\n" + generateBufferInfo(true));
			System.out.println("=== CLRunner Parse Header ===\n" + generateCLRunnerHeader());
			System.out.println("=== CLRunner Parse Body ===\n" + generateCLRunnerBody());
		}
		
		writeFlatCppData(ast, sched, output_dir, verbose);
	}

	// Write the source code gathered by the Generator into whatever
	// backend-specific files they need to go in.
	// TODO: Just write out visitDispatched argument rather than calling visitDispatchers() in postVisits()
	@Override
	public String output(String baseName, String visitOut, String visitDispatches, String outputDir, boolean write,
			boolean verbose, ALEParser ast, Schedule sched, String fHeaders, Hashtable<Variable, Term> binding,
			AGEvaluator aleg) throws IOException, InvalidGrammarException {
		if (write) {
			// Write out CLRunner's visitor header
			AGEvaluatorSwipl.writeFile(outputDir + File.separator + clrunner_visit_header_filename,
					generateVisitHeader(sched));
			// Write out CLRunner's visitor body
			AGEvaluatorSwipl.writeFile(outputDir + File.separator + clrunner_visit_body_filename,
					generateVisitBody(sched));

			// Write out the actual OpenCL visit code
			AGEvaluatorSwipl.writeFile(outputDir + File.separator + traversals_filename, visitOut);
		}
		if (verbose) {
			System.out.println("=== CL Runner Visitor Header ===: \n" + generateVisitHeader(sched));
			System.out.println("=== CL Runner Visitor Body ===: \n" + generateVisitBody(sched));
			System.out.println("=== VISITS ===: \n" + visitOut);
		}
		return "(no OpenCL out)";
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
			return fields.findClField(cls, prop).getClName() + "(index)";
		} else if (AbstractGenerator.childrenContains(ast.extendedClasses.get(cls).multiChildren.keySet(), child)) {
			// If we're assigning to our multiple children inside a loop
			AGEval.IFace child_class = cls.getChildByName(child);
			return fields.findClField(child_class, prop).getClName() + "(current_node)";
		} else {
			// If we're assigning the data to our single child
			AGEval.IFace child_class = cls.getChildByName(child);
			OpenCLFieldsHelper.Field child_field = fields.findClField(cls, "child_" + child + "_leftmost_child");
			String child_index = "GetAbsoluteIndex(" + child_field.getClName() + "(index), index)";

			return fields.findClField(child_class, prop).getClName() + "(" + child_index + ")";
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
				return fields.findClField(cls, cleanProp).getClRhsName() + "(index)";
			} else if (Generator.childrenContains(ast.extendedClasses.get(cls).multiChildren.keySet(), child)) {
				return fields.findClField(cls, child + "_" + cleanProp + "_last").getClRhsName() + "(index)";
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
				return fields.findClField(child_class, cleanProp).getClRhsName() + "(current_node)";
			} else {
				throw new InvalidGrammarException("Cannot access $i attrib of a non-multi child: " + lhs);
			}
			// $- means access the previous iteration of the loop
		} else if (prop.contains("$-")) {
			if (isParent) {
				return fields.findClField(cls, cleanProp).getClRhsName() + "(index)";
			} else if (Generator.childrenContains(ast.extendedClasses.get(cls).multiChildren.keySet(), child)) {
				String name_last = child + "_" + cleanProp + "_last";
				String init = fields.findClField(cls, name_last).getClRhsName() + "(index)";
				String rest = fields.findClField(cls.getChildByName(child), cleanProp).getClRhsName() + "(PREV_OCL())";
				return "(STEP() == 1 ? (" + init + ") : (" + rest + "))";
			} else {
				throw new InvalidGrammarException("Cannot access $- attrib of a non-multi child: " + lhs);
			}
			// We're just working with regular variables
		} else {
			if (isParent) {
				Field fld = fields.findClField(cls, cleanProp);
				if (fld == null) {
					throw new InvalidGrammarException("Undeclared field identifier " + cleanProp + " in " + lhs);
				}
				return fields.findClField(cls, cleanProp).getClRhsName() + "(index)";
			} else if (ast.extendedClasses.get(cls).multiChildren.containsKey(child)) {
				return fields.findClField(cls.getChildByName(child), cleanProp).getClRhsName() + "(current_node)"; //CHECK: index?
			} else {
				// If we're assigning the data to our single child
				OpenCLFieldsHelper.Field child_field = fields.findClField(cls, "child_" + child + "_leftmost_child");
				String child_index = "GetAbsoluteIndex(" + child_field.getClName() + "(index), index)";

				return fields.findClField(cls.getChildByName(child), cleanProp).getClRhsName() + "(" + child_index + ")";
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
		if (!lhs.contains("@"))
			return lhs + "_last";
		if (lhs.contains("self@"))
			return lhs.split("@")[1] + "_last";
		return lhs.replace("@", "_") + "_last";
	}

	@Override
	public String printCurrentPipelineBuild(Hashtable<Variable, Term> binding) throws InvalidGrammarException {
		return "// No pipeline build needed in OpenCL";
	}

	// Generates aleactions.h contents
	// Taken from CppGenerator
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
						"'maybe' types not currently implemented in OpenCL backend. Yell at Matt.");
			} else {
				params.append(OpenCLFieldsHelper.typeStringToOclType(Generator.extendedGet(ast, assign._class,
						arg).strType));
			}
			params.append(" " + assign._variables.get(arg));
		}
		params.append(")");

		contents.append("static ");
		contents.append(OpenCLFieldsHelper.typeStringToOclType(Generator.extendedGet(ast, assign._class, assign._sink).strType));
		contents.append(" " + assign._class.getName().toLowerCase() + "_");
		contents.append(assign._sink.replace('.', '_').replace('@', '_') + " ");
		contents.append(params);
		contents.append(" { return " + assign._indexedBody + "; }\n");

		return contents.toString();
	}

	@Override
	public String visitHeader(Class cls, int visitNum, ALEParser ast) throws InvalidGrammarException {
		StringBuilder contents = new StringBuilder();

		contents.append("void visit_" + cls.getName().toLowerCase() + "_" + visitNum
				+ "(unsigned int start_idx, unsigned int tree_size");

		for (OpenCLFieldsHelper.CLBuffer buf : fields.getBuffers()) {
			String cl_type = buf.getBuffer_type();// == "unionvariants" ?
													// " enum unionvariants" :
													// buf.getBuffer_type();
			contents.append(", __global " + cl_type + "* " + buf.getBuffer_name());
		}

		// If this is the last visit, it is a render visit, so add the render
		// buffer parameter
		if (visitNum == (sched.numVisits() - 1)) {
			contents.append(", __global VertexAndColor* glBuffer");
		}

		contents.append(") {\n");
		contents.append("\tunsigned int index = get_global_id(0) + start_idx;\n\n");
		contents.append("\t// Variables needed for loop macro. Declare up top to avoid declaring a\n");
		contents.append("\t// multitide below, one for every loop\n");
		contents.append("\tint step = 0;\n");
		contents.append("\tunsigned int prev_child_idx = 0;\n\n");

		return contents.toString();
	}

	@Override
	public String visitFooter(Class cls, int visitNum, ALEParser ast) throws InvalidGrammarException {
		return "}\n\n";
	}

	@Override
	public String openChildLoop(Class parent_class, String loopVar, ALEParser ast) {
		return "  SFORLOOPALIAS_OCL(index, "
				+ fields.findClField(parent_class, "child_" + loopVar + "_leftmost_child").getClName() + ", step) {\n";
	}

	@Override
	public String closeChildLoop() {
		return "  } SFORLOOPALIAS_OCL_END();";
	}

	@Override
	public String openLastChild(Class cls, String loopVar) {
		//return "\tif (step == " + fields.findClField(cls, "child_" + loopVar + "_count").getClName() + ") {\n";
		return "\tif (!GetAbsoluteIndex(right_siblings(current_node), current_node)) {\n";
	}

	@Override
	public String closeLastChild() {
		return "\t\tbreak;\n\t}\n";
	}

	@Override
	public String childrenRecur(Class cls, String childName, int visitNum, ALEParser ast)
			throws InvalidGrammarException {
		throw new InvalidGrammarException("Recursion not supported in OpenCL backend");
	}

	@Override
	public String childRecur(Class cls, String childName, int visitNum) throws InvalidGrammarException {
		throw new InvalidGrammarException("Recursion not supported in OpenCL backend");
	}
	
	
	// Not interface function. Writes declarations for visit dispatch functions.
	public String visitDispatchersDeclaration(AGEvaluator aleg, Schedule sched) {
		int visits = sched.numVisits();
		Vector<HashSet<AGEval.Class>> buSubInorderBuIns = sched.buSubInorderBuIn;
		Vector<HashSet<AGEval.Class>> buSubInorderBus = sched.buSubInorderBus;
		
		// OpenCL does not (yet) do suborder traversals
		if (buSubInorderBuIns != null && buSubInorderBuIns.size() > 0) {
			for (HashSet<AGEval.Class> suborder : buSubInorderBuIns) {
				if (suborder != null) {
					System.err.println("SubOrder traversals not supported in OpenCL");
					System.exit(-1);
				}
			}
		}
		if (buSubInorderBus != null && buSubInorderBus.size() > 0) {
			for (HashSet<AGEval.Class> suborder : buSubInorderBus) {
				if (suborder != null) {
					System.err.println("SubOrder traversals not supported in OpenCL");
					System.exit(-1);
				}
			}
		}

		StringBuilder contents = new StringBuilder();
		for (int i = 0; i < visits; i++) {
			contents.append("__kernel void visit_" + i + "(unsigned int start_idx, unsigned int tree_size");

			for (OpenCLFieldsHelper.CLBuffer buf : fields.getBuffers()) {
				contents.append(", __global " + buf.getBuffer_type() + "* " + buf.getBuffer_name());
			}

			// If this is the last visit, it is a render visit, so add the render
			// buffer parameter
			if (i == (sched.numVisits() - 1)) {
				contents.append(", __global VertexAndColor* glBuffer");
			}

			contents.append("); \n");
		}
		
		contents.append("\n\n");
		return contents.toString();
	}

	
	public String visitDispatchers(int visits, AGEvaluator aleg, Vector<HashSet<AGEval.Class>> buSubInorderBuIns,
			Vector<HashSet<AGEval.Class>> buSubInorderBus) throws InvalidGrammarException {
		// OpenCL does not (yet) do suborder traversals
		if (buSubInorderBuIns != null && buSubInorderBuIns.size() > 0) {
			for (HashSet<AGEval.Class> suborder : buSubInorderBuIns) {
				if (suborder != null) {
					throw new InvalidGrammarException("SubOrder traversals not supported in OpenCL");
				}
			}
		}
		if (buSubInorderBus != null && buSubInorderBus.size() > 0) {
			for (HashSet<AGEval.Class> suborder : buSubInorderBus) {
				if (suborder != null) {
					throw new InvalidGrammarException("SubOrder traversals not supported in OpenCL");
				}
			}
		}

		StringBuilder contents = new StringBuilder();
		for (int i = 0; i < visits; i++) {
			contents.append(visitDispatcher(i, aleg, buSubInorderBuIns.get(i), buSubInorderBus.get(i)));
		}
		return contents.toString();
	}

	@Override
	public String visitDispatcher(int visit, AGEvaluator aleg, HashSet<Class> buIns, HashSet<Class> bus) {
		StringBuilder contents = new StringBuilder();

		contents.append("__kernel void visit_" + visit + "(unsigned int start_idx, unsigned int tree_size");

		for (OpenCLFieldsHelper.CLBuffer buf : fields.getBuffers()) {
			contents.append(", __global " + buf.getBuffer_type() + "* " + buf.getBuffer_name());
		}

		// If this is the last visit, it is a render visit, so add the render
		// buffer parameter
		if (visit == (sched.numVisits() - 1)) {
			contents.append(", __global VertexAndColor* glBuffer");
		}

		contents.append(") {\n");

		contents.append("\tunsigned int index = get_global_id(0) + start_idx;\n\n");

		contents.append("\tswitch(" + fields.findClField(null, "display").getClRhsName() + "(index)) {\n");
		for (AGEval.Class cls : aleg.classes) {
			contents.append("\t\tcase TOK_" + cls.getName().toUpperCase() + ":\n");
			contents.append("\t\t\tvisit_" + cls.getName().toLowerCase() + "_" + visit + "(");
			contents.append("start_idx, tree_size");

			for (OpenCLFieldsHelper.CLBuffer buf : fields.getBuffers()) {
				contents.append(", " + buf.getBuffer_name());
			}

			// If this is the last visit, it is a render visit, so add the
			// render
			// buffer parameter
			if (visit == (sched.numVisits() - 1)) {
				contents.append(", glBuffer");
			}

			contents.append(");\n");

			contents.append("\t\t\tbreak;\n");
		}
		contents.append("\t}\n}\n\n");

		return contents.toString();
	}

	@Override
	public String preVisits(AGEvaluator aleg, Schedule sched) {
		StringBuilder contents = new StringBuilder();

		contents.append(generated_warning_header);

		contents.append("// These includes are order-dependent: \"common.cl\" must always come first\n");
		contents.append("#include \"types.h\"\n");
		contents.append("#include \"common.cl\"\n");
		contents.append("#include \"" + aleactions_filename + "\"\n");
		contents.append("#include \"" + buffer_info_filename + "\"\n");
		contents.append("#include \"sssmacros_ocl.h\"\n");
		contents.append("\n");
		contents.append("/**\n");
		contents.append(" * @file traversals.cl\n");
		contents.append(" * @brief OpenCL code to run layout solver traversals.\n");
		contents.append(" */\n\n");
		
		contents.append(visitDispatchersDeclaration(aleg, sched));

		return contents.toString();
	}

	@Override
	public String postVisits(AGEvaluator aleg, Schedule sched) throws InvalidGrammarException {
		return "\n // Main visit dispatcher kernels\n\n "
				+ visitDispatchers(sched.numVisits(), aleg, sched.buSubInorderBuIn, sched.buSubInorderBus);
	}

	@Override
	public String replaceTypeVals(String body, ALEParser ast) {
		return body;
	}

	// No logging
	@Override
	public String logStmt(int indentSrc, int indentOut, String msg, String rhs) {
		return "";
	}

	// No logging
	@Override
	public String logStmtVar(int indentSrc, int indentOut, String msg, ALEParser ast, Class cls, String rhs,
			String rhsAddress) throws InvalidGrammarException {
		return "";
	}

	// //////////////////////////////////////////////////////////////////////////
	// Parse-related Code Generators
	// //////////////////////////////////////////////////////////////////////////
	
	
	// Calls into the Flat C++ backend to generate the minimal code needed to be used by the OpenCL layout engine
	private void writeFlatCppData(ALEParser ast, Schedule sched, String outputDir, boolean verbose)
			throws InvalidGrammarException  {
//		System.out.println("Generating Flat C++ files to use as host data structure for tree.");
//		
//		FlatCppGenerator cppGen = new FlatCppGenerator();
//		
//		
//		// Create function headers for Flat C++ backend (code copy+paste'ed from AbstractGenerator.java)
//		HashMap<AGEval.Class, ArrayList<ALEParser.Assignment>> assignments = new HashMap<AGEval.Class, ArrayList<ALEParser.Assignment>>();
//		for (ALEParser.Assignment asgn : ast.assignments) {
//			if (!assignments.containsKey(asgn._class)) assignments.put(asgn._class, new ArrayList<ALEParser.Assignment>());
//			if (!asgn.isReduction) assignments.get(asgn._class).add(asgn); 
//		}
//		
//		StringBuilder cpp_aleactions = new StringBuilder();
//		for (ArrayList<ALEParser.Assignment> cAssigns : assignments.values() ) {
//			for (ALEParser.Assignment assign : cAssigns) cpp_aleactions.append(cppGen.functionHeader(assign, ast));
//		}
//		
//		
//		cppGen.generateParseFiles(ast, sched, outputDir, verbose, cpp_aleactions.toString());
//		
//		// We also need to write out an empty header for the ClusteredTree visits header, and an empty body for the 
//		// _Gen_RunTraversals() function, if real versions of those do not already exist.
//		File ct_visitors_header = new File(outputDir + File.separator + FlatCppGenerator.visit_header_filename);
//		File ct_visitors_body = new File(outputDir + File.separator + FlatCppGenerator.visit_body_filename);
//		
//		if(!ct_visitors_body.exists() || !ct_visitors_header.exists()) {
//			System.out.println("Flat C++ visit functions have not previously been generated. Writing empty stub functions in their place.");
//			try {
//				FileWriter header_writer = new FileWriter(ct_visitors_header);
//				header_writer.write(generated_warning_header);
//				header_writer.write("// Empty header generated by OpenCL backend");
//				header_writer.close();
//				
//				FileWriter body_writer = new FileWriter(ct_visitors_body);
//				body_writer.write(generated_warning_header);
//				body_writer.write("// Empty file generated by OpenCL backend\n\n");
//				body_writer.write("#include \"clustered_tree.h\"\n\n");
//				
//				body_writer.write("void ClusteredTree::_Gen_RunTraversals() { return; }\n");
//				body_writer.close();
//			} catch (IOException e) {
//				System.err.println("Error writing out Flat C++ files for use by OpenCL backend");
//			}
//		} else {
//			System.out.println("Flat C++ visit functions (files " + FlatCppGenerator.visit_header_filename + " and " +  FlatCppGenerator.visit_body_filename + ") already exist; not writing."); 
//			System.out.println("IMPORTANT: Be sure these files correspond with the version of the grammar generated by the OpenCL backend!");
//		}
	}

	// While the actual ale action functions are generated by functionHeaders() (whose results are correlated by the 
	// generator and handed back to us in generateParseFiles() and then sent here), this function adds includes and
	// other things needed to complete the header.
	protected String generateAleHeader(String functionHeaders, boolean useWrappers) {
		StringBuilder contents = new StringBuilder();

		if (useWrappers) {
			contents.append("#ifndef ALEACTIONS_H\n");
			contents.append("#define ALEACTIONS_H\n\n");
			contents.append("// Shut compiler up about unused functions. There _will_ be unused functions.\n");
			contents.append("// Yes, kind of evil to do this, but useless compiler warnings are more evil.\n");
			contents.append("#pragma clang diagnostic ignored \"-Wunused-function\"\n");
			contents.append("#pragma clang diagnostic ignored \"-Wunused-parameter\"\n\n");
		}

		contents.append(functionHeaders);

		if (useWrappers) {
			contents.append("\n#endif // ALEACTIONS_H\n");
		}

		return contents.toString();
	}

	// Returns a string appropriate for writing as " + buffer_info_filename + "
	// Requires that fields be initialized first.
	protected String generateBufferInfo(boolean useWrappers) {
		// Contents of the buffer_info.h file
		StringBuilder contents = new StringBuilder();

		contents.append(generated_warning_header);

		contents.append("/**\n");
		contents.append(" * @file   " + buffer_info_filename + "\n");
		contents.append(" * @author Superconductor v" + version + "\n");
		contents.append(" * @date   " + generation_date + "\n");
		contents.append(" * @brief  Contains macros needed to access fields within monolithic OpenCL\n");
		contents.append(" * buffers.\n");
		contents.append(" * \n");
		contents.append(" * @warning Generated code. Modifcation to this file will be lost on next\n");
		contents.append(" * code generation.\n");
		contents.append(" *\n");
		contents.append(" * This file defines several sets of macros intended for use with the \n");
		contents.append(" * 'monolithic' OpenCL buffer scheme of superconductor. In short, monolithic\n");
		contents.append(" * buffers are a way of packing multiple different fields (represented by\n");
		contents.append(" * structure-split arrays) into a single OpenCL buffer so as to minimize the\n");
		contents.append(" * number of arguments needed to be passed to OpenCL.\n");
		contents.append(" *\n");
		contents.append(" * The macros contained here are of three classes:\n");
		contents.append(" * @li @c buffer_name_size The number of fields packed into buffer buffer_name.\n");
		contents.append(" * @li @c NUM_BUFFERS The total number of buffers define herein.\n");
		contents.append(" * @li @c fld_class_property(node_idx) Macro to access the specified property of\n");
		contents.append(" * for the node at node_idx.\n");
		contents.append(" */\n\n");

		if (useWrappers) {
			contents.append("#ifndef BUFFER_INFO_H\n");
			contents.append("#define BUFFER_INFO_H\n\n");
		}

		for (OpenCLFieldsHelper.CLBuffer buffer : fields.getOclBuffers()) {
			contents.append("#define " + buffer.getBuffer_name().toUpperCase() + "_SIZE ");
			contents.append((buffer.getNum_fields()) + "\n");
		}

		contents.append("\n");

		for (OpenCLFieldsHelper.Field field : fields.getFields()) {
			if(field.getClBufferName() == null) {
				continue;
			}
			
			contents.append("#define " + field.getClName() + "(node_idx) ");
			contents.append(field.getClBufferName() + "[tree_size * ");
			contents.append(field.getClBufferPosition() + " + node_idx]\n");
			
			contents.append("#define " + field.getClName().toUpperCase() + "_POSITION " + field.getClBufferPosition() + "\n");
			contents.append("#define " + field.getClName().toUpperCase() + "_BUFFER " + field.getClBufferName() + "\n");
		}

		if (useWrappers) {
			contents.append("\n\n#endif // BUFFER_INFO_H\n");
		}

		return contents.toString();
	}

	// Generates the contents of the header data that should be injected into
	// the CLRunner class declearation.
	private String generateCLRunnerHeader() {
		StringBuilder contents = new StringBuilder();

		contents.append(generated_warning_header);

		contents.append("#ifndef CL_RUNNER_GENERATED\n");
		contents.append("#define CL_RUNNER_GENERATED\n\n");

		contents.append("protected:\n");
		contents.append(generateBufferDeclaration());

		contents.append("\n#endif // CL_RUNNER_GENERATED\n");

		return contents.toString();
	}

	// Generates a list of cl::Buffer declarations, one for each monolithic
	// buffer we use.
	private String generateBufferDeclaration() {
		StringBuilder contents = new StringBuilder();

		for (OpenCLFieldsHelper.CLBuffer buffer : fields.getOclBuffers()) {
			contents.append("\tcl::Buffer " + buffer.getBuffer_name() + ";\n");
		}

		return contents.toString();
	}

	private String generateCLRunnerBody() throws InvalidGrammarException {
		StringBuilder contents = new StringBuilder();
		contents.append(generated_warning_header);

		contents.append("#include \"cl_runner.h\"\n");
		contents.append("#include \"" + buffer_info_filename + "\"\n");
		contents.append("#include \"types.h\"\n\n");

		contents.append(generateAllocateBuffersFunction());
		contents.append("\n\n");
		contents.append(generateTransferTreeFunction());
		contents.append("\n\n");
		contents.append(generateRetrieveTreeFunction());
		contents.append("\n\n");
		contents.append(generateSetKernelArgumentsFunction());

		return contents.toString();
	}

	// Generates CLRunner::_Gen_AllocateBuffers() function
	private String generateAllocateBuffersFunction() {
		StringBuilder contents = new StringBuilder();

		contents.append("void  CLRunner::_Gen_AllocateBuffers() {\n");
		for (OpenCLFieldsHelper.CLBuffer buffer : fields.getOclBuffers()) {
			contents.append("\t" + buffer.getBuffer_name());
			contents.append(" = cl::Buffer(_context, CL_MEM_READ_WRITE, ");
			contents.append(buffer.getBuffer_name().toUpperCase() + "_SIZE * _tree_size * ");
			contents.append("sizeof(" + buffer.getBuffer_type() + "));\n");
		}
		contents.append("}\n");

		return contents.toString();
	}

	// Generates CLRunner::_Gen_TransferTree() function
	private String generateTransferTreeFunction() throws InvalidGrammarException {
		StringBuilder contents = new StringBuilder();

		contents.append("void CLRunner::_Gen_TransferTree(const ClusteredTree& ct) {\n");

		// TODO: only transfer parse fields
		for (OpenCLFieldsHelper.Field field : fields.getFields()) {
			if(field.getClBufferName() == null) {
				continue;
			}
			
			contents.append("\t_queue.enqueueWriteBuffer(" + field.getClBufferName());
			contents.append(", CL_TRUE, (sizeof(" + field.getClType() + ") * ");
			contents.append("_tree_size * " + field.getClBufferPosition());
			contents.append("), (sizeof(" + field.getClType() + ") * _tree_size), ");
			contents.append("ct." + field.getCppName() + ");\n");
		}

		contents.append("}\n");

		return contents.toString();
	}

	// Generates CLRunner::_Gen_RetrieveTree() function
	private String generateRetrieveTreeFunction() {
		StringBuilder contents = new StringBuilder();

		contents.append("void CLRunner::_Gen_RetrieveTree(ClusteredTree& ct) {\n");

		for (OpenCLFieldsHelper.Field field : fields.getFields()) {
			if(field.getClBufferName() == null) {
				continue;
			}
			
			contents.append("\t_queue.enqueueReadBuffer(" + field.getClBufferName());
			contents.append(", CL_TRUE, (sizeof(" + field.getClType() + ") * ");
			contents.append("_tree_size * " + field.getClBufferPosition());
			contents.append("), (sizeof(" + field.getClType() + ") * _tree_size), ");
			contents.append("ct." + field.getCppName() + ");\n");
		}

		contents.append("}\n");

		return contents.toString();
	}

	// Generates CLRunner::_Gen_SetKernelArguments() function
	private String generateSetKernelArgumentsFunction() {
		StringBuilder contents = new StringBuilder();

		contents.append("void CLRunner::_Gen_SetKernelArguments(cl::Kernel& kernel) {\n");

		contents.append("\tkernel.setArg(0, 0);    // start_idx (default to 0) \n");
		contents.append("\tkernel.setArg(1, _tree_size);\n");

		int i = 2;
		for (OpenCLFieldsHelper.CLBuffer buffer : fields.getOclBuffers()) {
			contents.append("\tkernel.setArg(" + i + ", " + buffer.getBuffer_name() + ");\n");
			i++;
		}
		contents.append("}");

		return contents.toString();
	}

	// //////////////////////////////////////////////////////////////////////////
	// Visit-related Code Generators
	// //////////////////////////////////////////////////////////////////////////

	// Generates CLRunner visitor-related header (the function declarations for
	// each visit pass)
	protected String generateVisitHeader(Schedule sched) {
		StringBuilder contents = new StringBuilder();

		contents.append("#ifndef CL_RUNNER_GENERATED_VISIT\n");
		contents.append("#define CL_RUNNER_GENERATED_VISIT\n\n");

		contents.append("protected:\n");

		final int num_visits = sched.numVisits();

		// The last traversal is the special render traversal, so don't write it
		// yet
		for (int i = 0; i < num_visits - 1; i++) {
			contents.append("\tvoid RunPass" + i + "();\n");
		}

		// Now write the render pass
		contents.append("\tvoid RunPass" + (num_visits - 1) + "(cl::Buffer& render_buffer);\n");

		contents.append("\n#endif // CL_RUNNER_GENERATED_VISIT\n");

		return contents.toString();
	}

	// Generates CLRunner visitor-related body
	protected String generateVisitBody(Schedule sched) throws InvalidGrammarException {
		StringBuilder contents = new StringBuilder();

		contents.append("#include \"cl_runner.h\"\n\n");
		contents.append(generateRunTraversalsFunction(sched));
		contents.append("\n");
		contents.append(generateRunPassFunctions(sched));

		return contents.toString();
	}

	// Generates the CLRunner::_Gen_RunTraversals() and
	// CLRunner::_Gen_RunRenderTraversal() functions.
	private String generateRunTraversalsFunction(Schedule sched) {
		StringBuilder contents = new StringBuilder();

		final int num_visits = sched.numVisits();

		contents.append("void CLRunner::_Gen_RunTraversals() {\n");
		// The last traversal is the special render traversal, so don't write
		for (int i = 0; i < num_visits - 1; i++) {
			contents.append("\tRunPass" + i + "();\n");
		}
		contents.append("}\n\n\n");

		contents.append("void CLRunner::_Gen_RunRenderTraversal(cl::Buffer& render_buffer) {\n");
		// The last pass is the render pass
		contents.append("\tRunPass" + (num_visits - 1) + "(render_buffer);\n");
		contents.append("}\n\n");

		return contents.toString();
	}

	// Generates the CLRunner::RunPass*() functions
	private String generateRunPassFunctions(Schedule sched) throws InvalidGrammarException {
		StringBuilder contents = new StringBuilder();

		Term[] visits = sched.binding.get("P").toTermArray();

		// The last traversal is the special render traversal, so don't write
		for (int i = 0; i < visits.length - 1; i++) {
			contents.append("void CLRunner::RunPass" + i + "() {\n");

			String visit_name = "visit_" + i;

			contents.append("\t// Get references to our kernels we have compiled previously\n");
			contents.append("\tcl::Kernel " + visit_name + " = cl::Kernel(_program, \"" + visit_name + "\");\n\n");
			contents.append("\tSetKernelArguments(" + visit_name + ");\n\n");

			String stencil = visits[i].arg(2).arg(1).toString();
			if (stencil.equals("td")) {
				contents.append("\tTraverseTopDown(" + visit_name + ");\n");
			} else if (stencil.equals("bu")) {
				contents.append("\tTraverseBottomUp(" + visit_name + ");\n");
			} else {
				throw new InvalidGrammarException("Unsupported traversal order: " + stencil);
			}

			contents.append("}\n\n\n");
		}

		// Now write the render traversal
		contents.append("void CLRunner::RunPass" + (visits.length - 1) + "(cl::Buffer& render_buffer) {\n");

		String visit_name = "visit_" + (visits.length - 1);

		contents.append("\t// Get references to our kernels we have compiled previously\n");
		contents.append("\tcl::Kernel " + visit_name + " = cl::Kernel(_program, \"" + visit_name + "\");\n\n");
		contents.append("\tSetKernelArguments(" + visit_name + ");\n");

		// Set the render buffer, which will be the (num buffers) + 1 arguments,
		// since tree_size is the first.
		contents.append("\t" + visit_name + ".setArg(" + (fields.getBuffers().size() + 2)
				+ ", render_buffer);   // __global VertexAndColor* glBuffer\n\n");

		// TODO: Rewrite in-order traversal to top-down/bottom-up?
		String stencil = visits[visits.length - 1].arg(2).arg(1).toString();
		if (stencil.equals("td")) {
			contents.append("\tTraverseTopDown(" + visit_name + ");\n");
		} else if (stencil.equals("bu")) {
			contents.append("\tTraverseBottomUp(" + visit_name + ");\n");
		} else {
			throw new InvalidGrammarException("Unsupported traversal order: " + stencil);
		}

		contents.append("}\n\n\n");

		return contents.toString();
	}
}