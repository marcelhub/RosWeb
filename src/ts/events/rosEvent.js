/// <reference path="../typings/tsd.d.ts" />
export class ROSEvent {
    constructor(ros) {
        this.connected = false;
        this.onRosConnection = () => {
            this.connected = true;
            $(".jsRosConnect").addClass("active");
            $(".jsRosConnect").removeClass("loading");
            $(".jsRosConnect, #jsRosUrl, .jsConfiguration").removeClass("alert");
        };
        this.onRosClose = () => {
            this.connected = false;
            $(".jsRosConnect").removeClass("active");
            $(".jsRosConnect").removeClass("loading");
        };
        this.onRosError = (error) => {
            this.ros.close();
            this.connected = false;
            $(".jsRosConnect").removeClass("active");
            $(".jsRosConnect").removeClass("loading");
            $(".jsRosConnect, #jsRosUrl, .jsConfiguration").addClass("alert");
            console.log(error);
        };
        this.ros = ros;
        this.ros.on("connection", this.onRosConnection);
        this.ros.on("close", this.onRosClose);
        this.ros.on("error", this.onRosError);
        this.DelegateEvent(".jsRosConnect", "click", this.establishConnection);
    }
    DelegateEvent(selector, event, method) {
        $(document).delegate(selector, event, method);
    }
    establishConnection() {
        console.log("url: " + $("#rosMasterAdress").val());
        this.ros.connect("url: " + $("#rosMasterAdress").val());
        console.log(this.ros);
    }
}
