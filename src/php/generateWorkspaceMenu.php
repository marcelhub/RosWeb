<?php
    $workspacePath = substr(__DIR__, 0, -7).'data/workspaces/';
    $workspaces = scandir($workspacePath);
    //removes . and .. from linux folders (if running on linux)
    $workspaces = array_diff($workspaces, array(".", ".."));

    //remove .json fileendings
    $workspaces = str_replace(".json","",$workspaces);
    $workspacesSerialized = json_encode($workspaces);
    echo $workspacesSerialized; 
?>