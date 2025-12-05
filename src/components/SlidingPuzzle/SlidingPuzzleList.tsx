import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { slidingPuzzleApi } from '../../services/slidingPuzzleApi';
import type { SlidingPuzzle } from '../../types/slidingPuzzle.types';

function SlidingPuzzleList() {
  const [puzzles, setPuzzles] = useState<SlidingPuzzle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPuzzles();
  }, []);

  const loadPuzzles = async () => {
    try {
      const data = await slidingPuzzleApi.getAllPuzzles();
      setPuzzles(data);
    } catch (error) {
      console.error('Error loading puzzles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading puzzles...</div>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4">🧩 Sliding Puzzle</h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Choose a puzzle and test your skills!
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {puzzles.map(puzzle => (
            <Link
              key={puzzle.id}
              to={`/sliding-puzzle/${puzzle.id}`}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl 
                       transition-all hover:-translate-y-2"
            >
              <div className="relative h-48">
                <img src={puzzle.imageUrl} alt={puzzle.title} className="w-full h-full object-cover" />
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                  puzzle.difficulty === 'easy' ? 'bg-green-500' :
                  puzzle.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                } text-white`}>
                  {puzzle.difficulty}
                </span>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{puzzle.title}</h2>
                <p className="text-gray-600 mb-4">{puzzle.description}</p>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">📂 {puzzle.category}</span>
                  <span className="text-sm font-semibold text-blue-600">{puzzle.gridSize}x{puzzle.gridSize}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {puzzles.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            <p className="text-xl">No puzzles available. Please start the backend server.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SlidingPuzzleList;