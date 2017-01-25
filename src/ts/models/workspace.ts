/// <reference path="../typings/tsd.d.ts" />

import {WebView} from "./webView"
import {Widget} from "./widget"
import {ROSEvent} from "../services/rosEvents"
import {rosEvents} from "../services/rosEvents"


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
    }

    //create new widget
    public createWidget(topicUrl:string, topicType: string, topicImplementation: string) {
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
                let crtWidget = new Widget(actualWorkspace.idCounter, widget.topicUrl, widget.topicType,
                                            widget.width, widget.height, widget.posX, widget.posY, data, widget.topicImplementation);
                actualWorkspace.webView.insertWidget(crtWidget, widget.widgetInstance);
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
    public saveWorkspace(name?: string) {
        if(name == null) {
            actualWorkspace.name = $('#workspace-new-save').val();
        } else {
            actualWorkspace.name = name;
        }
        if(actualWorkspace.name.length > 0) {
            //store current widget size and position
            for(let i = 0; i < actualWorkspace.widgets.length; i++) {
                actualWorkspace.widgets[i].save();
            }
            $.ajax({
                type: 'POST',
                url: 'php/saveWorkspace.php',
                data: {workspace: JSON.stringify(actualWorkspace, function( key, value) {
                            if(key == 'self') {
                                console.log(key); 
                                return null;
                            } else {
                                return value;
                            };
                        })},

                success: function(msg) {
                    actualWorkspace.menuWorkspace();
                }
            });
        } else {
            //do nothing if no name was given
        }
    }

    //load workspace with php-script
    public loadWorkspace(name: string) {
        $.ajax({
            type: 'POST',
            url: 'php/loadWorkspace.php',
            data: {workspace: name},
            success: function(msg) {
                let loadedWorkspace = JSON.parse(msg);
                let workspaceObj = JSON.parse(loadedWorkspace);

                actualWorkspace.widgets = [];
                actualWorkspace.idCounter = 0;
                actualWorkspace.webView = new WebView();
                actualWorkspace.rosMasterAdress = workspaceObj.rosMasterAdress;
                actualWorkspace.name = workspaceObj.name;
                
                $("#rosMasterAdress").val(actualWorkspace.rosMasterAdress);
                rosEvents.establishConnection();

                $('#frontend-container').empty();
                for(let i = 0; i < workspaceObj.widgets.length; i++) {
                    actualWorkspace.loadWidget(workspaceObj.widgets[i]);
                }

            }
        });
    }

    public deleteWorkspace(name: string) {
        $.ajax({
            type: 'POST',
            url: 'php/deleteWorkspace.php',
            data: {workspace: name},
            success: function(msg) {
                $('#workspace-form-'+name).remove();
            }
        });
    }

    //generate menu-list of workspaces
    public menuWorkspace() {
        $.ajax({
            type: 'POST',
            url: 'php/generateWorkspaceMenu.php',
            success: function(data) {
                if(MyApp.templates['generateWorkspaceMenu'] == null) {
                    actualWorkspace.loadMenuWorkspaceTemplate();
                } else {
                    let menuHtml = MyApp.templates.generateWorkspaceMenu({workspaces: JSON.parse(data)});
                    $('#workspace-menu-body-wrapper').html(menuHtml);
                }
            }
        });
    }
    

    public loadMenuWorkspaceTemplate() {
        $.ajax({
            url: "templates/workspaceMenu.hbs",
            method: "POST",
            beforeSend: function () {

            },
            success: function (data: string) {
                MyApp.templates['generateWorkspaceMenu'] = Handlebars.compile(data);
                actualWorkspace.menuWorkspace();
            },
            cache: false
        });
    }
}

window["fnctCreateWidget"] = fnctCreateWidget;
function fnctCreateWidget(topicUrl: string, topicType: string, topicImplementation: string) {
    actualWorkspace.createWidget(topicUrl, topicType, topicImplementation);
}

window["fnctSaveWorkspace"] = fnctSaveWorkspace;
function fnctSaveWorkspace(name?: string) {
    if(name == null) {
        actualWorkspace.saveWorkspace();
    } else {
        actualWorkspace.saveWorkspace(name);
    }
}

window["fnctLoadWorkspace"] = fnctLoadWorkspace;
function fnctLoadWorkspace(name: string) {
    actualWorkspace.loadWorkspace(name);
}

window["fnctDeleteWorkspace"] = fnctDeleteWorkspace;
function fnctDeleteWorkspace(name: string) {
    actualWorkspace.deleteWorkspace(name);
}

window["fnctMenuWorkspace"] = fnctMenuWorkspace;
function fnctMenuWorkspace() {
    actualWorkspace.menuWorkspace();
}

export let actualWorkspace: Workspace = new Workspace();