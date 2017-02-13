

function KeyboardTeleoperation(id, ros, topic, type, implementation) {
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
 
KeyboardTeleoperation.prototype = {
    init: function() {
        this.teleop = new KEYBOARDTELEOP.Teleop({
            ros: this.ros,
            topic: this.topic
        });
        var self = this;

        if(jQuery.isEmptyObject(this.settings)) {
            //use parameter like joy node to initialize the gamepad
            this.settings.sliderValue = 90;
        }

        //load keyboardteleop.min.js library file
        $.ajax({
            url: "widgets/" + self.type + "/" +self.implementation + "/keyboardteleop.min.js",
            method: "POST",
            beforeSend: function () {

            },
            success: function (data) {
                //create slider with jquery-ui
                $('#widget-'+self.id+'-speed-slider').slider({
                    range : 'min',
                    min : 0,
                    max : 100,
                    value : self.settings.sliderValue,
                    slide : function(event, ui) {
                        // Change the speed label.
                        $('#widget-'+self.id+'-speed-label').html('Speed: ' + ui.value + '%');
                        // Scale the speed.
                        self.teleop.scale = (ui.value / 100.0);
                    }
                });
                $('#widget-'+self.id+'-speed-label').html('Speed: ' + ($('#widget-'+self.id+'-speed-slider').slider('value')) + '%');
                self.teleop.scale = ($('#widget-'+self.id+'-speed-slider').slider('value') / 100.0);
            },
            error: function (e) {

            },
            cache: false
        });
        return this;
    },
    run: function() {

    },
    load: function(settings) {
        this.settings.sliderValue = 90;
        this.init();
        return this;
    },

    save: function(widget) {
        return JSON.stringify(widget.data.settings);
    },
    btnSettings: function(widget) {
    },
    
    btnRemove: function(widget) {
        widget.teleop = undefined;
    },

    btnSettingsSave: function(widget) {

    }
};
