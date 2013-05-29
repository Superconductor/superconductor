package AGEval;

public class EvalStepSet extends EvalStep{
	
	private String myStrSrc;
	private String myStrDest;
	private Function myFunc;
	
	public EvalStepSet(Class cls, Function setFunc){
		setActiveClass(cls);
		myType = EvalStep.EvalType.SET;
		myStrSrc = setFunc.getStringSrcs()[0];
		myStrDest = setFunc.getStringDest();
		myFunc = setFunc;
	}

	@Override
	public String generateStep() {
		return getCForm(myStrDest) + " = " + getCForm(myStrSrc) + ";\n";
	}
	
	public Function getFunction(){
		return myFunc;
	}
	
	@Override
	public String toString(){
		return "SET: " + myStrDest + " to " + myStrSrc;
	}
	
}
