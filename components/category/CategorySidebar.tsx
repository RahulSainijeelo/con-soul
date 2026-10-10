import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Article {
  id: string;
  title: string;
  timeAgo?: string;
  publishDate: string;
  images?: any;
}

interface ApiResponse {
  data: Article[];
  pagination: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  type: string;
}

const fetchLatestNews = async (): Promise<Article[] | null> => {
  
  try {
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles?type=latest&limit=3`);
    
    // Check if response is successful before parsing JSON
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ApiResponse = await response.json();
    
    return data.data;
  } catch (err) {
    console.error("Error fetching latest news:", err);
    return null; // Return null instead of undefined
  } finally {
  }
};

export async function CategorySidebar() {
  
  const latestNews = await fetchLatestNews();
  
  // Handle both null and empty array cases
  if (!latestNews || latestNews.length === 0) {
    return (
      <aside className="space-y-8">
        {/* Latest News Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="border-l-4 border-black dark:border-white bg-gray-50 px-4 py-3">
            <h3 className="text-xl font-bold text-gray-900">Latest Articles</h3>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="text-center text-gray-500 py-8">
              No articles available
            </div>
          </div>
        </div>
      </aside>
    );
  }
 
  return (
    <aside className="space-y-8">
      {/* Latest News Section */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="border-l-4 border-black dark:border-white bg-gray-50 px-4 py-3">
          <h3 className="text-xl font-bold text-gray-900">Latest Articles</h3>
        </div>
        
        <div className="p-4 space-y-4">
          {latestNews.map((news) => (
            <Link key={news.id} href={`/article/${news.id}`} className="group block">
              <div className="flex space-x-3">
                <div className="relative w-20 h-14 flex-shrink-0 overflow-hidden rounded-md bg-gray-200">
                  <Image
                    src={news.images?.[0]?.url || '/api/placeholder/80/56'} // Safe access with fallback
                    alt={news.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-3 group-hover:text-black dark:text-white transition-colors mb-1">
                    {news.title}
                  </h4>
                  <p className="text-xs text-gray-500">{format(new Date(news.publishDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Optional: Popular Tags Section */}
      {/* <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="border-l-4 border-black dark:border-white bg-gray-50 px-4 py-3">
          <h3 className="text-xl font-bold text-gray-900">Popular Tags</h3>
        </div>
        
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {['Politics', 'Election', 'BJP', 'Congress', 'Modi', 'Parliament', 'Supreme Court', 'Economy'].map((tag) => (
              <Link key={tag} href={`/tag/${tag.toLowerCase()}`}>
                <Badge variant="outline" className="text-xs hover:bg-gray-50 dark:bg-gray-900 hover:border-gray-300 dark:border-gray-700 transition-colors">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </div> */}

      {/* Optional: Advertisement Section */}
      {/* <div className="bg-gray-100 p-6 rounded-lg text-center">
        <div className="relative w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden">
          <Image
            src="/api/placeholder/300/256"
            alt="Advertisement"
            fill
            className="object-cover"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">Advertisement</p>
      </div> */}
    </aside>
  );
}
