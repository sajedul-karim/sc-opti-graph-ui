import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
}

interface ImageAsset {
  Id: string;
  Title: string;
  Renditions: Rendition[];
}

interface ImageResponse {
  PublicImageAsset: {
    items: ImageAsset[];
  };
}

interface ProductsResponse {
  ECProducts_V1: {
    total: number;
    items: Product[];
  };
}

const ImageDetail: React.FC = () => {
  const { imageId } = useParams<{ imageId: string }>();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { loading, error, data } = useQuery<ImageResponse>(QUERIES.GET_IMAGE, {
    variables: { assetGuid: imageId },
    client: damClient,
  });

  const { data: productsData } = useQuery<ProductsResponse>(QUERIES.GET_PRODUCTS_BY_COVER_GUID, {
    variables: { ContentGuid: imageId },
    skip: !imageId,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  const image = data?.PublicImageAsset?.items[0];
  if (!image) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Image Not Found</h2>
          <p>The requested image could not be found.</p>
        </div>
      </div>
    );
  }

  const renditions = image.Renditions || [];

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation Bar */}
      <div className="bg-gray-100 border-b sticky top-0 z-10">
        <div className="container mx-auto p-4">
          <button
            onClick={() => navigate('/search-dam')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <BackArrow />
            <span className="font-medium">Back to Gallery</span>
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
                    alt={`${image.Title} - ${renditions[selectedImage].Name}`}
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
                    alt={`${image.Title} - ${rendition.Name}`}
                    className="w-20 h-20 object-contain bg-gray-50"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{image.Title}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="px-3 py-1 bg-gray-100 rounded-full">ID: {image.Id}</span>
                {renditions[selectedImage] && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full">
                    Resolution: {renditions[selectedImage].Width} x {renditions[selectedImage].Height}
                  </span>
                )}
                <span className="px-3 py-1 bg-gray-100 rounded-full">
                  Format: {renditions[selectedImage]?.Name.split('.').pop()?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Download Button */}
            <div>
              <button 
                onClick={() => window.open(renditions[selectedImage]?.Url, '_blank')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Image
              </button>
            </div>

            {/* Products Section */}
            <div className="border-t pt-8">
              <h2 className="text-2xl font-semibold mb-6">Products Using This Image</h2>
              {productsData && productsData?.ECProducts_V1?.total > 0 ? (
                <div className="space-y-6">
                  <p className="text-sm text-gray-600">
                    Found {productsData.ECProducts_V1.total} products
                  </p>
                  {productsData.ECProducts_V1.items.map((product: Product) => (
                    <Link
                      key={product.ContentGuid}
                      to={`/product/${product.ContentGuid}`}
                      className="block bg-white rounded-xl border p-6 hover:shadow-lg transition-all group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {product.productTitle}
                          </h3>
                          <p className="text-2xl font-bold text-blue-600 mt-2">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(product.publishDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div
                        className="mt-4 prose prose-sm max-w-none text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html: product.productDescription.replace(
                            '<ol>',
                            '<ol class="list-decimal pl-5 space-y-2">'
                          ),
                        }}
                      />
                      <div className="mt-4 flex justify-end">
                        <span className="inline-flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
                          View Product Details
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-600">
                  <p className="font-medium">No products found</p>
                  <p className="text-sm mt-1">This image is not currently used in any products.</p>
                </div>
              )}
            </div>
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
            alt={`${image.Title} - ${renditions[selectedImage]?.Name}`}
            className="max-w-full max-h-[90vh] object-contain"
            loading="lazy"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ImageDetail; 
