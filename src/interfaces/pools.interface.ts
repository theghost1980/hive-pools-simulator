export interface Pool {
  basePrice: number;
  baseQuantity: number;
  baseVolume: number;
  creator: string;
  precision: number;
  quotePrice: number;
  quoteQuantity: number;
  quoteVolume: number;
  tokenPair: string;
  totalShares: number;
  _id: number;
}
