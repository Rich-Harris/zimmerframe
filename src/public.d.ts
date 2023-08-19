import { BaseNode, NodeOf } from './private';

export type Visitor<T, U, V> = (node: T, context: Context<T, U, V>) => V | void;

type SpecialisedVisitors<T extends BaseNode, U> = {
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

export * from './index.js';
