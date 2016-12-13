/// <reference path="../typings/tsd.d.ts" />

import {WebView} from "./webView"
import {Widget} from "./widget"

declare var MyApp: any;

export class Workspace{
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
        this.rosMasterAdress = $("#rosMasterAdress").val();
        this.name = 'workspaceJson';
    }

    //create new widget
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

    //load a widget from loaded workspace
    public loadWidget(widget: Widget){
        //load index file
        $.ajax({
            url: "widgets/" + widget.topicType + "/" + widget.topicImplementation + "/index.hbs",
            method: "POST",
            beforeSend: function () {

            },
            success: function (data: string) {
                let posX = parseInt($(data).attr("data-pos-x"));
                let posY = parseInt($(data).attr("data-pos-y"));
                let width = parseInt($(data).attr("data-min-width"));
                let height = parseInt($(data).attr("data-min-height"));
                let crtWidget = new Widget(actualWorkspace.idCounter, widget.topicUrl, widget.topicType,
                                            widget.width, widget.height, widget.posX, widget.posY, data, widget.topicImplementation);
                actualWorkspace.webView.insertWidget(crtWidget);
                actualWorkspace.widgets.push(crtWidget);
                actualWorkspace.idCounter++;
            },
            error: function (e1: any, e2: any) {

            },
            cache: false
        });
    }

    public clear() {
        actualWorkspace.widgets = [];
        actualWorkspace.idCounter = 0;
        actualWorkspace.webView = new WebView();
        actualWorkspace.rosMasterAdress = $("#rosMasterAdress").val();
        actualWorkspace.name = 'workspaceJson';
        $('#frontend-container').empty();
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

    //load workspace with php-script
    public loadWorkspace() {
        $.ajax({
            type: 'POST',
            url: 'php/loadWorkspace.php',
            data: {workspace: 'workspaceJson'},
            success: function(msg) {
                let loadedWorkspace = JSON.parse(msg);
                console.log(actualWorkspace);
                console.log(loadedWorkspace);

                for(let widgetString in loadedWorkspace.widgets) {
                    let widgetJson = JSON.parse(widgetString);
                    actualWorkspace.loadWidget(widgetJson);
                }
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

window["fnctLoadWorkspace"] = fnctLoadWorkspace;
function fnctLoadWorkspace() {
    actualWorkspace.loadWorkspace();
}


export let actualWorkspace: Workspace = new Workspace();