/**
 * Build URL from template and input value
 * Example: buildUrl("https://amazon.com/orders/{input}", "123")
 *          => "https://amazon.com/orders/123"
 */
export function buildUrl(template: string, inputValue: string): string {
  return template.replace(/{input}/g, encodeURIComponent(inputValue.trim()));
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Open URL in new tab
 */
export function openUrl(url: string): void {
  if (!isValidUrl(url)) {
    console.error('Invalid URL:', url);
    return;
  }
  chrome.tabs.create({ url });
}
