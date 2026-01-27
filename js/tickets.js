function generateTicketNumber() {
    let count = localStorage.getItem("ticketCount");
    count = count ? parseInt(count) + 1 : 1;
    localStorage.setItem("ticketCount", count);
    return "GOUP-" + count.toString().padStart(4, "0");
}

function saveTicket(data) {
    let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

    const ticket = {
        id: Date.now().toString(),
        numero_ticket: generateTicketNumber(),
        nom: data.nom,
        tel: data.tel,
        type_ticket: data.type_ticket,
        prix: data.prix,
        quantite: data.quantite || 1,
        total: data.total || data.prix,
        statut: "NON VALIDÉ",
        date: new Date().toLocaleString("fr-FR")
    };

    tickets.push(ticket);
    localStorage.setItem("tickets", JSON.stringify(tickets));
    localStorage.setItem("lastTicket", JSON.stringify(ticket));

    // Retourner le ticket créé pour pouvoir l'utiliser (WhatsApp, affichage, etc.)
    return ticket;
}
