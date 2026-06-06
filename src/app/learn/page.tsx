'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const LESSONS = [
  { id: 'l1', title: 'HTTP & Basic Auth', week: 1, type: 'theory', done: true },
  { id: 'l2', title: 'Bearer Token', week: 1, type: 'theory', done: true },
  { id: 'l3', title: 'JWT — decode & verify', week: 2, type: 'theory', done: false, active: true },
  { id: 'l4', title: 'Bài tập 3.1 — JWT Testing', week: 2, type: 'exercise', done: false },
  { id: 'l5', title: 'OAuth 2.0 Flow', week: 3, type: 'theory', done: false, locked: true },
  { id: 'l6', title: 'Bài tập 3.2', week: 3, type: 'exercise', done: false, locked: true },
]

const THEORY_CONTENT: Record<string, string> = {
  l3: `<div>
    <h2 style="font-size:18px;font-weight:500;margin-bottom:8px">JWT — Decode &amp; Verify trong API Testing</h2>
    <p style="color:#6b7280;font-size:14px;line-height:1.7;margin-bottom:1.5rem">Hiểu cấu trúc JWT, cách decode payload, và kiểm tra các edge case liên quan đến token expiry, invalid signature, và role-based access.</p>
    <h3 style="font-size:14px;font-weight:500;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #f3f4f6">JWT là gì?</h3>
    <p style="color:#6b7280;font-size:13px;line-height:1.8;margin-bottom:1rem">JSON Web Token (JWT) là một chuẩn mở (RFC 7519) dùng để truyền thông tin dưới dạng JSON object được ký số. JWT gồm 3 phần: <strong>Header.Payload.Signature</strong>.</p>
    <div style="background:#1e1e2e;border-radius:8px;padding:14px 16px;margin:10px 0;font-family:monospace;font-size:12px;line-height:1.8">
      <span style="color:#6c7086">// Payload decoded</span><br/>
      <span style="color:#cdd6f4">{</span><br/>
      &nbsp;&nbsp;<span style="color:#89dceb">"sub"</span><span style="color:#cdd6f4">: </span><span style="color:#a6e3a1">"user_123"</span><span style="color:#cdd6f4">,</span><br/>
      &nbsp;&nbsp;<span style="color:#89dceb">"role"</span><span style="color:#cdd6f4">: </span><span style="color:#a6e3a1">"admin"</span><span style="color:#cdd6f4">,</span><br/>
      &nbsp;&nbsp;<span style="color:#89dceb">"exp"</span><span style="color:#cdd6f4">: </span><span style="color:#fab387">1716003600</span><br/>
      <span style="color:#cdd6f4">}</span>
    </div>
    <div style="border-left:2px solid #6366f1;background:#eef2ff;border-radius:0 8px 8px 0;padding:10px 14px;margin:12px 0;font-size:13px;color:#3730a3">
      Luôn test trường hợp <strong>alg: "none"</strong> — một số server dễ bị bypass signature verification.
    </div>
  </div>`
}

export default function LearnPage() {
  const router = useRouter()
  const [activeLesson, setActiveLesson] = useState('l3')
  const [note, setNote] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [aiFeedback, setAiFeedback] = useState('')
  const [loadingFeedback, setLoadingFeedback] = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('qa_user')
    if (!u) router.push('/')
  }, [])

  const lesson = LESSONS.find(l => l.id === activeLesson)

  async function handleSubmit() {
    if (!note && files.length === 0) return
    setSubmitted(true)
    setLoadingFeedback(true)
    try {
      const res = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note, fileNames: files.map(f => f.name), lessonTitle: lesson?.title }),
      })
      const data = await res.json()
      setAiFeedback(data.feedback)
    } catch {
      setAiFeedback('Bài nộp đã được ghi nhận. Giảng viên sẽ phản hồi sớm.')
    } finally {
      setLoadingFeedback(false)
    }
  }

  const progress = Math.round((LESSONS.filter(l => l.done).length / LESSONS.length) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-semibold">QA</span>
        </div>
        <span className="text-sm font-medium text-gray-900">API Testing Fundamentals</span>
        <div className="flex items-center gap-2 ml-auto">
          <div className="w-32 h-1.5 bg-gray-100 rounded-full">
            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="text-xs text-gray-500">{progress}%</span>
          <button onClick={() => { localStorage.clear(); router.push('/') }} className="text-xs text-gray-400 hover:text-gray-600 ml-3">Đăng xuất</button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-57px)]">
        <aside className="w-56 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          {LESSONS.map(l => (
            <button key={l.id} onClick={() => !l.locked && setActiveLesson(l.id)}
              className={`w-full text-left px-4 py-3 border-b border-gray-50 flex items-start gap-3 transition-colors
                ${l.id === activeLesson ? 'bg-indigo-50 border-l-2 border-l-indigo-500' : ''}
                ${l.locked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}`}>
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs flex-shrink-0 mt-0.5
                ${l.done ? 'bg-emerald-100 text-emerald-600' : l.id === activeLesson ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                {l.done ? '✓' : l.type === 'exercise' ? '✏' : '▶'}
              </span>
              <div>
                <div className="text-xs font-medium text-gray-800 leading-snug">{l.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">Tuần {l.week}</div>
              </div>
            </button>
          ))}
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
          {lesson?.type === 'theory' && (
            <div className="max-w-2xl">
              <div dangerouslySetInnerHTML={{ __html: THEORY_CONTENT[activeLesson] || `<h2>${lesson.title}</h2><p>Nội dung đang được cập nhật...</p>` }} />
            </div>
          )}

          {lesson?.type === 'exercise' && (
            <div className="max-w-xl">
              {!submitted ? (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-1">{lesson.title}</h2>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">Đang mở · Hạn 3 ngày</span>
                  <p className="text-sm text-gray-500 mt-4 mb-4 leading-relaxed">Viết bộ test cases cho luồng authentication sử dụng JWT. Bao gồm ít nhất 5 test cases, export Bruno collection và ghi lại kết quả.</p>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Yêu cầu nộp bài</div>
                    {['File Bruno collection (.bru) với ít nhất 5 test cases', 'Screenshot kết quả test — pass và fail', 'Ghi chú mô tả từng test case'].map((r, i) => (
                      <div key={i} className="flex gap-2.5 mb-2 text-sm text-gray-600">
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center flex-shrink-0">{i+1}</span>
                        {r}
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Ghi chú / Giải thích bài làm</label>
                    <textarea value={note} onChange={e => setNote(e.target.value)} rows={4}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      placeholder="Mô tả approach của bạn, những vấn đề gặp phải..." />
                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Đính kèm file</label>
                    <label className="border border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors block">
                      <div className="text-2xl text-gray-300 mb-2">↑</div>
                      <div className="text-sm text-gray-500">Click để chọn file</div>
                      <div className="text-xs text-gray-400 mt-1">.bru · .json · .png · .pdf</div>
                      <input type="file" multiple className="hidden" onChange={e => setFiles(Array.from(e.target.files || []))} />
                    </label>
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-indigo-500">📎</span>{f.name}
                        <span className="ml-auto text-xs text-gray-400">{Math.round(f.size/1024)}KB</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button className="text-sm border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50">Lưu nháp</button>
                    <button onClick={handleSubmit} disabled={!note && files.length === 0}
                      className="text-sm bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 disabled:opacity-40">
                      Nộp bài
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center mb-4">
                    <div className="text-3xl text-emerald-500 mb-2">✓</div>
                    <div className="font-medium text-emerald-800">Đã nộp bài thành công!</div>
                    <div className="text-sm text-emerald-600 mt-1">Giảng viên sẽ phản hồi trong vòng 24 giờ</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Nhận xét sơ bộ từ AI</div>
                    {loadingFeedback
                      ? <div className="flex items-center gap-2 text-sm text-gray-400"><span className="w-4 h-4 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></span>Đang phân tích...</div>
                      : <p className="text-sm text-gray-600 leading-relaxed">{aiFeedback}</p>
                    }
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
