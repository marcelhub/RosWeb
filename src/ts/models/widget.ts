import {ROSEvent} from "../services/rosEvents"

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


    constructor(id: number, topicUrl: string, topicType: string, width: number, height: number,
                posX: number, posY: number, html: string, topicImplementation: string) {
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
    }

    public save() {
        let wrapper = $("div[data-widget-id="+this.id+"]");
        this.width =  parseInt(wrapper.css('width').slice(0,-2));
        this.height = parseInt(wrapper.css('height').slice(0,-2));
        this.posX = parseInt(wrapper.css('left').slice(0,-2));
        this.posY = parseInt(wrapper.css('top').slice(0,-2));
    }
}