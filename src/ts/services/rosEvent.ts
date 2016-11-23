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
        let topicTypes: string[] = ['geometry_msgs/Twist', 'sensor_msgs/Image', 'sensor_msgs/NavSatFix'];
        let callbacksRemaining: number = topicTypes.length;
        let dict: Map<string, string[]> = new Map<string, string[]>();

        for (var i = 0; i < topicTypes.length; i++) {
            ROSEvent._ros.getTopicsForType(topicTypes[i],function(topicsResult) {
                ROSEvent._ros.getTopicType(topicsResult[0], function(typeResult) {
                    dict.set(typeResult, topicsResult);
                    --callbacksRemaining;
                    if(callbacksRemaining == 0) {
                        console.log(dict);
                        console.log(JSON.stringify([...dict]));
                        console.log(JSON.stringify(dict));
                        let source = $('.jsRosDropdown').html();
                        console.log(source);
                        let template = Handlebars.compile(source);
                        console.log(template);
                        let data = [ 
                             { 
                                type: 'geometry_msgs/Twist',
                                topics: [
                                    {
                                        topic: '1',
                                    }
                                ]
                            },  
                            {
                                type: 'sensor_msgs/Image',
                                topics: [
                                    {
                                        topic: '2',
                                    }
                                ]
                            }
                        ];

                        let result = template({types: data});
                        console.log(result);
                        $('.dropdown-menu').html(result);                   
                    }
                });
            });
        }
    }

    private buildJSON(dict: Map<string, string[]>) {
        let jsonArr: string;
    }


}

