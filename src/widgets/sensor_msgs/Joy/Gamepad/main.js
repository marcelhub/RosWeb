function Gamepad(id, ros, topic, type, implementation) {
    //default properties
    this.id = id;
    this.ros = ros;
    this.topic = topic;
    this.type = type;
    this.implementation = implementation;

    //settings object, this will be saved and stored.
    //contains parameters, values etc. that the implementation needs.
    //all required values should be stored in the settings object!
    this.settings = {};

    return this;
}
 
Gamepad.prototype = {
    init: function() {
        this.joyTopic = new ROSLIB.Topic({
            ros : this.ros,
            name : this.topic,
            messageType : this.type,
        });
        
        var self = this;
        var msgLoop = null;
        var seqCounter = 0;
        //waits for connecting gamepads, event triggered when connected or any button pressed 1st time
        window.addEventListener("gamepadconnected", function(e) {
            console.log("Gamepad connected at index %d: %s", e.gamepad.index, e.gamepad.id);
            msgLoop = setInterval(function () { self.teleopLoop(e, self, seqCounter++); }, 100);
            $('#gamepad-'+self.id+'-info').text("gamepad connected: "+e.gamepad.id);
        });

        window.addEventListener("gamepaddisconnected", function(e) {
            console.log("Gamepad disconnected from index %d: %s", e.gamepad.index, e.gamepad.id);
            if(!msgLoop) {
                return;
            }
            clearInterval(msgLoop);
            $('#gamepad-'+self.id+'-info').text("no gamepad connected.");
        });

        return this;
    },
    load: function(widget) {
        this.init();
        return this;
    },
    save: function(widget) {
        return JSON.stringify(widget.data.settings);
    },
    btnSettings: function(widget) {
    },
    btnRemove: function(widget) {
    },

    btnSettingsSave: function(widget) {
        $.ajax({
            url: "widgets/" + widget.data.type + "/" + widget.data.implementation + "/index.hbs",
            method: "POST",
            success: function (data) {
                // var compiledHtml = Handlebars.compile(data);
                // var refreshedHtml = compiledHtml(widget.data);
                // $("#widget-"+widget.data.id+"-content").children().remove();
                // $("#widget-"+widget.data.id+"-content").append(refreshedHtml);
                // $("div[data-widget-id="+widget.data.id+"]").css("width",  widget.data.settings.width+"px");
                // $("div[data-widget-id="+widget.data.id+"]").css("height",  widget.data.settings.height+"px");
            },
            error: function (e1, e2) {

            },
            cache: false
        });
    },

    //publishes gamepad messages periodically
    teleopLoop: function(e, self, seqCounter) {
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        if (!gamepads) {
            return;
        }
        if (gamepads.length == 0) {
            return;
        }

        self.gamePad = gamepads[0];
        var buttonValues = new Array();
        for(var i = 0; i < self.gamePad.buttons.length; i++) {
            buttonValues.push(self.gamePad.buttons[i].value);
        }

        if(deadzoneExceeded(0.1, self)) {
            var axesValues = new Array();
            AxesValuesWithDeadzone(axesValues, 0.1, self);
            var joyMsg = new ROSLIB.Message({
                header : {
                seq : seqCounter,
                stamp : {
                    secs: parseInt(self.gamePad.timestamp),
                    nsecs: parseInt(self.gamePad.timestamp)
                },
                frame_id : ''
                },
                axes : axesValues,
                buttons : buttonValues
            });
            seqCounter++;
            self.joyTopic.publish(joyMsg);
        } else {
            var joyMsg = new ROSLIB.Message({
                header : {
                seq : seqCounter,
                stamp : {
                    secs: parseInt(self.gamePad.timestamp),
                    nsecs: parseInt(self.gamePad.timestamp)
                },
                frame_id : ''
                },
                axes : [0.0, 0.0, 0.0, 0.0],
                buttons : buttonValues
            });
            seqCounter++;
            self.joyTopic.publish(joyMsg);
        }
        //deadzoneValue has to be between 0.0 and 1.0
        function deadzoneExceeded(deadzoneValue, self) {
            for(var i = 0; i < self.gamePad.axes.length; i++) {
                if(Math.abs(self.gamePad.axes[i]) >= deadzoneValue) {
                    return true;
                }
            }
            return false;
        }

        //Scales axes with deadzone as an offset
        function AxesValuesWithDeadzone(values, deadzoneValue, self) {
            for(var i = 0; i < self.gamePad.axes.length; i++) {
                if(Math.abs(self.gamePad.axes[i]) < deadzoneValue) {
                    values.push(0.0);
                } else {
                    values.push(Math.sign(self.gamePad.axes[i]) * (Math.abs(self.gamePad.axes[i]) - deadzoneValue) / (1 - deadzoneValue));
                }
            }
            values[0] *= -1;
            values[1] *= -1;
        }
    }
};
