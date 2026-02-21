/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Parses simple markdown (bold, italic, lists) into pdfmake content definition.
 * Supported syntax:
 * - Bold: **text** or __text__
 * - Italic: *text* or _text_
 * - Unordered list: - item or * item
 * - Ordered list: 1. item
 * - Paragraphs: separated by newlines
 */
export function parseMarkdown(text: string): any[] {
	if (!text) return [];

	// Split by newlines to handle blocks
	const lines = text.split(/\r?\n/);
	const content: any[] = [];

	let currentListType: 'ul' | 'ol' | null = null;
	let currentList: any[] = [];

	// Helper to close the current list block
	const closeList = () => {
		if (currentListType && currentList.length > 0) {
			content.push({
				[currentListType]: currentList,
				margin: [0, 0, 0, 5] // Bottom margin for the list
			});
			currentList = [];
			currentListType = null;
		}
	};

	lines.forEach((line) => {
		// Regex to identify list items: starts with space, then marker, then space
		const listMatch = line.match(/^\s*(-|\*|\d+\.)\s+(.*)/);

		if (listMatch) {
			const marker = listMatch[1];
			const itemText = listMatch[2];
			const listType = /^\d+\./.test(marker) ? 'ol' : 'ul';

			// If list type changes (e.g. ul -> ol), close the previous list
			if (currentListType && currentListType !== listType) {
				closeList();
			}

			currentListType = listType;
			// Parse inline styles for the list item content
			currentList.push({ text: parseInline(itemText) });
		} else {
			// Not a list item, close any open list
			closeList();

			const trimmed = line.trim();
			if (trimmed) {
				// Treat non-empty lines as paragraphs
				content.push({
					text: parseInline(line),
					margin: [0, 0, 0, 2] // Small margin between lines/paragraphs
				});
			}
		}
	});

	// Ensure any remaining list is closed
	closeList();

	return content;
}

/**
 * Parse inline styles (bold, italic)
 */
function parseInline(text: string): any[] {
	const parts: any[] = [];

	let i = 0;
	while (i < text.length) {
		// Check for Bold (** or __)
		if (text.startsWith('**', i) || text.startsWith('__', i)) {
			const marker = text.substring(i, i + 2);
			const end = text.indexOf(marker, i + 2);

			if (end !== -1) {
				// Found bold block
				parts.push({
					text: parseInline(text.substring(i + 2, end)), // Recursively parse inner content
					bold: true
				});
				i = end + 2;
				continue;
			}
		}

		// Check for Italic (* or _)
		// Note: We check this after bold to avoid matching the first * of **
		if (text.startsWith('*', i) || text.startsWith('_', i)) {
			const marker = text.substring(i, i + 1);
			const end = text.indexOf(marker, i + 1);

			if (end !== -1) {
				// Found italic block
				parts.push({
					text: parseInline(text.substring(i + 1, end)),
					italics: true
				});
				i = end + 1;
				continue;
			}
		}

		// Plain text: read until next marker or end
		let nextMarkerIndex = text.length;

		// Find next potential start of style
		const nextBold = Math.min(
			text.indexOf('**', i) === -1 ? Infinity : text.indexOf('**', i),
			text.indexOf('__', i) === -1 ? Infinity : text.indexOf('__', i)
		);
		const nextItalic = Math.min(
			text.indexOf('*', i) === -1 ? Infinity : text.indexOf('*', i),
			text.indexOf('_', i) === -1 ? Infinity : text.indexOf('_', i)
		);

		nextMarkerIndex = Math.min(nextBold, nextItalic);

		if (nextMarkerIndex === Infinity) {
			// No more markers
			parts.push(text.substring(i));
			break;
		} else {
			// Push text up to the marker
			parts.push(text.substring(i, nextMarkerIndex));
			i = nextMarkerIndex;
		}
	}

	return parts;
}
