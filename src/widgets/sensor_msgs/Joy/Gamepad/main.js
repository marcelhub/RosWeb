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
        
        //use parameter like joy node
        this.settings.deadzone = 0.05;
        this.settings.autorepeat_rate = 0.0;
        this.settings.coalesce_interval = 0.001;

        var self = this;
        var msgLoop = null;
        var seqCounter = 0;

        //waits for connecting gamepads, event triggered when connected to host or any button pressed 1st time
        window.addEventListener("gamepadconnected", function(e) {
            //clear "no gamepad" notification if 1 controller is connected
            if(navigator.getGamepads().length == 1) {
                $('#gamepad-'+self.id+'-info').text("");
            }
            $('#gamepad-'+self.id+'-info').append('<div id="gamepad-btn-'+e.gamepad.index+'" class="radio"><label><input type="radio" class="optradio"> '+e.gamepad.id+'</label></div>');
            if(navigator.getGamepads().length == 1) {
                $('#gamepad-btn-'+e.gamepad.index+' .optradio').prop('checked', true);
            }
            
            msgLoop = setInterval(function () { self.teleopLoop(e, self, seqCounter++); }, 100);
        });

        //event triggered when gamepad gets disconnected from host
        window.addEventListener("gamepaddisconnected", function(e) {
            if(!msgLoop) {
                return;
            }

            clearInterval(msgLoop);
            if(checkConnectedGamepads()) {
                $('#gamepad-btn-'+e.gamepad.index).remove();
            } else {
                $('#gamepad-'+self.id+'-info').text("no gamepad connected.");
            }

            function checkConnectedGamepads() {
                var pads = navigator.getGamepads();
                for(var i = 0; i < pads.length; i++) {
                    if(pads[i]) {
                        if(pads[i].connected) {
                            return true;
                        }
                    }
                }
                return false;
            }
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

        var axesValues = new Array();
        AxesValuesWithDeadzone(axesValues, 0.3, self);
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
