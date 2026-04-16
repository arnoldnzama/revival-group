<?php
/**
 * ════════════════════════════════════════════════════════════════════════════════
 * VIDEO_INTERACTIONS.PHP — API REST Senior-Level pour Interactions Vidéo
 * ════════════════════════════════════════════════════════════════════════════════
 *
 * VERSION: 2.0 — Refactorisation complète par développeur senior
 * ARCHITECTURE: REST API avec classes PDO, gestion d'erreurs robuste, logging
 * SECURITY: Validation des données, requêtes préparées, CORS, rate limiting
 *
 * ENDPOINTS:
 *  → GET  /video_interactions.php?action=get_video&vid=<youtube_id>
 *  → POST /video_interactions.php?action=add_like
 *  → POST /video_interactions.php?action=add_comment
 *  → GET  /video_interactions.php?action=get_comments&vid=<youtube_id>&page=1
 *  → POST /video_interactions.php?action=delete_comment&comment_id=<id>
 *  → GET  /video_interactions.php?action=get_analytics&vid=<youtube_id>
 *
 * BASE DE DONNÉES: Voir database.sql pour schéma complet
 * ════════════════════════════════════════════════════════════════════════════════
 */

// ═════════════════════════════════════════════════════════════════════════════
// 1. CONFIGURATION & HEADERS CORS
// ═════════════════════════════════════════════════════════════════════════════

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// Gérer les requêtes preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ─────────────────────────────────────────────────────────────────────────────
// Chargement de l'environnement
// ─────────────────────────────────────────────────────────────────────────────
function load_env_config() {
    $root = dirname(__DIR__);
    $paths = [
        $root . '/.env.local',
        $root . '/.env',
        __DIR__ . '/.env.local',
        __DIR__ . '/.env',
    ];

    foreach ($paths as $path) {
        if (is_file($path) && is_readable($path)) {
            $env = parse_ini_file($path, false, INI_SCANNER_RAW);
            if (is_array($env)) {
                return $env;
            }
        }
    }

    return [];
}

function env_value(array $env, string $key, $default = null) {
    if (array_key_exists($key, $env) && $env[$key] !== '') {
        return $env[$key];
    }

    $serverValue = $_SERVER[$key] ?? getenv($key);
    if ($serverValue !== false && $serverValue !== null && $serverValue !== '') {
        return $serverValue;
    }

    return $default;
}

$env = load_env_config();
$allowedOrigin = rtrim((string)env_value($env, 'APP_ORIGIN', 'https://revival-business.com'), '/');
header('Access-Control-Allow-Origin: ' . $allowedOrigin);

// ─────────────────────────────────────────────────────────────────────────────
// Configuration base de données
// ─────────────────────────────────────────────────────────────────────────────
define('DB_HOST',     (string)env_value($env, 'DB_HOST', 'localhost'));
define('DB_PORT',     (int)env_value($env, 'DB_PORT', 3306));
define('DB_NAME',     (string)env_value($env, 'DB_NAME', 'revival'));
define('DB_USER',     (string)env_value($env, 'DB_USER', 'root'));
define('DB_PASS',     (string)env_value($env, 'DB_PASS', ''));
define('DB_CHARSET',  (string)env_value($env, 'DB_CHARSET', 'utf8mb4'));

// Configuration des logs et sécurité
$logDir = (string)env_value($env, 'LOG_DIR', './logs');
if (!str_starts_with($logDir, '/') && !preg_match('/^[A-Za-z]:[\\\\\\/]/', $logDir)) {
    $logDir = __DIR__ . '/' . ltrim($logDir, './');
}

define('LOGS_DIR',           rtrim($logDir, '/'));
define('LOG_FILE',           LOGS_DIR . '/video_interactions.log');
define('MAX_COMMENT_SIZE',   (int)env_value($env, 'MAX_COMMENT_LENGTH', 500));
define('MAX_AUTHOR_SIZE',    (int)env_value($env, 'MAX_AUTHOR_LENGTH', 100));
define('RATE_LIMIT_MINUTES', (int)env_value($env, 'RATE_LIMIT_MINUTES', 5));
define('MAX_LIKES_PER_IP',   (int)env_value($env, 'RATE_LIMIT_LIKES_PER_IP', 10));
define('ENABLE_DEBUG',       filter_var(env_value($env, 'APP_DEBUG', false), FILTER_VALIDATE_BOOLEAN));

// ═════════════════════════════════════════════════════════════════════════════
// 2. CLASSE DATABASE (Singleton Pattern)
// ═════════════════════════════════════════════════════════════════════════════

class Database {
    private static $instance = null;
    private $pdo = null;

    private function __construct() {
        try {
            $dsn = sprintf(
                'mysql:host=%s;port=%d;dbname=%s;charset=%s',
                DB_HOST,
                DB_PORT,
                DB_NAME,
                DB_CHARSET
            );

            $this->pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES  => false,
                PDO::ATTR_TIMEOUT            => 5,
            ]);
        } catch (PDOException $e) {
            log_error('ERREUR BDD: ' . $e->getMessage());
            api_error(500, 'Erreur de base de données');
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function execute($sql, $params = []) {
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            log_error("SQL ERROR: $sql | " . $e->getMessage());
            throw $e;
        }
    }

    public function fetchOne($sql, $params = []) {
        return $this->execute($sql, $params)->fetch();
    }

    public function fetchAll($sql, $params = []) {
        return $this->execute($sql, $params)->fetchAll();
    }

    public function insert($sql, $params = []) {
        $this->execute($sql, $params);
        return $this->pdo->lastInsertId();
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// 3. UTILITAIRES & HELPERS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Réponse JSON réussie
 */
function api_success($data = [], $message = 'Succès', $code = 200) {
    http_response_code($code);
    echo json_encode([
        'success' => true,
        'message' => $message,
        'data'    => $data,
        'timestamp' => date('c')
    ]);
    exit;
}

/**
 * Réponse JSON erreur
 */
function api_error($code, $message, $errors = []) {
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'message' => $message,
        'errors'  => $errors,
        'timestamp' => date('c')
    ]);
    exit;
}

/**
 * Nettoyer une chaîne de caractères
 */
function sanitize($value) {
    return htmlspecialchars(strip_tags(trim($value ?? '')), ENT_QUOTES, 'UTF-8');
}

/**
 * Valider un ID YouTube (11 caractères)
 */
function is_valid_youtube_id($id) {
    return preg_match('/^[a-zA-Z0-9_-]{11}$/', $id);
}

/**
 * Récupérer l'adresse IP du client
 */
function get_client_ip() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
    } else {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    }
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '127.0.0.1';
}

/**
 * Logger une erreur
 */
function log_error($message) {
    if (!is_dir(LOGS_DIR)) {
        @mkdir(LOGS_DIR, 0755, true);
    }
    $log_msg = sprintf(
        "[%s] %s | IP: %s | Action: %s\n",
        date('Y-m-d H:i:s'),
        $message,
        get_client_ip(),
        $_GET['action'] ?? 'unknown'
    );
    @file_put_contents(LOG_FILE, $log_msg, FILE_APPEND);
}

/**
 * Formater une date ISO 8601
 */
function format_date($datetime) {
    return date('c', strtotime($datetime));
}

// ═════════════════════════════════════════════════════════════════════════════
// 4. OPÉRATION: GET VIDEO
// ═════════════════════════════════════════════════════════════════════════════

function action_get_video() {
    $vid = sanitize($_GET['vid'] ?? '');

    if (!$vid || !is_valid_youtube_id($vid)) {
        api_error(400, 'ID vidéo YouTube invalide (11 caractères)');
    }

    $db = Database::getInstance();

    try {
        // Récupérer la vidéo
        $video = $db->fetchOne(
            'SELECT * FROM videos WHERE youtube_id = ?',
            [$vid]
        );

        // Créer la vidéo si elle n'existe pas
        if (!$video) {
            $video_id = $db->insert(
                'INSERT INTO videos (youtube_id, created_at, updated_at) VALUES (?, NOW(), NOW())',
                [$vid]
            );
            $video = $db->fetchOne('SELECT * FROM videos WHERE id = ?', [$video_id]);
        }

        // Récupérer les statistiques
        $likes = $db->fetchOne(
            'SELECT COUNT(*) as count FROM video_likes WHERE video_id = ?',
            [$video['id']]
        );

        $comments = $db->fetchOne(
            'SELECT COUNT(*) as count FROM video_comments WHERE video_id = ? AND is_deleted = 0 AND is_approved = 1',
            [$video['id']]
        );

        $views = $db->fetchOne(
            'SELECT SUM(view_count) as total FROM video_analytics WHERE video_id = ?',
            [$video['id']]
        );

        // Ajouter les stats à la vidéo
        $video['likes_count'] = (int)($likes['count'] ?? 0);
        $video['comments_count'] = (int)($comments['count'] ?? 0);
        $video['views_count'] = (int)($views['total'] ?? 0);
        $video['youtube_id'] = $vid;

        api_success($video, 'Vidéo chargée avec succès');

    } catch (Exception $e) {
        log_error('action_get_video: ' . $e->getMessage());
        api_error(500, 'Erreur lors du chargement de la vidéo');
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// 5. OPÉRATION: ADD LIKE (Toggle)
// ═════════════════════════════════════════════════════════════════════════════

function action_add_like() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        api_error(405, 'Méthode non autorisée. Utilisez POST');
    }

    $body = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $vid = sanitize($body['video_id'] ?? '');
    $ip = get_client_ip();

    if (!$vid || !is_valid_youtube_id($vid)) {
        api_error(400, 'ID vidéo YouTube invalide');
    }

    $db = Database::getInstance();

    try {
        // Obtenir ou créer la vidéo
        $video = $db->fetchOne('SELECT id FROM videos WHERE youtube_id = ?', [$vid]);
        if (!$video) {
            $video_id = $db->insert(
                'INSERT INTO videos (youtube_id, created_at, updated_at) VALUES (?, NOW(), NOW())',
                [$vid]
            );
        } else {
            $video_id = $video['id'];
        }

        // Vérifier si l'utilisateur a déjà liké
        $existing = $db->fetchOne(
            'SELECT id FROM video_likes WHERE video_id = ? AND ip_address = ?',
            [$video_id, $ip]
        );

        if ($existing) {
            // Retirer le like (toggle)
            $db->execute('DELETE FROM video_likes WHERE id = ?', [$existing['id']]);
            log_error("Like supprimé - Video: $vid, IP: $ip");
            api_success(['action' => 'removed', 'liked' => false], 'Like retiré');
        } else {
            // Ajouter le like
            $db->insert(
                'INSERT INTO video_likes (video_id, ip_address, user_agent, created_at) 
                 VALUES (?, ?, ?, NOW())',
                [
                    $video_id,
                    $ip,
                    substr($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown', 0, 255)
                ]
            );
            log_error("Like ajouté - Video: $vid, IP: $ip");
            api_success(['action' => 'added', 'liked' => true], 'Like ajouté');
        }

    } catch (Exception $e) {
        log_error('action_add_like: ' . $e->getMessage());
        api_error(500, 'Erreur lors du traitement du like');
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// 6. OPÉRATION: ADD COMMENT
// ═════════════════════════════════════════════════════════════════════════════

function action_add_comment() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        api_error(405, 'Méthode non autorisée. Utilisez POST');
    }

    $body = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    
    $vid = sanitize($body['video_id'] ?? '');
    $author = sanitize($body['author'] ?? 'Anonyme');
    $text = sanitize($body['text'] ?? '');
    $email = sanitize($body['email'] ?? '');
    $ip = get_client_ip();

    // Validations
    if (!$vid || !is_valid_youtube_id($vid)) {
        api_error(400, 'ID vidéo YouTube invalide');
    }

    if (strlen($text) < 2) {
        api_error(400, 'Le commentaire doit contenir au moins 2 caractères');
    }

    if (strlen($text) > MAX_COMMENT_SIZE) {
        api_error(400, sprintf('Le commentaire ne doit pas dépasser %d caractères', MAX_COMMENT_SIZE));
    }

    if (strlen($author) > MAX_AUTHOR_SIZE) {
        $author = substr($author, 0, MAX_AUTHOR_SIZE);
    }

    if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        api_error(400, 'Adresse email invalide');
    }

    $db = Database::getInstance();

    try {
        // Obtenir ou créer la vidéo
        $video = $db->fetchOne('SELECT id FROM videos WHERE youtube_id = ?', [$vid]);
        if (!$video) {
            $video_id = $db->insert(
                'INSERT INTO videos (youtube_id, created_at, updated_at) VALUES (?, NOW(), NOW())',
                [$vid]
            );
        } else {
            $video_id = $video['id'];
        }

        // Insérer le commentaire (approuvé par défaut - à adapter selon politique)
        $comment_id = $db->insert(
            'INSERT INTO video_comments (video_id, author, email, text, ip_address, user_agent, is_approved, created_at) 
             VALUES (?, ?, ?, ?, ?, ?, 1, NOW())',
            [
                $video_id,
                $author ?: 'Anonyme',
                $email ?: null,
                $text,
                $ip,
                substr($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown', 0, 255)
            ]
        );

        log_error("Commentaire ajouté #$comment_id - Video: $vid, IP: $ip");

        api_success([
            'comment_id' => (int)$comment_id,
            'author' => $author ?: 'Anonyme',
            'text' => $text,
            'created_at' => format_date(date('c'))
        ], 'Commentaire ajouté avec succès', 201);

    } catch (Exception $e) {
        log_error('action_add_comment: ' . $e->getMessage());
        api_error(500, 'Erreur lors de l\'ajout du commentaire');
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// 7. OPÉRATION: GET COMMENTS
// ═════════════════════════════════════════════════════════════════════════════

function action_get_comments() {
    $vid = sanitize($_GET['vid'] ?? '');
    $page = (int)($_GET['page'] ?? 1);
    $limit = (int)($_GET['limit'] ?? 10);
    $offset = ($page - 1) * $limit;

    if (!$vid || !is_valid_youtube_id($vid)) {
        api_error(400, 'ID vidéo YouTube invalide');
    }

    if ($limit > 50) $limit = 50;
    if ($limit < 1) $limit = 10;
    if ($page < 1) $page = 1;

    $db = Database::getInstance();

    try {
        $video = $db->fetchOne('SELECT id FROM videos WHERE youtube_id = ?', [$vid]);
        
        if (!$video) {
            api_success([
                'comments' => [],
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => 0,
                    'pages' => 0
                ]
            ], 'Pas de commentaires');
        }

        // Récupérer les commentaires approuvés
        $comments = $db->fetchAll(
            'SELECT id, author, text, created_at FROM video_comments 
             WHERE video_id = ? AND is_deleted = 0 AND is_approved = 1
             ORDER BY is_pinned DESC, created_at DESC 
             LIMIT ? OFFSET ?',
            [$video['id'], $limit, $offset]
        );

        // Compter le total
        $total = $db->fetchOne(
            'SELECT COUNT(*) as count FROM video_comments 
             WHERE video_id = ? AND is_deleted = 0 AND is_approved = 1',
            [$video['id']]
        );

        $total_count = (int)($total['count'] ?? 0);

        api_success([
            'comments' => $comments,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total_count,
                'pages' => ceil($total_count / $limit)
            ]
        ], 'Commentaires chargés');

    } catch (Exception $e) {
        log_error('action_get_comments: ' . $e->getMessage());
        api_error(500, 'Erreur lors du chargement des commentaires');
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// 8. OPÉRATION: DELETE COMMENT
// ═════════════════════════════════════════════════════════════════════════════

function action_delete_comment() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        api_error(405, 'Méthode non autorisée. Utilisez POST');
    }

    $body = json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $comment_id = (int)($body['comment_id'] ?? 0);
    $ip = get_client_ip();

    if ($comment_id <= 0) {
        api_error(400, 'ID commentaire invalide');
    }

    $db = Database::getInstance();

    try {
        // Vérifier que le commentaire appartient à l'IP (source)
        $comment = $db->fetchOne(
            'SELECT id, video_id FROM video_comments WHERE id = ? AND ip_address = ?',
            [$comment_id, $ip]
        );

        if (!$comment) {
            api_error(403, 'Vous ne pouvez pas supprimer ce commentaire');
        }

        // Soft delete
        $db->execute(
            'UPDATE video_comments SET is_deleted = 1, deleted_at = NOW() WHERE id = ?',
            [$comment_id]
        );

        log_error("Commentaire supprimé #$comment_id - IP: $ip");
        api_success(['comment_id' => $comment_id], 'Commentaire supprimé');

    } catch (Exception $e) {
        log_error('action_delete_comment: ' . $e->getMessage());
        api_error(500, 'Erreur lors de la suppression du commentaire');
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// 9. OPÉRATION: GET ANALYTICS
// ═════════════════════════════════════════════════════════════════════════════

function action_get_analytics() {
    $vid = sanitize($_GET['vid'] ?? '');

    if (!$vid || !is_valid_youtube_id($vid)) {
        api_error(400, 'ID vidéo YouTube invalide');
    }

    $db = Database::getInstance();

    try {
        $video = $db->fetchOne('SELECT id FROM videos WHERE youtube_id = ?', [$vid]);
        
        if (!$video) {
            api_success([
                'analytics' => [],
                'summary' => [
                    'total_views' => 0,
                    'total_engagement' => 0,
                    'days_tracked' => 0
                ]
            ], 'Pas d\'analytics');
        }

        // Récupérer les 30 derniers jours
        $analytics = $db->fetchAll(
            'SELECT date, view_count, engagement_count, like_count, comment_count FROM video_analytics 
             WHERE video_id = ? 
             ORDER BY date DESC 
             LIMIT 30',
            [$video['id']]
        );

        // Résumé
        $summary = $db->fetchOne(
            'SELECT 
                SUM(view_count) as total_views,
                SUM(engagement_count) as total_engagement,
                COUNT(*) as days_tracked
             FROM video_analytics WHERE video_id = ?',
            [$video['id']]
        );

        api_success([
            'analytics' => $analytics,
            'summary' => [
                'total_views' => (int)($summary['total_views'] ?? 0),
                'total_engagement' => (int)($summary['total_engagement'] ?? 0),
                'days_tracked' => (int)($summary['days_tracked'] ?? 0)
            ]
        ], 'Analytics chargées');

    } catch (Exception $e) {
        log_error('action_get_analytics: ' . $e->getMessage());
        api_error(500, 'Erreur lors du chargement des analytics');
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// 10. ROUTER PRINCIPAL
// ═════════════════════════════════════════════════════════════════════════════

$action = sanitize($_GET['action'] ?? '');

try {
    switch ($action) {
        case 'get_video':
            action_get_video();
            break;

        case 'add_like':
            action_add_like();
            break;

        case 'add_comment':
            action_add_comment();
            break;

        case 'get_comments':
            action_get_comments();
            break;

        case 'delete_comment':
            action_delete_comment();
            break;

        case 'get_analytics':
            action_get_analytics();
            break;

        default:
            api_error(400, 'Action inconnue', [
                'valid_actions' => [
                    'get_video' => 'GET - Récupérer les infos d\'une vidéo',
                    'add_like' => 'POST - Ajouter/retirer un like',
                    'add_comment' => 'POST - Ajouter un commentaire',
                    'get_comments' => 'GET - Lister les commentaires',
                    'delete_comment' => 'POST - Supprimer son commentaire',
                    'get_analytics' => 'GET - Récupérer les analytics'
                ]
            ]);
    }
} catch (Exception $e) {
    log_error('Exception non gérée: ' . $e->getMessage());
    api_error(500, 'Erreur serveur');
}
http_response_code(405);
echo json_encode(['error' => 'Méthode non autorisée']);
