export enum PackId {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

export type CreditsPack = {
  id: PackId;
  name: string;
  label: string;
  credits: number;
  price: number;
  priceId?: string;
};

export const CreditsPacks: CreditsPack[] = [
  {
    id: PackId.SMALL,
    name: "Small Pack",
    label: "1,000 Credits",
    credits: 1000,
    price: 999, // $9.99
    priceId: process.env.STRIPE_PRICE_ID_SMALL,
  },
  {
    id: PackId.MEDIUM,
    name: "Medium Pack",
    label: "5,000 Credits",
    credits: 5000,
    price: 3999, // $39.99
    priceId: process.env.STRIPE_PRICE_ID_MEDIUM,
  },
  {
    id: PackId.LARGE,
    name: "Large Pack",
    label: "10,000 Credits",
    credits: 10000,
    price: 6999, // $69.99
    priceId: process.env.STRIPE_PRICE_ID_LARGE,
  },
];

export const getCreditsPack = (id: PackId) =>
  CreditsPacks.find((p) => p.id === id);
