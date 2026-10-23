export default function ReadinessGauge({ score, label }: { score: number; label: string }) {
  const r = 52
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center" role="img" aria-label={`Overall readiness ${score}%, ${label}`}>
      <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden>
        <circle cx="70" cy="70" r={r} fill="none" stroke="#E6EFEE" strokeWidth="14" />
        <circle cx="70" cy="70" r={r} fill="none" stroke="#1B7F8C" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} transform="rotate(-90 70 70)" />
        <text x="70" y="78" textAnchor="middle" fontSize="30" fontWeight="700" fill="#0E3B43">{score}%</text>
      </svg>
      <p className="mt-1 text-lg font-semibold">{label}</p>
    </div>
  )
}
