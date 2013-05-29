package AGEvalSwipl;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;

import AGEvalSwipl.AGEvaluatorSwipl.Schedule;
import aleGrammar.AleFrontend;

public class Html5GeneratorTests {

	
	public static String runScript (String testDir, String test, String engine) throws FileNotFoundException, IOException {
		Context cx = Context.enter();
		Scriptable scope = cx.initStandardObjects();
		
		cx.evaluateReader(scope, new FileReader(new File(testDir + File.separator + "html5" + File.separator + "emulator.js")), "library", 1, null);
		cx.evaluateString(scope, engine, "<engine>", 1, null);
		Object result = cx.evaluateReader(scope, new FileReader(new File(testDir + File.separator + "html5" + File.separator + test)), "test", 1, null);
		
		String res = Context.toString(result);
		Context.exit();
		return res;
	}
	
	
	public String genHtml (String resourceDir, String outputDir, String inputDir, String testName) throws Exception {
		
		Backend backend = new Html5Generator();
		AbstractGenerator irGen = new AbstractGenerator(backend);
		String alePath = inputDir + testName;
		Schedule sched = irGen.synthesize(alePath, outputDir, resourceDir, verbose, true, false, 8, true);
		HashMap<String, String> exprPrinter = irGen.genExprPrinter(sched._aleg, sched._ast.condsTop, sched);
		HashMap<String, String> exprToCall = irGen.genExprToCall(sched._aleg, sched._ast.condsTop, sched, exprPrinter);
		LoopRecoverer ir = new LoopRecoverer(sched);
		String visitOut = 
				backend.preVisits(sched._aleg, sched) 
				+ irGen.visits(sched._aleg, ir, sched.binding, sched.computeVisitOrders(), sched.classMap, exprToCall, exprPrinter, sched) 
				+ backend.postVisits(sched._aleg, sched);
		String visitDispatches = irGen.visitDispatchers(sched.numVisits(), sched._aleg, sched.buSubInorderBuIn, sched.buSubInorderBus);

		String fHeaders = irGen.functionHeaders(sched._ast);
		String output = backend.output("", visitOut, visitDispatches, outputDir, false, false, sched._ast, sched, fHeaders, sched.binding, sched._aleg);
		
		
		//System.out.println("=======VisitOut=====\n" + visitOut);
		//System.out.println("=======VisitDispatches=====\n" + visitDispatches);
		
		return output;
	}
	
/*	
	public String genHtmlOld (String resourceDir, String outputDir, String inputDir, String testName) throws Exception {
		
		
		//FrontendBeta.checkGrammar(inputDir + File.separator + testName);
		
		
		AGEvaluatorSwipl.Schedule sched;
		sched = AGEvaluatorSwipl.getSchedules(resourceDir + File.separator,  inputDir + File.separator, testName,  outputDir + File.separator, false, true, false, 20, false);
		if (!sched.hasNext()) {
			System.err.println("  " + testName + ": no soln");
			throw new Exception("blah");
		}
		sched.moveNext();
				
		LoopRecoverer ir = new LoopRecoverer(sched);
		
		Backend backend = new Html5Generator();
		AbstractGenerator irGen = new AbstractGenerator(backend);
		AleFrontend grammar = new AleFrontend(inputDir + File.separator + testName, AGEvaluatorSwipl.chainLoops, true);
		grammar.initFtl(!AGEvaluatorSwipl.chainLoops); //play with old alegen core
		
		

		HashMap<String, String> exprPrinter = irGen.genExprPrinter(sched._aleg, grammar.ast.condsTop, sched);
		HashMap<String, String> exprToCall = irGen.genExprToCall(sched._aleg, grammar.ast.condsTop, sched, exprPrinter);

		
		
		String visitOut = 
				backend.preVisits(grammar.alegEval, sched) 
				+ irGen.visits(sched._aleg, ir, sched.binding, sched.computeVisitOrders(), sched.classMap, exprToCall, exprPrinter, sched) 
				+ backend.postVisits(grammar.alegEval, sched);
		String visitDispatches = irGen.visitDispatchers(sched.numVisits(), grammar.alegEval, sched.buSubInorderBuIn, sched.buSubInorderBus);

		String fHeaders = irGen.functionHeaders(grammar.ast);
		String output = backend.output("", visitOut, visitDispatches, outputDir, false, false, grammar.ast, sched, fHeaders, sched.binding, grammar.alegEval);
		
		
		//System.out.println("=======VisitOut=====\n" + visitOut);
		//System.out.println("=======VisitDispatches=====\n" + visitDispatches);
		
		return output;
	}
	*/
	
	public final String resourceDir;
	public final String outputDir;
	public final String inputDir;
	public final Boolean verbose;
	public Html5GeneratorTests (String r_, String o_, String i_, Boolean verbose_) {
		resourceDir = r_;
		outputDir = o_;
		inputDir = i_;
		verbose = verbose_;
	}
	
	public boolean test(String grammar, String document) throws Exception {
		String engine = null;
		String res = null;
		try {
			long loadTime = -System.currentTimeMillis();
			engine = genHtml(resourceDir, outputDir, inputDir, grammar);
			System.err.println("  Time: " + (System.currentTimeMillis() + loadTime) + "ms");
			res = runScript(inputDir, document, engine);
			if (res.equals("true")) {
				if (verbose) System.out.println("Test succeed: " + grammar + ", " + document);
				return true;	
			} else {
				if (verbose) {
					System.err.println("Test fail: " + grammar + ", " + document);
					System.err.println("  Expected true, got: " + res);
					System.err.println(engine);
				}
				throw new Exception("Fail");
				//return false;
			}			
		} catch (org.mozilla.javascript.RhinoException e) {
			if (verbose) {
				System.err.println(engine == null ? "(no engine)" : engine);
				System.err.println(res == null ? "(no res)" : res);
				System.err.println("Test crash: " + grammar + ", " + document);
				System.err.println("Line: " + e.lineNumber() + ": " + e.lineSource());
				e.printStackTrace();
			}
			//return false;
			throw e;
		}
	}
	
	public static void main(String[] args) throws Exception {
		if (args.length != 3) {
			System.err.println("Expected 3 args:");
			System.err.println("  0: resourceDir (..-swipl/AGEvalSwipl)");
			System.err.println("  1: outputDir (..-ftl/)");
			System.err.println("  2: inputDir (..-swipl/Tests/");			
		}
		
		Html5GeneratorTests t = new Html5GeneratorTests(args[0], args[1], args[2], false);		
		t.test("bu1.ale", "bu1.js");
		t.test("td1.ale", "td1.js");
		t.test("tdtdpost.ale", "tdtdpost.js");
		if (AGEvaluatorSwipl.chainLoops) t.test("crosschain3.ale", "crosschain3.js");
		t.test("label.ale", "label.js");
		t.test("../Examples/spiraldemo2.ftl", "spiraldemo2.js");		
		try {
			t.test("sub.ftl", "sub.js");
		} catch (Exception e) {
			System.err.println("Sub failed (may need to toggle subtree traversals in algorithm.pl)");
		}
	}
}
