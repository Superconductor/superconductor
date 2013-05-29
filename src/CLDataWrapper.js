// Provides a well-abstracted interface for getting and setting values on the WebCL device.
// Object of this type should be created by Superconductor, since their constructor requires
// knowledge of the detaisl of how data looks on the device. They should then be given to the
// user, who should only interact with it via its defined interface.
// Paramters:
//	clr: the CLRunner managing this visualization layout
//	hostBuffer: the TypedArray holding the data on the host
//	clBuffer: the WebCLBuffer object representing the data on the device
function CLDataWrapper(clr, hostBuffer, clBuffer) {
	// mtorok: Note to self: Javascript Proxies would seem to be exactly what we want here -- they
	// allow one to emulate a whole host of object operations, like property get and set. However,
	// the standard is currently in the very early stages of development, and only supported in the
	// latest versions of Firefox, and even then only as a prototype of the idea.

	// Using public/private class member pattern from http://javascript.crockford.com/private.html


	if (clr.cfg.ignoreCL) {
		this.get = function(index) { return hostBuffer[index]; };
		this.set = function(index, value) { hostBuffer[index] = value; return value; };
		this.__defineGetter__("length", function() { return hostBuffer.length; });
	} else {

		///////////// Public, but privileged, methods
		this.get = function(index) {
			// Create a new typed array of the same type as hostBuffer, 1 element long
			var target = new hostBuffer.constructor(1);
			var itemOffset = hostBuffer.byteOffset + (hostBuffer.BYTES_PER_ELEMENT * index);
	
			clr.queue.enqueueReadBuffer(clBuffer, true, itemOffset, target.byteLength, target);
	
			return target[0];
		};
	
	
		this.set = function(index, value) {
			// Create a new typed array of the same type as hostBuffer, 1 element long
			var target = new hostBuffer.constructor(1);
			target[0] = value;
			var itemOffset = hostBuffer.byteOffset + (hostBuffer.BYTES_PER_ELEMENT * index);
	
			clr.queue.enqueueWriteBuffer(clBuffer, true, itemOffset, target.byteLength, target);
	
			return value;
		};
	
	
		// The size of this buffer in number of elements
		this.__defineGetter__("length", function() { return hostBuffer.length });
	}
}