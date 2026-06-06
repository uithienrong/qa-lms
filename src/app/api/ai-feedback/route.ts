import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { note, fileNames, lessonTitle } = await req.json()

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `A QA student submitted exercise: "${lessonTitle}".
Note: "${note || 'none'}"
Files: ${fileNames?.join(', ') || 'none'}

Give brief encouraging feedback in Vietnamese (3-4 sentences). Be specific to QA/API testing.`
    }],
  })

  const text = (message.content[0] as { text: string }).text
  return NextResponse.json({ feedback: text })
}
