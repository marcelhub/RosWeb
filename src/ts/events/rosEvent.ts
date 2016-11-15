/// <reference path="../typings/tsd.d.ts" />

export class ROSEvent {

    public ros: ROSLIB.Ros;
    public connected: boolean=false;
    
    constructor(ros: ROSLIB.Ros) {
        this.ros = ros;
        this.ros.on("connection", this.onRosConnection);
        this.ros.on("close", this.onRosClose);
        this.ros.on("error", this.onRosError);
        console.log("TEST");
        this.DelegateEvent("jsRosConnect", "click", this.establishConnection);
    }

    public DelegateEvent(selector: string | Document | Window, event: string, method: () => void) {
        $(document).delegate(selector, event, method);
    }

    public establishConnection() {
        console.log("url: "+$("#rosMasterAdress").val());
        this.ros.connect("url: "+$("#rosMasterAdress").val());
        console.log(this.ros);
    }

    private onRosConnection = () => {
        this.connected = true;
        $(".jsRosConnect").addClass("active");
        $(".jsRosConnect").removeClass("loading");

        $(".jsRosConnect, #jsRosUrl, .jsConfiguration").removeClass("alert");
    }

    private onRosClose = () => {
        this.connected = false;
        $(".jsRosConnect").removeClass("active");
        $(".jsRosConnect").removeClass("loading");
    }

    private onRosError = (error: any) => {
        this.ros.close();
        this.connected = false;
        $(".jsRosConnect").removeClass("active");
        $(".jsRosConnect").removeClass("loading");

        $(".jsRosConnect, #jsRosUrl, .jsConfiguration").addClass("alert");
        console.log(error);
    }


}