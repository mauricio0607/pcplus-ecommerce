import { Link } from "wouter";
import { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "laptop":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="text-primary text-xl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="2" y1="20" x2="22" y2="20"></line>
          </svg>
        );
      case "desktop":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="text-primary text-xl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        );
      case "keyboard":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="text-primary text-xl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
            <path d="M6 8h.01"></path>
            <path d="M10 8h.01"></path>
            <path d="M14 8h.01"></path>
            <path d="M18 8h.01"></path>
            <path d="M6 12h.01"></path>
            <path d="M10 12h.01"></path>
            <path d="M14 12h.01"></path>
            <path d="M18 12h.01"></path>
            <path d="M6 16h.01"></path>
            <path d="M10 16h.01"></path>
            <path d="M14 16h.01"></path>
            <path d="M18 16h.01"></path>
          </svg>
        );
      case "microchip":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="text-primary text-xl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            <rect x="9" y="9" width="6" height="6"></rect>
            <line x1="9" y1="2" x2="9" y2="4"></line>
            <line x1="15" y1="2" x2="15" y2="4"></line>
            <line x1="9" y1="20" x2="9" y2="22"></line>
            <line x1="15" y1="20" x2="15" y2="22"></line>
            <line x1="20" y1="9" x2="22" y2="9"></line>
            <line x1="20" y1="14" x2="22" y2="14"></line>
            <line x1="2" y1="9" x2="4" y2="9"></line>
            <line x1="2" y1="14" x2="4" y2="14"></line>
          </svg>
        );
      case "network-wired":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="text-primary text-xl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="9" height="9"></rect>
            <rect x="13" y="2" width="9" height="9"></rect>
            <rect x="2" y="13" width="9" height="9"></rect>
            <rect x="13" y="13" width="9" height="9"></rect>
          </svg>
        );
      case "headset":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="text-primary text-xl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="text-primary text-xl" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        );
    }
  };

  return (
    <Link href={`/?category=${category.slug}`}>
      <a className="flex flex-col items-center p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition">
        <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-3">
          {getIconComponent(category.icon)}
        </div>
        <span className="text-center font-medium">{category.name}</span>
      </a>
    </Link>
  );
}
