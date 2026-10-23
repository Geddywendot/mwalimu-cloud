import { Link } from 'react-router-dom'
import { useSettings } from '../hooks/useSettings'

/**
 * Global disclaimer footer displayed on every page.
 * Hard requirement: Must contain the exact text:
 * "Unofficial study tool. Not affiliated with or endorsed by Microsoft."
 */
export default function DisclaimerFooter() {
  const { settings } = useSettings()

  return (
    <footer className="mt-12 border-t border-ink/10 px-4 py-6 text-center text-sm text-ink/75">
      <p className="font-medium">
        Unofficial study tool. Not affiliated with or endorsed by Microsoft.
      </p>
      {settings.language === 'sw' && (
        <p className="mt-1 text-xs text-ink/60">
          Zana isiyo rasmi ya kujifunzia. Haihusiani wala kuidhinishwa na Microsoft.
        </p>
      )}
      <div className="mt-2 flex items-center justify-center gap-4 text-xs text-ink/60">
        <Link to="/about" className="underline hover:text-ink">
          About &amp; Integrity
        </Link>
        <span>•</span>
        <span>AZ-900 Study Buddy</span>
      </div>
    </footer>
  )
}
