export type CollectionInfo = { name: string; total: number; version?: string; author?: {name:string;url?:string}; license?: {title:string;spdx?:string;url?:string}; samples?: string[]; height?: number; displayHeight?: number; category?: string; palette?: boolean };
export type Collections = Record<string, CollectionInfo>;
export type SearchResult = { icons: string[]; total: number; limit: number; start: number; collections?: Collections };
export type IconData = { body: string; width?: number; height?: number; left?: number; top?: number; rotate?: number; hFlip?: boolean; vFlip?: boolean };
export type IconRef = { prefix: string; name: string };
