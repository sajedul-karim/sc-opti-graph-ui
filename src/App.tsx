import './App.css';
import { useQuery } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Card, { ProductProps } from './components/Card';
import ProductDetail from './components/ProductDetail';
import { QUERIES, fetchImageUrl } from './services/api';


function App() {
  const { loading, error, data } = useQuery(QUERIES.GET_ALL_PRODUCTS);
  if (loading) return <p>Loading Prod...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </div>
        } />
        <Route path="/product/:ContentGuid" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
