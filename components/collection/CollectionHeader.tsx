import { BiSearch } from 'react-icons/bi';

interface CollectionHeaderProps {
  title: string;
  searchPlaceholder: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  showViewToggle?: boolean;
}

export default function CollectionHeader({
  title,
  searchPlaceholder,
  searchQuery,
  onSearchChange,
  viewMode = 'grid',
  onViewModeChange,
  showViewToggle = false
}: CollectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-0">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-white/10 text-white rounded-full py-2 pl-10 pr-4 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        {showViewToggle && onViewModeChange && (
          <div className="flex bg-white/10 rounded-full p-1">
            <button 
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-full ${viewMode === 'grid' ? 'bg-white/20' : ''}`}
              title="Vista de cuadrícula"
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-sm"></div>
                ))}
              </div>
            </button>
            <button 
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-full ${viewMode === 'list' ? 'bg-white/20' : ''}`}
              title="Vista de lista"
            >
              <div className="w-4 h-4 flex flex-col justify-between">
                <div className="w-full h-0.5 bg-white rounded-full"></div>
                <div className="w-full h-0.5 bg-white rounded-full"></div>
                <div className="w-full h-0.5 bg-white rounded-full"></div>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
