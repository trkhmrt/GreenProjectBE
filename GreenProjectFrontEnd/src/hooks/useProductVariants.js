import { useState, useCallback, useMemo } from 'react';

export const useProductVariants = (productVariants = []) => {
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedProperties, setSelectedProperties] = useState({});

    const availableVariants = useMemo(() => {
        return productVariants.filter(variant => {
            // Seçilen özelliklere göre varyant filtreleme
            return Object.entries(selectedProperties).every(([propertyId, value]) => {
                const variantProperty = variant.properties?.find(prop => prop.propertyId.toString() === propertyId);
                return variantProperty && variantProperty.value === value;
            });
        });
    }, [productVariants, selectedProperties]);

    const selectProperty = useCallback((propertyId, value) => {
        setSelectedProperties(prev => ({
            ...prev,
            [propertyId]: value
        }));
    }, []);

    const getVariantByProperties = useCallback((properties) => {
        return productVariants.find(variant => {
            return Object.entries(properties).every(([propertyId, value]) => {
                const variantProperty = variant.properties?.find(prop => prop.propertyId.toString() === propertyId);
                return variantProperty && variantProperty.value === value;
            });
        });
    }, [productVariants]);

    // Tüm benzersiz özellik değerlerini al
    const getUniquePropertyValues = useCallback((propertyId) => {
        const values = new Set();
        productVariants.forEach(variant => {
            const property = variant.properties?.find(prop => prop.propertyId.toString() === propertyId);
            if (property && property.value) {
                values.add(property.value);
            }
        });
        return Array.from(values);
    }, [productVariants]);

    // Tüm benzersiz özellikleri al
    const getUniqueProperties = useCallback(() => {
        const properties = new Map();
        productVariants.forEach(variant => {
            variant.properties?.forEach(prop => {
                if (!properties.has(prop.propertyId)) {
                    properties.set(prop.propertyId, {
                        propertyId: prop.propertyId,
                        propertyName: prop.propertyName
                    });
                }
            });
        });
        return Array.from(properties.values());
    }, [productVariants]);

    return {
        selectedVariant,
        setSelectedVariant,
        selectedProperties,
        selectProperty,
        availableVariants,
        getVariantByProperties,
        getUniquePropertyValues,
        getUniqueProperties
    };
};
