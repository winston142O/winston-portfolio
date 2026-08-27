import type { Localized } from "./types";

export interface EducationEntry {
  id: string;
  school: string;
  degree: Localized;
  start: string; // YYYY-MM
  end: string; // YYYY-MM
  location: Localized;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string | null; // YYYY-MM, null when undated
  proof?: string; // link to the certificate document
  /** Shown on the site; the rest live behind the "view all" link */
  featured?: boolean;
}

const drive = (id: string) => `https://drive.google.com/file/d/${id}/view`;

export const certificatesFolderUrl =
  "https://drive.google.com/drive/folders/1fIZKe20hhvhviU3Uhb1AsGPfXcXTThG3";

export const education: EducationEntry[] = [
  {
    id: "intec",
    school: "Instituto Tecnológico de Santo Domingo (INTEC)",
    degree: {
      en: "B.S. Computer Software Engineering",
      es: "Ingeniería de Software (Grado)",
    },
    start: "2022-08",
    end: "2026-07",
    location: {
      en: "Santo Domingo, Dominican Republic",
      es: "Santo Domingo, República Dominicana",
    },
  },
  {
    id: "iberia",
    school: "Instituto Iberia",
    degree: {
      en: "High School Diploma, International Baccalaureate (IB)",
      es: "Bachillerato, Bachillerato Internacional (IB)",
    },
    start: "2018-08",
    end: "2022-07",
    location: {
      en: "Santo Domingo, Dominican Republic",
      es: "Santo Domingo, República Dominicana",
    },
  },
];

export const certifications: Certification[] = [
  {
    name: "Fortinet Certified Associate in Cybersecurity",
    issuer: "Fortinet",
    featured: true,
    date: null,
    proof: drive("1Q4Np6a9auL5oZDimLHrg051h0dBYMr8q"),
  },
  {
    name: "FortiGate Operator",
    issuer: "Fortinet",
    featured: true,
    date: null,
    proof: drive("1PsV6JrAAW1Snd63ah71ndkSgG0ucVNfQ"),
  },
  {
    name: "Huawei Cloud Advanced: Architecture and Technologies",
    issuer: "Huawei",
    featured: true,
    date: null,
    proof: drive("1G4JGic3XsKjVi7xnGgEYnCwDvgPRe5hi"),
  },
  {
    name: "OWASP 2025",
    issuer: "OWASP",
    featured: true,
    date: null,
    proof: drive("1mVhGh6YzlssXs1dUIaOnnAzyvfUUtNYh"),
  },
  {
    name: "Docker Foundations Professional Certificate",
    issuer: "Docker, Inc",
    featured: true,
    date: "2024-08",
    proof: drive("1ktU4AyCBq7qyEG0BUYPAbNuM7ouGz5sk"),
  },
  {
    name: "Career Essentials in GitHub Professional Certificate",
    issuer: "GitHub",
    featured: true,
    date: "2024-08",
    proof: drive("1mbLK2JVMPCaptva5Ezk5J0XU-N6YbxYd"),
  },
  {
    name: "SQL and Relational Databases 101",
    issuer: "IBM",
    date: "2023-11",
    proof: drive("17Z2nUgs5-O64K5SUXauDAifB7ipAWE6w"),
  },
  {
    name: "Python Data Structures and Algorithms",
    issuer: "LinkedIn",
    date: "2024-07",
    proof: drive("1cdWm_6yUz24m-xN_BbHiqzdvEqlhn7AK"),
  },
  {
    name: "Linux Unhatched",
    issuer: "Cisco Networking Academy",
    date: "2025-03",
    proof: drive("15xV-q1TGLNjJAqo4NwemrUE5QxH6w36-"),
  },
  {
    name: "Introduction to Modern AI",
    issuer: "Cisco Networking Academy",
    date: "2025-03",
    proof: drive("100HPQcLUc5k03kL85cSE6ImqDxyhpeb1"),
  },
  {
    name: "Introduction to UI Design",
    issuer: "University of Minnesota",
    date: "2024-04",
    proof: drive("1S-zCB42FT9dOWGU-xcpPw0PyNyHTkmOr"),
  },
  {
    name: "Mejora de procesos",
    issuer: "Fundación Carlos Slim",
    date: "2023-10",
    proof: drive("19ax0Krv1scEJDelFOoidsMxXOp7lyJc-"),
  },
  {
    name: "English Language C1+",
    issuer: "SmallTalk",
    featured: true,
    date: "2025-02",
    proof: drive("1KLvvIxPFMFtgRMeqYqGfiOsh9dHlpGFw"),
  },
  {
    name: "Microsoft Office Specialist",
    issuer: "Microsoft",
    date: null,
  },
];
