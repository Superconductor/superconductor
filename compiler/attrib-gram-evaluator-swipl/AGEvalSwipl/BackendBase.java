package AGEvalSwipl;

import java.util.HashSet;
import AGEval.AGEvaluator;

public class BackendBase {

	public HashSet<AGEval.Class> getInIns (AGEvaluator aleg, HashSet<AGEval.Class> bus, HashSet<AGEval.Class> buIns){
		HashSet<AGEval.Class> inIns = new HashSet<AGEval.Class>(aleg.classes);
		if (buIns != null) {
			//System.err.println("inIns: " + inIns.toString());
			inIns.removeAll(bus);
			inIns.removeAll(buIns);
			/*
			System.err.println("removed");
			System.err.println("classes: " + aleg.classes.toString());
			System.err.println("bus: " + bus.toString());
			System.err.println("buIns: " + buIns.toString());
			System.err.println("inIns: " + inIns.toString());
			*/
		}
		return inIns;
	}

}
