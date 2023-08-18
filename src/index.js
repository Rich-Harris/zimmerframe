/**
 * @template {{type: string}} T
 * @template {Record<string, any>} U
 * @param {T} node
 * @param {U} state
 * @param {import('./types').Visitors<T, U>} visitors
 */
export function walk(node, state, visitors) {
	let stopped = false;

	/**
	 * @param {T} _
	 * @param {import('./types.js').Context<T, U>} context
	 */
	function default_visitor(_, context) {
		context.next(context.state);
	}

	/**
	 * @param {T} node
	 * @param {T[]} path
	 * @param {U} state
	 */
	function visit(node, path, state) {
		if (stopped) return;
		if (!node.type) return;

		let visited_next = false;
		let skipped = false;

		/** @type {import('./types').Context<T, U>} */
		const context = {
			path,
			state,
			next: (state) => {
				visited_next = true;

				path.push(node);
				for (const key in node) {
					if (key === 'type') continue;

					const child = node[key];
					if (child && typeof child === 'object') {
						if (Array.isArray(child)) {
							child.forEach((node) => {
								if (node && typeof node === 'object') {
									visit(node, path, state);
								}
							});
						} else {
							visit(/** @type {T} */ (child), path, state);
						}
					}
				}
				path.pop();
			},
			skip: () => {
				skipped = true;
			},
			stop: () => {
				stopped = true;
			}
		};

		const visitor = visitors[node.type] ?? default_visitor;

		// @ts-ignore
		visitor(node, context);

		if (!visited_next && !skipped) {
			context.next(state);
		}
	}

	return visit(node, [], state);
}
