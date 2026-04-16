// ═══════════════════════════════════════
// CHATBOT IA — Revival Assistant
// Base de connaissances complète du projet
// ═══════════════════════════════════════

const REVIVAL_KB = {

  // ── Identité & présentation ──
  identite: {
    keywords: ["qui êtes-vous","c'est quoi revival","revival c'est quoi","présente-toi","qui es-tu","agence","entreprise","société","à propos","about","fondée","histoire","origine"],
    response: "Revival est une agence digitale fondée en 2016, spécialisée dans le développement d'applications web et mobiles performantes. Basée à Kinshasa avec une présence internationale dans 10 pays, nous aidons les entreprises à automatiser leurs services, améliorer leur gestion et accélérer leur croissance.\n\n📊 En chiffres :\n• 21+ projets livrés\n• 3 ans d'expérience active\n• 98% de clients satisfaits\n• 30+ experts dédiés\n• 10 pays couverts\n\nNotre mission : concevoir des solutions qui font vraiment la différence. 🚀"
  },

  // ── Services ──
  services: {
    keywords: ["service","services","que faites-vous","que proposez-vous","offre","offres","prestations","solutions","développement"],
    response: "Nos 6 services principaux :\n\n🌐 Applications Web — React, Next.js, Vue.js, Laravel, Node.js, Django\n📱 Applications Mobiles — React Native & Flutter (iOS + Android)\n⚡ Automatisation — RPA, ERP, CRM, pipelines de données\n🏢 Gestion d'entreprise — ERP sur mesure, dashboards, RH, facturation\n🎯 Conseil & Stratégie digitale — audit, roadmap, architecture\n☁️ Sécurité & Cloud — AWS, GCP, Azure, CI/CD, DevOps\n\nChaque solution est conçue sur mesure selon vos besoins. Vous souhaitez en savoir plus sur l'un de ces services ?"
  },

  // ── Projets / Portfolio ──
  portfolio: {
    keywords: ["portfolio","réalisation","réalisations","projet","projets","exemple","exemples","travaux","référence","poshub","pharmhub","freela","matchwork","lank","lawlinker","kabishiai","ecomnex","emmicard","clinixa","immohub","kulatable","application"],
    response: "Nos 11 projets réalisés :\n\n🏆 PosHub — Solution SaaS de gestion d'entreprise (caisse, stocks, RH, analytics). 500+ entreprises utilisatrices.\n💊 PharmaHub — Gestion digitale de pharmacie (stocks, ordonnances, ventes).\n📱 Freela — Marketplace freelance made in Africa. ⭐ 4.8/5 sur les stores.\n👥 MatchWork — Mise en relation talents & entreprises. 10k+ utilisateurs.\n⚖️ LawLinker — Plateforme juridique avocats/clients.\n🤖 Kabishiai — Solution intelligente propulsée par l'IA.\n🛒 Ecomnex — E-commerce Next.js. +200% de ventes.\n💳 Emmicard — Carte de visite digitale & paiement.\n🏥 Clinixa — Gestion de clinique & suivi patient.\n🏠 ImmoHub — Plateforme immobilière en ligne.\n🍽️ Kula Table — Réservation restaurant & gestion.\n\nConsultez portfolio.html pour voir tous les détails ! 🎨"
  },

  // ── Tarifs ──
  tarifs: {
    keywords: ["tarif","tarifs","prix","coût","combien","budget","devis","facturation","payer","investissement"],
    response: "Nos tarifs sont adaptés à chaque projet :\n\n• Landing page / Site vitrine : à partir de 2 000€\n• Application web complète : 8 000€ – 40 000€\n• Application mobile : 12 000€ – 60 000€\n• Solution SaaS : sur devis selon complexité\n• Maintenance mensuelle : à partir de 300€/mois\n• Conseil & audit : à partir de 500€/jour\n\nNous proposons une consultation gratuite de 30 minutes pour établir un devis précis et transparent. Réservez votre créneau sur contact.html 📋"
  },

  // ── Délais ──
  delais: {
    keywords: ["délai","délais","durée","temps","combien de temps","planning","calendrier","livraison","deadline","rapidement"],
    response: "Les délais dépendent de la complexité :\n\n• Landing page / Site vitrine : 1 à 3 semaines\n• MVP : 4 à 8 semaines\n• Application web complète : 3 à 6 mois\n• Application mobile : 4 à 8 mois\n• Solution ERP/SaaS : 6 à 12 mois\n\nNous établissons un planning précis lors de la phase de découverte. Chaque projet est suivi par un chef de projet dédié. ⏱️"
  },

  // ── Technologies ──
  technologies: {
    keywords: ["technologie","technologies","stack","framework","react","laravel","wordpress","flutter","next","vue","angular","langage","php","node","python","mysql","aws","docker","kubernetes"],
    response: "Notre stack technique complet :\n\n🖥️ Frontend : React.js, Next.js, Vue.js, HTML/CSS/JS\n⚙️ Backend : Laravel (PHP), Node.js, Python, Django\n📱 Mobile : React Native, Flutter\n📦 CMS : WordPress, Strapi\n☁️ Cloud : AWS, GCP, Azure, Vercel, DigitalOcean\n🗄️ Bases de données : MySQL, PostgreSQL, MongoDB\n🔧 DevOps : Docker, Kubernetes, CI/CD\n🤖 IA : OpenAI API, LangChain\n\nNous choisissons toujours la technologie la plus adaptée à votre projet. 🛠️"
  },

  // ── Partenariat ──
  partenariat: {
    keywords: ["partenaire","partenariat","devenir partenaire","collaboration","s'associer","rejoindre","programme partenaire","commission","revendeur","apporteur"],
    response: "Notre programme partenaire est ouvert à 4 types de profils :\n\n🤝 Partenaire commercial — revendeur avec commissions attractives\n🔧 Partenaire technique — intégration API, SDK, white-label\n🎯 Partenaire stratégique — co-développement, expansion marché\n🚀 Partenaire startup — accompagnement de l'idée au lancement\n\nAvantages :\n• 💰 Commissions compétitives sur chaque projet\n• 🎓 Formations et ressources exclusives\n• 👤 Account manager dédié\n• 🤝 Support et co-développement\n\nLe processus prend moins de 5 minutes. Candidatez sur partenaire.html — notre équipe vous répond sous 48h ! 📩"
  },

  // ── Contact ──
  contact: {
    keywords: ["contact","contacter","joindre","appeler","email","téléphone","rendez-vous","consultation","rdv","formulaire","message"],
    response: "Plusieurs façons de nous contacter :\n\n📧 Formulaire de contact → contact.html\n📞 Consultation gratuite de 30 minutes (réservation en ligne)\n💬 Ce chat en direct\n📱 Réseaux sociaux : Facebook, Instagram, LinkedIn, YouTube, TikTok, WhatsApp\n\nNous répondons généralement sous 24h ouvrées. N'hésitez pas à réserver votre créneau gratuit dès maintenant ! 📅"
  },

  // ── Sécurité & conformité ──
  securite: {
    keywords: ["sécurité","sécurisé","protection","données","rgpd","conformité","confidentialité","chiffrement","gdpr","iso","audit","vie privée"],
    response: "La sécurité est au cœur de chaque solution que nous développons :\n\n🔐 Chiffrement AES-256 pour toutes les données\n🔑 Authentification multi-facteurs (MFA)\n📜 Conformité RGPD & normes ISO 27001\n👁️ Surveillance 24/7 des infrastructures\n🛡️ Audits de sécurité réguliers & tests de pénétration\n✅ Droit d'accès, modification et suppression des données\n🔒 Consentement explicite & portabilité des données\n\nVous gardez le contrôle total sur vos informations. 🔒"
  },

  // ── Support & maintenance ──
  support: {
    keywords: ["support","maintenance","après","post-lancement","bug","mise à jour","suivi","accompagnement","garantie","correction"],
    response: "Nos formules de support post-lancement :\n\n🔧 Corrections de bugs prioritaires\n🔄 Mises à jour de sécurité régulières\n✨ Évolutions fonctionnelles\n📊 Rapports de performance mensuels\n💬 Support par email et chat\n📞 Ligne dédiée pour les urgences\n\nNos forfaits maintenance démarrent à 300€/mois. Chaque client bénéficie d'un suivi personnalisé. 🛠️"
  },

  // ── Équipe ──
  equipe: {
    keywords: ["équipe","team","développeur","designer","expert","collaborateur","effectif","taille","fondateur","ceo","cto"],
    response: "L'équipe Revival compte 30+ experts :\n\n👨‍💻 Développeurs Full-Stack senior (Laravel, React, Node.js)\n🎨 Designers UI/UX (Figma, design systems)\n📱 Développeurs mobile (React Native, Flutter)\n☁️ Architectes cloud & DevOps\n🤖 Spécialistes IA & automatisation\n📈 Consultants stratégiques\n🧑‍💼 Chefs de projet dédiés\n\nChaque projet est suivi par un chef de projet dédié qui assure la communication et le respect des délais. 💪"
  },

  // ── Carrières / Recrutement ──
  carrieres: {
    keywords: ["carrière","carrières","emploi","job","recrutement","postuler","offre d'emploi","rejoindre l'équipe","travailler","stage","alternance","cv","candidature"],
    response: "Nous recrutons activement ! Postes ouverts :\n\n👨‍💻 Développeur Full-Stack Senior (55k–75k€, Remote/Kinshasa)\n⚛️ Développeur Front-End React/Next.js (45k–65k€, Remote)\n🐘 Développeur Back-End Laravel (42k–60k€, Remote/Lyon)\n🎨 UI/UX Designer Senior (45k–60k€, Remote)\n☁️ DevOps / Cloud Engineer (55k–75k€, Remote)\n📈 Business Developer (40k–55k€ + variable, Kinshasa/Remote)\n📱 Développeur Mobile React Native (45k–65k€, Remote)\n\nAvantages : remote-friendly, formation continue, projets stimulants, équipe bienveillante.\n\nConsultez careers.html pour postuler ! 🚀"
  },

  // ── Vidéos & YouTube ──
  videos: {
    keywords: ["vidéo","vidéos","youtube","tutoriel","contenu","chaîne","regarder","canal"],
    response: "Retrouvez nos contenus sur :\n\n🎬 YouTube — @RevivalGroupe\n📺 Notre page Vidéos (videos.html) — démos de nos produits\n\nTypes de contenus :\n• 🎓 Tutoriels techniques et démonstrations\n• 📁 Études de cas projets\n• 💡 Conseils et bonnes pratiques\n• 🎬 Coulisses de l'agence\n\nAbonnez-vous pour ne rien manquer ! 🎥"
  },

  // ── Secteurs / Industries ──
  industries: {
    keywords: ["industrie","secteur","domaine","immobilier","e-commerce","juridique","voyage","vente","santé","pharmacie","restauration","fintech","finance","éducation","rh","ressources humaines"],
    response: "Nous intervenons dans de nombreux secteurs :\n\n🏠 Immobilier — ImmoHub (gestion & vente en ligne)\n🛒 E-commerce — Ecomnex (+200% de ventes)\n⚖️ Juridique — LawLinker (avocats & clients)\n💊 Santé — PharmaHub, Clinixa (gestion clinique)\n💳 Fintech — Emmicard (paiement & identité digitale)\n🍽️ Restauration — Kula Table (réservation & gestion)\n👥 RH & Recrutement — MatchWork (10k+ utilisateurs)\n🤖 IA & Tech — Kabishiai\n📱 Freelance — Freela (marketplace africaine)\n\nNotre expertise multi-sectorielle nous permet d'apporter des solutions adaptées à chaque métier. 🌍"
  },

  // ── Réseaux sociaux ──
  reseaux: {
    keywords: ["réseau","réseaux","facebook","instagram","linkedin","tiktok","twitter","whatsapp","x","social","communauté","suivre"],
    response: "Retrouvez-nous sur tous nos réseaux :\n\n📘 Facebook — Revival Group\n📸 Instagram — @revivalgroup7\n💼 LinkedIn — Revival Group DRC\n🎬 YouTube — @RevivalGroupe\n🐦 X — @groupe85249\n🎵 TikTok — @revivalgroup7\n💬 WhatsApp — Canal officiel Revival\n\nSuivez-nous pour rester informé de nos actualités, projets et innovations ! 🌐"
  },

  // ── Processus de travail ──
  processus: {
    keywords: ["processus","comment ça marche","comment travaillez-vous","méthode","étape","phase","démarche","agile","scrum","sprint"],
    response: "Notre processus de travail en 4 phases :\n\n1️⃣ Découverte (1–2 semaines)\n   → Consultation gratuite, analyse des besoins, cahier des charges\n\n2️⃣ Conception (2–4 semaines)\n   → Maquettes UI/UX, architecture technique, validation\n\n3️⃣ Développement (selon complexité)\n   → Sprints agiles, démos régulières, feedback continu\n\n4️⃣ Livraison & Support\n   → Tests, déploiement, formation, maintenance\n\nVous êtes impliqué à chaque étape. Transparence totale garantie. ✅"
  },

  // ── Consultation gratuite ──
  consultation: {
    keywords: ["consultation gratuite","30 minutes","30min","rdv gratuit","appel gratuit","démarrer","commencer","lancer mon projet"],
    response: "Notre consultation gratuite de 30 minutes c'est :\n\n✅ Un échange sans engagement\n✅ Analyse de votre projet et de vos besoins\n✅ Recommandations technologiques adaptées\n✅ Estimation de délais et budget\n✅ Réponses à toutes vos questions\n\nPour réserver, rendez-vous sur contact.html ou cliquez sur le bouton 'Consultation gratuite 30min' en haut de la page. 📅\n\nNous répondons sous 24h ouvrées. 🚀"
  },

  // ── Valeurs ──
  valeurs: {
    keywords: ["valeur","valeurs","culture","philosophie","vision","mission","engagement","qualité","excellence","transparence","innovation"],
    response: "Les 4 valeurs qui nous guident :\n\n🎯 Excellence — Qualité dans chaque ligne de code, chaque interface, chaque interaction\n👁️ Transparence — Communication ouverte, délais respectés, budgets maîtrisés\n🚀 Innovation — Toujours à la pointe des technologies pour des solutions performantes\n💡 Impact — Chaque projet crée une valeur réelle et mesurable\n\nNous croyons que la technologie doit être au service des humains, pas l'inverse. 🌟"
  },

  // ── Réponse par défaut ──
  default: {
    response: "Je ne suis pas sûr de comprendre votre question. Voici ce que je peux vous expliquer :\n\n• 🏢 Qui est Revival et notre histoire\n• 🛠️ Nos services (web, mobile, SaaS, IA, cloud)\n• 🎨 Nos projets réalisés (PosHub, Freela, Clinixa…)\n• 💰 Tarifs et délais\n• 🤝 Programme partenaire\n• 👨‍💻 Offres d'emploi\n• 🔒 Sécurité & conformité RGPD\n• 📞 Comment nous contacter\n\nPosez-moi une question plus précise ou contactez-nous directement sur contact.html 😊"
  }
};

function getAIResponse(userMessage) {
  const msg = userMessage.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "'");

  // Recherche par mots-clés dans toutes les catégories
  for (const [key, data] of Object.entries(REVIVAL_KB)) {
    if (key === 'default') continue;
    if (data.keywords.some(kw =>
      msg.includes(kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/['']/g, "'"))
    )) {
      return data.response;
    }
  }

  // Recherche secondaire par mots isolés pour les questions courtes
  const wordMap = {
    "bonjour": "Bonjour ! 👋 Je suis l'assistant IA de Revival. Comment puis-je vous aider aujourd'hui ?\n\nJe peux vous renseigner sur nos services, projets, tarifs, délais, partenariats ou offres d'emploi.",
    "salut": "Salut ! 👋 Je suis l'assistant IA de Revival. Comment puis-je vous aider aujourd'hui ?\n\nJe peux vous renseigner sur nos services, projets, tarifs, délais, partenariats ou offres d'emploi.",
    "merci": "Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions. Bonne journée !",
    "ok": "Parfait ! 👍 Y a-t-il autre chose que je puisse faire pour vous ?",
    "aide": REVIVAL_KB.default.response,
    "help": REVIVAL_KB.default.response,
  };

  for (const [word, response] of Object.entries(wordMap)) {
    if (msg.includes(word)) return response;
  }

  return REVIVAL_KB.default.response;
}

document.addEventListener('DOMContentLoaded', () => {
  const toggle   = document.getElementById('chatbotToggle');
  const closeBtn = document.getElementById('chatbotClose');
  const window_  = document.getElementById('chatbotWindow');
  const input    = document.getElementById('chatbotInput');
  const sendBtn  = document.getElementById('chatbotSend');
  const messages = document.getElementById('chatbotMessages');
  const suggestions = document.getElementById('chatbotSuggestions');

  if (!toggle) return;

  function openChat() { window_.classList.add('open'); input.focus(); }
  function closeChat() { window_.classList.remove('open'); }

  toggle.addEventListener('click', () => window_.classList.contains('open') ? closeChat() : openChat());
  closeBtn.addEventListener('click', closeChat);

  function addMessage(text, isUser) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + (isUser ? 'chat-msg--user' : 'chat-msg--bot');
    if (!isUser) {
      div.innerHTML = `<div class="chat-msg__avatar"><img src="logo/logo1.png" alt="Bot" /></div><div class="chat-msg__bubble">${text.replace(/\n/g, '<br>')}</div>`;
    } else {
      div.innerHTML = `<div class="chat-msg__bubble">${text}</div>`;
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg--bot';
    div.id = 'typingIndicator';
    div.innerHTML = `<div class="chat-msg__avatar"><img src="logo/logo1.png" alt="Bot" /></div><div class="chat-typing"><span></span><span></span><span></span></div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('typingIndicator');
    if (t) t.remove();
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    addMessage(text, true);
    input.value = '';
    suggestions.style.display = 'none';
    showTyping();
    setTimeout(() => {
      removeTyping();
      addMessage(getAIResponse(text), false);
    }, 900 + Math.random() * 600);
  }

  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(input.value); });

  suggestions.querySelectorAll('.chat-suggestion').forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.dataset.q));
  });
});
