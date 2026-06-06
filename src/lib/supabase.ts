import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  courses: {
    id: string
    name: string
    description: string
    duration: string
    level: string
    created_at: string
  }
  users: {
    id: string
    course_id: string
    name: string
    username: string
    password_hash: string
    role: 'admin' | 'learner'
    created_at: string
  }
  lessons: {
    id: string
    course_id: string
    week_number: number
    title: string
    content_html: string
    type: 'theory' | 'exercise'
    order_index: number
  }
  submissions: {
    id: string
    lesson_id: string
    user_id: string
    note: string
    files: string[]
    score: number | null
    feedback: string | null
    status: 'pending' | 'graded'
    submitted_at: string
  }
  progress: {
    id: string
    user_id: string
    lesson_id: string
    completed: boolean
    completed_at: string
  }
}
