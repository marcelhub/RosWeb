/// <reference path="../typings/tsd.d.ts" />

export class ROSSystem {

    public ros: ROSLIB.Ros;
    public connected: boolean=false;
    
    constructor() {
        //this.workspace = new Workspace();
    }

    //public workspace: Workspace;
}