// Inject svgs where necessary
(function() {
    'use strict';

    // Elements to inject
    var SVGsToInject = document.querySelectorAll('.inject-svg');

    // Injector options
    var injectorOptions = {
        evalScripts: false,
        pngFallback: 'assets/icons/fallbacks'
    };

    // Do the injection
    SVGInjector(SVGsToInject, injectorOptions);

}());