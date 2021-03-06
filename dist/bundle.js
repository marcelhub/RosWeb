(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="./typings/tsd.d.ts" />
"use strict";

var rosEvents_1 = require("./services/rosEvents");
var workspace_1 = require("./models/workspace");
function init() {
    $(document).ready(function () {
        var ros = new ROSLIB.Ros("");
        var rosEvents = new rosEvents_1.ROSEvent(ros);
        workspace_1.actualWorkspace;
        //initialize workspace menu
        window['fnctMenuWorkspace']();
    });
}
init();

},{"./models/workspace":4,"./services/rosEvents":5}],2:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var workspace_1 = require("./workspace");
var rosEvents_1 = require("../services/rosEvents");

var WebView = function WebView() {
    var _this = this;

    _classCallCheck(this, WebView);

    this._widgetHeaderOffset = 0;
    this.insertWidget = function (widget, widgetInstance) {
        //JSON object needed for widgetWrapper context
        var widgetWrapperData = {
            id: widget.id,
            posX: widget.posX,
            posY: widget.posY,
            width: widget.width,
            height: widget.height + _this._widgetHeaderOffset,
            topic: widget.url,
            topicImplementation: widget.implementation,
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
            if (widgetInstance == null) {
                //create object of widgetinstance and initialize it with default values
                widget.widgetInstance = new this[widget.implementation](widget.id, rosEvents_1.ROSEvent.getInstance(), widget.url, widget.type, widget.implementation).init();
            } else {
                //create object with loaded settings
                widget.widgetInstance = new this[widget.implementation](widget.id, rosEvents_1.ROSEvent.getInstance(), widget.url, widget.type, widget.implementation).load(widgetInstance.settings);
            }
            //compile javascript with the data from the widgetinstance to html
            var widgetHtml = widgetTemplateCompiled(widget.widgetInstance);
            //insert wrapper into document, afterwards the widget itself
            $(wrapperHtml).appendTo("#frontend-container");
            $(widgetHtml).appendTo("div[data-widget-id=" + widget.id + "] .panel-body");
            //add default event handling to widget (if not existing, nothing happens)
            $("div[data-widget-id=" + widget.id + "] .jsWidgetSettings").on("click", widget.widgetInstance, widget.widgetInstance.btnSettings);
            //use remove of widgetInstance, then clean up workspace
            $("div[data-widget-id=" + widget.id + "] .jsWidgetRemove").on("click", widget.widgetInstance, function () {
                if (widget.widgetInstance.btnRemove) {
                    widget.widgetInstance.btnRemove(widget);
                }
                workspace_1.actualWorkspace.removeWidget(widget);
                $("div[data-widget-id=" + widget.id + "]").remove();
            });
            //make widget draggable
            $('.undraggable').draggable({ handle: '.draggable' });
            //use resizable from widgetinstance, if there is no method use jquery resizable as default
            if (widget.widgetInstance.resizable) {
                widget.widgetInstance.resizable();
            } else {
                $("div[data-widget-id=" + widget.id + "]").resizable();
            }
            if (widget.widgetInstance.run != undefined) {
                widget.widgetInstance.run();
            }
            //insert settings for this widget
            insertSettings(widget);
        }, 1000);
    };
    Handlebars.registerHelper('trim', function (obj) {
        return new Handlebars.SafeString(obj.replace(/ /g, ''));
    });
    Handlebars.registerHelper('skip', function (obj) {
        //skipping configs which should not be shown
        if (obj === 'scaledWidth' || obj === 'scaledHeight') {
            return false;
        }
        return true;
    });
};

exports.WebView = WebView;
//load settings file
function insertSettings(widget) {
    var myUrl = "";
    if (widget.type != null) {
        myUrl = "widgets/" + widget.type + "/" + widget.implementation + "/settings.hbs";
    } else {
        myUrl = "widgets/" + widget.implementation + "/settings.hbs";
    }
    $.ajax({
        url: myUrl,
        method: "POST",
        beforeSend: function beforeSend() {},
        success: function success(data) {
            var settingsCompiled = Handlebars.compile(data);
            var settingsHtml = settingsCompiled(widget.widgetInstance);
            $("div[data-widget-id=" + widget.id + "]").append(settingsHtml);
            $("div[data-widget-id=" + widget.id + "] .jsWidgetSettingsSave").on("click", widget.widgetInstance, widget.widgetInstance.btnSettingsSave);
        },
        error: function error(e1, e2) {},
        cache: false
    });
}
//load script file
function loadScript(widget) {
    var alreadyLoaded = $('script[src=\"widgets/' + widget.type + '/' + widget.implementation + '/main.js\"]');
    if (alreadyLoaded.length > 0) {} else {
        (function () {
            var myUrl = "";
            if (widget.type != null) {
                myUrl = "widgets/" + widget.type + "/" + widget.implementation + "/main.js";
            } else {
                myUrl = "widgets/" + widget.implementation + "/main.js";
            }
            $.ajax({
                url: myUrl,
                type: "GET",
                success: function success(data) {
                    $(document.body).append('<script type="text/javascript" src=' + myUrl + '></script>');
                },
                dataType: "script",
                cache: false
            });
        })();
    }
}

},{"../services/rosEvents":5,"./workspace":4}],3:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Widget = function () {
    function Widget(id, url, type, width, height, posX, posY, html, implementation) {
        _classCallCheck(this, Widget);

        this.id = id;
        this.url = url;
        this.type = type;
        this.width = width;
        this.height = height;
        this.posX = posX;
        this.posY = posY;
        this.html = html;
        this.implementation = implementation;
    }

    _createClass(Widget, [{
        key: "save",
        value: function save() {
            var wrapper = $("div[data-widget-id=" + this.id + "]");
            this.width = parseInt(wrapper.css('width').slice(0, -2));
            this.height = parseInt(wrapper.css('height').slice(0, -2));
            this.posX = parseInt(wrapper.css('left').slice(0, -2));
            this.posY = parseInt(wrapper.css('top').slice(0, -2));
        }
    }]);

    return Widget;
}();

exports.Widget = Widget;

},{}],4:[function(require,module,exports){
/// <reference path="../typings/tsd.d.ts" />
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var webView_1 = require("./webView");
var widget_1 = require("./widget");
var rosEvents_1 = require("../services/rosEvents");

var Workspace = function () {
    function Workspace() {
        _classCallCheck(this, Workspace);

        this.widgets = [];
        this.idCounter = 0;
        this.webView = new webView_1.WebView();
        this.rosMasterAdress = $("#rosMasterAdress").val();
    }
    //create new widget


    _createClass(Workspace, [{
        key: "createWidget",
        value: function createWidget(url, type, implementation) {
            //load index file
            var myUrl = "";
            if (type != null) {
                myUrl = "widgets/" + type + "/" + implementation + "/index.hbs";
            } else {
                myUrl = "widgets/" + implementation + "/index.hbs";
            }
            $.ajax({
                url: myUrl,
                method: "POST",
                success: function success(data) {
                    var posX = parseInt($(data).attr("data-pos-x"));
                    var posY = parseInt($(data).attr("data-pos-y"));
                    var width = parseInt($(data).attr("data-min-width"));
                    var height = parseInt($(data).attr("data-min-height"));
                    var crtWidget = new widget_1.Widget(exports.actualWorkspace.idCounter, url, type, width, height, posX, posY, data, implementation);
                    exports.actualWorkspace.webView.insertWidget(crtWidget);
                    exports.actualWorkspace.widgets.push(crtWidget);
                    exports.actualWorkspace.idCounter++;
                },
                error: function error(e1, e2) {},
                cache: false
            });
        }
        //load a widget from loaded workspace

    }, {
        key: "loadWidget",
        value: function loadWidget(widget) {
            var myUrl = "";
            if (widget.type != null) {
                myUrl = "widgets/" + widget.type + "/" + widget.implementation + "/index.hbs";
            } else {
                myUrl = "widgets/" + widget.implementation + "/index.hbs";
            }
            $.ajax({
                url: myUrl,
                method: "POST",
                success: function success(data) {
                    var crtWidget = new widget_1.Widget(exports.actualWorkspace.idCounter, widget.url, widget.type, widget.width, widget.height, widget.posX, widget.posY, data, widget.implementation);
                    exports.actualWorkspace.webView.insertWidget(crtWidget, widget.widgetInstance);
                    exports.actualWorkspace.widgets.push(crtWidget);
                    exports.actualWorkspace.idCounter++;
                },
                error: function error(e1, e2) {},
                cache: false
            });
        }
        //remove Widget from workspace

    }, {
        key: "removeWidget",
        value: function removeWidget(widget) {
            exports.actualWorkspace.widgets = $.grep(exports.actualWorkspace.widgets, function (e) {
                return e.id != widget.id;
            });
        }
        //save workspace with php-script

    }, {
        key: "saveWorkspace",
        value: function saveWorkspace(name) {
            if (name == null) {
                exports.actualWorkspace.name = $('#workspace-new-save').val();
            } else {
                exports.actualWorkspace.name = name;
            }
            if (exports.actualWorkspace.name.length > 0) {
                //store current widget size and position
                for (var i = 0; i < exports.actualWorkspace.widgets.length; i++) {
                    exports.actualWorkspace.widgets[i].save();
                }
                $.ajax({
                    type: 'POST',
                    url: 'php/saveWorkspace.php',
                    data: { workspace: JSON.stringify(exports.actualWorkspace) },
                    success: function success(msg) {
                        exports.actualWorkspace.menuWorkspace();
                    }
                });
            } else {}
        }
        //load workspace with php-script

    }, {
        key: "loadWorkspace",
        value: function loadWorkspace(name) {
            $.ajax({
                type: 'POST',
                url: 'php/loadWorkspace.php',
                data: { workspace: name },
                success: function success(msg) {
                    var loadedWorkspace = JSON.parse(msg);
                    var workspaceObj = JSON.parse(loadedWorkspace);
                    exports.actualWorkspace.widgets = [];
                    exports.actualWorkspace.idCounter = 0;
                    exports.actualWorkspace.webView = new webView_1.WebView();
                    exports.actualWorkspace.rosMasterAdress = workspaceObj.rosMasterAdress;
                    exports.actualWorkspace.name = workspaceObj.name;
                    $("#rosMasterAdress").val(exports.actualWorkspace.rosMasterAdress);
                    rosEvents_1.rosEvents.establishConnection();
                    $('#frontend-container').empty();
                    for (var i = 0; i < workspaceObj.widgets.length; i++) {
                        exports.actualWorkspace.loadWidget(workspaceObj.widgets[i]);
                    }
                }
            });
        }
    }, {
        key: "deleteWorkspace",
        value: function deleteWorkspace(name) {
            $.ajax({
                type: 'POST',
                url: 'php/deleteWorkspace.php',
                data: { workspace: name },
                success: function success(msg) {
                    $('#workspace-form-' + name).remove();
                }
            });
        }
        //generate menu-list of workspaces

    }, {
        key: "menuWorkspace",
        value: function menuWorkspace() {
            $.ajax({
                type: 'POST',
                url: 'php/generateWorkspaceMenu.php',
                success: function success(data) {
                    if (MyApp.templates['generateWorkspaceMenu'] == null) {
                        exports.actualWorkspace.loadMenuWorkspaceTemplate();
                    } else {
                        var menuHtml = MyApp.templates.generateWorkspaceMenu({ workspaces: JSON.parse(data) });
                        $('#workspace-menu-body-wrapper').html(menuHtml);
                    }
                }
            });
        }
    }, {
        key: "loadMenuWorkspaceTemplate",
        value: function loadMenuWorkspaceTemplate() {
            $.ajax({
                url: "templates/workspaceMenu.hbs",
                method: "POST",
                beforeSend: function beforeSend() {},
                success: function success(data) {
                    MyApp.templates['generateWorkspaceMenu'] = Handlebars.compile(data);
                    exports.actualWorkspace.menuWorkspace();
                },
                cache: false
            });
        }
    }]);

    return Workspace;
}();

exports.Workspace = Workspace;
window["fnctCreateWidget"] = fnctCreateWidget;
function fnctCreateWidget(url, type, implementation) {
    if (url == "" || type == "") {
        exports.actualWorkspace.createWidget(null, null, implementation);
    } else {
        exports.actualWorkspace.createWidget(url, type, implementation);
    }
}
window["fnctSaveWorkspace"] = fnctSaveWorkspace;
function fnctSaveWorkspace(name) {
    if (name == null) {
        exports.actualWorkspace.saveWorkspace();
    } else {
        exports.actualWorkspace.saveWorkspace(name);
    }
}
window["fnctLoadWorkspace"] = fnctLoadWorkspace;
function fnctLoadWorkspace(name) {
    exports.actualWorkspace.loadWorkspace(name);
}
window["fnctDeleteWorkspace"] = fnctDeleteWorkspace;
function fnctDeleteWorkspace(name) {
    exports.actualWorkspace.deleteWorkspace(name);
}
window["fnctMenuWorkspace"] = fnctMenuWorkspace;
function fnctMenuWorkspace() {
    exports.actualWorkspace.menuWorkspace();
}
exports.actualWorkspace = new Workspace();

},{"../services/rosEvents":5,"./webView":2,"./widget":3}],5:[function(require,module,exports){
"use strict";
/// <reference path="../typings/tsd.d.ts" />

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var workspace_1 = require("../models/workspace");

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
                ROSEvent.ros.connect("ws://" + $("#rosMasterAdress").val());
            } catch (e) {
                $('.jsRosConnect').removeClass('connected');
                $('.jsRosConnect').addClass('error');
                $('.jsRosMenu').removeClass('connected');
                $('.jsRosMenu').addClass('disconnected');
            }
        };
        this.getConnectionStatus = function () {
            return ROSEvent.getStatus();
        };
        this.onRosConnection = function () {
            $('.jsRosConnect').removeClass('error');
            $('.jsRosConnect').addClass('connected');
            //generate menu
            _this.buildMenu();
            $('.jsRosMenu').removeClass('disconnected');
            $('.jsRosMenu').addClass('connected');
            workspace_1.actualWorkspace.rosMasterAdress = $("#rosMasterAdress").val();
            ROSEvent.connected = true;
        };
        this.onRosClose = function () {
            $('.jsRosConnect').removeClass('connected');
            $('.jsRosConnect').addClass('error');
            $('.jsRosMenu').removeClass('connected');
            $('.jsRosMenu').addClass('disconnected');
            ROSEvent.connected = false;
        };
        this.onRosError = function (error) {
            $('.jsRosConnect').removeClass('connected');
            $('.jsRosConnect').addClass('error');
            $('.jsRosMenu').removeClass('connected');
            $('.jsRosMenu').addClass('disconnected');
            ROSEvent.ros.close();
            ROSEvent.connected = false;
            console.log(error);
        };
        //build menu dynamically, containing supported ROS topics
        this.buildMenu = function () {
            var topicTypes = ['geometry_msgs/Twist', 'sensor_msgs/Image', 'sensor_msgs/CompressedImage', 'sensor_msgs/NavSatFix', 'sensor_msgs/Joy', 'iosb_sensor_msgs/GpsWithVelocity'];
            var callbacksRemaining = topicTypes.length;
            var typesWithTopics = new Map();
            var typesWithViews = new Map();
            typesWithViews.set('geometry_msgs/Twist', ['KeyboardTeleoperation', 'Joystick']);
            typesWithViews.set('sensor_msgs/Image', ['Videostream']);
            typesWithViews.set('sensor_msgs/CompressedImage', ['VideostreamCompressed']);
            typesWithViews.set('sensor_msgs/NavSatFix', ['Maps']);
            typesWithViews.set('sensor_msgs/Joy', ['Gamepad', 'Gamestick', 'Keyboard']);
            typesWithViews.set('iosb_sensor_msgs/GpsWithVelocity', ['Navigation']);
            for (var i = 0; i < topicTypes.length; i++) {
                ROSEvent.ros.getTopicsForType(topicTypes[i], function (topicsResult) {
                    ROSEvent.ros.getTopicType(topicsResult[0], function (typeResult) {
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
        exports.rosEvents = this;
        ROSEvent.ros = ros;
        ROSEvent.ros.on("connection", this.onRosConnection);
        ROSEvent.ros.on("close", this.onRosClose);
        ROSEvent.ros.on("error", this.onRosError);
        this.DelegateEvent(".jsRosConnect", "click", this.establishConnection);
    }

    _createClass(ROSEvent, [{
        key: "DelegateEvent",
        value: function DelegateEvent(selector, event, method) {
            $(document).delegate(selector, event, method);
        }
    }], [{
        key: "getInstance",
        value: function getInstance() {
            return ROSEvent.ros;
        }
    }, {
        key: "getStatus",
        value: function getStatus() {
            return ROSEvent.connected;
        }
    }]);

    return ROSEvent;
}();

ROSEvent.connected = false;
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

    return topicResult;
}

},{"../models/workspace":4}]},{},[1])


//# sourceMappingURL=bundle.js.map
