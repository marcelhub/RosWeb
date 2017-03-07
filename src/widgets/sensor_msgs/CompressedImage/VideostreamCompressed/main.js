

function VideostreamCompressed(id, ros, topic, type, implementation) {
    this.id = id;
    this.ros = ros;
    this.topic = topic;
    this.type = type;
    this.implementation = implementation;

    this.settings = {};

    return this;
}
 
VideostreamCompressed.prototype = {
    init: function() {
        //custom properties initialized with default, assuming
        //that web_video_server runs on the same host as the Ros system
        this.settings.ip = $("#rosMasterAdress").val().split(":")[0];   
        //default port 8080 of Ros web_video_server
        this.settings.port = 8080;
        this.settings.topicForUrl = this.topic.slice(0, this.topic.length - 11);
        return this;
    },
    run: function() {
        let wrapper = $("div[data-widget-id="+this.id+"]");
        this.settings.scaledWidth =  parseInt(wrapper.css('width').slice(0,-2));
        this.settings.scaledHeight = parseInt(wrapper.css('height').slice(0,-2));
        $("#widget-"+this.id+"-videostream-compressed").width(this.settings.scaledWidth);
        $("#widget-"+this.id+"-videostream-compressed").height(this.settings.scaledHeight);
    },
    load: function(settings) {
        this.settings.ip = settings.ip;
        this.settings.port = settings.port;
        this.settings.topicForUrl = this.topic.slice(0, this.topic.length - 11);
        return this;
    },
    save: function(widget) {

    },
    btnSettings: function(widget) {
    },
    btnRemove: function(widget) {
        $('#widget-'+this.id+'-videostream-compressed').attr('src', '');
    },

    btnSettingsSave: function(widget) {
        widget.data.settings.ip = $("#widget-"+widget.data.id+"-value-ip").val();   
        widget.data.settings.port = $("#widget-"+widget.data.id+"-value-port").val();
        widget.data.settings.scaledWidth = widget.data.settings.width;
        widget.data.settings.scaledHeight = widget.data.settings.height;
        //refresh videostream to apply new settings
        $.ajax({
            url: "widgets/" + widget.data.type + "/" + widget.data.implementation + "/index.hbs",
            method: "POST",
            success: function (data) {
                var compiledHtml = Handlebars.compile(data);
                var refreshedHtml = compiledHtml(widget.data);
                $("#widget-"+widget.data.id+"-content").children().remove();
                $("#widget-"+widget.data.id+"-content").append(refreshedHtml);
                widget.data.run();
            },
            error: function (e1, e2) {

            },
            cache: false
        });
    },
    resizable: function() {
        $("div[data-widget-id="+this.id+"]").resizable({
            alsoResize: "#widget-"+this.id+"-videostream-compressed",
            aspectRatio: true
        });
         $("div[data-widget-resizable="+this.id+"]").css("border-width","0px");     
    }
};
