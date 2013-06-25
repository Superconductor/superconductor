///////////// INCLUDES ////////////

/* server */
var sys = require( "sys" );
var http = require( "http" );
//var winston = require('winston');

/* service */ 
var fs = require('fs');
var Seq = require('seq');
var exec = require('child_process').exec;


/////////////// HELPERS ///////////

Seq().seq(function () {}).__proto__.chainRead = function (file,ret,prop) {
  return this.
	seq(function() {
		console.log('reading', file);
		fs.readFile(file, 'ascii', this);	  
	}).
	seq(function (str) {
		console.log('read');
		ret[prop] = str;
		this();
	});	  	
};

Seq().seq(function () {}).__proto__.chainWrite = function (file, src) {
  return this.
	seq(function() {
		console.log('writing file', file);
		if (typeof(src) == 'function') fs.writeFile(file, src(), this);
		else fs.writeFile(file, src, this);
	});
};

function failJSON(err, req, res) {
	 res.writeHead(200, {"Content-Type": "application/json",  "Access-Control-Allow-Origin": "*"});
	 res.write(JSON.stringify({err: err}));
	 res.end();
	 return false;
}



////////////////// GLOBALS /////////////

/* globals */

var session = 0;



/////////////////  ROUTES  //////////////


function checkData(data, req, res) {	

	if (!data.hasOwnProperty('ftl')) 
		return failJSON('missing request field "ftl"', req, re);
	if (!data.hasOwnProperty('target')) 
		return failJSON('missing request field "target"', req, re);
	switch (data.target) {
		case 'webcl':
		case 'js':
			break;
		default:
			return failJSON('unknown target field value: ' + data.target, req, re);
	}
	return true;
}

function handleData(data, req, res) {

	session++;

	var pfx = '../servicejs/'						
	var relFile = "cache/input/webInput" + session + ".ftl";
	var jsFile = "cache/output/webInput" + session + ".js";
	var schemaFile = "cache/output/webInput" + session + ".json";
	var schedFile = "cache/output/webInput" + session + ".sched";
	var schedSummaryFile = "cache/output/webInput" + session + ".schedSummary";
	var sourcemapFile = "cache/output/webInput" + session + ".map";

	var ret = {
	  js: null, 
	  error: null, 
	  sched: null, 
	  std: null,
	  ftlFile: relFile,
	  jsFile: jsFile,
	  schemaFile: schemaFile,
	  sourcemapFile: sourcemapFile	  
	};
		
	Seq()
		.chainWrite(relFile, data.ftl, this)
		.seq(function () {
			if (checkData(data, req, res)) 
				return this();
			//else failed already			
		})
		.seq(function () {
			console.log('synthesizing',pfx,relFile);
			var cmd = 'cd ../compiler; ant -DaleGrammar=' + pfx + relFile + ' run-alegen-html5fast -Doutput.dir=' + pfx + '/cache/output';
			console.log('cmd: ',cmd);
			exec(cmd, this);		
		})
		.seq(function (std) {
			console.log('checking schedule for errors');
			if (!std 
					|| std.indexOf("Exception") != -1 
					|| std.indexOf("Fail") != -1 
					|| std.indexOf("Null tree") != -1 
					|| std.indexOf("no viable alternative") != -1 
					|| std.indexOf("mismatched") != -1
					|| std.indexOf("Double assignment") != -1) {
				this(std);
			} else {
				console.log('good run');
				ret.std = std;		
				this();
			}
		})
		.chainRead(jsFile, ret, 'js')
		.chainRead(schedFile, ret, 'sched')
		.chainRead(schedSummaryFile, ret, 'summary')
		.chainRead(schemaFile, ret, 'schema')
		.seq(function () {
			console.log('successfully returning');
			
			 res.writeHead(200, {"Content-Type": "application/json",  "Access-Control-Allow-Origin": "*"});
			 res.write(JSON.stringify(ret.js));
			 res.end();
		})
		.catch(function (err) {
			console.error("bad run: ", err);
			failJSON('unhandled error', req, res);
		});
}

function routeCompile (req, res){


	console.log('running service');

	//CORS for Chrome
	if (req.method == 'OPTIONS') {
		var origin = (req.headers.origin || "*");
		res.writeHead(
                "204",
                "No Content",
                {
                    "access-control-allow-origin": origin,
                    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "access-control-allow-headers": "content-type, accept, X-Requested-With",
                    "access-control-max-age": 10, // Seconds.
                    "content-length": 0
                }
            );

	    return( res.end() );
	}


	try {
		if (req.method != 'POST')
			return failJSON('compiler requires post, got ' + req.method, req, res);
	} catch (e) {
		return failJSON('unknown err', req, res);
	}
	
	var body = "";
	req.on("data", function (data) { 
		console.log('data chunk', data); 
		body += data; 
	});
	req.on("error", function (e) { failJSON("unknown err", req, res); });
	req.on("end", function () { 
		var data;
		try {
			data = JSON.parse(body);						
		} catch (e) {
			return failJSON({msg: 'could not parse JSON body', e: e}, req, res);
		}
		try {
			handleData(data, req, res); 
		} catch (e) {
			console.error('bad handle', e);
			return failJSON('unknown err', req, res);
		}
	});
};



 
/////////////////  SERVER  //////////////
 
/* Create our HTTP server. */
var server = http.createServer(
function( request, response ){

	var url = request.url;
	
	if (url.indexOf('/compile') != -1) {
		routeCompile(request, response)	
	} else {
		console.error("unhandled url", request.url);	 
		response.end();	 	
	}	
	 
});
 
/* Point the HTTP server to port 8080. */
server.listen( 8080 );
 
/* For logging.... */
sys.puts( "Server is running on 8080" );
