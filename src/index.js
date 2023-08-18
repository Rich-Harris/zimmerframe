/**
 * @template {{type: string}} T
 * @template {Record<string, any>} U
 * @param {T} node
 * @param {U} state
 * @param {import('./types').Visitors<T, U>} visitors
 */
export function walk(node, state, visitors) {
	const universal = visitors._;

	let stopped = false;

	/** @type {import('./types').Visitor<T, U>} _ */
	function default_visitor(_, { next, state }) {
		next(state);
	}

	/**
	 * @param {T} node
	 * @param {T[]} path
	 * @param {U} state
	 * @returns {T | undefined}
	 */
	function visit(node, path, state) {
		if (stopped) return node;
		if (!node.type) return node;

		let visited_next = false;
		let skipped = false;

		/** @type {Record<string, any>} */
		const mutations = {};

		/** @type {import('./types').Context<T, U>} */
		const context = {
			path,
			state,
			next: (state) => {
				if (visited_next) {
					throw new Error(`Can only call next() once per node`);
				}

				visited_next = true;

				path.push(node);
				for (const key in node) {
					if (key === 'type') continue;

					const child_node = node[key];
					if (child_node && typeof child_node === 'object') {
						if (Array.isArray(child_node)) {
							/** @type {Record<number, T>} */
							const array_mutations = {};

							child_node.forEach((node, i) => {
								if (node && typeof node === 'object') {
									const result = visit(node, path, state);
									if (result) array_mutations[i] = result;
								}
							});

							if (Object.keys(array_mutations).length > 0) {
								mutations[key] = child_node.map(
									(node, i) => array_mutations[i] ?? node
								);
								skipped = true;
							}
						} else {
							const result = visit(/** @type {T} */ (child_node), path, state);

							// @ts-ignore
							if (result) {
								mutations[key] = result;
								skipped = true;
							}
						}
					}
				}
				path.pop();
			},
			skip: () => {
				skipped = true;
			},
			stop: () => {
				stopped = skipped = true;
			},
			transform: (node, new_state = state) => {
				return visit(node, path, new_state) ?? node;
			}
		};

		let visitor = visitors[node.type] ?? default_visitor;

		/** @type {T | void} */
		let result;

		if (universal) {
			let visited_next = false;

			result = universal(node, {
				...context,
				next: (state) => {
					visited_next = true;

					// @ts-expect-error
					visitor(node, {
						...context,
						state
					});
				}
			});

			if (!visited_next && !result) {
				// @ts-expect-error
				result = visitor(node, context);
			}
		} else {
			// @ts-expect-error
			result = visitor(node, context);
		}

		if (!visited_next && !skipped) {
			context.next(state);
		}

		if (!result && Object.keys(mutations).length > 0) {
			result = { ...node, ...mutations };
		}

		if (result) {
			return result;
		}
	}

	return visit(node, [], state) ?? node;
}
