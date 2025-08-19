import { useState, useCallback, useMemo } from 'react';

export const useProductFilters = () => {
    const [filters, setFilters] = useState({
        categoryId: null,
        subCategoryId: null,
        priceRange: { min: 0, max: null },
        brands: [],
        properties: {},
        searchQuery: '',
        productType: 'ALL', // 'ALL', 'SIMPLE', 'VARIANT'
        sortBy: 'name',
        sortOrder: 'asc'
    });

    const updateFilter = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            categoryId: null,
            subCategoryId: null,
            priceRange: { min: 0, max: null },
            brands: [],
            properties: {},
            searchQuery: '',
            productType: 'ALL',
            sortBy: 'name',
            sortOrder: 'asc'
        });
    }, []);

    const getActiveFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.categoryId) count++;
        if (filters.subCategoryId) count++;
        if (filters.priceRange.max) count++;
        if (filters.brands.length > 0) count++;
        if (Object.keys(filters.properties).length > 0) count++;
        if (filters.searchQuery) count++;
        if (filters.productType !== 'ALL') count++;
        return count;
    }, [filters]);

    return {
        filters,
        updateFilter,
        clearFilters,
        getActiveFiltersCount
    };
};

