/// <reference path="./typings/tsd.d.ts" />

import {ROSEvent} from "./services/rosEvent"
import {WebView} from "./models/webView"
import {Widget} from "./models/widget"
import {Workspace} from "./models/workspace"
import {WorkspaceContainer} from "./models/workspaceContainer"
import {actualWorkspace} from "./models/workspace"

function init() {
  $(document).ready(function () {
    let ros: ROSLIB.Ros = new ROSLIB.Ros("");
    let rosEvents: ROSEvent = new ROSEvent(ros);
    actualWorkspace;
  });
}

init();