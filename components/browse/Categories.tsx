import React from 'react';

interface CategoriesProps {
  className?: string;
}

const Categories: React.FC<CategoriesProps> = ({ className = '' }) => {
  return (
    <div className={className}>
      {/* Categorías se implementarán aquí */}
    </div>
  );
};

export default Categories;
