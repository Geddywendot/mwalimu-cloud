import { useSettings } from '../hooks/useSettings'

export default function DisclaimerFooter() {
  const { t } = useSettings()
  return (
    <footer className="mt-12 border-t border-ink/10 px-4 py-6 text-center text-sm text-ink/70">
      {t('footer.disclaimer')}
    </footer>
  )
}
