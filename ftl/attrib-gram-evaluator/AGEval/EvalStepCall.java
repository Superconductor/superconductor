package AGEval;

public class EvalStepCall extends EvalStep{

	private IFace myChildType;
	private int myVisitNum;
		
	public EvalStepCall(Class cls, IFace childType, int visit){
		setActiveClass(cls);
		myType = EvalStep.EvalType.CALL;
		myChildType = childType;
		myVisitNum = visit;
	}
	
	public int getVisitNum(){
		return myVisitNum;
	}

	@Override
	public String generateStep() {
		String returning = "";
		for (String childName : myActiveClass.getChildNamesForType(myChildType)){
			returning += childName + "->visit" + myVisitNum + "(); ";
		}
		return returning + "\n";
	}
	
	public IFace getTypeToCall(){
		return myChildType;
	}
	
	@Override
	public String toString(){
		return "CALL: " + myChildType.toString() + " [" + myVisitNum + "]";
	}
	
}

