#!/usr/bin/env node

// This script will read in a list of files specified via -i options, combine their data into one
// long string, then split that string up into strings of length given by -s (default 32768) and
// create a Javascript array of containing these strings, with the variable name given by the
// -n option, writing it into a file given by the -o option 

var sys = require("util");
var optimist = require("optimist");
var fs  = require("fs");

var ARGS = optimist
	.usage("Reads in one or more source files, combines them into a single string, then breaks that \
string up into an array of substrings of at most -l length. A Javascript file containing a variable \
assignment to this array is then written to the given output file.\n\n\
Usage: $0 [cl_kernel_1.cl ...] [-s 32768] -n \"this.kernelSource\" [-o kernels.js]\n\
If no input file is given, input read from standard input")
	.wrap(80)

	.describe("l", "The maximum length, in characters, to break the source string up into.")
	.alias("l", "max-string-length")
	.default("l", 32768)

	.describe("n", "The name of the variable to assign to the array of source strings.")
	.alias("n", "variable-name")
	.demand("n")

	.describe("o", "Output file name to write the Javascript containing the source string array. If not given, output written to STDOUT.")
	.alias("o", "output")

	.describe("h", "Print this help informatiion and exit")
	.alias("h", "help")

	.argv;

if (ARGS.h || ARGS.help) {
    sys.puts(optimist.help());
    process.exit(0);
}

var inputFiles = ARGS._.slice();

// If no input file has been specified, read from stdin
if(inputFiles.length < 1) {
	inputFiles = ['/dev/stdin'];
}

// Contents of all input files combined into one string
var inputContents = "";

for(var i = 0; i < inputFiles.length; i++) {
	inputContents += fs.readFileSync(inputFiles[i]);
	inputContents += "\n";
}


var subStrings = [];
for(var cursor = 0; cursor < inputContents.length; cursor += ARGS.l) {
	subStrings.push(inputContents.substring(cursor, cursor + ARGS.l));
}

var output = ARGS.n + " = " + JSON.stringify(subStrings) + ";\n";

if(ARGS.o) {
	fs.writeFileSync(ARGS.o, output, "utf8");
} else {
	sys.print(output);
}