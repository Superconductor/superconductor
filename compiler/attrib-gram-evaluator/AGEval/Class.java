package AGEval;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

/** A Class implements a single interface (single inheritance). This means that all the interface's 
 *  attributes must be defined here as well. In the future, classes need to be sugared so attributes 
 *  and fields of classes and interfaces can be named the same by the user (but still unique to AG eval).
 */
public class Class extends IFace{
	
	// myMappings stores directional edges from each edge "x" to other edges that depend on the original edge "x".
	protected HashMap<String, ArrayList<String>> myMappings;
	
	// a list of all attributes that have definitions in this class
	protected HashSet<Vertex> myDefns;
	
	// set of functions invoked by the class
	protected HashSet<Function> functions;
	
	// maps from destination vertex to function used to compute
	protected HashMap<Vertex, HashSet<Function>> vertexToFunction;
	
	// A class must extend one and only one interface. This is set in the constructor.
	protected IFace myInterface = null;
	
	// Private attributes are attributes that are not found in the class's interface. These attributes have local scope.
	protected HashMap<String, Vertex.ValueType> privAttributes;
	
	// Private fields also have local scope and must have concrete values upon instantiation.
	protected HashMap<String, Vertex.ValueType> privFields;
	
	// Children binds the string names given by the grammar definition to the actual interface of the child node.
	protected HashMap<String, IFace> myChildren;
	
	protected HashMap<IFace, ArrayList<String>> iFaceToChildren;
	
	protected static ClassType myType = ClassType.CLASS;
	
	// TD/BU Passes over vertices of this class
	protected ArrayList<ArrayList<Vertex>> vertexPasses;
	
	// order in which to call children
	protected ArrayList<HashSet<IFace>> childCallOrder;

	// Visitor Functions for this class
	protected ArrayList<ArrayList<EvalStep>> visitors;
	
	// Visitors in FTL inherited/synthesized passes (always starts w/inherited)
	protected ArrayList<ArrayList<EvalStep>> ftlVisitors;
	
	protected Class(String cls) throws InvalidGrammarException{
		super(cls);
		myMappings = new HashMap<String, ArrayList<String>>();
		myDefns = new HashSet<Vertex>();
		functions = new HashSet<Function>();
		vertexToFunction = new HashMap<Vertex, HashSet<Function>>();
		myChildren = new HashMap<String, IFace>();
		iFaceToChildren = new HashMap<IFace, ArrayList<String>>();
		privAttributes = new HashMap<String, Vertex.ValueType>();
		privFields = new HashMap<String, Vertex.ValueType>();
		childCallOrder = new ArrayList<HashSet<IFace>>();
	}
	
	public Class(String cls, IFace iFace) throws InvalidGrammarException{
		this(cls);
		myInterface = iFace;
		pubAttributes.putAll(iFace.getPubAttributes());
		pubFields.putAll(iFace.getPubFields());
		passiveFields.putAll(iFace.getPassiveFields());
		fieldsToDefaultValue.putAll(iFace.getFieldsToDefaultValue());
		iFace.addImplementingClass(this);
	}
	
	// Adds a directional edge into myMappings
	public void set(String dest, String arg){
		addFunc("SET", dest, arg);
		addMappings(dest, arg);
	}
	
	// Adds multiple edges into myMappings
	public void setAllTo(String src, String... dests){
		for (String dest : dests){
			addFunc("SET", dest, src);
			addMappings(dest, src);
		}
	}
	
	public void apply(String funcName, String dest){
		Function newFunc = new Function(funcName, dest);
		functions.add(newFunc);
	}
	
	public void apply(String funcName, String dest, String... args){
		addFunc(funcName, dest, args);
		addMappings(dest, args);
	}

	public void applyMud(String funcName, String dest, String[] args) {
		if (args.length == 0){
			apply(funcName, dest);
		}
		else {
			apply(funcName, dest, args);
		}
	}

	// Internal method to add function mapping
	private void addFunc(String funcName, String dest, String... args){
		Function newFunc = new Function(funcName, dest, args);
		functions.add(newFunc);
	}
	
	public boolean hasFunctionFor(Vertex vert){
		return vertexToFunction.containsKey(vert);
	}
	
	// Assumes checked by hasFunctionFor
	public HashSet<Function> getFunctionsFor(Vertex vert){
		return vertexToFunction.get(vert);
	}
	
	public HashSet<Function> getFunctions(){
		return functions;
	}
	
	public void setFunctionMapping(Function func, Vertex dest){
		if (vertexToFunction.containsKey(dest)){
			vertexToFunction.get(dest).add(func);
		}
		else {
			HashSet<Function> newSet = new HashSet<Function>();
			newSet.add(func);
			vertexToFunction.put(dest, newSet);
		}
	}
	
	/** Internal method to add to the mappings */
	private void addMappings(String dest, String... args){
		ArrayList<String> target;
		if (myMappings.containsKey(dest)){
			System.err.println("Warning: Multiple assignments to " + dest + " detected, existing sources");
			for (String s : myMappings.get(dest)) {
				System.err.println("  Source: " + s);
			}
			target = myMappings.get(dest);
			System.err.println("Conflicting assignment: ");
			for (String s : args) {
				System.err.println("  Source: " + s);
			}
		} else {
			target = new ArrayList<String>();
			myMappings.put(dest, target);
		}
		for (String oneArg : args){
			target.add(oneArg);
		}
	}
	
	public HashMap<String, ArrayList<String>> getMappings(){
		return myMappings;
	}
	
	public void addDefinition(Vertex target){
		myDefns.add(target);
	}
	
	public boolean hasDefinitionFor(Vertex target){
		return myDefns.contains(target);
	}
	
	public IFace getInterface(){
		return myInterface;
	}

	public boolean hasInterface(IFace iface){
		return myInterface == iface;
	}
	
	// Adds a private (local) attribute
	public void addAttribute(String attrib, String type){
		privAttributes.put(attrib, Vertex.resolveType(type));
	}
	
	public HashMap<String, Vertex.ValueType> getPrivAttributes(){
		return privAttributes;
	}
	
	public ArrayList<String> getPubFieldsByType(Vertex.ValueType type){
		return getAllOfType(pubFields, type);
	}
	
	public ArrayList<String> getPassiveFieldsByType(Vertex.ValueType type){
		return getAllOfType(passiveFields, type);
	}
	
	// Returns the string names of all public attributes
	public ArrayList<String> getPubAttribsByType(Vertex.ValueType type){
		return getAllOfType(pubAttributes, type);
	}
	
	private ArrayList<String> getAllOfType(HashMap<String, Vertex.ValueType> mapping, Vertex.ValueType type){
		ArrayList<String> returning = new ArrayList<String>();
		for (String value : mapping.keySet()){
			if (mapping.get(value) == type){
				returning.add(value);
			}	
		}
		return returning;
	}
	
	// Class-added fields are all private
	public void addField(String field){
		addField(field, "string");
	}
	
	public void addField(String field, String type){
		addFieldInternal(privFields, field, type, "");
	}
	
	public void addField(String field, String type, String defValue){
		addFieldInternal(privFields, field, type, defValue);
	}
	
	public void addPassiveField(String field, String type){
		addFieldInternal(passiveFields, field, type, "");
	}
	
	public void addPassiveField(String field, String type, String defValue){
		addFieldInternal(passiveFields, field, type, defValue);
	}
	
	// has a field for evaluation, not including passiveFields
	public boolean hasField(String field){
		return pubFields.containsKey(field) || privFields.containsKey(field);
	}
	
	public HashMap<String, Vertex.ValueType> getPrivFields(){
		return privFields;
	}
	
	public void addChild(String name, IFace child) throws InvalidGrammarException{
		if (!child.isType(ClassType.INTERFACE)){
			AGEvaluator.badGrammar("class child must be of interface type: " + this.getName() + " child " + child.getName());
		}
		myChildren.put(name, child);
		if (iFaceToChildren.containsKey(child)){
			iFaceToChildren.get(child).add(name);
		}
		else {
			ArrayList<String> namesList = new ArrayList<String>();
			namesList.add(name);
			iFaceToChildren.put(child, namesList);
		}
	}
	
	public boolean hasChildType(IFace chld){
		return iFaceToChildren.containsKey(chld);
	}
	
	public boolean hasChildName(String name){
		return myChildren.containsKey(name);
	}
	
	public boolean hasChildren(){
		return !myChildren.isEmpty();
	}
	
	public boolean hasChild(String name, IFace type){
		return myChildren.containsKey(name) && myChildren.get(name).equals(type);
	}
	
	/** Returns the value for the name key, assumes a boolean check with
	 *  hasChildName has been made */	
	public IFace getChildByName(String name){
		return myChildren.get(name);
	}
	
	public HashMap<String, IFace> getChildMappings(){
		return myChildren;
	}
	
	public HashSet<IFace> getChildrenTypes(){
		HashSet<IFace> newSet = new HashSet<IFace>();
		for (IFace iface : iFaceToChildren.keySet()){
			newSet.add(iface);
		}
		return newSet;
	}
	
	public ArrayList<String> getChildNamesForType(IFace type){
		return iFaceToChildren.get(type);
	}
	
	public boolean isType(ClassType type){
		return myType == type;
	}
	
	public ClassType getType(){
		return myType;
	}
	
	public boolean hasKontracts(){
		return myInterface.hasKontracts();
	}
	
	public HashMap<Integer, HashMap<Vertex, HashSet<Class>>> getKontracts(){
		return myInterface.getKontracts();
	}
	
	@Deprecated
	public Vertex findVertex(String var){
		for (Vertex vert : vertices){
			if (vert.getVar().equals(var)){
				return vert;
			}
		}
		return null;
	}
	
	@Deprecated
	public Vertex getInterfaceVertexForAttrib(String attrib) throws InvalidGrammarException{
		return myInterface.findVertexByExtName(attrib);
	}
	
	public ArrayList<ArrayList<Vertex>> getVertexPasses(){
		return vertexPasses;
	}

	public void setVertexPasses(ArrayList<ArrayList<Vertex>> vertexPasses){
		this.vertexPasses = vertexPasses;
	}
	
	public ArrayList<HashSet<IFace>> getChildCallOrder() {
		return childCallOrder;
	}

	public void setChildCallOrder(ArrayList<HashSet<IFace>> childCallOrder) {
		this.childCallOrder = childCallOrder;
	}
	
	public void setVisitors(ArrayList<ArrayList<EvalStep>> visitFuncs){
		visitors = visitFuncs;
	}
	
	public ArrayList<ArrayList<EvalStep>> getVisitors(){
		return visitors;
	}
	
	public void setFTLVisits(ArrayList<ArrayList<EvalStep>> ftlVisits){
		ftlVisitors = ftlVisits;
	}
	
	public ArrayList<ArrayList<EvalStep>> getFTLVisitors(){
		return ftlVisitors;
	}
	
	public String toString(){
		return getName();
	}
}
