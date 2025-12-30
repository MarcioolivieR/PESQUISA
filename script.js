// CONFIGURAÇÃO FIREBASE
const firebaseConfig = {
    databaseURL: "https://pesquisa-eleitoral-26-default-rtdb.firebaseio.com/" 
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function processarVoto(candidato) {
    const modal = document.getElementById('ads-modal');
    const timerText = document.getElementById('timer-text');
    modal.style.display = 'flex';
    
    // Tempo configurado para 5 segundos
    let segundos = 5; 
    timerText.innerText = `Validando voto... (${segundos}s)`;
    
    const intervalo = setInterval(() => {
        segundos--;
        timerText.innerText = `Validando voto... (${segundos}s)`;
        
        if (segundos <= 0) {
            clearInterval(intervalo);
            
            // Grava o voto no Firebase
            db.ref('eleicao/' + candidato).transaction((current) => {
                return (current || 0) + 1;
            });
            
            modal.style.display = 'none';
            alert("Voto computado com sucesso!");
            // Removido: window.open (Não abre mais nova aba aqui)
        }
    }, 1000);
}

function compartilharNoWhatsApp() {
    const txtLula = document.getElementById('txt-lula').innerText;
    const txtFlavio = document.getElementById('txt-flavio').innerText;
    
    // O link que as pessoas clicam no WhatsApp ainda pode ser o seu Smartlink para você ganhar dinheiro
    const linkParaCompartilhar = "https://www.effectivegatecpm.com/rmu8vqeh?key=b8088e997b2949271ed8a05e98b980d5";
    
    const mensagem = encodeURIComponent(
        `📊 *PESQUISA ELEITORAL 2026*\n\n` +
        `🔴 Lula: ${txtLula}\n` +
        `🔵 Flávio B: ${txtFlavio}\n\n` +
        `🗳️ *VOTE VOCÊ TAMBÉM:* ${linkParaCompartilhar}`
    );
    window.open(`https://api.whatsapp.com/send?text=${mensagem}`, '_blank');
}

// Atualização do Placar em Tempo Real
db.ref('eleicao').on('value', (snapshot) => {
    const d = snapshot.val() || { lula: 0, flavio: 0 };
    const total = (d.lula || 0) + (d.flavio || 0);
    const pLula = total > 0 ? ((d.lula / total) * 100).toFixed(1) : 50;
    const pFlavio = (100 - pLula).toFixed(1);

    document.getElementById('barra-lula').style.width = pLula + "%";
    document.getElementById('barra-lula').innerText = pLula + "%";
    document.getElementById('barra-flavio').style.width = pFlavio + "%";
    document.getElementById('barra-flavio').innerText = pFlavio + "%";
    document.getElementById('txt-lula').innerText = (d.lula || 0) + " Votos";
    document.getElementById('txt-flavio').innerText = (d.flavio || 0) + " Votos";
});
