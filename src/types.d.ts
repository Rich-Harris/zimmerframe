interface BaseNode {
	type: string;
}

type NodeOf<T extends string, X> = X extends { type: T } ? X : never;

export type Visitor<T, U, V> = (node: T, context: Context<T, U>) => V | void;

export type SpecialisedVisitors<T extends BaseNode, U> = {
	[K in T['type']]?: Visitor<NodeOf<K, T>, U, T>;
};

export type Visitors<T extends BaseNode, U> = T['type'] extends '_'
	? never
	: SpecialisedVisitors<T, U> & { _?: Visitor<T, U, T> };

export interface Context<T, U, V> {
	path: T[];
	state: U;
	next: (state: U) => void;
	skip: () => void;
	stop: () => void;
	transform: (node: T, state?: U) => V;
}
