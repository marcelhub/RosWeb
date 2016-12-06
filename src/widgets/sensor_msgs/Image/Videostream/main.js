

function Videostream(id, ros, topic, type, implementation) {
    this.id = id;
    this.ros = ros;
    this.topic = topic;
    this.type = type;
    this.implementation;
}
 
Videostream.prototype = {
    init: function() {
        console.log(ros);
        ros.getNodes(function(result) {
            console.log(result);
        });
        return {hi: "test"};
    },
    load: function() {
      //loading a saved instance
    },
    save: function() {
      //saving current instance
    }
};