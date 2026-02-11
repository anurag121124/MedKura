import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const token = useAuthStore((state) => state.token);

  const navItems = [
    { label: "Reports", to: "/" },
    { label: "Upload Report", to: "/upload" }
  ];

  const isActive = (to: string) => {
    if (to === "/") {
      return location.pathname === "/" || location.pathname.startsWith("/reports");
    }
    return location.pathname.startsWith(to);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen w-full">
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white px-6 py-8 lg:flex">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-sm font-bold text-white">
              MK
            </span>
            <div>
              <h1 className="text-lg font-semibold">MedKura</h1>
              <p className="text-xs text-slate-500">Report Management</p>
            </div>
          </div>
          <nav className="mt-10 flex flex-1 flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-semibold transition",
                  isActive(item.to)
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {token && (
            <Button className="mt-auto" variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </aside>
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 lg:hidden">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-xs font-bold text-white">
                MK
              </span>
              <div>
                <h1 className="text-base font-semibold">MedKura</h1>
                <p className="text-xs text-slate-500">Report Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" to="/">
                Reports
              </Link>
              <Link className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" to="/upload">
                Upload
              </Link>
            </div>
          </header>
          <main className="flex-1 px-4 pb-16 pt-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
