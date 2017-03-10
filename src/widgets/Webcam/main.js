

function Webcam(id, ros, topic, type, implementation) {
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
 
Webcam.prototype = {
    init: function() {
        this.settings.ip = $("#rosMasterAdress").val().split(":")[0];
        return this;
    },
    run: function() {
        let wrapper = $("div[data-widget-id="+this.id+"]");
        this.settings.scaledWidth =  parseInt(wrapper.css('width').slice(0,-2));
        this.settings.scaledHeight = parseInt(wrapper.css('height').slice(0,-2));
        $("#widget-"+this.id+"-webcam").width(this.settings.scaledWidth);
        $("#widget-"+this.id+"-webcam").height(this.settings.scaledHeight);
        var ipParam = new ROSLIB.Param({
            ros: this.ros,
            name: '/axis/axis_driver/hostname'
        });
        var self = this;
        ipParam.get(function(value) {
            if(value) {
                self.settings.ip = value;
                $('#widget-'+self.id+'-webcam').attr('src', 'http://'+self.settings.ip+'/axis-cgi/mjpg/video.cgi?');
            }
            $("h4[data-widget-title="+self.id+"]").text(self.implementation+": "+self.settings.ip);

        });
    },
    
    load: function(settings) {
        this.settings.ip = settings.ip;    
        return this;
    },
    save: function(widget) {

    },
    btnSettings: function(widget) {
    },
    btnRemove: function(widget) {
        $('#widget-'+this.id+'-webcam').attr('src', '');
    },

    btnSettingsSave: function(widget) {
        widget.data.settings.ip = $("#widget-"+widget.data.id+"-value-ip").val();   
        widget.data.settings.scaledWidth = $("#widget-"+widget.data.id+"-value-scaledWidth").val();
        widget.data.settings.scaledHeight = $("#widget-"+widget.data.id+"-value-scaledHeight").val();
        //refresh videostream to apply new settings
        $.ajax({
            url: "widgets/" + widget.data.implementation + "/index.hbs",
            method: "POST",
            success: function (data) {
                var compiledHtml = Handlebars.compile(data);
                var refreshedHtml = compiledHtml(widget.data);
                $("#widget-"+widget.data.id+"-content").children().remove();
                $("#widget-"+widget.data.id+"-content").append(refreshedHtml);
                $("div[data-widget-id="+widget.data.id+"]").css("width",  widget.data.settings.scaledWidth+"px");
                $("div[data-widget-id="+widget.data.id+"]").css("height",  widget.data.settings.scaledHeight+"px");
                widget.data.run();
            },
            error: function (e1, e2) {

            },
            cache: false
        });
    },
    resizable: function() {
        $("div[data-widget-id="+this.id+"]").resizable({
            alsoResize: "#widget-"+this.id+"-webcam",
            aspectRatio: true
        });
        $("div[data-widget-resizable="+this.id+"]").css("border-width","0px");     
    }
};
