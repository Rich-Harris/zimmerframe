type BaseNode = { type: string };

type NodeOf<Type extends string, X> = X extends { type: Type } ? X : never;

type MappedVisitors<T extends BaseNode, U, Key extends T['type']> = {
	[K in Key]?: Visitor<NodeOf<K, T>, U>;
};

export interface Visitor<T extends BaseNode, U> {
	(node: T, context: Context<T, U>): T | void;
}

export type Visitors<
	T extends BaseNode,
	U,
	Key extends T['type'] = T['type']
> = Key extends '_'
	? never
	: MappedVisitors<T, U, Key> & {
			_?: Visitor<T, U>;
	  };

// export type Visitors<
// 	T extends BaseNode,
// 	U,
// 	Key extends T['type'] = T['type']
// > = MappedVisitors<T, U, Key>;

export interface Context<T, U> {
	path: T[];
	state: U;
	next: (state: U) => void;
	skip: () => void;
	stop: () => void;
	transform: (node: T, state?: U) => T;
}
