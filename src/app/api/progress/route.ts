import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user_id')

  const { data, error } = await supabase
    .from('progress')
    .select('*, lessons(*)')
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { user_id, lesson_id } = await req.json()

  const { data, error } = await supabase
    .from('progress')
    .upsert({ user_id, lesson_id, completed: true, completed_at: new Date().toISOString() })
    .select()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
