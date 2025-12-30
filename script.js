// CONFIGURAÇÃO FIREBASE OFICIAL
const firebaseConfig = {
    databaseURL: "https://pesquisa-eleitoral-26-default-rtdb.firebaseio.com/" 
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// FUNÇÃO DE VOTO DIRETA (SEM ANÚNCIOS)
function processarVoto(candidato) {
    // Apenas mostra o modal de carregamento por 1 segundo para dar um feedback visual
    document.getElementById('ads-modal').style.display = 'flex';
    document.getElementById('ads-modal').querySelector('h3').innerText = "PROCESSANDO VOTO...";
    document.getElementById('ads-modal').querySelector('p').innerText = "Aguarde um instante.";

    setTimeout(() => {
        db.ref('eleicao/' + candidato).transaction((current) => {
            return (current || 0) + 1;
        });
        document.getElementById('ads-modal').style.display = 'none';
        alert("Voto computado com sucesso!");
    }, 1000); 
}

// ATUALIZAÇÃO EM TEMPO REAL
db.ref('eleicao').on('value', (snapshot) => {
    const d = snapshot.val() || { lula: 0, flavio: 0 };
    const vLula = d.lula || 0;
    const vFlavio = d.flavio || 0;
    const total = vLula + vFlavio;

    const pLula = total > 0 ? ((vLula / total) * 100).toFixed(1) : 50;
    const pFlavio = (100 - pLula).toFixed(1);

    document.getElementById('barra-lula').style.width = pLula + "%";
    document.getElementById('barra-lula').innerText = pLula + "%";
    document.getElementById('barra-flavio').style.width = pFlavio + "%";
    document.getElementById('barra-flavio').innerText = pFlavio + "%";
    
    document.getElementById('txt-lula').innerText = vLula + " Votos";
    document.getElementById('txt-flavio').innerText = vFlavio + " Votos";
});

// COMPARTILHAR WHATSAPP
function shareWhatsApp() {
    const txtLula = document.getElementById('txt-lula').innerText;
    const txtFlavio = document.getElementById('txt-flavio').innerText;
    const mensagem = encodeURIComponent(`📊 PESQUISA ELEITORAL 2026\nLula: ${txtLula}\nFlávio B: ${txtFlavio}\n\nVote agora: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${mensagem}`);
}
