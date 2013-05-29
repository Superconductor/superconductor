package AGEvalSwipl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;

import aleGrammar.ALEParser;
import aleGrammar.ALEParser.ExtendedClass;
import aleGrammar.ALEParser.ExtendedVertex;

import AGEval.InvalidGrammarException;
import AGEval.Vertex;
//import AGEvalSwipl.CppGenerator;


//FIXME move to respective backends
public class CppParserGenerator {
	
	public static String header (ALEParser g) throws InvalidGrammarException {
		
		String r = HHelpers.header() + "\n\n";		
		r += "struct ExtraParseData;\n\n";
		r += HHelpers.props(CppHelpers.getInputFieldNames(g.classes, g.interfaces)) + "\n";
		r += HHelpers.types(g) + "\n";		
		r += HHelpers.parseData(g.interfaces, g.classes, g.extendedClasses) + "\n";
		
		r += "#include \"extracomputedata.h\"\n";
		
		r += HHelpers.footer();
		
		return r;
	}

	public static String body (ALEParser g) throws InvalidGrammarException {
		String r = CppHelpers.bodyHeader() + "\n";

		Iterator<String> types = g.types.keySet().iterator();
		while (types.hasNext()) {
			String key = types.next();
			ArrayList<String> variants = g.types.get(key);
			r += CppHelpers.variantParser(key, variants) + "\n" + CppHelpers.variantParserDefault(key, variants) + "\n";  
		}               
		
		r += "void ExtraDataHandler::copy (ExtraParseData *src, ExtraParseData *dest) {  memcpy(dest, src, sizeof(ExtraParseData)); }\n\n";
		
		r += CppHelpers.LHSTokens(g.classes, g.interfaces, g.extendedClasses) + "\n";

		r += CppHelpers.parseCalls(g.classes, g.extendedClasses) + "\n";

		return r;	
	}

	public static String properties (ArrayList<AGEval.Class> classes, ArrayList<AGEval.IFace> interfaces) {
		HashSet<String> attribs = CppHelpers.getInputFieldNames(classes, interfaces);
		String res = "unknownPropertyType\n";
		for (String lhs : attribs) {
			res += clean(lhs) + "\n";
		}
		return res;
	}
	
	protected static class HHelpers {
		public static String header () {
			String r = "" +	
			"#ifndef EXTRADATA_H\n" + 
			"#define EXTRADATA_H\n" + 
			"#include <utility>\n" +
			"#include <string>\n" +
			"#include \"proptable.h\"\n" +
			"using namespace std;\n" +
			"#include \"WrappedXMLNode.h\"\n" +
			"#include \"pixels.h\"\n" +
			"#include \"paint.h\"\n" +
			"#include \"ParsingHelpers.h\"\n";
			return r;
		}
			
		public static String genField(ExtendedClass ec, String prop) {
			ExtendedVertex v = ec.extendedVertices.get(prop);
			String propType = v.strType;
			String transType =  
				(propType.equals("int") || propType.equals("time") || propType.equals("color") || propType.equals("px")) ? "int" : 
				propType.equals("bool") ? "bool" :
				propType.equals("string") ? "const char *" :
				propType.equals("taggedInt") ? "Tagged<int> " :
				propType.equals("taggedFloat") ? "Tagged<float> " :
				propType.equals("float") ? "float " :
				("ExtraDataHandler::unionvariants");// + Generators.clean(propType));
			String type = v.isMaybeType ? ("maybeT<" + transType + ">") : transType;
			return type + " fld_" + CppParserGenerator.clean(prop) + ";\n";        				
		}
	
		public static String getPubFields(AGEval.IFace i, HashMap<AGEval.IFace,ALEParser.ExtendedClass> extendedClasses) {
			String t = "";
			  String[] sortedPubs = {}; 
			  sortedPubs = i.getPubFields().keySet().toArray(sortedPubs);
			  Arrays.sort(sortedPubs);
			  ALEParser.ExtendedClass ec = extendedClasses.get(i);
			  int counter = 0;
			  for (String n : sortedPubs) {
				  while (ec.positionedInputs.containsKey(new Integer(counter))) {
					  String prop = ec.positionedInputs.get(new Integer(counter));
					  t += "  " + genField(ec, prop);
					  counter++;
				  }
				  if (!n.equals("display") && !n.equals("refname") && !ec.positionedInputs.containsValue(n)) {					  
					  t += "  " + genField(ec, n);
					  counter++;
				  }
			  }
			  return t;			
		}
		
		public static String parseData (ArrayList<AGEval.IFace> interfaces, ArrayList<AGEval.Class> classes, HashMap<AGEval.IFace,ALEParser.ExtendedClass> extendedClasses) {
			String t = "";
			
			
			for (AGEval.IFace i : interfaces) {
				t += "struct ExtraParse" + i.getName() + " { //interface\n";		
				t += getPubFields(i, extendedClasses);
				t += "};\n";
			}
			
			for (AGEval.Class c : classes) {
				t += "struct ExtraParse" + c.getName() + " { //class (interface: " + c.getInterface().getName() + ")\n";
				t += getPubFields(c.getInterface(), extendedClasses);
				t += "  //private fields\n";
				ALEParser.ExtendedClass ecC = extendedClasses.get(c);
				for (String n : c.getPrivFields().keySet())
					if (!n.equals("display") && !n.equals("refname"))
						t += "  " + genField(ecC, n);
				t += "};\n";
			}
			
			
			t += "\nunion ExtraParseDataUnion {\n";
			for (AGEval.IFace i : interfaces)
				t += "  ExtraParse" + i.getName() + " extraParse" + i.getName() + ";\n";
			for (AGEval.Class c : classes)
				t += "  ExtraParse" + c.getName() + " extraParse" + c.getName() + ";\n";
			t += "};\n\n";
				
			
			
			t += "struct ExtraParseData {\n" +
			//"  refnametype refname;\n" +
			"  #ifdef DEBUGY\n" +
			"  const char *tag;\n" +
			"  #endif //DEBUGY\n" +
//			"  bool isWhitespace;\n" +
//			"  string text;\n" +
//			"  ExtraDataHandler::displaytype display;\n" +
//			"  ExtraDataHandler::refnametype refname;\n" +
			"  ExtraDataHandler::unionvariants display;\n" +
			"  ExtraDataHandler::unionvariants refname;\n" +
			"  ExtraParseDataUnion genData;\n";
			
/*
			Iterator<String> symbols = inputs.keySet().iterator();
			while (symbols.hasNext()) {
				String prop = symbols.next();
				String propType = inputs.get(prop);
				t += "  " + genField(prop, propType);
			}
			*/
			
			return t + "};\n";
		}
		
		
		
		public static String props(HashSet<String> lhs) {
			String t = "struct ExtraCSSProps { //tokens\n";//int refname;\n";
			for (String p : lhs) t += "  int prop_" + CppParserGenerator.clean(p) + ";\n";
			return t + "};\n";
		}
		
		
		public static String types (ALEParser g) {
			String t = "class ExtraDataHandler {\n" +
			"  public:\n" +
		    "  static void init (PropTable *propLookup, ExtraCSSProps &p);\n" +
		    "  static void parse (ExtraParseData &data, WrappedXMLNode *r, map<int, pair<int, string> > &properties, ExtraCSSProps &p, map<string, Pixel32*> &colorMap);\n" +
		    "  static void copy (ExtraParseData *src, ExtraParseData *dest);\n";			
			t += "\n";

//			for (String name : g.types.keySet()) {
//			  t += "  " + variantTypeHeader(name, g.types.get(name)) + "\n";				
//			}
			//handle together to simplify sharing same symbols (e.g., inherit in multiple variants)
			HashSet<String> variants = new HashSet<String>();
			for (String name : g.types.keySet()) {
				for (String v : g.types.get(name)) variants.add(v.toLowerCase());
			}
			t += "  " + variantTypeHeader("unionvariants", variants) + "\n";
			
			
		    
		    t += "};\n";
			return t;			
		}
		public static String footer () {
			return "\n#endif //EXTRADATA_H";
		}

		public static String variantTypeHeader(String name, Collection<String> variants) {
			HashSet<String> uniqVariants = new HashSet<String> ();
			uniqVariants.addAll(variants);
			String tp = "enum " + CppParserGenerator.clean(name) + " { ";
			boolean firstTp = true;
			for (String v : uniqVariants) {
				if (firstTp) {
					tp += "\n    " + CppParserGenerator.toEnum(v);
					firstTp = false;
				} else {
					tp += ",\n    " + CppParserGenerator.toEnum(v);
				}
			}
			return tp + "};";
		}
		
	}
	
	protected static class CppHelpers {
		public static String bodyHeader () {
			String r = "" +
			"#include <string.h> //memcpy\n"+
			"#include \"extradatahandler.h\"\n" +
			"#include \"ParsingHelpers.h\"\n" +
			"#include \"csstbb.h\"\n\n";
			return r;		
		}
		public static String variantParserHeader(String name, ArrayList<String> variants) {
			return "unionvariants" /*Generators.clean(name)*/ + " get_" + CppParserGenerator.clean(name) + "(pair<int, string> *val, string attrib)";
		}
		public static String variantParserHeaderDefault(String name, ArrayList<String> variants) {
			return "unionvariants" /*Generators.clean(name)*/ + " get_" + CppParserGenerator.clean(name) + "Default(pair<int, string> *val, string attrib, ExtraDataHandler::unionvariants" + /*Generators.clean(name) +*/ " def)";
		}
		public static String variantParser(String name, ArrayList<String> variants) {

			String p = "ExtraDataHandler::" + variantParserHeader(name, variants) + " {\n" + 
			"  if (!val) {\n" +
			"    cout << \"missing input: \" << attrib << endl;\n" +
			"    exit(-1);\n" +
			"  } \n" +
			"  if (val->first != IDENT) {\n" +
			"     cout << \"unknown " + name + " type; expects identifier on \" << attrib << endl;\n" +
			"     exit(-1);\n" +
			"  }\n" +      
			"  string prop = val->second;\n" +
			"  toProp(prop);\n";
			boolean first = true;
			for (String v : variants) {
				if (first) {
					p += "  if (prop == \"" + CppParserGenerator.clean(v) + "\") {\n" +
					"    return ExtraDataHandler::" + CppParserGenerator.toEnum(v) + ";\n" +
					"  }";
					first = false;
				} else {
					p += " else if (prop == \"" + CppParserGenerator.clean(v) + "\") {\n" +
					"    return ExtraDataHandler::" + CppParserGenerator.toEnum(v) + ";\n" +
					"  }";
					first = false;

				}
			}

			p +=  
				" else {\n" +
				"    cout << \"unknown " + name + " value \" << prop << \" on \" << attrib << endl;\n" +
				"    exit(-1);\n" +
				"  }\n}\n";
			return p;		
		}
		public static String variantParserDefault(String name, ArrayList<String> variants) {

			return "ExtraDataHandler::" + variantParserHeaderDefault(name, variants) + " {\n" +
					"  if (!val) return def;\n" +
					"  else return get_" + CppParserGenerator.clean(name) + "(val, attrib);\n" +
					"}\n";
		}

		public static HashSet<String> getInputFieldNames (ArrayList<AGEval.Class> classes, ArrayList<AGEval.IFace> interfaces) {
			HashSet<String> toks = new HashSet<String>();
			for (AGEval.Class c : classes)
				for (String prop : c.getPrivFields().keySet())
					toks.add(prop);
			for (AGEval.IFace i : interfaces)
				for (String prop : i.getPubFields().keySet())
					toks.add(prop);
			return toks;

		}
		public static String LHSTokens (ArrayList<AGEval.Class> classes, ArrayList<AGEval.IFace> interfaces, HashMap<AGEval.IFace, ALEParser.ExtendedClass> extendedClasses) {
			String res = "void ExtraDataHandler::init (PropTable *propLookup, ExtraCSSProps &p) {\n";
			HashSet<String> toks = getInputFieldNames(classes, interfaces);
			
			for (String v : toks) {
				res +=   "  p.prop_" + CppParserGenerator.clean(v) + " = propFind(propLookup,\"" + CppParserGenerator.clean(v) + "\");\n";
			}
			res += "}\n";
			return res;	  
		}  
		public static String genParseField(String prop, String base, ExtendedVertex v) throws InvalidGrammarException {
			String def = "";
			String defVal = "";
			String propType = v.strType;
			if (v.maybeDefault != null) {
				def = "Default";
				String defS = v.maybeDefault;				  
				if (propType.equals("int") ||  
						propType.equals("bool") ||  
						propType.equals("time") || 
						propType.equals("px") || 
						propType.equals("float") ||
						propType.equals("string")) {
					defVal = ", " + defS;
				} else if (propType.equals("color")) {
					defVal = "do {\n        Pixel32 col(";
					switch (defS.length()) {
					case 4:
						defVal += 
							Integer.valueOf(""+ defS.charAt(1) + defS.charAt(1), 16) + ", " +
							Integer.valueOf(""+ defS.charAt(2) + defS.charAt(2), 16) + ", " +
							Integer.valueOf(""+ defS.charAt(3) + defS.charAt(3), 16) + ");\n";
						break;
					case 5:
						defVal += 
							Integer.valueOf(""+ defS.charAt(1) + defS.charAt(1), 16) + ", " +
							Integer.valueOf(""+ defS.charAt(2) + defS.charAt(2), 16) + ", " +
							Integer.valueOf(""+ defS.charAt(3) + defS.charAt(3), 16) + ", " +
							Integer.valueOf(""+ defS.charAt(4) + defS.charAt(4), 16) + ");\n";
						break;
					case 7:
						defVal += 
							Integer.valueOf(""+ defS.charAt(1) + defS.charAt(2), 16) + ", " +
							Integer.valueOf(""+ defS.charAt(3) + defS.charAt(3), 16) + ", " +
							Integer.valueOf(""+ defS.charAt(5) + defS.charAt(4), 16) + ");\n";
						break;
					case 9:
						defVal += 
							Integer.valueOf(""+ defS.charAt(1) + defS.charAt(2), 16) + ", " +
							Integer.valueOf(""+ defS.charAt(3) + defS.charAt(4), 16) + ", " +
							Integer.valueOf(""+ defS.charAt(5) + defS.charAt(6), 16) + ", " +
							Integer.valueOf(""+ defS.charAt(7) + defS.charAt(8), 16) + ");\n";
						break;
					default:
						throw new InvalidGrammarException("Unknown default color " + defS + " for field " + prop);
					}					  					 
				} else if (propType.equals("taggedInt")) {
					String sub = v.maybeDefault.substring(1, v.maybeDefault.length() - 1);
					defVal = ", makeTaggedInt(" + sub + ")";
				} else if (propType.equals("taggedFloat")) {
					String sub = v.maybeDefault.substring(1, v.maybeDefault.length() - 1);
					defVal = ", makeTaggedFloat(" + sub + ")";
				} else {
					defVal = ", ExtraDataHandler::TOK_" + defS.toUpperCase();        	
				}
			}

			
			if (v.maybeDefault != null && v.isMaybeType) throw new InvalidGrammarException("Cannot be a maybeType with a default value: property " + prop);
			
			String res = "data.genData." + base + ".fld_";
			String lookup = "lookupProp(properties, p.prop_" + CppParserGenerator.clean(prop) + ")";
			if (propType.equals("color")) {
				res += CppParserGenerator.clean(prop) + " = ";
				if (v.isMaybeType) {
					return res + "getColorMt" + def + "(" + lookup + ", colorMap, \"" + CppParserGenerator.clean(prop) + "\");\n";
				} else if (v.maybeDefault == null) { 
					return res + "getColorInt" + def + "(" + lookup + ", colorMap, \"" + CppParserGenerator.clean(prop) + "\");\n";
				} else {
					return defVal + "        " + res + "getColorDefaultInt(" + lookup + ", colorMap, \"" + CppParserGenerator.clean(prop) + "\", col);\n      } while (false);\n";
				}
			} else {
				String callType =
					propType.equals("int") ? "Integer" :
					propType.equals("bool") ? "Boolean" :
					propType.equals("time") ? "TimeInMS" :
					propType.equals("string") ? "String" :
					propType.equals("float") ? "Float" :
					propType.equals("taggedInt") ? "TaggedInt" :
					propType.equals("taggedFloat") ? "TaggedFloat" :
					propType.equals("px") ? "Px" :
					("_" + CppParserGenerator.clean(propType));
				res += CppParserGenerator.clean(prop) + " = ";
				if (v.isMaybeType) {
					return res + "getMt<" + CppGenerator.typeStringToCppType(Vertex.typeToString(Vertex.resolveTypeFtl(v.strType))) + ", get" + callType + ">(" + lookup + ", \"" + CppParserGenerator.clean(prop) + "\");\n";
				} else {
					return res + "get" + callType + def + "(" + lookup + ", \"" + CppParserGenerator.clean(prop) + "\"" + defVal + ");\n";
				}				
			}
		}
		
		public static String parseCalls (ArrayList<AGEval.Class> classes, HashMap<AGEval.IFace, ALEParser.ExtendedClass> extendedClasses) throws InvalidGrammarException {
			String t = "void ExtraDataHandler::parse (ExtraParseData &data, WrappedXMLNode *r, map<int, pair<int, string> > &properties, ExtraCSSProps &p, map<string, Pixel32*> &colorMap) {\n";

			t += 
				"#ifdef DEBUGY\n" + 
				"  data.tag = r && r->xml ? ((const char*) xmlStrdup(r->xml->name)) : NULL;\n" +
				"  cout << \"Wrapped Node \" << r << \", xml \" << r->xml << \": \" << endl;\n" +
				"  xmlElemDump(stdout, r->xml->doc, r->xml);\n" +
				"#endif //DEBUGY\n\n";
			
			//early exit on text
			t += 
				"#ifdef EXTRA_FONTS\n" +    
			    "  data.genData.extraParseTextBox.fld_text = NULL;\n" +
			    "#endif //EXTRA_FONTS\n" +
				"  if (r && r->properties.size() == 0) {\n" +
				"    if (r->xml->content) {\n" +
				"      if (r->children.size() > 0) {\n" +
				"        cout << \"XML ERROR: text node has children!\" << endl;\n" +
				"        exit(1);\n" +
				"      }\n" +
			    "      r->properties[p.prop_display] = make_pair(IDENT, \"textbox\"); //FIXME slow\n" + 
			    "      r->properties[p.prop_refname] = make_pair(IDENT, \"child\"); //FIXME slow\n" +
				"#ifdef EXTRA_FONTS\n" +    
				"      const char *str = (const char *) xmlStrdup(r->xml->content);\n" +
				"      data.genData.extraParseTextBox.fld_text = str;\n" +
			    "#endif //EXTRA_FONTS\n" +
				"    }\n" +
//				"    return;\n" +
				"  } else if (r) {\n" +
				"#ifdef EXTRA_FONTS_TEXT_ATTR //FIXME legacy from old ALE xml format \n" +   
			    "    xmlAttr *attr_node = xmlHasProp(r->xml, xmlCharStrdup(\"text\"));\n" +
			    "    if (attr_node) \n" +
			    "    for (_xmlNode *c = attr_node->children; c; c = c->next)\n" +
			    "      if (c->content) {\n" +              
			    "        data.genData.extraParseTextBox.fld_text = (const char*) xmlStrdup(c->content);\n" +                                
			    "        break;\n" +
			    "      }\n" +
			    "#endif //EXTRA_FONTS_TEXT_ATTR\n" +
			    "  }\n";

			t += 
				"#ifdef DEBUGY\n" +
				"  cout << \"Properties: \" << endl;\n" +
				"#ifdef EXTRA_FONTS\n" +  
				"  if (data.genData.extraParseTextBox.fld_text == NULL) cout << \"  (no special text)\" << endl;\n" +
				"  else cout << \"  (special) text: \" << data.genData.extraParseTextBox.fld_text << endl;\n" +
			    "#endif //EXTRA_FONTS\n" +				
				"  for (map<int, pair<int, string> >::iterator it = properties.begin(); it != properties.end(); it++) {\n" +  
				"    cout << \"  \" << propFindReverse(it->first) << \": \" << it->second.first << \", \" << it->second.second << endl;\n" +
				"  }\n" +
				"#endif //DEBUGY\n";
			
			t += "  data.display = get_displaytype(lookupProp(properties, p.prop_display), \"display\");\n";
			t += "  data.refname = get_refnametype(lookupProp(properties, p.prop_refname), \"refname\");\n"; 
			t += "  switch(data.display) {\n";
			
			for (AGEval.Class c : classes) {
				t += 
					"    case ExtraDataHandler::TOK_" + c.getName().toUpperCase() + ": \n" +
					"#ifdef DEBUGY\n" +
					"      cout << \"  Parsing as " + c.getName() + "\" << endl;\n" +
					"#endif //DEBUGY\n";				
				ALEParser.ExtendedClass ecPriv = extendedClasses.get(c);
				for (String fld : c.getPrivFields().keySet()) {
					ALEParser.ExtendedVertex ev = ecPriv.extendedVertices.get(fld);
					if (!fld.equals("display") && !fld.equals("refname") && !fld.equals("text")) t += "      " + genParseField(fld, "extraParse" + c.getName(), ev);
				}
				AGEval.IFace i = c.getInterface();
				ALEParser.ExtendedClass ecPub = extendedClasses.get(i);
				for (String fld : i.getPubFields().keySet()) {
					ALEParser.ExtendedVertex ev = ecPub.extendedVertices.get(fld);
					if (!fld.equals("display") && !fld.equals("refname") && !fld.equals("text")) t += "      " + genParseField(fld, "extraParse" + c.getName(), ev);
				}
				t += "      break;\n";
			}			
			t += "    default: \n" +
			     "      cout << \"Unknown display type for parsing a node\" << endl;\n" +
			     "      exit(1);\n" +			
			     "  }\n";
			return t + "};\n";

		}
	}

	public static String clean (String dirty) { return dirty.toLowerCase().replaceAll("-", "").replaceAll(" ", ""); }
	public static String toEnum (String val) { return "TOK_" + clean(val).toUpperCase(); }

}
