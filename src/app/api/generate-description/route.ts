import { NextResponse } from 'next/server'

// In a real app, you'd use @anthropic-ai/sdk here
// const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  try {
    const { title, category } = await req.json()

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Rate limiting logic would go here
    // ...

    // Mocking Claude-Haiku response
    // Logic: Write a 2-line Hinglish product description. Friendly tone.
    
    let description = ''
    if (title.toLowerCase().includes('mango')) {
      description = 'Ekdum asli aam ka swad! Ghar pe banaya gaya aur koi preservatives nahi. Try karke dekho, maza aa jayega!'
    } else if (title.toLowerCase().includes('honey')) {
      description = 'Pure and natural honey directly from the farm. Bilkul shudh aur healthy. Bachon ke liye best!'
    } else {
      description = `Fresh and high quality ${title}. Hamara sabse best seller hai. Ek baar zaroor try karein!`
    }

    return NextResponse.json({ description })
  } catch (error) {
    console.error('AI Generation Error:', error)
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 })
  }
}
