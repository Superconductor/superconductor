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
		this.setBatched = function (index, view) {
            var typed = view instanceof hostBuffer.constructor ?  view : new hostBuffer.constructor(view);
            if (typed.length > hostBuffer.length - index) {
                clr.console.debug('batched write clamped');
            }
            hostBuffer.set(typed.subarray(0, Math.min(typed.length, hostBuffer.length - index)), index);
        };
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

        //read starting at index up to shorter of destination array and amount
        // int * int -> [ 'a ]
        // int * [ 'a ] -> [ 'a ]
        // int * [ 'a ] * int -> [ 'a ]
        this.getBatched = function (index, amountOrArray, maybeAmount) {

            var suggestedAmount =
                typeof maybeAmount == 'number' ? maybeAmount
                : typeof amountOrArray == 'object' ? amountOrArray.length
                : amountOrArray;

            var itemOffset = hostBuffer.byteOffset + (hostBuffer.BYTES_PER_ELEMENT * index);

            var actualAmount = Math.min(
                suggestedAmount,
                typeof amountOrArray == 'object' ? amountOrArray.length : suggestedAmount,
                (hostBuffer.byteLength - itemOffset) / hostBuffer.BYTES_PER_ELEMENT);

            if (!actualAmount) {
                return console.error('empty write');
            }

            var target = typeof amountOrArray == 'object' ? amountOrArray : new hostBuffer.constructor(actualAmount);
/*            console.error('suggested', suggestedAmount * Float32Array.BYTES_PER_ELEMENT,
                'actual', actualAmount  * Float32Array.BYTES_PER_ELEMENT,
                'offset', itemOffset,
                'target len', target.byteLength)
*/
            clr.queue.enqueueReadBuffer(
                clBuffer, true,
                itemOffset, actualAmount * Float32Array.BYTES_PER_ELEMENT,
                target);

            return target;
        }


		this.set = function(index, value) {
			// Create a new typed array of the same type as hostBuffer, 1 element long
			var target = new hostBuffer.constructor(1);
			target[0] = value;
			var itemOffset = hostBuffer.byteOffset + (hostBuffer.BYTES_PER_ELEMENT * index);

			clr.queue.enqueueWriteBuffer(clBuffer, true, itemOffset, target.byteLength, target);

			return value;
		};

        //write from index to shorter of end of array or end of view
		this.setBatched = function (index, view) {
            if (!view.length) return;
            var typed = view instanceof hostBuffer.constructor ?  view : new hostBuffer.constructor(view);
            var itemOffset = hostBuffer.byteOffset + hostBuffer.BYTES_PER_ELEMENT * index;
            clr.queue.enqueueWriteBuffer(clBuffer, true, itemOffset, typed.byteLength, typed);
            return typed;
        };


		// The size of this buffer in number of elements
		this.__defineGetter__("length", function() { return hostBuffer.length });
	}
}

if (typeof(module) != 'undefined') {
    module.exports.CLDataWrapper = CLDataWrapper;
}
