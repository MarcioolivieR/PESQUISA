// CONFIGURAÇÃO FIREBASE (Sua URL oficial)
const firebaseConfig = {
    databaseURL: "https://pesquisa-eleitoral-26-default-rtdb.firebaseio.com/" 
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// FUNÇÃO DE VOTO COM VÍDEO OBRIGATÓRIO
function processarVoto(candidato) {
    // 1. Abre o anúncio (Substitua as aspas abaixo pelo seu 'Direct Link' do Adsterra)
    const linkAnuncio = "COLE_AQUI_SEU_DIRECT_LINK_DO_ADSTERRA";
    window.open(linkAnuncio, '_blank');

    // 2. Mostra o modal de carregamento que já existe no seu HTML
    const modal = document.getElementById('ads-modal');
    modal.style.display = 'flex';
    
    // 3. Trava a confirmação por 10 segundos para obrigar a visualização
    let tempoRestante = 10;
    const textoModal = modal.querySelector('p');
    
    const contagem = setInterval(() => {
        tempoRestante--;
        textoModal.innerText = `Validando seu voto através do vídeo... (${tempoRestante}s)`;
        
        if (tempoRestante <= 0) {
            clearInterval(contagem);
            
            // 4. Grava no Firebase
            db.ref('eleicao/' + candidato).transaction((current) => {
                return (current || 0) + 1;
            });

            modal.style.display = 'none';
            textoModal.innerText = "O anúncio está rodando. Aguarde para computar seu voto real.";
            alert("Voto validado com sucesso!");
        }
    }, 1000);
}

// ATUALIZAÇÃO EM TEMPO REAL
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

// COMPARTILHAR WHATSAPP
function shareWhatsApp() {
    const txtLula = document.getElementById('txt-lula').innerText;
    const txtFlavio = document.getElementById('txt-flavio').innerText;
    const mensagem = encodeURIComponent(`📊 PESQUISA ELEITORAL 2026\nLula: ${txtLula}\nFlávio B: ${txtFlavio}\n\nVote agora: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${mensagem}`);
}
