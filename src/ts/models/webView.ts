import {actualWorkspace} from "./workspace"
import {Widget} from "./widget"

declare var MyApp: any;

export class WebView{
    
    constructor() {

    }

    public insertWidget = (widget: Widget) => {
        let widgetWrapperData = {
            id : widget.id,
            posX: widget.posX,
            posY: widget.posY,
            width: widget.width,
            height: widget.height
        };
        console.log(widgetWrapperData);
        let wrapperHtml = MyApp.templates.widgetWrapper(widgetWrapperData);
        let widgetHtml = MyApp.templates.index();
        console.log(widgetHtml);
        // $("#frontend-container").appendTo(wrapperHtml);
        // $("div[data-widget-id="+widget.id+"]").appendTo(widgetHtml);
        $(wrapperHtml).appendTo("#frontend-container");
        $(widgetHtml).appendTo("div[data-widget-id="+widget.id+"]");
        
        $("div[data-widget-id="+widget.id+"]").draggable();
    }
}