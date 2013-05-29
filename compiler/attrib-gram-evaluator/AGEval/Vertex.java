package AGEval;

import AGEval.GrammarEvaluator.VertType;
import AGEval.IFace.ClassType;

/** A vertex represents an attribute or field in a class/interface. */
public class Vertex {
	
	public enum ValueType { INTEGER, BOOLEAN, STRING, FLOAT, COLOR, PX, TAGGEDINT, TAGGEDFLOAT }
	
	public final ValueType myValueType;
	
	// myType is always either FIELD or ATTRIB, UNKNOWN is only used internally in GrammarEvaluator.
	protected VertType myVertexType;
	
	// myVar is the string denoting the field/attrib to be solved, provided in the grammar definition.
	protected String myVar;
	
	// myExtVar is the AG_writer's name for this var which this Vertex represents
	protected String myExtVar;
	
	// myParent is the owner (class/interface) of the var
	protected IFace myParent;
	
	// Tells whether a node is accessible outside its parent or not
	protected boolean publicVertex;
	
	// For Iface nodes, this can be set to true
	protected boolean kontracted;
	
	public Vertex(String var, String extVar, IFace par, ValueType valType, VertType type, boolean isPublic){
		myVar = var;
		myExtVar = extVar;
		myParent = par;
		myValueType = valType;
		myVertexType = type;
		publicVertex = isPublic;
		kontracted = false;
	}
	
	public static String typeToString(ValueType type){
		switch (type){
			case INTEGER:
				return "int";
			case BOOLEAN:
				return "bool";
			case STRING:
				return "std::string";
			case FLOAT:
				return "float";
			case COLOR:
				return "int";
			case PX:
				return "int";
			case TAGGEDINT:
				return "Tagged<int>";
			case TAGGEDFLOAT:
				return "Tagged<float>";
			default:
				return "std::string";
		}
	}
	
	public static String getConvertFuncToString(ValueType type){
		switch (type){
			case INTEGER:
				return "intToString";
			case BOOLEAN:
				return "boolToString";
			case STRING:
				return "";				
			case FLOAT:
				return "floatToString";
			default:
				return "";
		}
	}
	
	public static String getConvertFunc(ValueType type){
		switch (type){
			case INTEGER:
				return "parseInt";
			case BOOLEAN:
				return "parseBool";
			case STRING:
				return "parseString";
			case FLOAT:
				return "parseFloat";
			default:
				return "parseString";
		}
	}
	
	public static String getDefaultValue(ValueType type){
		switch (type){
		case INTEGER:
			return "0";
		case BOOLEAN:
			return "false";
		case STRING:
			return "\"\"";
		case FLOAT:
			return "0.0f";
		default:
			return "\"\"";
	}
}
	
	public boolean isVertexType(VertType type){
		return myVertexType == type;
	}
	
	public VertType getVertexType(){
		return myVertexType;
	}
	
	public String getVar(){
		return myVar;
	}
	
	public String getExtVar(){
		return myExtVar;
	}
	
	public IFace getParent(){
		return myParent;
	}
	
	public ClassType getParentType(){
		return myParent.getType();
	}
	
	public boolean isAccessibleBy(Class cls){
		if (publicVertex)
			return true;
		else {
			return myParent.getName().equals(cls.getName());
		}
	}
	
	public boolean isPublic(){
		return publicVertex;
	}
	
	public void addKontract(int passNumber, Class cls) throws InvalidGrammarException{
		if (getParentType() == ClassType.INTERFACE){
			kontracted = true;
			getParent().addKontract(passNumber, this, cls);
		}
	}
	
	public boolean isKontracted(){
		return kontracted;
	}
	
	
	/** Overwriting .equals to be based on the attribute and parent name */
	public boolean equals(Object o){
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		return myVar.equals(((Vertex) o).getVar()) && 
			myParent.getName().equals(((Vertex) o).getParent().getName());
	}
	
	/** Overwriting hash code */
	public int hashCode(){
		return (myVar + myParent.getName()).hashCode();
	}
	
	/** Overwriting toString */
	public String toString(){
		return myParent.getName() + "@" + myVar;
	}

	public static Vertex.ValueType resolveType(String type){
		String lowerType = type.toLowerCase();
		if (lowerType.equals("str") || lowerType.equals("string")){
			return Vertex.ValueType.STRING;
		} else if (lowerType.equals("int") || lowerType.equals("integer")){
			return Vertex.ValueType.INTEGER;
		} else if (lowerType.equals("bool") || lowerType.equals("boolean")){
			return Vertex.ValueType.BOOLEAN;
		} else if (lowerType.equals("float")){
			return Vertex.ValueType.FLOAT;
		} else if (lowerType.equals("color")) {
			return Vertex.ValueType.COLOR;
		} else if (lowerType.equals("px")) {
			return Vertex.ValueType.PX;
		} else if (lowerType.equals("taggedint")) {
			return Vertex.ValueType.TAGGEDINT;
		} else if (lowerType.equals("taggedfloat")) {
			return Vertex.ValueType.TAGGEDFLOAT;
		} else return Vertex.ValueType.STRING; // default		
	}
	//FTL default type is int (enum)
	public static Vertex.ValueType resolveTypeFtl(String type){
		String lowerType = type.toLowerCase();
		if (lowerType.equals("str") || lowerType.equals("string")){
			return Vertex.ValueType.STRING;
		} else if (lowerType.equals("int") || lowerType.equals("integer")){
			return Vertex.ValueType.INTEGER;
		} else if (lowerType.equals("bool") || lowerType.equals("boolean")){
			return Vertex.ValueType.BOOLEAN;
		} else if (lowerType.equals("float")){
			return Vertex.ValueType.FLOAT;
		} else if (lowerType.equals("color")) {
			return Vertex.ValueType.COLOR;
		} else if (lowerType.equals("px")) {
			return Vertex.ValueType.PX;
		} else if (lowerType.equals("taggedint")) {
			return Vertex.ValueType.TAGGEDINT;
		} else if (lowerType.equals("taggedfloat")) { 
			return Vertex.ValueType.TAGGEDFLOAT;
		}else return Vertex.ValueType.INTEGER; // default
	}
}