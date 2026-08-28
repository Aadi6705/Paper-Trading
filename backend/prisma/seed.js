const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const stocks = [
  { symbol: 'RELIANCE', companyName: 'Reliance Industries', sector: 'Energy' },
  { symbol: 'TCS', companyName: 'Tata Consultancy Services', sector: 'IT' },
  { symbol: 'HDFCBANK', companyName: 'HDFC Bank', sector: 'Financials' },
  { symbol: 'INFY', companyName: 'Infosys', sector: 'IT' },
  { symbol: 'ICICIBANK', companyName: 'ICICI Bank', sector: 'Financials' },
  { symbol: 'HUL', companyName: 'Hindustan Unilever', sector: 'FMCG' },
  { symbol: 'SBIN', companyName: 'State Bank of India', sector: 'Financials' },
  { symbol: 'BHARTIARTL', companyName: 'Bharti Airtel', sector: 'Telecom' },
  { symbol: 'ITC', companyName: 'ITC Limited', sector: 'FMCG' },
  { symbol: 'KOTAKBANK', companyName: 'Kotak Mahindra Bank', sector: 'Financials' },
  { symbol: 'LT', companyName: 'Larsen & Toubro', sector: 'Construction' },
  { symbol: 'AXISBANK', companyName: 'Axis Bank', sector: 'Financials' },
  { symbol: 'ASIANPAINT', companyName: 'Asian Paints', sector: 'Consumer Goods' },
  { symbol: 'MARUTI', companyName: 'Maruti Suzuki', sector: 'Automobile' },
  { symbol: 'TATAMOTORS', companyName: 'Tata Motors', sector: 'Automobile' },
];

async function main() {
  console.log('Seeding stocks...');
  for (const stock of stocks) {
    await prisma.stock.upsert({
      where: { symbol: stock.symbol },
      update: {},
      create: stock,
    });
  }
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
