-- ════════════════════════════════════════════════════════════════════════════════
-- BASE DE DONNÉES REVIVAL — Système de Gestion des Interactions Vidéo
-- ════════════════════════════════════════════════════════════════════════════════
--
-- VERSION        : 1.1
-- CRÉÉ           : 2026-04-11
-- BASE DE DONNÉES: emergen1_revival
-- UTILISATEUR    : emergen1_revival
-- MOT DE PASSE   : F@mille123
--
-- INSTALLATION:
--   Importer ce fichier directement via phpMyAdmin dans la base emergen1_revival
--
-- ════════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: VIDEOS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS videos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    youtube_id VARCHAR(11) UNIQUE NOT NULL COMMENT 'ID YouTube (11 caractères)',
    title VARCHAR(255) COMMENT 'Titre de la vidéo',
    description TEXT COMMENT 'Description de la vidéo',
    duration INT COMMENT 'Durée en secondes',
    views_youtube INT UNSIGNED DEFAULT 0 COMMENT 'Vues via API YouTube',
    thumbnail_url VARCHAR(500) COMMENT 'URL de la miniature',
    is_featured BOOLEAN DEFAULT 0 COMMENT 'Vidéo en avant-plan ?',
    featured_position INT DEFAULT NULL COMMENT 'Position si en avant-plan',
    status ENUM('active', 'archived', 'deleted') DEFAULT 'active' COMMENT 'État de la vidéo',
    metadata JSON COMMENT 'Métadonnées JSON additionnelles',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_youtube_id (youtube_id),
    INDEX idx_status (status),
    INDEX idx_is_featured (is_featured),
    INDEX idx_created_at (created_at)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: VIDEO_LIKES
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS video_likes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    video_id INT UNSIGNED NOT NULL COMMENT 'Référence à la vidéo',
    ip_address VARCHAR(45) NOT NULL COMMENT 'Adresse IP du visiteur (IPv4 ou IPv6)',
    user_agent VARCHAR(255) COMMENT 'User-Agent du navigateur',
    fingerprint VARCHAR(64) COMMENT 'Fingerprint du dispositif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_like_per_ip (video_id, ip_address),
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    INDEX idx_video_id (video_id),
    INDEX idx_ip_address (ip_address),
    INDEX idx_created_at (created_at)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: VIDEO_COMMENTS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS video_comments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    video_id INT UNSIGNED NOT NULL COMMENT 'Référence à la vidéo',
    author VARCHAR(100) NOT NULL DEFAULT 'Anonyme' COMMENT 'Nom de l\'auteur',
    email VARCHAR(255) DEFAULT NULL COMMENT 'Email de l\'auteur (optionnel)',
    text TEXT NOT NULL COMMENT 'Contenu du commentaire',
    ip_address VARCHAR(45) NOT NULL COMMENT 'Adresse IP du commentateur',
    user_agent VARCHAR(255) COMMENT 'User-Agent du navigateur',
    is_approved BOOLEAN DEFAULT 1 COMMENT 'Approuvé pour affichage (1=oui)',
    is_deleted BOOLEAN DEFAULT 0 COMMENT 'Soft delete',
    is_pinned BOOLEAN DEFAULT 0 COMMENT 'Épinglé',
    parent_comment_id BIGINT UNSIGNED DEFAULT NULL COMMENT 'Pour les réponses imbriquées',
    likes_count INT UNSIGNED DEFAULT 0 COMMENT 'Likes du commentaire',
    spam_score INT DEFAULT 0 COMMENT 'Score spam (0-100)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL COMMENT 'Date de suppression (soft delete)',
    approved_at DATETIME DEFAULT NULL COMMENT 'Date d\'approbation',

    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES video_comments(id) ON DELETE SET NULL,
    INDEX idx_video_id (video_id),
    INDEX idx_is_approved (is_approved),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_is_pinned (is_pinned),
    INDEX idx_created_at (created_at),
    INDEX idx_ip_address (ip_address)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: VIDEO_ANALYTICS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS video_analytics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    video_id INT UNSIGNED NOT NULL COMMENT 'Référence à la vidéo',
    date DATE NOT NULL COMMENT 'Date de la métrique',
    view_count INT UNSIGNED DEFAULT 0 COMMENT 'Vues du jour',
    engagement_count INT UNSIGNED DEFAULT 0 COMMENT 'Engagements (likes + commentaires)',
    like_count INT UNSIGNED DEFAULT 0 COMMENT 'Likes du jour',
    comment_count INT UNSIGNED DEFAULT 0 COMMENT 'Commentaires du jour',
    click_count INT UNSIGNED DEFAULT 0 COMMENT 'Clics sur les CTA',
    unique_visitors INT UNSIGNED DEFAULT 0 COMMENT 'Visiteurs uniques',
    avg_watch_time FLOAT DEFAULT NULL COMMENT 'Temps moyen de lecture (secondes)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_video_date (video_id, date),
    INDEX idx_video_id (video_id),
    INDEX idx_date (date)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: VIDEO_INTERACTIONS_LOG
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS video_interactions_log (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    type ENUM('like_added', 'like_removed', 'comment_added', 'comment_deleted', 'comment_approved', 'view') DEFAULT 'view' COMMENT 'Type d\'interaction',
    video_id VARCHAR(11) DEFAULT NULL COMMENT 'ID vidéo YouTube',
    identifier_hash VARCHAR(64) NOT NULL COMMENT 'Hash IP+timestamp',
    ip VARCHAR(45) NOT NULL COMMENT 'Adresse IP source',
    user_agent VARCHAR(255) COMMENT 'User-Agent',
    reference_id BIGINT UNSIGNED DEFAULT NULL COMMENT 'ID commentaire/like/etc',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_type (type),
    INDEX idx_video_id (video_id),
    INDEX idx_ip (ip),
    INDEX idx_identifier_hash (identifier_hash),
    INDEX idx_created_at (created_at)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: VIDEO_MODERATION_QUEUE
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS video_moderation_queue (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    comment_id BIGINT UNSIGNED NOT NULL UNIQUE COMMENT 'Référence au commentaire',
    reason ENUM('manual', 'spam_detected', 'inappropriate', 'external_link') DEFAULT 'manual',
    notes TEXT COMMENT 'Notes du modérateur',
    reviewed_by INT UNSIGNED DEFAULT NULL,
    reviewed_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (comment_id) REFERENCES video_comments(id) ON DELETE CASCADE,
    INDEX idx_reason (reason),
    INDEX idx_created_at (created_at)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- TABLE: VIDEO_SUBSCRIBERS
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS video_subscribers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL COMMENT 'Email d\'abonnement',
    video_id INT UNSIGNED DEFAULT NULL COMMENT 'NULL = toutes les vidéos',
    notify_on_comment BOOLEAN DEFAULT 1,
    notify_on_reply BOOLEAN DEFAULT 1,
    is_confirmed BOOLEAN DEFAULT 0,
    confirmation_token VARCHAR(64) DEFAULT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    confirmed_at DATETIME DEFAULT NULL,

    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_subscriber (email, video_id),
    INDEX idx_email (email),
    INDEX idx_is_confirmed (is_confirmed),
    INDEX idx_is_active (is_active)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- VUES
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW video_stats_summary AS
SELECT
    v.id,
    v.youtube_id,
    v.title,
    COUNT(DISTINCT vl.id) AS likes,
    COUNT(DISTINCT vc.id) AS comments,
    COALESCE(SUM(va.view_count), 0) AS views,
    MAX(va.date) AS last_activity
FROM videos v
LEFT JOIN video_likes vl ON v.id = vl.video_id
LEFT JOIN video_comments vc ON v.id = vc.video_id AND vc.is_deleted = 0
LEFT JOIN video_analytics va ON v.id = va.video_id
WHERE v.status = 'active'
GROUP BY v.id, v.youtube_id, v.title;

CREATE OR REPLACE VIEW approved_recent_comments AS
SELECT
    vc.id,
    vc.video_id,
    vc.author,
    vc.text,
    vc.created_at,
    v.youtube_id
FROM video_comments vc
JOIN videos v ON vc.video_id = v.id
WHERE vc.is_approved = 1
  AND vc.is_deleted = 0
  AND vc.created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY vc.created_at DESC;

-- ─────────────────────────────────────────────────────────────────────────────
-- DONNÉES INITIALES
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO videos (youtube_id, title, description, is_featured)
VALUES
    ('dJn4ugANCLg', 'FACILITEZ VOUS LA TACHE AVEC LA POSHUB', 'Solution intelligente de gestion d\'entreprise', 1),
    ('V0iWwb_AYM8', 'PHARMA HUB - Solution digitale pharmacie', 'Solution complète pour pharmacies', 1)
ON DUPLICATE KEY UPDATE updated_at = NOW();
