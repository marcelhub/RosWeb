

function Videostream(id, ros, topic, type, implementation) {
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
 
Videostream.prototype = {
    init: function() {
        //custom properties initialized with default, assuming
        //that web_video_server runs on the same host as the Ros system
        this.settings.ip = $("#rosMasterAdress").val().split(":")[0];   
        //default port 8080 of Ros web_video_server
        this.settings.port = 8080;
        this.settings.width = 640;
        this.settings.height = 480;
        this.settings.quality = 90;
        return this;
    },
    run: function() {

    },
    load: function(settings) {
        this.settings.ip = settings.ip;
        this.settings.port = settings.port;
        this.settings.width = settings.width;
        this.settings.height = settings.height;
        this.settings.quality = settings.quality;
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
        widget.data.settings.ip = $("#widget-"+widget.data.id+"-value-ip").val();   
        widget.data.settings.port = $("#widget-"+widget.data.id+"-value-port").val();
        widget.data.settings.width = $("#widget-"+widget.data.id+"-value-width").val();
        widget.data.settings.height = $("#widget-"+widget.data.id+"-value-height").val();
        widget.data.settings.quality = $("#widget-"+widget.data.id+"-value-quality").val();
        //refresh videostream to apply new settings
        $.ajax({
            url: "widgets/" + widget.data.type + "/" + widget.data.implementation + "/index.hbs",
            method: "POST",
            success: function (data) {
                var compiledHtml = Handlebars.compile(data);
                var refreshedHtml = compiledHtml(widget.data);
                $("#widget-"+widget.data.id+"-content").children().remove();
                $("#widget-"+widget.data.id+"-content").append(refreshedHtml);
                $("div[data-widget-id="+widget.data.id+"]").css("width",  widget.data.settings.width+"px");
                $("div[data-widget-id="+widget.data.id+"]").css("height",  widget.data.settings.height+"px");
            },
            error: function (e1, e2) {

            },
            cache: false
        });
    }
};
