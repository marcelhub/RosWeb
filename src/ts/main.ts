/// <reference path="./typings/tsd.d.ts" />

import { ROSEvent } from "./events/rosEvent";

function init() {
  $(document).ready(function () {
    let ros: ROSLIB.Ros = new ROSLIB.Ros("");
    //window["ros"] = ros;
    let rosEvents: ROSEvent = new ROSEvent(ros);
  });
}

init();