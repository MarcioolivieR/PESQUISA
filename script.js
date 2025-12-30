// CONFIGURAÇÃO FIREBASE (Sua URL oficial)
const firebaseConfig = {
    databaseURL: "https://pesquisa-eleitoral-26-default-rtdb.firebaseio.com/" 
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function processarVoto(candidato) {
    const modal = document.getElementById('ads-modal');
    const timerText = document.getElementById('timer-text');
    
    // 1. Abre o Modal para focar no anúncio da SocialBar
    modal.style.display = 'flex';
    
    // 2. Contagem regressiva para obrigar a visualização
    let segundos = 15;
    const intervalo = setInterval(() => {
        segundos--;
        timerText.innerText = `Aguarde a validação do anúncio para computar seu voto real. (${segundos}s)`;
        
        if (segundos <= 0) {
            clearInterval(intervalo);
            
            // 3. Envia o voto ao Firebase
            db.ref('eleicao/' + candidato).transaction((current) => {
                return (current || 0) + 1;
            });
            
            // 4. Fecha o modal e avisa o usuário
            modal.style.display = 'none';
            alert("Voto validado e computado com sucesso!");
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
