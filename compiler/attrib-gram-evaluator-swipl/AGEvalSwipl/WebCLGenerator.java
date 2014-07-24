package AGEvalSwipl;

// TODO: Get default values working
// TODO: Generate getters and setters for C++ class for all fields


import AGEval.AGEvaluator;
import AGEval.IFace;
import AGEval.InvalidGrammarException;
import AGEvalSwipl.AGEvaluatorSwipl.Schedule;
import aleGrammar.ALEParser;
import jpl.Term;
import jpl.Variable;

import java.io.File;
import java.io.IOException;
import java.util.*;

public class WebCLGenerator extends OpenCLGenerator {

	public void genClassToIFace (StringBuilder contents, ArrayList<AGEval.Class> classes){
		contents.append("this.classToIFace = function (classStr) {\n");
		contents.append("\tswitch(classStr.toUpperCase()) {\n");
		for (AGEval.Class c :classes){
			contents.append("\t\tcase \""+  c.getName().toUpperCase() +"\":\n");
			contents.append("\t\t\treturn \"" +c.getInterface().getName().toLowerCase() +"\";\n");
			contents.append("\t\t\tbreak;\n");
		}
		contents.append("\t}\n");
		contents.append("};\n\n\n");
	}

	public void genClassToTokens (StringBuilder contents, HashMap<String, ArrayList<String>> types){
		HashMap<String, Integer> tokens = FlatCppGenerator.getTokens(types);

		contents.append("this.classToToken = function (classStr) {\n");
		contents.append("\tswitch(classStr.toUpperCase()) {\n");
		for (ArrayList<String> vs : types.values()){
			for (String v : vs){
				contents.append("\t\tcase \"" +v.toUpperCase() +"\":\n\t\t\treturn " + tokens.get(CppParserGenerator.toEnum(v)) +";\n");
				contents.append("\t\t\tbreak;\n");
			}
		}

		contents.append("\t\tdefault:\n");
		contents.append("\t\t\tconsole.error(\"unknown class tag \" +classStr);\n");
		contents.append("\t\t\tthrow 'Superconductor data flattening exn';\n");
		contents.append("\t}\n");
		contents.append("};\n\n\n");

	}

	public void genInputs (StringBuilder contents, ArrayList<AGEval.Class> classes, ArrayList<IFace> interfaces) {
		HashSet<String> names = new HashSet<String>();
		for (AGEval.Class c : classes)
			names.addAll(c.getPrivFields().keySet());
		for (AGEval.IFace i : interfaces)
			names.addAll(i.getPubFields().keySet());

		int i = 0;
		contents.append("\tthis.inputs = [\n");
		for (String n : names){
			contents.append("\t\t");
			if (i > 0) contents.append(", ");
			contents.append("\"");
			contents.append(n);
			contents.append("\"");
			i++;
		}
		contents.append("\t];\n\n\n");

	}

	public String genFlattening (ALEParser ast) {
		StringBuilder contents = new StringBuilder();
		genClassToTokens(contents, ast.types);
		genClassToIFace(contents, ast.classes);
		genInputs(contents, ast.classes, ast.interfaces);
		return contents.toString();
	}


	public String preVisits(AGEvaluator aleg, Schedule sched) {
		StringBuilder contents = new StringBuilder();

		contents.append(generated_warning_header);
/*
		contents.append("// These includes are order-dependent: \"common.cl\" must always come first\n");
		contents.append("#include \"types.h\"\n");
		contents.append("#include \"common.cl\"\n");
		contents.append("#include \"" + aleactions_filename + "\"\n");
		contents.append("#include \"" + buffer_info_filename + "\"\n");
		contents.append("#include \"sssmacros_ocl.h\"\n");
		contents.append("\n");
*/
		contents.append("/**\n");
		contents.append(" * @file traversals.cl\n");
		contents.append(" * @brief OpenCL code to run layout solver traversals.\n");
		contents.append(" */\n\n");

		contents.append(visitDispatchersDeclaration(aleg, sched));

		return contents.toString();
	}
	private void generateSetKernelArgumentsFunction (StringBuilder contents) {
		contents.append("this._gen_setKernelArguments = function(kernel) {\n");
        contents.append("if (!this.cfg.nodeCL && typeof webcl.enableExtension == \"function\") {\n");
        contents.append("\tkernel.setArg(0, new Uint32Array([0]));\t// start_idx (default to 0)\n");
        contents.append("\tkernel.setArg(1, new Uint32Array([this.tree_size]));\n");
        contents.append("} else {\n");
        contents.append("\tconsole.debug(\"Legacy set args\");\n");
        contents.append("\tvar types = window.WebCLKernelArgumentTypes;\n");
        contents.append("\tkernel.setArg(0, 0, types.UINT);\t// start_idx (default to 0)\n");
        contents.append("\tkernel.setArg(1, this.tree_size, types.UINT);\n");
        contents.append("}\n");
		int i = 2;
		for (OpenCLFieldsHelper.CLBuffer buffer : fields.getOclBuffers()) {
			contents.append("\tkernel.setArg(" + i + ", this.cl_" + buffer.getBuffer_name() + ");\n"); //int => cl_int_buffer_1
			i++;
		}
		contents.append("};\n\n\n");
	}

	private void genAllocateClBuffers(StringBuilder contents) {
		contents.append("this._gen_allocateClBuffers = function() {\n");
		for (OpenCLFieldsHelper.CLBuffer buffer : fields.getOclBuffers()) {
			contents.append("\tthis.cl_" + buffer.getBuffer_name());
			contents.append(" = this.context.createBuffer(this.cl.MEM_READ_WRITE, this.");
			contents.append(buffer.getBuffer_name());
			contents.append(".byteLength);\n");
		}
		contents.append("};\n\n\n");
	}

	private void genTransferTree(StringBuilder contents) {
		contents.append("this._gen_transferTree = function() {\n");
		for (OpenCLFieldsHelper.CLBuffer buffer : fields.getOclBuffers()) {
			contents.append("\tthis.queue.enqueueWriteBuffer(this.cl_");
			contents.append( buffer.getBuffer_name());
			contents.append(", true, 0, this.");
			contents.append( buffer.getBuffer_name());
			contents.append(".byteLength, this.");
			contents.append( buffer.getBuffer_name());
			contents.append(");\n");
		}
		contents.append("};\n\n\n");
	}

	private void genRetrieveTree(StringBuilder contents) {
		contents.append("this._gen_retrieveTree = function() {\n");
		for (OpenCLFieldsHelper.CLBuffer buffer : fields.getOclBuffers()) {
			contents.append("\tthis.queue.enqueueReadBuffer(this.cl_");
			contents.append( buffer.getBuffer_name());
			contents.append(", true, 0, this.");
			contents.append( buffer.getBuffer_name());
			contents.append(".byteLength, this.");
			contents.append( buffer.getBuffer_name());
			contents.append(");\n");
		}
		contents.append("};\n\n\n");
	}

	private void genGetRenderBufferSize(StringBuilder contents){
		contents.append("this.getRenderBufferSize = function() {\n");
//		contents.append("\tvar retrieved_value = new Int32Array(1);\n\n");
		// FIXME: No we didn't! Major source of bugs. Only coincidentally correct, if at all.
		// Best way to fix: some method of annotating which class will be the root, and which field will hold the
		// allocated render size.
//		contents.append("\t// We manually checked that the offset of this buffer is 0 in cl_int_buffer_1\n");
//		contents.append("\t// ^^^^^^^^ FIXME: NOT NECESSARILY TRUE. VERIFY YOURSELF AND CHANGE IF NECESSARY. ^^^^^^^^\n");
//		contents.append("\tthis.queue.enqueueReadBuffer(this.cl_int_buffer_1, true, 0, retrieved_value.byteLength, retrieved_value);\n\n");
//		contents.append("\tvar buff_size = retrieved_value[0];\n");
//		contents.append("\tif(buff_size < 1) {\n");
//		contents.append("\t\tconsole.error(\"Error: OpenCL is reporting 0 vertices for its render size\");\n");
//		contents.append("\t}\n\n");
//		contents.append("\treturn buff_size;\n");

		contents.append("\treturn this.proxyData.fld_iroot___rendersize__.get(0);\n");

		contents.append("};\n\n");
	}


	private void genProxy (StringBuilder contents, Vector<OpenCLFieldsHelper.Field> sortedFields){
		contents.append("// Creates proxy object to wrap every field in the tree. Both host and cl buffers must be allocated\n");
		contents.append("// before calling this function.\n");
		contents.append("this._gen_allocateProxyObjects = function() {\n");

		for (OpenCLFieldsHelper.Field field : sortedFields) {
			if(field.getClBufferName() == null) {
				continue;
			}
			contents.append("\tthis.proxyData.");
			contents.append(field.getClName());
			contents.append(" = new CLDataWrapper(this, this.");
			contents.append(field.getClName());
			contents.append(", this.cl_");
			contents.append(field.getClBufferName());
			contents.append(");\n");
		}
		contents.append("};\n\n");

	}

	Vector<OpenCLFieldsHelper.Field> sortFields (HashSet<OpenCLFieldsHelper.Field>fields){
		Vector<OpenCLFieldsHelper.Field> sortedFields = new Vector<OpenCLFieldsHelper.Field>(fields);
		Collections.sort(sortedFields);
		return sortedFields;
	}



	private void genBuffersFields (StringBuilder contents, Vector<OpenCLFieldsHelper.Field> sortedFields ) {

		for (OpenCLFieldsHelper.Field field : sortedFields) {
			if(field.getClBufferName() == null) {
				continue;
			}
			contents.append("\tthis.");
			contents.append(field.getClName());
			contents.append(" = this.");
			contents.append(field.getClBufferName());
			contents.append(".subarray(treeSize * ");
			contents.append(field.getClBufferPosition() + ", (treeSize * ");
			contents.append(field.getClBufferPosition() + ") + treeSize);\n");
		}
	}

	private void genCopyBuffers(StringBuilder contents){

		for (OpenCLFieldsHelper.CLBuffer buffer : fields.getOclBuffers()) {
			contents.append("\tfor(var i = 0; i < data."+buffer.getBuffer_name()+".length; i++) {\n");
			contents.append("\t\tthis." + buffer.getBuffer_name()+"[i] = data." + buffer.getBuffer_name()+"[i];\n");
			contents.append("\t}\n\n");
		}
	}

	private String generateBufferInfo(Vector<OpenCLFieldsHelper.Field> sortedFields) {
		StringBuilder contents = new StringBuilder();


		contents.append("// Defines all the typed array buffers which will store data locally before\n");
		contents.append("// sending it to the CL device, then populates them with data\n");
		contents.append("this._gen_allocateHostBuffers = function(treeSize) {\n");

		for (OpenCLFieldsHelper.CLBuffer buffer : fields.getOclBuffers()) {
			contents.append("\tthis.");
			String name = buffer.getBuffer_name().toUpperCase();
			contents.append(name);
			contents.append("_SIZE = ");
			int n = buffer.getNum_fields();
			contents.append(n);
			contents.append(";\n");
			contents.append("\tthis.");
			contents.append(buffer.getBuffer_name().toLowerCase());
			contents.append(" = new ");
			String t = buffer.getPrimitiveBuffer_type();
			String typeName = (t.charAt(0) +"").toString().toUpperCase() + t.substring(1);
			contents.append("Double".equals(typeName) ? "Float64Array(this." : (typeName + "32Array(this."));
			contents.append(name);
			contents.append("_SIZE * treeSize);\n");
		}
		contents.append("};\n\n");
		contents.append("this._gen_allocateHostProxies = function (treeSize) {\n");
		genBuffersFields(contents, sortedFields);
		contents.append("};\n\n\n");

		contents.append("this._gen_copyHostBuffers = function (data, treeSize){\n");
		genCopyBuffers(contents);
		contents.append("};\n\n\n");

		genProxy(contents, sortedFields);
		genGetRenderBufferSize(contents);

		return contents.toString();

	}


	public void generateParseFiles(ALEParser ast, Schedule sched, String output_dir, boolean verbose, String ale_actions)
			throws InvalidGrammarException {

		super.generateParseFiles(ast, sched, output_dir, verbose, ale_actions);

		//FIXME bad pattern: writes in super and then overwrites here
		try {
			AGEvaluatorSwipl.writeFile(output_dir + File.separator + aleactions_filename, generateAleHeader(ale_actions, false));
			AGEvaluatorSwipl.writeFile(output_dir + File.separator + buffer_info_filename, generateBufferInfo(false));

		} catch (IOException e1) {
			System.err.println("!!! FATAL ERROR !!! Could not write parse files into directory " + output_dir);
		}

		if(verbose) {
			System.out.println("=== Ale Actions ===\n" + generateAleHeader(ale_actions, true));
			System.out.println("=== Buffer Info ===\n" + generateBufferInfo(false));
		}
	}

	static final String webcl_kernel_bindings_filename = "kbindings.js";

	// Write the source code gathered by the Generator into whatever
		// backend-specific files they need to go in.
		// TODO: Just write out visitDispatched argument rather than calling visitDispatchers() in postVisits()
		@Override
		public String output(String baseName, String visitOut, String visitDispatches, String outputDir, boolean write,
				boolean verbose, ALEParser ast, Schedule sched, String fHeaders, Hashtable<Variable, Term> binding,
				AGEvaluator aleg) throws IOException, InvalidGrammarException {
			if (write) {
				//Javascript stuff

				// Write out CLRunner's visitor header
				AGEvaluatorSwipl.writeFile(outputDir + File.separator + clrunner_visit_header_filename,
						super.generateVisitHeader(sched));
				// Write out CLRunner's visitor body
				AGEvaluatorSwipl.writeFile(outputDir + File.separator + clrunner_visit_body_filename,
						super.generateVisitBody(sched));
				// Write out the kernel bindings
				AGEvaluatorSwipl.writeFile(outputDir + File.separator + webcl_kernel_bindings_filename,
						printCurrentPipelineBuild(binding)
						+ generateBufferInfo(sortFields(fields.getFields()))
						+ genFlattening(ast)
						+ genOffsets(ast));

				// Write out the actual OpenCL visit code
				//done by super.generateParseFiles()
//				AGEvaluatorSwipl.writeFile(outputDir + File.separator + aleactions_filename, generateAleHeader(functionHeaders(ast)));
//				AGEvaluatorSwipl.writeFile(outputDir + File.separator + buffer_info_filename, super.generateBufferInfo());
				AGEvaluatorSwipl.writeFile(outputDir + File.separator + traversals_filename, visitOut);
				AGEvaluatorSwipl.writeFile(outputDir + File.separator + FlatCppGenerator.unionvariants_filename, FlatCppGenerator.generateUnionvariants(ast, false));

			}
			if (verbose) {
				System.out.println("=== CL Runner Visitor Header ===: \n" + generateVisitHeader(sched));
				System.out.println("=== CL Runner Visitor Body ===: \n" + generateVisitBody(sched));
				System.out.println("=== VISITS ===: \n" + visitOut);
			}
			return "(no OpenCL out)";
		}

	public String printCurrentPipelineBuild (Hashtable<Variable, Term> binding) throws InvalidGrammarException {
		StringBuilder contents = new StringBuilder();
		contents.append("this._gen_getKernels = function() {\n");
		int pass = 0;
		for (Term visit : binding.get("P").toTermArray()) {
			contents.append("\tthis._gen_kernel_visit_");
			contents.append(pass);
			contents.append(" = this.program.createKernel(\"visit_");
			contents.append(pass);
			contents.append("\");\n");
			pass++;
		}
		contents.append("};\n\n\n");

		genAllocateClBuffers(contents);
		genTransferTree(contents);
		genRetrieveTree(contents);
		generateSetKernelArgumentsFunction(contents);



		int lastPass = binding.get("P").toTermArray().length - 1;


		contents.append("this._gen_runTraversals = function() {\n");
		pass = 0;
		for (Term visit : binding.get("P").toTermArray()) {
			if (pass == lastPass) continue;
			contents.append("\tthis._gen_run_visit_");
			contents.append(pass);
			contents.append("();\n");
			pass++;
		}
		contents.append("};\n\n\n");


		pass = 0;
		for (Term visit : binding.get("P").toTermArray()) {
			contents.append("this._gen_run_visit_");
			contents.append(pass);

			contents.append(pass == lastPass ? " = function(clVBO) {\n" : " = function() {\n");

			String stencil = visit.arg(2).arg(1).toString();
			contents.append("\tthis._gen_setKernelArguments(this._gen_kernel_visit_");
			contents.append(pass);
			contents.append(");\n");

			if (pass == lastPass) {
				contents.append("\tthis._gen_kernel_visit_");
				contents.append(lastPass);
				contents.append(".setArg(");
				contents.append(2 + fields.getOclBuffers().size()); //FIXME should return 2+4=6 for russian election
				contents.append(", clVBO);\n");
			}


			String trav;
			if (stencil.equals("tdLtrU")) {
				throw new InvalidGrammarException("Cannot codegen recursive trav for WebCL");
			} else if (stencil.equals("td")) trav = "topDown";
			else if (stencil.equals("bu")) trav = "bottomUp";
			else if (stencil.equals("buSubInorder")) {
				throw new InvalidGrammarException("Cannot codegen nested trav for WebCL");
			}
			else throw new InvalidGrammarException("Unknown stencil type: " + stencil);

			contents.append("\tthis.");
			contents.append(trav);
			contents.append("Traversal(this._gen_kernel_visit_");
			contents.append(pass);
			contents.append(");\n");
			contents.append("};\n\n\n");
			pass++;
		}

		return contents.toString();
	}


	public String genOffsets (ALEParser ast){
		StringBuilder contents = new StringBuilder();

		contents.append("\nthis.offsets = \"");

		contents.append(FlatCppGenerator.generateUnionvariants(ast, false).replaceAll("\n", "\\\\n"));
		contents.append(generateBufferInfo(false).replaceAll("\n", "\\\\n"));

		contents.append("\";\n");

		return contents.toString();
	}

	// Bootstrap the Generator to use this backend
	public static void synthesizeWebCL(String alePath, String outputDir, String resourceDir, boolean verbose,
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
		GeneratorI g = AGEvaluatorSwipl.chainLoops ? new AbstractGenerator(new WebCLGenerator()) : new Generator(
				new WebCLGenerator());
		if (useFirstParallel)
			g.synthesize(alePath, outputDir, resourceDir, verbose, isFixedChildOrder, isExhaustive, maxLen, false);
		else
			g.synthesizeAll(alePath, outputDir, resourceDir, verbose, isFixedChildOrder, isExhaustive, maxLen, false);
	}



	public static void main(String[] args) throws NumberFormatException, Exception {
		if (args.length == 7) {
			synthesizeWebCL(args[1], args[2], args[0], false, new Boolean(args[3]).booleanValue(),
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

}