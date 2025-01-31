import { MerchantType, PatternType } from './entities';

export interface Analyze {
  merchants(transactions: Record<string, string>[]): Promise<MerchantType[]>; // Add transactions parameter
  patterns(transactions: Record<string, string>[]): Promise<PatternType[]>;
}
