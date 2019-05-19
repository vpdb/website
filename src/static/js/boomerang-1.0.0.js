/**
 * @copyright (c) 2011, Yahoo! Inc.  All rights reserved.
 * @copyright (c) 2012, Log-Normal, Inc.  All rights reserved.
 * @copyright (c) 2012-2017, SOASTA, Inc. All rights reserved.
 * @copyright (c) 2017, Akamai Technologies, Inc. All rights reserved.
 * Copyrights licensed under the BSD License. See the accompanying LICENSE.txt file for terms.
 */

/**
 * @class BOOMR
 * @desc
 * boomerang measures various performance characteristics of your user's browsing
 * experience and beacons it back to your server.
 *
 * To use this you'll need a web site, lots of users and the ability to do
 * something with the data you collect.  How you collect the data is up to
 * you, but we have a few ideas.
 *
 * Everything in boomerang is accessed through the `BOOMR` object, which is
 * available on `window.BOOMR`.  It contains the public API, utility functions
 * ({@link BOOMR.utils}) and all of the plugins ({@link BOOMR.plugins}).
 *
 * Each plugin has its own API, but is reachable through {@link BOOMR.plugins}.
 *
 * ## Beacon Parameters
 *
 * The core boomerang object will add the following parameters to the beacon.
 *
 * Note that each individual {@link BOOMR.plugins plugin} will add its own
 * parameters as well.
 *
 * * `v`: Boomerang version
 * * `sv`: Boomerang Loader Snippet version
 * * `sm`: Boomerang Loader Snippet method
 * * `u`: The page's URL (for most beacons), or the `XMLHttpRequest` URL
 * * `pgu`: The page's URL (for `XMLHttpRequest` beacons)
 * * `pid`: Page ID (8 characters)
 * * `r`: Navigation referrer (from `document.location`)
 * * `vis.pre`: `1` if the page transitioned from prerender to visible
 * * `xhr.pg`: The `XMLHttpRequest` page group
 * * `errors`: Error messages of errors detected in Boomerang code, separated by a newline
 */

/**
 * @typedef TimeStamp
 * @type {number}
 *
 * @desc
 * A [Unix Epoch](https://en.wikipedia.org/wiki/Unix_time) timestamp (milliseconds
 * since 1970) created by [BOOMR.now()]{@link BOOMR.now}.
 *
 * If `DOMHighResTimeStamp` (`performance.now()`) is supported, it is
 * a `DOMHighResTimeStamp` (with microsecond resolution in the fractional),
 * otherwise, it is `Date.now()`.
 */



/**
 * @global
 * @type {TimeStamp}
 * @desc
 * Timestamp the boomerang.js script started executing.
 *
 * This has to be global so that we don't wait for this entire
 * script to download and execute before measuring the
 * time.  We also declare it without `var` so that we can later
 * `delete` it.  This is the only way that works on Internet Explorer.
 */
BOOMR_start = new Date().getTime();

/**
 * @function
 * @global
 * @desc
 * Check the value of `document.domain` and fix it if incorrect.
 *
 * This function is run at the top of boomerang, and then whenever
 * {@link BOOMR.init} is called.  If boomerang is running within an IFRAME, this
 * function checks to see if it can access elements in the parent
 * IFRAME.  If not, it will fudge around with `document.domain` until
 * it finds a value that works.
 *
 * This allows site owners to change the value of `document.domain` at
 * any point within their page's load process, and we will adapt to
 * it.
 *
 * @param {string} domain Domain name as retrieved from page URL
 */
function BOOMR_check_doc_domain(domain) {
	/*eslint no-unused-vars:0*/
	var test;



	if (!window) {
		return;
	}

	// If domain is not passed in, then this is a global call
	// domain is only passed in if we call ourselves, so we
	// skip the frame check at that point
	if (!domain) {
		// If we're running in the main window, then we don't need this
		if (window.parent === window || !document.getElementById("boomr-if-as")) {
			return;// true;	// nothing to do
		}

		if (window.BOOMR && BOOMR.boomerang_frame && BOOMR.window) {
			try {
				// If document.domain is changed during page load (from www.blah.com to blah.com, for example),
				// BOOMR.window.location.href throws "Permission Denied" in IE.
				// Resetting the inner domain to match the outer makes location accessible once again
				if (BOOMR.boomerang_frame.document.domain !== BOOMR.window.document.domain) {
					BOOMR.boomerang_frame.document.domain = BOOMR.window.document.domain;
				}
			}
			catch (err) {
				if (!BOOMR.isCrossOriginError(err)) {
					BOOMR.addError(err, "BOOMR_check_doc_domain.domainFix");
				}
			}
		}
		domain = document.domain;
	}

	if (!domain || domain.indexOf(".") === -1) {
		return;// false;	// not okay, but we did our best
	}

	// window.parent might be null if we're running during unload from
	// a detached iframe
	if (!window.parent) {
		return;
	}

	// 1. Test without setting document.domain
	try {
		test = window.parent.document;
		return;// test !== undefined;	// all okay
	}
	// 2. Test with document.domain
	catch (err) {
		try {
			document.domain = domain;
		}
		catch (err2) {
			// An exception might be thrown if the document is unloaded
			// or when the domain is incorrect.  If so, we can't do anything
			// more, so bail.
			return;
		}
	}

	try {
		test = window.parent.document;
		return;// test !== undefined;	// all okay
	}
	// 3. Strip off leading part and try again
	catch (err) {
		domain = domain.replace(/^[\w\-]+\./, "");
	}

	BOOMR_check_doc_domain(domain);
}

BOOMR_check_doc_domain();

// Construct BOOMR
// w is window
(function(w) {
	var impl, boomr, d, createCustomEvent, dispatchEvent, visibilityState, visibilityChange, orig_w = w;

	// If the window that boomerang is running in is not top level (ie, we're running in an iframe)
	// and if this iframe contains a script node with an id of "boomr-if-as",
	// Then that indicates that we are using the iframe loader, so the page we're trying to measure
	// is w.parent
	//
	// Note that we use `document` rather than `w.document` because we're specifically interested in
	// the document of the currently executing context rather than a passed in proxy.
	//
	// The only other place we do this is in `BOOMR.utils.getMyURL` below, for the same reason, we
	// need the full URL of the currently executing (boomerang) script.
	if (w.parent !== w &&
	    document.getElementById("boomr-if-as") &&
	    document.getElementById("boomr-if-as").nodeName.toLowerCase() === "script") {
		w = w.parent;
	}

	d = w.document;

	// Short namespace because I don't want to keep typing BOOMERANG
	if (!w.BOOMR) {
		w.BOOMR = {};
	}

	BOOMR = w.BOOMR;

	// don't allow this code to be included twice
	if (BOOMR.version) {
		return;
	}

	/**
	 * Boomerang version, formatted as major.minor.patchlevel.
	 *
	 * This variable is replaced during build (`grunt build`).
	 *
	 * @type {string}
	 *
	 * @memberof BOOMR
	 */
	BOOMR.version = "1.0.0";

	/**
	 * The main document window.
	 * * If Boomerang was loaded in an IFRAME, this is the parent window
	 * * If Boomerang was loaded inline, this is the current window
	 *
	 * @type {Window}
	 *
	 * @memberof BOOMR
	 */
	BOOMR.window = w;

	/**
	 * The Boomerang frame:
	 * * If Boomerang was loaded in an IFRAME, this is the IFRAME
	 * * If Boomerang was loaded inline, this is the current window
	 *
	 * @type {Window}
	 *
	 * @memberof BOOMR
	 */
	BOOMR.boomerang_frame = orig_w;

	/**
	 * @class BOOMR.plugins
	 * @desc
	 * Boomerang plugin namespace.
	 *
	 * All plugins should add their plugin object to `BOOMR.plugins`.
	 *
	 * A plugin should have, at minimum, the following exported functions:
	 * * `init(config)`
	 * * `is_complete()`
	 *
	 * See {@tutorial creating-plugins} for details.
	 */
	if (!BOOMR.plugins) {
		BOOMR.plugins = {};
	}

	// CustomEvent proxy for IE9 & 10 from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
	(function() {
		try {
			if (new w.CustomEvent("CustomEvent") !== undefined) {
				createCustomEvent = function(e_name, params) {
					return new w.CustomEvent(e_name, params);
				};
			}
		}
		catch (ignore) {
			// empty
		}

		try {
			if (!createCustomEvent && d.createEvent && d.createEvent("CustomEvent")) {
				createCustomEvent = function(e_name, params) {
					var evt = d.createEvent("CustomEvent");
					params = params || { cancelable: false, bubbles: false };
					evt.initCustomEvent(e_name, params.bubbles, params.cancelable, params.detail);

					return evt;
				};
			}
		}
		catch (ignore) {
			// empty
		}

		if (!createCustomEvent && d.createEventObject) {
			createCustomEvent = function(e_name, params) {
				var evt = d.createEventObject();
				evt.type = evt.propertyName = e_name;
				evt.detail = params.detail;

				return evt;
			};
		}

		if (!createCustomEvent) {
			createCustomEvent = function() { return undefined; };
		}
	}());

	/**
	 * Dispatch a custom event to the browser
	 * @param {string} e_name The custom event name that consumers can subscribe to
	 * @param {object} e_data Any data passed to subscribers of the custom event via the `event.detail` property
	 * @param {boolean} async By default, custom events are dispatched immediately.
	 * Set to true if the event should be dispatched once the browser has finished its current
	 * JavaScript execution.
	 */
	dispatchEvent = function(e_name, e_data, async) {
		var ev = createCustomEvent(e_name, {"detail": e_data});
		if (!ev) {
			return;
		}

		function dispatch() {
			try {
				if (d.dispatchEvent) {
					d.dispatchEvent(ev);
				}
				else if (d.fireEvent) {
					d.fireEvent("onpropertychange", ev);
				}
			}
			catch (e) {

			}
		}

		if (async) {
			BOOMR.setImmediate(dispatch);
		}
		else {
			dispatch();
		}
	};

	// visibilitychange is useful to detect if the page loaded through prerender
	// or if the page never became visible
	// http://www.w3.org/TR/2011/WD-page-visibility-20110602/
	// http://www.nczonline.net/blog/2011/08/09/introduction-to-the-page-visibility-api/
	// https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API

	// Set the name of the hidden property and the change event for visibility
	if (typeof d.hidden !== "undefined") {
		visibilityState = "visibilityState";
		visibilityChange = "visibilitychange";
	}
	else if (typeof d.mozHidden !== "undefined") {
		visibilityState = "mozVisibilityState";
		visibilityChange = "mozvisibilitychange";
	}
	else if (typeof d.msHidden !== "undefined") {
		visibilityState = "msVisibilityState";
		visibilityChange = "msvisibilitychange";
	}
	else if (typeof d.webkitHidden !== "undefined") {
		visibilityState = "webkitVisibilityState";
		visibilityChange = "webkitvisibilitychange";
	}

	// impl is a private object not reachable from outside the BOOMR object.
	// Users can set properties by passing in to the init() method.
	impl = {
		// Beacon URL
		beacon_url: "",

		// Forces protocol-relative URLs to HTTPS
		beacon_url_force_https: true,

		// List of string regular expressions that must match the beacon_url.  If
		// not set, or the list is empty, all beacon URLs are allowed.
		beacon_urls_allowed: [],

		// Beacon request method, either GET, POST or AUTO. AUTO will check the
		// request size then use GET if the request URL is less than MAX_GET_LENGTH
		// chars. Otherwise, it will fall back to a POST request.
		beacon_type: "AUTO",

		// Beacon authorization key value. Most systems will use the 'Authentication'
		// keyword, but some some services use keys like 'X-Auth-Token' or other
		// custom keys.
		beacon_auth_key: "Authorization",

		// Beacon authorization token. This is only needed if your are using a POST
		// and the beacon requires an Authorization token to accept your data.  This
		// disables use of the browser sendBeacon() API.
		beacon_auth_token: undefined,

		// Sends beacons with Credentials (applies to XHR beacons, not IMG or `sendBeacon()`).
		// If you need this, you may want to enable `beacon_disable_sendbeacon` as
		// `sendBeacon()` does not support credentials.
		beacon_with_credentials: false,

		// Disables navigator.sendBeacon() support
		beacon_disable_sendbeacon: false,

		// Strip out everything except last two parts of hostname.
		// This doesn't work well for domains that end with a country tld,
		// but we allow the developer to override site_domain for that.
		// You can disable all cookies by setting site_domain to a falsy value.
		site_domain: w.location.hostname.
					replace(/.*?([^.]+\.[^.]+)\.?$/, "$1").
					toLowerCase(),

		// User's ip address determined on the server.  Used for the BW cookie.
		user_ip: "",

		// Whether or not to send beacons on page load
		autorun: true,

		// Whether or not we've sent a page load beacon
		hasSentPageLoadBeacon: false,

		// document.referrer
		r: undefined,

		// strip_query_string: false,

		// onloadfired: false,

		// handlers_attached: false,

		// waiting_for_config: false,

		events: {
			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired when the page is usable by the user.
			 *
			 * By default this is fired when `window.onload` fires, but if you
			 * set `autorun` to false when calling {@link BOOMR.init}, then you
			 * must explicitly fire this event by calling {@link BOOMR#event:page_ready}.
			 *
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onload}
			 * @event BOOMR#page_ready
			 * @property {Event} [event] Event triggering the page_ready
			 */
			"page_ready": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired just before the browser unloads the page.
			 *
			 * The first event of `window.pagehide`, `window.beforeunload`,
			 * or `window.unload` will trigger this.
			 *
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/Events/pagehide}
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload}
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunload}
			 * @event BOOMR#page_unload
			 */
			"page_unload": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired before the document is about to be unloaded.
			 *
			 * `window.beforeunload` will trigger this.
			 *
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload}
			 * @event BOOMR#before_unload
			 */
			"before_unload": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired on `document.DOMContentLoaded`.
			 *
			 * The `DOMContentLoaded` event is fired when the initial HTML document
			 * has been completely loaded and parsed, without waiting for stylesheets,
			 * images, and subframes to finish loading
			 *
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded}
			 * @event BOOMR#dom_loaded
			 */
			"dom_loaded": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired on `document.visibilitychange`.
			 *
			 * The `visibilitychange` event is fired when the content of a tab has
			 * become visible or has been hidden.
			 *
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/Events/visibilitychange}
			 * @event BOOMR#visibility_changed
			 */
			"visibility_changed": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired when the `visibilityState` of the document has changed from
			 * `prerender` to `visible`
			 *
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/Events/visibilitychange}
			 * @event BOOMR#prerender_to_visible
			 */
			"prerender_to_visible": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired when a beacon is about to be sent.
			 *
			 * The subscriber can still add variables to the beacon at this point,
			 * either by modifying the `vars` paramter or calling {@link BOOMR.addVar}.
			 *
			 * @event BOOMR#before_beacon
			 * @property {object} vars Beacon variables
			 */
			"before_beacon": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired when a beacon was sent.
			 *
			 * The beacon variables cannot be modified at this point.  Any calls
			 * to {@link BOOMR.addVar} or {@link BOOMR.removeVar} will apply to the
			 * next beacon.
			 *
			 * Also known as `onbeacon`.
			 *
			 * @event BOOMR#beacon
			 * @property {object} vars Beacon variables
			 */
			"beacon": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired when the page load beacon has been sent.
			 *
			 * This event should only happen once on a page.  It does not apply
			 * to SPA soft navigations.
			 *
			 * @event BOOMR#page_load_beacon
			 * @property {object} vars Beacon variables
			 */
			"page_load_beacon": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired when an XMLHttpRequest has finished, or, if something calls
			 * {@link BOOMR.responseEnd}.
			 *
			 * @event BOOMR#xhr_load
			 * @property {object} data Event data
			 */
			"xhr_load": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired when the `click` event has happened on the `document`.
			 *
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onclick}
			 * @event BOOMR#click
			 */
			"click": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired when any `FORM` element is submitted.
			 *
			 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit}
			 * @event BOOMR#form_submit
			 */
			"form_submit": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired whenever new configuration data is applied via {@link BOOMR.init}.
			 *
			 * Also known as `onconfig`.
			 *
			 * @event BOOMR#config
			 * @property {object} data Configuration data
			 */
			"config": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired whenever `XMLHttpRequest.open` is called.
			 *
			 * This event will only happen if {@link BOOMR.plugins.AutoXHR} is enabled.
			 *
			 * @event BOOMR#xhr_init
			 * @property {string} type XHR type ("xhr")
			 */
			"xhr_init": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired whenever a SPA plugin is about to track a new navigation.
			 *
			 * @event BOOMR#spa_init
			 * @property {string} navType Navigation type (`spa` or `spa_hard`)
			 * @property {object} param SPA navigation parameters
			 */
			"spa_init": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired whenever a SPA navigation is complete.
			 *
			 * @event BOOMR#spa_navigation
			 */
			"spa_navigation": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired whenever a SPA navigation is cancelled.
			 *
			 * @event BOOMR#spa_cancel
			 */
			"spa_cancel": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired whenever `XMLHttpRequest.send` is called.
			 *
			 * This event will only happen if {@link BOOMR.plugins.AutoXHR} is enabled.
			 *
			 * @event BOOMR#xhr_send
			 * @property {object} xhr `XMLHttpRequest` object
			 */
			"xhr_send": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired whenever and `XMLHttpRequest` has an error (if its `status` is
			 * set).
			 *
			 * This event will only happen if {@link BOOMR.plugins.AutoXHR} is enabled.
			 *
			 * Also known as `onxhrerror`.
			 *
			 * @event BOOMR#xhr_error
			 * @property {object} data XHR data
			 */
			"xhr_error": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired whenever a page error has happened.
			 *
			 * This event will only happen if {@link BOOMR.plugins.Errors} is enabled.
			 *
			 * Also known as `onerror`.
			 *
			 * @event BOOMR#error
			 * @property {object} err Error
			 */
			"error": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired whenever connection information changes via the
			 * Network Information API.
			 *
			 * This event will only happen if {@link BOOMR.plugins.Mobile} is enabled.
			 *
			 * @event BOOMR#netinfo
			 * @property {object} connection `navigator.connection`
			 */
			"netinfo": [],

			/**
			 * Boomerang event, subscribe via {@link BOOMR.subscribe}.
			 *
			 * Fired whenever a Rage Click is detected.
			 *
			 * This event will only happen if {@link BOOMR.plugins.Continuity} is enabled.
			 *
			 * @event BOOMR#rage_click
			 * @property {Event} e Event
			 */
			"rage_click": []
		},

		/**
		 * Public events
		 */
		public_events: {
			/**
			 * Public event (fired on `document`), and can be subscribed via
			 * `document.addEventListener("onBeforeBoomerangBeacon", ...)` or
			 * `document.attachEvent("onpropertychange", ...)`.
			 *
			 * Maps to {@link BOOMR#event:before_beacon}
			 *
			 * @event document#onBeforeBoomerangBeacon
			 * @property {object} vars Beacon variables
			 */
			"before_beacon": "onBeforeBoomerangBeacon",

			/**
			 * Public event (fired on `document`), and can be subscribed via
			 * `document.addEventListener("onBoomerangBeacon", ...)` or
			 * `document.attachEvent("onpropertychange", ...)`.
			 *
			 * Maps to {@link BOOMR#event:before_beacon}
			 *
			 * @event document#onBoomerangBeacon
			 * @property {object} vars Beacon variables
			 */
			"beacon": "onBoomerangBeacon",

			/**
			 * Public event (fired on `document`), and can be subscribed via
			 * `document.addEventListener("onBoomerangLoaded", ...)` or
			 * `document.attachEvent("onpropertychange", ...)`.
			 *
			 * Fired when {@link BOOMR} has loaded and can be used.
			 *
			 * @event document#onBoomerangLoaded
			 */
			"onboomerangloaded": "onBoomerangLoaded"
		},

		/**
		 * Maps old event names to their updated name
		 */
		translate_events: {
			"onbeacon": "beacon",
			"onconfig": "config",
			"onerror": "error",
			"onxhrerror": "xhr_error"
		},

		/**
		 * Number of page_unload or before_unload callbacks registered
		 */
		unloadEventsCount: 0,

		/**
		 * Number of page_unload or before_unload callbacks called
		 */
		unloadEventCalled: 0,

		listenerCallbacks: {},

		vars: {},
		singleBeaconVars: {},

		/**
		 * Variable priority lists:
		 * -1 = first
		 *  1 = last
		 */
		varPriority: {
			"-1": {},
			"1": {}
		},

		errors: {},

		disabled_plugins: {},

		localStorageSupported: false,
		LOCAL_STORAGE_PREFIX: "_boomr_",

		/**
		 * Native functions that were overwritten and should be restored when
		 * the Boomerang IFRAME is unloaded
		 */
		nativeOverwrites: [],

		xb_handler: function(type) {
			return function(ev) {
				var target;
				if (!ev) { ev = w.event; }
				if (ev.target) { target = ev.target; }
				else if (ev.srcElement) { target = ev.srcElement; }
				if (target.nodeType === 3) {  // defeat Safari bug
					target = target.parentNode;
				}

				// don't capture events on flash objects
				// because of context slowdowns in PepperFlash
				if (target &&
				    target.nodeName &&
				    target.nodeName.toUpperCase() === "OBJECT" &&
				    target.type === "application/x-shockwave-flash") {
					return;
				}
				impl.fireEvent(type, target);
			};
		},

		clearEvents: function() {
			var eventName;

			for (eventName in this.events) {
				if (this.events.hasOwnProperty(eventName)) {
					this.events[eventName] = [];
				}
			}
		},

		clearListeners: function() {
			var type, i;

			for (type in impl.listenerCallbacks) {
				if (impl.listenerCallbacks.hasOwnProperty(type)) {
					// remove all callbacks -- removeListener is guaranteed
					// to remove the element we're calling with
					while (impl.listenerCallbacks[type].length) {
						BOOMR.utils.removeListener(
						    impl.listenerCallbacks[type][0].el,
						    type,
						    impl.listenerCallbacks[type][0].fn);
					}
				}
			}

			impl.listenerCallbacks = {};
		},

		fireEvent: function(e_name, data) {
			var i, handler, handlers, handlersLen;

			e_name = e_name.toLowerCase();



			// translate old names
			if (this.translate_events[e_name]) {
				e_name = this.translate_events[e_name];
			}

			if (!this.events.hasOwnProperty(e_name)) {
				return;// false;
			}

			if (this.public_events.hasOwnProperty(e_name)) {
				dispatchEvent(this.public_events[e_name], data);
			}

			handlers = this.events[e_name];

			// Before we fire any event listeners, let's call real_sendBeacon() to flush
			// any beacon that is being held by the setImmediate.
			if (e_name !== "before_beacon" && e_name !== "beacon") {
				BOOMR.real_sendBeacon();
			}

			// only call handlers at the time of fireEvent (and not handlers that are
			// added during this callback to avoid an infinite loop)
			handlersLen = handlers.length;
			for (i = 0; i < handlersLen; i++) {
				try {
					handler = handlers[i];
					handler.fn.call(handler.scope, data, handler.cb_data);
				}
				catch (err) {
					BOOMR.addError(err, "fireEvent." + e_name + "<" + i + ">");
				}
			}

			// remove any 'once' handlers now that we've fired all of them
			for (i = 0; i < handlersLen; i++) {
				if (handlers[i].once) {
					handlers.splice(i, 1);
					handlersLen--;
					i--;
				}
			}



			return;// true;
		},

		spaNavigation: function() {
			// a SPA navigation occured, force onloadfired to true
			impl.onloadfired = true;
		},

		/**
		 * Determines whether a beacon URL is allowed based on
		 * `beacon_urls_allowed` config
		 *
		 * @param {string} url URL to test
		 *
		 */
		beaconUrlAllowed: function(url) {
			if (!impl.beacon_urls_allowed || impl.beacon_urls_allowed.length === 0) {
				return true;
			}

			for (var i = 0; i < impl.beacon_urls_allowed.length; i++) {
				var regEx = new RegExp(impl.beacon_urls_allowed[i]);
				if (regEx.exec(url)) {
					return true;
				}
			}

			return false;
		},

		/**
		 * Checks browser for localStorage support
		 */
		checkLocalStorageSupport: function() {
			var name = impl.LOCAL_STORAGE_PREFIX + "clss";
			impl.localStorageSupported = false;

			// Browsers with cookies disabled or in private/incognito mode may throw an
			// error when accessing the localStorage variable
			try {
				// we need JSON and localStorage support
				if (!w.JSON || !w.localStorage) {
					return;
				}

				w.localStorage.setItem(name, name);
				impl.localStorageSupported = (w.localStorage.getItem(name) === name);
				w.localStorage.removeItem(name);
			}
			catch (ignore) {
				impl.localStorageSupported = false;
			}
		},

		/**
		 * Fired when the Boomerang IFRAME is unloaded.
		 *
		 * If Boomerang was loaded into the root document, this code
		 * will not run.
		 */
		onFrameUnloaded: function() {
			var i, prop;

			BOOMR.isUnloaded = true;

			// swap the original function back in for any overwrites
			for (i = 0; i < impl.nativeOverwrites.length; i++) {
				prop = impl.nativeOverwrites[i];

				prop.obj[prop.functionName] = prop.origFn;
			}

			impl.nativeOverwrites = [];
		}
	};

	// We create a boomr object and then copy all its properties to BOOMR so that
	// we don't overwrite anything additional that was added to BOOMR before this
	// was called... for example, a plugin.
	boomr = {
		/**
		 * The timestamp when boomerang.js showed up on the page.
		 *
		 * This is the value of `BOOMR_start` we set earlier.
		 * @type {TimeStamp}
		 *
		 * @memberof BOOMR
		 */
		t_start: BOOMR_start,

		/**
		 * When the Boomerang plugins have all run.
		 *
		 * This value is generally set in zzz-last-plugin.js.
		 * @type {TimeStamp}
		 *
		 * @memberof BOOMR
		 */
		t_end: undefined,

		/**
		 * URL of boomerang.js.
		 *
		 * @type {string}
		 *
		 * @memberof BOOMR
		 */
		url: "",

		/**
		 * (Optional) URL of configuration file
		 *
		 * @type {string}
		 *
		 * @memberof BOOMR
		 */
		config_url: null,

		/**
		 * Whether or not Boomerang was loaded after the `onload` event.
		 *
		 * @type {boolean}
		 *
		 * @memberof BOOMR
		 */
		loadedLate: false,

		/**
		 * Current number of beacons sent.
		 *
		 * Will be incremented and added to outgoing beacon as `n`.
		 *
		 * @type {number}
		 *
		 */
		beaconsSent: 0,

		/**
		 * Whether or not Boomerang thinks it has been unloaded (if it was
		 * loaded in an IFRAME)
		 *
		 * @type {boolean}
		 */
		isUnloaded: false,

		/**
		 * Whether or not we're in the middle of building a beacon.
		 *
		 * If so, the code desiring to send a beacon should wait until the beacon
		 * event and try again.  At that point, it should set this flag to true.
		 *
		 * @type {boolean}
		 */
		beaconInQueue: false,

		/**
		 * Constants visible to the world
		 * @class BOOMR.constants
		 */
		constants: {
			/**
			 * SPA beacon types
			 *
			 * @type {string[]}
			 *
			 * @memberof BOOMR.constants
			 */
			BEACON_TYPE_SPAS: ["spa", "spa_hard"],

			/**
			 * Maximum GET URL length.
			 * Using 2000 here as a de facto maximum URL length based on:
 			 * http://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
			 *
			 * @type {number}
			 *
			 * @memberof BOOMR.constants
			 */
			MAX_GET_LENGTH: 2000
		},

		/**
		 * Session data
		 * @class BOOMR.session
		 */
		session: {
			/**
			 * Session Domain.
			 *
			 * You can disable all cookies by setting site_domain to a falsy value.
			 *
			 * @type {string}
			 *
			 * @memberof BOOMR.session
			 */
			domain: impl.site_domain,

			/**
			 * Session ID.  This will be randomly generated in the client but may
			 * be overwritten by the server if not set.
			 *
			 * @type {string}
			 *
			 * @memberof BOOMR.session
			 */
			ID: Math.random().toString(36).replace(/^0\./, ""),

			/**
			 * Session start time.
			 *
			 * @type {TimeStamp}
			 *
			 * @memberof BOOMR.session
			 */
			start: undefined,

			/**
			 * Session length (number of pages)
			 *
			 * @type {number}
			 *
			 * @memberof BOOMR.session
			 */
			length: 0,

			/**
			 * Session enabled (Are session cookies enabled?)
			 *
			 * @type {boolean}
			 *
			 * @memberof BOOMR.session
			 */
			enabled: true
		},

		/**
		 * @class BOOMR.utils
		 */
		utils: {
			/**
			 * Determines whether or not the browser has `postMessage` support
			 *
			 * @returns {boolean} True if supported
			 */
			hasPostMessageSupport: function() {
				if (!w.postMessage || typeof w.postMessage !== "function" && typeof w.postMessage !== "object") {
					return false;
				}
				return true;
			},

			/**
			 * Converts an object to a string.
			 *
			 * @param {object} o Object
			 * @param {string} separator Member separator
			 * @param {number} nest_level Number of levels to recurse
			 *
			 * @returns {string} String representation of the object
			 *
			 * @memberof BOOMR.utils
			 */
			objectToString: function(o, separator, nest_level) {
				var value = [], k;

				if (!o || typeof o !== "object") {
					return o;
				}
				if (separator === undefined) {
					separator = "\n\t";
				}
				if (!nest_level) {
					nest_level = 0;
				}

				if (BOOMR.utils.isArray(o)) {
					for (k = 0; k < o.length; k++) {
						if (nest_level > 0 && o[k] !== null && typeof o[k] === "object") {
							value.push(
								this.objectToString(
									o[k],
									separator + (separator === "\n\t" ? "\t" : ""),
									nest_level - 1
								)
							);
						}
						else {
							if (separator === "&") {
								value.push(encodeURIComponent(o[k]));
							}
							else {
								value.push(o[k]);
							}
						}
					}
					separator = ",";
				}
				else {
					for (k in o) {
						if (Object.prototype.hasOwnProperty.call(o, k)) {
							if (nest_level > 0 && o[k] !== null && typeof o[k] === "object") {
								value.push(encodeURIComponent(k) + "=" +
									this.objectToString(
										o[k],
										separator + (separator === "\n\t" ? "\t" : ""),
										nest_level - 1
									)
								);
							}
							else {
								if (separator === "&") {
									value.push(encodeURIComponent(k) + "=" + encodeURIComponent(o[k]));
								}
								else {
									value.push(k + "=" + o[k]);
								}
							}
						}
					}
				}

				return value.join(separator);
			},

			/**
			 * Gets the value of the cookie identified by `name`.
			 *
			 * @param {string} name Cookie name
			 *
			 * @returns {string|null} Cookie value, if set.
			 *
			 * @memberof BOOMR.utils
			 */
			getCookie: function(name) {
				if (!name) {
					return null;
				}



				name = " " + name + "=";

				var i, cookies;
				cookies = " " + d.cookie + ";";
				if ((i = cookies.indexOf(name)) >= 0) {
					i += name.length;
					cookies = cookies.substring(i, cookies.indexOf(";", i)).replace(/^"/, "").replace(/"$/, "");
					return cookies;
				}
			},

			/**
			 * Sets the cookie named `name` to the serialized value of `subcookies`.
			 *
			 * @param {string} name The name of the cookie
			 * @param {object} subcookies Key/value pairs to write into the cookie.
			 * These will be serialized as an & separated list of URL encoded key=value pairs.
			 * @param {number} max_age Lifetime in seconds of the cookie.
			 * Set this to 0 to create a session cookie that expires when
			 * the browser is closed. If not set, defaults to 0.
			 *
			 * @returns {boolean} True if the cookie was set successfully
			 *
			 * @example
			 * BOOMR.utils.setCookie("RT", { s: t_start, r: url });
			 *
			 * @memberof BOOMR.utils
			 */
			setCookie: function(name, subcookies, max_age) {
				var value, nameval, savedval, c, exp;

				if (!name || !BOOMR.session.domain || typeof subcookies === "undefined") {


					BOOMR.addVar("nocookie", 1);
					return false;
				}



				value = this.objectToString(subcookies, "&");
				nameval = name + "=\"" + value + "\"";

				if (nameval.length < 500) {
					c = [nameval, "path=/", "domain=" + BOOMR.session.domain];
					if (typeof max_age === "number") {
						exp = new Date();
						exp.setTime(exp.getTime() + max_age * 1000);
						exp = exp.toGMTString();
						c.push("expires=" + exp);
					}

					d.cookie = c.join("; ");
					// confirm cookie was set (could be blocked by user's settings, etc.)
					savedval = this.getCookie(name);
					// the saved cookie should be the same or undefined in the case of removeCookie
					if (value === savedval ||
					    (typeof savedval === "undefined" && typeof max_age === "number" && max_age <= 0)) {
						return true;
					}
					BOOMR.warn("Saved cookie value doesn't match what we tried to set:\n" + value + "\n" + savedval);
				}
				else {
					BOOMR.warn("Cookie too long: " + nameval.length + " " + nameval);
				}

				BOOMR.addVar("nocookie", 1);
				return false;
			},

			/**
			 * Parse a cookie string returned by {@link BOOMR.utils.getCookie} and
			 * split it into its constituent subcookies.
			 *
			 * @param {string} cookie Cookie value
			 *
			 * @returns {object} On success, an object of key/value pairs of all
			 * sub cookies. Note that some subcookies may have empty values.
			 * `null` if `cookie` was not set or did not contain valid subcookies.
			 *
			 * @memberof BOOMR.utils
			 */
			getSubCookies: function(cookie) {
				var cookies_a,
				    i, l, kv,
				    gotcookies = false,
				    cookies = {};

				if (!cookie) {
					return null;
				}

				if (typeof cookie !== "string") {

					return null;
				}

				cookies_a = cookie.split("&");

				for (i = 0, l = cookies_a.length; i < l; i++) {
					kv = cookies_a[i].split("=");
					if (kv[0]) {
						kv.push("");  // just in case there's no value
						cookies[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
						gotcookies = true;
					}
				}

				return gotcookies ? cookies : null;
			},

			/**
			 * Removes the cookie identified by `name` by nullifying its value,
			 * and making it a session cookie.
			 *
			 * @param {string} name Cookie name
			 *
			 * @memberof BOOMR.utils
			 */
			removeCookie: function(name) {
				return this.setCookie(name, {}, -86400);
			},

			/**
			 * Retrieve items from localStorage
			 *
			 * @param {string} name Name of storage
			 *
			 * @returns {object|null} Returns object retrieved from localStorage.
			 *                       Returns undefined if not found or expired.
			 *                       Returns null if parameters are invalid or an error occured
			 *
			 * @memberof BOOMR.utils
			 */
			getLocalStorage: function(name) {
				var value, data;
				if (!name || !impl.localStorageSupported) {
					return null;
				}



				try {
					value = w.localStorage.getItem(impl.LOCAL_STORAGE_PREFIX + name);
					if (value === null) {
						return undefined;
					}
					data = w.JSON.parse(value);
				}
				catch (e) {
					BOOMR.warn(e);
					return null;
				}

				if (!data || typeof data.items !== "object") {
					// Items are invalid
					this.removeLocalStorage(name);
					return null;
				}
				if (typeof data.expires === "number") {
					if (BOOMR.now() >= data.expires) {
						// Items are expired
						this.removeLocalStorage(name);
						return undefined;
					}
				}
				return data.items;
			},

			/**
			 * Saves items in localStorage
			 * The value stored in localStorage will be a JSON string representation of {"items": items, "expiry": expiry}
			 * where items is the object we're saving and expiry is an optional epoch number of when the data is to be
			 * considered expired
			 *
			 * @param {string} name Name of storage
			 * @param {object} items Items to be saved
			 * @param {number} max_age Age in seconds before items are to be considered expired
			 *
			 * @returns {boolean} True if the localStorage was set successfully
			 *
			 * @memberof BOOMR.utils
			 */
			setLocalStorage: function(name, items, max_age) {
				var data, value, savedval;

				if (!name || !impl.localStorageSupported || typeof items !== "object") {
					return false;
				}



				data = {"items": items};

				if (typeof max_age === "number") {
					data.expires = BOOMR.now() + (max_age * 1000);
				}

				value = w.JSON.stringify(data);

				if (value.length < 50000) {
					try {
						w.localStorage.setItem(impl.LOCAL_STORAGE_PREFIX + name, value);
						// confirm storage was set (could be blocked by user's settings, etc.)
						savedval = w.localStorage.getItem(impl.LOCAL_STORAGE_PREFIX + name);
						if (value === savedval) {
							return true;
						}
					}
					catch (ignore) {
						// Empty
					}
					BOOMR.warn("Saved storage value doesn't match what we tried to set:\n" + value + "\n" + savedval);
				}
				else {
					BOOMR.warn("Storage items too large: " + value.length + " " + value);
				}

				return false;
			},

			/**
			 * Remove items from localStorage
			 *
			 * @param {string} name Name of storage
			 *
			 * @returns {boolean} True if item was removed from localStorage.
			 *
			 * @memberof BOOMR.utils
			 */
			removeLocalStorage: function(name) {
				if (!name || !impl.localStorageSupported) {
					return false;
				}
				try {
					w.localStorage.removeItem(impl.LOCAL_STORAGE_PREFIX + name);
					return true;
				}
				catch (ignore) {
					// Empty
				}
				return false;
			},

			/**
			 * Cleans up a URL by removing the query string (if configured), and
			 * limits the URL to the specified size.
			 *
			 * @param {string} url URL to clean
			 * @param {number} urlLimit Maximum size, in characters, of the URL
			 *
			 * @returns {string} Cleaned up URL
			 *
			 * @memberof BOOMR.utils
			 */
			cleanupURL: function(url, urlLimit) {
				if (!url || BOOMR.utils.isArray(url)) {
					return "";
				}

				if (impl.strip_query_string) {
					url = url.replace(/\?.*/, "?qs-redacted");
				}

				if (typeof urlLimit !== "undefined" && url && url.length > urlLimit) {
					// We need to break this URL up.  Try at the query string first.
					var qsStart = url.indexOf("?");
					if (qsStart !== -1 && qsStart < urlLimit) {
						url = url.substr(0, qsStart) + "?...";
					}
					else {
						// No query string, just stop at the limit
						url = url.substr(0, urlLimit - 3) + "...";
					}
				}

				return url;
			},

			/**
			 * Gets the URL with the query string replaced with a MD5 hash of its contents.
			 *
			 * @param {string} url URL
			 * @param {boolean} stripHash Whether or not to strip the hash
			 *
			 * @returns {string} URL with query string hashed
			 *
			 * @memberof BOOMR.utils
			 */
			hashQueryString: function(url, stripHash) {
				if (!url) {
					return url;
				}
				if (!url.match) {
					BOOMR.addError("TypeError: Not a string", "hashQueryString", typeof url);
					return "";
				}
				if (url.match(/^\/\//)) {
					url = location.protocol + url;
				}
				if (!url.match(/^(https?|file):/)) {
					BOOMR.error("Passed in URL is invalid: " + url);
					return "";
				}
				if (stripHash) {
					url = url.replace(/#.*/, "");
				}
				if (!BOOMR.utils.MD5) {
					return url;
				}
				return url.replace(/\?([^#]*)/, function(m0, m1) {
					return "?" + (m1.length > 10 ? BOOMR.utils.MD5(m1) : m1);
				});
			},

			/**
			 * Sets the object's properties if anything in config matches
			 * one of the property names.
			 *
			 * @param {object} o The plugin's `impl` object within which it stores
			 * all its configuration and private properties
			 * @param {object} config The config object passed in to the plugin's
			 * `init()` method.
			 * @param {string} plugin_name The plugin's name in the {@link BOOMR.plugins} object.
			 * @param {string[]} properties An array containing a list of all configurable
			 * properties that this plugin has.
			 *
			 * @returns {boolean} True if a property was set
			 *
			 * @memberof BOOMR.utils
			 */
			pluginConfig: function(o, config, plugin_name, properties) {
				var i, props = 0;

				if (!config || !config[plugin_name]) {
					return false;
				}

				for (i = 0; i < properties.length; i++) {
					if (config[plugin_name][properties[i]] !== undefined) {
						o[properties[i]] = config[plugin_name][properties[i]];
						props++;
					}
				}

				return (props > 0);
			},

			/**
			 * `filter` for arrays
			 *
			 * @param {Array} array The array to iterate over.
			 * @param {Function} predicate The function invoked per iteration.
			 *
			 * @returns {Array} Returns the new filtered array.
			 *
			 * @memberof BOOMR.utils
			 */
			arrayFilter: function(array, predicate) {
				var result = [];

				if (!(this.isArray(array) || (array && typeof array.length === "number")) ||
				    typeof predicate !== "function") {
					return result;
				}

				if (typeof array.filter === "function") {
					result = array.filter(predicate);
				}
				else {
					var index = -1,
					    length = array.length,
					    value;

					while (++index < length) {
						value = array[index];
						if (predicate(value, index, array)) {
							result[result.length] = value;
						}
					}
				}
				return result;
			},

			/**
			 * `find` for Arrays
			 *
			 * @param {Array} array The array to iterate over
			 * @param {Function} predicate The function invoked per iteration
			 *
			 * @returns {Array} Returns the value of first element that satisfies
			 * the predicate
			 *
			 * @memberof BOOMR.utils
			 */
			arrayFind: function(array, predicate) {
				if (!(this.isArray(array) || (array && typeof array.length === "number")) ||
				    typeof predicate !== "function") {
					return undefined;
				}

				if (typeof array.find === "function") {
					return array.find(predicate);
				}
				else {
					var index = -1,
					    length = array.length,
					    value;

					while (++index < length) {
						value = array[index];
						if (predicate(value, index, array)) {
							return value;
						}
					}
					return undefined;
				}
			},

			/**
			 * MutationObserver feature detection
			 *
			 * @returns {boolean} Returns true if MutationObserver is supported.
			 * Always returns false for IE 11 due several bugs in it's implementation that MS flagged as Won't Fix.
			 * In IE11, XHR responseXML might be malformed if MO is enabled (where extra newlines get added in nodes with UTF-8 content).
			 * Another IE 11 MO bug can cause the process to crash when certain mutations occur.
			 * For the process crash issue, see https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8137215/ and
			 * https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/15167323/
			 *
			 * @memberof BOOMR.utils
			 */
			isMutationObserverSupported: function() {
				// We can only detect IE 11 bugs by UA sniffing.
				var ie11 = (w && w.navigator && w.navigator.userAgent && w.navigator.userAgent.match(/Trident.*rv[ :]*11\./));
				return (!ie11 && w && w.MutationObserver && typeof w.MutationObserver === "function");
			},

			/**
			 * The callback function may return a falsy value to disconnect the
			 * observer after it returns, or a truthy value to keep watching for
			 * mutations. If the return value is numeric and greater than 0, then
			 * this will be the new timeout. If it is boolean instead, then the
			 * timeout will not fire any more so the caller MUST call disconnect()
			 * at some point.
			 *
			 * @callback BOOMR~addObserverCallback
			 * @param {object[]} mutations List of mutations detected by the observer or `undefined` if the observer timed out
			 * @param {object} callback_data Is the passed in `callback_data` parameter without modifications
			 */

			/**
			 * Add a MutationObserver for a given element and terminate after `timeout`ms.
			 *
			 * @param {DOMElement} el DOM element to watch for mutations
			 * @param {MutationObserverInit} config MutationObserverInit object (https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver#MutationObserverInit)
			 * @param {number} timeout Number of milliseconds of no mutations after which the observer should be automatically disconnected.
			 * If set to a falsy value, the observer will wait indefinitely for Mutations.
			 * @param {BOOMR~addObserverCallback} callback Callback function to call either on timeout or if mutations are detected.
			 * @param {object} callback_data Any data to be passed to the callback function as its second parameter.
			 * @param {object} callback_ctx An object that represents the `this` object of the `callback` method.
			 * Leave unset the callback function is not a method of an object.
			 *
			 * @returns {object|null}
			 * - `null` if a MutationObserver could not be created OR
			 * - An object containing the observer and the timer object:
			 *   `{ observer: <MutationObserver>, timer: <Timeout Timer if any> }`
			 * - The caller can use this to disconnect the observer at any point
			 *   by calling `retval.observer.disconnect()`
			 * - Note that the caller should first check to see if `retval.observer`
			 *   is set before calling `disconnect()` as it may have been cleared automatically.
			 *
			 * @memberof BOOMR.utils
			 */
			addObserver: function(el, config, timeout, callback, callback_data, callback_ctx) {
				var MO, zs, o = {observer: null, timer: null};



				if (!this.isMutationObserverSupported() || !callback || !el) {
					return null;
				}

				function done(mutations) {
					var run_again = false;



					if (o.timer) {
						clearTimeout(o.timer);
						o.timer = null;
					}

					if (callback) {
						run_again = callback.call(callback_ctx, mutations, callback_data);

						if (!run_again) {
							callback = null;
						}
					}

					if (!run_again && o.observer) {
						o.observer.disconnect();
						o.observer = null;
					}

					if (typeof run_again === "number" && run_again > 0) {
						o.timer = setTimeout(done, run_again);
					}
				}

				MO = w.MutationObserver;
				// if the site uses Zone.js then get the native MutationObserver
				if (w.Zone && typeof w.Zone.__symbol__ === "function") {
					zs = w.Zone.__symbol__("MutationObserver");
					if (zs && typeof zs === "string" && w.hasOwnProperty(zs) && typeof w[zs] === "function") {

						MO = w[zs];
					}
				}
				o.observer = new MO(done);

				if (timeout) {
					o.timer = setTimeout(done, o.timeout);
				}

				o.observer.observe(el, config);

				return o;
			},

			/**
			 * Adds an event listener.
			 *
			 * @param {DOMElement} el DOM element
			 * @param {string} type Event name
			 * @param {function} fn Callback function
			 * @param {boolean} passive Passive mode
			 *
			 * @memberof BOOMR.utils
			 */
			addListener: function(el, type, fn, passive) {
				var opts = false;



				if (el.addEventListener) {
					if (passive && BOOMR.browser.supportsPassive()) {
						opts = {
							capture: false,
							passive: true
						};
					}

					el.addEventListener(type, fn, opts);
				}
				else if (el.attachEvent) {
					el.attachEvent("on" + type, fn);
				}

				// ensure the type arry exists
				impl.listenerCallbacks[type] = impl.listenerCallbacks[type] || [];

				// save a reference to the target object and function
				impl.listenerCallbacks[type].push({ el: el, fn: fn});
			},

			/**
			 * Removes an event listener.
			 *
			 * @param {DOMElement} el DOM element
			 * @param {string} type Event name
			 * @param {function} fn Callback function
			 *
			 * @memberof BOOMR.utils
			 */
			removeListener: function(el, type, fn) {
				var i;



				if (el.removeEventListener) {
					// NOTE: We don't need to match any other options (e.g. passive)
					// from addEventListener, as removeEventListener only cares
					// about captive.
					el.removeEventListener(type, fn, false);
				}
				else if (el.detachEvent) {
					el.detachEvent("on" + type, fn);
				}

				if (impl.listenerCallbacks.hasOwnProperty(type)) {
					for (var i = 0; i < impl.listenerCallbacks[type].length; i++) {
						if (fn === impl.listenerCallbacks[type][i].fn &&
						    el === impl.listenerCallbacks[type][i].el) {
							impl.listenerCallbacks[type].splice(i, 1);
							return;
						}
					}
				}
			},

			/**
			 * Determines if the specified object is an `Array` or not
			 *
			 * @param {object} ary Object in question
			 *
			 * @returns {boolean} True if the object is an `Array`
			 *
			 * @memberof BOOMR.utils
			 */
			isArray: function(ary) {
				return Object.prototype.toString.call(ary) === "[object Array]";
			},

			/**
			 * Determines if the specified value is in the array
			 *
			 * @param {object} val Value to check
			 * @param {object} ary Object in question
			 *
			 * @returns {boolean} True if the value is in the Array
			 *
			 * @memberof BOOMR.utils
			 */
			inArray: function(val, ary) {
				var i;

				if (typeof val === "undefined" || typeof ary === "undefined" || !ary.length) {
					return false;
				}

				for (i = 0; i < ary.length; i++) {
					if (ary[i] === val) {
						return true;
					}
				}

				return false;
			},

			/**
			 * Get a query parameter value from a URL's query string
			 *
			 * @param {string} param Query parameter name
			 * @param {string|Object} [url] URL containing the query string, or a link object.
			 * Defaults to `BOOMR.window.location`
			 *
			 * @returns {string|null} URI decoded value or null if param isn't a query parameter
			 *
			 * @memberof BOOMR.utils
			 */
			getQueryParamValue: function(param, url) {
				var l, params, i, kv;
				if (!param) {
					return null;
				}

				if (typeof url === "string") {
					l = BOOMR.window.document.createElement("a");
					l.href = url;
				}
				else if (typeof url === "object" && typeof url.search === "string") {
					l = url;
				}
				else {
					l = BOOMR.window.location;
				}

				// Now that we match, pull out all query string parameters
				params = l.search.slice(1).split(/&/);

				for (i = 0; i < params.length; i++) {
					if (params[i]) {
						kv = params[i].split("=");
						if (kv.length && kv[0] === param) {
							return kv.length > 1 ? decodeURIComponent(kv.splice(1).join("=").replace(/\+/g, " ")) : "";
						}
					}
				}
				return null;
			},

			/**
			 * Generates a pseudo-random UUID (Version 4):
			 * https://en.wikipedia.org/wiki/Universally_unique_identifier
			 *
			 * @returns {string} UUID
			 *
			 * @memberof BOOMR.utils
			 */
			generateUUID: function() {
				return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
					var r = Math.random() * 16 | 0;
					var v = c === "x" ? r : (r & 0x3 | 0x8);
					return v.toString(16);
				});
			},

			/**
			 * Generates a random ID based on the specified number of characters.  Uses
			 * characters a-z0-9.
			 *
			 * @param {number} chars Number of characters (max 40)
			 *
			 * @returns {string} Random ID
			 *
			 * @memberof BOOMR.utils
			 */
			generateId: function(chars) {
				return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".substr(0, chars || 40).replace(/x/g, function(c) {
					var c = (Math.random() || 0.01).toString(36);

					// some implementations may return "0" for small numbers
					if (c === "0") {
						return "0";
					}
					else {
						return c.substr(2, 1);
					}
				});
			},

			/**
			 * Attempt to serialize an object, preferring JSURL over JSON.stringify
			 *
			 * @param {Object} value Object to serialize
			 * @returns {string} serialized version of value, empty-string if not possible
			 */
			serializeForUrl: function(value) {
				if (BOOMR.utils.Compression && BOOMR.utils.Compression.jsUrl) {
					return BOOMR.utils.Compression.jsUrl(value);
				}
				if (window.JSON) {
					return JSON.stringify(value);
				}
				// not supported

				return "";
			},

			/**
			 * Attempt to identify the URL of boomerang itself using multiple methods for cross-browser support
			 *
			 * This method uses document.currentScript (which cannot be called from an event handler), script.readyState (IE6-10),
			 * and the stack property of a caught Error object.
			 *
			 * @returns {string} The URL of the currently executing boomerang script.
			 */
			getMyURL: function() {
				var stack;
				// document.currentScript works in all browsers except for IE: https://caniuse.com/#feat=document-currentscript
				// #boomr-if-as works in all browsers if the page uses our standard iframe loader
				// #boomr-scr-as works in all browsers if the page uses our preloader loader
				// BOOMR_script will be undefined on IE for pages that do not use our standard loaders

				// Note that we do not use `w.document` or `d` here because we need the current execution context
				var BOOMR_script = (document.currentScript || document.getElementById("boomr-if-as") || document.getElementById("boomr-scr-as"));

				if (BOOMR_script) {
					return BOOMR_script.src;
				}

				// For IE 6-10 users on pages not using the standard loader, we iterate through all scripts backwards
				var scripts = document.getElementsByTagName("script"), i;

				// i-- is both a decrement as well as a condition, ie, the loop will terminate when i goes from 0 to -1
				for (i = scripts.length; i--;) {
					// We stop at the first script that has its readyState set to interactive indicating that it is currently executing
					if (scripts[i].readyState === "interactive") {
						return scripts[i].src;
					}
				}

				// For IE 11, we throw an Error and inspect its stack property in the catch block
				// This also works on IE10, but throwing is disruptive so we try to avoid it and use
				// the less disruptive script iterator above
				try {
					throw new Error();
				}
				catch (e) {
					if ("stack" in e) {
						stack = this.arrayFilter(e.stack.split(/\n/), function(l) { return l.match(/https?:\/\//); });
						if (stack && stack.length) {
							return stack[0].replace(/.*(https?:\/\/.+?)(:\d+)+\D*$/m, "$1");
						}
					}
					// FWIW, on IE 8 & 9, the Error object does not contain a stack property, but if you have an uncaught error,
					// and a `window.onerror` handler (not using addEventListener), then the second argument to that handler is
					// the URL of the script that threw. The handler needs to `return true;` to prevent the default error handler
					// This flow is asynchronous though (due to the event handler), so won't work in a function return scenario
					// like this (we can't use promises because we would only need this hack in browsers that don't support promises).
				}

				return "";
			},

			/*
			 * Gets the Scroll x and y (rounded) for a page
			 *
			 * @returns {object} Scroll x and y coordinates
			 */
			scroll: function() {
				// Adapted from:
				// https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY
				var supportPageOffset = w.pageXOffset !== undefined;
				var isCSS1Compat = ((w.document.compatMode || "") === "CSS1Compat");

				var ret = {
					x: 0,
					y: 0
				};

				if (supportPageOffset) {
					if (typeof w.pageXOffset === "function") {
						ret.x = w.pageXOffset();
						ret.y = w.pageYOffset();
					}
					else {
						ret.x = w.pageXOffset;
						ret.y = w.pageYOffset;
					}
				}
				else if (isCSS1Compat) {
					ret.x = w.document.documentElement.scrollLeft;
					ret.y = w.document.documentElement.scrollTop;
				}
				else {
					ret.x = w.document.body.scrollLeft;
					ret.y = w.document.body.scrollTop;
				}

				// round to full numbers
				if (typeof ret.sx === "number") {
					ret.sx = Math.round(ret.sx);
				}

				if (typeof ret.sy === "number") {
					ret.sy = Math.round(ret.sy);
				}

				return ret;
			},

			/**
			 * Gets the window height
			 *
			 * @returns {number} Window height
			 */
			windowHeight: function() {
				return w.innerHeight || w.document.documentElement.clientHeight || w.document.body.clientHeight;
			},

			/**
			 * Gets the window width
			 *
			 * @returns {number} Window width
			 */
			windowWidth: function() {
				return w.innerWidth || w.document.documentElement.clientWidth || w.document.body.clientWidth;
			},

			/**
			 * Determines if the function is native or not
			 *
			 * @param {function} fn Function
			 *
			 * @returns {boolean} True when the function is native
			 */
			isNative: function(fn) {
				return !!fn &&
				    fn.toString &&
				    !fn.hasOwnProperty("toString") &&
				    /\[native code\]/.test(String(fn));
			},

			/**
			 * Overwrites a function on the specified object.
			 *
			 * When the Boomerang IFRAME unloads, it will swap the old
			 * function back in, so calls to the functions are successful.
			 *
			 * If this isn't done, callers of the overwritten functions may still
			 * call into freed Boomerang code or the IFRAME that is partially unloaded,
			 * leading to "Freed script" errors or exceptions from accessing
			 * unloaded DOM properties.
			 *
			 * This tracking isn't needed if Boomerang is loaded in the root
			 * document, as everthing will be cleaned up along with Boomerang
			 * on unload.
			 *
			 * @param {object} obj Object whose property will be overwritten
			 * @param {string} functionName Function name
			 * @param {function} newFn New function
			 */
			overwriteNative: function(obj, functionName, newFn) {
				// bail if the object doesn't exist
				if (!obj || !newFn) {
					return;
				}

				// we only need to keep track if we're running Boomerang in
				// an IFRAME
				if (BOOMR.boomerang_frame !== BOOMR.window) {
					// note we overwrote this
					impl.nativeOverwrites.push({
						obj: obj,
						functionName: functionName,
						origFn: obj[functionName]
					});
				}

				obj[functionName] = newFn;
			},

			/**
			 * Determines if the given input is an Integer.
			 * Relies on standard Number.isInteger() function that available
			 * is most browsers except IE. For IE, this relies on the polyfill
			 * provided by MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger#Polyfill
			 *
			 * @param {number} input dat
			 *
			 * @returns {string} Random ID
			 *
			 * @memberof BOOMR.utils
			 *
			 */
			isInteger: function(data) {
				var isInt = Number.isInteger || function(value) {
					return typeof value === "number" &&
						isFinite(value) &&
						Math.floor(value) === value;
				};

				return isInt(data);
			}



		}, // closes `utils`

		/**
		 * Browser feature detection flags.
		 *
		 * @class BOOMR.browser
		 */
		browser: {
			results: {},

			/**
			 * Whether or not the browser supports 'passive' mode for event
			 * listeners
			 *
			 * @returns {boolean} True if the browser supports passive mode
			 */
			supportsPassive: function() {
				if (typeof BOOMR.browser.results.supportsPassive === "undefined") {
					BOOMR.browser.results.supportsPassive = false;

					if (!Object.defineProperty) {
						return false;
					}

					try {
						var opts = Object.defineProperty({}, "passive", {
							get: function() {
								BOOMR.browser.results.supportsPassive = true;
							}
						});
						window.addEventListener("test", null, opts);
					}
					catch (e) {
						// NOP
					}
				}

				return BOOMR.browser.results.supportsPassive;
			}
		},

		/**
		 * Initializes Boomerang by applying the specified configuration.
		 *
		 * All plugins' `init()` functions will be called with the same config as well.
		 *
		 * @param {object} config Configuration object
		 * @param {boolean} [config.autorun] By default, boomerang runs automatically
		 * and attaches its `page_ready` handler to the `window.onload` event.
		 * If you set `autorun` to `false`, this will not happen and you will
		 * need to call {@link BOOMR.page_ready} yourself.
		 * @param {string} config.beacon_auth_key Beacon authorization key value
		 * @param {string} config.beacon_auth_token Beacon authorization token.
		 * @param {boolean} config.beacon_with_credentials Sends beacon with credentials
		 * @param {boolean} config.beacon_disable_sendbeacon Disables `navigator.sendBeacon()` support
		 * @param {string} config.beacon_url The URL to beacon results back to.
		 * If not set, no beacon will be sent.
		 * @param {boolean} config.beacon_url_force_https Forces protocol-relative Beacon URLs to HTTPS
		 * @param {string} config.beacon_type `GET`, `POST` or `AUTO`
		 * @param {string} [config.site_domain] The domain that all cookies should be set on
		 * Boomerang will try to auto-detect this, but unless your site is of the
		 * `foo.com` format, it will probably get it wrong. It's a good idea
		 * to set this to whatever part of your domain you'd like to share
		 * bandwidth and performance measurements across.
		 * Set this to a falsy value to disable all cookies.
		 * @param {boolean} [config.strip_query_string] Whether or not to strip query strings from all URLs (e.g. `u`, `pgu`, etc.)
		 * @param {string} [config.user_ip] Despite its name, this is really a free-form
		 * string used to uniquely identify the user's current internet
		 * connection. It's used primarily by the bandwidth test to determine
		 * whether it should re-measure the user's bandwidth or just use the
		 * value stored in the cookie. You may use IPv4, IPv6 or anything else
		 * that you think can be used to identify the user's network connection.
		 * @param {function} [config.log] Logger to use. Set to `null` to disable logging.
		 * @param {function} [<plugins>] Each plugin has its own section
		 *
		 * @returns {BOOMR} Boomerang object
		 *
		 * @memberof BOOMR
		 */
		init: function(config) {
			var i, k,
			    properties = [
				    "autorun",
				    "beacon_auth_key",
				    "beacon_auth_token",
				    "beacon_with_credentials",
				    "beacon_disable_sendbeacon",
				    "beacon_url",
				    "beacon_url_force_https",
				    "beacon_type",
				    "site_domain",
				    "strip_query_string",
				    "user_ip"
			    ];



			BOOMR_check_doc_domain();

			if (!config) {
				config = {};
			}

			// ensure logging is setup properly (or null'd out for production)
			if (config.log !== undefined) {
				this.log = config.log;
			}

			if (!this.log) {
				this.log = function(/* m,l,s */) {};
			}

			if (!this.pageId) {
				// generate a random page ID for this page's lifetime
				this.pageId = BOOMR.utils.generateId(8);

			}

			if (config.primary && impl.handlers_attached) {
				return this;
			}

			if (typeof config.site_domain === "string") {
				this.session.domain = config.site_domain;
			}

			// Set autorun if in config right now, as plugins that listen for page_ready
			// event may fire when they .init() if onload has already fired, and whether
			// or not we should fire page_ready depends on config.autorun.
			if (typeof config.autorun !== "undefined") {
				impl.autorun = config.autorun;
			}



			for (k in this.plugins) {
				if (this.plugins.hasOwnProperty(k)) {
					// config[plugin].enabled has been set to false
					if (config[k] &&
					    config[k].hasOwnProperty("enabled") &&
					    config[k].enabled === false) {
						impl.disabled_plugins[k] = 1;

						if (typeof this.plugins[k].disable === "function") {
							this.plugins[k].disable();
						}

						continue;
					}

					// plugin was previously disabled
					if (impl.disabled_plugins[k]) {

						// and has not been explicitly re-enabled
						if (!config[k] ||
						    !config[k].hasOwnProperty("enabled") ||
						    config[k].enabled !== true) {
							continue;
						}

						if (typeof this.plugins[k].enable === "function") {
							this.plugins[k].enable();
						}

						// plugin is now enabled
						delete impl.disabled_plugins[k];
					}

					// plugin exists and has an init method
					if (typeof this.plugins[k].init === "function") {
						try {


							this.plugins[k].init(config);


						}
						catch (err) {
							BOOMR.addError(err, k + ".init");
						}
					}
				}
			}



			for (i = 0; i < properties.length; i++) {
				if (config[properties[i]] !== undefined) {
					impl[properties[i]] = config[properties[i]];
				}
			}

			// if it's the first call to init (handlers aren't attached) and we're not asked to wait OR
			// it's the second init call (handlers are attached) and we were previously waiting
			// then we set up the page ready autorun functionality
			if ((!impl.handlers_attached && !config.wait) || (impl.handlers_attached && impl.waiting_for_config)) {
				// The developer can override onload by setting autorun to false
				if (!impl.onloadfired && (impl.autorun === undefined || impl.autorun !== false)) {
					if (BOOMR.hasBrowserOnloadFired()) {
						BOOMR.loadedLate = true;
					}
					BOOMR.attach_page_ready(BOOMR.page_ready_autorun);
				}
				impl.waiting_for_config = false;
			}

			// only attach handlers once
			if (impl.handlers_attached) {
				return this;
			}

			if (config.wait) {
				impl.waiting_for_config = true;
			}

			BOOMR.attach_page_ready(function() {
				// if we're not using the loader snippet, save the onload time for
				// browsers that do not support NavigationTiming.
				// This will be later than onload if boomerang arrives late on the
				// page but it's the best we can do
				if (!BOOMR.t_onload) {
					BOOMR.t_onload = BOOMR.now();
				}
			});

			BOOMR.utils.addListener(w, "DOMContentLoaded", function() { impl.fireEvent("dom_loaded"); });

			BOOMR.fireEvent("config", config);
			BOOMR.subscribe("config", function(beaconConfig) {
				if (beaconConfig.beacon_url) {
					impl.beacon_url = beaconConfig.beacon_url;
				}
			});

			BOOMR.subscribe("spa_navigation", impl.spaNavigation, null, impl);

			(function() {
				var forms, iterator;
				if (visibilityChange !== undefined) {
					BOOMR.utils.addListener(d, visibilityChange, function() { impl.fireEvent("visibility_changed"); });

					// save the current visibility state
					impl.lastVisibilityState = BOOMR.visibilityState();

					BOOMR.subscribe("visibility_changed", function() {
						var visState = BOOMR.visibilityState();

						// record the last time each visibility state occurred
						BOOMR.lastVisibilityEvent[visState] = BOOMR.now();


						// if we transitioned from prerender to hidden or visible, fire the prerender_to_visible event
						if (impl.lastVisibilityState === "prerender" &&
						    visState !== "prerender") {
							// note that we transitioned from prerender on the beacon for debugging
							BOOMR.addVar("vis.pre", "1");

							// let all listeners know
							impl.fireEvent("prerender_to_visible");
						}

						impl.lastVisibilityState = visState;
					});
				}

				BOOMR.utils.addListener(d, "mouseup", impl.xb_handler("click"));

				forms = d.getElementsByTagName("form");
				for (iterator = 0; iterator < forms.length; iterator++) {
					BOOMR.utils.addListener(forms[iterator], "submit", impl.xb_handler("form_submit"));
				}

				if (!w.onpagehide && w.onpagehide !== null) {
					// This must be the last one to fire
					// We only clear w on browsers that don't support onpagehide because
					// those that do are new enough to not have memory leak problems of
					// some older browsers
					BOOMR.utils.addListener(w, "unload", function() {
						BOOMR.window = w = null;
					});
				}

				// if we were loaded in an IFRAME, try to keep track if the IFRAME was unloaded
				if (BOOMR.boomerang_frame !== BOOMR.window) {
					BOOMR.utils.addListener(BOOMR.boomerang_frame, "unload", impl.onFrameUnloaded);
				}
			}());

			impl.handlers_attached = true;
			return this;
		},

		/**
		 * Attach a callback to the `pageshow` or `onload` event if `onload` has not
		 * been fired otherwise queue it to run immediately
		 *
		 * @param {function} cb Callback to run when `onload` fires or page is visible (`pageshow`)
		 *
		 * @memberof BOOMR
		 */
		attach_page_ready: function(cb) {
			if (BOOMR.hasBrowserOnloadFired()) {
				this.setImmediate(cb, null, null, BOOMR);
			}
			else {
				// Use `pageshow` if available since it will fire even if page came from a back-forward page cache.
				// Browsers that support `pageshow` will not fire `onload` if navigation was through a back/forward button
				// and the page was retrieved from back-forward cache.
				if (w.onpagehide || w.onpagehide === null) {
					BOOMR.utils.addListener(w, "pageshow", cb);
				}
				else {
					BOOMR.utils.addListener(w, "load", cb);
				}
			}
		},

		/**
		 * Sends the `page_ready` event only if `autorun` is still true after
		 * {@link BOOMR.init} is called.
		 *
		 * @param {Event} ev Event
		 *
		 * @memberof BOOMR
		 */
		page_ready_autorun: function(ev) {
			if (impl.autorun) {
				BOOMR.page_ready(ev, true);
			}
		},

		/**
		 * Method that fires the {@link BOOMR#event:page_ready} event. Call this
		 * only if you've set `autorun` to `false` when calling the {@link BOOMR.init}
		 * method. You should call this method when you determine that your page
		 * is ready to be used by your user. This will be the end-time used in
		 * the page load time measurement. Optionally, you can pass a Unix Epoch
		 * timestamp as a parameter or set the global `BOOMR_page_ready` var that will
		 * be used as the end-time instead.
		 *
		 * @param {Event|number} [ev] Ready event or optional load event end timestamp if called manually
		 * @param {boolean} auto True if called by `page_ready_autorun`
		 *
		 * @returns {BOOMR} Boomerang object
		 *
		 * @example
		 * BOOMR.init({ autorun: false, ... });
		 * // wait until the page is ready, i.e. your view has loaded
		 * BOOMR.page_ready();
		 *
		 * @memberof BOOMR
		 */
		page_ready: function(ev, auto) {
			var tm_page_ready;

			// a number can be passed as the first argument if called manually which
			// will be used as the loadEventEnd time
			if (!auto && typeof ev === "number") {
				tm_page_ready = ev;
				ev = null;
			}

			if (!ev) {
				ev = w.event;
			}

			if (!ev) {
				ev = {
					name: "load"
				};
			}

			// if we were called manually or global BOOMR_page_ready was set then
			// add loadEventEnd and note this was 'pr' on the beacon
			if (!auto) {
				ev.timing = ev.timing || {};
				// use timestamp parameter or global BOOMR_page_ready if set, otherwise use
				// the current timestamp
				if (tm_page_ready) {
					ev.timing.loadEventEnd = tm_page_ready;
				}
				else if (typeof w.BOOMR_page_ready === "number") {
					ev.timing.loadEventEnd = w.BOOMR_page_ready;
				}
				else {
					ev.timing.loadEventEnd = BOOMR.now();
				}

				BOOMR.addVar("pr", 1, true);
			}
			else if (typeof w.BOOMR_page_ready === "number") {
				ev.timing = ev.timing || {};
				// the global BOOMR_page_ready will override our loadEventEnd
				ev.timing.loadEventEnd = w.BOOMR_page_ready;

				BOOMR.addVar("pr", 1, true);
			}

			if (impl.onloadfired) {
				return this;
			}

			impl.fireEvent("page_ready", ev);
			impl.onloadfired = true;
			return this;
		},

		/**
		 * Determines whether or not the page's `onload` event has fired
		 *
		 * @returns {boolean} True if page's onload was called
		 */
		hasBrowserOnloadFired: function() {
			var p = BOOMR.getPerformance();
			// if the document is `complete` then the `onload` event has already occurred, we'll fire the callback immediately.
			// When `document.write` is used to replace the contents of the page and inject boomerang, the document `readyState`
			// will go from `complete` back to `loading` and then to `complete` again. The second transition to `complete`
			// doesn't fire a second `pageshow` event in some browsers (e.g. Safari). We need to check if
			// `performance.timing.loadEventStart` or `BOOMR_onload` has occurred to detect this scenario. Will not work for
			// older Safari that doesn't have NavTiming
			return ((d.readyState && d.readyState === "complete") ||
			    (p && p.timing && p.timing.loadEventStart > 0) ||
			    w.BOOMR_onload > 0);
		},

		/**
		 * Determines whether or not the page's `onload` event has fired, or
		 * if `autorun` is false, whether {@link BOOMR.page_ready} was called.
		 *
		 * @returns {boolean} True if `onload` or {@link BOOMR.page_ready} were called
		 *
		 * @memberof BOOMR
		 */
		onloadFired: function() {
			return impl.onloadfired;
		},

		/**
		 * The callback function may return a falsy value to disconnect the observer
		 * after it returns, or a truthy value to keep watching for mutations. If
		 * the return value is numeric and greater than 0, then this will be the new timeout.
		 * If it is boolean instead, then the timeout will not fire any more so
		 * the caller MUST call disconnect() at some point
		 *
		 * @callback BOOMR~setImmediateCallback
		 * @param {object} data The passed in `data` object
		 * @param {object} cb_data The passed in `cb_data` object
		 * @param {Error} callstack An Error object that holds the callstack for
		 * when `setImmediate` was called, used to determine what called the callback
		 */

		/**
		 * Defer the function `fn` until the next instant the browser is free from
		 * user tasks.
		 *
		 * @param {BOOMR~setImmediateCallback} fn The callback function.
		 * @param {object} [data] Any data to pass to the callback function
		 * @param {object} [cb_data] Any passthrough data for the callback function.
		 * This differs from `data` when `setImmediate` is called via an event
		 * handler and `data` is the Event object
		 * @param {object} [cb_scope] The scope of the callback function if it is a method of an object
		 *
		 * @returns nothing
		 *
		 * @memberof BOOMR
		 */
		setImmediate: function(fn, data, cb_data, cb_scope) {
			var cb, cstack;



			cb = function() {
				fn.call(cb_scope || null, data, cb_data || {}, cstack);
				cb = null;
			};

			if (w.requestIdleCallback) {
				// set a timeout since rIC doesn't get called reliably in chrome headless
				w.requestIdleCallback(cb, {timeout: 1000});
			}
			else if (w.setImmediate) {
				w.setImmediate(cb);
			}
			else {
				setTimeout(cb, 10);
			}
		},

		/**
		 * Gets the current time in milliseconds since the Unix Epoch (Jan 1 1970).
		 *
		 * In browsers that support `DOMHighResTimeStamp`, this will be replaced
		 * by a function that adds `performance.now()` to `navigationStart`
		 * (with milliseconds.microseconds resolution).
		 *
		 * @function
		 *
		 * @returns {TimeStamp} Milliseconds since Unix Epoch
		 *
		 * @memberof BOOMR
		 */
		now: (function() {
			return Date.now || function() { return new Date().getTime(); };
		}()),

		/**
		 * Gets the `window.performance` object of the root window.
		 *
		 * Checks vendor prefixes for older browsers (e.g. IE9).
		 *
		 * @returns {Performance|undefined} `window.performance` if it exists
		 *
		 * @memberof BOOMR
		 */
		getPerformance: function() {
			try {
				if (BOOMR.window) {
					if ("performance" in BOOMR.window && BOOMR.window.performance) {
						return BOOMR.window.performance;
					}

					// vendor-prefixed fallbacks
					return BOOMR.window.msPerformance ||
					    BOOMR.window.webkitPerformance ||
					    BOOMR.window.mozPerformance;
				}
			}
			catch (ignore) {
				// empty
			}
		},

		/**
		 * Get high resolution delta timestamp from time origin
		 *
		 * This function needs to approximate the time since the performance timeOrigin
		 * or Navigation Timing API's `navigationStart` time.
		 * If available, `performance.now()` can provide this value.
		 * If not we either get the navigation start time from the RT plugin or
		 * from `t_lstart` or `t_start`. Those values are subtracted from the current
		 * time to derive a time since `navigationStart` value.
		 *
		 * @returns {float} Exact or approximate time since the time origin.
		 */
		hrNow: function() {
			var now, navigationStart, p = BOOMR.getPerformance();

			if (p && p.now) {
				now = p.now();
			}
			else {
				navigationStart = (BOOMR.plugins.RT && BOOMR.plugins.RT.navigationStart &&
					BOOMR.plugins.RT.navigationStart()) || BOOMR.t_lstart || BOOMR.t_start;

				// if navigationStart is undefined, we'll be returning NaN
				now = BOOMR.now() - navigationStart;
			}

			return now;
		},

		/**
		 * Gets the `document.visibilityState`, or `visible` if Page Visibility
		 * is not supported.
		 *
		 * @function
		 *
		 * @returns {string} Visibility state
		 *
		 * @memberof BOOMR
		 */
		visibilityState: (visibilityState === undefined ? function() {
			return "visible";
		} : function() {
			return d[visibilityState];
		}),

		/**
		 * An mapping of visibliity event states to the latest time they happened
		 *
		 * @type {object}
		 *
		 * @memberof BOOMR
		 */
		lastVisibilityEvent: {},

		/**
		 * Registers a Boomerang event.
		 *
		 * @param {string} e_name Event name
		 *
		 * @returns {BOOMR} Boomerang object
		 *
		 * @memberof BOOMR
		 */
		registerEvent: function(e_name) {
			if (impl.events.hasOwnProperty(e_name)) {
				// already registered
				return this;
			}

			// create a new queue of handlers
			impl.events[e_name] = [];

			return this;
		},

		/**
		 * Disables boomerang from doing anything further:
		 * 1. Clears event handlers (such as onload)
		 * 2. Clears all event listeners
		 *
		 * @memberof BOOMR
		 */
		disable: function() {
			impl.clearEvents();
			impl.clearListeners();
		},

		/**
		 * Fires a Boomerang event
		 *
		 * @param {string} e_name Event name
		 * @param {object} data Event payload
		 *
		 * @returns {BOOMR} Boomerang object
		 *
		 * @memberof BOOMR
		 */
		fireEvent: function(e_name, data) {
			return impl.fireEvent(e_name, data);
		},

		/**
		 * @callback BOOMR~subscribeCallback
		 * @param {object} eventData Event data
		 * @param {object} cb_data Callback data
		 */

		/**
		 * Subscribes to a Boomerang event
		 *
		 * @param {string} e_name Event name, i.e. {@link BOOMR#event:page_ready}.
		 * @param {BOOMR~subscribeCallback} fn Callback function
		 * @param {object} cb_data Callback data, passed as the second parameter to the callback function
		 * @param {object} cb_scope Callback scope.  If set to an object, then the
		 * callback function is called as a method of this object, and all
		 * references to `this` within the callback function will refer to `cb_scope`.
		 * @param {boolean} once Whether or not this callback should only be run once
		 *
		 * @returns {BOOMR} Boomerang object
		 *
		 * @memberof BOOMR
		 */
		subscribe: function(e_name, fn, cb_data, cb_scope, once) {
			var i, handler, ev;

			e_name = e_name.toLowerCase();



			// translate old names
			if (impl.translate_events[e_name]) {
				e_name = impl.translate_events[e_name];
			}

			if (!impl.events.hasOwnProperty(e_name)) {
				// allow subscriptions before they're registered
				impl.events[e_name] = [];
			}

			ev = impl.events[e_name];

			// don't allow a handler to be attached more than once to the same event
			for (i = 0; i < ev.length; i++) {
				handler = ev[i];
				if (handler && handler.fn === fn && handler.cb_data === cb_data && handler.scope === cb_scope) {
					return this;
				}
			}

			ev.push({
				fn: fn,
				cb_data: cb_data || {},
				scope: cb_scope || null,
				once: once || false
			});

			// attaching to page_ready after onload fires, so call soon
			if (e_name === "page_ready" && impl.onloadfired && impl.autorun) {
				this.setImmediate(fn, null, cb_data, cb_scope);
			}

			// Attach unload handlers directly to the window.onunload and
			// window.onbeforeunload events. The first of the two to fire will clear
			// fn so that the second doesn't fire. We do this because technically
			// onbeforeunload is the right event to fire, but not all browsers
			// support it.  This allows us to fall back to onunload when onbeforeunload
			// isn't implemented
			if (e_name === "page_unload" || e_name === "before_unload") {
				// Keep track of how many pagehide/unload/beforeunload handlers we're registering
				impl.unloadEventsCount++;

				(function() {
					var unload_handler, evt_idx = ev.length;

					unload_handler = function(evt) {
						if (fn) {
							fn.call(cb_scope, evt || w.event, cb_data);
						}

						// If this was the last pagehide/unload/beforeunload handler,
						// we'll try to send the beacon immediately after it is done.
						// The beacon will only be sent if one of the handlers has queued it.
						if (++impl.unloadEventCalled === impl.unloadEventsCount) {
							BOOMR.real_sendBeacon();
						}
					};

					if (e_name === "page_unload") {
						// pagehide is for iOS devices
						// see http://www.webkit.org/blog/516/webkit-page-cache-ii-the-unload-event/
						if (w.onpagehide || w.onpagehide === null) {
							BOOMR.utils.addListener(w, "pagehide", unload_handler);
						}
						else {
							BOOMR.utils.addListener(w, "unload", unload_handler);
						}
					}
					BOOMR.utils.addListener(w, "beforeunload", unload_handler);
				}());
			}

			return this;
		},

		/**
		 * Logs an internal Boomerang error.
		 *
		 * If the {@link BOOMR.plugins.Errors} plugin is enabled, this data will
		 * be compressed on the `err` beacon parameter.  If not, it will be included
		 * in uncompressed form on the `errors` parameter.
		 *
		 * @param {string|object} err Error
		 * @param {string} [src] Source
		 * @param {object} [extra] Extra data
		 *
		 * @memberof BOOMR
		 */
		addError: function BOOMR_addError(err, src, extra) {
			var str, E = BOOMR.plugins.Errors;



			BOOMR.error("Boomerang caught error: " + err + ", src: " + src + ", extra: " + extra);

			//
			// Use the Errors plugin if it's enabled
			//
			if (E && E.is_supported()) {
				if (typeof err === "string") {
					E.send({
						message: err,
						extra: extra,
						functionName: src,
						noStack: true
					}, E.VIA_APP, E.SOURCE_BOOMERANG);
				}
				else {
					if (typeof src === "string") {
						err.functionName = src;
					}

					if (typeof extra !== "undefined") {
						err.extra = extra;
					}

					E.send(err, E.VIA_APP, E.SOURCE_BOOMERANG);
				}

				return;
			}

			if (typeof err !== "string") {
				str = String(err);
				if (str.match(/^\[object/)) {
					str = err.name + ": " + (err.description || err.message).replace(/\r\n$/, "");
				}
				err = str;
			}
			if (src !== undefined) {
				err = "[" + src + ":" + BOOMR.now() + "] " + err;
			}
			if (extra) {
				err += ":: " + extra;
			}

			if (impl.errors[err]) {
				impl.errors[err]++;
			}
			else {
				impl.errors[err] = 1;
			}
		},

		/**
		 * Determines if the specified Error is a Cross-Origin error.
		 *
		 * @param {string|object} err Error
		 *
		 * @returns {boolean} True if the Error is a Cross-Origin error.
		 *
		 * @memberof BOOMR
		 */
		isCrossOriginError: function(err) {
			// These are expected for cross-origin iframe access.
			// For IE and Edge, we'll also check the error number for non-English browsers
			return err.name === "SecurityError" ||
				(err.name === "TypeError" && err.message === "Permission denied") ||
				(err.name === "Error" && err.message && err.message.match(/^(Permission|Access is) denied/)) ||
				err.number === -2146828218;  // IE/Edge error number for "Permission Denied"
		},

		/**
		 * Add one or more parameters to the beacon.
		 *
		 * This method may either be called with a single object containing
		 * key/value pairs, or with two parameters, the first is the variable
		 * name and the second is its value.
		 *
		 * All names should be strings usable in a URL's query string.
		 *
		 * We recommend only using alphanumeric characters and underscores, but you
		 * can use anything you like.
		 *
		 * Values should be strings (or numbers), and have the same restrictions
		 * as names.
		 *
		 * Parameters will be on all subsequent beacons unless `singleBeacon` is
		 * set.
		 *
		 * @param {string} name Variable name
		 * @param {string|object} val Value
		 * @param {boolean} singleBeacon Whether or not to add to a single beacon
		 * or all beacons
		 *
		 * @returns {BOOMR} Boomerang object
		 *
		 * @example
		 * BOOMR.addVar("page_id", 123);
		 * BOOMR.addVar({"page_id": 123, "user_id": "Person1"});
		 *
		 * @memberof BOOMR
		 */
		 addVar: function(name, value, singleBeacon) {


			if (typeof name === "string") {
				impl.vars[name] = value;
			}
			else if (typeof name === "object") {
				var o = name, k;
				for (k in o) {
					if (o.hasOwnProperty(k)) {
						impl.vars[k] = o[k];
					}
				}
			}

			if (singleBeacon) {
				impl.singleBeaconVars[name] = 1;
			}

			return this;
		},

		/**
		 * Appends data to a beacon.
		 *
		 * If the value already exists, a comma is added and the new data is applied.
		 *
		 * @param {string} name Variable name
		 * @param {string} val Value
		 *
		 * @returns {BOOMR} Boomerang object
		 *
		 * @memberof BOOMR
		 */
		appendVar: function(name, value) {
			var existing = BOOMR.getVar(name) || "";
			if (existing) {
				existing += ",";
			}

			BOOMR.addVar(name, existing + value);

			return this;
		},

		/**
		 * Removes one or more variables from the beacon URL. This is useful within
		 * a plugin to reset the values of parameters that it is about to set.
		 *
		 * Plugins can also use this in the {@link BOOMR#event:beacon} event to clear
		 * any variables that should only live on a single beacon.
		 *
		 * This method accepts either a list of variable names, or a single
		 * array containing a list of variable names.
		 *
		 * @param {string[]|string} name Variable name or list
		 *
		 * @returns {BOOMR} Boomerang object
		 *
		 * @memberof BOOMR
		 */
		removeVar: function(arg0) {
			var i, params;
			if (!arguments.length) {
				return this;
			}

			if (arguments.length === 1 && BOOMR.utils.isArray(arg0)) {
				params = arg0;
			}
			else {
				params = arguments;
			}

			for (i = 0; i < params.length; i++) {
				if (impl.vars.hasOwnProperty(params[i])) {
					delete impl.vars[params[i]];
				}
			}

			return this;
		},

		/**
		 * Determines whether or not the beacon has the specified variable.
		 *
		 * @param {string} name Variable name
		 *
		 * @returns {boolean} True if the variable is set.
		 *
		 * @memberof BOOMR
		 */
		hasVar: function(name) {
			return impl.vars.hasOwnProperty(name);
		},

		/**
		 * Gets the specified variable.
		 *
		 * @param {string} name Variable name
		 *
		 * @returns {object|undefined} Variable, or undefined if it isn't set
		 *
		 * @memberof BOOMR
		 */
		getVar: function(name) {
			return impl.vars[name];
		},

		/**
		 * Sets a variable's priority in the beacon URL.
		 * -1 = beginning of the URL
		 * 0  = middle of the URL (default)
		 * 1  = end of the URL
		 *
		 * @param {string} name Variable name
		 * @param {number} pri Priority (-1 or 1)
		 *
		 * @returns {BOOMR} Boomerang object
		 *
		 * @memberof BOOMR
		 */
		setVarPriority: function(name, pri) {
			if (typeof pri !== "number" || Math.abs(pri) !== 1) {
				return this;
			}

			impl.varPriority[pri][name] = 1;

			return this;
		},

		/**
		 * Sets the Referrers variable.
		 *
		 * @param {string} r Referrer from the document.referrer
		 *
		 * @memberof BOOMR
		 */
		setReferrer: function(r) {
			// document.referrer
			impl.r = r;
		},

		/**
		 * Starts a timer for a dynamic request.
		 *
		 * Once the named request has completed, call `loaded()` to send a beacon
		 * with the duration.
		 *
		 * @example
		 * var timer = BOOMR.requestStart("my-timer");
		 * // do stuff
		 * timer.loaded();
		 *
		 * @param {string} name Timer name
		 *
		 * @returns {object} An object with a `.loaded()` function that you can call
		 *     when the dynamic timer is complete.
		 *
		 * @memberof BOOMR
		 */
		requestStart: function(name) {
			var t_start = BOOMR.now();
			BOOMR.plugins.RT.startTimer("xhr_" + name, t_start);

			return {
				loaded: function(data) {
					BOOMR.responseEnd(name, t_start, data);
				}
			};
		},

		/**
		 * Determines if Boomerang can send a beacon.
		 *
		 * Queryies all plugins to see if they implement `readyToSend()`,
		 * and if so, that they return `true`.
		 *
		 * If not, the beacon cannot be sent.
		 *
		 * @returns {boolean} True if Boomerang can send a beacon
		 *
		 * @memberof BOOMR
		 */
		readyToSend: function() {
			var plugin;

			for (plugin in this.plugins) {
				if (this.plugins.hasOwnProperty(plugin)) {
					if (impl.disabled_plugins[plugin]) {
						continue;
					}

					if (typeof this.plugins[plugin].readyToSend === "function" &&
					    this.plugins[plugin].readyToSend() === false) {

						return false;
					}
				}
			}

			return true;
		},

		/**
		 * Sends a beacon for a dynamic request.
		 *
		 * @param {string|object} name Timer name or timer object data.
		 * @param {string} [name.initiator] Initiator, such as `xhr` or `spa`
		 * @param {string} [name.url] URL of the request
		 * @param {TimeStamp} t_start Start time
		 * @param {object} data Request data
		 * @param {TimeStamp} t_end End time
		 *
		 * @memberof BOOMR
		 */
		responseEnd: function(name, t_start, data, t_end) {
			// take the now timestamp for start and end, if unspecified, in case we delay this beacon
			t_start = typeof t_start === "number" ? t_start : BOOMR.now();
			t_end = typeof t_end === "number" ? t_end : BOOMR.now();

			// wait until all plugins are ready to send
			if (!BOOMR.readyToSend()) {


				// try again later
				setTimeout(function() {
					BOOMR.responseEnd(name, t_start, data, t_end);
				}, 1000);

				return;
			}

			// Wait until we've sent the Page Load beacon first
			if (!BOOMR.hasSentPageLoadBeacon() &&
			    !BOOMR.utils.inArray(name.initiator, BOOMR.constants.BEACON_TYPE_SPAS)) {
				// wait for a beacon, then try again
				BOOMR.subscribe("page_load_beacon", function() {
					BOOMR.responseEnd(name, t_start, data, t_end);
				}, null, BOOMR, true);

				return;
			}

			// Ensure we don't have two beacons trying to send data at the same time
			if (impl.beaconInQueue) {
				// wait until the beacon is sent, then try again
				BOOMR.subscribe("beacon", function() {
					BOOMR.responseEnd(name, t_start, data, t_end);
				}, null, BOOMR, true);

				return;
			}

			// Lock the beacon queue
			impl.beaconInQueue = true;

			if (typeof name === "object") {
				if (!name.url) {

					return;
				}

				impl.fireEvent("xhr_load", name);
			}
			else {
				// flush out any queue'd beacons before we set the Page Group
				// and timers
				BOOMR.real_sendBeacon();

				BOOMR.addVar("xhr.pg", name);
				BOOMR.plugins.RT.startTimer("xhr_" + name, t_start);
				impl.fireEvent("xhr_load", {
					name: "xhr_" + name,
					data: data,
					timing: {
						loadEventEnd: t_end
					}
				});
			}
		},

		//
		// uninstrumentXHR, instrumentXHR, uninstrumentFetch and instrumentFetch
		// are stubs that will be replaced by auto-xhr.js if active.
		//
		/**
		 * Undo XMLHttpRequest instrumentation and reset the original `XMLHttpRequest`
		 * object
		 *
		 * This is implemented in `plugins/auto-xhr.js` {@link BOOMR.plugins.AutoXHR}.
		 *
		 * @memberof BOOMR
		 */
		uninstrumentXHR: function() { },

		/**
		 * Instrument all requests made via XMLHttpRequest to send beacons.
		 *
		 * This is implemented in `plugins/auto-xhr.js` {@link BOOMR.plugins.AutoXHR}.
		 *
		 * @memberof BOOMR
		 */
		instrumentXHR: function() { },

		/**
		 * Undo fetch instrumentation and reset the original `fetch`
		 * function
		 *
		 * This is implemented in `plugins/auto-xhr.js` {@link BOOMR.plugins.AutoXHR}.
		 *
		 * @memberof BOOMR
		 */
		uninstrumentFetch: function() { },

		/**
		 * Instrument all requests made via fetch to send beacons.
		 *
		 * This is implemented in `plugins/auto-xhr.js` {@link BOOMR.plugins.AutoXHR}.
		 *
		 * @memberof BOOMR
		 */
		instrumentFetch: function() { },

		/**
		 * Request boomerang to send its beacon with all queued beacon data
		 * (via {@link BOOMR.addVar}).
		 *
		 * Boomerang may ignore this request.
		 *
		 * When this method is called, boomerang checks all plugins. If any
		 * plugin has not completed its checks (ie, the plugin's `is_complete()`
		 * method returns `false`, then this method does nothing.
		 *
		 * If all plugins have completed, then this method fires the
		 * {@link BOOMR#event:before_beacon} event with all variables that will be
		 * sent on the beacon.
		 *
		 * After all {@link BOOMR#event:before_beacon} handlers return, this method
		 * checks if a `beacon_url` has been configured and if there are any
		 * beacon parameters to be sent. If both are true, it fires the beacon.
		 *
		 * The {@link BOOMR#event:beacon} event is then fired.
		 *
		 * `sendBeacon()` should be called any time a plugin goes from
		 * `is_complete() = false` to `is_complete = true` so the beacon is
		 * sent.
		 *
		 * The actual beaconing is handled in {@link BOOMR.real_sendBeacon} after
		 * a short delay (via {@link BOOMR.setImmediate}).  If other calls to
		 * `sendBeacon` happen before {@link BOOMR.real_sendBeacon} is called,
		 * those calls will be discarded (so it's OK to call this in quick
		 * succession).
		 *
		 * @param {string} [beacon_url_override] Beacon URL override
		 *
		 * @memberof BOOMR
		 */
		sendBeacon: function(beacon_url_override) {
			// This plugin wants the beacon to go somewhere else,
			// so update the location
			if (beacon_url_override) {
				impl.beacon_url_override = beacon_url_override;
			}

			if (!impl.beaconQueued) {
				impl.beaconQueued = true;
				BOOMR.setImmediate(BOOMR.real_sendBeacon, null, null, BOOMR);
			}

			return true;
		},

		/**
		 * Sends a beacon when the beacon queue is empty.
		 *
		 * @param {object} params Beacon parameters to set
		 * @param {function} callback Callback to run when the queue is ready
		 * @param {object} that Function to apply callback to
		 */
		sendBeaconWhenReady: function(params, callback, that) {
			// If we're already sending a beacon, wait until the queue is empty
			if (impl.beaconInQueue) {
				// wait until the beacon is sent, then try again
				BOOMR.subscribe("beacon", function() {
					BOOMR.sendBeaconWhenReady(params, callback, that);
				}, null, BOOMR, true);

				return;
			}

			// Lock the beacon queue
			impl.beaconInQueue = true;

			// add all parameters
			for (var paramName in params) {
				if (params.hasOwnProperty(paramName)) {
					// add this data to a single beacon
					BOOMR.addVar(paramName, params[paramName], true);
				}
			}

			// run the callback
			if (typeof callback === "function" && typeof that !== "undefined") {
				callback.apply(that);
			}

			// send the beacon
			BOOMR.sendBeacon();
		},

		/**
		 * Sends all beacon data.
		 *
		 * This function should be called directly any time a "new" beacon is about
		 * to be constructed.  For example, if you're creating a new XHR or other
		 * custom beacon, you should ensure the existing beacon data is flushed
		 * by calling `BOOMR.real_sendBeacon();` first.
		 *
		 * @memberof BOOMR
		 */
		real_sendBeacon: function() {
			var k, form, url, errors = [], params = [], paramsJoined, varsSent = {}, _if;

			if (!impl.beaconQueued) {
				return false;
			}



			impl.beaconQueued = false;



			// At this point someone is ready to send the beacon.  We send
			// the beacon only if all plugins have finished doing what they
			// wanted to do
			for (k in this.plugins) {
				if (this.plugins.hasOwnProperty(k)) {
					if (impl.disabled_plugins[k]) {
						continue;
					}
					if (!this.plugins[k].is_complete(impl.vars)) {

						return false;
					}
				}
			}

			// Sanity test that the browser is still available (and not shutting down)
			if (!window || !window.Image || !window.navigator || !BOOMR.window) {

				return false;
			}

			// For SPA apps, don't strip hashtags as some SPA frameworks use #s for tracking routes
			// instead of History pushState() APIs. Use d.URL instead of location.href because of a
			// Safari bug.
			var isSPA = BOOMR.utils.inArray(impl.vars["http.initiator"], BOOMR.constants.BEACON_TYPE_SPAS);
			var isPageLoad = typeof impl.vars["http.initiator"] === "undefined" || isSPA;

			if (!impl.vars.pgu) {
				impl.vars.pgu = isSPA ? d.URL : d.URL.replace(/#.*/, "");
			}
			impl.vars.pgu = BOOMR.utils.cleanupURL(impl.vars.pgu);

			// Use the current document.URL if it hasn't already been set, or for SPA apps,
			// on each new beacon (since each SPA soft navigation might change the URL)
			if (!impl.vars.u || isSPA) {
				impl.vars.u = impl.vars.pgu;
			}

			if (impl.vars.pgu === impl.vars.u) {
				delete impl.vars.pgu;
			}

			// Add cleaned-up referrer URLs to the beacon, if available
			if (impl.r) {
				impl.vars.r = BOOMR.utils.cleanupURL(impl.r);
			}
			else {
				delete impl.vars.r;
			}

			impl.vars.v = BOOMR.version;

			// Snippet version, if available
			if (BOOMR.snippetVersion) {
				impl.vars.sv = BOOMR.snippetVersion;
			}

			// Snippet method is IFRAME if not specified (pre-v12 snippets)
			impl.vars.sm = BOOMR.snippetMethod || "i";

			if (BOOMR.session.enabled) {
				impl.vars["rt.si"] = BOOMR.session.ID + "-" + Math.round(BOOMR.session.start / 1000).toString(36);
				impl.vars["rt.ss"] = BOOMR.session.start;
				impl.vars["rt.sl"] = BOOMR.session.length;
			}

			if (BOOMR.visibilityState()) {
				impl.vars["vis.st"] = BOOMR.visibilityState();
				if (BOOMR.lastVisibilityEvent.visible) {
					impl.vars["vis.lv"] = BOOMR.now() - BOOMR.lastVisibilityEvent.visible;
				}
				if (BOOMR.lastVisibilityEvent.hidden) {
					impl.vars["vis.lh"] = BOOMR.now() - BOOMR.lastVisibilityEvent.hidden;
				}
			}

			impl.vars["ua.plt"] = navigator.platform;
			impl.vars["ua.vnd"] = navigator.vendor;

			if (this.pageId) {
				impl.vars.pid = this.pageId;
			}

			// add beacon number
			impl.vars.n = ++this.beaconsSent;

			if (w !== window) {
				_if = "if";  // work around uglifyJS minification that breaks in IE8 and quirks mode
				impl.vars[_if] = "";
			}

			for (k in impl.errors) {
				if (impl.errors.hasOwnProperty(k)) {
					errors.push(k + (impl.errors[k] > 1 ? " (*" + impl.errors[k] + ")" : ""));
				}
			}

			if (errors.length > 0) {
				impl.vars.errors = errors.join("\n");
			}

			impl.errors = {};

			// If we reach here, all plugins have completed
			impl.fireEvent("before_beacon", impl.vars);

			// clone the vars object for two reasons: first, so all listeners of
			// 'beacon' get an exact clone (in case listeners are doing
			// BOOMR.removeVar), and second, to help build our priority list of vars.
			for (k in impl.vars) {
				if (impl.vars.hasOwnProperty(k)) {
					varsSent[k] = impl.vars[k];
				}
			}

			BOOMR.removeVar(["qt", "pgu"]);

			// remove any vars that should only be on a single beacon
			for (var singleVarName in impl.singleBeaconVars) {
				if (impl.singleBeaconVars.hasOwnProperty(singleVarName)) {
					BOOMR.removeVar(singleVarName);
				}
			}

			// clear single beacon vars list
			impl.singleBeaconVars = {};

			// keep track of page load beacons
			if (!impl.hasSentPageLoadBeacon && isPageLoad) {
				impl.hasSentPageLoadBeacon = true;

				// let this beacon go out first
				BOOMR.setImmediate(function() {
					impl.fireEvent("page_load_beacon", varsSent);
				});
			}

			// Stop at this point if we are rate limited
			if (BOOMR.session.rate_limited) {

				return false;
			}

			// mark that we're no longer sending a beacon now, as those
			// paying attention to this will trigger at the beacon event
			impl.beaconInQueue = false;

			// send the beacon data
			BOOMR.sendBeaconData(varsSent);



			return true;
		},

		/**
		 * Determines whether or not a Page Load beacon has been sent.
		 *
		 * @returns {boolean} True if a Page Load beacon has been sent.
		 */
		hasSentPageLoadBeacon: function() {
			return impl.hasSentPageLoadBeacon;
		},

		/**
		 * Sends beacon data via the Beacon API, XHR or Image
		 *
		 * @param {object} data Data
		 */
		sendBeaconData: function(data) {
			var urlFirst = [], urlLast = [], params, paramsJoined,
			    url, img, useImg = true, xhr, ret;



			// Use the override URL if given
			impl.beacon_url = impl.beacon_url_override || impl.beacon_url;

			// Check that the beacon_url was set first
			if (!impl.beacon_url) {

				return false;
			}

			if (!impl.beaconUrlAllowed(impl.beacon_url)) {

				return false;
			}

			// Check that we have data to send
			if (data.length === 0) {
				return false;
			}

			// If we reach here, we've figured out all of the beacon data we'll send.
			impl.fireEvent("beacon", data);

			// get high- and low-priority variables first, which remove any of
			// those vars from data
			urlFirst = this.getVarsOfPriority(data, -1);
			urlLast  = this.getVarsOfPriority(data, 1);

			// merge the 3 lists
			params = urlFirst.concat(this.getVarsOfPriority(data, 0), urlLast);
			paramsJoined = params.join("&");

			// If beacon_url is protocol relative, make it https only
			if (impl.beacon_url_force_https && impl.beacon_url.match(/^\/\//)) {
				impl.beacon_url = "https:" + impl.beacon_url;
			}

			// if there are already url parameters in the beacon url,
			// change the first parameter prefix for the boomerang url parameters to &
			url = impl.beacon_url + ((impl.beacon_url.indexOf("?") > -1) ? "&" : "?") + paramsJoined;

			//
			// Try to send an IMG beacon if possible (which is the most compatible),
			// otherwise send an XHR beacon if the  URL length is longer than 2,000 bytes.
			//
			if (impl.beacon_type === "GET") {
				useImg = true;

				if (url.length > BOOMR.constants.MAX_GET_LENGTH) {
					((window.console && (console.warn || console.log)) || function() {})("Boomerang: Warning: Beacon may not be sent via GET due to payload size > 2000 bytes");
				}
			}
			else if (impl.beacon_type === "POST" || url.length > BOOMR.constants.MAX_GET_LENGTH) {
				// switch to a XHR beacon if the the user has specified a POST OR GET length is too long
				useImg = false;
			}

			//
			// Try the sendBeacon API first.
			// But if beacon_type is set to "GET", dont attempt
			// sendBeacon API call
			//
			if (w && w.navigator &&
			    typeof w.navigator.sendBeacon === "function" &&
			    BOOMR.utils.isNative(w.navigator.sendBeacon) &&
			    typeof w.Blob === "function" &&
			    impl.beacon_type !== "GET" &&
			    // As per W3C, The sendBeacon method does not provide ability to pass any
			    // header other than 'Content-Type'. So if we need to send data with
			    // 'Authorization' header, we need to fallback to good old xhr.
			    typeof impl.beacon_auth_token === "undefined" &&
			    !impl.beacon_disable_sendbeacon) {
				// note we're using sendBeacon with &sb=1
				var blobData = new w.Blob([paramsJoined + "&sb=1"], {
					type: "application/x-www-form-urlencoded"
				});

				if (w.navigator.sendBeacon(impl.beacon_url, blobData)) {
					return true;
				}

				// sendBeacon was not successful, try Image or XHR beacons
			}

			// If we don't have XHR available, force an image beacon and hope
			// for the best
			if (!BOOMR.orig_XMLHttpRequest && (!w || !w.XMLHttpRequest)) {
				useImg = true;
			}

			if (useImg) {
				//
				// Image beacon
				//

				// just in case Image isn't a valid constructor
				try {
					img = new Image();
				}
				catch (e) {

					return false;
				}

				img.src = url;
			}
			else {
				//
				// XHR beacon
				//

				// Send a form-encoded XHR POST beacon
				xhr = new (BOOMR.window.orig_XMLHttpRequest || BOOMR.orig_XMLHttpRequest || BOOMR.window.XMLHttpRequest)();
				try {
					this.sendXhrPostBeacon(xhr, paramsJoined);
				}
				catch (e) {
					// if we had an exception with the window XHR object, try our IFRAME XHR
					xhr = new BOOMR.boomerang_frame.XMLHttpRequest();
					this.sendXhrPostBeacon(xhr, paramsJoined);
				}
			}

			return true;
		},

		/**
		 * Determines whether or not a Page Load beacon has been sent.
		 *
		 * @returns {boolean} True if a Page Load beacon has been sent.
		 *
		 * @memberof BOOMR
		 */
		hasSentPageLoadBeacon: function() {
			return impl.hasSentPageLoadBeacon;
		},

		/**
		 * Sends a beacon via XMLHttpRequest
		 *
		 * @param {object} xhr XMLHttpRequest object
		 * @param {object} [paramsJoined] XMLHttpRequest.send() argument
		 *
		 * @memberof BOOMR
		 */
		sendXhrPostBeacon: function(xhr, paramsJoined) {
			xhr.open("POST", impl.beacon_url);

			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

			if (typeof impl.beacon_auth_token !== "undefined") {
				if (typeof impl.beacon_auth_key === "undefined") {
					impl.beacon_auth_key = "Authorization";
				}

				xhr.setRequestHeader(impl.beacon_auth_key, impl.beacon_auth_token);
			}

			if (impl.beacon_with_credentials) {
				xhr.withCredentials = true;
			}

			xhr.send(paramsJoined);
		},

		/**
		 * Gets all variables of the specified priority
		 *
		 * @param {object} vars Variables (will be modified for pri -1 and 1)
		 * @param {number} pri Priority (-1, 0, or 1)
		 *
		 * @return {string[]} Array of URI-encoded vars
		 *
		 * @memberof BOOMR
		 */
		getVarsOfPriority: function(vars, pri) {
			var name, url = [],
			    // if we were given a priority, iterate over that list
			    // else iterate over vars
			    iterVars = (pri !== 0 ? impl.varPriority[pri] : vars);

			for (name in iterVars) {
				// if this var is set, add it to our URL array
				if (iterVars.hasOwnProperty(name) && vars.hasOwnProperty(name)) {
					url.push(this.getUriEncodedVar(name, typeof vars[name] === "undefined" ? "" : vars[name]));

					// remove this name from vars so it isn't also added
					// to the non-prioritized list when pri=0 is called
					if (pri !== 0) {
						delete vars[name];
					}
				}
			}

			return url;
		},

		/**
		 * Gets a URI-encoded name/value pair.
		 *
		 * @param {string} name Name
		 * @param {string} value Value
		 *
		 * @returns {string} URI-encoded string
		 *
		 * @memberof BOOMR
		 */
		getUriEncodedVar: function(name, value) {
			if (value === undefined || value === null) {
				value = "";
			}

			if (typeof value === "object") {
				value = BOOMR.utils.serializeForUrl(value);
			}

			var result = encodeURIComponent(name) +
				"=" + encodeURIComponent(value);

			return result;
		},

		/**
		 * Gets the latest ResourceTiming entry for the specified URL.
		 *
		 * Default sort order is chronological startTime.
		 *
		 * @param {string} url Resource URL
		 * @param {function} [sort] Sort the entries before returning the last one
		 * @param {function} [filter] Filter the entries. Will be applied before sorting
		 *
		 * @returns {PerformanceEntry|undefined} Entry, or undefined if ResourceTiming is not
		 *  supported or if the entry doesn't exist
		 *
		 * @memberof BOOMR
		 */
		getResourceTiming: function(url, sort, filter) {
			var entries, p = BOOMR.getPerformance();

			try {
				if (p && typeof p.getEntriesByName === "function") {
					entries = p.getEntriesByName(url);
					if (!entries || !entries.length) {
						return;
					}
					if (typeof filter === "function") {
						entries = BOOMR.utils.arrayFilter(entries, filter);
						if (!entries || !entries.length) {
							return;
						}
					}
					if (entries.length > 1 && typeof sort === "function") {
						entries.sort(sort);
					}
					return entries[entries.length - 1];
				}
			}
			catch (e) {
				BOOMR.warn("getResourceTiming:" + e);
			}
		}


	};

	// if not already set already on BOOMR, determine the URL
	if (!BOOMR.url) {
		boomr.url = boomr.utils.getMyURL();
	}
	else {
		// canonicalize the URL
		var a = BOOMR.window.document.createElement("a");
		a.href = BOOMR.url;
		boomr.url = a.href;
	}

	/**
	 * @global
	 * @type {TimeStamp}
	 * @name BOOMR_lstart
	 * @desc
	 * Time the loader script started fetching boomerang.js (if the asynchronous
	 * loader snippet is used).
	 */
	if (typeof BOOMR_lstart === "number") {
		/**
		 * Time the loader script started fetching boomerang.js (if using the
		 * asynchronous loader snippet) (`BOOMR_lstart`)
		 * @type {TimeStamp}
		 *
		 * @memberof BOOMR
		 */
		boomr.t_lstart = BOOMR_lstart;
	}
	else if (typeof BOOMR.window.BOOMR_lstart === "number") {
		boomr.t_lstart = BOOMR.window.BOOMR_lstart;
	}

	/**
	 * Time the `window.onload` event fired (if using the asynchronous loader snippet).
	 *
	 * This timestamp is logged in the case boomerang.js loads after the onload event
	 * for browsers that don't support NavigationTiming.
	 *
	 * @global
	 * @name BOOMR_onload
	 * @type {TimeStamp}
	 */
	if (typeof BOOMR.window.BOOMR_onload === "number") {
		/**
		 * Time the `window.onload` event fired (if using the asynchronous loader snippet).
		 *
		 * This timestamp is logged in the case boomerang.js loads after the onload event
		 * for browsers that don't support NavigationTiming.
		 *
		 * @type {TimeStamp}
		 * @memberof BOOMR
		 */
		boomr.t_onload = BOOMR.window.BOOMR_onload;
	}

	(function() {
		var make_logger;

		if (typeof console === "object" && console.log !== undefined) {
			/**
			 * Logs the message to the console
			 *
			 * @param {string} m Message
			 * @param {string} l Log level
			 * @param {string} [s] Source
			 *
			 * @function log
			 *
			 * @memberof BOOMR
			 */
			boomr.log = function(m, l, s) {
				console.log("(" + BOOMR.now() + ") " +
					"{" + BOOMR.pageId + "}" +
					": " + s +
					": [" + l + "] " +
					m);
			};
		}
		else {
			// NOP for browsers that don't support it
			boomr.log = function() {};
		}

		make_logger = function(l) {
			return function(m, s) {
				this.log(m, l, "boomerang" + (s ? "." + s : ""));
				return this;
			};
		};

		/**
		 * Logs debug messages to the console
		 *
		 * Debug messages are stripped out of production builds.
		 *
		 * @param {string} m Message
		 * @param {string} [s] Source
		 *
		 * @function debug
		 *
		 * @memberof BOOMR
		 */
		boomr.debug = make_logger("debug");

		/**
		 * Logs info messages to the console
		 *
		 * @param {string} m Message
		 * @param {string} [s] Source
		 *
		 * @function info
		 *
		 * @memberof BOOMR
		 */
		boomr.info = make_logger("info");

		/**
		 * Logs warning messages to the console
		 *
		 * @param {string} m Message
		 * @param {string} [s] Source
		 *
		 * @function warn
		 *
		 * @memberof BOOMR
		 */
		boomr.warn = make_logger("warn");

		/**
		 * Logs error messages to the console
		 *
		 * @param {string} m Message
		 * @param {string} [s] Source
		 *
		 * @function error
		 *
		 * @memberof BOOMR
		 */
		boomr.error = make_logger("error");
	}());

	// If the browser supports performance.now(), swap that in for BOOMR.now
	try {
		var p = boomr.getPerformance();
		if (p &&
		    typeof p.now === "function" &&
		    // #545 handle bogus performance.now from broken shims
		    /\[native code\]/.test(String(p.now)) &&
		    p.timing &&
		    p.timing.navigationStart) {
			boomr.now = function() {
				return Math.round(p.now() + p.timing.navigationStart);
			};
		}
	}
	catch (ignore) {
		// empty
	}

	impl.checkLocalStorageSupport();

	(function() {
		var ident;
		for (ident in boomr) {
			if (boomr.hasOwnProperty(ident)) {
				BOOMR[ident] = boomr[ident];
			}
		}

		if (!BOOMR.xhr_excludes) {
			/**
			 * URLs to exclude from automatic `XMLHttpRequest` instrumentation.
			 *
			 * You can put any of the following in it:
			 * * A full URL
			 * * A hostname
			 * * A path
			 *
			 * @example
			 *
			 * BOOMR.xhr_excludes = {
			 *   "mysite.com": true,
			 *   "/dashboard/": true,
			 *   "https://mysite.com/dashboard/": true
			 * };
			 *
			 * @memberof BOOMR
			 */
			BOOMR.xhr_excludes = {};
		}
	}());



	dispatchEvent("onBoomerangLoaded", { "BOOMR": BOOMR }, true);

}(window));


// end of boomerang beaconing section

/**
 * Instrument and measure `XMLHttpRequest` (AJAX) requests.
 *
 * With this plugin, sites can measure the performance of `XMLHttpRequests`
 * (XHRs) and other in-page interactions after the page has been loaded.
 *
 * This plugin also monitors DOM manipulations following a XHR to filter out
 * "background" XHRs.
 *
 * For information on how to include this plugin, see the {@tutorial building} tutorial.
 *
 * ## What is Measured
 *
 * When `AutoXHR` is enabled, this plugin will monitor several events:
 *
 * - `XMLHttpRequest` requests
 * - `Fetch` API requests
 * - Clicks
 * - `window.History` changes indirectly through SPA plugins (History, Angular, etc.)
 *
 * When any of these events occur, `AutoXHR` will start monitoring the page for
 * other events, DOM manipulations and other networking activity.
 *
 * As long as the event isn't determined to be background activity (i.e an XHR
 * that didn't change the DOM at all), the event will be measured until all networking
 * activity has completed.
 *
 * This means if your click generated an XHR that triggered an updated view to fetch
 * more HTML that added images to the page, the entire event will be measured
 * from the click to the last image completing.
 *
 * ## Usage
 *
 * To enable AutoXHR, you should set {@link BOOMR.plugins.AutoXHR.init|instrument_xhr} to `true`:
 *
 *     BOOMR.init({
 *       instrument_xhr: true
 *     });
 *
 * Once enabled and initialized, the `window.XMLHttpRequest` object will be
 * replaced with a "proxy" object that instruments all XHRs.
 *
 * ## Monitoring XHRs
 *
 * After `AutoXHR` is enabled, any `XMLHttpRequest.send` will be monitored:
 *
 *     xhr = new XMLHttpRequest();
 *     xhr.open("GET", "/api/foo");
 *     xhr.send(null);
 *
 * If this XHR triggers DOM changes, a beacon will eventually be sent.
 *
 * This beacon will have `http.initiator=xhr` and the beacon parameters will differ
 * from a Page Load beacon.  See {@link BOOMR.plugins.RT} and
 * {@link BOOMR.plugins.NavigationTiming} for details.
 *
 * ## Combining XHR Beacons
 *
 * By default `AutoXHR` groups all XHR activity that happens in the same event together.
 *
 * If you have one XHR that immediately triggers a second XHR, you will get a single
 * XHR beacon.  The `u` (URL) will be of the first XHR.
 *
 * If you don't want this behavior, and want to measure *every* XHR on the page, you
 * can enable {@link BOOMR.plugins.AutoXHR.init|alwaysSendXhr=true}.  When set, every
 * distinct XHR will get its own XHR beacon.
 * {@link BOOMR.plugins.AutoXHR.init|alwaysSendXhr} can also be a list of strings
 * (matching URLs), regular expressions (matching URLs), or a function which returns
 * true for URLs to always send XHRs for.
 *
 * ### Compatibility and Browser Support
 *
 * Currently supported Browsers and platforms that AutoXHR will work on:
 *
 * - IE 9+ (not in quirks mode)
 * - Chrome 38+
 * - Firefox 25+
 *
 * In general we support all browsers that support
 * [MutationObserver]{@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver}
 * and [XMLHttpRequest]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest}.
 *
 * We will not use MutationObserver in IE 11 due to several browser bugs.
 * See {@link BOOMR.utils.isMutationObserverSupported} for details.
 *
 * ## Excluding Certain Requests From Instrumentation
 *
 * Whenever Boomerang intercepts an `XMLHttpRequest`, it will check if that request
 * matches anything in the XHR exclude list. If it does, Boomerang will not
 * instrument, time, send a beacon for that request, or include it in the
 * {@link BOOMR.plugins.SPA} calculations.
 *
 * The XHR exclude list is defined by creating an `BOOMR.xhr_excludes` map, and
 * adding URL parts that you would like to exclude from instrumentation. You
 * can put any of the following in `BOOMR.xhr_excludes`:
 *
 * 1. A full HREF
 * 2. A hostname
 * 3. A path
 *
 * Example:
 *
 * ```
 *
 *
 * BOOMR.xhr_excludes = {
 *   "www.mydomain.com":  true,
 *   "a.anotherdomain.net": true,
 *   "/api/v1/foobar":  true,
 *   "https://mydomain.com/dashboard/": true
 * };
 * ```
 *
 * ## Beacon Parameters
 *
 * XHR beacons have different parameters in general than Page Load beacons.
 *
 * - Many of the timestamps will differ, see {@link BOOMR.plugins.RT}
 * - All of the `nt_*` parameters are ResourceTiming, see {@link BOOMR.plugins.NavigationTiming}
 * - `u`: the URL of the resource that was fetched
 * - `pgu`: The URL of the page the resource was fetched on
 * - `http.initiator`: `xhr` for both XHR and Fetch requests
 *
 * ## Interesting Nodes
 *
 * MutationObserver is used to detect "interesting" nodes. Interesting nodes are
 * new IMG/IMAGE/IFRAME/LINK (rel=stylesheet) nodes or existing nodes that are
 * changing their source URL.
 * We consider the following "uninteresting" nodes:
 *   - Nodes that have either a width or height <= 1px.
 *   - Nodes that have display:none.
 *   - Nodes that have visibility:hidden.
 *   - Nodes that update their source URL to the same value.
 *   - Nodes that have a blank source URL.
 *   - Nodes that have a source URL starting with `about:`, `javascript:` or `data:`.
 *   - SCRIPT nodes because there is no consistent way to detect when they have loaded.
 *   - Existing IFRAME nodes that are changing their source URL because is no consistent
 *     way to detect when they have loaded.
 *   - Nodes that have a source URL that matches a AutoXHR exclude filter rule.
 *
 * ## Algorithm
 *
 * Here's how the general AutoXHR algorithm works:
 *
 * - `0.0` SPA hard route change (page navigation)
 *
 *   - Monitor for XHR resource requests and interesting Mutation resource requests
 *     for 1s or at least until page onload. We extend our 1s timeout after all
 *     interesting resource requests have completed.
 *
 * - `0.1` SPA soft route change from a synchronous call (eg. History changes as a
 *         result of a pushState or replaceState call)
 *
 *   - In this case we get the new URL when the developer calls pushState or
 *     replaceState.
 *   - We create a pending event with the start time and the new URL.
 *   - We do not know if they plan to make an XHR call or use a dynamic script
 *     node, or do nothing interesting (eg: just make a div visible/invisible).
 *   - We also do not know if they will do this before or after they've called
 *     pushState/replaceState.
 *   - Our best bet is to monitor if either a XHR resource requests or interesting
 *     Mutation resource requests will happen in the next 1s.
 *   - When interesting resources are detected, we wait until they complete.
 *   - We restart our 1s timeout after all interesting resources have completed.
  *  - If something uninteresting happens, we set the timeout for 1 second if
 *     it wasn't already started.
 *       - We'll only do this once per event since we don't want to continuously
 *         extend the timeout with each uninteresting event.
 *   - If nothing happens during the additional timeout, we stop watching and fire the
 *     event. The event end time will be end time of the last tracked resource.
 *   - If nothing interesting was detected during the first timeout and the URL has not
 *     changed then we drop the event.
 *
 * - `0.2` SPA soft route change from an asynchronous call (eg. History changes as a
 *         result of the user hitting Back/Forward and we get a window.popstate event)
 *
 *   - In this case we get the new URL from location.href when our event listener
 *     runs.
 *   - We do not know if this event change will result in some interesting network
 *     activity or not.
 *   - We do not know if the developer's event listener has already run before
 *     ours or if it will run in the future or even if they do have an event listener.
 *   - Our best bet is the same as 0.1 above.
 *
 * - `1` Click initiated (Only available when no SPA plugins are enabled)
 *
 *   - User clicks on something.
 *   - We create a pending event with the start time and no URL.
 *   - We turn on DOM observer, and wait up to 50 milliseconds for activity.
 *     - If nothing happens during the first timeout, we stop watching and clear the
 *       event without firing it.
 *     - Else if something uninteresting happens, we set the timeout for 1s
 *       if it wasn't already started.
 *       - We'll only do this once per event since we don't want to continuously
 *         extend the timeout with each uninteresting event.
 *     - Else if an interesting node is added, we add load and error listeners
 *       and turn off the timeout but keep watching.
 *       - Once all listeners have fired, we start waiting again up to 50ms for activity.
 *     - If nothing happens during the additional timeout, we stop watching and fire the event.
 *
 * - `2` XHR/Fetch initiated
 *
 *   - XHR or Fetch request is sent.
 *   - We create a pending event with the start time and the request URL.
 *   - We watch for all changes in XHR state (for async requests) and for load (for
 *     all requests).
 *   - We turn on DOM observer at XHR Onload or when the Fetch Promise resolves.
 *     We then wait up to 50 milliseconds for activity.
 *     - If nothing happens during the first timeout, we stop watching and clear the
 *       event without firing it.
 *     - If something uninteresting happens, we set the timeout for 1 second if
 *       it wasn't already started.
 *       - We'll only do this once per event since we don't want to continuously
 *         extend the timeout with each uninteresting event.
 *     - Else if an interesting node is added, we add load and error listeners
 *       and turn off the timeout.
 *       - Once all listeners have fired, we start waiting again up to 50ms for activity.
 *     - If nothing happens during the additional timeout, we stop watching and fire the event.
 *
 * What about overlap?
 *
 * - `3.1` XHR/Fetch initiated while a click event is pending
 *
 *   - If first click watcher has not detected anything interesting or does not
 *     have a URL, abort it
 *   - If the click watcher has detected something interesting and has a URL, then
 *     - Proceed with 2 above.
 *     - Concurrently, click stops watching for new resources
 *       - Once all resources click is waiting for have completed then fire the event.
 *
 * - `3.2` Click initiated while XHR/Fetch event is pending
 *
 *   - Ignore click
 *
 * - `3.3` Click initiated while a click event is pending
 *
 *   - If first click watcher has not detected anything interesting or does not
 *     have a URL, abort it.
 *   - Else proceed with parallel event steps from 3.1 above.
 *
 * - `3.4` XHR/Fetch initiated while an XHR/Fetch event is pending
 *
 *   - Add the second XHR/Fetch as an interesting resource to be tracked by the
 *     XHR pending event in progress.
 *
 * - `3.5` XHR/Fetch initiated while SPA event is pending
 *
 *   - Add the second XHR/Fetch as an interesting resource to be tracked by the
 *     XHR pending event in progress.
 *
 * - `3.6` SPA event initiated while an XHR event is pending
 *     - Proceed with 0 above.
 *     - Concurrently, XHR event stops watching for new resources. Once all resources
 *       the XHR event is waiting for have completed, fire the event.
 *
 * - `3.7` SPA event initiated while a SPA event is pending
 *     - If the pending SPA event had detected something interesting then send an aborted
 *       SPA beacon. If not, drop the pending event.
 *     - Proceed with 0 above.
 *
 * @class BOOMR.plugins.AutoXHR
 */
(function() {
	var w, d, handler, a, impl,
	    readyStateMap = ["uninitialized", "open", "responseStart", "domInteractive", "responseEnd"];

	/**
	 * Single Page Applications get an additional timeout for all XHR Requests to settle in.
	 * This is used after collecting resources for a SPA routechange.
	 * Default is 1000ms, overridable with spaIdleTimeout
	 * @type {number}
	 * @constant
	 * @default
	 */
	var SPA_TIMEOUT = 1000;

	/**
	 * Clicks and XHR events get 50ms for an interesting thing to happen before
	 * being cancelled.
	 * Default is 50ms, overridable with xhrIdleTimeout
	 * @type {number}
	 * @constant
	 * @default
	 */
	var CLICK_XHR_TIMEOUT = 50;


	/**
	 * Fetch events that don't read the body of the response get an extra wait time before
	 * we look for it's corresponding ResourceTiming entry.
	 * Default is 200ms, overridable with fetchBodyUsedWait
	 * @type {number}
	 * @constant
	 * @default
	 */
	var FETCH_BODY_USED_WAIT_DEFAULT = 200;

	/**
	 * If we get a Mutation event that doesn't have any interesting nodes after
	 * a Click or XHR event started, wait up to 1,000ms for an interesting one
	 * to happen before cancelling the event.
	 * @type {number}
	 * @constant
	 * @default
	 */
	var UNINTERESTING_MUTATION_TIMEOUT = 1000;

	/**
	 * How long to wait if we're not ready to send a beacon to try again.
	 * @constant
	 * @type {number}
	 * @default
	 */
	var READY_TO_SEND_WAIT = 500;

	/**
	 * Timeout event fired for XMLHttpRequest resource
	 * @constant
	 * @type {number}
	 * @default
	 */
	var XHR_STATUS_TIMEOUT        = -1001;

	/**
	 * XMLHttpRequest was aborted
	 * @constant
	 * @type {number}
	 * @default
	 */
	var XHR_STATUS_ABORT          = -999;

	/**
	 * An error occured fetching XMLHttpRequest/Fetch resource
	 * @constant
	 * @type {number}
	 * @default
	 */
	var XHR_STATUS_ERROR          = -998;

	/**
	 * An exception occured as we tried to request resource
	 * @constant
	 * @type {number}
	 * @default
	 */
	var XHR_STATUS_OPEN_EXCEPTION = -997;

	// Default resources to count as Back-End during a SPA nav
	var SPA_RESOURCES_BACK_END = ["xmlhttprequest", "script", "fetch"];




	if (BOOMR.plugins.AutoXHR) {
		return;
	}

	w = BOOMR.window;

	// If this browser cannot support XHR, we'll just skip this plugin which will
	// save us some execution time.

	// XHR not supported or XHR so old that it doesn't support addEventListener
	// (IE 6, 7, 8, as well as newer running in quirks mode.)
	if (!w || !w.XMLHttpRequest || !(new w.XMLHttpRequest()).addEventListener) {
		// Nothing to instrument
		return;
	}



	/**
	 * Tries to resolve `href` links from relative URLs.
	 *
	 * This implementation takes into account a bug in the way IE handles relative
	 * paths on anchors and resolves this by assigning `a.href` to itself which
	 * triggers the URL resolution in IE and will fix missing leading slashes if
	 * necessary.
	 *
	 * @param {string} anchor The anchor object to resolve
	 *
	 * @returns {string} The unrelativized URL href
	 * @memberof BOOMR.plugins.AutoXHR
	 */
	function getPathName(anchor) {
		if (!anchor) {
			return null;
		}

		/*
		 correct relativism in IE
		 anchor.href = "./path/file";
		 anchor.pathname == "./path/file"; //should be "/path/file"
		 */
		anchor.href = anchor.href;

		/*
		 correct missing leading slash in IE
		 anchor.href = "path/file";
		 anchor.pathname === "path/file"; //should be "/path/file"
		 */
		var pathName = anchor.pathname;
		if (pathName.charAt(0) !== "/") {
			pathName = "/" + pathName;
		}

		return pathName;
	}

	/**
	 * Based on the contents of BOOMR.xhr_excludes check if the URL that we instrumented as XHR request
	 * matches any of the URLs we are supposed to not send a beacon about.
	 *
	 * @param {HTMLAnchorElement} anchor HTML anchor element with URL of the element
	 * checked against `BOOMR.xhr_excludes`
	 *
	 * @returns {boolean} `true` if intended to be excluded, `false` if it is not in the list of excludables
	 * @memberof BOOMR.plugins.AutoXHR
	 */
	function shouldExcludeXhr(anchor) {
		var urlIdx;

		if (anchor.href) {
			if (anchor.href.match(/^(about:|javascript:|data:)/i)) {
				return true;
			}

			// don't track our own beacons (allow for protocol-relative URLs)
			if (typeof BOOMR.getBeaconURL === "function" && BOOMR.getBeaconURL()) {
				urlIdx = anchor.href.indexOf(BOOMR.getBeaconURL());
				if (urlIdx === 0 || urlIdx === 5 || urlIdx === 6) {
					return true;
				}
			}
		}

		return BOOMR.xhr_excludes.hasOwnProperty(anchor.href) ||
			BOOMR.xhr_excludes.hasOwnProperty(anchor.hostname) ||
			BOOMR.xhr_excludes.hasOwnProperty(getPathName(anchor));
	}

	/**
	 * Handles the MutationObserver for {@link BOOMR.plugins.AutoXHR}.
	 *
	 * @class MutationHandler
	 */
	function MutationHandler() {
		this.watch = 0;
		this.timer = null;

		this.pending_events = [];
		this.lastSpaLocation = null;
	}

	/**
	 * Disable internal MutationObserver instance. Use this when uninstrumenting the site we're on.
	 *
	 * @method
	 * @memberof MutationHandler
	 * @static
	 */
	MutationHandler.stop = function() {
		MutationHandler.pause();
		MutationHandler.observer = null;
	};

	/**
	 * Pauses the MutationObserver.  Call [resume]{@link handler#resume} to start it back up.
	 *
	 * @method
	 * @memberof MutationHandler
	 * @static
	 */
	MutationHandler.pause = function() {
		if (MutationHandler.observer &&
		    MutationHandler.observer.observer &&
		    !MutationHandler.isPaused) {
			MutationHandler.isPaused = true;
			MutationHandler.observer.observer.disconnect();
		}
	};

	/**
	 * Resumes the MutationObserver after a [pause]{@link handler#pause}.
	 *
	 * @method
	 * @memberof MutationHandler
	 * @static
	 */
	MutationHandler.resume = function() {
		if (MutationHandler.observer &&
		    MutationHandler.observer.observer &&
		    MutationHandler.isPaused) {
			MutationHandler.isPaused = false;
			MutationHandler.observer.observer.observe(d, MutationHandler.observer.config);
		}
	};

	/**
	 * Initiate {@link MutationHandler.observer} on the
	 * [outer parent document]{@link BOOMR.window.document}.
	 *
	 * Uses [addObserver]{@link BOOMR.utils.addObserver} to instrument.
	 *
	 * [Our internal handler]{@link handler#mutation_cb} will be called if
	 * something happens.
	 *
	 * @method
	 * @memberof MutationHandler
	 * @static
	 */
	MutationHandler.start = function() {
		if (MutationHandler.observer) {
			// don't start twice
			return;
		}

		var config = {
			childList: true,
			attributes: true,
			subtree: true,
			attributeFilter: ["src", "href"]
		};

		// Add a perpetual observer
		MutationHandler.observer = BOOMR.utils.addObserver(
			d,
			config,
			null, // no timeout
			handler.mutation_cb, // will always return true
			null, // no callback data
			handler
		);

		if (MutationHandler.observer) {
			MutationHandler.observer.config = config;

			BOOMR.subscribe("page_unload", MutationHandler.stop, null, MutationHandler);
		}
	};

	/**
	 * If an event has triggered a resource to be fetched we add it to the list of pending events
	 * here and wait for it to eventually resolve.
	 *
	 * @param {object} resource - [Resource]{@link AutoXHR#Resource} object we are waiting for
	 *
	 * @returns {?index} If we are already waiting for an event of this type null
	 * otherwise index in the [queue]{@link MutationHandler#pending_event}.
	 * @method
	 * @memberof MutationHandler
	 */
	MutationHandler.prototype.addEvent = function(resource) {
		var ev = {
			type: resource.initiator,
			resource: resource,
			nodes_to_wait: 0,  // MO resources + xhrs currently outstanding + wait filter (max: 1)
			total_nodes: 0,  // total MO resources + xhrs + wait filter (max: 1)
			resources: [],  // resources reported to MO handler (no xhrs)
			aborted: false,  // this event was aborted
			complete: false
		},
		    i,
		    last_ev,
		    last_ev_index,
		    index = this.pending_events.length,
		    self = this;

		for (i = index - 1; i >= 0; i--) {
			if (this.pending_events[i] && !this.pending_events[i].complete) {
				last_ev = this.pending_events[i];
				last_ev_index = i;
				break;
			}
		}

		if (last_ev) {
			if (last_ev.type === "click") {
				// 3.1 & 3.3
				if (last_ev.nodes_to_wait === 0 || !last_ev.resource.url) {
					this.pending_events[last_ev_index] = undefined;
					this.watch--;
					// continue with new event
				}
				// last_ev will no longer receive watches as ev will receive them
				// last_ev will wait for all interesting nodes and then send event
			}
			else if (last_ev.type === "xhr") {
				// 3.2
				if (ev.type === "click") {
					return null;
				}

				// 3.4
				// add this resource to the current event
				else if (ev.type === "xhr") {
					handler.add_event_resource(resource);
					return null;
				}

			}
			else if (BOOMR.utils.inArray(last_ev.type, BOOMR.constants.BEACON_TYPE_SPAS)) {
				// add this resource to the current event
				if (ev.type === "xhr") {
					handler.add_event_resource(resource);
					return null;
				}

				// if we have a pending SPA event, send an aborted load beacon before
				// adding the new SPA event
				if (BOOMR.utils.inArray(ev.type, BOOMR.constants.BEACON_TYPE_SPAS)) {


					// mark the end of this navigation as now
					last_ev.resource.timing.loadEventEnd = BOOMR.now();
					last_ev.aborted = true;

					// send the previous SPA
					this.sendEvent(last_ev_index);
				}
			}
		}

		if (ev.type === "click") {
			// if we don't have a MutationObserver then we just abort.
			// If an XHR starts later then it will be tracked as its own new event
			if (!MutationHandler.observer) {
				return null;
			}

			// give Click events 50ms to see if they resulted
			// in DOM mutations (and thus it is an 'interesting event').
			this.setTimeout(impl.xhrIdleTimeout, index);
		}
		else if (ev.type === "xhr") {
			// XHR events will not set a timeout yet.
			// The XHR's load finished callback will start the timer.
			// Increase node count since we are waiting for the XHR that started this event
			ev.nodes_to_wait++;
			ev.total_nodes++;
			// we won't track mutations yet, we'll monitor only when at least one of the
			// tracked xhr nodes has had a response
			ev.ignoreMO = true;
		}
		else if (BOOMR.utils.inArray(ev.type, BOOMR.constants.BEACON_TYPE_SPAS)) {
			// try to start the MO, in case we haven't had the chance to yet
			MutationHandler.start();

			if (!resource.wait) {
				// give SPAs a bit more time to do something since we know this was
				// an interesting event.
				this.setTimeout(impl.spaIdleTimeout, index);
			}
			else {
				// a wait filter isn't a node, but we'll use the same logic.
				// Increase node count since we are waiting for the waitComplete call.
				ev.nodes_to_wait++;
				ev.total_nodes++;
				// waitComplete() should be called once the held beacon is complete.
				// The caller is responsible for clearing the .wait flag
				resource.waitComplete = function() {
					self.load_finished(index);
					resource.waitComplete = undefined;
				};
			}
		}

		this.watch++;
		this.pending_events.push(ev);
		resource.index = index;

		return index;
	};

	/**
	 * If called with an event in the [pending events list]{@link MutationHandler#pending_events}
	 * trigger a beacon for this event.
	 *
	 * When the beacon is sent for this event is depending on either having a crumb, in which case this
	 * beacon will be sent immediately. If that is not the case we wait 5 seconds and attempt to send the
	 * event again.
	 *
	 * @param {number} index Index in event list to send
	 *
	 * @returns {undefined} Returns early if the event already completed
	 * @method
	 * @memberof MutationHandler
	 */
	MutationHandler.prototype.sendEvent = function(index) {
		var ev = this.pending_events[index], self = this, now = BOOMR.now();

		if (!ev || ev.complete) {
			return;
		}

		this.clearTimeout(index);
		if (BOOMR.readyToSend()) {
			ev.complete = true;

			this.watch--;

			ev.resource.resources = ev.resources;

			// for SPA events, the resource's URL may be set to the previous navigation's URL.
			// reset it to the current document URL
			if (BOOMR.utils.inArray(ev.type, BOOMR.constants.BEACON_TYPE_SPAS)) {
				ev.resource.url = d.URL;
			}

			// if this was a SPA soft nav with no URL change and did not trigger additional resources
			// then we will not send a beacon
			if (ev.type === "spa" && ev.total_nodes === 0 && ev.resource.url === self.lastSpaLocation) {

				BOOMR.fireEvent("spa_cancel");
				this.pending_events[index] = undefined;
				return;
			}

			if (BOOMR.utils.inArray(ev.type, BOOMR.constants.BEACON_TYPE_SPAS)) {
				// save the last SPA location
				self.lastSpaLocation = ev.resource.url;

				// if this was a SPA nav that triggered no additional resources, substract the
				// SPA_TIMEOUT from now to determine the end time
				if (!ev.forced && ev.total_nodes === 0) {
					ev.resource.timing.loadEventEnd = now - impl.spaIdleTimeout;
				}
			}

			this.sendResource(ev.resource, index);
		}
		else {
			// No crumb, so try again after 500ms seconds
			setTimeout(function() { self.sendEvent(index); }, READY_TO_SEND_WAIT);
		}
	};

	/**
	 * Creates and triggers sending a beacon for a Resource that has finished loading.
	 *
	 * @param {Resource} resource The Resource to send a beacon on
	 * @param {number} eventIndex index of the event in the pending_events array
	 *
	 * @method
	 * @memberof MutationHandler
	 */
	MutationHandler.prototype.sendResource = function(resource, eventIndex) {
		var self = this, ev = self.pending_events[eventIndex];

		// Use 'requestStart' as the startTime of the resource, if given
		var startTime = resource.timing ? resource.timing.requestStart : undefined;

		/**
		  * Called once the resource can be sent
		  * @param {boolean} [markEnd] Sets loadEventEnd once the function is run
		  * @param {number} [endTimestamp] End timestamp
		 */
		var sendResponseEnd = function(markEnd, endTimestamp) {
			if (markEnd) {
				resource.timing.loadEventEnd = endTimestamp || BOOMR.now();
			}

			// send any queued beacons first
			BOOMR.real_sendBeacon();

			// If the resource has an onComplete event, trigger it.
			if (resource.onComplete) {
				resource.onComplete(resource);
			}

			// Add ResourceTiming data to the beacon, starting at when 'requestStart'
			// was for this resource.
			if (BOOMR.plugins.ResourceTiming &&
			    BOOMR.plugins.ResourceTiming.is_enabled() &&
			    resource.timing &&
			    resource.timing.requestStart) {
				var r = BOOMR.plugins.ResourceTiming.getCompressedResourceTiming(
						resource.timing.requestStart,
						resource.timing.loadEventEnd
					);

				BOOMR.plugins.ResourceTiming.addToBeacon(r);
			}

			// For SPAs, calculate Back-End and Front-End timings
			if (BOOMR.utils.inArray(resource.initiator, BOOMR.constants.BEACON_TYPE_SPAS)) {
				self.calculateSpaTimings(resource);

				// If the SPA load was aborted, set the rt.quit and rt.abld flags
				if (typeof eventIndex === "number" && self.pending_events[eventIndex].aborted) {
					// Save the URL otherwise it might change before we have a chance to put it on the beacon
					BOOMR.addVar("pgu", d.URL);
					BOOMR.addVar("rt.quit", "");
					BOOMR.addVar("rt.abld", "");

					impl.addedVars.push("pgu", "rt.quit", "rt.abld");
				}
			}

			BOOMR.responseEnd(resource, startTime, resource);

			if (typeof eventIndex === "number") {
				self.pending_events[eventIndex] = undefined;
			}
		};

		// if this is a SPA Hard navigation, make sure it doesn't fire until onload
		if (resource.initiator === "spa_hard") {
			// don't wait for onload if this was an aborted SPA navigation
			if ((!ev || !ev.aborted) && !BOOMR.hasBrowserOnloadFired()) {
				BOOMR.utils.addListener(w, "load", function() {
					var loadTimestamp = BOOMR.now();

					// run after the 'load' event handlers so loadEventEnd is captured
					BOOMR.setImmediate(function() {
						sendResponseEnd(true, loadTimestamp);
					});
				});

				return;
			}
		}

		sendResponseEnd(false);
	};

	/**
	 * Calculates SPA Back-End and Front-End timings for Hard and Soft
	 * SPA navigations.
	 *
	 * @param {object} resource Resouce to calculate for
	 *
	 * @method
	 * @memberof MutationHandler
	 */
	MutationHandler.prototype.calculateSpaTimings = function(resource) {
		var p = BOOMR.getPerformance();
		if (!p || !p.timing) {
			return;
		}

		//
		// Hard Navigation:
		// Use same timers as a traditional navigation, where the root HTML's
		// timestamps are used for Back-End calculation.
		//
		if (resource.initiator === "spa_hard") {
			// ensure RT picks up the correct timestamps
			resource.timing.responseEnd = p.timing.responseStart;

			// use navigationStart instead of fetchStart to ensure Back-End time
			// includes any redirects
			resource.timing.fetchStart = p.timing.navigationStart;
		}
		else {
			//
			// Soft Navigation:
			// We need to overwrite two timers: Back-End (t_resp) and Front-End (t_page).
			//
			// For Single Page Apps, we're defining these as:
			// Back-End: Any timeslice where a XHR or JavaScript was outstanding
			// Front-End: Total Time - Back-End
			//
			if (!BOOMR.plugins.ResourceTiming ||
			    !BOOMR.plugins.ResourceTiming.is_supported()) {
				return;
			}

			// first, gather all Resources that were outstanding during this SPA nav
			var resources = BOOMR.plugins.ResourceTiming.getFilteredResourceTiming(
				resource.timing.requestStart,
				resource.timing.loadEventEnd,
				impl.spaBackEndResources).entries;

			// determine the total time based on the SPA logic
			var totalTime = Math.round(resource.timing.loadEventEnd - resource.timing.requestStart);

			if (!resources || !resources.length) {
				// If ResourceTiming is supported, but there were no entries,
				// this was all Front-End time
				resource.timers = {
					t_resp: 0,
					t_page: totalTime,
					t_done: totalTime
				};

				return;
			}

			// we currently can't reliably tell when a SCRIPT has loaded
			// set an upper bound on responseStart/responseEnd for the resources to the SPA's loadEventEnd
			var maxResponseEnd = resource.timing.loadEventEnd - p.timing.navigationStart;
			for (var i = 0; i < resources.length; i++) {
				if (resources[i].responseStart > maxResponseEnd) {
					resources[i].responseStart = maxResponseEnd;
					resources[i].responseEnd = maxResponseEnd;
				}
				else if (resources[i].responseEnd > maxResponseEnd) {
					resources[i].responseEnd = maxResponseEnd;
				}
			}

			// calculate the Back-End time based on any time those resources were active
			var backEndTime = Math.round(BOOMR.plugins.ResourceTiming.calculateResourceTimingUnion(resources));

			// front-end time is anything left over
			var frontEndTime = totalTime - backEndTime;

			if (backEndTime < 0 || totalTime < 0 || frontEndTime < 0) {
				// some sort of error, don't put on the beacon
				BOOMR.addError("Incorrect SPA time calculation");
				return;
			}

			// set timers on the resource so RT knows to use them
			resource.timers = {
				t_resp: backEndTime,
				t_page: frontEndTime,
				t_done: totalTime
			};
		}
	};

	/**
	 * Will create a new timer waiting for `timeout` milliseconds to wait until a
	 * resources load time has ended or should have ended. If the timeout expires
	 * the Resource at `index` will be marked as timedout and result in an error Resource marked with
	 * [XHR_STATUS_TIMEOUT]{@link AutoXHR#XHR_STATUS_TIMEOUT} as status information.
	 *
	 * @param {number} timeout - time ot wait for the resource to be loaded
	 * @param {number} index - Index of the {@link Resource} in our {@link MutationHandler#pending_events}
	 *
	 * @method
	 * @memberof MutationHandler
	 */
	MutationHandler.prototype.setTimeout = function(timeout, index) {
		var self = this;
		// we don't need to check if this is the latest pending event, the check is
		// already done by all callers of this function
		if (!timeout) {
			return;
		}

		this.clearTimeout(index);

		this.timer = setTimeout(function() { self.timedout(index); }, timeout);
	};

	/**
	 * Sends a Beacon for the [Resource]{@link AutoXHR#Resource} at `index` with the status
	 * [XHR_STATUS_TIMEOUT]{@link AutoXHR#XHR_STATUS_TIMEOUT} code, If there are multiple resources attached to the
	 * `pending_events` array at `index`.
	 *
	 * @param {number} index - Index of the event in pending_events array
	 *
	 * @method
	 * @memberof MutationHandler
	 */
	MutationHandler.prototype.timedout = function(index) {
		var ev;
		this.clearTimeout(index);

		ev = this.pending_events[index];

		if (ev) {
			if (ev.nodes_to_wait === 0) {
				// TODO, if xhr event did not trigger additional resources then do not
				// send a beacon unless it matches alwaysSendXhr. See !868

				// if click event did not trigger additional resources or doesn't have
				// a url then do not send a beacon
				if (ev.type === "click" && (ev.total_nodes === 0 || !ev.resource.url)) {
					this.watch--;
					this.pending_events[index] = undefined;
				}
				// send event if there are no outstanding downloads
				this.sendEvent(index);
			}

			// if there are outstanding downloads left, they will trigger a
			// sendEvent for the SPA/XHR pending event once complete
		}
	};

	/**
	 * If this instance of the {@link MutationHandler} has a `timer` set, clear it
	 *
	 * @param {number} index - Index of the event in pending_events array
	 *
	 * @memberof MutationHandler
	 * @method
	 */
	MutationHandler.prototype.clearTimeout = function(index) {
		// only clear timeout if this is the latest pending event.
		// If it is not the latest, then allow the timer to timeout. This can
		// happen in cases of concurrency, eg. an xhr event is waiting in timeout and
		// a spa event is triggered.
		if (this.timer && index === (this.pending_events.length - 1)) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	};

	/**
	 * Once an asset has been loaded and the resource appeared in the page we
	 * check if it was part of the interesting events on the page and mark it as finished.
	 *
	 * @callback load_cb
	 * @param {Event} ev - Load event Object
	 *
	 * @memberof MutationHandler
	 */
	MutationHandler.prototype.load_cb = function(ev, resourceNum) {
		var target, index, now = BOOMR.now();

		target = ev.target || ev.srcElement;
		if (!target || !target._bmr) {
			return;
		}

		index = target._bmr.idx;
		resourceNum = typeof resourceNum !== "undefined" ? resourceNum : (target._bmr.res || 0);

		if (target._bmr.end[resourceNum]) {
			// If we've already set the end value, don't call load_finished
			// again.  This might occur on IMGs that are 404s, which fire
			// 'error' then 'load' events
			return;
		}

		target._bmr.end[resourceNum] = now;

		this.load_finished(index, now);
	};

	/**
	 * Clear the flag preventing DOM mutation monitoring
	 *
	 * @param {number} index - Index of the event in pending_events array
	 *
	 * @memberof MutationHandler
	 * @method
	 */
	MutationHandler.prototype.monitorMO = function(index) {
		var current_event = this.pending_events[index];

		// event aborted
		if (!current_event) {
			return;
		}

		delete current_event.ignoreMO;
	};

	/**
	 * Decrement the number of [nodes_to_wait]{@link AutoXHR#.PendingEvent} for the
	 * [PendingEvent Object]{@link AutoXHR#.PendingEvent}.
	 *
	 * If the nodes_to_wait is decremented to 0 and the event type was SPA:
	 *
	 * When we're finished waiting on the last node,
	 * the MVC engine (eg AngularJS) might still be doing some processing (eg
	 * on an XHR) before it adds some additional content (eg IMGs) to the page.
	 * We should wait a while (1 second) longer to see if this happens.  If
	 * something else is added, we'll continue to wait for that content to
	 * complete.  If nothing else is added, the end event will be the
	 * timestamp for when this load_finished(), not 1 second from now.
	 *
	 * @param {number} index - Index of the event found in the pending_events array
	 * @param {TimeStamp} loadEventEnd - TimeStamp at which the resource was finished loading
	 *
	 * @method
	 * @memberof MutationHandler
	 */
	MutationHandler.prototype.load_finished = function(index, loadEventEnd) {
		var current_event = this.pending_events[index];

		// event aborted
		if (!current_event) {
			return;
		}

		current_event.nodes_to_wait--;

		if (current_event.nodes_to_wait === 0) {
			// mark the end timestamp with what was given to us, or, now
			current_event.resource.timing.loadEventEnd = loadEventEnd || BOOMR.now();

			// For Single Page Apps, when we're finished waiting on the last node,
			// the MVC engine (eg AngularJS) might still be doing some processing (eg
			// on an XHR) before it adds some additional content (eg IMGs) to the page.
			// We should wait a while (1 second) longer to see if this happens.  If
			// something else is added, we'll continue to wait for that content to
			// complete.  If nothing else is added, the end event will be the
			// timestamp for when this load_finished(), not 1 second from now.

			// We use the same behavior for XHR and click events but with a smaller timeout

			if (index === (this.pending_events.length - 1)) {
				// if we're the latest pending event then extend the timeout
				if (BOOMR.utils.inArray(current_event.type, BOOMR.constants.BEACON_TYPE_SPAS)) {
					this.setTimeout(impl.spaIdleTimeout, index);
				}
				else {
					this.setTimeout(impl.xhrIdleTimeout, index);
				}
			}
			else {
				// this should never happen for SPA events, they should always be the latest
				// pending event.
				this.sendEvent(index);
			}
		}
	};

	/**
	 * Determines if we should wait for resources that would be fetched by the
	 * specified node.
	 *
	 * @param {Element} node DOM node
	 * @param {number} index Event index
	 *
	 * @method
	 * @memberof MutationHandler
	 */
	MutationHandler.prototype.wait_for_node = function(node, index) {
		var self = this, current_event, els, interesting = false, i, l, url,
		    exisitingNodeSrcUrlChanged = false, resourceNum, domHeight, domWidth, listener;

		// only images, iframes and links if stylesheet
		// nodeName for SVG:IMAGE returns `image` in lowercase
		// scripts would be nice to track but their onload event is not reliable
		if (node && node.nodeName &&
		    (node.nodeName.toUpperCase().match(/^(IMG|IFRAME|IMAGE)$/) ||
		    (node.nodeName.toUpperCase() === "LINK" && node.rel && node.rel.match(/\bstylesheet\b/i)))) {

			// if the attribute change affected the src attributes we want to know that
			// as that means we need to fetch a new Resource from the server
			// We don't look at currentSrc here because that isn't set until after the resource fetch has started,
			// which will be after the MO observer completes.
			if (node._bmr && typeof node._bmr.res === "number" && node._bmr.end[node._bmr.res]) {
				exisitingNodeSrcUrlChanged = true;
			}

			// we put xlink:href before href because node.href works for <SVG:IMAGE> elements,
			// but does not return a string
			url = node.src ||
				(typeof node.getAttribute === "function" && node.getAttribute("xlink:href")) ||
				node.href;

			// no URL or javascript: or about: or data: URL, so no network activity
			if (!url || url.match(/^(about:|javascript:|data:)/i)) {
				return false;
			}

			// we get called from src/href attribute changes but also from nodes being added
			// which may or may not have been seen here before.
			// Check that if we've seen this node before, that the src/href in this case is
			// different which means we need to fetch a new Resource from the server
			if (node._bmr && node._bmr.url !== url) {
				exisitingNodeSrcUrlChanged = true;
			}

			if (node.nodeName === "IMG") {
				if (node.naturalWidth && !exisitingNodeSrcUrlChanged) {
					// img already loaded
					return false;
				}
				else if (typeof node.getAttribute === "function" && node.getAttribute("src") === "") {
					// placeholder IMG
					return false;
				}
			}

			// IFRAMEs whose SRC has changed will not fire a load event again
			if (node.nodeName === "IFRAME" && exisitingNodeSrcUrlChanged) {
				return false;
			}

			//
			// Don't track pixels: <= 1px, display:none or visibility:hidden.
			// Only use attributes, not computed styles, to avoid forcing layout
			//

			// First try to get the number of pixels from width or height attributes
			if (typeof node.getAttribute === "function") {
				domHeight = parseInt(node.getAttribute("height"), 10);
				domWidth = parseInt(node.getAttribute("width"), 10);
			}

			// If not specified, we can look at the style height/width.  We can
			// only be confident about "0", "0px" or "1px" that it's small -- things
			// like "0em" or "0in" would be relative.  Some things that are actually
			// small might not match this list, but it's safer to only check against
			// a known list.
			if (isNaN(domHeight)) {
				domHeight = (node.style &&
				   (node.style.height === "0" ||
					node.style.height === "0px" ||
					node.style.height === "1px")) ? 0 : undefined;
			}

			if (isNaN(domWidth)) {
				domWidth = (node.style &&
				   (node.style.width === "0" ||
					node.style.width === "0px" ||
					node.style.width === "1px")) ? 0 : undefined;
			}

			if (!isNaN(domHeight) && domHeight <= 1 && !isNaN(domWidth) && domWidth <= 1) {
				return false;
			}

			// Check against display:none
			if (node.style && node.style.display === "none") {
				return false;
			}

			// Check against visibility:hidden
			if (node.style && node.style.visibility === "hidden") {
				return false;
			}

			current_event = this.pending_events[index];

			if (!current_event) {
				return false;
			}

			// determine the resource number for this request
			resourceNum = current_event.resources.length;

			// create a placeholder ._bmr attribute
			if (!node._bmr) {
				node._bmr = {
					end: {}
				};
			}

			// keep track of all resources (URLs) seen for the root resource
			if (!current_event.urls) {
				current_event.urls = {};
			}

			if (current_event.urls[url]) {
				// we've already seen this URL, no point in waiting on it twice
				return false;
			}

			// if we don't have a URL yet (i.e. a click started this), use
			// this element's URL
			if (!current_event.resource.url) {
				a.href = url;

				if (impl.excludeFilter(a)) {

					// excluded resource, so abort
					return false;
				}

				current_event.resource.url = a.href;
			}

			// update _bmr with details about this resource
			node._bmr.res = resourceNum;
			node._bmr.idx = index;
			delete node._bmr.end[resourceNum];
			node._bmr.url = url;

			listener = function(ev) {
				self.load_cb(ev, resourceNum);
				// if either event fires then cleanup both listeners
				node.removeEventListener("load", listener);
				node.removeEventListener("error", listener);
			};

			node.addEventListener("load", listener);
			node.addEventListener("error", listener);

			// increase the number of outstanding resources by one
			current_event.nodes_to_wait++;

			// ensure the timeout is cleared
			this.clearTimeout(index);

			// increase the number of total resources by one
			current_event.total_nodes++;

			current_event.resources.push(node);

			// Note that we're tracking this URL
			current_event.urls[url] = 1;

			interesting = true;
		}
		// if it's an Element node such as <p> or <div>, find all the images contained in it
		else if (node.nodeType === Node.ELEMENT_NODE) {
			["IMAGE", "IMG"].forEach(function(tagName) {
				els = node.getElementsByTagName(tagName);
				if (els && els.length) {
					for (i = 0, l = els.length; i < l; i++) {
						interesting |= this.wait_for_node(els[i], index);
					}
				}
			}, this);
		}

		return interesting;
	};

	/**
	 * Adds a resource to the current event.
	 *
	 * Might fail (return -1) if:
	 * a) There are no pending events
	 * b) The current event is complete
	 * c) There's no passed-in resource
	 *
	 * @param resource Resource
	 *
	 * @return Event index, or -1 on failure
	 *
	 * @method
	 * @memberof MutationHandler
	 */
	MutationHandler.prototype.add_event_resource = function(resource) {
		var index = this.pending_events.length - 1, current_event;
		if (index < 0) {
			return -1;
		}

		current_event = this.pending_events[index];
		if (!current_event) {
			return -1;
		}

		if (!resource) {
			return -1;
		}



		// increase the number of outstanding resources by one
		current_event.nodes_to_wait++;
		// increase the number of total resources by one
		current_event.total_nodes++;

		resource.index = index;
		resource.node = true;  // this resource is a node being tracked by an existing pending event

		return index;
	};

	/**
	 * Callback called once [Mutation Observer instance]{@link MutationObserver#observer}
	 * noticed a mutation on the page. This method will determine if a mutation on
	 * the page is interesting or not.
	 *
	 * @callback mutation_cb
	 * @param {Mutation[]} mutations - Mutation array describing changes to the DOM
	 *
	 * @memberof MutationHandler
	 */
	MutationHandler.prototype.mutation_cb = function(mutations) {
		var self, index, evt;

		if (!this.watch) {
			return true;
		}

		self = this;
		index = this.pending_events.length - 1;

		if (index < 0 || !this.pending_events[index]) {
			// Nothing waiting for mutations
			return true;
		}

		evt = this.pending_events[index];

		// for xhr events, only track mutations if at least one of the tracked xhr nodes has
		// had a response
		if (evt.ignoreMO) {
			return true;
		}

		if (typeof evt.interesting === "undefined") {
			evt.interesting = false;
		}

		if (mutations && mutations.length) {
			evt.resource.timing.domComplete = BOOMR.now();

			mutations.forEach(function(mutation) {
				var i, l, node;
				if (mutation.type === "attributes") {
					evt.interesting |= self.wait_for_node(mutation.target, index);
				}
				else if (mutation.type === "childList") {
					// Go through any new nodes and see if we should wait for them
					l = mutation.addedNodes.length;
					for (i = 0; i < l; i++) {
						evt.interesting |= self.wait_for_node(mutation.addedNodes[i], index);
					}

					// Go through any removed nodes, and for IFRAMEs, see if we were
					// waiting for them.  If so, stop waiting, as removed IFRAMEs
					// don't trigger load or error events.
					l = mutation.removedNodes.length;
					for (i = 0; i < l; i++) {
						node = mutation.removedNodes[i];
						if (node.nodeName === "IFRAME" && node._bmr) {
							self.load_cb({target: node, type: "removed"});
						}
					}
				}
			});
		}

		if (!evt.interesting && !evt.timeoutExtended) {
			// timeout the event if we haven't already created a timer and
			// we didn't have any interesting nodes for this MO callback or
			// any prior callbacks
			this.setTimeout(UNINTERESTING_MUTATION_TIMEOUT, index);

			// only extend the timeout for an interesting thing to happen once
			evt.timeoutExtended = true;
		}

		return true;
	};

	/**
	 * Determines if the resources queue is empty
	 *
	 * @return {boolean} True if there are no outstanding resources
	 *
	 * @method
	 * @memberof MutationHandler
	 */
	MutationHandler.prototype.queue_is_empty = function() {
		return this.nodesWaitingFor() === 0;
	};

	/**
	 * Determines how many nodes are being waited on
	 * @param {number} [index] Optional Event index, defaults to last event
	 *
	 * @return {number} Number of nodes being waited on
	 *
	 * @method
	 * @memberof MutationHandler
	 */
	MutationHandler.prototype.nodesWaitingFor = function(index) {
		var ev;

		if (this.pending_events.length === 0) {
			return 0;
		}

		if (typeof index === "undefined") {
			index = this.pending_events.length - 1;
		}

		ev = this.pending_events[index];
		if (!ev) {
			return 0;
		}

		return ev.nodes_to_wait;
	};

	/**
	 * Completes the current event, marking the end time as 'now'.
	 * @param {number} [index] Optional Event index, defaults to last event
	 *
	 * @method
	 * @memberof MutationHandler
	 */
	MutationHandler.prototype.completeEvent = function(index) {
		var now = BOOMR.now(), ev;

		if (this.pending_events.length === 0) {
			// no active events
			return;
		}

		if (typeof index === "undefined") {
			index = this.pending_events.length - 1;
		}

		ev = this.pending_events[index];
		if (!ev) {
			// unknown event
			return;
		}

		// set the end timestamp to now
		ev.resource.timing.loadEventEnd = now;

		// note that this end was forced
		ev.forced = true;

		// complete this event
		this.sendEvent(index);
	};

	handler = new MutationHandler();

	/**
	 * Subscribe to click events on the page and see if they are triggering new
	 * resources fetched from the network in which case they are interesting
	 * to us!
	 */
	function instrumentClick() {
		// Capture clicks and wait 50ms to see if they result in DOM mutations
		BOOMR.subscribe("click", function() {
			if (impl.singlePageApp) {
				// In a SPA scenario, only route changes (or events from the SPA
				// framework) trigger an interesting event.
				return;
			}

			var resource = { timing: {}, initiator: "click" };

			if (!BOOMR.orig_XMLHttpRequest ||
			    BOOMR.orig_XMLHttpRequest === w.XMLHttpRequest) {
				// do nothing if we have un-instrumented XHR
				return;
			}

			resource.timing.requestStart = BOOMR.now();
			handler.addEvent(resource);
		});
	}

	/**
	 * Determines whether or not the specified url matches the
	 * {@link BOOMR.plugins.AutoXHR.init|alwaysSendXhr} list.
	 *
	 * `alwaysSendXhr` can be:
	 * * a `boolean`, if `true` meaning every XHR will send a beacon
	 * * a `function` which returns `true` for XHRs that should send a beacon
	 * * an array of `strings` or regular expressions which match to XHRs
	 *   that should send a beacon
	 *
	 * @param {string} url URL to match
	 * @param {string[]|RegExp[]|function|boolean} alwaysSendXhr Configuration
	 *
	 * @returns {boolean} True if the URL should always send a beacon
	 */
	function matchesAlwaysSendXhr(url, alwaysSendXhr) {
		var i, rule;

		if (!alwaysSendXhr || !url) {
			return false;
		}

		// alwaysSendXhr is a boolean
		if (typeof alwaysSendXhr === "boolean") {
			return alwaysSendXhr === true;
		}

		// alwaysSendXhr is a function
		if (typeof alwaysSendXhr === "function") {
			try {
				return alwaysSendXhr(url) === true;
			}
			catch (e) {
				return false;
			}
		}

		// alwaysSendXhr is a list of strings or regular expressions
		if (BOOMR.utils.isArray(alwaysSendXhr)) {
			for (i = 0; i < alwaysSendXhr.length; i++) {
				rule = alwaysSendXhr[i];

				if (typeof rule === "string" && rule === url) {
					return true;
				}
				else if (rule instanceof RegExp) {
					if (rule.test(url)) {
						return true;
					}
				}
			}
		}

		return false;
	}

	/**
	 * Replace original window.fetch with our implementation instrumenting
	 * any fetch requests happening afterwards
	 */
	function instrumentFetch() {
		if (!impl.monitorFetch ||
		    // we don't check that fetch is a native function in case it was already wrapped
		    // by another vendor
		    typeof w.fetch !== "function" ||
		    // native fetch support will define these, some polyfills like `unfetch` will not
		    typeof w.Request !== "function" ||
		    typeof w.Response !== "function" ||
		    // native fetch needs Promise support
		    typeof w.Promise !== "function" ||
		    // if our window doesn't have fetch then it was probably polyfilled in the top window
		    typeof window.fetch !== "function" ||
		    // Github's `whatwg-fetch` polyfill sets this flag
		    w.fetch.polyfill) {
			return;
		}

		if (BOOMR.proxy_fetch &&
		    BOOMR.proxy_fetch === w.fetch) {
			// already instrumented
			return;
		}

		if (BOOMR.proxy_fetch &&
		    BOOMR.orig_fetch &&
		    BOOMR.orig_fetch === w.fetch) {

			// was once instrumented and then uninstrumented, so just reapply the old instrumented object
			w.fetch = BOOMR.proxy_fetch;

			return;
		}

		// if there's a orig_fetch on the window, use that first (if another lib is overwriting fetch)
		BOOMR.orig_fetch = w.orig_fetch || w.fetch;

		BOOMR.proxy_fetch = function(input, init) {
			var url, method, payload,
			    // we want to keep initiator type as `xhr` for backwards compatibility.
			    // We'll differentiate fetch by `http.type=f` beacon param
			    resource = { timing: {}, initiator: "xhr" };

			// case where fetch() is called with a Request object
			if (typeof input === "object" && input instanceof w.Request) {
				url = input.url;

				// init overrides input
				method = (init && init.method) || input.method || "GET";
				if (impl.captureXhrRequestResponse) {
					payload = (init && init.body) || input.body || undefined;
				}
			}
			// case where fetch() is called with a string url (or anything else)
			else {
				url = input;
				method = (init && init.method) || "GET";
				if (impl.captureXhrRequestResponse) {
					payload = (init && init.body) || undefined;
				}
			}

			a.href = url;
			if (impl.excludeFilter(a)) {
				// this fetch should be excluded from instrumentation

				// call the original open method
				return BOOMR.orig_fetch.apply(w, arguments);
			}
			BOOMR.fireEvent("xhr_init", "fetch");

			resource.url = a.href;
			resource.method = method;
			resource.type = "fetch";  // pending event type will still be "xhr"
			if (payload) {
				resource.requestPayload = payload;
			}

			BOOMR.fireEvent("xhr_send", {resource: resource});

			handler.addEvent(resource);

			try {
				resource.timing.requestStart = BOOMR.now();
				var promise = BOOMR.orig_fetch.apply(this, arguments);

				/**
				 * wraps a onFulfilled or onRejection function that is passed to
				 * a promise's `.then` method. Will attempt to detect when there
				 * are no other promises in the chain that need to be executed and
				 * then mark the resource as finished. For simplicity, we only track
				 * the first `.then` call of each promise.
				 *
				 * @param {Promise} Promise that the callback is attached to
				 * @param {function} onFulfilled or onRejection callback function
				 * @param {Object} Fetch resource that we're handling in this promise
				 *
				 * @returns {function} Wrapped callback function
				 */
				function wrapCallback(_promise, _fn, _resource) {
					function done() {
						var now;
						// check if the response body was used, if not then we'll
						// wait a little bit longer. Hopefully it is a short response
						// (posibly only containing headers and status) and the entry
						// will be available in RT if we wait.
						// We don't detect if the response was consumed from a cloned object
						if (_resource.fetchResponse && !_resource.fetchResponse.bodyUsed && impl.fetchBodyUsedWait) {
							now = BOOMR.now();
							_resource.responseBodyNotUsed = true;
							setTimeout(function() {
								impl.loadFinished(_resource, now);
							}, impl.fetchBodyUsedWait);
						}
						else {
							impl.loadFinished(_resource);
						}
					}

					/**
					 * @returns {Promise} Promise result of callback or rethrows exception from callback
					 */
					return function() {
						var p, np = _promise._bmrNextP;
						try {
							p = _fn.apply((this === window ? w : this), arguments);

							// no exception thrown, check if there's a onFulfilled
							// callback in the chain
							while (np && !np._bmrHasOnFulfilled) {
								np = np._bmrNextP;  // next promise in the chain
							}
							if (!np) {
								// we didn't find one, if the callback result is a promise
								// then we'll wait for it to complete, if not mark this
								// resource as finished now
								if (p instanceof w.Promise) {
									p.then = wrapThen(p, p.then, _resource);
								}
								else {
									done();
								}
							}
							return p;
						}
						catch (e) {
							// exception thrown, check if there's a onRejected
							// callback in the chain
							while (np && !np._bmrHasOnRejected) {
								np = np._bmrNextP;  // next promise in the chain
							}
							if (!np) {
								// we didn't find one, mark the resource as complete
								done();
							}
							throw e;  // rethrow exception
						}
					};
				};

				/**
				 * wraps `.then` so that we can in turn wrap onFulfilled or onRejection that
				 * are passed to it. Wrapping `.then` will also trap calls from `.catch` and `.finally`
				 *
				 * @param {Promise} Promise that we're wrapping `.then` method for
				 * @param {function} `.then` function that will be wrapped
				 * @param {Object} Fetch resource that we're handling in this promise
				 *
				 * @returns {function} Wrapped `.then` function or original `.then` function
				 * if `.then` was already called on this promise
				 */
				function wrapThen(_promise, _then, _resource) {
					// only track the first `.then` call
					if (_promise._bmrNextP) {
						return _then;  // return unwrapped `.then`
					}
					/**
					 * @returns {Promise} Result of `.then` call
					 */
					return function(/* onFulfilled, onRejection */) {
						var args = Array.prototype.slice.call(arguments);
						if (args.length > 0) {
							if (typeof args[0] === "function") {
								args[0] = wrapCallback(_promise, args[0], _resource);
								_promise._bmrHasOnFulfilled = true;
							}
							if (args.length > 1) {
								if (typeof args[1] === "function") {
									args[1] = wrapCallback(_promise, args[1], _resource);
									_promise._bmrHasOnRejected = true;
								}
							}
						}
						var p = _then.apply(_promise, args);
						_promise._bmrNextP = p; // next promise in the chain
						// p should always be a Promise
						p.then = wrapThen(p, p.then, _resource);
						return p;
					};
				};

				// we can't just wrap functions that read the response (e.g.`.text`, `json`, etc.) or
				// instrument `.body.getReader`'s stream because they might never be called.
				// We'll wrap `.then` and all the callback handlers to figure out which
				// is the last handler to execute. Once the last handler runs, we'll mark the resource
				// as finished. For simplicity, we only track the first `.then` call of each promise
				promise.then = wrapThen(promise, promise.then, resource);

				return promise.then(function(response) {
					var i, res, ct, parseJson = false, parseXML = false;

					if (response.status < 200 || response.status >= 400) {
						// put the HTTP error code on the resource if it's not a success
						resource.status = response.status;
					}

					resource.fetchResponse = response;

					if (resource.index >= 0) {
						// response is starting to come in, we'll start monitoring for
						// DOM mutations
						handler.monitorMO(resource.index);
					}

					if (impl.captureXhrRequestResponse) {
						// clone not supported in Safari yet
						if (typeof response.clone === "function") {
							// content-type detection to determine if we should parse json or xml
							ct = response.headers.get("content-type");
							if (ct) {
								parseJson = ct.indexOf("json") !== -1;
								parseXML = ct.indexOf("xml") !== -1;
							}

							resource.response = {};
							try {
								res = response.clone();
								res.text().then(function(text) {
									resource.response.text = text;
									resource.response.raw = text;  // for fetch, we'll set raw to text value
									if (parseXML && typeof w.DOMParser === "function") {
										resource.response.xml = (new w.DOMParser()).parseFromString(text, "text/xml");
									}
								}).then(null, function(reason) {  // `.catch` will cause parse errors in old browsers
									// empty (avoid unhandled rejection)
								});
							}
							catch (e) {
								// empty
							}

							if (parseJson) {
								try {
									res = response.clone();
									res.json().then(function(json) {
										resource.response.json = json;
									}).then(null, function(reason) {  // `.catch` will cause parse errors in old browsers
										// empty (avoid unhandled rejection)
									});
								}
								catch (e) {
									// empty
								}
							}
						}
					}
					return response;
				}, function(reason) {
					// fetch() request failed (eg. cross-origin error, aborted, connection dropped, etc.)
					// we'll let the `.then` wrapper call finished for this resource

					// check if the fetch was aborted otherwise mark it as an error
					if (reason && (reason.name === "AbortError" || reason.code === 20)) {
						resource.status = XHR_STATUS_ABORT;
					}
					else {
						resource.status = XHR_STATUS_ERROR;
					}

					// rethrow the native method's exception
					throw reason;
				});
			}
			catch (e) {
				// there was an exception during fetch()
				resource.status = XHR_STATUS_OPEN_EXCEPTION;
				impl.loadFinished(resource);

				// rethrow the native method's exception
				throw e;
			}
		};

		// Overwrite window.fetch, ensuring the original is swapped back in
		// if the Boomerang IFRAME is unloaded.  uninstrumentFetch() may also
		// be used to swap the original back in.
		BOOMR.utils.overwriteNative(w, "fetch", BOOMR.proxy_fetch);
	}

	/**
	 * Put original fetch function back into place
	 */
	function uninstrumentFetch() {
		if (typeof w.fetch === "function" &&
		    BOOMR.orig_fetch && BOOMR.orig_fetch !== w.fetch) {
			w.fetch = BOOMR.orig_fetch;
		}
	}

	/**
	 * Replace original window.XMLHttpRequest with our implementation instrumenting
	 * any AJAX Requests happening afterwards. This will also enable instrumentation
	 * of mouse events (clicks) and start the {@link MutationHandler}
	 */
	function instrumentXHR() {
		if (BOOMR.proxy_XMLHttpRequest &&
			BOOMR.proxy_XMLHttpRequest === w.XMLHttpRequest) {
			// already instrumented
			return;
		}

		if (BOOMR.proxy_XMLHttpRequest &&
			BOOMR.orig_XMLHttpRequest &&
			BOOMR.orig_XMLHttpRequest === w.XMLHttpRequest) {
			// was once instrumented and then uninstrumented, so just reapply the old instrumented object

			w.XMLHttpRequest = BOOMR.proxy_XMLHttpRequest;
			MutationHandler.start();

			return;
		}

		// if there's a orig_XMLHttpRequest on the window, use that first (if another lib is overwriting XHR)
		BOOMR.orig_XMLHttpRequest = w.orig_XMLHttpRequest || w.XMLHttpRequest;

		MutationHandler.start();

		instrumentClick();

		/**
		 * Proxy `XMLHttpRequest` object
		 * @class ProxyXHRImplementation
		 */

		/**
		 * Open an XMLHttpRequest.
		 * If the URL passed as a second argument is in the BOOMR.xhr_exclude list ignore it and move on to request it
		 * Otherwise add it to our list of resources to monitor and later beacon on.
		 *
		 * If an exception is caught will call loadFinished and set resource.status to {@link XHR_STATUS_OPEN_EXCEPTION}
		 * Should the resource fail to load for any of the following reasons resource.stat status code will be set to:
		 *
		 * - timeout {Event} {@link XHR_STATUS_TIMEOUT}
		 * - error {Event} {@link XHR_STATUS_ERROR}
		 * - abort {Event} {@link XHR_STATUS_ABORT}
		 *
		 * @param {string} method HTTP request method
		 * @param {string} url URL to request on
		 * @param {boolean} [async] If `true` will setup the EventListeners for XHR events otherwise will set the resource
		 * to synchronous. If `true` or `undefined` will be automatically set to asynchronous
		 *
		 * @memberof ProxyXHRImplementation
		 */
		BOOMR.proxy_XMLHttpRequest = function() {
			var req, resource = { timing: {}, initiator: "xhr" }, orig_open, orig_send,
			    opened = false, excluded = false;

			req = new BOOMR.orig_XMLHttpRequest();

			orig_open = req.open;
			orig_send = req.send;

			req.open = function(method, url, async) {
				a.href = url;

				if (impl.excludeFilter(a)) {
					// this xhr should be excluded from instrumentation
					excluded = true;

					// call the original open method
					return orig_open.apply(req, arguments);
				}
				excluded = false;

				// Default value of async is true
				if (async === undefined) {
					async = true;
				}

				BOOMR.fireEvent("xhr_init", "xhr");

				/**
				 * Setup an {EventListener} for Event @param{ename}. This function will
				 * make sure the timestamp for the resources request is set and calls
				 * loadFinished should the resource have finished.
				 *
				 * See {@link open()} for it's usage
				 *
				 * @param ename {String} Eventname to listen on via addEventListener
				 * @param stat {String} if that {@link ename} is reached set this
				 * as the status of the resource
				 *
				 * @memberof ProxyXHRImplementation
				 */
				function addListener(ename, stat) {
					req.addEventListener(
						ename,
						function() {
							if (ename === "readystatechange") {
								resource.timing[readyStateMap[req.readyState]] = BOOMR.now();

								// Listen here as well, as DOM changes might happen on other listeners
								// of readyState = 4 (complete), and we want to make sure we've
								// started the addEvent() if so.  Only listen if the status is non-zero,
								// meaning the request wasn't aborted.  Aborted requests will fire the
								// next handler.
								if (req.readyState === 4 && req.status !== 0) {
									if (req.status < 200 || req.status >= 400) {
										// put the HTTP error code on the resource if it's not a success
										resource.status = req.status;
									}

									if (impl.captureXhrRequestResponse) {
										resource.response = {
											text: (req.responseType === "" || req.responseType === "text") ? req.responseText : null,
											xml: (req.responseType === "" || req.responseType === "document") ? req.responseXML : null,
											raw: req.response,
											json: req.responseJSON
										};

										//
										// Work around browser bugs where our Boomerang frame's Object is not equal
										// to the main frame's Object.  This affects "isPlainObj()"-like checks that
										// validate the .constructor is equal to the main frame's Object.
										// e.g.
										// https://github.com/facebook/immutable-js/blob/master/src/utils/isPlainObj.js
										// This seems to mostly affect Safari 11.1.
										//
										if (req.response &&
										    req.response.constructor &&
										    req.response.constructor === BOOMR.boomerang_frame.Object &&
										    BOOMR.boomerang_frame.Object !== w.Object) {
											try {
												// try to switch the constructor to the main window
												req.response.constructor = w.Object;
											}
											catch (e) {
												// NOP
											}
										}
									}

									impl.loadFinished(resource);
								}
								else if (req.readyState === 0 && typeof resource.timing.open === "number") {
									// something called .abort() after the request was started
									resource.status = XHR_STATUS_ABORT;
									impl.loadFinished(resource);
								}
							}
							else {
								// load, timeout, error, abort
								if (ename === "load") {
									if (req.status < 200 || req.status >= 400) {
										// put the HTTP error code on the resource if it's not a success
										resource.status = req.status;
									}
								}
								else {
									// this is a timeout/error/abort, so add the status code
									resource.status = (stat === undefined ? req.status : stat);
								}

								impl.loadFinished(resource);
							}
						},
						false
					);
				}

				// .open() can be called multiple times (before .send()) - just make
				// sure that we don't track this as a new request, or add additional
				// event listeners
				if (!opened) {
					if (async) {
						addListener("readystatechange");
					}

					addListener("load");
					addListener("timeout", XHR_STATUS_TIMEOUT);
					addListener("error",   XHR_STATUS_ERROR);
					addListener("abort",   XHR_STATUS_ABORT);
				}

				resource.url = a.href;
				resource.method = method;
				resource.type = "xhr";

				// reset any statuses from previous calls to .open()
				delete resource.status;

				if (!async) {
					resource.synchronous = true;
				}

				// note we've called .open
				opened = true;

				// call the original open method
				try {
					return orig_open.apply(req, arguments);
				}
				catch (e) {
					// if there was an exception during .open(), .send() won't work either,
					// so let's fire loadFinished now
					resource.status = XHR_STATUS_OPEN_EXCEPTION;
					impl.loadFinished(resource);

					// rethrow the native method's exception
					throw e;
				}
			};

			/**
			 * Mark requestStart timestamp and start the request unless the resource
			 * has already been marked as having an error code or a result to itself.
			 *
			 * @returns {Object} The data normal XHR.send() would return
			 *
			 * @memberof ProxyXHRImplementation
			 */
			req.send = function(data) {
				if (excluded) {
					// this xhr is excluded from instrumentation, call the original send method
					return orig_send.apply(req, arguments);
				}

				if (impl.captureXhrRequestResponse) {
					req.resource.requestPayload = data;
				}

				BOOMR.fireEvent("xhr_send", req);

				handler.addEvent(resource);

				resource.timing.requestStart = BOOMR.now();
				// call the original send method unless there was an error
				// during .open
				if (typeof resource.status === "undefined" ||
				    resource.status !== XHR_STATUS_OPEN_EXCEPTION) {
					return orig_send.apply(req, arguments);
				}
			};

			req.resource = resource;

			return req;
		};

		BOOMR.proxy_XMLHttpRequest.UNSENT = 0;
		BOOMR.proxy_XMLHttpRequest.OPENED = 1;
		BOOMR.proxy_XMLHttpRequest.HEADERS_RECEIVED = 2;
		BOOMR.proxy_XMLHttpRequest.LOADING = 3;
		BOOMR.proxy_XMLHttpRequest.DONE = 4;
		// set our proxy's prototype to the original XHR prototype, in case anyone
		// is using it to save state
		BOOMR.proxy_XMLHttpRequest.prototype = BOOMR.orig_XMLHttpRequest.prototype;

		// Overwrite window.XMLHttpRequest, ensuring the original is swapped back in
		// if the Boomerang IFRAME is unloaded.  uninstrumentXHR() may also
		// be used to swap the original back in.
		BOOMR.utils.overwriteNative(w, "XMLHttpRequest", BOOMR.proxy_XMLHttpRequest);
	}

	/**
	 * Put original XMLHttpRequest Configuration back into place
	 */
	function uninstrumentXHR() {
		if (BOOMR.orig_XMLHttpRequest && BOOMR.orig_XMLHttpRequest !== w.XMLHttpRequest) {
			w.XMLHttpRequest = BOOMR.orig_XMLHttpRequest;
		}
	}

	/**
	 * Sends an XHR resource
	 */
	function sendResource(resource) {
		resource.initiator = "xhr";

		BOOMR.responseEnd(resource);
	}

	/**
	 * Container for AutoXHR plugin Closure specific state configuration data
	 *
	 * @property {string[]} spaBackendResources Default resources to count as Back-End during a SPA nav
	 * @property {FilterObject[]} filters Array of {@link FilterObject} that is used to apply filters on XHR Requests
	 * @property {boolean} initialized Set to true after the first run of
	 * @property {string[]} addedVars Vars added to the next beacon only
	 * {@link BOOMR.plugins.AutoXHR#init}
	 */
	impl = {
		spaBackEndResources: SPA_RESOURCES_BACK_END,
		alwaysSendXhr: false,
		excludeFilters: [],
		initialized: false,
		addedVars: [],
		captureXhrRequestResponse: false,
		singlePageApp: false,
		autoXhrEnabled: false,
		monitorFetch: false,  // new feature, off by default
		fetchBodyUsedWait: FETCH_BODY_USED_WAIT_DEFAULT,
		spaIdleTimeout: SPA_TIMEOUT,
		xhrIdleTimeout: CLICK_XHR_TIMEOUT,

		/**
		 * Filter function iterating over all available {@link FilterObject}s if
		 * returns true will not instrument an XHR
		 *
		 * @param {HTMLAnchorElement} anchor - HTMLAnchorElement node created with
		 * the XHRs URL as `href` to evaluate by {@link FilterObject}s and passed
		 * to {@link FilterObject#cb} callbacks.
		 *
		 * NOTE: The anchor needs to be created from the host document
		 * (ie. `BOOMR.window.document`) to enable us to resolve relative URLs to
		 * a full valid path and BASE HREF mechanics can take effect.
		 *
		 * @return {boolean} true if the XHR should not be instrumented false if it should be instrumented
		 */
		excludeFilter: function(anchor) {
			var idx, ret, ctx;

			// If anchor is null we just throw it out period
			if (!anchor || !anchor.href) {
				return false;
			}

			for (idx = 0; idx < impl.excludeFilters.length; idx++) {
				if (typeof impl.excludeFilters[idx].cb === "function") {
					ctx = impl.excludeFilters[idx].ctx;
					if (impl.excludeFilters[idx].name) {

					}

					try {
						ret = impl.excludeFilters[idx].cb.call(ctx, anchor);
						if (ret) {


							return true;
						}
					}
					catch (exception) {
						BOOMR.addError(exception, "BOOMR.plugins.AutoXHR.impl.excludeFilter()");
					}
				}
			}
			return false;
		},

		/**
		 * Remove any added variables from this plugin from the beacon and clear internal collection of addedVars
		 */
		clear: function() {
			if (impl.addedVars && impl.addedVars.length > 0) {
				BOOMR.removeVar(impl.addedVars);
				impl.addedVars = [];
			}
		},

		/**
		 * Mark this as the time load ended via resources loadEventEnd property, if this resource has been added
		 * to the {@link MutationHandler} already notify that the resource has finished.
		 * Otherwise add this call to the lise of Events that occured.
		 *
		 * @param {object} resource Resource
		 *
		 * @memberof BOOMR.plugins.AutoXHR
		 */
		loadFinished: function(resource, now) {
			var entry, navSt, useRT = false, entryStartTime, entryResponseEnd, p;

			now = now || BOOMR.now();

			// if we already finished via readystatechange or an error event,
			// don't do work again
			if (resource.timing.loadEventEnd) {
				return;
			}

			// fire an event for anyone listening
			if (resource.status) {
				BOOMR.fireEvent("xhr_error", resource);
			}

			// set the loadEventEnd timestamp to when this callback fired
			resource.timing.loadEventEnd = now;

			p = BOOMR.getPerformance();
			if (p && p.timing) {
				navSt = p.timing.navigationStart;

				// if ResourceTiming is available, fix-up the .timings with ResourceTiming
				// data, as it will be more accurate
				entry = BOOMR.getResourceTiming(resource.url,
					function(rt1, rt2) {
						// sort by desc responseEnd so that we'll get the one that finished closest to now
						return rt1.responseEnd - rt2.responseEnd;
					},
					function(rt) {
						// filter out requests that started before our tracked resource.
						// We set `requestStart` right before calling the original xhr.send or fetch call.
						// If the ResourceTiming startTime is more than 2ms earlier
						// than when we thought the XHR/fetch started then this is probably
						// an entry for a different resource.
						// The RT entry's startTime needs to be converted to an Epoch
						return ((Math.ceil(navSt + rt.startTime + 2) >= resource.timing.requestStart)) &&
						    (rt.responseEnd !== 0);
					}
				);

				if (entry) {
					// convert the start time to Epoch
					entryStartTime = Math.floor(navSt + entry.startTime);

					// set responseEnd, convert to Epoch
					entryResponseEnd = Math.floor(navSt + entry.responseEnd);

					// sanity check to see if the entry should be used for this resource
					if (entryResponseEnd <= BOOMR.now()) {  // this check could be moved into the fiter above
						resource.timing.responseEnd = entryResponseEnd;

						// make sure loadEventEnd is greater or equal to the RT
						// entry's responseEnd.
						// This will happen when fetch API is used without consuming the
						// response body
						if (resource.timing.loadEventEnd < entryResponseEnd) {
							resource.timing.loadEventEnd = entryResponseEnd;
						}

						// use the startTime from ResourceTiming instead
						resource.timing.requestStart = entryStartTime;

						// also track it as the fetchStart time
						resource.timing.fetchStart = entryStartTime;

						// use responseStart if it's valid
						if (entry.responseStart !== 0) {
							resource.timing.responseStart = Math.floor(navSt + entry.responseStart);
						}

						// save the entry for later use
						resource.restiming = entry;
					}
				}
			}

			// if there's an active XHR event happening, and alwaysSendXhr is true, make sure this
			// XHR goes out on its own beacon too
			if (resource.node && matchesAlwaysSendXhr(resource.url, impl.alwaysSendXhr)) {
				handler.sendResource(resource);
			}

			if (resource.index >= 0) {
				handler.monitorMO(resource.index);

				// fire the load_finished handler for the corresponding event.
				handler.load_finished(resource.index, resource.timing.responseEnd);
			}
		}
	};

	BOOMR.plugins.AutoXHR = {
		/**
		 * This plugin is always complete (ready to send a beacon)
		 *
		 * @returns {boolean} `true`
		 * @memberof BOOMR.plugins.AutoXHR
		 */
		is_complete: function() {
			return true;
		},

		/**
		 * Initializes the plugin.
		 *
		 * @param {object} config Configuration
		 * @param {boolean} [config.instrument_xhr] Whether or not to instrument XHR
		 * @param {string[]} [config.AutoXHR.spaBackEndResources] Default resources to count as
		 * Back-End during a SPA nav
		 * @param {boolean} [config.AutoXHR.monitorFetch] Whether or not to instrument fetch()
		 * @param {number} [config.AuthXHR.fetchBodyUsedWait] If the fetch response's bodyUsed flag is false,
		 * we'll wait this amount of ms before checking RT for an entry. Setting to 0 will disable this feature
		 * @param {boolean} [config.AutoXHR.alwaysSendXhr] Whether or not to send XHR
		 * beacons for every XHR.
		 * @param {boolean} [config.captureXhrRequestResponse] Whether or not to capture an XHR's
		 * request and response bodies on for the {@link event:BOOMR#xhr_load xhr_load} event.
		 *
		 * @returns {@link BOOMR.plugins.AutoXHR} The AutoXHR plugin for chaining
		 * @memberof BOOMR.plugins.AutoXHR
		 */
		init: function(config) {
			var i, idx;

			d = w.document;

			// if we don't have window, abort
			if (!w || !d) {
				return;
			}

			a = d.createElement("A");

			// gather config and config overrides
			BOOMR.utils.pluginConfig(impl, config, "AutoXHR",
			    ["spaBackEndResources", "alwaysSendXhr", "monitorFetch", "fetchBodyUsedWait",
			    "spaIdleTimeout", "xhrIdleTimeout"]);

			BOOMR.instrumentXHR = instrumentXHR;
			BOOMR.uninstrumentXHR = uninstrumentXHR;
			BOOMR.instrumentFetch = instrumentFetch;
			BOOMR.uninstrumentFetch = uninstrumentFetch;

			// Ensure we're only once adding the shouldExcludeXhr
			if (!impl.initialized) {
				this.addExcludeFilter(shouldExcludeXhr, null, "shouldExcludeXhr");

				impl.initialized = true;
			}

			// Add filters from config
			if (config && config.AutoXHR && config.AutoXHR.excludeFilters && config.AutoXHR.excludeFilters.length > 0) {
				for (idx = 0; idx < config.AutoXHR.excludeFilters.length; idx++) {
					impl.excludeFilters.push(config.AutoXHR.excludeFilters[idx]);
				}
			}

			impl.autoXhrEnabled = config.instrument_xhr;

			// check to see if any of the SPAs were enabled
			if (BOOMR.plugins.SPA && BOOMR.plugins.SPA.supported_frameworks) {
				var supported = BOOMR.plugins.SPA.supported_frameworks();
				for (i = 0; i < supported.length; i++) {
					var spa = supported[i];
					if (config[spa] && config[spa].enabled) {
						impl.singlePageApp = true;
						break;
					}
				}
			}

			// Whether or not to always send XHRs.  If a SPA is enabled, this means it will
			// send XHRs during the hard and soft navs.  If enabled, it will also disable
			// listening for MutationObserver events after an XHR is complete.
			if (impl.alwaysSendXhr && impl.autoXhrEnabled && BOOMR.xhr && typeof BOOMR.xhr.stop === "function") {
				function sendXhrs(resources) {
					if (resources.length) {
						for (i = 0; i < resources.length; i++) {
							sendResource(resources[i]);
						}
					}
					else {
						// single resource
						sendResource(resources);
					}
				};

				var resources = BOOMR.xhr.stop(sendXhrs);

				if (resources && resources.length) {
					BOOMR.setImmediate(sendXhrs, resources);
				}
			}

			if (impl.singlePageApp) {
				if (!impl.alwaysSendXhr) {
					// Disable auto-xhr until the SPA has fired its first beacon.  The
					// plugin will re-enable after it's ready.
					impl.autoXhrEnabled = false;
				}

				if (impl.autoXhrEnabled) {
					BOOMR.instrumentXHR();
					BOOMR.instrumentFetch();
				}
			}
			else {
				if (impl.autoXhrEnabled) {
					BOOMR.instrumentXHR();
					BOOMR.instrumentFetch();
				}
				else if (impl.autoXhrEnabled === false) {
					BOOMR.uninstrumentXHR();
					BOOMR.uninstrumentFetch();
				}
			}

			BOOMR.registerEvent("xhr_error");

			BOOMR.subscribe("beacon", impl.clear, null, impl);
		},

		/**
		 * Gets the {@link MutationHandler}
		 *
		 * @returns {MutationHandler} Handler
		 * @memberof BOOMR.plugins.AutoXHR
		 */
		getMutationHandler: function() {
			return handler;
		},

		getPathname: getPathName,

		/**
		 * Enables AutoXHR if not already enabled.
		 *
		 * @memberof BOOMR.plugins.AutoXHR
		 */
		enableAutoXhr: function() {
			if (!impl.autoXhrEnabled) {
				BOOMR.instrumentXHR();
				BOOMR.instrumentFetch();
			}

			impl.autoXhrEnabled = true;
		},

		/**
		 * A callback with a HTML element.
		 * @callback htmlElementCallback
		 * @param {HTMLAnchorElement} elem HTML a element
		 * @memberof BOOMR.plugins.AutoXHR
		 */

		/**
		 * Add a filter function to the list of functions to run to validate if an
		 * XHR should be instrumented.
		 *
		 * @example
		 * BOOMR.plugins.AutoXHR.addExcludeFilter(function(anchor) {
		 *   var m = anchor.href.match(/some-page\.html/g);
		 *
		 *   // If matching flag to not instrument
		 *   if (m && m.length > 0) {
		 *     return true;
		 *   }
		 *   return false;
		 * }, null, "exampleFilter");
		 * @param {BOOMR.plugins.AutoXHR.htmlElementCallback} cb Callback to run to validate filtering of an XHR Request
		 * @param {Object} ctx Context to run {@param cb} in
		 * @param {string} [name] Optional name for the filter, called out when running exclude filters for debugging purposes
		 *
		 * @memberof BOOMR.plugins.AutoXHR
		 */
		addExcludeFilter: function(cb, ctx, name) {
			impl.excludeFilters.push({cb: cb, ctx: ctx, name: name});
		},

		/**
		 * Enables or disables XHR request and response capturing for
		 * the {@link event:BOOMR#xhr_load xhr_load} event.
		 *
		 * @param {boolean} enabled Whether or not to enable capturing
		 */
		setXhrRequestResponseCapturing: function(enabled) {
			impl.captureXhrRequestResponse = enabled;
		}


	};

	/**
	 * Hook called once a resource is found to be loaded and timers have been set.
	 * @callback ResourceOnComplete
	 * @memberof BOOMR.plugins.AutoXHR
	 */

	/**
	 * @typedef {Object} Resource
	 * @memberof BOOMR.plugins.AutoXHR
	 *
	 * @desc
	 * Resource objects define properties of a page element or resource monitored by {@link AutoXHR}.
	 *
	 * @property {string} initiator Type of source that initiated the resource to be fetched:
	 * `click`, `xhr` or SPA initiated
	 * @property {string} url Path to the resource fetched from either the HTMLElement or XHR request that triggered it
	 * @property {object} timing Resource timing information gathered from internal timers or ResourceTiming if supported
	 * @property {ResourceTiming} timing Object containing start and end timings of the resource if set
	 * @property {ResourceOnComplete} [onComplete] Called once the resource has been fetched
	 */

	/**
	 * An event on a page instrumented by {@link MutationHandler} and monitored by AutoXHR
	 *
	 * @typedef PendingEvent
	 *
	 * @property {string} type The type of event that we are watching (`xhr`, `click`,
	 *   [SPAs]{@link BOOMR.constants.BEACON_TYPE_SPAS})
	 * @property {number} nodes_to_wait Number of nodes to wait for before event completes
	 * @property {number} total_nodes Total number of resources
	 * @property {Resource} resource The resource this event is attached to
	 * @property {boolean} complete `true` if event completed `false` if not
	 * @property {Resource[]} [resources] multiple resources that are attached to this event
	 *
	 * @memberof BOOMR.plugins.AutoXHR
	 */

	/**
	 * Timestamps for start of a request and end of loading
	 *
	 * @typedef ResourceTiming
	 *
	 * @property {TimeStamp} loadEventEnd Timestamp when the resource arrived in the browser
	 * @property {TimeStamp} requestStart High resolution timestamp when the resource was started to be loaded
	 *
	 * @memberof BOOMR.plugins.AutoXHR
	 */

	/**
	 * Filter object with data on the callback, context and name.
	 *
	 * @typedef FilterObject
	 *
	 * @property {BOOMR.plugins.AutoXHR.htmlElementCallback} cb Callback
	 * @property {Object} ctx Execution context to use when running `cb`
	 * @property {string} [name] Name of the filter used for logging and debugging purposes (This is an entirely optional property)
	 *
	 * @memberof BOOMR.plugins.AutoXHR
	 */
})();

/**
 * Enables Single Page App (SPA) performance monitoring.
 *
 * **Note**: The `SPA` plugin requires the {@link BOOMR.plugins.AutoXHR} plugin
 * to be loaded before `SPA`, and one of the following SPA plugins to work:
 *
 * * {@link BOOMR.plugins.Angular}
 * * {@link BOOMR.plugins.Backbone}
 * * {@link BOOMR.plugins.Ember}
 * * {@link BOOMR.plugins.History} (React and all other SPA support)
 *
 * You also need to disable {@link BOOMR.init|autorun} when enabling SPA support.
 *
 * If you are not using a SPA framework but rely mostly on `XMLHttpRequests` to
 * build your site, you might be able to skip the SPA plugins and just enable
 * the {@link BOOMR.plugins.AutoXHR} plugin to measure your site.
 *
 * For information on how to include this plugin, see the {@tutorial building} tutorial.
 *
 * ## Approach
 *
 * Boomerang monitors Single Page App (SPA) navigations differently than how it
 * monitors navigations on traditional websites.
 *
 * On traditional websites, the browser completes a full navigation for every page.
 * During this navigation, the browser requests the page's HTML, JavaScript,
 * CSS, etc., from the server, and builds the page from these components. Boomerang
 * monitors this entire process.
 *
 * On SPA websites, only the first page that the visitor loads is a full
 * navigation. All subsequent navigations are handled by the SPA framework
 * itself (i.e. AngularJS), where they dynamically pull in the content they
 * need to render the new page. This is done without executing a full navigation
 * from the browser's point of view.
 *
 * Boomerang was designed for traditional websites, where a full navigation
 * occurs on each page load. During the navigation, Boomerang tracks the
 * performance characteristics of the entire page load experience. However, for
 * SPA websites, only the first page triggers a full navigation. Thus, without
 * any additional help, Boomerang will not track any subsequent interactions
 * on SPA websites.
 *
 * To give visibility into SPA website navigations, there are several Boomerang
 * plugins available for SPA frameworks, such as AngularJS, Ember.js and Backbone.js.
 * When these plugins are enabled, Boomerang is able to track all of the SPA
 * navigations beyond the first, initial navigation.
 *
 * To do so, the Boomerang SPA plugins listen for several life cycle events from
 * the framework, such as AngularJS's `$routeChangeStart`. Once it gets notified
 * of these events, the Boomerang SPA plugins start monitoring the page's markup
 * (DOM) for changes. If any of these changes trigger a download, such as a
 * XHR, image, CSS, or JavaScript, then the Boomerang SPA plugins monitor those
 * resources as well. Only once all of these new resources have been fetched do
 * the Boomerang SPA plugins consider the SPA navigation complete.
 *
 * For a further explanation of the challenges of measuring SPAs, see our
 * {@link https://www.slideshare.net/nicjansma/measuring-the-performance-of-single-page-applications|slides}
 * or our {@link https://www.youtube.com/watch?v=CYEYtQPofhQ&t=10s|talk}.
 *
 * ## Hard and Soft Navigations
 *
 * * A **SPA Hard Navigation** is always the first navigation to the site, plus
 *   any of the work required to build the initial view.
 *    * The Hard Navigation will track at least the length of `onload`, but may also include the additional
 *      time required to load the framework (for example, Angular) and the first view.
 *    * A SPA site will only have a single SPA Hard Navigation, no "Page Load" beacons.
 *    * The `http.initiator` type is `spa_hard`
 * * A **SPA Soft Navigation** is any navigation after the Hard Navigation.
 *    * A soft navigation is an "in-page" navigation where the view changes, but
 *      the browser does not actually fully navigate.
 *    * A SPA site could have zero through many Soft Navigations
 *    * The `http.initiator` type is `spa`
 *
 * ## Navigation Timestamps
 *
 * ### Hard Navigations
 *
 * The length of a Hard Navigation is calculated from the beginning of the browser
 * navigation (e.g. `navigationStart` from NavigationTiming) through when the
 * last critical resource has been fetched for the page.
 *
 * Critical resources include Images, IFRAMEs, CSS and Scripts.
 *
 * ### Soft Navigations
 *
 * The length of a Soft Navigation is calculated from the beginning of the route
 * change event (e.g. when the user clicked somewhere to change the view) through
 * when the last critical resource has been fetched for the page.
 *
 * ## Front-End vs. Back-End Time
 *
 * For SPA navigations, the _Back End_ time (`t_resp`) is calculated as any period
 * where a XHR or Script tag was being fetched.
 *
 * The _Front End_ time (`t_page`) is calculated by taking the total SPA Page
 * Load time (`t_done`) minus _Back End_ time (`t_resp`).
 *
 * ## Beacon Parameters
 *
 * * `http.initiator`
 *     * `spa_hard` for Hard Navigations
 *     * `spa` for Soft Navigations
 *
 * @class BOOMR.plugins.SPA
 */
(function() {
	var hooked = false,
	    initialized = false,
	    initialRouteChangeStarted = false,
	    initialRouteChangeCompleted = false,
	    autoXhrEnabled = false,
	    firstSpaNav = true,
	    routeFilter = false,
	    routeChangeWaitFilter = false,
	    disableHardNav = false,
	    supported = [],
	    latestResource,
	    waitingOnHardMissedComplete = false;




	if (BOOMR.plugins.SPA || !BOOMR.plugins.AutoXHR) {
		return;
	}



	var impl = {
		/**
		 * Called after a SPA Hard navigation that missed the route change
		 * completes.
		 *
		 * We may want to fix-up the timings of the SPA navigation if there was
		 * any other activity after onload.
		 *
		 * If there was not activity after onload, using the timings for
		 * onload from NavigationTiming.
		 *
		 * If there was activity after onload, use the end time of the latest
		 * resource.
		 *
		 * @param {BOOMR.plugins.AutoXHR.Resource} resource Resource
		 */
		spaHardMissedOnComplete: function(resource) {
			var p, navigationStart = (BOOMR.plugins.RT && BOOMR.plugins.RT.navigationStart());

			waitingOnHardMissedComplete = false;

			// note that we missed the route change on the beacon for debugging
			BOOMR.addVar("spa.missed", "1");

			// ensure t_done is the time we've specified
			if (BOOMR.plugins.RT) {
				BOOMR.plugins.RT.clearTimer("t_done");
			}

			// always use the start time of navigationStart
			resource.timing.requestStart = navigationStart;

			if (resource.resources.length === 0) {
				// No other resources were fetched, so set the end time
				// to NavigationTiming's performance.loadEventEnd if available (instead of 'now')
				p = BOOMR.getPerformance();
				if (p && p.timing && p.timing.navigationStart && p.timing.loadEventEnd) {
					resource.timing.loadEventEnd = p.timing.loadEventEnd;
				}
			}
		},

		/**
		 * Fired on each beacon.
		 */
		onBeacon: function() {
			// remove all of the potential parameters we added to the beacon
			BOOMR.removeVar("spa.missed", "spa.forced", "spa.waiting");
		}
	};

	//
	// Exports
	//
	BOOMR.plugins.SPA = {
		/**
		 * Determines if the plugin is complete
		 *
		 * @returns {boolean} True if the plugin is complete
		 *
		 * @memberof BOOMR.plugins.SPA
		 */
		is_complete: function() {
			return !waitingOnHardMissedComplete;
		},

		/**
		 * Called to initialize the plugin via BOOMR.init()
		 *
		 * @param {object} config Configuration
		 *
		 * @memberof BOOMR.plugins.SPA
		 */
		init: function(config) {
			if (config && config.instrument_xhr) {
				autoXhrEnabled = config.instrument_xhr;

				// if AutoXHR is enabled, and we've already had
				// a route change, make sure to turn AutoXHR back on
				if (initialRouteChangeStarted && autoXhrEnabled) {
					BOOMR.plugins.AutoXHR.enableAutoXhr();
				}
			}

			if (initialized) {
				return;
			}

			initialized = true;

			BOOMR.subscribe("beacon", impl.onBeacon, null, impl);
		},

		/**
		 * Registers a framework with the SPA plugin
		 *
		 * @param {string} pluginName Plugin name
		 *
		 * @memberof BOOMR.plugins.SPA
		 */
		register: function(pluginName) {
			supported.push(pluginName);
		},

		/**
		 * Gets a list of supported SPA frameworks
		 *
		 * @returns {string[]} List of supported frameworks
		 *
		 * @memberof BOOMR.plugins.SPA
		 */
		supported_frameworks: function() {
			return supported;
		},

		/**
		 * Fired when onload happens (or immediately if onload has already fired)
		 * to monitor for additional resources for a SPA Hard navigation
		 *
		 * @memberof BOOMR.plugins.SPA
		 */
		onLoadSpaHardMissed: function() {
			if (initialRouteChangeStarted) {
				// we were told the History event was missed, but it happened anyways
				// before onload
				return;
			}

			// We missed the initial route change (we loaded too slowly), so we're too
			// late to monitor for new DOM elements.  Don't hold the initial page load beacon.
			initialRouteChangeCompleted = true;

			if (autoXhrEnabled) {
				// re-enable AutoXHR if it's enabled
				BOOMR.plugins.AutoXHR.enableAutoXhr();
			}

			// ensure the beacon is held until this SPA hard beacon is ready
			waitingOnHardMissedComplete = true;

			if (!disableHardNav) {
				// `this` is unbound, use BOOMR.plugins.SPA
				BOOMR.fireEvent("spa_init", [BOOMR.plugins.SPA.current_spa_nav(), BOOMR.window.document.URL]);
				// Trigger a route change
				BOOMR.plugins.SPA.route_change(impl.spaHardMissedOnComplete);
			}
			else {
				waitingOnHardMissedComplete = false;
			}
		},

		/**
		 * Callback to let the SPA plugin know whether or not to monitor the current
		 * SPA soft route.
		 *
		 * Any time a route is changed, if set, this callback will be executed
		 * with the current framework's route data.
		 *
		 * If the callback returns `false`, the route will not be monitored.
		 *
		 * @callback spaRouteFilter
		 * @param {object} data Route data
		 *
		 * @returns {boolean} `true` to monitor the current route
		 * @memberof BOOMR.plugins.SPA
		 */

		/**
		 * Callback to let the SPA plugin know whether or not the end of monitoring
		 * of the current SPA soft route should be delayed until {@link BOOMR.plugins.SPA.wait_complete}
		 * is called.
		 *
		 * If the callback returns `false`, the route will be monitored as normal.
		 *
		 * @callback spaRouteChangeWaitFilter
		 * @param {object} data Route data
		 *
		 * @returns {boolean} `true` to wait until {@link BOOMR.plugins.SPA.wait_complete} is called.
		 * @memberof BOOMR.plugins.SPA
		 */

		/**
		 * Called by a framework when it has hooked into the target SPA
		 *
		 * @param {boolean} hadRouteChange True if a route change has already fired
		 * @param {object} [options] Additional options
		 * @param {BOOMR.plugins.SPA.spaRouteFilter} [options.routeFilter] Route filter
		 * @param {BOOMR.plugins.SPA.spaRouteChangeWaitFilter} [options.routeChangeWaitFilter] Route change wait filter
		 * @param {boolean} [options.disableHardNav] Disable sending SPA hard beacons
		 *
		 * @returns {@link BOOMR.plugins.SPA} The SPA plugin for chaining
		 * @memberof BOOMR.plugins.SPA
		 */
		hook: function(hadRouteChange, options) {
			options = options || {};



			// allow to set options each call in case they change

			if (typeof options.routeFilter === "function") {
				routeFilter = options.routeFilter;
			}

			if (typeof options.routeChangeWaitFilter === "function") {
				routeChangeWaitFilter = options.routeChangeWaitFilter;
			}

			if (options.disableHardNav) {
				disableHardNav = options.disableHardNav;
			}

			if (hooked) {
				return this;
			}

			if (hadRouteChange) {
				// kick off onLoadSpaHardMissed once onload has fired, or immediately
				// if onload has already fired
				BOOMR.attach_page_ready(this.onLoadSpaHardMissed);
			}

			hooked = true;

			return this;
		},

		/**
		 * Called by a framework when a route change has started.  The SPA plugin will
		 * begin monitoring downloadable resources to measure the SPA soft navigation.
		 *
		 * @param {function} onComplete Called on completion
		 * @param {object[]} routeFilterArgs Route Filter arguments
		 *
		 * @memberof BOOMR.plugins.SPA
		 */
		route_change: function(onComplete, routeFilterArgs) {


			var firedEvent = false;
			var initiator = firstSpaNav && !disableHardNav ? "spa_hard" : "spa";

			if (latestResource && latestResource.wait) {

				return;
			}

			// if we have a routeFilter, see if we want to track this SPA soft route
			if (initiator === "spa" && routeFilter) {
				try {
					if (!routeFilter.apply(null, routeFilterArgs)) {

						return;
					}
					else {

					}
				}
				catch (e) {
					BOOMR.addError(e, "SPA.route_change.routeFilter");
				}
			}

			// note we've had at least one route change
			initialRouteChangeStarted = true;

			// If this was the first request, use navStart as the begin timestamp.  Otherwise, use
			// "now" as the begin timestamp.
			var navigationStart = (BOOMR.plugins.RT && BOOMR.plugins.RT.navigationStart());
			var requestStart = initialRouteChangeCompleted ? BOOMR.now() : navigationStart;

			// use the document.URL even though it may be the URL of the previous nav. We will updated
			// it in AutoXHR sendEvent
			var url = BOOMR.window.document.URL;

			// construct the resource we'll be waiting for
			var resource = {
				timing: {
					requestStart: requestStart
				},
				initiator: initiator,
				url: url
			};

			firstSpaNav = false;

			if (!initialRouteChangeCompleted || typeof onComplete === "function") {
				initialRouteChangeCompleted = true;

				// if we haven't completed our initial SPA navigation yet (this is a hard nav), wait
				// for all of the resources to be downloaded
				resource.onComplete = function(onCompleteResource) {
					if (!firedEvent) {
						firedEvent = true;

						// fire a SPA navigation completed event so that other plugins can act on it
						BOOMR.fireEvent("spa_navigation");
					}

					if (typeof onComplete === "function") {
						onComplete(onCompleteResource);
					}
				};
			}

			// if we have a routeChangeWaitFilter, make sure AutoXHR waits on the custom event
			// for this SPA soft route
			if (initiator === "spa" && routeChangeWaitFilter) {

				try {
					if (routeChangeWaitFilter.apply(null, arguments)) {

						resource.wait = true;

						latestResource = resource;
					}
					else {

					}
				}
				catch (e) {
					BOOMR.addError(e, "SPA.route_change.routeChangeWaitFilter");
				}
			}

			// start listening for changes
			resource.index = BOOMR.plugins.AutoXHR.getMutationHandler().addEvent(resource);

			// re-enable AutoXHR if it's enabled
			if (autoXhrEnabled) {
				BOOMR.plugins.AutoXHR.enableAutoXhr();
			}
		},

		/**
		 * Called by a framework when the location has changed to the specified URL.
		 * This should be called prior to route_change() to use the specified URL.
		 *
		 * @param {string} url URL
		 *
		 * @memberof BOOMR.plugins.SPA
		 */
		last_location: function(url) {
			lastLocationChange = url;
		},

		/**
		 * Determine the current SPA navigation type (`spa` or `spa_hard`)
		 *
		 * @returns {string} SPA beacon type
		 * @memberof BOOMR.plugins.SPA
		 */
		current_spa_nav: function() {
			return !initialRouteChangeCompleted ? "spa_hard" : "spa";
		},

		/**
		 * Called by the SPA consumer if we have a `routeChangeWaitFilter` and are manually
		 * waiting for a custom event. The spa soft navigation will continue waiting for
		 * other nodes in progress
		 *
		 * @memberof BOOMR.plugins.SPA
		 */
		wait_complete: function() {
			if (latestResource) {
				latestResource.wait = false;

				if (latestResource.waitComplete) {

					latestResource.waitComplete();
				}

				latestResource = null;
			}
		},

		/**
		 * Marks the current navigation as complete and sends a beacon.
		 * The spa soft navigation will not wait for other nodes in progress
		 *
		 * @memberof BOOMR.plugins.SPA
		 */
		markNavigationComplete: function() {
			var i, ev, waiting, mh = BOOMR.plugins.AutoXHR.getMutationHandler();

			// if we're waiting due to a `routeChangeWaitFilter` then mark it complete
			if (latestResource && latestResource.wait) {
				BOOMR.plugins.SPA.wait_complete();
			}

			if (mh && mh.pending_events.length > 0) {
				for (i = mh.pending_events.length - 1; i >= 0; i--) {
					ev = mh.pending_events[i];
					if (ev && BOOMR.utils.inArray(ev.type, BOOMR.constants.BEACON_TYPE_SPAS)) {
						if (ev.complete) {
							// latest spa is not in progress
							break;
						}

						waiting = mh.nodesWaitingFor(i);



						// note that the navigation was forced complete
						BOOMR.addVar("spa.forced", "1");

						// add the count of nodes we were waiting for
						BOOMR.addVar("spa.waiting", waiting);

						// finalize this navigation
						mh.completeEvent(i);
						return;
					}
				}
			}

		},

		/**
		 * Determines if a SPA navigation is in progress
		 *
		 * @memberof BOOMR.plugins.SPA
		 */
		isSpaNavInProgress: function() {
			var i, ev, waiting, mh = BOOMR.plugins.AutoXHR.getMutationHandler();
			if (mh && mh.pending_events.length > 0) {
				for (i = mh.pending_events.length - 1; i >= 0; i--) {
					ev = mh.pending_events[i];
					if (ev && BOOMR.utils.inArray(ev.type, BOOMR.constants.BEACON_TYPE_SPAS)) {
						return !ev.complete;  // true if the latest spa nav is not complete
					}
				}
			}
			return false;
		}

	};
	BOOMR.plugins.SPA.waitComplete = BOOMR.plugins.SPA.wait_complete;

}());

/**
 * The `Angular` plugin allows you to automatically monitor Single Page
 * App (SPA) navigations for [AngularJS 1.x]{@link https://angularjs.org/}
 * websites.
 *
 * **Note**: This plugin requires the {@link BOOMR.plugins.AutoXHR} and
 * {@link BOOMR.plugins.SPA} plugins to be loaded first (in that order).
 *
 * For details on how Boomerang Single Page App instrumentation works, see the
 * {@link BOOMR.plugins.SPA} documentation.
 *
 * For information on how to include this plugin, see the {@tutorial building} tutorial.
 *
 * ## Compatibility
 *
 * * AngularJS 1.x
 * * Router support:
 *   * {@link https://docs.angularjs.org/api/ngRoute|ngRoute}
 *   * {@link https://github.com/angular-ui/ui-router|ui-router}
 *
 * **Note**: For AngularJS 2.x, use the {@link BOOMR.plugins.History} plugin.
 *
 * ## Beacon Parameters
 *
 * This plugin does not add any additional beacon parameters beyond the
 * {@link BOOMR.plugins.SPA} plugin.
 *
 * ## Usage
 *
 * First, include the {@link BOOMR.plugins.SPA}, {@link BOOMR.plugins.Angular}
 * and {@link BOOMR.plugins.AutoXHR} plugins.  See {@tutorial building} for details.
 *
 * Next, you need to also "hook" Boomerang into the AngularJS lifecycle events.
 *
 * Somewhere in your AngularJS app or module startup, add a `.run()` block with
 * a `$rootScope` dependency.  In this run block, add the code below, calling
 * {@link BOOMR.plugins.Angular.hook}.
 *
 * Example:
 *
 * ```
 * angular.module("app")
 *   .run(["$rootScope", function($rootScope) {
 *     var hadRouteChange = false;
 *
 *     // The following listener is required if you're using ng-router
 *     $rootScope.$on("$routeChangeStart", function() {
 *       hadRouteChange = true;
 *     });
 *
 *     // The following listener is required if you're using ui-router
 *     $rootScope.$on("$stateChangeStart", function() {
 *       hadRouteChange = true;
 *     });
 *
 *     function hookAngularBoomerang() {
 *       if (window.BOOMR && BOOMR.version) {
 *         if (BOOMR.plugins && BOOMR.plugins.Angular) {
 *           BOOMR.plugins.Angular.hook($rootScope, hadRouteChange);
 *         }
 *         return true;
 *       }
 *     }
 *
 *     if (!hookAngularBoomerang()) {
 *       if (document.addEventListener) {
 *         document.addEventListener("onBoomerangLoaded", hookAngularBoomerang);
 *       } else if (document.attachEvent) {
 *         document.attachEvent("onpropertychange", function(e) {
 *           e = e || window.event;
 *           if (e && e.propertyName === "onBoomerangLoaded") {
 *             hookAngularBoomerang();
 *           }
 *         });
 *       }
 *   }]);
 * ```
 *
 * @class BOOMR.plugins.Angular
 */
(function() {
	var hooked = false,
	    enabled = true,
	    hadMissedRouteChange = false,
	    lastRouteChangeTime = 0,
	    locationChangeTrigger = false,
	    disableLocationChangeTrigger = false;




	if (BOOMR.plugins.Angular || typeof BOOMR.plugins.SPA === "undefined") {
		return;
	}

	// register as a SPA plugin
	BOOMR.plugins.SPA.register("Angular");

	/**
	 * Bootstraps the Angular plugin with the specified $rootScope of the host
	 * Angular app.
	 *
	 * @param $rootScope Host AngularJS app's $rootScope
	 * @param $transitions UI-Router's TransitionService
	 *
	 * @return {boolean} True on success
	 */
	function bootstrap($rootScope, $transitions) {
		if (typeof $rootScope === "undefined") {
			return false;
		}

		// We need the AutoXHR and SPA plugins to operate
		if (!BOOMR.plugins.AutoXHR ||
		    !BOOMR.plugins.SPA) {
			return false;
		}



		/**
		 * Fires the SPA route_change event.
		 *
		 * If it's been over 50ms since the last route change, fire a new
		 * route change event. Several Angular events may call this function that
		 * trigger off each other (e.g. $routeChangeStart from $locationChangeStart),
		 * so this combines them into a single route change.
		 *
		 * We also want $routeChangeStart/$stateChangeStart to trigger the route_change()
		 * if possible because those have arguments that we'll pass to the routeFilter
		 * if specified.
		 *
		 * To do this, $locationChangeStart sets a timeout before calling this
		 * that will be cleared by the $routeChangeStart/$stateChangeStart.
		 */
		function fireRouteChange() {
			var now = BOOMR.now();

			if (now - lastRouteChangeTime > 50) {
				BOOMR.plugins.SPA.route_change.call(null, null, arguments);
			}

			lastRouteChangeTime = now;

			// clear any $locationChangeStart triggers since we've handled it
			// either via $routeChangeStart or $stateChangeStart
			clearTimeout(locationChangeTrigger);
			locationChangeTrigger = false;
		}

		//
		// Traditional Angular Router events
		//

		// Listen for AngularJS's $routeChangeStart, which is fired whenever a
		// route changes (i.e. a soft navigation, which is associated with the
		// URL in the address bar changing)
		$rootScope.$on("$routeChangeStart", function(event, next, current){
			if (!enabled) {
				hadMissedRouteChange = true;
				return;
			}



			fireRouteChange(event, next, current);

			// Since we've seen a $routeChangeStart, we don't need to have
			// $locationChangeStarts also trigger navigations.
			disableLocationChangeTrigger = true;
		});

		// Listen for $locationChangeStart to know the new URL when the route changes
		$rootScope.$on("$locationChangeStart", function(event, newState){
			if (!enabled) {
				return;
			}



			BOOMR.fireEvent("spa_init", [BOOMR.plugins.SPA.current_spa_nav(), newState]);

			// If we haven't yet seen $routeChangeStart or $stateChangeStart, we might
			// be in an app that only uses $locationChangeStart to trigger navigations.
			if (!disableLocationChangeTrigger) {
				// Fire a route change (on a short delay) after this callback in case
				// $routeChangeStart is about to fire.  We'd prefer to use $routeChangeStart's
				// arguments (next, current) for any routeFilter, so use a setTimeout
				// that may be cancelled by the $routeChangeStart/$stateChangeStart event.
				locationChangeTrigger = setTimeout(fireRouteChange, 0);
			}
		});

		//
		// Angular's UI-router
		//
		function stateChangeStart(event, toState, toParams, fromState, fromParams) {
			if (!enabled) {
				hadMissedRouteChange = true;
				return;
			}



			fireRouteChange(event, toState, toParams, fromState, fromParams);

			// Since we've seen a $stateChangeStart, we don't need to have
			// $locationChangeStarts also trigger navigations.
			disableLocationChangeTrigger = true;
		}
		if ($transitions) {
			$transitions.onStart({}, function(transition) {
				var to = transition.to();
				var from = transition.from();
				stateChangeStart("duh", to.name, to.params, from.name, from.params);
			});
		} else {
			$rootScope.$on("$stateChangeStart", stateChangeStart);
		}

		return true;
	}

	//
	// Exports
	//
	BOOMR.plugins.Angular = {
		/**
		 * This plugin is always complete (ready to send a beacon)
		 *
		 * @returns {boolean} `true`
		 * @memberof BOOMR.plugins.Angular
		 */
		is_complete: function() {
			return true;
		},

		/**
		 * Hooks Boomerang into the AngularJS lifecycle events
		 *
		 * @param {object} $rootScope AngularJS `$rootScope` dependency
		 * @param {object} $transitions UI-Router's `$transitions` dependency
		 * @param {boolean} [hadRouteChange] Whether or not there was a route change
		 * event prior to this `hook()` call
		 * @param {object} [options] Options
		 *
		 * @returns {@link BOOMR.plugins.Angular} The Angular plugin for chaining
		 * @memberof BOOMR.plugins.Angular
		 */
		hook: function($rootScope, $transitions, hadRouteChange, options) {
			if (hooked) {
				return this;
			}

			if (bootstrap($rootScope, $transitions)) {
				BOOMR.plugins.SPA.hook(hadRouteChange, options);

				hooked = true;
			}

			return this;
		},

		/**
		 * Disables the AngularJS plugin
		 *
		 * @returns {@link BOOMR.plugins.Angular} The Angular plugin for chaining
		 * @memberof BOOMR.plugins.Angular
		 */
		disable: function() {
			enabled = false;
			return this;
		},

		/**
		 * Enables the AngularJS plugin
		 *
		 * @returns {@link BOOMR.plugins.Angular} The Angular plugin for chaining
		 * @memberof BOOMR.plugins.Angular
		 */
		enable: function() {
			enabled = true;

			if (hooked && hadMissedRouteChange) {
				hadMissedRouteChange = false;
				BOOMR.plugins.SPA.route_change();
			}

			return this;
		}
	};
}());

// This code is run after all plugins have initialized
BOOMR.t_end = new Date().getTime();
