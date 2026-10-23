import { Link } from 'react-router-dom'
import QuizRunner from '../components/QuizRunner'
import { dueQuestions } from '../lib/progress'
import { useSettings } from '../hooks/useSettings'

export default function Revision() {
  const { t } = useSettings()
  const due = dueQuestions().slice(0, 15)
  return (
    <div className="space-y-4">
      <h1 className="text-3xl">{t('rev.title')}</h1>
      {due.length === 0 ? (
        <div className="panel"><p>{t('rev.empty')}</p><Link to="/quiz?topic=mixed" className="btn-primary mt-4">Take a quiz</Link></div>
      ) : (<><p className="text-ink/70">{due.length} question{due.length > 1 ? 's' : ''} due.</p><QuizRunner questions={due} /></>)}
    </div>
  )
}
