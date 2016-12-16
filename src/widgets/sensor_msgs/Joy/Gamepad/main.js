function Gamepad(id, ros, topic, type, implementation) {
    //default properties
    this.id = id;
    this.ros = ros;
    this.topic = topic;
    this.type = type;
    this.implementation = implementation;

    //settings object, this will be saved and stored.
    //contains parameters, values etc. that the implementation needs.
    //all required values should be stored in the setting object!
    this.settings = {};

    return this;
}
 
Gamepad.prototype = {
    init: function() {
        //custom properties initialized with default, assuming
        return this;
    },
    load: function(settings) {
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
        //refresh videostream to apply new settings
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
    }
};
