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
    
    // REDUZIDO PARA 5 SEGUNDOS
    let segundos = 5; 
    timerText.innerText = `Validando voto... (${segundos}s)`;
    
    const intervalo = setInterval(() => {
        segundos--;
        timerText.innerText = `Validando voto... (${segundos}s)`;
        
        if (segundos <= 0) {
            clearInterval(intervalo);
            
            // Grava no Firebase
            db.ref('eleicao/' + candidato).transaction((current) => {
                return (current || 0) + 1;
            });
            
            modal.style.display = 'none';
            alert("Voto computado com sucesso!");

            // ESTRATÉGIA: Abre o Smartlink após o voto para lucro extra
            const smartlink = "https://www.effectivegatecpm.com/rmu8vqeh?key=b8088e997b2949271ed8a05e98b980d5";
            window.open(smartlink, '_blank');
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
