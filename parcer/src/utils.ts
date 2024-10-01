export function extractTopWords(text: string, count: number): string[] {
    const words = text.match(/\b[\w\u0400-\u04FF'-]+\b/g) || [];
    const uniqueWords = [...new Set(words)].sort((a, b) => b.length - a.length);
    return uniqueWords.slice(0, count);
}
