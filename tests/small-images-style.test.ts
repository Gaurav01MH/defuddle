import { describe, expect, test } from 'vitest';
import { findSmallImages } from '../src/removals/small-images';
import { parseDocument } from './helpers';

describe('findSmallImages inline style dimensions', () => {
	test('does not treat SVG stroke-width as its width', () => {
		const doc = parseDocument(
			'<svg viewBox="0 0 400 200" style="stroke-width:1px"><circle cx="50" cy="50" r="20"></circle></svg>',
			'https://example.com'
		);

		expect(findSmallImages(doc, false).has('viewBox:0 0 400 200')).toBe(false);
	});

	test('does not treat border-width as an image width', () => {
		const doc = parseDocument(
			'<img src="https://example.com/photo.jpg" style="border-width:1px; width:600px; height:400px">',
			'https://example.com'
		);

		expect(findSmallImages(doc, false).has('src:https://example.com/photo.jpg')).toBe(false);
	});

	test('does not treat line-height as an image height', () => {
		const doc = parseDocument(
			'<img src="https://example.com/photo.jpg" style="width:600px; line-height:1px; height:400px">',
			'https://example.com'
		);

		expect(findSmallImages(doc, false).has('src:https://example.com/photo.jpg')).toBe(false);
	});

	test('still identifies genuinely small inline dimensions', () => {
		const doc = parseDocument(
			'<img src="https://example.com/icon.png" style="width:16px; height:16px">',
			'https://example.com'
		);

		expect(findSmallImages(doc, false).has('src:https://example.com/icon.png')).toBe(true);
	});
});
