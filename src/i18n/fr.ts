import en from "./en";

type EN = typeof en;

export default {
  nav: {
    shop: "Boutique",
    origins: "Origines",
    quality: "Qualité",
    export: "Export",
    about: "Maison",
    journal: "Journal",
    contact: "Contact",
    shopAll: "Tout voir",
    coffee: "Café",
    tea: "Thé",
    horticulture: "Horticulture",
    grains: "Céréales",
  },
  hero: {
    eyebrow: "Treadville · Kenya",
    thesis: "Du sol kényan aux marchés du monde.",
    ctaExplore: "Explorer la collection",
    ctaView: "Voir le catalogue",
    ctaDiscover: "Découvrir Treadville",
    ctaEnter: "Entrer dans le chapitre",
  },
  footer: {
    catalogue: "Catalogue",
    company: "Maison",
    contact: "Contact",
    explore: "Explorer le catalogue",
    openEnquiry: "Démarrer une demande",
    copyright: "© {year} Treadville Company Limited",
    pascoCredit: "Expérience numérique conçue par",
    pascoStudio: "PASCO LABS",
    pascoDescriptor: "Stratégie · Design · Technologie",
  },
  shop: {
    title: "La collection",
    eyebrow: "Catalogue complet",
    enquire: "Demander",
    comingSoon: "Informations à venir.",
  },
  product: {
    enquire: "Ajouter à ma demande",
    requestQuote: "Demander un devis",
    requestSample: "Demander un échantillon",
    moreProducts: "Plus de {category}",
    speakToUs: "Nous contacter",
    imagePending: "Image à venir",
    origin: "Origine",
    altitude: "Altitude",
    process: "Processus",
    quality: "Qualité",
    variety: "Variété",
    tasting: "Notes de dégustation",
    harvest: "Récolte",
  },
  contact: {
    title: "Une conversation,",
    titleAccent: "pas un formulaire.",
    prototypeDisclaimer:
      "Formulaire prototype. Pour toute demande directe : {phone} ou {email}.",
    prototypeThankYou: "Merci — ceci est une démo.",
    prototypeThankYouNote:
      "Ce formulaire ne transmet pas les demandes. Pour joindre Treadville directement : {phone} ou {email}.",
    sendEnquiry: "Envoyer la demande",
    generalEnquiry: "Demande générale",
    sampleRequest: "Demande d'échantillon",
    exportWholesale: "Export / gros",
    pressMedia: "Presse & médias",
    partnership: "Partenariat",
    responseTime: "Sous deux jours ouvrés.",
    responseNote:
      "Les demandes d'export peuvent nécessiter un délai supplémentaire pour la revue des spécifications.",
  },
  checkout: {
    title: "Revoir votre demande",
    emptyTitle: "Votre demande est vide",
    prototypeNote: "Prototype · Aucun paiement n'est traité",
  },
} satisfies EN;
