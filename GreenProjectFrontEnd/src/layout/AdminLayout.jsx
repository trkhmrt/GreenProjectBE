import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

export default function AdminLayout({ children }) {
    const [isProductManagementOpen, setIsProductManagementOpen] = useState(false);
    const [isChartsOpen, setIsChartsOpen] = useState(false);
    const [isDesignsOpen, setIsDesignsOpen] = useState(false);
    const [isManagementOpen, setIsManagementOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-[#f6f6f7]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#f6f6f7] text-black flex flex-col py-6 px-4 border-r border-neutral-200">
                <div className="text-2xl font-bold mb-8 tracking-tight">Admin Panel</div>
                <nav className="flex flex-col gap-2">
                    <Link to="/admin" className="flex items-center gap-2 hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] font-medium">
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="10" cy="10" r="8.5" stroke="currentColor"/>
                            <circle cx="10" cy="10" r="2" fill="currentColor"/>
                        </svg>
                        Dashboard
                    </Link>
                    
                    <Link to="/admin/cards" className="flex items-center gap-2 hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] font-medium">
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor"/>
                            <line x1="6" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.2"/>
                            <line x1="6" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1.2"/>
                        </svg>
                        Cards
                    </Link>

                    {/* Product Management Collapse */}
                    <div>
                        <button
                            onClick={() => setIsProductManagementOpen(!isProductManagementOpen)}
                            className="w-full text-left hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors flex items-center justify-between text-[15px] font-medium cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor"/>
                                  <path d="M8 8h4v4H8z" stroke="currentColor"/>
                                </svg>
                                Product Management
                            </span>
                            <span className={`transition-transform ${isProductManagementOpen ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        {isProductManagementOpen && (
                            <div className="ml-7 mt-2 space-y-1">
                                <Link to="/addProductToStore" className="block hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Product
                                </Link>
                                <Link to="/adminproduct" className="block hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                    Products
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link to="/admincategory" className="flex items-center gap-2 hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] font-medium">
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="4" y="4" width="12" height="12" rx="2" stroke="currentColor"/>
                          <path d="M10 7v6M7 10h6" stroke="currentColor"/>
                        </svg>
                        Category Management
                    </Link>

                    <Link to="/admin/orders" className="flex items-center gap-2 hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] font-medium">
                        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor"/>
                            <path d="M7 8h6M7 12h4" stroke="currentColor" strokeWidth="1.2"/>
                            <circle cx="16" cy="6" r="2" fill="currentColor"/>
                        </svg>
                        Order Management
                    </Link>

                    {/* Charts Collapse */}
                    <div>
                        <button
                            onClick={() => setIsChartsOpen(!isChartsOpen)}
                            className="w-full text-left hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors flex items-center justify-between text-[15px] font-medium cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
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
                                    Line Chart
                                </Link>
                                <Link to="/admin/charts/area" className="block hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] flex items-center gap-2">
                                    Area Chart
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Designs Collapse */}
                    <div>
                        <button
                            onClick={() => setIsDesignsOpen(!isDesignsOpen)}
                            className="w-full text-left hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors flex items-center justify-between text-[15px] font-medium cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <circle cx="10" cy="10" r="8" stroke="currentColor"/>
                                  <circle cx="6" cy="8" r="1.5" fill="currentColor"/>
                                  <circle cx="14" cy="8" r="1.5" fill="currentColor"/>
                                </svg>
                                Designs
                            </span>
                            <span className={`transition-transform ${isDesignsOpen ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        {isDesignsOpen && (
                            <div className="ml-7 mt-2 space-y-1">
                                <Link to="/admin/connection-demo" className="block hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors text-[15px] flex items-center gap-2">
                                    Connection Demo
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Yönetim Collapse */}
                    <div>
                        <button
                            onClick={() => setIsManagementOpen(!isManagementOpen)}
                            className="w-full text-left hover:bg-[#ececec] hover:text-black rounded px-3 py-2 transition-colors flex items-center justify-between text-[15px] font-medium cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
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
                                    Kullanıcı Yönetimi
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </aside>

            {/* Main Content - Sadece içeriği render et, ekstra wrapper yok */}
            <div className="flex-1">
                {children ? children : <Outlet />}
            </div>
        </div>
    );
}