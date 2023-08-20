import { expect, test } from 'vitest';
import { walk } from '../src/walk.js';

test('transforms a tree', () => {
	/** @type {import('./types').TestNode} */
	const tree = {
		type: 'Root',
		children: [{ type: 'A' }, { type: 'B' }, { type: 'C' }]
	};

	let count = 0;

	const transformed = /** @type {import('./types').TransformedRoot} */ (
		walk(/** @type {import('./types').TestNode} */ (tree), null, {
			Root: (node, { transform }) => {
				return {
					type: 'TransformedRoot',
					elements: node.children.map((child) => transform(child))
				};
			},
			A: (node) => {
				count += 1;
				return {
					type: 'TransformedA'
				};
			},
			C: (node) => {
				count += 1;
				return {
					type: 'TransformedC'
				};
			}
		})
	);

	expect(count).toBe(2);

	// check that `tree` wasn't mutated
	expect(tree).toEqual({
		type: 'Root',
		children: [{ type: 'A' }, { type: 'B' }, { type: 'C' }]
	});

	expect(transformed).toEqual({
		type: 'TransformedRoot',
		elements: [
			{ type: 'TransformedA' },
			{ type: 'B' },
			{ type: 'TransformedC' }
		]
	});

	// expect the `B` node to have been preserved
	expect(transformed.elements[1]).toBe(tree.children[1]);
});
