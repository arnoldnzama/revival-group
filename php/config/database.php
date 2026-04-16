<?php
/**
 * ═════════════════════════════════════════════════════════════════════════════
 * Fichier: config/database.php
 * ═════════════════════════════════════════════════════════════════════════════
 * Configuration de la base de données Revival
 * 
 * @author: Senior Dev Team
 * @version: 1.0
 * @updated: 2026-04-11
 * 
 * ENVIRONNEMENT: Production
 * CHARSET: UTF-8 (utf8mb4)
 * ENGINE: InnoDB
 * ═════════════════════════════════════════════════════════════════════════════
 */

// ──────────────────────────────────────────────────────────────────────────────
// 1. CONFIGURATION DE L'ENVIRONNEMENT
// ──────────────────────────────────────────────────────────────────────────────

define('ENVIRONMENT', getenv('ENVIRONMENT') ?? 'production');
define('DEBUG_MODE', ENVIRONMENT !== 'production');

// ──────────────────────────────────────────────────────────────────────────────
// 2. PARAMÈTRES DE CONNEXION À LA BASE DE DONNÉES
// ──────────────────────────────────────────────────────────────────────────────

// Configuration Emergen
const DB_CONFIG = [
    'host'     => getenv('DB_HOST') ?? 'localhost',
    'port'     => (int)(getenv('DB_PORT') ?? 3306),
    'username' => getenv('DB_USER') ?? 'emergen1_revival',
    'password' => getenv('DB_PASS') ?? 'F@mille123',
    'database' => getenv('DB_NAME') ?? 'emergen1_revival',
    'charset'  => 'utf8mb4',
    'collation'=> 'utf8mb4_unicode_ci'
];

// ──────────────────────────────────────────────────────────────────────────────
// 3. OPTIONS DE CONNEXION (MySQL PDO)
// ──────────────────────────────────────────────────────────────────────────────

const PDO_OPTIONS = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
    PDO::ATTR_TIMEOUT            => 30,
    PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true
];

// ──────────────────────────────────────────────────────────────────────────────
// 4. CLASSE DE GESTION DE CONNEXION (Singleton)
// ──────────────────────────────────────────────────────────────────────────────

class DatabaseConnection {
    private static ?PDO $connection = null;
    private static array $stats = [
        'queries' => 0,
        'slow_queries' => [],
        'errors' => [],
    ];

    /**
     * Obtenir la connexion PDO unique
     * 
     * @return PDO
     * @throws PDOException
     */
    public static function getInstance(): PDO {
        if (self::$connection === null) {
            self::connect();
        }
        return self::$connection;
    }

    /**
     * Établir la connexion MySQL
     * 
     * @throws PDOException
     */
    private static function connect(): void {
        try {
            $dsn = sprintf(
                'mysql:host=%s;port=%d;dbname=%s;charset=%s',
                DB_CONFIG['host'],
                DB_CONFIG['port'],
                DB_CONFIG['database'],
                DB_CONFIG['charset']
            );

            self::$connection = new PDO(
                $dsn,
                DB_CONFIG['username'],
                DB_CONFIG['password'],
                PDO_OPTIONS
            );

            if (DEBUG_MODE) {
                error_log("✅ Connexion BD réussie: " . DB_CONFIG['database']);
            }
        } catch (PDOException $e) {
            self::handleError($e);
        }
    }

    /**
     * Exécuter une requête préparée
     * 
     * @param string $query Requête SQL
     * @param array $params Paramètres liés
     * @return PDOStatement
     */
    public static function query(string $query, array $params = []): PDOStatement {
        try {
            $pdo = self::getInstance();
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            
            self::$stats['queries']++;
            return $stmt;
        } catch (PDOException $e) {
            self::handleError($e);
        }
    }

    /**
     * Insérer des données
     * 
     * @param string $table
     * @param array $data
     * @return string|false ID inséré ou false
     */
    public static function insert(string $table, array $data): string|false {
        $columns = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));
        $query = "INSERT INTO $table ($columns) VALUES ($placeholders)";

        try {
            self::query($query, array_values($data));
            return self::getInstance()->lastInsertId();
        } catch (PDOException $e) {
            self::handleError($e);
            return false;
        }
    }

    /**
     * Mettre à jour des données
     * 
     * @param string $table
     * @param array $data
     * @param string $where
     * @param array $whereParams
     * @return int Nombre de lignes affectées
     */
    public static function update(string $table, array $data, string $where, array $whereParams = []): int {
        $sets = implode(', ', array_map(fn($k) => "$k = ?", array_keys($data)));
        $query = "UPDATE $table SET $sets WHERE $where";
        $params = array_merge(array_values($data), $whereParams);

        try {
            $stmt = self::query($query, $params);
            return $stmt->rowCount();
        } catch (PDOException $e) {
            self::handleError($e);
            return 0;
        }
    }

    /**
     * Supprimer des données
     * 
     * @param string $table
     * @param string $where
     * @param array $params
     * @return int Nombre de lignes affectées
     */
    public static function delete(string $table, string $where, array $params = []): int {
        $query = "DELETE FROM $table WHERE $where";

        try {
            $stmt = self::query($query, $params);
            return $stmt->rowCount();
        } catch (PDOException $e) {
            self::handleError($e);
            return 0;
        }
    }

    /**
     * Obtenir une ligne
     * 
     * @param string $query
     * @param array $params
     * @return array|null
     */
    public static function fetch(string $query, array $params = []): ?array {
        try {
            $stmt = self::query($query, $params);
            return $stmt->fetch();
        } catch (PDOException $e) {
            self::handleError($e);
            return null;
        }
    }

    /**
     * Obtenir toutes les lignes
     * 
     * @param string $query
     * @param array $params
     * @return array
     */
    public static function fetchAll(string $query, array $params = []): array {
        try {
            $stmt = self::query($query, $params);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            self::handleError($e);
            return [];
        }
    }

    /**
     * Gérer les erreurs
     * 
     * @param PDOException|Exception $e
     * @throws Exception
     */
    private static function handleError($e): void {
        self::$stats['errors'][] = [
            'message' => $e->getMessage(),
            'timestamp' => date('Y-m-d H:i:s')
        ];

        $message = DEBUG_MODE 
            ? $e->getMessage() 
            : 'Erreur de base de données. Veuillez réessayer plus tard.';

        error_log("❌ Erreur BD: " . $e->getMessage());
        throw new Exception($message);
    }

    /**
     * Obtenir les statistiques
     * @return array
     */
    public static function getStats(): array {
        return self::$stats;
    }

    /**
     * Fermer la connexion
     */
    public static function close(): void {
        self::$connection = null;
    }
}

// ──────────────────────────────────────────────────────────────────────────────
// 5. EXEMPLE D'UTILISATION
// ──────────────────────────────────────────────────────────────────────────────

/*
// Récupérer une vidéo
$video = DatabaseConnection::fetch(
    "SELECT * FROM videos WHERE youtube_id = ?",
    ['dJn4ugANCLg']
);

// Obtenir les commentaires approuvés
$comments = DatabaseConnection::fetchAll(
    "SELECT * FROM video_comments 
     WHERE video_id = ? AND is_approved = 1 AND is_deleted = 0
     ORDER BY created_at DESC",
    [$video['id']]
);

// Insérer un like
$likeId = DatabaseConnection::insert('video_likes', [
    'video_id' => $video['id'],
    'ip_address' => $_SERVER['REMOTE_ADDR'],
    'user_agent' => $_SERVER['HTTP_USER_AGENT']
]);

// Mettre à jour un commentaire
DatabaseConnection::update(
    'video_comments',
    ['is_approved' => 1, 'approved_at' => date('Y-m-d H:i:s')],
    'id = ?',
    [$commentId]
);

// Supprimer un commentaire (soft delete)
DatabaseConnection::update(
    'video_comments',
    ['is_deleted' => 1, 'deleted_at' => date('Y-m-d H:i:s')],
    'id = ?',
    [$commentId]
);
*/

// ──────────────────────────────────────────────────────────────────────────────
// 6. VÉRIFICATION DE CONNEXION
// ──────────────────────────────────────────────────────────────────────────────

// Au démarrage de l'application
try {
    $pdo = DatabaseConnection::getInstance();
    $pdo->query("SELECT 1"); // Test de connexion simple
} catch (Exception $e) {
    die("Erreur critique: Impossible de se connecter à la base de données. " . $e->getMessage());
}

?>
