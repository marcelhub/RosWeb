/// <reference path="../typings/tsd.d.ts" />

import {WebView} from "./webView"
import {Widget} from "./widget"

declare var MyApp: any;

export class Workspace {
    public rosMasterAdress: string;
    public name: string;
    public id: number;
    public widgets: Widget[];

    constructor() {
        this.widgets = [];
    }

    public createWidget(topicUrl:string, topicType: string, viewImplType?: string){
        $.ajax({
            url: "widgets/" + topicType + "/index.hbs",
            beforeSend: function () {

            },
            success: function (data: string) {
                console.log(data);
                let posX = parseInt($(data).attr("data-pos-x"));
                let posY = parseInt($(data).attr("data-pos-y"));
                let width = parseInt($(data).attr("data-min-width"));
                let height = parseInt($(data).attr("data-min-height"));
                let crtWidget = new Widget(actualWorkspace.widgets.length, topicUrl, topicType,
                                            width, height, posX, posY, '');
                actualWorkspace.widgets.push(crtWidget);
                actualWorkspace.insertWidget(crtWidget, data);

            },
            error: function (e1: any, e2: any) {
                console.log(e1);
                console.log(e2);
            },
            cache: false
        });
    }

    public insertWidget = (widget: Widget, data: string) => {
        $("#frontend-container").append(data);
        $(".test").draggable();
    }
}

window["fnctCreateWidget"] = fnctCreateWidget;
function fnctCreateWidget(topicUrl: string, topicType: string) {
    actualWorkspace.createWidget(topicUrl, topicType);
}


export let actualWorkspace: Workspace = new Workspace();