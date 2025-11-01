import React from 'react';
import EditProductForm from '../components/product/EditProductForm';
import { useParams } from 'react-router-dom';
// import EditProductForm from '../components/product/EditProductForm';

const EditProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <EditProductForm productId={id || ''} />
    </div>
  );
};

export default EditProduct;