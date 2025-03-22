export interface LiquidityPosition {
  _id: number;
  account: string;
  tokenPair: string;
  shares: number;
  timeFactor: number;
}
