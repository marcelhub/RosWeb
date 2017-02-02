

function Maps(id, ros, topic, type, implementation) {
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

Maps.prototype = {
    init: function() {
        return this;
    },
    run: function() {
        this.mymap = Window.map;
        this.navTopic = new ROSLIB.Topic({
            ros : this.ros,
            name : this.topic,
            messageType : this.type,
        });

        this.mymap = null;
        this.marker = null;
        this.polylinePoints = [];
        var self = this;

        this.navTopic.subscribe(function(msg) {
            self.subscribedAction(msg);
        });
        
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

    },
    subscribedAction: function(msg) {
        if(this.mymap === null) {
            this.mymap = L.map('map-'+this.id).setView([msg.latitude, msg.longitude], 18); 
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.mymap);
        } else {
            this.mymap.removeLayer(this.polyline);
        }
            if(this.marker === null) {
                this.marker = L.marker([msg.latitude, msg.longitude]).addTo(this.mymap);
            }
            
            var latLng = new L.LatLng(msg.latitude, msg.longitude);
            this.polylinePoints.push(latLng);

            this.polyline = new L.Polyline(this.polylinePoints, {
                color: 'red',
                weight: 3,
            });

            this.mymap.setView(latLng);
            this.marker.setLatLng(latLng);
            // this.mymap.addLayer(this.polyline);
            var newHeight = $("div[data-widget-id="+this.id+"]").height()-47;
            $('#map-'+this.id).css("height", newHeight);
            this.mymap.invalidateSize();
    },
    toJSON: function() {
        return JSON.stringify(this.settings);
    }
};
