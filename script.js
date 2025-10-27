const heartsLeft = document.querySelector('.hearts-left');
const heartsRight = document.querySelector('.hearts-right');
const button = document.getElementById('surpriseButton');
const finalMessage = document.getElementById('finalMessage');
const secretArea = document.getElementById('secretArea');
const glitchTransition = document.getElementById('glitchTransition');
const body = document.body;

// NOVOS ELEMENTOS
const openPrayersButton = document.getElementById('openPrayersButton');
const prayersArea = document.getElementById('prayersArea');
const tabButtons = document.querySelectorAll('.tab-button');
const countButtons = document.querySelectorAll('.count-button');
const joaoCountSpan = document.getElementById('joaoCount');
const vitoriaCountSpan = document.getElementById('vitoriaCount');
const totalRosesSpan = document.getElementById('totalRoses');
const roseIconsContainer = document.getElementById('roseIcons'); // Novo container para os ícones
const intentionsList = document.getElementById('intentionsList');
const newIntentionInput = document.getElementById('newIntentionInput');
const addIntentionButton = document.getElementById('addIntentionButton');

// NOVOS ELEMENTOS PARA ADICIONAR ORAÇÃO
const prayersListContainer = document.getElementById('prayersListContainer');
const newPrayerInput = document.getElementById('newPrayerInput');
const addPrayerButton = document.getElementById('addPrayerButton');

// Estado Inicial dos Contadores (Usando localStorage para persistir)
let joaoCount = parseInt(localStorage.getItem('joaoRoses')) || 0;
let vitoriaCount = parseInt(localStorage.getItem('vitoriaRoses')) || 0;


// Função para criar um coração (mantida)
function createHeart(side) {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    
    if (side === 'left') {
        heart.style.left = `${Math.random() * 50}px`;
    } else {
        heart.style.right = `${Math.random() * 50}px`;
        heart.style.transform = 'scaleX(-1)';
    }

    heart.style.bottom = `${Math.random() * 50}px`;

    if (side === 'left') {
        heartsLeft.appendChild(heart);
    } else {
        heartsRight.appendChild(heart);
    }
    
    setTimeout(() => heart.remove(), 2500);
}

// Cria corações voando continuamente
setInterval(() => createHeart('left'), 550);
setInterval(() => createHeart('right'), 650);


// Evento de clique no botão "Clique aqui"
button.addEventListener('click', () => {
    // 1. Exibe a mensagem final e inicia o fade in
    finalMessage.style.display = 'block';
    setTimeout(() => (finalMessage.style.opacity = '1'), 100);
    
    button.style.display = 'none';

    const scene = document.querySelector('.scene');
    // Cores marianas no glow
    scene.style.boxShadow = '0 0 40px 10px rgba(65, 105, 225, 1), 0 0 10px rgba(65, 105, 225, 1)';
    
    // 2. Após 4 segundos (tempo para leitura), inicia o fade out da cena e mensagem
    setTimeout(() => {
        scene.style.opacity = '0';
        finalMessage.style.opacity = '0';
        
        // 3. Inicia o Glitch (tela preta)
        body.style.backgroundColor = '#000080';
        body.style.backgroundImage = 'none';
        body.style.boxShadow = 'none';
        glitchTransition.classList.add('active'); 

        // 4. Após 3 segundos de Glitch, revela a área secreta
        setTimeout(() => {
            glitchTransition.classList.remove('active');
            glitchTransition.style.opacity = '0';
            
            // Retorna ao fundo original mariano
            body.style.backgroundColor = '';
            body.style.backgroundImage = '';
            body.style.boxShadow = '';
            
            // REVELA A ÁREA SECRETA
            secretArea.style.display = 'block';
            scene.style.display = 'none'; 
            
            secretArea.scrollIntoView({ behavior: 'smooth' });

        }, 3000); // Duração do Glitch (3 segundos)

    }, 4000); // Tempo de espera da mensagem (4 segundos)
});


// 1. Botão "Nossas Orações" - Alterna visibilidade
openPrayersButton.addEventListener('click', () => {
    const isHidden = prayersArea.style.display === 'none' || prayersArea.style.display === '';
    prayersArea.style.display = isHidden ? 'block' : 'none';
    
    if (isHidden) {
        prayersArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// 2. Sistema de Abas
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        const targetTab = button.getAttribute('data-tab');
        document.getElementById(targetTab).classList.add('active');
    });
});


// 3. Contador de Rosas e Ícones Dinâmicos
function updateRosesDisplay(animateRose = false) {
    const totalRoses = joaoCount + vitoriaCount;

    // Atualiza os números
    joaoCountSpan.textContent = joaoCount;
    vitoriaCountSpan.textContent = vitoriaCount;
    totalRosesSpan.textContent = totalRoses;

    // Recria os ícones de rosa
    roseIconsContainer.innerHTML = '';
    for (let i = 0; i < totalRoses; i++) {
        const rose = document.createElement('span');
        rose.classList.add('rose-icon');
        rose.textContent = '🌹'; 
        
        // Animação apenas para a última rosa adicionada
        if (animateRose && i === totalRoses - 1) {
            rose.style.animation = 'rotateScale 1s ease-out forwards';
        } else {
            // Remove a animação para as rosas que já existiam
            rose.style.animation = 'none';
        }

        roseIconsContainer.appendChild(rose);
    }
    
    // Salva no localStorage para persistir (se quiser que zere todo dia, remova esta linha)
    localStorage.setItem('joaoRoses', joaoCount);
    localStorage.setItem('vitoriaRoses', vitoriaCount);
}

countButtons.forEach(button => {
    button.addEventListener('click', () => {
        const person = button.getAttribute('data-person');
        
        if (person === 'joao') {
            joaoCount++;
        } else if (person === 'vitoria') {
            vitoriaCount++;
        }
        
        // Efeito visual no número
        const targetSpan = person === 'joao' ? joaoCountSpan : vitoriaCountSpan;
        targetSpan.style.transition = 'transform 0.1s, color 0.1s';
        targetSpan.style.transform = 'scale(1.2)';
        targetSpan.style.color = '#ff69b4'; // Rosa para o "click"
        
        setTimeout(() => {
            targetSpan.style.transform = 'scale(1)';
            targetSpan.style.color = '#4169e1'; // Retorna ao Azul
        }, 200);

        // Atualiza a exibição das rosas e ANIMA a nova
        updateRosesDisplay(true); 
    });
});


// 4. Adicionar Novas Orações (Lista 1)
addPrayerButton.addEventListener('click', () => {
    const prayerText = newPrayerInput.value.trim();
    
    if (prayerText) {
        const newLi = document.createElement('li');
        newLi.textContent = prayerText;
        
        prayersListContainer.appendChild(newLi);
        newPrayerInput.value = ''; // Limpa o input
    }
});


// 5. Adicionar Intenções (Lista 3)
addIntentionButton.addEventListener('click', () => {
    const intentionText = newIntentionInput.value.trim();
    
    if (intentionText) {
        const newLi = document.createElement('li');
        newLi.textContent = intentionText;
        
        intentionsList.appendChild(newLi);
        newIntentionInput.value = ''; // Limpa o input
    }
});

// Inicializa o display do contador
updateRosesDisplay(false);