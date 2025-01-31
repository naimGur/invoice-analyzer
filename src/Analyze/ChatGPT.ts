import { Injectable } from '@nestjs/common';
import { Analyze } from './index';
import { MerchantType, PatternType } from './entities';
import OpenAI from 'openai';

interface RawMerchantResponse {
  merchants: {
    merchant: string;
    category: string;
    sub_category: string;
    confidence: number;
    is_subscription: boolean;
    flags: string[];
  }[];
}

interface RawPatternResponse {
  patterns: {
    type: string;
    merchant: string;
    amount: number;
    frequency: string;
    confidence: number;
    next_expected: string;
  }[];
}

@Injectable()
export class ChatGPTAnalyzer implements Analyze {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  private formatTransactions(transactions: Record<string, string>[]): string {
    return transactions
      .map((t) => `- ${t.date} | ${t.description} | $${t.amount}`)
      .join('\n');
  }

  async merchants(
    transactions: Record<string, string>[],
  ): Promise<MerchantType[]> {
    try {
      const prompt = `Analyze these transactions and categorize merchants:\n${this.formatTransactions(transactions)}\n
      Respond with JSON containing: 
      - merchant (original name from transaction. I want you to normalize it to known companies instead of shortcuts or legal names)
      - category (e.g., Entertainment, Retail)
      - sub_category (e.g., Streaming Services, Online Shopping)
      - confidence (0-1 probability)
      - is_subscription (boolean, this is true if the bill looks like a subscription. It shall be periodic or common subscription priced)
      - flags (array of strings, seo terms, related sectors of the company. 2 sectors)`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are a financial analyst. Return valid JSON with { merchants: [...] }',
          },
          {
            role: 'user', // Added user message with actual prompt
            content: prompt,
          },
        ],
      });

      return this.parseMerchantResponse(
        completion.choices[0].message.content as string,
      );
    } catch (error) {
      console.error('Merchant analysis error:', error);
      throw new Error('AI merchant analysis failed');
    }
  }

  async patterns(
    transactions: Record<string, string>[],
  ): Promise<PatternType[]> {
    try {
      const prompt = `Identify spending patterns:\n${this.formatTransactions(transactions)}\n
      Respond with JSON containing:
      - type (e.g., Subscription, Utility, Dining)
      - merchant (original name from transaction. I want you to normalize it to known companies instead of shortcuts or legal names)
      - amount (typical amount)
      - frequency (e.g., Weekly, Monthly)
      - confidence (0-1 probability)
      - next_expected (YYYY-MM-DD or empty)`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are a pattern detection system. Return valid JSON with { patterns: [...] }',
          },
          {
            role: 'user', // Added user message with actual prompt
            content: prompt,
          },
        ],
      });

      return this.parsePatternResponse(
        completion.choices[0].message.content as string,
      );
    } catch (error) {
      console.error('Pattern analysis error:', error);
      throw new Error('AI pattern analysis failed');
    }
  }

  private parseMerchantResponse(response: string): MerchantType[] {
    try {
      const parsed = JSON.parse(response) as RawMerchantResponse;

      if (!parsed.merchants?.length) {
        throw new Error('Invalid merchant response format');
      }

      return parsed.merchants.map((m) => ({
        merchant: m.merchant,
        category: m.category || 'Uncategorized',
        sub_category: m.sub_category || 'General',
        confidence: Math.min(Math.max(m.confidence, 0), 1),
        is_subscription: Boolean(m.is_subscription),
        flags: Array.isArray(m.flags) ? m.flags : [],
      }));
    } catch (error) {
      console.error('Failed to parse merchant response:', error);
      throw new Error('Invalid AI merchant response');
    }
  }

  private parsePatternResponse(response: string): PatternType[] {
    try {
      const parsed = JSON.parse(response) as RawPatternResponse;

      if (!parsed.patterns?.length) {
        throw new Error('Invalid pattern response format');
      }

      return parsed.patterns.map((p) => ({
        type: p.type || 'Unknown',
        merchant: p.merchant,
        amount: Number(p.amount) || 0,
        frequency: p.frequency || 'Irregular',
        confidence: Math.min(Math.max(p.confidence, 0), 1),
        next_expected: p.next_expected || '',
      }));
    } catch (error) {
      console.error('Failed to parse pattern response:', error);
      throw new Error('Invalid AI pattern response');
    }
  }
}
