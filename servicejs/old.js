var fs = require('fs');
var sys = require('sys')
var exec = require('child_process').exec;
var Seq = require('seq');
var sourceMap = require('source-map');


function puts(error, stdout, stderr) { 
	sys.puts(stdout) 
	
}

function hackySourceMap(name, schema, ftlSrc, jsSrc) {
  var sm = new sourceMap.SourceMapGenerator({
  		file: 'layout.js', 
  		sourceRoot: '/'
  	});
  var ftl = 'web/input/webInput' + name + '.ftl';
  
  var lines = jsSrc.split("\n");
  for (var li = 0; li < lines.length; li++) {
    var line = lines[li];
    switch (lines[li]) {
      case "//@type action":
        var action = lines[li + 1];
        var clsName = action.match(/function ([a-z]+)_/)[1];
        var cls = schema.classes[clsName];
        var iface = schema.interfaces[cls.interface];
        
        var attribs = action.match("function " + clsName + "_([a-z_]+)")[1].split("_");
        switch (attribs.length) {
          case 1:
            var attrib = attribs[0];
            sm.addMapping({
              original: { line: 1, column: 1 },
              generated: { line: li + 1, column: 1 },
              source: ftl               
            });
//            console.log('map: ',li,attrib);
            break;
          case 2:
            var attrib = attribs[1];
            var child = attribs[0];
            sm.addMapping({
              original: { line: 1, column: 1 },
              generated: { line: li + 1, column: 1 },
              source: ftl               
            });
//            console.log('map: ',li,attrib);
            break;
          case 0:
          default:
            console.error('unknown action function attributes', action);
            throw 'exn';
        }
        
        li++;
        break;
      default:
        
        //unknown
    }
  }
 
  return sm;
};




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

var session = 0;

//run synthesizer and return js, schedule, and sourcemap
exports.index = function(req, res){
	console.log(req.body.k);
	session++;

	var relFile = "web/input/webInput" + session + ".ftl";

	var jsFile = "web/output/webInput" + session + ".js";
	var schemaFile = "web/output/webInput" + session + ".json";
	var schedFile = "web/output/webInput" + session + ".sched";
	var schedSummaryFile = "web/output/webInput" + session + ".schedSummary";
	var sourcemapFile = "web/output/webInput" + session + ".map";

	var pfx = 'backends/server/html5/'						

	console.log('src len: ', req.body.k.length);

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
		.chainWrite(relFile, req.body.k, this)
		.seq(function () {
			console.log('synthesizing',pfx,relFile);
			var cmd = 'cd ../../..; ant -DaleGrammar=' + pfx + relFile + ' run-alegen-html5fast -Doutput.dir=' + pfx + '/web/output';
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
		  var ast = JSON.parse(ret.schema);
//		  console.log("schema:\n", ast);
		  ret.sourcemap = hackySourceMap(session, ast, req.body.k, ret.js).toString(); 
		  this();
		})
		.chainWrite(sourcemapFile, function () { return ret.sourcemap; })
		.seq(function () {
			console.log('returning');
			res.json(ret);
		})
		.catch(function (err) {
			console.log("bad run: ", err);
			res.json({error: err});
		});
};


//preload input sources
exports.demo = function(req, res){
	var demo = req.body.demo; //FIXME assert /^[a-zA-Z0-9]$/
	console.log('loading',demo);
	
	var ret = {error: null, sc: null, html: null, css: null};
	
	var loadFile = function (name) {
		return function () {
			console.log("reading", name);
			fs.readFile(name, 'ascii',this);
		}
	}
	var passThroughField = function (lbl, fileName) {
		return function (data) {
			console.log('read', lbl, fileName);
			ret[lbl] = data;
			this();
		};
	};
	Seq()
		.seq(loadFile("public/demos/" + demo + ".sc"))
		.seq(passThroughField('sc', demo))
		.seq(loadFile("public/demos/" + demo + ".html"))
		.seq(passThroughField('html', demo))
		.seq(loadFile("public/demos/" + demo + ".css"))
		.seq(passThroughField('css', demo))
		.seq(loadFile("public/demos/" + demo + ".js"))
		.seq(passThroughField('js', demo))
		.seq(function () {
			console.log('all there, returning!');
			res.json(ret);
		})
		.catch(function (err) {
			console.log("bad run: ", err);
			res.json({error: err});		
		});	
};