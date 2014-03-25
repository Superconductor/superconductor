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

### WebCL

The GPU version requires a browser with WebCL bindings.

*Tested*

OS X 10.8.5 and 10.9.2 Safari (Samsung): https://github.com/wolfviking0/webcl-webkit

*Confirmed by others*

Windows Chrome (AMD): https://github.com/amd/Chromium-WebCL

*Unknown*

Firefox (Nokia)
Node (Motorola)
