#!/usr/bin/env node

// Generate data for all the demos

var compress = require('./jzlib.js').compress;
var Seq = require('seq');




//this == cb
// function geSC() {
	
// 	var genData = function () {
// 		var window = {};
	
// 		//========
// 		//edits to these should also happen in examples/sc/index.html
// 		window.vizDefaults = {
// 		  numGenerators: 12,
// 		  numSpikesPerGenerator: 8000,
// 		  height: 15.0,
// 		  radius: 28.0,
// 		  minRadius: 0.5,
// 		  tweenMin: 0,
// 		  tweenMax: 100,
// 		};
	
// 		function makeSpike(val) {
// 			return {class: "Spike", "val": val ? val : Math.random()};
// 		}
	
// 		function makeGenerator (len) {
// 			function clamp (v) { return Math.max(0, Math.min(1.0, v)); }
	
// 			var childs = [];
// 			var roll = Math.random();
// 			var range = 0.03;
// 			for (var i = 0; i < len; i++) {
// 				roll += range * Math.random() - range/2.0;
// 				roll = clamp(roll);
// 				childs.push(makeSpike(roll));
// 			}
// 			return {class: "Generator", children: { "childs": childs } };
// 		}
		
// 		function makeRoot(numGenerators, numSpikes) {
// 			var childs = [];
// 			for (var i = 0; i < numGenerators; i++) {
// 				childs.push(makeGenerator(numSpikes));
// 			}
// 			return {class: "Root",
// 					"xOffset": window.vizDefaults.radius,
// 					"yOffset": -2.4*window.vizDefaults.radius,
// 					"tweenMin": window.vizDefaults.tweenMin / 100.0,
// 					"tweenMax": window.vizDefaults.tweenMax / 100.0,
// 					"height": window.vizDefaults.height,
// 					"radius": window.vizDefaults.radius,
// 					"minRadius": window.vizDefaults.minRadius,
// 					children: {
// 						"child": {
// 							class: "Second",
// 							children: {"childs": childs} }}};
// 		}
						
// 		var tinyData = makeRoot(window.vizDefaults.numGenerators, window.vizDefaults.numSpikesPerGenerator);
// 		//======
	
	
// 		return tinyData;
// 	};
	
// 	this(null, {genData: genData, base: '../../examples/linegraph-3d-2/'});
// } //geSC


// this = cb
var geSC2 = function () {

	var genData = function () {
		var window = {};
	
		//========
		//edits to these should also happen in examples/sc2/index.html
		window.vizDefaults = {
		  numGenerators: 200,
		  numSpikesPerGenerator: 500,
		  height: 15.0,
		  radius: 28.0,
		  minRadius: 0.5,
		  tweenMin: 0,
		  tweenMax: 100,
		};
	
		function makeSpike(val) {
			return {class: "Spike", "val": val ? val : Math.random()};
		}
	
		function makeGenerator (len) {
			function clamp (v) { return Math.max(0, Math.min(1.0, v)); }
	
			var childs = [];
			var roll = Math.random();
			var range = 0.03;
			for (var i = 0; i < len; i++) {
				roll += range * Math.random() - range/2.0;
				roll = clamp(roll);
				childs.push(makeSpike(roll));
			}
			return {class: "Generator", children: { "childs": childs } };
		}
		
		function makeRoot(numGenerators, numSpikes) {
			var childs = [];
			for (var i = 0; i < numGenerators; i++) {
				childs.push(makeGenerator(numSpikes));
			}
			return {class: "Root",
					"xOffset": window.vizDefaults.radius,
					"yOffset": -2.4*window.vizDefaults.radius,
					"tweenMin": window.vizDefaults.tweenMin / 100.0,
					"tweenMax": window.vizDefaults.tweenMax / 100.0,
					"height": window.vizDefaults.height,
					"radius": window.vizDefaults.radius,
					"minRadius": window.vizDefaults.minRadius,
					children: {
						"child": {
							class: "Second",
							children: {"childs": childs} }}};
		}
	
							
		var tinyData = makeRoot(window.vizDefaults.numGenerators, window.vizDefaults.numSpikesPerGenerator);
		//======

	
		return tinyData;
	};
	
	this(null, {genData: genData, base: '../../examples/linegraph-3d/'});

}

// function geSC3 () {
// 	var genData = function () {
// 		var window = {};
	
// 		//========
// 		//edits to these should also happen in examples/sc3/index.html

// 		window.vizDefaults = {
// 		  numGenerators: 2,
// 		  numSpikesPerGenerator: 10000,
// 		  height: 15.0,
// 		  radius: 28.0,
// 		  minRadius: 0.5,
// 		  tweenMin: 0,
// 		  tweenMax: 100,
// 		};
	
// 		function makeSpike(val) {
// 			return {class: "Spike", "val": val ? val : Math.random()};
// 		}
	
// 		function makeGenerator (len) {
// 			function clamp (v) { return Math.max(0, Math.min(1.0, v)); }
	
// 			var childs = [];
// 			var roll = Math.random();
// 			var range = 0.03;
// 			for (var i = 0; i < len; i++) {
// 				roll += range * Math.random() - range/2.0;
// 				roll = clamp(roll);
// 				childs.push(makeSpike(roll));
// 			}
// 			return {class: "Generator", children: { "childs": childs } };
// 		}
		
// 		function makeRoot(numGenerators, numSpikes) {
// 			var childs = [];
// 			for (var i = 0; i < numGenerators; i++) {
// 				childs.push(makeGenerator(numSpikes));
// 			}
// 			return {class: "Root",
// 					"xOffset": window.vizDefaults.radius,
// 					"yOffset": -2.4*window.vizDefaults.radius,
// 					"tweenMin": window.vizDefaults.tweenMin / 100.0,
// 					"tweenMax": window.vizDefaults.tweenMax / 100.0,
// 					"height": window.vizDefaults.height,
// 					"radius": window.vizDefaults.radius,
// 					"minRadius": window.vizDefaults.minRadius,
// 					children: {
// 						"child": {
// 							class: "Second",
// 							children: {"childs": childs} }}};
// 		}
	
							
// 		var tinyData = makeRoot(window.vizDefaults.numGenerators, window.vizDefaults.numSpikesPerGenerator);
// 		//======

	
// 		return tinyData;
// 	};
	
// 	this(null, {genData: genData, base: '../examples/ge/sc3/'});

// }

// function geSC4 () {
// 	var genData = function () {
// 		var window = {};
	
// 		//========
// 		//edits to these should also happen in examples/sc4/index.html

// 		window.vizDefaults = {
// 		  numGenerators: 200,
// 		  numSpikesPerGenerator: 500,
// 		  height: 15.0,
// 		  radius: 28.0,
// 		  minRadius: 0.5,
// 		  tweenMin: 0,
// 		  tweenMax: 100,
// 		};
	
// 		function makeSpike(val) {
// 			return {class: "Spike", "val": val ? val : Math.random(), 
// 				"color": 102 * (256 * 256 * 256) + 0 * (256 * 256) + 204 * (256) + 255};
// 		}
	
// 		function makeGenerator (len) {
// 			function clamp (v) { return Math.max(0, Math.min(1.0, v)); }
	
// 			var childs = [];
// 			var roll = Math.random();
// 			var range = 0.03;
// 			for (var i = 0; i < len; i++) {
// 				roll += range * Math.random() - range/2.0;
// 				roll = clamp(roll);
// 				childs.push(makeSpike(roll));
// 			}
// 			return {class: "Generator", children: { "childs": childs } };
// 		}
		
// 		function makeRoot(numGenerators, numSpikes) {
// 			var childs = [];
// 			for (var i = 0; i < numGenerators; i++) {
// 				childs.push(makeGenerator(numSpikes));
// 			}
// 			return {class: "Root",
// 					"xOffset": window.vizDefaults.radius,
// 					"yOffset": -2.4*window.vizDefaults.radius,
// 					"tweenMin": window.vizDefaults.tweenMin / 100.0,
// 					"tweenMax": window.vizDefaults.tweenMax / 100.0,
// 					"height": window.vizDefaults.height,
// 					"radius": window.vizDefaults.radius,
// 					"minRadius": window.vizDefaults.minRadius,
// 					children: {
// 						"child": {
// 							class: "Second",
// 							children: {"childs": childs} }}};
// 		}
	
							
// 		var tinyData = makeRoot(window.vizDefaults.numGenerators, window.vizDefaults.numSpikesPerGenerator);
// 		//======

	
// 		return tinyData;
// 	};
	
// 	this(null, {genData: genData, base: '../examples/ge/sc4/'});

// }


function election () {
	this(null, {
			genData: function () { return '../../examples/treemap/data_sc_big.json' ;},
			base: '../../examples/treemap/'});
}




// function parlabdemo () {
// 	var genData = function () {
// 		var window = {};
	
// 		//========
// 		//edits to these should also happen in examples/parlabdemo2013/spotifysetup/dataviz.html
		
// 		function makeNode (depth, span) {
// 			var children = [];
// 			if (depth) for (var i = 0; i < span; i++) children.push(makeNode(depth - 1, span));
			
// 			return {"class": "Node", 
// 				"children": {"childs": children},
// 				"title": "song title " + depth + "v" + Math.round(100 * Math.random()),
// 				"dist_to_root": Math.random(),
// 				"tempo": Math.random(),
// 				"artist_hottness": Math.random(),
// 				"artist_name": "band " + Math.random(),
// 				"mode": Math.round(100 * Math.random()) };
// 		}
// 		function makeRoot (depth, span) {
// 			var res = {"class": "Root", "children": {"top": makeNode(depth, span) }};
// 			return res;
// 		}
		
// 		var tinyData = makeRoot(11,3);		
// 		//======

// 		return tinyData;
// 	};
	
// 	this(null, {genData: genData, base: '../examples/parlabfinal2013/spotifysetup/'});
// }



//this == cb
function handleExample(mode, baseName, opts, data, dirName) {
	compress(data, dirName + 'kbindings.js', mode, baseName, dirName + baseName, this);
} 

//this == cb
function expandIntoConfigs (example) {
	var data = example.genData();
	var base = example.base;

	var configs = [ 
		['flat', 'data.flat.json', null, data, base],
		['sparse', 'data.sparse.json', {minBlockSize: 2048}, data, base],
		['sparseMT', 'data.sparse.mt.json', {minBlockSize: 2048, minFileSize: (100 * 1024)}, data, base] 
	];

	this(null, configs);		
}


var examples = [geSC2, election] // , geSC, geSC3, geSC4



Seq()
	.seq(function () { this(null, examples); })
	.flatten(false)
	.parEach(function (exFn) {
		var cont = this.into(exFn);
		Seq()
			.seq(exFn)
			.seq(expandIntoConfigs)
			.flatten(false)
			.parEach(function (cfg) {
				handleExample.apply(this.into(cfg), cfg.slice());
			})
			.seq(function () {		
				for (var i in this.vars)
					console.log("vars i", this.vars[i].outputFileJSON);
				cont();
			});
	})
	.seq(function () {		
		for (var i in this.vars)
			console.log("vars i", i.toString().split(" ")[1]);
	});
	
