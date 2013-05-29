package AGEvalSwipl;

import java.util.Map.Entry;

import aleGrammar.ALEParser;
import aleGrammar.ALEParser.TraitInfo;
import AGEvalSwipl.AGEvaluatorSwipl.Schedule;


//basically a copy of AGEvaluatorSwipl's schema codegen for JSON
//TODO include line numbers
public class JSON {
	public final ALEParser ast;
	public JSON (ALEParser ast_){
		ast = ast_;
	}
	private static void getVars(String tab, String indent, StringBuffer buf, AGEval.IFace cls){
		buf.append(tab + indent + "\"vars\": [");
		boolean first = true;
		for (String attrib : cls.getPubAttributes().keySet()) {
			if (first) first = false;
			else buf.append(", ");

			buf.append('"' + attrib.toLowerCase() + '"');
		}
		buf.append("],\n");	
	}
	private static void getPrivVars(String tab, String indent, StringBuffer buf, AGEval.Class cls){
		buf.append(tab + indent + "\"vars\": [");
		boolean first = true;
		for (String attrib : cls.getPrivAttributes().keySet()) {
			if (first) first = false;
			else buf.append(", ");

			buf.append('"' + attrib.toLowerCase() + '"');
		}
		buf.append("],\n");	
	}
	private static void getInputs(String tab, String indent, StringBuffer buf, AGEval.IFace cls){
		buf.append(tab + indent + "\"inputs\": [");
		boolean first = true;		
		for (String field : cls.getPubFields().keySet()) {
			if (first) first = false;
			else buf.append(", ");

			buf.append('"' + field.toLowerCase() + '"');
		}
		buf.append("]\n");
	}
	private static void getPrivInputs(String tab, String indent, StringBuffer buf, AGEval.Class cls){
		buf.append(tab + indent + "\"inputs\": [");
		boolean first = true;		
		for (String field : cls.getPrivFields().keySet()) {
			if (first) first = false;
			else buf.append(", ");

			buf.append('"' + field.toLowerCase() + '"');
		}
		buf.append("]\n");
	}
	
	
	public void getInterfaceJSON(String tab, String indent, StringBuffer buf, AGEval.IFace cls) {
		buf.append("{\n");
		
		getVars(tab, indent, buf, cls);
		getInputs(tab, indent, buf, cls);
		
		buf.append(tab + "}");
	}
	public void getInterfacesJSON (String tab, String indent, StringBuffer buf) {
		buf.append("{\n" + indent + tab);
		boolean first = true;
		for (AGEval.IFace cls : ast.interfaces) {
			if (!first) buf.append(",\n" + tab + indent);
			else first = false;
			
			buf.append("\"" + cls.getName().toLowerCase() +"\": ");
			getInterfaceJSON(tab + indent + indent, indent, buf, cls);
		}
		buf.append("\n"+ tab + "}");
	}
	public void getClassJSON(String tab, String indent, StringBuffer buf, AGEval.Class cls) {
		buf.append("{\n");

		buf.append(tab + indent + "\"interface\": \"" + cls.getInterface().getName().toLowerCase() + "\",\n");
		getPrivVars(tab, indent, buf, cls);
		getPrivInputs(tab, indent, buf, cls);
		
		buf.append(tab + "}");
	}
	public void getClassesJSON(String tab, String indent, StringBuffer buf) { 
		buf.append("{\n");
		boolean first = true;
		for (AGEval.Class c : ast.classes) {
			if (!first) buf.append(",\n");
			else first = false;
			
			buf.append(tab +indent + "\"" + c.getName().toLowerCase() + "\": ");
			getClassJSON(tab + indent + indent, indent, buf, c);
		}			
		buf.append("\n" +tab + "}");
	}
	public void getTraitJSON(String tab, String indent, StringBuffer buf, TraitInfo trait) {
		buf.append("{\n");
		buf.append(tab +indent + "\"attributes\": [");
		String [] attribs = trait.attributes.split(", ");
		boolean first = true;
		for (int i = 1; i < attribs.length; i++){
			if (attribs.length > 1){
				if (first) first = false;
				else buf.append(", ");
				buf.append("\"" + attribs[i] + "\"");			
			}
		}	
		buf.append("]\n");		
		buf.append(tab + "}");
	}
	public void getTraitsJSON(String tab, String indent, StringBuffer buf) {
		buf.append("{\n");
		boolean first = true;
		for (Entry<String, TraitInfo> pair : ast.traits.entrySet()){
			if (!first) buf.append(",\n");
			else first = false;
			
			buf.append(tab +indent + "\"" + pair.getKey().toLowerCase() + "\": ");
			getTraitJSON(tab + indent + indent, indent, buf, pair.getValue());			
		}
		buf.append("}"); 
		
	}
	
	public String getJSON(String tab, String indent){
		StringBuffer buf = new StringBuffer();
		buf.append(tab + "{\n");
		buf.append(tab +indent + "\"interfaces\": ");
		getInterfacesJSON(tab +indent, indent, buf);
		buf.append(",\n" +tab +indent+"\"traits\": ");
		getTraitsJSON(tab +indent, indent, buf);
		buf.append(",\n" +tab +indent+"\"classes\": ");
		getClassesJSON(tab +indent, indent, buf);
		buf.append("\n" + tab + "}");		
		return buf.toString();
		
	}
	
	
}