package AGEval;

import java.io.File;
import java.util.ArrayList;

/** Attribute Grammar defines the API necessary to generate Ale */
public class AttributeGrammar {	
	private String grammarName;
	private String baseDir;
	private String baseClass;
	private String baseTreeClass;
	private ArrayList<Class> classes;
	private ArrayList<IFace> interfaces;
	private boolean useFTL;
	private boolean createGrammarDir;
	
	/**
	 * Creates an Attribute Grammar Instance
	 * @param name = name of the grammar
	 * @param dir = base directory to put generated files
	 * @param basecls = base runtime node class inheriting AleNode
	 * @param clses = array list of classes in the grammar
	 * @param ifaces = array list of interfaces in the grammar
	 * @param ftl = generates FTL compatible code if true
	 * @param useGrammarDir = puts generated files in "dir/name/" if true
	 */
	public AttributeGrammar(String name, String dir, String basecls, String baseTreeCls, ArrayList<Class> clses,
			ArrayList<IFace> ifaces, boolean ftl, boolean useGrammarDir){
		grammarName = name;
		baseDir = dir;
		baseClass = basecls;
		baseTreeClass = baseTreeCls;
		classes = clses;
		interfaces = ifaces;
		useFTL = ftl;
		createGrammarDir = useGrammarDir;
	}
	
	public AttributeGrammar(String name){
		this(name, null, "AleNode", "AleTree", new ArrayList<Class>(), new ArrayList<IFace>(), false, false);
	}

	public void run(Boolean debug) throws InvalidGrammarException{
		AGEvaluator.runAleGen(this, debug);
	}

	public String getGrammarName() {
		return grammarName;
	}

	public void setGrammarName(String grammarName) {
		this.grammarName = grammarName;
	}

	public String getBaseDir() {
		return baseDir;
	}
	
	public void setBaseDir(String baseDir) {
		try {
			File testDir = new File(baseDir);
			if (!testDir.exists()){
				System.err.println("Error: base directory does not exist! Ignoring setBaseDir request.");
				return;
			}
			this.baseDir = baseDir;
		}
		catch (NullPointerException e){
			System.err.println("Error: base directory name is empty!");
		}
	}
	
	public String getBaseClass() {
		return baseClass;
	}
	
	public String getBaseTreeClass() {
		return baseTreeClass;
	}

	public void setBaseClass(String baseClass) {
		this.baseClass = baseClass;
	}

	public ArrayList<Class> getClasses() {
		return classes;
	}

	public void setClasses(ArrayList<Class> classes) {
		this.classes = classes;
	}

	public ArrayList<IFace> getInterfaces() {
		return interfaces;
	}

	public void setInterfaces(ArrayList<IFace> interfaces) {
		this.interfaces = interfaces;
	}

	public boolean isUseFTL() {
		return useFTL;
	}

	public void setUseFTL(boolean useFTL) {
		this.useFTL = useFTL;
	}
	
	public boolean isCreateGrammarDir() {
		return createGrammarDir;
	}
	
	public void setCreateGrammarDir(boolean createGrammarDir) {
		this.createGrammarDir = createGrammarDir;
	}
}
// vim: set noet ff=dos ts=8 sw=8 fdm=manual: 
