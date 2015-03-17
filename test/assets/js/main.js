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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImljb25zLmpzIiwibWFpbi5qcyIsInBsdWdpbnMvY29uc29sZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEluamVjdCBzdmdzIHdoZXJlIG5lY2Vzc2FyeVxuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIEVsZW1lbnRzIHRvIGluamVjdFxuICAgIHZhciBTVkdzVG9JbmplY3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbWcuaW5qZWN0LXN2ZycpO1xuXG4gICAgLy8gRG8gdGhlIGluamVjdGlvblxuICAgIFNWR0luamVjdG9yKFNWR3NUb0luamVjdCk7XG5cbn0oKSk7XG5cbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgY29uc29sZS5sb2coJ2ZvbycpO1xuXG59KSgpOyIsIi8vIEVuaGFuY2UgY29uc29sZS5sb2cgLyBjb25zb2xlLndhcm4gb3V0cHV0IGluIGJyb3dzZXJzIGFuZCBhdm9pZCBlcnJvcnNcbi8vIGluIGJyb3dzZXJzIHRoYXQgbGFjayBhIGNvbnNvbGUuXG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gQXZvaWQgYGNvbnNvbGVgIGVycm9ycyBpbiBicm93c2VycyB0aGF0IGxhY2sgYSBjb25zb2xlLlxuICAgIHZhciBtZXRob2Q7XG4gICAgdmFyIG1ldGhvZHNUb0VuaGFuY2UgPSBbJ2xvZycsICd3YXJuJ107XG4gICAgdmFyIG5vb3AgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICB2YXIgbWV0aG9kcyA9IFtcbiAgICAgICAgJ2Fzc2VydCcsICdjbGVhcicsICdjb3VudCcsICdkZWJ1ZycsICdkaXInLCAnZGlyeG1sJywgJ2Vycm9yJyxcbiAgICAgICAgJ2V4Y2VwdGlvbicsICdncm91cCcsICdncm91cENvbGxhcHNlZCcsICdncm91cEVuZCcsICdpbmZvJywgJ2xvZycsXG4gICAgICAgICdtYXJrVGltZWxpbmUnLCAncHJvZmlsZScsICdwcm9maWxlRW5kJywgJ3RhYmxlJywgJ3RpbWUnLCAndGltZUVuZCcsXG4gICAgICAgICd0aW1lbGluZScsICd0aW1lbGluZUVuZCcsICd0aW1lU3RhbXAnLCAndHJhY2UnLCAnd2FybidcbiAgICBdO1xuICAgIHZhciBsZW5ndGggPSBtZXRob2RzLmxlbmd0aDtcbiAgICB2YXIgY29uc29sZSA9ICh3aW5kb3cuY29uc29sZSA9IHdpbmRvdy5jb25zb2xlIHx8IHt9KTtcblxuICAgIHZhciBtZXRob2RGdW5jdGlvbiA9IGZ1bmN0aW9uIChvbGQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmdzO1xuICAgICAgICAgICAgdmFyIHN0YWNrID0gKG5ldyBFcnJvcigpKS5zdGFjay5zcGxpdCgvXFxuLyk7XG5cbiAgICAgICAgICAgIC8vIENocm9tZSBpbmNsdWRlcyBhIHNpbmdsZSBcIkVycm9yXCIgbGluZSwgRkYgZG9lc24ndC5cbiAgICAgICAgICAgIGlmIChzdGFja1swXS5pbmRleE9mKCdFcnJvcicpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgc3RhY2sgPSBzdGFjay5zbGljZSgxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXJncyA9IFtdLnNsaWNlLmFwcGx5KGFyZ3VtZW50cykuY29uY2F0KFtzdGFja1sxXS50cmltKCldKTtcblxuICAgICAgICAgICAgcmV0dXJuIG9sZC5hcHBseShjb25zb2xlLCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIG1ldGhvZCA9IG1ldGhvZHNbbGVuZ3RoXTtcblxuICAgICAgICAvLyBPbmx5IHN0dWIgdW5kZWZpbmVkIG1ldGhvZHMuXG4gICAgICAgIGlmICghY29uc29sZVttZXRob2RdKSB7XG4gICAgICAgICAgICBjb25zb2xlW21ldGhvZF0gPSBub29wO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEFycmF5LnByb3RvdHlwZS5pbmRleE9mICYmIG1ldGhvZHNUb0VuaGFuY2UuaW5kZXhPZihtZXRob2QpID4gLTEpIHtcbiAgICAgICAgICAgIGNvbnNvbGVbbWV0aG9kXSA9IG1ldGhvZEZ1bmN0aW9uKGNvbnNvbGVbbWV0aG9kXSk7XG4gICAgICAgIH1cbiAgICB9XG59KCkpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==