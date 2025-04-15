var w = $(window).width();
var h = $(window).height();
var linkBody = "https://enyajpan.github.io/";

var links = {
  "xxx": {
    "number": "7838975506",
    "subject line": "We sat next to each other on the D train from 36th street to Grand st (New York)",
    "author": "Anonymous",
    "message":"We sat next to each other on the bench at 36th street today around 12:30p. We also sat next to each other on the train, occasionally exchanging glances. You were listening to music and smiling. You're a woman with fair skin, long dark hair parted in the center, and green-blue eyes. I'm a man with curly brown hair, brown eyes, tan skin, and a beard. After you got off at Grand street we locked eyes through the window and both knew it was a missed connection.",
    "timestamp": "2025-03-31 19:20"
  },
  "xxx": {
    "number": "00",
    "name": "xxx",
    "author": "xxx",
    "message":"xxx"
  }
  // Add more entries as needed
};

$(document).ready(function () {
  makeLinks();

  // Hide extra UI if embedded in iframe
  if (window.location !== window.parent.location) {
    $("#mute-btn").hide();
    $("#clockContainer").hide();
    $("#more-info").hide();
    $(".bio").hide();
  }
});

$(window).resize(function () {
  w = $(window).width();
  h = $(window).height();
});

$("#clockContainer").click(function () {
  $(".about").toggleClass("about-alt");
  $("#th").toggleClass("th-alt");
  $("#linklist").toggleClass("linklist-alt");
  $(".line").toggleClass("line-alt");
  $(".number").toggleClass("number-alt");
  $(".title").toggleClass("title-alt");
  $(".by").toggleClass("by-alt");
  $(".author").toggleClass("author-alt");
  $(".mobile").toggleClass("mobile-alt");
  $(".bio").toggleClass("bio-alt");
});

$("#container").on("mouseenter", ".line", function () {
  if (window.location == window.parent.location) {
    $(this).find(".bio").addClass("bio-show");
  }
});

function makeLinks() {
  for (var [key, value] of Object.entries(links)) {
    let title = value.name;
    let author = value.author;
    let number = value.number;
    let message = value.message || "";
    let timestamp = value.timestamp;

    let newline = $(`<a class='line' href='${linkBody + key}' target='_top'></a>`);
    newline.append($(`<div class="column number">RM–${number}</div>`));
    newline.append($(`<div class="column title">${title}</div>`));
    newline.append($(`<div class="column by">by</div>`));
    let authorDiv = $(`<div class="column author">${author}</div>`);
    if (bio) {
      let bioDiv = $(`<div class="bio">${bio}</div>`);
      authorDiv.append(bioDiv);
    }
    newline.append(authorDiv);
    newline.append($(`<div class="column message">${message}</div>`));
    newline.append($(`<div class="column timestamp">${timestamp}</div>`));

    $("#container").append(newline);
  }
}