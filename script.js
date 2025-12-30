// 1. CONFIGURAÇÃO FIREBASE (Verifique se este link é o seu atual)
const firebaseConfig = {
    databaseURL: "https://pesquisa-eleitoral-26-default-rtdb.firebaseio.com/" 
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2. FUNÇÃO DE VOTO COM 5 SEGUNDOS
function processarVoto(candidato) {
    const modal = document.getElementById('ads-modal');
    const timerText = document.getElementById('timer-text');
    
    modal.style.display = 'flex';
    
    let segundos = 5; 
    timerText.innerText = `Validando voto... (${segundos}s)`;
    
    const intervalo = setInterval(() => {
        segundos--;
        if (timerText) timerText.innerText = `Validando voto... (${segundos}s)`;
        
        if (segundos <= 0) {
            clearInterval(intervalo);
            
            // Grava o voto no Firebase
            db.ref('eleicao/' + candidato).transaction((current) => {
                return (current || 0) + 1;
            });
            
            modal.style.display = 'none';
            alert("Voto computado!");
        }
    }, 1000);
}

// 3. ATUALIZAÇÃO EM TEMPO REAL (Garante que os números aparecem)
db.ref('eleicao').on('value', (snapshot) => {
    const d = snapshot.val() || { lula: 0, flavio: 0 };
    const vLula = d.lula || 0;
    const vFlavio = d.flavio || 0;
    const total = vLula + vFlavio;

    const pLula = total > 0 ? ((vLula / total) * 100).toFixed(1) : 50;
    const pFlavio = (100 - pLula).toFixed(1);

    // Atualiza as barras
    const barraL = document.getElementById('barra-lula');
    const barraF = document.getElementById('barra-flavio');
    if(barraL) { barraL.style.width = pLula + "%"; barraL.innerText = pLula + "%"; }
    if(barraF) { barraF.style.width = pFlavio + "%"; barraF.innerText = pFlavio + "%"; }
    
    // Atualiza os textos
    const txtL = document.getElementById('txt-lula');
    const txtF = document.getElementById('txt-flavio');
    if(txtL) txtL.innerText = vLula + " Votos";
    if(txtF) txtF.innerText = vFlavio + " Votos";
});
