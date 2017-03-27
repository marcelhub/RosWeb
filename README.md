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
- VS Code starten, dann "File > Open Folder... >" und Projektordner auswählen
- Widget hinzufügen
- Buildprozess in VS Code starten: `ctrl+shift+b`  
  gulp führt den Buildprozess gemäß den Einstellungen aus "gulpfile.js" durch
