'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateCoursePage() {
  const router = useRouter()
  const [form, setForm] = useState({ description: '', duration: '4 tuần', level: 'intermediate', courseName: '', learnerCount: 5 })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function handleGenerate() {
    if (!form.description) return
    setLoading(true)
    try {
      const res = await fetch('/api/generate-course', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setResult(data)
    } catch { alert('Lỗi kết nối') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-semibold">QA</span>
        </div>
        <span className="font-medium text-gray-900">Tạo khoá học mới</span>
      </header>
      <main className="max-w-2xl mx-auto p-6">
        {!result ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Mô tả khoá học</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="VD: Khoá học API Testing cho QA Engineer, bao gồm Postman/Bruno, REST API..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Thời gian</label>
                <select value={form.duration} onChange={e => setForm({...form, duration: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none">
                  {['2 tuần','4 tuần','6 tuần','8 tuần','3 tháng'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Số học viên</label>
                <input type="number" value={form.learnerCount} onChange={e => setForm({...form, learnerCount: +e.target.value})}
                  min={1} max={50} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Tên khoá học</label>
                <input type="text" value={form.courseName} onChange={e => setForm({...form, courseName: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                  placeholder="API Testing Fundamentals" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Cấp độ</label>
                <select value={form.level} onChange={e => setForm({...form, level: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={handleGenerate} disabled={loading || !form.description}
                className="bg-indigo-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-40">
                {loading ? 'Đang generate...' : 'Generate với AI'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-medium text-gray-900 mb-4">{result.courseName}</h2>
              <div className="space-y-3">
                {result.weeks?.map((w: any, i: number) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-800 mb-2">{w.title}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {w.topics?.map((t: string) => <span key={t} className="text-xs bg-white border border-gray-200 rounded-full px-2.5 py-1 text-gray-600">{t}</span>)}
                      {w.exercises?.map((e: string) => <span key={e} className="text-xs bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1 text-emerald-700">{e}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setResult(null)} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:bg-gray-50">Làm lại</button>
              <button onClick={() => router.push('/admin')} className="bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-emerald-700">Approve & Deploy</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
