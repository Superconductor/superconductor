package AGEval;

import java.util.HashMap;
import java.util.HashSet;

/** Generates internal names for attributes and fields in the form attribName[digits]. */
public class VertexSymbolTable {
	
	private HashMap<String, String> internalNamesToExternalNames;
	private HashMap<String, Integer> vertexNameToNextValue;
	private HashMap<IFace, HashSet<String>> inheritedExternalNames; // This is due to the internal reliance of matching inherited attribute names
	
	public VertexSymbolTable(){
		internalNamesToExternalNames = new HashMap<String, String>();
		vertexNameToNextValue = new HashMap<String, Integer>();
		inheritedExternalNames = new HashMap<IFace, HashSet<String>>();
	}
	
	/** A method to retrieve an internal name for a given attribute str.
	 *  This will produce a new name for all interface attrib/fields.
	 *  This will produce a new name for private class attrib/fields.
	 *  For public class attributes, this returns the same name as the public interface attribute. */
	public String createInternalRepFor(String str, IFace parent) throws InvalidGrammarException{
		if (parent.getType() == IFace.ClassType.INTERFACE){
			if (inheritedExternalNames.containsKey(parent)){
				inheritedExternalNames.get(parent).add(str);
			}
			else {
				HashSet<String> newSet = new HashSet<String>();
				newSet.add(str);
				inheritedExternalNames.put(parent, newSet);
			}
			return createNewNameFor(str);
		}
		else { // ClassType == Class
			IFace parentIface = parent.getInterface();
			if (inheritedExternalNames.containsKey(parentIface) && inheritedExternalNames.get(parentIface).contains(str)){
				Vertex interfaceVert = parentIface.findVertexByExtName(str);
				return interfaceVert.getVar();
			}
			else {
				return createNewNameFor(str);
			}
		}
		
	}
	
	private String createNewNameFor(String str){
		if (vertexNameToNextValue.containsKey(str)){
			int val = vertexNameToNextValue.get(str);
			String internalName = str + val;
			vertexNameToNextValue.put(str, val + 1);
			internalNamesToExternalNames.put(internalName, str);
			return internalName;
		}
		else {
			String internalName = str + "0";
			internalNamesToExternalNames.put(internalName, str);
			vertexNameToNextValue.put(str, 1);
			return internalName;
		}
	}
}
