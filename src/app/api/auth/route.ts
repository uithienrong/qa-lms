import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createHash } from 'crypto'

function hashPassword(password: string) {
  return createHash('sha256').update(password).digest('hex')
}

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password_hash', hashPassword(password))
    .single()

  if (error || !user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  return NextResponse.json({ user })
}
