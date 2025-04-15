var w = $(window).width();
var h = $(window).height();
var linkBody = "https://enyajpan.github.io/";
var links = {
  "xxx": {
    "number": "00",
    "name": "xxx",
    "author": "xxx",
    "bio": "xxx",
  },
  "xxx": {
    "number": "00",
    "name": "xxx",
    "author": "xxx",
    "bio": "xxx",
  },
  "xxx": {
    "number": "00",
    "name": "xxx",
    "author": "xxx",
    "bio": "xxx",
  },
  "xxx": {
    "number": "00",
    "name": "xxx",
    "author": "xxx",
    "bio": "xxx",
  }, 
  "xxx": {
    "number": "00",
    "name": "xxx",
    "author": "xxx",
    "bio": "xxx",
  }, 
  "xxx": {
    "number": "00",
    "name": "xxx",
    "author": "xxx",
    "bio": "xxx",
  }, 
  "xxx": {
    "number": "00",
    "name": "xxx",
    "author": "xxx",
  }, 
  "xxx": {
    "number": "00",
    "name": "xxx",
    "author": "xxx",
  }, 

  "xxx": {
    "number": "00",
    "name": "xxx",
    "author": "xxx",
  }
}

var volume;
var synth;
var notes;




var tv;
var th;

$(document).ready(function(event){
  makeLinks();
  tv = setInterval(rotateVertical, 1000);
  th = setInterval(rotateHorizontal, 1200);

  Tone.Master.mute = localStorage.getItem('mute') == 'true' ? true : false;
  let text = Tone.Master.mute ? "SOUND ON" : "MUTE";
  $("#mute-btn").text(text);

  if ( window.location !== window.parent.location ) {	
    $("#mute-btn").hide();
    $("#clockContainer").hide();
    $("#more-info").hide();
    $(".bio").hide();
    Tone.Master.mute = true;
    // The page is in an iframe	
  } else {
  
    // StartAudioContext(Tone.context, window);  
    $(window).click(function(){
      Tone.context.resume();
    });
  
    volume = new Tone.Volume(-12);
    synth = new Tone.PolySynth(3, Tone.Synth).chain(volume, Tone.Master);
    notes = Tone.Frequency("C3").harmonize([0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24]);
  
  }


});

$(window).resize(function(){
  w = $(window).width();
  h = $(window).height();
});

$("#container").on("mouseenter", ".line", function(){
  let i = $(this).index() - 2;
  synth.triggerAttackRelease(notes[i % notes.length], "8n");
});

$("#clockContainer").click(function(){
  $(".about").toggleClass('about-alt');
  $("#th").toggleClass('th-alt');
  $("#linklist").toggleClass('linklist-alt');
  $(".line").toggleClass('line-alt');
  $(".number").toggleClass('number-alt');
  $(".title").toggleClass('title-alt');
  $(".by").toggleClass('by-alt');
  $(".author").toggleClass('author-alt');
  $(".mobile").toggleClass('mobile-alt');
  $(".bio").toggleClass('bio-alt');
});

$("#clockContainer").mouseenter(function(){
  clearInterval(tv);
  clearInterval(th);
  tv = setInterval(rotateVertical, 30);
  th = setInterval(rotateHorizontal, 30);
});

$("#clockContainer").mouseleave(function(){
  clearInterval(tv);
  clearInterval(th);
  tv = setInterval(rotateVertical, 1000);
  th = setInterval(rotateHorizontal, 1000);
});

$("#container").on('mouseenter', '.line', function(){
  if ( window.location == window.parent.location ) {	
    // $(".bio").removeClass("bio-show");
    $(this).find(".bio").addClass("bio-show");
  }

});

// $("#container").on('mouseleave', '.line', function(){
//   $(".bio").removeClass("bio-show");
// });

function makeLinks() {

  for (var [key, value] of Object.entries(links)) {
    let title = value.name;
    let author = value.author;
    let number = value.number;
    let bio = value.bio;
    let mobile = value.mobile ? "Yes" : "No";

    let newline = $(`<a class='line' href='${linkBody + key}' target='_top'></a>`);
    newline.append($(`<span class="number">RM–${number}</span>`));
    newline.append($(`<span class="title"><a ">${title}</a></span>`));
    newline.append($(`<span class="by">by</span>`));
    let authorSpan = $(`<span class="author">${author}</span>`);
    if(bio){
      let bioDiv = $(`<div class="bio">${bio}</div>`);
      authorSpan.append(bioDiv);

    }
    newline.append(authorSpan);
    newline.append($(`<span class="mobile">${mobile}</span>`));

    $("#container").append(newline);
  }
}


var currRotateV = 0;
var currRotateH = 0;

function rotateVertical() {
  currRotateV += 15;
  $("#vertical").css({
      "transform": `rotate(${currRotateV}deg)`
  })
}

function rotateHorizontal() {
  currRotateH += 7.5;
  $("#horizontal").css({
      "transform": `rotate(${currRotateH}deg)`
  })
}

$("#mute-btn").click(function(){
  Tone.Master.mute = !Tone.Master.mute;
  localStorage.setItem('mute', Tone.Master.mute);
  $(this).text(Tone.Master.mute ? "SOUND ON" : "MUTE");
});