const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");
const bcrypt = require("bcryptjs");

// Load .env file manually if DATABASE_URL is not in process.env
if (!process.env.DATABASE_URL) {
  const envPath = path.resolve(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf-8");
    envFile.split("\n").forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    });
  }
}

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL is not defined in environment or .env file.");
  process.exit(1);
}

// Initialize Prisma with PostgreSQL driver adapter
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // 1. Create or get default seller user
  const hashedPassword = await bcrypt.hash("password123", 10);
  const seller = await prisma.user.upsert({
    where: { email: "seller@goldenball.com" },
    update: {},
    create: {
      name: "Seller Admin",
      username: "seller_admin",
      email: "seller@goldenball.com",
      password: hashedPassword,
      phone: "1234567890",
      role: "ADMIN",
    },
  });

  console.log(`Seller user created/retrieved: ${seller.name} (${seller.id})`);

  // 2. Clear existing bids and products to avoid duplication during clean seed
  console.log("Cleaning existing bids and products...");
  await prisma.bid.deleteMany({});
  await prisma.product.deleteMany({});

  // 3. Define the products
  const productsData = [
    {
      title: "Sony PlayStation 5 Console",
      description: "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio, and an all-new generation of incredible PlayStation games.",
      startingPrice: 499.99,
      currentPrice: 499.99,
      currency: "$",
      image: "/images/ps5.png",
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: "ACTIVE",
      sellerId: seller.id,
    },
    {
      title: "Sony 65-Inch OLED Smart TV",
      description: "Step up to a whole new level of vision and sound with this stunning 65-inch OLED Smart TV. Featuring breathtaking contrast, deep blacks, and rich vibrant colors, powered by an advanced cognitive processor.",
      startingPrice: 1299.99,
      currentPrice: 1299.99,
      currency: "£",
      image: "/images/tv.png",
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: "ACTIVE",
      sellerId: seller.id,
    },
    {
      title: "Rare Emerald & Diamond Necklace",
      description: "An exquisite, rare masterpiece featuring a massive vivid green emerald pendant weighing 15.4 carats, surrounded by brilliant-cut diamonds. Set in 18k white gold, this one-of-a-kind statement necklace is truly a collector's treasure.",
      startingPrice: 2450000.00,
      currentPrice: 2450000.00,
      currency: "€",
      image: "/images/necklace.png",
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: "ACTIVE",
      sellerId: seller.id,
    },
    {
      title: "Vintage Red Roadster Sports Car",
      description: "A meticulously restored vintage cherry red convertible sports car from the golden era of motoring. Complete with leather seats, chrome wire wheels, and a responsive inline-six engine. A dream drive for collectors.",
      startingPrice: 89000.00,
      currentPrice: 89000.00,
      currency: "$",
      image: "/images/sports_car.png",
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: "ACTIVE",
      sellerId: seller.id,
    },
    {
      title: "Skeleton Dial Gold Chronograph Watch",
      description: "A masterclass in horology, featuring an intricate 18k yellow gold skeleton dial watch showing beautiful mechanical hand-wound movement. Paired with a hand-stitched alligator leather strap.",
      startingPrice: 45000.00,
      currentPrice: 45000.00,
      currency: "€",
      image: "/images/watch.png",
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: "ACTIVE",
      sellerId: seller.id,
    },
  ];

  // 4. Create products
  for (const product of productsData) {
    const createdProduct = await prisma.product.create({
      data: product,
    });
    console.log(`Created product: ${createdProduct.title} (${createdProduct.currency}${createdProduct.startingPrice})`);
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
