import { contentMode } from '../lib/content'
import { useSettings } from '../hooks/useSettings'

/**
 * Renders honesty badges indicating whether content is pre-curated or AI-generated,
 * and alerts users if non-English translations are under native-speaker review.
 */
export default function HonestyBadges({ className = '' }: { className?: string }) {
  const { settings, t } = useSettings()

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {contentMode === 'static' ? (
        <span
          className="inline-flex items-center rounded-full border border-ink/20 bg-mist px-2.5 py-0.5 text-xs font-semibold text-ink"
          title="Pre-written, human-curated questions and explanations without live AI"
        >
          {t('badge.curated')}
        </span>
      ) : (
        <span
          className="inline-flex items-center rounded-full border border-sun bg-sun/20 px-2.5 py-0.5 text-xs font-semibold text-ink"
          title="Generated dynamically using Claude via Supabase Edge Functions"
        >
          {t('badge.live')}
        </span>
      )}

      {settings.language === 'sw' && (
        <span
          className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-900"
          title="Kiswahili translations require native-speaker technical review"
        >
          {t('badge.review')}
        </span>
      )}
    </div>
  )
}
