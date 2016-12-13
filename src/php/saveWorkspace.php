<?php
    if(isset($_POST['workspace'])) {
        $json = $_POST['workspace'];
        $data = json_decode($json);
        $workspacePath = substr(__DIR__, 0, -7).'data/workspaces/';
        file_put_contents($workspacePath.$data->name.".json", $json);  
        echo $json;
    } else {
        echo "error saving workspace!";  
    }
?>