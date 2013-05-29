package AGEval;

import java.util.ArrayList;
import java.util.HashMap;

public class AleSimulatorNode {

	private Class myClass;
	private HashMap<String, AleSimulatorNode> myChildren;
	private int nextPass;
	private ArrayList<ArrayList<EvalStep>> myVisitors;
	private String signature;
	
	public AleSimulatorNode(Class agent){
		myClass = agent;
		myChildren = new HashMap<String, AleSimulatorNode>();
		myVisitors = myClass.getVisitors();
		nextPass = 0;
		signature = "[" + myClass.getName() + "]: ";
	}
	
	/** Adds a child with childName matching the name given in AG */
	public void addChild(String childName, IFace type, AleSimulatorNode child){
		if (myClass.hasChild(childName, type)){
			if (!myChildren.containsKey(childName)){
				myChildren.put(childName, child);
			}
			else {
				System.err.println("Warning: " + myClass.getName() + " already has a child " + childName);
			}
		}
		else {
			System.err.println("Warning: " + myClass.getName() + " does not have a member child called " + childName);
		}
	}
	
	/** Sanity check before running */
	public boolean ready(){
		for (String childName : myClass.getChildMappings().keySet()){
			if (!myChildren.containsKey(childName)){
				return false;
			}
		}
		return true;
	}
	
	/** Recursive sanity check to be called externally at the top level */
	public boolean allReady(){
		if (!ready()){
			return false;
		}
		for (AleSimulatorNode child : myChildren.values()){
			if (!child.allReady()){
				return false;
			}
		}
		return true;
	}
	
	public String visit(){
		String trace = new String();
		if (nextPass < myVisitors.size())
		for (EvalStep step : myVisitors.get(nextPass)){	
			if (step.getType() == EvalStep.EvalType.CALL){
				EvalStepCall callStep = (EvalStepCall) step;
				for (String childName : myClass.getChildNamesForType(callStep.getTypeToCall())){
					trace += signature + "CALL: " + childName + " [" + callStep.getVisitNum() + "]\n";
					trace += myChildren.get(childName).visit();
				}
			}
			else {
				trace += signature + step.toString() + "\n";
			}
		}
		nextPass++;
		trace += signature + "RETURN\n";
		return trace;
	}
	
	
}
