/**
 * ════════════════════════════════════════════════════════════════════════════════
 * VIDEO_INTERACTIONS_CLIENT.JS — Client-side Video Interactions Manager
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * Gère les interactions vidéo (likes, commentaires) côté client
 * Compatible avec video_interactions.php (API REST)
 *
 * UTILISATION:
 *   1. Incluez ce fichier : <script src="video_interactions_client.js"></script>
 *   2. Initialisez : VideoInteractions.init();
 *   3. Utilisez les méthodes publiques
 *
 * API:
 *   VideoInteractions.like(videoId, element);
 *   VideoInteractions.addComment(videoId, { author, email, text });
 *   VideoInteractions.loadComments(videoId, page);
 *   VideoInteractions.deleteComment(commentId);
 *   VideoInteractions.getStats(videoId);
 */

const VideoInteractions = (() => {
    'use strict';

    // ─────────────────────────────────────────────────────────────────────────────
    // CONFIGURATION
    // ─────────────────────────────────────────────────────────────────────────────

    const CONFIG = {
        apiUrl: 'https://revival-business.com/php/video_interactions.php',
        timeout: 10000,
        retries: 3,
        debug: false // Mettez à true pour le développement
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // ÉTAT LOCAL
    // ─────────────────────────────────────────────────────────────────────────────

    const state = {
        loading: {},
        cache: {},
        userIp: null,
        errors: []
    };

    // ─────────────────────────────────────────────────────────────────────────────
    // FONCTIONS UTILITAIRES
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * Fonction debug (console.log si DEBUG actif)
     */
    function debug(...args) {
        if (CONFIG.debug) {
            console.log('[VideoInteractions]', ...args);
        }
    }

    /**
     * Faire une requête API avec retry automatique
     */
    async function apiCall(action, method = 'GET', body = null, retryCount = 0) {
        const url = new URL(CONFIG.apiUrl, window.location.origin);
        url.searchParams.append('action', action);

        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            signal: AbortSignal.timeout(CONFIG.timeout)
        };

        if (body && method !== 'GET') {
            options.body = JSON.stringify(body);
        }

        try {
            debug(`Appel API: ${action} (${method})`);
            const response = await fetch(url.toString(), options);
            const data = await response.json();

            if (!data.success && response.status >= 500 && retryCount < CONFIG.retries) {
                // Retry sur erreur serveur
                await sleep(1000 * (retryCount + 1));
                return apiCall(action, method, body, retryCount + 1);
            }

            if (!response.ok && data.success === false) {
                throw new Error(data.message || 'Erreur API');
            }

            return data;

        } catch (error) {
            console.error(`[VideoInteractions Error] ${action}:`, error.message);
            throw error;
        }
    }

    /**
     * Utilitaire de délai (ms)
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Formater une date ISO en FR
     */
    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const now = new Date();
        const diff = now - date;

        // Moins d'une minute
        if (diff < 60000) return 'À l\'instant';

        // Moins d\'une heure
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `Il y a ${minutes}m`;
        }

        // Moins d\'un jour
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `Il y a ${hours}h`;
        }

        // Moins d\'une semaine
        if (diff < 604800000) {
            const days = Math.floor(diff / 86400000);
            return `Il y a ${days}j`;
        }

        // Date complète
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Valider un ID YouTube
     */
    function isValidYoutubeId(id) {
        return /^[a-zA-Z0-9_-]{11}$/.test(id);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GESTION DES LIKES
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * Ajouter/Retirer un like (toggle)
     */
    async function like(videoId, buttonElement = null) {
        if (!isValidYoutubeId(videoId)) {
            console.error('ID vidéo invalide:', videoId);
            return false;
        }

        if (buttonElement) {
            buttonElement.disabled = true;
            buttonElement.classList.add('loading');
        }

        try {
            const response = await apiCall('add_like', 'POST', { video_id: videoId });

            if (response.success) {
                debug(`Like ${response.data.action}:`, videoId);

                // Mettre à jour l'interface
                if (buttonElement) {
                    const isLiked = response.data.action === 'added';
                    buttonElement.classList.toggle('liked', isLiked);

                    // Actualiser le compteur
                    const countElement = buttonElement.querySelector('.like-count');
                    if (countElement) {
                        let count = parseInt(countElement.textContent) || 0;
                        countElement.textContent = isLiked ? count + 1 : Math.max(count - 1, 0);
                    }
                }

                return true;
            } else {
                throw new Error(response.message);
            }

        } catch (error) {
            if (error.message.includes('Trop de requêtes')) {
                alert('Trop de likes en peu de temps. Veuillez réessayer dans quelques minutes.');
            } else {
                alert('Erreur lors du like: ' + error.message);
            }
            return false;

        } finally {
            if (buttonElement) {
                buttonElement.disabled = false;
                buttonElement.classList.remove('loading');
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GESTION DES COMMENTAIRES
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * Ajouter un commentaire
     */
    async function addComment(videoId, commentData) {
        if (!isValidYoutubeId(videoId)) {
            console.error('ID vidéo invalide:', videoId);
            return false;
        }

        const { author = 'Anonyme', email = '', text = '' } = commentData;

        // Validation
        if (!text || text.trim().length < 2) {
            alert('Le commentaire doit contenir au moins 2 caractères');
            return false;
        }

        if (text.length > 500) {
            alert('Le commentaire ne doit pas dépasser 500 caractères');
            return false;
        }

        try {
            const response = await apiCall('add_comment', 'POST', {
                video_id: videoId,
                author: author || 'Anonyme',
                email: email,
                text: text
            });

            if (response.success) {
                debug('Commentaire ajouté:', response.data.comment_id);
                
                // Afficher le nouveau commentaire
                if (response.data.comment_id) {
                    addCommentToUI(response.data);
                }

                return response.data;
            } else {
                throw new Error(response.message);
            }

        } catch (error) {
            alert('Erreur: ' + error.message);
            return false;
        }
    }

    /**
     * Charger les commentaires d'une vidéo
     */
    async function loadComments(videoId, page = 1, limit = 10) {
        if (!isValidYoutubeId(videoId)) {
            console.error('ID vidéo invalide:', videoId);
            return { comments: [], pagination: {} };
        }

        // Vérifier le cache
        const cacheKey = `comments_${videoId}_p${page}`;
        if (state.cache[cacheKey]) {
            debug('Commentaires depuis cache:', cacheKey);
            return state.cache[cacheKey];
        }

        try {
            const url = new URL(CONFIG.apiUrl, window.location.origin);
            url.searchParams.append('action', 'get_comments');
            url.searchParams.append('vid', videoId);
            url.searchParams.append('page', page);
            url.searchParams.append('limit', limit);

            const response = await fetch(url.toString());
            const data = await response.json();

            if (data.success) {
                debug(`Loaded ${data.data.comments.length} comments`);
                state.cache[cacheKey] = data.data;
                return data.data;
            } else {
                throw new Error(data.message);
            }

        } catch (error) {
            console.error('Erreur loadComments:', error.message);
            return { comments: [], pagination: {} };
        }
    }

    /**
     * Ajouter un commentaire à l'interface
     */
    function addCommentToUI(comment) {
        const container = document.querySelector(`.vid-comments-list[data-vid]`);
        if (!container) return;

        const html = `
            <div class="vid-comment" data-cid="${comment.comment_id}" style="animation: slideIn 0.3s ease-out">
                <div class="vid-comment__author"><strong>${escapeHtml(comment.author)}</strong></div>
                <div class="vid-comment__text">${escapeHtml(comment.text)}</div>
                <div class="vid-comment__meta">
                    <span class="vid-comment__time">À l'instant</span>
                    <button class="vid-comment__delete" onclick="VideoInteractions.deleteComment(${comment.comment_id})">
                        Supprimer
                    </button>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('afterbegin', html);

        // Actualiser le compteur
        const countElement = container.closest('.vid-interact').querySelector('.comment-count');
        if (countElement) {
            countElement.textContent = parseInt(countElement.textContent || 0) + 1;
        }

        // Animation
        return new Promise(resolve => {
            setTimeout(resolve, 300);
        });
    }

    /**
     * Supprimer un commentaire
     */
    async function deleteComment(commentId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
            return false;
        }

        try {
            const response = await apiCall('delete_comment', 'POST', {
                comment_id: commentId
            });

            if (response.success) {
                debug('Commentaire supprimé:', commentId);

                // Retirer de l'interface
                const element = document.querySelector(`[data-cid="${commentId}"]`);
                if (element) {
                    element.style.animation = 'slideOut 0.3s ease-out forwards';
                    setTimeout(() => element.remove(), 300);
                }

                return true;
            } else {
                alert(response.message);
                return false;
            }

        } catch (error) {
            alert('Erreur: ' + error.message);
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // STATISTIQUES
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * Récupérer les stats d'une vidéo
     */
    async function getStats(videoId) {
        if (!isValidYoutubeId(videoId)) {
            console.error('ID vidéo invalide:', videoId);
            return null;
        }

        try {
            const url = new URL(CONFIG.apiUrl, window.location.origin);
            url.searchParams.append('action', 'get_video');
            url.searchParams.append('vid', videoId);

            const response2 = await fetch(url.toString());
            const data = await response2.json();

            if (data.success) {
                debug('Stats chargées:', videoId);
                return data.data;
            } else {
                throw new Error(data.message);
            }

        } catch (error) {
            console.error('Erreur getStats:', error.message);
            return null;
        }
    }

    /**
     * Récupérer les analytics
     */
    async function getAnalytics(videoId) {
        if (!isValidYoutubeId(videoId)) {
            console.error('ID vidéo invalide:', videoId);
            return null;
        }

        try {
            const url = new URL(CONFIG.apiUrl, window.location.origin);
            url.searchParams.append('action', 'get_analytics');
            url.searchParams.append('vid', videoId);

            const response = await fetch(url.toString());
            const data = await response.json();

            if (data.success) {
                debug('Analytics chargées:', videoId);
                return data.data;
            } else {
                throw new Error(data.message);
            }

        } catch (error) {
            console.error('Erreur getAnalytics:', error.message);
            return null;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UTILITAIRES SUPPLÉMENTAIRES
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * Échapper les caractères HTML pour éviter les injections
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Initialiser les event listeners
     */
    function initEventListeners() {
        // Boutons like
        document.addEventListener('click', function(e) {
            if (e.target.closest('.vid-like-btn')) {
                const btn = e.target.closest('.vid-like-btn');
                const videoId = btn.dataset.vid;
                like(videoId, btn);
            }
        });

        // Formulaire commentaire
        document.addEventListener('submit', function(e) {
            if (e.target.closest('.vid-comment-form')) {
                e.preventDefault();
                const form = e.target.closest('.vid-comment-form');
                const videoId = form.dataset.vid;
                const author = form.querySelector('.vid-author-input')?.value || 'Anonyme';
                const text = form.querySelector('.vid-text-input')?.value || '';

                addComment(videoId, { author, text }).then(result => {
                    if (result) {
                        form.reset();
                    }
                });
            }
        });

        // Toggle commentaires
        document.addEventListener('click', function(e) {
            if (e.target.closest('.vid-comment-toggle')) {
                const btn = e.target.closest('.vid-comment-toggle');
                const videoId = btn.dataset.vid;
                const box = document.querySelector(`.vid-comments-box[data-vid="${videoId}"]`);
                if (box) {
                    box.style.display = box.style.display === 'none' ? 'block' : 'none';
                    if (box.style.display === 'block') {
                        loadComments(videoId).then(data => {
                            // Rendu...
                        });
                    }
                }
            }
        });

        debug('Event listeners initialisés');
    }

    /**
     * Initialisation générale
     */
    function init() {
        debug('Initialisation VideoInteractions...');

        // Charger l'IP utilisateur (optionnel)
        fetch('https://api.ipify.org?format=json')
            .then(r => r.json())
            .then(data => state.userIp = data.ip)
            .catch(() => debug('Impossible de récupérer l\'IP'));

        // Initialiser les écouteurs d'événements
        initEventListeners();

        // Ajouter les styles CSS
        addStyles();

        debug('Initialisation terminée');
    }

    /**
     * Ajouter les styles CSS nécessaires
     */
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .vid-like-btn.liked { color: #019cd6; }
            .vid-like-btn.loading { opacity: 0.6; pointer-events: none; }
            .vid-like-btn.liked svg { fill: #019cd6; stroke: #019cd6; }
            
            [data-cid] { animation: slideIn 0.3s ease-out; }
            
            @keyframes slideIn {
                from { opacity: 0; transform: translateX(-20px); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes slideOut {
                to { opacity: 0; transform: translateX(20px); }
            }
        `;
        document.head.appendChild(style);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // API PUBLIQUE
    // ─────────────────────────────────────────────────────────────────────────────

    return {
        init,
        like,
        addComment,
        loadComments,
        deleteComment,
        getStats,
        getAnalytics,
        formatDate,
        escapeHtml,
        config: CONFIG,
        state: state
    };
})();

// Auto-init si document ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', VideoInteractions.init);
} else {
    VideoInteractions.init();
}
