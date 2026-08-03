import { i18n } from "astro:config/client";

// Import translation files for different locales
import zhCN from "./language/zh-cn.ts";
import en from "./language/en.ts";
import type { Translation } from './key';

// Translation object mapping locale codes to their respective translation data
const translations: Record<string, Translation> = { "zh-cn": zhCN, en };

/**
 * Create an internationalization function for a specific language
 * @param language - The target language/locale code (e.g., "en", "zh-cn")
 * @returns Translation function that can translate keys with parameter substitution
 */
function i18nit(language: string): (key: string, params?: Record<string, string | number>) => string {
	/**
	 * Navigate through nested translation object using dot notation
	 * @param language - Language code to look up translations in
	 * @param key - Dot-separated key path (e.g., "notification.reply.title")
	 * @returns Translation value or undefined if not found
	 */
	const nested = (locale: string, key: string): string | undefined => {
		let value: unknown = translations[locale];
		for (const segment of key.split('.')) {
			if (!value || typeof value !== 'object' || !(segment in value)) return undefined;
			value = (value as Record<string, unknown>)[segment];
		}
		return typeof value === 'string' ? value : undefined;
	};

	/**
	 * Get translation with fallback to default locale
	 * @param key - Translation key to look up
	 * @returns Translation value from target language or default locale, undefined if not found
	 */
	const fallback = (key: string) => nested(language, key) ?? nested(i18n!.defaultLocale, key);

	/**
	 * Main translation function with parameter interpolation
	 * @param key - Translation key to look up
	 * @param params - Optional parameters for string interpolation (replaces {paramName} placeholders)
	 * @returns Translated and interpolated string, or the original key if translation not found
	 */
	const t = (key: string, params?: Record<string, string | number>) => (fallback(key) as string)?.replace(/\{(\w+)\}/g, (_, param) => String(params?.[param] ?? param)) ?? key;

	return t;
}

export default i18nit;
