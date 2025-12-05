import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { slidingPuzzleApi } from '../../services/slidingPuzzleApi';
import type { SlidingPuzzle, Tile } from '../../types/slidingPuzzle.types';
import PuzzleTile from '../../components/SlidingPuzzle/PuzzleTile';
import Timer from '../../components/SlidingPuzzle/Timer';

function SlidingPuzzleGame() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [puzzle, setPuzzle] = useState<SlidingPuzzle | null>(null);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [moves, setMoves] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    if (id) loadPuzzle();
  }, [id]);

  const loadPuzzle = async () => {
    try {
      const data = await slidingPuzzleApi.getPuzzleById(id!);
      setPuzzle(data);
      initGame(data.gridSize);
    } catch (error) {
      console.error('Error loading puzzle:', error);
    }
  };

  const initGame = (gridSize: number) => {
    const total = gridSize * gridSize;
    const newTiles: Tile[] = Array.from({ length: total }, (_, i) => ({
      id: i,
      position: i,
      imagePosition: i,
      isEmpty: i === total - 1,
    }));

    shuffle(newTiles, gridSize);
    setTiles(newTiles);
    setMoves(0);
    setTimeSpent(0);
    setIsComplete(false);
    setShowModal(false);
  };

  const shuffle = (tiles: Tile[], gridSize: number) => {
    for (let i = 0; i < 200; i++) {
      const movable = getMovable(tiles, gridSize);
      if (movable.length > 0) {
        const random = movable[Math.floor(Math.random() * movable.length)];
        swap(tiles, random.position, tiles.find(t => t.isEmpty)!.position);
      }
    }
  };

  const getMovable = (tiles: Tile[], gridSize: number): Tile[] => {
    const empty = tiles.find(t => t.isEmpty)!;
    const row = Math.floor(empty.position / gridSize);
    const col = empty.position % gridSize;
    const movable: Tile[] = [];

    [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize) {
        movable.push(tiles.find(t => t.position === nr * gridSize + nc)!);
      }
    });

    return movable;
  };

  const swap = (tiles: Tile[], pos1: number, pos2: number) => {
    const t1 = tiles.find(t => t.position === pos1)!;
    const t2 = tiles.find(t => t.position === pos2)!;
    [t1.position, t2.position] = [t2.position, t1.position];
  };

  const handleTileClick = (tile: Tile) => {
    if (isComplete || !puzzle) return;

    const movable = getMovable(tiles, puzzle.gridSize);
    if (!movable.some(t => t.id === tile.id)) return;

    const newTiles = [...tiles];
    const empty = newTiles.find(t => t.isEmpty)!;
    swap(newTiles, tile.position, empty.position);

    setTiles(newTiles);
    setMoves(m => m + 1);

    if (newTiles.every(t => t.position === t.imagePosition)) {
      setIsComplete(true);
      setShowModal(true);
    }
  };

  const handleSubmit = async () => {
    if (!playerName.trim() || !puzzle) return;
    try {
      await slidingPuzzleApi.submitScore(puzzle.id, playerName.trim(), moves, timeSpent);
      navigate('/sliding-puzzle');
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  if (!puzzle) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center mb-2">{puzzle.title}</h1>
        <p className="text-gray-600 text-center mb-6">{puzzle.description}</p>

        <div className="flex justify-around bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-600">Moves</div>
            <div className="text-3xl font-bold text-purple-600">{moves}</div>
          </div>
          <Timer isRunning={!isComplete} onUpdate={setTimeSpent} />
          <div className="text-center">
            <div className="text-sm text-gray-600">Grid</div>
            <div className="text-2xl font-bold">{puzzle.gridSize}x{puzzle.gridSize}</div>
          </div>
        </div>

        <div
          className="grid gap-1 bg-gray-300 p-2 rounded-lg mb-6"
          style={{ gridTemplateColumns: `repeat(${puzzle.gridSize}, 1fr)` }}
        >
          {tiles.map(tile => (
            <PuzzleTile
              key={tile.id}
              tile={tile}
              imageUrl={puzzle.imageUrl}
              gridSize={puzzle.gridSize}
              onClick={() => handleTileClick(tile)}
            />
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/sliding-puzzle')}
            className="flex-1 bg-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-300"
          >
            ← Back
          </button>
          <button
            onClick={() => initGame(puzzle.gridSize)}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            🔄 Restart
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
              <h2 className="text-3xl font-bold text-center mb-4">🎉 Complete!</h2>
              <p className="text-center mb-6">
                <strong>{moves}</strong> moves in <strong>{Math.floor(timeSpent/60)}:{(timeSpent%60).toString().padStart(2,'0')}</strong>
              </p>
              <input
                type="text"
                placeholder="Your name"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-lg mb-4"
                maxLength={50}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => initGame(puzzle.gridSize)}
                  className="flex-1 bg-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-400"
                >
                  Play Again
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!playerName.trim()}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold 
                           hover:bg-blue-700 disabled:bg-gray-300"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SlidingPuzzleGame;