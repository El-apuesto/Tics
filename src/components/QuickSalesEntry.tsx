// Add to AdminDashboard.tsx - Quick Sales Entry
const QuickSalesEntry = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const handleQuickSale = async () => {
    if (!selectedProduct) return;
    
    const product = products.find(p => p.id === selectedProduct);
    if (product) {
      await handleUpdateProduct(product.id, 'sales', (product.sales || 0) + quantity);
      setQuantity(1);
      // Show success message
      alert(`Added ${quantity} sale(s) for ${product.name}`);
    }
  };
  
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
      <h4 className="font-bold text-primary mb-2">Quick Sales Entry</h4>
      <div className="flex gap-2 items-center">
        <select 
          value={selectedProduct} 
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="px-2 py-1 border rounded"
        >
          <option value="">Select Product</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          min="1"
          className="w-20 px-2 py-1 border rounded"
        />
        <button 
          onClick={handleQuickSale}
          className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
        >
          Add Sale
        </button>
      </div>
    </div>
  );
};
