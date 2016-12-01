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

},{"./models/workspace":3,"./services/rosEvent":4}],2:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Widget = function Widget(id, topicUrl, topicType, sizeX, sizeY, posX, posY, viewImplType, parameter) {
    _classCallCheck(this, Widget);

    this.id = id;
    this.topicUrl = topicUrl;
    this.topicType = topicType;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.posX = posX;
    this.posY = posY;
    this.viewImplType = viewImplType;
    if (parameter) {
        this.parameter = parameter;
    } else {
        this.parameter = null;
    }
};

exports.Widget = Widget;

},{}],3:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var widget_1 = require("./widget");

var Workspace = function Workspace() {
    var _this = this;

    _classCallCheck(this, Workspace);

    this.createWidget = function (topicUrl, topicType, viewImplType) {
        $.ajax({
            url: "widgets/" + topicType + "/index.hbs",
            beforeSend: function beforeSend() {},
            success: function success(data) {
                // MyApp.templates._widgetsTemplates[widget.alias] = Handlebars.compile(data);
                console.log(data);
            },
            error: function error(e1, e2) {
                console.log(e1);
                console.log(e2);
            }
        });
        var widget = new widget_1.Widget(_this.widgets.length, topicUrl, topicType, 100, 100, 100, 100, '');
    };
    this.widgets = new Array();
};

exports.Workspace = Workspace;
window['fnctCreateWidget'] = fnctCreateWidget;
function fnctCreateWidget(topicUrl, topicType) {
    exports.actualWorkspace.createWidget(topicUrl, topicType);
}
exports.actualWorkspace = new Workspace();

},{"./widget":2}],4:[function(require,module,exports){
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
            var dict = new Map();
            for (var i = 0; i < topicTypes.length; i++) {
                ROSEvent._ros.getTopicsForType(topicTypes[i], function (topicsResult) {
                    ROSEvent._ros.getTopicType(topicsResult[0], function (typeResult) {
                        dict.set(typeResult, topicsResult);
                        --callbacksRemaining;
                        if (callbacksRemaining == 0) {
                            var result = MyApp.templates.menu({ types: buildJSON(dict) });
                            $('.dropdown-menu').html(result);
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
function buildJSON(dict) {
    var topicResult = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = dict.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            if (dict.get(key).length > 0) {
                var topicsArr = [];
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = dict.get(key)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var t = _step2.value;

                        var topicItem = {
                            topic: t
                        };
                        topicsArr.push(topicItem);
                    }
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

    return topicResult;
}

},{}]},{},[1])


//# sourceMappingURL=bundle.js.map
