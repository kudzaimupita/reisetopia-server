const fallbackOrder = ['en-US', 'de-DE', 'fr-FR', 'es-ES'];

export const getFallbackLanguage = (availableLanguages: string[], requestedLang: string): string => {
    const index = fallbackOrder.indexOf(requestedLang);
    if (index !== -1) return requestedLang;
    return fallbackOrder.find(lang => availableLanguages.includes(lang)) || 'en-US';
  };