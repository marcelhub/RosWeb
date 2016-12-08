import {ROSEvent} from "../services/rosEvent"

export class Widget{
    public ros: ROSLIB.Ros;
    public id: number;
    public topicUrl: string;
    public topicType: string;
    public width: number;
    public height: number;
    public posX: number;
    public posY: number;
    public html: string;
    public topicImplementation: string;
    public widgetInstance: any;
    public settings: any;


    constructor(id: number, topicUrl: string, topicType: string, width: number, height: number,
                posX: number, posY: number, html: string, topicImplementation: string, settings?: any) {
        this.ros = ROSEvent.getInstance();
        this.id = id;
        this.topicUrl = topicUrl;
        this.topicType = topicType;
        this.width = width;
        this.height = height;
        this.posX = posX;
        this.posY = posY;
        this.html = html;
        this.topicImplementation = topicImplementation;
        if(settings) {
            this.settings = settings;
        } else {
            this.settings = null;
        }

    }
}