export interface BlogspotCleanResult {
  text: string;
  removedLinks: string[];
}

/**
 * Détecte et retire les liens Blogspot du contenu final.
 * Les anciens articles Blogspot ne doivent jamais survivre à l'import.
 */
export class BlogspotLinkCleaner {
  /**
   * URL Blogspot (http/https, sous-domaines, .com / .fr / etc.).
   */
  private readonly urlPattern =
    /https?:\/\/(?:www\.)?(?:[\w-]+\.)*blogspot\.[a-z.]+[^\s)\]>"']*/gi;

  /**
   * Markdown : [label](https://….blogspot…/)
   */
  private readonly markdownPattern =
    /\[[^\]]*\]\(\s*https?:\/\/(?:www\.)?(?:[\w-]+\.)*blogspot\.[a-z.]+[^)]*\)/gi;

  clean(text: string): BlogspotCleanResult {
    const removedLinks: string[] = [];

    let result = text.replace(this.markdownPattern, (full) => {
      const urlMatch = full.match(/https?:\/\/[^)\s]+/i);
      if (urlMatch?.[0]) removedLinks.push(urlMatch[0]);
      return "";
    });

    result = result.replace(this.urlPattern, (url) => {
      removedLinks.push(url);
      return "";
    });

    // Nettoyage espaces laissés par les suppressions
    result = result
      .replace(/[^\S\n]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/ +\n/g, "\n")
      .trim();

    return {
      text: result,
      removedLinks: [...new Set(removedLinks)],
    };
  }
}
