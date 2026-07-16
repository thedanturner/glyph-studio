import type { Collections, IconData, SearchResult } from './types';
export const API = 'https://api.iconify.design';
async function get<T>(path:string, signal?:AbortSignal):Promise<T>{ const r=await fetch(`${API}${path}`,{signal}); if(!r.ok) throw new Error(`Iconify API returned ${r.status}`); return r.json(); }
export const getCollections=(signal?:AbortSignal)=>get<Collections>('/collections',signal);
export const searchIcons=(query:string,prefix:string,limit=96,start=0,signal?:AbortSignal)=>get<SearchResult>(`/search?query=${encodeURIComponent(query)}&limit=${limit}&start=${start}${prefix?`&prefix=${encodeURIComponent(prefix)}`:''}`,signal);
export const getCollection=(prefix:string,signal?:AbortSignal)=>get<{uncategorized?:string[];categories?:Record<string,string[]>;aliases?:Record<string,string>;hidden?:string[]}>(`/collection?prefix=${encodeURIComponent(prefix)}&info=true&chars=true`,signal);
export const getIconData=async(prefix:string,name:string,signal?:AbortSignal):Promise<IconData>=>{const data=await get<{icons:Record<string,IconData>;width?:number;height?:number}>(`/${prefix}.json?icons=${encodeURIComponent(name)}`,signal); if(!data.icons?.[name]) throw new Error('Icon not found'); return {width:data.width||16,height:data.height||16,...data.icons[name]}};
