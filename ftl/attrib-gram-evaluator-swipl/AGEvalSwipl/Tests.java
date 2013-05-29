package AGEvalSwipl;

//import java.util.ArrayList;
import java.io.File;

import antlr.RecognitionException;

import AGEval.InvalidGrammarException;
import AGEvalSwipl.AGEvaluatorSwipl.Schedule;
import jpl.Term;

public class Tests {

	public final String resourceDir;// = "/Users/lmeyerov/Research/parallelbrowser/bbbrowser/projects/attrib-gram-evaluator-swipl/AGEvalSwipl";
	public final String outputDir;// = "/Users/lmeyerov/Research/parallelbrowser/repo/layout/match/";
	public final String friendlyGrammarDir;// = "/Users/lmeyerov/Research/parallelbrowser/bbbrowser/projects/attrib-gram-evaluator-swipl/Tests/";
	
	public Tests(String rDir, String oDir, String fDir) {
		resourceDir = rDir;
		outputDir = oDir;
		friendlyGrammarDir = fDir;
	}
	
	public static int numSchedules(AGEvaluatorSwipl.Schedule sched) {
		int res = 1;
		while (sched.hasNext()) {
			sched.moveNext();
			res++;
		}
		return res;
	}
	
	public  boolean testSingleton (String name) throws Exception {		
			String testName = name + ".ale";			
						
			//FrontendBeta.checkGrammar(friendlyGrammarDir + File.separator + testName);			
			
			AGEvaluatorSwipl.Schedule sched;
			//try {
				sched = AGEvaluatorSwipl.getSchedules(resourceDir, friendlyGrammarDir, testName, outputDir, false, true, false, false, 20, false);
			//} catch (Exception e) {
			//	throw new Exception(name + " cannot construct sched: " + e.toString());
			//}
			if (!sched.hasNext()) {
				System.err.println("  " + name + ": no soln");
				return false;
			}
			sched.moveNext();
			if (sched.numVisits() != 0 ) { 
				System.err.println("  " + name + ": wrong soln (" + sched.numVisits() + " visits");
				return false;
			}
			int numScheds = numSchedules(sched);
			if (numScheds != 1) {
				System.err.println("  " + name + ": wrong soln (expected 1 schedule, got " + numScheds + ")");
				return false;				
			}
			return true;
	}
	
	public boolean hasPatternSingleton(String name, String pattern) throws Exception {
		String testName = name + ".ale";

		try {
			AGEvaluatorSwipl.Schedule sched = AGEvaluatorSwipl.getSchedules(resourceDir, friendlyGrammarDir, testName, outputDir, false, true, false, false, 20, false);
			while (true) {
				if (!sched.hasNext()) {
					System.err.println("  " + name + ": no sched found");
					return false;
				}
				sched.moveNext();
				String str = "";
				for (Term visit : sched.binding.get("P").toTermArray()) {
					str += visit.arg(2).arg(1).toString().replace("tdLtrU", "inorder") + " ";
				}				
				System.err.println("Trying: " + str);
				if (sched.binding.get("P").toTermArray().length != 1) continue;
				for (Term visit : sched.binding.get("P").toTermArray()) {
					String stencil = visit.arg(2).arg(1).toString();
					if (stencil.equals(pattern)) return true;
					else continue;
				}
			}
		} catch (Exception e) {
			System.err.println("  " + name + ": exn on schedule search -- " + e.getMessage());
			return false;
		}	
	}
	
	public boolean hasPatternSequenceAleName(String aleName, String[] patterns) throws Exception {
		return hasPatternSequenceFilename(aleName + ".ale", patterns);	
	}
	
	public static boolean hasPatternSequence(Schedule sched, String[] patterns) throws Exception {
		search: while (true) {
			if (!sched.hasNext()) {
				return false;
			}
			sched.moveNext();
			if (sched.binding.get("P").toTermArray().length != patterns.length) continue search;
			int step = 0;
			for (Term visit : sched.binding.get("P").toTermArray()) {
				String stencil = visit.arg(2).arg(1).toString();
				if (!stencil.equals(patterns[step])) continue search; 					
				step++;
			}
			return true;
		}
	}
	
	public boolean hasPatternSequenceFilename(String fileName, String[] patterns) throws Exception {
		String testName = fileName;
		try {
			AGEvaluatorSwipl.Schedule sched = AGEvaluatorSwipl.getSchedules(resourceDir, friendlyGrammarDir, testName, outputDir, false, true, false, false, 20, false);
			boolean hasAnySchedule = false;
			search: while (true) {
				if (!sched.hasNext()) {
					System.err.println("  " + testName + ": correct sched not found");
					System.err.println("  (has any schedule?: " + hasAnySchedule + ")");
					return false;
				}
				sched.moveNext();
				hasAnySchedule = true;
				//System.out.println("Trying: " + sched.binding.toString());
				if (sched.binding.get("P").toTermArray().length != patterns.length) continue search;
				int step = 0;
				for (Term visit : sched.binding.get("P").toTermArray()) {
					String stencil = visit.arg(2).arg(1).toString();
					if (!stencil.equals(patterns[step])) continue search; 					
					step++;
				}
				return true;
			}
		} catch (Exception e) {
			System.err.println("  " + testName + ": exn on schedule search -- " + e.getMessage());
			return false;
		}	
	}
	
	public boolean gracefulError(String fileName) throws Exception {
		try {
			AGEvaluatorSwipl.Schedule sched = AGEvaluatorSwipl.getSchedules(resourceDir, friendlyGrammarDir, fileName, outputDir, false, true, false, false, 20, false);
			throw new Exception("Did not throw an exception");
		} catch (org.antlr.runtime.RecognitionException e){
			return true;
		} catch (InvalidGrammarException e){
			return true;
		} catch (Exception e){			
			e.printStackTrace();
			return false;
		}
	}
	
	public static void test(boolean result, String name) {
		if (result) System.out.println(name); else System.err.println(name);
		if (!result) System.err.println("bad ale parsing / scheduling testing");
		System.out.println("--");
	}

	public static void testExn(boolean result, String name) throws Exception {
		if (result) System.out.println(name); else System.err.println(name);
		if (!result) throw new Exception("bad ale parsing / scheduling testing");
	}

	public static void main(String[] args) throws Exception {
			
		if (args.length != 3) {
			System.err.println("Expected 3 args:");
			System.err.println("  0: resourceDir (..-swipl/AGEvalSwipl)");
			System.err.println("  1: outputDir (..-ftl/)");
			System.err.println("  2: inputDir (..-swipl/Tests/");			
		}
		Tests t = new Tests(args[0] + File.separator, args[1] + File.separator, args[2] + File.separator);
		
		testExn(t.testSingleton("mt"), "mt");
		testExn(t.testSingleton("mtchildren"), "mtchildren");
		testExn(t.testSingleton("mtclass"), "mtclass");
		testExn(t.testSingleton("mtclassfields"), "mtclassfields");
		testExn(t.testSingleton("mtinterface"), "mtinterface");
		testExn(t.testSingleton("mtinterfacefields"), "mtinterfacefields");
		testExn(t.hasPatternSingleton("td1", "td"), "td1 td");
		testExn(t.hasPatternSingleton("label", "tdLtrU"), "label");
		testExn(t.hasPatternSingleton("td1", "tdLtrU"), "td1 inorder");
		testExn(t.hasPatternSingleton("bu1", "bu"), "bu1 bu");
		testExn(t.hasPatternSingleton("bu1", "tdLtrU"), "bu1 inorder");
		testExn(t.hasPatternSingleton("calculator", "bu"), "calculator"); 
		testExn(t.hasPatternSingleton("tdpost", "td"), "tdpost");
		if (AGEvaluatorSwipl.chainLoops) {
			testExn(t.hasPatternSingleton("crosschain1", "td"), "x[i] = f(y[i-1]); y[i] = g(x[i-1])");
			testExn(t.hasPatternSingleton("crosschain2", "bu"), "x[i] = f(y[i-1]); y[i] = g(x[i-1]); z[i] = h(x[i-1],y[i-1],z[i-1])");
			testExn(t.hasPatternSingleton("crosschain3", "tdLtrU"), "node { child.x[i] = f(child.y[i-1]) } child { y = g(x); }");			
		} else {
			test(t.hasPatternSingleton("crosschain1", "td"), "x[i] = f(y[i-1]); y[i] = g(x[i-1])");
			test(t.hasPatternSingleton("crosschain2", "bu"), "x[i] = f(y[i-1]); y[i] = g(x[i-1]); z[i] = h(x[i-1],y[i-1],z[i-1])");
			test(t.hasPatternSingleton("crosschain3", "tdLtrU"), "node { child.x[i] = f(child.y[i-1]) } child { y = g(x); }");
		}
		
				
		String[] td = {"td"};
		//String[] bu = {"bu"};
		String[] tdbu = {"td", "bu"};
		String[] butd = {"bu", "td"};
		String[] tdtd = {"td", "td"};
		//String[] butdtd= {"bu", "td", "td"};
		String[] tdltrutd = {"tdLtrU", "td"};
		
		testExn(t.hasPatternSequenceAleName("tdbu", butd), "tdbu bu td");
		testExn(t.hasPatternSequenceAleName("repmin", butd), "repmin");
		testExn(t.hasPatternSequenceAleName("farthestnode", butd), "farthestnode"); //FIXME final calc of farthest not working
		testExn(t.hasPatternSequenceAleName("tdtdpost", tdtd), "tdtdpost");
		testExn(t.hasPatternSequenceAleName("stateMapSimple", tdbu), "stateMapSimple");
		testExn(t.hasPatternSequenceAleName("tdltruTd", tdltrutd ), "tdltruTd");
		testExn(t.hasPatternSequenceAleName("classOnlyAttribs", td), "class private attributes");
		testExn(t.hasPatternSequenceAleName("loopAssignChild", td), "can fold over children and assign to them (counter)");
		testExn(t.hasPatternSequenceAleName("loopAssignSelf", td), "can fold over children and count them (counter)");
		//test(hasPatternSequence("stateMap", tdbu), "stateMap");
		
		
		testExn(t.gracefulError("childerr.ftl"), "child err");
		testExn(t.gracefulError("childerr2.ftl"), "child err2");
	}

}
