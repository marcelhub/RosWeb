/// <reference path="../typings/tsd.d.ts" />
declare var MyApp: any;

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

    public establishConnection = () => {
        try {
            $('.jsRosConnect').removeClass('error');
            $('.jsRosConnect').removeClass('connected');
            $('.jsRosMenu').removeClass('disconnected');
            $('.jsRosMenu').removeClass('connected');
            ROSEvent._ros.connect("ws://"+$("#rosMasterAdress").val());
        } catch(e) {
            $('.jsRosConnect').removeClass('connected');
            $('.jsRosConnect').addClass('error');
            $('.jsRosMenu').removeClass('connected');
            $('.jsRosMenu').addClass('disconnected');
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
        //generate menu
        this.buildMenu();
        $('.jsRosMenu').removeClass('disconnected');
        $('.jsRosMenu').addClass('connected');
        ROSEvent._connected = true;
    }

    private onRosClose = () => {
        $('.jsRosConnect').removeClass('connected');
        $('.jsRosConnect').addClass('error');
        $('.jsRosMenu').removeClass('connected');
        $('.jsRosMenu').addClass('disconnected');
        ROSEvent._connected = false;
    }

    private onRosError = (error: any) => {
        $('.jsRosConnect').removeClass('connected');
        $('.jsRosConnect').addClass('error');
        $('.jsRosMenu').removeClass('connected');
        $('.jsRosMenu').addClass('disconnected');
        ROSEvent._ros.close();
        ROSEvent._connected = false;
        console.log(error);
    }

    private buildMenu = ()  => {   
        let topicTypes: string[] = ['geometry_msgs/Twist', 'sensor_msgs/Image', 'sensor_msgs/NavSatFix','sensor_msgs/Imu'];
        let callbacksRemaining: number = topicTypes.length;
        let dict: Map<string, string[]> = new Map<string, string[]>();

        for (var i = 0; i < topicTypes.length; i++) {
            ROSEvent._ros.getTopicsForType(topicTypes[i],function(topicsResult) {
                ROSEvent._ros.getTopicType(topicsResult[0], function(typeResult) {
                    dict.set(typeResult, topicsResult);
                    --callbacksRemaining;
                    if(callbacksRemaining == 0) {
                        let source = $('.jsRosDropdown').html();
                        let template = Handlebars.compile(source);
                        let result = template({types: buildJSON(dict)});
                        console.log(result);
                        $('.dropdown-menu').html(result);                   
                    }
                });
            });
        }
    }
}

//build JSON to get rendered with handlebars
function buildJSON(dict: Map<string, string[]>) {
    let topicResult: Object[] = [];    
    for(let key of dict.keys()) {
        if(dict.get(key).length > 0) {
        let topicsArr: Object[] = [];
        for(let t of dict.get(key)) {
            let topicItem = {
                topic: t
            }
            topicsArr.push(topicItem);
        }

        let item = {
            type: key,
            topics: topicsArr
        }
        topicResult.push(item);
        }
    }
    return topicResult;
}
