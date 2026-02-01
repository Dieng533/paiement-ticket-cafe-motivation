$(document).ready(function() {
    const tickets = [
        { type: "DOSE", prix: 3000 },
        { type: "VIP", prix: 5000 },
        { type: "VVIP", prix: 10000 },
        { type: "SOFT_SKILLS", prix: 10000 }
    ];

    $("#payer").click(function() {
        const nom = $("#nom").val();
        const tel = $("#telephone").val();
        const type_ticket = $("#type_ticket").val();
        const quantite = parseInt($("#quantite").val(), 10) || 1;
        const ticketInfo = tickets.find(t => t.type === type_ticket);

        if (!nom || !tel) {
            alert("Veuillez remplir tous les champs !");
            return;
        }

        if (!ticketInfo) {
            alert("Type de ticket invalide");
            return;
        }

        if (quantite < 1) {
            alert("La quantité doit être au minimum 1.");
            return;
        }

        const prix = ticketInfo.prix;
        const total = prix * quantite;

        // Sauvegarde du ticket dans localStorage via notre "API" (tickets.js)
        const ticket = saveTicket({ nom, tel, type_ticket, prix, quantite, total });

        // Notification immédiate à l'administrateur sur WhatsApp
        const adminPhone = "221784953056"; // +221 78 495 30 56
        const whatsappMessage = `
Bonjour GO'UP 👋

Nouvel achat de ticket pour *Café Motivation GO'UP* ☕🔥

Nom : ${ticket.nom}
Téléphone client : ${ticket.tel}
Type de ticket : ${ticket.type_ticket}
Quantité : ${ticket.quantite}
Total à payer : ${ticket.total} FCFA
Référence : ${ticket.numero_ticket}

Merci 🙏
        `;
        const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, "_blank");

        // Redirection vers la page de confirmation du ticket (100 % local)
        window.location.href = "success.html";
    });
});
