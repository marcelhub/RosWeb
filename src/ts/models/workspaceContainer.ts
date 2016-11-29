import {Workspace} from "./workspace"

export class WorkspaceContainer {

    public workspaces: Workspace[];

    constructor() {
        this.workspaces = new Array<Workspace>();
    }
}

export let workspaceContainer: WorkspaceContainer = new WorkspaceContainer();