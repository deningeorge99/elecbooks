import React, { useState } from 'react';
import { FiTrash2, FiX } from 'react-icons/fi';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { deleteProduct } from '../../services/productService';
import { useNavigate } from 'react-router-dom';

interface DeleteProductModalProps {
  productId: number;
  productName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const TrashIcon = FiTrash2 as React.ComponentType<{ className?: string }>;
const XIcon = FiX as React.ComponentType<{ className?: string }>;

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({ 
  productId, 
  productName, 
  onClose, 
  onSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    
    try {
      await deleteProduct(productId);
      if (onSuccess) {
        onSuccess();
      } else {
        // Navigate to seller dashboard if no success handler provided
        navigate('/seller/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <Card.Body>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center">
              <TrashIcon className="mr-2 text-red-500" /> Delete Product
            </h3>
            <Button variant="outline" onClick={onClose}>
              <XIcon />
            </Button>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <p className="mb-6">
            Are you sure you want to delete <strong>{productName}</strong>? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleDelete} 
              disabled={loading}
              className="bg-red-500 hover:bg-red-600"
            >
              {loading ? 'Deleting...' : 'Delete Product'}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DeleteProductModal;