import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <h1 className="text-3xl md:text-4xl font-bold text-white">
        {title}
      </h1>
      {description && (
        <p className="text-gray-400 text-sm md:text-base">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
