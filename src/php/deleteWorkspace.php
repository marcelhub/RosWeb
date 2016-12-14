<?php
    if(isset($_POST['workspace'])) {
        $json = $_POST['workspace'];
        $data = json_decode($json);
        $workspacePath = substr(__DIR__, 0, -7).'data/workspaces/';
        if(!unlink($workspacePath.$data->name.".json")) {
            echo "error deleting workspace!";
        }
    } else {
        echo "error deleting workspace!";  
    }
?>