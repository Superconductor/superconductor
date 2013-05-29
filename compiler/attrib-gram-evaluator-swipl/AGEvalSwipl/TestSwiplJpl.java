package AGEvalSwipl;

import java.util.Hashtable;

import jpl.Compound;
import jpl.Query;
import jpl.Term;
import jpl.Variable;

public class TestSwiplJpl {
	
	public static boolean testExternalCallAst () {
		Variable N = new Variable("N");
		jpl.Integer One = new jpl.Integer(1);
		jpl.Integer Thirteen = new jpl.Integer(13);
		Query q = new Query(
				new Compound(";", new Term[]{
						new Compound("succ", new Term[] { Thirteen, N}),
						new Compound("succ", new Term[] { One, N})}));
						
		int sum = 0;
		while (q.hasMoreSolutions()) {
			@SuppressWarnings("unchecked")
			Hashtable<Variable, Term> binding = (Hashtable<Variable, Term>) q.nextSolution();
			sum += ((jpl.Integer) binding.get("N")).intValue();
		}		
		return sum == (14 + 2);
	}
	
	public static boolean testExternalCallString () {
		Query q = new Query("succ(13, N) ; succ(1, N)");
		int sum = 0;
		while (q.hasMoreElements()) {
			@SuppressWarnings("unchecked")
			Hashtable<Variable, Term> binding = (Hashtable<Variable, Term>) q.nextElement();
			sum += ((jpl.Integer) binding.get("N")).intValue();
		}		
		return sum == (14 + 2);
	}
	
	public static void main(String[] args) {

		try {
		  if (!testExternalCallAst()) throw new Exception();		  
		  System.out.println("Can compute in PL (AST)");
		} catch (Exception e) {
			System.err.println("Cannot compute in PL (AST)");
		}
		try {
			if (!testExternalCallString()) throw new Exception();
			System.out.println("Can compute in PL (string)");
		} catch (Exception e) {
			System.err.println("Cannot compute in PL (string)");
		}
	}
}