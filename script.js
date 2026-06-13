class TeamStatsApp {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.eloCache = {}; // Cache para ELOs ya cargados
        this.loadEloCache(); // Cargar caché al inicializar
        
        // Configuración de Supabase
        this.supabaseUrl = window.SUPABASE_CONFIG?.url || 'https://aikktkocuuwjysykoqka.supabase.co';
        this.supabaseKey = window.SUPABASE_CONFIG?.key || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpa2t0a29jdXV3anlzeWtvcWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NTg1ODQsImV4cCI6MjA2OTMzNDU4NH0.uAD1wUXORCaGqwRjBfNB1Dy4575Y_IelFPWjvX1QPyw';
        
        this.playerNames = [
            'sszafranko', 'Lugut', 'SoLid', 'Jonny', 'RELP',
            'Reymon', 'Danny', 'Ze Pequeño', 'Lauritop', 'Herno',
            'Eze', 'Anakin', 'Chetti', 'TheRazor', 'Pepe',
            'Fran Camet', 'Nachorga', 'Marco Van Basten', 'Nasper',
            'Alejo Camet', 'War Machine', 'Dylan', 'Patocuesta', 'ThePipi'
        ];
        this.init();
    }

    init() {
        this.createAllPlayers();
        this.setupEventListeners();
        this.updateCarousel();
        this.loadInitialData();
        this.setupNavigation();
    }

    createAllPlayers() {
        const carouselTrack = document.getElementById('carousel-track');
        
        console.log('🎴 Creando todas las cards...');
        console.log('📋 Jugadores disponibles:', this.playerNames);
        
        this.playerNames.forEach((name, index) => {
            const playerCard = this.createPlayerCard(name, index);
            carouselTrack.appendChild(playerCard);
            this.players.push(playerCard);
            console.log(`✅ Card ${index} creada para: ${name}`);
        });
        
        console.log('🎴 Total de cards creadas:', this.players.length);
        console.log('📊 Verificación de orden:', this.players.map((card, i) => `${i}: ${card.querySelector('.player-name')?.value || 'sin nombre'}`));
        
        // Cargar ELOs iniciales de Supabase después de crear todas las cards
        this.loadInitialElos();
    }

    async loadInitialElos() {
        console.log('🚀 Cargando ELOs iniciales de Supabase...');
        
        // Obtener jugadores con user ID
        const playersWithElo = this.playerNames.filter(name => this.getPlayerUserId(name));
        console.log('📋 Jugadores con user ID:', playersWithElo);
        
        // Cargar ELOs de Supabase en paralelo
        const eloPromises = playersWithElo.map(async (playerName) => {
            try {
                console.log(`🔍 Buscando ELO inicial para: ${playerName}`);
                const supabaseData = await this.fetchEloFromSupabase(playerName);
                if (supabaseData && !this.isEloExpired(supabaseData.last_updated) && supabaseData.elo_value !== 'No encontrado') {
                    this.eloCache[playerName] = supabaseData.elo_value;
                    this.updateEloDisplay(playerName, supabaseData.elo_value);
                    console.log(`✅ ELO inicial cargado para ${playerName}: ${supabaseData.elo_value}`);
                } else {
                    console.log(`⏭️ ELO no válido para ${playerName}:`, supabaseData?.elo_value || 'sin datos');
                }
            } catch (error) {
                console.error(`❌ Error cargando ELO inicial para ${playerName}:`, error);
            }
        });
        
        // Esperar a que se carguen todos los ELOs
        await Promise.all(eloPromises);
        console.log('🎉 Carga inicial de ELOs completada');
    }

    createPlayerCard(name, index) {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.id = `player-${index}`;
        
        // Generar estadísticas aleatorias para demostración
        const stats = {
            'micro': Math.floor(Math.random() * 10) + 1,
            'balance': Math.floor(Math.random() * 10) + 1,
            'agresividad': Math.floor(Math.random() * 10) + 1,
            'adaptabilidad': Math.floor(Math.random() * 10) + 1,
            'estrategia': Math.floor(Math.random() * 10) + 1,
            'equipo': Math.floor(Math.random() * 10) + 1,
            'mentalidad': Math.floor(Math.random() * 10) + 1,
            'mapas': Math.floor(Math.random() * 10) + 1
        };

        card.innerHTML = `
            <div class="player-header">
                <div class="player-photo">
                    <img src="placeholder-avatar.png" alt="Foto del jugador" class="player-photo-img">
                    <div class="photo-upload">
                        <label for="photo-input-${index}">Cambiar foto</label>
                        <input type="file" id="photo-input-${index}" accept="image/*">
                    </div>
                </div>
                <div class="player-info">
                    <div class="player-name-display">
                        <input type="text" class="player-name" value="${name}" placeholder="Nombre del jugador">
                    </div>
                    <div class="info-columns">
                        <div class="info-column">
                            <div class="info-field">
                                <label>Posición:</label>
                                <input type="text" class="player-position" value="Jugador del Equipo" placeholder="Posición en el equipo">
                            </div>
                            <div class="info-field">
                                <label>Civilización Preferida:</label>
                                <input type="text" class="player-civ" value="Por definir" placeholder="Civilización preferida">
                            </div>
                        </div>
                        <div class="info-column">
                            <div class="info-field">
                                <label>Apodo:</label>
                                <input type="text" class="player-notes" placeholder="Apodo del jugador..." value="">
                            </div>
                            <div class="info-field">
                                <label>aoe2insights:</label>
                                ${this.getPlayerUserId(name) ? 
                                    `<a href="https://aoe2insights.com/user/${this.getPlayerUserId(name)}/" target="_blank" class="aoe2insights-link">Ver perfil completo</a>` :
                                    `<a href="https://aoe2insights.com" target="_blank" class="aoe2insights-link">Buscar jugador</a>`
                                }
                            </div>
                            <div class="info-field">
                                <label>ELO 1v1 RM:</label>
                                <div class="elo-display">
                                    <span class="elo-value">Cargando...</span>
                                    <button class="update-elo-btn" onclick="window.app.forceUpdatePlayerElo('${name}')">🔄</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="stats-container">
                <div class="radar-chart-container">
                    <canvas id="radar-chart-${index}" width="350" height="350"></canvas>
                </div>
                
                <div class="stats-inputs">
                    <div class="stat-input">
                        <label>Micro:</label>
                        <input type="range" min="1" max="10" value="${stats.micro}" class="stat-slider" data-stat="micro">
                        <span class="stat-value">${stats.micro}</span>
                    </div>
                    <div class="stat-input">
                        <label>Balance Económico:</label>
                        <input type="range" min="1" max="10" value="${stats.balance}" class="stat-slider" data-stat="balance">
                        <span class="stat-value">${stats.balance}</span>
                    </div>
                    <div class="stat-input">
                        <label>Agresividad:</label>
                        <input type="range" min="1" max="10" value="${stats.agresividad}" class="stat-slider" data-stat="agresividad">
                        <span class="stat-value">${stats.agresividad}</span>
                    </div>
                    <div class="stat-input">
                        <label>Adaptabilidad:</label>
                        <input type="range" min="1" max="10" value="${stats.adaptabilidad}" class="stat-slider" data-stat="adaptabilidad">
                        <span class="stat-value">${stats.adaptabilidad}</span>
                    </div>
                    <div class="stat-input">
                        <label>Estrategia:</label>
                        <input type="range" min="1" max="10" value="${stats.estrategia}" class="stat-slider" data-stat="estrategia">
                        <span class="stat-value">${stats.estrategia}</span>
                    </div>
                    <div class="stat-input">
                        <label>Juego en Equipo:</label>
                        <input type="range" min="1" max="10" value="${stats.equipo}" class="stat-slider" data-stat="equipo">
                        <span class="stat-value">${stats.equipo}</span>
                    </div>
                    <div class="stat-input">
                        <label>Mentalidad:</label>
                        <input type="range" min="1" max="10" value="${stats.mentalidad}" class="stat-slider" data-stat="mentalidad">
                        <span class="stat-value">${stats.mentalidad}</span>
                    </div>
                    <div class="stat-input">
                        <label>Conocimiento de Mapas:</label>
                        <input type="range" min="1" max="10" value="${stats.mapas}" class="stat-slider" data-stat="mapas">
                        <span class="stat-value">${stats.mapas}</span>
                    </div>
                </div>
            </div>
        `;

        // Agregar event listeners para los sliders
        const sliders = card.querySelectorAll('.stat-slider');
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                e.target.nextElementSibling.textContent = value;
                this.updateSliderColor(e.target, value);
                this.updateRadarChart(index);
            });
            
            // Establecer color inicial
            this.updateSliderColor(slider, slider.value);
        });

        // Agregar event listener para subir fotos
        const photoInput = card.querySelector('input[type="file"]');
        photoInput.addEventListener('change', (e) => {
            this.handlePhotoUpload(e.target, card);
        });

        // Cargar foto del jugador
        const img = card.querySelector('.player-photo-img');
        this.loadPlayerPhoto(name, img);

        return card;
    }

    setupEventListeners() {
        // Event listeners para el carrusel
        document.getElementById('prev-btn').addEventListener('click', () => this.prevPlayer());
        document.getElementById('next-btn').addEventListener('click', () => this.nextPlayer());
        
        // Event listener para teclas
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevPlayer();
            if (e.key === 'ArrowRight') this.nextPlayer();
        });

        // Event listeners para botones
        document.getElementById('save-data').addEventListener('click', () => this.saveData());
        document.getElementById('load-data').addEventListener('click', () => this.loadData());
        
        // Event listener para el buscador
        const searchInput = document.getElementById('player-search');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        searchInput.addEventListener('focus', () => this.showSearchResults());
        searchInput.addEventListener('blur', () => {
            // Ocultar resultados después de un pequeño delay para permitir clics
            setTimeout(() => this.hideSearchResults(), 200);
        });
    }

    prevPlayer() {
        if (this.currentPlayerIndex > 0) {
            this.goToPlayer(this.currentPlayerIndex - 1);
        }
    }

    nextPlayer() {
        if (this.currentPlayerIndex < this.players.length - 1) {
            this.goToPlayer(this.currentPlayerIndex + 1);
        }
    }

    async goToPlayer(index) {
        console.log(`Navegando a jugador con índice: ${index}`);
        this.currentPlayerIndex = index;
        this.updateCarousel();
        this.updateRadarChart(index);
        
        // Cargar ELO de Supabase para cualquier sección
        const playerName = this.playerNames[index];
        if (this.getPlayerUserId(playerName)) {
            // Intentar cargar ELO de Supabase primero
            const supabaseData = await this.fetchEloFromSupabase(playerName);
            if (supabaseData && !this.isEloExpired(supabaseData.last_updated) && supabaseData.elo_value !== 'No encontrado') {
                // ELO válido en Supabase
                this.eloCache[playerName] = supabaseData.elo_value;
                this.updateEloDisplay(playerName, supabaseData.elo_value);
                console.log(`ELO cargado de Supabase para ${playerName}: ${supabaseData.elo_value}`);
            } else if (!this.eloCache[playerName] || this.eloCache[playerName] === 'No encontrado') {
                // No hay datos válidos, intentar obtener
                console.log(`Intentando obtener ELO para ${playerName}...`);
                this.updatePlayerElo(playerName, false);
            }
        }
    }

    updateCarousel() {
        // Actualizar posición del carrusel
        const offset = -this.currentPlayerIndex * 100;
        document.getElementById('carousel-track').style.transform = `translateX(${offset}%)`;
        
        // Actualizar clases activas
        this.players.forEach((player, index) => {
            if (index === this.currentPlayerIndex) {
                player.classList.add('active');
            } else {
                player.classList.remove('active');
            }
        });
        
        // Actualizar indicadores
        this.updateIndicators();
        this.updateButtons();
    }

    updateIndicators() {
        const container = document.getElementById('carousel-indicators');
        container.innerHTML = '';
        
        this.players.forEach((player, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (index === this.currentPlayerIndex) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => this.goToPlayer(index));
            container.appendChild(indicator);
        });
    }

    updateButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        prevBtn.disabled = this.currentPlayerIndex === 0;
        nextBtn.disabled = this.currentPlayerIndex === this.players.length - 1;
    }

    updateRadarChart(playerIndex) {
        const player = this.players[playerIndex];
        const canvas = player.querySelector(`#radar-chart-${playerIndex}`);
        const ctx = canvas.getContext('2d');
        
        // Obtener estadísticas del jugador
        const stats = {};
        const sliders = player.querySelectorAll('.stat-slider');
        sliders.forEach(slider => {
            stats[slider.dataset.stat] = parseInt(slider.value);
        });

        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 40;
        
        const statNames = Object.keys(stats);
        const numStats = statNames.length;
        const angleStep = (2 * Math.PI) / numStats;
        
        // Dibujar líneas de fondo
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        for (let level = 1; level <= 10; level++) {
            const currentRadius = (radius * level) / 10;
            ctx.beginPath();
            
            for (let i = 0; i < numStats; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const x = centerX + currentRadius * Math.cos(angle);
                const y = centerY + currentRadius * Math.sin(angle);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
        }
        
        // Dibujar líneas radiales
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < numStats; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            // Etiquetas de estadísticas
            const labelRadius = radius + 15;
            const labelX = centerX + labelRadius * Math.cos(angle);
            const labelY = centerY + labelRadius * Math.sin(angle);
            
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const statName = statNames[i];
            const displayName = this.getDisplayName(statName);
            ctx.fillText(displayName, labelX, labelY);
        }
        
        // Dibujar el área de estadísticas
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        for (let i = 0; i < numStats; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const statValue = stats[statNames[i]];
            const currentRadius = (radius * statValue) / 10;
            const x = centerX + currentRadius * Math.cos(angle);
            const y = centerY + currentRadius * Math.sin(angle);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Puntos en los vértices
        ctx.fillStyle = '#ff0000';
        for (let i = 0; i < numStats; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const statValue = stats[statNames[i]];
            const currentRadius = (radius * statValue) / 10;
            const x = centerX + currentRadius * Math.cos(angle);
            const y = centerY + currentRadius * Math.sin(angle);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    getDisplayName(statName) {
        const displayNames = {
            'micro': 'Micro',
            'balance': 'Balance',
            'agresividad': 'Agresividad',
            'adaptabilidad': 'Adaptabilidad',
            'estrategia': 'Estrategia',
            'equipo': 'Equipo',
            'mentalidad': 'Mentalidad',
            'mapas': 'Mapas'
        };
        return displayNames[statName] || statName;
    }

    getPlayerUserId(playerName) {
        const userIds = {
            'sszafranko': '2505639', // SoLid
            'Lugut': '342673',
            'SoLid': '2620848',
            'Jonny': '78611',
            'RELP': '12369433',
            'Reymon': '2212194',
            'Danny': '2446863',
            'Ze Pequeño': '4183283',
            'Lauritop': '1339133',
            'Herno': '4818662',
            'Eze': '624633',
            'Anakin': '2895394',
            'Chetti': '2663132',
            'TheRazor': '5013587',
            'Pepe': '5400853',
            'Fran Camet': '2809718',
            'Nachorga': '2050506',
            'Marco Van Basten': '227170',
            'Nasper': '228679',
            'Alejo Camet': '2648565',
            'War Machine': '3174913',
            'Dylan': '3582825',
            'Patocuesta': '1100546',
            'ThePipi': '2408832'
        };
        return userIds[playerName] || '';
    }

    // Funciones para manejar caché de ELO con localStorage
    loadEloCache() {
        try {
            const cached = localStorage.getItem('desastreSquadEloCache');
            if (cached) {
                const cacheData = JSON.parse(cached);
                const now = Date.now();
                const cacheAge = now - cacheData.timestamp;
                const maxAge = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
                
                if (cacheAge < maxAge) {
                    this.eloCache = cacheData.elos;
                    console.log('Caché de ELO cargado desde localStorage (edad:', Math.round(cacheAge / (60 * 60 * 1000)), 'horas)');
                } else {
                    console.log('Caché de ELO expirado, se limpiará');
                    localStorage.removeItem('desastreSquadEloCache');
                    this.eloCache = {};
                }
            }
        } catch (error) {
            console.error('Error cargando caché de ELO:', error);
            this.eloCache = {};
        }
    }

    saveEloCache() {
        try {
            const cacheData = {
                elos: this.eloCache,
                timestamp: Date.now()
            };
            localStorage.setItem('desastreSquadEloCache', JSON.stringify(cacheData));
            console.log('Caché de ELO guardado en localStorage');
        } catch (error) {
            console.error('Error guardando caché de ELO:', error);
        }
    }

    isEloCached(playerName) {
        return this.eloCache[playerName] && 
               this.eloCache[playerName] !== 'Error' && 
               this.eloCache[playerName] !== 'Timeout' && 
               this.eloCache[playerName] !== 'No encontrado';
    }



    // Obtiene el ELO de 1v1 Random Map desde la API oficial de AoE2 (Relic),
    // a través de la función serverless /api/elo (evita problemas de CORS).
    // Devuelve el ELO como string, o null si no se encontró.
    async fetchEloFromRelic(userId) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        try {
            const response = await fetch(`/api/elo?profile_id=${encodeURIComponent(userId)}`, {
                signal: controller.signal
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data && data.rating) {
                return String(data.rating);
            }
            return null;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    // Funciones para interactuar con Supabase
    async fetchEloFromSupabase(playerName) {
        try {
            const response = await fetch(`${this.supabaseUrl}/rest/v1/aoe_elos_1v1?player_name=eq.${encodeURIComponent(playerName)}`, {
                headers: {
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data && data.length > 0) {
                return data[0];
            }
            return null;
        } catch (error) {
            console.error('Error obteniendo ELO de Supabase:', error);
            return null;
        }
    }

    async saveEloToSupabase(playerName, eloValue) {
        try {
            // Primero intentar POST (crear nuevo registro)
            const response = await fetch(`${this.supabaseUrl}/rest/v1/aoe_elos_1v1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`
                },
                body: JSON.stringify({
                    player_name: playerName,
                    elo_value: eloValue,
                    last_updated: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                console.log(`✅ ELO creado en Supabase para ${playerName}: ${eloValue}`);
                return true;
            }
            
            // Si POST falla (409 Conflict), intentar PATCH (actualizar registro existente)
            if (response.status === 409) {
                console.log(`🔄 Registro existente encontrado para ${playerName}, actualizando...`);
                
                const patchResponse = await fetch(`${this.supabaseUrl}/rest/v1/aoe_elos_1v1?player_name=eq.${encodeURIComponent(playerName)}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': this.supabaseKey,
                        'Authorization': `Bearer ${this.supabaseKey}`
                    },
                    body: JSON.stringify({
                        elo_value: eloValue,
                        last_updated: new Date().toISOString()
                    })
                });
                
                if (patchResponse.ok) {
                    console.log(`✅ ELO actualizado en Supabase para ${playerName}: ${eloValue}`);
                    return true;
                } else {
                    throw new Error(`PATCH failed! status: ${patchResponse.status}`);
                }
            } else {
                throw new Error(`POST failed! status: ${response.status}`);
            }
            
        } catch (error) {
            console.error('❌ Error guardando ELO en Supabase:', error);
            return false;
        }
    }

    isEloExpired(lastUpdated) {
        const now = new Date();
        const lastUpdate = new Date(lastUpdated);
        const hoursDiff = (now - lastUpdate) / (1000 * 60 * 60);
        return hoursDiff >= 24; // Expira después de 24 horas
    }

    async deleteEloFromSupabase(playerName) {
        try {
            const response = await fetch(`${this.supabaseUrl}/rest/v1/aoe_elos_1v1?player_name=eq.${encodeURIComponent(playerName)}`, {
                method: 'DELETE',
                headers: {
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`
                }
            });
            
            if (response.ok) {
                console.log(`ELO eliminado de Supabase para ${playerName}`);
                return true;
            } else {
                console.error(`Error eliminando ELO de Supabase para ${playerName}:`, response.status);
                return false;
            }
        } catch (error) {
            console.error('Error eliminando ELO de Supabase:', error);
            return false;
        }
    }

    // Función específica para el botón de actualizar ELO
    async forceUpdatePlayerElo(playerName) {
        console.log(`🔄 Forzando actualización de ELO para: ${playerName}`);
        console.log(`📋 Jugador en índice: ${this.playerNames.indexOf(playerName)}`);
        
        // Verificar que el jugador existe y tiene user ID
        if (!this.playerNames.includes(playerName)) {
            console.error(`❌ Jugador no encontrado: ${playerName}`);
            return;
        }
        
        const userId = this.getPlayerUserId(playerName);
        if (!userId) {
            console.error(`No hay user ID para: ${playerName}`);
            this.updateEloDisplay(playerName, 'Sin user ID');
            return;
        }

        // Mostrar estado de carga
        this.updateEloDisplay(playerName, 'Buscando...');
        
        try {
            console.log(`Obteniendo ELO de la API oficial para ${playerName} (profile ${userId})`);
            const elo = await this.fetchEloFromRelic(userId);

            if (elo && elo !== 'No encontrado' && elo !== 'Error' && elo !== 'Timeout') {
                this.eloCache[playerName] = elo;
                this.saveEloCache(); // Guardar en localStorage como respaldo
                await this.saveEloToSupabase(playerName, elo); // Guardar en Supabase
                this.updateEloDisplay(playerName, elo);
                console.log(`💾 ELO guardado para ${playerName}: ${elo}`);
            } else {
                console.log(`❌ ELO no encontrado para ${playerName}`);
                this.updateEloDisplay(playerName, 'No encontrado');
                // NO guardar "No encontrado" en Supabase
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error(`Timeout obteniendo ELO para: ${playerName}`);
                this.updateEloDisplay(playerName, 'Timeout');
            } else {
                console.error(`Error obteniendo ELO para ${playerName}:`, error);
                this.updateEloDisplay(playerName, 'Error');
            }
        }
    }

    async updatePlayerElo(playerName, forceUpdate = false) {
        console.log('updatePlayerElo llamado para:', playerName, 'forceUpdate:', forceUpdate);
        
        // Verificar Supabase primero si no es una actualización forzada
        if (!forceUpdate) {
            const supabaseData = await this.fetchEloFromSupabase(playerName);
            if (supabaseData && !this.isEloExpired(supabaseData.last_updated) && supabaseData.elo_value !== 'No encontrado') {
                console.log('ELO encontrado en Supabase para:', playerName, ':', supabaseData.elo_value);
                this.eloCache[playerName] = supabaseData.elo_value;
                this.updateEloDisplay(playerName, supabaseData.elo_value);
                return;
            }
        }
        
        // Verificar caché local como respaldo
        if (!forceUpdate && this.isEloCached(playerName)) {
            console.log('ELO encontrado en caché local para:', playerName, ':', this.eloCache[playerName]);
            this.updateEloDisplay(playerName, this.eloCache[playerName]);
            return;
        }
        
        const userId = this.getPlayerUserId(playerName);
        console.log('User ID encontrado:', userId);
        if (!userId) {
            console.log('No hay ID de usuario para', playerName);
            return;
        }

        try {
            console.log('Obteniendo ELO de la API oficial para:', playerName, '(profile', userId + ')');
            const elo = await this.fetchEloFromRelic(userId);

            if (elo && elo !== 'No encontrado' && elo !== 'Error' && elo !== 'Timeout') {
                this.eloCache[playerName] = elo;
                this.saveEloCache(); // Guardar en localStorage como respaldo
                await this.saveEloToSupabase(playerName, elo); // Guardar en Supabase
                this.updateEloDisplay(playerName, elo);
                console.log(`ELO de ${playerName}: ${elo}`);
            } else {
                // No guardar "No encontrado" en Supabase, solo en caché local temporal
                this.eloCache[playerName] = 'No encontrado';
                this.saveEloCache(); // Guardar en localStorage como respaldo
                this.updateEloDisplay(playerName, 'No encontrado');
                console.log('ELO no encontrado para', playerName);
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('Timeout obteniendo ELO para:', playerName);
                this.updateEloDisplay(playerName, 'Timeout');
            } else {
                console.error('Error obteniendo ELO:', error);
                console.log('Error específico para', playerName, ':', error.message);
                this.updateEloDisplay(playerName, 'Error');
            }
        }
    }

    updateEloDisplay(playerName, elo) {
        console.log('🎯 updateEloDisplay llamado para:', playerName, 'con ELO:', elo);
        
        // Buscar la card por índice en lugar de por nombre
        const playerIndex = this.playerNames.indexOf(playerName);
        console.log('📋 Índice encontrado para', playerName, ':', playerIndex);
        console.log('📊 Total de jugadores:', this.playerNames.length);
        console.log('🎴 Total de cards:', this.players.length);
        
        if (playerIndex === -1) {
            console.log('❌ Jugador no encontrado en la lista:', playerName);
            console.log('📝 Jugadores disponibles:', this.playerNames);
            return;
        }
        
        const playerCard = this.players[playerIndex];
        if (playerCard) {
            const eloValue = playerCard.querySelector('.elo-value');
            if (eloValue) {
                eloValue.textContent = elo;
                eloValue.className = 'elo-value ' + this.getEloColorClass(elo);
                console.log('✅ ELO actualizado en la UI para:', playerName, 'en índice:', playerIndex);
                
                // Verificar que se actualizó correctamente
                const actualName = playerCard.querySelector('.player-name').value;
                console.log('🔍 Verificación - Nombre en card:', actualName, 'vs buscado:', playerName);
            } else {
                console.log('❌ No se encontró el elemento .elo-value para:', playerName);
            }
        } else {
            console.log('❌ No se encontró la tarjeta del jugador para:', playerName, 'en índice:', playerIndex);
            console.log('🎴 Cards disponibles:', this.players.map((card, i) => `${i}: ${card.querySelector('.player-name')?.value || 'sin nombre'}`));
        }
    }

    getEloColorClass(elo) {
        if (elo === 'Cargando...' || elo === 'Error' || elo === 'No encontrado') {
            return 'elo-neutral';
        }
        
        const eloNum = parseInt(elo);
        if (eloNum >= 1800) return 'elo-excellent';
        if (eloNum >= 1600) return 'elo-good';
        if (eloNum >= 1400) return 'elo-average';
        if (eloNum >= 1200) return 'elo-below-average';
        return 'elo-poor';
    }

    updateSliderColor(slider, value) {
        // Mantener el thumb siempre blanco
        slider.style.setProperty('--thumb-color', '#fff');
        
        // Mantener el valor numérico en blanco
        const valueElement = slider.nextElementSibling;
        valueElement.style.color = '#fff';
    }

    loadPlayerPhoto(playerName, imgElement) {
        // Intentar diferentes formatos de imagen
        const formats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        
        const tryLoadPhoto = (formatIndex) => {
            if (formatIndex >= formats.length) {
                // Si no se encontró ninguna foto, usar placeholder
    
                imgElement.src = 'placeholder-avatar.png';
                return;
            }
            
            const format = formats[formatIndex];
            const photoPath = `photos/${playerName}.${format}`;
            
            imgElement.onload = () => {

            };
            imgElement.onerror = () => {
                // Intentar el siguiente formato
                tryLoadPhoto(formatIndex + 1);
            };
            imgElement.src = photoPath;
        };
        
        tryLoadPhoto(0);
    }

    loadInitialData() {
        console.log('loadInitialData iniciado');
        // Verificar si estamos en un servidor web o abriendo localmente
        const isLocalFile = window.location.protocol === 'file:';
        
        if (isLocalFile) {
            console.log('Ejecutando localmente, usando datos por defecto');
            console.log('Protocolo actual:', window.location.protocol);
            // Cuando se abre localmente, no podemos hacer fetch, así que usamos datos por defecto
            return;
        }
        
        // Intentar cargar el archivo JSON por defecto (solo en servidor web)
        console.log('Intentando cargar desastre-squad-players.json...');
        fetch('desastre-squad-players.json')
            .then(response => {
                console.log('Respuesta del fetch:', response.status, response.ok);
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Archivo no encontrado');
                }
            })
            .then(data => {
                console.log('Datos cargados automáticamente desde desastre-squad-players.json');
                this.loadPlayerData(data);
                
                // Cargar ELO automáticamente para jugadores con user ID
                setTimeout(() => {
                    console.log('Iniciando carga automática de ELO...');
                    data.players.forEach(playerData => {
                        if (playerData.user) {
                            console.log('Cargando ELO automáticamente para:', playerData.name, 'con user ID:', playerData.user);
                            this.updatePlayerElo(playerData.name);
                        } else {
                            console.log('Jugador sin user ID:', playerData.name);
                        }
                    });
                }, 2000); // Esperar 2 segundos para que se carguen todos los datos
            })
            .catch(error => {
                console.log('Error en loadInitialData:', error);
                console.log('No se encontró desastre-squad-players.json, usando datos por defecto');
                // Los jugadores ya están creados con datos por defecto
            });
    }

    setupNavigation() {
        console.log('🔧 Configurando navegación...');
        const navBtns = document.querySelectorAll('.age-btn');
        const sections = document.querySelectorAll('.section');
        
        console.log('🔍 Botones de navegación encontrados:', navBtns.length);
        console.log('🔍 Secciones encontradas:', sections.length);
        
        navBtns.forEach((btn, index) => {
            console.log(`Botón ${index}:`, btn.textContent, 'data-section:', btn.dataset.section);
        });
        
        sections.forEach((section, index) => {
            console.log(`Sección ${index}:`, section.id);
        });

        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSection = btn.dataset.section;
                console.log('🔄 Navegando a sección:', targetSection);
                
                // Actualizar botones
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                console.log('✅ Botón activado:', btn.textContent);
                
                // Actualizar secciones
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === `${targetSection}-section`) {
                        section.classList.add('active');
                        console.log('✅ Sección activada:', section.id);
                    }
                });
                
                // Si se está navegando al ladder, configurar el botón
                if (targetSection === 'ladder') {
                    console.log('🏆 Navegando al ladder, configurando botón...');
                    setTimeout(() => {
                        this.setupLadderButton();
                    }, 100); // Pequeño delay para asegurar que el DOM esté listo
                }
            });
        });

        // Configurar el botón del ladder si la sección está activa inicialmente
        if (document.getElementById('ladder-section').classList.contains('active')) {
            this.setupLadderButton();
        }


    }

    setupLadderButton() {
        console.log('🔧 Configurando botón del ladder...');
        const loadLadderBtn = document.getElementById('load-ladder-btn');
        console.log('🔍 Buscando botón load-ladder-btn:', loadLadderBtn);
        
        if (loadLadderBtn) {
            // Agregar event listener directamente
            loadLadderBtn.onclick = () => {
                console.log('🚀 Botón de ladder clickeado!');
                this.loadAllElos();
            };
            console.log('✅ Event listener agregado al botón de ladder');
        } else {
            console.error('❌ No se encontró el botón load-ladder-btn');
        }
    }

    async loadAllElos() {
        console.log('🎯 Función loadAllElos iniciada');
        // Obtener jugadores con user ID
        const playersWithElo = this.playerNames.filter(name => this.getPlayerUserId(name));
        
        console.log(`Verificando ELOs para ${playersWithElo.length} jugadores...`);
        
        // Primero verificar cuáles necesitan actualización
        const playersToUpdate = [];
        const playersWithValidData = [];
        
        for (const playerName of playersWithElo) {
            const supabaseData = await this.fetchEloFromSupabase(playerName);
            if (supabaseData && !this.isEloExpired(supabaseData.last_updated) && supabaseData.elo_value !== 'No encontrado') {
                // ELO válido en Supabase (no expirado y no es "No encontrado")
                this.eloCache[playerName] = supabaseData.elo_value;
                playersWithValidData.push(playerName);
                console.log(`ELO válido encontrado para ${playerName}: ${supabaseData.elo_value}`);
            } else if (supabaseData && this.isEloExpired(supabaseData.last_updated) && supabaseData.elo_value !== 'No encontrado') {
                // ELO expirado pero válido, usar el existente y actualizar en background
                this.eloCache[playerName] = supabaseData.elo_value;
                playersWithValidData.push(playerName);
                playersToUpdate.push(playerName); // Para actualizar en background
                console.log(`ELO expirado pero válido para ${playerName}: ${supabaseData.elo_value}, actualizando en background...`);
            } else {
                // ELO no existe, es "No encontrado", o está expirado y es "No encontrado"
                playersToUpdate.push(playerName);
                if (supabaseData && supabaseData.elo_value === 'No encontrado') {
                    console.log(`ELO "No encontrado" para ${playerName}, eliminando y reintentando...`);
                    // Eliminar el "No encontrado" de Supabase para que se reintente
                    await this.deleteEloFromSupabase(playerName);
                } else if (supabaseData && this.isEloExpired(supabaseData.last_updated)) {
                    console.log(`ELO expirado para ${playerName}, actualizando...`);
                } else {
                    console.log(`No hay datos para ${playerName}, buscando...`);
                }
            }
        }
        
        console.log(`Jugadores con datos válidos: ${playersWithValidData.length}`);
        console.log(`Jugadores que necesitan actualización: ${playersToUpdate.length}`);
        
        // Mostrar ladder inmediatamente con los datos disponibles
        this.displayLadder();
        
        // Si hay jugadores que actualizar, hacerlo en background
        if (playersToUpdate.length > 0) {
            // Crear overlay de loading solo si hay jugadores que actualizar
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Actualizando ELOs en background...</div>
                    <div class="loading-info">Usando datos de Supabase. Actualizando ${playersToUpdate.length} jugadores.</div>
                    <div class="loading-progress">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="progress-text">0 / ${playersToUpdate.length}</div>
                    </div>
                </div>
            `;
            document.body.appendChild(loadingOverlay);

            let loadedCount = 0;
            const totalCount = playersToUpdate.length;

            console.log(`Actualizando ELOs para ${totalCount} jugadores en background...`);

            // Función para actualizar progreso
            const updateProgress = () => {
                const progressFill = loadingOverlay.querySelector('.progress-fill');
                const progressText = loadingOverlay.querySelector('.progress-text');
                const percentage = (loadedCount / totalCount) * 100;
                
                progressFill.style.width = percentage + '%';
                progressText.textContent = `${loadedCount} / ${totalCount}`;
            };

            // Función para cargar ELO de un jugador con retry
            const loadPlayerElo = async (playerName, index, retryCount = 0) => {
                try {
                    await this.updatePlayerElo(playerName, false);
                    loadedCount++;
                    updateProgress();
                    
                    // Si es el último, remover overlay y actualizar ladder
                    if (loadedCount === totalCount) {
                        setTimeout(() => {
                            loadingOverlay.style.opacity = '0';
                            setTimeout(() => {
                                document.body.removeChild(loadingOverlay);
                                this.displayLadder(); // Actualizar ladder con nuevos datos
                            }, 500);
                        }, 1000);
                    }
                } catch (error) {
                    console.error('Error cargando ELO para', playerName, error);
                    
                    // Retry hasta 2 veces con delay
                    if (retryCount < 2) {
                        console.log(`Reintentando ELO para ${playerName} (intento ${retryCount + 1})`);
                        setTimeout(() => {
                            loadPlayerElo(playerName, index, retryCount + 1);
                        }, 3000); // Esperar 3 segundos antes de retry
                    } else {
                        console.log(`Falló ELO para ${playerName} después de 3 intentos`);
                        loadedCount++;
                        updateProgress();
                    }
                }
            };

            // Cargar ELOs con delay para no sobrecargar
            playersToUpdate.forEach((playerName, index) => {
                setTimeout(() => {
                    loadPlayerElo(playerName, index);
                }, index * 5000); // 5 segundos entre cada petición
            });
        }
    }

    displayLadder() {
        const ladderContent = document.getElementById('ladder-content');
        const playersWithElo = this.playerNames.filter(name => this.getPlayerUserId(name));
        
        // Ordenar por ELO (descendente)
        const sortedPlayers = playersWithElo
            .map(name => ({
                name,
                elo: this.eloCache[name] || 'No disponible'
            }))
            .filter(player => player.elo !== 'No disponible' && player.elo !== 'Error' && player.elo !== 'Timeout' && player.elo !== 'No encontrado')
            .sort((a, b) => parseInt(b.elo) - parseInt(a.elo));

        if (sortedPlayers.length === 0) {
            ladderContent.innerHTML = `
                <div class="ladder-placeholder">
                    <div class="placeholder-icon">❌</div>
                    <p>No se pudieron cargar los ELOs. Intenta nuevamente.</p>
                </div>
            `;
            return;
        }

        ladderContent.innerHTML = `
            <div class="ladder-table">
                ${sortedPlayers.map((player, index) => `
                    <div class="ladder-row ${index < 3 ? 'top-3' : ''}">
                        <div class="rank">#${index + 1}</div>
                        <div class="player-name">${player.name}</div>
                        <div class="elo-value ${this.getEloColorClass(player.elo)}">${player.elo}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    handlePhotoUpload(input, playerCard) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = playerCard.querySelector('.player-photo-img');
                img.onload = () => {
                    // Foto subida exitosamente
                };
                img.onerror = () => {
                    // Error al cargar la foto subida
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    saveData() {
        const data = {
            players: this.players.map((playerCard, index) => {
                const stats = {};
                const sliders = playerCard.querySelectorAll('.stat-slider');
                sliders.forEach(slider => {
                    stats[slider.dataset.stat] = parseInt(slider.value);
                });

                return {
                    name: playerCard.querySelector('.player-name').value,
                    position: playerCard.querySelector('.player-position').value,
                    civilization: playerCard.querySelector('.player-civ').value,
                    apodo: playerCard.querySelector('.player-notes').value,
                    user: this.getPlayerUserId(playerCard.querySelector('.player-name').value),
                    stats: stats
                };
            })
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'desastre-squad-stats.json';
        link.click();
        
        URL.revokeObjectURL(url);
        alert('Datos guardados exitosamente!');
    }

    loadData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        this.loadPlayerData(data);
                        alert('Datos cargados exitosamente!');
                    } catch (error) {
                        alert('Error al cargar los datos. Verifica que el archivo sea válido.');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    loadPlayerData(data) {
        if (data.players && data.players.length > 0) {
            console.log('🔄 Cargando datos del JSON...');
            console.log('📋 Orden original de playerNames:', this.playerNames);
            
            data.players.forEach((playerData, jsonIndex) => {
                // Buscar el jugador por nombre en lugar de por índice
                const originalIndex = this.playerNames.indexOf(playerData.name);
                
                if (originalIndex !== -1 && originalIndex < this.players.length) {
                    const playerCard = this.players[originalIndex];
                    console.log(`✅ Actualizando card ${originalIndex} con datos de ${playerData.name} (JSON índice: ${jsonIndex})`);
                    
                    // NO cambiar el nombre del jugador - mantener el orden original
                    // playerCard.querySelector('.player-name').value = playerData.name || '';
                    
                    // Actualizar información del jugador (excepto el nombre)
                    playerCard.querySelector('.player-position').value = playerData.position || '';
                    playerCard.querySelector('.player-civ').value = playerData.civilization || '';
                    playerCard.querySelector('.player-notes').value = playerData.apodo || playerData.notes || '';
                    
                    // Cargar foto del archivo con nombre del jugador
                    const img = playerCard.querySelector('.player-photo-img');
                    const playerName = playerData.name || '';
                    this.loadPlayerPhoto(playerName, img);
                    
                    // Actualizar enlace de aoe2insights si hay user ID
                    const aoe2insightsLink = playerCard.querySelector('.aoe2insights-link');
                    if (playerData.user && aoe2insightsLink) {
                        aoe2insightsLink.href = `https://aoe2insights.com/user/${playerData.user}/`;
                        aoe2insightsLink.textContent = 'Ver perfil completo';
                    }

                    // Cargar ELO automáticamente si hay user ID
                    if (playerData.user) {
                        console.log('Cargando ELO desde loadPlayerData para:', playerData.name);
                        this.updatePlayerElo(playerData.name);
                    }

                    // Actualizar estadísticas
                    if (playerData.stats) {
                        Object.keys(playerData.stats).forEach(statName => {
                            const slider = playerCard.querySelector(`[data-stat="${statName}"]`);
                            if (slider) {
                                slider.value = playerData.stats[statName];
                                slider.nextElementSibling.textContent = playerData.stats[statName];
                                this.updateSliderColor(slider, playerData.stats[statName]);
                            }
                        });
                    }
                    
                    // Actualizar gráfico
                    this.updateRadarChart(originalIndex);
                } else {
                    console.log(`⚠️ Jugador del JSON no encontrado en playerNames: ${playerData.name}`);
                }
            });
            
            console.log('🎯 Verificación final después de cargar JSON:');
            this.players.forEach((card, i) => {
                const name = card.querySelector('.player-name')?.value || 'sin nombre';
                console.log(`  ${i}: ${name}`);
            });
        }
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.hideSearchResults();
            return;
        }

        // Debug: mostrar todos los nombres actuales
        console.log('Nombres actuales de jugadores:');
        this.players.forEach((player, index) => {
            const nameInput = player.querySelector('.player-name');
            console.log(`Índice ${index}: "${nameInput ? nameInput.value : 'N/A'}"`);
        });

        const results = this.playerNames.filter(name => 
            name.toLowerCase().includes(query.toLowerCase())
        );

        console.log(`Búsqueda: "${query}" - Resultados:`, results);
        this.displaySearchResults(results);
    }

    displaySearchResults(results) {
        const searchResults = document.getElementById('search-results');
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="age-search-result-item">No se encontraron jugadores</div>';
        } else {
            searchResults.innerHTML = results.map(name => {
                // Buscar el jugador correcto en el DOM por el nombre
                let playerCard = null;
                let playerIndex = -1;
                
                for (let i = 0; i < this.players.length; i++) {
                    const nameInput = this.players[i].querySelector('.player-name');
                    if (nameInput && nameInput.value === name) {
                        playerCard = this.players[i];
                        playerIndex = i;
                        break;
                    }
                }
                
                if (playerIndex === -1) {
                    console.error(`No se encontró el jugador: ${name}`);
                    return '';
                }
                
                const position = playerCard.querySelector('.player-position').value || 'Jugador del Equipo';
                const img = playerCard.querySelector('.player-photo-img').src;
                
                // Debug: verificar que el índice es correcto
                console.log(`Buscando "${name}" - Índice encontrado: ${playerIndex}`);
                console.log(`Jugador encontrado:`, {
                    name: name,
                    index: playerIndex,
                    position: position,
                    imgSrc: img
                });
                
                return `
                    <div class="age-search-result-item" onclick="app.goToPlayer(${playerIndex})">
                        <img src="${img}" alt="${name}">
                        <span class="player-name">${name}</span>
                        <span class="player-position">${position}</span>
                    </div>
                `;
            }).join('');
        }
        
        searchResults.style.display = 'block';
    }

    showSearchResults() {
        const searchResults = document.getElementById('search-results');
        searchResults.style.display = 'block';
    }

    hideSearchResults() {
        const searchResults = document.getElementById('search-results');
        searchResults.style.display = 'none';
    }




}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TeamStatsApp();
}); 