package AGEvalSwipl;

import AGEvalSwipl.AGEvaluatorSwipl.Schedule;

public interface GeneratorI {
	public Schedule synthesize(
			String alePath, String outputDir, String resourceDir, boolean verbose, boolean isFixedChildOrder, boolean isExhaustive, int maxLen, boolean stripFloats) 
		throws Exception;
	public Schedule synthesizeAll(
			String alePath, String outputDir, String resourceDir, boolean verbose, boolean isFixedChildOrder, boolean isExhaustive, int maxLen, boolean stripFloats) 
		throws Exception;
		
}
