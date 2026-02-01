(function () {
  "use strict";

  // Protection : redirection si non connecté
  if (!sessionStorage.getItem("adminAuth")) {
    window.location.href = "admin-login.html";
    return;
  }

  const STORAGE_KEY = "tickets";
  const table = document.getElementById("ticketsTable");
  const countInfo = document.getElementById("countInfo");
  let currentFilter = "all";

  function getTickets() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (_) {
      return [];
    }
  }

  function setTickets(tickets) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }

  function filteredList(tickets) {
    if (currentFilter === "paye") return tickets.filter(function (t) { return t.statut === "VALIDÉ"; });
    if (currentFilter === "encours") return tickets.filter(function (t) { return t.statut !== "VALIDÉ"; });
    return tickets;
  }

  function statutLabel(statut) {
    return statut === "VALIDÉ" ? "Déjà payé" : "En cours";
  }

  function statutClass(statut) {
    return statut === "VALIDÉ" ? "badge-paye" : "badge-encours";
  }

  function renderTickets() {
    var tickets = getTickets();
    var list = filteredList(tickets);
    table.innerHTML = "";

    list.forEach(function (t, i) {
      var row = document.createElement("tr");
      row.innerHTML =
        "<td>" + (i + 1) + "</td>" +
        "<td><strong>" + (t.numero_ticket || "-") + "</strong></td>" +
        "<td>" + (t.nom || "") + "</td>" +
        "<td>" + (t.tel || "") + "</td>" +
        "<td>" + (t.type_ticket || "") + "</td>" +
        "<td>" + (t.quantite || 1) + "</td>" +
        "<td>" + (t.total != null ? t.total + " F" : (t.prix || 0) + " F") + "</td>" +
        "<td><span class=\"badge " + statutClass(t.statut) + "\">" + statutLabel(t.statut) + "</span></td>" +
        "<td><small>" + (t.date || "") + "</small></td>" +
        "<td>" +
          (t.statut !== "VALIDÉ"
            ? "<button type=\"button\" class=\"btn btn-success btn-sm me-1\" data-action=\"validate\" data-id=\"" + t.id + "\">Valider</button>"
            : "") +
          "<button type=\"button\" class=\"btn btn-primary btn-sm me-1\" data-action=\"edit\" data-id=\"" + t.id + "\">Modifier</button>" +
          "<button type=\"button\" class=\"btn btn-danger btn-sm\" data-action=\"delete\" data-id=\"" + t.id + "\">Supprimer</button>" +
        "</td>";
      table.appendChild(row);
    });

    countInfo.textContent = list.length + " ticket(s) affiché(s)" + (currentFilter !== "all" ? " (filtre actif)" : "");
  }

  function applyFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-filter") === filter);
    });
    renderTickets();
  }

  function validateTicket(id) {
    var tickets = getTickets();
    var found = false;
    tickets = tickets.map(function (t) {
      if (t.id === id) { found = true; t.statut = "VALIDÉ"; }
      return t;
    });
    if (found) {
      setTickets(tickets);
      renderTickets();
    }
  }

  function deleteTicket(id) {
    if (!confirm("Supprimer ce ticket ?")) return;
    var tickets = getTickets().filter(function (t) { return t.id !== id; });
    setTickets(tickets);
    renderTickets();
  }

  function openEditModal(id) {
    var tickets = getTickets();
    var t = tickets.find(function (x) { return x.id === id; });
    if (!t) return;
    document.getElementById("editId").value = t.id;
    document.getElementById("editNom").value = t.nom || "";
    document.getElementById("editTel").value = t.tel || "";
    document.getElementById("editType").value = t.type_ticket || "DOSE";
    document.getElementById("editQuantite").value = t.quantite || 1;
    document.getElementById("editStatut").value = t.statut || "NON VALIDÉ";
    new bootstrap.Modal(document.getElementById("editModal")).show();
  }

  function saveEdit() {
    var id = document.getElementById("editId").value;
    var tickets = getTickets();
    var t = tickets.find(function (x) { return x.id === id; });
    if (!t) return;
    t.nom = document.getElementById("editNom").value.trim();
    t.tel = document.getElementById("editTel").value.trim();
    t.type_ticket = document.getElementById("editType").value;
    t.quantite = parseInt(document.getElementById("editQuantite").value, 10) || 1;
    t.statut = document.getElementById("editStatut").value;
    var prixUnitaire = { DOSE: 3000, VIP: 5000, VVIP: 10000 }[t.type_ticket] || 3000;
    t.prix = prixUnitaire;
    t.total = t.prix * t.quantite;
    setTickets(tickets);
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
    renderTickets();
  }

  table.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-action][data-id]");
    if (!btn) return;
    var action = btn.getAttribute("data-action");
    var id = btn.getAttribute("data-id");
    if (action === "validate") validateTicket(id);
    else if (action === "edit") openEditModal(id);
    else if (action === "delete") deleteTicket(id);
  });

  document.querySelectorAll(".filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyFilter(btn.getAttribute("data-filter"));
    });
  });

  document.getElementById("saveEdit").addEventListener("click", saveEdit);
  document.getElementById("btnLogout").addEventListener("click", function () {
    sessionStorage.removeItem("adminAuth");
    window.location.href = "admin-login.html";
  });

  renderTickets();
})();
