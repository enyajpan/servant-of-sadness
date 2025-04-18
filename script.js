var w = $(window).width();
var h = $(window).height();

/* initialize firebase */
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

/* listen and populate entries */
function makeLinks() {
  db.collection("entries")
    .orderBy("timestamp", "desc")
    .onSnapshot((snapshot) => {
      $("#container .line:not(#th)").remove();
      snapshot.forEach((doc) => {
        const value = doc.data();
        const title = value["subject line"] || "";
        const author = value.author || "";
        const number = value.number || "";
        const message = value.message || "";
        const label = value.label || [];
        const timestamp = value.timestamp?.toDate?.().toLocaleString() || "";

        const newline = $(`
          <div class='line'>
            <div class="column number">${number}</div>
            <div class="column title">${title}</div>
            <div class="column author">${author}</div>
            <div class="column message">${message.replace(/\n/g, "<br>")}</div>
            <div class="column label">
              ${
                Array.isArray(label)
                  ? label.map(l => `<button class="tag-button" data-label="${l}">${l}</button>`).join('')
                  : `<button class="tag-button" data-label="${label}">${label}</button>`
              }
            </div>
            <div class="column timestamp">${timestamp}</div>
          </div>
        `);

        $("#container").append(newline);
      });

      scrambleWrap('.column.title');
      scrambleWrap('.column.author');
      scrambleWrap('.column.message');
    });
}

$(document).ready(function () {
  makeLinks();

  // subject line - live error handling
  const subjectField = document.querySelector('input[name="subject line"]');
  const subjectError = document.getElementById("error-subject");
  subjectField.addEventListener("input", () => {
    if (subjectField.value.trim()) {
      subjectError.textContent = "";
    }
  });

  // author - live error handling
  const authorField = document.querySelector('input[name="author"]');
  const authorError = document.getElementById("error-author");
  authorField.addEventListener("input", () => {
    if (authorField.value.trim()) {
      authorError.textContent = "";
    }
  });

  // message - live error handling
  const messageField = document.querySelector('textarea[name="message"]');
  const messageError = document.getElementById("error-message");
  messageField.addEventListener("input", () => {
    if (messageField.value.trim()) {
      messageError.textContent = "";
    }
  });

  // labels (checkbox group) - live error handling
  const labelCheckboxes = document.querySelectorAll('input[name="label"]');
  const labelError = document.getElementById("error-label");
  labelCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const anyChecked = Array.from(labelCheckboxes).some(cb => cb.checked);
      if (anyChecked) {
        labelError.textContent = "";
      }
    });
  });

  $(document).on('mousemove', '.scramble-letter', function () {
    const randomX = (Math.random() - 0.5) * 20;
    const randomY = (Math.random() - 0.5) * 20;
    $(this).css({
      transform: `translate(${randomX}px, ${randomY}px) rotate(${(Math.random() - 0.5) * 30}deg)`,
      transition: 'transform 0.3s ease',
    });
    setTimeout(() => {
      $(this).css({ transform: 'translate(0, 0) rotate(0deg)' });
    }, 300);
  });

  $(document).on("click", ".tag-button", function () {
    const label = $(this).data("label");
    alert(`You clicked label: ${label}`);
  });

  // Helper to show custom error
  function showError(id, message) {
    $(`#${id}`).text(message).show();
  }

  // Helper to clear all errors
  function clearErrors() {
    $(".error-message").text("").hide();
  }

  $("#submission-form").on("submit", async function (e) {
    e.preventDefault();
    clearErrors();

    const subject = $('input[name="subject line"]').val().trim();
    const author = $('input[name="author"]').val().trim();
    const message = $('textarea[name="message"]').val().trim();
    const labels = $('input[name="label"]:checked');

    let hasError = false;

    if (!subject) {
      showError("error-subject", "Please enter a subject line.");
      hasError = true;
    }

    if (!author) {
      showError("error-author", "What's your name? :D");
      hasError = true;
    }

    if (!message) {
      showError("error-message", "You must include message to post.");
      hasError = true;
    }

    if (labels.length === 0) {
      showError("error-label", "Please select at least one label.");
      hasError = true;
    }

    if (hasError) return;

    try {
      const snapshot = await db.collection("entries").orderBy("timestamp", "desc").get();
      const newNumber = String(snapshot.size + 1).padStart(3, "0");

      const formData = {
        "subject line": subject,
        author: author,
        message: message,
        label: Array.from(labels).map(cb => cb.value),
        number: newNumber,
        timestamp: new Date()
      };

      await db.collection("entries").add(formData);
      this.reset();
    } catch (err) {
      console.error("Error submitting:", err);
    }
  });
});
