(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="./typings/tsd.d.ts" />
"use strict";

var rosEvent_1 = require("./services/rosEvent");
function init() {
    $(document).ready(function () {
        var ros = new ROSLIB.Ros("");
        var rosEvents = new rosEvent_1.ROSEvent(ros);
    });
}
init();

},{"./services/rosEvent":2}],2:[function(require,module,exports){
"use strict";
/// <reference path="../typings/tsd.d.ts" />

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
        this.buildMenu = function () {
            var topicTypes = ['geometry_msgs/Twist', 'sensor_msgs/Image', 'sensor_msgs/NavSatFix'];
            var callbacksRemaining = topicTypes.length;
            var dict = new Map();
            for (var i = 0; i < topicTypes.length; i++) {
                ROSEvent._ros.getTopicsForType(topicTypes[i], function (topicsResult) {
                    ROSEvent._ros.getTopicType(topicsResult[0], function (typeResult) {
                        dict.set(typeResult, topicsResult);
                        --callbacksRemaining;
                        if (callbacksRemaining == 0) {
                            console.log(dict);
                            console.log(JSON.stringify([].concat(_toConsumableArray(dict))));
                            console.log(JSON.stringify(dict));
                            var source = $('.jsRosDropdown').html();
                            console.log(source);
                            var template = Handlebars.compile(source);
                            console.log(template);
                            var data = [{
                                type: 'geometry_msgs/Twist',
                                topics: [{
                                    topic: '1'
                                }]
                            }, {
                                type: 'sensor_msgs/Image',
                                topics: [{
                                    topic: '2'
                                }]
                            }];
                            var result = template({ types: data });
                            console.log(result);
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
    }, {
        key: 'buildJSON',
        value: function buildJSON(dict) {
            var jsonArr = void 0;
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

},{}]},{},[1])


//# sourceMappingURL=bundle.js.map
