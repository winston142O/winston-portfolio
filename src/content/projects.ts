import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "promipyme-crm",
    kind: "professional",
    name: "Promipyme CRM",
    description: {
      en: "Loan origination platform for a Dominican government credit agency. Staff design their own workflows with configurable stages, a custom form builder, and approval rules per credit product. Includes a real-time Kanban pipeline over WebSockets, audit logging, and report dashboards with PDF and Excel export. Load tested to hundreds of concurrent users.",
      es: "Plataforma de originación de préstamos para una entidad crediticia del gobierno dominicano. El personal define sus propios flujos con etapas configurables, un constructor de formularios a medida y reglas de aprobación por producto crediticio. Incluye un tablero Kanban en tiempo real vía WebSockets, registro de auditoría y dashboards con exportación a PDF y Excel. Probada bajo carga con cientos de usuarios concurrentes.",
    },
    tech: ["Django", "Channels", "Celery", "PostgreSQL", "React", "TypeScript", "Docker"],
    featured: true,
  },
  {
    id: "ai-recruiting-assistant",
    kind: "hackathon",
    name: "AI Recruiting Assistant",
    description: {
      en: "Hackathon project that screens job applications automatically: AI-powered CV analysis against job listings, with an employer dashboard for vacancies and candidate analytics.",
      es: "Proyecto de hackathon que filtra candidaturas de forma automática: analiza los CVs con IA frente a cada vacante y entrega al empleador un panel con métricas de los candidatos.",
    },
    tech: ["Node.js", "Express", "MongoDB", "React", "OpenAI API", "AWS S3"],
    repo: "https://github.com/winston142O/Hackathon-AI-Recruiting-Assistant",
    featured: true,
  },
  {
    id: "ar-furniture-viewer",
    kind: "experiment",
    name: "AR Furniture Viewer",
    description: {
      en: "Web-based augmented reality: place 3D furniture models in your real space through the browser camera, no app install required.",
      es: "Realidad aumentada en la web: coloca modelos 3D de muebles en tu espacio real a través de la cámara del navegador, sin instalar ninguna app.",
    },
    tech: ["AR.js", "React", "Vite", "3D Models"],
    repo: "https://github.com/winston142O/Augmented-Reality-Web-Furniture-Viewer",
    featured: true,
  },
  {
    id: "checkers",
    kind: "archive",
    name: "Checkers",
    description: {
      en: "A complete checkers game built in C# with Windows Forms, one of my first finished projects.",
      es: "Un juego de damas completo hecho en C# con Windows Forms, uno de mis primeros proyectos terminados.",
    },
    tech: ["C#", ".NET", "Windows Forms"],
    repo: "https://github.com/winston142O/Checkers_PF",
    featured: true,
  },
  {
    id: "erp-crm",
    kind: "experiment",
    name: "ERP/CRM System",
    description: {
      en: "Modular ERP/CRM hobby project split into a Python backend and Vue frontend.",
      es: "Proyecto personal de ERP/CRM modular dividido en backend de Python y frontend de Vue.",
    },
    tech: ["Python", "Vue"],
    repo: "https://github.com/winston142O/ERP-CRM-System",
    featured: false,
  },
  {
    id: "book-collection-api",
    kind: "experiment",
    name: "Book Collection API",
    description: {
      en: "A Django REST API for managing book collections.",
      es: "Una API REST en Django para gestionar colecciones de libros.",
    },
    tech: ["Django", "Django REST Framework"],
    repo: "https://github.com/winston142O/BookCollectionAPI",
    featured: false,
  },
];
