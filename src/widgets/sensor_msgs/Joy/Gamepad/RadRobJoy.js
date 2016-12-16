var seqCounter = 0;
var disconnected = false;
var joyPad;

var ros = new ROSLIB.Ros({
  url : 'ws://192.168.1.97:9090'
});

var joyTopic = new ROSLIB.Topic({
  ros : ros,
  name : '/joy',
  messageType : 'sensor_msgs/Joy',
});

//waits for connecting gamepads, event triggered when connected or any button pressed 1st time
window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s", e.gamepad.index, e.gamepad.id);
  document.getElementById("joypad-info").innerHTML = e.gamepad.id;
  var gp = navigator.getGamepads()[e.gamepad.index];
  teleopLoop();
  setInterval(teleopLoop, 100);
});

window.addEventListener("gamepaddisconnected", function(e) {
  console.log("Gamepad disconnected from index %d: %s",
    e.gamepad.index, e.gamepad.id);
    document.getElementById("joypad-info").innerHTML = '';
});

function teleopLoop() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
  if (!gamepads) {
    return;
  }
  joyPad = gamepads[0];
  var buttonValues = new Array();
  for(var i = 0; i < joyPad.buttons.length; i++) {
    buttonValues.push(joyPad.buttons[i].value);
  }
  if(deadzoneExceeded(0.3)) {
    var axesValues = new Array();
    AxesValuesWithDeadzone(axesValues, 0.3);
    var joyMsg = new ROSLIB.Message({
      header : {
        seq : seqCounter,
        stamp : {
          secs: Date.now()/1000,
          nsecs: 729812849
        },
        frame_id : ''
      },
      axes : axesValues,
      buttons : buttonValues
    });
    seqCounter++;
    joyTopic.publish(joyMsg);
  } else {
    var joyMsg = new ROSLIB.Message({
      header : {
        seq : seqCounter,
        stamp : {
          secs: Date.now()/1000,
          nsecs: 729812849
        },
        frame_id : ''
      },
      axes : [0.0, 0.0, 0.0, 0.0],
      buttons : buttonValues
    });
    seqCounter++;
    joyTopic.publish(joyMsg);
  }
}

//deadzoneValue has to be between 0.0 and 1.0
function deadzoneExceeded(deadzoneValue) {
  for(var i = 0; i < joyPad.axes.length; i++) {
    if(Math.abs(joyPad.axes[i]) >= deadzoneValue) {
      return true;
    }
  }
  return false;
}

//Scales axes with deadzone as an offset
function AxesValuesWithDeadzone(values, deadzoneValue) {
  for(var i = 0; i < joyPad.axes.length; i++) {
    if(Math.abs(joyPad.axes[i]) < deadzoneValue) {
      values.push(0.0);
    } else {
      values.push(Math.sign(joyPad.axes[i]) * (Math.abs(joyPad.axes[i]) - deadzoneValue) / (1 - deadzoneValue));
    }
  }
  values[0] *= -1;
  values[1] *= -1;
}
