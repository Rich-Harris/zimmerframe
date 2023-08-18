import { expect, test } from 'vitest';
import { walk } from '../src/index.js';

test('traverses a tree', () => {
	/** @type {import('./types').Node<'Root' | 'A' | 'B' | 'C'>} */
	const tree = {
		type: 'Root',
		children: [{ type: 'A' }, { type: 'B' }, { type: 'C' }]
	};

	const state = {
		/** @type {string[]} */
		visited: [],
		depth: 0
	};

	walk(tree, state, {
		Root: (node, { state, next }) => {
			expect(node.type).toBe('Root');
			state.visited.push(state.depth + 'root');

			next({ ...state, depth: state.depth + 1 });
		},
		A: (node, { state }) => {
			expect(node.type).toBe('A');
			state.visited.push(state.depth + 'a');
		},
		B: (node, { state }) => {
			expect(node.type).toBe('B');
			state.visited.push(state.depth + 'b');
		},
		C: (node, { state }) => {
			expect(node.type).toBe('C');
			state.visited.push(state.depth + 'c');
		}
	});

	expect(state.visited).toEqual(['0root', '1a', '1b', '1c']);
});
