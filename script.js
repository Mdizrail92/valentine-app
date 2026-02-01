document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Cursor ---
    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // --- Particle System ---
    const particlesContainer = document.getElementById('particles-container');
    const particleCount = 40;

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Randomly pick heart or star/dot
        const isHeart = Math.random() > 0.4;
        particle.innerHTML = isHeart ? '❤️' : '✨';
        particle.style.fontSize = Math.random() * 15 + 10 + 'px';

        // Random position and animation properties
        particle.style.left = Math.random() * 100 + 'vw';
        const duration = Math.random() * 10 + 10;
        particle.style.setProperty('--duration', duration + 's');
        particle.style.opacity = Math.random() * 0.5 + 0.2;

        particlesContainer.appendChild(particle);

        // Remove after animation completes
        setTimeout(() => {
            particle.remove();
            createParticle();
        }, duration * 1000);
    }

    for (let i = 0; i < particleCount; i++) {
        setTimeout(createParticle, Math.random() * 5000);
    }

    // --- Typing Effect ---
    const landingText = document.getElementById('landing-text');
    const textToType = "Hi Dita…\nI made something special just for you 💕";
    let index = 0;

    function typeWriter() {
        if (index < textToType.length) {
            landingText.innerHTML += textToType.charAt(index) === '\n' ? '<br>' : textToType.charAt(index);
            index++;
            setTimeout(typeWriter, 80);
        }
    }
    setTimeout(typeWriter, 1000);

    // --- Navigation Flow ---
    const sections = {
        landing: document.getElementById('landing'),
        emotional: document.getElementById('emotional-message'),
        question: document.getElementById('valentine-question'),
        success: document.getElementById('success-section')
    };

    function showSection(sectionKey) {
        Object.values(sections).forEach(s => s.classList.remove('active'));
        setTimeout(() => {
            Object.values(sections).forEach(s => s.classList.add('hidden'));
            sections[sectionKey].classList.remove('hidden');
            setTimeout(() => {
                sections[sectionKey].classList.add('active');

                // Trigger specific section animations
                if (sectionKey === 'emotional') triggerEmotionalLines();
            }, 50);
        }, 1000);
    }

    // 1️⃣ Landing -> Emotional
    document.getElementById('begin-btn').addEventListener('click', () => {
        showSection('emotional');
    });

    // 2️⃣ Emotional Section Logic
    function triggerEmotionalLines() {
        const lines = document.querySelectorAll('.fade-in-line');
        const nextBtn = document.getElementById('next-btn');

        lines.forEach((line, i) => {
            setTimeout(() => {
                line.classList.add('visible');
                if (i === lines.length - 1) {
                    setTimeout(() => {
                        nextBtn.classList.remove('hidden');
                    }, 1000);
                }
            }, i * 2500);
        });
    }

    document.getElementById('next-btn').addEventListener('click', () => {
        showSection('question');
    });

    // 3️⃣ Valentine Question Logic (No Button Move)
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    let yesScale = 1;

    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('click', moveNoButton); // Just in case of fast clicks

    function moveNoButton() {
        const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
        const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);

        noBtn.style.position = 'fixed';
        noBtn.style.left = x + 'px';
        noBtn.style.top = y + 'px';

        // Grow YES button
        yesScale += 0.15;
        yesBtn.style.transform = `scale(${yesScale})`;

        // Increase glow
        const glowIntensity = (yesScale - 1) * 10;
        yesBtn.style.boxShadow = `0 0 ${glowIntensity * 2}px var(--primary)`;
    }

    // 4️⃣ Yes Click Surprise
    yesBtn.addEventListener('click', () => {
        // Confetti burst
        createConfetti();

        sections.question.classList.remove('active');
        setTimeout(() => {
            sections.question.classList.add('hidden');
            sections.success.classList.remove('hidden');
            sections.success.classList.add('active');
            sections.success.classList.add('active-stars');

            // Add extra particles for success
            for (let i = 0; i < 50; i++) setTimeout(createParticle, i * 50);
        }, 500);
    });

    function createConfetti() {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.innerHTML = ['❤️', '💖', '✨', '🌸'][Math.floor(Math.random() * 4)];
            confetti.style.position = 'fixed';
            confetti.style.left = '50%';
            confetti.style.top = '50%';
            confetti.style.fontSize = Math.random() * 20 + 10 + 'px';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';

            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 15 + 5;
            const tx = Math.cos(angle) * velocity * 20;
            const ty = Math.sin(angle) * velocity * 20;

            document.body.appendChild(confetti);

            confetti.animate([
                { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.5)`, opacity: 0 }
            ], {
                duration: Math.random() * 1000 + 1500,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            }).onfinish = () => confetti.remove();
        }
    }

    // 5️⃣ Final Surprise Modal
    const modal = document.getElementById('love-modal');
    const heartTrigger = document.getElementById('heart-trigger');
    const closeBtn = document.querySelector('.close-modal');

    heartTrigger.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
});
