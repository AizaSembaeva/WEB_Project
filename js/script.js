document.querySelectorAll('.nav-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const nav = document.getElementById('mainNav');
    if (nav) nav.classList.toggle('show');
  });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      
      const nav = document.getElementById('mainNav');
      if (nav) nav.classList.remove("show");
    }
  });
});

$(function () {
  $(".filter-btn").on("click", function () {
    const filter = $(this).data("filter");

    $(".filter-btn").removeClass("active");
    $(this).addClass("active");

    const $all = $(".gallery-item");
    const $toShow = (filter === "all")
      ? $all
      : $all.filter(`[data-category="${filter}"]`);
    const $toHide = $all.not($toShow);

    $toHide.filter(":visible").fadeOut(400);
    $toShow.filter(":hidden").fadeIn(400);
  });

  const $lightbox = $("#lightbox");
  const $lightboxImg = $(".lightbox-img");
  const $items = $(".gallery-item img");
  let currentIndex = 0;

  $items.on("click", function () {
    currentIndex = $items.index(this);
    const src = $(this).attr("src");
    $lightboxImg.attr("src", src);
    $lightbox.fadeIn(300);
  });

  $(".close, #lightbox").on("click", function (e) {
    if (e.target === this || $(e.target).hasClass("close")) {
      $lightbox.fadeOut(300);
    }
  });

  $(".prev").on("click", function (e) {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + $items.length) % $items.length;
    changeImage();
  });

  $(".next").on("click", function (e) {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % $items.length;
    changeImage();
  });

  function changeImage() {
    const newSrc = $items.eq(currentIndex).attr("src");
    $lightboxImg.fadeOut(200, function () {
      $lightboxImg.attr("src", newSrc).fadeIn(200);
    });
  }
});

$(function() {
  const searchInput = $("#serviceSearch");

  if (searchInput.length) {
    searchInput.on("keyup input", function() {
      const query = $(this).val().toLowerCase().trim();
      let visibleCount = 0;

      $(".service-card").each(function() {
        const title = $(this).find("h3").text().toLowerCase();
        const desc = $(this).find(".service-description").text().toLowerCase();

        if (title.includes(query) || desc.includes(query)) {
          $(this).fadeIn(200);
          visibleCount++;
        } else {
          $(this).fadeOut(200);
        }
      });

      if (visibleCount === 0) {
        if (!$("#noResults").length) {
          $(".services-page").append('<p id="noResults" class="text-center mt-4">No services found.</p>');
        }
      } else {
        $("#noResults").remove();
      }
    });
  }
});

$(function () {
  const form = $("#contactForm");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const tableBody = $("#clientsTable tbody");
  const searchInput = $("#search");
  let clients = [];
  let sortAsc = true;

  form.on("input", "#password", function () {
    updateStrength($(this).val());
  });

  form.on("submit", function (e) {
    e.preventDefault();
    $(".form-message").remove();
    $("input, textarea, select").removeClass("is-invalid is-valid");

    let ok = true;
    form.find("#name, #email, #phone, #password, #confirmPassword, #date, #service").each(function () {
      if (!validateField($(this))) ok = false;
    });

    if (!ok) return;

    const client = {
      name: $("#name").val().trim(),
      email: $("#email").val().trim(),
      phone: $("#phone").val().trim(),
      service: $("#service").val(),
      date: $("#date").val(),
    };

    clients.push(client);
    renderTable();

    const bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
    bookingModal.show();

    form.trigger("reset");
    $("#password-strength").text("");

    const lastRow = tableBody.find("tr").last();
    lastRow.hide().slideDown(400);
  });

  function validateField($f) {
    const id = $f.attr("id"), v = $f.val()?.trim?.() || "";
    const feedback = $f.siblings(".invalid-feedback");
    let msg = "";

    if (!v) msg = "This field is required";
    else if (id === "email" && !emailRegex.test(v)) msg = "Invalid email format";
    else if (id === "phone") {
      const digits = v.replace(/\D/g, "");
      if (digits.length !== 11 || !/^[78]/.test(digits)) msg = "Invalid phone number";
    }
    else if (id === "password" && v.length < 8) msg = "Min 8 characters";
    else if (id === "confirmPassword" && v !== $("#password").val().trim()) msg = "Passwords do not match";
    else if (id === "service" && $f.prop("selectedIndex") === 0) msg = "Please select a service";

    if (msg) {
      $f.addClass("is-invalid");
      feedback.text(msg).show();
      return false;
    } else {
      $f.removeClass("is-invalid").addClass("is-valid");
      feedback.hide();
      return true;
    }
  }

  function updateStrength(pwd) {
    if (!$("#password-strength").length)
      $("#password").after("<div id='password-strength' class='small mt-1'></div>");
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    const $ps = $("#password-strength").removeClass("text-danger text-warning text-success");
    if (!pwd) $ps.text("");
    else if (s <= 1) $ps.text("Weak").addClass("text-danger");
    else if (s <= 3) $ps.text("Medium").addClass("text-warning");
    else $ps.text("Strong").addClass("text-success");
  }

  function renderTable() {
    const q = searchInput.val()?.toLowerCase() || "";
    tableBody.empty();

    clients
      .filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
      .forEach((c, i) => {
        const row = $(`
          <tr>
            <td>${c.name}</td>
            <td>${c.email}</td>
            <td>${c.phone}</td>
            <td>${c.service}</td>
            <td>${c.date}</td>
            <td>
              <button class="btn btn-sm btn-warning edit-btn" data-index="${i}">Edit</button>
              <button class="btn btn-sm btn-danger delete-btn" data-index="${i}">Delete</button>
            </td>
          </tr>
        `);
        tableBody.append(row);
      });
  }

  searchInput.on("input", renderTable);

  tableBody.on("click", ".delete-btn", function () {
    const index = $(this).data("index");
    if (!confirm("Are you sure you want to delete this record?")) return;
    const row = $(this).closest("tr");
    row.fadeOut(300, function () {
      clients.splice(index, 1);
      renderTable();
    });
  });

  tableBody.on("click", ".edit-btn", function () {
    const i = $(this).data("index");
    const c = clients[i];
    $("#editIndex").val(i);
    $("#editName").val(c.name);
    $("#editEmail").val(c.email);
    $("#editPhone").val(c.phone);
    $("#editService").val(c.service);
    $("#editDate").val(c.date);
    new bootstrap.Modal(document.getElementById("editModal")).show();
  });

  $("#editForm").on("submit", function (e) {
    e.preventDefault();
    const i = $("#editIndex").val();
    clients[i] = {
      name: $("#editName").val(),
      email: $("#editEmail").val(),
      phone: $("#editPhone").val(),
      service: $("#editService").val(),
      date: $("#editDate").val()
    };
    renderTable();
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
  });

  $("th.sortable").on("click", function () {
    const field = $(this).data("sort");
    clients.sort((a, b) => {
      const A = a[field].toLowerCase(), B = b[field].toLowerCase();
      return sortAsc ? A.localeCompare(B) : B.localeCompare(A);
    });
    sortAsc = !sortAsc;
    renderTable();
  });
});

$(window).on('scroll', function() {
  $('.fade-in').each(function() {
    const elementTop = $(this).offset().top;
    const windowBottom = $(window).scrollTop() + $(window).height();
    
    if (elementTop < windowBottom - 100) {
      $(this).addClass('visible');
    }
  });
});

$(window).trigger('scroll');
