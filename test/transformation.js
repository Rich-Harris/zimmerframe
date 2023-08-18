import { expect, test } from 'vitest';
import { walk } from '../src/index.js';

test('transforms a tree', () => {
	/** @type {import('./types').Node<'Root' | 'A' | 'B' | 'C'>} */
	const tree = {
		type: 'Root',
		children: [{ type: 'A' }, { type: 'B' }, { type: 'C' }]
	};

	const state = {};

	const transformed = walk(tree, state, {
		Root: (node, { transform }) => {
			return {
				type: 'TransformedRoot',
				elements: node.children.map((child) => transform(child))
			};
		},
		A: (node) => {
			return {
				type: 'TransformedA'
			};
		},
		C: (node) => {
			return {
				type: 'TransformedC'
			};
		}
	});

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
