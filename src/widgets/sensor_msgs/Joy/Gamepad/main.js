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
        Handlebars.registerHelper('excludeInverts', function(obj) {
            return (!(obj === 'invertAnalogLeft' || obj === 'invertAnalogRight'));
        });

        Handlebars.registerHelper('checkInverts', function(obj) {
            return (obj == 1)? '' : 'checked';
        });

        this.joyTopic = new ROSLIB.Topic({
            ros : this.ros,
            name : this.topic,
            messageType : this.type,
        });
        if(jQuery.isEmptyObject(this.settings)) {
            //use parameter like joy node to initialize the gamepad
            this.settings.deadzone = 0.2;
            this.settings.autorepeatRate = 100;
            this.settings.invertAnalogLeft = 1;
            this.settings.invertAnalogRight = 1;
        }
        var self = this;
        this.msgLoop = null;
        var seqCounter = 0;
        //waits for connecting gamepads, event triggered when connected to host or any button pressed 1st time
        window.addEventListener("gamepadconnected", function(e) {
            //clear "no gamepad" notification if 1 controller is connected
            if(navigator.getGamepads().length == 1) {
                $('#gamepad-'+self.id+'-info').text("");
            }
            $('#gamepad-'+self.id+'-info').append('<div id="gamepad-btn-'+e.gamepad.index+'" class="radio"><label><input type="radio" class="optradio" name="gamepad-radiobtn"> '+e.gamepad.id+'</label></div>');
            if(navigator.getGamepads().length == 1) {
                $('#gamepad-btn-'+e.gamepad.index+' .optradio').prop('checked', true);
            }
            
            self.msgLoop = setInterval(function () { self.teleopLoop(e, self, seqCounter++); }, self.settings.autorepeatRate);
        });

        //event triggered when gamepad gets disconnected from host
        window.addEventListener("gamepaddisconnected", function(e) {
            if(!self.msgLoop) {
                return;
            }

            clearInterval(self.msgLoop);
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
    load: function(settings) {
        this.settings.deadzone = settings.deadzone;
        this.settings.autorepeatRate = settings.autorepeatRate;
        this.settings.invertAnalogLeft = settings.invertAnalogLeft;
        this.settings.invertAnalogRight = settings.invertAnalogRight;
        this.init();
        return this;
    },
    save: function(widget) {
        return JSON.stringify(widget.data.settings);
    },
    btnSettings: function(widget) {
    },
    btnRemove: function(widget) {
        clearInterval(this.msgLoop);
    },

    btnSettingsSave: function(widget) {
        widget.data.settings.deadzone = $("#widget-"+widget.data.id+"-value-deadzone").val();   
        widget.data.settings.autorepeatRate = $("#widget-"+widget.data.id+"-value-autorepeatRate").val();
        widget.data.settings.invertAnalogLeft = $("#widget-"+widget.data.id+"-invert-analog-left").prop('checked')? -1 : 1;
        widget.data.settings.invertAnalogRight = $("#widget-"+widget.data.id+"-invert-analog-right").prop('checked')? -1 : 1;
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

        //calculate array with deadzoneValue
        //if the value of the axis are smaller than the deadzoneValue, then 0.0 is used instead
        var axesValues = new Array();
        AxesValuesWithDeadzone(axesValues, self.settings.deadzone, self);

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
            values[0] *= self.settings.invertAnalogLeft;
            values[1] *= self.settings.invertAnalogLeft;
            values[3] *= self.settings.invertAnalogRight;
            values[4] *= self.settings.invertAnalogRight;
        }
    }
};
