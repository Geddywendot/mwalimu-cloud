import json

with open('/tmp/mwalimu_seed.json', 'r') as f:
    seed_json = f.read()

with open('dist/index.html', 'r') as f:
    html = f.read()

helper_script = f"""
<script>
window.__MWALIMU_DEMO_SEED = {seed_json};
(function() {{
  const p = new URLSearchParams(window.location.search);
  if (p.has('clear')) {{
    localStorage.clear();
  }}
  if (p.has('guest')) {{
    localStorage.setItem('mwalimu.guest', '1');
    const lang = p.get('lang') || 'en';
    const settings = {{
      language: lang,
      examDate: '2026-11-30',
      onboarded: true
    }};
    localStorage.setItem('mwalimu.settings.v1', JSON.stringify(settings));
  }}
  if (p.has('seed') && window.__MWALIMU_DEMO_SEED) {{
    localStorage.setItem('mwalimu.progress.v1', JSON.stringify(window.__MWALIMU_DEMO_SEED));
  }}
  if (p.has('auto_answer')) {{
    window.addEventListener('load', () => {{
      setTimeout(() => {{
        const input = document.querySelector('input[name="answer"]');
        if (input) {{
          input.click();
          setTimeout(() => {{
            const buttons = Array.from(document.querySelectorAll('button'));
            const checkBtn = buttons.find(b => b.textContent && b.textContent.includes('Check'));
            if (checkBtn) {{
              checkBtn.click();
            }}
          }}, 400);
        }}
      }}, 600);
    }});
  }}
}})();
</script>
"""

# Replace or inject before <script type="module"
if 'window.__MWALIMU_DEMO_SEED' not in html:
    new_html = html.replace('<script type="module"', helper_script + '\n    <script type="module"')
    with open('dist/index.html', 'w') as f:
        f.write(new_html)
    print("Injected helper script into dist/index.html")
else:
    print("Helper script already present in dist/index.html")
