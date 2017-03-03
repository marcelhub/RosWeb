/// <reference path="../typings/tsd.d.ts" />
import {actualWorkspace} from "../models/workspace"

/*Handling connection and events that are ROS related,
like connecting, disconnecting or building the topic menu dynamically.
To add supported ROS message types, add the type to the topicTypes Array.*/

declare var MyApp: any;

export class ROSEvent {

    private static ros: ROSLIB.Ros;
    private static connected: boolean=false;

    constructor(ros: ROSLIB.Ros) {
        rosEvents = this;
        ROSEvent.ros = ros;
        ROSEvent.ros.on("connection", this.onRosConnection);
        ROSEvent.ros.on("close", this.onRosClose);  
        ROSEvent.ros.on("error", this.onRosError);
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
            ROSEvent.ros.connect("ws://"+$("#rosMasterAdress").val());
        } catch(e) {
            $('.jsRosConnect').removeClass('connected');
            $('.jsRosConnect').addClass('error');
            $('.jsRosMenu').removeClass('connected');
            $('.jsRosMenu').addClass('disconnected');
        }
    }

    public getConnectionStatus = () => {
        return ROSEvent.getStatus();
    }

    public static getInstance() {
        return ROSEvent.ros;
    }

    public static getStatus() {
        return ROSEvent.connected;
    }

    private onRosConnection = () => {
        $('.jsRosConnect').removeClass('error');
        $('.jsRosConnect').addClass('connected');
        //generate menu
        this.buildMenu();
        $('.jsRosMenu').removeClass('disconnected');
        $('.jsRosMenu').addClass('connected');
        actualWorkspace.rosMasterAdress = $("#rosMasterAdress").val();
        ROSEvent.connected = true;
    }

    private onRosClose = () => {
        $('.jsRosConnect').removeClass('connected');
        $('.jsRosConnect').addClass('error');
        $('.jsRosMenu').removeClass('connected');
        $('.jsRosMenu').addClass('disconnected');
        ROSEvent.connected = false;
    }

    private onRosError = (error: any) => {
        $('.jsRosConnect').removeClass('connected');
        $('.jsRosConnect').addClass('error');
        $('.jsRosMenu').removeClass('connected');
        $('.jsRosMenu').addClass('disconnected');
        ROSEvent.ros.close();
        ROSEvent.connected = false;
        console.log(error);
    }

    //build menu dynamically, containing supported ROS topics
    private buildMenu = ()  => {   
        let topicTypes: string[] = ['geometry_msgs/Twist', 'sensor_msgs/Image','sensor_msgs/CompressedImage','sensor_msgs/NavSatFix','sensor_msgs/Joy','iosb_sensor_msgs/GpsWithVelocity'];
        let callbacksRemaining: number = topicTypes.length;
        let typesWithTopics: Map<string, string[]> = new Map<string, string[]>();
        let typesWithViews: Map<string, string[]> = new Map<string, string[]>();
        typesWithViews.set('geometry_msgs/Twist',['KeyboardTeleoperation','Joystick']);
        typesWithViews.set('sensor_msgs/Image',['Videostream']);
        typesWithViews.set('sensor_msgs/CompressedImage',['VideostreamCompressed']);
        typesWithViews.set('sensor_msgs/NavSatFix',['Maps']);
        typesWithViews.set('sensor_msgs/Joy',['Gamepad','Gamestick','Keyboard']);
        typesWithViews.set('iosb_sensor_msgs/GpsWithVelocity',['Navigation']);


        for (var i = 0; i < topicTypes.length; i++) {
            ROSEvent.ros.getTopicsForType(topicTypes[i],function(topicsResult) {
                ROSEvent.ros.getTopicType(topicsResult[0], function(typeResult) {
                    typesWithTopics.set(typeResult, topicsResult);                 
                    --callbacksRemaining;
                    if(callbacksRemaining == 0) {
                        let result = MyApp.templates.menu({types: buildJSON(typesWithTopics, typesWithViews)});
                        
                        $('.dropdown-menu').html(result);
                        $('.dropdown-submenu a.jsTopicImplementation').on("click", function(e){
                            $(this).next('ul').toggle();
                            e.stopPropagation();
                            e.preventDefault();
                        });
                    }
                });
            });
        }
    }
}

//build JSON to get rendered with handlebars
function buildJSON(typesWithTopics: Map<string, string[]>, typesWithViews: Map<string, string[]>) {
    let topicResult: Object[] = [];    
    for(let key of typesWithTopics.keys()) {
        if(typesWithTopics.get(key).length > 0) {
        let topicsArr: Object[] = [];
        let implArr: Object[] = [];

        //build implementations array
        for(let impl of typesWithViews.get(key)) {
            let implItem = {
                implementation: impl
            }
            implArr.push(implItem);
        }

        //build topics array
        for(let t of typesWithTopics.get(key)) {
            let topicItem = {
                topic: t,
                implementations: implArr
            }
            topicsArr.push(topicItem);
        }

        //build types array
        let item = {
            type: key,
            topics: topicsArr
        }
        topicResult.push(item);
        }
    }
    return topicResult;
}

export let rosEvents: ROSEvent;
