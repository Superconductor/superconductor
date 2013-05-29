package AGEval;

public class EvalStepApply extends EvalStep{

	private Function myFunction;
	
	public EvalStepApply(Class cls, Function func){
		setActiveClass(cls);
		myType = EvalStep.EvalType.APPLY;
		myFunction = func;
	}

	@Override
	public String generateStep() {
		String dest = getCForm(myFunction.getStringDest());
		String src = "";
		if (myFunction.hasArgs){
			String[] srcs = myFunction.getStringSrcs();
			src += getCForm(srcs[0]);
			for (int i = 1; i < srcs.length; i++){
				src += ", " + getCForm(srcs[i]);
			}
		}
		return dest + " = " + myFunction.getName() + "(" + src + ");\n";
	}
	
	public Function getFunction() {
		return myFunction;
	}
	
	@Override
	public String toString(){
		return "APPLY: " + myFunction;
	}
	
}
