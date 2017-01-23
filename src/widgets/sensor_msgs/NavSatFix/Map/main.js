

function Map(id, ros, topic, type, implementation) {
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
 
Map.prototype = {
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

            if(self.mymap === null) {
                self.mymap = L.map('map-'+self.id).setView([msg.latitude, msg.longitude], 18); 
                L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(self.mymap);
            } else {
                self.mymap.removeLayer(self.polyline);
            }
            if(self.marker === null) {
                self.marker = L.marker([msg.latitude, msg.longitude]).addTo(self.mymap);
            }
            
            var latLng = new L.LatLng(msg.latitude, msg.longitude);
            self.polylinePoints.push(latLng);

            self.polyline = new L.Polyline(self.polylinePoints, {
                color: 'red',
                weight: 3,
            });

            self.mymap.setView(latLng);
            self.marker.setLatLng(latLng);
            self.mymap.addLayer(self.polyline);
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

    }
};
