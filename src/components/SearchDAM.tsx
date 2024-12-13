import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { QUERIES } from '../services/api';
import { damClient } from '../ApolloClient';
import BackArrow from './icons/BackArrow';
import { Link, useNavigate } from 'react-router-dom';

interface Rendition {
  Name: string;
  Url: string;
  Height: number;
  Width: number;
}

interface ImageAsset {
  Id: string;
  Title: string;
  Url: string;
  Renditions: Rendition[];
  Labels: {
    Group: {
      Id: string;
      Name: string;
    };
    Values: {
      Id: string;
      Name: string;
    }[];
  }[];
}

const SearchDAM: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(
    searchTerm ? QUERIES.SEARCH_IMAGE_QUERY : QUERIES.SEARCH_ALL_IMAGE_QUERY,
    {
      variables: searchTerm ? { labelGroupName: searchTerm } : undefined,
      client: damClient,
    }
  );

  const imageAssets: ImageAsset[] = data?.PublicImageAsset?.items || [];

  const handleSearch = () => {
    const trimmedValue = inputValue.trim();
    setSearchTerm(trimmedValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto p-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <BackArrow />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Digital Asset Gallery</h1>
          <p className="text-lg text-gray-600 mb-8">
            Search through our collection of high-quality images
          </p>
          
          {/* Search Bar */}
          <div className="flex gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search by label or keyword..."
                className="w-full pl-12 py-4 text-lg border border-gray-300 rounded-xl 
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all duration-200 outline-none
                          placeholder:text-gray-400"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl
                        hover:bg-blue-700 transition-colors duration-200
                        focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Search
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500">
              <p className="text-lg font-semibold">Error loading images</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        )}

        {/* Image Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {imageAssets.map((asset) => (
              <Link
                to={`/dam-image/${asset.Id}`}
                key={asset.Id}
                className="group bg-white rounded-xl overflow-hidden border hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  <img
                    src={asset.Renditions[0]?.Url}
                    alt={asset.Title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {asset.Title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {asset.Labels.map((label) => (
                      <span
                        key={label.Group.Id}
                        className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
                      >
                        {label.Group.Name}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && imageAssets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg font-semibold">No images found</p>
              <p className="text-sm">Try adjusting your search terms</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDAM;
