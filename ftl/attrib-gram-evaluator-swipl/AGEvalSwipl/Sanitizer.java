package AGEvalSwipl;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import javax.naming.directory.AttributeInUseException;

import aleGrammar.ALEParser;
import aleGrammar.AleFrontend;

import AGEval.InvalidGrammarException;

import jpl.Atom;
import jpl.Compound;
import jpl.Query;
import jpl.Term;

public class Sanitizer {
	public boolean anyFailed = false;
	public final boolean verbose;
	public final Set<String> whitelist;
	
	private final HashSet<String> tokens = new HashSet<String>();
	
	//FIXME check for attacks where class/attr names are reserved
	// (should not be an issue if only used as symbols rather than invoked operators)
	public void allowTokens (ALEParser ast) {
		clearTokens();
		for (AGEval.Class c : ast.classes) {
			tokens.add(c.getName().toLowerCase());
			for (String attr : ast.extendedClasses.get(c).extendedVertices.keySet())
				tokens.add(attr.toLowerCase());
		}
		for (AGEval.IFace i : ast.interfaces) {
			tokens.add(i.getName().toLowerCase());
			for (String attr : ast.extendedClasses.get(i).extendedVertices.keySet())
				tokens.add(attr.toLowerCase());
		}		
	}
	public void clearTokens () {
		tokens.clear();
	}
	
	public Sanitizer (boolean verbose_) {
		verbose = verbose_;
		whitelist = new HashSet<String>();
		/* safe prolog primitives */
		whitelist.addAll(Arrays.asList("=", ",", "[]", ".", "\\+", "->")); //operators
		whitelist.addAll(Arrays.asList("member", "subset", "setof", "findall", "append", "filter", "succ", "superset", "is_set", "intersection")); //standard prolog
		whitelist.addAll(Arrays.asList( //algorithms.tokens + algorithmsFixed.tokens				
				/* algorithmsFixed.tokens */
				"self",
				"td",
				"bu",
				"tdLtrU",
				"buSubInorder",				
				"interface",
				"interfaceAttribute",
				"class",
				"classChild",
				"classField",
				"interfaceField",
				"assignment",
				"classAttribute",
				/* algorithms.tokens */
				"bottomUp",
				"bottomUpAssume",
				"bottomUpAssumeSub",
				"bottomUpH",
				"bottomUpMissingAssumeSub",
				"bottomUpMissingPostAssumeSub",
				"bottomUpPostAssume",
				"bottomUpPostAssumeSub",
				"bottomUpSubInorder",
				"bottomUpSubInorderH",
				"bottomUpSubInorderHBU",
				"bottomUpSubInorderHIn",
				"buInorderMerge",
				"buInorderPick",
				"classDoesDefine",
				"classDoesNotDefine",
				"classNode",
				"classOrder",
				"correctButMissingCandidateSub",
				"countSteps",
				"directEdge",
				"filterCandidates",
				"filterCandidatesSub",
				"ftlStep",
				"ftlStepH",
				"grammarOrder",
				"grammarOrderFixed",
				"hasMissingDependency",
				"hasParentsOfType",
				"internalStep",
				"internalStepHSub",
				"internalStepSub",
				"invalidTdltruChildAssumeSub",
				"isNth",
				"maxChildren",
				"missingCandidate",
				"missingPrivateCandidate",
				"missingPublicAttribAssignmentSub",
				"needToAddNodeSub",
				"noneRemaining",
				"numChildren",
				"pickOrder",
				"pickOrderFixed",
				"remaining",
				"rootClasses",
				"sequenceClasses",
				"sequenceClassesFixed",
				"sequenceClassesFixedSingle",
				"sequenceClassesH",
				"sequenceClassesPartial",
				"sequenceClassesPartialH",
				"setSame",
				"sourceInterfacesChild",
				"sourceInterfacesSelf",
				"sources",
				"sourcesClasses",
				"sourcesInterfaces",
				"sourcesInterfacesChild",
				"sourcesInterfacesSelf",
				"subsetManual",
				"supersetCandidatesH",
				"tdltru",
				"tdltruAttempt",
				"tdltruAttemptFilterSub",
				"tdltruAttemptSub",
				"tdltruAttemptTrySub",
				"tdltruHChildrenStepAssumeSub",
				"tdltruMissingAssumeSub",
				"tdltruMissingInvalidChildAssumeSub",
				"topDown",
				"topDownAssume",
				"topDownAssumeSub",
				"topDownH",
				"topDownMissingAssumeSub",
				"topDownMissingPostAssume",
				"topDownPostAssume",
				"unreadyAtNthChildSub"
				));
	}
	
	 String recoverQuery(Term c) throws InvalidGrammarException {
		String res = "";
		if (c.isAtom()) {			
			res += "<atom>";
			if (!whitelist.contains(c.name()) && !tokens.contains(c.name())) {
				System.err.println("Tokens: " + tokens);
				throw new InvalidGrammarException("Schedule sanitization failed; could not match atom '"+ c.name() + "' in whitelist (term '" + c.toString() + "')");	
			}
		} else  if (c.isCompound()) {
			res += "<compound '" + c.name()+"'>(";
			if (!whitelist.contains(c.name())) {
				throw new InvalidGrammarException("Schedule sanitization failed; could not match compound operator '"+ c.name() + "' in whitelist (term '" + c.toString() + "')");
			}
			for (int i = 0; i < c.arity(); i++) {
				if (i > 0) res += ", ";
				res += recoverQuery(c.arg(i+1));
			}
			res += ")";
		} else if (c.isFloat()) {
			res += "<float>";
		} else if (c.isInteger()) {
			res += "<int>";
		} else if (c.isVariable()) {
			res += "<var>";
		} else {
			throw new InvalidGrammarException("Schedule sanitization failed; could not parse Prolog schedule term " + c.toString());
		}
		return res;	
	}
	public String simpleQuery(String qStr) throws InvalidGrammarException {
		Query q = new Query(qStr);
		String ast = recoverQuery(q.goal());
		return ast;
	}
	public  boolean testQuery(String q, boolean shouldPass) {
		boolean shouldError = !shouldPass;
		String msg = "";
		boolean success = false;
			try {
				String ast = simpleQuery(q);
				if (shouldError) {
					success = false;
					msg = "Succeeded but expected failure";
				} else {
					success = true;
					msg = "Succeeded as expected";
				}
				msg += ", ast: " + ast;
			} catch (Exception e) {
				if (shouldError) {
					success = true;
					msg = "Failed as expected (" + e.getMessage() + ")";
				} else {
					success = false;
					msg = "Failed but expected success (" + e.getLocalizedMessage() + ")";
				}
			}
		if (verbose && !success) System.err.println(success + ": " + msg + " :: " + q);
		if (!success) anyFailed = true;
		return success;
	}
	public static void main(String[] args) {
		Sanitizer s = new Sanitizer(true);
		boolean p = true;
		s.testQuery("24", false);
		s.testQuery("X=2", true);
		s.testQuery("X=2, Y=4", true);
		s.testQuery("aasdfsd", false);
		s.testQuery("X=[ ]", true);
		s.testQuery("X=[1]", true);
		s.testQuery("X=[1, 2]", true);
		s.testQuery("X=[1 | 2]", true);
		s.testQuery("X=(1,2)", true);
		s.testQuery("X=_", true);
		s.testQuery("\\+ P = 4", true);
		s.testQuery("1 -> 1", true);
		s.testQuery("P = [(_, td, _, _, _), (_, td, _, _, _), (_, bu, _, _, _)]", true);
		s.testQuery("P=[(_, td, _, _, _), (_, bu, _, _, _), (_, td, _, _, _), (_, bu, _, _, _), (_, tdLtrU, _, _, _)]", true);
		s.testQuery("P=random(1)", false);
		s.testQuery("P=random/2(2)", false);
		s.testQuery("P=[random(1)]", false);		
		System.err.println("Ran all schedule sanitization tests, " + (s.anyFailed ? "some failed" : "no failures")); 
		
	}
}
