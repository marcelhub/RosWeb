(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ROSEvent = function () {
    function ROSEvent(ros) {
        var _this = this;

        _classCallCheck(this, ROSEvent);

        this.connected = false;
        this.onRosConnection = function () {
            _this.connected = true;
            $(".jsRosConnect").addClass("active");
            $(".jsRosConnect").removeClass("loading");
            $(".jsRosConnect, #jsRosUrl, .jsConfiguration").removeClass("alert");
        };
        this.onRosClose = function () {
            _this.connected = false;
            $(".jsRosConnect").removeClass("active");
            $(".jsRosConnect").removeClass("loading");
        };
        this.onRosError = function (error) {
            _this.ros.close();
            _this.connected = false;
            $(".jsRosConnect").removeClass("active");
            $(".jsRosConnect").removeClass("loading");
            $(".jsRosConnect, #jsRosUrl, .jsConfiguration").addClass("alert");
            console.log(error);
        };
        this.ros = ros;
        this.ros.on("connection", this.onRosConnection);
        this.ros.on("close", this.onRosClose);
        this.ros.on("error", this.onRosError);
        console.log("TEST");
        this.DelegateEvent("jsRosConnect", "click", this.establishConnection);
    }

    _createClass(ROSEvent, [{
        key: "DelegateEvent",
        value: function DelegateEvent(selector, event, method) {
            $(document).delegate(selector, event, method);
        }
    }, {
        key: "establishConnection",
        value: function establishConnection() {
            console.log("url: " + $("#rosMasterAdress").val());
            this.ros.connect("url: " + $("#rosMasterAdress").val());
            console.log(this.ros);
        }
    }]);

    return ROSEvent;
}();

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
