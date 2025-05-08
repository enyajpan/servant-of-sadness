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

let unsubscribe = null;
let sortDescending = true;

/* keywords */
function highlightKeywords(text) {
  // Apply word/phrase replacements first (before tag conflicts)
  let highlighted = text
    .replace(/([A-Z]{2,}(?:'[A-Z]{1,2})?)/g, '<span style="color:rgb(63,193,64); font-style: italic; font-size: 80%;">$1</span>')
    .replace(/(I['’` ]?m sorry)/gi, '<span style="color:rgb(66, 132, 237)">$1</span>')
    .replace(/(sorry)/gi, '<span style="color:rgb(66, 132, 237)">$1</span>')
    .replace(/(I miss you)/gi, '<span style="color:rgb(66, 132, 237)">$1</span>')
    .replace(/(I have missed you)/gi, '<span style="color:rgb(199, 56, 198)">$1</span>')
    .replace(/(I love you)/gi, '<span style="color:rgb(205, 96, 105)">$1</span>')
    .replace(/(I loved you)/gi, '<span style="color:rgb(205, 96, 105)">$1</span>')
    .replace(/(in love)/gi, '<span style="color:rgb(205, 96, 105)">$1</span>')
    .replace(/(I've always loved)/gi, '<span style="color:rgb(205, 96, 105)">$1</span>')
    .replace(/(my true love)/gi, '<span style="color:rgb(205, 96, 105)">$1</span>')
    .replace(/(I fell in love with you)/gi, '<span style="color:rgb(205, 96, 105)">$1</span>')
    .replace(/(love)/gi, '<span style="font-style: italic; color:rgb(250, 39, 142)">$1</span>')
    .replace(/(I've loved)/gi, '<span style="color:rgb(205, 96, 105)">$1</span>')
    .replace(/\b(home)\b/gi, '<span style="color: rgb(198, 123, 218);">$1</span>')
    .replace(/(friends)/gi, '<span style="color: rgb(255, 109, 17);">$1</span>')
    .replace(/(I'm leaving you)/gi, '<span style="color: rgb(241, 137, 220);">$1</span>')
    .replace(/(letting him go)/gi, '<span style="color: rgb(66, 132, 237);">$1</span>')
    .replace(/(letting her go)/gi, '<span style="color: rgb(66, 132, 237);">$1</span>')
    .replace(/(my heart)/gi, '<span style="color: rgb(199, 56, 198);">$1</span>')
    .replace(/(forever)/gi, '<span style="color: rgb(240, 170, 9);">$1</span>')
    .replace(/\b(me)\b/gi, '<span style="color: rgb(199, 56, 198);">$1</span>')
    .replace(/\b(you)\b/gi, '<span style="color: rgb(124, 77, 255);">$1</span>')
    .replace(/\b(us)\b/gi, '<span style="color: rgb(250, 39, 142);">$1</span>')
    .replace(/\b(we)\b/gi, '<span style="color: rgb(0, 190, 196);">$1</span>')
  
    // Apply special character highlighting *outside* of existing tags
    return highlighted.replace(/(<[^>]+>)|([()])|(;)|(\d+)/g, (match, tag, paren, semicolon, number) => {
      if (tag) return tag;
      if (paren) return `<span style="color: rgb(241, 137, 220);">${paren}</span>`;
      if (semicolon) return `<span style="color: rgb(169, 169, 170);">${semicolon}</span>`;
      if (number) return `<span style="color: rgb(255, 109, 17);">${number}</span>`;
      return match; // fallback
    });     
  }

  function insertSoftHyphens(text) {
    return text.replace(/\b([a-z]{8,})\b/g, word =>
      word.replace(/(.{4})/g, "$1&shy;")
    );
  }  

  function makeLinks() {
    const sortDirection = sortDescending ? "desc" : "asc";
  
    if (unsubscribe) unsubscribe();
  
    unsubscribe = db.collection("entries")
      .orderBy("timestamp", sortDirection)
      .onSnapshot((snapshot) => {
        $("#container .line:not(#th)").remove();
        $("#sidebar-scroll").empty(); // clear sidebar
        $("#archive-footer").remove(); // remove any existing footer
  
        snapshot.forEach((doc) => {
          const value = doc.data();
          const number = value.number || "";
          const title = value["subject line"] || "";
  
          const indexEntry = $(`
            <div class="index-entry" data-number="${number}">
              <span class="index-number">${number}</span> ${title}
            </div>
          `);
          $("#sidebar-scroll").append(indexEntry);
        });
  
        snapshot.forEach((doc) => {
          const value = doc.data();
          const author = value.author || "";
          const number = value.number || "";
          const message = value.message || "";
          const label = value.label || [];
          const dateObj = value.timestamp?.toDate?.();
          let timestamp = "";
          if (dateObj) {
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const year = String(dateObj.getFullYear());
            const date = `${month}/${day}/${year}`;
            const time = dateObj
              .toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })
              .toUpperCase();         
            timestamp = `<div>${date}</div><div class="time-line">${time}</div>`;
          }
  
          const newline = $(`
            <div class='line entry-line' data-number="${number}">
              <div class="column number">${number}</div>
              <div class="column message ${label.includes('404-error') ? 'message-404' : ''}">
                ${
                  message
                    .split('\n')
                    .map(p => `<span class="scramble-paragraph">${highlightKeywords(p)}</span>`)
                    .join('<br>')
                }
              </div>
              <div class="column author">
                <div class="author-name"><span class="scramble-paragraph">${author}</span></div>
                <div class="print-wrapper"><button class="print-button">Print</button></div>
              </div>
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
  
        // Add the static archive footer after all entries
        $("#container").append(`
          <div id="archive-footer">
            <p>
              You've reached the bottom of this archive, birthed on April 18, 2025 at 3:01am Eastern Standard Time. 
              <button id="scroll-to-top-button">Take me back to the top</button>
            </p>
          </div>
        `);
  
        $(".column.title, .column.author, .column.message").addClass("scramble");
      });
  }
  

$(document).ready(function () {
  makeLinks();

  /* sync hover states for sidebar index and entries container */
  $(document).on("mouseenter", ".index-entry", function () {
    const entryNumber = $(this).find(".index-number").text().trim();
  
    // Remove hover state from all sidebar entries
    $(".index-entry").removeClass("hover-sync");
    // Add to current
    $(this).addClass("hover-sync");
  
    // Remove active state from all entries
    $(".entry-line").removeClass("active");
  
    // Add active state to corresponding entry
    const targetEntry = $(`.entry-line .column.number:contains('${entryNumber}')`).closest(".entry-line");
    targetEntry.addClass("active");
  
    // Scroll to it
    const scrollWrapper = $("#scroll-wrapper");
    const scrollTop = targetEntry.offset().top - scrollWrapper.offset().top + scrollWrapper.scrollTop();
  
    scrollWrapper.stop(true).animate({ scrollTop }, 400);
  });   

  $(document).on("mouseleave", ".index-entry", function () {
    $(".entry-line").removeClass("active");
  });  

  /* vice versa */
  $(document).on("mouseenter", ".entry-line", function () {
    const entryNumber = $(this).find(".column.number").text().trim();
    $(`.index-entry .index-number:contains('${entryNumber}')`).closest(".index-entry").addClass("hover-sync");
  });
  $(document).on("mouseleave", ".entry-line", function () {
    $(".index-entry").removeClass("hover-sync");
  });  
  
  /* let clicks in sidebar sync hover state with entries container */
  $(document).on("click", ".index-entry", function () {
    const entryNumber = $(this).find(".index-number").text().trim();
  
    $(".entry-line").removeClass("active");
    $(".index-entry").removeClass("hover-sync");
  
    const targetEntry = $(`.entry-line .column.number:contains('${entryNumber}')`).closest(".entry-line");
    targetEntry.addClass("active");
    $(this).addClass("hover-sync");
  
    // Scroll to that entry
    const scrollWrapper = $("#scroll-wrapper");
    const scrollTop = targetEntry.offset().top - scrollWrapper.offset().top + scrollWrapper.scrollTop();
    scrollWrapper.animate({ scrollTop }, 600);
  });  
  
  

  $('#sort-button').on('click', function () {
    sortDescending = !sortDescending;
    const newLabel = sortDescending ? "Sort: Oldest First ↑" : "Sort: Newest First ↓";
    $(this).text(newLabel);
    makeLinks();
  });

  let isAboutInFront = true;

  $("#about-overlay").on("click", function () {
    if (isAboutInFront) {
      $(this).css("z-index", 0); // behind view-all-background.png
    } else {
      $(this).css("z-index", 10001); // in front
    }
    isAboutInFront = !isAboutInFront;
  });

  let isTodoInFront = true;

  $("#todo-overlay").on("click", function () {
    if (isTodoInFront) {
      $(this).css("z-index", 0); // behind view-all-background.png
    } else {
      $(this).css("z-index", 10000); // in front
    }
    isTodoInFront = !isTodoInFront;
  });


  // Live error handling
  const fields = [
    { name: "subject line", errorId: "error-subject" },
    { name: "author", errorId: "error-author" },
    { name: "message", errorId: "error-message", isTextarea: true }
  ];

  fields.forEach(({ name, errorId, isTextarea }) => {
    const field = document.querySelector(`${isTextarea ? "textarea" : "input"}[name="${name}"]`);
    const error = document.getElementById(errorId);
    field.addEventListener("input", () => {
      if (field.value.trim()) error.textContent = "";
    });
  });

  const labelCheckboxes = document.querySelectorAll('input[name="label"]');
  const labelError = document.getElementById("error-label");

  labelCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const anyChecked = Array.from(labelCheckboxes).some(cb => cb.checked);
      if (anyChecked) labelError.textContent = "";
    });
  });

  // Close intro popup if present
  $("#close-popup").on("click", function () {
    $("#popup-overlay").fadeOut(100);
  });

  // Close thank-you popup
  $(document).on("click", "#close-thank-you", function () {
    $("#thank-you-popup").fadeOut(100);
  });

  $(document).on("click", ".tag-button", function () {
    const label = $(this).data("label");
    alert(`You clicked label: ${label}`);
  });

  // Submit
  $("#submission-form").on("submit", async function (e) {
    e.preventDefault();
    clearErrors();

    const subject = $('input[name="subject line"]').val().trim();
    const author = $('input[name="author"]').val().trim();
    const message = $('textarea[name="message"]').val().trim();
    const labels = $('input[name="label"]:checked');

    let hasError = false;
    if (!subject) { showError("error-subject", "Please enter a subject line."); hasError = true; }
    if (!author) { showError("error-author", "What's your name? :D"); hasError = true; }
    if (!message) { showError("error-message", "You must include message to post."); hasError = true; }
    if (labels.length === 0) { showError("error-label", "Please select at least one label."); hasError = true; }

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
      $("#thank-you-popup").fadeIn(200);
      $("#close-thank-you").on("click", function () {
        $("#thank-you-popup").fadeOut(200);
      });
    } catch (err) {
      console.error("Error submitting:", err);
    }
  });

  function showError(id, message) {
    $(`#${id}`).text(message).show();
  }

  function clearErrors() {
    $(".error-message").text("").hide();
  }

  $(document).on("click", "#scroll-to-top-button", function () {
    $("#scroll-wrapper").animate({ scrollTop: 0 }, 300);
  });  
});

// close submission form
// Run only after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById('close-submission-form');
  const submissionWrapper = document.getElementById('submission-wrapper');
  const submissionOverlay = document.getElementById('submission-overlay');
  const submissionBg = document.getElementById('submission-bg');
  const messageWrapper = document.querySelector('.message-wrapper');
  const inputStack = document.querySelector('.input-stack');

  let isSubmissionVisible = true;

  closeBtn.addEventListener('click', () => {
    if (isSubmissionVisible) {
      // Hide form layers
      submissionWrapper.style.zIndex = -10;
      submissionWrapper.style.pointerEvents = 'none';

      submissionOverlay.style.zIndex = -10;
      submissionOverlay.style.pointerEvents = 'none';

      submissionBg.style.zIndex = -10;
      submissionBg.style.pointerEvents = 'none';

      if (messageWrapper) messageWrapper.style.display = 'none';
      if (inputStack) inputStack.style.display = 'none';

      // Show button in bottom-right
      closeBtn.textContent = 'Leave something';
      closeBtn.classList.add('bottom-position');
    } else {
      // Show form again
      submissionWrapper.style.zIndex = 1000;
      submissionWrapper.style.pointerEvents = 'auto';

      submissionOverlay.style.zIndex = 1000;
      submissionOverlay.style.pointerEvents = 'auto';

      submissionBg.style.zIndex = 1;
      submissionBg.style.pointerEvents = 'auto';

      if (messageWrapper) messageWrapper.style.display = '';
      if (inputStack) inputStack.style.display = '';

      // Restore button
      closeBtn.textContent = '×';
      closeBtn.classList.remove('bottom-position');
    }

    isSubmissionVisible = !isSubmissionVisible;
  });
});

/* print button logic */
$(document).on('click', '.print-button', function () {
  const printButton = this;
  printButton.textContent = "Preparing your print...";
  printButton.disabled = true;
  printButton.style.opacity = "0.6";

  setTimeout(() => {
    const $entry = $(printButton).closest('.entry-line');
    const number = $entry.find('.column.number').text().trim();
    const messageHtml = $entry.find('.column.message').html();
    const author = $entry.find('.author-name').text().trim();
    const timestamp = $entry.find('.column.timestamp').html();
    const subjectLine = $('#sidebar-scroll .index-entry')
      .filter((_, el) => $(el).data('number') === number)
      .text().replace(number, '').trim();
    const labels = $entry.find('.tag-button').map((_, el) => $(el).text()).get().join(', ');
    const is404 = $entry.find('.column.message').hasClass('message-404');

    const labelsHtml = labels
      .split(',')
      .map(l => `<button class="tag-button">${l.trim()}</button>`)
      .join('');

    const pageHeader = `
      <h1><span style="font-family: monospace;">${number}.</span> <span style="font-family: sans-serif;">${subjectLine || '(No Subject)'}</span></h1>
      <div class="body">From: <span style="font-family: sans-serif;">${author || 'Anonymous'}</span></div>
      <div class="meta">${labelsHtml || '<em>None</em>'}</div>
      <div style="margin-bottom: 1em;"></div>
    `;

    const messageLines = messageHtml.split(/<br\s*\/?>/gi).map(line => line.trim());
    const messageWrapperStart = is404 ? '<div class="flowers-font">' : '';
    const messageWrapperEnd = is404 ? '</div>' : '';

    let pagesHtml = "";
    let currentPageContent = pageHeader + messageWrapperStart;
    const tempContainer = document.createElement("div");
    Object.assign(tempContainer.style, {
      position: "absolute",
      visibility: "hidden",
      width: "1000px",
      columnCount: "2",
      fontSize: "2rem"
    });
    document.body.appendChild(tempContainer);

    let lastLineEmpty = false;
    for (let line of messageLines) {
      const htmlLine = line
        ? `<div class="message-body">${insertSoftHyphens(line)}</div>`
        : '<div class="paragraph-spacer"></div>';

      tempContainer.innerHTML = currentPageContent + htmlLine;
      if (tempContainer.scrollHeight > 800) {
        pagesHtml += `
          <div class="print-page">
            <div class="page-columns ${is404 ? 'flowers-font' : ''}">
              ${currentPageContent}
              ${messageWrapperEnd}
            </div>
          </div>
        `;
        currentPageContent = messageWrapperStart + htmlLine;
      } else {
        currentPageContent += htmlLine;
      }
    }

    pagesHtml += `
      <div class="print-page">
        <div class="page-columns ${is404 ? 'flowers-font' : ''}">
          ${currentPageContent}
          ${messageWrapperEnd}
          <div class="meta message-body">${timestamp}</div>
        </div>
      </div>
    `;

    document.body.removeChild(tempContainer);

    const printContent = `
      <html lang="en">
        <head>
          <title>Print Message Entry</title>
          <style>
            @font-face {
              font-family: 'Flowers';
              src: url('https://enyajpan.github.io/in-case-of-loss/assets/flowers.otf') format('opentype');
            }
            @page {
              size: landscape;
              margin: 0.25in 1in;
            }
            body {
              font-family: sans-serif;
              font-size: 30px; /* Static message text size */
              line-height: 0.85;
              letter-spacing: -0.01em;
              margin: 0;
              padding: 0;
              color: rgb(83, 160, 82);
              text-align: justify;
            }
            .print-page {
              page-break-after: always;
              padding: 0;
              box-sizing: border-box;
              width: 100%;
              height: 100%;
              background-image: url('https://enyajpan.github.io/in-case-of-loss/assets/print-bg-graphic.png');
              background-repeat: no-repeat;
              background-position: center center;
              background-size: cover;
            }
            .page-columns {
              column-count: 2;
              column-gap: 1em;
              height: 100%;
              text-align: justify !important;
            }
            .page-columns div {
              hyphens: auto;
              -webkit-hyphens: auto;
              -ms-hyphens: auto;
              word-break: break-word;
            }
            .flowers-font {
              font-family: 'Flowers', sans-serif;
              font-size: 75px;
              line-height: 0.75;
              word-break: break-word;
            }
            h1,
            .meta,
            .body,
            .tag-button {
              font-size: 12px !important; 
              text-align: left !important;
            }
            h1 {
              font-family: monospace;
              font-size: 12px !important;
              margin: 0 0 0 0;
            }
            .meta {
              font-family: monospace;
              font-size: 12px !important;
            }
            .body {
              font-size: 12px !important;
              margin-top: 0.5em;
              margin-left: 0.2in;
            }
            .message-body {
              margin-left: 0.55in;
            }
            .tag-button {
              display: inline-block;
              padding: 0.1em 0.2em;
              margin-left: 0.4in;
              font-family: monospace;
              font-size: 10px !important;
              border: 0.5px solid rgb(83, 160, 82);
              border-radius: 4px;
              background-color: transparent;
              color: rgb(83, 160, 82);
              text-transform: lowercase;
              cursor: default;
            }
            .print-page div {
              margin-bottom: 0.5em;
            }

          </style>

        </head>
        <body>${pagesHtml}</body>
      </html>
    `;

    const printWindow = window.open('', '', 'width=1000,height=800');
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);

    printButton.textContent = "Print";
    printButton.disabled = false;
    printButton.style.opacity = "1";
  }, 300);
});

