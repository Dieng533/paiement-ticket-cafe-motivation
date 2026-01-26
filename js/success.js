$(document).ready(function() {
    // Configuration Supabase - REMPLACEZ AVEC VOS INFOS
    const SUPABASE_URL = "https://votre-projet.supabase.co";
    const SUPABASE_ANON_KEY = "votre-cle-anon-publique";
    
    // Initialiser Supabase
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Fonction pour récupérer les paramètres de l'URL
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Fonction pour générer un QR Code avec une librairie externe
    function generateQRCode(text) {
        const qrContainer = $('#qrcode');
        qrContainer.html(`
            <div id="qrcodeCanvas" class="mb-2" style="width: 200px; height: 200px;"></div>
            <small class="text-muted">QR Code pour l'entrée</small>
        `);
        
        // Utiliser une API en ligne pour générer un QR Code
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
        $('#qrcodeCanvas').html(`<img src="${qrUrl}" alt="QR Code" class="img-fluid">`);
    }

    // Fonction pour afficher les détails du ticket
    function displayTicketDetails(ticket) {
        const ticketDetails = $('#ticketDetails');
        
        const html = `
            <div class="row">
                <div class="col-md-6 mb-3">
                    <h6 class="text-muted">Référence</h6>
                    <h4 class="fw-bold text-goup-dark">${ticket.reference}</h4>
                </div>
                <div class="col-md-6 mb-3">
                    <h6 class="text-muted">Statut</h6>
                    <span class="badge bg-success fs-6">Payé</span>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <h6 class="text-muted">Nom</h6>
                    <h5>${ticket.nom}</h5>
                </div>
                <div class="col-md-6 mb-3">
                    <h6 class="text-muted">Téléphone</h6>
                    <h5>${ticket.telephone}</h5>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <h6 class="text-muted">Type de ticket</h6>
                    <h5 class="text-goup-orange">${ticket.type_ticket}</h5>
                </div>
                <div class="col-md-6 mb-3">
                    <h6 class="text-muted">Montant</h6>
                    <h4 class="fw-bold">${ticket.prix.toLocaleString('fr-FR')} F CFA</h4>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <h6 class="text-muted">Date de réservation</h6>
                    <h6>${new Date(ticket.date_creation).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</h6>
                </div>
                <div class="col-md-6 mb-3">
                    <h6 class="text-muted">Événement</h6>
                    <h6>Café Motivation GO'UP</h6>
                    <small>14 Février 2026 • 17h00 • Dakar</small>
                </div>
            </div>
        `;
        
        ticketDetails.html(html);
        
        // Générer le QR Code
        generateQRCode(ticket.reference);
        
        // Simuler un SMS de confirmation
        simulateSMSConfirmation(ticket);
    }

    // Récupérer le ticket depuis Supabase
    async function loadTicketData() {
        const ref = getUrlParameter('ref');
        
        if (!ref) {
            // Essayer de récupérer depuis localStorage
            const pendingTicket = JSON.parse(localStorage.getItem('pendingTicket') || 'null');
            if (pendingTicket) {
                displayTicketDetails(pendingTicket);
                return;
            } else {
                showNotFound();
                return;
            }
        }
        
        try {
            // Rechercher le ticket dans Supabase
            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .eq('reference', ref)
                .single();
            
            if (error) throw error;
            
            if (data) {
                // Mettre à jour le ticket dans localStorage pour un accès hors ligne
                localStorage.setItem('pendingTicket', JSON.stringify(data));
                displayTicketDetails(data);
            } else {
                showNotFound();
            }
            
        } catch (error) {
            console.error("Erreur:", error);
            
            // Fallback: chercher dans localStorage
            const pendingTicket = JSON.parse(localStorage.getItem('pendingTicket') || 'null');
            if (pendingTicket && pendingTicket.reference === ref) {
                displayTicketDetails(pendingTicket);
            } else {
                showNotFound();
            }
        }
    }

    function showNotFound() {
        $('#ticketDetails').html(`
            <div class="alert alert-warning">
                <h5><i class="fas fa-exclamation-triangle me-2"></i>Ticket non trouvé</h5>
                <p class="mb-0">Nous n'avons pas trouvé les détails de votre ticket. Veuillez contacter notre support.</p>
            </div>
        `);
    }

    // Simulation d'envoi de SMS
    function simulateSMSConfirmation(ticket) {
        console.log("SMS envoyé à " + ticket.telephone + ":");
        console.log("GO'UP: Votre ticket " + ticket.reference + " pour Café Motivation est confirmé. Montant: " + ticket.prix + " F CFA. Présentez ce QR code à l'entrée.");
    }

    // Téléchargement du ticket
    $('#downloadTicket').click(function() {
        const ticketData = JSON.parse(localStorage.getItem('pendingTicket') || '{}');
        
        if (ticketData.reference) {
            // Créer un contenu pour le ticket
            const ticketContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Ticket GO'UP - ${ticketData.reference}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .ticket { border: 2px dashed #e06a16; padding: 20px; max-width: 400px; margin: 0 auto; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .qr-code { text-align: center; margin: 20px 0; }
                        .details { margin-bottom: 15px; }
                        .label { font-weight: bold; color: #666; }
                        .value { font-size: 16px; }
                    </style>
                </head>
                <body>
                    <div class="ticket">
                        <div class="header">
                            <h2 style="color: #e06a16;">Café Motivation GO'UP</h2>
                            <h3>${ticketData.reference}</h3>
                            <hr>
                        </div>
                        
                        <div class="qr-code">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketData.reference}" alt="QR Code">
                        </div>
                        
                        <div class="details">
                            <div class="label">Nom:</div>
                            <div class="value">${ticketData.nom}</div>
                        </div>
                        
                        <div class="details">
                            <div class="label">Type:</div>
                            <div class="value">${ticketData.type_ticket}</div>
                        </div>
                        
                        <div class="details">
                            <div class="label">Montant:</div>
                            <div class="value">${ticketData.prix.toLocaleString('fr-FR')} F CFA</div>
                        </div>
                        
                        <div class="details">
                            <div class="label">Date de l'événement:</div>
                            <div class="value">14 Février 2026, 17h00</div>
                        </div>
                        
                        <div class="details">
                            <div class="label">Lieu:</div>
                            <div class="value">Dakar, Sénégal</div>
                        </div>
                        
                        <hr>
                        <p style="text-align: center; font-size: 12px; color: #666; margin-top: 20px;">
                            Présentez ce ticket à l'entrée de l'événement<br>
                            ou scannez le QR Code
                        </p>
                    </div>
                </body>
                </html>
            `;
            
            // Créer un blob et déclencher le téléchargement
            const blob = new Blob([ticketContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ticket-goup-${ticketData.reference}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Feedback
            $(this).html('<i class="fas fa-check me-2"></i>Ticket téléchargé !');
            $(this).removeClass('btn-primary').addClass('btn-success');
            
            setTimeout(() => {
                $(this).html('<i class="fas fa-download me-2"></i>Télécharger le ticket');
                $(this).removeClass('btn-success').addClass('btn-primary');
            }, 3000);
        }
    });

    // Charger les données du ticket
    loadTicketData();
});