typedef struct {
	float4 vertex;
	float4 color;
} VertexAndColor;


///////////////////////////////////////////////////////////////////////////////
// Drawing function declarations
///////////////////////////////////////////////////////////////////////////////


// All angles are in degrees unless otherwise noted

int ArcZ_size(float x, float y, float z, float radius, float alpha, float sectorAng, float w, int colorRgb);
int ArcZ_draw(__global VertexAndColor* gl_buffer, unsigned int buf_index, int num_vertices, float x, float y, float z, float radius, float alpha, float sectorAng, float w, int colorRgb);

int Arc_size(float x, float y, float radius, float alpha, float sectorAng, float w, int colorRgb);
int Arc_draw(__global VertexAndColor* gl_buffer, unsigned int buf_index, int num_vertices, float x, float y, float radius, float alpha, float sectorAng, float w, int colorRgb);

int CircleZ_size(float x, float y, float z, float radius, int colorRgb);
int CircleZ_draw(__global VertexAndColor* gl_buffer, unsigned int buf_index, int num_vertices, float x, float y, float z, float radius, int colorRgb);

int Circle_size(float x, float y, float radius, int colorRgb);
int Circle_draw(__global VertexAndColor* gl_buffer, unsigned int buf_index, int num_vertices, float x, float y, float radius, int colorRgb);

int Rectangle_size(float x, float y, float w, float h, int colorRgb);
int Rectangle_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, float x, float y, float w, float h, int colorRgb);

int RectangleOutline_size(float x, float y, float w, float h, int colorRgb);
int RectangleOutline_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, float x, float y, float w, float h, int colorRgb);

int RectangleZ_size(float x, float y, float w, float h, float z, int rgb_col);
int RectangleZ_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, 
	float x, float y, float w, float h, float z, int rgb_col);

int Line3D_size(float x1, float y1, float z1, float x2, float y2, float z2, float thickness, int rgb_color);
int Line3D_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, 
  float x1, float y1, float z1, float x2, float y2, float z2, float thickness, int rgb_color);

int Line_size(float x1, float y1, float x2, float y2, float thickness, int rgb_color);
int Line_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, 
  float x1, float y1, float x2, float y2, float thickness, int rgb_color);

///////////////////////////////////////////////////////////////////////////////
// Constants which control the generated vertices
///////////////////////////////////////////////////////////////////////////////


// Z value of all coordinates -- constant since we're drawing 2D.
#define Z_VALUE 0.0f
// W value of all coordinates -- found by trial and error because WTF.
#define W_VALUE 10000.0f
// Max number of vertices to use when drawing a circle.
#define NUM_VERT_CIRCLE 50
// Max number of vertices to use when drawing a circle.
#define NUM_VERT_ARC 20
// The width when drawing outline-style objects
#define BORDER_WIDTH 200


///////////////////////////////////////////////////////////////////////////////
// Helper function declarations
///////////////////////////////////////////////////////////////////////////////


// Converts a point on a circle to x & y coordinates.
// The point is given as radians from the '3' position, the radius, and x/y 
// coords of the center of the circle.
float2 AngleToCoord(float angle, float radius, int x, int y);

// Radians <-> degrees
float DegToRad(int degrees);
float DegToRadf(float degrees);

// Extract OpenGL-style floating point color component from a 32-bit int
float getAlphaComponent8B(int rgb_color);
float getRedComponent8B(int rgb_color);
float getGreenComponent8B(int rgb_color);
float getBlueComponent8B(int rgb_color);

// Same as above, but leave the color as a 8-bit wide int instead of converting
// to a float.
int igetAlphaComponent8B(int rgb_color);
int igetRedComponent8B(int rgb_color);
int igetGreenComponent8B(int rgb_color);
int igetBlueComponent8B(int rgb_color);

// Linear interpolation of two colors
// Blends start_color with end_color according to k (0 = all start color, 
// 1023 = all end color).
int lerpColor(int start_color, int end_color, float k);


// Pack rgb with an alpha of 255
int rgb (int r, int g, int b);

// Pack rgba into argb format
int rgba (int r, int g, int b, int a);

// Obtain the absolute index of a node given a starting node and relative offset
// (this is the format indices are stored in Superconductor.)
int GetAbsoluteIndex(unsigned int relative_index, unsigned int reference_node);

// Wrapper for atan2 to placate some OpenCL compilers
float atan2_wrap(float x, float y);


///////////////////////////////////////////////////////////////////////////////
// Drawing function definitions
///////////////////////////////////////////////////////////////////////////////


int Arc_size(float x, float y, float radius, float alpha, float sectorAng, float w, int colorRgb) {
	return ArcZ_size(x, y, Z_VALUE, radius, alpha, sectorAng, w, colorRgb);
}

int ArcZ_size(float x, float y, float z, float radius, float alpha, float sectorAng, float w, int colorRgb) {
	if(sectorAng >= 360) {
		return CircleZ_size(x, y, z, radius, colorRgb);
	}

	// Don't render tiny arcs
	if(w < 0.001f || sectorAng < 0.02f) {
		return 0;
	}
	
	int reqSize = 0;

	// If it's really big arc, give it more vertices.
	if(sectorAng >= 180) {
		reqSize = NUM_VERT_ARC * 6;
	} else if(sectorAng >= 90) {
		reqSize = NUM_VERT_ARC * 4;
	} else if(sectorAng >= 45) {
		reqSize = NUM_VERT_ARC * 3;
	} else if(sectorAng >= 25) {
		reqSize = NUM_VERT_ARC * 2;
	} else {
		reqSize = NUM_VERT_ARC;
	}
	
	if(reqSize < 6) {
		return 6;
	} else {
		return reqSize;
	}
}

int Arc_draw(__global VertexAndColor* gl_buffer, unsigned int buf_index, int num_vertices, float x, float y, float radius, float alpha, float sectorAng, float w, int colorRgb) {
	return ArcZ_draw(gl_buffer, buf_index, num_vertices, x, y, Z_VALUE, radius, alpha, sectorAng, w, colorRgb);
}

int ArcZ_draw(__global VertexAndColor* gl_buffer, unsigned int buf_index, int num_vertices, float x, float y, float z, float radius, float alpha, float sectorAng, float w, int colorRgb) {
	if(num_vertices < 6) {
		return 1;
	}
	
	// If this is really a circle and not an arc, we can draw this more
	// efficently with another algorithm, so hand off generation to a function
	// which implements that.
	if(sectorAng >= 360) {
		return CircleZ_draw(gl_buffer, buf_index, num_vertices, x, y, z, radius, colorRgb);
	}

	float4 gl_color = (float4)(getRedComponent8B(colorRgb), getGreenComponent8B(colorRgb), getBlueComponent8B(colorRgb), getAlphaComponent8B(colorRgb));

	float start_ang = DegToRadf(alpha) - DegToRadf(sectorAng / 2.0f);
	float end_ang = DegToRadf(alpha) + DegToRadf(sectorAng / 2.0f);
	int inner_radius = radius - w;

	// We need to reserve two vertices for our degenerate triangles
	num_vertices -= 2;

	// We want to end make sure to actually end at end_ang. Since the angle
	// being drawn is computed as start_ang + i * angle_increment, where i is
	// 0-based, we really want to end at start_ang + (i + 1) * angle_increment.
	// Since i = num_vertices / 2, calculate angle_increment using
	// num_vertices - 2.
	float angle_increment = fabs(end_ang - start_ang) / ((num_vertices - 2) / 2);

	VertexAndColor inner_vertex;
	inner_vertex.color = gl_color;
	inner_vertex.vertex.zw = (float2)(z, W_VALUE);
	VertexAndColor outer_vertex;
	outer_vertex.color = gl_color;
	outer_vertex.vertex.zw = (float2)(z, W_VALUE);

	for(int i = 0; i < (num_vertices / 2); i++) {
		float current_angle = start_ang + (i * angle_increment);

		inner_vertex.vertex.xy = AngleToCoord(current_angle, inner_radius, x, y);
		outer_vertex.vertex.xy = AngleToCoord(current_angle, radius, x, y);

		// Duplicate the first vertex
		if(i == 0) {
			gl_buffer[buf_index] = outer_vertex;
			buf_index++;
		}

		gl_buffer[buf_index] = outer_vertex;
		buf_index++;

		gl_buffer[buf_index] = inner_vertex;
		buf_index++;
	}

	// Duplicate the last vertex
	gl_buffer[buf_index] = inner_vertex;

	// If we have an odd num_vertices, duplicate the last vertex twice to noop it
	if(num_vertices % 2 == 1) {
		buf_index++;
		gl_buffer[buf_index] = inner_vertex;
	}

	return 1;
}


int Circle_size(float x, float y, float radius, int colorRgb) {
	return NUM_VERT_CIRCLE;
}

int CircleZ_size(float x, float y, float z, float radius, int colorRgb) {
	return NUM_VERT_CIRCLE;
}

int Circle_draw(__global VertexAndColor* gl_buffer, unsigned int buf_index, int num_vertices, float x, float y, float radius, int colorRgb) {
	return CircleZ_draw(gl_buffer, buf_index, num_vertices, x, y, Z_VALUE, radius, colorRgb);
}


int CircleZ_draw(__global VertexAndColor* gl_buffer, unsigned int buf_index, int num_vertices, float x, float y, float z, float radius, int colorRgb) {
	float4 gl_color = (float4)(getRedComponent8B(colorRgb), getGreenComponent8B(colorRgb), getBlueComponent8B(colorRgb), getAlphaComponent8B(colorRgb));
	
	// Take one off to reserve an extra vertex for the degenerate triangle
	num_vertices -= 1;

	// Algorithm:
	//	Place num_vertices points evenly spaced around the perimeter of the
	//	the circle, each labelled with an increasing numeric label (clockwise/
	//	counter-clockwise doesn't matter.) Let 'a' be the first vertex, 0, and 'b'
	//	'b' be the last vertex.
	//	Place the vertices into the buffer as follows:
	//		a, a+1, b, a+2, b-1,...,a+n, b-m
	//		while b-m > a+n
	//
	//	Robust for both odd and even num_vertices. Only requirement is
	//	num vertices >= 3 so we can make at least one triangle
	VertexAndColor vert;
	vert.color = gl_color;
	vert.vertex.zw =  (float2)(z, W_VALUE);

	const float angle_increment = (2* M_PI_F) / num_vertices;

	// Place the first vertex at angle 0
	vert.vertex.xy = AngleToCoord(0.0f, radius, x, y);
	gl_buffer[buf_index] = vert;
	buf_index++;

	// a_index starts at 1 because we just wrote one above
	uchar a_index = 1;
	// Use num_vertices -1, because num_vertices is 1-based and the index should
	// be 0-based.
	uchar b_index = num_vertices - 1;

	// There's probably room for optimization here...
	while(b_index >= a_index) {
		// Place a_index
		vert.vertex.xy = AngleToCoord(a_index * angle_increment, radius, x, y);
		gl_buffer[buf_index] = vert;
		a_index++;
		buf_index++;

		// Place b_index
		// ...but first, make sure the loop invariant still holds since we're
		// writing two vertices at a time.
		if(b_index >= a_index) {
			vert.vertex.xy = AngleToCoord(b_index * angle_increment, radius, x, y);
			gl_buffer[buf_index] = vert;
			b_index--;
			buf_index++;
		}
	}

	// Finally, duplicate the last vertex
	gl_buffer[buf_index] = vert;

	return 1;
}


int Rectangle_size(float x, float y, float w, float h, int colorRgb) {
	return 6;
}


int Rectangle_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, float x, float y, float w, float h, int colorRgb) {
	// 6 is the minimum # of vertices to draw a rect

	VertexAndColor vert;
	vert.color = (float4)(getRedComponent8B(colorRgb), getGreenComponent8B(colorRgb), getBlueComponent8B(colorRgb), getAlphaComponent8B(colorRgb));
	vert.vertex.zw = (float2)(Z_VALUE, W_VALUE);

	// Draw lower-left corner
	vert.vertex.xy = (float2)(x , y);
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;
	// Duplicate it to create a degenerate triangle
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;

	// Draw upper-left corner
	vert.vertex.xy = (float2)(x, y + h);
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;

	// Draw lower-right corner
	vert.vertex.xy = (float2)(x + w, y);
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;

	// Draw upper-right corner
	vert.vertex.xy = (float2)(x + w, y + h);
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;
	// Duplicate the last vertex
	gl_buffer[buffer_offset] = vert;

	// If there's remaining vertex space, tough shit, that's an error.

	return 1;
}

int RectangleZ_size(float x, float y, float w, float h, float z, int rgb_color) { return 6; }
int RectangleZ_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, 
float x, float y, float w, float h, float z, int rgb_color) {
	// 6 is the minimum # of vertices to draw a rect

	VertexAndColor vert;
	vert.color = (float4)(getRedComponent8B(rgb_color), getGreenComponent8B(rgb_color), getBlueComponent8B(rgb_color), getAlphaComponent8B(rgb_color));
	vert.vertex.zw = (float2)(Z_VALUE + z, W_VALUE);

	// Draw lower-left corner
	vert.vertex.xy = (float2)(x , -y);
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;
	// Duplicate it to create a degenerate triangle
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;

	// Draw upper-left corner
	vert.vertex.xy = (float2)(x, -y - h);
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;

	// Draw lower-right corner
	vert.vertex.xy = (float2)(x + w, -y);
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;

	// Draw upper-right corner
	vert.vertex.xy = (float2)(x + w, -y - h);
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;
	// Duplicate the last vertex
	gl_buffer[buffer_offset] = vert;

	// If there's remaining vertex space, tough shit, that's an error.

	return 1;
}




int RectangleOutline_size(float x, float y, float w, float h, int colorRgb) { 
	return 12; 
}


// Requires 12 vertices
int RectangleOutline_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, float x, float y, float w, float h, int colorRgb) { 
	VertexAndColor vert;
	vert.color = (float4)(getRedComponent8B(colorRgb), getGreenComponent8B(colorRgb), getBlueComponent8B(colorRgb), getAlphaComponent8B(colorRgb));
	vert.vertex.zw = (float2)(Z_VALUE + 100, W_VALUE);

	// Draw trapazoids in the following order: left, top, right, bottom

	// Left trapazoid
	vert.vertex.xy = (float2)(x , y);
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;
	// Duplicate first vertex to create degenerate triangle
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;

	vert.vertex.xy = (float2)(x + BORDER_WIDTH, y + BORDER_WIDTH);
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;

	vert.vertex.xy = (float2)(x, y + h);
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;

	vert.vertex.xy = (float2)(x + BORDER_WIDTH, y + h - BORDER_WIDTH);
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;


	// Top trapazoid
	vert.vertex.xy = (float2)(x + w, y + h);
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;

	vert.vertex.xy = (float2)(x + w - BORDER_WIDTH, y + h - BORDER_WIDTH);
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;


	// Right trapazoid
	vert.vertex.xy = (float2)(x + w, y);
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;

	vert.vertex.xy = (float2)(x + w - BORDER_WIDTH, y + BORDER_WIDTH);
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;


	// Bottom trapazoid
	vert.vertex.xy = (float2)(x, y);
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;

	vert.vertex.xy = (float2)(x + BORDER_WIDTH, y + BORDER_WIDTH);
	gl_buffer[buffer_offset] = vert;
	buffer_offset++;

	// Duplicate the last vertex
	gl_buffer[buffer_offset] = vert;

	return 1; 
}


#define SETVERT(x,y,z) \
	vert.vertex.zw = (float2)(z, W_VALUE); \
	vert.vertex.xy = (float2)(x, y); \
	gl_buffer[buffer_offset] = vert; \
	buffer_offset++;

int Line_size(float x1, float y1, float x2, float y2, float thickness, int rgb_color) { return 6; }
int Line_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, 
  float x1, float y1, float x2, float y2, float thickness, int rgb_color) {

	//float thickness = 0.1f;

	VertexAndColor vert;
	vert.color = (float4)(getRedComponent8B(rgb_color), getGreenComponent8B(rgb_color), getBlueComponent8B(rgb_color), getAlphaComponent8B(rgb_color));

	//face A
	SETVERT(x2 + thickness,-y2,0.0f);
	SETVERT(x2 + thickness,-y2,0.0f);
	SETVERT(x2 - thickness,-y2,0.0f);
	SETVERT(x1 + thickness,-y1,0.0f);
	SETVERT(x1 - thickness,-y1,0.0f);
	SETVERT(x1 - thickness,-y1,0.0f);
	
	return 1;
}
#undef SETVERT


#define SETVERT(x,y,z) \
	vert.vertex.zw = (float2)(z, W_VALUE); \
	vert.vertex.xy = (float2)(x, y); \
	gl_buffer[buffer_offset] = vert; \
	buffer_offset++;

int Line3D_size(float x1, float y1, float z1, float x2, float y2, float z2, float thickness, int rgb_color) { return 6; }
int Line3D_draw(__global VertexAndColor* gl_buffer, int buffer_offset, int num_vertices, 
float x1, float y1, float z1, float x2, float y2, float z2, float thickness, int rgb_color) {

	VertexAndColor vert;
	vert.color = (float4)(getRedComponent8B(rgb_color), getGreenComponent8B(rgb_color), getBlueComponent8B(rgb_color), getAlphaComponent8B(rgb_color));

	//face A
	SETVERT(x2 + thickness,-y2,z2);
	SETVERT(x2 + thickness,-y2,z2);
	SETVERT(x2 - thickness,-y2,z2);
	SETVERT(x1 + thickness,-y1,z1);
	SETVERT(x1 - thickness,-y1,z1);
	SETVERT(x1 - thickness,-y1,z1);
	
	return 1;
}
#undef SETVERT


///////////////////////////////////////////////////////////////////////////////
// Helper function definitions
///////////////////////////////////////////////////////////////////////////////


float2 AngleToCoord(float angle, float radius, int x, int y) {
	return (float2)((radius * cos(angle)) + x, (radius * sin(angle)) + y);
	
}


float DegToRad(int degrees) {
	return M_PI_F * degrees / 180;
}
float DegToRadf(float degrees) {
	return M_PI_F * degrees / 180.0f;
}


float getAlphaComponent8B(int rgb_color) {
	rgb_color = rgb_color >> 24;
	rgb_color = rgb_color & 255;
	return (rgb_color / 255.0f);
}
float getRedComponent8B(int rgb_color) {
	rgb_color = rgb_color >> 16;
	rgb_color = rgb_color & 255;
	return (rgb_color / 255.0f);
}
float getGreenComponent8B(int rgb_color) {
	rgb_color = rgb_color >> 8;
	rgb_color = rgb_color & 255;
	return (rgb_color / 255.0f);
}
float getBlueComponent8B(int rgb_color) {
	rgb_color = rgb_color & 255;
	return (rgb_color / 255.0f);
}


int igetAlphaComponent8B(int rgb_color) {
	rgb_color = rgb_color >> 24;
	return rgb_color & 255;
}
int igetRedComponent8B(int rgb_color) {
	rgb_color = rgb_color >> 16;
	return rgb_color & 255;
}
int igetGreenComponent8B(int rgb_color) {
	rgb_color = rgb_color >> 8;
	return rgb_color & 255;
}
int igetBlueComponent8B(int rgb_color) {
	return rgb_color & 255;
}


int GetAbsoluteIndex(unsigned int relative_index, unsigned int reference_node) {
	if (relative_index == 0) {
		return 0;
	}

	return reference_node + relative_index;
}


float atan2_wrap(float x, float y) {
	return (float) atan2(x, y);
}


int lerpColor(int start_color, int end_color, float fk) {
	if(fk >= 1) {
		return end_color;
	}

	int   alpha_start = igetAlphaComponent8B(start_color);
	int   red_start = igetRedComponent8B(start_color);
	int green_start = igetGreenComponent8B(start_color);
	int  blue_start = igetBlueComponent8B(start_color);

	int   alpha_end = igetAlphaComponent8B(end_color);
	int   red_end = igetRedComponent8B(end_color);
	int green_end = igetGreenComponent8B(end_color);
	int  blue_end = igetBlueComponent8B(end_color);

	int alpha_blended   = ((1 - fk) * alpha_start)   + (fk * alpha_end);
	int red_blended   = ((1 - fk) * red_start)   + (fk * red_end);
	int green_blended = ((1 - fk) * green_start) + (fk * green_end);
	int blue_blended  = ((1 - fk) * blue_start)  + (fk * blue_end);
	
	int result = 0;
	
	int alpha = alpha_blended & 255;
	int red = red_blended & 255;
	int green = green_blended & 255;
	int blue = blue_blended & 255;
	
	result = (result | ((alpha & 255) << 24));
	result = (result | ((red & 255) << 16));
	result = (result | ((green & 255) << 8));
	result = (result | (blue & 255));

	return result;
	// return 0;
}

int rgb(int r, int g, int b) {
	int res = 255 << 24;
	res = res | ((r & 255) << 16);
	res = res | ((g & 255) << 8);
	res = res | (b & 255);
	return res;
}

int rgba(int r, int g, int b, int a) {
	int res = (a & 255) << 24;
	res = res | ((r & 255) << 16);
	res = res | ((g & 255) << 8);
	res = res | (b & 255);
	return res;
}
