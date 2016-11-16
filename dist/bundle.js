(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
/// <reference path="../typings/tsd.d.ts" />

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ROSEvent = function () {
    function ROSEvent(ros) {
        _classCallCheck(this, ROSEvent);

        this.onRosConnection = function () {
            ROSEvent._connected = true;
        };
        this.onRosClose = function () {
            ROSEvent._connected = false;
        };
        this.onRosError = function (error) {
            ROSEvent._ros.close();
            ROSEvent._connected = false;
            console.log(error);
        };
        ROSEvent._ros = ros;
        ROSEvent._ros.on("connection", this.onRosConnection);
        ROSEvent._ros.on("close", this.onRosClose);
        ROSEvent._ros.on("error", this.onRosError);
        this.DelegateEvent(".jsRosConnect", "click", this.establishConnection);
    }

    _createClass(ROSEvent, [{
        key: "DelegateEvent",
        value: function DelegateEvent(selector, event, method) {
            $(document).delegate(selector, event, method);
        }
    }, {
        key: "establishConnection",
        value: function establishConnection() {
            ROSEvent._ros.connect("ws://" + $("#rosMasterAdress").val());
            console.log(ROSEvent._ros);
        }
    }], [{
        key: "getInstance",
        value: function getInstance() {
            return ROSEvent._ros;
        }
    }, {
        key: "getStatus",
        value: function getStatus() {
            return ROSEvent._connected;
        }
    }]);

    return ROSEvent;
}();

ROSEvent._connected = false;
exports.ROSEvent = ROSEvent;

},{}],2:[function(require,module,exports){
/// <reference path="./typings/tsd.d.ts" />
"use strict";

var rosEvent_1 = require("./events/rosEvent");
function init() {
    $(document).ready(function () {
        var ros = new ROSLIB.Ros("");
        //window["ros"] = ros;
        var rosEvents = new rosEvent_1.ROSEvent(ros);
    });
}
init();

},{"./events/rosEvent":1}]},{},[2])


//# sourceMappingURL=bundle.js.map
