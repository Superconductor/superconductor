package aleGrammar;

import java.util.ArrayList;
import java.util.HashSet;

public class GenSym {
	public class Vert {
		public final AGEval.Class clss;
		public final String refName;
		public final String attrib;
		public Vert (AGEval.Class clss_, String ident_) {
			clss = clss_;
			refName = ident_.contains("@") ? ident_.split("@")[0] : "self";
			attrib = ident_.contains("@") ? ident_.split("@")[1] : ident_;
		}
	}
	public Vert makeVert (AGEval.Class clss_, String ident_) {
		//if (!ident_.contains("@")) throw new Exception("makeVert expected ident as ref@attrib");
		return new Vert(clss_, ident_);
	}
	private final HashSet<String> raw;
	private final ArrayList<Vert> rawList;
	private final ArrayList<String> renamedList;
	
	public GenSym() { 
		raw = new HashSet<String>(); 
		rawList = new ArrayList<Vert>();
		renamedList = new ArrayList<String>();			
	}
	public int nextAttrib (Vert v) {
		String vClean = v.attrib.toLowerCase();
		String freshName = "";
		if (vClean.matches("[a-z][_a-zA-Z0-9]*") && !vClean.matches("gensym(.*)")) {
			if (raw.contains(vClean)) {
				freshName = "gensym_" + raw.size() + "_" + vClean;
			} else {
				freshName = vClean;
			}					
		} else {
			freshName = "gensym_" + raw.size();
		}
		raw.add(freshName);
		renamedList.add(freshName);
		rawList.add(v); 
		return rawList.size() - 1; 
	}
	public Vert asVert (int i) { return rawList.get(i); }
	public String asProlog (int i) { return renamedList.get(i); }
	public String asCpp (int i) { return renamedList.get(i); }
	public boolean isValid(int i) { return i >= 0 && i < raw.size(); }
	public int fake () { return -1; }
}