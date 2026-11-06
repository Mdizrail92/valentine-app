document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Custom Glowing Cursor ---
    const cursor = document.getElementById('cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    }

    // --- 2. Ambient Particles & Floating Balloons ---
    const particlesContainer = document.getElementById('particles-container');
    const balloonsContainer = document.getElementById('balloons-container');

    const particleSymbols = ['✨', '⭐', '💖', '🌸', '💫', '🎉', '🕊️'];
    const balloonColors = ['🎈', '💖', '🎂', '✨', '🎈', '🎈'];

    function createParticle() {
        if (!particlesContainer) return;
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = particleSymbols[Math.floor(Math.random() * particleSymbols.length)];
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.fontSize = Math.random() * 14 + 12 + 'px';

        const duration = Math.random() * 8 + 8; // 8s - 16s
        particle.style.setProperty('--duration', duration + 's');
        particle.style.setProperty('--max-opacity', (Math.random() * 0.5 + 0.35).toFixed(2));

        particlesContainer.appendChild(particle);

        setTimeout(() => {
            particle.remove();
            createParticle();
        }, duration * 1000);
    }

    for (let i = 0; i < 35; i++) {
        setTimeout(createParticle, Math.random() * 4000);
    }

    function createBalloon() {
        if (!balloonsContainer) return;
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.textContent = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        balloon.style.left = Math.random() * 92 + 'vw';
        balloon.style.fontSize = Math.random() * 18 + 26 + 'px';

        const floatDuration = Math.random() * 8 + 12; // 12s - 20s
        balloon.style.setProperty('--float-duration', floatDuration + 's');

        balloonsContainer.appendChild(balloon);

        setTimeout(() => {
            balloon.remove();
            createBalloon();
        }, floatDuration * 1000);
    }

    for (let i = 0; i < 8; i++) {
        setTimeout(createBalloon, Math.random() * 8000);
    }

    // --- 3. Web Audio API Music Box / Melody Synthesizer ---
    let audioCtx = null;
    let isPlayingMelody = false;
    let melodyTimer = null;
    const musicBtn = document.getElementById('music-toggle');

    // Notes for "Happy Birthday" melody (Frequencies in Hz)
    const birthdayNotes = [
        { note: 261.63, dur: 350 }, // C4
        { note: 261.63, dur: 250 }, // C4
        { note: 293.66, dur: 600 }, // D4
        { note: 261.63, dur: 600 }, // C4
        { note: 349.23, dur: 600 }, // F4
        { note: 329.63, dur: 1000 },// E4
        { note: 0, dur: 300 },      // pause
        { note: 261.63, dur: 350 }, // C4
        { note: 261.63, dur: 250 }, // C4
        { note: 293.66, dur: 600 }, // D4
        { note: 261.63, dur: 600 }, // C4
        { note: 392.00, dur: 600 }, // G4
        { note: 349.23, dur: 1000 },// F4
        { note: 0, dur: 300 },      // pause
        { note: 261.63, dur: 350 }, // C4
        { note: 261.63, dur: 250 }, // C4
        { note: 523.25, dur: 600 }, // C5
        { note: 440.00, dur: 600 }, // A4
        { note: 349.23, dur: 600 }, // F4
        { note: 329.63, dur: 600 }, // E4
        { note: 293.66, dur: 800 }, // D4
        { note: 0, dur: 300 },      // pause
        { note: 466.16, dur: 350 }, // Bb4
        { note: 466.16, dur: 250 }, // Bb4
        { note: 440.00, dur: 600 }, // A4
        { note: 349.23, dur: 600 }, // F4
        { note: 392.00, dur: 600 }, // G4
        { note: 349.23, dur: 1200 },// F4
        { note: 0, dur: 800 }       // long pause before repeat
    ];

    function playTone(freq, duration) {
        if (!audioCtx || freq === 0) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            // Soft warm chime timbre
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + (duration / 1000) * 0.95);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration / 1000);
        } catch (e) {
            console.warn(e);
        }
    }

    function playMelodyLoop(index = 0) {
        if (!isPlayingMelody) return;
        const current = birthdayNotes[index];
        playTone(current.note, current.dur);

        melodyTimer = setTimeout(() => {
            if (isPlayingMelody) {
                const nextIdx = (index + 1) % birthdayNotes.length;
                playMelodyLoop(nextIdx);
            }
        }, current.dur);
    }

    function toggleMusic() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        isPlayingMelody = !isPlayingMelody;
        if (isPlayingMelody) {
            musicBtn.classList.add('playing');
            musicBtn.querySelector('.music-label').textContent = 'Melody: Playing 🎵';
            playMelodyLoop(0);
        } else {
            musicBtn.classList.remove('playing');
            musicBtn.querySelector('.music-label').textContent = 'Birthday Music';
            clearTimeout(melodyTimer);
        }
    }

    if (musicBtn) {
        musicBtn.addEventListener('click', toggleMusic);
    }

    // --- 4. Screen Transition Manager ---
    const screens = {
        landing: document.getElementById('birthday-landing'),
        tribute: document.getElementById('emotional-tribute'),
        special: document.getElementById('special-things'),
        cake: document.getElementById('birthday-cake-section'),
        question: document.getElementById('playful-question'),
        memory: document.getElementById('birthday-memory-section')
    };

    function transitionTo(targetScreenKey) {
        const currentScreen = document.querySelector('.screen.active');
        if (currentScreen) {
            currentScreen.classList.remove('active');
            setTimeout(() => {
                currentScreen.classList.add('hidden');
                const nextScreen = screens[targetScreenKey];
                if (nextScreen) {
                    nextScreen.classList.remove('hidden');
                    // Small timeout to allow display change before transition
                    requestAnimationFrame(() => {
                        nextScreen.classList.add('active');
                    });
                }
            }, 600);
        }
    }

    // --- 5. Act 1: Typewriter on Landing ---
    const typewriterEl = document.getElementById('birthday-typewriter');
    const textLines = [
        "Dearest Dita... 🌸",
        "Today is 6th November ✨",
        "The day a girl from Palembang changed my world. 🌏"
    ];
    let lineIdx = 0;
    let charIdx = 0;

    function runTypewriter() {
        if (!typewriterEl) return;
        if (lineIdx < textLines.length) {
            const currentLine = textLines[lineIdx];
            if (charIdx < currentLine.length) {
                if (charIdx === 0 && lineIdx > 0) {
                    typewriterEl.innerHTML += '<br>';
                }
                typewriterEl.innerHTML += currentLine.charAt(charIdx);
                charIdx++;
                setTimeout(runTypewriter, 50);
            } else {
                lineIdx++;
                charIdx = 0;
                setTimeout(runTypewriter, 500);
            }
        }
    }
    setTimeout(runTypewriter, 800);

    // Button: Start Journey -> Act 2 Tribute
    const startJourneyBtn = document.getElementById('start-journey-btn');
    if (startJourneyBtn) {
        startJourneyBtn.addEventListener('click', () => {
            transitionTo('tribute');
            setTimeout(revealTributeLines, 700);
        });
    }

    // --- 6. Act 2: Emotional Tribute Line Reveal ---
    function revealTributeLines() {
        const lines = document.querySelectorAll('#emotional-tribute .fade-line');
        const nextBtn = document.getElementById('to-reasons-btn');

        lines.forEach((line, i) => {
            setTimeout(() => {
                line.classList.add('visible');
                if (i === lines.length - 1 && nextBtn) {
                    setTimeout(() => {
                        nextBtn.classList.remove('hidden');
                        nextBtn.classList.add('scale-pop');
                    }, 1000);
                }
            }, i * 2200);
        });
    }

    const toReasonsBtn = document.getElementById('to-reasons-btn');
    if (toReasonsBtn) {
        toReasonsBtn.addEventListener('click', () => {
            transitionTo('special');
        });
    }

    // --- 7. Act 3: Best Things Interactive Cards ---
    const specialCards = document.querySelectorAll('.special-card');
    const revealedCountEl = document.getElementById('revealed-count');
    const toCakeBtn = document.getElementById('to-cake-btn');
    const flippedSet = new Set();

    specialCards.forEach(card => {
        card.addEventListener('click', () => {
            const cardIdx = card.getAttribute('data-index');
            card.classList.toggle('flipped');

            if (card.classList.contains('flipped')) {
                flippedSet.add(cardIdx);
                // Mini sparkle burst
                burstLittleSparkles(card);
            }

            if (revealedCountEl) {
                revealedCountEl.textContent = flippedSet.size;
            }

            if (flippedSet.size === 4 && toCakeBtn) {
                toCakeBtn.removeAttribute('disabled');
                toCakeBtn.classList.remove('disabled-btn');
                toCakeBtn.classList.add('scale-pop');
                document.getElementById('cards-counter').innerHTML = "✨ All 4 unlocked! Ready to celebrate! ✨";
            }
        });
    });

    if (toCakeBtn) {
        toCakeBtn.addEventListener('click', () => {
            transitionTo('cake');
        });
    }

    // --- 8. Act 4: Interactive Birthday Cake & Wish ---
    const interactiveCake = document.getElementById('interactive-cake');
    const flame = document.getElementById('flame');
    const smoke = document.getElementById('smoke');
    const cakeInstruction = document.getElementById('cake-instruction');
    const cakeSub = document.getElementById('cake-subinstruction');
    const wishCelebration = document.getElementById('wish-celebration');
    let candleBlown = false;

    if (interactiveCake) {
        interactiveCake.addEventListener('click', () => {
            if (candleBlown) return;
            candleBlown = true;

            // Blow flame
            flame.classList.add('blown-out');
            smoke.classList.remove('hidden');

            // Celebration sound chime
            playCelebrationChord();

            // Huge confetti burst
            spawnGrandConfetti(120);

            // Update text
            setTimeout(() => {
                cakeInstruction.textContent = "✨ Your Wish Is Sent To The Stars! ✨";
                cakeSub.textContent = "May every single wish you made today blossom into reality.";
                wishCelebration.classList.remove('hidden');
                wishCelebration.classList.add('scale-pop');
            }, 600);
        });
    }

    function playCelebrationChord() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        // Play an uplifting major chord (C - E - G - C)
        const chord = [261.63, 329.63, 392.00, 523.25, 659.25];
        chord.forEach((freq, idx) => {
            setTimeout(() => playTone(freq, 700), idx * 90);
        });
    }

    const toQuestionBtn = document.getElementById('to-question-btn');
    if (toQuestionBtn) {
        toQuestionBtn.addEventListener('click', () => {
            transitionTo('question');
        });
    }

    // --- 9. Act 5: Playful Question & Runaway Button ---
    const runawayBtn = document.getElementById('runaway-btn');
    const yesBirthdayBtn = document.getElementById('yes-birthday-btn');
    let yesScale = 1;

    function dodgeRunawayBtn() {
        if (!runawayBtn) return;
        const box = runawayBtn.parentElement;
        const boxRect = box.getBoundingClientRect();

        const maxX = window.innerWidth - runawayBtn.offsetWidth - 30;
        const maxY = window.innerHeight - runawayBtn.offsetHeight - 30;

        const randomX = Math.max(20, Math.random() * maxX);
        const randomY = Math.max(20, Math.random() * maxY);

        runawayBtn.style.position = 'fixed';
        runawayBtn.style.left = randomX + 'px';
        runawayBtn.style.top = randomY + 'px';

        // Playfully encourage YES
        const playfulPhrases = [
            "Are you sure, Dita? 😜",
            "Nice try! 🙈",
            "You know the answer! 😄",
            "It's Israil, isn't it? 💨",
            "Just say YES lah! 💖"
        ];
        runawayBtn.textContent = playfulPhrases[Math.floor(Math.random() * playfulPhrases.length)];

        // Grow YES button
        yesScale += 0.15;
        yesBirthdayBtn.style.transform = `scale(${yesScale})`;
        yesBirthdayBtn.style.boxShadow = `0 0 ${20 + yesScale * 10}px var(--primary-glow)`;
    }

    if (runawayBtn) {
        runawayBtn.addEventListener('mouseover', dodgeRunawayBtn);
        runawayBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            dodgeRunawayBtn();
        });
    }

    if (yesBirthdayBtn) {
        yesBirthdayBtn.addEventListener('click', () => {
            spawnGrandConfetti(150);
            playCelebrationChord();

            // Transition to memory
            transitionTo('memory');
        });
    }

    // --- 10. Act 6 & 7: Gift Box Trigger & Modal ---
    const giftBoxTrigger = document.getElementById('gift-box-trigger');
    const birthdayModal = document.getElementById('birthday-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalCelebrateBtn = document.getElementById('modal-celebrate-btn');

    if (giftBoxTrigger) {
        giftBoxTrigger.addEventListener('click', () => {
            birthdayModal.classList.add('active');
            birthdayModal.setAttribute('aria-hidden', 'false');
            spawnGrandConfetti(100);
            playCelebrationChord();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            birthdayModal.classList.remove('active');
            birthdayModal.setAttribute('aria-hidden', 'true');
        });
    }

    if (birthdayModal) {
        birthdayModal.addEventListener('click', (e) => {
            if (e.target === birthdayModal) {
                birthdayModal.classList.remove('active');
                birthdayModal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    if (modalCelebrateBtn) {
        modalCelebrateBtn.addEventListener('click', () => {
            spawnGrandConfetti(80);
            playCelebrationChord();
        });
    }

    // --- Confetti & Sparkle Utilities ---
    function spawnGrandConfetti(count = 80) {
        const emojis = ['🎉', '💖', '🎂', '✨', '🌸', '🎈', '⭐', '🎀', '💫'];

        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            confetti.style.position = 'fixed';
            confetti.style.left = '50%';
            confetti.style.top = '50%';
            confetti.style.fontSize = Math.random() * 22 + 14 + 'px';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '99999';

            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 20 + 8;
            const tx = Math.cos(angle) * velocity * 22;
            const ty = Math.sin(angle) * velocity * 22 - 60; // slight upward bias
            const rot = Math.random() * 720 - 360;

            document.body.appendChild(confetti);

            confetti.animate([
                { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.3) rotate(${rot}deg)`, opacity: 0.9, offset: 0.6 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty + 150}px)) scale(0.8) rotate(${rot * 1.5}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 1200 + 1600,
                easing: 'cubic-bezier(0.1, 0.9, 0.4, 1)'
            }).onfinish = () => confetti.remove();
        }
    }

    function burstLittleSparkles(element) {
        const rect = element.getBoundingClientRect();
        const emojis = ['✨', '⭐', '💖'];
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            sparkle.style.position = 'fixed';
            sparkle.style.left = rect.left + rect.width / 2 + 'px';
            sparkle.style.top = rect.top + rect.height / 2 + 'px';
            sparkle.style.fontSize = '16px';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '9999';

            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 60 + 20;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist;

            document.body.appendChild(sparkle);

            sparkle.animate([
                { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.2)`, opacity: 0 }
            ], {
                duration: 700,
                easing: 'ease-out'
            }).onfinish = () => sparkle.remove();
        }
    }
});
