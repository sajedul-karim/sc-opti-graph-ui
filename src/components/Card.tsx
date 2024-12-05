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
    <Link to={`/product/${ContentGuid}`} className="block">
      <div className="max-w-md rounded overflow-hidden shadow-lg border border-gray-200">
        <img src={imageUrl} alt={productTitle} className="w-full h-64 object-cover" />
        <div className="bg-gray-100 p-4">
          <h2 className="font-bold text-xl mb-2 text-center">{productTitle}</h2>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Description</h3>
            <div className="bg-gray-50 p-2 rounded shadow-sm">
              <p className="text-gray-700 line-clamp-2" dangerouslySetInnerHTML={{ __html: productDescription }}></p>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Price</h3>
            <div className="bg-gray-50 p-2 rounded shadow-sm">
              <p className="text-gray-700">${price}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Publish Date</h3>
            <div className="bg-gray-50 p-2 rounded shadow-sm">
              <p className="text-gray-700">{new Date(publishDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
