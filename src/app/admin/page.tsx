'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface LearnerRow {
  name: string; progress: number; week: string; submissions: number; score: number; lastSeen: string; status: string
}

const MOCK_LEARNERS: LearnerRow[] = [
  { name: 'Nguyen Thi A', progress: 80, week: '3/4', submissions: 8, score: 8.5, lastSeen: 'Vừa xong', status: 'active' },
  { name: 'Tran Van B',   progress: 70, week: '3/4', submissions: 6, score: 7.2, lastSeen: '2 giờ trước', status: 'active' },
  { name: 'Le Thi C',     progress: 65, week: '3/4', submissions: 5, score: 7.8, lastSeen: '1 giờ trước', status: 'active' },
  { name: 'Pham Van D',   progress: 50, week: '2/4', submissions: 4, score: 6.5, lastSeen: '5 phút trước', status: 'behind' },
  { name: 'Hoang Van E',  progress: 25, week: '1/4', submissions: 2, score: 5.0, lastSeen: '3 ngày trước', status: 'inactive' },
]

const statusClass: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  behind: 'bg-amber-50 text-amber-700',
  inactive: 'bg-gray-100 text-gray-500',
}
const statusLabel: Record<string, string> = { active: 'Đang học', behind: 'Chậm tiến độ', inactive: 'Không hoạt động' }

export default function AdminPage() {
  const router = useRouter()
  useEffect(() => {
    const u = localStorage.getItem('qa_user')
    if (!u) router.push('/')
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-semibold">QA</span>
          </div>
          <span className="font-medium text-gray-900">Admin Dashboard</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/create')} className="text-sm border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50">+ Tạo khoá học</button>
          <button onClick={() => { localStorage.clear(); router.push('/') }} className="text-sm text-gray-500 hover:text-gray-700">Đăng xuất</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[['Học viên', '5', '/ 5 đã đăng ký'], ['Hoàn thành TB', '62%', '+8% tuần này'], ['Bài tập nộp', '23', '3 chờ chấm'], ['Điểm TB', '7.8', 'Thang điểm 10']].map(([label, val, sub]) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</div>
              <div className="text-2xl font-medium text-gray-900">{val}</div>
              <div className="text-xs text-gray-400 mt-1">{sub}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="font-medium text-sm text-gray-700">Tiến độ học viên — realtime</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Học viên','Tiến độ','Tuần','Bài tập','Điểm TB','Lần cuối online','Trạng thái'].map(h => (
                    <th key={h} className="text-left text-xs text-gray-400 font-medium uppercase tracking-wide px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_LEARNERS.map((l) => (
                  <tr key={l.name} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3.5 font-medium text-gray-900">{l.name}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${l.progress}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500">{l.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{l.week}</td>
                    <td className="px-5 py-3.5 text-gray-600">{l.submissions} / 10</td>
                    <td className="px-5 py-3.5 text-gray-700 font-medium">{l.score}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{l.lastSeen}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusClass[l.status]}`}>{statusLabel[l.status]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
