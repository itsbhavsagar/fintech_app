export type PropertyType = "Office" | "Retail" | "Warehouse" | "Coworking";
export type RiskLevel = "Low" | "Medium" | "High";

export type Property = {
  id: string;
  title: string;
  location: string;
  type: PropertyType;
  totalValue: number;
  minimumInvestment: number;
  availableUnits: number;
  totalUnits: number;
  expectedReturn: string;
  occupancy: number;
  tenants: string[];
  leaseTerm: string;
  images: string[];
  description: string;
  highlights: string[];
  riskLevel: RiskLevel;
  city: "Delhi" | "Noida" | "Gurgaon" | "Bangalore";
  funded: number;
  isFeatured: boolean;
  isNew: boolean;
};

export type PortfolioInvestment = {
  id: string;
  propertyId: string;
  title: string;
  city: string;
  units: number;
  invested: number;
  currentValue: number;
  returnPercent: string;
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  type: "investment" | "returns" | "property" | "kyc" | "price";
  date: string;
  unread: boolean;
};

export type Transaction = {
  id: string;
  type: "Investment" | "Return" | "Withdrawal";
  property: string;
  amount: number;
  date: string;
  status: "Completed" | "Pending";
};

export const properties: Property[] = [
  {
    id: "p1",
    title: "Indus Business Park, Sector 62",
    location: "Sector 62, Noida",
    type: "Office",
    totalValue: 75,
    minimumInvestment: 10000,
    availableUnits: 1200,
    totalUnits: 5000,
    expectedReturn: "11.2%",
    occupancy: 96,
    tenants: ["Verve Tech Labs", "Sapphire Technologies", "Nova Consulting"],
    leaseTerm: "7 years",
    images: [
      "https://picsum.photos/seed/niode1/800/600",
      "https://picsum.photos/seed/niode2/800/600",
      "https://picsum.photos/seed/niode3/800/600",
    ],
    description:
      "Premium office tower in Noida with long-term institutional leases, high footfall, and direct metro connectivity.",
    highlights: [
      "Grade A office campus",
      "Stable rental income",
      "Excellent tenant mix",
    ],
    riskLevel: "Low",
    city: "Noida",
    funded: 82,
    isFeatured: true,
    isNew: false,
  },
  {
    id: "p2",
    title: "Capital Square Mall, Connaught Place",
    location: "Connaught Place, Delhi",
    type: "Retail",
    totalValue: 120,
    minimumInvestment: 10000,
    availableUnits: 400,
    totalUnits: 1800,
    expectedReturn: "10.5%",
    occupancy: 91,
    tenants: ["The Brew House", "Urban Apparel", "Heritage Bistro"],
    leaseTerm: "5 years",
    images: [
      "https://picsum.photos/seed/delhi1/800/600",
      "https://picsum.photos/seed/delhi2/800/600",
      "https://picsum.photos/seed/delhi3/800/600",
    ],
    description:
      "Iconic retail destination in central Delhi offering premium mall frontage and strong evening demand.",
    highlights: [
      "High footfall",
      "Established retail brands",
      "Central business district access",
    ],
    riskLevel: "Medium",
    city: "Delhi",
    funded: 69,
    isFeatured: true,
    isNew: false,
  },
  {
    id: "p3",
    title: "Aero Logistics Park, Hoskote",
    location: "Hoskote, Bangalore",
    type: "Warehouse",
    totalValue: 95,
    minimumInvestment: 10000,
    availableUnits: 800,
    totalUnits: 2200,
    expectedReturn: "12.0%",
    occupancy: 88,
    tenants: ["Skyline Distribution", "Blue Parcel Express", "ECom Fulfillers"],
    leaseTerm: "8 years",
    images: [
      "https://picsum.photos/seed/bangalore1/800/600",
      "https://picsum.photos/seed/bangalore2/800/600",
      "https://picsum.photos/seed/bangalore3/800/600",
    ],
    description:
      "Modern logistics warehouse near Bangalore airport with temperature-controlled sections and 24/7 security.",
    highlights: [
      "Last-mile logistics hub",
      "Long-term leases",
      "High ceiling clearance",
    ],
    riskLevel: "Medium",
    city: "Bangalore",
    funded: 74,
    isFeatured: false,
    isNew: true,
  },
  {
    id: "p4",
    title: "Greenworks CoLab, MG Road",
    location: "MG Road, Gurgaon",
    type: "Coworking",
    totalValue: 36,
    minimumInvestment: 10000,
    availableUnits: 320,
    totalUnits: 1200,
    expectedReturn: "10.8%",
    occupancy: 93,
    tenants: ["Nimbus Startups", "Pulse Creative", "Vertex Advisors"],
    leaseTerm: "4 years",
    images: [
      "https://picsum.photos/seed/gurgaon1/800/600",
      "https://picsum.photos/seed/gurgaon2/800/600",
      "https://picsum.photos/seed/gurgaon3/800/600",
    ],
    description:
      "Flexible coworking campus in Gurgaon with premium amenities, dedicated desks, and corporate memberships.",
    highlights: [
      "Flexible lease terms",
      "High renewal rates",
      "Premium business district location",
    ],
    riskLevel: "Low",
    city: "Gurgaon",
    funded: 88,
    isFeatured: true,
    isNew: false,
  },
  {
    id: "p5",
    title: "Silverline Plaza, Sector 18",
    location: "Sector 18, Noida",
    type: "Office",
    totalValue: 68,
    minimumInvestment: 10000,
    availableUnits: 1050,
    totalUnits: 4200,
    expectedReturn: "11.0%",
    occupancy: 95,
    tenants: ["Axis Financial", "Emerge Analytics", "Trident Ventures"],
    leaseTerm: "6 years",
    images: [
      "https://picsum.photos/seed/noida1/800/600",
      "https://picsum.photos/seed/noida2/800/600",
      "https://picsum.photos/seed/noida3/800/600",
    ],
    description:
      "Grade A office property with large floor plates and direct access to metro, ideal for finance and SaaS tenants.",
    highlights: [
      "Strong cash flow",
      "High occupany",
      "Corporate tenant roster",
    ],
    riskLevel: "Low",
    city: "Noida",
    funded: 78,
    isFeatured: false,
    isNew: false,
  },
  {
    id: "p6",
    title: "Aurora Retail Avenue, Brigade Road",
    location: "Brigade Road, Bangalore",
    type: "Retail",
    totalValue: 88,
    minimumInvestment: 10000,
    availableUnits: 540,
    totalUnits: 1500,
    expectedReturn: "10.9%",
    occupancy: 89,
    tenants: ["Moda Fashion", "Sip & Dine", "Studio 7"],
    leaseTerm: "5 years",
    images: [
      "https://picsum.photos/seed/bangalore4/800/600",
      "https://picsum.photos/seed/bangalore5/800/600",
      "https://picsum.photos/seed/bangalore6/800/600",
    ],
    description:
      "High-street retail asset in Bangalore’s premium shopping district with boutique stores and experiential dining.",
    highlights: [
      "Strong weekend traffic",
      "Curated brand mix",
      "Premium street frontage",
    ],
    riskLevel: "Medium",
    city: "Bangalore",
    funded: 61,
    isFeatured: false,
    isNew: true,
  },
  {
    id: "p7",
    title: "MetroHub Logistics, Gurgaon",
    location: "NH 8, Gurgaon",
    type: "Warehouse",
    totalValue: 80,
    minimumInvestment: 10000,
    availableUnits: 650,
    totalUnits: 2100,
    expectedReturn: "12.3%",
    occupancy: 92,
    tenants: ["Rapid Freight", "Omni Warehousing", "Retail Stack"],
    leaseTerm: "9 years",
    images: [
      "https://picsum.photos/seed/gurgaon2/800/600",
      "https://picsum.photos/seed/gurgaon3/800/600",
      "https://picsum.photos/seed/gurgaon4/800/600",
    ],
    description:
      "Logistics estate on Delhi-Gurgaon corridor with modern loading bays, strong last-mile demand, and institutional leases.",
    highlights: [
      "High yield asset",
      "Premium logistics corridor",
      "Long-duration contracts",
    ],
    riskLevel: "Medium",
    city: "Gurgaon",
    funded: 84,
    isFeatured: false,
    isNew: false,
  },
  {
    id: "p8",
    title: "Pearl Tower, Dhaula Kuan",
    location: "Dhaula Kuan, Delhi",
    type: "Office",
    totalValue: 55,
    minimumInvestment: 10000,
    availableUnits: 420,
    totalUnits: 2000,
    expectedReturn: "9.8%",
    occupancy: 94,
    tenants: ["Quantara Analytics", "Saffron Media", "Lakshmi Advisors"],
    leaseTerm: "5 years",
    images: [
      "https://picsum.photos/seed/delhi4/800/600",
      "https://picsum.photos/seed/delhi5/800/600",
      "https://picsum.photos/seed/delhi6/800/600",
    ],
    description:
      "Established office tower near the airport with efficient floor plans and strong corporate occupier demand.",
    highlights: [
      "Airport access",
      "Stable rent profile",
      "Prime west Delhi location",
    ],
    riskLevel: "Low",
    city: "Delhi",
    funded: 90,
    isFeatured: false,
    isNew: false,
  },
];

export const portfolioInvestments: PortfolioInvestment[] = [
  {
    id: "inv1",
    propertyId: "p1",
    title: "Indus Business Park",
    city: "Noida",
    units: 12,
    invested: 120000,
    currentValue: 132000,
    returnPercent: "10.0%",
  },
  {
    id: "inv2",
    propertyId: "p4",
    title: "Greenworks CoLab",
    city: "Gurgaon",
    units: 8,
    invested: 80000,
    currentValue: 88000,
    returnPercent: "10.0%",
  },
  {
    id: "inv3",
    propertyId: "p5",
    title: "Silverline Plaza",
    city: "Noida",
    units: 10,
    invested: 100000,
    currentValue: 110000,
    returnPercent: "10.0%",
  },
  {
    id: "inv4",
    propertyId: "p2",
    title: "Capital Square Mall",
    city: "Delhi",
    units: 6,
    invested: 60000,
    currentValue: 66000,
    returnPercent: "10.0%",
  },
];

export const notifications: Notification[] = [
  {
    id: "n1",
    title: "KYC approved",
    description:
      "Your KYC verification is complete and your account is now active.",
    type: "kyc",
    date: "2026-03-28",
    unread: false,
  },
  {
    id: "n2",
    title: "New property added",
    description:
      "Aero Logistics Park in Bangalore is now available for investment.",
    type: "property",
    date: "2026-03-29",
    unread: true,
  },
  {
    id: "n3",
    title: "Return credited",
    description: "₹1,200 return credited from Indus Business Park investment.",
    type: "returns",
    date: "2026-03-30",
    unread: true,
  },
  {
    id: "n4",
    title: "Price update",
    description:
      "Silverline Plaza minimum ticket size remains ₹10,000 with fresh unit availability.",
    type: "price",
    date: "2026-03-31",
    unread: false,
  },
  {
    id: "n5",
    title: "Lease milestone",
    description:
      "Greenworks CoLab reached 93% occupancy for the current quarter.",
    type: "investment",
    date: "2026-04-01",
    unread: true,
  },
  {
    id: "n6",
    title: "Investment update",
    description: "Your Capital Square Mall investment is now 69% funded.",
    type: "investment",
    date: "2026-04-02",
    unread: true,
  },
  {
    id: "n7",
    title: "New review",
    description:
      "A investor review has been added for Pearl Tower, Dhaula Kuan.",
    type: "property",
    date: "2026-04-03",
    unread: false,
  },
  {
    id: "n8",
    title: "Bank details verified",
    description: "Your bank account is verified and ready for payouts.",
    type: "kyc",
    date: "2026-04-03",
    unread: false,
  },
];

export const transactions: Transaction[] = [
  {
    id: "t1",
    type: "Investment",
    property: "Indus Business Park",
    amount: 120000,
    date: "2026-03-25",
    status: "Completed",
  },
  {
    id: "t2",
    type: "Return",
    property: "Indus Business Park",
    amount: 1200,
    date: "2026-03-30",
    status: "Completed",
  },
  {
    id: "t3",
    type: "Investment",
    property: "Greenworks CoLab",
    amount: 80000,
    date: "2026-03-26",
    status: "Completed",
  },
  {
    id: "t4",
    type: "Withdrawal",
    property: "Bank Transfer",
    amount: 25000,
    date: "2026-03-27",
    status: "Completed",
  },
  {
    id: "t5",
    type: "Investment",
    property: "Capital Square Mall",
    amount: 60000,
    date: "2026-03-28",
    status: "Completed",
  },
  {
    id: "t6",
    type: "Return",
    property: "Greenworks CoLab",
    amount: 800,
    date: "2026-04-01",
    status: "Completed",
  },
];
