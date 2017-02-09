function WidgetInstance(id, ros, topic, type, implementation) {
    //default properties
    this.id = id;
    this.ros = ros;
    this.topic = topic;
    this.type = type;
    this.implementation = implementation;
    this.settings = {};
}

WidgetInstance.prototype = {
    init: function() {
        //executed to initialize implemented widget
        return this;
    },
    run: function() {
        //executed after template has been inserted into the DOM
        return this;    
    },
    load: function() {
        console.log("proto load");
        //method is executed INSTEAD of init IF the widget is inserted from a loaded workspace
        return this;
    },
    save: function() {
        console.log("proto save");
        //method is executed when the workspace is saving
        return this;
    },
    btnSettings: function() {
        //if the instance has a settings button, this method will be executed when the button is clicked
        return this;
    },
    btnRemove: function() {
        //if the instance gets removed (click on the X to close it) this method is executed. Useful for cleanup operations
        return this;
    },
    btnSettingsSave: function() {
        //will be executed if the savebutton from the settings gets clicked
        return this;
    }
};