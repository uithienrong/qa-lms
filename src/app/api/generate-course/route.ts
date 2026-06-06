import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { description, duration, level, courseName } = await req.json()

  const numWeeks = duration.includes('tuần')
    ? parseInt(duration)
    : parseInt(duration) * 4

  const prompt = `You are a QA training curriculum designer. Create a detailed course curriculum.

Course description: ${description}
Duration: ${duration} (${numWeeks} weeks)
Level: ${level}
Course name: ${courseName}

Return ONLY valid JSON with this structure:
{
  "courseName": "string",
  "duration": "string",
  "level": "string",
  "totalExercises": number,
  "weeks": [
    {
      "title": "Week N: Topic Name",
      "topics": ["topic1","topic2","topic3","topic4"],
      "exercises": ["exercise1","exercise2"],
      "theory_html": "<p>Full HTML theory content for this week...</p>"
    }
  ]
}

Create exactly ${numWeeks} week objects. theory_html should be rich HTML with headings, code examples, callouts.`

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = (message.content[0] as { text: string }).text
  const clean = text.replace(/```json|```/g, '').trim()
  const data = JSON.parse(clean)

  return NextResponse.json(data)
}
