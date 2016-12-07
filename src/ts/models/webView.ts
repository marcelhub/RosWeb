import {actualWorkspace} from "./workspace"
import {Widget} from "./widget"

declare var MyApp: any;

export class WebView {
    private _widgetHeaderOffset = 50;
    constructor() {

    }

    private _getInstance(context: Object, name: string, ...args: any[]): any {
        var instance = Object.create(context[name].prototype);
        instance.constructor.apply(instance, args);
        return instance;
    }

    public insertWidget = (widget: Widget) => {
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
            widget.widgetInstance = new this[widget.topicImplementation](widget.id, widget.ros, widget.topicUrl, widget.topicType,
                                                                        widget.topicImplementation).init();
            console.log(widget.widgetInstance);
            let widgetHtml = widgetTemplateCompiled(widget.widgetInstance);
            $(wrapperHtml).appendTo("#frontend-container");
            $(widgetHtml).appendTo("div[data-widget-id="+widget.id+"]");
            //widget event handling
            $("div[data-widget-id="+widget.id+"]").draggable();
        }
        , 500);
    }
}

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
                console.log( "Loading performed.");
            },
            dataType: "script",
            cache: false
        });
    }
}
