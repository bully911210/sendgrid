export type Department = "Free SA" | "TLU SA" | "Firearms Guardian" | "Civil Society SA";
export type Language = "en" | "af";

export interface DepartmentConfig {
  name: Department;
  fullName: string;
  senderEmail: string;
  color: string;
  colorDark: string;
  colorClass: string;
  agents: string[];
  showBankDetails: boolean;
  hasAttachment: boolean;
}

export const departments: Record<Department, DepartmentConfig> = {
  "Free SA": {
    name: "Free SA",
    fullName: "Foundation for Rights of Expression and Equality NPC",
    senderEmail: "memberships@freesa.org.za",
    color: "#f97316",
    colorDark: "#ea580c",
    colorClass: "freesa",
    agents: [
      "Cindy Cloete",
      "Irene Rossouw",
      "Juan Pretorius",
      "Nadine Esterhuysen",
      "Pierre Farrell",
      "Santamari Barker",
      "Shireen Bester",
      "Vanessa Fourie",
      "Wynand Kapp",
    ],
    showBankDetails: true,
    hasAttachment: false,
  },
  "TLU SA": {
    name: "TLU SA",
    fullName: "TLU Suid Afrika - Die Vesting van die Kommersiële Boer",
    senderEmail: "info@tlu.co.za",
    color: "#22c55e",
    colorDark: "#16a34a",
    colorClass: "tlusa",
    agents: [
      "Cindy Cloete",
      "Cobus Esterhuizen",
      "Geneveve Webster",
      "Irene Brummer",
      "Irene Rossouw",
      "Juan Pretorius",
      "Lee-Anne Brummer",
      "Leodette Maritz",
      "Martin Van Der Walt",
      "Martin Webster",
      "Nadine Esterhuysen",
      "Pierre Farrell",
      "Robert Eglington",
      "Sammy Farrell",
      "Santamari Barker",
      "Shireen Bester",
      "Stephanie Wheeler",
      "Wynand Kapp",
      "Zane Erasmus",
    ],
    showBankDetails: true,
    hasAttachment: false,
  },
  "Firearms Guardian": {
    name: "Firearms Guardian",
    fullName: "Firearms Guardian Legal & Liability Insurance",
    senderEmail: "benefits@firearmsguardian.co.za",
    color: "#dc2626",
    colorDark: "#b91c1c",
    colorClass: "firearms",
    agents: [
      "Cindy Cloete",
      "Irene Rossouw",
      "Jurie Steyn",
      "Leodette Maritz",
      "Michael Mostert",
      "Nadine Esterhuysen",
      "Robert Eglington",
      "Shireen Bester",
      "Stephanie Wheeler",
      "Vanessa Fourie",
      "Wynand Boshoff",
    ],
    showBankDetails: false,
    hasAttachment: true,
  },
  "Civil Society SA": {
    name: "Civil Society SA",
    fullName: "Civil Society South Africa",
    senderEmail: "contributors@civilsocietysa.co.za",
    color: "#2563eb",
    colorDark: "#1d4ed8",
    colorClass: "civilsociety",
    agents: [
      "Cindy Cloete",
      "Irene Rossouw",
      "Juan Pretorius",
      "Nadine Esterhuysen",
      "Pierre Farrell",
      "Santamari Barker",
      "Shireen Bester",
      "Vanessa Fourie",
      "Wynand Kapp",
    ],
    showBankDetails: true,
    hasAttachment: false,
  },
};
