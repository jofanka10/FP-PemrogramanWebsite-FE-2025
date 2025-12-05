import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface RankOrderItem {
  id: string;
  content: string;
  imageUrl?: string;
  correctOrder: number;
}

interface GameData {
  title: string;
  description: string;
  items: RankOrderItem[];
}

function PlayRankOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gameData, setGameData] = useState<GameData | null>(null);
  const [userOrder, setUserOrder] = useState<RankOrderItem[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    loadGame();
  }, [id]);

  const loadGame = () => {
    // Mock data - nanti diganti dengan API call
    const mockData: GameData = {
      title: 'Life Cycle of Plant',
      description: 'Arrange in correct order',
      items: [
        { id: '1', content: 'Seed', correctOrder: 1 },
        { id: '2', content: 'Germination', correctOrder: 2 },
        { id: '3', content: 'Growth', correctOrder: 3 },
        { id: '4', content: 'Flowering', correctOrder: 4 },
      ],
    };

    setGameData(mockData);
    const shuffled = [...mockData.items].sort(() => Math.random() - 0.5);
    setUserOrder(shuffled);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === userOrder.length - 1) return;

    const newOrder = [...userOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
    setUserOrder(newOrder);
  };

  const handleSubmit = () => {
    if (!gameData) return;

    const correctOrder = gameData.items
      .sort((a, b) => a.correctOrder - b.correctOrder)
      .map(item => item.id);

    const userOrderIds = userOrder.map(item => item.id);
    const correct = JSON.stringify(correctOrder) === JSON.stringify(userOrderIds);

    setIsCorrect(correct);
    setIsComplete(true);
  };

  const handleExit = () => {
    navigate('/');
  };

  if (!gameData) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{gameData.title}</h1>
              <p className="text-gray-600 mt-2">{gameData.description}</p>
            </div>
            <button
              onClick={handleExit}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Exit
            </button>
          </div>
        </div>

        {!isComplete ? (
          <>
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-medium">
                📋 Use arrows to arrange items in correct order
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {userOrder.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === userOrder.length - 1}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>

                  <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full font-bold">
                    {index + 1}
                  </div>

                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.content} className="w-16 h-16 object-cover rounded" />
                  )}

                  <div className="flex-1 font-medium">{item.content}</div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700"
            >
              Submit Answer
            </button>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">{isCorrect ? '🎉' : '😢'}</div>
            <h2 className={`text-3xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h2>

            {!isCorrect && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold mb-2">Correct Order:</h3>
                <ol className="list-decimal list-inside">
                  {gameData.items
                    .sort((a, b) => a.correctOrder - b.correctOrder)
                    .map(item => (
                      <li key={item.id}>{item.content}</li>
                    ))}
                </ol>
              </div>
            )}

            <button
              onClick={handleExit}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayRankOrder;