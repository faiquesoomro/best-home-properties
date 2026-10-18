const WA_NUMBER = "971564205848";
const GENERAL_MSG = "Hi, I'd like to know more about your property listings in Abu Dhabi.";

function waLink(text) {
  return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
}
function enquiryText(l) {
  return "Hi, I'm interested in Ref " + l.code + " — " + l.beds + " " + l.title + ". Please share details.";
}

let ALL = [];

function photoHTML(l, cls) {
  return l.photo
    ? '<img src="' + l.photo + '" alt="' + l.title + '" loading="lazy">'
    : '<div class="photo-fallback"><div class="big">' + l.beds + '</div><div class="sub">Photos on request via WhatsApp</div></div>';
}

function cardHTML(l) {
  const feats = (l.features && l.features.length)
    ? '<ul class="feat">' + l.features.slice(0, 3).map(f => "<li>" + f + "</li>").join("") + "</ul>"
    : "";
  const sale = l.sale ? '<span class="sale-badge">For Sale</span>' : "";
  return (
    '<article class="card reveal" data-code="' + l.code + '" data-beds="' + l.bedsFilter + '">' +
      '<div class="card-photo"><span class="ref-badge">Ref: ' + l.code + "</span>" + sale + photoHTML(l) + "</div>" +
      '<div class="card-body">' +
        "<h3>" + l.title + "</h3>" +
        '<div class="meta"><span>' + l.beds + "</span><span>" + l.area + "</span></div>" +
        feats +
        '<div class="card-cta"><span class="view-link">View details →</span></div>' +
      "</div>" +
    "</article>"
  );
}

function render(filter) {
  const grid = document.getElementById("grid");
  const shown = ALL.filter(l => filter === "all" || l.bedsFilter === filter);
  grid.innerHTML = shown.length
    ? shown.map(cardHTML).join("")
    : '<p class="empty">No listings in this category right now — message us and we\'ll find one for you.</p>';
  observeReveals();
  grid.querySelectorAll(".card").forEach(c =>
    c.addEventListener("click", () => openModal(c.dataset.code)));
  document.getElementById("statCount").textContent = ALL.length;
}

function openModal(code) {
  const l = ALL.find(x => x.code === code);
  if (!l) return;
  document.getElementById("modalPhoto").innerHTML = photoHTML(l);
  document.getElementById("modalRef").textContent = "Ref: " + l.code;
  document.getElementById("modalSale").style.display = l.sale ? "" : "none";
  document.getElementById("modalTitle").textContent = l.title;
  document.getElementById("modalMeta").innerHTML =
    "<span>" + l.beds + "</span><span>" + l.area + "</span>";
  document.getElementById("modalFeat").innerHTML = (l.features && l.features.length)
    ? l.features.map(f => "<li>" + f + "</li>").join("")
    : "<li>Full details on request — just ask.</li>";
  document.getElementById("modalWa").href = waLink(enquiryText(l));
  const m = document.getElementById("modal");
  m.classList.add("open");
  m.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  const m = document.getElementById("modal");
  m.classList.remove("open");
  m.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function observeReveals() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal:not(.visible)").forEach(el => io.observe(el));
}

fetch("listings.json")
  .then(r => r.json())
  .then(listings => {
    ALL = listings;
    render("all");
    document.getElementById("filters").addEventListener("click", e => {
      if (e.target.classList.contains("chip")) {
        document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
        e.target.classList.add("active");
        render(e.target.dataset.filter);
      }
    });
  })
  .catch(() => {
    document.getElementById("grid").innerHTML =
      '<p class="empty">Listings are loading — please refresh in a moment.</p>';
  });

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalBackdrop").addEventListener("click", closeModal);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

window.addEventListener("scroll", () => {
  document.getElementById("nav").classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

["navWa", "heroWa", "footerWa"].forEach(id => {
  document.getElementById(id).href = waLink(GENERAL_MSG);
});
observeReveals();
