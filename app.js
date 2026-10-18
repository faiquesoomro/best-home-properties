const WA_NUMBER = "971564205848";
const GENERAL_MSG = "Hi, I'd like to know more about your property listings in Abu Dhabi.";

function waLink(text) {
  return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
}

function enquiryText(l) {
  return "Hi, I'm interested in Ref " + l.code + " — " + l.beds + " " + l.title + ". Please share details.";
}

function cardHTML(l) {
  const photo = l.photo
    ? '<img src="' + l.photo + '" alt="' + l.title + '" loading="lazy">'
    : '<div class="photo-fallback"><div class="big">' + l.beds + '</div><div class="sub">Photos on request via WhatsApp</div></div>';
  const feats = (l.features && l.features.length)
    ? '<ul class="feat">' + l.features.map(f => "<li>" + f + "</li>").join("") + "</ul>"
    : "";
  return (
    '<article class="card" data-beds="' + l.bedsFilter + '">' +
      '<div class="card-photo"><span class="ref-badge">Ref: ' + l.code + "</span>" + photo + "</div>" +
      '<div class="card-body">' +
        "<h3>" + l.title + "</h3>" +
        '<div class="meta"><span>' + l.beds + "</span><span>" + l.area + "</span></div>" +
        feats +
        '<div class="card-wa"><a class="wa-btn" href="' + waLink(enquiryText(l)) + '" target="_blank" rel="noopener">Enquire on WhatsApp</a></div>' +
      "</div>" +
    "</article>"
  );
}

function render(listings, filter) {
  const grid = document.getElementById("grid");
  const shown = listings.filter(l => filter === "all" || l.bedsFilter === filter);
  grid.innerHTML = shown.length
    ? shown.map(cardHTML).join("")
    : '<p class="empty">No listings in this category right now — message us and we\'ll find one for you.</p>';
}

fetch("listings.json")
  .then(r => r.json())
  .then(listings => {
    render(listings, "all");
    document.getElementById("filters").addEventListener("click", e => {
      if (e.target.classList.contains("chip")) {
        document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
        e.target.classList.add("active");
        render(listings, e.target.dataset.filter);
      }
    });
  })
  .catch(() => {
    document.getElementById("grid").innerHTML =
      '<p class="empty">Listings are loading — please refresh in a moment.</p>';
  });

document.getElementById("headerWa").href = waLink(GENERAL_MSG);
document.getElementById("footerWa").href = waLink(GENERAL_MSG);
