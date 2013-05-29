#!/usr/bin/env node

// This script will read in a list of files specified via -i options, combine their data into one
// long string, then split that string up into strings of length given by -s (default 32768) and
// create a Javascript array of containing these strings, with the variable name given by the
// -n option, writing it into a file given by the -o option 

var sys = require("util");
var fs  = require("fs");


var ARGS = process.argv;
if(ARGS[0] == 'node') {
	ARGS.shift();
}

if(process.argv.length != 3) {
	process.stdout.write("Takes a FTL input file and processes it with OMeta macros for doing GPU-based rendering, and for evaluating traits. \n\n\
Usage: macro-processor.js <input FTL filename> <output FTL filename>\n");
	process.exit(-1);
}

var inputFileName = ARGS[1], outputFileName = ARGS[2];
var basePath = fs.realpathSync(ARGS[0].split('/').slice(0,-1).join('/') + '/..');
var ometaPath = basePath + '/lib/ometa-js/', macroPath = basePath + '/src/macros/';

eval(fs.readFileSync(ometaPath+'lib.js')+'');
eval(fs.readFileSync(ometaPath+'ometa-base.js')+'');
eval(fs.readFileSync(ometaPath+'bs-js-compiler.js')+'');
eval(fs.readFileSync(ometaPath+'bs-ometa-js-compiler.js')+'');
eval(fs.readFileSync(ometaPath+'bs-ometa-compiler.js')+'');
eval(fs.readFileSync(ometaPath+'bs-ometa-optimizer.js')+'');

var ometaEval = '' + fs.readFileSync(macroPath + "expr.ometa") + '\n\n'
	+ fs.readFileSync(macroPath + "exprGen.ometa") + '\n\n'
	+ fs.readFileSync(macroPath + "ftl.ometa") + '\n\n'
	+ fs.readFileSync(macroPath + "traits.ometa") + '\n\n'
	+ fs.readFileSync(macroPath + "renderExp.ometa") + '\n\n'
	+ fs.readFileSync(macroPath + "renderAndTraits.ometa") + '\n\n'
	+ fs.readFileSync(macroPath + "reorder.ometa") + '\n\n';

var tree = BSOMetaJSParser.matchAll(ometaEval+'', "topLevel", undefined, function(m, i){throw objectThatDelegatesTo(fail, {errorPos: i}) });
var ometaEvalJS = BSOMetaJSTranslator.match(tree, "trans");
eval(ometaEvalJS);

fs.readFile(inputFileName, function(err, data){
	process.stdout.write("Reading input file " + inputFileName + "\n");
	process.stdout.write("Parsing...\n");
	process.stdout.write("Done\n\n");
	
	var transformedSource = translateRenderAndTraits(data +'');
	var reorderedSource = translate(transformedSource);
	
	fs.writeFile(outputFileName, reorderedSource, function(err, data) {
		process.stdout.write("Wrote processed FTL file to " + outputFileName + "\n");
	});
});

