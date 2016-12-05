import {WidgetEvents} from "../services/widgetEvents"

export class Widget extends WidgetEvents{
    public id: number;
    public topicUrl: string;
    public topicType: string;
    public width: number;
    public height: number;
    public posX: number;
    public posY: number;
    public html: string;
    public topicImplementation: string;
    public parameter: any;


    constructor(id: number, topicUrl: string, topicType: string, width: number, height: number,
                posX: number, posY: number, html: string, topicImplementation: string, parameter?: any) {
        super();
        this.id = id;
        this.topicUrl = topicUrl;
        this.topicType = topicType;
        this.width = width;
        this.height = height;
        this.posX = posX;
        this.posY = posY;
        this.html = html;
        this.topicImplementation = topicImplementation;
        if(parameter) {
            this.parameter = parameter;
        } else {
            this.parameter = null;
        }

    }
}