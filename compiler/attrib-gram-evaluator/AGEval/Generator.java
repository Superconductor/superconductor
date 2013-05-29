package AGEval;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import AGEval.Vertex.ValueType;

/** Generator is the top level code-generator for both parallel and sequential ALE */
public class Generator {
	
	private ArrayList<Class> classes;
	private ArrayList<IFace> interfaces;
	// Basedir is where the generated files will be placed
	private String baseDirectory;
	private String userLibsName;

	private static String sep = File.separator;
	private static String[] rscDirs = {"/rsc/", ".."+sep+"backends"+sep, "/Users/lmeyerov/Research/parallelbrowser/bbbrowser/projects/backends/"};
	private static String rscDir = null;


	static {		
		for (String prefix: rscDirs) {
			URL u = Generator.class.getResource(prefix);
			if (u != null || new File(prefix).exists()) {
				rscDir = prefix;
				break;
			}
		}

		if (rscDir == null) {
			System.err.println("Cannot find backend resources directory.");
			System.exit(-1);
		}

		System.out.println("Using backend resources from " + rscDir);
	}

	public Generator(ArrayList<Class> cls, ArrayList<IFace> ifaces, String basedir, String userLibs){
		classes = cls;
		interfaces = ifaces;
		baseDirectory = basedir;
		userLibsName = userLibs;
		if (baseDirectory != null){
			new File(baseDirectory).mkdirs();
		}
	}
	
	public void generateAle(String baseclass, String baseTreeClass, boolean usePar, boolean useGramName){
			generateSequential(baseclass, baseTreeClass, useGramName);
	}
	
	public FileWriter generateWriterFor(String filename) throws IOException {
		return new FileWriter(new File(baseDirectory, filename));
	}
	
	//------------------------- Sequential ALE -----------------------------------------------
	
	public void generateSequential(String baseclass, String baseTreeClass, boolean useGramName){
		try {
			generateSequentialAle(baseclass);
			generateAleNodeBaseClass();
			generateAleInputParser(baseclass, baseTreeClass);
			generateLibs();
			if (baseDirectory != null){
				moveStaticFiles();
				if (useGramName){
					moveBackendFiles(baseclass);
				}
			}
		}
		catch (IOException e){
			System.err.println("Error generating ALE!");
			e.printStackTrace();
			System.exit(1);
		}
	}
	
	private void generateSequentialAle(String baseclass) throws IOException{

		FileWriter headerWriter = generateWriterFor("ale.h");
		FileWriter cppWriter = generateWriterFor("ale.cpp");
		
		String baseclassLower = baseclass.toLowerCase();
		cppWriter.write("#include \"ale.h\"\n\n");
		headerWriter.write("#include \"functions.h\"\n#include \"" + baseclassLower + ".h\"\n\n");
		
		//if preprocess
		headerWriter.write("#ifndef ALE\n#define ALE\n\n");
		
		for (IFace iface : interfaces){
			codeGenerateForInterface(iface, headerWriter, cppWriter, baseclass);
		}
		for (Class cls : classes){
			codeGenerateForClass(cls, headerWriter, cppWriter, baseclass);
		}
		
		//endif preprocess
		headerWriter.write("#endif\n\n");
		
		headerWriter.close();
		cppWriter.close();
		
	}
	
	/** generate the ALE cpp classes for a given interface */
	private void codeGenerateForInterface(IFace iface, FileWriter headerWriter, 
			FileWriter cppWriter, String baseclass) throws IOException{
		HashMap<String, Vertex.ValueType> pubFields = iface.getPubFields();
		HashMap<String, Vertex.ValueType> pubAttribs = iface.getPubAttributes();
		
		String ifaceHeader = "";
		String tab = "    ";
		String ifaceCpp = "";
		
		// Class Def
		ifaceHeader += "class " + iface.getName() + " : public " + baseclass + " {\n\n";
		
		// public:
		ifaceHeader += "public:\n";
		
		// vars
		for (String field : sort(pubFields.keySet())){
			ifaceHeader += tab + Vertex.typeToString(pubFields.get(field)) + " " + field + ";\n";
		}
		for (String attrib : sort(pubAttribs.keySet())){
			ifaceHeader += tab + Vertex.typeToString(pubAttribs.get(attrib)) + " " + attrib + ";\n";
		}
		
		// addChild
		ifaceHeader += tab + "virtual void addChild(" + baseclass + "* child, std::string refName){};\n";
		
		// visits
		int numVisits = Math.max(1, iface.getNumVisits());
		
		for (int i = 0; i < numVisits; i++){
			ifaceHeader += tab + "virtual void visit" + i + "(){};\n";
		}
		
		// accessors
		ifaceHeader += tab + "virtual int getAttribInt(std::string attribName){return 0;};\n";
		ifaceHeader += tab + "virtual std::string getAttribStr(std::string attribName){return \"\";};\n";
		ifaceHeader += tab + "virtual float getAttribFloat(std::string attribName){return 0.0f;};\n";
		ifaceHeader += tab + "virtual bool getAttribBool(std::string attribName){return false;};\n";
		
		// toString
		ifaceHeader += tab + "virtual std::string toString(){return \"\";};\n";
		ifaceHeader += "};\n\n";
		
		headerWriter.write(ifaceHeader);
		cppWriter.write(ifaceCpp);
	}
	
	private String codeGenerateToString(HashMap<String, ValueType> map){
		String toStringCode = "";
		for (String id : sort(map.keySet())){
			ValueType myType = map.get(id);
			toStringCode += "    returning += \"" + id + ": \" + " + Vertex.getConvertFuncToString(myType) + "(this->" + id + ") + \"\\n\";\n";
		}
		return toStringCode;
	}
	
	/** generate the ALE cpp classes for a given class */
	private void codeGenerateForClass(Class cls, FileWriter headerWriter, FileWriter cppWriter, String baseclass) throws IOException{
		HashMap<String, Vertex.ValueType> privFields = cls.getPrivFields();
		String classHeader = "", classCpp = "";
		String tab = "    ";
		
		// Class Def
		classHeader += "class " + cls.getName() + " : public " + cls.getInterface().getName() + " {\n\n";
		
		// public:
		classHeader += "public:\n";
		
		// Constructor
		classHeader += tab + cls.getName() + "();\n";
		classCpp += generateClassConstructorCPP(cls, baseclass);
		
		// Child Declarations
		classHeader += generateClassChildDeclarations(cls);
		
		// Passive Fields
		classHeader += generatePassiveFields(cls);
		
		// Setters for priv fields
		for (String privField : sort(privFields.keySet())){
			String methodName = "set" + privField;
			String argType = Vertex.typeToString(privFields.get(privField));
			classHeader += generateFieldAccessorHeader(methodName, argType);
			classCpp += generateFieldAccessorCpp(cls, privField, argType);
		}
		
		// addChild
		classHeader += tab + "void addChild(" + baseclass + "* child, std::string refName);\n";
		classCpp += generateAddChildCpp(cls, baseclass);
		
		// isReady
		classHeader += tab + "bool isReady();\n";
		classCpp += generateIsReadyCpp(cls);
		
		// visits
		classHeader += generateVisitorsHeader(cls.getVisitors().size());
		classCpp += generateVisitorsCpp(cls);
		
		//accessors
		classHeader += tab + "int getAttribInt(std::string attribName);\n";
		classCpp += generateAccessorInt(cls);
		classHeader += tab + "std::string getAttribStr(std::string attribName);\n";
		classCpp += generateAccessorStr(cls);
		classHeader += tab + "float getAttribFloat(std::string attribName);\n";
		classCpp += generateAccessorFloat(cls);
		classHeader += tab + "bool getAttribBool(std::string attribName);\n";
		classCpp += generateAccessorBool(cls);
		
		// toString
		classHeader += tab + "std::string toString();\n";
		classCpp += "std::string " + cls.getName() + "::toString(){\n" + tab + "std::string returning = \"" + cls.getName() + ":\\n\";\n";
		classCpp += codeGenerateToString(cls.getPubFields());
		classCpp += codeGenerateToString(cls.getPassiveFields());
		classCpp += codeGenerateToString(cls.getPubAttributes());
		classCpp += codeGenerateToString(privFields);
		classCpp += codeGenerateToString(cls.getPrivAttributes());
		classCpp += tab + "return returning;\n}\n\n";
		
		// private:
		classHeader += generatePrivs(cls);
		
		classHeader += "};\n\n";
		
		headerWriter.write(classHeader);
		cppWriter.write(classCpp);
	}
	
	private String generateClassConstructorCPP(Class cls, String baseclass){
		String cpp = cls.getName() + "::" + cls.getName() + "(){\n";
		cpp += "    myType = AleNode::" + cls.getInterface().getName().toUpperCase() + ";\n";
		for (String childName : sort(cls.getChildMappings().keySet())){
			cpp += "    " + childName + " = NULL;\n";
		}
		int numChildren = cls.getChildMappings().size(); //TODO: will change with lists
		cpp += "    children = new " + baseclass + "*[" + numChildren + "];\n";
		cpp += "}\n\n";
		return cpp;
	}
	
	private String generateClassChildDeclarations(Class cls){
		String header = "";
		HashMap<String, IFace> childMappings = cls.getChildMappings();
		for (String childName : sort(childMappings.keySet())){
			header += "    " + childMappings.get(childName).getName() + "* " + childName + ";\n";
		}
		return header;
	}
	
	private String generatePassiveFields(Class cls){
		HashMap<String, Vertex.ValueType> fields = cls.getPassiveFields();
		String header = "";
		for (String field : sort(fields.keySet())){
			header += "    " + Vertex.typeToString(fields.get(field)) + " " + field + ";\n";
		}
		return header;
	}
	
	private String generateFieldAccessorHeader(String methodName, String type){
		return "    void " + methodName + "(" + type + " val);\n";
	}
	
	private String generateFieldAccessorCpp(Class cls, String field, String type){
		String cpp = "void " + cls.getName() + "::set" + field + "(" + type + " val){\n";
		cpp += "    " + field + " = val;\n";
		cpp += "}\n\n";
		return cpp;
	}
	
	private String generateAddChildCpp(Class cls, String baseclass){
		HashMap<String, IFace> childMappings = cls.getChildMappings();
		String cpp = "void " + cls.getName() + "::addChild(" + baseclass + "* child, std::string refName){\n";
		int childCount = cls.getChildMappings().size(); //TODO: will change with lists
		cpp += "    if (numChildren > " + childCount + "){\n" +
				"        std::cout << \"Warning: too many children added\";\n" +
				"        return;\n    }\n";
		if (childCount > 0){
			cpp += "    this->children[numChildren] = child;\n";
			boolean first = true;
			for (String refName : sort(childMappings.keySet())){
				String iff = first ? "if" : "else if";
				String ifaceName = childMappings.get(refName).getName();
				String ifaceType = ifaceName.toUpperCase();
				cpp += "    " + iff + " (refName.compare(\"" + refName + "\") == 0){\n" +
						"        if (child->myType == AleNode::" + ifaceType + "){\n" +
						"            " + refName + " = (" + ifaceName + "*) child;\n        }\n" +
						"        else {\n" +
						"            std::cout << \"Warning: child doesn't match expected type\";\n        }\n    }\n";
				first = false;
			}
			cpp += "    else {\n" +
					"        std::cout << \"Warning: child missing refName\";\n    }\n";
			
			cpp += "    numChildren ++;\n";
		}
		cpp += "}\n\n";
		return cpp;
	}
	
	private String generateIsReadyCpp(Class cls){
		String cpp = "bool " + cls.getName() + "::isReady(){\n";
		for (String childName : sort(cls.getChildMappings().keySet())){
			cpp += "    if (" + childName + " == NULL) return false;\n";
		}
		cpp += "    return true;\n";
		cpp += "}\n\n";
		return cpp;
	}
	
	private String generateVisitorsHeader(int visits){
		String header = "";
		int counter = 0;
		while (counter < visits){
			header += "    void visit" + counter + "();\n";
			counter++;
		}
		return header;
	}
	
	private String generateVisitorsCpp(Class cls){
		ArrayList<ArrayList<EvalStep>> visitors = cls.getVisitors();
		int counter = 0;
		String cpp = "";
		while (counter < visitors.size()){
			cpp += "void " + cls.getName() + "::visit" + counter + "(){\n";
			for (EvalStep step : visitors.get(counter)){
				cpp += "    " + step.generateStep();
			}
			cpp += "}\n\n";
			counter++;
		}
		return cpp;
	}
	
	private String generateAccessorInt(Class cls){
		return generateAccessor(cls, ValueType.INTEGER, "getAttribInt");
	}
	
	private String generateAccessorStr(Class cls){
		return generateAccessor(cls, ValueType.STRING, "getAttribStr");
	}
	
	private String generateAccessorFloat(Class cls){
		return generateAccessor(cls, ValueType.FLOAT, "getAttribFloat");
	}
	
	private String generateAccessorBool(Class cls){
		return generateAccessor(cls, ValueType.BOOLEAN, "getAttribBool");
	}
	
	private String generateAccessor(Class cls, ValueType type, String funcName){
		String defaultValue = Vertex.getDefaultValue(type);
		String accessor = Vertex.typeToString(type) + " " + cls.getName() + "::" + funcName + "(std::string attribName){\n";
		ArrayList<String> toDo = sort(cls.getPassiveFieldsByType(type));
		toDo.addAll(sort(cls.getPubFieldsByType(type)));
		toDo.addAll(sort(cls.getPubAttribsByType(type)));
		if (toDo.size() > 0){
			boolean firstIf = true;
			for (String attrib : toDo){
				String ifElseIf = firstIf ? "if" : "else if";
				firstIf = false;
				accessor += "    " + ifElseIf + " (attribName.compare(\"" + attrib + "\") == 0){\n" +
						"        return this->" + attrib + ";\n    }\n"; 
			}
			accessor += "    else {\n        return " + defaultValue + ";\n    }\n";
		}
		else {
			accessor += "    return " + defaultValue + ";\n";
		}
		accessor += "}\n\n";
		return accessor;
	}
	
	private String generatePrivs(Class cls){
		HashMap<String, Vertex.ValueType> privFields = cls.getPrivFields();
		HashMap<String, Vertex.ValueType> privAttribs = cls.getPrivAttributes();
		String header = "";
		if ((privAttribs.size() + privFields.size()) > 0){
			header += "\nprivate:\n";	
			for (String privField : sort(privFields.keySet())){
				header += "    " + Vertex.typeToString(privFields.get(privField)) + " " + privField + ";\n";
			}
			for (String privAttrib : sort(privAttribs.keySet())){
				header += "    " + Vertex.typeToString(privAttribs.get(privAttrib)) + " " + privAttrib + ";\n";
			}
		}
		return header;
	}
	
	private void generateAleNodeBaseClass() throws IOException{
		FileWriter alenodeWriter = generateWriterFor("alenode.h");

		int numIFaces = interfaces.size();
		
		String writerStr = "#include <string>\n" +
							"#include <cstdlib>\n\n" +
							"#ifndef ALENODE\n" +
							"#define ALENODE\n\n" +
		"class AleNode {\n\npublic:\n" +
		"    enum NodeType {";
		writerStr += interfaces.get(0).getName().toUpperCase();
		for (int i = 1; i < numIFaces; i++){
			writerStr += ", " + interfaces.get(i).getName().toUpperCase();
		}
		writerStr += "};\n\n" +
			"    AleNode();\n" +
			"    NodeType myType;\n" +
			"    AleNode** children;\n" +
			"    int numChildren;\n" +
			"    virtual void addChild(AleNode* child, std::string refName){};\n" +
			"    virtual bool isReady(){return false;};\n" +
			"    virtual void visit0(){};\n" +
			"    virtual int getAttribInt(std::string attribName){return 0;};\n" +
			"    virtual std::string getAttribStr(std::string attribName){return \"\";};\n" +
			"    virtual float getAttribFloat(std::string attribName){return 0.0f;};\n" +
			"    virtual bool getAttribBool(std::string attribName){return false;};\n" +
			"    virtual std::string toString(){return \"\";};\n};\n";
		writerStr 	+= "class AleTree { public: AleNode *root; AleTree(AleNode *rt) : root(rt) {} };\n" +
			"#endif\n";
		
		alenodeWriter.write(writerStr);
		alenodeWriter.close();
	}
	
	private void generateAleInputParser(String baseclass, String baseTreeClass) throws IOException{
		
		FileWriter inputHWriter = generateWriterFor("inputParser.h");
		String parserHStr = "#include <libxml/xmlreader.h>\n#include \"ale.h\"\n\n";
			
		parserHStr += "int skipTillNextNode(xmlTextReaderPtr reader);\n\n";
		parserHStr += baseclass + "* processNode(xmlTextReaderPtr rdr, bool hasParent, " + baseclass + "* parent);\n\n";
		parserHStr += "int processChildNodes(xmlTextReaderPtr reader, " + baseclass + "* parent, int numChildren);\n\n";
		parserHStr += baseclass + "* processTree(xmlTextReaderPtr reader);\n\n";
		parserHStr += baseTreeClass + "* parseFile(const char *filename);\n\n";
		parserHStr += "bool parseBool(xmlTextReaderPtr reader, const char* name, bool defaultValue);\n\n";;
		parserHStr += "std::string parseString(xmlTextReaderPtr reader, const char* name, std::string defaultValue);\n\n";
		parserHStr += "int parseInt(xmlTextReaderPtr reader, const char* name, int defaultValue);\n\n";
		parserHStr += "float parseFloat(xmlTextReaderPtr reader, const char* name, float defaultValue);\n\n";
		parserHStr += "xmlChar* getXMLAttribute(xmlTextReaderPtr reader, const char* name);\n";
		
		inputHWriter.write(parserHStr);
		inputHWriter.close();
		
		FileWriter inputCppWriter = generateWriterFor("inputParser.cpp");
		String parserStr = "#include \"inputParser.h\"\n\n";
		parserStr += generateSkip();
		parserStr += generateProcessNode(baseclass);
		parserStr += generateProcessChildNodes(baseclass);
		parserStr += generateProcessTree(baseclass);
		parserStr += generateParseFile(baseclass, baseTreeClass);
		parserStr += generateParseHelpers();
		inputCppWriter.write(parserStr);
		inputCppWriter.close();
	}
	
	private String generateSkip(){
		return "int skipTillNextNode(xmlTextReaderPtr reader){\n" +
			"    int ret = xmlTextReaderRead(reader);\n" +
			"    if (ret != 1) {\n" +
			"        std::cout << \"failed in parsing node\";\n" +
			"	 return -1;\n" +
			"    }\n" +
			"    int nodeType = xmlTextReaderNodeType(reader);\n" +
			"    while (nodeType != 1){\n" +
			"        int ret = xmlTextReaderRead(reader);\n" +
			"        if (ret != 1) {\n" +
			"            std::cout << \"failed in parsing node\";\n" +
			"        return -1;\n" +
			"        }\n" +
			"        nodeType = xmlTextReaderNodeType(reader);\n" +
			"    }\n" +
			"    if (nodeType == 1){\n" +
			"        return 0;\n" +
			"    }\n" +
			"    return -1;\n" +
			"}\n\n";
	}
	
	private String generateProcessNode(String baseclass){
		String tab = "    ";
		String processStr = baseclass + "* processNode(xmlTextReaderPtr reader, bool hasParent, " + baseclass + "* parent){\n" +
							tab + "const xmlChar *name = xmlTextReaderConstName(reader);\n" +
							tab + "char* refName = (char*) xmlTextReaderGetAttribute(reader, (const xmlChar*) \"refName\");\n";
		boolean firstIf = true;
		for (Class cls : classes){
			String ifStr = firstIf ? "if" : "else if";
			firstIf = false;
			String clsName = cls.getName();
			processStr += tab + ifStr + " (xmlStrcmp(name, (const xmlChar*) \"" + clsName + "\") == 0){\n";
			processStr += tab + tab + clsName + "* node = new " + clsName + "();\n";
			processStr += generateParsedFields(cls, cls.getPubFields(), 2, false);
			processStr += generateParsedFields(cls, cls.getPassiveFields(), 2, false);
			processStr += generateParsedFields(cls, cls.getPrivFields(), 2, true);
			int numChildren = cls.getChildMappings().size(); // TODO: change for lists
			if (numChildren > 0){
				processStr += tab + tab + "if (processChildNodes(reader, node, " + numChildren + ") == -1){\n" +
							tab + tab + tab + "std::cout << \"class " + clsName + " is missing children!\";\n" +
							tab + tab + tab + "exit(1);\n" + tab + tab + "}\n";
			}
			processStr += tab + tab + "if (hasParent){\n" +
						tab + tab + tab + "parent->addChild(node, std::string(refName));\n" + tab + tab + "}\n" +
						tab + tab + "return node;\n" + tab + "}\n";
		}
		processStr += tab + "else {\n" +
					tab + tab + "printf(\"unrecognized node: %s\", name);\n" +
					tab + tab + "exit(1);\n" + tab + "}\n}\n\n";
		return processStr;
	}
	
	private String generateParsedFields(Class cls, HashMap<String, ValueType> fields, int numTabs, boolean priv){
		String returning = "";
		String baseTab = "    ";
		String tab = "";
		for (int i = 0; i < numTabs; i++){
			tab += baseTab;
		}
		for (String field : sort(fields.keySet())){
			ValueType type = fields.get(field);
			String convertStr = Vertex.getConvertFunc(type);
			String defaultValue = cls.getDefaultValueForField(field);
			if (defaultValue.isEmpty()) {
				defaultValue = Vertex.getDefaultValue(type);
			}
			if (priv){
				returning += tab + "node->set" + field + "(" + convertStr + "(reader, \"" + field + "\", " + defaultValue + "));\n";
			}
			else {
				returning += tab + "node->" + field + " = " + convertStr + "(reader, \"" + field + "\", " + defaultValue + ");\n";
			}
		}
		return returning;
	}
	
	private String generateProcessChildNodes(String baseclass){
		String childStr = "int processChildNodes(xmlTextReaderPtr reader, " + baseclass + "* parent, int numChildren){\n" +
						"    int counter = 0;\n" +
						"    while (counter < numChildren){\n" +
						"	     if (skipTillNextNode(reader) == 0){\n" +
						"		     processNode(reader, true, parent);\n" +
						"		     counter ++;\n" +
						"        }\n" +
						"        else {\n" +
						"            return -1;\n" +
						"        }\n" +
						"    }\n" +
						"    return 0;\n" +
						"}\n\n";
		return childStr;
	}
	
	private String generateProcessTree(String baseclass){
		String treeStr = baseclass + "* processTree(xmlTextReaderPtr reader){\n" +
						"    int nodeType = xmlTextReaderNodeType(reader);\n" +
						"    if (nodeType != 1){\n" +
						"	     std::cout << \"node expected\";\n" +
						"	     exit(1);\n" +
						"    }\n" +
						"    return processNode(reader, false, NULL);\n" +
						"}\n\n";
		return treeStr;
	}
	
	private String generateParseFile(String baseclass, String baseTreeClass){
		String fileStr = baseTreeClass + "* parseFile(const char *filename){\n" +
						"    xmlTextReaderPtr reader;\n" +
						"    int ret;\n" +
						"    " + baseclass + "* returning = NULL;\n" +
						"    reader = xmlNewTextReaderFilename(filename);\n" +
						"	 if (reader != NULL){\n" +
						"	 	 ret = xmlTextReaderRead(reader);\n" +
						"		 if (ret == 1){\n" +
						"			 returning = processTree(reader);\n" +
						"        }\n" +
						"        xmlFreeTextReader(reader);\n" +
						"    }\n" +
						"    else {\n" +
						"        printf(\"Unable to open %s\\n\", filename);\n" +
						"        return NULL;\n" +
						"    }\n" +
						"    return new " + baseTreeClass + "(returning);\n" +
						"}\n\n";
		return fileStr;
	}
	
	private String generateParseHelpers(){
		String returning = "";
		returning += "bool parseBool(xmlTextReaderPtr reader, const char* name, bool defaultValue){\n" +
				"    xmlChar* attrib = getXMLAttribute(reader, name);\n" +
				"    return attrib == NULL ? defaultValue : charsToBool((char*) attrib);\n" +
				"}\n" +
				"std::string parseString(xmlTextReaderPtr reader, const char* name, std::string defaultValue){\n" +
					"    xmlChar* attrib = getXMLAttribute(reader, name);\n" +
					"    return attrib == NULL ? defaultValue : std::string((char*) attrib);\n" +
					"}\n\n" +
				"int parseInt(xmlTextReaderPtr reader, const char* name, int defaultValue){\n" +
				"    xmlChar* attrib = getXMLAttribute(reader, name);\n" +
				"    return attrib == NULL ? defaultValue : atoi((char*) attrib);\n" +
				"}\n\n" +
				"float parseFloat(xmlTextReaderPtr reader, const char* name, float defaultValue){\n" +
				"    xmlChar* attrib = getXMLAttribute(reader, name);\n" +
				"    return attrib == NULL ? defaultValue : atof((char*) attrib);\n" +
				"}\n\n" +
				"xmlChar* getXMLAttribute(xmlTextReaderPtr reader, const char* name){\n" +
				"    return xmlTextReaderGetAttribute(reader, (const xmlChar*) name);\n" +
				"}\n\n";
		return returning;
	}
	
	private void generateLibs() throws IOException{
		FileWriter libsWriter = generateWriterFor("functions.h");
		libsWriter.write("#include \"libFunctions.h\"\n#include \"" + userLibsName + ".h\"\n");
		libsWriter.close();
	}
	
	private String[] sort(Set<String> toSort){
		String[] sorted = new String[toSort.size()];
		toSort.toArray(sorted);
		Arrays.sort(sorted);
		return sorted;
	}
	
	private ArrayList<String> sort(ArrayList<String> toSort){
		String[] sorted = new String[toSort.size()];
		toSort.toArray(sorted);
		Arrays.sort(sorted);
		ArrayList<String> returning = new ArrayList<String>();
		for (String str : sorted){
			returning.add(str);
		}
		return returning;
	}
	
	private void moveStaticFiles() throws IOException{
		ArrayList<String> toDo = new ArrayList<String>();
		toDo.add("libFunctions.h"); toDo.add("libFunctions.cpp"); toDo.add("alenode.cpp");
		/*if (userLibsName.equals("userFunctions")){
			toDo.add("userFunctions.h"); toDo.add("userFunctions.cpp");
		}*/
		for (String fileStr : toDo){
			File dest = new File(baseDirectory, fileStr);
			copy(fileStr, dest);
		}
	}
	
	private void moveBackendFiles(String baseclass) throws IOException {
		copyDir(baseclass, new File(baseDirectory));
	}
	
	private void copy(String toCopy, File dest) throws IOException{
		String src = rscDir + toCopy;

		if (exists(src))
			copy0(src, dest);
		else
			System.err.println("Warning: Static file " + toCopy + " could not be found!");
	}

	private void copyDir(String toCopy, File dest) throws IOException {
		if (rscDir.startsWith("/")) {
			copy0(rscDir + toCopy + ".zip", dest);
		} else {
			for (String file: new File(rscDir, toCopy).list()) {
				copy0(rscDir + toCopy + sep + file, new File(dest, file));
			}
		}
	}

	// Taken from http://www.exampledepot.com/egs/java.io/CopyFile.html
	private void copy0(String toCopy, File dest) throws IOException {
		InputStream in = Generator.class.getResourceAsStream(toCopy);
		byte[] buf = new byte[4096];
		if (in == null)
			in = new FileInputStream(toCopy);

		if (toCopy.endsWith(".zip")) {
			ZipInputStream zis = new ZipInputStream(in);
			ZipEntry entry;
			while((entry = zis.getNextEntry()) != null) {
				String fileName = entry.getName();
				File file = new File(dest, fileName);
				//file.getParentFile().mkdirs();
				// dump the file
				OutputStream out = new FileOutputStream(file);
				int len = 0;
				while ((len = zis.read(buf, 0, buf.length)) != -1) {
					out.write(buf, 0, len);
				}
				out.flush();
				out.close();
				zis.closeEntry();
			}
		} else {
			OutputStream out = new FileOutputStream(dest);

			// Transfer bytes from in to out
			int len;
			while ((len = in.read(buf)) > 0) {
				out.write(buf, 0, len);
			}
			out.close();
		}
		in.close();
	}
	
	private boolean exists(String file) throws IOException {
		InputStream in = Generator.class.getResourceAsStream(file);
		return (in != null || new File(file).exists());
	}

	
}
