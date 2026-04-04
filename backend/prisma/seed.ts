import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const properties = [
  {
    id: "p1",
    title: "Indus Business Park, Sector 62",
    slug: "indus-business-park-sector-62",
    city: "Noida",
    state: "Uttar Pradesh",
    location: "Sector 62, Noida",
    type: "Office",
    assetClass: "Commercial",
    minimumInvestment: 10000,
    totalValue: 75,
    totalUnits: 5000,
    fundedUnits: 2000,
    availableUnits: 3000,
    funded: 40,
    expectedReturn: "11.2%",
    occupancy: 96,
    leaseTerm: "7 years",
    highlights: [
      "Grade A office campus",
      "Stable rental income",
      "Excellent tenant mix",
    ],
    riskLevel: "Low",
    description:
      "Premium office tower in Noida with long-term institutional leases, high footfall, and direct metro connectivity.",
    summary:
      "Premium office tower in Noida with long-term institutional leases",
    images: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      "https://images.unsplash.com/photo-1464082354059-27db6ce500d8?w=800&q=80",
    ],
    tenants: ["Verve Tech Labs", "Sapphire Technologies", "Nova Consulting"],
    isFeatured: true,
    isNew: false,
  },
  {
    id: "p2",
    title: "Capital Square Mall, Connaught Place",
    slug: "capital-square-mall-connaught-place",
    city: "Delhi",
    state: "Delhi",
    location: "Connaught Place, Delhi",
    type: "Retail",
    assetClass: "Commercial",
    minimumInvestment: 10000,
    totalValue: 120,
    totalUnits: 1800,
    fundedUnits: 500,
    availableUnits: 1300,
    funded: 28,
    expectedReturn: "10.5%",
    occupancy: 91,
    leaseTerm: "5 years",
    highlights: [
      "High footfall",
      "Established retail brands",
      "Central business district access",
    ],
    riskLevel: "Medium",
    description:
      "Iconic retail destination in central Delhi offering premium mall frontage and strong evening demand.",
    summary: "Iconic retail destination in central Delhi",
    images: [
      "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&q=80",
      "https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=800&q=80",
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80",
    ],
    tenants: ["The Brew House", "Urban Apparel", "Heritage Bistro"],
    isFeatured: true,
    isNew: false,
  },
  {
    id: "p3",
    title: "Aero Logistics Park, Hoskote",
    slug: "aero-logistics-park-hoskote",
    city: "Bangalore",
    state: "Karnataka",
    location: "Hoskote, Bangalore",
    type: "Warehouse",
    assetClass: "Industrial",
    minimumInvestment: 10000,
    totalValue: 95,
    totalUnits: 2200,
    fundedUnits: 300,
    availableUnits: 1900,
    funded: 14,
    expectedReturn: "12.0%",
    occupancy: 88,
    leaseTerm: "8 years",
    highlights: [
      "Last-mile logistics hub",
      "Long-term leases",
      "High ceiling clearance",
    ],
    riskLevel: "Medium",
    description:
      "Modern logistics warehouse near Bangalore airport with temperature-controlled sections and 24/7 security.",
    summary: "Modern logistics warehouse near Bangalore airport",
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&q=80",
    ],
    tenants: ["Skyline Distribution", "Blue Parcel Express", "ECom Fulfillers"],
    isFeatured: false,
    isNew: true,
  },
  {
    id: "p4",
    title: "Greenworks CoLab, MG Road",
    slug: "greenworks-colab-mg-road",
    city: "Gurgaon",
    state: "Haryana",
    location: "MG Road, Gurgaon",
    type: "Coworking",
    assetClass: "Commercial",
    minimumInvestment: 10000,
    totalValue: 36,
    totalUnits: 1200,
    fundedUnits: 500,
    availableUnits: 700,
    funded: 42,
    expectedReturn: "10.8%",
    occupancy: 93,
    leaseTerm: "4 years",
    highlights: [
      "Flexible lease terms",
      "High renewal rates",
      "Premium business district location",
    ],
    riskLevel: "Low",
    description:
      "Flexible coworking campus in Gurgaon with premium amenities, dedicated desks, and corporate memberships.",
    summary: "Flexible coworking campus in Gurgaon",
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    ],
    tenants: ["Nimbus Startups", "Pulse Creative", "Vertex Advisors"],
    isFeatured: true,
    isNew: false,
  },
  {
    id: "p5",
    title: "Silverline Plaza, Sector 18",
    slug: "silverline-plaza-sector-18",
    city: "Noida",
    state: "Uttar Pradesh",
    location: "Sector 18, Noida",
    type: "Office",
    assetClass: "Commercial",
    minimumInvestment: 10000,
    totalValue: 68,
    totalUnits: 4200,
    fundedUnits: 1500,
    availableUnits: 2700,
    funded: 36,
    expectedReturn: "11.0%",
    occupancy: 95,
    leaseTerm: "6 years",
    highlights: [
      "Strong cash flow",
      "High occupancy",
      "Corporate tenant roster",
    ],
    riskLevel: "Low",
    description:
      "Grade A office property with large floor plates and direct access to metro, ideal for finance and SaaS tenants.",
    summary: "Grade A office property with large floor plates",
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=800&q=80",
      "https://images.unsplash.com/photo-1464082354059-27db6ce500d8?w=800&q=80",
    ],
    tenants: ["Axis Financial", "Emerge Analytics", "Trident Ventures"],
    isFeatured: false,
    isNew: false,
  },
  {
    id: "p6",
    title: "Aurora Retail Avenue, Brigade Road",
    slug: "aurora-retail-avenue-brigade-road",
    city: "Bangalore",
    state: "Karnataka",
    location: "Brigade Road, Bangalore",
    type: "Retail",
    assetClass: "Commercial",
    minimumInvestment: 10000,
    totalValue: 88,
    totalUnits: 1500,
    fundedUnits: 200,
    availableUnits: 1300,
    funded: 13,
    expectedReturn: "10.9%",
    occupancy: 89,
    leaseTerm: "5 years",
    highlights: [
      "Strong weekend traffic",
      "Curated brand mix",
      "Premium street frontage",
    ],
    riskLevel: "Medium",
    description:
      "High-street retail asset in Bangalore's premium shopping district with boutique stores and experiential dining.",
    summary:
      "High-street retail asset in Bangalore's premium shopping district",
    images: [
      "https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=800&q=80",
      "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&q=80",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    ],
    tenants: ["Moda Fashion", "Sip & Dine", "Studio 7"],
    isFeatured: false,
    isNew: true,
  },
  {
    id: "p7",
    title: "MetroHub Logistics, Gurgaon",
    slug: "metrohub-logistics-gurgaon",
    city: "Gurgaon",
    state: "Haryana",
    location: "NH 8, Gurgaon",
    type: "Warehouse",
    assetClass: "Industrial",
    minimumInvestment: 10000,
    totalValue: 80,
    totalUnits: 2100,
    fundedUnits: 400,
    availableUnits: 1700,
    funded: 19,
    expectedReturn: "12.3%",
    occupancy: 92,
    leaseTerm: "9 years",
    highlights: ["Strategic location", "Modern facilities", "Growing demand"],
    riskLevel: "Medium",
    description:
      "Strategic logistics warehouse on NH 8 with excellent connectivity and modern facilities.",
    summary: "Strategic logistics warehouse on NH 8",
    images: [
      "https://images.unsplash.com/photo-1610465299993-e6675c9f9efa?w=800&q=80",
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80",
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80",
    ],
    tenants: ["Rapid Freight", "Omni Warehousing", "Retail Stack"],
    isFeatured: false,
    isNew: false,
  },
];

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@brickshare.com" },
    update: {},
    create: {
      email: "demo@brickshare.com",
      password: "$2a$10$hashedpassword", // dummy hash
      name: "Demo User",
      phone: "+91 9876543210",
      kycStatus: "approved",
    },
  });

  console.log("Created demo user:", user.id);

  // Create properties
  for (const property of properties) {
    const created = await prisma.property.upsert({
      where: { id: property.id },
      update: {},
      create: property,
    });
    console.log("Created property:", created.title);
  }

  // Create sample investments
  const investments = [
    { propertyId: "p1", units: 5, amount: 50000 },
    { propertyId: "p2", units: 3, amount: 30000 },
    { propertyId: "p4", units: 8, amount: 80000 },
  ];

  for (const investment of investments) {
    const created = await prisma.investment.create({
      data: {
        userId: user.id,
        ...investment,
        currentValue: investment.amount * 1.05, // 5% return
        returnPercent: "5.0%",
      },
    });
    console.log("Created investment:", created.id);
  }

  // Create sample transactions
  const transactions = [
    { type: "Investment", amount: 50000, propertyId: "p1" },
    { type: "Investment", amount: 30000, propertyId: "p2" },
    { type: "Return", amount: 2500, propertyId: "p1" },
    { type: "Investment", amount: 80000, propertyId: "p4" },
  ];

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: {
        userId: user.id,
        ...transaction,
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
