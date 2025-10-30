const heartsLeft = document.querySelector('.hearts-left');
const heartsRight = document.querySelector('.hearts-right');
const button = document.getElementById('surpriseButton');
const finalMessage = document.getElementById('finalMessage');
const secretArea = document.getElementById('secretArea');
const glitchTransition = document.getElementById('glitchTransition');
const body = document.body;

// --- ELEMENTOS ORAÇÕES E ROSAS ---
const openPrayersButton = document.getElementById('openPrayersButton');
const prayersArea = document.getElementById('prayersArea');
const tabButtons = document.querySelectorAll('.tab-button');
const countButtons = document.querySelectorAll('.count-button');
const decreaseButtons = document.querySelectorAll('.decrease-button'); 
const joaoCountSpan = document.getElementById('joaoCount');
const vitoriaCountSpan = document.getElementById('vitoriaCount');
const totalRosesSpan = document.getElementById('totalRoses');
const roseIconsContainer = document.getElementById('roseIcons'); 

const intentionsList = document.getElementById('intentionsList');
const newIntentionInput = document.getElementById('newIntentionInput');
const addIntentionButton = document.getElementById('addIntentionButton');

const prayersListContainer = document.getElementById('prayersListContainer');
const newPrayerInput = document.getElementById('newPrayerInput');
const addPrayerButton = document = document.getElementById('addPrayerButton');

// --- ELEMENTOS CAIXINHA DE SURPRESAS ---
const openSurpriseBoxButton = document.getElementById('openSurpriseBoxButton');
const surpriseBoxArea = document.getElementById('surpriseBoxArea');
const surpriseCards = document.querySelectorAll('.surprise-card');
const boxContent = document.getElementById('boxContent');


// --- VARIÁVEIS GLOBAIS PARA CONTEÚDO ALEATÓRIO (SORRIR) ---
let currentSurpriseContent = null;
let currentContentIndex = -1;

// --- VARIÁVEIS GLOBAIS DA CÂMERA (NOVO) ---
let cameraStream = null; // Armazena o stream da câmera para poder pará-lo


// --- FUNÇÕES DE PERSISTÊNCIA (localStorage) ---

let joaoCount = parseInt(localStorage.getItem('joaoRoses')) || 0;
let vitoriaCount = parseInt(localStorage.getItem('vitoriaRoses')) || 0;

function saveList(key, listElement) {
    // Busca o texto dentro do <span>, ignorando o botão ❌
    const items = Array.from(listElement.children).map(li => 
        li.querySelector('span') ? li.querySelector('span').textContent.trim() : li.textContent.trim().replace('❌', '')
    );
    localStorage.setItem(key, JSON.stringify(items));
}

function loadList(key, listElement) {
    const storedItems = JSON.parse(localStorage.getItem(key));
    if (storedItems) {
        listElement.innerHTML = '';
        storedItems.forEach(itemText => {
            createListItem(listElement, itemText, key);
        });
    }
}

function createListItem(listElement, text, storageKey) {
    const newLi = document.createElement('li');
    
    // Contêiner para o texto (garante que o texto possa ser mapeado)
    const itemText = document.createElement('span');
    itemText.textContent = text;
    newLi.appendChild(itemText);
    
    // Botão de exclusão (❌)
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.classList.add('delete-btn');
    
    deleteBtn.addEventListener('click', () => {
        newLi.remove(); 
        saveList(storageKey, listElement);
    });
    
    newLi.appendChild(deleteBtn);
    listElement.appendChild(newLi);
}


// --- LÓGICA PRINCIPAL E ANIMAÇÕES ---

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

    const container = document.querySelector(side === 'left' ? '.hearts-left' : '.hearts-right');
    if (container) {
        container.appendChild(heart);
    }
    
    setTimeout(() => heart.remove(), 2500);
}

// Inicia a animação dos corações
setInterval(() => createHeart('left'), 550);
setInterval(() => createHeart('right'), 650);

// Evento do botão principal "Clique aqui"
button.addEventListener('click', () => {
    // Para a câmera caso ela esteja ligada por algum motivo (Adicionado)
    if (cameraStream) stopCamera(); 

    // 1. Fase da mensagem final
    const scene = document.querySelector('.scene');
    
    finalMessage.style.display = 'block';
    setTimeout(() => (finalMessage.style.opacity = '1'), 100);
    button.style.display = 'none';

    scene.style.boxShadow = '0 0 40px 10px rgba(65, 105, 225, 1), 0 0 10px rgba(65, 105, 225, 1)';
    
    // 2. Fase da Transição Glitch
    setTimeout(() => {
        scene.style.opacity = '0';
        finalMessage.style.opacity = '0';
        
        // Aplica o estilo de transição ao body
        body.style.backgroundColor = '#000080';
        body.style.backgroundImage = 'none';
        body.style.boxShadow = 'none';
        glitchTransition.classList.add('active'); 

        // 3. Fase da Área Secreta
        setTimeout(() => {
            glitchTransition.classList.remove('active');
            glitchTransition.style.opacity = '0';
            
            // Remove estilos de transição do body
            body.style.backgroundColor = '';
            body.style.backgroundImage = '';
            body.style.boxShadow = '';
            
            secretArea.style.display = 'block';
            scene.style.display = 'none'; 
            
            secretArea.scrollIntoView({ behavior: 'smooth' });

        }, 3000); 

    }, 4000);
});


// --- LÓGICA DAS ABAS E VISIBILIDADE ---

// NOVO: Função para desligar o stream da câmera
function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        console.log("Câmera desligada.");
    }
}

// 1. Botão "Nossas Orações" - Alterna visibilidade
openPrayersButton.addEventListener('click', () => {
    const isHidden = prayersArea.style.display === 'none' || prayersArea.style.display === '';
    
    stopCamera(); // Desliga a câmera ao fechar/abrir outras abas (Adicionado)
    surpriseBoxArea.style.display = 'none'; // Esconde a caixinha ao abrir orações
    boxContent.style.display = 'none'; // Esconde o conteúdo da caixinha
    
    prayersArea.style.display = isHidden ? 'block' : 'none';
    
    if (isHidden) {
        prayersArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// 2. Botão "Caixinha de Surpresas" - Alterna visibilidade
openSurpriseBoxButton.addEventListener('click', () => {
    const isHidden = surpriseBoxArea.style.display === 'none' || surpriseBoxArea.style.display === '';
    
    stopCamera(); // Desliga a câmera ao fechar/abrir outras abas (Adicionado)
    prayersArea.style.display = 'none'; // Esconde a área de orações
    
    surpriseBoxArea.style.display = isHidden ? 'block' : 'none';
    
    if (isHidden) {
        surpriseBoxArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        boxContent.style.display = 'none'; 
        boxContent.innerHTML = '';
    }
});

// 3. Sistema de Abas dentro de Orações
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
    // Desliga a câmera quando clica nas abas de oração (Adicionado)
    stopCamera();
    
        tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        const targetTab = button.getAttribute('data-tab');
        document.getElementById(targetTab).classList.add('active');
    });
});


// --- LÓGICA DO CONTADOR DE ROSAS ---

function updateRosesDisplay(animateRose = false) {
    const totalRoses = joaoCount + vitoriaCount;

    joaoCountSpan.textContent = joaoCount;
    vitoriaCountSpan.textContent = vitoriaCount;
    totalRosesSpan.textContent = totalRoses;

    roseIconsContainer.innerHTML = '';
    for (let i = 0; i < totalRoses; i++) {
        const rose = document.createElement('span');
        rose.classList.add('rose-icon');
        rose.textContent = '🌹'; 
        
        if (animateRose && i === totalRoses - 1) {
            // Reinicia a animação ao adicionar uma nova rosa
            rose.style.animation = 'none';
            void rose.offsetWidth; // Força reflow/repaint
            rose.style.animation = 'rotateScale 1s ease-out forwards';
        } else {
            rose.style.animation = 'none';
        }

        roseIconsContainer.appendChild(rose);
    }
    
    localStorage.setItem('joaoRoses', joaoCount);
    localStorage.setItem('vitoriaRoses', vitoriaCount);
}

// Evento: Aumentar o Contador (Rezei!)
countButtons.forEach(button => {
    button.addEventListener('click', () => {
        const person = button.getAttribute('data-person');
        
        if (person === 'joao') {
            joaoCount++;
        } else if (person === 'vitoria') {
            vitoriaCount++;
        }
        
        const targetSpan = person === 'joao' ? joaoCountSpan : vitoriaCountSpan;
        targetSpan.style.transition = 'transform 0.1s, color 0.1s';
        targetSpan.style.transform = 'scale(1.2)';
        targetSpan.style.color = '#ff69b4';
        
        setTimeout(() => {
            targetSpan.style.transform = 'scale(1)';
            targetSpan.style.color = '#4169e1';
        }, 200);

        updateRosesDisplay(true); 
    });
});

// Evento: Diminuir o Contador (Menos Flor)
decreaseButtons.forEach(button => {
    button.addEventListener('click', () => {
        const person = button.getAttribute('data-person');
        
        if (person === 'joao' && joaoCount > 0) {
            joaoCount--;
        } else if (person === 'vitoria' && vitoriaCount > 0) {
            vitoriaCount--;
        } else {
            return;
        }

        const targetSpan = person === 'joao' ? joaoCountSpan : vitoriaCountSpan;
        targetSpan.style.transition = 'transform 0.1s, color 0.1s';
        targetSpan.style.transform = 'scale(0.8)';
        targetSpan.style.color = '#b0c4de';
        
        setTimeout(() => {
            targetSpan.style.transform = 'scale(1)';
            targetSpan.style.color = '#4169e1';
        }, 200);
        
        updateRosesDisplay(false);
    });
});


// --- LÓGICA DE ADICIONAR/EXCLUIR ORAÇÕES/INTENÇÕES ---

// Adicionar Novas Orações (Lista 1)
addPrayerButton.addEventListener('click', () => {
    const prayerText = newPrayerInput.value.trim();
    if (prayerText) {
        createListItem(prayersListContainer, prayerText, 'savedPrayers');
        saveList('savedPrayers', prayersListContainer);
        newPrayerInput.value = ''; 
    }
});

// Adicionar Intenções (Lista 3)
addIntentionButton.addEventListener('click', () => {
    const intentionText = newIntentionInput.value.trim();
    if (intentionText) {
        createListItem(intentionsList, intentionText, 'savedIntentions');
        saveList('savedIntentions', intentionsList);
        newIntentionInput.value = ''; 
    }
});


// --- FUNÇÃO PARA CONTEÚDO ALEATÓRIO (SORRIR) ---
function showRandomContent(content, forceIndex = -1) {
    // Inicializa ou garante que o conteúdo é do tipo random_content
    if (content.type !== "random_content") return;
    
    currentSurpriseContent = content; // Armazena o objeto completo
    
    // 1. Sorteia ou usa o índice forçado
    if (forceIndex === -1 || currentContentIndex === -1) {
        // Primeira abertura ou clique no botão
        currentContentIndex = Math.floor(Math.random() * content.contentList.length);
    } else {
        // Usa o índice que foi passado pela chamada (para manter o conteúdo ao fechar/abrir)
        currentContentIndex = forceIndex;
    }
    
    const randomItem = content.contentList[currentContentIndex];

    // 2. Cria o HTML de exibição com o botão de troca
    boxContent.innerHTML = `
        <h4 style="color:${content.color}; font-size:1.4rem; text-align:center; margin-bottom: 5px;">${content.title}</h4>
        <p style="text-align:center; font-style: italic; color:#888;">Categoria: ${randomItem.category} ${randomItem.emoji}</p>
        
        <hr style="border: 0; height: 1px; background: ${content.color}; margin: 15px 0;">
        
        <p style="color:#333; font-family:sans-serif; white-space: pre-wrap; font-size: 1.15rem; text-align:center; padding: 10px;">
            ${randomItem.text}
        </p>
        
        <div style="text-align:center; margin-top: 25px;">
            <button id="nextSurpriseButton" style="padding: 10px 20px; background-color: ${content.color}; color: black; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; transition: background-color 0.2s, transform 0.1s;">
                Quero Mais! 👉
            </button>
        </div>
    `;
    
    boxContent.style.display = 'block';
    
    // 3. Adiciona o Event Listener para o botão de troca
    const nextButton = document.getElementById('nextSurpriseButton');
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            // Chama a função novamente, forçando um novo sorteio
            showRandomContent(content, -1);
        });
    }

    boxContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// 2. Conteúdo de todas as caixinhas (Atualizado para live_camera_sequence)
const surpriseContent = {
    triste: {
        title: "Um Abraço em Palavras 🫂",
        text: "Meu amor, se está triste, lembra que até o sol sente falta do teu sorriso. Você é forte, incrível, e essa tristeza é passageira, você é luz, mesmo quando o mundo parece cinza. Sua presença colore os dias de quem te ama principlamente os meus. Quero te abraçar apertado quando puder. Enquanto isso, guarda essa lembrança no coração: “Tu te tornas eternamente responsável por aquilo que cativas.” 💛 — O Pequeno Príncipe",
        color: "#4682b4" // Azul Aço
    },
    sorrir: {
    title: "Dose de Gargalhadas 😂",
    color: "#ffd700", // Dourado
    type: "random_content", // Indica que esta caixinha usa a lógica de sorteio
    contentList: [
        // Conteúdo (mantido)
        { text: "O que o pato disse para a pata? Vem Quá! 😂", category: "Tiozão", emoji: "👴" },
        { text: "Por que o pinheiro não se perde na floresta? Porque ele tem uma pinha (mapa)! 🌲", category: "Tiozão", emoji: "🤦" },
        { text: "Qual é o doce preferido do átomo? Pé-de-molécula! 🍬", category: "Tiozão", emoji: "🧪" },
        { text: "Qual a cidade brasileira que não tem táxi? Uberlândia! 🚕", category: "Tiozão", emoji: "🇧🇷" },
        { text: "Como se chama a pessoa que viu o Thor de perto? Vi-Thor", category: "Tiozão", emoji: "🍽️" },
        { text: "Por que a velhinha não usa relógio? Porque ela é sem hora (senhora)", category: "Boa", emoji: "🤣" },
        { text: "Um homem vai ao médico e diz que está deprimido. A vida parece dura, cruel. O médico diz: 'O grande comediante Pagliacci está na cidade. Vá vê-lo. Isso deve animá-lo.' O homem começa a chorar: 'Mas doutor... eu sou Pagliacci.'", category: "Boa", emoji: "🎭" },
        { text: "Por que o astronauta se separou? Porque deu um vácuo na esposa!", category: "Boa", emoji: "🚀" },
        { text: "Doutor, como eu faço para emagrecer? Basta a senhora mover a cabeça da esquerda para a direita e da direita para a esquerda. Quantas vezes, doutor?  Todas as vezes que lhe oferecerem comida.", category: "Boa", emoji: "🌳" },
        { text: "Fui comprar um remédio e o farmacêutico perguntou se eu tinha receita. Respondi que se eu tivesse a receita, faria o remédio em casa.", category: "Boa", emoji: "🌌" },
        { text: "O seu sorriso parece ter a capacidade de consertar qualquer dia ruim.", category: "Cantada Fofa", emoji: "💖" },
        { text: "Você é tipo o pôr do sol: impossível de olhar sem sorrir.", category: "Cantada Fofa", emoji: "🪐" },
        { text: "Você tem um mapa? Porque acabei de me perder nos seus olhos. 👀", category: "Cantada Fofa", emoji: "🗺️" },
        { text: "Dizem que o amor é a coisa mais linda, mas nunca viram o seu sorriso. 😊", category: "Cantada Fofa", emoji: "😇" },
        { text: "Quando você ri, parece que o tempo tira um descanso pra apreciar também. Olha ai ele parando pra te ver agora", category: "Cantada Fofa", emoji: "💘" },
        { text: "Eu não sou fotógrafo, mas posso te enquadrar na minha vida fácil.", category: "Cantada Ruim-Boa", emoji: "💻" },
        { text: "Se eu fosse o clima, eu virava primavera só pra te ver florescer.", category: "Cantada Ruim-Boa", emoji: "🔨" }
    ]
},
    historia: {
        title: "A História do Nosso 'Era uma vez...' 📖",
        text: "🌹 Uma História de Princesa — mas diferente das outras \n Era uma vez… uma garota que acreditava que já sabia como a sua história de amor terminaria. \n Ela estava com alguém bom, alguém que parecia o certo — o tipo de amor que todo mundo olhava e dizia: “Eles nasceram um pro outro.” E por muito tempo, ela acreditou nisso também. Mas a vida, assim como nos contos de fadas, gosta de mudar o roteiro quando a gente menos espera. Um dia, sem aviso, alguém novo apareceu. Não era o príncipe perfeito que o reino esperava. Não tinha o brilho do que parecia seguro, nem o peso das promessas antigas. Mas tinha algo diferente: um olhar que dizia “eu te vejo”, um riso que fazia o mundo parecer mais leve, e uma presença que parecia encaixar no coração dela de um jeito que nada antes tinha encaixado. De repente, ela começou a se perguntar se o amor certo era aquele que todo mundo aprovava… ou aquele que fazia o coração bater mais forte, mesmo sem garantia de final feliz. Foi confuso. Foi bonito. E, acima de tudo, foi verdadeiro. Ela aprendeu que o amor não é sobre escolher quem faz sentido — é sobre quem faz sentir. E que às vezes, o que o mundo escreve não é o que o Deus espera… mas o que o coração precisava viver. E assim como nas histórias da Disney, onde o improvável se torna real, onde o novo traz coragem, e onde o amor muda tudo essa também é uma história de descoberta, coragem e encanto. Mas no final, entre todos os “era uma vez” e os “felizes para sempre”… existe uma diferença. Porque essa, meu bem, não é a história da Disney. 💫 É a nossa.",
        color: "#a9a9a9" // Cinza Escuro
    },
    motivar: {
        title: "Poder para o Futuro! ✨",
        text: "Você tem a força de um leão e a graça de uma rainha. Seus sonhos são válidos e seu esforço será recompensado. Lembre-se do seus projetos mas também lembre do nosso projeto, da nossa casa, do nosso futuro juntos. 'Tudo posso Naquele que me fortalece.' Vá e vença este dia! Estarei aqui te esperando e sempre rezando por você.",
        color: "#7cfc00" // Verde Grama
    },
    saudade: {
        title: "Um Beijo Virtual 💋",
        text: "Sentir saudade dói, mas é a prova de que o que temos é real. Feche os olhos, sinta meu beijo na sua testa e meu abraço apertado. Olhe para a nossa foto novamente e lembre-se: falta pouco para estarmos juntos de novo. Te amo muito!",
        color: "#ff69b4" // Rosa Choque
    },
    memoria: { 
        title: "Nosso Momento Congelado 📸",
        memoryDetails: {
            text: "Eu escolhi esse momento porque ele resume perfeitamente o que somos e o que buscamos juntos. 🌷 É como se cada pedacinho dessa lembrança fosse um lembrete do que nos uniu desde o começo: a nossa fé. Essa fé que não só nos conecta, mas também nos molda, nos transforma um pouquinho mais a cada dia.  E quando penso nisso, lembro exatamente o porquê de ter te escolhido. Porque quando minha fé vacilou e eu precisei de força, foi você quem apareceu suave, firme e cheio de amor pra me acordar e me lembrar que Deus sempre age através das pessoas certas. 💫",
            photo1: "memorias/v.jpg", 
            photo2: "memorias/j.jpg" 
        },
        color: "#00ced1" // Turquesa
    },
    pensamentos: {
        title: "Calma na Alma 🙏",
        text: "Quando a mente estiver acelerada, lembre-se desta oração: 'Jesus manso e humilde de coração, fazei o nosso coração semelhante ao Vosso'. Respire fundo. Desligue um pouco, confie em Deus e descanse em mim. Eu cuido de você.",
        color: "#4b0082" // Índigo
    },
    danca: {
        title: "Vamos Dançar! 💃🕺",
        text: "Coloque esta música . Mesmo longe, sinta-se dançando comigo. Feche os olhos, sorria e deixe a batida te levar. Nosso amor é a melhor coreografia! ",
        color: "#ff8c00", // Laranja Escuro
        spotifyLink: "https://open.spotify.com/playlist/1YyUil7xNDJUuNxHfOhOKk", // **MUDAR ESTE LINK!**
        actionMessage: "Preparei algo pra você ai acho que vai gostar"
    },
    carinho: {
        title: "Carinho Sem Fim 🤗",
        text: "Este é um vale-massagem virtual para ser usado na cabeça, nas mãos ou nos pés (eu farei quando estivermos juntos!). Enquanto isso, cubra-se com um cobertor, coloque uma música relaxante e imagine minhas mãos fazendo aquele cafuné que você gosta. Você merece todo o carinho do mundo.",
        color: "#dda0dd" // Púrpura Claro
    },
    mim: {
        title: "Eu Estou Aqui, Sempre 💖",
        text: "Eu sou o seu porto seguro, o abrigo onde você sempre pode descansar. Se precisar de mim — a qualquer hora, por mensagem, por voz ou por um simples “oi” — eu estarei aqui. A minha vida é mais leve e mais bonita porque você existe nela. Nunca duvide: você nunca está sozinha. Te amo infinitamente, com todo o coração.",
        color: "#dc143c" // Carmesim
    },
    fofo: { // <-- ATUALIZADO COM DELAY E LÓGICA DE OCULTAR VÍDEO
        title: "Para Derreter o Coração 😇",
        color: "#ff1493", // Deep Pink
        type: "live_camera_sequence", 
        sequence: [
            {
                image: "fofo/personagem-fofo1.png", // Seu personagem 1
                text: "Oi, você por aqui?",
                delay: 2000 
            },
            {
                image: "fofo/personagem-fofo2.png", // Seu personagem 2
                text: "Ei, espere aí... só um momentinho!",
                delay: 3000 
            },
            {
                image: "fofo/personagem-fofo3.png", // Seu personagem 3 (com a câmera)
                text: "Xisss! Prontinho! Que fofura! Olha só como você é... ♥️",
                delay: 2500, // AUMENTADO: de 1500 para 2500
                capture: true // Flag para captura
            }
        ]
    },
    seu: {
        title: "Momento de Ouro Só Seu 👑",
        text: "Este é um momento de autocuidado. Pegue um chocolate, prepare um chá, e leia aquele livro. Desligue o celular (depois de ler isso, claro!). Lembre-se que você é prioridade na sua vida. Aproveite!",
        color: "#1e90ff" // Azul Royal
    }
};


surpriseCards.forEach(card => {
    card.addEventListener('click', (event) => {
        const boxId = card.getAttribute('data-box-id');
        const content = surpriseContent[boxId];
        
        // Garante que qualquer câmera anterior seja parada antes de abrir uma nova caixa
        stopCamera();
        boxContent.style.display = 'block';
        boxContent.innerHTML = '';
        boxContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        if (content) {
            
            // === TRATAMENTO PARA CAIXINHA "SORRIR" (Conteúdo Aleatório) ===
            if (boxId === "sorrir" && content.type === "random_content") {
                let indexToDisplay = -1; 
                if (boxContent.style.display === 'block' && currentSurpriseContent && currentSurpriseContent.type === "random_content") {
                    indexToDisplay = currentContentIndex;
                }
                showRandomContent(content, indexToDisplay);
                return; 
            }
            // =============================================================

            
            else if (boxId === "fofo" && content.type === "live_camera_sequence") {
                
                // NOVO HTML: REMOVIDO o elemento <video>
                boxContent.innerHTML = `
                    <h4 style="color:${content.color}; font-size:1.4rem; text-align:center; margin-bottom: 20px;">${content.title}</h4>
                    <div id="fofo-animation-container" style="text-align:center; min-height: 400px; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; overflow: hidden; border-radius: 10px; background: #fff0f5;">
                        <p id="fofo-status" style="font-style: italic; color: #888; margin-bottom: 10px;">Pedindo acesso à câmera...</p>

                        <canvas id="camera-canvas" style="display: none;"></canvas>
                        
                        <img id="fofo-final-photo" src="" alt="Sua Foto Fofa" style="position: absolute; width: 90%; max-width: 300px; height: auto; border-radius: 10px; box-shadow: 0 0 15px rgba(255, 20, 147, 0.8); opacity: 0; transition: opacity 0.5s ease-out; z-index: 10; background-color: #eee;"/>
                        
                        <img id="fofo-character-image" src="" alt="Personagem Fofo" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 100%; height: auto; z-index: 15; opacity: 0; transition: opacity 0.5s ease-out;">
                        <p id="fofo-text" style="position: absolute; bottom: 10px; background: rgba(255, 255, 255, 0.9); padding: 5px 10px; border-radius: 5px; font-weight: bold; color: #ff1493; opacity: 0; transition: opacity 0.3s ease-out; z-index: 15;"></p>
                    </div>`;

                const statusText = document.getElementById('fofo-status');
                const canvasElement = document.getElementById('camera-canvas');
                const characterImage = document.getElementById('fofo-character-image');
                const fofoText = document.getElementById('fofo-text');
                const finalPhoto = document.getElementById('fofo-final-photo');
                let sequenceIndex = 0;
                
                let tempVideo = null; // Variável para o elemento de vídeo temporário

                // Função para iniciar o stream da câmera
                async function startCamera() {
                    statusText.textContent = "Aguardando sua permissão...";
                    try {
                        // Força o uso da câmera frontal em dispositivos móveis
                        cameraStream = await navigator.mediaDevices.getUserMedia({ 
                            video: { facingMode: "user" } 
                        });
                        
                        // Cria o elemento de vídeo temporário
                        tempVideo = document.createElement('video'); // Atribui à variável de escopo mais amplo
                        tempVideo.srcObject = cameraStream;
                        tempVideo.autoplay = true;
                        tempVideo.muted = true;
                        tempVideo.playsinline = true;

                        tempVideo.onloadedmetadata = () => {
                            // Garante que o vídeo está pronto
                            tempVideo.play();
                            statusText.style.display = 'none';
                            
                            // Guarda as dimensões do vídeo para o canvas
                            canvasElement.videoWidth = tempVideo.videoWidth;
                            canvasElement.videoHeight = tempVideo.videoHeight;

                            playFofoSequence(tempVideo); // Passa o vídeo temporário
                        };

                    } catch (err) {
                        statusText.textContent = "Erro: Câmera não permitida ou não encontrada. 😥 (A animação continua sem a foto real)";
                        console.error("Erro ao acessar a câmera: ", err);
                        // Tenta prosseguir com a animação, mas sem a foto real
                        playFofoSequence(null); 
                    }
                }

                // Função para a animação sequencial e captura
                function playFofoSequence(videoElement) {
                    if (sequenceIndex < content.sequence.length) {
                        const currentFrame = content.sequence[sequenceIndex];

                        // Reseta a imagem/texto para nova animação
                        characterImage.style.opacity = 0;
                        fofoText.style.opacity = 0;
                        
                        // Atualiza a imagem e o texto
                        characterImage.src = currentFrame.image;
                        fofoText.textContent = currentFrame.text;

                        // Força reflow e animação
                        void characterImage.offsetWidth; 
                        void fofoText.offsetWidth;

                        // NOVO: Adiciona a classe de animação para revelar
                        characterImage.style.opacity = 1;
                        fofoText.style.opacity = 1;

                        // Captura a foto (o momento mais importante!)
                        if (currentFrame.capture && cameraStream && videoElement) {
                            
                            // 1. Configura o Canvas com o tamanho exato do vídeo
                            canvasElement.width = canvasElement.videoWidth;
                            canvasElement.height = canvasElement.videoHeight;
                            const ctx = canvasElement.getContext('2d');
                            
                            // 2. Desenha o frame do vídeo no canvas e inverte
                            ctx.save(); 
                            ctx.translate(canvasElement.width, 0); 
                            ctx.scale(-1, 1); 
                            ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
                            ctx.restore(); 

                            // 3. Converte o canvas em uma imagem Data URL
                            const photoDataUrl = canvasElement.toDataURL('image/png');
                            
                            // Adiciona um flash rápido (simulação de foto)
                            boxContent.style.transition = 'filter 0.1s';
                            boxContent.style.filter = 'brightness(2)';
                            
                            // 4. Revela a foto após o flash
                            setTimeout(() => {
                                boxContent.style.filter = 'brightness(1)';
                                boxContent.style.transition = ''; // Remove a transição depois

                                // Esconde os elementos da animação
                                characterImage.style.display = 'none'; 
                                fofoText.style.display = 'none'; 

                                // REVELA A FOTO FINAL
                                finalPhoto.src = photoDataUrl;
                                finalPhoto.style.width = '90%'; 
                                finalPhoto.style.maxWidth = '300px'; 
                                finalPhoto.style.height = 'auto'; 
                                finalPhoto.style.opacity = 1; 

                                stopCamera(); // Desliga a câmera somente após a captura e revelação!
                                
                            }, 300); // Tempo para o flash e transição
                            
                            // Não faz a chamada recursiva de playFofoSequence, pois esta é a última etapa.
                            return;

                        }
                        
                        sequenceIndex++;
                        // AQUI ESTÁ O AJUSTE: chama a próxima etapa APENAS se não for o frame de captura.
                        // Se for o frame de captura, a revelação da foto cuida da interrupção.
                        if (!currentFrame.capture) { 
                            setTimeout(() => playFofoSequence(videoElement), currentFrame.delay); 
                        }
                    } else {
                        // Fim da sequência (se a captura ocorreu, a foto já foi exibida)
                        characterImage.style.display = 'none'; 
                        fofoText.style.display = 'none'; 
                    }
                }
                
                startCamera();        
                return; 
            }
            
            
            // === TRATAMENTO PARA OUTRAS CAIXINHAS (Texto, Memória, Dança) ===
            
            if (boxId === "memoria" && content.memoryDetails) {
                const details = content.memoryDetails;
                extraContent = `
                    <style>
                        /* Animação simples para as fotos */
                        @keyframes fadeInSlide {
                            from { opacity: 0; transform: translateY(10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    </style>
                    <div style="display: flex; justify-content: space-around; margin: 20px 0;">
                        <img src="${details.photo1}" style="width: 45%; max-width: 150px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); animation: fadeInSlide 1s ease-out 0.5s forwards; opacity: 0;" alt="Nossa Foto 1">
                        <img src="${details.photo2}" style="width: 45%; max-width: 150px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); animation: fadeInSlide 1s ease-out 1s forwards; opacity: 0;" alt="Nossa Foto 2">
                    </div>
                    <hr style="border: 0; height: 1px; background: ${content.color}; margin: 15px 0;">
                    <p style="text-align:center; font-style: italic; color:#888; padding: 10px;">Leia com carinho:</p>`;
            } else if (boxId === "danca" && content.spotifyLink) {
                extraContent = `
                    <p style="text-align:center; font-style: italic; color:${content.color}; margin-top: 15px;">${content.actionMessage}</p>
                    <div style="text-align:center; margin: 20px 0;">
                        <a href="${content.spotifyLink}" target="_blank" style="padding: 10px 20px; background-color: ${content.color}; color: black; border: none; border-radius: 50px; font-weight: bold; text-decoration: none; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
                            Tocar Música Agora! 🎶
                        </a>
                    </div>
                    <hr style="border: 0; height: 1px; background: ${content.color}; margin: 15px 0;">`;
            }
            
            // Monta o conteúdo final para caixinhas de texto/memória/música
            if (boxId !== "memoria" && boxId !== "danca") { // Se não for Memória ou Dança, apenas texto puro
                 extraContent = `<hr style="border: 0; height: 1px; background: ${content.color}; margin: 15px 0;">`;
            }

            boxContent.innerHTML = `
                <h4 style="color:${content.color}; font-size:1.4rem; text-align:center;">${content.title}</h4>
                ${extraContent}
                <p style="color:#333; font-family:sans-serif; white-space: pre-wrap; font-size: 1.15rem; text-align:justify; padding: 10px;">
                    ${content.text}
                </p>
            `;

            
        } else {
            boxContent.innerHTML = '<p style="text-align:center; color:red;">Conteúdo não encontrado para esta surpresa. 😢</p>';
        }
    });
});


// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    // Carrega os contadores de rosas
    updateRosesDisplay(); 
    
    // Carrega as listas salvas
    loadList('savedPrayers', prayersListContainer);
    loadList('savedIntentions', intentionsList);
    
    // Configura o estado inicial da primeira aba ativa
    const defaultTabButton = document.querySelector('.tab-button[data-tab="tab1"]');
    if (defaultTabButton) {
        defaultTabButton.classList.add('active');
        document.getElementById('tab1').classList.add('active');
    }
});