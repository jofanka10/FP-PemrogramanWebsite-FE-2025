import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RankOrderItem {
  id: string;
  content: string;
  imageUrl?: string;
  correctOrder: number;
}

function CreateRankOrder() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<RankOrderItem[]>([
    { id: '1', content: '', correctOrder: 1 },
    { id: '2', content: '', correctOrder: 2 },
  ]);

  const addItem = () => {
    const newId = String(items.length + 1);
    setItems([...items, { id: newId, content: '', correctOrder: items.length + 1 }]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 2) return;
    const newItems = items.filter(item => item.id !== id);
    newItems.forEach((item, index) => {
      item.correctOrder = index + 1;
    });
    setItems(newItems);
  };

  const updateItem = (id: string, field: keyof RankOrderItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    console.log('Game data:', { title, description, items });
    alert('Game saved! (TODO: Connect to backend)');
    navigate('/my-projects');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-200 rounded">
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Create Rank Order Game</h1>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Game Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Life Cycle of Plant"
                className="w-full px-4 py-2 border rounded-lg"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
                className="w-full px-4 py-2 border rounded-lg"
                maxLength={500}
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Items (Correct Order)</h2>
            
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full font-bold">
                    {index + 1}
                  </div>

                  <input
                    type="text"
                    value={item.content}
                    onChange={(e) => updateItem(item.id, 'content', e.target.value)}
                    placeholder={`Item ${index + 1}`}
                    className="flex-1 px-4 py-2 border rounded-lg"
                  />

                  <input
                    type="text"
                    value={item.imageUrl || ''}
                    onChange={(e) => updateItem(item.id, 'imageUrl', e.target.value)}
                    placeholder="Image URL (optional)"
                    className="flex-1 px-4 py-2 border rounded-lg"
                  />

                  {items.length > 2 && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addItem}
              disabled={items.length >= 10}
              className="mt-4 w-full px-4 py-2 border-2 border-dashed rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              + Add Item (Max 10)
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title || items.some(item => !item.content)}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Create Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateRankOrder;