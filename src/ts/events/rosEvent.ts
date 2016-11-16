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
        if(ROSEvent._connected) {
            return;
        }
        ROSEvent._ros.connect("ws://"+$("#rosMasterAdress").val());
        console.log(ROSEvent._ros);
        
    }

    public static getInstance() {
        return ROSEvent._ros;
    }

    public static getStatus() {
        return ROSEvent._connected;
    }

    private onRosConnection = () => {
        ROSEvent._connected = true;
    }

    private onRosClose = () => {
        ROSEvent._connected = false;
    }

    private onRosError = (error: any) => {
        ROSEvent._ros.close();
        ROSEvent._connected = false;
        console.log(error);
    }


}