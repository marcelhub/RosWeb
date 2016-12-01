/// <reference path="../typings/tsd.d.ts" />

import {WebView} from "./webView"
import {Widget} from "./widget"

declare var MyApp: any;

export class Workspace {
    public rosMasterAdress: string;
    public name: string;
    public id: number;
    public widgets: Array<Widget>;

    constructor() {
        this.widgets = new Array();
    }

    public createWidget = (topicUrl:string, topicType: string, viewImplType?: string) => {
        $.ajax({
            url: "widgets/" + topicType + "/index.hbs",
            beforeSend: function () {

            },
            success: function (data: string) {
                // MyApp.templates._widgetsTemplates[widget.alias] = Handlebars.compile(data);
                console.log(data);
            },
            error: function (e1: any, e2: any) {
                console.log(e1);
                console.log(e2);
            }
        });
        let widget = new Widget(this.widgets.length, topicUrl, topicType, 100,100,100,100, '');
    }
}

window['fnctCreateWidget'] = fnctCreateWidget;
function fnctCreateWidget(topicUrl: string, topicType: string) {
    actualWorkspace.createWidget(topicUrl, topicType);
}


export let actualWorkspace: Workspace = new Workspace();