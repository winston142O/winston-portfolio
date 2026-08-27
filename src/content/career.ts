import type { CareerNode } from "./types";

export const careerNodes: CareerNode[] = [
  {
    id: "origami-risk",
    kind: "job",
    company: "Origami Risk",
    role: { en: "Full Stack Engineer", es: "Ingeniero Full Stack" },
    start: "2026-02",
    end: null,
    mode: { en: "Hybrid", es: "Híbrido" },
    summary: {
      en: "Enterprise-grade risk management platform for complex insurance and risk data.",
      es: "Plataforma empresarial de gestión de riesgos para datos complejos de seguros.",
    },
    highlights: [
      {
        en: "Develop and maintain platform features across the full stack with .NET (C#) and React.",
        es: "Desarrollo y mantengo funcionalidades de la plataforma en todo el stack con .NET (C#) y React.",
      },
      {
        en: "Optimize application performance and database interactions in a large-scale SaaS platform.",
        es: "Optimizo el rendimiento de la aplicación y las interacciones con la base de datos en una plataforma SaaS de gran escala.",
      },
    ],
    tech: [".NET", "C#", "React", "SQL Server"],
  },
  {
    id: "thryv",
    kind: "job",
    company: "Thryv",
    role: { en: "Software Engineer I", es: "Ingeniero de Software I" },
    start: "2025-05",
    end: "2026-03",
    mode: { en: "Remote (US)", es: "Remoto (EE. UU.)" },
    summary: {
      en: "Large-scale SaaS platform for small business management: payments, CRM, and client workflows.",
      es: "Plataforma SaaS de gran escala para la gestión de pequeños negocios: pagos, CRM y flujos de clientes.",
    },
    highlights: [
      {
        en: "Integrated and maintained Stripe Payment APIs and Vcita Platform APIs for reliable financial workflows.",
        es: "Integré y mantuve las APIs de pago de Stripe y de la plataforma Vcita para flujos financieros confiables.",
      },
      {
        en: "Refactored legacy Node.js backend services, shipping 4+ performance optimizations per refactor.",
        es: "Refactoricé servicios backend legacy en Node.js, entregando más de 4 optimizaciones de rendimiento por refactor.",
      },
      {
        en: "Built API validation middleware and managed AWS S3 lifecycle policies for secure file handling.",
        es: "Construí middleware de validación de APIs y gestioné políticas de ciclo de vida en AWS S3 para manejo seguro de archivos.",
      },
    ],
    tech: ["Node.js", "TypeScript", "React", "Stripe", "AWS S3"],
    metrics: [
      {
        value: "44.4%",
        label: {
          en: "faster response times via query optimization",
          es: "respuestas más rápidas vía optimización de consultas",
        },
      },
    ],
  },
  {
    id: "xploy",
    kind: "job",
    company: "Xploy Solutions - Tri State Awnings",
    sceneLabel: "Xploy · TSA",
    role: {
      en: "Lead Backend Engineer & DBA",
      es: "Líder de Ingeniería Backend y DBA",
    },
    start: "2023-12",
    end: null,
    mode: { en: "Remote (US)", es: "Remoto (EE. UU.)" },
    summary: {
      en: "Software ecosystem that runs a US custom awning manufacturer end to end: jobs, engineering, installation routing, inventory, shop floor automation, and an AI agents service on top.",
      es: "Ecosistema de software que opera de punta a punta a un fabricante de toldos a medida en EE. UU.: trabajos, ingeniería, ruteo de instalaciones, inventario, automatización de taller y un servicio de agentes de IA encima.",
    },
    highlights: [
      {
        en: "Own the entire backend infrastructure on Railway across development and production: Django API, AI agent services, PostgreSQL, and Redis.",
        es: "Administro toda la infraestructura backend en Railway en desarrollo y producción: API en Django, servicios de agentes de IA, PostgreSQL y Redis.",
      },
      {
        en: "Built the engineering pipeline that turns job specs into production documents, rendered to PDF and published to DigitalOcean Spaces through Celery.",
        es: "Construí el pipeline de ingeniería que convierte especificaciones en documentos de producción, renderizados a PDF y publicados en DigitalOcean Spaces con Celery.",
      },
      {
        en: "Architected an AI agents platform where a lead engineer agent runs tools against a deterministic engineering engine, escalating to humans through live chat.",
        es: "Diseñé una plataforma de agentes de IA donde un agente principal ejecuta herramientas contra un motor de ingeniería determinista y escala a una persona por chat en vivo cuando hace falta.",
      },
      {
        en: "Developed a custom K-Means routing algorithm for installation scheduling and fleet routes.",
        es: "Desarrollé un algoritmo K-Means a medida para programar instalaciones y optimizar las rutas de la flota.",
      },
      {
        en: "Built a full sync integration with JobNimbus CRM, keeping jobs and contacts consistent across both systems.",
        es: "Construí una integración de sincronización completa con JobNimbus CRM, manteniendo trabajos y contactos consistentes entre ambos sistemas.",
      },
    ],
    tech: [
      "Python",
      "Django",
      "Flask",
      "Celery",
      "Redis",
      "PostgreSQL",
      "Anthropic API",
      "Docker",
      "Railway",
      "DigitalOcean Spaces",
      "React Native",
    ],
    metrics: [
      {
        value: "91.6%",
        label: {
          en: "faster workflow performance via distributed queues",
          es: "flujos más rápidos vía colas distribuidas",
        },
      },
    ],
  },
  {
    id: "promipyme",
    kind: "contract",
    company: "Promipyme",
    role: {
      en: "Software Engineer (Contractor)",
      es: "Ingeniero de Software (Contratista)",
    },
    start: "2024-12",
    end: "2026-01",
    mode: { en: "Remote", es: "Remoto" },
    summary: {
      en: "Loan origination platform for Promipyme, the Dominican government agency that finances micro and small businesses.",
      es: "Plataforma de originación de préstamos para Promipyme, la entidad del gobierno dominicano que financia a micro y pequeñas empresas.",
    },
    highlights: [
      {
        en: "Built a configurable workflow engine where staff design their own loan processes: stages, dynamic forms, and approval rules, with no code changes needed.",
        es: "Construí un motor de flujos configurable donde el personal diseña sus propios procesos de préstamo: etapas, formularios dinámicos y reglas de aprobación, sin necesidad de tocar código.",
      },
      {
        en: "Developed a drag and drop Kanban pipeline with real-time multi-user sync over WebSockets, used across multiple branch offices with role-based access.",
        es: "Desarrollé un tablero Kanban de arrastrar y soltar con sincronización multiusuario en tiempo real vía WebSockets, usado en varias sucursales con acceso por roles.",
      },
      {
        en: "Modeled the full credit domain: funds, loan products, document requirements, and audited approval and denial flows with full activity logging.",
        es: "Modelé el dominio crediticio completo: fondos, productos de préstamo, requisitos de documentos y flujos de aprobación y rechazo auditados con registro completo de actividades.",
      },
      {
        en: "Load tested the platform with Locust to hundreds of concurrent users and shipped it with Docker, Celery, Redis, and S3.",
        es: "Hice pruebas de carga con Locust hasta cientos de usuarios concurrentes y la desplegué con Docker, Celery, Redis y S3.",
      },
    ],
    tech: [
      "Django",
      "Django REST Framework",
      "Channels",
      "Celery",
      "PostgreSQL",
      "React",
      "TypeScript",
      "Docker",
      "AWS S3",
    ],
  },
  {
    id: "fitness-club",
    kind: "contract",
    company: "Fitness Club",
    role: {
      en: "Software Engineer (Contractor)",
      es: "Ingeniero de Software (Contratista)",
    },
    start: "2023-04",
    end: "2023-11",
    mode: { en: "On-site", es: "Presencial" },
    summary: {
      en: "Management system for a gym with around 2,000 members, bridging software and hardware at the front door.",
      es: "Sistema de gestión para un gimnasio con unos 2,000 socios, conectando el software con el hardware de la entrada.",
    },
    highlights: [
      {
        en: "Integrated fingerprint authentication with the turnstile, letting members in or blocking them automatically based on their membership status.",
        es: "Integré la autenticación por huella con el torniquete, dando o negando el paso automáticamente según el estado de la membresía.",
      },
      {
        en: "Built membership tracking with automatic account blocking, so expired memberships lost access without any manual step.",
        es: "Construí el control de membresías con bloqueo automático: las membresías vencidas perdían el acceso sin que nadie tuviera que intervenir.",
      },
      {
        en: "Developed a POS system for billing, sales tracking, and automated daily financial reporting.",
        es: "Desarrollé un sistema POS para facturación, seguimiento de ventas y reportes financieros diarios automatizados.",
      },
    ],
    tech: ["Python", "Embedded Systems", "SQL"],
    metrics: [
      {
        value: "~2,000",
        label: {
          en: "members with automated access control",
          es: "miembros con control de acceso automatizado",
        },
      },
    ],
  },
  {
    id: "origins",
    kind: "freelance",
    company: "Early Years",
    role: {
      en: "Freelance & Contract Developer",
      es: "Desarrollador Freelance y por Contrato",
    },
    start: "2018-02",
    end: "2023-12",
    mode: { en: "Remote", es: "Remoto" },
    summary: {
      en: "Where it all started. Freelance gigs and contract work in Santiago as a self-taught developer, before and during university.",
      es: "Donde todo empezó. Proyectos freelance y contratos en Santiago como desarrollador autodidacta, antes y durante la universidad.",
    },
    highlights: [
      {
        en: "Started on Fiverr as a teenager, delivering websites, mobile apps, CMS plugins, graphic design, and video editing for clients worldwide.",
        es: "Empecé en Fiverr siendo adolescente, entregando sitios web, apps móviles, plugins para CMS, diseño gráfico y edición de video para clientes de todo el mundo.",
      },
      {
        en: "Built a web platform for Centro Educativo Inspira that connected teachers and parents, replacing paper notices with digital communication and activity announcements.",
        es: "Construí una plataforma web para el Centro Educativo Inspira que conectó a maestros y padres, reemplazando las notas en papel con comunicación digital y anuncios de actividades.",
      },
      {
        en: "As an intern at Instituto Iberia, built an app that gave teachers quick access to class materials, and a web platform where students learned programming, ran their code, and shared in a forum.",
        es: "Como pasante en el Instituto Iberia, construí una app que dio a los maestros acceso rápido a materiales de clase, y una plataforma web donde los estudiantes aprendían a programar, ejecutaban su código y compartían en un foro.",
      },
      {
        en: "Developed a desktop billing and sales app for SJ Asesores de Seguros, an insurance brokerage.",
        es: "Desarrollé una app de escritorio de facturación y ventas para SJ Asesores de Seguros, una correduría de seguros.",
      },
      {
        en: "At SegurosChat, led the requirements engineering for a large insurance provider's web application and helped build it with Laravel and Vue.js.",
        es: "En SegurosChat, lideré la ingeniería de requerimientos de la aplicación web de una gran aseguradora y ayudé a construirla con Laravel y Vue.js.",
      },
    ],
    tech: ["Django", "Python", "PHP", "Laravel", "Tkinter", "JavaScript"],
  },
  {
    id: "intec",
    kind: "education",
    company: "INTEC",
    role: {
      en: "B.S. Computer Software Engineering",
      es: "Ing. de Software (Grado)",
    },
    start: "2022-08",
    end: "2026-07",
    mode: { en: "Santo Domingo, DR", es: "Santo Domingo, RD" },
    summary: {
      en: "Software engineering degree at Instituto Tecnológico de Santo Domingo, completed while working full time as an engineer.",
      es: "Carrera de ingeniería de software en el Instituto Tecnológico de Santo Domingo, cursada mientras trabajaba a tiempo completo como ingeniero.",
    },
    highlights: [],
    tech: [],
  },
];
