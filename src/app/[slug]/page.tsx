import { supabase } from '@/lib/supabase'
import ProductView from '@/components/ProductView'
import { Metadata } from 'next'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  
  const { data: productData } = await supabase
    .from('products')
    .select('*, merchants(*)')
    .eq('id', slug)
    .single()

  const product = productData as any

  if (!product) return { title: 'Product Not Found | Gully' }

  return {
    title: `${product.title} | ₹${product.price} | Gully Commerce`,
    description: product.description || `Buy ${product.title} on Gully Commerce.`,
    openGraph: {
      title: `${product.title} | Gully`,
      description: product.description || `Buy ${product.title} at ₹${product.price}`,
      images: [product.image_url],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      images: [product.image_url],
    }
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const { data: productData } = await supabase
    .from('products')
    .select('*, merchants(*)')
    .eq('id', slug)
    .single()

  const product = productData as any

  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-6 text-center bg-white">
        <h1 className="text-2xl font-black mb-2">Product Not Found</h1>
        <p className="text-zinc-500 mb-6">This link might be broken or the product was removed.</p>
        <footer className="mt-8">
          <Link href="/" className="bg-black text-white px-8 py-4 rounded-xl font-bold">Back</Link>
        </footer>
      </div>
    )
  }

  return <ProductView product={product} slug={slug} />
}
