##Superconductor 
###Parallel Web Programming for Massive Visualizations

*Public Backends*

* Sequential JavaScript layout w/ canvas rendering
* WebCL layout w/ WebGL rendering
* Stale: CUDA, OpenCL, C++, ASMJS, Qt

*Other Known*
* Graphistry: Web workers layout w/ WebGL rendering
* Berkeley: Rust


###Compiling from source

* Install nodejs, java + ant, swi-pl
* In "superconductorjs", run "npm install"
* In "superconductorjs", run "make all"
* In "compiler", run "ant" . You may need to fix up "local.properties" (template in "local.properties.mac")

###Test

Run "./runTestWebServer.sh" from the main folder to launch a local test server

*Unit tests* (pixel/zoom tests report false negatives)
* Sequential (any browser): http://localhost:8888/examples/boxes/index.html?webworkerLayout=false&ignoreCL=true&ignoreGL=true
* WebCL (WebCL-enabled browser): http://localhost:8888/examples/boxes/index.html?webworkerLayout=false&ignoreCL=false&ignoreGL=false

*Demos*
* Treemap (WebCL): http://localhost:8888/examples/treemap/index.html?webworkerLayout=false&ignoreCL=false&ignoreGL=false
* 3D Line Graph (WebCL): http://localhost:8888/examples/linegraph-3d/


### WebCL

The GPU version requires a browser with WebCL bindings.

*Tested*

OS X 10.8.5 and 10.9.2 Safari (Samsung): https://github.com/wolfviking0/webcl-webkit

Tip: Make sure WebGL is enabled from the developer menu.
Tip: Try the n-body example that comes with WebKit

*Confirmed by others*

Windows Chrome (AMD): https://github.com/amd/Chromium-WebCL

*Unknown*

Firefox (Nokia)
Node (Motorola)
