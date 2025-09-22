// --- Variables Globales y Manejo de URL ---
let gameContainer;
let gameType; // 'gallery' o 'memory'

// URLs de tus imágenes para la galería
const galleryImages = [
    "image_1.png.png",
    "image_2.png.png",
    "image_3.png.png",
     "ono.png",
      "ona.jfif",
      "one.jfif",
      "oni.jfif",
    "onu.jfif",
"nono.jfif",];
let currentImageIndex = 0;
let slideshowInterval;

// --- Detección de página y carga de scripts ---
document.addEventListener('DOMContentLoaded', () => {
    const pagePath = window.location.pathname.split('/').pop();

    switch(pagePath) {
        case 'index.html':
            setGreeting();
            createFallingPetals();
            break;
        case 'home.html':
            createFallingPetals();
            break;
        case 'rompecabezas.html':
            gameType = 'gallery';
            setupGallery();
            break;
        case 'juego_memoria.html':
            gameType = 'memory';
            setupMemoryButtons();
            createMemoryGame();
            break;
        case 'flower_animation.html':
            startSunflowerAnimation();
            createFallingPetals();
            break;
        default:
            setGreeting();
            createFallingPetals();
            break;
    }
});

function setupMemoryButtons() {
    const animBtn = document.getElementById('memory-animation-btn');
    if (animBtn) animBtn.onclick = showMemoryAnimation;
}

// --- Lógica de la galería (rompecabezas.html) ---
function setupGallery() {
    const mainImage = document.getElementById('gallery-main-image');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');

    if (mainImage) {
        // Carga la primera imagen al iniciar
        mainImage.src = galleryImages[currentImageIndex];
    }
    
    // Asigna los manejadores de eventos
    if (prevBtn) prevBtn.onclick = showPrevImage;
    if (nextBtn) nextBtn.onclick = showNextImage;
    if (playPauseBtn) playPauseBtn.onclick = toggleSlideshow;
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateGalleryImage();
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateGalleryImage();
}

function updateGalleryImage() {
    const mainImage = document.getElementById('gallery-main-image');
    if (mainImage) {
        mainImage.src = galleryImages[currentImageIndex];
    }
}

function toggleSlideshow() {
    const playPauseBtn = document.getElementById('play-pause-btn');
    
    if (slideshowInterval) {
        // Si ya está reproduciéndose, la detenemos
        clearInterval(slideshowInterval);
        slideshowInterval = null;
        playPauseBtn.textContent = 'Reproducir';
    } else {
        // Si está detenida, la iniciamos
        slideshowInterval = setInterval(() => {
            showNextImage();
        }, 3000); // Cambia de imagen cada 3 segundos
        playPauseBtn.textContent = 'Pausar';
    }
}
// --- Lógica del saludo (index.html) ---
function setGreeting() {
    const greetingElement = document.getElementById('greeting');
    if (!greetingElement) return;

    const hour = new Date().getHours();
    const name = "Nicol";
    let greetingText;

    if (hour >= 5 && hour < 12) {
        greetingText = `¡Monitos días, ${name} 🌞!`;
    } else if (hour >= 12 && hour < 19) {
        greetingText = `¡Monitas tardes, ${name} 🌇!`;
    } else {
        greetingText = `¡Monitas noches, ${name} 🌙!`;
    }
    greetingElement.textContent = greetingText;
}

// --- Animación de pétalos que caen (global) ---
function createFallingPetals() {
    const fallingPetalsContainer = document.querySelector('.falling-petals');
    if (!fallingPetalsContainer) return;
    const numberOfPetals = 40;
    fallingPetalsContainer.innerHTML = ''; 

    for (let i = 0; i < numberOfPetals; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.animationDuration = `${(Math.random() * 10) + 5}s`;
        petal.style.animationDelay = `${Math.random() * 8}s`;
        const size = `${Math.random() * 15 + 15}px`;
        petal.style.width = size;
        petal.style.height = size;
        fallingPetalsContainer.appendChild(petal);
    }
}

// --- Lógica de la animación del girasol (flower_animation.html) ---
function startSunflowerAnimation() {
    const body = document.body;
    const skyBackground = document.getElementById('sky-background');
    const grassFloor = document.querySelector('.flower-animation-grass');
    const petalsContainer = document.getElementById('sunflower-petals-container');

    if (!skyBackground || !grassFloor || !petalsContainer) return;

    setTimeout(() => {
        body.style.backgroundColor = 'transparent';
        skyBackground.classList.add('show');
        grassFloor.classList.add('show');
    }, 500);

    const numPetals = 24;
    const petalBaseDelay = 4.5;
    for (let i = 0; i < numPetals; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal-piece');
        const angle = i * (360 / numPetals);
        petal.style.setProperty('--angle', `${angle}deg`);
        petal.style.animationDelay = `${petalBaseDelay + (i * 0.05)}s`;
        petalsContainer.appendChild(petal);
    }
}

// --- Modales ---
const gameModal = document.getElementById('game-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

function openModal(title, contentHtml) {
    if (gameModal) {
        modalTitle.textContent = title;
        modalBody.innerHTML = contentHtml;
        gameModal.style.display = 'flex';
    }
}

function closeModal() {
    if (gameModal) {
        gameModal.style.display = 'none';
    }
    if (gameType === 'memory') {
        resetMemoryBoard();
    }
}

// ----------------- Código para el Juego de Memoria -----------------
const flowerEmojis = [
    '🌼', '🌻', '🌸', '🌹', '🌷', '🌺', '🍀', '💐',
    '🌷', '🌻', '🌸', '🌹', '🌼', '🌺', '🍀', '💐'
];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;

function createMemoryGame() {
    gameContainer = document.getElementById('game-container');
    if (!gameContainer) return;
    gameContainer.innerHTML = '';
    matchedPairs = 0;
    
    cards = [...flowerEmojis].sort(() => 0.5 - Math.random());

    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">${emoji}</div>
            </div>
        `;
        card.addEventListener('click', flipCard);
        gameContainer.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMemoryMatch();
}

function checkForMemoryMatch() {
    const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    matchedPairs++;
    if (matchedPairs === flowerEmojis.length / 2) {
        setTimeout(() => {
            openModal(
                '¡Felicidades!',
                `<p>¡Has encontrado todas las parejas!</p>`
            );
        }, 500);
    }
    resetMemoryBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetMemoryBoard();
    }, 1000);
}

function resetMemoryBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

const memoryAnimationModal = document.getElementById('memory-animation-modal');
const flowerRainContainer = document.getElementById('flower-rain-container');

function showMemoryAnimation() {
    closeModal();
    if (!memoryAnimationModal) return;
    memoryAnimationModal.style.display = 'flex';
    flowerRainContainer.innerHTML = '';

    const rainEmojis = ['🌼', '🌻', '🌸', '🌹', '🌷', '🌺', '🍀', '💐'];
    const numRainFlowers = 100;

    for (let i = 0; i < numRainFlowers; i++) {
        const flower = document.createElement('span');
        flower.classList.add('rain-emoji');
        flower.textContent = rainEmojis[Math.floor(Math.random() * rainEmojis.length)];
        flower.style.left = `${Math.random() * 100}vw`;
        flower.style.animationDuration = `${(Math.random() * 4) + 3}s`;
        flower.style.animationDelay = `${Math.random() * 5}s`;
        flower.style.fontSize = `${Math.random() * 2 + 1.5}rem`;
        flowerRainContainer.appendChild(flower);
    }
}