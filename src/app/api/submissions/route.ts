import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lessonId = searchParams.get('lesson_id')
  const userId = searchParams.get('user_id')

  let query = supabase.from('submissions').select('*, users(name), lessons(title)')
  if (lessonId) query = query.eq('lesson_id', lessonId)
  if (userId) query = query.eq('user_id', userId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = await supabase
    .from('submissions')
    .insert({ ...body, status: 'pending', submitted_at: new Date().toISOString() })
    .select()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const { id, score, feedback } = await req.json()
  const { data, error } = await supabase
    .from('submissions')
    .update({ score, feedback, status: 'graded' })
    .eq('id', id)
    .select()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
