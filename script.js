const heartsLeft = document.querySelector('.hearts-left');
const heartsRight = document.querySelector('.hearts-right');
const button = document.getElementById('surpriseButton');
const finalMessage = document.getElementById('finalMessage');
const secretArea = document.getElementById('secretArea');
const glitchTransition = document.getElementById('glitchTransition'); 
const body = document.body; 

// Função para criar um coração
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
    // 1. Mostra a mensagem final
    finalMessage.style.display = 'block';
    setTimeout(() => (finalMessage.style.opacity = '1'), 100);
    
    // 2. Esconde o botão após o clique
    button.style.display = 'none';

    // 3. Efeito visual temporário na cena (burst de glow)
    const scene = document.querySelector('.scene');
    scene.style.boxShadow = '0 0 40px 10px rgba(255, 105, 180, 1), 0 0 10px rgba(255, 105, 180, 1)';
    
    setTimeout(() => {
        scene.style.boxShadow = '0 0 30px rgba(255, 105, 180, 0.6), 0 0 5px rgba(255, 105, 180, 0.9)';
    }, 500);

    // ********** DELAY DE 90 SEGUNDOS (1 MINUTO E 30 SEGUNDOS) **********
    setTimeout(() => {
        // Esconde os elementos visíveis para a transição
        scene.style.opacity = '0';
        finalMessage.style.opacity = '0';
        
        // 1. Muda o fundo para preto e ativa a tela de glitch
        body.style.backgroundColor = 'black';
        body.style.backgroundImage = 'none';
        body.style.boxShadow = 'none';
        glitchTransition.classList.add('active'); 

        // 2. Após a animação de glitch (3 segundos), revela a área secreta
        setTimeout(() => {
            glitchTransition.classList.remove('active');
            glitchTransition.style.opacity = '0';
            
            // Retorna o fundo original
            body.style.backgroundColor = '';
            body.style.backgroundImage = '';
            body.style.boxShadow = '';
            
            // Garante que a área secreta esteja visível
            secretArea.style.display = 'block';
            scene.style.display = 'none'; 
            
            // Rola para a área secreta após a transição
            secretArea.scrollIntoView({ behavior: 'smooth' });

        }, 3000); // Duração do efeito de glitch (3 segundos)

    }, 30000); // <-- NOVO DELAY (90 segundos = 90000ms)
    // *************************************************************************
});