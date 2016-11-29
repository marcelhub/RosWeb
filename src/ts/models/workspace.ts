import {WebView} from "./webView"
import {Widget} from "./widget"


export class Workspace {
    public rosMasterAdress: string;
    public name: string;
    public id: number;
    public widgets: Array<Widget>;

    constructor() {
        this.widgets = new Array();
    }

    public DelegateEvent(selector: string | Document | Window, event: string, method: () => void) {
        if (event == "resize") {
            $(selector).resize(method);
        }
            $(document).delegate(selector, event, method);
    }

    public createWidget = (topicUrl:string, topicType: string, viewImplType?: string) => {
        console.log(topicUrl +" --- "+topicType);
        
    }
}

export function fnctCreateWidget(topicUrl: string, topicType: string) {
    actualWorkspace.createWidget(topicUrl, topicType);
}


export let actualWorkspace: Workspace = new Workspace();