$(document).ready(function() {
    const tickets = [
        { type: "DOSE", prix: 3000 },
        { type: "VIP", prix: 5000 },
        { type: "VVIP", prix: 10000 }
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
        saveTicket({ nom, tel, type_ticket, prix, quantite, total });

        // Redirection vers la page de paiement Wave
        // (Configure dans ton compte Wave l'URL de retour vers api/wave-callback.html)
        const wave_link = "https://pay.wave.com/m/M_sn_CSkOL0l-YzKN/c/sn/";
        window.location.href = wave_link;
    });
});
