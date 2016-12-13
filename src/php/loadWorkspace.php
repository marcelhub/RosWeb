<?php
    if(isset($_POST['workspace'])) {
        $workspaceName = $_POST['workspace'];
        $workspacePath = substr(__DIR__, 0, -7).'data/workspaces/';
        $workspace = file_get_contents($workspacePath.$workspaceName.".json");
        $workspaceSerialized = json_encode($workspace);  
        echo $workspaceSerialized;
    } else {
        echo "error loading workspace!";  
    }
?>