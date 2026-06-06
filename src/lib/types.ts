export interface Course {
  id: string
  name: string
  description: string
  duration: string
  level: string
  created_at: string
}

export interface User {
  id: string
  course_id: string
  name: string
  username: string
  role: 'admin' | 'learner'
  created_at: string
}

export interface Lesson {
  id: string
  course_id: string
  week_number: number
  title: string
  content_html: string
  type: 'theory' | 'exercise'
  order_index: number
}

export interface Submission {
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

export interface Progress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  completed_at: string
}

export interface WeekCurriculum {
  title: string
  topics: string[]
  exercises: string[]
}

export interface GeneratedCourse {
  courseName: string
  duration: string
  level: string
  totalExercises: number
  weeks: WeekCurriculum[]
}
