

function Joystick(id, ros, topic, type, implementation) {
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
 
Joystick.prototype = {
    init: function() {
        this.publishedTopic = new ROSLIB.Topic({
            ros : this.ros,
            name : this.topic,
            messageType : this.type,
        });

        return this;
    },
    run: function() {
        var options = {
            zone: document.getElementById('widget-'+this.id+'-joystick'),
            mode: 'static',
            size: 250,
            color: 'red',
            position: {
                left: '50%',
                bottom: '50%'
            }
        };
        this.manager = nipplejs.create(options);
    
        this.msgLoop = null;
        var self = this;
        this.maxValue = this.manager.get(0).options.size/2;
        this.msgLoop = setInterval(function () { self.teleopLoop(); }, 100);

    },
    load: function(settings) {
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

    },
    teleopLoop: function() {
        var nipple = this.manager.get(0);
        var myX = nipple.frontPosition.y / this.maxValue;
        var myY = nipple.frontPosition.x / this.maxValue;
        console.log('myX: '+myX+ ' ----------- myY: '+myY);
        var twist = new ROSLIB.Message({
            angular : {
                x : 0,
                y : 0,
                z : myY
            },
            linear : {
                x : myX,
                y : 0,
                z : myY
            }
        });
        this.publishedTopic.publish(twist);
        
    }
};
