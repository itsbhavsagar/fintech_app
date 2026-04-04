export type Property = {
  id: string;
  title: string;
  slug: string;
  location: string;
  city: string;
  state: string;
  type: string;
  assetClass: string;
  minimumInvestment: number;
  totalValue: number;
  totalUnits: number;
  fundedUnits: number;
  availableUnits: number;
  funded: number;
  expectedReturn: string;
  occupancy: number;
  leaseTerm: string;
  highlights: string[];
  riskLevel: "Low" | "Medium" | "High";
  description?: string;
  summary?: string;
  images: string[];
  tenants: string[];
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

export type Transaction = {
  id: string;
  type: "Investment" | "Return" | "Withdrawal";
  property: string;
  amount: number;
  date: string;
  status: "Completed" | "Pending";
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  type: "investment" | "returns" | "property" | "kyc" | "price";
  date: string;
  unread: boolean;
};
