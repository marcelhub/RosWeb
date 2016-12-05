import {actualWorkspace} from "./workspace"
import {Widget} from "./widget"

declare var MyApp: any;

export class WebView{
    private _widgetHeaderOffset = 50;
    constructor() {

    }

    public insertWidget = (widget: Widget) => {
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
        let wrapperHtml = MyApp.templates.widgetWrapper(widgetWrapperData);
        let widgetTemplateCompiled  = Handlebars.compile(widget.html);
        let widgetHtml = widgetTemplateCompiled({});
        $(wrapperHtml).appendTo("#frontend-container");
        $(widgetHtml).appendTo("div[data-widget-id="+widget.id+"]");
        $("div[data-widget-id="+widget.id+"]").draggable();
    }
}