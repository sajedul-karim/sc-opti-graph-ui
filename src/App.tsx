import './App.css';
import { useQuery } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Card, { ProductProps } from './components/Card';
import ProductDetail from './components/ProductDetail';
import SearchDAM from './components/SearchDAM';
import ImageDetail from './components/ImageDetail';
import { QUERIES, fetchImageUrl } from './services/api';

function App() {
  const { loading, error, data } = useQuery(QUERIES.GET_ALL_PRODUCTS);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md mx-4">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Products</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gray-50">
              {/* Header */}
              <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left">
                      <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
                      <p className="text-gray-600 mt-1">
                        Discover our collection of {data.ECProducts_V1.items.length} products
                      </p>
                    </div>
                    <Link 
                      to="/search-dam" 
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl
                                hover:bg-blue-700 transition-all duration-200
                                focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                shadow-sm hover:shadow-md"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search in DAM
                    </Link>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="container mx-auto px-4 py-8">
                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {data.ECProducts_V1.items.map((item: ProductProps) => (
                    <Card
                      key={item.ContentGuid}
                      id={item.id}
                      ContentGuid={item.ContentGuid}
                      productTitle={item.productTitle}
                      cover={item.cover}
                      productDescription={item.productDescription}
                      publishDate={item.publishDate}
                      imageUrl={fetchImageUrl(item.cover.assetGuid)}
                      price={item.price}
                    />
                  ))}
                </div>

                {/* Empty State */}
                {data.ECProducts_V1.items.length === 0 && (
                  <div className="text-center py-16">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-sm">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
                      <p className="text-gray-600">Start by adding some products to your catalog.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <footer className="bg-white border-t py-8 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-600">
                  <p>&copy; {new Date().getFullYear()} Product Catalog. All rights reserved.</p>
                </div>
              </footer>
            </div>
          }
        />
        <Route path="/product/:ContentGuid" element={<ProductDetail />} />
        <Route path="/search-dam" element={<SearchDAM />} />
        <Route path="/dam-image/:imageId" element={<ImageDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
