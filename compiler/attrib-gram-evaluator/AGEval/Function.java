package AGEval;

public class Function {

	public enum FuncType { APPLY, SET }
	
	private String myName;
	public final String myDest;
	private String[] mySrcs;
	private Vertex vertDest;
	private Vertex[] vertSrcs;
	private FuncType myType;
	boolean hasArgs;
	
    public Function(String funcName, String dest, String[] srcs){
		myType = funcName.equals("SET") ? FuncType.SET : FuncType.APPLY;
		myName = funcName;
		myDest = dest;
		mySrcs = srcs;
		hasArgs = true;
	}

	public Function(String funcName, String dest){
		myType = FuncType.APPLY;
		myName = funcName;
		myDest = dest;
		mySrcs = null;
		hasArgs = false;
	}
    
	public String getName(){
		return myName;
	}
	
	public String getStringDest(){
		return myDest;
	}
	
	public String[] getStringSrcs(){
		return mySrcs;
	}
	
	public void setDestination(Vertex dest){
		vertDest = dest;
	}
	
	public Vertex getDestination(){
		return vertDest;
	}
	
	public void setSources(Vertex[] srcs){
		vertSrcs = srcs;
	}
	
	public Vertex[] getSources(){
		return vertSrcs;
	}
	
	public FuncType getType(){
		return myType;
	}
	
	public boolean hasArgs(){
		return hasArgs;
	}
	
	public boolean equals(Object o){
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		return myName.equals(((Function) o).getName()) &&
			myDest.equals(((Function) o).getStringDest());
	}
	
	public String toString(){
		String argsList = "";
		if (hasArgs){
			argsList += mySrcs[0];
			for (int i = 1; i < mySrcs.length; i++){
				argsList += ", " + mySrcs[i];
			}
		}
		return myName + "(" + argsList + ") => " + myDest;
	}
}
