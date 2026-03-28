import { supabase } from './supabase';

export interface Product {
  id: string;
  store_id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  slug: string;
  store_name?: string;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      stores (
        name
      )
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    store_name: data.stores?.name
  };
}

export async function getProductsByStore(storeId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', storeId)
    .eq('is_active', true);

  if (error) return [];
  return data || [];
}
