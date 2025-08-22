import React, { useState } from 'react';
import SimpleProductForm from './SimpleProductForm';
import VariantProductForm from './VariantProductForm';
import AdminLayout from '../../layout/AdminLayout';

const AddProduct = () => {
    const [productType, setProductType] = useState('simple');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState([]);
    const [mainImageIdx, setMainImageIdx] = useState(0);

    return (
        <>
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold text-gray-900">Ürün Ekle</h1>
                    <p className="text-gray-600 mt-1">Yeni ürün ekleyin ve mağazanızı genişletin</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Product Type Selection */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Ürün Tipi Seçin</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setProductType('simple')}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                productType === 'simple'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Basit Ürün
                        </button>
                        <button
                            onClick={() => setProductType('variant')}
                            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                productType === 'variant'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Varyantlı Ürün
                        </button>
                    </div>
                </div>

                {/* Product Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    {productType === 'simple' ? (
                        <SimpleProductForm
                            images={images}
                            setImages={setImages}
                            mainImageIdx={mainImageIdx}
                            setMainImageIdx={setMainImageIdx}
                            isSubmitting={isSubmitting}
                            setIsSubmitting={setIsSubmitting}
                        />
                    ) : (
                        <VariantProductForm
                            images={images}
                            setImages={setImages}
                            mainImageIdx={mainImageIdx}
                            setMainImageIdx={setMainImageIdx}
                            isSubmitting={isSubmitting}
                            setIsSubmitting={setIsSubmitting}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default AddProduct;
