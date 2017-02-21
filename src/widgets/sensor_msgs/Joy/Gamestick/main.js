

function Gamestick(id, ros, topic, type, implementation) {
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
 
Gamestick.prototype = {
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
            zone: document.getElementById('widget-'+this.id+'-gamestick'),
            mode: 'dynamic',
            size: 250,
            color: 'red'
        };
        this.manager = nipplejs.create(options);
        this.sendMessages = false;
        this.msgLoop = null;
        this.x = 0.0;
        this.y = 0.0;
        var self = this;
        this.seqCounter = 0;

        this.manager.on('start', function (evt, data) {
            self.msgLoop = setInterval(function () { self.teleopLoop(); }, 100);
        });

        this.manager.on('move', function(evt, data) {
            self.y = (data.position.x - data.instance.position.x) / data.instance.options.size * 2;
            self.x = (data.position.y - data.instance.position.y) / data.instance.options.size * 2;
        });


        this.manager.on('end', function (evt, data) {
            clearInterval(self.msgLoop);
            var joyMsg = new ROSLIB.Message({
                header : {
                seq : ++self.seqCounter,
                stamp : {
                    secs: parseInt(Date.now()/1000),
                    nsecs: parseInt(Date.now()/1000)
                },
                frame_id : ''
                },
                axes : [0,0,-1,0,0,-1,0,0],
                buttons : [1,0,0,0,0,0,0,0,0,0,0]
            });
            self.publishedTopic.publish(joyMsg);
        });
        
        

    },
    load: function(settings) {
        this.init();
        return this;
    },

    save: function(widget) {
    },
    btnSettings: function(widget) {
    },
    
    btnRemove: function(widget) {
        clearInterval(this.msgLoop);
    },

    btnSettingsSave: function(widget) {

    },
    teleopLoop: function() {
        //need at least 5% speed backwards to drive an inverted curve
        var self = this;
        var joyMsg = new ROSLIB.Message({
            header : {
            seq : self.seqCounter,
            stamp : {
                secs: parseInt(Date.now()/1000),
                nsecs: parseInt(Date.now()/1000)
            },
            frame_id : ''
            },
            axes : [this.x < 0.05  ? this.y * (-1) : this.y, self.x *(-1),-1,0,0,-1,0,0],
            buttons : [1,0,0,0,0,0,0,0,0,0,0]
        });
        this.publishedTopic.publish(joyMsg);
        this.seqCounter++;
    },
    resizable: function() {
        
    }
};
