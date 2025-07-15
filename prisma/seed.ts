// prisma/seed.ts
import { PrismaClient, UserRole, AppointmentStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
 
  /*  Especialidades                                                      */
  
  const specialtiesData = [
    'Corte de Cabelo',
    'Barba',
    'Corte + Barba',
    'Sobrancelha',
    'Pigmentação',
    'Platinado',
  ];

  for (const name of specialtiesData) {
    await prisma.specialty.upsert({
      where: { name },               
      update: {},
      create: { name },
    });
  }

 
  /*  Barbeiros + especialidades                                          */
 
  const barbersData = [
    {
      name: 'João Silva',
      age: 28,
      hireDate: new Date('2023-01-15'),
      specialties: ['Corte de Cabelo', 'Barba', 'Corte + Barba'],
    },
    {
      name: 'Pedro Santos',
      age: 35,
      hireDate: new Date('2022-06-20'),
      specialties: ['Corte de Cabelo', 'Barba', 'Sobrancelha'],
    },
    {
      name: 'Carlos Oliveira',
      age: 42,
      hireDate: new Date('2020-03-10'),
      specialties: ['Corte de Cabelo', 'Barba', 'Pigmentação', 'Platinado'],
    },
  ];

  for (const data of barbersData) {
    await prisma.barber.create({
      data: {
        name: data.name,
        age: data.age,
        hireDate: data.hireDate,
        specialties: {
          create: data.specialties.map((specName) => ({
            specialty: { connect: { name: specName } },
          })),
        },
      },
    });
  }


  /*  Usuário ADMIN de exemplo                                            */

  const adminHash = await bcrypt.hash('admin123', 8);

  await prisma.user.upsert({
    where: { email: 'admin@clickbeard.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@clickbeard.com',
      password: adminHash,
      role: UserRole.ADMIN,
    },
  });


  /*  Cliente fictício + agendamento-demo                                 */

  const client = await prisma.user.create({
    data: {
      name: 'Primeiro Cliente',
      email: 'cliente@clickbeard.com',
      password: await bcrypt.hash('cliente123', 8),
      // role default é CLIENT
    },
  });

  const barber = await prisma.barber.findFirst({ where: { name: 'João Silva' } });
  const specialty = await prisma.specialty.findFirst({ where: { name: 'Corte de Cabelo' } });

  if (barber && specialty) {
    await prisma.appointment.create({
      data: {
        appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 dias
        status: AppointmentStatus.SCHEDULED,
        user:      { connect: { id: client.id } },
        barber:    { connect: { id: barber.id } },
        specialty: { connect: { id: specialty.id } },
      },
    });
  }
}

main()
  .then(async () => {
    console.log('✅ Seed concluído com sucesso!');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
