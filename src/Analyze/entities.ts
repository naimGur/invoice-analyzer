export type MerchantType = {
  merchant: string;
  category: string;
  sub_category: string;
  confidence: number;
  is_subscription: boolean;
  flags: string[];
};

export type PatternType = {
  type: string;
  merchant: string;
  amount: number;
  frequency: string;
  confidence: number;
  next_expected: string;
};
