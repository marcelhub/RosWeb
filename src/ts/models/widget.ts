export class Widget {
    public id: number;
    public topicUrl: string;
    public topicType: string;
    public sizeX: number;
    public sizeY: number;
    public posX: number;
    public posY: number;
    public viewImplType: string;
    public parameter: any;


    constructor(id: number, topicUrl: string, topicType: string, sizeX: number, sizeY: number,
                posX: number, posY: number, viewImplType: string, parameter?: any) {
        this.id = id;
        this.topicUrl = topicUrl;
        this.topicType = topicType;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.posX = posX;
        this.posY = posY;
        this.viewImplType = viewImplType;
        if(parameter) {
            this.parameter = parameter;
        } else {
            this.parameter = null;
        }

    }
}