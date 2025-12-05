import type { Tile } from '../../types/slidingPuzzle.types';

interface Props {
  tile: Tile;
  imageUrl: string;
  gridSize: number;
  onClick: () => void;
}

function PuzzleTile({ tile, imageUrl, gridSize, onClick }: Props) {
  if (tile.isEmpty) {
    return <div className="aspect-square bg-gray-300 rounded" />;
  }

  const size = 100 / gridSize;
  const row = Math.floor(tile.imagePosition / gridSize);
  const col = tile.imagePosition % gridSize;

  return (
    <div
      onClick={onClick}
      className="aspect-square cursor-pointer hover:opacity-90 transition 
                 rounded border-2 border-white shadow active:scale-95"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${gridSize * 100}%`,
        backgroundPosition: `${col * size}% ${row * size}%`,
      }}
    />
  );
}

export default PuzzleTile;