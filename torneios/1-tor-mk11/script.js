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
                { id: "M1", p1: "Kaue", p2: "Elvis" },
                { id: "M2", p1: "Tigas", p2: "Isaac" },
                { id: "M3", p1: "SAVAGE7CK", p2: "Kouran" },
                { id: "M4", p1: "Riko", p2: "Raul" },
                { id: "M5", p1: "Shy", p2: "Erick" }
            ]
        },
        {
            name: "Fase 2 (Quartas de Final)",
            matches: [
                { id: "M6", p1: "Vencedor M1", p2: "Vencedor M2" },
                { id: "M7", p1: "Vencedor M3", p2: "Vencedor M4" },
                { id: "M8", p1: "Vencedor M5", p2: "Vencedor R1" },
                { id: "M9", p1: "Vencedor R2", p2: "Vencedor R3 (BYE)" }
            ]
        },
        {
            name: "Semifinais",
            matches: [
                { id: "M10", p1: "Vencedor M6", p2: "Vencedor M7" },
                { id: "M11", p1: "Vencedor M8", p2: "Vencedor M9" }
            ]
        },
        {
            name: "Grande Final",
            matches: [
                { id: "M12", p1: "Vencedor M10", p2: "Vencedor M11" }
            ]
        }
    ];

    const losersRounds = [
        {
            name: "Repescagem (Retorno para Fase 2)",
            matches: [
                { id: "R1", p1: "Perdedor M1", p2: "Perdedor M2" },
                { id: "R2", p1: "Perdedor M3", p2: "Perdedor M4" },
                { id: "R3", p1: "Perdedor M5", p2: "BYE" }
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

                matchDiv.innerHTML = `
                    <div class="match-number">${match.id}</div>
                    <div class="player ${isP1Bye ? 'bye' : ''}">
                        <span class="name">${match.p1}</span>
                        <span class="score">-</span>
                    </div>
                    <div class="player ${isP2Bye ? 'bye' : ''}">
                        <span class="name">${match.p2}</span>
                        <span class="score">-</span>
                    </div>
                `;
                roundDiv.appendChild(matchDiv);
            });

            container.appendChild(roundDiv);
        });
    };

    renderBracket(winnersRounds, 'winnersBracket');
    renderBracket(losersRounds, 'losersBracket');
});
