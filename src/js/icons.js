// Inject svgs where necessary
(function() {
    'use strict';

    // Elements to inject
    var SVGsToInject = document.querySelectorAll('img.inject-svg');

    // Do the injection
    SVGInjector(SVGsToInject);

}());

