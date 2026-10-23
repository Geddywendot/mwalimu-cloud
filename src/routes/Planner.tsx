import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, BookOpen, RotateCcw, CheckCircle2, Award } from 'lucide-react'
import { generateStudyPlan } from '../lib/planner'
import { loadProgress } from '../lib/progress'
import { computeReadiness, weakestTopics } from '../lib/readiness'
import { useSettings } from '../hooks/useSettings'
import { saveSettings } from '../lib/settings'

export default function Planner() {
  const { settings } = useSettings()
  const { attempts } = loadProgress()
  const readiness = computeReadiness(attempts)
  const weakStats = weakestTopics(readiness.topics, 5)

  // Default exam date to settings or 14 days from today
  const defaultDate =
    settings.examDate ??
    new Date(Date.now() + 14 * 86_400_000).toISOString().slice(0, 10)

  const [examDate, setExamDate] = useState(defaultDate)
  const [hoursPerDay, setHoursPerDay] = useState(1.5)
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({})

  const plan = generateStudyPlan({
    examDate,
    hoursPerWeekday: hoursPerDay,
    weakTopicStats: weakStats,
  })

  const updateDate = async (newDate: string) => {
    setExamDate(newDate)
    await saveSettings({
      ...settings,
      examDate: newDate || null,
    })
  }

  const toggleDayComplete = (dayIndex: number) => {
    setCompletedDays((prev) => ({
      ...prev,
      [dayIndex]: !prev[dayIndex],
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AZ-900 Study Planner</h1>
        <p className="mt-1 text-ink/75">
          Your adaptive schedule balances topic deep-dives, quiz practice, and spaced repetition.
        </p>
      </div>

      {/* Configuration Controls */}
      <div className="panel grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="planner-date" className="mb-1 block text-sm font-semibold">
            Target Exam Date
          </label>
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-tide" />
            <input
              id="planner-date"
              type="date"
              value={examDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => updateDate(e.target.value)}
              className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="planner-hours" className="mb-1 block text-sm font-semibold">
            Study Hours Per Day ({hoursPerDay}h)
          </label>
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-tide" />
            <input
              id="planner-hours"
              type="range"
              min="0.5"
              max="4"
              step="0.5"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full accent-tide cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Plan Summary Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="panel p-4 text-center">
          <p className="text-xs uppercase tracking-wider text-ink/60">Days Planned</p>
          <p className="mt-1 text-2xl font-bold text-ink">{plan.totalDays}</p>
        </div>
        <div className="panel p-4 text-center">
          <p className="text-xs uppercase tracking-wider text-ink/60">Total Hours</p>
          <p className="mt-1 text-2xl font-bold text-tide">{plan.totalHours} hrs</p>
        </div>
        <div className="panel p-4 text-center">
          <p className="text-xs uppercase tracking-wider text-ink/60">Weak Priority</p>
          <p className="mt-1 text-sm font-bold truncate text-ink">
            {weakStats[0] ? weakStats[0].topicId : 'Balanced'}
          </p>
        </div>
        <div className="panel p-4 text-center">
          <p className="text-xs uppercase tracking-wider text-ink/60">Readiness</p>
          <p className="mt-1 text-2xl font-bold text-ink">{readiness.overall}%</p>
        </div>
      </div>

      {/* Day by Day Itinerary */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Daily Study Schedule</h2>
        <div className="space-y-3">
          {plan.days.map((day) => {
            const isDone = Boolean(completedDays[day.dayIndex])
            return (
              <div
                key={day.dayIndex}
                className={`panel transition-all ${
                  isDone ? 'border-tide/40 bg-tide/5 opacity-80' : 'bg-white'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-ink px-2 py-0.5 text-xs font-bold text-white">
                      Day {day.dayIndex}
                    </span>
                    <span className="font-semibold text-sm">
                      {day.dayOfWeek}, {day.date}
                    </span>
                    <span className="text-xs text-ink/60">({day.totalMinutes} mins)</span>
                  </div>
                  <button
                    onClick={() => toggleDayComplete(day.dayIndex)}
                    className="flex items-center gap-1 text-xs font-semibold text-tide hover:underline"
                  >
                    <CheckCircle2 size={15} className={isDone ? 'text-tide fill-tide/20' : 'text-ink/30'} />
                    {isDone ? 'Completed' : 'Mark complete'}
                  </button>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {day.sessions.map((sess, sIdx) => {
                    if (sess.type === 'Revision') {
                      return (
                        <div key={sIdx} className="rounded-lg border border-ink/10 bg-paper p-3 text-sm">
                          <div className="flex items-center gap-1.5 font-bold text-ink">
                            <RotateCcw size={16} className="text-tide" />
                            Revision ({sess.estimatedMinutes}m)
                          </div>
                          <p className="mt-1 text-xs text-ink/75">{sess.description}</p>
                          <Link
                            to="/revision"
                            className="mt-2 inline-block text-xs font-semibold text-tide underline hover:text-ink"
                          >
                            Start revision →
                          </Link>
                        </div>
                      )
                    }

                    if (sess.type === 'Explain') {
                      return (
                        <div key={sIdx} className="rounded-lg border border-ink/10 bg-paper p-3 text-sm">
                          <div className="flex items-center gap-1.5 font-bold text-ink">
                            <BookOpen size={16} className="text-tide" />
                            Explain ({sess.estimatedMinutes}m)
                          </div>
                          <p className="mt-1 text-xs text-ink/75 font-medium">{sess.topicTitle}</p>
                          <Link
                            to={`/explain/${sess.topicId}`}
                            className="mt-2 inline-block text-xs font-semibold text-tide underline hover:text-ink"
                          >
                            Read concept →
                          </Link>
                        </div>
                      )
                    }

                    return (
                      <div key={sIdx} className="rounded-lg border border-ink/10 bg-paper p-3 text-sm">
                        <div className="flex items-center gap-1.5 font-bold text-ink">
                          <Award size={16} className="text-sun" />
                          Quiz Practice ({sess.estimatedMinutes}m)
                        </div>
                        <p className="mt-1 text-xs text-ink/75 font-medium">{sess.topicTitle}</p>
                        <Link
                          to={`/quiz?topic=${sess.topicId}`}
                          className="mt-2 inline-block text-xs font-semibold text-tide underline hover:text-ink"
                        >
                          Take quiz →
                        </Link>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
