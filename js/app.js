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
        const prix = tickets.find(t => t.type === type_ticket).prix;

        if(!nom || !tel) {
            alert("Veuillez remplir tous les champs !");
            return;
        }

        // Générer référence unique
        const reference = "TCK-" + Date.now();

        // Stocker le ticket dans localStorage
        const ticket = { nom, tel, type_ticket, prix, reference };
        localStorage.setItem('lastTicket', JSON.stringify(ticket));

        // Redirection vers le lien Wave marchand
        const wave_link = "https://pay.wave.com/m/M_sn_mw86fQUtQu1n/c/sn/";
        window.location.href = wave_link;
    });
});
