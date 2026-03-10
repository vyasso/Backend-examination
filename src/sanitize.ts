import sanitizeHtml from "sanitize-html";

export function sanitizeText(input: string) {
    return sanitizeHtml(input.trim(), {
        allowedTags: [],
        allowedAttributes: {},
    });
}