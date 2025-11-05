import { getHighlightParts } from '../../utils/searchUtils';

interface HighlightedTextProps {
  text: string;
  query: string;
}

export function HighlightedText({ text, query }: HighlightedTextProps) {
  if (!query.trim()) {
    return <>{text}</>;
  }

  const parts = getHighlightParts(text, query);

  return (
    <>
      {parts.map((part, index) =>
        part.isMatch ? (
          <mark key={index} className="search-highlight">
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </>
  );
}
