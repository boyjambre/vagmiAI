import { Link, NavLink } from "react-router-dom"

export type NavbarNavItem = {
  label: string
  to: string
}

type NavbarProps = {
  logoTo?: string
  navItems?: NavbarNavItem[]
  showAuthActions?: boolean
  className?: string
}

function Navbar({
  logoTo = "/dashboard",
  navItems,
  showAuthActions = true,
  className = "",
}: NavbarProps) {
  return (
    <header
      className={["sticky top-4 z-50 px-4", className].filter(Boolean).join(" ")}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E2E8F0]/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-xl sm:gap-4 sm:px-6 sm:py-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:gap-5">
          <Link
            to={logoTo}
            className="flex shrink-0 items-center gap-3 transition hover:opacity-90"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl">
              <img
                src="/VagmiAI_Logo.png"
                alt="VagmiAI Logo"
                className="h-15 w-15 object-contain"
              />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight text-[#0F172A]">
                VagmiAI
              </p>
            </div>
          </Link>

          {navItems && navItems.length > 0 ? (
          <nav className="flex min-w-0 flex-wrap items-center gap-4 sm:flex-nowrap">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-1 py-1 text-sm font-medium transition ${
                    isActive
                      ? "text-[#C9A227]"
                      : "text-[#475569] hover:text-[#0F172A]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        ) : null}
        </div>

        {showAuthActions ? (
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/profile"
              className="rounded-full border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#334155] transition hover:border-[#CBD5E1] hover:text-[#0F172A] sm:px-4"
            >
              Profil
            </Link>
            <Link
              to="/signin"
              className="rounded-full bg-[#0F172A] px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-95 sm:px-4"
            >
              Keluar
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  )
}

export default Navbar
