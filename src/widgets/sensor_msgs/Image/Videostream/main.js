

function Videostream(id, ros, topic, type, implementation) {
    //default properties
    this.id = id;
    this.ros = ros;
    this.topic = topic;
    this.type = type;
    this.implementation;
    this.myWrapper = "div[data-widget-id="+id+"]";
    //settings object, this will be saved and stored.
    //contains parameters, values etc. that the implementation needs.
    //all required values should be stored in the setting namespace!
    this.settings = {};

    return this;
}
 
Videostream.prototype = {
    init: function() {
        //custom properties initialized with default, assuming
        //that web_video_server runs on the same host
        this.settings.ip = $("#rosMasterAdress").val().split(":")[0];   
        //default port 8080 of Ros web_video_server
        this.settings.port = 8080;
        return this;
    },
    load: function() {
        return settings;
    },
    save: function() {
        return settings;
    }
};
