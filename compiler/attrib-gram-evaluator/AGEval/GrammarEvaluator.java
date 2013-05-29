package AGEval;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import AGEval.EvalStep.EvalType;
import AGEval.IFace.ClassType;

public class GrammarEvaluator {
	public final boolean isFtl;

	public enum EdgeType {DIRECT, INDIRECT};
	public enum VertType {FIELD, ATTRIB, UNKNOWN};

	// given input
	private ArrayList<IFace> interfaces;
	private ArrayList<Class> classes;
	private VertexSymbolTable stringMappings;

	// variables constructed by class/interface addition (Used in setup)
	private HashMap<Vertex, Vertex> vertices; // vertices really only used for repeat addition detection
	private HashMap<Vertex, HashMap<Vertex, EdgeType>> edges; // Global edge set
	
	/** Pattern used to parse out attributes 
	 *  Enforced Requirements: 
	 *      attrib/class: [a-zA-Z_][a-zA-Z_0-9]*            */
	public static Pattern attribPat = Pattern.compile("(?:([a-zA-Z][a-zA-Z_0-9]*)@)?([a-zA-Z_][a-zA-Z_0-9]*)");

	/** Creates a new evaluator */
	public GrammarEvaluator(ArrayList<IFace> inter, ArrayList<Class> cls, VertexSymbolTable mappings){
		this(inter, cls, mappings, false);
	}

	/** Creates a new evaluator */
	public GrammarEvaluator(ArrayList<IFace> inter, ArrayList<Class> cls, VertexSymbolTable mappings, boolean isFtl_){
		isFtl = isFtl_;
		vertices = new HashMap<Vertex, Vertex>();
		edges = new HashMap<Vertex, HashMap<Vertex, EdgeType>>();
		interfaces = inter;
		classes = cls;
		stringMappings = mappings;
	}
	
	/** Method to parse an attrib, returns an array containing [Class, Attrib]. */
	public static String[] parseAttribute(String attrib) throws InvalidGrammarException{
		Matcher myMatch = attribPat.matcher(attrib);
		if (!myMatch.matches()){
			AGEvaluator.badGrammar("Error: Attribute " + attrib + " failed parsing");
		}
		String[] returning = new String[2];
		returning[0] = myMatch.group(1);
		returning[1] = myMatch.group(2);
		return returning;
	}
	
	/** Main method that runs the evaluator */
	public void evaluate() throws InvalidGrammarException{

		// Create vertices and direct edges
		createGraph();
		
		// Apply all edges between interface attribs to classes / class attribs to interfaces
		applyInterEdges();

		// Calculate transitive closure with indirect edges
		addTransitiveEdges();
		
		// Create topo sort over classes
		topoSort();
		
		// Walk over passes to create visitors
		createVisitors();
	}
	
	/** Method to initialize the internal graph */
	public void createGraph() throws InvalidGrammarException{
		
		// verify all classes and interfaces unique
		verifyUniqueness();
		
		// add vertices
		for (IFace inter : interfaces){
			addIfaceToGraph(inter);
		}
		for (Class cls : classes){
			addClassToGraph(cls);
		}
		for (Class cls : classes){
			initClassFunctions(cls); // functions need to point to represented vertices, not just string representations
		}

		// add edges
		for (Class clz : classes){
			addEdgesToGraph(clz);
		}
		
		verifySingleAssignment();
	}
	
	/** checks that all string names for classes and interfaces are unique */
	private void verifyUniqueness() throws InvalidGrammarException{
		HashSet<String> existingNames = new HashSet<String>();
		for (IFace iface : interfaces){
			String name = iface.getName();
			if (existingNames.contains(name)){
				AGEvaluator.badGrammar("Error: multiple interfaces named " + name);
			}
			else {
				existingNames.add(name);
			}
		}
		for (Class cls : classes){
			String name = cls.getName();
			if (existingNames.contains(name)){
				AGEvaluator.badGrammar("Error: multiple uses for name " + name);
			}
			else {
				existingNames.add(name);
			}
		}
	}

	/** Method to add iFace to a graph */
	private void addIfaceToGraph(IFace iFace) throws InvalidGrammarException{
		addVertices(iFace.getPubFields(), iFace, VertType.FIELD, true);
		addVertices(iFace.getPubAttributes(), iFace, VertType.ATTRIB, true);
	}

	/** Method to add class to a graph */
	private void addClassToGraph(Class cls) throws InvalidGrammarException{
		addVertices(cls.getPubAttributes(), cls, VertType.ATTRIB, true);
		addVertices(cls.getPrivAttributes(), cls, VertType.ATTRIB, false);
		addVertices(cls.getPubFields(), cls, VertType.FIELD, true);
		addVertices(cls.getPrivFields(), cls, VertType.FIELD, false);
	}
	
	/** Helper method to add vertexes to class/interface */
	private void addVertices(HashMap<String, Vertex.ValueType> mappings, 
			IFace dest, VertType vertexType, boolean isPublic) throws InvalidGrammarException{
		for (String name : mappings.keySet()){
			Vertex.ValueType type = mappings.get(name);
			dest.addVertex(createVertex(name, dest, type, vertexType, isPublic), name);
		}
	}
	
	/** Internal method to add a vertex to the graph */
	private Vertex createVertex(String attrib, IFace parent, Vertex.ValueType valType, 
			VertType verType, boolean isPub) throws InvalidGrammarException{
		String internalAttrib = stringMappings.createInternalRepFor(attrib, parent);
		Vertex newVert = new Vertex(internalAttrib, attrib, parent, valType, verType, isPub);
		if (vertices.containsKey(newVert)){
			System.err.println("Warning: Redundant attempt to add Vertex:" + newVert.toString());
		}
		else {
			vertices.put(newVert, newVert);
		}
		return newVert;
	}
	
	/** Method to set function src/dest to actual vertices */
	public void initClassFunctions(Class cls) throws InvalidGrammarException{
		for (Function func : cls.getFunctions()){
			try {
			
			
			// Parse destination vertex
			String dest = func.getStringDest();
			String parsedDest[] = parseAttribute(dest);
			if (parsedDest==null){
				AGEvaluator.badGrammar("Error: cannot parse destination string:" + dest);
			}
			IFace parent = parsedDest[0] == null ? cls : resolveChild(parsedDest[0], cls);
			Vertex destVert = parent.findVertexByExtName(parsedDest[1]);
			if (destVert==null){
				AGEvaluator.badGrammar("Error: cannot resolve vertex for " + parsedDest[1]);
			}
			func.setDestination(destVert);
			
			// Parse source vertices
			String[] srcs = func.getStringSrcs();
			if (srcs != null){ // since can have no-arg functions
				Vertex[] srcsVert = new Vertex[srcs.length];
				for (int i = 0; i < srcs.length; i++){
					String src = srcs[i];
					String parsedSrc[] = parseAttribute(src);
					if (parsedSrc==null){
						AGEvaluator.badGrammar("Error: cannot parse source string:" + src);
					}
					IFace srcParent = parsedSrc[0] == null ? cls : resolveChild(parsedSrc[0], cls);
					Vertex srcVert = srcParent.findVertexByExtName(parsedSrc[1]);
					if (srcVert==null){
						AGEvaluator.badGrammar("Error: cannot resolve vertex for " + parsedSrc[1]);
					}
					srcsVert[i] = srcVert;
				}
				func.setSources(srcsVert);
			}

			// create mapping in class
			cls.setFunctionMapping(func, destVert);
			if (!func.hasArgs()){
				cls.addDefinition(destVert); // otherwise will be dropped in algo
			}
			} catch (InvalidGrammarException e) {
				System.err.print("Err on " + cls.getName() + "\n " + func.getStringDest() + " := f(");
				for (String s : func.getStringSrcs()) {
					System.err.print("  " + s);
				}
				System.err.println(" )");
				throw e;
			}
		}
	}

	/** Method to add direct edges to the graph */
	private void addEdgesToGraph(Class cls) throws InvalidGrammarException{
		HashMap<String, ArrayList<String>> abstractEdges = cls.getMappings();
		for (String receiver : abstractEdges.keySet()){
			ArrayList<String> strLst = abstractEdges.get(receiver);
			for (String args : strLst){
				// parse out key and values
				String from[] = parseAttribute(args);
				String to[] = parseAttribute(receiver);
				if (from == null || to == null){
					AGEvaluator.badGrammar("Error: Attributes could not be parsed for " + args);
				}
				IFace sourceParent = from[0] == null ? cls : resolveChild(from[0], cls);
				IFace destParent = to[0] == null ? cls : resolveChild(to[0], cls);
				Vertex source = sourceParent.findVertexByExtName(from[1]);
				Vertex dest = destParent.findVertexByExtName(to[1]);
				if (!isFtl) {
					if (source.getParentType() == ClassType.INTERFACE && dest.getParentType() == ClassType.INTERFACE){
						AGEvaluator.badGrammar("Error: Class is not allowed to define edges between child attributes: in class " + cls.getName() + ", assignment to " + dest.getParent() + "@" + dest.getExtVar());
					}
				}
				addEdge(source, dest, EdgeType.DIRECT);
				cls.addDefinition(dest);
			}
		}
	}
	
	/** Verifies that attribute assignments are consistent between classes and interfaces */
	private void verifySingleAssignment() throws InvalidGrammarException{
		for (Class cls : classes){
			verifySingleAssignment(cls);
		}
	}
	
	/** Top-down check to ensure that child does not assign to anything that parent assigns to  */
	private void verifySingleAssignment(Class cls) throws InvalidGrammarException{
		for (Function func : cls.getFunctions()){
			Vertex dest = func.getDestination();
			if (dest.getParentType() == ClassType.INTERFACE){
				IFace childIface = dest.getParent();
				String assignInto = func.getDestination().getExtVar();
				for (Class childCls : childIface.getImplementingClasses()){
					if (childCls.hasDefinitionFor(childCls.findVertexByExtName(assignInto))){
						//AGEvaluator.badGrammar("Error: Single assignment attribute violated in class " + cls.getName() + ": attrib " +  childCls.getName() + "@" + dest.myExtVar + " may be assigned from an implementing class of " + childCls.getName());
						System.err.println("Error: Single assignment attribute violated in class " + cls.getName() + ": attrib " +  childCls.getName() + "@" + dest.myExtVar + " may be assigned from an implementing class of " + childCls.getName());
					}
				}
			}
		}
	}

	/** Internal method adding an edge to the graph */
	private void addEdge(Vertex source, Vertex dest, EdgeType type) throws InvalidGrammarException{
		if (dest.isVertexType(VertType.FIELD)){
			AGEvaluator.badGrammar("Error: field cannot be set to an attribute!");
			return;
		}
		if (source == null || dest == null){
			return;
		}
		else {
			if (edges.containsKey(source)){
				if (!edges.get(source).containsKey(dest)){
					edges.get(source).put(dest, type);
				}
			}
			else {
				HashMap<Vertex, EdgeType> newMap = new HashMap<Vertex, EdgeType>();
				newMap.put(dest, type);
				edges.put(source, newMap);
			}
		}
	}

	/** Internal method to retrieve child interface from name */
	private IFace resolveChild(String childName, Class origin) throws InvalidGrammarException{
		if (origin.hasChildName(childName))
			return origin.getChildByName(childName);
		else {
			AGEvaluator.badGrammar("Error: Class " + origin.getName() + " does not have a child of type " + childName);
			return null;
		}
	}

	/** Internal method to retrieve a Vertex from parameters */
	private Vertex retrieveVertex(String val, IFace parent, VertType type) throws InvalidGrammarException{
		Vertex testVertex = new Vertex(val, val, parent, Vertex.ValueType.STRING, type, true);
		if (!vertices.containsKey(testVertex)){
			AGEvaluator.badGrammar("Error: cannot find vertex " + parent.getName() + "@" + val);
			return null;
		}
		else {
			return vertices.get(testVertex);
		}
	}

	/** Method to find edges within a class/interface and apply them to all corresponding interfaces/classes.
	 *  Exhaustively searches existing edges until fixed point. */
	private void applyInterEdges() throws InvalidGrammarException{
		boolean modified = true;
		while (modified){
			modified = false;
			HashMap<Vertex, HashMap<Vertex, EdgeType>> edgeCopy = deepCopy(edges);
			for (Vertex source : edgeCopy.keySet()){
				IFace parent = source.getParent();
				for (Vertex dest : edgeCopy.get(source).keySet()){
					if (parent == dest.getParent()){ // an edge within a class or interface
						if (parent.isType(ClassType.INTERFACE)){ // need to apply to all applying classes
							modified |= addEdgeInterfaceToClasses(parent, source, dest);
						}
						else { // is a class, check to make sure interface has edge
							modified |= addEdgeClassToInterface((Class) parent, source, dest);
						}
					}
				}
			}
		}
	}
	
	/** Internal method to create a deeper copy of the edges */
	@SuppressWarnings("unchecked")
	private HashMap<Vertex, HashMap<Vertex, EdgeType>> deepCopy (HashMap<Vertex, HashMap<Vertex, EdgeType>> source){
		HashMap<Vertex, HashMap<Vertex, EdgeType>> returning = new HashMap<Vertex, HashMap<Vertex, EdgeType>>();
		for (Vertex key : source.keySet()){
			HashMap<Vertex, EdgeType> newMap = (HashMap<Vertex, EdgeType>) source.get(key).clone();
			returning.put(key, newMap);
		}
		return returning;
	}

	/** Internal method to apply the result of interface edges back to classes. Returns true if edges were modified. */
	private boolean addEdgeInterfaceToClasses(IFace parent, Vertex sourceVert, Vertex destVert) throws InvalidGrammarException{
		boolean returning = false;
		for (Class cls : parent.getImplementingClasses()){
			Vertex source = retrieveVertex(sourceVert.getVar(), cls, VertType.ATTRIB);
			Vertex dest = retrieveVertex(destVert.getVar(), cls, VertType.ATTRIB);
			HashMap<Vertex, EdgeType> soFar = edges.get(source);
			if (soFar != null){
				if (!soFar.keySet().contains(dest)){
					soFar.put(dest, EdgeType.INDIRECT);
					returning = true;
				}
			}
			else {
				HashMap<Vertex, EdgeType> newMap = new HashMap<Vertex, EdgeType>();
				newMap.put(dest, EdgeType.INDIRECT);
				edges.put(source, newMap);
			}
		}
		return returning;
	}

	/** Internal method to apply the result of class edges to interfaces. Returns true if edges were modified. */
	private boolean addEdgeClassToInterface(Class origin, Vertex sourceVert, Vertex destVert) throws InvalidGrammarException{
		if (sourceVert.isVertexType(VertType.FIELD)){
			return false; // don't need to add if source is a field
		}
		if (!sourceVert.isPublic() || !destVert.isPublic()){
			return false; // don't add if attribute is private
		}
		Vertex source = origin.getInterfaceVertexForAttrib(sourceVert.getExtVar());
		Vertex dest = origin.getInterfaceVertexForAttrib(destVert.getExtVar());
		
		// Currently disallow edges between different interfaces
		if (!source.getParent().getName().equals(dest.getParent().getName())){ 
			AGEvaluator.badGrammar("Error: Class " + origin.getName() + " attempted to create edge " + 
					sourceVert.getExtVar() + " to " + destVert.getExtVar() + "which uses different interfaces");
		}
		
		if (edges.containsKey(source)){
			HashMap<Vertex, EdgeType> mapping = edges.get(source);
			if (mapping.keySet().contains(dest)){
				return false;
			}
			else {
				mapping.put(dest, EdgeType.INDIRECT);
			}
		}
		else {
			HashMap<Vertex, EdgeType> newMap = new HashMap<Vertex, EdgeType>();
			newMap.put(dest, EdgeType.INDIRECT);
			edges.put(source, newMap);
		}
		IFace parent = source.getParent();
		if (parent.getName().equals(dest.getParent().getName())){ // same interface... must propagate back
			addEdgeInterfaceToClasses(parent, source, dest);
		}
		return true;
	}

	/** Method to calculate transitive closure of subgraphs.
	 *  Currently uses a naive, unbounded algorithm:
	 *  For each edge in a class, traverse edges completely, if reach an edge in the class at any point, add indirect edge.
	 *  Repeat until no edges are added in one entire pass over the graph */
	private void addTransitiveEdges() throws InvalidGrammarException{
		boolean modified = true;

		// loop until no changes in graph
		while (modified){
			modified = false;
			for (Class cls : classes){
				for (Vertex vert : cls.getVertices()){
					modified |= traverseAddEdge(vert);
				}
			}
			for (IFace iface : interfaces){
				for (Vertex vert : iface.getVertices()){
					modified |= traverseAddEdge(vert);
				}
			}
		}
	}

	/** Internal method that adds any missing indirect edges between vertices in the class/interface through 
	 *  exhaustively traversing edges from Vertex. Immediately terminates if a cycle is detected. */
	private boolean traverseAddEdge(Vertex vert) throws InvalidGrammarException{
		boolean returning = false;
		IFace source = vert.getParent();
		boolean isClass = false;
		if (checkClass(source) != null){
			isClass = true;
		}
		HashMap<Vertex, EdgeType> currentEdges = edges.get(vert);
		if (currentEdges == null){
			return false;  // no work to be done
		}
		HashSet<Vertex> visited = new HashSet<Vertex>();
		ArrayList<Vertex> fringe = setToList(currentEdges.keySet());
		while (!fringe.isEmpty()){
			Vertex current = fringe.remove(0);
			if (current == vert){
				AGEvaluator.badGrammar("Error: Cycle detected. Multiple visits to " + vert.toString());
			}
			if (visited.contains(current))
				continue;
			else {
				visited.add(current);
				if (current.getParent() == source){
					// need to check edge...
					if (!currentEdges.keySet().contains(current)){
						returning = true;
						currentEdges.put(current, EdgeType.INDIRECT); // add an indirect edge
						// now propagate throughout
						if (isClass){
							addEdgeClassToInterface(checkClass(source), vert, current); 
						}
						else {
							addEdgeInterfaceToClasses(source, vert, current);
						}
					}
				}
				HashMap<Vertex, EdgeType> toAdd = edges.get(current);
				if (toAdd != null){
					for (Vertex addingVert : toAdd.keySet()){
						fringe.add(addingVert);
					}
				}
			}
		}
		return returning;
	}
	
	/** Internal method that converts a Set into an ArrayList */
	private ArrayList<Vertex> setToList(Set<Vertex> st){
		ArrayList<Vertex> returning = new ArrayList<Vertex>();
		for (Vertex vert : st){
			returning.add(vert);
		}
		return returning;
	}

	/** Safe conversion to Class */
	private Class checkClass(IFace cls) throws InvalidGrammarException{
		Class a = new Class(null);
		if (cls.getClass() == a.getClass()){
			return (Class) cls;
		}
		else {
			return null;
		}
	}

	/** Determines proper subgraph orderings by topological sort, runs to fixed point */
	private void topoSort() throws InvalidGrammarException{
		for (Class cls : classes){
			orderClassGraph(cls);
		}
	}

	/** Chooses final ordering of classes and determines child call order and interface kontracts */
	private void orderClassGraph(Class cls) throws InvalidGrammarException{
		
		// sources[0] = topDown, sources[1] = bottomUp, sources[2] = horizontal
		HashMap<Vertex, HashMap<Vertex, EdgeType>> clsGraph = getClassGraph(cls);
		ArrayList<ArrayList<Vertex>> readyVerts = findReady(cls);
		readyVerts.add(new ArrayList<Vertex>());
		
		// init todo
		ArrayList<Vertex> clsTodo = new ArrayList<Vertex>();
		clsTodo.addAll(cls.getInterface().getVertices());
		HashMap<IFace, ArrayList<Vertex>> childTodo = new HashMap<IFace, ArrayList<Vertex>>();
		for (IFace childIFace : cls.getChildrenTypes()){
			ArrayList<Vertex> todo = new ArrayList<Vertex>();
			todo.addAll(childIFace.getVertices());
			childTodo.put(childIFace, todo);
		}
		
		ArrayList<ArrayList<Vertex>> vertexPasses = new ArrayList<ArrayList<Vertex>>();
		ArrayList<Vertex> currentPass = new ArrayList<Vertex>();
		ArrayList<HashSet<IFace>> childCallOrder = new ArrayList<HashSet<IFace>>();
		HashSet<Vertex> visited = new HashSet<Vertex>();
		HashMap<Vertex, Integer> toDelay = new HashMap<Vertex, Integer>();

		boolean isTopDown = true;
		int index = 0;
		int classPassNumber = 1;
		boolean isFirst = true;
		
		while (!allEmpty(readyVerts)){
			if (readyVerts.get(index).isEmpty() && readyVerts.get(2).isEmpty()){ // empty, flip traversal type
				isTopDown = !isTopDown;
				index = isTopDown ? 0 : 1;
				if (!isTopDown){ // schedule child call
					if (isFirst){
						isFirst = false;
					}
					else {
						HashMap<Vertex, Integer> delay = determineKontracts(cls, currentPass, classPassNumber);
						toDelay.putAll(delay);
						HashSet<IFace> callChildren = determineChildCalls(currentPass, cls);
						childCallOrder.add(callChildren);
						if (!callChildren.isEmpty()){
							classPassNumber ++;
						}
					}
					vertexPasses.add(currentPass);
					currentPass = new ArrayList<Vertex>();
				}
			}
			
			// choose source
			Vertex source = readyVerts.get(2).isEmpty() ? readyVerts.get(index).remove(0) : readyVerts.get(2).remove(0);
			currentPass.add(source);
			visited.add(source);
			if (source.isPublic()){
				if (source.getParentType() == ClassType.CLASS){
					clsTodo.remove(getIFaceVersion(source));
				}
				else {
					childTodo.get(source.getParent()).remove(source);
				}
			}
			
			// potentially need to add to readyVerts
			if (clsGraph.containsKey(source)){
				for (Vertex dest : clsGraph.get(source).keySet()){
					if (visited.contains(dest)){
						AGEvaluator.badGrammar("Error: Cycle detected with vertex " + dest.toString());
					}
					if (isReady(dest, visited, clsGraph)){
						int insertIndex = resolveTraversalType(dest, clsGraph);
						readyVerts.get(insertIndex).add(dest);
					}
				}
			}
			if (source.isPublic()){
				addTopoEdges(source, clsTodo, childTodo);
			}
		}
		 // schedule child call
		HashMap<Vertex, Integer> delay = determineKontracts(cls, currentPass, classPassNumber);
		toDelay.putAll(delay);
		HashSet<IFace> callChildren = determineChildCalls(currentPass, cls);
		childCallOrder.add(callChildren);
		if (!callChildren.isEmpty()){
			classPassNumber ++;
		}	
		if (!currentPass.isEmpty()){
			vertexPasses.add(currentPass);
		}
		cls.setVertexPasses(vertexPasses);
		cls.setChildCallOrder(childCallOrder);
		
		boolean okay = true;
		if (!clsTodo.isEmpty()){
			okay = false;
		}
		for (IFace iface : childTodo.keySet()){
			if (!childTodo.get(iface).isEmpty()){
				okay = false;
				break;
			}
		}
		if (!okay){
			AGEvaluator.badGrammar("Error: unschedulable grammar");
		}
		if (toDelay.size() > 0){ // children aren't ready, need to insert more calls
			for (Vertex vert : toDelay.keySet()){
				delayVertTill(cls, vert, toDelay.get(vert));
			}
		}
	}
	
	/** Creates a subgraph including a class and interface children */
	private HashMap<Vertex, HashMap<Vertex, EdgeType>> getClassGraph(Class cls){
		HashMap<Vertex, HashMap<Vertex, EdgeType>> myClassEdges = new HashMap<Vertex, HashMap<Vertex, EdgeType>>();
		HashSet<Vertex> visited = new HashSet<Vertex>();
		ArrayList<Vertex> toVisit = cls.getCopyOfVertices();
		for (IFace iface : cls.getChildrenTypes()){
			ArrayList<Vertex> toCopy = iface.getCopyOfVertices();
			toVisit.addAll(toCopy);
		}
		while(!toVisit.isEmpty()){
			Vertex vert = toVisit.remove(0);
			if (visited.contains(vert)){
				continue;
			}
			else {
				visited.add(vert);
				HashMap<Vertex, EdgeType> outgoing = edges.get(vert);
				if (outgoing != null){
					for (Vertex outEdge : outgoing.keySet()){
						if (!isRelative(outEdge, cls)){
							continue;
						}
						toVisit.add(outEdge);
						if (myClassEdges.containsKey(vert)){
							myClassEdges.get(vert).put(outEdge, outgoing.get(outEdge));
						}
						else {
							HashMap<Vertex, EdgeType> newMap = new HashMap<Vertex, EdgeType>();
							newMap.put(outEdge, outgoing.get(outEdge));
							myClassEdges.put(vert, newMap);
						}
					}
				}
			}
		}
		return myClassEdges;
	}
	
	/** Method to determine whether vert belongs in subgraph src.
	 *  A vertex belongs if it is the same type of src or an interface/child interface of src. */
	private boolean isRelative(Vertex vert, Class src){
		IFace vertParent = vert.getParent();
		if (vertParent == src)
			return true;
		if (src.hasChildType(vertParent)){
			return true;
		}
		if (src.hasInterface(vertParent)){
			return true;
		}
		return false;
	}
	
	/** Method to find all classgraph sources on demand */
	@SuppressWarnings("unchecked")
	private ArrayList<ArrayList<Vertex>> findReady(Class cls){
		// Determine all source vertices in the graph, O(|E|)
		HashMap<IFace, ArrayList<Vertex>> sources = new HashMap<IFace, ArrayList<Vertex>>();  // Maps all sources to all classes/interfaces
		ArrayList<Vertex> toAdd = cls.getCopyOfVertices();
		sources.put(cls, toAdd);
		for (IFace iface : cls.getChildrenTypes()){
			ArrayList<Vertex> toCopy = iface.getCopyOfVertices();
			sources.put(iface, toCopy);
		}
		for (Vertex source : edges.keySet()){
			if (edges.containsKey(source)){
				HashMap<Vertex, EdgeType> innerMap = edges.get(source);
				for (Vertex dest : innerMap.keySet()){
					ArrayList<Vertex> clsSource = sources.get(dest.getParent());
					if (clsSource != null){
						clsSource.remove(dest);
					}
				}
			}
		}
		// now sort the remaining interface vertices so that pubFields are first
		for (IFace iface : cls.getChildrenTypes()){
			ArrayList<Vertex> intSource = sources.get(iface);
			ArrayList<Vertex> toIter = (ArrayList<Vertex>) intSource.clone();
			for (Vertex vert : toIter){
				if (vert.isVertexType(VertType.FIELD) && vert.isPublic()){
					intSource.remove(vert);
					intSource.add(0, vert);
				}
			}
		}

		ArrayList<ArrayList<Vertex>> clzSources = new ArrayList<ArrayList<Vertex>>();
		clzSources.add(0, sources.get(cls)); // 0 index for sources in class
		clzSources.add(1, new ArrayList<Vertex>()); // 1 index for sources in child interface
		for (IFace iface : cls.getChildrenTypes()){
			clzSources.get(1).addAll(sources.get(iface));
		}
		return clzSources;
	}
	
	private boolean allEmpty(ArrayList<ArrayList<Vertex>> deepList){
		for (ArrayList<Vertex> lst : deepList){
			if (!lst.isEmpty()){
				return false;
			}
		}
		return true;
	}
	
	/** Helper to schedule child calls and child interface kontracts */
	private HashMap<Vertex, Integer> determineKontracts(Class cls, 
			ArrayList<Vertex> pass, int retNum) throws InvalidGrammarException{
		HashMap<Vertex, Integer> delayBy = new HashMap<Vertex, Integer>();
		for (Vertex vert : pass){
			if (vert.isVertexType(VertType.ATTRIB) && vert.getParentType() == ClassType.INTERFACE){
				if (!cls.hasDefinitionFor(vert) && needKontract(vert, cls)){
					int delayVal = assignKontract(vert, cls, retNum);
					if (delayVal > -1){
						delayBy.put(vert, delayVal);
					}
				}
			}
		}
		return delayBy;
	}
	
	/** Internal method to see if need kontract for a vertex */
	private boolean needKontract(Vertex vert, Class cls){
		HashMap<Vertex, HashMap<Vertex, EdgeType>> clsEdges = getClassGraph(cls);
		if (vert.getParentType() == ClassType.INTERFACE && vert.isVertexType(VertType.ATTRIB)){// need child to provide this
			// only make kontract if node directly needed (not a source of a source)
			if (clsEdges.containsKey(vert)){
				HashMap<Vertex, EdgeType> srzOut = clsEdges.get(vert);
				for (Vertex srz : srzOut.keySet()){
					if (srzOut.get(srz) == EdgeType.DIRECT && srz.getParentType() == ClassType.CLASS){
						return true;
					}
				}
			}
		}
		return false;
	}
	
	private int assignKontract(Vertex vert, Class cls, int retNum) throws InvalidGrammarException{
		if (vert.isKontracted()){
			HashMap<Integer, HashMap<Vertex, HashSet<Class>>> parKontracts = vert.getParent().getKontracts();
			// check existing kontracts for inconsistencies
			int visitNum = 0;
			while (visitNum < retNum){
				if (parKontracts.containsKey(visitNum)){
					if (parKontracts.get(visitNum).containsKey(vert)){
						if (!parKontracts.containsKey(retNum)){
							HashSet<Class> enforcingClasses = new HashSet<Class>();
							HashMap<Vertex, HashSet<Class>> visitKontracts = new HashMap<Vertex, HashSet<Class>>();
							visitKontracts.put(vert, enforcingClasses);
							parKontracts.put(retNum, visitKontracts);
						}
						HashSet<Class> toAdd = parKontracts.get(retNum).get(vert);
						for (Class delayClass : parKontracts.get(visitNum).get(vert)){
							toAdd.add(delayClass);
							delayVertTill(delayClass, vert, retNum);
						}
						parKontracts.get(visitNum).remove(vert);
						break; 
					}
				}
				visitNum ++;
			}
			if (parKontracts.containsKey(retNum) && parKontracts.get(retNum).containsKey(vert)){
				vert.addKontract(retNum, cls);
				return -1;
			}
			visitNum = retNum + 1;
			int maxVisit = getMax(parKontracts.keySet());
			while (visitNum < maxVisit){
				if (parKontracts.containsKey(visitNum) && parKontracts.get(visitNum).containsKey(vert)){
					vert.addKontract(visitNum, cls);
					return visitNum;
				}
				visitNum++;
			}
			return -1;
		}
		else {
			vert.addKontract(retNum, cls);
			return -1;
		}
	}
	
	private int getMax(Set<Integer> vals){
		int maxSoFar = -1;
		for (int val : vals){
			if (val > maxSoFar){
				maxSoFar = val;
			}
		}
		return maxSoFar;
	}
	
	/** walk visit sequence until vert encountered. Insert additional visits untilRetNum reached */
	private void delayVertTill(Class cls, Vertex vert, int retNum){
		IFace target = vert.getParent();
		int retVal = 1;
		ArrayList<ArrayList<Vertex>> passes = cls.getVertexPasses();
		ArrayList<HashSet<IFace>> childOrderings = cls.getChildCallOrder();
		for (int passNum = 1; passNum < passes.size() && passNum <= retNum; passNum++){
			ArrayList<Vertex> pass = passes.get(passNum);
			if (pass.contains(vert)){
				int counter = 0;
				ArrayList<Vertex> prev = new ArrayList<Vertex>();
				ArrayList<Vertex> post = new ArrayList<Vertex>();
				while (counter < passes.size()){
					Vertex current = pass.get(counter);
					if (current == vert){
						break;
					}
					else {
						prev.add(current);
					}
					counter ++;
				}
				for (int i = counter; i < pass.size(); i++){
					post.add(pass.get(i));
				}
				HashSet<IFace> prevCall = determineChildCalls(prev, cls);
				prevCall.add(target);
				HashSet<IFace> postCall = determineChildCalls(post, cls);
				postCall.add(target);
				
				passes.remove(passNum);
				passes.add(passNum, prev);
				childOrderings.remove(passNum - 1);
				childOrderings.add(passNum - 1, prevCall);
				passNum ++;
				while (passNum < retNum + 1){
					HashSet<IFace> toCall = new HashSet<IFace>();
					toCall.add(target);
					passes.add(passNum, new ArrayList<Vertex>());
					childOrderings.add(passNum - 1, toCall);
					passNum++;
				}
				passes.add(retNum + 1, post);
				childOrderings.add(retNum, postCall);
				return;
			}
			else {
				if (childOrderings.get(passNum -1).contains(target)){
					retVal ++;
				}
			}
		}
	}
	
	private HashSet<IFace> determineChildCalls(ArrayList<Vertex> pass, Class cls){
		HashSet<IFace> childrenToCall = new HashSet<IFace>();
		for (Vertex vert : pass){
			if (vert.isVertexType(VertType.ATTRIB) && vert.getParentType() == ClassType.INTERFACE){
				if (!cls.hasDefinitionFor(vert) && needKontract(vert, cls)){
					IFace childInterface = vert.getParent();
					if (!childrenToCall.contains(childInterface)){
						childrenToCall.add(childInterface);
					}
				}
			}
		}
		return childrenToCall;
	}
	
	/** Returns true if no dest has no incoming edges from vertices other than those in visited */
	private boolean isReady(Vertex dest, HashSet<Vertex> visited, 
			HashMap<Vertex, HashMap<Vertex, EdgeType>> validEdges){
		for (Vertex key : validEdges.keySet()){
			if (!visited.contains(key)){
				if (validEdges.get(key).containsKey(dest)){
					return false;
				}
			}
		}
		return true;
	}
	
	/** Returns an integer representing the type of the combined hyper-edge */
	private int resolveTraversalType(Vertex dest, HashMap<Vertex, HashMap<Vertex, EdgeType>> clsEdges){
		ArrayList<Vertex> srcEdges = getDirectSourceEdges(dest, clsEdges);
		int hyperEdgeType = 2; // init to weakest
		if (srcEdges.isEmpty()){ // no direct incoming edges
			return (dest.getParentType() == ClassType.CLASS) ? 0 : 1;
		}
		else {
			for (Vertex src : srcEdges){
				int edgeType = getEdgeType(src.getParentType(), dest.getParentType());
				assert edgeType != -1;
				hyperEdgeType = resolveTraversalEdges(hyperEdgeType, edgeType);
			}
			return hyperEdgeType;
		}
	}

	private ArrayList<Vertex> getDirectSourceEdges(Vertex dest, HashMap<Vertex, HashMap<Vertex, EdgeType>> clsEdges){
		ArrayList<Vertex> returning = new ArrayList<Vertex>();
		for (Vertex src : clsEdges.keySet()){
			HashMap<Vertex, EdgeType> dests = clsEdges.get(src);
			if (dests.containsKey(dest)){
				if (dests.get(dest) == EdgeType.DIRECT){
					returning.add(src);
				}
			}
		}
		return returning;
	}
	
	/** Returns an integer representing the edge type.
	 *  0 = top-down, 1 = bottom-up, 2 = horizontal.
	 *  Returns -1 on illegal edge detection.
	 */
	private int getEdgeType(ClassType srcType, ClassType destType){
		if (srcType == ClassType.CLASS && destType == ClassType.INTERFACE){ //top-down
			return 0;
		}
		else if (srcType == ClassType.INTERFACE && destType == ClassType.CLASS){ //bottom-up
			return 1;
		}
		else if (srcType == ClassType.CLASS && destType == ClassType.CLASS){ //horizontal
			return 2;
		}
		else { // illegal for Interface->interface edge
			return -1;
		}
	}
	
	private int resolveTraversalEdges(int type1, int type2){
		if (type1 + type2 == 1){ //one top down one bottom up
			return -1;
		}
		else if (type1 == 0 || type2 == 0){
			return 0;
		}
		else if (type1 == 1 || type2 == 1){
			return 1;
		}
		else { // both must be 2
			return 2;
		}
	}
	
	/** Helper method to retrieve interface version of vert, returns vert if already an iface Vert */
	private Vertex getIFaceVersion(Vertex vert) throws InvalidGrammarException{
		Vertex returning = null;
		if (vert.getParentType() == ClassType.CLASS){
			returning = vert.getParent().getInterface().findVertexByExtName(vert.getExtVar());
			if (returning == null){
				AGEvaluator.badGrammar("Could not resolve interface version of vertex " + vert.toString());
			}
			return returning;
		}
		assert(vert.getParentType() == ClassType.INTERFACE);
		return vert;
	}

	/** Helper method to add an edge from source to all vertex in todo of the same interface */
	private void addTopoEdges(Vertex source, ArrayList<Vertex> clsTodo, 
			HashMap<IFace, ArrayList<Vertex>> childTodo) throws InvalidGrammarException{
		ArrayList<Vertex> iDests = null;
		if (source.getParentType() == ClassType.CLASS){
			iDests = clsTodo;
		}
		else {
			assert(source.getParentType() == ClassType.INTERFACE);
			iDests = childTodo.get(source.getParent());
		}
		assert(iDests != null);
		Vertex iSource = getIFaceVersion(source);
		for (Vertex dest : iDests){
			if (dest.isVertexType(VertType.ATTRIB)){
				addEdge(iSource, dest, EdgeType.INDIRECT);
				addEdgeInterfaceToClasses(iSource.getParent(), iSource, dest);
			}
		}
	}
	
	/** Internal method that creates visitors from passes/kontracts/child_orderings */
	private void createVisitors() throws InvalidGrammarException{
		HashMap<Class, HashMap<IFace, Integer>> numCallsByClass = new HashMap<Class, HashMap<IFace, Integer>>();
		for (Class cls : classes){
			numCallsByClass.put(cls, createVisitorsFor(cls));
		}
		padVisitors();
		verifyVisitNums(numCallsByClass);
	}
	
	/** Internal method to create the visitors for a particular class */
	private HashMap<IFace, Integer> createVisitorsFor(Class cls) throws InvalidGrammarException{
		// Set up vars
		ArrayList<ArrayList<Vertex>> myPasses = stitchAndFilterPasses(cls);
		HashMap<Integer, HashMap<Vertex, HashSet<Class>>> myKontracts = cls.getKontracts();
		ArrayList<HashSet<IFace>> myChildOrderings = cls.getChildCallOrder();
		int nextParentPass = 1;
		
		// Set up Kontracts
		boolean hasKontracts;
		hasKontracts = myKontracts.containsKey(nextParentPass);
		ArrayList<Vertex> passKontracts = hasKontracts ? setToList(myKontracts.get(nextParentPass).keySet()) : new ArrayList<Vertex>();
		
		// Set up child tracking to get visit numbers to call
		HashMap<IFace, Integer> currentCallNum = new HashMap<IFace, Integer>();
		for (IFace childIFace : cls.getChildrenTypes()){
			currentCallNum.put(childIFace, 0);
		}
		
		// Init visitors
		ArrayList<ArrayList<EvalStep>> myVisitors = new ArrayList<ArrayList<EvalStep>>();
		ArrayList<EvalStep> currentVisitor = new ArrayList<EvalStep>();
		
		for (int currPassCouter = 0; currPassCouter < myPasses.size(); currPassCouter++){
			ArrayList<Vertex> currentPass = myPasses.get(currPassCouter);

			// create EvalStep for each Vertex in pass
			for (Vertex currVertex : currentPass){
					
				// check if visitor ready to return to parent
				if (hasKontracts && passKontracts.isEmpty()){ 
					myVisitors.add(currentVisitor);
					currentVisitor = new ArrayList<EvalStep>();
					nextParentPass++;
					// init kontracts for next visitor
					hasKontracts = myKontracts.containsKey(nextParentPass);
					if (hasKontracts){
						passKontracts = setToList(myKontracts.get(nextParentPass).keySet());
					}
				}
					
				if (currVertex.isPublic()){
					Vertex ifaceVert = retrieveVertex(currVertex.getVar(), currVertex.getParent().getInterface(), currVertex.getVertexType());
					if (passKontracts.contains(ifaceVert)){
						passKontracts.remove(ifaceVert);
					}
				}
				if (cls.hasFunctionFor(currVertex)){
					HashSet<Function> funcs = cls.getFunctionsFor(currVertex);
					EvalStep eval;
					for (Function func : funcs){
						if (func.getType() == Function.FuncType.APPLY){
							eval = new EvalStepApply(cls, func);
						}
						else {
							eval = new EvalStepSet(cls, func);
						}
						currentVisitor.add(eval);
					}
				}
				else {
					assert false; // should never reach
				}
			}
			
			// check if visitor ready to return to parent
			if (hasKontracts && passKontracts.isEmpty()){ 
				myVisitors.add(currentVisitor);
				currentVisitor = new ArrayList<EvalStep>();
				nextParentPass++;
				// init kontracts for next visitor
				hasKontracts = myKontracts.containsKey(nextParentPass);
				if (hasKontracts){
					passKontracts = setToList(myKontracts.get(nextParentPass).keySet());
				}
			}
			
			if (cls.hasChildren()){
				// finished all vertices in pass, time to call children
				if (currPassCouter < myChildOrderings.size()){
					HashSet<IFace> toCall = myChildOrderings.get(currPassCouter);
					for (IFace child : toCall){
						int visitVal = currentCallNum.get(child);
						EvalStepCall callEval = new EvalStepCall(cls, child, visitVal);
						currentVisitor.add(callEval);
						currentCallNum.put(child, visitVal + 1);
					}
				}
			}
		}
		if (!currentVisitor.isEmpty()){
			myVisitors.add(currentVisitor);
		}
		cls.setVisitors(myVisitors);
		cls.getInterface().reportNumVisits(myVisitors.size());
		reportVisits(currentCallNum);
		return currentCallNum;
	}
	
	/** removes non-definition vertices */
	private ArrayList<ArrayList<Vertex>> stitchAndFilterPasses(Class cls){
		ArrayList<ArrayList<Vertex>> passes = cls.getVertexPasses();
		ArrayList<ArrayList<Vertex>> returning = new ArrayList<ArrayList<Vertex>>();
		ArrayList<Vertex> localVisit = new ArrayList<Vertex>();
		for (ArrayList<Vertex> pass : passes){
			localVisit.addAll(filter(cls, pass));
			returning.add(localVisit);
			localVisit = new ArrayList<Vertex>();
		}
		return returning;
	}
	
	/** Method to remove vertices without definitions */
	private ArrayList<Vertex> filter(Class cls, ArrayList<Vertex> pass){
		ArrayList<Vertex> returning = new ArrayList<Vertex>();
		for (Vertex vert : pass){
			if (cls.hasDefinitionFor(vert)){
				returning.add(vert);
			}
		}
		return returning;
	}
	
	/** Helper method to track number of visits required by an interface */
	private void reportVisits(HashMap<IFace, Integer> numVisits){
		for (IFace childIFace : numVisits.keySet()){
			int myVisits = numVisits.get(childIFace);
			childIFace.reportNumVisits(myVisits);
		}
	}
	
	/** Equalizes numbers of visits by interface. 
	 * Different classes may have different numbers of total visits, but if they obey the same interface they need equal numbers of visits.
	 */
	private void padVisitors(){
		for (Class cls : classes){
			padVisitorsFor(cls);
		}
	}
	
	/** Helper to ensure enough calls to children */
	private void verifyVisitNums(HashMap<Class, HashMap<IFace, Integer>> numCallsByClass){
		for (Class cls : numCallsByClass.keySet()){
			ArrayList<ArrayList<EvalStep>> visits = cls.getVisitors();
			if (visits.size() == 0) continue;
			HashMap<IFace, Integer> numCallsMade = numCallsByClass.get(cls);
			boolean modified = true;
			while (modified){
				modified = false;
				for (IFace iface : numCallsMade.keySet()){
					int numMade = numCallsMade.get(iface);
					int numNeeded = iface.getNumVisits();
					if (numMade < numNeeded){
						visits.get(visits.size() - 1).add(new EvalStepCall(cls, iface, numMade));
						numCallsMade.put(iface, numMade + 1);
						modified = true;
					}
				}
			}
		}
	}
	
	/** Pads visitors for class with empty visits if necessary */
	private void padVisitorsFor(Class cls){
		int neededVisits = cls.getInterface().getNumVisits();
		ArrayList<ArrayList<EvalStep>> visitors = cls.getVisitors();
		int currNumVisits = visitors.size();
		while (currNumVisits < neededVisits){
			ArrayList<EvalStep> emptyVisit = new ArrayList<EvalStep>();
			visitors.add(emptyVisit);
			currNumVisits ++;
		}
	}
	
	// Given the dynamic traversal visitors, normalizes to inherited/synthesized pass visitors
	public void generateFTL() throws InvalidGrammarException{
		HashMap<Class, ArrayList<ArrayList<EvalStep>>> ftlVisits = new HashMap<Class, ArrayList<ArrayList<EvalStep>>>();
		for (Class cls : classes){
			ftlVisits.put(cls, normalizeVisits(cls));
		}
		conformVisits(ftlVisits);
		padVisits(ftlVisits);
		for (Class clz : classes){
			clz.setFTLVisits(ftlVisits.get(clz));
		}
	}
	
	// Internal algorithm to divide visits into inherit and synthesized passes
	/// O(#Attribs) runtime
	private ArrayList<ArrayList<EvalStep>> normalizeVisits(Class cls) throws InvalidGrammarException{
		ArrayList<ArrayList<EvalStep>> original = cls.getVisitors();
		if (original.size() == 1 && original.get(0).isEmpty()){
			return original;
		}
		ArrayList<ArrayList<EvalStep>> normalized = new ArrayList<ArrayList<EvalStep>>();
		boolean topDown = true;
		ArrayList<EvalStep> normalizedPass = new ArrayList<EvalStep>();
		for (ArrayList<EvalStep> pass : original){
			boolean inCall = false;
			for (EvalStep step : pass){
				if (step.myType == EvalType.CALL){
					if (inCall){
						continue;
					}
					else {
						normalized.add(normalizedPass);
						normalizedPass = new ArrayList<EvalStep>();
						topDown = false;
						inCall = true;
					}
				}
				else {
					if (inCall){
						inCall = false;
					}
					if (belongsInPass(step, topDown)){
						normalizedPass.add(step);
					}
					else {
						normalized.add(normalizedPass);
						normalizedPass = new ArrayList<EvalStep>();
						topDown = !topDown;
						normalizedPass.add(step);
					}
				}
			}
			normalized.add(normalizedPass);
			normalizedPass = new ArrayList<EvalStep>();
			topDown = !topDown;
		}
		trimEnd(normalized);
		return normalized;
	}
	
	// Returns whether the current step is legal in a given traversal
	private boolean belongsInPass(EvalStep step, boolean topDown) throws InvalidGrammarException{
		Function func = getFunction(step);
		Vertex[] srcs = func.getSources();
		Vertex dest = func.getDestination();
		boolean hasClassSources = false;
		boolean hasInterfaceSources = false;
		if (srcs == null){
			return true; // TODO: verify this for all case
		}
		for (Vertex vert : srcs){
			if (hasClassSources && hasInterfaceSources){
				break;
			}
			if (vert.getParentType() == ClassType.CLASS){
				hasClassSources = true;
			}
			else { //Interface
				hasInterfaceSources = true;
			}
		}
		boolean hasClassDest = (dest.getParentType() == ClassType.CLASS);
		if (hasClassSources && hasClassDest && !hasInterfaceSources){ // horizontal edges
			return true; // legal in all traversal types
		}
		else {
			if (hasInterfaceSources && hasClassDest){
				return (topDown == false); // bottom up
			}
			else if (hasClassSources && !hasClassDest && !hasInterfaceSources){
				return (topDown == true); // top down
			}
			else { // case to prevent endless loop in normalizeVisits
				AGEvaluator.badGrammar("Error: Illegal edge detected!");
				return false;
			}
		}
	}
	
	/** Helper method to retrieve the function for an EvalStep. Returns null if EvalStepCall */
	private Function getFunction(EvalStep step){
		if (step.getType() == EvalType.APPLY){
			return ((EvalStepApply) step).getFunction();
		}
		else if (step.getType() == EvalType.SET){
			return ((EvalStepSet) step).getFunction();
		}
		else {
			return null;
		}
	}
	
	/** Internal method to remove lagging empty visits */
	private void trimEnd(ArrayList<ArrayList<EvalStep>> visits){
		int end = visits.size() - 1;
		while (visits.get(end).isEmpty()){
			visits.remove(end);
			end --;
		}
	}
	
	/** Internal method that takes ftl visits and normalizing them through no op insertion.
	 *  Runs to fixed point, in each iteration some class's visitors will have additional no ops 
	 *  inserted until no additional no ops are needed globally.
	 */
	private void conformVisits(HashMap<Class, ArrayList<ArrayList<EvalStep>>> visits) throws InvalidGrammarException{
		int currentTraversal = 0;
		// lists all vertices that were computed previous to current traversal
		HashSet<Vertex> completed = new HashSet<Vertex>();
		for (Class clz : classes){
			for (Vertex vert : clz.getVertices()){
				if (vert.isVertexType(VertType.FIELD)){
					completed.add(vert);
					if (vert.isPublic()){
						completed.add(retrieveVertex(vert.getVar(), vert.getParent().getInterface(), VertType.FIELD));
					}
				}
			}
		}
		boolean changes = true;
		while (changes){
			
			// While finishes when currentTraversal > the longest needed class visit
			int maxNumTraversals = getMaxNumVisits(visits);
			if (currentTraversal > maxNumTraversals){
				break;
			}
			
			changes = false;
			HashSet<Vertex> currentComputing = new HashSet<Vertex>();
			for (Class cls : classes){
				ArrayList<ArrayList<EvalStep>> clsVisits = visits.get(cls);
				if (clsVisits.size() > currentTraversal){
					ArrayList<EvalStep> currentSteps = clsVisits.get(currentTraversal);
					for (EvalStep step : currentSteps){
						Vertex dest = getFunction(step).getDestination();
						currentComputing.add(dest);
						if (dest.isPublic()){
							if (dest.getParentType() == ClassType.CLASS){
								currentComputing.add(retrieveVertex(dest.getVar(), dest.getParent().getInterface(), dest.getVertexType()));
							}
							else { // Interface, need to find all implementing classes
								for (Class clas : dest.getParent().getImplementingClasses()){
									currentComputing.add(retrieveVertex(dest.getVar(), clas, dest.getVertexType()));
								}
							}
						}
					}
				}
			}
			
			for (Class claz : visits.keySet()){
				if (visits.get(claz).size() <= currentTraversal){
					continue;
				}
				else {
					ArrayList<ArrayList<EvalStep>> clazVisits = visits.get(claz);
					ArrayList<EvalStep> currentVisit = clazVisits.get(currentTraversal);
					for (EvalStep step : currentVisit){
						Function func = getFunction(step);
						Vertex[] srcs = func.getSources();
						if (srcs != null){
							for (Vertex src : srcs){
								if (completed.contains(src) | currentComputing.contains(src)){
									continue;
								}
								else {
									delayStepBy(step, currentTraversal + 1, currentTraversal, clazVisits);
									changes = true;
									break;
								}
							}
						}
						if (changes){
							break;
						}
					}
					if (changes){
						break;
					}
				}
			}
			
			if (!changes){ // done with currentTraversal
				completed.addAll(currentComputing);
				currentTraversal++;
				changes = true;
			}
		}
	}
	
	/** Internal method to retrieve the size of the longest visitor */
	private int getMaxNumVisits(HashMap<Class, ArrayList<ArrayList<EvalStep>>> visits){
		int maxNumVisit = -1;
		for (ArrayList<ArrayList<EvalStep>> visitor : visits.values()){
			int size = visitor.size();
			if (size > maxNumVisit){
				maxNumVisit = size;
			}
		}
		return maxNumVisit;
	}
	
	/** Helper method that inserts no ops to delay an EvalStep 
	 *  May move by more than (lastNeededTraversal - currentTraversal) 
	 *  if topdown/bottom up invariant is violated */
	private void delayStepBy(EvalStep step, int lastNeededTraversal, int currentTraversal, 
			ArrayList<ArrayList<EvalStep>> clsVisits) throws InvalidGrammarException{
		
		// Separate current pass into pre and rest
		ArrayList<EvalStep> currentPass = clsVisits.remove(currentTraversal);
		ArrayList<EvalStep> prev = new ArrayList<EvalStep>();
		ArrayList<EvalStep> rest = new ArrayList<EvalStep>();
		int counter = 0;
		while (counter < currentPass.size()){
			EvalStep currentStep = currentPass.get(counter);
			if (currentStep == step){
				break;
			}
			else {
				prev.add(currentStep);
			}
			counter ++;
		}
		for (int i = counter; i < currentPass.size(); i++){
			rest.add(currentPass.get(i));
		}
		
		boolean topDown = (lastNeededTraversal % 2 == 0);
		if (!belongsInPass(step, topDown)){
			lastNeededTraversal += 1;
		}
		clsVisits.add(currentTraversal, prev);
		currentTraversal++;
		while (currentTraversal < lastNeededTraversal){
			clsVisits.add(currentTraversal, new ArrayList<EvalStep>());
			currentTraversal++;
		}
		clsVisits.add(currentTraversal, rest);
	}
	
	/** Helper method to add ending no ops to class ftl visits */
	private void padVisits(HashMap<Class, ArrayList<ArrayList<EvalStep>>> ftlVisitors){
		int numVisits = getMaxNumVisits(ftlVisitors);
		for (Class cls : ftlVisitors.keySet()){
			ArrayList<ArrayList<EvalStep>> clsVisitors = ftlVisitors.get(cls);
			while (clsVisitors.size() < numVisits){
				clsVisitors.add(new ArrayList<EvalStep>());
			}
		}
	}
	
	/** Create a graphviz output */
	public GraphVizOutput makeDot(){
		return new GraphVizOutput(interfaces, classes, edges);
	}
}
