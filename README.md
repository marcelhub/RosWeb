# Installation generic_webgui (inklusive IDE Visual Studio Code)
### Repository klonen
- Kommando innerhalb des gewünschten Projektpfades auf dem Terminal ausführen  
`git clone git@gitlab.bwrobotik.selfhost.de:bwrobotik/ocu_generic_webgui.git`  
`git clone https://github.com/marcelhub/ros_generic_web.git`

### Webserver inkl. PHP installieren (Apache2 als Beispiel)
- Installation Apache2:  
  `sudo apt-get install apache2`

- Installation PHP7.0 für Apache2:  
  `sudo apt-get install php7.0 libapache2-mod-php7.0`  
  Apache2 verwendet um PHP-Skripte auszuführen standardmäßig die Gruppe "www-data".  
  Um Workspaces speichern zu können muss die entsprechende Gruppe Lese-/Schreibrechte auf den Ordner "data/workspaces" haben.  
  Hiermit wird "www-data" Eigentümer des Ordners "data/workspaces"  
  `sudo chgrp -R www-data <Projektpfad>/data/workspaces`
- Symbolischen Link zum Projekt erstellen:  
  `sudo ln -s <lokaler Projektpfad> <Webserver-Rootpfad+Bezeichnung des Links>`  
  Beispiel:  
  `sudo ln -s /home/mhuber/proj/generic_webgui /var/www/html/generic_webgui `

- Webseite sollte nun über `localhost/generic_webgui/src` im Browser erreichbar sein


### Projekt mit Visual Studio Code entwickeln (nur zu Entwicklungszwecken!)
- VS Code installieren:  
  https://code.visualstudio.com/docs/setup/linux  
  oder über .deb Paket installieren:  
  https://code.visualstudio.com/docs/?dv=linux64_deb
- `sudo apt install npm`
- `sudo npm install -g gulp`
- `sudo ln -s /usr/bin/nodejs /usr/bin/node`
- VS Code starten, dann "File > Open Folder... >" und Projektordner auswählen
- Änderungen vornehmen
- Buildprozess in VS Code starten: `ctrl+shift+b`  
  gulp führt den Buildprozess gemäß den Einstellungen aus "gulpfile.js" durch

### Neues Widget erstellen  
Um ein neues, an ein Messagetyp gebundenes Widget zu implementieren ist hierfür ein eigener Ordner unter „src/widgets/<ROS-Paket>/<ROS-Messagetyp>/<Neuer Ordner>“ anzulegen. Der Name der Ordner entspricht dem ROS-Messagetyp und dessen ROS-Paket. Der Ordner (<Neuer Ordner>) entspricht dem Namen, den auch die JavaScript-Klasse hat die man innerhalb der main.js definiert. (Beispiel: „src/widgets/sensor_msgs/Joy/Gamepad“). Um ein neues, an ein Messagetyp gebundenes Widget zu implementieren müssen folgende Schritte beachtet werden:  

- Innerhalb des neuen Ordners müssen die Dateien index.hbs, settings.hbs und main.js abgelegt werden. Exemplarisch kann man sich hier an den bereits vorhandenen Widgets orientieren.  
- In der Datei „rosEvents.ts“ (zu finden unter „src/ts/services“) muss das Array topicTypes um den entsprechenden Messagetyp erweitert werden (sofern der Typ nicht bereits vorhanden ist)  
- In der Datei „rosEvents.ts“ muss die Map typesWithViews um die neue Klasse des Widgets erweitert werden. Eine Map besteht aus Key-Value-Pairs. Bei dieser Map entspricht der Key dem Messagetyp, das Value ist ein Array das die Klassen bzw. die Ordner namentlich beschreibt.  
- Nun den Buildprozess starten. Hierzu am einfachsten Visual Studio Code verwenden, da die entsprechenden config-Dateien bereits vorhanden sind.  
- Das neu implementierte Widget sollte nun im Menü auftauchen, sofern das ROS-System den verwendeten Messagetyp unterstützt. Nicht unterstützte Typen werden im Menü nicht angezeigt.


Um ein neues, nicht an ein Messagetyp gebundenes Widget zu implementieren ist ein neuer Ordner anzulegen. Dieser Ordner wird unter „src/widgets/<Neuer Ordner>“ erstellt. Anschließend sind folgende Schritte notwendig:  

- Innerhalb des neuen Ordners müssen die Dateien index.hbs, settings.hbs und main.js abgelegt werden. Exemplarisch kann man sich hier an dem bereits vorhandenen Widget „Webcam“ orientieren.  
- Das Menü muss angepasst werden, welches unter „src/templates/menu.hbs“ zu finden ist. Als Beispiel kann der dort bestehende Code für die Webcam verwendet werden.  
- Nun den Buildprozess starten. Hierzu am einfachsten Visual Studio Code verwenden, da die entsprechenden config-Dateien bereits vorhanden sind.  
- Das Menü sollte nun einen neuen Eintrag anzeigen.
