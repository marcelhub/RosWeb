/// <reference path="../typings/tsd.d.ts" />

import {WebView} from "./webView"
import {Widget} from "./widget"

declare var MyApp: any;

export class Workspace {
    public rosMasterAdress: string;
    public name: string;
    public id: number;
    public widgets: Widget[];
    public webView: WebView;
    public idCounter: number;

    constructor() {
        this.widgets = [];
        this.idCounter = 0;
        this.webView = new WebView();
    }

    public createWidget(topicUrl:string, topicType: string, topicImplementation: string){
        $.ajax({
            url: "widgets/" + topicType + "/" + topicImplementation + "/index.hbs",
            beforeSend: function () {

            },
            success: function (data: string) {
                console.log(data);
                let posX = parseInt($(data).attr("data-pos-x"));
                let posY = parseInt($(data).attr("data-pos-y"));
                let width = parseInt($(data).attr("data-min-width"));
                let height = parseInt($(data).attr("data-min-height"));
                let crtWidget = new Widget(actualWorkspace.idCounter, topicUrl, topicType,
                                            width, height, posX, posY, data, '');
                actualWorkspace.webView.insertWidget(crtWidget);
                actualWorkspace.widgets.push(crtWidget);
                actualWorkspace.idCounter++;

            },
            error: function (e1: any, e2: any) {
                console.log(e1);
                console.log(e2);
            },
            cache: false
        });
    }
}

window["fnctCreateWidget"] = fnctCreateWidget;
function fnctCreateWidget(topicUrl: string, topicType: string, topicImplementation: string) {
    actualWorkspace.createWidget(topicUrl, topicType, topicImplementation);
}


export let actualWorkspace: Workspace = new Workspace();