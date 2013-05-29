package aleGrammar;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

import org.antlr.runtime.ANTLRFileStream;
import org.antlr.runtime.CommonTokenStream;
import org.antlr.runtime.RecognitionException;



//import aleGrammar.Generators.HHelpers;

import AGEval.AGEvaluator;
import AGEval.AleSimulatorNode;
//import AGEval.Generator;
import AGEval.GrammarEvaluator;
import AGEval.IFace;
import AGEval.InvalidGrammarException;
//import AGEvalSwipl.CppParserGenerator;

public class AleFrontend {
    

	public final ALEParser ast;
	public AGEvaluator alegEval;
	
	
	//stripFloats: if true, 0.0f => 0.0
	public AleFrontend (String aleGrammar, boolean runStaticChecks, boolean stripFloats) throws IOException, RecognitionException, InvalidGrammarException {
		if (aleGrammar.contains("USCORE"))
            throw new InvalidGrammarException("USCORE token is reserved for advanced underscore handling!");
		
		
		if (runStaticChecks) {
			FrontendBeta.checkGrammar(aleGrammar);
			System.out.println("  (checks pass)");
		}
		
		
        //ALELexer lexer = new ALELexer(new ANTLRFileStream(aleGrammar.replace("_", "USCORE")));
		ALELexer lexer = new ALELexer(new ANTLRFileStream(aleGrammar));
		CommonTokenStream tokens = new CommonTokenStream(lexer);
        ast = new ALEParser(tokens);
        ast.stripFloats = stripFloats;
        ast.root(); //force parse...
        
		//treat aliases as an input field on every class; it is the union from all classes
		//skip root nodes
		for (AGEval.IFace face : ast.interfaces) {
			face.addField("refname");
			ast.extendedClasses.get(face).extendedVertices.put("refname", new ALEParser.ExtendedVertex(true, "refnameType"));
			ArrayList<String> aliases = getAliases(ast);
			ast.types.put("refnameType", aliases);
			ast.types.get("refnameType").add("undefined");
			ast.typeVals.addAll(aliases);
			
			face.addField("display");
			ast.extendedClasses.get(face).extendedVertices.put("display", new ALEParser.ExtendedVertex(true, "displaytype"));			
			ArrayList<String> displays = getClassNames(ast);
			ast.types.put("displayType", displays);
			ast.types.get("displayType").add("ignore");
			ast.types.get("displayType").add("textbox");
			ast.typeVals.addAll(displays);

		}	
        
        
	}
	
	//partial initialization of ALE for FTL (FIXME: move into attrib-gram-evaluator-swipl or fix ALE)
	public void initFtl(boolean runAle) throws RecognitionException, InvalidGrammarException {
		AGEval.IFace.isFTL = true;
        alegEval = new AGEvaluator(ast.interfaces, ast.classes);
        if (runAle) { 
	        GrammarEvaluator gramEval = new GrammarEvaluator(alegEval.interfaces, alegEval.classes, alegEval.stringMappings, true);
			gramEval.createGraph(); //init symbols
        }
	}
	

	public static ArrayList<String> getClassNames (ALEParser g) {
		ArrayList<String> res = new ArrayList<String>();
		for (AGEval.Class cls : g.classes) res.add(cls.getName().toLowerCase());
		return res;
	}

	public static ArrayList<String> getAliases (ALEParser g) {
		ArrayList<String> res = new ArrayList<String>();
		for (AGEval.Class c : g.classes) {
			for (String a : c.getChildMappings().keySet()) {
				if (!res.contains(a)) res.add(a);
			}
		}
		return res;
	}

	//1: input grammar file url
    public static void main(String[] args) throws Exception {
    	int numArgs = 1;
        if (args.length < numArgs) {
          System.err.println("Arg 1: ALE grammar file");
          System.err.println("(rest: ALE args)");
          return;
        }
        AleFrontend grammar = new AleFrontend(args[0], true, false);        
        grammar.alegEval.analyzeGrammar();                
        
        //test
		//String[] newArgs = new String[args.length - numArgs]; //chop off file name..
		//for (int i = numArgs; i < args.length; i++) newArgs[i - numArgs] = args[i];		
		//runSample(grammar.alegEval, grammar.ast, newArgs);		
		
    }
    
    public static void runSample (AGEvaluator agEval, ALEParser g, String[] args) throws InvalidGrammarException {
//////
    AGEval.Class TopBox = g.classTable.get("TopBox");
    AGEval.Class VBox = g.classTable.get("VBox");
    AGEval.Class LeafBox = g.classTable.get("LeafBox");
    
    IFace Node = g.interfaceTable.get("Node");
    
//////    

	// External Input to Grammar ---------------------------------------------------------------------------
        AleSimulatorNode AleTop = new AleSimulatorNode(TopBox);
        AleSimulatorNode VBoxOne = new AleSimulatorNode(VBox);
        AleSimulatorNode VBoxTwo = new AleSimulatorNode(VBox);
        AleSimulatorNode LeafOne = new AleSimulatorNode(LeafBox);
        AleSimulatorNode LeafTwo = new AleSimulatorNode(LeafBox);
        AleSimulatorNode LeafThree = new AleSimulatorNode (LeafBox);
        AleTop.addChild("root", Node, VBoxOne);
        VBoxOne.addChild("child1", Node, VBoxTwo);
        VBoxOne.addChild("child2", Node, LeafOne);
        VBoxTwo.addChild("child1", Node, LeafTwo);
        VBoxTwo.addChild("child2", Node, LeafThree);
	
	// Parse Command Args
		int pos = 0;
		
		while (pos < args.length){
			String currentArg = args[pos];
			if (currentArg.startsWith("-")){
				String command = currentArg.substring(1).toLowerCase();
				if (command.equals("graph")){
					int nextPos = pos + 1;
					while (nextPos < args.length){
						String nextArg = args[nextPos];
						if (nextArg.startsWith("-")){
							break;
						}
						else if (nextArg.equals("c")){
							agEval.createClassGraph();
						}
						else if (nextArg.equals("o")){
							agEval.createOAGGraph();
						}
						else {
							AGEvaluator.parseError(nextArg);
						}
						nextPos ++;
					}
					pos = nextPos;
					continue;
				} else if (command.equals("ale")){
					String baseclass = "AleNode";
					String baseTreeClass = "AleTree";
					String basedir = null;
					boolean usePar = false;
					int nextPos = pos + 1;
					while (nextPos < args.length){
						String nextCmd = args[nextPos];
						if (nextCmd.equals("par")){
							usePar = true;
						}
						else if (nextCmd.startsWith("baseclass")){
							baseclass = nextCmd.substring(10);
						}
						else if (nextCmd.startsWith("basetreeclass")){
							baseTreeClass = nextCmd.substring(10);
						}
						else if (nextCmd.startsWith("dir")){
							String testDirStr = nextCmd.substring(4);
							File testDir = new File(testDirStr);
							if (testDir.exists()){
								basedir = testDirStr;
							}
							else {
								System.err.println("Warning: Ignorning non-existent directory " + testDirStr);
							}
						}
						else if (nextCmd.startsWith("-")){
							break;
						}
						else {
							AGEvaluator.parseError(nextCmd);
						}
						nextPos ++;
					}
					agEval.generateAle(baseclass, baseTreeClass, basedir, usePar);
					pos = nextPos;
				}
				else {
					AGEvaluator.parseError(currentArg);
				}
			}
			else {
				AGEvaluator.parseError(currentArg);
			}
		}
//////    
    }

}


