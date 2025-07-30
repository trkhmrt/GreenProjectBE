import React, { useState, useEffect } from 'react';
import { getAllCategories, createCategory, deleteCategory, updateCategoryName, createSubCategory, deleteSubCategory, updateSubCategoryName, toggleCategoryActive } from '../../services/categoryService';
import { toggleCategoryPropertyStatus, addPropertyToCategoryByName, updatePropertyName, toggleCategoryPropertyDeleted } from '../../services/CategoryPropertyService';

const AdminCategoryPage = () => {
    const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('category'); // 'category' | 'filter'
    const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [expandedFilterCategoryId, setExpandedFilterCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addingProperty, setAddingProperty] = useState(null); // { categoryId: number, propertyName: string }
  const [newPropertyName, setNewPropertyName] = useState('');
  const [editingProperty, setEditingProperty] = useState(null); // { propertyId: number, newName: string }
  const [editingPropertyName, setEditingPropertyName] = useState('');
  
  // Kategori yönetimi için state'ler
  const [addingCategory, setAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null); // { categoryId: number, newName: string }
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [addingSubCategory, setAddingSubCategory] = useState(null); // { categoryId: number }
    const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [editingSubCategory, setEditingSubCategory] = useState(null); // { subCategoryId: number, newName: string }
  const [editingSubCategoryName, setEditingSubCategoryName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

  const fetchCategories = async () => {
    const response = await getAllCategories();
    setCategories(response.data);
  };

  // Kategori işlemleri
  const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
    
    setLoading(true);
        try {
            await createCategory(newCategoryName);
      await fetchCategories();
      setAddingCategory(false);
            setNewCategoryName('');
    } catch (error) {
      console.error('Kategori ekleme başarısız:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (categoryId) => {
    if (!editingCategoryName.trim()) return;
    
    setLoading(true);
    try {
      await updateCategoryName(categoryId, editingCategoryName);
      await fetchCategories();
      setEditingCategory(null);
      setEditingCategoryName('');
    } catch (error) {
      console.error('Kategori güncelleme başarısız:', error);
    } finally {
      setLoading(false);
        }
    };

  const handleDeleteCategory = async (categoryId) => {
    setLoading(true);
    try {
      await deleteCategory(categoryId);
      await fetchCategories();
    } catch (error) {
      console.error('Kategori silme başarısız:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubCategory = async (categoryId) => {
        if (!newSubCategoryName.trim()) return;
    
    setLoading(true);
        try {
      await createSubCategory({ categoryId, subCategoryName: newSubCategoryName });
      await fetchCategories();
      setAddingSubCategory(null);
            setNewSubCategoryName('');
    } catch (error) {
      console.error('Alt kategori ekleme başarısız:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubCategory = async (subCategoryId) => {
    if (!editingSubCategoryName.trim()) return;
    
    setLoading(true);
    try {
      await updateSubCategoryName(subCategoryId, editingSubCategoryName);
      await fetchCategories();
      setEditingSubCategory(null);
      setEditingSubCategoryName('');
    } catch (error) {
      console.error('Alt kategori güncelleme başarısız:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubCategory = async (subCategoryId) => {
    setLoading(true);
        try {
      await deleteSubCategory(subCategoryId);
      await fetchCategories();
    } catch (error) {
      console.error('Alt kategori silme başarısız:', error);
        } finally {
      setLoading(false);
        }
    };

  // Property işlemleri
  const handleToggleFilter = async (propertyId) => {
    setLoading(true);
    try {
      await toggleCategoryPropertyStatus(propertyId);
      await fetchCategories(); // Kategorileri yeniden çek
    } catch (error) {
      console.error('Toggle işlemi başarısız:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = async (categoryId) => {
    if (!newPropertyName.trim()) return;
    
    setLoading(true);
    try {
      await addPropertyToCategoryByName(categoryId, newPropertyName);
      await fetchCategories(); // Kategorileri yeniden çek
      setAddingProperty(null);
      setNewPropertyName('');
    } catch (error) {
      console.error('Property ekleme başarısız:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePropertyName = async (propertyId) => {
    if (!editingPropertyName.trim()) return;
    
    setLoading(true);
    try {
      await updatePropertyName(propertyId, editingPropertyName);
      await fetchCategories(); // Kategorileri yeniden çek
      setEditingProperty(null);
      setEditingPropertyName('');
    } catch (error) {
      console.error('Property güncelleme başarısız:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    setLoading(true);
    try {
      await toggleCategoryPropertyDeleted(propertyId);
      await fetchCategories(); // Kategorileri yeniden çek
    } catch (error) {
      console.error('Property silme başarısız:', error);
    } finally {
      setLoading(false);
        }
    };

  // Kategori aktif/pasif toggle
  const handleToggleCategoryActive = async (categoryId) => {
    setLoading(true);
        try {
      await toggleCategoryActive(categoryId);
      await fetchCategories();
    } catch (error) {
      console.error('Kategori aktif/pasif işlemi başarısız:', error);
        } finally {
      setLoading(false);
        }
    };

  // Helper fonksiyonlar
  const startAddingProperty = (categoryId) => {
    setAddingProperty(categoryId);
    setNewPropertyName('');
  };

  const cancelAddingProperty = () => {
    setAddingProperty(null);
    setNewPropertyName('');
  };

  const startEditingProperty = (propertyId, currentName) => {
    setEditingProperty(propertyId);
    setEditingPropertyName(currentName);
  };

  const cancelEditingProperty = () => {
    setEditingProperty(null);
    setEditingPropertyName('');
  };

  const startEditingCategory = (categoryId, currentName) => {
    setEditingCategory(categoryId);
    setEditingCategoryName(currentName);
  };

  const cancelEditingCategory = () => {
    setEditingCategory(null);
    setEditingCategoryName('');
  };

  const startEditingSubCategory = (subCategoryId, currentName) => {
    setEditingSubCategory(subCategoryId);
    setEditingSubCategoryName(currentName);
  };

  const cancelEditingSubCategory = () => {
    setEditingSubCategory(null);
    setEditingSubCategoryName('');
    };

  // Tab menü
    const tabList = [
        { key: 'category', label: 'Kategori Yönetimi' },
        { key: 'filter', label: 'Kategori Filtre Yönetimi' }
    ];

    return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Tab Menü */}
                <div className="flex border-b border-gray-200 mb-8">
                    {tabList.map(tab => (
                        <button
                            key={tab.key}
            className={`px-6 py-2 text-sm font-semibold transition-colors duration-200 ${activeTab === tab.key ? 'border-b-2 border-purple-600 text-purple-600 bg-white' : 'text-gray-500 hover:text-purple-600 border-b-2 border-transparent bg-gray-50 hover:bg-white'}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

      {/* Kategori Yönetimi Sekmesi */}
                {activeTab === 'category' && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Kategoriler</h2>
            {!addingCategory && (
              <button
                onClick={() => setAddingCategory(true)}
                disabled={loading}
                className="flex items-center gap-1 bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Yeni Kategori
                                </button>
                            )}
                        </div>

          {/* Yeni Kategori Ekleme */}
          {addingCategory && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded">
                        <input
                            type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Kategori adı girin..."
                className="border border-gray-300 rounded px-3 py-1 text-sm flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCategory();
                  if (e.key === 'Escape') { setAddingCategory(false); setNewCategoryName(''); }
                }}
                autoFocus
              />
              <button
                onClick={handleAddCategory}
                disabled={loading || !newCategoryName.trim()}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
              >
                Kaydet
              </button>
              <button
                onClick={() => { setAddingCategory(false); setNewCategoryName(''); }}
                disabled={loading}
                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 disabled:opacity-50"
              >
                İptal
              </button>
            </div>
          )}

          <ul>
            {categories.map(cat => (
              <li key={cat.categoryId} className="mb-2">
                <div className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded">
                  <div
                    className="flex items-center cursor-pointer flex-1"
                    onClick={() => setExpandedCategoryId(expandedCategoryId === cat.categoryId ? null : cat.categoryId)}
                  >
                    <span className="font-semibold text-gray-800">{cat.categoryName}</span>
                    {/* Aktif/Pasif Chip Badge */}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${cat.isActive ? 'bg-blue-500 text-white' : 'bg-gradient-to-r from-red-500 to-orange-400 text-white'}`}>
                      {cat.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ml-2 ${expandedCategoryId === cat.categoryId ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  {/* Aktif/Pasif Toggle Butonu */}
                  <button
                    onClick={() => handleToggleCategoryActive(cat.categoryId)}
                    disabled={loading}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${cat.isActive ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' : 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100'} disabled:opacity-50`}
                    title={cat.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                  >
                    {cat.isActive ? (
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ) : (
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                    {cat.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                  </button>
                  {/* Kategori Düzenleme/Silme Butonları */}
                  {editingCategory === cat.categoryId ? (
                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateCategory(cat.categoryId);
                          if (e.key === 'Escape') cancelEditingCategory();
                        }}
                                                            autoFocus
                                                        />
                      <button
                        onClick={() => handleUpdateCategory(cat.categoryId)}
                        disabled={loading || !editingCategoryName.trim()}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                      >
                        Kaydet
                      </button>
                      <button
                        onClick={cancelEditingCategory}
                        disabled={loading}
                        className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600 disabled:opacity-50"
                      >
                        İptal
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEditingCategory(cat.categoryId, cat.categoryName)}
                        disabled={loading}
                        className="text-orange-500 hover:text-orange-700 p-1"
                                                    title="Düzenle"
                                                >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path d="M16.862 5.487l1.65 1.65a2.121 2.121 0 0 1 0 3l-8.486 8.486a2 2 0 0 1-.707.464l-3.243 1.081a.5.5 0 0 1-.632-.632l1.08-3.243a2 2 0 0 1 .465-.707l8.486-8.486a2.121 2.121 0 0 1 3 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.categoryId)}
                        disabled={loading}
                        className="text-red-500 hover:text-red-700 p-1"
                                                    title="Sil"
                                                >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 7V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2M9 10v6M15 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                    </svg>
                      </button>
                                            </div>
                  )}
                                        </div>

                {/* Alt Kategoriler */}
                {expandedCategoryId === cat.categoryId && (
                  <ul className="ml-6 mt-2 border-l border-gray-200 pl-4">
                    {cat.subcategories.length === 0 && <li className="text-gray-400 text-sm py-1">Alt kategori yok</li>}
                                                        {cat.subcategories.map(sub => (
                      <li key={sub.id} className="flex items-center gap-2 py-1">
                        {editingSubCategory === sub.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-gray-700">-</span>
                                                                        <input
                                                                            type="text"
                              value={editingSubCategoryName}
                              onChange={(e) => setEditingSubCategoryName(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleUpdateSubCategory(sub.id);
                                if (e.key === 'Escape') cancelEditingSubCategory();
                              }}
                                                                            autoFocus
                                                                        />
                            <button
                              onClick={() => handleUpdateSubCategory(sub.id)}
                              disabled={loading || !editingSubCategoryName.trim()}
                              className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                            >
                              Kaydet
                            </button>
                            <button
                              onClick={cancelEditingSubCategory}
                              disabled={loading}
                              className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600 disabled:opacity-50"
                            >
                              İptal
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-gray-700">- {sub.name}</span>
                            <button
                              onClick={() => startEditingSubCategory(sub.id, sub.name)}
                              disabled={loading}
                              className="text-orange-500 hover:text-orange-700 p-1"
                              title="Düzenle"
                                                                >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                        <path d="M16.862 5.487l1.65 1.65a2.121 2.121 0 0 1 0 3l-8.486 8.486a2 2 0 0 1-.707.464l-3.243 1.081a.5.5 0 0 1-.632-.632l1.08-3.243a2 2 0 0 1 .465-.707l8.486-8.486a2.121 2.121 0 0 1 3 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                    </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteSubCategory(sub.id)}
                              disabled={loading}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Sil"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                        <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 7V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2M9 10v6M15 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                                    </svg>
                            </button>
                          </div>
                        )}
                                                            </li>
                                                        ))}
                    
                    {/* Yeni Alt Kategori Ekleme */}
                    {addingSubCategory === cat.categoryId ? (
                      <li className="flex items-center gap-2 py-1">
                        <span className="text-gray-700">-</span>
                                                            <input
                                                                type="text"
                                                                value={newSubCategoryName}
                          onChange={(e) => setNewSubCategoryName(e.target.value)}
                          placeholder="Alt kategori adı girin..."
                          className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddSubCategory(cat.categoryId);
                            if (e.key === 'Escape') { setAddingSubCategory(null); setNewSubCategoryName(''); }
                          }}
                                                                autoFocus
                                                            />
                        <button
                          onClick={() => handleAddSubCategory(cat.categoryId)}
                          disabled={loading || !newSubCategoryName.trim()}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                                                            >
                          Kaydet
                        </button>
                        <button
                          onClick={() => { setAddingSubCategory(null); setNewSubCategoryName(''); }}
                          disabled={loading}
                          className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600 disabled:opacity-50"
                                                            >
                                                                İptal
                        </button>
                      </li>
                    ) : (
                      <li className="py-1">
                        <button
                          onClick={() => setAddingSubCategory(cat.categoryId)}
                          disabled={loading}
                          className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-xs font-medium disabled:opacity-50"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                                                            Alt Kategori Ekle
                                                        </button>
                      </li>
                                                    )}
                  </ul>
                                        )}
              </li>
                                ))}
          </ul>
                    </div>
                )}

      {/* Kategori Filtre Yönetimi Sekmesi */}
                {activeTab === 'filter' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4">Kategori Filtreleri</h2>
          <ul>
            {categories.map(cat => (
              <li key={cat.categoryId} className="mb-2">
                <div
                  className="flex items-center cursor-pointer hover:bg-gray-50 rounded px-2 py-1"
                  onClick={() => setExpandedFilterCategoryId(expandedFilterCategoryId === cat.categoryId ? null : cat.categoryId)}
                >
                  <span className="font-semibold text-gray-800 flex-1">{cat.categoryName}</span>
                  <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedFilterCategoryId === cat.categoryId ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                                        </div>
                {expandedFilterCategoryId === cat.categoryId && (
                  <ul className="ml-6 mt-2 border-l border-gray-200 pl-4">
                    {cat.filters.length === 0 && <li className="text-gray-400 text-sm">Filtre yok</li>}
                    {cat.filters.map(filter => (
                      <li key={filter.propertyId} className="flex items-center gap-2 py-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!filter.isActive}
                          onChange={() => handleToggleFilter(filter.propertyId)}
                          disabled={loading}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-600" 
                                                        />
                        
                        {editingProperty === filter.propertyId ? (
                          <div className="flex items-center gap-2 flex-1">
                                                                <input
                                                                    type="text"
                              value={editingPropertyName}
                              onChange={(e) => setEditingPropertyName(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleUpdatePropertyName(filter.propertyId);
                                if (e.key === 'Escape') cancelEditingProperty();
                              }}
                                                                    autoFocus
                                                                />
                            <button
                              onClick={() => handleUpdatePropertyName(filter.propertyId)}
                              disabled={loading || !editingPropertyName.trim()}
                              className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                            >
                              Kaydet
                            </button>
                            <button
                              onClick={cancelEditingProperty}
                              disabled={loading}
                              className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600 disabled:opacity-50"
                            >
                              İptal
                            </button>
                        </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-gray-700">{filter.propertyValue}</span>
                            <button
                              onClick={() => startEditingProperty(filter.propertyId, filter.propertyValue)}
                              disabled={loading}
                              className="text-orange-500 hover:text-orange-700 p-1"
                              title="Düzenle"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M16.862 5.487l1.65 1.65a2.121 2.121 0 0 1 0 3l-8.486 8.486a2 2 0 0 1-.707.464l-3.243 1.081a.5.5 0 0 1-.632-.632l1.08-3.243a2 2 0 0 1 .465-.707l8.486-8.486a2.121 2.121 0 0 1 3 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(filter.propertyId)}
                              disabled={loading}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Sil"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 7V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2M9 10v6M15 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            </button>
                        </div>
                        )}
                      </li>
                    ))}
                    
                    {/* Yeni Property Ekleme Alanı */}
                    {addingProperty === cat.categoryId ? (
                      <li className="flex items-center gap-2 py-2 mt-2">
                        <input
                          type="text"
                          value={newPropertyName}
                          onChange={(e) => setNewPropertyName(e.target.value)}
                          placeholder="Property adı girin..."
                          className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddProperty(cat.categoryId);
                            if (e.key === 'Escape') cancelAddingProperty();
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleAddProperty(cat.categoryId)}
                          disabled={loading || !newPropertyName.trim()}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                        >
                          Kaydet
                        </button>
                        <button
                          onClick={cancelAddingProperty}
                          disabled={loading}
                          className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600 disabled:opacity-50"
                        >
                          İptal
                        </button>
                      </li>
                    ) : (
                      <li className="py-2 mt-2">
                        <button
                          onClick={() => startAddingProperty(cat.categoryId)}
                          disabled={loading}
                          className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-medium disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          Yeni Property Ekle
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            ))}
          </ul>
                </div>
            )}
    </div>
    );
};

export default AdminCategoryPage;