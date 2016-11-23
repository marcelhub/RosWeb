/// <reference path="./typings/tsd.d.ts" />

import { ROSEvent } from "./services/rosEvent";


function init() {
  $(document).ready(function () {
    let ros: ROSLIB.Ros = new ROSLIB.Ros("");
    let rosEvents: ROSEvent = new ROSEvent(ros);
  });
}

init();