import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  const { note, fileNames, lessonTitle } = await req.json()

  const prompt = `A QA student submitted exercise: "${lessonTitle}".
Note: "${note || 'none'}"
Files: ${fileNames?.join(', ') || 'none'}
Give brief encouraging feedback in Vietnamese (3-4 sentences). Be specific to QA/API testing.`

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const result = await model.generateContent(prompt)
  return NextResponse.json({ feedback: result.response.text() })
}