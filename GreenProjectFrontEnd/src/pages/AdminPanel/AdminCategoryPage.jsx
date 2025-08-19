import React, { useState, useEffect } from 'react';
import axios from '../../lib/axios';

// Minimal CSS
const customStyles = `
  .hover-effect {
    transition: background-color 0.15s ease;
  }
  
  .indent-1 { margin-left: 2rem; }
  .indent-2 { margin-left: 4rem; }
  .indent-3 { margin-left: 6rem; }
  .indent-4 { margin-left: 8rem; }
  .indent-5 { margin-left: 10rem; }
  .indent-6 { margin-left: 12rem; }
  
  .category-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.25rem;
    margin: 0.125rem 0;
    position: relative;
  }
  
  .category-item:hover {
    background-color: #f9fafb;
  }
  
  /* Children wrapper: subtle vertical guideline to emphasize hierarchy */
  .children-list {
    border-left: 1px solid #eef2f7;
    padding-left: 0.75rem;
    margin-left: 0.5rem;
  }
  
  .category-item.indent-1::before,
  .category-item.indent-2::before,
  .category-item.indent-3::before,
  .category-item.indent-4::before,
  .category-item.indent-5::before,
  .category-item.indent-6::before {
    content: '';
    position: absolute;
    left: -0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0.125rem;
    height: 1.5rem;
    background-color: #d1d5db;
    border-radius: 0.0625rem;
  }
  
  .action-span {
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    transition: background-color 0.15s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .action-span:hover {
    background-color: #e5e7eb;
  }
  
  .action-icon {
    width: 0.875rem;
    height: 0.875rem;
  }
`;

const AdminCategoryPage = () => {
    const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'deleted'
    
    // Popup state'leri
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState('');
    
    // Ana kategori ekleme
    const [addingMainCategory, setAddingMainCategory] = useState(false);
    const [newMainCategoryName, setNewMainCategoryName] = useState('');
    
    // Alt kategori ekleme
    const [addingSubCategory, setAddingSubCategory] = useState(null);
    const [newSubCategoryName, setNewSubCategoryName] = useState('');
    
    // Kategori düzenleme
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

  const fetchCategories = async () => {
    setLoading(true);
        try {
            const response = await axios.get('/productservice/category/admin/hierarchical-nested');
            console.log('🔍 API Response:', response.data);
            console.log('🔍 Active Categories:', response.data.filter(cat => !cat.isDeleted));
            console.log('🔍 Deleted Categories:', response.data.filter(cat => cat.isDeleted));
            setCategories(response.data);
    } catch (error) {
            console.error('Kategoriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

    // Ana kategori ekleme
    const handleAddMainCategory = async () => {
        if (!newMainCategoryName.trim()) return;
    
    setLoading(true);
    try {
            await axios.post('/productservice/category/create', {
                categoryName: newMainCategoryName,
                parentId: null
            });
      await fetchCategories();
            setAddingMainCategory(false);
            setNewMainCategoryName('');
    } catch (error) {
            console.error('Ana kategori ekleme başarısız:', error);
    } finally {
      setLoading(false);
        }
    };

    // Alt kategori ekleme
    const handleAddSubCategory = async (parentId) => {
        if (!newSubCategoryName.trim()) return;
    
    setLoading(true);
        try {
            await axios.post('/productservice/category/create', {
                categoryName: newSubCategoryName,
                parentId: parentId
            });
      await fetchCategories();
      setAddingSubCategory(null);
            setNewSubCategoryName('');
    } catch (error) {
      console.error('Alt kategori ekleme başarısız:', error);
    } finally {
      setLoading(false);
    }
  };

        // Kategori düzenleme
    const handleUpdateCategory = async (categoryId) => {
        if (!editingCategoryName.trim()) return;
    
    setLoading(true);
    try {
            // Güncellenecek kategoriyi bul
            const findCategory = (categories, targetId) => {
                for (let category of categories) {
                    if (category.categoryId === targetId) {
                        return category;
                    }
                    if (category.children && category.children.length > 0) {
                        const found = findCategory(category.children, targetId);
                        if (found) return found;
                    }
                }
                return null;
            };
            
            const categoryToUpdate = findCategory(categories, categoryId);
            
            if (!categoryToUpdate) {
                console.error('Güncellenecek kategori bulunamadı:', categoryId);
                return;
            }
            
            await axios.put(`/productservice/category/${categoryId}`, {
                categoryId: categoryId,
                categoryName: editingCategoryName,
                parentId: categoryToUpdate.parentId
            });
      await fetchCategories();
            setEditingCategory(null);
            setEditingCategoryName('');
    } catch (error) {
            console.error('Kategori güncelleme başarısız:', error);
        } finally {
      setLoading(false);
        }
    };

        // Kategori silme
    const handleDeleteCategory = async (categoryId) => {
        // Silinecek kategoriyi bul
        const findCategory = (categories, targetId) => {
            for (let category of categories) {
                if (category.categoryId === targetId) {
                    return category;
                }
                if (category.children && category.children.length > 0) {
                    const found = findCategory(category.children, targetId);
                    if (found) return found;
                }
            }
            return null;
        };
        
        const categoryToDelete = findCategory(categories, categoryId);
        
        if (!categoryToDelete) {
            console.error('Silinecek kategori bulunamadı:', categoryId);
            return;
        }
        
        // Popup'ı göster
        setConfirmMessage(`"${categoryToDelete.categoryName}" kategorisini silmek istediğinizden emin misiniz?`);
        setConfirmAction(() => async () => {
    setLoading(true);
    try {
                await axios.delete(`/productservice/category/${categoryId}`, {
                    data: {
                        categoryId: categoryId,
                        categoryName: categoryToDelete.categoryName,
                        isActive: categoryToDelete.isActive,
                        isDeleted: true
                    }
                });
                await fetchCategories();
    } catch (error) {
                console.error('Kategori silme başarısız:', error);
    } finally {
      setLoading(false);
    }
        });
        setShowConfirmPopup(true);
  };

      // Kategori aktif/pasif toggle
    const handleToggleCategoryActive = async (categoryId) => {
    setLoading(true);
    try {
            // Toggle edilecek kategoriyi bul
            const findCategory = (categories, targetId) => {
                for (let category of categories) {
                    if (category.categoryId === targetId) {
                        return category;
                    }
                    if (category.children && category.children.length > 0) {
                        const found = findCategory(category.children, targetId);
                        if (found) return found;
                    }
                }
                return null;
            };
            
            const categoryToToggle = findCategory(categories, categoryId);
            
            if (!categoryToToggle) {
                console.error('Toggle edilecek kategori bulunamadı:', categoryId);
                return;
            }
            
            await axios.put(`/productservice/category/${categoryId}/toggle-active`, {
                categoryId: categoryId,
                categoryName: categoryToToggle.categoryName,
                isActive: !categoryToToggle.isActive, // Mevcut durumun tersini gönder
                isDeleted: categoryToToggle.isDeleted
            });
            await fetchCategories();
    } catch (error) {
            console.error('Kategori aktif/pasif değiştirme başarısız:', error);
    } finally {
      setLoading(false);
        }
    };

        // Silinen kategoriyi geri taşıma
    const handleRestoreCategory = async (categoryId) => {
    setLoading(true);
        try {
            // Geri taşınacak kategoriyi bul
            const findCategory = (categories, targetId) => {
                for (let category of categories) {
                    if (category.categoryId === targetId) {
                        return category;
                    }
                    if (category.children && category.children.length > 0) {
                        const found = findCategory(category.children, targetId);
                        if (found) return found;
                    }
                }
                return null;
            };
            
            const categoryToRestore = findCategory(categories, categoryId);
            
            if (!categoryToRestore) {
                console.error('Geri taşınacak kategori bulunamadı:', categoryId);
                return;
            }
            
            await axios.put(`/productservice/category/admin/${categoryId}/restore-with-children`, {
                categoryId: categoryId,
                categoryName: categoryToRestore.categoryName,
                isActive: categoryToRestore.isActive,
                isDeleted: false
            });
      await fetchCategories();
    } catch (error) {
            console.error('Kategori geri taşıma başarısız:', error);
        } finally {
      setLoading(false);
        }
    };

    // Expand/Collapse toggle
    const toggleCategoryExpansion = (categoryId) => {
        setExpandedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    // Helper fonksiyonlar
  const startEditingCategory = (categoryId, currentName) => {
    setEditingCategory(categoryId);
    setEditingCategoryName(currentName);
  };

  const cancelEditingCategory = () => {
    setEditingCategory(null);
    setEditingCategoryName('');
  };

    const startAddingSubCategory = (categoryId) => {
        setAddingSubCategory(categoryId);
        setNewSubCategoryName('');
    };

    const cancelAddingSubCategory = () => {
        setAddingSubCategory(null);
        setNewSubCategoryName('');
    };

            return (
        <>
            <style>{customStyles}</style>
            
            {/* Onay Popup'ı */}
            {showConfirmPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-gray-900">Onay Gerekli</h3>
                            </div>
                        </div>
                        <div className="mb-6">
                            <p className="text-sm text-gray-500">{confirmMessage}</p>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowConfirmPopup(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none"
                            >
                                Hayır
                            </button>
                        <button
                                onClick={() => {
                                    if (confirmAction) {
                                        confirmAction();
                                    }
                                    setShowConfirmPopup(false);
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none"
                            >
                                Evet
                        </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="max-w-6xl mx-auto py-4 px-4">
                <div className="bg-white rounded-lg border border-gray-100">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-50">
                        <div>
                            <h1 className="text-lg font-medium text-gray-900">Kategori Yönetimi</h1>
                            <p className="text-gray-500 text-sm">Hiyerarşik kategori yapısını yönetin</p>
                </div>

                                                {/* Ana Kategori Ekleme Butonu */}
                        {activeTab === 'active' && !addingMainCategory && (
                            <span
                                onClick={() => setAddingMainCategory(true)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium cursor-pointer hover-effect ${
                                    loading 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                                Ana Kategori Ekle
                            </span>
                            )}
                        </div>

                {/* Tab Menü */}
                <div className="flex border-b border-gray-100">
                    <span
                        onClick={() => setActiveTab('active')}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 cursor-pointer hover-effect ${
                            activeTab === 'active' 
                                ? 'text-purple-600 border-purple-600' 
                                : 'text-gray-500 border-transparent hover:text-purple-600'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Aktif Kategoriler
                    </span>
                    
                    <span
                        onClick={() => setActiveTab('deleted')}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 cursor-pointer hover-effect ${
                            activeTab === 'deleted' 
                                ? 'text-red-600 border-red-600' 
                                : 'text-gray-500 border-transparent hover:text-red-600'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Silinen Kategoriler
                    </span>
                </div>

                {/* Ana Kategori Ekleme Formu */}
                {activeTab === 'active' && addingMainCategory && (
                    <div className="flex items-center gap-3 p-3 bg-gray-25 border-b border-gray-50">
                        <input
                            type="text"
                            value={newMainCategoryName}
                            onChange={(e) => setNewMainCategoryName(e.target.value)}
                            placeholder="Ana kategori adı girin..."
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddMainCategory();
                                if (e.key === 'Escape') { setAddingMainCategory(false); setNewMainCategoryName(''); }
                }}
                autoFocus
              />
                                      <span
                            onClick={handleAddMainCategory}
                            className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer hover-effect ${
                                loading || !newMainCategoryName.trim()
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
              >
                Kaydet
                        </span>
                        <span
                            onClick={() => { setAddingMainCategory(false); setNewMainCategoryName(''); }}
                            className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer hover-effect ${
                                loading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
              >
                İptal
                        </span>
            </div>
          )}

                {/* Content Area */}
                <div className="relative">
                    {/* Loading */}
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                            <span className="ml-2 text-sm text-gray-500">Yükleniyor...</span>
                        </div>
                    )}

                {/* Aktif Kategoriler Tab */}
                <div className={`${
                    activeTab === 'active' 
                        ? 'block' 
                        : 'hidden'
                }`}>
                    {!loading && (
                        <div className="p-4 space-y-2">
                        {(() => {
                            const rootCategories = categories.filter(category => 
                                (!category.parentId || category.parentId === 0 || category.parentId === null) && 
                                !category.isDeleted
                            );
                            console.log('🌳 Active Root Categories:', rootCategories);
                            return rootCategories.map(category => (
                                <CategoryItem
                                    key={category.categoryId}
                                    category={category}
                                    expandedCategories={expandedCategories}
                                    toggleCategoryExpansion={toggleCategoryExpansion}
                                    loading={loading}
                                    editingCategory={editingCategory}
                                    editingCategoryName={editingCategoryName}
                                    setEditingCategoryName={setEditingCategoryName}
                                    addingSubCategory={addingSubCategory}
                                    newSubCategoryName={newSubCategoryName}
                                    setNewSubCategoryName={setNewSubCategoryName}
                                    handleToggleCategoryActive={handleToggleCategoryActive}
                                    handleUpdateCategory={handleUpdateCategory}
                                    handleDeleteCategory={handleDeleteCategory}
                                    handleAddSubCategory={handleAddSubCategory}
                                    startEditingCategory={startEditingCategory}
                                    cancelEditingCategory={cancelEditingCategory}
                                    startAddingSubCategory={startAddingSubCategory}
                                    cancelAddingSubCategory={cancelAddingSubCategory}
                                    level={0}
                                    isActiveTab={true}
                                />
                            ));
                        })()}
                        </div>
                    )}
                </div>

                {/* Silinen Kategoriler Tab */}
                <div className={`${
                    activeTab === 'deleted' 
                        ? 'block' 
                        : 'hidden'
                }`}>
                    {!loading && (
                        <div className="p-4 space-y-2">
                        {(() => {
                            const deletedCategories = categories.filter(category => 
                                (!category.parentId || category.parentId === 0 || category.parentId === null) && 
                                category.isDeleted
                            );
                            console.log('🗑️ Deleted Root Categories:', deletedCategories);
                            return deletedCategories.map(category => (
                                <DeletedCategoryItem
                                    key={category.categoryId}
                                    category={category}
                                    expandedCategories={expandedCategories}
                                    toggleCategoryExpansion={toggleCategoryExpansion}
                                    loading={loading}
                                    editingCategory={editingCategory}
                                    editingCategoryName={editingCategoryName}
                                    setEditingCategoryName={setEditingCategoryName}
                                    handleRestoreCategory={handleRestoreCategory}
                                    startEditingCategory={startEditingCategory}
                                    cancelEditingCategory={cancelEditingCategory}
                                    level={0}
                                />
                            ));
                        })()}
                  </div>
                    )}
                </div>
                </div>
            </div>
        </div>
        </>
    );
};

// Category Item Component
const CategoryItem = ({ 
    category, 
    expandedCategories, 
    toggleCategoryExpansion, 
    loading, 
    editingCategory, 
    editingCategoryName, 
    setEditingCategoryName, 
    addingSubCategory, 
    newSubCategoryName, 
    setNewSubCategoryName, 
    handleToggleCategoryActive, 
    handleUpdateCategory, 
    handleDeleteCategory, 
    handleAddSubCategory, 
    startEditingCategory, 
    cancelEditingCategory, 
    startAddingSubCategory, 
    cancelAddingSubCategory, 
    level,
    isActiveTab = false
}) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.includes(category.categoryId);
    
    console.log(`📁 CategoryItem [Level ${level}]:`, {
        id: category.categoryId,
        name: category.categoryName,
        parentId: category.parentId,
        isActive: category.isActive,
        isDeleted: category.isDeleted,
        hasChildren,
        childrenCount: category.children?.length || 0,
        isExpanded
    });
    
    return (
        <div className="w-full">
            {/* Ana Kategori Satırı */}
            <div className={`category-item ${level > 0 ? `indent-${Math.min(level, 6)} bg-gray-25` : ''}`}>
                {/* Expand/Collapse İkonu */}
                {hasChildren && (
                    <svg 
                        className={`w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600 ${isExpanded ? 'rotate-90' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        onClick={() => toggleCategoryExpansion(category.categoryId)}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                )}
                {!hasChildren && <div className="w-4 h-4"></div>}
                
                {/* Kategori İçeriği */}
                <div className="flex items-center justify-between flex-1">
                    <div className="flex items-center gap-3">
                        {/* Kategori Adı */}
                        {editingCategory === category.categoryId ? (
                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                                    className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleUpdateCategory(category.categoryId);
                          if (e.key === 'Escape') cancelEditingCategory();
                        }}
                                                            autoFocus
                                                        />
                                <span
                                    onClick={() => handleUpdateCategory(category.categoryId)}
                                    className="action-span bg-green-100 text-green-700 hover:bg-green-200"
                                    title="Kaydet"
                                >
                                    <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                                <span
                        onClick={cancelEditingCategory}
                                    className="action-span bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    title="İptal"
                                >
                                    <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </span>
                    </div>
                  ) : (
                            <div className="flex items-center gap-2">
                                <span className={`text-sm ${category.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {category.categoryName}
                                </span>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    category.isActive 
                                        ? 'bg-green-50 text-green-600' 
                                        : 'bg-red-50 text-red-600'
                                }`}>
                                    {category.isActive ? 'Aktif' : 'Pasif'}
                                </span>
                                            </div>
                  )}
                                        </div>

                                        {/* Aksiyon Butonları */}
                    <div className="flex items-center gap-1">
                        {/* Aktif/Pasif Butonu */}
                        <span
                            onClick={() => handleToggleCategoryActive(category.categoryId)}
                            className={`action-span ${
                                category.isActive 
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title={category.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                        >
                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </span>
                        
                        {/* Alt Kategori Ekleme */}
                        <span
                            onClick={() => startAddingSubCategory(category.categoryId)}
                            className="action-span bg-purple-100 text-purple-700 hover:bg-purple-200"
                            title="Alt Kategori Ekle"
                        >
                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m7-7H5" />
                            </svg>
                        </span>
                        
                        {/* Düzenleme */}
                        <span
                            onClick={() => startEditingCategory(category.categoryId, category.categoryName)}
                            className="action-span bg-blue-100 text-blue-700 hover:bg-blue-200"
                              title="Düzenle"
                                                                >
                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                        </span>
                        
                        {/* Silme */}
                        <span
                            onClick={() => handleDeleteCategory(category.categoryId)}
                            className="action-span bg-red-100 text-red-700 hover:bg-red-200"
                              title="Sil"
                            >
                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                        </span>
                    </div>
                </div>
                          </div>
            
            {/* Alt Kategori Ekleme Formu */}
            {addingSubCategory === category.categoryId && (
                <div className={`ml-4 mt-1 p-2 bg-gray-50 rounded ${level > 0 ? `indent-${Math.min(level + 1, 6)}` : ''}`}>
                    <div className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={newSubCategoryName}
                          onChange={(e) => setNewSubCategoryName(e.target.value)}
                          placeholder="Alt kategori adı girin..."
                            className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddSubCategory(category.categoryId);
                                if (e.key === 'Escape') cancelAddingSubCategory();
                          }}
                                                                autoFocus
                                                            />
                        <span
                            onClick={() => handleAddSubCategory(category.categoryId)}
                            className="action-span bg-green-100 text-green-700 hover:bg-green-200"
                            title="Kaydet"
                        >
                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </span>
                        <span
                            onClick={cancelAddingSubCategory}
                            className="action-span bg-gray-100 text-gray-700 hover:bg-gray-200"
                            title="İptal"
                        >
                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                    </div>
                    </div>
                )}

            {/* Alt Kategoriler */}
            {hasChildren && isExpanded && (
                <div className="mt-3 space-y-2 children-list">
                    {category.children
                        .filter(childCategory => !childCategory.isDeleted)
                        .map((childCategory) => (
                            <CategoryItem
                                key={childCategory.categoryId}
                                category={childCategory}
                                expandedCategories={expandedCategories}
                                toggleCategoryExpansion={toggleCategoryExpansion}
                                loading={loading}
                                editingCategory={editingCategory}
                                editingCategoryName={editingCategoryName}
                                setEditingCategoryName={setEditingCategoryName}
                                addingSubCategory={addingSubCategory}
                                newSubCategoryName={newSubCategoryName}
                                setNewSubCategoryName={setNewSubCategoryName}
                                handleToggleCategoryActive={handleToggleCategoryActive}
                                handleUpdateCategory={handleUpdateCategory}
                                handleDeleteCategory={handleDeleteCategory}
                                handleAddSubCategory={handleAddSubCategory}
                                startEditingCategory={startEditingCategory}
                                cancelEditingCategory={cancelEditingCategory}
                                startAddingSubCategory={startAddingSubCategory}
                                cancelAddingSubCategory={cancelAddingSubCategory}
                                level={level + 1}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};

// Deleted Category Item Component
const DeletedCategoryItem = ({ 
    category, 
    expandedCategories, 
    toggleCategoryExpansion, 
    loading, 
    editingCategory, 
    editingCategoryName, 
    setEditingCategoryName, 
    handleRestoreCategory, 
    startEditingCategory, 
    cancelEditingCategory, 
    level 
}) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.includes(category.categoryId);
    
    console.log(`🗑️ DeletedCategoryItem [Level ${level}]:`, {
        id: category.categoryId,
        name: category.categoryName,
        parentId: category.parentId,
        isActive: category.isActive,
        isDeleted: category.isDeleted,
        hasChildren,
        childrenCount: category.children?.length || 0,
        isExpanded
    });
    
    return (
        <div className="w-full">
            {/* Silinen Kategori Satırı */}
            <div className={`category-item ${level > 0 ? `indent-${Math.min(level, 6)}` : ''} bg-red-25`}>
                {/* Expand/Collapse İkonu */}
                {hasChildren && (
                    <svg 
                        className={`w-4 h-4 cursor-pointer text-red-400 hover:text-red-600 ${isExpanded ? 'rotate-90' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        onClick={() => toggleCategoryExpansion(category.categoryId)}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                )}
                {!hasChildren && <div className="w-4 h-4"></div>}
                
                {/* Kategori İçeriği */}
                <div className="flex items-center justify-between flex-1">
                    <div className="flex items-center gap-3">
                        {/* Kategori Adı */}
                        {editingCategory === category.categoryId ? (
                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="text"
                                    value={editingCategoryName}
                                    onChange={(e) => setEditingCategoryName(e.target.value)}
                                    className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                              onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleUpdateCategory(category.categoryId);
                                        if (e.key === 'Escape') cancelEditingCategory();
                              }}
                                                                    autoFocus
                                                                />
                                <span
                                    onClick={() => handleUpdateCategory(category.categoryId)}
                                    className="action-span bg-green-100 text-green-700 hover:bg-green-200"
                                    title="Kaydet"
                                >
                                    <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                                <span
                                    onClick={cancelEditingCategory}
                                    className="action-span bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    title="İptal"
                                >
                                    <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </span>
                        </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-red-800">{category.categoryName}</span>
                                <span className="px-2 py-0.5 text-xs rounded-full bg-red-50 text-red-600">
                                    Silinen
                                </span>
                        </div>
                        )}
                    </div>
                    
                    {/* Aksiyon Butonları */}
                    <div className="flex items-center gap-1">
                        {/* Geri Taşıma */}
                        <span
                            onClick={() => handleRestoreCategory(category.categoryId)}
                            className="action-span bg-green-100 text-green-700 hover:bg-green-200"
                            title="Geri Taşı"
                        >
                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                        </span>
                        
                        {/* Düzenleme */}
                        <span
                            onClick={() => startEditingCategory(category.categoryId, category.categoryName)}
                            className="action-span bg-blue-100 text-blue-700 hover:bg-blue-200"
                            title="Düzenle"
                        >
                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Alt Kategoriler */}
            {hasChildren && isExpanded && (
                <div className="mt-3 space-y-2 children-list">
                    {category.children
                        .filter(childCategory => childCategory.isDeleted)
                        .map((childCategory) => (
                            <DeletedCategoryItem
                                key={childCategory.categoryId}
                                category={childCategory}
                                expandedCategories={expandedCategories}
                                toggleCategoryExpansion={toggleCategoryExpansion}
                                loading={loading}
                                editingCategory={editingCategory}
                                editingCategoryName={editingCategoryName}
                                setEditingCategoryName={setEditingCategoryName}
                                handleRestoreCategory={handleRestoreCategory}
                                startEditingCategory={startEditingCategory}
                                cancelEditingCategory={cancelEditingCategory}
                                level={level + 1}
                            />
                        ))}
                </div>
            )}
    </div>
    );
};

export default AdminCategoryPage;
