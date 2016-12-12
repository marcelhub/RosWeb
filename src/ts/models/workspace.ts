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
        //load index file
        $.ajax({
            url: "widgets/" + topicType + "/" + topicImplementation + "/index.hbs",
            method: "POST",
            beforeSend: function () {

            },
            success: function (data: string) {
                let posX = parseInt($(data).attr("data-pos-x"));
                let posY = parseInt($(data).attr("data-pos-y"));
                let width = parseInt($(data).attr("data-min-width"));
                let height = parseInt($(data).attr("data-min-height"));
                let crtWidget = new Widget(actualWorkspace.idCounter, topicUrl, topicType,
                                            width, height, posX, posY, data, topicImplementation);
                actualWorkspace.webView.insertWidget(crtWidget);
                actualWorkspace.widgets.push(crtWidget);
                actualWorkspace.idCounter++;
            },
            error: function (e1: any, e2: any) {

            },
            cache: false
        });
    }

    //remove Widget from workspace
    public removeWidget(widget: Widget) {
        actualWorkspace.widgets = $.grep(actualWorkspace.widgets, function(e){ 
            return e.id != widget.id; 
        });
    }

    //save workspace with php-script
    public saveWorkspace() {
        console.log(actualWorkspace);
        $.ajax({
            type: 'POST',
            url: 'php/saveWorkspace.php',
            data: {workspace: JSON.stringify(actualWorkspace)},
            success: function(msg) {
                console.log(msg);
            }
        });
    }
}

window["fnctCreateWidget"] = fnctCreateWidget;
function fnctCreateWidget(topicUrl: string, topicType: string, topicImplementation: string) {
    actualWorkspace.createWidget(topicUrl, topicType, topicImplementation);
}

window["fnctSaveWorkspace"] = fnctSaveWorkspace;
function fnctSaveWorkspace() {
    actualWorkspace.saveWorkspace();
}


export let actualWorkspace: Workspace = new Workspace();