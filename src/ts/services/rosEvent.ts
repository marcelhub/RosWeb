/// <reference path="../typings/tsd.d.ts" />
export class ROSEvent {

    private static _ros: ROSLIB.Ros;
    private static _connected: boolean=false;
    
    constructor(ros: ROSLIB.Ros) {
        ROSEvent._ros = ros;
        ROSEvent._ros.on("connection", this.onRosConnection);
        ROSEvent._ros.on("close", this.onRosClose);  
        ROSEvent._ros.on("error", this.onRosError);
        this.DelegateEvent(".jsRosConnect", "click", this.establishConnection);
    }

    public DelegateEvent(selector: string | Document | Window, event: string, method: () => void) {
        $(document).delegate(selector, event, method);
    }

    public establishConnection() {
        try {
            $('.jsRosConnect').removeClass('error');
            $('.jsRosConnect').removeClass('connected');
            ROSEvent._ros.connect("ws://"+$("#rosMasterAdress").val());
            console.log("Test");
            ROSEvent._ros.getTopics(function(topics) {
                console.log(topics);
            });
            ROSEvent._ros.getTopicsForType('geometry_msgs/Twist',function(topics) {
                console.log(topics);
            });
        } catch(e) {
            $('.jsRosConnect').addClass('error');
            console.log(e);
        }
    }

    public static getInstance() {
        return ROSEvent._ros;
    }

    public static getStatus() {
        return ROSEvent._connected;
    }

    private onRosConnection = () => {
        $('.jsRosConnect').removeClass('error');
        $('.jsRosConnect').addClass('connected');
        ROSEvent._connected = true;
    }

    private onRosClose = () => {
        $('.jsRosConnect').removeClass('connected');
        $('.jsRosConnect').addClass('error');
        ROSEvent._connected = false;
    }

    private onRosError = (error: any) => {
        $('.jsRosConnect').removeClass('connected');
        $('.jsRosConnect').addClass('error');
        ROSEvent._ros.close();
        ROSEvent._connected = false;
        console.log(error);
    }


}