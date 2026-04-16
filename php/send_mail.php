<?php
/**
 * send_mail.php — Gestionnaire d'envoi d'email via SMTP (PHPMailer)
 * Destination : nzamarnold@gmail.com
 *
 * Installation PHPMailer :
 *   composer require phpmailer/phpmailer
 * Ou télécharger manuellement : https://revival-business.com/PHPMailer/PHPMailer
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Autoload Composer ou inclusion manuelle
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require __DIR__ . '/vendor/autoload.php';
} else {
    require __DIR__ . '/PHPMailer/src/Exception.php';
    require __DIR__ . '/PHPMailer/src/PHPMailer.php';
    require __DIR__ . '/PHPMailer/src/SMTP.php';
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://revival-business.com');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Sécurité : uniquement POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

// Récupération des données JSON ou form-data
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

// ── Configuration SMTP ──────────────────────────────────────────────────────
// Remplacez ces valeurs par vos identifiants SMTP réels
// Pour Gmail : activez "Mots de passe d'application" dans votre compte Google
define('SMTP_HOST',     'smtp.gmail.com');
define('SMTP_PORT',     465);
define('SMTP_SECURE',   'ssl');
define('SMTP_USER',     'contact@revival-business.com');   // Votre adresse Gmail
define('SMTP_PASS',     'VOTRE_MOT_DE_PASSE_APP'); // Mot de passe d'application Gmail
define('MAIL_FROM',     'contact@revival-business.com');
define('MAIL_FROM_NAME','Revival Group');
define('MAIL_TO_CONTACT',  'contact@revival-business.com');
define('MAIL_TO_PARTNER',  'part@revival-business.com');
// ────────────────────────────────────────────────────────────────────────────

$type = isset($input['type']) ? $input['type'] : 'contact';

$mail = new PHPMailer(true);

try {
    // Paramètres SMTP
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = SMTP_SECURE;
    $mail->Port       = SMTP_PORT;
    $mail->CharSet    = 'UTF-8';

    // Expéditeur & destinataire selon le type
    $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
    $mail->addAddress($type === 'partner' ? MAIL_TO_PARTNER : MAIL_TO_CONTACT);

    // Reply-To avec l'email de l'utilisateur si disponible
    $userEmail = isset($input['email']) ? filter_var($input['email'], FILTER_SANITIZE_EMAIL) : '';
    if ($userEmail && filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
        $mail->addReplyTo($userEmail, isset($input['name']) ? htmlspecialchars($input['name']) : 'Utilisateur');
    }

    $mail->isHTML(true);

    if ($type === 'partner') {
        // ── Email partenariat ──
        $company     = htmlspecialchars($input['company'] ?? '');
        $manager     = htmlspecialchars($input['manager'] ?? '');
        $phone       = htmlspecialchars($input['phone'] ?? '');
        $partnerType = htmlspecialchars($input['partner_type'] ?? '');
        $objective   = htmlspecialchars($input['objective'] ?? '');
        $sector      = htmlspecialchars($input['sector'] ?? '');
        $size        = htmlspecialchars($input['company_size'] ?? '');
        $website     = htmlspecialchars($input['website'] ?? '');

        $mail->Subject = "Nouvelle demande de partenariat — $company";
        $mail->Body = "
        <div style='font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:32px;border-radius:12px'>
          <div style='background:linear-gradient(135deg,#019cd6,#035194);padding:24px 32px;border-radius:8px;margin-bottom:24px'>
            <h1 style='color:#fff;margin:0;font-size:22px'>🤝 Nouvelle demande de partenariat</h1>
          </div>
          <div style='background:#fff;padding:24px;border-radius:8px;border:1px solid #e2e8f0'>
            <table style='width:100%;border-collapse:collapse'>
              <tr><td style='padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;width:40%'>Entreprise</td><td style='padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:600'>$company</td></tr>
              <tr><td style='padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b'>Responsable</td><td style='padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:600'>$manager</td></tr>
              <tr><td style='padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b'>Email</td><td style='padding:10px 0;border-bottom:1px solid #f1f5f9'><a href='mailto:$userEmail'>$userEmail</a></td></tr>
              <tr><td style='padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b'>Téléphone</td><td style='padding:10px 0;border-bottom:1px solid #f1f5f9'>$phone</td></tr>
              <tr><td style='padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b'>Secteur</td><td style='padding:10px 0;border-bottom:1px solid #f1f5f9'>$sector</td></tr>
              <tr><td style='padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b'>Taille</td><td style='padding:10px 0;border-bottom:1px solid #f1f5f9'>$size</td></tr>
              <tr><td style='padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b'>Site web</td><td style='padding:10px 0;border-bottom:1px solid #f1f5f9'>$website</td></tr>
              <tr><td style='padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b'>Type de partenariat</td><td style='padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:600;color:#019cd6'>$partnerType</td></tr>
            </table>
            <div style='margin-top:20px'>
              <p style='color:#64748b;margin-bottom:8px'>Objectif du partenariat :</p>
              <div style='background:#f8fafc;padding:16px;border-radius:8px;border-left:4px solid #019cd6'>$objective</div>
            </div>
          </div>
          <p style='color:#94a3b8;font-size:12px;text-align:center;margin-top:20px'>Revival Website — Formulaire de partenariat</p>
        </div>";

        $mail->AltBody = "Nouvelle demande de partenariat\n\nEntreprise : $company\nResponsable : $manager\nEmail : $userEmail\nTéléphone : $phone\nType : $partnerType\n\nObjectif :\n$objective";

        // Email de confirmation à l'utilisateur
        if ($userEmail) {
            $confirmMail = new PHPMailer(true);
            $confirmMail->isSMTP();
            $confirmMail->Host       = SMTP_HOST;
            $confirmMail->SMTPAuth   = true;
            $confirmMail->Username   = SMTP_USER;
            $confirmMail->Password   = SMTP_PASS;
            $confirmMail->SMTPSecure = SMTP_SECURE;
            $confirmMail->Port       = SMTP_PORT;
            $confirmMail->CharSet    = 'UTF-8';
            $confirmMail->setFrom(MAIL_FROM, 'Revival');
            $confirmMail->addAddress($userEmail, $manager);
            $confirmMail->isHTML(true);
            $confirmMail->Subject = "Votre demande de partenariat a bien été reçue — Revival";
            $confirmMail->Body = "
            <div style='font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:32px;border-radius:12px'>
              <div style='background:linear-gradient(135deg,#019cd6,#035194);padding:24px 32px;border-radius:8px;margin-bottom:24px;text-align:center'>
                <h1 style='color:#fff;margin:0;font-size:22px'>✅ Demande bien reçue !</h1>
              </div>
              <div style='background:#fff;padding:24px;border-radius:8px;border:1px solid #e2e8f0'>
                <p>Bonjour <strong>$manager</strong>,</p>
                <p>Nous avons bien reçu votre demande de partenariat pour <strong>$company</strong>.</p>
                <p>Notre équipe l'examinera et vous contactera <strong>dans les 48 heures</strong> à l'adresse <a href='mailto:$userEmail'>$userEmail</a>.</p>
                <div style='background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;margin-top:20px'>
                  <p style='color:#166534;margin:0'>Type de partenariat sélectionné : <strong>$partnerType</strong></p>
                </div>
              </div>
              <p style='color:#94a3b8;font-size:12px;text-align:center;margin-top:20px'>Revival — Votre partenaire technologique</p>
            </div>";
            $confirmMail->send();
        }

    } else {
        // ── Email contact ──
        $firstName = htmlspecialchars($input['firstName'] ?? '');
        $lastName  = htmlspecialchars($input['lastName'] ?? '');
        $company   = htmlspecialchars($input['company'] ?? '');
        $subject   = htmlspecialchars($input['subject'] ?? '');
        $message   = nl2br(htmlspecialchars($input['message'] ?? ''));
        $fullName  = trim("$firstName $lastName");

        $mail->Subject = "Nouveau message de contact — $fullName";
        $mail->Body = "
        <div style='font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:32px;border-radius:12px'>
          <div style='background:linear-gradient(135deg,#019cd6,#035194);padding:24px 32px;border-radius:8px;margin-bottom:24px'>
            <h1 style='color:#fff;margin:0;font-size:22px'>✉️ Nouveau message de contact</h1>
          </div>
          <div style='background:#fff;padding:24px;border-radius:8px;border:1px solid #e2e8f0'>
            <table style='width:100%;border-collapse:collapse'>
              <tr><td style='padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;width:40%'>Nom</td><td style='padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:600'>$fullName</td></tr>
              <tr><td style='padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b'>Email</td><td style='padding:10px 0;border-bottom:1px solid #f1f5f9'><a href='mailto:$userEmail'>$userEmail</a></td></tr>
              <tr><td style='padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b'>Entreprise</td><td style='padding:10px 0;border-bottom:1px solid #f1f5f9'>$company</td></tr>
              <tr><td style='padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b'>Sujet</td><td style='padding:10px 0;border-bottom:1px solid #f1f5f9;font-weight:600;color:#019cd6'>$subject</td></tr>
            </table>
            <div style='margin-top:20px'>
              <p style='color:#64748b;margin-bottom:8px'>Message :</p>
              <div style='background:#f8fafc;padding:16px;border-radius:8px;border-left:4px solid #019cd6'>$message</div>
            </div>
          </div>
          <p style='color:#94a3b8;font-size:12px;text-align:center;margin-top:20px'>Revival Website — Formulaire de contact</p>
        </div>";

        $mail->AltBody = "Nouveau message de contact\n\nNom : $fullName\nEmail : $userEmail\nEntreprise : $company\nSujet : $subject\n\nMessage :\n" . strip_tags($message);

        // Email de confirmation à l'utilisateur
        if ($userEmail) {
            $confirmMail = new PHPMailer(true);
            $confirmMail->isSMTP();
            $confirmMail->Host       = SMTP_HOST;
            $confirmMail->SMTPAuth   = true;
            $confirmMail->Username   = SMTP_USER;
            $confirmMail->Password   = SMTP_PASS;
            $confirmMail->SMTPSecure = SMTP_SECURE;
            $confirmMail->Port       = SMTP_PORT;
            $confirmMail->CharSet    = 'UTF-8';
            $confirmMail->setFrom(MAIL_FROM, 'Revival');
            $confirmMail->addAddress($userEmail, $fullName);
            $confirmMail->isHTML(true);
            $confirmMail->Subject = "Votre message a bien été reçu — Revival";
            $confirmMail->Body = "
            <div style='font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:32px;border-radius:12px'>
              <div style='background:linear-gradient(135deg,#019cd6,#035194);padding:24px 32px;border-radius:8px;margin-bottom:24px;text-align:center'>
                <h1 style='color:#fff;margin:0;font-size:22px'>✅ Message bien reçu !</h1>
              </div>
              <div style='background:#fff;padding:24px;border-radius:8px;border:1px solid #e2e8f0'>
                <p>Bonjour <strong>$fullName</strong>,</p>
                <p>Nous avons bien reçu votre message concernant : <strong>$subject</strong>.</p>
                <p>Notre équipe vous répondra <strong>sous 24 heures</strong> à l'adresse <a href='mailto:$userEmail'>$userEmail</a>.</p>
              </div>
              <p style='color:#94a3b8;font-size:12px;text-align:center;margin-top:20px'>Revival — Votre partenaire technologique</p>
            </div>";
            $confirmMail->send();
        }
    }

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Email envoyé avec succès.']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur d\'envoi : ' . $mail->ErrorInfo]);
}
