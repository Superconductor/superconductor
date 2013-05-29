// This file contains defines and functions used by all Superconductor generated OpenCL kernel code.
// It should always be preprended to any generated kernel source before compiling the CL kernels.`


// The type we store the tokens enum as
typedef int GrammarTokens;

// The type of a relative-offset index in the tree
typedef int NodeIndex;

// VBO HACK
#define glBufferMacro(index) glBuffer


#define PI() M_PI_F
#define floatToInt(v) ((int)(v))


// WARNING: Need to have previously declared the following before using this macro:
// int step = 0;
// unsigned int prev_child_idx = NULL;

// Loop over all the children of this node contained in child_field_name
// this_node_index: the index of the parent node
// child_field_name: name of the field holding the leftmost child we want to loop over
//	e.g., top_child_child_leftmost_child
// step: name of the variable this macro creates to hold the current loop count
#define SFORLOOPALIAS_OCL(parent_node_index, child_field_name, step) \
	do { \
	step = 0; \
	prev_child_idx = 0; \
	for(unsigned int current_node = GetAbsoluteIndex(child_field_name(parent_node_index), parent_node_index); \
		current_node != 0; current_node = GetAbsoluteIndex(right_siblings(current_node), current_node)) { \
		step++;

#define SFORLOOPALIAS_OCL_END() prev_child_idx = current_node; \
	} } while(false);

#define PREV_OCL() prev_child_idx

#define STEP() step