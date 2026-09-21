import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CITIES = [
  { city: "Mumbai", state: "Maharashtra", locations: ["BKC", "Lower Parel", "Andheri East", "Powai", "Nariman Point"] },
  { city: "Bangalore", state: "Karnataka", locations: ["Whitefield", "Outer Ring Road", "Electronic City", "Koramangala", "Indiranagar"] },
  { city: "Delhi NCR", state: "Delhi", locations: ["Cyber City, Gurgaon", "Sector 62, Noida", "Connaught Place", "Golf Course Road", "Aerocity"] },
  { city: "Hyderabad", state: "Telangana", locations: ["HITEC City", "Gachibowli", "Financial District", "Banjara Hills", "Jubilee Hills"] },
  { city: "Pune", state: "Maharashtra", locations: ["Hinjewadi", "Kharadi", "Magarpatta", "Viman Nagar", "Baner"] },
  { city: "Chennai", state: "Tamil Nadu", locations: ["OMR", "Guindy", "Taramani", "Anna Salai", "Velachery"] },
];

const PROPERTY_TYPES = ["Office", "Retail", "Warehouse", "Coworking", "Data Center"];
const ASSET_CLASSES = ["Commercial", "Industrial", "Mixed-Use"];

const TENANT_POOLS = [
  ["TCS", "Infosys", "Wipro", "Tech Mahindra", "HCL Technologies"],
  ["Amazon", "Flipkart", "Myntra", "Delhivery", "Blue Dart"],
  ["JP Morgan", "Goldman Sachs", "Morgan Stanley", "Citibank", "Barclays"],
  ["Google", "Microsoft", "Apple", "Meta", "Adobe"],
  ["Reliance Retail", "Shoppers Stop", "Lifestyle", "Tata Westside", "PVR Cinemas"],
  ["WeWork", "Awfis", "Innov8", "91springboard", "IndiQube"],
];

const IMAGES = [
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  "https://images.unsplash.com/photo-1464082354059-27db6ce500d8?w=800&q=80",
  "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&q=80",
  "https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=800&q=80",
  "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
  "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
  "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=800&q=80",
  "https://images.unsplash.com/photo-1610465299993-e6675c9f9efa?w=800&q=80",
  "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80",
  "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80",
];

const HIGHLIGHTS_POOL = [
  "LEED Platinum Certified",
  "Grade A Building",
  "100% Power Backup",
  "Direct Metro Access",
  "High Speed Elevators",
  "Premium Glass Façade",
  "24/7 Multi-tier Security",
  "Ample Covered Parking",
  "Centralized Air Conditioning",
  "Food Court & Cafeteria",
  "IGBC Green Building",
];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min: number, max: number, decimals: number) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

const generateSlug = (title: string, city: string) =>
  `${title}-${city}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function main() {
  console.log("Starting database reset and seed...");

  // Reset existing data
  console.log("Cleaning up existing data...");
  await prisma.message.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.investment.deleteMany({});
  await prisma.watchlist.deleteMany({});
  await prisma.chunk.deleteMany({});
  await prisma.property.deleteMany({});

  // Created demo user with unhashed password
  const user = await prisma.user.upsert({
    where: { email: "demo@brickshare.com" },
    update: { password: "12345678" },
    create: {
      email: "demo@brickshare.com",
      password: "12345678",
      name: "Admin User",
      phone: "+91 9876543210",
      kycStatus: "approved",
    },
  });

  console.log("Admin user secured:", user.email);

  // Generate 40 properties
  console.log("Generating authentic properties...");
  const generatedProperties = [];

  for (let i = 1; i <= 40; i++) {
    const cityData = getRandomElement(CITIES);
    const location = getRandomElement(cityData.locations);
    const type = getRandomElement(PROPERTY_TYPES);

    let assetClass = "Commercial";
    if (type === "Warehouse" || type === "Data Center") assetClass = "Industrial";
    if (type === "Retail") assetClass = getRandomElement(["Commercial", "Mixed-Use"]);

    const prefix = getRandomElement(["Prestige", "DLF", "Embassy", "Mindspace", "Godrej", "Brigade", "Lodha", "Brookfield", "RMZ"]);
    const suffix = type === "Office" ? "Tech Park" : type === "Warehouse" ? "Logistics Hub" : type === "Retail" ? "Avenue" : "Center";
    const title = `${prefix} ${suffix}, ${location.split(',')[0]}`;

    const totalValue = getRandomInt(40, 250); // Crores
    const totalUnits = totalValue * 100; // Rs 10,000 per unit
    const fundedPercent = getRandomInt(10, 100);
    const fundedUnits = Math.floor((totalUnits * fundedPercent) / 100);
    const availableUnits = totalUnits - fundedUnits;

    // 2026 realistic expected returns (9.5% to 14.5%)
    const expectedReturn = getRandomFloat(9.5, 14.5, 1);
    const occupancy = getRandomInt(85, 100);
    const leaseTerm = getRandomInt(3, 9);

    const riskLevel = expectedReturn > 12.5 ? "High" : expectedReturn > 10.5 ? "Medium" : "Low";

    // Pick 3 random highlights
    const shuffledHighlights = [...HIGHLIGHTS_POOL].sort(() => 0.5 - Math.random());
    const highlights = shuffledHighlights.slice(0, 3);

    // Pick 3 random images
    const shuffledImages = [...IMAGES].sort(() => 0.5 - Math.random());
    const images = shuffledImages.slice(0, 3);

    // Pick tenants based on type
    let tenantPool = TENANT_POOLS[0];
    if (type === "Retail") tenantPool = TENANT_POOLS[4];
    else if (type === "Warehouse") tenantPool = TENANT_POOLS[1];
    else if (type === "Coworking") tenantPool = TENANT_POOLS[5];
    else if (type === "Office" && Math.random() > 0.5) tenantPool = TENANT_POOLS[3];

    const shuffledTenants = [...tenantPool].sort(() => 0.5 - Math.random());
    const tenants = shuffledTenants.slice(0, 3);

    const description = `This premium ${type.toLowerCase()} asset in ${location}, ${cityData.city} represents a flagship investment opportunity for 2026. Managed by tier-1 operators, the property boasts ${occupancy}% occupancy with long-term lock-ins from anchor tenants like ${tenants[0]}. It features modern infrastructure including ${highlights[0].toLowerCase()} and ${highlights[1].toLowerCase()}, catering to the rising demand for high-quality ${assetClass.toLowerCase()} spaces in the region.`;
    const summary = `Premium ${type.toLowerCase()} asset in ${location} with ${occupancy}% occupancy and strong tenant covenants.`;

    const property = {
      title,
      slug: generateSlug(title, cityData.city) + `-${i}`, // Ensure unique slugs
      city: cityData.city,
      state: cityData.state,
      location: `${location}, ${cityData.city}`,
      type,
      assetClass,
      minimumInvestment: 10000,
      totalValue,
      totalUnits,
      fundedUnits,
      availableUnits,
      funded: fundedPercent,
      expectedReturn: `${expectedReturn}%`,
      occupancy,
      leaseTerm: `${leaseTerm} years`,
      highlights,
      riskLevel,
      description,
      summary,
      images,
      tenants,
      isFeatured: i <= 5, // First 5 are featured
      isNew: i > 30, // Last 10 are marked new
    };

    generatedProperties.push(property);
  }

  // Insert all properties
  for (const property of generatedProperties) {
    await prisma.property.create({
      data: property,
    });
  }

  console.log(`Successfully seeded ${generatedProperties.length} authentic properties.`);

  // Create sample investments for demo user to make the portfolio look rich
  console.log("Setting up Admin User's portfolio...");
  const properties = await prisma.property.findMany({ take: 6 });

  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];
    const units = getRandomInt(5, 50);
    const amount = units * prop.minimumInvestment;

    await prisma.investment.create({
      data: {
        userId: user.id,
        propertyId: prop.id,
        units,
        amount,
        currentValue: amount * getRandomFloat(1.02, 1.15, 2),
        returnPercent: `${getRandomFloat(4.5, 12.0, 1)}%`,
      },
    });

    await prisma.transaction.create({
      data: {
        userId: user.id,
        propertyId: prop.id,
        type: "Investment",
        amount,
      },
    });
  }

  console.log("Database seeded successfully with September 2026 market data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
