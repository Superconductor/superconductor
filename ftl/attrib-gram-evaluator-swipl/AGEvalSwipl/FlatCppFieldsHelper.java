package AGEvalSwipl;

import java.util.HashSet;

import AGEval.IFace;
import AGEval.InvalidGrammarException;
import AGEvalSwipl.AGEvaluatorSwipl.Schedule;
import aleGrammar.ALEParser;
import aleGrammar.ALEParser.ExtendedVertex;

class FlatCppFieldsHelper {
	// The the placeholder FTL type name to use when we're dealing with one of the grammar tokens that we hold in a
	// enum in C++ code
	public static final String enum_type_name = "GrammarTokens";
	// The name of the num in C++ which holds the grammar tokens
	public static final String enum_name = "unionvariants";
	
	private ALEParser ast;
	@SuppressWarnings("unused")
	private Schedule sched;
	private HashSet<Field> fields;
	
	
	public FlatCppFieldsHelper(ALEParser ast, Schedule sched) throws InvalidGrammarException {
		fields = new HashSet<Field>();
		
		parseAstAndSchedule(ast, sched);
		
		// Add in refname and display by default. They have no specific class.
		addField(null, "display", enum_type_name);
		addField(null, "refname", enum_type_name);
		
		// Ditto rightSibling
		addField(null, "right_siblings", "NodeIndex");
	}
	
	public HashSet<Field> getFields() {
		return fields;
	}
	
	
	// Called by constructor to generate Field objects for each variable in
	// a given AST
	private void parseAstAndSchedule(ALEParser ast, Schedule sched) throws InvalidGrammarException {
		this.ast = ast;
		
		// For each interface
		for (IFace interf : ast.interfaces) {
			ALEParser.ExtendedClass ec = ast.extendedClasses.get(interf);
			
			// Parse the positioned input fields (ignore positioning for now)
			for(String property : ec.positionedInputs.values()) {
				addField(interf, property);
			}
			
			// Parse the public unpositioned variables
			for(String property : interf.getPubAttributes().keySet()) {
				addField(interf, property);
			}

			// Parse the interface's public fields
			for(String property : interf.getPubFields().keySet()) {
				addField(interf, property);
			}
		}
		
		// Now go through the classes parsing their fields as well
		for (AGEval.Class c : ast.classes) {
			for (String property : c.getPrivFields().keySet()) {
				addField(c, property);
			}
			
			for (String property : c.getPrivAttributes().keySet()) {
				addField(c, property);
			}
			
			// Generate collections
			for (String child_field : c.getChildMappings().keySet()) {
				addField(c, "child_" + child_field + "_leftmost_child", "NodeIndex");
				addField(c, "child_" + child_field + "_count", "int");
			}
			
			// Generate sinks
			for (String sink : sched.reductions.sinks.get(c)) {
				String sink_type;
				
				// Check if the property in question is actually from a child
				if(sink.contains("@") && !sink.contains("self@")) {
					String child_name = sink.split("@")[0];
					AGEval.IFace child_iface = c.getChildMappings().get(child_name);
					sink_type = astPropertyToCppTypeString(sink.split("@")[1], child_iface);
				} else {
					sink_type = astPropertyToCppTypeString(sink, c);
				}
				
				if(sink.contains("@") && !sink.contains("self@")) {
					sink = sink.replace("@", "_");
				}
				addField(c, sink + "_init", sink_type);
				addField(c, sink + "_last", sink_type);
			}
		}
	}

	
	// Finds the Field object corresponding a given FTL class and property name.
	// Returns null if can not find existing Field matching FTL data.
	// cls may be null.
	public Field findCppField(AGEval.IFace cls, String property) {
		String clean_prop_name = property.toLowerCase();
		if(property.contains("@") && !property.contains("self@")) {
			clean_prop_name = property.replace("@", "_");
		}
		
		// Fields with null classes match all classes (handles refname, display)
		// The property may also come from the cls' interface
		for(Field field : fields) {
			if(field.ftlName.toLowerCase().equals(clean_prop_name) && (cls == null || field.getCls() == null || field.getCls() == cls || field.getCls() == cls.getInterface())) {
				return field;
			}
		}
		
		return null;
	}
	
	
	// Adds a given field to our list of fields
	// This version allows one to provide an explicit C++ type rather than
	// automatically inferring it as in the other version. cls may be null.
	public Field addField(AGEval.IFace cls, String property, String cppType) throws InvalidGrammarException {
		Field new_field;

		// Check if this field already exists and, if so, don't re-add it
		new_field = findCppField(cls, property);
		if(new_field != null) {
			return new_field;
		}

		new_field = new Field(cls, property, cppType);
		fields.add(new_field);
		
		// If this is a maybe type, we have to add a maybe field
		if(new_field.isMaybeType()) {
			System.err.println(new_field.getCppName() + " is a maybe type");
		}
		
		// TODO: Add support for 'maybe' types
		if(new_field.isMaybeType()) {
			throw new InvalidGrammarException("'maybe' types are not yet implemented in the Flat C++ backend. Go yell at Matt.");
		}
		
		return new_field;
	}
	
	// Adds a given field to our list of fields. Automatically infers correct
	// C++ type for a given property of a class.
	public Field addField(AGEval.IFace cls, String property) throws InvalidGrammarException {
		String type = typeStringToFlatCppType(astPropertyToCppTypeString(property, cls));
		
		return addField(cls, property, type);
	}
	
	
	// Takes a String representing the FTL type of a field, returns a String
	// representing the C++ type.
	// Taken for CppGenerator
	public static String typeStringToFlatCppType(String type) throws InvalidGrammarException {
		String lType = type.toLowerCase();
		
		if (lType.equals("int") || lType.equals("time") || lType.equals("color") || lType.equals("px")) {
			return "int"; 
		} else if (lType.equals("bool")) {
			return "bool";
		} else if(lType.equals("float")) {
			return "float";
		} else if (lType.equals("string") || lType.equals("std::string") || lType.equals("const char *")) {
			return "const char*";
		} else if (lType.equals("vbo")) {
			// VBO HACK
			return "float";
		} else {
			return enum_type_name;
		}
	}
	
	// Converts an FTL property's type to equivalent C++ type
	public String astPropertyToCppTypeString(String property, AGEval.IFace cls) throws InvalidGrammarException {
		// If the class doesn't have it, check its interface
		if(ast.extendedClasses.get(cls).extendedVertices.get(property) == null) {
			cls = cls.getInterface();
		}
		
		String ftl_type = ast.extendedClasses.get(cls).extendedVertices.get(property).strType;
		
		return typeStringToFlatCppType(ftl_type);
	}
	
	
	///////////////////////////////////////////////////////////////////////////
	// Simple struct class to hold one data on a single field from the AST
	///////////////////////////////////////////////////////////////////////////
	class Field {		
		// Can be null only in case of refname or display or may not actually
		// contain property (as in case of _leftmost_child)
		private AGEval.IFace cls;
		private String type;
		private String ftlName;
		
		public Field(IFace cls, String ftl_name, String cppType) {
			this.ftlName = ftl_name;
			this.type = cppType;
			
			// display and refname have no class
			if(ftl_name.equals("display") || ftl_name.equals("refname")) {
				this.cls = null;
			} else {
				this.cls = cls;
			}
		}

		public String getCppName() {
			String clean_prop_name =  ftlName.toLowerCase().replaceAll("-", "").replaceAll(" ", "");

			// Handle things like refname and rightSiblings
			if(cls == null) {
				if(ftlName.equals("display")) {
					return "displayname";
				}
				return clean_prop_name;
			}
			
			String clean_class_name =  cls.getName().toLowerCase().replaceAll("-", "").replaceAll(" ", "");
			
			return "fld_" + clean_class_name + "_" + clean_prop_name;
		}
		
		// This function returns the name to use when accessing this field as a rhs.
		// Main difference is that it will cast token enum types correctly
		public String getCppRhsName() {
			String cast = "";
			if(type == FlatCppFieldsHelper.enum_type_name) {
				cast = "(enum " + FlatCppFieldsHelper.enum_name + ") ";
			}
			
			return cast + getCppName();
		}
				
		public AGEval.IFace getCls() {
			return cls;
		}
		
		public String getFtlName() {
			return ftlName;
		}
		
		public String getCppType() {
			return type;
		}
		
		public Boolean isMaybeType() {
			if(cls == null) {
				return false;
			}
			
			ALEParser.ExtendedClass ec = ast.extendedClasses.get(cls);
			ExtendedVertex v = ec.extendedVertices.get(ftlName);
			
			if(v == null) {
				return false;
			} else {
				return v.isMaybeType;
			}
		}
	}
}
