export function extractJSON(str) {
  if (!str) return null;

  // Remove ```json or ``` if they exist
  const clean = str.replace(/```json|```/gi, '').trim();

  const firstBracket = clean.indexOf('[');
  const lastBracket = clean.lastIndexOf(']');

  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    return clean.slice(firstBracket, lastBracket + 1);
  }

  return null; // Couldn’t find a valid JSON array
}