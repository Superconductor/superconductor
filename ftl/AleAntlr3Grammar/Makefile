DIR=aleGrammar
OUTPUT=output
PWD:=$(PWD)
ANTLR=$(PWD)/../../libraries/antlr-3.3-complete.jar
AGEval=$(PWD)/../attrib-gram-evaluator/
AGEvalBinary=$(AGEval)
ANTLRSources=$(DIR)/ALELexer.java $(DIR)/ALEParser.java $(DIR)/ALE.tokens

$(OUTPUT):
	if [ -e $(OUTPUT) ]; then touch $(OUTPUT); else mkdir $(OUTPUT); fi

$(DIR):
	if [ -e $(DIR) ]; then touch $(DIR); else mkdir $(DIR); fi

$(ANTLRSources): $(DIR)/ALE.g
	cd $(DIR); java -cp .:$(ANTLR) org.antlr.Tool ALE.g

$(OUTPUT)/AleFrontend.class: $(OUTPUT) $(ANTLRSources) $(DIR)/AleFrontend.java
	javac -cp .:$(ANTLR):$(AGEval) $(DIR)/*.java -d $(OUTPUT)
	

base: $(ANTLRSources) $(OUTPUT)/AleFrontend.class

runAdam: base 
	cd $(OUTPUT); java -cp .:$(AGEval):./aleGrammar:$(ANTLR) aleGrammar/AleFrontend ../samples/sampleAdam.ale `pwd` -ale

runAnim: base 
	cd $(OUTPUT); java -cp .:$(AGEval):./aleGrammar:$(ANTLR) aleGrammar/AleFrontend ../samples/anim.ale `pwd` -ale

all: base 

clean:
	rm -rf $(ANTLRSources) 
	rm -rf $(OUTPUT)
	cd $(DIR); rm -rf $(OUTPUT)
