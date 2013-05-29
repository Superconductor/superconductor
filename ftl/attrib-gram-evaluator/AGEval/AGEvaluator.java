package AGEval;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

/** This is the top level that manages the creation of a grammar evaluator and specializer */
public class AGEvaluator {
	
	public final ArrayList<Class> classes;
	public final ArrayList<IFace> interfaces;
	private GrammarEvaluator gramEval = null;
	public final VertexSymbolTable stringMappings;
	
	// Method to run ale without having to call command line args
	public static void runAleGen(AttributeGrammar ag, Boolean debug) throws InvalidGrammarException{
		AGEvaluator agEval = new AGEvaluator(ag.getInterfaces(), ag.getClasses());
		agEval.analyzeGrammar();
        if (debug){
	        agEval.createClassGraph();
	        agEval.createOAGGraph();
		
        }
		if (ag.isUseFTL()){
			agEval.generateFTLVisits();
		}
		if (ag.isCreateGrammarDir()){
			agEval.generateAle(ag.getBaseClass(), ag.getBaseTreeClass(), ag.getBaseDir(), ag.getGrammarName(), ag.isUseFTL());
		}
		else {
			agEval.generateAle(ag.getBaseClass(), ag.getBaseTreeClass(), ag.getBaseDir(), ag.isUseFTL());
		}
	}
	
	public static void badGrammar(String message) throws InvalidGrammarException{
		throw new InvalidGrammarException(message);
	}
	
	// Creates a new AGEvaluator
	public AGEvaluator(ArrayList<IFace> ifaces, ArrayList<Class> clzes){
		classes = clzes;
		interfaces = ifaces;
		stringMappings = new VertexSymbolTable();
	}
	
	public void analyzeGrammar() throws InvalidGrammarException{
		gramEval = new GrammarEvaluator(interfaces, classes, stringMappings, false);
		gramEval.evaluate();
	}

	public void generateFTLVisits() throws InvalidGrammarException{
		if (gramEval == null){
			System.err.println("Error: Must call analyzeGrammar before generating FTL!");
			return;
		}
		gramEval.generateFTL();
	}

	public void generateAle(String baseClass, String baseTreeClass, String basedir, boolean usePar) throws InvalidGrammarException{
		generateAle(baseClass, baseTreeClass, basedir, "userFunction", usePar);
	}

	public void generateAle(String baseclass, String baseTreeClass, String basedir, String grammarName, boolean usePar) throws InvalidGrammarException{
		Generator aleGen = new Generator(classes, interfaces, 
		                                 basedir + java.io.File.separator + grammarName, grammarName);
		aleGen.generateAle(baseclass, baseTreeClass, usePar, true);
	}

	public void createClassGraph(){
		if (gramEval == null){
			System.err.println("Error: Must call analyzeGrammar before retrieving output!");
			return;
		}
		GraphVizOutput gvOut = gramEval.makeDot();
		gvOut.createClassDot();
	}
	
	public void createOAGGraph(){
		if (gramEval == null){
			System.err.println("Error: Must call analyzeGrammar before retrieving output!");
			return;
		}
		GraphVizOutput gvOut = gramEval.makeDot();
		gvOut.createOAGDot();
	}
	
	public void runAleSimulator(AleSimulatorNode root){
		try {
			AleSimulator aleSim = new AleSimulator(root);
			aleSim.simulate();
		}
		catch (IOException e){
			e.printStackTrace();
			System.exit(1);
		}
	}
		
	public static void parseError(String currentArg){
		System.err.println("Parse Error on argument: " + currentArg);
		AGEvaluator.printUsage();
		System.exit(1);
	}
	
	public static void printUsage(){
		System.out.println("----------------------------------------");
		System.out.println("Usage: AGEvaluator [opts]");
		System.out.println("-graph [o] [c] | generate .dot where o = OAGGraph, c = ClassGraph");
		System.out.println("-sim | simulate on document");
		System.out.println("-ale [par] [baseclass=class] [dir=location] [useGramName] | generates Ale with options:\n" +
				"    [par] generate with parallel ftl\n" +
				"    [baseclass=class] override base AleNode class with a user-defined inheriting subclass\n" +
				"    [dir=location] generates code to specified location\n");
		System.out.println("----------------------------------------");
	}
	
	public static void main(String[] args) {
		
		try {
		
	// External Input Grammar---------------------------------------------------------------------------------------
			IFace Top = new IFace("Top");
			Top.addAttributesOfType("int", "x", "y", "w", "h");
        	Top.addPassiveField("borderColor", "string");
        	Top.addPassiveField("borderWidth", "int", "1");
        	Top.addPassiveField("visible", "boolean", "true");

			IFace State = new IFace("State");
			State.addAttributesOfType("int", "x", "y", "w", "h");
			State.addPassiveField("borderColor", "string");
        	State.addPassiveField("borderWidth", "int", "1");
        	State.addPassiveField("visible", "boolean", "true");

			IFace Node = new IFace("Node");
			Node.addAttributesOfType("int", "x", "y", "w", "h");
			Node.addPassiveField("borderColor", "string");
			Node.addPassiveField("borderWidth", "int", "1");
			Node.addPassiveField("visible", "bool", "true");

			Class TopBox = new Class("TopBox", Top);
			TopBox.addChild("root", State);
			TopBox.addField("fx", "int");
			TopBox.addField("fy", "int");
			TopBox.set("x", "fx");
			TopBox.set("y", "fy");
			TopBox.set("root@x", "x");
			TopBox.set("root@y", "y");
			TopBox.set("h", "root@h");
			TopBox.set("w", "root@w");

			Class StateBox = new Class("StateBox", State);
			StateBox.addAttribute("temph", "int");
			StateBox.addChild("name", Node);
			StateBox.addChild("reps", Node);
			StateBox.setAllTo("x", "name@x", "reps@x");
			StateBox.set("name@y", "y");
			StateBox.apply("sum", "temph", "y", "name@h");
			StateBox.set("reps@y", "temph");
			StateBox.apply("sum", "h", "name@h", "reps@h");
			StateBox.apply("max", "w", "name@w", "reps@w");

			Class VBox = new Class("VBox", Node);
			VBox.addAttribute("temph", "int");
			VBox.addChild("child1", Node);
			VBox.addChild("child2", Node);
			VBox.setAllTo("x", "child1@x", "child2@x");
			VBox.set("child1@y", "y");
			VBox.apply("sum", "temph", "y", "child1@h");
			VBox.set("child2@y", "temph");
			VBox.apply("sum", "h", "child1@h", "child2@h");
			VBox.apply("max", "w", "child1@w", "child2@w");
			
			Class HBox = new Class("HBox", Node);
			HBox.addAttribute("tempw", "int");
			HBox.addChild("child1", Node);
			HBox.addChild("child2", Node);
			HBox.setAllTo("y", "child1@y", "child2@y");
			HBox.set("child1@x", "x");
			HBox.apply("sum", "tempw", "x", "child1@w");
			HBox.set("child2@x", "tempw");
			HBox.apply("sum", "w", "child1@w", "child2@w");
			HBox.apply("max", "h", "child1@h", "child2@h");

			Class LeafBox = new Class("LeafBox", Node);
			LeafBox.addField("fh", "int");
			LeafBox.addField("fw", "int");
			LeafBox.set("h", "fh");
			LeafBox.set("w", "fw");
	        LeafBox.addPassiveField("align", "string");
	        LeafBox.addPassiveField("bgColor", "string");
	        LeafBox.addPassiveField("bold", "boolean");
	        LeafBox.addPassiveField("clipsChildren","bool");
	        LeafBox.addPassiveField("clipsSelf","bool");
	        LeafBox.addPassiveField("font", "string");
	        LeafBox.addPassiveField("italic", "boolean");
	        LeafBox.addPassiveField("lgradPCs", "string");
	        LeafBox.addPassiveField("lgradStart", "string");
	        LeafBox.addPassiveField("lgradSLeafBox", "string");
	        LeafBox.addPassiveField("opacity", "float", "1.0f");
	        LeafBox.addPassiveField("rgradCenter", "string");
	        LeafBox.addPassiveField("rgradFP", "string");
	        LeafBox.addPassiveField("rgradPCs", "string");
	        LeafBox.addPassiveField("rgradRadius", "string");
	        LeafBox.addPassiveField("shape", "string");
	        LeafBox.addPassiveField("text", "string");
	        LeafBox.addPassiveField("textColor", "string");
	        LeafBox.addPassiveField("textWeight", "int", "50");     
	        LeafBox.addPassiveField("underline", "boolean");
	        LeafBox.addPassiveField("z", "int");
	        LeafBox.addPassiveField("cornerxRadius","float");
	        LeafBox.addPassiveField("corneryRadius","float");
	        LeafBox.addPassiveField("fontSize","int");
	        LeafBox.addPassiveField("image","string");
					
			ArrayList<IFace> inter = new ArrayList<IFace>();
			ArrayList<Class> classes = new ArrayList<Class>();
			inter.add(Top); inter.add(State); inter.add(Node);
			classes.add(TopBox); classes.add(StateBox); classes.add(VBox); classes.add(HBox); classes.add(LeafBox);

        //---------------------------------------------------------------------
	
	// Create Evaluator
		AGEvaluator agEval = new AGEvaluator(inter, classes);
		agEval.analyzeGrammar();
		
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
				}
				 else if (command.equals("sim")){
					 // Insert sample dynamic input here -----------
/*					AleSimulatorNode AleTop = new AleSimulatorNode(TopBox);
			        AleSimulatorNode VBoxOne = new AleSimulatorNode(VBox);
			        AleSimulatorNode VBoxTwo = new AleSimulatorNode(VBox);
			        AleSimulatorNode LeafOne = new AleSimulatorNode(LeafBox);
			        AleSimulatorNode LeafTwo = new AleSimulatorNode(LeafBox);
			        AleSimulatorNode LeafThree = new AleSimulatorNode (LeafBox);
			        AleTop.addChild("root", Node, VBoxOne);
			        VBoxOne.addChild("child1", Node, VBoxTwo);
			        VBoxOne.addChild("child2", Node, LeafOne);
			        VBoxTwo.addChild("child1", Node, LeafTwo);
			        VBoxTwo.addChild("child2", Node, LeafThree);*/
			        // -----------------------------
	//		        agEval.runAleSimulator(AleTop);
					pos ++;
					continue;
				}
				else if (command.equals("ale")){
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
							baseTreeClass = nextCmd.substring(14);
						}
						else if (nextCmd.startsWith("dir")){
							String testDirStr = nextCmd.substring(4);
							File testDir = new File(testDirStr);
							if (testDir.exists()){
								basedir = testDirStr;
							}
							else {
								System.err.println("Warning: Ignoring non-existent directory " + testDirStr);
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
					try {
						agEval.generateAle(baseclass, baseTreeClass, basedir, usePar);
					}
					catch (InvalidGrammarException e){
						System.err.println(e.getMessage());
						e.printStackTrace();
						System.exit(1);
					}
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
		}
		catch (InvalidGrammarException e){
			System.err.println(e.getMessage());
			e.printStackTrace();
			System.exit(1);
		}
	}
}
// vim: set noet ff=unix ts=8 sw=8 fdm=manual: 
