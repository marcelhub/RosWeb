

var KEYBOARDTEL = KEYBOARDTEL || {
  REVISION : '0.1.0'
};

KEYBOARDTEL.Teleop = function(options) {
  var that = this;
  var counter = 0;
  options = options || {};
  var ros = options.ros;
  var topic = options.topic;
  // permanent throttle
  var throttle = options.throttle || 1.0;

  // used to externally throttle the speed (e.g., from a slider)
  this.scale = 1.0;

  // linear x and y movement and angular z movement
  var x = 0;
  var y = 0;
  var z = 0;

  var cmdVel = new ROSLIB.Topic({
    ros : ros,
    name : topic,
    messageType : 'sensor_msgs/Joy'
  });

  // sets up a key listener on the page used for keyboard teleoperation
  var handleKey = function(keyCode, keyDown) {
    // used to check for changes in speed
    var oldX = x;
    var oldY = y;
    var oldZ = z;
    
    var pub = true;

    var speed = 0;
    // throttle the speed by the slider and throttle constant
    if (keyDown === true) {
      speed = throttle * that.scale;
    }
    // check which key was pressed
    switch (keyCode) {
      case 65:
        // turn left
        z = 1 * speed;
        break;
      case 87:
        // up
        x = 1 * speed;
        break;
      case 68:
        // turn right
        z = -1 * speed;
        break;
      case 83:
        // down
        x = -1 * speed;
        break;
      case 69:
        // strafe right
        y = -0.5 * speed;
        break;
      case 81:
        // strafe left
        y = 0.5 * speed;
        break;
      default:
        pub = false;
    }

    // publish the command
    if (pub === true) {
      var twist = new ROSLIB.Message({
        header : {
        seq : counter++,
        stamp : {
            secs: parseInt(Date.now()/1000),
            nsecs: parseInt(Date.now()/1000)
        },
        frame_id : ''
        },
        axes : [x < 0.0  ? z * (-1) : z,x,-1,0,0,-1,0,0],
        buttons : [1,0,0,0,0,0,0,0,0,0,0]
      });
      cmdVel.publish(twist);
      // check for changes
      if (oldX !== x || oldY !== y || oldZ !== z) {
        that.emit('change', twist);
      }
    }
  };

  // handle the key
  var body = document.getElementsByTagName('body')[0];
  body.addEventListener('keydown', function(e) {
    handleKey(e.keyCode, true);
  }, false);
  body.addEventListener('keyup', function(e) {
    handleKey(e.keyCode, false);
  }, false);
};
KEYBOARDTEL.Teleop.prototype.__proto__ = EventEmitter2.prototype;
