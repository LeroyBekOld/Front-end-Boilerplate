/**
 * SVGInjector v1.1.2 - Fast, caching, dynamic inline SVG DOM injection library
 * https://github.com/iconic/SVGInjector
 *
 * Copyright (c) 2014 Waybury <hello@waybury.com>
 * @license MIT
 */

(function (window, document) {

  'use strict';

  // Environment
  var isLocal = window.location.protocol === 'file:';
  var hasSvgSupport = document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1');

  function uniqueClasses(list) {
    list = list.split(' ');

    var hash = {};
    var i = list.length;
    var out = [];

    while (i--) {
      if (!hash.hasOwnProperty(list[i])) {
        hash[list[i]] = 1;
        out.unshift(list[i]);
      }
    }

    return out.join(' ');
  }

  /**
   * cache (or polyfill for <= IE8) Array.forEach()
   * source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
   */
  var forEach = Array.prototype.forEach || function (fn, scope) {
    if (this === void 0 || this === null || typeof fn !== 'function') {
      throw new TypeError();
    }

    /* jshint bitwise: false */
    var i, len = this.length >>> 0;
    /* jshint bitwise: true */

    for (i = 0; i < len; ++i) {
      if (i in this) {
        fn.call(scope, this[i], i, this);
      }
    }
  };

  // SVG Cache
  var svgCache = {};

  var injectCount = 0;
  var injectedElements = [];

  // Request Queue
  var requestQueue = [];

  // Script running status
  var ranScripts = {};

  var cloneSvg = function (sourceSvg) {
    return sourceSvg.cloneNode(true);
  };

  var queueRequest = function (url, callback) {
    requestQueue[url] = requestQueue[url] || [];
    requestQueue[url].push(callback);
  };

  var processRequestQueue = function (url) {
    for (var i = 0, len = requestQueue[url].length; i < len; i++) {
      // Make these calls async so we avoid blocking the page/renderer
      /* jshint loopfunc: true */
      (function (index) {
        setTimeout(function () {
          requestQueue[url][index](cloneSvg(svgCache[url]));
        }, 0);
      })(i);
      /* jshint loopfunc: false */
    }
  };

  var loadSvg = function (url, callback) {
    if (svgCache[url] !== undefined) {
      if (svgCache[url] instanceof SVGSVGElement) {
        // We already have it in cache, so use it
        callback(cloneSvg(svgCache[url]));
      }
      else {
        // We don't have it in cache yet, but we are loading it, so queue this request
        queueRequest(url, callback);
      }
    }
    else {

      if (!window.XMLHttpRequest) {
        callback('Browser does not support XMLHttpRequest');
        return false;
      }

      // Seed the cache to indicate we are loading this URL already
      svgCache[url] = {};
      queueRequest(url, callback);

      var httpRequest = new XMLHttpRequest();

      httpRequest.onreadystatechange = function () {
        // readyState 4 = complete
        if (httpRequest.readyState === 4) {

          // Handle status
          if (httpRequest.status === 404 || httpRequest.responseXML === null) {
            callback('Unable to load SVG file: ' + url);

            if (isLocal) callback('Note: SVG injection ajax calls do not work locally without adjusting security setting in your browser. Or consider using a local webserver.');

            callback();
            return false;
          }

          // 200 success from server, or 0 when using file:// protocol locally
          if (httpRequest.status === 200 || (isLocal && httpRequest.status === 0)) {

            /* globals Document */
            if (httpRequest.responseXML instanceof Document) {
              // Cache it
              svgCache[url] = httpRequest.responseXML.documentElement;
            }
            /* globals -Document */

            // IE9 doesn't create a responseXML Document object from loaded SVG,
            // and throws a "DOM Exception: HIERARCHY_REQUEST_ERR (3)" error when injected.
            //
            // So, we'll just create our own manually via the DOMParser using
            // the the raw XML responseText.
            //
            // :NOTE: IE8 and older doesn't have DOMParser, but they can't do SVG either, so...
            else if (DOMParser && (DOMParser instanceof Function)) {
              var xmlDoc;
              try {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(httpRequest.responseText, 'text/xml');
              }
              catch (e) {
                xmlDoc = undefined;
              }

              if (!xmlDoc || xmlDoc.getElementsByTagName('parsererror').length) {
                callback('Unable to parse SVG file: ' + url);
                return false;
              }
              else {
                // Cache it
                svgCache[url] = xmlDoc.documentElement;
              }
            }

            // We've loaded a new asset, so process any requests waiting for it
            processRequestQueue(url);
          }
          else {
            callback('There was a problem injecting the SVG: ' + httpRequest.status + ' ' + httpRequest.statusText);
            return false;
          }
        }
      };

      httpRequest.open('GET', url);

      // Treat and parse the response as XML, even if the
      // server sends us a different mimetype
      if (httpRequest.overrideMimeType) httpRequest.overrideMimeType('text/xml');

      httpRequest.send();
    }
  };

  // Inject a single element
  var injectElement = function (el, evalScripts, pngFallback, callback) {

    // Grab the src or data-src attribute
    var imgUrl = el.getAttribute('data-src') || el.getAttribute('src');

    // We can only inject SVG
    if (!(/\.svg/i).test(imgUrl)) {
      callback('Attempted to inject a file with a non-svg extension: ' + imgUrl);
      return;
    }

    // If we don't have SVG support try to fall back to a png,
    // either defined per-element via data-fallback or data-png,
    // or globally via the pngFallback directory setting
    if (!hasSvgSupport) {
      var perElementFallback = el.getAttribute('data-fallback') || el.getAttribute('data-png');

      // Per-element specific PNG fallback defined, so use that
      if (perElementFallback) {
        el.setAttribute('src', perElementFallback);
        callback(null);
      }
      // Global PNG fallback directoriy defined, use the same-named PNG
      else if (pngFallback) {
        el.setAttribute('src', pngFallback + '/' + imgUrl.split('/').pop().replace('.svg', '.png'));
        callback(null);
      }
      // um...
      else {
        callback('This browser does not support SVG and no PNG fallback was defined.');
      }

      return;
    }

    // Make sure we aren't already in the process of injecting this element to
    // avoid a race condition if multiple injections for the same element are run.
    // :NOTE: Using indexOf() only _after_ we check for SVG support and bail,
    // so no need for IE8 indexOf() polyfill
    if (injectedElements.indexOf(el) !== -1) {
      return;
    }

    // Remember the request to inject this element, in case other injection
    // calls are also trying to replace this element before we finish
    injectedElements.push(el);

    // Try to avoid loading the orginal image src if possible.
    el.setAttribute('src', '');

    // Load it up
    loadSvg(imgUrl, function (svg) {

      if (typeof svg === 'undefined' || typeof svg === 'string') {
        callback(svg);
        return false;
      }

      var imgId = el.getAttribute('id');
      if (imgId) {
        svg.setAttribute('id', imgId);
      }

      var imgTitle = el.getAttribute('title');
      if (imgTitle) {
        svg.setAttribute('title', imgTitle);
      }

      // Concat the SVG classes + 'injected-svg' + the img classes
      var classMerge = [].concat(svg.getAttribute('class') || [], 'injected-svg', el.getAttribute('class') || []).join(' ');
      svg.setAttribute('class', uniqueClasses(classMerge));

      var imgStyle = el.getAttribute('style');
      if (imgStyle) {
        svg.setAttribute('style', imgStyle);
      }

      // Copy all the data elements to the svg
      var imgData = [].filter.call(el.attributes, function (at) {
        return (/^data-\w[\w\-]*$/).test(at.name);
      });
      forEach.call(imgData, function (dataAttr) {
        if (dataAttr.name && dataAttr.value) {
          svg.setAttribute(dataAttr.name, dataAttr.value);
        }
      });

      // Make sure any internally referenced clipPath ids and their
      // clip-path references are unique.
      //
      // This addresses the issue of having multiple instances of the
      // same SVG on a page and only the first clipPath id is referenced.
      //
      // Browsers often shortcut the SVG Spec and don't use clipPaths
      // contained in parent elements that are hidden, so if you hide the first
      // SVG instance on the page, then all other instances lose their clipping.
      // Reference: https://bugzilla.mozilla.org/show_bug.cgi?id=376027
      var clipPaths = svg.querySelectorAll('defs clipPath[id]');
      var newClipPathName;
      for (var g = 0, clipPathsLen = clipPaths.length; g < clipPathsLen; g++) {
        newClipPathName = clipPaths[g].id + '-' + injectCount;
        // :NOTE: using a substring match attr selector here to deal with IE "adding extra quotes in url() attrs"
        var usingClipPath = svg.querySelectorAll('[clip-path*="' + clipPaths[g].id + '"]');
        for (var h = 0, usingClipPathLen = usingClipPath.length; h < usingClipPathLen; h++) {
          usingClipPath[h].setAttribute('clip-path', 'url(#' + newClipPathName + ')');
        }
        clipPaths[g].id = newClipPathName;
      }

      // Do the same for masks
      var masks = svg.querySelectorAll('defs mask[id]');
      var newMaskName;
      for (var i = 0, masksLen = masks.length; i < masksLen; i++) {
        newMaskName = masks[i].id + '-' + injectCount;
        // :NOTE: using a substring match attr selector here to deal with IE "adding extra quotes in url() attrs"
        var usingMask = svg.querySelectorAll('[mask*="' + masks[i].id + '"]');
        for (var j = 0, usingMaskLen = usingMask.length; j < usingMaskLen; j++) {
          usingMask[j].setAttribute('mask', 'url(#' + newMaskName + ')');
        }
        masks[i].id = newMaskName;
      }

      // Remove any unwanted/invalid namespaces that might have been added by SVG editing tools
      svg.removeAttribute('xmlns:a');

      // Post page load injected SVGs don't automatically have their script
      // elements run, so we'll need to make that happen, if requested

      // Find then prune the scripts
      var scripts = svg.querySelectorAll('script');
      var scriptsToEval = [];
      var script, scriptType;

      for (var k = 0, scriptsLen = scripts.length; k < scriptsLen; k++) {
        scriptType = scripts[k].getAttribute('type');

        // Only process javascript types.
        // SVG defaults to 'application/ecmascript' for unset types
        if (!scriptType || scriptType === 'application/ecmascript' || scriptType === 'application/javascript') {

          // innerText for IE, textContent for other browsers
          script = scripts[k].innerText || scripts[k].textContent;

          // Stash
          scriptsToEval.push(script);

          // Tidy up and remove the script element since we don't need it anymore
          svg.removeChild(scripts[k]);
        }
      }

      // Run/Eval the scripts if needed
      if (scriptsToEval.length > 0 && (evalScripts === 'always' || (evalScripts === 'once' && !ranScripts[imgUrl]))) {
        for (var l = 0, scriptsToEvalLen = scriptsToEval.length; l < scriptsToEvalLen; l++) {

          // :NOTE: Yup, this is a form of eval, but it is being used to eval code
          // the caller has explictely asked to be loaded, and the code is in a caller
          // defined SVG file... not raw user input.
          //
          // Also, the code is evaluated in a closure and not in the global scope.
          // If you need to put something in global scope, use 'window'
          new Function(scriptsToEval[l])(window); // jshint ignore:line
        }

        // Remember we already ran scripts for this svg
        ranScripts[imgUrl] = true;
      }

      // Replace the image with the svg
      el.parentNode.replaceChild(svg, el);

      // Now that we no longer need it, drop references
      // to the original element so it can be GC'd
      delete injectedElements[injectedElements.indexOf(el)];
      el = null;

      // Increment the injected count
      injectCount++;

      callback(svg);
    });
  };

  /**
   * SVGInjector
   *
   * Replace the given elements with their full inline SVG DOM elements.
   *
   * :NOTE: We are using get/setAttribute with SVG because the SVG DOM spec differs from HTML DOM and
   * can return other unexpected object types when trying to directly access svg properties.
   * ex: "className" returns a SVGAnimatedString with the class value found in the "baseVal" property,
   * instead of simple string like with HTML Elements.
   *
   * @param {mixes} Array of or single DOM element
   * @param {object} options
   * @param {function} callback
   * @return {object} Instance of SVGInjector
   */
  var SVGInjector = function (elements, options, done) {

    // Options & defaults
    options = options || {};

    // Should we run the scripts blocks found in the SVG
    // 'always' - Run them every time
    // 'once' - Only run scripts once for each SVG
    // [false|'never'] - Ignore scripts
    var evalScripts = options.evalScripts || 'always';

    // Location of fallback pngs, if desired
    var pngFallback = options.pngFallback || false;

    // Callback to run during each SVG injection, returning the SVG injected
    var eachCallback = options.each;

    // Do the injection...
    if (elements.length !== undefined) {
      var elementsLoaded = 0;
      forEach.call(elements, function (element) {
        injectElement(element, evalScripts, pngFallback, function (svg) {
          if (eachCallback && typeof eachCallback === 'function') eachCallback(svg);
          if (done && elements.length === ++elementsLoaded) done(elementsLoaded);
        });
      });
    }
    else {
      if (elements) {
        injectElement(elements, evalScripts, pngFallback, function (svg) {
          if (eachCallback && typeof eachCallback === 'function') eachCallback(svg);
          if (done) done(1);
          elements = null;
        });
      }
      else {
        if (done) done(0);
      }
    }
  };

  /* global module, exports: true, define */
  // Node.js or CommonJS
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = exports = SVGInjector;
  }
  // AMD support
  else if (typeof define === 'function' && define.amd) {
    define(function () {
      return SVGInjector;
    });
  }
  // Otherwise, attach to window as global
  else if (typeof window === 'object') {
    window.SVGInjector = SVGInjector;
  }
  /* global -module, -exports, -define */

}(window, document));

/* 
 * Selecter v3.2.4 - 2015-01-07 
 * A jQuery plugin for replacing default select elements. Part of the Formstone Library. 
 * http://formstone.it/selecter/ 
 * 
 * Copyright 2015 Ben Plum; MIT Licensed 
 */

;(function ($, window) {
	"use strict";

	var guid = 0,
		userAgent = (window.navigator.userAgent||window.navigator.vendor||window.opera),
		isFirefox = /Firefox/i.test(userAgent),
		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(userAgent),
		isFirefoxMobile = (isFirefox && isMobile),
		$body = null;

	/**
	 * @options
	 * @param callback [function] <$.noop> "Select item callback"
	 * @param cover [boolean] <false> "Cover handle with option set"
	 * @param customClass [string] <''> "Class applied to instance"
	 * @param label [string] <''> "Label displayed before selection"
	 * @param external [boolean] <false> "Open options as links in new window"
	 * @param links [boolean] <false> "Open options as links in same window"
	 * @param mobile [boolean] <false> "Force desktop interaction on mobile"
	 * @param trim [int] <0> "Trim options to specified length; 0 to disable”
	 */
	var options = {
		callback: $.noop,
		cover: false,
		customClass: "",
		label: "",
		external: false,
		links: false,
		mobile: false,
		trim: 0
	};

	var pub = {

		/**
		 * @method
		 * @name defaults
		 * @description Sets default plugin options
		 * @param opts [object] <{}> "Options object"
		 * @example $.selecter("defaults", opts);
		 */
		defaults: function(opts) {
			options = $.extend(options, opts || {});
			return (typeof this === 'object') ? $(this) : true;
		},

		/**
		 * @method
		 * @name disable
		 * @description Disables target instance or option
		 * @param option [string] <null> "Target option value"
		 * @example $(".target").selecter("disable", "1");
		 */
		disable: function(option) {
			return $(this).each(function(i, input) {
				var data = $(input).parent(".selecter").data("selecter");

				if (data) {
					if (typeof option !== "undefined") {
						var index = data.$items.index( data.$items.filter("[data-value=" + option + "]") );

						data.$items.eq(index).addClass("disabled");
						data.$options.eq(index).prop("disabled", true);
					} else {
						if (data.$selecter.hasClass("open")) {
							data.$selecter.find(".selecter-selected").trigger("click.selecter");
						}

						data.$selecter.addClass("disabled");
						data.$select.prop("disabled", true);
					}
				}
			});
		},

		/**
		 * @method
		 * @name destroy
		 * @description Removes instance of plugin
		 * @example $(".target").selecter("destroy");
		 */
		destroy: function() {
			return $(this).each(function(i, input) {
				var data = $(input).parent(".selecter").data("selecter");

				if (data) {
					if (data.$selecter.hasClass("open")) {
						data.$selecter.find(".selecter-selected").trigger("click.selecter");
					}

					// Scroller support
					if ($.fn.scroller !== undefined) {
						data.$selecter.find(".selecter-options").scroller("destroy");
					}

					data.$select[0].tabIndex = data.tabIndex;

					data.$select.find(".selecter-placeholder").remove();
					data.$selected.remove();
					data.$itemsWrapper.remove();

					data.$selecter.off(".selecter");

					data.$select.off(".selecter")
								.removeClass("selecter-element")
								.show()
								.unwrap();
				}
			});
		},

		/**
		 * @method
		 * @name enable
		 * @description Enables target instance or option
		 * @param option [string] <null> "Target option value"
		 * @example $(".target").selecter("enable", "1");
		 */
		enable: function(option) {
			return $(this).each(function(i, input) {
				var data = $(input).parent(".selecter").data("selecter");

				if (data) {
					if (typeof option !== "undefined") {
						var index = data.$items.index( data.$items.filter("[data-value=" + option + "]") );
						data.$items.eq(index).removeClass("disabled");
						data.$options.eq(index).prop("disabled", false);
					} else {
						data.$selecter.removeClass("disabled");
						data.$select.prop("disabled", false);
					}
				}
			});
		},


		/**
		* @method private
		* @name refresh
		* @description DEPRECATED - Updates instance base on target options
		* @example $(".target").selecter("refresh");
		*/
		refresh: function() {
			return pub.update.apply($(this));
		},

		/**
		* @method
		* @name update
		* @description Updates instance base on target options
		* @example $(".target").selecter("update");
		*/
		update: function() {
			return $(this).each(function(i, input) {
				var data = $(input).parent(".selecter").data("selecter");

				if (data) {
					var index = data.index;

					data.$allOptions = data.$select.find("option, optgroup");
					data.$options = data.$allOptions.filter("option");
					data.index = -1;

					index = data.$options.index(data.$options.filter(":selected"));

					_buildOptions(data);

					if (!data.multiple) {
						_update(index, data);
					}
				}
			});
		}
	};

	/**
	 * @method private
	 * @name _init
	 * @description Initializes plugin
	 * @param opts [object] "Initialization options"
	 */
	function _init(opts) {
		// Local options
		opts = $.extend({}, options, opts || {});

		// Check for Body
		if ($body === null) {
			$body = $("body");
		}

		// Apply to each element
		var $items = $(this);
		for (var i = 0, count = $items.length; i < count; i++) {
			_build($items.eq(i), opts);
		}
		return $items;
	}

	/**
	 * @method private
	 * @name _build
	 * @description Builds each instance
	 * @param $select [jQuery object] "Target jQuery object"
	 * @param opts [object] <{}> "Options object"
	 */
	function _build($select, opts) {
		if (!$select.hasClass("selecter-element")) {
			// EXTEND OPTIONS
			opts = $.extend({}, opts, $select.data("selecter-options"));

			opts.multiple = $select.prop("multiple");
			opts.disabled = $select.is(":disabled");

			if (opts.external) {
				opts.links = true;
			}

			// Grab true original index, only if selected attribute exits
			var $originalOption = $select.find("[selected]").not(":disabled"),
				originalOptionIndex = $select.find("option").index($originalOption);

			if (!opts.multiple && opts.label !== "") {
				$select.prepend('<option value="" class="selecter-placeholder" selected>' + opts.label + '</option>');
				if (originalOptionIndex > -1) {
					originalOptionIndex++;
				}
			} else {
				opts.label = "";
			}

			// Build options array
			var $allOptions = $select.find("option, optgroup"),
				$options = $allOptions.filter("option");

			// If we didn't actually have a selected elemtn
			if (!$originalOption.length) {
				$originalOption = $options.eq(0);
			}

			// Determine original item
			var originalIndex = (originalOptionIndex > -1) ? originalOptionIndex : 0,
				originalLabel = (opts.label !== "") ? opts.label : $originalOption.text(),
				wrapperTag = "div";

			// Swap tab index, no more interacting with the actual select!
			opts.tabIndex = $select[0].tabIndex;
			$select[0].tabIndex = -1;

			// Build HTML
			var inner = "",
				wrapper = "";

			// Build wrapper
			wrapper += '<' + wrapperTag + ' class="selecter ' + opts.customClass;
			// Special case classes
			if (isMobile) {
				wrapper += ' mobile';
			} else if (opts.cover) {
				wrapper += ' cover';
			}
			if (opts.multiple) {
				wrapper += ' multiple';
			} else {
				wrapper += ' closed';
			}
			if (opts.disabled) {
				wrapper += ' disabled';
			}
			wrapper += '" tabindex="' + opts.tabIndex + '">';
			wrapper += '</' + wrapperTag + '>';

			// Build inner
			if (!opts.multiple) {
				inner += '<span class="selecter-selected">';
				inner += $('<span></span>').text( _trim(originalLabel, opts.trim) ).html();
				inner += '</span>';
			}
			inner += '<div class="selecter-options">';
			inner += '</div>';

			// Modify DOM
			$select.addClass("selecter-element")
				   .wrap(wrapper)
				   .after(inner);

			// Store plugin data
			var $selecter = $select.parent(".selecter"),
				data = $.extend({
					$select: $select,
					$allOptions: $allOptions,
					$options: $options,
					$selecter: $selecter,
					$selected: $selecter.find(".selecter-selected"),
					$itemsWrapper: $selecter.find(".selecter-options"),
					index: -1,
					guid: guid++
				}, opts);

			_buildOptions(data);

			if (!data.multiple) {
				_update(originalIndex, data);
			}

			// Scroller support
			if ($.fn.scroller !== undefined) {
				data.$itemsWrapper.scroller();
			}

			// Bind click events
			data.$selecter.on("touchstart.selecter", ".selecter-selected", data, _onTouchStart)
						  .on("click.selecter", ".selecter-selected", data, _onClick)
						  .on("click.selecter", ".selecter-item", data, _onSelect)
						  .on("close.selecter", data, _onClose)
						  .data("selecter", data);

			// Change events
			data.$select.on("change.selecter", data, _onChange);

			// Focus/Blur events
			if (!isMobile) {
				data.$selecter.on("focusin.selecter", data, _onFocus)
							  .on("blur.selecter", data, _onBlur);

				// Handle clicks to associated labels
				data.$select.on("focusin.selecter", data, function(e) {
					e.data.$selecter.trigger("focus");
				});
			}
		}
	}

	/**
	 * @method private
	 * @name _buildOptions
	 * @description Builds instance's option set
	 * @param data [object] "Instance data"
	 */
	function _buildOptions(data) {
		var html = '',
			itemTag = (data.links) ? "a" : "span",
			j = 0;

		for (var i = 0, count = data.$allOptions.length; i < count; i++) {
			var $op = data.$allOptions.eq(i);

			// Option group
			if ($op[0].tagName === "OPTGROUP") {
				html += '<span class="selecter-group';
				// Disabled groups
				if ($op.is(":disabled")) {
					html += ' disabled';
				}
				html += '">' + $op.attr("label") + '</span>';
			} else {
				var opVal = $op.val();

				if (!$op.attr("value")) {
					$op.attr("value", opVal);
				}

				html += '<' + itemTag + ' class="selecter-item';
				if ($op.hasClass('selecter-placeholder')) {
					html += ' placeholder';
				}
				// Default selected value - now handles multi's thanks to @kuilkoff
				if ($op.is(':selected')) {
					html += ' selected';
				}
				// Disabled options
				if ($op.is(":disabled")) {
					html += ' disabled';
				}
				html += '" ';
				if (data.links) {
					html += 'href="' + opVal + '"';
				} else {
					html += 'data-value="' + opVal + '"';
				}
				html += '>' + $("<span></span>").text( _trim($op.text(), data.trim) ).html() + '</' + itemTag + '>';
				j++;
			}
		}

		data.$itemsWrapper.html(html);
		data.$items = data.$selecter.find(".selecter-item");
	}

	/**
	 * @method private
	 * @name _onTouchStart
	 * @description Handles touchstart to selected item
	 * @param e [object] "Event data"
	 */
	function _onTouchStart(e) {
		e.stopPropagation();

		var data = e.data;

		data.touchStartEvent = e.originalEvent;

		data.touchStartX = data.touchStartEvent.touches[0].clientX;
		data.touchStartY = data.touchStartEvent.touches[0].clientY;

		data.$selecter.on("touchmove.selecter", ".selecter-selected", data, _onTouchMove)
					  .on("touchend.selecter", ".selecter-selected", data, _onTouchEnd);
	}

	/**
	 * @method private
	 * @name _onTouchMove
	 * @description Handles touchmove to selected item
	 * @param e [object] "Event data"
	 */
	function _onTouchMove(e) {
		var data = e.data,
			oe = e.originalEvent;

		if (Math.abs(oe.touches[0].clientX - data.touchStartX) > 10 || Math.abs(oe.touches[0].clientY - data.touchStartY) > 10) {
			data.$selecter.off("touchmove.selecter touchend.selecter");
		}
	}

	/**
	 * @method private
	 * @name _onTouchEnd
	 * @description Handles touchend to selected item
	 * @param e [object] "Event data"
	 */
	function _onTouchEnd(e) {
		var data = e.data;

		data.touchStartEvent.preventDefault();

		data.$selecter.off("touchmove.selecter touchend.selecter");

		_onClick(e);
	}

	/**
	 * @method private
	 * @name _onClick
	 * @description Handles click to selected item
	 * @param e [object] "Event data"
	 */
	function _onClick(e) {
		e.preventDefault();
		e.stopPropagation();

		var data = e.data;

		if (!data.$select.is(":disabled")) {
			$(".selecter").not(data.$selecter).trigger("close.selecter", [data]);

			// Handle mobile, but not Firefox, unless desktop forced
			if (!data.mobile && isMobile && !isFirefoxMobile) {
				var el = data.$select[0];
				if (window.document.createEvent) { // All
					var evt = window.document.createEvent("MouseEvents");
					evt.initMouseEvent("mousedown", false, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					el.dispatchEvent(evt);
				} else if (el.fireEvent) { // IE
					el.fireEvent("onmousedown");
				}
			} else {
				// Delegate intent
				if (data.$selecter.hasClass("closed")) {
					_onOpen(e);
				} else if (data.$selecter.hasClass("open")) {
					_onClose(e);
				}
			}
		}
	}

	/**
	 * @method private
	 * @name _onOpen
	 * @description Opens option set
	 * @param e [object] "Event data"
	 */
	function _onOpen(e) {
		e.preventDefault();
		e.stopPropagation();

		var data = e.data;

		// Make sure it's not alerady open
		if (!data.$selecter.hasClass("open")) {
			var offset = data.$selecter.offset(),
				bodyHeight = $body.outerHeight(),
				optionsHeight = data.$itemsWrapper.outerHeight(true),
				selectedOffset = (data.index >= 0) ? data.$items.eq(data.index).position() : { left: 0, top: 0 };

			// Calculate bottom of document
			if (offset.top + optionsHeight > bodyHeight) {
				data.$selecter.addClass("bottom");
			}

			data.$itemsWrapper.show();

			// Bind Events
			data.$selecter.removeClass("closed")
						  .addClass("open");
			$body.on("click.selecter-" + data.guid, ":not(.selecter-options)", data, _onCloseHelper);

			_scrollOptions(data);
		}
	}

	/**
	 * @method private
	 * @name _onCloseHelper
	 * @description Determines if event target is outside instance before closing
	 * @param e [object] "Event data"
	 */
	function _onCloseHelper(e) {
		e.preventDefault();
		e.stopPropagation();

		if ($(e.currentTarget).parents(".selecter").length === 0) {
			_onClose(e);
		}
	}

	/**
	 * @method private
	 * @name _onClose
	 * @description Closes option set
	 * @param e [object] "Event data"
	 */
	function _onClose(e) {
		e.preventDefault();
		e.stopPropagation();

		var data = e.data;

		// Make sure it's actually open
		if (data.$selecter.hasClass("open")) {
			data.$itemsWrapper.hide();
			data.$selecter.removeClass("open bottom")
						  .addClass("closed");

			$body.off(".selecter-" + data.guid);
		}
	}

	/**
	 * @method private
	 * @name _onSelect
	 * @description Handles option select
	 * @param e [object] "Event data"
	 */
	function _onSelect(e) {
		e.preventDefault();
		e.stopPropagation();

		var $target = $(this),
			data = e.data;

		if (!data.$select.is(":disabled")) {
			if (data.$itemsWrapper.is(":visible")) {
				// Update
				var index = data.$items.index($target);

				if (index !== data.index) {
					_update(index, data);
					_handleChange(data);
				}
			}

			if (!data.multiple) {
				// Clean up
				_onClose(e);
			}
		}
	}

	/**
	 * @method private
	 * @name _onChange
	 * @description Handles external changes
	 * @param e [object] "Event data"
	 */
	function _onChange(e, internal) {
		var $target = $(this),
			data = e.data;

		if (!internal && !data.multiple) {
			var index = data.$options.index(data.$options.filter("[value='" + _escape($target.val()) + "']"));

			_update(index, data);
			_handleChange(data);
		}
	}

	/**
	 * @method private
	 * @name _onFocus
	 * @description Handles instance focus
	 * @param e [object] "Event data"
	 */
	function _onFocus(e) {
		e.preventDefault();
		e.stopPropagation();

		var data = e.data;

		if (!data.$select.is(":disabled") && !data.multiple) {
			data.$selecter.addClass("focus")
						  .on("keydown.selecter-" + data.guid, data, _onKeypress);

			$(".selecter").not(data.$selecter)
						  .trigger("close.selecter", [ data ]);
		}
	}

	/**
	 * @method private
	 * @name _onBlur
	 * @description Handles instance focus
	 * @param e [object] "Event data"
	 */
	function _onBlur(e, internal, two) {
		e.preventDefault();
		e.stopPropagation();

		var data = e.data;

		data.$selecter.removeClass("focus")
					  .off("keydown.selecter-" + data.guid);

		$(".selecter").not(data.$selecter)
					  .trigger("close.selecter", [ data ]);
	}

	/**
	 * @method private
	 * @name _onKeypress
	 * @description Handles instance keypress, once focused
	 * @param e [object] "Event data"
	 */
	function _onKeypress(e) {
		var data = e.data;

		if (e.keyCode === 13) {
			if (data.$selecter.hasClass("open")) {
				_onClose(e);
				_update(data.index, data);
			}
			_handleChange(data);
		} else if (e.keyCode !== 9 && (!e.metaKey && !e.altKey && !e.ctrlKey && !e.shiftKey)) {
			// Ignore modifiers & tabs
			e.preventDefault();
			e.stopPropagation();

			var total = data.$items.length - 1,
				index = (data.index < 0) ? 0 : data.index;

			// Firefox left/right support thanks to Kylemade
			if ($.inArray(e.keyCode, (isFirefox) ? [38, 40, 37, 39] : [38, 40]) > -1) {
				// Increment / decrement using the arrow keys
				index = index + ((e.keyCode === 38 || (isFirefox && e.keyCode === 37)) ? -1 : 1);

				if (index < 0) {
					index = 0;
				}
				if (index > total) {
					index = total;
				}
			} else {
				var input = String.fromCharCode(e.keyCode).toUpperCase(),
					letter,
					i;

				// Search for input from original index
				for (i = data.index + 1; i <= total; i++) {
					letter = data.$options.eq(i).text().charAt(0).toUpperCase();
					if (letter === input) {
						index = i;
						break;
					}
				}

				// If not, start from the beginning
				if (index < 0 || index === data.index) {
					for (i = 0; i <= total; i++) {
						letter = data.$options.eq(i).text().charAt(0).toUpperCase();
						if (letter === input) {
							index = i;
							break;
						}
					}
				}
			}

			// Update
			if (index >= 0) {
				_update(index, data);
				_scrollOptions(data);
			}
		}
	}

	/**
	 * @method private
	 * @name _update
	 * @description Updates instance based on new target index
	 * @param index [int] "Selected option index"
	 * @param data [object] "instance data"
	 */
	function _update(index, data) {
		var $item = data.$items.eq(index),
			isSelected = $item.hasClass("selected"),
			isDisabled = $item.hasClass("disabled");

		// Check for disabled options
		if (!isDisabled) {
			if (data.multiple) {
				if (isSelected) {
					data.$options.eq(index).prop("selected", null);
					$item.removeClass("selected");
				} else {
					data.$options.eq(index).prop("selected", true);
					$item.addClass("selected");
				}
			} else if (index > -1 && index < data.$items.length) {
				var newLabel = $item.html(),
					newValue = $item.data("value");

				data.$selected.html(newLabel)
							  .removeClass('placeholder');

				data.$items.filter(".selected")
						   .removeClass("selected");

				data.$select[0].selectedIndex = index;

				$item.addClass("selected");
				data.index = index;
			} else if (data.label !== "") {
				data.$selected.html(data.label);
			}
		}
	}

	/**
	 * @method private
	 * @name _scrollOptions
	 * @description Scrolls options wrapper to specific option
	 * @param data [object] "Instance data"
	 */
	function _scrollOptions(data) {
		var $selected = data.$items.eq(data.index),
			selectedOffset = (data.index >= 0 && !$selected.hasClass("placeholder")) ? $selected.position() : { left: 0, top: 0 };

		if ($.fn.scroller !== undefined) {
			data.$itemsWrapper.scroller("scroll", (data.$itemsWrapper.find(".scroller-content").scrollTop() + selectedOffset.top), 0)
							  .scroller("reset");
		} else {
			data.$itemsWrapper.scrollTop( data.$itemsWrapper.scrollTop() + selectedOffset.top );
		}
	}

	/**
	 * @method private
	 * @name _handleChange
	 * @description Handles change events
	 * @param data [object] "Instance data"
	 */
	function _handleChange(data) {
		if (data.links) {
			_launch(data);
		} else {
			data.callback.call(data.$selecter, data.$select.val(), data.index);
			data.$select.trigger("change", [ true ]);
		}
	}

	/**
	 * @method private
	 * @name _launch
	 * @description Launches link
	 * @param data [object] "Instance data"
	 */
	function _launch(data) {
		//var url = (isMobile) ? data.$select.val() : data.$options.filter(":selected").attr("href");
		var url = data.$select.val();

		if (data.external) {
			// Open link in a new tab/window
			window.open(url);
		} else {
			// Open link in same tab/window
			window.location.href = url;
		}
	}

	/**
	 * @method private
	 * @name _trim
	 * @description Trims text, if specified length is greater then 0
	 * @param length [int] "Length to trim at"
	 * @param text [string] "Text to trim"
	 * @return [string] "Trimmed string"
	 */
	function _trim(text, length) {
		if (length === 0) {
			return text;
		} else {
			if (text.length > length) {
				return text.substring(0, length) + "...";
			} else {
				return text;
			}
		}
	}

	/**
	 * @method private
	 * @name _escape
	 * @description Escapes text
	 * @param text [string] "Text to escape"
	 */
	function _escape(text) {
		return (typeof text === "string") ? text.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1') : text;
	}

	$.fn.selecter = function(method) {
		if (pub[method]) {
			return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return _init.apply(this, arguments);
		}
		return this;
	};

	$.selecter = function(method) {
		if (method === "defaults") {
			pub.defaults.apply(this, Array.prototype.slice.call(arguments, 1));
		}
	};
})(jQuery, window);
