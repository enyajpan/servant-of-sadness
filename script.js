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
    let bio = value.bio;
    let mobile = value.mobile;

    let newline = $(
      `<a class='line' href='${linkBody + key}' target='_top'></a>`
    );
    newline.append($(`<span class="number">RM–${number}</span>`));
    newline.append($(`<span class="title"><a ">${title}</a></span>`));
    newline.append($(`<span class="by">by</span>`));
    let authorSpan = $(`<span class="author">${author}</span>`);
    if (bio) {
      let bioDiv = $(`<div class="bio">${bio}</div>`);
      authorSpan.append(bioDiv);
    }
    newline.append(authorSpan);
    newline.append($(`<span class="mobile">${mobile}</span>`));

    $("#container").append(newline);
  }
}