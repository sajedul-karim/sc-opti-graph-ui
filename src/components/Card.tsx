import React from "react";
import { Link } from "react-router-dom";

interface Cover {
  assetGuid: string;
  assetType: string;
}

export interface ProductProps {
  ContentGuid: string;
  id: number;
  price: number;
  productDescription: string;
  productTitle: string;
  publishDate: string;
  cover: Cover;
  imageUrl: string;
}

const Card: React.FC<ProductProps> = ({
  ContentGuid,
  productTitle,
  productDescription,
  price,
  publishDate,
  imageUrl,
}) => {
  return (
    <Link 
      to={`/product/${ContentGuid}`} 
      className="block group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={productTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">
          {productTitle}
        </h2>

        {/* Price Tag */}
        <div className="mb-4">
          <span className="inline-block bg-blue-50 text-blue-700 text-lg font-semibold px-4 py-2 rounded-lg">
            ${price.toFixed(2)}
          </span>
        </div>

        {/* Description */}
        <div className="mb-4">
          <div 
            className="text-gray-600 line-clamp-2 text-sm"
            dangerouslySetInnerHTML={{ __html: productDescription }}
          />
        </div>

        {/* Footer Info */}
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Published: {new Date(publishDate).toLocaleDateString()}
          </div>
          <div className="text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
            View Details →
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
