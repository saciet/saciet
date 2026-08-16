document.addEventListener('DOMContentLoaded', () => {
    const participants = [
        "Kaue", "Elvis", "Tigas", "Isaac", "SAVAGE7CK",
        "Kouran", "Riko", "Raul", "Shy", "Erick"
    ];

    // Render participants
    const grid = document.getElementById('participantsGrid');
    participants.forEach(p => {
        const div = document.createElement('div');
        div.className = 'participant-card';
        div.textContent = p;
        grid.appendChild(div);
    });

    // Custom Bracket Logic based on user's rules:
    // Round 1: Everyone fights (5 matches) -> 5 Winners, 5 Losers
    // Repescagem: 5 Losers fight for 3 spots (2 matches, 1 BYE) -> 3 Winners return
    // Phase 2 (Quarters): 5 Winners (Round 1) + 3 Winners (Repescagem) = 8 Players
    
    const winnersRounds = [
        {
            name: "Fase 1 (Todos lutam)",
            matches: [
                { id: "M1", p1: "Kaue", p2: "Elvis", s1: 0, s2: 2, winner: 2, video: "rb9HwW2hj24", status: 'finalizado' },
                { id: "M2", p1: "Tigas", p2: "Isaac", s1: 0, s2: 3, winner: 2, video: "XRidyYglFyw", status: 'finalizado' },
                { id: "M3", p1: "SAVAGE7CK", p2: "Kouran", s1: "W.O", s2: "W", winner: 2, status: 'wo' },
                { id: "M4", p1: "Riko", p2: "Raul", s1: 2, s2: 0, winner: 1, video: "8AYVjBCrXfI", status: 'finalizado' },
                { id: "M5", p1: "Shy", p2: "Erick", status: 'aguardando' }
            ]
        },
        {
            name: "Fase 2 (Quartas de Final)",
            matches: [
                { id: "M6", p1: "Elvis", p2: "Isaac", s1: 0, s2: 2, winner: 2, video: "J3Ri4Kb3B1E", status: 'finalizado' },
                { id: "M7", p1: "Kouran", p2: "Riko", s1: 0, s2: 2, winner: 2, video: "ZAbJJKZRxRg", status: 'finalizado' },
                { id: "M8", p1: "Vencedor M5", p2: "Raul" },
                { id: "M9", p1: "Vencedor R2", p2: "BYE" }
            ]
        },
        {
            name: "Semifinais",
            matches: [
                { id: "M10", p1: "Isaac", p2: "Riko", s1: 0, s2: 2, winner: 2, video: "iwMSQo4o1rg", status: 'finalizado' },
                { id: "M11", p1: "Vencedor M8", p2: "Vencedor M9" }
            ]
        },
        {
            name: "Grande Final",
            matches: [
                { id: "M12", p1: "Riko", p2: "Vencedor M11" }
            ]
        }
    ];

    const losersRounds = [
        {
            name: "Repescagem (Retorno para Fase 2)",
            matches: [
                { id: "R1", p1: "Kaue", p2: "Raul", s1: 0, s2: 2, winner: 2, video: "6rSIUBkkpZg", status: 'finalizado' },
                { id: "R2", p1: "Tigas", p2: "Perdedor M5" }
            ]
        }
    ];

    const renderBracket = (roundsData, containerId) => {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // clear placeholders

        roundsData.forEach((round) => {
            const roundDiv = document.createElement('div');
            roundDiv.className = 'round';
            
            const title = document.createElement('h4');
            title.className = 'round-title';
            title.textContent = round.name;
            roundDiv.appendChild(title);

            round.matches.forEach((match) => {
                const matchDiv = document.createElement('div');
                matchDiv.className = 'match';
                
                const isP1Bye = match.p1 === 'BYE';
                const isP2Bye = match.p2 === 'BYE';

                const getAvatar = (name) => {
                    if(!name || name === 'BYE' || name.startsWith('Vencedor') || name.startsWith('Perdedor')) return '';
                    return `<img src="https://ui-avatars.com/api/?name=${name}&background=d32f2f&color=fff&bold=true" class="player-avatar" alt="${name}">`;
                };

                let statusHTML = '';
                if (match.status) {
                    let statusText = match.status;
                    let statusClass = 'status-badge';
                    if(match.status === 'aguardando') { statusText = 'Aguardando'; statusClass += ' status-aguardando'; }
                    if(match.status === 'finalizado') { statusText = 'Finalizado'; statusClass += ' status-finalizado'; }
                    if(match.status === 'wo') { statusText = 'W.O.'; statusClass += ' status-wo'; }
                    statusHTML = `<div class="${statusClass}">${statusText}</div>`;
                }

                matchDiv.innerHTML = `
                    ${statusHTML}
                    <div class="match-number">${match.id}</div>
                    <div class="player ${isP1Bye ? 'bye' : ''} ${match.winner === 1 ? 'winner' : ''}" data-player="${match.p1}">
                        <div class="player-info">
                            ${getAvatar(match.p1)}
                            <span class="name">${match.p1}</span>
                        </div>
                        <span class="score">${match.s1 !== undefined ? match.s1 : '-'}</span>
                    </div>
                    <div class="player ${isP2Bye ? 'bye' : ''} ${match.winner === 2 ? 'winner' : ''}" data-player="${match.p2}">
                        <div class="player-info">
                            ${getAvatar(match.p2)}
                            <span class="name">${match.p2}</span>
                        </div>
                        <span class="score">${match.s2 !== undefined ? match.s2 : '-'}</span>
                    </div>
                `;

                if (match.video) {
                    matchDiv.classList.add('has-video');
                    matchDiv.title = "Clique para assistir ao duelo no YouTube!";
                    matchDiv.addEventListener('click', () => {
                        const modal = document.getElementById('videoModal');
                        const iframe = document.getElementById('videoIframe');
                        const fallback = document.getElementById('videoFallbackLink');
                        
                        iframe.src = `https://www.youtube-nocookie.com/embed/${match.video}?rel=0&origin=http://localhost`;
                        if(fallback) fallback.href = `https://www.youtube.com/watch?v=${match.video}`;
                        
                        modal.style.display = 'flex';
                    });
                }
                
                roundDiv.appendChild(matchDiv);
            });

            container.appendChild(roundDiv);
        });
    };

    renderBracket(winnersRounds, 'winnersBracket');
    renderBracket(losersRounds, 'losersBracket');

    // Draw SVG connections
    const drawConnectionsForBracket = (containerId, connections) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        let svg = container.querySelector('.bracket-lines');
        if (svg) svg.remove();

        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('bracket-lines');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = container.scrollWidth + 'px';
        svg.style.height = container.scrollHeight + 'px';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '0';
        
        container.style.position = 'relative';
        container.appendChild(svg);

        connections.forEach(conn => {
            const el1 = Array.from(container.querySelectorAll('.match')).find(el => el.querySelector('.match-number').textContent === conn[0]);
            const el2 = Array.from(container.querySelectorAll('.match')).find(el => el.querySelector('.match-number').textContent === conn[1]);
            
            if (el1 && el2) {
                const rect1 = el1.getBoundingClientRect();
                const rect2 = el2.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();

                const x1 = rect1.right - containerRect.left + container.scrollLeft;
                const y1 = rect1.top + rect1.height / 2 - containerRect.top + container.scrollTop;

                const x2 = rect2.left - containerRect.left + container.scrollLeft;
                const y2 = rect2.top + rect2.height / 2 - containerRect.top + container.scrollTop;

                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const curve = Math.abs(x2 - x1) / 2; 
                const d = `M ${x1} ${y1} C ${x1 + curve} ${y1}, ${x2 - curve} ${y2}, ${x2} ${y2}`;
                
                path.setAttribute('d', d);
                path.setAttribute('stroke', 'rgba(211, 47, 47, 0.4)'); 
                path.setAttribute('stroke-width', '2');
                path.setAttribute('fill', 'none');
                path.classList.add('connection-line');
                path.dataset.m1 = conn[0];
                path.dataset.m2 = conn[1];
                svg.appendChild(path);
            }
        });
    };

    const updateLines = () => {
        // We only connect within the winners bracket. Losers repescagem comes from outside
        drawConnectionsForBracket('winnersBracket', [
            ['M1', 'M6'], ['M2', 'M6'],
            ['M3', 'M7'], ['M4', 'M7'],
            ['M5', 'M8'], 
            ['M6', 'M10'], ['M7', 'M10'],
            ['M8', 'M11'], ['M9', 'M11'],
            ['M10', 'M12'], ['M11', 'M12']
        ]);
        // Losers bracket connections if any in the future
    };

    // Need a tiny delay to ensure DOM is fully rendered and sizes are correct
    setTimeout(updateLines, 50);
    window.addEventListener('resize', updateLines);

    // Modal Logic
    window.closeModal = () => {
        const modal = document.getElementById('videoModal');
        const iframe = document.getElementById('videoIframe');
        iframe.src = '';
        modal.style.display = 'none';
    };

    window.addEventListener('click', (event) => {
        const modal = document.getElementById('videoModal');
        if (event.target === modal) {
            window.closeModal();
        }
    });

    // --- Hover Highlighting Logic ---
    const swooshAudio = new Audio('https://actions.google.com/sounds/v1/foley/swoosh_fast.ogg');
    swooshAudio.volume = 0.2;
    
    document.querySelectorAll('.player').forEach(playerEl => {
        playerEl.addEventListener('mouseenter', (e) => {
            const playerName = playerEl.dataset.player;
            if (!playerName || playerName === 'BYE' || playerName.startsWith('Vencedor') || playerName.startsWith('Perdedor')) return;
            
            swooshAudio.currentTime = 0;
            swooshAudio.play().catch(() => {});

            // Highlight matches
            document.querySelectorAll('.match').forEach(m => {
                const players = m.querySelectorAll('.player');
                const p1 = players[0]?.dataset.player;
                const p2 = players[1]?.dataset.player;
                if(p1 === playerName || p2 === playerName) {
                    m.classList.add('highlighted');
                }
            });
            
            // Note: complex line highlighting omitted for simplicity, highlights match boxes instead.
        });

        playerEl.addEventListener('mouseleave', () => {
            document.querySelectorAll('.match.highlighted').forEach(m => m.classList.remove('highlighted'));
        });
    });

    // --- Embers Canvas Logic ---
    const canvas = document.getElementById('embers');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        const particles = [];

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        for(let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2.5 + 1,
                speedY: Math.random() * -1.5 - 0.5,
                speedX: (Math.random() - 0.5) * 1,
                opacity: Math.random() * 0.8 + 0.2
            });
        }

        function drawEmbers() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(211, 47, 47, 0.8)';
            particles.forEach(p => {
                ctx.globalAlpha = p.opacity;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                
                p.y += p.speedY;
                p.x += p.speedX;
                
                if(p.y < -10) {
                    p.y = height + 10;
                    p.x = Math.random() * width;
                }
            });
            requestAnimationFrame(drawEmbers);
        }
        drawEmbers();
    }
});
