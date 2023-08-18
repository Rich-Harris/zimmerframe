import { expect, test } from 'vitest';
import { walk } from '../src/index.js';

test('traverses a tree', () => {
	/**
	 * @typedef {{ type: 'Root' | 'A' | 'B' | 'Potato'; [key: string]: any }} Node
	 */

	/** @type {Node} */
	const tree = {
		type: 'Root',
		children: [{ type: 'A' }, { type: 'B' }, { type: 'C' }]
	};

	const state = {
		/** @type {string[]} */
		visited: []
	};

	walk(tree, state, {
		Root: (node, { state }) => {
			expect(node.type).toBe('Root');
			state.visited.push('root');
		},
		A: (node, { state }) => {
			expect(node.type).toBe('A');
			state.visited.push('a');
		},
		B: (node, { state }) => {
			expect(node.type).toBe('B');
			state.visited.push('b');
		},
		C: (node, { state }) => {
			expect(node.type).toBe('C');
			state.visited.push('c');
		}
	});

	expect(state.visited).toEqual(['root', 'a', 'b', 'c']);
});
