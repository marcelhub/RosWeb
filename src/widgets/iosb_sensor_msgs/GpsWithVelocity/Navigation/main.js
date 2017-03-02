

function Navigation(id, ros, topic, type, implementation) {
    this.id = id;
    this.ros = ros;
    this.topic = topic;
    this.type = type;
    this.implementation = implementation;

    this.settings = {};

    return this;
}
 
Navigation.prototype = {
    init: function() {
        return this;
    },
    run: function() {
        initialize(this);
        resizing(this);
    },
    load: function(settings) {
      
        return this;
    },
    save: function(widget) {

    },
    btnSettings: function(widget) {
    },
    btnRemove: function(widget) {
    },

    btnSettingsSave: function(widget) {

    },
    resizable: function() {
        var self = this;
        $("div[data-widget-id="+this.id+"]").resizable();
        $("div[data-widget-id="+this.id+"]").resize(function() {
            resizing(self);
            if(map != null) {
                map.invalidateSize();
            }
        });
    }
};

var map_server = '192.168.3.101:8080/geoserver/wms';
var osrm_server = '192.168.3.101:5001';
var ros = null;
var listener = null;
var routeListener = null;
var map = null;
var robot_marker = null;
var robot_icon = null; // icon becomes part of the marker
var zooming = false;
var drawLayerGroup = null;
var routeLayerGroup = null;
var currentRouteLayer = null;
var latchedRoute = null;
var viewer = null;
var toggleControl = null;
var routeName = null;
var velocity_heading =null;
var current_velocity = null;
var route_publisher = null;
var mission_publisher = null;

var polylineOptions = {
    icon: new L.DivIcon({
    iconSize: new L.Point(12, 12),
    className: 'leaflet-div-icon leaflet-editing-icon'
    }),
    color: '#ff0000',
    opacity: 0.75
};

var latchedPolylineOptions = {
    icon: new L.DivIcon({
    iconSize: new L.Point(12, 12),
    className: 'leaflet-div-icon leaflet-editing-icon'
    }),
    color: '#0000ff',
    opacity: 0.75
};

var ros_route = {
    header: {
    seq: 0,
    stamp: {
        secs: 0,
        nsecs: 0
    },
    frame_id: ''
    },
    mission_type: 0,
    route_id: 0,
    waypoints: []
};

var routeArray = {
    header: {
    seq: 0,
    stamp: {
        secs: 0,
        nsecs: 0
    },
    frame_id: "/wgs84"
    },
    routes: [{
    header: {
        seq: 0,
        stamp: {
        secs: 0,
        nsecs: 0
        },
        frame_id: ''
    },
    mission_type: 0,
    route_id: 0,
    waypoints: []
    }]
};

var mission = {
    header: {
    seq: 0,
    stamp: {
        secs: 0,
        nsecs: 0,
    },
    frame_id: '',
    },
    missionId: 1,
    commandType: "run"
};

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;
    for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function gps_callback(message) {
    $("#lat").html(sprintf("%0.6f", message.latitude));
    $("#lon").html(sprintf("%0.6f", message.longitude));

    if (robot_marker == null) {
    robot_marker = L.marker([message.latitude, message.longitude], {
        icon: robot_icon
    }).addTo(map);
    map = map.setView([message.latitude, message.longitude]);
    } else {
    if (!zooming) {
        robot_marker.setLatLng([message.latitude, message.longitude]);
        $("#robot").css("-webkit-transform", "rotate(" + message.track + "deg)");
        $("#robot").css("-moz-transform", "rotate(" + message.track + "deg)");
        {
        map = map.panTo([message.latitude, message.longitude], {
            animate: false
        });
        }
    }
    }
}

function gps_velocity_callback(message) {
    velocity_heading = ((Math.atan2(message.velocity.vector.y, message.velocity.vector.x)) * 180/Math.PI);

    if (Math.abs(current_velocity) > 0.1) {
        $("#heading").html(sprintf("%.2f", velocity_heading));
        robot_marker.setRotationAngle(velocity_heading);
    }
    $("#lat").html(sprintf("%0.6f", message.fix.latitude));
    $("#lon").html(sprintf("%0.6f", message.fix.longitude));

    if (robot_marker == null) {
        robot_marker = L.marker([message.fix.latitude, message.fix.longitude], {
        rotationAngle: velocity_heading,
            icon: robot_icon
    }).addTo(map);
    map = map.setView([message.fix.latitude, message.fix.longitude]);
    } else {
        if (!zooming) {
            robot_marker.setLatLng([message.fix.latitude, message.fix.longitude]);
            map = map.panTo([message.fix.latitude, message.fix.longitude], {animate: false});
        }
    }
}

function route_callback(message) {
    showLatchedRoute(message);
}

function velocity_callback(message) {
    current_velocity = message.omega[0];
}

function buildRoute(rt, points) {
    rt.waypoints = [];
    for (var i = 0; i < points.length; i++) {
    waypoint = {
        header: {
        seq: 0,
        stamp: {
            secs: 0,
            nsecs: 0,
        },
        frame_id: ''
        },
        name: '',
        id: 0,
        wpLat: points[i].lat,
        wpLon: points[i].lng,
        wpX: 0.0,
        wpY: 0.0,
        wpZ: 0.0,
        goalSpeed: 0.0,
        maxSpeed: 0.0,
        curvature: 0.0,
        checkPoint: false
    };
    rt.waypoints.push(waypoint);
    }
}

function buildRouteArray(idx, points) {
    buildRoute(routeArray.routes[idx], points)
}

function executeMission() {
    var query_service = new ROSLIB.Service({
        ros: ros,
        name: '/route_manager/set_route', // topic name
        serviceType: 'route_manager/SetRoute', // service type
    });
    buildRoute(ros_route, currentRouteLayer.getLatLngs());
    var request = new ROSLIB.ServiceRequest({
        route: ros_route
    });
    query_service.callService(request, function(result) {
        console.log('executeMission done');
    });
}

function resendRoute() {
    var query_service = new ROSLIB.Service({
        ros: ros,
        name: '/route_manager/resend_route', // topic name
        serviceType: 'std_srvs/Empty', // service type
    });
    var request = new ROSLIB.ServiceRequest({});
    query_service.callService(request, function(result) {
        console.log('resendRoute done');
    });
}

function stopMission() {
    var query_service = new ROSLIB.Service({
        ros: ros,
        name: '/route_manager/set_route', // topic name
        serviceType: 'route_manager/SetRoute', // service type
    });
    buildRoute(ros_route, []);
    var request = new ROSLIB.ServiceRequest({
        route: ros_route
    });
    query_service.callService(request, function(result) {
        console.log('stopMission done');
    });
}

function saveRoute() {
    if (currentRouteLayer == null) {
        window.alert("There is no route!");
    } else {
        $('#saveModal').on('shown.bs.modal', function() {
            $('#saveRouteName').focus();
        });
        routeName = $("#routeName").html()
        if (routeName != "Untitled") {
            $("#saveRouteName").val(routeName);
        }
        $('#saveModal').modal('show');
    }
}

function loadRoute() {
    var query_service = new ROSLIB.Service({
        ros: ros,
        name: '/route_manager/query_routes',
        serviceType: 'route_manager/QueryRoutes'
    });
    var request = new ROSLIB.ServiceRequest();
    query_service.callService(request, function(result) {
        console.log('Available Routes: ', result.filenames)
        loadRouteDialog(result.filenames)
    });
}

function deleteRoute() {
    var query_service = new ROSLIB.Service({
        ros: ros,
        name: '/comms_protocol/web/route_manager/query_routes',
        serviceType: 'route_manager/QueryRoutes'
    });
    var request = new ROSLIB.ServiceRequest();
    query_service.callService(request, function(result) {
        deleteRouteDialog(result.names)
    });
}

function showRoute(route) {
    waypoints = route.waypoints;
    latlngs = [];
    for (i = 0; i < waypoints.length; i++) {
        latlngs.push(new L.latLng(waypoints[i].wpLat, waypoints[i].wpLon));
    }
    var polyline = L.polyline(latlngs, polylineOptions);
    if (currentRouteLayer != null) {
        drawLayerGroup.removeLayer(currentRouteLayer);
    }
    drawLayerGroup.addLayer(polyline)
    currentRouteLayer = polyline;
    drawLayerGroup.bringToFront();
}

function showLatchedRoute(route) {
    waypoints = route.waypoints;
    latlngs = [];
    for (i = 0; i < waypoints.length; i++) {
        latlngs.push(new L.latLng(waypoints[i].wpLat, waypoints[i].wpLon));
    }

    if (latchedRoute != null) {
        routeLayerGroup.removeLayer(latchedRoute.decorator);
        routeLayerGroup.removeLayer(latchedRoute);
    }
    var polyline = L.polyline(latlngs, latchedPolylineOptions);
    polyline.decorator = L.polylineDecorator(polyline, {
    patterns: [{
        offset: '50px',
        repeat: '100px',
        symbol: new L.Symbol.ArrowHead({
        pixelSize: 25,
        polygon: false,
        pathOptions: {
            color: polyline.options.color,
            opacity: polyline.options.opacity,
            stroke: true
        }
        })
    }]
    });
    routeLayerGroup.addLayer(polyline);
    routeLayerGroup.addLayer(polyline.decorator);
    latchedRoute = polyline;
}

function loadRouteByName(routename) {
    var load_service = new ROSLIB.Service({
        ros: ros,
        name: '/route_manager/load_route',
        serviceType: 'route_manager/LoadRoute'
    });
    var request = new ROSLIB.ServiceRequest({
        filename: new ROSLIB.Message({
            data: routename
        })
    });
    load_service.callService(request, function(result) {
        showRoute(result.route)
    });
    $('#loadModal').modal('hide');
    $("#routeName").html(routename);
    $("#routeSaved").html("");
}

function loadRouteDialog(result) {
    var menu = $("#loadRouteMenu");
    menu.html("")
    for (i = 0; i < result.length; i++) {
        var name = result[i];
        var item = $("<a class='list-group-item route-list-item'></a>").on("click", function() {
            loadRouteByName($(this).data("name"))
        }).html(name);
        item.data("name", name);
        menu.append(item);
    }
    $('#loadModal').modal('show');
}

function deleteRouteByName(route) {
    var delete_service = new ROSLIB.Service({
        ros: ros,
        name: '/comms_protocol/web/route_manager/delete_route',
        serviceType: 'route_manager/DeleteRoute'
    });
    var request = new ROSLIB.ServiceRequest({
        name: new ROSLIB.Message({data: route})
    });
    delete_service.callService(request, function(result) {});
    $('#deleteModal').modal('hide');
}

function deleteRouteDialog(result) {
    var menu = $("#deleteRouteMenu");
    menu.html("");
    for (i = 0; i < result.length; i++) {
        var name = result[i].data;
        var item = $("<a class='list-group-item route-list-item'></a>").on("click", function() {
            deleteRouteByName($(this).data("name"))}).html(name);
        item.data("name", name);
        menu.append(item);
    }
    $('#deleteModal').modal('show');
}

function saveRouteService() {
    if (currentRouteLayer != null) {
    var name = $("#saveRouteName").val();
    if (!name) {
        name = "route";
    }

    var save_service = new ROSLIB.Service({
        ros: ros,
        name: '/route_manager/save_route', // topic name
        serviceType: 'route_manager/SaveRoute'
    });
    buildRoute(ros_route, currentRouteLayer.getLatLngs());
    var request = new ROSLIB.ServiceRequest({
        filename: new ROSLIB.Message({
        data: name
        }),
        route: ros_route
    });
    save_service.callService(request, function(result) {});
    $("#routeName").html(name);
    $("#routeSaved").html("");
    $('#saveModal').modal('hide');
    $("#saveRouteName").val("");
    }
}

function onZoomStart() {
    zooming = true;
}

function onZoomEnd() {
    zooming = false;
}

function onDragStart() {

}

function onMapClick(e) {
    
}

function parseResponse(data) {
    console.log(data);
}

function onDrawCreated(e) {
    var type = e.layerType,
    layer = e.layer;
    if (type == "polyline") {
        if (currentRouteLayer != null) {
            drawLayerGroup.removeLayer(currentRouteLayer);
        }
        drawLayerGroup.addLayer(layer);
        currentRouteLayer = layer;
        self.routeName = null;
        $("#routeName").html("Untitled");
        $("#routeSaved").html("&lt;Unsaved&gt;");
    }
    if (type == "marker") {
        var start = [];
        var start_lnglat = "";
        if (robot_marker != null) {
            start = robot_marker.getLatLng();
            start_lnglat = start.lng + ',' + start.lat;
        }
        else {
            start = [50.365157653880395, 7.563695311546326];
            start_lnglat = start[1]+','+start[0];
        }
        end_lnglat = e.layer.getLatLng().lng + ',' + e.layer.getLatLng().lat;
        var url = 'http://'+osrm_server+'/route/v1/driving/' + start_lnglat + ';' + end_lnglat + '?steps=false&geometries=geojson&overview=full';
        if (url) {
            $.ajax({
                url: url,
                jsonpCallback: 'parseResponse',
                dataType: 'text/javascript',
                success: function(data) {

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    response = jqXHR.responseText;
                    var jsonData = JSON.parse(response);
                    waypoints = [];
                    for (var i = 0; i < jsonData.routes.length; i++) {
                    jsonroute = jsonData.routes[i];
                    for (var j = 0; j < jsonroute.geometry.coordinates.length; j++) {
                        var wp = {};
                        var coord = jsonroute.geometry.coordinates[j];
                        wp.lng = coord[0];
                        wp.lat = coord[1];
                        waypoints.push(wp);
                    }
                    buildRoute(ros_route, waypoints);
                    showRoute(ros_route);
                    }
                    return 0;
                }
            });
        }
    }
}

function onDrawEdited(e) {
    $("#routeSaved").html("&lt;Unsaved&gt;");
}

function onDrawDeleted(e) {
    currentRouteLayer = null;
}

function onReverse(e) {
    if (currentRouteLayer != null) {
        points = currentRouteLayer.getLatLngs();
        points.reverse();
        currentRouteLayer.setLatLngs(points);
        $("#routeSaved").html("&lt;Unsaved&gt;");
    }
}

function initialize() {
    var show_control = getUrlParameter('control');
    if (show_control != "yes") {
        // $("#btnExecuteMission").prop("disabled",true);
        $("#btnExecuteMission").hide();
        $("#btnResendRoute").hide();
        $("#btnStopMission").hide();
    }

    robot_icon = L.icon({
        iconUrl: 'map/robot_icon.png',
        iconSize: [48, 48],
        iconAnchor: [24, 24]
    });

    racing_flag_icon = L.icon({
        iconUrl: 'map/racing_flag.png',
        iconSize: [48, 48],
        iconAnchor: [24, 24]
    });

    map = L.map('map').setView([50.3644, 7.5644], 18);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    var wtd41_ko = L.tileLayer.wms('http://' + map_server, {
        layers: 'bwrobotik:DEU_WTD41_AST_Koblenz_COL_20cm_06-05-2011',
        format: 'image/png',
        transparent: true
    }).addTo(map);

    var schmidtenhoehe_ko = L.tileLayer.wms('http://' + map_server, {
        layers: 'bwrobotik:StOUebPl_Schmidtenhoehe',
        format: 'image/png',
        transparent: true
    }).addTo(map);
    var popup = L.popup();

    map.on('click', onMapClick);
    map.on('zoomstart', onZoomStart);
    map.on('zoomend', onZoomEnd);
    map.on('dragstart', onDragStart);

    drawLayerGroup = new L.FeatureGroup();
    map.addLayer(drawLayerGroup);

    routeLayerGroup = new L.LayerGroup();
    map.addLayer(routeLayerGroup);

    // Small route edit and goal set buttons on map
    var drawControl = new L.Control.Draw({
    draw: {
            polygon: false,
            rectangle: false,
            circle: false,
            marker: {
            icon: racing_flag_icon
            },
            polyline: {
            metric: true,
            shapeOptions: polylineOptions
            },
        },
        edit: {
            featureGroup: drawLayerGroup,
            edit: {
                selectedPathOptions: {
                    color: '#0000ee'
                }
            }
        }
    });
    map.addControl(drawControl);
    L.control.scale().addTo(map);

    map.on('draw:created', onDrawCreated);
    map.on('draw:edited', onDrawEdited);
    map.on('draw:deleted', onDrawDeleted);
    
    ros = new ROSLIB.Ros({
        url: 'ws://192.168.3.100:8082'
    });

    ros.on('connection', function() {
        console.log('Connected to websocket server.');
    });

    ros.on('error', function(error) {
        console.log('Error connecting to websocket server: ', error);
    });

    ros.on('close', function() {
        console.log('Connection to websocket server closed.');
    });

    listener = new ROSLIB.Topic({
        ros: ros,
        name: '/xsens_mtig_700/gps',
        messageType: 'iosb_sensor_msgs/GpsWithVelocity'
    });
    listener.subscribe(gps_velocity_callback);

    routeListener = new ROSLIB.Topic({
        ros: ros,
        name: '/route_manager/executed_route',
        messageType: 'route_manager/Route'
    });
    routeListener.subscribe(route_callback);

    velocityListener = new ROSLIB.Topic({
        ros: ros,
        name: '/wheel_encoder/wheel_rotation',
        messageType: 'iosb_wheel_encoder/WheelRotation'
    });
    velocityListener.subscribe(velocity_callback);

    route_publisher = new ROSLIB.Topic({
        ros: ros,
        name: '/comms_protocol/web/ocu_route',
        messageType: 'route_manager/RouteArray'
    });

    mission_publisher = new ROSLIB.Topic({
        ros: ros,
        name: '/path_planning/mission_command',
        messageType: 'route_manager/MissionCommand'
    });

    $("#saveRouteName").keyup(function(event) {
        if (event.which == 13) {
            saveRouteService();
        }
    });

    $('#map').css("height", (800));
    $('#map').css("width", (640*0.75));
    $('#map').css("margin", 1);
    $('#map').css("padding", 1);
    $('#bs-map-menu-container').css("margin", 1);
    map.invalidateSize();
}

function resizing(obj) {
    var height = $("div[data-widget-id="+obj.id+"]").height();
    var width = $("div[data-widget-id="+obj.id+"]").width();
    $('#bs-map-container').height(height);
    $('#bs-map-container').width(width);
    $('#bs-map-menu-container').css("height", height-50);
    $('#bs-map-menu-container').css("width", width*0.25-30);
    $('#map').css("height", height-50);
    $('#map').css("width", width*0.75);
    map.invalidateSize();
}
    
      