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
            <div class="column message">${message}</div>
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

  // Letter scramble hover animation
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

  // Tag click interaction (you can customize what happens)
  $(document).on("click", ".tag-button", function () {
    const label = $(this).data("label");
    alert(`You clicked label: ${label}`);
  });

  // ✅ Form submission
  $("#submission-form").on("submit", async function (e) {
    e.preventDefault();

    try {
      // Get entry count for number field
      const snapshot = await db.collection("entries").orderBy("timestamp", "desc").get();
      const newNumber = String(snapshot.size + 1).padStart(3, "0");

      // Gather form data
      const formData = {};
      const rawData = new FormData(this);

      for (let [key, value] of rawData.entries()) {
        if (key !== "label") {
          formData[key] = value;
        }
      }

      // ✅ Correctly get selected checkboxes for labels
      const labelCheckboxes = document.querySelectorAll('input[name="label"]:checked');
      formData.label = Array.from(labelCheckboxes).map(cb => cb.value);

      // Add number and timestamp
      formData.number = newNumber;
      formData.timestamp = new Date();

      // Submit to Firestore
      await db.collection("entries").add(formData);
      this.reset();
    } catch (err) {
      console.error("Error submitting:", err);
    }
  });
});
