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

  if (productLoading || imageLoading) return <div>Loading...</div>;
  if (productError) return <div>Error: {productError.message}</div>;
  if (imageError) return <div>Error: {imageError.message}</div>;
  if (!product) return <div>Product not found</div>;

  const renditions = imageData?.PublicImageAsset?.items[0]?.Renditions || [];
  
  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <BackArrow />
        Back to Home
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{product.productTitle}</h1>

        {/* Image Gallery Section */}
        <div className="mb-8">
          {/* Main Image */}
          <div className="mb-4 border rounded-lg overflow-hidden bg-gray-50">
            {renditions.length > 0 && (
              <button onClick={() => setIsModalOpen(true)} className="w-full cursor-zoom-in">
                <img
                  src={renditions[selectedImage].Url}
                  alt={`${product.productTitle} - ${renditions[selectedImage].Name}`}
                  className="w-full h-[500px] object-contain mx-auto"
                />
              </button>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto py-2 px-1">
            {renditions.map((rendition: Rendition, index: number) => (
              <button
                key={rendition.Name}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${
                  selectedImage === index
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <img
                  src={rendition.Url}
                  alt={`${product.productTitle} - ${rendition.Name}`}
                  className="w-24 h-24 object-contain bg-gray-50"
                />
              </button>
            ))}
          </div>

          {/* Image Details text */}
          {renditions[selectedImage] && (
            <div className="mt-2 text-sm text-gray-600">
              <p className="font-medium">{renditions[selectedImage].Name}</p>
              <p>
                Resolution: {renditions[selectedImage].Width} x {renditions[selectedImage].Height}
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <img
            src={renditions[selectedImage]?.Url}
            alt={`${product.productTitle} - ${renditions[selectedImage]?.Name}`}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </Modal>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
            <p dangerouslySetInnerHTML={{ __html: product.productDescription.replace('<ol>', '<ol class="list-decimal pl-5">') }} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Price</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-lg text-blue-600 font-medium">${product.price}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Publish Date</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>{new Date(product.publishDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
