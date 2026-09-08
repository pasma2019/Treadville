import en from "./en";

type EN = typeof en;

export default {
  nav: {
    shop: "Sortiment",
    origins: "Herkunft",
    quality: "Qualität",
    export: "Export",
    about: "Über uns",
    journal: "Journal",
    enquire: "Anfrage",
    contact: "Kontakt",
    shopAll: "Alles ansehen",
    coffee: "Kaffee",
    tea: "Tee",
    horticulture: "Gartenbau",
    grains: "Getreide",
  },
  hero: {
    eyebrow: "Treadville · Kenia",
    thesis: "Vom kenianischen Boden in die Weltmärkte.",
    ctaExplore: "Sortiment entdecken",
    ctaView: "Katalog ansehen",
    ctaDiscover: "Treadville kennenlernen",
    ctaEnter: "Kapitel betreten",
  },
  footer: {
    catalogue: "Sortiment",
    company: "Unternehmen",
    contact: "Kontakt",
    explore: "Sortiment entdecken",
    openEnquiry: "Anfrage stellen",
    copyright: "© {year} Treadville Company Limited",
    pascoCredit: "Digitale Erfahrung gestaltet von",
    pascoStudio: "PASCO LABS",
    pascoDescriptor: "Strategie · Design · Technologie",
  },
  shop: {
    title: "Das Sortiment",
    eyebrow: "Vollständiger Katalog",
    enquire: "Anfragen",
    comingSoon: "Informationen folgen in Kürze.",
  },
  product: {
    enquire: "Zur Anfrage hinzufügen",
    requestQuote: "Angebot anfordern",
    requestSample: "Muster anfordern",
    moreProducts: "Mehr {category}",
    speakToUs: "Kontakt aufnehmen",
    imagePending: "Bild folgt",
    origin: "Herkunft",
    altitude: "Höhenlage",
    process: "Verarbeitung",
    quality: "Qualität",
    variety: "Sorte",
    tasting: "Verkostungsnoten",
    harvest: "Ernte",
  },
  contact: {
    title: "Ein Gespräch,",
    titleAccent: "kein Formular.",
    prototypeDisclaimer:
      "Prototyp-Anfrageformular. Für direkte Anfragen: {phone} oder {email}.",
    prototypeThankYou: "Danke — dies ist eine Demo.",
    prototypeThankYouNote:
      "Dieses Formular übermittelt keine Anfragen. Um Treadville direkt zu erreichen: {phone} oder {email}.",
    sendEnquiry: "Anfrage senden",
    generalEnquiry: "Allgemeine Anfrage",
    sampleRequest: "Musteranfrage",
    exportWholesale: "Export / Großhandel",
    pressMedia: "Presse & Medien",
    partnership: "Partnerschaft",
    responseTime: "Innerhalb von zwei Werktagen.",
    responseNote:
      "Export-Anfragen können aufgrund der Spezifikationsprüfung etwas länger dauern.",
  },
  checkout: {
    title: "Anfrage prüfen",
    emptyTitle: "Ihre Anfrage ist leer",
    prototypeNote: "Prototyp · Keine Zahlung wird verarbeitet",
  },
} satisfies EN;
