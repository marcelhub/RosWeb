(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="./typings/tsd.d.ts" />
"use strict";

var rosEvent_1 = require("./services/rosEvent");
var workspace_1 = require("./models/workspace");
function init() {
    $(document).ready(function () {
        var ros = new ROSLIB.Ros("");
        var rosEvents = new rosEvent_1.ROSEvent(ros);
        workspace_1.actualWorkspace;
    });
}
init();

},{"./models/workspace":4,"./services/rosEvent":5}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebView = function () {
    function WebView() {
        var _this = this;

        _classCallCheck(this, WebView);

        this._widgetHeaderOffset = 50;
        this.insertWidget = function (widget) {
            //JSON object needed for widgetWrapper context
            var widgetWrapperData = {
                id: widget.id,
                posX: widget.posX,
                posY: widget.posY,
                width: widget.width,
                height: widget.height + _this._widgetHeaderOffset,
                topic: widget.topicUrl,
                topicImplementation: widget.topicImplementation,
                btnSettings: $(widget.html).attr("data-btn-widget-settings") != "1" ? false : true,
                btnRemove: $(widget.html).attr("data-btn-widget-remove") != "1" ? false : true
            };
            //load main.js to the document if it's not already loaded
            loadScript(widget);
            //generate html from wrapper to insert it later
            var wrapperHtml = MyApp.templates.widgetWrapper(widgetWrapperData);
            //compile html to javascript
            var widgetTemplateCompiled = Handlebars.compile(widget.html);
            setTimeout(function () {
                widget.widgetInstance = new this[widget.topicImplementation](widget.id, widget.ros, widget.topicUrl, widget.topicType, widget.topicImplementation).init();
                console.log(widget.widgetInstance);
                var widgetHtml = widgetTemplateCompiled(widget.widgetInstance);
                $(wrapperHtml).appendTo("#frontend-container");
                $(widgetHtml).appendTo("div[data-widget-id=" + widget.id + "]");
                $("div[data-widget-id=" + widget.id + "]").draggable();
            }, 500);
        };
    }

    _createClass(WebView, [{
        key: "_getInstance",
        value: function _getInstance(context, name) {
            var instance = Object.create(context[name].prototype);

            for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                args[_key - 2] = arguments[_key];
            }

            instance.constructor.apply(instance, args);
            return instance;
        }
    }]);

    return WebView;
}();

exports.WebView = WebView;
function loadScript(widget) {
    var alreadyLoaded = $('script[src=\"widgets/' + widget.topicType + '/' + widget.topicImplementation + '/main.js\"]');
    if (alreadyLoaded.length > 0) {} else {
        (function () {
            var jsString = "widgets/" + widget.topicType + "/" + widget.topicImplementation + "/main.js";
            $.ajax({
                type: "GET",
                url: jsString,
                success: function success(data) {
                    $(document.body).append('<script type="text/javascript" src=' + jsString + '></script>');
                    console.log("Loading performed.");
                },
                dataType: "script",
                cache: false
            });
        })();
    }
}

},{}],3:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var widgetEvents_1 = require("../services/widgetEvents");
var rosEvent_1 = require("../services/rosEvent");

var Widget = function (_widgetEvents_1$Widge) {
    _inherits(Widget, _widgetEvents_1$Widge);

    function Widget(id, topicUrl, topicType, width, height, posX, posY, html, topicImplementation, settings) {
        _classCallCheck(this, Widget);

        var _this = _possibleConstructorReturn(this, (Widget.__proto__ || Object.getPrototypeOf(Widget)).call(this));

        _this.ros = rosEvent_1.ROSEvent.getInstance();
        _this.id = id;
        _this.topicUrl = topicUrl;
        _this.topicType = topicType;
        _this.width = width;
        _this.height = height;
        _this.posX = posX;
        _this.posY = posY;
        _this.html = html;
        _this.topicImplementation = topicImplementation;
        if (settings) {
            _this.settings = settings;
        } else {
            _this.settings = null;
        }
        return _this;
    }

    return Widget;
}(widgetEvents_1.WidgetEvents);

exports.Widget = Widget;

},{"../services/rosEvent":5,"../services/widgetEvents":6}],4:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var webView_1 = require("./webView");
var widget_1 = require("./widget");

var Workspace = function () {
    function Workspace() {
        _classCallCheck(this, Workspace);

        this.widgets = [];
        this.idCounter = 0;
        this.webView = new webView_1.WebView();
    }

    _createClass(Workspace, [{
        key: "createWidget",
        value: function createWidget(topicUrl, topicType, topicImplementation) {
            $.ajax({
                url: "widgets/" + topicType + "/" + topicImplementation + "/index.hbs",
                method: "POST",
                beforeSend: function beforeSend() {},
                success: function success(data) {
                    console.log(data);
                    var posX = parseInt($(data).attr("data-pos-x"));
                    var posY = parseInt($(data).attr("data-pos-y"));
                    var width = parseInt($(data).attr("data-min-width"));
                    var height = parseInt($(data).attr("data-min-height"));
                    var crtWidget = new widget_1.Widget(exports.actualWorkspace.idCounter, topicUrl, topicType, width, height, posX, posY, data, topicImplementation);
                    exports.actualWorkspace.webView.insertWidget(crtWidget);
                    exports.actualWorkspace.widgets.push(crtWidget);
                    exports.actualWorkspace.idCounter++;
                },
                error: function error(e1, e2) {
                    console.log(e1);
                    console.log(e2);
                },
                cache: false
            });
        }
    }]);

    return Workspace;
}();

exports.Workspace = Workspace;
window["fnctCreateWidget"] = fnctCreateWidget;
function fnctCreateWidget(topicUrl, topicType, topicImplementation) {
    exports.actualWorkspace.createWidget(topicUrl, topicType, topicImplementation);
}
exports.actualWorkspace = new Workspace();

},{"./webView":2,"./widget":3}],5:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ROSEvent = function () {
    function ROSEvent(ros) {
        var _this = this;

        _classCallCheck(this, ROSEvent);

        this.establishConnection = function () {
            try {
                $('.jsRosConnect').removeClass('error');
                $('.jsRosConnect').removeClass('connected');
                $('.jsRosMenu').removeClass('disconnected');
                $('.jsRosMenu').removeClass('connected');
                ROSEvent._ros.connect("ws://" + $("#rosMasterAdress").val());
            } catch (e) {
                $('.jsRosConnect').removeClass('connected');
                $('.jsRosConnect').addClass('error');
                $('.jsRosMenu').removeClass('connected');
                $('.jsRosMenu').addClass('disconnected');
                console.log(e);
            }
        };
        this.onRosConnection = function () {
            $('.jsRosConnect').removeClass('error');
            $('.jsRosConnect').addClass('connected');
            //generate menu
            _this.buildMenu();
            $('.jsRosMenu').removeClass('disconnected');
            $('.jsRosMenu').addClass('connected');
            ROSEvent._connected = true;
        };
        this.onRosClose = function () {
            $('.jsRosConnect').removeClass('connected');
            $('.jsRosConnect').addClass('error');
            $('.jsRosMenu').removeClass('connected');
            $('.jsRosMenu').addClass('disconnected');
            ROSEvent._connected = false;
        };
        this.onRosError = function (error) {
            $('.jsRosConnect').removeClass('connected');
            $('.jsRosConnect').addClass('error');
            $('.jsRosMenu').removeClass('connected');
            $('.jsRosMenu').addClass('disconnected');
            ROSEvent._ros.close();
            ROSEvent._connected = false;
            console.log(error);
        };
        //build menu dynamically, containing supported ROS topics
        this.buildMenu = function () {
            var topicTypes = ['geometry_msgs/Twist', 'sensor_msgs/Image', 'sensor_msgs/NavSatFix', 'sensor_msgs/Imu'];
            var callbacksRemaining = topicTypes.length;
            var typesWithTopics = new Map();
            var typesWithViews = new Map();
            typesWithViews.set('geometry_msgs/Twist', []);
            typesWithViews.set('sensor_msgs/Image', ['Videostream']);
            typesWithViews.set('sensor_msgs/NavSatFix', []);
            typesWithViews.set('sensor_msgs/Imu', []);
            for (var i = 0; i < topicTypes.length; i++) {
                ROSEvent._ros.getTopicsForType(topicTypes[i], function (topicsResult) {
                    ROSEvent._ros.getTopicType(topicsResult[0], function (typeResult) {
                        typesWithTopics.set(typeResult, topicsResult);
                        --callbacksRemaining;
                        if (callbacksRemaining == 0) {
                            var result = MyApp.templates.menu({ types: buildJSON(typesWithTopics, typesWithViews) });
                            $('.dropdown-menu').html(result);
                            $('.dropdown-submenu a.jsTopicImplementation').on("click", function (e) {
                                $(this).next('ul').toggle();
                                e.stopPropagation();
                                e.preventDefault();
                            });
                        }
                    });
                });
            }
        };
        ROSEvent._ros = ros;
        ROSEvent._ros.on("connection", this.onRosConnection);
        ROSEvent._ros.on("close", this.onRosClose);
        ROSEvent._ros.on("error", this.onRosError);
        this.DelegateEvent(".jsRosConnect", "click", this.establishConnection);
    }

    _createClass(ROSEvent, [{
        key: 'DelegateEvent',
        value: function DelegateEvent(selector, event, method) {
            $(document).delegate(selector, event, method);
        }
    }], [{
        key: 'getInstance',
        value: function getInstance() {
            return ROSEvent._ros;
        }
    }, {
        key: 'getStatus',
        value: function getStatus() {
            return ROSEvent._connected;
        }
    }]);

    return ROSEvent;
}();

ROSEvent._connected = false;
exports.ROSEvent = ROSEvent;
//build JSON to get rendered with handlebars
function buildJSON(typesWithTopics, typesWithViews) {
    var topicResult = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = typesWithTopics.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            if (typesWithTopics.get(key).length > 0) {
                var topicsArr = [];
                var implArr = [];
                //build implementations array
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = typesWithViews.get(key)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var impl = _step2.value;

                        var implItem = {
                            implementation: impl
                        };
                        implArr.push(implItem);
                    }
                    //build topics array
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = typesWithTopics.get(key)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var t = _step3.value;

                        var topicItem = {
                            topic: t,
                            implementations: implArr
                        };
                        topicsArr.push(topicItem);
                    }
                    //build types array
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                var item = {
                    type: key,
                    topics: topicsArr
                };
                topicResult.push(item);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    console.log(topicResult);
    return topicResult;
}

},{}],6:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rosEvent_1 = require("./rosEvent");

var WidgetEvents = function () {
    function WidgetEvents() {
        _classCallCheck(this, WidgetEvents);

        this.ros = rosEvent_1.ROSEvent.getInstance();
        // this.DelegateEvent("jsWidgetInsert");
    }

    _createClass(WidgetEvents, [{
        key: "DelegateEvent",
        value: function DelegateEvent(selector, event, method) {
            if (event == "resize") {
                $(selector).resize(method);
            }
            $(document).delegate(selector, event, method);
        }
    }]);

    return WidgetEvents;
}();

exports.WidgetEvents = WidgetEvents;

},{"./rosEvent":5}]},{},[1])


//# sourceMappingURL=bundle.js.map
