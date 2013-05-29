// Exception class for Superconductor
// message is a string containing a human-readable error message
// data is an optional argument containing additional information about the error. Need not be
//	human-readable.
function SCException(message, data) {
	this.message = message;
	this.data = data || null;
	this.toString = function() {
		var errString = this.message;

		if(this.data) {
			errString += ' (additional data: ' + this.data + ')';
		}

		return errString;
	};
}