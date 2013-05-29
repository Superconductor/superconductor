package AGEvalSwipl;

import java.io.IOException;
import java.util.HashSet;
import java.util.Hashtable;
import jpl.Term;
import jpl.Variable;
import AGEval.AGEvaluator;
import AGEval.Class;
import AGEval.InvalidGrammarException;
import AGEvalSwipl.AGEvaluatorSwipl.Schedule;
import aleGrammar.ALEParser;
//import aleGrammar.AleFrontend;

public interface Backend {
	  public String lhsToAddress (String lhs, AGEval.Class cls, ALEParser ast) throws InvalidGrammarException;
	  public String rhsToVal (String lhs, AGEval.Class cls, ALEParser ast) throws InvalidGrammarException;
	  public String asgnE(String lhs, String rhs);
	  public String asgnS(String lhs, String rhs);
	  public String toAcc(String lhsRaw, AGEval.Class c);
	  public String logStmt(int indentSrc, int indentOut, String msg, String rhs);
	  //same, but prints w/NULL check on string addresses...
	  public String logStmtVar(int indentSrc, int indentOut, String msg, ALEParser ast, AGEval.Class cls, String rhs, String rhsAddress) throws InvalidGrammarException;
	  //public String logExpr(int indentSrc, int indentOut, String msg, String rhs);
	  public String printCurrentPipelineBuild (Hashtable<Variable, Term> binding) throws InvalidGrammarException;
	  public String functionHeader(ALEParser.Assignment assign, ALEParser ast) throws InvalidGrammarException;
	  public String visitHeader(Class cls, int visitNum, ALEParser ast) throws InvalidGrammarException;	  
	  public String visitFooter(Class cls, int visitNum, ALEParser ast) throws InvalidGrammarException;	  
	  public String openChildLoop (AGEval.Class parent_class, String loopVar, ALEParser ast);
	  public String closeChildLoop ();
	  public String openLastChild(AGEval.Class cls, String loopVar);
	  public String closeLastChild();
	  public String childrenRecur (AGEval.Class cls, String childName, int visitNum, ALEParser ast) throws InvalidGrammarException;
	  public String childRecur(AGEval.Class cls, String childName, int visitNum) throws InvalidGrammarException;		
	  public String visitDispatcher(int visit, AGEvaluator aleg, HashSet<AGEval.Class> buIns /* null if not buSubInorder */, HashSet<AGEval.Class> bus);	
	  public void generateParseFiles(ALEParser ast, Schedule sched, String outputDir, boolean verbose, String functionHeaders) throws InvalidGrammarException;
	  public String preVisits (AGEvaluator aleg, Schedule sched);
	  public String postVisits (AGEvaluator aleg, Schedule sched) throws InvalidGrammarException;
	  public String output (String baseName, String visitOut, String visitDispatches, String outputDir, boolean write, boolean verbose, ALEParser ast, Schedule sched, String fHeaders, Hashtable<Variable, Term> binding, AGEvaluator aleg) throws IOException, InvalidGrammarException;
	  public String replaceTypeVals(String body, ALEParser ast);

}
