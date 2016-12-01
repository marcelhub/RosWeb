/// <reference path="../typings/tsd.d.ts" />

import {ROSEvent} from "./rosEvent"

export class WidgetEvents {
    
    public ros: ROSLIB.Ros;

    constructor() {
        this.ros = ROSEvent.getInstance();
        // this.DelegateEvent("jsWidgetInsert");
    }

    public DelegateEvent(selector: string | Document | Window, event: string, method: () => void) {
        if (event == "resize") {
            $(selector).resize(method);
        }
        $(document).delegate(selector, event, method);
    }


}