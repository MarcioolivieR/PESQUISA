// 1. CONFIGURAÇÃO OFICIAL MATOSTECNOLOGIAS
const firebaseConfig = {
    databaseURL: "https://pesquisa-eleitoral-26-default-rtdb.firebaseio.com/" 
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2. FUNÇÃO DE VOTO COM "PEDÁGIO" DE VÍDEO
function processarVoto(candidato) {
    const modal = document.getElementById('ads-modal');
    modal.style.display = 'flex';
    
    // Simulação do tempo de anúncio de 5 segundos
    // Aqui você integraria o link da sua rede de anúncios (Adsterra, etc)
    setTimeout(() => {
        db.ref('eleicao/' + candidato).transaction((current) => {
            return (current || 0) + 1;
        });
        modal.style.display = 'none';
    }, 5000); 
}

// 3. ATUALIZAÇÃO AUTOMÁTICA EM TEMPO REAL PARA TODOS OS USUÁRIOS
db.ref('eleicao').on('value', (snapshot) => {
    const d = snapshot.val() || { lula: 0, flavio: 0 };
    const vLula = d.lula || 0;
    const vFlavio = d.flavio || 0;
    const total = vLula + vFlavio;

    // Cálculo das porcentagens
    const pLula = total > 0 ? ((vLula / total) * 100).toFixed(1) : 50;
    const pFlavio = (100 - pLula).toFixed(1);

    // Atualização dos elementos na tela
    document.getElementById('barra-lula').style.width = pLula + "%";
    document.getElementById('barra-lula').innerText = pLula + "%";
    document.getElementById('barra-flavio').style.width = pFlavio + "%";
    document.getElementById('barra-flavio').innerText = pFlavio + "%";
    
    document.getElementById('txt-lula').innerText = vLula + " Votos";
    document.getElementById('txt-flavio').innerText = vFlavio + " Votos";
});

// 4. FUNÇÃO DE COMPARTILHAMENTO VIRAL
function shareWhatsApp() {
    const txtLula = document.getElementById('txt-lula').innerText;
    const txtFlavio = document.getElementById('txt-flavio').innerText;
    const urlSite = window.location.href;

    const mensagem = encodeURIComponent(`📊 *PESQUISA ELEITORAL 2026*\n\n` +
                     `Veja como está o placar agora:\n` +
                     `🔴 Lula: ${txtLula}\n` +
                     `🔵 Flávio B.: ${txtFlavio}\n\n` +
                     `Dê o seu voto real aqui:\n${urlSite}`);

    window.open(`https://api.whatsapp.com/send?text=${mensagem}`, '_blank');
}
