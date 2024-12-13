import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERIES } from '../services/api';
import { damClient } from '../ApolloClient';
import BackArrow from './icons/BackArrow';
import Modal from '../components/Modal';

interface Rendition {
  Name: string;
  Url: string;
  Height: number;
  Width: number;
}

interface Product {
  ContentGuid: string;
  id: number;
  price: number;
  productDescription: string;
  productTitle: string;
  publishDate: string;
  cover: {
    assetGuid: string;
    assetType: string;
  };
}

const ProductDetail: React.FC = () => {
  const { ContentGuid } = useParams<{ ContentGuid: string }>();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { loading: productLoading, error: productError, data: productData } = useQuery(
    QUERIES.GET_PRODUCT, 
    { variables: { ContentGuid } }
  );

  const product: Product = productData?.ECProducts_V1?.items[0];

  const { loading: imageLoading, error: imageError, data: imageData } = useQuery(
    QUERIES.GET_IMAGE, 
    {
      variables: { assetGuid: product?.cover?.assetGuid },
      client: damClient,
      skip: !product?.cover?.assetGuid,
    }
  );

  if (productLoading || imageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (productError || imageError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md mx-4">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Product</h2>
          <p className="text-gray-600">{productError?.message || imageError?.message}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md mx-4">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600">The requested product could not be found.</p>
        </div>
      </div>
    );
  }

  const renditions = imageData?.PublicImageAsset?.items[0]?.Renditions || [];

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation Bar */}
      <div className="bg-gray-100 border-b sticky top-0 z-10">
        <div className="container mx-auto p-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <BackArrow />
            <span className="font-medium">Back to Products</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Left Column - Image Gallery */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="aspect-square bg-gray-50 rounded-xl border overflow-hidden">
              {renditions.length > 0 && (
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className="w-full h-full cursor-zoom-in group"
                >
                  <img
                    src={renditions[selectedImage].Url}
                    alt={`${product.productTitle} - ${renditions[selectedImage].Name}`}
                    className="w-full h-full object-contain transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </button>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {renditions.map((rendition: Rendition, index: number) => (
                <button
                  key={rendition.Name}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                    selectedImage === index
                      ? 'ring-2 ring-blue-500 ring-offset-2'
                      : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
                  }`}
                >
                  <img
                    src={rendition.Url}
                    alt={`${product.productTitle} - ${rendition.Name}`}
                    className="w-20 h-20 object-contain bg-gray-50"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-8">
            {/* Title and Price */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.productTitle}</h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                  Published: {new Date(product.publishDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: product.productDescription.replace(
                      '<ol>',
                      '<ol class="list-decimal pl-5 space-y-2">'
                    ),
                  }}
                />
              </div>
            </div>

            {/* Image Details */}
            {renditions[selectedImage] && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Image Details</h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="px-3 py-1 bg-white rounded-full shadow-sm">
                      Format: {renditions[selectedImage].Name.split('.').pop()?.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 bg-white rounded-full shadow-sm">
                      Resolution: {renditions[selectedImage].Width} x {renditions[selectedImage].Height}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="relative">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={renditions[selectedImage]?.Url}
            alt={`${product.productTitle} - ${renditions[selectedImage]?.Name}`}
            className="max-w-full max-h-[90vh] object-contain"
            loading="lazy"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetail;
