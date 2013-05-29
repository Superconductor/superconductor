package AGEval;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

public class IFace {
	
	//FIXME static is evil
	public static boolean isFTL = false; // many validity checks incorrect on FTL (e.g., single assignment in conditionals) 
	
	
	public enum ClassType {INTERFACE, CLASS};
	protected static ClassType myType = ClassType.INTERFACE;

	// pubAttributes is the mapping of public attributes to types, those that are accessible in implementing classes.
	protected HashMap<String, Vertex.ValueType> pubAttributes;
	
	// pubFields contains all public fields, fields must contain concrete values (no calculation needed) at runtime.
	protected HashMap<String, Vertex.ValueType> pubFields;
	
	// Passive fields are those that are not involved with layout/grammar, used by code generation parser
	protected HashMap<String, Vertex.ValueType> passiveFields;
	
	// Mapping from ALL fields to user-set default value string
	protected HashMap<String, String> fieldsToDefaultValue;
	
	// Maps external names to Vertices
	protected HashMap<String, Vertex> extNameToVertex;
	
	// myName is the name for an interface defined in the grammar definition.
	protected String myName;
	
	// List of vertices that must be calculated by ith return. This is used during the .evaluate() call.
	protected HashMap<Integer, HashMap<Vertex, HashSet<Class>>> kontracts;
	
	// Vertices associated with this interface
	protected ArrayList<Vertex> vertices;
	
	// Tracks number of visit functions implementing classes must have
	protected int maxNumVisits;

	private ArrayList<Class> implementingClasses;
	
	public IFace(String iFace) throws InvalidGrammarException{
		pubAttributes = new HashMap<String, Vertex.ValueType>();
		pubFields = new HashMap<String, Vertex.ValueType>();
		passiveFields = new HashMap<String, Vertex.ValueType>();
		myName = iFace;
		kontracts = new HashMap<Integer, HashMap<Vertex, HashSet<Class>>>();
		vertices = new ArrayList<Vertex>();
		implementingClasses = new ArrayList<Class>();
		maxNumVisits = 0;
		fieldsToDefaultValue = new HashMap<String, String>();
		extNameToVertex = new HashMap<String, Vertex>();
	}
	
	public void addAttribute(String attrib){
		addAttribute(attrib, "string");
	}
		
	public void addAttribute(String attrib, String type){
		pubAttributes.put(attrib, Vertex.resolveType(type));
	}
	
	public void addAttributes(String...attribs){
		for (String attrib : attribs){
			addAttribute(attrib);
		}
	}
	
	public void addAttributesOfType(String type, String...attribs){
		for (String attrib : attribs){
			addAttribute(attrib, type);
		}
	}
	
	public HashMap<String, Vertex.ValueType> getPubAttributes(){
		return pubAttributes;
	}
	
	public void addField(String field){
		addField(field, "string");
	}
	
	public void addField(String field, String type){
		addFieldInternal(pubFields, field, type, "");
	}
	
	/** Method to create a typed field with a starting defaultValue in string form 
	 *  The system will directly use this value in parsing, i.e. use "\"Hi\"" for the string "Hi"
	 * */
	public void addField(String field, String type, String defaultVal){
		addFieldInternal(pubFields, field, type, defaultVal);
	}
	
	public HashMap<String, Vertex.ValueType> getPubFields(){
		return pubFields;
	}
	
	public void addPassiveField(String field, String type){
		addFieldInternal(passiveFields, field, type, "");
	}
	
	public void addPassiveField(String field, String type, String defaultVal){
		addFieldInternal(passiveFields, field, type, defaultVal);
	}
	
	protected void addFieldInternal(HashMap<String, Vertex.ValueType> map, String field, String type, String defVal){
		if (!isFTL && fieldsToDefaultValue.containsKey(field)){
			System.err.println("Warning: Overwriting an existing field, ignoring request");
			return;
		}
		map.put(field, Vertex.resolveType(type));
		fieldsToDefaultValue.put(field, defVal);
	}
	
	public String getDefaultValueForField(String field){
		return fieldsToDefaultValue.get(field);
	}
	
	protected HashMap<String, String> getFieldsToDefaultValue(){
		return fieldsToDefaultValue;
	}
	
	public HashMap<String, Vertex.ValueType> getPassiveFields(){
		return passiveFields;
	}
	
	public String getName(){
		return myName;
	}
	
	public ClassType getType(){
		return myType;
	}
	
	public boolean isType(ClassType type){
		return type == myType;
	}
	
	public void addKontract(int returnNum, Vertex var, Class cls) throws InvalidGrammarException{
		// reject if already kontracted
		for (int i : kontracts.keySet()){
			HashMap<Vertex, HashSet<Class>> perVisitKontracts = kontracts.get(i);
			if (perVisitKontracts.keySet().contains(var)){
				if (i == returnNum){
					perVisitKontracts.get(var).add(cls);
					return;
				}
				else {
					AGEvaluator.badGrammar("Error: inconsistent Kontracts detected");
					return;
				}
			}
		}
		// does not contain var yet
		if (!kontracts.containsKey(returnNum)){
			HashMap<Vertex, HashSet<Class>> passRequirements = new HashMap<Vertex, HashSet<Class>>();
			kontracts.put(returnNum, passRequirements);
		}
		HashSet<Class> classesEnforcing = new HashSet<Class>();
		classesEnforcing.add(cls);
		kontracts.get(returnNum).put(var, classesEnforcing);
	}
	
	public boolean hasKontracts(){
		return !kontracts.isEmpty();
	}
		
	public HashMap<Integer, HashMap<Vertex, HashSet<Class>>> getKontracts(){
		return kontracts;
	}
	
	public IFace getInterface(){
		return this;
	}
	
	public ArrayList<Vertex> getVertices(){
		return vertices;
	}
	
	@SuppressWarnings("unchecked")
	public ArrayList<Vertex> getCopyOfVertices(){
		return (ArrayList<Vertex>) vertices.clone();
	}
	
	public void addVertex(Vertex toAdd, String externalName){
		vertices.add(toAdd);
		extNameToVertex.put(externalName, toAdd);
	}
	
	@Deprecated
	public Vertex findVertexByExtName(String attrib) throws InvalidGrammarException{
		if (extNameToVertex.containsKey(attrib)){
			return extNameToVertex.get(attrib);
		}
		else {
			AGEvaluator.badGrammar("Error: vertex with name " + attrib + " could not be found in class/interface " + this.getName());
			return null;
		}
	}
	
	public ArrayList<Class> getImplementingClasses(){
		return implementingClasses;
	}
	
	public void addImplementingClass(Class cls){
		implementingClasses.add(cls);
	}
	
	public void reportNumVisits(int val){
		if (val > maxNumVisits)
			maxNumVisits = val;
	}
	
	public int getNumVisits(){
		return maxNumVisits;
	}

	public String toString(){
		return getName();
	}
}
