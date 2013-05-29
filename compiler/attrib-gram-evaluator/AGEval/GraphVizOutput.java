package AGEval;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

import AGEval.EvalStep.EvalType;
import AGEval.GrammarEvaluator.EdgeType;
import AGEval.GrammarEvaluator.VertType;
import AGEval.IFace.ClassType;

public class GraphVizOutput {
	
	private ArrayList<IFace> interfaces;
	private ArrayList<Class> classes;
	private HashMap<Vertex, HashMap<Vertex, EdgeType>> graphEdges;
	private ArrayList<String> passColoring;
	private int parentCounter = 0;
	
	public GraphVizOutput(ArrayList<IFace> interfaces, ArrayList<Class> classes, 
			HashMap<Vertex, HashMap<Vertex, EdgeType>> edges){
		this.interfaces = interfaces;
		this.classes = classes;
		passColoring = new ArrayList<String>();
		// Max passes = 10 for now
		passColoring.add("blue"); passColoring.add("darkgreen"); passColoring.add("indigo"); passColoring.add("cyan");
		passColoring.add("red"); passColoring.add("magenta"); passColoring.add("brown"); passColoring.add("orange");
		passColoring.add("deeppink"); passColoring.add("greenyellow");
		graphEdges = edges;
	}
	
	/** Each call will increment parent counter, used to uniquely assign edge name to parent vertices */
	public int getParentCounter(){
		int returning = parentCounter;
		parentCounter++;
		return returning;
	}

	/** Method that takes an evaluated grammar and prints the OAG graph structure */
	public void createOAGDot(){
		try {
			FileWriter writer = new FileWriter(new File("OAGGraph.dot"));
			writer.write("digraph G{\n");
			int subCounter = 0;
			// Add all vertices
			
			for (IFace iface : interfaces){
				addOAGDotIFace(iface, writer, subCounter);
				subCounter++;
			}
			
			for (Class cls : classes){
				addOAGDotCls(cls, writer, subCounter);
				subCounter++;
			}

			// Add edges
			for (Vertex source : graphEdges.keySet()){
				String sourceName = source.getParent().getName() + "_" + source.getExtVar();
				HashMap<Vertex, EdgeType> dests = graphEdges.get(source);
				if (dests != null){
					for (Vertex dest : dests.keySet()){
						String destName = dest.getParent().getName() + "_" + dest.getExtVar();
						String edgeStr = "\t" + sourceName + " -> " + destName;
						if (dests.get(dest) == EdgeType.INDIRECT)
							edgeStr += "[style=dotted]";
						writer.write(edgeStr + ";\n");
					}
				}
			}
			writer.write("}");
			writer.close();
		}
		catch (IOException e){
			System.err.println("Error: IOException detected");
			e.printStackTrace();
			System.exit(1);
		}
	}
	
	/** Internal method to add vertices of an interface */
	protected void addOAGDotIFace(IFace iface, FileWriter writer, int counter) throws IOException{
		String clusterName = iface.getName();
		writer.write("\tsubgraph cluster" + counter + "{\n");
		writer.write("\t\tcolor=blue;\n");
		writer.write("\t\tnode[style=filled];\n");
		writer.write("\t\tlabel=\"" + clusterName + "\";\n");
		for (Vertex vert : iface.getVertices()){
			String attrib = vert.getExtVar();
			String modifier = "[label=\"" + attrib + "\"";
			if (vert.isVertexType(VertType.FIELD))
				modifier += ", shape=box";
			writer.write("\t\t" + clusterName + "_" + attrib + modifier + "];\n");
		}
		writer.write("\t}\n");
	}
	
	/** Internal method to add vertices of a class */
	protected void addOAGDotCls(Class cls, FileWriter writer, int counter) throws IOException{
		String clusterName = cls.getName();
		writer.write("\tsubgraph cluster" + counter + "{\n");
		writer.write("\t\tcolor=black;\n");
		writer.write("\t\tnode[style=filled];\n");
		writer.write("\t\tlabel=\"" + clusterName + "\";\n");
		for (Vertex vert : cls.getVertices()){
			String vertVar = vert.getExtVar();
			String modifier = "[label=\"" + vertVar + "\"";
			if (!vert.isPublic()){
				modifier = "[label=\"$" + vertVar + "\"";
			}
			if (vert.isVertexType(VertType.FIELD))
				modifier += ", shape=box";
			writer.write("\t\t" + clusterName + "_" + vertVar + modifier + "];\n");
		}
		writer.write("\t}\n");
	}
	
	/** Method that takes an evaluated grammar and prints the final class-based sequence structure */
	public void createClassDot(){
		try {
			FileWriter writer = new FileWriter(new File("ClassGraph.dot"));
			writer.write("digraph G{\n");
			int cluster = 0;
			for (Class cls : classes){
				cluster = makeClassDot(cls, writer, cluster);
			}
			writer.write("}");
			writer.close();
		}
		catch (IOException e){
			System.err.println("Error: IOException detected");
			e.printStackTrace();
			System.exit(1);
		}
	}
	
	/** Helper method that makes a subgraph of a class-interfaces, returns the next cluster number to use */
	protected int makeClassDot(Class cls, FileWriter writer, int cluster) throws IOException{
		
		String parentStr = new String();
		HashMap<Vertex, Integer> vertexToPass = new HashMap<Vertex, Integer>();
		HashMap<String, HashSet<String>> existingMappings = new HashMap<String, HashSet<String>>();
		
		String className = cls.getName();
		writer.write("\tsubgraph cluster" + cluster + "{\n");
		cluster++;
		writer.write("\t\tcolor=black;\n");
		writer.write("\t\tlabel=\"" + className + "-graph\";\n");
		
		// make class vertices
		writer.write("\t\tsubgraph cluster" + cluster + "{\n");
		cluster++;
		writer.write("\t\t\tlabel=\"" + className + "\";\n");
		writer.write("\t\t\tnode[style=filled];\n");
		for (Vertex vert : cls.getVertices()){
			String modifier = "[label=\"" + vert.getExtVar() + "\"";
			if (!vert.isPublic()){
				modifier = "[label=\"$" + vert.getExtVar() + "\"";
			}
			if (vert.isVertexType(VertType.FIELD))
				modifier += ", shape=box";
			writer.write("\t\t\t" + resolveVertexStr(vert, cls) + modifier + "];\n");
		}
		writer.write("\t\t}\n");
		
		// make child interface vertices
		if (cls.hasChildren()){
			for (IFace iface : cls.getChildrenTypes()){
				writer.write("\t\tsubgraph cluster" + cluster + "{\n");
				writer.write("\t\t\tlabel=\"" + iface.getName() + "\";\n");
				writer.write("\t\t\tnode[style=filled];\n");
				cluster++;
				for (Vertex ifaceVert : iface.getVertices()){
					String begin = "\t\t\t" + resolveVertexStr(ifaceVert, cls) + "[label=\"" + ifaceVert.getExtVar() + "\"";
					if (ifaceVert.isVertexType(VertType.FIELD))
						begin += ", shape=box";
					writer.write(begin + "];\n");
				}
				writer.write("\t\t}\n");
			}
		}
		
		// add parent vertex if applicable
		if (cls.getInterface().hasKontracts()){
			parentStr = "parent" + getParentCounter();
			writer.write("\t\t" + parentStr + "[label=\"Parent\",style=dotted];\n");
		}
		
		// make edges
		int passNum = 0;
		for (ArrayList<EvalStep> visit : cls.getVisitors()){
			String edgeColor = passColoring.get(passNum);
			boolean inCall = false;
			for (EvalStep step : visit){
				if (step.getType() == EvalType.CALL){
					if (inCall){
						continue;
					}
					else {
						passNum ++;
						edgeColor = passColoring.get(passNum);
						inCall = true;
					}
				}
				else {
					if (inCall){
						inCall = false;
					}
					Function action = null;
					if (step.getType() == EvalType.SET){
						action = ((EvalStepSet) step).getFunction();
					}
					else if (step.getType() == EvalType.APPLY){
						action = ((EvalStepApply) step).getFunction();
					}
					if (action != null){
						Vertex[] srcs = action.getSources();
						Vertex dest = action.getDestination();
						String destStr = resolveVertexStr(dest, cls);
						if (srcs != null){
							for (Vertex src : srcs){
								String srcStr = resolveVertexStr(src, cls);
								
								// filter out repeated child edges
								if (existingMappings.containsKey(srcStr)){
									if (existingMappings.get(srcStr).contains(destStr)){
										continue;
									}
									else {
										writer.write("\t\t" + srcStr + " -> " + destStr + "[color=" + edgeColor + "];\n");
										existingMappings.get(srcStr).add(destStr);
									}
								}
								else {
									HashSet<String> dests = new HashSet<String>();
									dests.add(destStr);
									existingMappings.put(srcStr, dests);
									writer.write("\t\t" + srcStr + " -> " + destStr + "[color=" + edgeColor + "];\n");
								}
							}
						}
						vertexToPass.put(dest, passNum);
					}
				}
			}
		}
		// if there are kontracts...
		if (!parentStr.isEmpty()){
			HashMap<Integer, HashMap<Vertex, HashSet<Class>>> kontracts = cls.getInterface().getKontracts();
			for (Integer val : kontracts.keySet()){
				String parentColor = passColoring.get(val);
				for (Vertex vert : kontracts.get(val).keySet()){
					Vertex clsVert = cls.findVertex(vert.getVar());
					int vertPass = vertexToPass.get(clsVert);
					String vertStr = resolveVertexStr(clsVert, cls);
					String edgeColor = passColoring.get(vertPass);
					writer.write("\t\t" + vertStr + " -> " + parentStr + "[color=" + edgeColor + ",label=\"" + val + "\",fontcolor=" + parentColor + "];\n");
				}
			}
		}
		
		writer.write("\t}\n");
		return cluster;
	}
	
	/** Helper method to resolve the proper vertex name */
	protected String resolveVertexStr(Vertex vert, Class cls){
		String className = cls.getName();
		IFace parent = vert.getParent();
		if (parent.isType(ClassType.INTERFACE))
			return className + "_" + parent.getName() + "_" + vert.getExtVar();
		else // is class attribute
			return className + "_" + vert.getExtVar();
	}
	
	/** Helper method that returns the pass that the vertex is in */
	protected int getPassNum(Vertex dest, ArrayList<ArrayList<ArrayList<Vertex>>> passes){
		for (int i = 0; i < passes.size(); i++){
			ArrayList<ArrayList<Vertex>> pass = passes.get(i);
			for (ArrayList<Vertex> seg : pass){
				if (seg.contains(dest)){
					return i;
				}
			}
		}
		assert false;// should never reach here...
		return 0;
	}
}