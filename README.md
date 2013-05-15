##Superconductor 
###Parallel Web Programming for Massive Visualizations

*Open Source Release in May 2013! (BSD3 license)*

Superconductor is a collection of compilers for scripting large, interactive visualizations. 

By supporting data sets of hundreds of thousands of data points, Superconductor enables new classes of interactive visualizations that were previously out of reach.

==
### Three key ideas:

1. **DSLs:** Programs are written in high-level *domain specific* languages (DSLs) -- and mostly standard web ones at that. 
  
  It supports the core visualization pipeline: data loading, styling, layout, rendering, and interaction.

2. **Automatic Parallelism:** Aggressive compilers employ program synthesis and modern parallel algorithms

  Superconductor's DSL compilers are aggressive, yet are hidden from typical programming interactions.

3. **Parallel JavaScript:** Portability and scriptability is through exploiting modern web standards from multicore and GPU processing

  Superconductor automates use of: web workers (multicore), WebCL (GPU), and WebGL (GPU).


==
### 1. Domain specific languages (DSLs)

Superconductor supports web languages:

  -- JSON for data
  -- CSS selectors for styling
  -- JavaScript for interaction

It also introduces FTL for building custom layouts:

  -- FTL is a declarative language ("attribute grammar")
  -- We've used it for 2D and 3D graphics, charting, hierarchical data, and interactive animations
  -- A layout is a tree schema with local constraints between node attributes
  
  Ex:   
    class HBox : Node { 
      children { left: Node; right : Node }
      actions {
        width := left.width + right.width
        
        @render paintRect(x, y, width, height, red)
      }
    }
    class VBox : Node { ... }
  
  -- The constraints must be solvable as a sequenence of parallel tree traversals (the compiler automatically figures this out)
  -- An experimental extension for OMeta (static / metapgrogramming), and through it, declarative rendering (@render in the example)

==
### 2. Automatic Parallelism

Superconductor provides compilers for each of its high-level DSLs. It automatically finds and exploits parallelism.

-- It uses the GPU for the basic animation/interaction loop, except for data loading (parsing), which is multicore
-- It optimizes data representation and scheduling, but largely hides this from the programming API
-- It uses modern data parallel compilation techniques when viable
-- It uses new techniques in program synthesis to find parallelism in the layout language

==
### 3. Parallel JavaScript

For portability and scriptability, Superconductor uses parallel JavaScript: 

 -- multicore (web workers) and GPU (WebCL, and WebGL)

 -- programming is in our DSLs; Superconductor generates the parallel JavaScript code
 
 -- visualizations live in standard webpages, meaning they interact normally with the surrounding page through standard JavaScript

 -- we are working on supporting multiple backends, but the focus is on enabling new types of experiences on modern clients

