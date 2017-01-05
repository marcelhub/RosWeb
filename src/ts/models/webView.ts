import {actualWorkspace} from "./workspace"
import {Widget} from "./widget"

declare var MyApp: any;

export class WebView {
    private _widgetHeaderOffset = 0;
    constructor() {
        Handlebars.registerHelper('trim', function(obj) {
            return new Handlebars.SafeString(
                obj.replace(/ /g,'')
            );
        });
    }

    public insertWidget = (widget: Widget, widgetInstance?: any) => {
        //JSON object needed for widgetWrapper context
        let widgetWrapperData = {
            id : widget.id,
            posX: widget.posX,
            posY: widget.posY,
            width: widget.width,
            height: widget.height + this._widgetHeaderOffset,
            topic: widget.topicUrl,
            topicImplementation: widget.topicImplementation,
            btnSettings: $(widget.html).attr("data-btn-widget-settings")!="1"? false : true,
            btnRemove: $(widget.html).attr("data-btn-widget-remove")!="1"? false : true
        };

        //load main.js to the document if it's not already loaded
        loadScript(widget);

        //generate html from wrapper to insert it later
        let wrapperHtml = MyApp.templates.widgetWrapper(widgetWrapperData);

        //compile html to javascript
        let widgetTemplateCompiled  = Handlebars.compile(widget.html);
        setTimeout(function() {
            if(widgetInstance == null) {
                //create object of widgetinstance and initialize it with default values
                widget.widgetInstance = new this[widget.topicImplementation](widget.id, widget.ros, widget.topicUrl, widget.topicType,
                                                                            widget.topicImplementation).init();
            } else {
                //create object with loaded settings
                widget.widgetInstance = new this[widget.topicImplementation](widget.id, widget.ros, widget.topicUrl, widget.topicType,
                                                                            widget.topicImplementation).load(widgetInstance.settings);
            }

            //compile javascript with the data from the widgetinstance to html
            let widgetHtml = widgetTemplateCompiled(widget.widgetInstance);

            //insert wrapper into document, afterwards the widget itself
            $(wrapperHtml).appendTo("#frontend-container");
            $(widgetHtml).appendTo("div[data-widget-id="+widget.id+"] .panel-body");

            //add default event handling to widget (if not existing, nothing happens)
            $("div[data-widget-id="+widget.id+"] .jsWidgetSettings").on( "click", widget.widgetInstance ,widget.widgetInstance.btnSettings);
            //use remove of widgetInstance, then clean up workspace
            $("div[data-widget-id="+widget.id+"] .jsWidgetRemove").on( "click", widget.widgetInstance, function() {
                if( widget.widgetInstance.btnRemove == null) {
                    //no remove method from widgetInstance
                } else {
                    widget.widgetInstance.btnRemove(widget);
                }
                actualWorkspace.removeWidget(widget);
                $("div[data-widget-id="+widget.id+"]").remove();
            });
            $("div[data-widget-id="+widget.id+"]").draggable();

            //insert settings for this widget
            insertSettings(widget);
        }
        , 1000);
    }

}


//load settings file
function insertSettings(widget: Widget) {
    $.ajax({
        url: "widgets/" + widget.topicType + "/" + widget.topicImplementation + "/settings.hbs",
        method: "POST",
        beforeSend: function () {

        },
        success: function (data: string) {
            let settingsCompiled  = Handlebars.compile(data);
            let settingsHtml = settingsCompiled(widget.widgetInstance);
            $("div[data-widget-id="+widget.id+"]").append(settingsHtml);
            $("div[data-widget-id="+widget.id+"] .jsWidgetSettingsSave").on( "click", widget.widgetInstance, widget.widgetInstance.btnSettingsSave);
            },
        error: function (e1: any, e2: any) {

        },
        cache: false
    });
}

//load script file
function loadScript(widget: Widget) {
    let alreadyLoaded = $('script[src=\"widgets/' + widget.topicType + '/' + widget.topicImplementation + '/main.js\"]');
    if(alreadyLoaded.length > 0) {
    } else {
        let jsString = "widgets/" + widget.topicType + "/" + widget.topicImplementation + "/main.js";
        $.ajax({
            type: "GET",
            url: jsString,
            success: function(data) {
                $(document.body).append('<script type="text/javascript" src='+jsString+'></script>');
            },
            dataType: "script",
            cache: false
        });
    }
}
