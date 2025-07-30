import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

const menuItems = [
    { label: "Account", icon: (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>
        ), href: "/admin/account" },
    { label: "Billing", icon: (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="2"/><path d="M3 10h18"/></svg>
        ), href: "#" },
    { label: "Notifications", icon: (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 17h5l-5 5v-5z"/><path d="M4 4v16h16V4H4zm2 2h12v12H6V6z"/></svg>
        ), href: "#" },
];

export default function AdminLayout({ children }) {
    const [isManagementOpen, setIsManagementOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isChartsOpen, setIsChartsOpen] = useState(false);
    const [isDesignsOpen, setIsDesignsOpen] = useState(false);

    // Demo kullanıcı bilgisi
    const currentUser = {
        name: "Ahmet Yılmaz",
        email: "ahmet@admin.com",
        role: "Admin"
    };

    return (
        <div className="min-h-screen flex bg-[#f6f6f7]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#f6f6f7] text-black flex flex-col py-6 px-4 border-r border-neutral-200">
                <div className="text-2xl font-bold mb-8 tracking-tight">Admin Panel</div>
                <nav className="flex flex-col gap-2">
                    <Link to="/admin" className="flex items-center gap-2 hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] font-medium">
                        {/* Dashboard Icon */}
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="10" cy="10" r="8.5" stroke="currentColor"/>
                            <circle cx="10" cy="10" r="2" fill="currentColor"/>
                        </svg>
                        Dashboard
                    </Link>
                    <Link to="/admin/cards" className="flex items-center gap-2 hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] font-medium">
                        {/* Cards Icon */}
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor"/>
                            <line x1="6" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.2"/>
                            <line x1="6" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1.2"/>
                        </svg>
                        Cards
                    </Link>
                    <Link to="/adminproduct" className="flex items-center gap-2 hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] font-medium">
                        {/* Product Management Icon */}
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor"/>
                          <path d="M8 8h4v4H8z" stroke="currentColor"/>
                        </svg>
                        Product Management
                    </Link>
                    <Link to="/admincategory" className="flex items-center gap-2 hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] font-medium">
                        {/* Category Management Icon */}
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor"/>
                          <path d="M10 7v6M7 10h6" stroke="currentColor"/>
                        </svg>
                        Category Management
                    </Link>
                    {/* Charts Collapse Menü */}
                    <div>
                        <button
                            onClick={() => setIsChartsOpen(!isChartsOpen)}
                            className="w-full text-left hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors flex items-center justify-between text-[15px] font-medium cursor-pointer"
                        >
              <span className="flex items-center gap-2">
                {/* Charts Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="10" width="2" height="7" rx="1" stroke="currentColor"/>
                  <rect x="8" y="6" width="2" height="11" rx="1" stroke="currentColor"/>
                  <rect x="13" y="3" width="2" height="14" rx="1" stroke="currentColor"/>
                </svg>
                Charts
              </span>
                            <span className={`transition-transform ${isChartsOpen ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        {isChartsOpen && (
                            <div className="ml-7 mt-2 space-y-1">
                                <Link to="/admin/charts/line" className="block hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] flex items-center gap-2">
                                    {/* ...svg... */} Line Chart
                                </Link>
                                <Link to="/admin/charts/area" className="block hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] flex items-center gap-2">
                                    {/* ...svg... */} Area Chart
                                </Link>
                                <Link to="/admin/charts/bar" className="block hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] flex items-center gap-2">
                                    {/* ...svg... */} Bar Chart
                                </Link>
                                <Link to="/admin/charts/pie" className="block hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] flex items-center gap-2">
                                    {/* ...svg... */} Pie Chart
                                </Link>
                                <Link to="/admin/charts/radar" className="block hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] flex items-center gap-2">
                                    {/* ...svg... */} Radar Chart
                                </Link>
                                <Link to="/admin/charts/radial" className="block hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] flex items-center gap-2">
                                    {/* ...svg... */} Radial Chart
                                </Link>
                            </div>
                        )}
                    </div>
                    {/* Designs Collapse Menü */}
                    <div>
                        <button
                            onClick={() => setIsDesignsOpen(!isDesignsOpen)}
                            className="w-full text-left hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors flex items-center justify-between text-[15px] font-medium cursor-pointer"
                        >
              <span className="flex items-center gap-2">
                {/* Designs Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="10" cy="10" r="8" stroke="currentColor"/>
                  <circle cx="6" cy="8" r="1.5" fill="currentColor"/>
                  <circle cx="14" cy="8" r="1.5" fill="currentColor"/>
                  <circle cx="10" cy="14" r="1.5" fill="currentColor"/>
                  <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                  <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                </svg>
                Designs
              </span>
                            <span className={`transition-transform ${isDesignsOpen ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        {isDesignsOpen && (
                            <div className="ml-7 mt-2 space-y-1">
                                <Link to="/admin/connection-demo" className="block hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] flex items-center gap-2">
                                    {/* ...svg... */} Connection Demo
                                </Link>
                                <Link to="/admin/navbar" className="block hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] flex items-center gap-2">
                                    {/* ...svg... */} Navbar Demo
                                </Link>
                                <Link to="/admin/hero" className="block hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] flex items-center gap-2">
                                    {/* ...svg... */} Hero Globe (Tam/Yarım Dünya)
                                </Link>
                            </div>
                        )}
                    </div>
                    {/* Yönetim Collapse Menü */}
                    <div>
                        <button
                            onClick={() => setIsManagementOpen(!isManagementOpen)}
                            className="w-full text-left hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors flex items-center justify-between text-[15px] font-medium cursor-pointer"
                        >
              <span className="flex items-center gap-2">
                {/* Management Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="10" cy="10" r="2.5" stroke="currentColor"/>
                  <path d="M10 2v2M10 16v2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M2 10h2M16 10h2M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor"/>
                </svg>
                Yönetim
              </span>
                            <span className={`transition-transform ${isManagementOpen ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        {isManagementOpen && (
                            <div className="ml-7 mt-2 space-y-1">
                                <Link to="/admin/management/users" className="block hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] flex items-center gap-2">
                                    {/* ...svg... */} Kullanıcı Yönetimi
                                </Link>
                                <Link to="/admin/management/settings" className="block hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] flex items-center gap-2">
                                    {/* ...svg... */} Sistem Ayarları
                                </Link>
                                <Link to="/admin/management/reports" className="block hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] flex items-center gap-2">
                                    {/* ...svg... */} Raporlar
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
                <div className="mt-auto pt-8">
                    {/* Çıkış butonu kaldırıldı */}
                </div>
            </aside>
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-8 shadow-sm">
                    <div className="text-lg font-semibold text-neutral-900">Hoşgeldin, Admin!</div>
                    {/* Kullanıcı Menüsü */}
                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center space-x-3 hover:bg-neutral-100 rounded-lg px-4 py-2 transition-colors cursor-pointer"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                                <img src="https://i.pravatar.cc/64?img=3" alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-neutral-900">{currentUser.name}</div>
                                <div className="text-xs text-neutral-500">{currentUser.role}</div>
                            </div>
                            <span className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        {/* Dropdown Menü */}
                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-neutral-200 py-2 z-50 animate-fade-in">
                                <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
                                    <img src="https://i.pravatar.cc/64?img=3" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <div className="font-semibold text-neutral-900">{currentUser.name}</div>
                                        <div className="text-xs text-neutral-500">{currentUser.email}</div>
                                    </div>
                                </div>
                                <div className="py-2">
                                    {menuItems.map((item) => (
                                        <a key={item.label} href={item.href} className="flex items-center px-4 py-2 text-neutral-800 hover:bg-[#ececec] transition-colors text-[15px]">
                                            {item.icon}
                                            {item.label}
                                        </a>
                                    ))}
                                </div>
                                <div className="px-2 pt-2">
                                    <button className="flex items-center w-full px-3 py-2 rounded-lg text-neutral-800 bg-[#f6f6f7] border border-neutral-200 shadow-sm hover:bg-[#ececec] hover:text-red-600 transition-colors font-normal text-[15px] cursor-pointer">
                                        Log out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>
                {/* Content Area */}
                <main className="flex-1 p-8 bg-[#f6f6f7]">
                    {children ? children : <Outlet />}
                </main>
            </div>
        </div>
    );
}