package AGEval;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class AleSimulator {
	
	private FileWriter myWriter;
	private AleSimulatorNode myRoot;
	
	public AleSimulator(AleSimulatorNode root) throws IOException {
		myWriter = new FileWriter(new File("ALESim_output"));
		myRoot = root;
		if (!root.allReady()){
			System.err.println("Warning: ALE Tree is not properly initialized");
		}
	}
	
	public void simulate() throws IOException {
		myWriter.write(myRoot.visit());
		myWriter.close();
	}
}
