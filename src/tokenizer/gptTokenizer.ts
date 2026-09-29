import { encode as encodeCl100k, decode as decodeCl100k } from 'gpt-tokenizer';
import { encode as encodeO200k, decode as decodeO200k } from 'gpt-tokenizer/model/gpt-4o';
import { encode as encodeR50k, decode as decodeR50k } from 'gpt-tokenizer/encoding/r50k_base';

export type GptTokenizerType = 'o200k_base' | 'cl100k_base' | 'r50k_base';

export interface GptTokenResult {
  id: number;
  text: string;
}

export function tokenizeWithGpt(text: string, type: GptTokenizerType = 'o200k_base'): GptTokenResult[] {
  if (!text) return [];

  let tokenIds: number[] = [];
  let decodeFn: (ids: number[]) => string;

  switch (type) {
    case 'o200k_base':
      tokenIds = encodeO200k(text);
      decodeFn = decodeO200k;
      break;
    case 'r50k_base':
      tokenIds = encodeR50k(text);
      decodeFn = decodeR50k;
      break;
    case 'cl100k_base':
    default:
      tokenIds = encodeCl100k(text);
      decodeFn = decodeCl100k;
      break;
  }

  return tokenIds.map((id) => ({
    id,
    text: decodeFn([id]),
  }));
}
