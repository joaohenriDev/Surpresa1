const heartsLeft = document.querySelector('.hearts-left');
const heartsRight = document.querySelector('.hearts-right');
const button = document.getElementById('surpriseButton');
const finalMessage = document.getElementById('finalMessage');

// cria corações voando da esquerda
function shootHeartLeft() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.style.left = '10px';
  heart.style.bottom = `${Math.random() * 100 + 20}px`;
  heartsLeft.appendChild(heart);
  setTimeout(() => heart.remove(), 2500);
}

// cria corações voando da direita
function shootHeartRight() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.style.right = '10px';
  heart.style.bottom = `${Math.random() * 100 + 20}px`;
  heart.style.transform = 'scaleX(-1)';
  heartsRight.appendChild(heart);
  setTimeout(() => heart.remove(), 2500);
}

setInterval(shootHeartLeft, 600);
setInterval(shootHeartRight, 700);

// mostra mensagem final
button.addEventListener('click', () => {
  finalMessage.style.display = 'block';
  setTimeout(() => (finalMessage.style.opacity = '1'), 100);
  button.style.display = 'none';
});
