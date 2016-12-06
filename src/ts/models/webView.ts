import {actualWorkspace} from "./workspace"
import {Widget} from "./widget"

declare var MyApp: any, testfnct: any;

export class WebView{
    private _widgetHeaderOffset = 50;
    constructor() {

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

        //generate html from wrapper to insert later
        let wrapperHtml = MyApp.templates.widgetWrapper(widgetWrapperData);

        //compile html to javascript
        let widgetTemplateCompiled  = Handlebars.compile(widget.html);

        //load main.js to the document if it's not already loaded
        loadScript(widget);

        //execute the function from correlated main.js
        //widget.widgetInstance = Object.create

        executeFunctionByName(widget.topicImplementation, window);

        let widgetHtml = widgetTemplateCompiled({});
        $(wrapperHtml).appendTo("#frontend-container");
        $(widgetHtml).appendTo("div[data-widget-id="+widget.id+"]");
        $("div[data-widget-id="+widget.id+"]").draggable();
    }
}

function loadScript(widget: Widget) {
    let alreadyLoaded = $('script[src=\"widgets/' + widget.topicType + '/' + widget.topicImplementation + '/main.js\"]');
    if(alreadyLoaded.length > 0) {
    } else {
        let jsString = "widgets/" + widget.topicType + "/" + widget.topicImplementation + "/main.js";
        $(document.body).append('<script type="text/javascript" src='+jsString+'></script>');
    }
}

function executeFunctionByName(functionName, context /*, args */) {
  var args = [].slice.call(arguments).splice(2);
  var namespaces = functionName.split("."); 
  var func = namespaces.pop();
  for(var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(context /*, args */);
}