import React from 'react';
import ClothingFilters from './ClothingFilters';
import GeneralFilters from './GeneralFilters';

const ProductFilterContainer = ({ onFilterChange, filters, selectedCategory }) => {
    console.log('ProductFilterContainer - selectedCategory:', selectedCategory);
    console.log('ProductFilterContainer - filters:', filters);
    
    const renderFiltersByCategory = () => {
        console.log('renderFiltersByCategory - selectedCategory:', selectedCategory);
        
        // Her zaman genel filtreleri göster
        const generalFilters = <GeneralFilters onFilterChange={onFilterChange} filters={filters} />;
        
        // Kategori özel filtreleri
        let categorySpecificFilters = null;
        
        switch (selectedCategory) {
            case 'Giyim':
                console.log('Giyim kategorisi seçildi, ClothingFilters render ediliyor');
                categorySpecificFilters = <ClothingFilters onFilterChange={onFilterChange} filters={filters} />;
                break;
            // Gelecekte diğer kategoriler için buraya eklenebilir
            // case 'Telefon':
            //     categorySpecificFilters = <PhoneFilters onFilterChange={onFilterChange} filters={filters} />;
            //     break;
            default:
                console.log('Kategori özel filtreleri yok, sadece genel filtreler gösteriliyor');
                break;
        }
        
        return (
            <div className="space-y-3 sm:space-y-4">
                {generalFilters}
                {categorySpecificFilters}
            </div>
        );
    };

    return (
        <div className="space-y-3 sm:space-y-4">
            {renderFiltersByCategory()}
        </div>
    );
};

export default ProductFilterContainer; 