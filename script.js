document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('feed-container');
    const navItems = document.querySelectorAll('.nav-item');

    // Embedded 40 Kuestions directly to bypass browser CORS blocks when running locally
    const questions = [
        { "id": 1, "question": "Why is space completely dark if it's full of billions of glowing stars?", "answer": "This is known as Olbers' Paradox! The universe is expanding, causing light from distant stars to stretch into wavelengths humans can't see (infrared). Plus, the universe isn't infinitely old, so light from the most distant stars hasn't reached us yet!", "category": "Astrophysics" },
        { "id": 2, "question": "What would actually happen to you if you fell into a black hole?", "answer": "You would experience 'Spaghettification'! Because gravity is exponentially stronger at your feet than your head, your body would be stretched vertically and compressed horizontally into a long, noodle-like strand.", "category": "Astrophysics" },
        { "id": 3, "question": "Can light actually bend, or does it only travel in straight lines?", "answer": "Light travels in straight lines through spacetime, but gravity can warp spacetime itself! Massive objects like galaxies bend the fabric of space, causing passing light to follow a curved path. This is called Gravitational Lensing.", "category": "Relativity" },
        { "id": 4, "question": "Why does ice float on water when almost all other solids sink in their liquids?", "answer": "Water is weird! When it freezes, its molecules form a crystalline structure held together by hydrogen bonds that actually pushes the molecules further apart, making ice less dense than liquid water.", "category": "Thermodynamics" },
        { "id": 5, "question": "If nothing can travel faster than light, how fast is the universe expanding?", "answer": "The universe is expanding faster than the speed of light! The rule that 'nothing travels faster than light' only applies to objects moving *through* space. Space itself can expand at any speed it wants!", "category": "Cosmology" },
        { "id": 6, "question": "Can you actually hear an explosion in outer space?", "answer": "Nope! Sound is a mechanical wave that needs a medium (like air or water) to vibrate through. Since space is a vacuum with no air molecules, it is completely silent. Hollywood movies lie to us!", "category": "Waves & Sound" },
        { "id": 7, "question": "Why is the sky blue during the day but turns vibrant red at sunset?", "answer": "It's due to Rayleigh Scattering! Earth's atmosphere scatters shorter wavelengths of light (blue) more than others. At sunset, sunlight passes through much more atmosphere, scattering away the blue and leaving the reds and oranges.", "category": "Optics" },
        { "id": 8, "question": "What is Quantum Entanglement in a simple way?", "answer": "Einstein called it 'spooky action at a distance.' Two particles become linked so that changing the state of one instantly changes the other, no matter how far apart they are—even across the universe!", "category": "Quantum Physics" },
        { "id": 9, "question": "Why do boomerangs actually come back to the person who threw them?", "answer": "It's a mix of aerodynamics and Gyroscopic Precession. The curved wings create lift, but because the top wing moves faster through the air than the bottom wing, it creates an unbalanced force that turns the boomerang in a circle.", "category": "Mechanics" },
        { "id": 10, "question": "Can a single particle really exist in two places at the same time?", "answer": "Yes! In quantum mechanics, particles exist in a 'superposition' of states and locations until they are measured or observed, at which point they choose a single reality.", "category": "Quantum Physics" },
        { "id": 11, "question": "What exactly is Dark Matter, and why can't we see it?", "answer": "Dark matter makes up about 85% of the universe's mass, but it doesn't interact with light or electromagnetic radiation at all. We only know it exists because its massive gravity pulls on visible galaxies!", "category": "Cosmology" },
        { "id": 12, "question": "Why does time slow down the faster you move through space?", "answer": "This is Time Dilation from Einstein's Relativity. Space and time are woven together as 'spacetime'. The more you allocate your motion to moving through space, the less motion is left for moving through time!", "category": "Relativity" },
        { "id": 13, "question": "Is glass secretly a very slow-flowing liquid or a true solid?", "answer": "Neither! Glass is an 'amorphous solid.' Its atoms are locked into a solid structure but are arranged randomly like a liquid rather than a neat crystal lattice. It does NOT flow over time.", "category": "Materials Science" },
        { "id": 14, "question": "How do permanent magnets keep their magnetic power forever without a battery?", "answer": "Magnetism comes from the quantum spin of electrons. In permanent magnets, the spins of millions of electrons are permanently aligned in the same direction, creating a continuous magnetic field naturally.", "category": "Electromagnetism" },
        { "id": 15, "question": "What happens at Absolute Zero, and can we ever achieve it?", "answer": "Absolute Zero (-273.15°C) is the temperature where all classical atomic motion stops completely. However, due to quantum mechanics (Heisenberg's Uncertainty Principle), atoms will always retain a tiny bit of zero-point energy, making it impossible to reach perfectly.", "category": "Thermodynamics" },
        { "id": 16, "question": "How does a heavy airplane stay up in the air without falling?", "answer": "Airplanes use lift generated by their wings. The wing's shape and angle force air downwards, and by Newton's Third Law (action-reaction), the air pushes the wing upwards. Dynamic air pressure differences also contribute!", "category": "Fluid Dynamics" },
        { "id": 17, "question": "What would happen if Earth stopped spinning for just one second?", "answer": "Complete chaos! While the ground would stop, the atmosphere and everything on the surface would keep moving at the spin speed (up to 1,000 mph at the equator), instantly launching buildings, rocks, and oceans sideways.", "category": "Mechanics" },
        { "id": 18, "question": "Can we see a single atom using a normal light microscope?", "answer": "No. Atoms are smaller than the wavelength of visible light. Light waves just pass right over them without bouncing back. To see atoms, we must use Electron Microscopes which use much smaller electron waves.", "category": "Optics & Quantum" },
        { "id": 19, "question": "Why does lightning look zig-zagged instead of coming down in a straight line?", "answer": "Electricity looks for the path of least resistance. The air isn't uniform; it has pockets of different humidity, temperature, and ionization. The lightning 'feels' its way down through the easiest pockets, creating steps.", "category": "Electricity" },
        { "id": 20, "question": "Why are rainbows always shaped like a perfect semi-circle bow?", "answer": "Rainbows are actually full circles! You only see a semi-circle because the ground blocks the bottom half. Light reflects inside water droplets at a very specific angle (around 42 degrees) relative to your eyes.", "category": "Optics" },
        { "id": 21, "question": "What is the true meaning behind Schrödinger's Cat?", "answer": "It was originally a thought experiment to show how absurd quantum mechanics seems! It states a cat in a box could be both alive and dead at the same time until someone opens the box and forces nature to choose.", "category": "Quantum Physics" },
        { "id": 22, "question": "How does your phone's GPS use Einstein's theory of relativity?", "answer": "Satellites experience less gravity and move fast, causing their atomic clocks to run faster than clocks on Earth by about 38 microseconds a day. Without relativity math to correct this, your GPS map would be off by miles within a day!", "category": "Relativity" },
        { "id": 23, "question": "Why do heavy and light objects fall at the same speed in a vacuum?", "answer": "A heavier object has more gravitational pull, but it also has more inertia (resistance to moving). These two effects cancel out perfectly, making everything accelerate at exactly 9.8 m/s² on Earth when air resistance is gone.", "category": "Mechanics" },
        { "id": 24, "question": "What causes a Sonic Boom when a jet goes supersonic?", "answer": "When a jet travels faster than the speed of sound, it outruns the sound waves it creates. The sound waves pile up behind each other, forming a massive, single shockwave cone that sounds like a massive explosion.", "category": "Waves & Sound" },
        { "id": 25, "question": "Can you trap light inside a box lined with perfect mirrors forever?", "answer": "In theory, yes. In reality, no mirror is 100% reflective; even the best mirrors absorb a tiny fraction of light. Because light travels so fast, it would hit the walls billions of times in a millisecond and be absorbed instantly.", "category": "Optics" },
        { "id": 26, "question": "Why do clouds look super fluffy and white if they contain tons of heavy water?", "answer": "Clouds are made of tiny water droplets. These droplets are perfectly sized to scatter all wavelengths of visible light equally. When all colors of light blend together, they form white light!", "category": "Atmospheric Physics" },
        { "id": 27, "question": "What is the Doppler Effect and how does it affect sound?", "answer": "It's the change in frequency of a wave relative to an observer. When an ambulance drives toward you, its sound waves compress (higher pitch); when it drives away, the waves stretch out (lower pitch).", "category": "Waves & Sound" },
        { "id": 28, "question": "If the universe is expanding, what exactly is it expanding into?",
        "answer": "It isn't expanding *into* anything! Space itself is expanding and creating more space between galaxies. The universe is everything that exists, so there is no 'outside' for it to grow into.", "category": "Cosmology" },
        { "id": 29, "question": "Can hot water really freeze faster than cold water?", "answer": "Yes! This is called the Mpemba Effect. While physicists still debate the exact cause, reasons include faster evaporation cooling the hot water down, and reduced dissolved gases in hot water.", "category": "Thermodynamics" },
        { "id": 30, "question": "What is a Wormhole, and can we build one?", "answer": "A wormhole is a theoretical tunnel through spacetime connecting two distant points instantly. While mathematically possible in General Relativity, creating one would require 'exotic matter' with negative energy to keep it open.", "category": "Relativity" },
        { "id": 31, "question": "How do colorful neon lights actually glow?", "answer": "Electricity passes through neon gas, exciting its electrons to higher energy levels. When the electrons fall back down to their natural state, they release that extra energy as photons of bright orange-red light!", "category": "Atomic Physics" },
        { "id": 32, "question": "What is Antimatter and what happens when it touches normal matter?", "answer": "Antimatter particles have the exact same mass as normal matter but opposite electrical charges. When matter and antimatter meet, they destroy each other instantly, converting 100% of their mass into pure, explosive energy!", "category": "Particle Physics" },
        { "id": 33, "question": "Why do stars twinkle in the night sky but planets do not?", "answer": "Stars are so incredibly far away that they appear as single pinpoint sources of light, which easily get bent around by moving layers of Earth's atmosphere. Planets are closer and appear as larger discs, averaging out the distortion.", "category": "Optics & Astronomy" },
        { "id": 34, "question": "Can humans create a miniature Sun on Earth?", "answer": "Yes! Nuclear Fusion reactors (like Tokamaks) recreate the core of the Sun by heating hydrogen gas to over 100 million degrees Celsius, forcing atoms to fuse and release clean, massive amounts of energy.", "category": "Plasma Physics" },
        { "id": 35, "question": "What is String Theory in a single sentence?", "answer": "String theory suggests that the fundamental building blocks of the universe aren't zero-dimensional particles, but tiny, vibrating strings of energy operating in 11 dimensions!", "category": "Theoretical Physics" },
        { "id": 36, "question": "Why does a spinning top stay upright instead of falling over immediately?", "answer": "Conservation of Angular Momentum! The torque created by gravity trying to pull the top over acts perpendicular to its spinning motion, causing it to wobble around in a circle (precess) rather than fall.", "category": "Mechanics" },
        { "id": 37, "question": "Can you outrun your own reflection if you move at the speed of light?", "answer": "According to Einstein, you can never reach the speed of light if you have mass. But if you were moving near the speed of light, light still leaves your face at the exact speed of light relative to you, so your reflection looks perfectly normal!", "category": "Relativity" },
        { "id": 38, "question": "What is the Horizon Problem in cosmology?", "answer": "Opposite sides of the universe are too far apart to have ever exchanged light or heat, yet they are at the exact same temperature. Cosmic Inflation theory solves this by saying everything was touched together before space exploded outwards.", "category": "Cosmology" },
        { "id": 39, "question": "How do wireless chargers transfer energy without any wires?", "answer": "They use Electromagnetic Induction! The charger pad contains a coil that creates a rapidly changing magnetic field. When your phone's internal coil enters this field, it forces electrons to flow, charging the battery.", "category": "Electromagnetism" },
        { "id": 40, "question": "What is the ultimate fate of our universe according to physics?", "answer": "The leading theory is the 'Big Freeze' or Heat Death. The universe will keep expanding until all stars run out of fuel, black holes evaporate via Hawking radiation, and the universe reaches absolute thermodynamic equilibrium.", "category": "Cosmology" }
    ];

    // Initialize layout immediately with static data array
    renderFeed(questions);

    function renderFeed(questionsArray) {
        feedContainer.innerHTML = '';
        questionsArray.forEach(item => {
            const card = document.createElement('article');
            card.className = 'kuestion-card';
            card.innerHTML = `
                <span class="category-tag">${item.category}</span>
                <h2 class="question-text">${item.question}</h2>
                <div class="action-box">
                    <button class="reveal-btn" onclick="toggleAnswer(this)">Show Answer</button>
                </div>
                <div class="answer-box">
                    <p class="answer-text">${item.answer}</p>
                </div>
            `;
            feedContainer.appendChild(card);
        });
    }

    // Dynamic Navigation items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            const target = item.getAttribute('data-target');
            if (target !== 'home') {
                feedContainer.innerHTML = `
                    <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:60vh; text-align:center; color: var(--text-muted);">
                        <svg viewBox="0 0 24 24" style="width:64px; height:64px; fill:var(--accent-purple); margin-bottom:16px;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        <h3 style="color:#fff; margin-bottom:8px; text-transform:uppercase;">${target} feature arriving soon!</h3>
                        <p>Stay tuned as we construct more ways to ignite your brain.</p>
                    </div>
                `;
            } else {
                renderFeed(questions);
            }
        });
    });
});

window.toggleAnswer = function(button) {
    const card = button.closest('.kuestion-card');
    const answerBox = card.querySelector('.answer-box');
    
    if (answerBox.classList.contains('show')) {
        answerBox.classList.remove('show');
        button.textContent = 'Show Answer';
        button.style.background = 'linear-gradient(135deg, var(--accent-glow), var(--accent-purple))';
    } else {
        answerBox.classList.add('show');
        button.textContent = 'Hide Answer';
        button.style.background = 'linear-gradient(135deg, var(--neon-pink), var(--accent-purple))';
        
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }
};