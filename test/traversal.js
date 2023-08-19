import { expect, test } from 'vitest';
import { walk } from '../src/walk.js';

test('traverses a tree', () => {
	/** @type {import('./types').TestNode} */
	const tree = {
		type: 'Root',
		children: [{ type: 'A' }, { type: 'B' }, { type: 'C' }]
	};

	const state = {
		/** @type {string[]} */
		visited: [],
		depth: 0
	};

	walk(/** @type {import('./types').TestNode} */ (tree), state, {
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

test('visits all nodes with _', () => {
	/** @type {import('./types').TestNode} */
	const tree = {
		type: 'Root',
		children: [{ type: 'A' }, { type: 'B' }, { type: 'C' }]
	};

	let uid = 1;

	const state = {
		id: uid,
		depth: 0
	};

	/** @type {string[]} */
	const log = [];

	walk(/** @type {import('./types').TestNode} */ (tree), state, {
		_: (node, { state, next }) => {
			log.push(`${state.depth} ${state.id} enter ${node.type}`);
			next({ ...state, id: ++uid });
			log.push(`${state.depth} ${state.id} leave ${node.type}`);
		},
		Root: (node, { state, next }) => {
			log.push(`${state.depth} ${state.id} visit ${node.type}`);
			next({ ...state, depth: state.depth + 1 });
		},
		A: (node, { state }) => {
			log.push(`${state.depth} ${state.id} visit ${node.type}`);
		},
		B: (node, { state }) => {
			log.push(`${state.depth} ${state.id} visit ${node.type}`);
		},
		C: (node, { state }) => {
			log.push(`${state.depth} ${state.id} visit ${node.type}`);
		}
	});

	expect(log).toEqual([
		'0 1 enter Root',
		'0 2 visit Root',
		'1 2 enter A',
		'1 3 visit A',
		'1 2 leave A',
		'1 2 enter B',
		'1 4 visit B',
		'1 2 leave B',
		'1 2 enter C',
		'1 5 visit C',
		'1 2 leave C',
		'0 1 leave Root'
	]);
});
