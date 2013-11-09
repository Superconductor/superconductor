GEN_PATH ?= ./tmp
NODE_PATH ?= ./node_modules
JS_COMPILER ?= $(NODE_PATH)/uglify-js2/bin/uglifyjs2
CHUNKER = ./tools/kernel-chunker.js

all: \
	superconductor.js \
	superconductor.min.js
all2: \
	all \
	tmp/kernels.visualization


tmp/kernels.cl: $(GEN_PATH)/unionvariants.h $(GEN_PATH)/cl_runner_generated_buffer_info.h $(GEN_PATH)/cl_generated_aleactions.h $(GEN_PATH)/traversals.cl
	cat $+ > $@

tmp/kernels.visualization: tmp/kernels.cl $(GEN_PATH)/kbindings.js
	$(CHUNKER) tmp/kernels.cl -n "this.kernelSource" -o tmp/clSource.tmp
	cp $(GEN_PATH)/kbindings.js kbindings.js
	cat tmp/clSource.tmp >> kbindings.js
	mv kbindings.js $@

.INTERMEDIATE: tmp/clSource.js
tmp/clSource.js: ./src/common.h ./src/drawing2.cl
	$(CHUNKER) $+ -n "CLRunner.prototype.kernelHeaders" -o $@

superconductor.js: \
	Makefile \
	./src/SCException.js \
	./src/main.js \
	./lib/J3DIMath.js \
	./src/GLRunner.js \
	./src/CLDataWrapper.js \
	./src/CLRunner.js \
	./tmp/clSource.js

	$(JS_COMPILER) $(filter %.js,$^) --beautify width=120 --output $@

%.min.js: %.js
	$(JS_COMPILER) $< --compress --output $@

clean:
	rm -rf  tmp
	mkdir tmp

cleanall: clean
	rm -f superconductor.js superconductor.min.js
