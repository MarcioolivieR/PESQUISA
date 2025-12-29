// 1. CONFIGURAÇÃO FIREBASE (Sua URL oficial)
const firebaseConfig = {
    databaseURL: "https://pesquisa-eleitoral-26-default-rtdb.firebaseio.com/" 
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2. FUNÇÃO DE VOTO COM VÍDEO OBRIGATÓRIO
function processarVoto(candidato) {
    // Seu link direto do Adsterra
    const linkAnuncio = "https://www.effectivegatecpm.com/ap9rha0va?key=ee18fecd01ee39d0d6d01c59f9be9f3b";
    
    // Abre o anúncio numa nova aba para gerar lucro
    window.open(linkAnuncio, '_blank');

    // Mostra o modal de carregamento
    const modal = document.getElementById('ads-modal');
    modal.style.display = 'flex';
    
    // Bloqueia a confirmação por 10 segundos
    let tempoRestante = 10;
    const textoModal = modal.querySelector('p');
    
    const contagem = setInterval(() => {
        tempoRestante--;
        textoModal.innerText = `Assista ao vídeo para validar seu voto... (${tempoRestante}s)`;
        
        if (tempoRestante <= 0) {
            clearInterval(contagem);
            
            // Grava o voto no banco de dados após a espera
            db.ref('eleicao/' + candidato).transaction((current) => {
                return (current || 0) + 1;
            });

            modal.style.display = 'none';
            textoModal.innerText = "O anúncio está rodando. Aguarde para computar seu voto real.";
            alert("Voto validado e computado com sucesso!");
        }
    }, 1000);
}

// 3. ATUALIZAÇÃO EM TEMPO REAL
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

// 4. COMPARTILHAR WHATSAPP
function shareWhatsApp() {
    const txtLula = document.getElementById('txt-lula').innerText;
    const txtFlavio = document.getElementById('txt-flavio').innerText;
    const mensagem = encodeURIComponent(`📊 PESQUISA ELEITORAL 2026\nLula: ${txtLula}\nFlávio B: ${txtFlavio}\n\nVote agora: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${mensagem}`);
}
