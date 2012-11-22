// Enable the passage of the 'this' object through the JavaScript timers
// https://developer.mozilla.org/en-US/docs/DOM/window.setTimeout#The_.22this.22_problem
var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;
window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
	var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
	return __nativeST__(vCallback instanceof Function ? function () {
		vCallback.apply(oThis, aArgs);
	} : vCallback, nDelay);
};

window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
	var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
	return __nativeSI__(vCallback instanceof Function ? function () {
		vCallback.apply(oThis, aArgs);
	} : vCallback, nDelay);
};

