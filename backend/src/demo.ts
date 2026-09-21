import type { NextFunction } from "express";

export const isDemoFallbackEnabled = () =>
  process.env.DEMO_FALLBACK !== "false";

export const isDatabaseUnavailable = (error: unknown) => {
  if (!isDemoFallbackEnabled()) {
    return false;
  }

  const message = error instanceof Error ? error.message : String(error);
  return [
    "Can't reach database server",
    "Environment variable not found: DATABASE_URL",
    "does not exist in the current database",
    "P1001",
    "P2021",
  ].some((needle) => message.includes(needle));
};

export const handleOrFallback = (
  error: unknown,
  next: NextFunction,
  fallback: () => void,
) => {
  if (isDatabaseUnavailable(error)) {
    fallback();
    return;
  }

  next(error);
};

export const demoUser = {
  id: "demo-user",
  email: "demo@brickshare.local",
  name: "Demo Investor",
  phone: "9999999999",
};

export const demoProperties = [
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
      "Premium office tower in Noida with long-term institutional leases.",
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
    summary: "Iconic retail destination in central Delhi.",
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
    summary: "Modern logistics warehouse near Bangalore airport.",
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
    summary: "Flexible coworking campus in Gurgaon.",
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    ],
    tenants: ["Nimbus Startups", "Pulse Creative", "Vertex Advisors"],
    isFeatured: true,
    isNew: false,
  },
] as const;

export const getDemoPropertyById = (id: string) =>
  demoProperties.find((property) => property.id === id);

export const demoPortfolio = {
  investments: [
    {
      id: "demo-investment-p1",
      propertyId: "p1",
      title: demoProperties[0].title,
      city: demoProperties[0].city,
      units: 3,
      invested: 30000,
      currentValue: 32400,
      returnPercent: "8.0%",
    },
    {
      id: "demo-investment-p2",
      propertyId: "p2",
      title: demoProperties[1].title,
      city: demoProperties[1].city,
      units: 2,
      invested: 20000,
      currentValue: 21500,
      returnPercent: "7.5%",
    },
  ],
  totalInvested: 50000,
};

export const demoWatchlist = [
  {
    id: "demo-watchlist-p3",
    propertyId: "p3",
    property: demoProperties[2],
  },
];

export const demoTransactions = [
  {
    id: "demo-transaction-1",
    type: "Investment",
    property: demoProperties[0].title,
    amount: 30000,
    date: "Today",
    status: "Completed",
  },
  {
    id: "demo-transaction-2",
    type: "Return",
    property: demoProperties[1].title,
    amount: 1500,
    date: "Yesterday",
    status: "Completed",
  },
] as const;

export const demoNotifications = [
  {
    id: "demo-notification-1",
    title: "Investment completed",
    description: `Investment of Rs 30,000 for ${demoProperties[0].title}`,
    type: "investment",
    date: "Today",
    unread: true,
  },
  {
    id: "demo-notification-2",
    title: `Watchlist update: ${demoProperties[2].title}`,
    description: "This property is trending and may have limited availability.",
    type: "property",
    date: "Yesterday",
    unread: true,
  },
] as const;
