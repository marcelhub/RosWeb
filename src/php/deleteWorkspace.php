<?php
    if(isset($_POST['workspace'])) {
        $json = $_POST['workspace'];
        $workspacePath = substr(__DIR__, 0, -7).'data/workspaces/';
        if(!unlink($workspacePath.$json.".json")) {
            echo "error deleting workspace!";
        }
    } else {
        echo "error deleting workspace!";  
    }
?>