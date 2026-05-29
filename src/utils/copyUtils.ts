import type { ApiEntry } from '../types';

export function copyApiInfo(api: ApiEntry): string {
  return [
    `API Name: ${api.name}`,
    `Category: ${api.category}`,
    `Description: ${api.description}`,
    `Auth: ${api.auth}`,
    `HTTPS: ${api.https}`,
    `CORS: ${api.cors}`,
    `URL: ${api.link}`,
    `Use Case: ${api.useCase}`,
  ].join('\n');
}

export function copyAsPrompt(api: ApiEntry): string {
  return [
    `Use ${api.name} to build a feature that ${api.useCase}.`,
    `API URL: ${api.link}`,
    `Auth: ${api.auth}`,
    `HTTPS: ${api.https}`,
    `CORS: ${api.cors}`,
  ].join('\n');
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
