const table = document.getElementById("ticketsTable");
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

function renderTickets(){
    table.innerHTML = "";

    tickets.forEach((t, i) => {
        table.innerHTML += `
        <tr>
          <td>${i+1}</td>
          <td><strong>${t.numero_ticket}</strong></td>
          <td>${t.nom}</td>
          <td>${t.tel}</td>
          <td>${t.type_ticket}</td>
          <td>
            ${t.quantite ? `${t.quantite} x ${t.prix} F` : `${t.prix} F`}
            ${t.total ? `<br><small>Total: ${t.total} F</small>` : ""}
          </td>
          <td>
            <span class="badge ${t.statut === "VALIDÉ" ? "badge-valid" : "badge-non"}">
              ${t.statut}
            </span>
          </td>
          <td>
            ${t.statut === "NON VALIDÉ" ? 
              `<button class="btn btn-success btn-sm" onclick="validateTicket('${t.id}')">Valider</button>` 
              : ""}
          </td>
        </tr>`;
    });
}

function validateTicket(id){
    tickets = tickets.map(t => {
        if(t.id === id){
            t.statut = "VALIDÉ";
        }
        return t;
    });

    localStorage.setItem("tickets", JSON.stringify(tickets));
    renderTickets();
}

renderTickets();
