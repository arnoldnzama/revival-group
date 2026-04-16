<?php
/**
 * application-submit.php
 * Receptionne la candidature, envoie un email a recruitment@revival-business.com
 * et un email de confirmation au candidat.
 */

header('Content-Type: application/json; charset=utf-8');

// Autoriser uniquement POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Methode non autorisee.']);
    exit;
}

// ── Sanitize helpers ──
function clean(string $val): string {
    return htmlspecialchars(strip_tags(trim($val)), ENT_QUOTES, 'UTF-8');
}

function isValidEmail(string $email): bool {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// ── Recuperer les champs ──
$fullName    = clean($_POST['full_name']    ?? '');
$email       = trim($_POST['email']         ?? '');
$salary      = clean($_POST['salary_expectation'] ?? '');
$availability = clean($_POST['availability'] ?? '');
$jobTitle    = clean($_POST['job_title']    ?? '');
$jobCompany  = clean($_POST['job_company']  ?? '');
$jobLocation = clean($_POST['job_location'] ?? '');
$jobDesc     = clean($_POST['job_description'] ?? '');
$rgpd        = isset($_POST['rgpd_consent']) && $_POST['rgpd_consent'] === '1';
$recontact   = isset($_POST['recontact_consent']) && $_POST['recontact_consent'] === '1';

$recipientEmail = 'recruitment@revival-business.com';

// ── Validation ──
$errors = [];
if (empty($fullName))          $errors[] = 'Nom complet requis.';
if (!isValidEmail($email))     $errors[] = 'Email invalide.';
if (empty($availability))      $errors[] = 'Disponibilite requise.';
if (!$rgpd)                    $errors[] = 'Consentement RGPD requis.';

// Validation fichiers
$allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
$allowedExts  = ['pdf', 'doc', 'docx'];
$maxSize      = 5 * 1024 * 1024; // 5 Mo

function validateFile(array $file, string $fieldName, array $allowedMimes, array $allowedExts, int $maxSize): ?string {
    if (!isset($file['tmp_name']) || $file['error'] !== UPLOAD_ERR_OK) {
        return "$fieldName : fichier manquant ou erreur d'upload.";
    }
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedExts)) {
        return "$fieldName : format non accepte (PDF, DOC, DOCX uniquement).";
    }
    if ($file['size'] > $maxSize) {
        return "$fieldName : fichier trop volumineux (max 5 Mo).";
    }
    return null;
}

$cvError    = validateFile($_FILES['cv']           ?? [], 'CV',                   $allowedMimes, $allowedExts, $maxSize);
$coverError = validateFile($_FILES['cover_letter'] ?? [], 'Lettre de motivation', $allowedMimes, $allowedExts, $maxSize);
if ($cvError)    $errors[] = $cvError;
if ($coverError) $errors[] = $coverError;

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// ── Construire l'email RH ──
$boundary = '----=_Part_' . md5(uniqid());

$subjectRH = "Nouvelle candidature : $jobTitle — $fullName";

$bodyRH = "Bonjour,\r\n\r\n";
$bodyRH .= "Une nouvelle candidature a ete soumise via le site.\r\n\r\n";
$bodyRH .= "=== POSTE ===\r\n";
$bodyRH .= "Titre       : $jobTitle\r\n";
$bodyRH .= "Entreprise  : $jobCompany\r\n";
$bodyRH .= "Localisation: $jobLocation\r\n\r\n";
$bodyRH .= "=== CANDIDAT ===\r\n";
$bodyRH .= "Nom         : $fullName\r\n";
$bodyRH .= "Email       : $email\r\n";
$bodyRH .= "Pretention  : " . ($salary ?: 'Non renseignee') . "\r\n";
$bodyRH .= "Disponibilite: $availability\r\n\r\n";
$bodyRH .= "=== CONSENTEMENTS ===\r\n";
$bodyRH .= "RGPD        : Accepte\r\n";
$bodyRH .= "Recontact   : " . ($recontact ? 'Accepte' : 'Refuse') . "\r\n\r\n";
$bodyRH .= "=== DESCRIPTION DU POSTE ===\r\n$jobDesc\r\n\r\n";
$bodyRH .= "---\r\nCandidature soumise le " . date('d/m/Y a H:i') . "\r\n";

// Preparer les pieces jointes
function encodeAttachment(array $file): string {
    $content = file_get_contents($file['tmp_name']);
    return chunk_split(base64_encode($content));
}

$cvName    = basename($_FILES['cv']['name']);
$coverName = basename($_FILES['cover_letter']['name']);
$cvData    = encodeAttachment($_FILES['cv']);
$coverData = encodeAttachment($_FILES['cover_letter']);

// Headers multipart
$headersRH  = "From: noreply@revival-tech.com\r\n";
$headersRH .= "Reply-To: $email\r\n";
$headersRH .= "MIME-Version: 1.0\r\n";
$headersRH .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

$messageRH  = "--$boundary\r\n";
$messageRH .= "Content-Type: text/plain; charset=UTF-8\r\n";
$messageRH .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$messageRH .= $bodyRH . "\r\n";

// Attacher CV
$messageRH .= "--$boundary\r\n";
$messageRH .= "Content-Type: application/octet-stream; name=\"$cvName\"\r\n";
$messageRH .= "Content-Transfer-Encoding: base64\r\n";
$messageRH .= "Content-Disposition: attachment; filename=\"$cvName\"\r\n\r\n";
$messageRH .= $cvData . "\r\n";

// Attacher lettre
$messageRH .= "--$boundary\r\n";
$messageRH .= "Content-Type: application/octet-stream; name=\"$coverName\"\r\n";
$messageRH .= "Content-Transfer-Encoding: base64\r\n";
$messageRH .= "Content-Disposition: attachment; filename=\"$coverName\"\r\n\r\n";
$messageRH .= $coverData . "\r\n";
$messageRH .= "--$boundary--";

// ── Envoyer email RH ──
$sentRH = mail($recipientEmail, $subjectRH, $messageRH, $headersRH);

// ── Email de confirmation au candidat ──
$subjectCandidat = "Confirmation de votre candidature — $jobTitle";
$bodyCandidat  = "Bonjour $fullName,\r\n\r\n";
$bodyCandidat .= "Nous avons bien recu votre candidature pour le poste de $jobTitle";
$bodyCandidat .= $jobCompany ? " chez $jobCompany" : "";
$bodyCandidat .= ".\r\n\r\n";
$bodyCandidat .= "Votre dossier est en cours d'examen. Notre equipe vous contactera dans les meilleurs delais.\r\n\r\n";
$bodyCandidat .= "Recapitulatif de votre candidature :\r\n";
$bodyCandidat .= "- Poste         : $jobTitle\r\n";
$bodyCandidat .= "- Localisation  : $jobLocation\r\n";
$bodyCandidat .= "- Disponibilite : $availability\r\n\r\n";
$bodyCandidat .= "Merci de l'interet que vous portez a Revival Tech.\r\n\r\n";
$bodyCandidat .= "Cordialement,\r\nL'equipe Revival Tech\r\n";

$headersCandidat  = "From: noreply@revival-tech.com\r\n";
$headersCandidat .= "Reply-To: $recipientEmail\r\n";
$headersCandidat .= "MIME-Version: 1.0\r\n";
$headersCandidat .= "Content-Type: text/plain; charset=UTF-8\r\n";

mail($email, $subjectCandidat, $bodyCandidat, $headersCandidat);

// ── Reponse ──
if ($sentRH) {
    echo json_encode(['success' => true, 'message' => 'Candidature envoyee avec succes.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'envoi de l\'email. Veuillez reessayer.']);
}
