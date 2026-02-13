import type { Department, Language } from "./departments";

export interface EmailTemplate {
  subject: string;
  greeting: string;
  body: string;
  sections?: { heading: string; content: string }[];
  buttons: { text: string; link: string }[];
  bankDetails?: {
    title: string;
    rows: { label: string; value: string }[];
    proofNote: string;
  };
  footer: { closing: string; department: string };
}

const templates: Record<Department, Record<Language, EmailTemplate>> = {
  "Free SA": {
    en: {
      subject: "Free SA - Your Contribution Details",
      greeting: "Hello {{clientName}},",
      body: "Thank you for chatting with {{agentName}} from Free SA.\n\nFree SA helps ordinary South Africans participate in lawmaking. We submit formal comments on proposed legislation, file PAIA applications, and run structured public participation campaigns. To date, we have processed over 2 million public comments on behalf of South Africans.\n\nYour contribution funds:",
      sections: [
        {
          heading: "",
          content:
            "Formal submissions to Parliament on proposed laws\nPAIA applications to access government information\nOrganised public comment campaigns on legislation\nThe Empower Education Fund and Young Leaders Awards",
        },
      ],
      buttons: [
        { text: "Make a Contribution", link: "https://www.freesa.org.za/donate/" },
      ],
      bankDetails: {
        title: "Bank Details",
        rows: [
          { label: "Bank", value: "Capitec Business" },
          { label: "Account Name", value: "Foundation for Rights of Expression and Equality NPC" },
          { label: "Account Number", value: "1053038372" },
          { label: "Branch Code", value: "450105" },
        ],
        proofNote:
          "Please email your proof of payment to memberships@freesa.org.za so we can confirm your contribution.",
      },
      footer: {
        closing: "Kind regards,",
        department: "Free SA Team",
      },
    },
    af: {
      subject: "Free SA - Jou Bydrae-besonderhede",
      greeting: "Hallo {{clientName}},",
      body: "Dankie dat jy met {{agentName}} van Free SA gesels het.\n\nFree SA help gewone Suid-Afrikaners om aan wetgewing deel te neem. Ons dien formele kommentaar in op voorgestelde wette, rig PAIA-aansoeke, en bestuur gestruktureerde openbare deelname-veldtogte. Tot op hede het ons meer as 2 miljoen openbare kommentare namens Suid-Afrikaners verwerk.\n\nJou bydrae befonds:",
      sections: [
        {
          heading: "",
          content:
            "Formele voorleggings aan die Parlement oor voorgestelde wette\nPAIA-aansoeke om toegang tot regeringsinligting te kry\nGeorganiseerde openbare kommentaar-veldtogte\nDie Empower Onderwysfonds en Jong Leiers-toekennings",
        },
      ],
      buttons: [
        { text: "Maak 'n Bydrae", link: "https://www.freesa.org.za/donate/" },
      ],
      bankDetails: {
        title: "Bankbesonderhede",
        rows: [
          { label: "Bank", value: "Capitec Business" },
          { label: "Rekeningnaam", value: "Foundation for Rights of Expression and Equality NPC" },
          { label: "Rekeningnommer", value: "1053038372" },
          { label: "Takkode", value: "450105" },
        ],
        proofNote:
          "Stuur asseblief jou betalingsbewys na memberships@freesa.org.za sodat ons jou bydrae kan bevestig.",
      },
      footer: {
        closing: "Vriendelike groete,",
        department: "Free SA Span",
      },
    },
  },

  "TLU SA": {
    en: {
      subject: "TLU SA - Membership Information",
      greeting: "Good day {{clientName}},",
      body: "Thank you for speaking with {{agentName}} from TLU SA.\n\nTLU SA represents commercial farmers on property rights, labour affairs, security, and agricultural policy. We engage directly with government on legislation that affects farming operations and land ownership.",
      sections: [
        {
          heading: "What You Get as a Member",
          content:
            "Advisory Service for labour, legal, and compliance matters\nFinancial Wellbeing Desk and Business How-To support\nPitkos newsletter with policy updates and gazette announcements\nExclusive partner benefits through LWO and FINCO\nDirect representation when legislation threatens your livelihood",
        },

      ],
      buttons: [
        {
          text: "Download Membership Form",
          link: "https://www.tlu.co.za/wp-content/uploads/2025/05/Ondersteuner_2025.pdf",
        },
      ],
      bankDetails: {
        title: "Bank Details",
        rows: [
          { label: "Bank", value: "ABSA" },
          { label: "Account Name", value: "TLU Suid Afrika" },
          { label: "Account Number", value: "4050400686" },
          { label: "Branch Code", value: "632005" },
        ],
        proofNote:
          "Please email your completed form and proof of payment to info@tlu.co.za so we can activate your membership.",
      },
      footer: {
        closing: "Warm regards,",
        department: "TLU SA Membership Team",
      },
    },
    af: {
      subject: "TLU SA - Lidmaatskap-inligting",
      greeting: "Goeie dag {{clientName}},",
      body: "Dankie dat u met {{agentName}} van TLU SA gesels het.\n\nTLU SA verteenwoordig kommersiële boere oor eiendomsregte, arbeidsake, sekuriteit en landboubeleid. Ons skakel direk met die regering oor wetgewing wat boerdery-bedrywighede en grondbesit raak.",
      sections: [
        {
          heading: "Wat U Kry as Lid",
          content:
            "Adviesdiens vir arbeids-, regs- en nakomingsake\nFinansiele Welstandtoonbank en Besigheid Hoe-Om-ondersteuning\nPitkos-nuusbrief met beleidopdaterings en staatskoerant-aankondigings\nEksklusiewe vennootvoordele deur LWO en FINCO\nDirekte verteenwoordiging wanneer wetgewing u bestaan bedreig",
        },

      ],
      buttons: [
        {
          text: "Laai Lidmaatskapvorm Af",
          link: "https://www.tlu.co.za/wp-content/uploads/2025/05/Ondersteuner_2025.pdf",
        },
      ],
      bankDetails: {
        title: "Bankbesonderhede",
        rows: [
          { label: "Bank", value: "ABSA" },
          { label: "Rekeningnaam", value: "TLU Suid Afrika" },
          { label: "Rekeningnommer", value: "4050400686" },
          { label: "Takkode", value: "632005" },
        ],
        proofNote:
          "Stuur asseblief u voltooide vorm en betalingsbewys na info@tlu.co.za sodat ons u lidmaatskap kan aktiveer.",
      },
      footer: {
        closing: "Vriendelike groete,",
        department: "TLU SA Lidmaatskapspan",
      },
    },
  },

  "Firearms Guardian": {
    en: {
      subject: "Firearms Guardian - Your Application Details",
      greeting: "Hello {{clientName}},",
      body: "Thank you for speaking with {{agentName}} from Firearms Guardian.\n\nFirearms Guardian provides legal protection and liability insurance for lawful firearm owners. If you face a legal situation involving your firearm, we connect you with qualified attorneys and cover your legal costs.",
      sections: [
        {
          heading: "What You Get",
          content:
            "24/7 access to qualified firearm attorneys\nLegal assistance up to R300,000 per case\nLiability cover up to R300,000 per year\nCoverage for self-defence, accidental discharge, hunting incidents, and FCA prosecution\nCoverage extends to your immediate family",
        },
        {
          heading: "Pricing",
          content:
            "Option 1: R135.00/month\nOption 2: R245.00/month\n\nAdministered by Firearms Guardian (Pty) Ltd (FSP 47115). Underwritten by GENRIC Insurance Company Limited (FSP 43638).",
        },
      ],
      buttons: [
        {
          text: "Submit Your Application",
          link: "https://firearmsguardian.co.za/join-now/",
        },
      ],
      footer: {
        closing: "Regards,",
        department: "Firearms Guardian",
      },
    },
    af: {
      subject: "Firearms Guardian - Jou Aansoek-besonderhede",
      greeting: "Hallo {{clientName}},",
      body: "Dankie dat jy met {{agentName}} van Firearms Guardian gesels het.\n\nFirearms Guardian bied regsbeskerming en aanspreeklikheidsdekking vir wettige vuurwapenaars. As jy 'n regskwessie het wat jou vuurwapen betrek, skakel ons jou met gekwalifiseerde prokureurs en dek ons jou regskoste.",
      sections: [
        {
          heading: "Wat Jy Kry",
          content:
            "24/7 toegang tot gekwalifiseerde vuurwapenprokureurs\nRegsbystand tot R300 000 per saak\nAanspreeklikheidsdekking tot R300 000 per jaar\nDekking vir selfverdediging, toevallige ontlading, jagvoorvalle en Vuurwapenbeherwet-vervolging\nDekking sluit jou onmiddellike gesin in",
        },
        {
          heading: "Pryse",
          content:
            "Opsie 1: R135.00/maand\nOpsie 2: R245.00/maand\n\nGeadministreer deur Firearms Guardian (Edms) Bpk (FSP 47115). Onderskryf deur GENRIC Insurance Company Limited (FSP 43638).",
        },
      ],
      buttons: [
        {
          text: "Dien Jou Aansoek In",
          link: "https://firearmsguardian.co.za/join-now/",
        },
      ],
      footer: {
        closing: "Groete,",
        department: "Firearms Guardian",
      },
    },
  },

  "Civil Society SA": {
    en: {
      subject: "Civil Society SA - How to Get Involved",
      greeting: "Hello {{clientName}},",
      body: "Thank you for chatting with {{agentName}} from Civil Society South Africa.\n\nCivil Society SA runs formal petition campaigns and submits legal arguments to Parliament on legislation that affects public safety. We focus on three active campaigns:",
      sections: [
        {
          heading: "Current Campaigns",
          content:
            "Legal Firearms Save Lives - opposing the removal of self-defence as a valid reason to own a firearm\nSafety Tax Credits - motivating for private security costs to be tax deductible\nProtect Those Who Protect Us - opposing PSIRA regulations that would restrict private security equipment",
        },
        {
          heading: "What Your Contribution Funds",
          content:
            "Legal research for formal parliamentary submissions\nPAIA applications to access government records\nOrganised petition campaigns with verified signatures",
        },
      ],
      buttons: [
        {
          text: "Sign Our Petitions",
          link: "https://civilsocietysa.co.za/#campaigns",
        },
      ],
      footer: {
        closing: "Regards,",
        department: "Civil Society South Africa",
      },
    },
    af: {
      subject: "Civil Society SA - Hoe Om Betrokke te Raak",
      greeting: "Hallo {{clientName}},",
      body: "Dankie dat jy met {{agentName}} van Civil Society South Africa gesels het.\n\nCivil Society SA bestuur formele petisie-veldtogte en dien regsargumente by die Parlement in oor wetgewing wat openbare veiligheid raak. Ons fokus op drie aktiewe veldtogte:",
      sections: [
        {
          heading: "Huidige Veldtogte",
          content:
            "Wettige Vuurwapens Red Lewens - teen die verwydering van selfverdediging as rede om 'n vuurwapen te besit\nVeiligheids-belastingkrediet - dat privaat sekuriteitskoste belastingaftrekbaar moet wees\nBeskerm Die Wat Ons Beskerm - teen PSIRA-regulasies wat privaat sekuriteit se toerusting wil beperk",
        },
        {
          heading: "Wat Jou Bydrae Befonds",
          content:
            "Regsnavorsing vir formele parlementere voorleggings\nPAIA-aansoeke om toegang tot regeringsrekords te kry\nGeorganiseerde petisie-veldtogte met geverifieerde handtekeninge",
        },
      ],
      buttons: [
        {
          text: "Teken Ons Petisies",
          link: "https://civilsocietysa.co.za/#campaigns",
        },
      ],
      footer: {
        closing: "Groete,",
        department: "Civil Society South Africa",
      },
    },
  },
};

export function getTemplate(
  department: Department,
  language: Language
): EmailTemplate {
  return templates[department][language];
}
