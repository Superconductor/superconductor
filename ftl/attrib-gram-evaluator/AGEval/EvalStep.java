package AGEval;

public abstract class EvalStep {

	public enum EvalType{SET, APPLY, CALL};
	protected Class myActiveClass;
	protected EvalType myType;
	
	public abstract String generateStep();
	
	public static String getCForm(String str){
		return str.replace("@", "->");
	}
	
	public void setActiveClass(Class cls){
		myActiveClass = cls;
	}
	
	public Class getActiveClass(){
		return myActiveClass;
	}
	
	
	public EvalType getType(){
		return myType;
	}
}
