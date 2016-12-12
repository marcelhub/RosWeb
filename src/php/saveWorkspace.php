<?php
    if(isset($_POST['workspace'])) {
        $json = $_POST['workspace'];
        $workspacePath = substr(__DIR__, 0, -7).'data/workspaces/';
        file_put_contents($workspacePath.'filename.json', 'hello');
        echo getcwd();
    } else {
        echo "error saving workspace";
    }
?>