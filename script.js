// CONFIGURAÇÃO FIREBASE
const firebaseConfig = {
    databaseURL: "https://pesquisa-eleitoral-26-default-rtdb.firebaseio.com/" 
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// FUNÇÃO DE VOTO
function processarVoto(candidato) {
    document.getElementById('ads-modal').style.display = 'flex';
    
    // Simulação do tempo de vídeo (Troque pelo código da sua rede de anúncios aqui)
    setTimeout(() => {
        db.ref('eleicao/' + candidato).transaction((current) => {
            return (current || 0) + 1;
        });
        document.getElementById('ads-modal').style.display = 'none';
    }, 5000); 
}

// ATUALIZAÇÃO EM TEMPO REAL
db.ref('eleicao').on('value', (snapshot) => {
    const d = snapshot.val() || { lula: 0, flavio: 0 };
    const total = d.lula + d.flavio;
    const pLula = total > 0 ? ((d.lula / total) * 100).toFixed(1) : 50;
    const pFlavio = (100 - pLula).toFixed(1);

    document.getElementById('barra-lula').style.width = pLula + "%";
    document.getElementById('barra-lula').innerText = pLula + "%";
    document.getElementById('barra-flavio').style.width = pFlavio + "%";
    document.getElementById('barra-flavio').innerText = pFlavio + "%";
    document.getElementById('txt-lula').innerText = d.lula + " Votos";
    document.getElementById('txt-flavio').innerText = d.flavio + " Votos";
});

// COMPARTILHAR WHATSAPP
function shareWhatsApp() {
    const txtLula = document.getElementById('txt-lula').innerText;
    const txtFlavio = document.getElementById('txt-flavio').innerText;
    const mensagem = encodeURIComponent(`📊 PESQUISA ELEITORAL 2026\nLula: ${txtLula}\nFlávio B: ${txtFlavio}\n\nVote agora: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${mensagem}`);

}
