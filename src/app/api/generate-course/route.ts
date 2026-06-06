import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  const { description, duration, level, courseName } = await req.json()
  const numWeeks = duration.includes('tuần') ? parseInt(duration) : parseInt(duration) * 4

  const prompt = `You are a QA training curriculum designer. Create a detailed course curriculum.
Course description: ${description}
Duration: ${duration} (${numWeeks} weeks)
Level: ${level}
Course name: ${courseName}
Return ONLY valid JSON, no markdown, no backticks:
{"courseName":"string","duration":"string","level":"string","totalExercises":0,"weeks":[{"title":"Week N: Topic","topics":["t1","t2","t3","t4"],"exercises":["e1","e2"],"theory_html":"<p>...</p>"}]}`

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const result = await model.generateContent(prompt)
  const text = result.response.text()
  const clean = text.replace(/```json|```/g, '').trim()
  return NextResponse.json(JSON.parse(clean))
}