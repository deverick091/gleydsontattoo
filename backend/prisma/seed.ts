import { PrismaClient, UserRole, PriceType, BlockedTimeReason } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin User ──
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gleydsontattoo.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'GleydsonTattoo2024!';
  const adminName = process.env.ADMIN_NAME || 'Gleydson';

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });
  console.log(`  ✅ Admin user: ${admin.email}`);

  // ── Professional ──
  const professional = await prisma.professional.upsert({
    where: { email: 'gleydson@gleydsontattoo.com' },
    update: {},
    create: {
      name: 'Gleydson',
      email: 'gleydson@gleydsontattoo.com',
      phone: '5591999999999',
      bio: 'Tatuador profissional com anos de experiência em diversos estilos. Especialista em Blackwork, Realismo e Fine Line.',
      specialties: ['Blackwork', 'Realismo', 'Fine Line', 'Old School', 'Lettering'],
      isActive: true,
      userId: admin.id,
    },
  });
  console.log(`  ✅ Professional: ${professional.name}`);

  // ── Service Categories ──
  const categories = await Promise.all([
    prisma.serviceCategory.upsert({
      where: { slug: 'tatuagem' },
      update: {},
      create: { name: 'Tatuagem', slug: 'tatuagem', description: 'Todos os estilos de tatuagem', order: 1, isActive: true },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: 'blackwork' },
      update: {},
      create: { name: 'Blackwork', slug: 'blackwork', description: 'Tatuagens em preto sólido e padrões geométricos', order: 2, isActive: true },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: 'fine-line' },
      update: {},
      create: { name: 'Fine Line', slug: 'fine-line', description: 'Traços finos e delicados', order: 3, isActive: true },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: 'old-school' },
      update: {},
      create: { name: 'Old School', slug: 'old-school', description: 'Estilo tradicional americano', order: 4, isActive: true },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: 'realismo' },
      update: {},
      create: { name: 'Realismo', slug: 'realismo', description: 'Tatuagens realistas e retratos', order: 5, isActive: true },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: 'lettering' },
      update: {},
      create: { name: 'Lettering', slug: 'lettering', description: 'Letras e caligrafia artística', order: 6, isActive: true },
    }),
    prisma.serviceCategory.upsert({
      where: { slug: 'piercing' },
      update: {},
      create: { name: 'Piercing', slug: 'piercing', description: 'Colocação de piercings', order: 7, isActive: true },
    }),
  ]);
  console.log(`  ✅ ${categories.length} service categories`);

  const [catTatuagem, , , , , , catPiercing] = categories;

  // ── Services ──
  const services = await Promise.all([
    prisma.service.upsert({
      where: { slug: 'tatuagem-blackwork' },
      update: {},
      create: {
        name: 'Tatuagem Blackwork',
        slug: 'tatuagem-blackwork',
        description: 'Tatuagem em estilo blackwork com preto sólido, padrões geométricos e tribais. Ideal para composições grandes e impactantes.',
        duration: 120,
        priceType: PriceType.STARTING_AT,
        priceMin: 200,
        isActive: true,
        order: 1,
        categoryId: catTatuagem.id,
      },
    }),
    prisma.service.upsert({
      where: { slug: 'tatuagem-fine-line' },
      update: {},
      create: {
        name: 'Tatuagem Fine Line',
        slug: 'tatuagem-fine-line',
        description: 'Traços finos e delicados para tatuagens minimalistas e elegantes. Perfeita para designs sutis e detalhados.',
        duration: 90,
        priceType: PriceType.STARTING_AT,
        priceMin: 150,
        isActive: true,
        order: 2,
        categoryId: catTatuagem.id,
      },
    }),
    prisma.service.upsert({
      where: { slug: 'tatuagem-old-school' },
      update: {},
      create: {
        name: 'Tatuagem Old School',
        slug: 'tatuagem-old-school',
        description: 'Estilo tradicional americano com cores vibrantes, contornos fortes e designs clássicos como âncoras, rosas e águias.',
        duration: 120,
        priceType: PriceType.STARTING_AT,
        priceMin: 200,
        isActive: true,
        order: 3,
        categoryId: catTatuagem.id,
      },
    }),
    prisma.service.upsert({
      where: { slug: 'tatuagem-realismo' },
      update: {},
      create: {
        name: 'Tatuagem Realismo',
        slug: 'tatuagem-realismo',
        description: 'Tatuagens hiper-realistas, retratos e reproduções fotográficas na pele. Requer múltiplas sessões para peças grandes.',
        duration: 180,
        priceType: PriceType.CONSULTATION,
        isActive: true,
        order: 4,
        categoryId: catTatuagem.id,
      },
    }),
    prisma.service.upsert({
      where: { slug: 'tatuagem-lettering' },
      update: {},
      create: {
        name: 'Tatuagem Lettering',
        slug: 'tatuagem-lettering',
        description: 'Letras e caligrafia artística para frases, nomes e palavras significativas. Diversos estilos de fonte disponíveis.',
        duration: 60,
        priceType: PriceType.STARTING_AT,
        priceMin: 100,
        isActive: true,
        order: 5,
        categoryId: catTatuagem.id,
      },
    }),
    prisma.service.upsert({
      where: { slug: 'colocacao-piercing' },
      update: {},
      create: {
        name: 'Colocação de Piercing',
        slug: 'colocacao-piercing',
        description: 'Colocação profissional de piercing com material esterilizado e joia de qualidade. Inclui orientações de cuidados pós-procedimento.',
        duration: 30,
        priceType: PriceType.STARTING_AT,
        priceMin: 80,
        isActive: true,
        order: 6,
        categoryId: catPiercing.id,
      },
    }),
    prisma.service.upsert({
      where: { slug: 'orcamento-tatuagem' },
      update: {},
      create: {
        name: 'Orçamento de Tatuagem',
        slug: 'orcamento-tatuagem',
        description: 'Consulta para orçamento personalizado de tatuagem. Traga suas referências e ideias para criarmos algo único.',
        duration: 30,
        priceType: PriceType.CONSULTATION,
        isActive: true,
        order: 7,
        categoryId: catTatuagem.id,
      },
    }),
  ]);
  console.log(`  ✅ ${services.length} services`);

  // ── Time Slots (Mon-Sat 09:00-18:00, 1h intervals) ──
  const daysOfWeek = [1, 2, 3, 4, 5, 6]; // Mon-Sat
  const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  let slotCount = 0;
  for (const day of daysOfWeek) {
    for (const hour of hours) {
      const endHour = `${String(Number(hour.split(':')[0]) + 1).padStart(2, '0')}:00`;
      await prisma.timeSlot.upsert({
        where: {
          professionalId_dayOfWeek_startTime: {
            professionalId: professional.id,
            dayOfWeek: day,
            startTime: hour,
          },
        },
        update: {},
        create: {
          professionalId: professional.id,
          dayOfWeek: day,
          startTime: hour,
          endTime: endHour,
          isActive: true,
        },
      });
      slotCount++;
    }
  }
  console.log(`  ✅ ${slotCount} time slots`);

  // ── Settings ──
  const settings = [
    { key: 'studio_name', value: 'Gleydsontattoo', type: 'STRING', description: 'Nome do estúdio' },
    { key: 'studio_address', value: 'R. Domingos Silva, 84 — Barcarena, PA — 68445-000', type: 'STRING', description: 'Endereço completo' },
    { key: 'studio_phone', value: '5591999999999', type: 'STRING', description: 'Telefone principal' },
    { key: 'studio_whatsapp', value: '5591999999999', type: 'STRING', description: 'WhatsApp' },
    { key: 'studio_instagram', value: '@gleydsontattoo', type: 'STRING', description: 'Instagram' },
    { key: 'studio_email', value: 'contato@gleydsontattoo.com', type: 'STRING', description: 'E-mail de contato' },
    { key: 'working_hours', value: JSON.stringify({ mon: '09:00-18:00', tue: '09:00-18:00', wed: '09:00-18:00', thu: '09:00-18:00', fri: '09:00-18:00', sat: '09:00-18:00', sun: 'Fechado' }), type: 'JSON', description: 'Horário de funcionamento' },
    { key: 'min_advance_hours', value: '24', type: 'NUMBER', description: 'Antecedência mínima para agendamento (horas)' },
    { key: 'cancellation_policy', value: 'Cancelamentos devem ser feitos com pelo menos 24 horas de antecedência. Cancelamentos tardios ou não comparecimento podem resultar em cobrança parcial.', type: 'STRING', description: 'Política de cancelamento' },
    { key: 'booking_confirmation_message', value: 'Olá, {NOME}! Seu agendamento no Gleydsontattoo foi registrado com sucesso!', type: 'STRING', description: 'Mensagem de confirmação de agendamento' },
    { key: 'reminder_message', value: 'Olá, {NOME}! Passando para lembrar que seu horário no Gleydsontattoo está marcado para amanhã às {HORARIO}.', type: 'STRING', description: 'Mensagem de lembrete' },
    { key: 'maps_latitude', value: '-1.5103', type: 'STRING', description: 'Latitude (Google Maps)' },
    { key: 'maps_longitude', value: '-48.6284', type: 'STRING', description: 'Longitude (Google Maps)' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: setting.value,
        type: setting.type as 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON',
        description: setting.description,
      },
    });
  }
  console.log(`  ✅ ${settings.length} settings`);

  console.log('\n🎉 Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

