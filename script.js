var w = $(window).width();
var h = $(window).height();
var linkBody = "https://enyajpan.github.io/";

// Firebase setup
const firebaseConfig = {
  apiKey: "AIzaSyAidIgPo_dkrLV2FmJGqgGELdEGlV2pXkM",
  authDomain: "risd-dp.firebaseapp.com",
  projectId: "risd-dp",
  storageBucket: "risd-dp.firebasestorage.app",
  messagingSenderId: "640654886959",
  appId: "1:640654886959:web:5be3dd3866004a224e1eda",
  measurementId: "G-JCQFDHPH74"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

var links = {};

function fetchLinksFromFirebase() {
  db.collection("submissions")
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc, index) => {
        const data = doc.data();
        const key = doc.id;

        links[key] = {
          number: (index + 1).toString().padStart(2, "0"),
          name: data.title || "Untitled",
          author: data.author || "Anonymous",
          bio: data.message || "",
          timestamp: data.timestamp ? formatTimestamp(data.timestamp.toDate()) : "",
        };
      });

      makeLinks(); // Call after loading data
    })
    .catch((error) => {
      console.error("Error loading data from Firebase:", error);
    });
}

function formatTimestamp(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

$(document).ready(function () {
  fetchLinksFromFirebase();

  // Hide certain elements if embedded in iframe
  if (window.location !== window.parent.location) {
    $("#toggle-layout-btn").hide();
    $("#more-info").hide();
    $(".bio").hide();
  }
});

$(window).resize(function () {
  w = $(window).width();
  h = $(window).height();
});

$("#toggle-layout-btn").click(function () {
  // Toggle alternate styling
  $(".about").toggleClass("about-alt");
  $("#th").toggleClass("th-alt");
  $("#linklist").toggleClass("linklist-alt");
  $(".line").toggleClass("line-alt");
  $(".number").toggleClass("number-alt");
  $(".title").toggleClass("title-alt");
  $(".by").toggleClass("by-alt");
  $(".author").toggleClass("author-alt");
  $(".timestamp").toggleClass("timestamp-alt");
  $(".bio").toggleClass("bio-alt");

  // Toggle actual grid layout
  $("#container").toggleClass("grid-view");

  // Update button text
  const isGrid = $("#container").hasClass("grid-view");
  $(this).text(isGrid ? "List View" : "Grid View");
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
    let timestamp = value.timestamp;

    let newline = $(
      `<a class='line' href='${linkBody + key}' target='_top'></a>`
    );
    newline.append($(`<span class="number">RM–${number}</span>`));
    newline.append($(`<span class="title">${title}</span>`));
    newline.append($(`<span class="by">by</span>`));
    let authorSpan = $(`<span class="author">${author}</span>`);
    if (bio) {
      let bioDiv = $(`<div class="bio">${bio}</div>`);
      authorSpan.append(bioDiv);
    }
    newline.append(authorSpan);
    newline.append($(`<span class="timestamp">${timestamp}</span>`));

    $("#container").append(newline);
  }
}