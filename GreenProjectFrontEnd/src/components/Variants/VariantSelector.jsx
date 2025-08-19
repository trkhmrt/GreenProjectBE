import React, { useEffect } from 'react';
import { useProductVariants } from '../../hooks/useProductVariants';

const VariantSelector = ({ productVariants, onVariantChange }) => {
    const {
        selectedVariant,
        setSelectedVariant,
        selectedProperties,
        selectProperty,
        availableVariants,
        getUniqueProperties,
        getUniquePropertyValues
    } = useProductVariants(productVariants);

    // İlk varyantı otomatik seç
    useEffect(() => {
        if (productVariants.length > 0 && !selectedVariant) {
            setSelectedVariant(productVariants[0]);
        }
    }, [productVariants, selectedVariant, setSelectedVariant]);

    // Varyant değiştiğinde parent'a bildir
    useEffect(() => {
        if (selectedVariant && onVariantChange) {
            onVariantChange(selectedVariant);
        }
    }, [selectedVariant, onVariantChange]);

    const uniqueProperties = getUniqueProperties();

    const handlePropertySelect = (propertyId, value) => {
        selectProperty(propertyId, value);
        
        // Seçilen özelliklere göre varyant bul
        const newSelectedProperties = {
            ...selectedProperties,
            [propertyId]: value
        };
        
        const matchingVariant = productVariants.find(variant => {
            return Object.entries(newSelectedProperties).every(([propId, propValue]) => {
                const variantProperty = variant.properties?.find(prop => prop.propertyId.toString() === propId);
                return variantProperty && variantProperty.value === propValue;
            });
        });
        
        if (matchingVariant) {
            setSelectedVariant(matchingVariant);
        }
    };

    if (productVariants.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {/* Özellik Seçicileri */}
            {uniqueProperties.map(property => {
                const propertyValues = getUniquePropertyValues(property.propertyId);
                
                return (
                    <div key={property.propertyId} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-3">
                            {property.propertyName}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {propertyValues.map(value => {
                                const isSelected = selectedProperties[property.propertyId] === value;
                                const isAvailable = availableVariants.some(variant => {
                                    const variantProperty = variant.properties?.find(prop => 
                                        prop.propertyId.toString() === property.propertyId
                                    );
                                    return variantProperty && variantProperty.value === value;
                                });
                                
                                return (
                                    <button
                                        key={value}
                                        onClick={() => handlePropertySelect(property.propertyId, value)}
                                        disabled={!isAvailable}
                                        className={`px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${
                                            isSelected
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : isAvailable
                                                ? 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                                                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                        }`}
                                    >
                                        {value}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
            
            {/* Seçilen Varyant Bilgileri */}
            {selectedVariant && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-3">Seçilen Varyant</h4>
                    <div className="space-y-2 text-sm text-green-700">
                        <div className="flex justify-between">
                            <span>SKU:</span>
                            <span className="font-medium">{selectedVariant.sku}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Fiyat:</span>
                            <span className="font-medium">{selectedVariant.price} TL</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Stok:</span>
                            <span className={`font-medium ${selectedVariant.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {selectedVariant.stockQuantity > 0 ? `${selectedVariant.stockQuantity} adet` : 'Stokta yok'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VariantSelector;