package aleGrammar;

import java.io.*;
import java.util.ArrayList;

import org.antlr.runtime.ANTLRFileStream;
import org.antlr.runtime.ANTLRStringStream;
import org.antlr.runtime.CharStream;
import org.antlr.runtime.CommonTokenStream;
import org.antlr.runtime.ParserRuleReturnScope;
import org.antlr.runtime.RecognitionException;
import org.antlr.runtime.tree.*;
import org.antlr.stringtemplate.StringTemplate;

import aleGrammar.FTLSyntaxParser.root_return;
import AGEval.InvalidGrammarException;

//one instance per document
public class FrontendBeta {

	


	public Tree reparse (String s) throws IOException, RecognitionException {		
		FTLSyntaxLexer lex = new FTLSyntaxLexer(new ANTLRStringStream(s));
        CommonTokenStream tokens = new CommonTokenStream(lex);
        FTLSyntaxParser parser = new FTLSyntaxParser (tokens);
        FTLSyntaxParser.root_return r = parser.root();
        return (Tree) r.tree;        
	}
		

	public String reparseAll (Tree t) throws IOException, RecognitionException {
		return reparse(t.toStringTree()).toStringTree();
	}
	

	public static String prettify (String tree) {
		return		tree
        			.replaceAll(" class ", "\nclass ")
        			.replaceAll("interface ([a-zA-Z0-9]+) \\{", "\ninterface $1 {\n")
        			.replaceAll(" schedule ", "\nschedule ")
        			.replaceAll("actions \\{", "\n  actions {\n")
        			.replaceAll("children \\{", "\n  children {\n")
//        			.replaceAll("^ ([a-zA-Z0-9]+) : ", "  $1 : ")
        			.replaceAll("phantom \\{", "\n  phantom {\n")
        			.replaceAll("attributes", "\n  attributes")
        			.replaceAll(";", ";\n")        		
//        			.replaceAll("[ ]*([a-z0-9A-Z]* :=)", "    $1")
        			;        					
	}
	
	public static void prettyPrint (String tree) {
		System.out.println(prettify(tree)); 
	}
	
	public static CommonTree reorder (Tree raw) throws RecognitionException {
		FTLReorderToplevelsLexer lex2 = new FTLReorderToplevelsLexer(new ANTLRStringStream(raw.toStringTree()));
        CommonTokenStream tokens2 = new CommonTokenStream(lex2);
        FTLReorderToplevelsParser parser2 = new FTLReorderToplevelsParser (tokens2);
        FTLReorderToplevelsParser.root_return r2 = parser2.root();
        return r2.tree;
	}

	public static CommonTree checkIdentifiers (Tree raw) throws RecognitionException {
		FTLCheckIdentifiersLexer lex2 = new FTLCheckIdentifiersLexer(new ANTLRStringStream(raw.toStringTree()));
        CommonTokenStream tokens2 = new CommonTokenStream(lex2);
        FTLCheckIdentifiersParser parser2 = new FTLCheckIdentifiersParser (tokens2);
        FTLCheckIdentifiersParser.root_return r2 = parser2.root();
        if (parser2.errors.size() > 0) {
        	System.err.println("  checkIdentifiers: Tree " + (r2.tree == null) + ", error count: " + parser2.errors.size());
        	throw new RecognitionException();
        }
        return r2.tree;
	}
	
	public static void checkGrammar (String grammarFilePath) throws IOException, RecognitionException {
		System.err.println("Checking grammar..");
		//====== Syntax check
//		System.err.println("===============");
//		System.err.println("Syntax");
		FTLSyntaxLexer lex = new FTLSyntaxLexer(new ANTLRFileStream(grammarFilePath));
        CommonTokenStream tokens = new CommonTokenStream(lex);
        FTLSyntaxParser parser = new FTLSyntaxParser (tokens);
        FTLSyntaxParser.root_return r = parser.root();        
        
		//====== Sort top levels
//		System.err.println("===============");
//      System.err.println("Sort");
        if (r.tree == null) {
        	System.err.println("Null tree: "+ grammarFilePath);
        	return;
        }
        CommonTree r2 = reorder((Tree) r.tree);

		//====== Desugar traits
//		System.err.println("===============");
//      System.err.println("Expand traits");
        FTLExpandTraitsLexer lex4 = new FTLExpandTraitsLexer(new ANTLRStringStream(r2.toStringTree()));
        CommonTokenStream tokens4 = new CommonTokenStream(lex4);
        FTLExpandTraitsParser parser4 = new FTLExpandTraitsParser (tokens4);
        FTLExpandTraitsParser.root_return r4 = parser4.root();
        
        CommonTree r5 = reorder((Tree)r4.tree);

        CommonTree r7 = checkIdentifiers(r5);        
//      System.out.println("====Valid grammar!===");
//      prettyPrint(r7.toStringTree());
//      System.out.println("====Valid grammar!===");
        
        System.err.println("Checks complete.");		
	}

	
	public FrontendBeta (String grammarFilePath) throws IOException, RecognitionException, InvalidGrammarException {
		
		//====== Syntax check
		System.err.println("===============");
		System.err.println("Syntax");
		FTLSyntaxLexer lex = new FTLSyntaxLexer(new ANTLRFileStream(grammarFilePath));
        CommonTokenStream tokens = new CommonTokenStream(lex);
        FTLSyntaxParser parser = new FTLSyntaxParser (tokens);
        FTLSyntaxParser.root_return r = parser.root();        
        
		//====== Sort top levels
		System.err.println("===============");
        System.err.println("Sort");
        
        System.err.println(((Tree)r.tree).toStringTree());
        CommonTree r2 = reorder((Tree) r.tree);

		//====== Desugar traits
		System.err.println("===============");
        System.err.println("Expand traits");
        FTLExpandTraitsLexer lex4 = new FTLExpandTraitsLexer(new ANTLRStringStream(r2.toStringTree()));
        CommonTokenStream tokens4 = new CommonTokenStream(lex4);
        FTLExpandTraitsParser parser4 = new FTLExpandTraitsParser (tokens4);
        FTLExpandTraitsParser.root_return r4 = parser4.root();
        
        CommonTree r5 = reorder((Tree)r4.tree);

		//====== Expand conditionals
		System.err.println("===============");
        System.err.println("Expand conditionals");
        
        System.err.println(prettify(r5.toStringTree()));
/*        
        FTLExpandConditionalsLexer lex5 = new FTLExpandConditionalsLexer(new ANTLRStringStream(prettify(r5.toStringTree())));        
        //FTLExpandConditionalsLexer lex5 = new FTLExpandConditionalsLexer(new ANTLRStringStream(r5.toStringTree()));
        CommonTokenStream tokens5 = new CommonTokenStream(lex5);
        FTLExpandConditionalsParser parser5 = new FTLExpandConditionalsParser (tokens5);
        FTLExpandConditionalsParser.root_return r6r = parser5.root();
*/
/*
        System.err.println(prettify(r5.toStringTree()));
        FTLExpandConditionals parser5 = new FTLExpandConditionals(new CommonTreeNodeStream(r5));
        FTLExpandConditionals.root_return r6r = parser5.root();
        System.err.println(prettify(r6r.toString()));
        
        CommonTree r6 = r6r.tree;
        System.err.println("Expanded conditionals:");
        System.err.println(prettify(r6.toStringTree()));
*/
        
		//====== Expand conditionals
		System.err.println("===============");
        System.err.println("Check identifiers");

        CommonTree r7 = checkIdentifiers(r5);        
        System.out.println("====Valid grammar!===");
        prettyPrint(r7.toStringTree());
        System.out.println("====Valid grammar!===");

        
		//======

        //Tree clean = reparse(((Tree)r2.tree).toStringTree());
        //System.out.println(new DOTTreeGenerator().toDOT((CommonTree) clean));

	}
	
	//1: input grammar file url
    public static void main(String[] args) throws Exception {
    	int numArgs = 1;
        if (args.length != numArgs) {
          System.err.println("Arg 1: ALE grammar file");          
          throw new Exception ("Not enough args to frontend");
        }
        FrontendBeta grammar = new FrontendBeta(args[0]);        
        
    }	

}
