import { Link, useLocation } from 'react-router-dom';

interface MastheadProps {
  /** Optional subtitle below the wordmark — e.g. "Datasets" or "Wind Power Curve" */
  section?: string;
  /** Optional eyebrow above the title (e.g. chapter slug) */
  eyebrow?: string;
  /** Optional right-aligned slot — progress dots, dataset picker, etc. */
  right?: React.ReactNode;
}

const NAV = [
  { to: '/chapters', label: 'Chapters' },
  { to: '/datasets', label: 'Datasets' },
  { to: '/explorer', label: 'Explorer' },
  { to: '/lessons', label: 'Lessons' },
];

export default function Masthead({ section, eyebrow, right }: MastheadProps) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <header className="border-b border-surface-line bg-surface/80 backdrop-blur-sm shadow-masthead sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">
        <Link to="/" className="flex items-baseline gap-2 group shrink-0">
          <div className="font-display font-black text-brand-900 text-xl leading-none">
            Savvas
          </div>
          <div className="font-display italic font-medium text-accent-600 text-sm leading-none">
            data show
          </div>
        </Link>

        {(section || eyebrow) && !isHome && (
          <div className="hidden md:block flex-1 min-w-0 border-l border-surface-line pl-6">
            {eyebrow && <div className="eyebrow text-ink-muted">{eyebrow}</div>}
            {section && <div className="font-display font-medium text-ink text-sm leading-tight truncate">{section}</div>}
          </div>
        )}

        <nav className="hidden md:flex items-center gap-1 ml-auto">
          {NAV.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + '/');
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  active ? 'bg-brand-50 text-brand-900' : 'text-ink-soft hover:text-brand-900 hover:bg-surface-subtle'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {right && <div className="ml-auto md:ml-0 shrink-0">{right}</div>}
      </div>
    </header>
  );
}
