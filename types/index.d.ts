declare module 'zimmerframe' {
	/**
	 * @template T extends {type: string}
	 * @template U extends Record<string, any>
	 * */
	export function walk<T, U>(node: T, state: U, visitors: Visitors<T, T["type"]>): void;
	type NodeOf<Type extends string, X> = X extends { type: Type } ? X : never;

	type MappedVisitors<
		Node extends {type: string},
		Key extends Node['type']
	> = {
		[K in Key]?: (node: NodeOf<K, Node>) => void
	}

	type Visitors<
		Node extends {type: string},
		Key extends Node['type'] = Node['type']
	> = Key extends '_' ? never : MappedVisitors<Node, Key> & {_?: (node: Node) => void}
}

//# sourceMappingURL=index.d.ts.map