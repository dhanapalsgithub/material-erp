import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);

  // 1. நிறுவனத்தின் விவரங்கள் (Company Details - GSTIN & Address for E-Way Bill)
  await db.company.upsert({
    where: { id: 'default-company' },
    update: {
      gstin: '27AAAAA0000A1Z5',
      address: '123 Business Park',
      city: 'Mumbai',
      pincode: '400001',
    },
    create: {
      id: 'default-company',
      name: 'BuildMart Materials',
      gstin: '27AAAAA0000A1Z5',
      address: '123 Business Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      stateCode: '27',
      pincode: '400001',
      invoicePrefix: 'INV',
    },
  });

  // 2. பயனர்கள் உருவாக்கம் (Admin, Manager, Staff)
  await db.user.upsert({
    where: { email: 'admin@buildmart.local' },
    update: { passwordHash },
    create: {
      name: 'Administrator',
      email: 'admin@buildmart.local',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  await db.user.upsert({
    where: { email: 'manager@buildmart.local' },
    update: { passwordHash },
    create: {
      name: 'Store Manager',
      email: 'manager@buildmart.local',
      passwordHash,
      role: Role.MANAGER,
    },
  });

  await db.user.upsert({
    where: { email: 'staff@buildmart.local' },
    update: { passwordHash },
    create: {
      name: 'Billing Staff',
      email: 'staff@buildmart.local',
      passwordHash,
      role: Role.STAFF,
    },
  });

  // 3. வகைகள் மற்றும் பொருட்கள் (Categories & Items)
  const c = await db.category.upsert({
    where: { name: 'Cement' },
    update: {},
    create: { name: 'Cement' },
  });

  await db.item.upsert({
    where: { sku: 'CEM-OPC-50' },
    update: {},
    create: {
      sku: 'CEM-OPC-50',
      name: 'OPC Cement 50 kg',
      categoryId: c.id,
      unit: 'Bag',
      hsnCode: '25232910',
      gstRate: 28,
      purchaseRate: 350,
      sellingRate: 390,
      reorderLevel: 20,
      currentStock: 100,
    },
  });

  // 4. மாதிரி வாடிக்கையாளர் (Sample Customer)
  await db.customer.upsert({
    where: { id: 'sample-customer-1' },
    update: {},
    create: {
      id: 'sample-customer-1',
      name: 'ABC Builders & Developers',
      phone: '9876543210',
      gstin: '27BBBCA1234B1ZD',
      address: '45 Construction Avenue',
      city: 'Pune',
      state: 'Maharashtra',
      stateCode: '27',
      pincode: '411001',
    },
  });

  // 5. மாதிரி விற்பனையாளர் (Sample Supplier)
  await db.supplier.upsert({
    where: { id: 'sample-supplier-1' },
    update: {},
    create: {
      id: 'sample-supplier-1',
      name: 'UltraTech Cement Ltd',
      phone: '9822001122',
      gstin: '27AAACU1234C1Z1',
      address: 'Industrial Zone',
      city: 'Nagpur',
      state: 'Maharashtra',
      stateCode: '27',
      pincode: '440001',
    },
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await db.$disconnect();
    process.exit(1);
  });