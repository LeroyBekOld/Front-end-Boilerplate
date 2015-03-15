// Inject svgs where necessary
(function() {
    'use strict';

    // Elements to inject
    var SVGsToInject = document.querySelectorAll('img.inject-svg');

    // Do the injection
    SVGInjector(SVGsToInject);

}());


(function () {

    'use strict';

    console.log('foo');

})();
// Enhance console.log / console.warn output in browsers and avoid errors
// in browsers that lack a console.
(function() {
    'use strict';

    // Avoid `console` errors in browsers that lack a console.
    var method;
    var methodsToEnhance = ['log', 'warn'];
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    var methodFunction = function (old) {
        return function () {
            var args;
            var stack = (new Error()).stack.split(/\n/);

            // Chrome includes a single "Error" line, FF doesn't.
            if (stack[0].indexOf('Error') === 0) {
                stack = stack.slice(1);
            }

            args = [].slice.apply(arguments).concat([stack[1].trim()]);

            return old.apply(console, args);
        };
    };

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }

        if (Array.prototype.indexOf && methodsToEnhance.indexOf(method) > -1) {
            console[method] = methodFunction(console[method]);
        }
    }
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImljb25zLmpzIiwibWFpbi5qcyIsInBsdWdpbnMvY29uc29sZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSW5qZWN0IHN2Z3Mgd2hlcmUgbmVjZXNzYXJ5XG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gRWxlbWVudHMgdG8gaW5qZWN0XG4gICAgdmFyIFNWR3NUb0luamVjdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZy5pbmplY3Qtc3ZnJyk7XG5cbiAgICAvLyBEbyB0aGUgaW5qZWN0aW9uXG4gICAgU1ZHSW5qZWN0b3IoU1ZHc1RvSW5qZWN0KTtcblxufSgpKTtcblxuIiwiKGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGNvbnNvbGUubG9nKCdmb28nKTtcblxufSkoKTsiLCIvLyBFbmhhbmNlIGNvbnNvbGUubG9nIC8gY29uc29sZS53YXJuIG91dHB1dCBpbiBicm93c2VycyBhbmQgYXZvaWQgZXJyb3JzXG4vLyBpbiBicm93c2VycyB0aGF0IGxhY2sgYSBjb25zb2xlLlxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIEF2b2lkIGBjb25zb2xlYCBlcnJvcnMgaW4gYnJvd3NlcnMgdGhhdCBsYWNrIGEgY29uc29sZS5cbiAgICB2YXIgbWV0aG9kO1xuICAgIHZhciBtZXRob2RzVG9FbmhhbmNlID0gWydsb2cnLCAnd2FybiddO1xuICAgIHZhciBub29wID0gZnVuY3Rpb24gKCkge307XG4gICAgdmFyIG1ldGhvZHMgPSBbXG4gICAgICAgICdhc3NlcnQnLCAnY2xlYXInLCAnY291bnQnLCAnZGVidWcnLCAnZGlyJywgJ2RpcnhtbCcsICdlcnJvcicsXG4gICAgICAgICdleGNlcHRpb24nLCAnZ3JvdXAnLCAnZ3JvdXBDb2xsYXBzZWQnLCAnZ3JvdXBFbmQnLCAnaW5mbycsICdsb2cnLFxuICAgICAgICAnbWFya1RpbWVsaW5lJywgJ3Byb2ZpbGUnLCAncHJvZmlsZUVuZCcsICd0YWJsZScsICd0aW1lJywgJ3RpbWVFbmQnLFxuICAgICAgICAndGltZWxpbmUnLCAndGltZWxpbmVFbmQnLCAndGltZVN0YW1wJywgJ3RyYWNlJywgJ3dhcm4nXG4gICAgXTtcbiAgICB2YXIgbGVuZ3RoID0gbWV0aG9kcy5sZW5ndGg7XG4gICAgdmFyIGNvbnNvbGUgPSAod2luZG93LmNvbnNvbGUgPSB3aW5kb3cuY29uc29sZSB8fCB7fSk7XG5cbiAgICB2YXIgbWV0aG9kRnVuY3Rpb24gPSBmdW5jdGlvbiAob2xkKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXJncztcbiAgICAgICAgICAgIHZhciBzdGFjayA9IChuZXcgRXJyb3IoKSkuc3RhY2suc3BsaXQoL1xcbi8pO1xuXG4gICAgICAgICAgICAvLyBDaHJvbWUgaW5jbHVkZXMgYSBzaW5nbGUgXCJFcnJvclwiIGxpbmUsIEZGIGRvZXNuJ3QuXG4gICAgICAgICAgICBpZiAoc3RhY2tbMF0uaW5kZXhPZignRXJyb3InKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHN0YWNrID0gc3RhY2suc2xpY2UoMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFyZ3MgPSBbXS5zbGljZS5hcHBseShhcmd1bWVudHMpLmNvbmNhdChbc3RhY2tbMV0udHJpbSgpXSk7XG5cbiAgICAgICAgICAgIHJldHVybiBvbGQuYXBwbHkoY29uc29sZSwgYXJncyk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICBtZXRob2QgPSBtZXRob2RzW2xlbmd0aF07XG5cbiAgICAgICAgLy8gT25seSBzdHViIHVuZGVmaW5lZCBtZXRob2RzLlxuICAgICAgICBpZiAoIWNvbnNvbGVbbWV0aG9kXSkge1xuICAgICAgICAgICAgY29uc29sZVttZXRob2RdID0gbm9vcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChBcnJheS5wcm90b3R5cGUuaW5kZXhPZiAmJiBtZXRob2RzVG9FbmhhbmNlLmluZGV4T2YobWV0aG9kKSA+IC0xKSB7XG4gICAgICAgICAgICBjb25zb2xlW21ldGhvZF0gPSBtZXRob2RGdW5jdGlvbihjb25zb2xlW21ldGhvZF0pO1xuICAgICAgICB9XG4gICAgfVxufSgpKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=