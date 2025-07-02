import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

interface SectionTitleProps {
  title: string;
  href?: string;
  linkText?: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ 
  title, 
  href, 
  linkText = 'Ver todo',
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <h2 className="text-2xl font-bold text-white hover:text-green-500 transition-colors cursor-pointer">
        {title}
      </h2>
      {href && (
        <Link 
          href={href}
          className="flex items-center text-sm font-semibold text-gray-400 hover:text-white transition-colors group"
        >
          {linkText}
          <FiChevronRight className="ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
};

export default SectionTitle;
