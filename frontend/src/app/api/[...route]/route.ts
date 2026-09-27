import { NextRequest, NextResponse } from "next/server";

// In-memory data store for Next.js app in AI Studio
let services = [
  {
    id: "1",
    name: "Tatuagem Exclusiva",
    description: "Criação de arte exclusiva e aplicação profissional",
    duration: 60,
    priceMin: 150,
    priceMax: null,
    priceType: "STARTING_AT",
    isActive: true,
  },
  {
    id: "2",
    name: "Piercing Corporal",
    description: "Perfurações corporais assépticas com joalheria premium em titânio",
    duration: 30,
    priceMin: 80,
    priceMax: null,
    priceType: "FIXED",
    isActive: true,
  },
  {
    id: "3",
    name: "Reforma & Cover-up",
    description: "Cobertura ou restauração artística de tatuagens antigas",
    duration: 120,
    priceMin: 300,
    priceMax: null,
    priceType: "CONSULTATION",
    isActive: true,
  },
];

let professionals = [
  {
    id: "1",
    name: "Gleydson",
    email: "gleydson@gleydsontattoo.com",
    phone: "(91) 99999-9999",
    bio: "Especialista em Realismo, Blackwork e Fine Line.",
    specialties: ["Realismo", "Blackwork", "Fine Line"],
    isActive: true,
    avatar: null,
  },
];

let appointments: any[] = [
  {
    id: "apt-1",
    date: new Date().toISOString().slice(0, 10),
    startTime: "14:00",
    endTime: "15:00",
    status: "CONFIRMED",
    notes: "Primeira tatuagem, antebraço",
    client: {
      id: "cli-1",
      name: "João Silva",
      phone: "(91) 98888-1111",
      whatsapp: "(91) 98888-1111",
      email: "joao@exemplo.com",
    },
    service: { id: "1", name: "Tatuagem Exclusiva", duration: 60 },
    professional: { id: "1", name: "Gleydson" },
  },
  {
    id: "apt-2",
    date: new Date().toISOString().slice(0, 10),
    startTime: "16:00",
    endTime: "16:30",
    status: "PENDING",
    notes: "Piercing no septo",
    client: {
      id: "cli-2",
      name: "Maria Costa",
      phone: "(91) 98777-2222",
      whatsapp: "(91) 98777-2222",
      email: "maria@exemplo.com",
    },
    service: { id: "2", name: "Piercing Corporal", duration: 30 },
    professional: { id: "1", name: "Gleydson" },
  },
];

let clients: any[] = [
  {
    id: "cli-1",
    name: "João Silva",
    phone: "(91) 98888-1111",
    whatsapp: "(91) 98888-1111",
    email: "joao@exemplo.com",
    notes: "Prefere horários à tarde",
    createdAt: new Date().toISOString(),
    appointments: [appointments[0]],
  },
  {
    id: "cli-2",
    name: "Maria Costa",
    phone: "(91) 98777-2222",
    whatsapp: "(91) 98777-2222",
    email: "maria@exemplo.com",
    notes: "Alérgica a níquel - usar titânio",
    createdAt: new Date().toISOString(),
    appointments: [appointments[1]],
  },
];

let portfolioItems: any[] = [
  {
    id: "1",
    title: "Leão Realista",
    description: "Tatuagem realista no antebraço",
    imageUrl: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=800&auto=format&fit=crop&q=60",
    categoryId: "realismo",
    category: { id: "realismo", name: "Realismo" },
    isFeatured: true,
    isActive: true,
    order: 1,
  },
  {
    id: "2",
    title: "Mandala Blackwork",
    description: "Geometria sagrada nas costas",
    imageUrl: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800&auto=format&fit=crop&q=60",
    categoryId: "blackwork",
    category: { id: "blackwork", name: "Blackwork" },
    isFeatured: true,
    isActive: true,
    order: 2,
  },
  {
    id: "3",
    title: "Floral Fine Line",
    description: "Traços delicados no pulso",
    imageUrl: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=800&auto=format&fit=crop&q=60",
    categoryId: "fineline",
    category: { id: "fineline", name: "Fine Line" },
    isFeatured: true,
    isActive: true,
    order: 3,
  },
  {
    id: "4",
    title: "Septo Titânio",
    description: "Piercing no septo com joia em titânio grau implante",
    imageUrl: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800&auto=format&fit=crop&q=60",
    categoryId: "piercing",
    category: { id: "piercing", name: "Piercing" },
    isFeatured: false,
    isActive: true,
    order: 4,
  },
];

let budgets: any[] = [
  {
    id: "bud-1",
    name: "Carlos Ferreira",
    whatsapp: "(91) 98111-3333",
    email: "carlos@exemplo.com",
    style: "Realismo",
    size: "15x10 cm",
    bodyRegion: "Braço",
    description: "Quero fazer um lobo realista com sombreamento suave.",
    referenceImages: [],
    approximateBudget: "R$ 450",
    status: "PENDING",
    adminResponse: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "bud-2",
    name: "Ana Beatriz",
    whatsapp: "(91) 98222-4444",
    email: "ana@exemplo.com",
    style: "Fine Line",
    size: "8x5 cm",
    bodyRegion: "Costelas",
    description: "Frase delicada em caligrafia cursiva.",
    referenceImages: [],
    approximateBudget: "R$ 200",
    status: "RESPONDED",
    adminResponse: "Olá Ana! O valor fica em torno de R$ 200. Podemos agendar?",
    createdAt: new Date().toISOString(),
  },
];

export async function GET(
  req: NextRequest,
  { params }: { params: { route: string[] } }
) {
  const route = params.route || [];
  const path = route.join("/");
  const url = new URL(req.url);

  // Auth me
  if (path === "auth/me") {
    return NextResponse.json({
      data: {
        id: "1",
        name: "Gleydson",
        email: "admin@gleydsontattoo.com",
        role: "ADMIN",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    });
  }

  // Services
  if (path === "services") {
    return NextResponse.json({ data: services });
  }

  // Professionals
  if (path === "professionals") {
    return NextResponse.json({ data: professionals });
  }

  // Schedule slots
  if (path === "schedule/slots") {
    const slots = [
      { startTime: "09:00", endTime: "10:00" },
      { startTime: "10:00", endTime: "11:00" },
      { startTime: "11:00", endTime: "12:00" },
      { startTime: "14:00", endTime: "15:00" },
      { startTime: "15:00", endTime: "16:00" },
      { startTime: "16:00", endTime: "17:00" },
      { startTime: "17:00", endTime: "18:00" },
    ];
    return NextResponse.json({
      data: {
        slots,
        blocked: [],
        appointments: appointments.map((a) => ({ startTime: a.startTime })),
      },
    });
  }

  // Appointments
  if (path === "appointments") {
    const query = url.searchParams.get("query")?.toLowerCase();
    const status = url.searchParams.get("status");
    const date = url.searchParams.get("date");

    let filtered = [...appointments];
    if (query) {
      filtered = filtered.filter(
        (a) =>
          a.client.name.toLowerCase().includes(query) ||
          a.client.phone.includes(query)
      );
    }
    if (status && status !== "todos") {
      filtered = filtered.filter((a) => a.status === status);
    }
    if (date) {
      filtered = filtered.filter((a) => a.date.startsWith(date));
    }

    return NextResponse.json({
      data: filtered,
      pagination: {
        page: 1,
        limit: 50,
        total: filtered.length,
        totalPages: 1,
      },
    });
  }

  // Appointment by ID
  if (path.startsWith("appointments/")) {
    const id = route[1];
    const found = appointments.find((a) => a.id === id);
    if (!found) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json({ data: found });
  }

  // Clients
  if (path === "clients") {
    const query = url.searchParams.get("query")?.toLowerCase();
    let filtered = [...clients];
    if (query) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.phone.includes(query) ||
          c.email?.toLowerCase().includes(query)
      );
    }
    return NextResponse.json({
      data: filtered,
      pagination: { page: 1, limit: 50, total: filtered.length, totalPages: 1 },
    });
  }

  if (path.startsWith("clients/")) {
    const id = route[1];
    const found = clients.find((c) => c.id === id);
    if (!found) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json({ data: found });
  }

  // Portfolio
  if (path === "portfolio") {
    const cat = url.searchParams.get("categoryId");
    let filtered = portfolioItems;
    if (cat && cat !== "todas") {
      filtered = filtered.filter((item) => item.categoryId === cat);
    }
    return NextResponse.json({ data: filtered });
  }

  if (path.startsWith("portfolio/")) {
    const id = route[1];
    const found = portfolioItems.find((p) => p.id === id);
    if (!found) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json({ data: found });
  }

  // Budgets
  if (path === "budgets") {
    const status = url.searchParams.get("status");
    let filtered = [...budgets];
    if (status && status !== "todos") {
      filtered = filtered.filter((b) => b.status === status);
    }
    return NextResponse.json({
      data: filtered,
      pagination: { page: 1, limit: 50, total: filtered.length, totalPages: 1 },
    });
  }

  if (path.startsWith("budgets/")) {
    const id = route[1];
    const found = budgets.find((b) => b.id === id);
    if (!found) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json({ data: found });
  }

  return NextResponse.json({ data: {} });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { route: string[] } }
) {
  const route = params.route || [];
  const path = route.join("/");
  const body = await req.json().catch(() => ({}));

  if (path === "auth/login") {
    return NextResponse.json({
      data: {
        token: "mock-jwt-token",
        user: {
          id: "1",
          name: "Gleydson",
          email: "admin@gleydsontattoo.com",
          role: "ADMIN",
        },
      },
    });
  }

  if (path === "appointments") {
    const professional = professionals.find((p) => p.id === body.professionalId) || professionals[0];
    const service = services.find((s) => s.id === body.serviceId) || services[0];
    const newApt = {
      id: "apt-" + Date.now(),
      date: body.date,
      startTime: body.startTime,
      endTime: body.startTime,
      status: "PENDING",
      notes: body.client?.notes || "",
      client: {
        id: "cli-" + Date.now(),
        name: body.client?.name || "Cliente",
        phone: body.client?.phone || "",
        whatsapp: body.client?.whatsapp || body.client?.phone || "",
        email: body.client?.email || null,
      },
      service: { id: service.id, name: service.name, duration: service.duration },
      professional: { id: professional.id, name: professional.name },
    };
    appointments.unshift(newApt);
    clients.unshift({
      ...newApt.client,
      createdAt: new Date().toISOString(),
      appointments: [newApt],
    });
    return NextResponse.json({ data: newApt, message: "Agendamento criado com sucesso!" });
  }

  if (path === "portfolio") {
    const newItem = {
      id: "port-" + Date.now(),
      title: body.title || "Novo Trabalho",
      description: body.description || "",
      imageUrl: body.imageUrl || "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=800",
      categoryId: body.categoryId || "tatuagem",
      category: { id: body.categoryId || "tatuagem", name: body.categoryId || "Tatuagem" },
      isFeatured: body.isFeatured || false,
      isActive: true,
      order: portfolioItems.length + 1,
    };
    portfolioItems.unshift(newItem);
    return NextResponse.json({ data: newItem });
  }

  if (path === "budgets") {
    const newBud = {
      id: "bud-" + Date.now(),
      name: body.name || "Cliente",
      whatsapp: body.whatsapp || "",
      email: body.email || null,
      style: body.style || "",
      size: body.size || "",
      bodyRegion: body.bodyRegion || "",
      description: body.description || "",
      referenceImages: body.referenceImages || [],
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    budgets.unshift(newBud);
    return NextResponse.json({ data: newBud, message: "Orçamento solicitado com sucesso!" });
  }

  return NextResponse.json({ data: body });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { route: string[] } }
) {
  const route = params.route || [];
  const path = route.join("/");
  const body = await req.json().catch(() => ({}));

  if (path.includes("appointments/") && path.endsWith("/status")) {
    const id = route[1];
    const apt = appointments.find((a) => a.id === id);
    if (apt) {
      apt.status = body.status;
      if (body.cancelReason) apt.cancelReason = body.cancelReason;
    }
    return NextResponse.json({ data: apt });
  }

  if (path.includes("appointments/") && path.endsWith("/reschedule")) {
    const id = route[1];
    const apt = appointments.find((a) => a.id === id);
    if (apt) {
      if (body.date) apt.date = body.date;
      if (body.startTime) apt.startTime = body.startTime;
    }
    return NextResponse.json({ data: apt });
  }

  if (path.includes("budgets/") && path.endsWith("/status")) {
    const id = route[1];
    const b = budgets.find((item) => item.id === id);
    if (b) b.status = body.status;
    return NextResponse.json({ data: b });
  }

  if (path.includes("budgets/") && path.endsWith("/respond")) {
    const id = route[1];
    const b = budgets.find((item) => item.id === id);
    if (b) {
      b.adminResponse = body.response;
      b.status = "RESPONDED";
    }
    return NextResponse.json({ data: b });
  }

  if (path.startsWith("portfolio/")) {
    const id = route[1];
    const item = portfolioItems.find((p) => p.id === id);
    if (item) Object.assign(item, body);
    return NextResponse.json({ data: item });
  }

  return NextResponse.json({ data: body });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { route: string[] } }
) {
  const route = params.route || [];
  const path = route.join("/");

  if (path.startsWith("portfolio/")) {
    const id = route[1];
    portfolioItems = portfolioItems.filter((p) => p.id !== id);
    return NextResponse.json({ data: { success: true } });
  }

  return NextResponse.json({ data: { success: true } });
}
