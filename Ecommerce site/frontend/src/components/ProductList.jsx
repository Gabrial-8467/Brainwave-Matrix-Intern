import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const fakeProducts = [
  {
    _id: 'fake1',
    name: 'Demo T-Shirt',
    description: 'A stylish demo t-shirt for your store.',
    price: 19.99,
    image: 'https://placehold.co/300x200?text=Demo+T-Shirt',
    countInStock: 5,
  },
  {
    _id: 'fake2',
    name: 'Demo Laptop',
    description: 'A powerful demo laptop for work and play.',
    price: 899.99,
    image: 'https://placehold.co/300x200?text=Demo+Laptop',
    countInStock: 2,
  },
  {
    _id: 'fake3',
    name: 'Demo Sofa',
    description: 'A comfy demo sofa for your living room.',
    price: 299.99,
    image: 'https://placehold.co/300x200?text=Demo+Sofa',
    countInStock: 1,
  },
  {
    _id: 'fake4',
    name: 'Demo Headphones',
    description: 'High-quality demo headphones for music lovers.',
    price: 59.99,
    image: 'https://placehold.co/300x200?text=Demo+Headphones',
    countInStock: 8,
  },
  {
    _id: 'fake5',
    name: 'Demo Coffee Maker',
    description: 'Brew the perfect cup with this demo coffee maker.',
    price: 49.99,
    image: 'https://placehold.co/300x200?text=Demo+Coffee+Maker',
    countInStock: 4,
  },
  {
    _id: 'fake6',
    name: 'Demo Sneakers',
    description: 'Trendy demo sneakers for everyday comfort.',
    price: 79.99,
    image: 'https://placehold.co/300x200?text=Demo+Sneakers',
    countInStock: 10,
  },
  {
    _id: 'fake7',
    name: 'Demo Smartwatch',
    description: 'Stay connected with this demo smartwatch.',
    price: 129.99,
    image: 'https://placehold.co/300x200?text=Demo+Smartwatch',
    countInStock: 6,
  },
  {
    _id: 'fake8',
    name: 'Demo Backpack',
    description: 'A durable demo backpack for work or travel.',
    price: 39.99,
    image: 'https://placehold.co/300x200?text=Demo+Backpack',
    countInStock: 7,
  },
  {
    _id: 'fake9',
    name: 'Demo Table Lamp',
    description: 'Brighten your space with this demo table lamp.',
    price: 24.99,
    image: 'https://placehold.co/300x200?text=Demo+Lamp',
    countInStock: 12,
  },
];

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  const displayProducts = products.length > 0 ? products : fakeProducts;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {displayProducts.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default ProductList; 