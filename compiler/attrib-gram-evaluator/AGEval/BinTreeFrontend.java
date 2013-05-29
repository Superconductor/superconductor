package AGEval;

import java.io.IOException;
//import java.util.ArrayList;

import org.antlr.runtime.RecognitionException;

import aleGrammar.AleFrontend;

public class BinTreeFrontend {

	/**
	 * @param args
	 * @throws InvalidGrammarException 
	 * @throws RecognitionException 
	 * @throws IOException 
	 */
	public static void main(String[] args) throws InvalidGrammarException, IOException, RecognitionException {		
		AleFrontend f = new AleFrontend("/Users/lmeyerov/Research/parallelbrowser/bbbrowser/projects/attrib-gram-evaluator-swipl/Examples/sampleAdam.ale", false, false);        
        AttributeGrammar grm = new AttributeGrammar("binTree", 
        		"/Users/lmeyerov/Research/parallelbrowser/bbbrowser/projects/osqDemo/binTree/", "QtAleNode", "QtTree", f.ast.classes, f.ast.interfaces, false, false);
        grm.run(false);
	}

}
