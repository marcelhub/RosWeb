import {ROSEvent} from "../services/rosEvents"

export class Widget{
    public id: number;
    public url: string;
    public type: string;
    public width: number;
    public height: number;
    public posX: number;
    public posY: number;
    public html: string;
    public implementation: string;
    public widgetInstance: any;


    constructor(id: number, url: string, type: string, width: number, height: number,
                posX: number, posY: number, html: string, implementation: string) {
        this.id = id;
        this.url = url;
        this.type = type;
        this.width = width;
        this.height = height;
        this.posX = posX;
        this.posY = posY;
        this.html = html;
        this.implementation = implementation;
    }

    public save() {
        let wrapper = $("div[data-widget-id="+this.id+"]");
        this.width =  parseInt(wrapper.css('width').slice(0,-2));
        this.height = parseInt(wrapper.css('height').slice(0,-2));
        this.posX = parseInt(wrapper.css('left').slice(0,-2));
        this.posY = parseInt(wrapper.css('top').slice(0,-2));
    }
}