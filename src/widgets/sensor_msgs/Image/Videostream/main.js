

function Videostream(id, ros, topic, type, implementation) {
    //default properties
    this.id = id;
    this.ros = ros;
    this.topic = topic;
    this.type = type;
    this.implementation = implementation;

    //settings object, this will be saved and stored.
    //contains parameters, values etc. that the implementation needs.
    //all required values should be stored in the setting namespace!
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
    load: function(settings) {
        this.settings = settings;
        return this.settings;
    },
    save: function() {
        return this.settings;
    },
    btnSettings: function(event) {
        console.log("HI");
    },
    btnRemove: function(event) {
    }
};
