

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
            mode: 'dynamic',
            size: 250,
            color: 'red'
        };
        this.manager = nipplejs.create(options);
        this.sendMessages = false;
        this.msgLoop = null;
        var self = this;
        // this.maxValue = this.manager.get(0).options.size/2;

        this.manager.on('start', function (evt, data) {
            self.msgLoop = setInterval(function () { self.teleopLoop(); }, 100);
        });

        this.manager.on('move', function(evt, data) {
            self.y = (data.position.x - data.instance.position.x) / data.instance.options.size*2;
            self.x = (data.position.y - data.instance.position.y) / data.instance.options.size*2;
        });

        this.manager.on('end', function (evt, data) {
            var twist = new ROSLIB.Message({
                angular : {
                    x : 0,
                    y : 0,
                    z : 0
                },
                linear : {
                    x : 0,
                    y : 0,
                    z : 0
                }
            });
            self.publishedTopic.publish(twist);
            clearInterval(self.msgLoop);
            self.publishedTopic.publish(twist);
        });
        
        

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
        var twist = new ROSLIB.Message({
            angular : {
                x : 0,
                y : 0,
                z : this.y * (-1)
            },
            linear : {
                x : this.x/2*(-1),
                y : 0,
                z : this.y *(-1)
            }
        });
        this.publishedTopic.publish(twist);
    }
};
