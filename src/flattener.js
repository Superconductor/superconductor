/*

	node flattener.js inputJsonPath.json kbindings.js mode opts out.json
		mode: flat, sparse, sparseMT
		opts (optional): null | {minBlockSize: int, minFileSize: int}
	Ex: node flattener.js  tmp/data_sc_small.json ./tmp/kbindings.js sparse "{\"minBlockSize\": 200}" tmp/out.json

*/

var compress = require('./jzlib.js').compress;

var jsonFilePath = process.argv[2];
var kbindingsFilePath = process.argv[3];
var mode = process.argv[4];
var opts = JSON.parse(process.argv[5]);
var outputFileJSON = process.argv[6];


if (!jsonFilePath || !kbindingsFilePath || !mode || !outputFileJSON) throw "node flattener.js inputJsonPath.json kbindings.js mode opts out.json";

compress(jsonFilePath, kbindingsFilePath, mode, opts, outputFileJSON, function (err, ret) {
	if (err) {
		console.log("Failure!");
		console.log(ret);
	} else {
		console.log("Output base ", outputFileJSON);
	}

});