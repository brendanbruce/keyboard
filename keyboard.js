$(document).ready(function(){
  var playStart = false;

  // Define rotator params
  var rotator = {
    minRotate: "0deg",
    maxRotate: "90deg",
    minGain: 0,
    maxGain: 1,
    currentGain: 0
  };

  // Define rotator interaction
  $("#dial").on("mousedown", function(){
    var width = $(this).width();
    var mousePos = event.pageX - $(this).offset().left;
    var percentSection = mousePos / width;
    var degrees = percentSection * 180;
    var gain = percentSection;

    console.log(degrees);
    console.log(gain);

    var degPosition = "translateY(-50%) rotate(" + degrees + "deg)";
    rotator.currentGain = gain;

    $(".rotator-line").css("transform", degPosition);
  });
  
  // Define audio
  var context = new window.AudioContext();
  var osc = context.createOscillator();
  osc.type = "sine";

  var synthGain = context.createGain();
  synthGain.gain.value = 0;

  osc.connect(synthGain);
  synthGain.connect(context.destination);

  var notes = {
    c4: 261.63,
    csharp4: 277.18,
    d4: 293.66,
    dsharp4: 311.13,
    e4: 329.63,
    f4: 349.23,
    fsharp4: 369.99,
    g4: 392.00,
    gsharp4: 415.30,
    a4: 440.00,
    asharp4: 466.16,
    b4: 493.88,
  };

  $.each(notes, function(index, value){
    
    var note = ("#note-" + index);
    
    $(note).on("mousedown", function(){
      if (playStart == false) {
        osc.start();
        playStart = true;
      }
        synthGain.gain.value = rotator.currentGain;
        osc.frequency.value = value;
    });

    $(note).on("mouseup", function(){
      synthGain.gain.value = 0;
    });
  });

  $(".rotator-box").on("click", function(){
    if (osc.playing) {
      context.suspend();
    }
    else {
      context.resume();
    }
  });

  $(".waveform .waveform__type").on("click", function(event) {
    var waveType = event.currentTarget.id;
    clearClass(waveType);    
    osc.type = waveType;
  });

  var clearClass = function(waveType) {
    var activeElement = $("#" + waveType);
    console.log(activeElement);
    $(".waveform .waveform__type").removeClass("waveform__type--active");
    activeElement.addClass("waveform__type--active");
  }
});