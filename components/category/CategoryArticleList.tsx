'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  author: string;
  publishDate: string;
  images: Array<{
    url: string;
    deleteUrl: string;
    preference?: string;
  }>;
  description?: string;
  category?: string;
  content?: string;
}

interface CategoryArticleListProps {
  articles: Article[];
  category: string;
  error?: string | null;
}

export function CategoryArticleList({ articles, category, error }: CategoryArticleListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (!content) return '';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">
          Error loading articles: {error}
        </div>
        <Link 
          href="/"
          className="inline-block bg-black dark:bg-white hover:bg-black/90 dark:bg-white/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📰</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No articles found
        </h3>
        <p className="text-gray-600 mb-6">
          There are no articles in this category yet. Check back soon for new content!
        </p>
        <Link 
          href="/"
          className="inline-block bg-black dark:bg-white hover:bg-black/90 dark:bg-white/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Browse All Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {articles.map((article, index) => (
        <article 
          key={article.id} 
          className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
        >
          <div className="md:flex">
            <div className="md:w-1/3 relative">
              <div className="aspect-[16/10] md:aspect-[4/3] relative overflow-hidden">
                <Image
                  src={article.images[0]?.url || '/api/placeholder/400/300'}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-black dark:bg-white text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {category.toUpperCase()}
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 p-6">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <div className="w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full mr-2 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {article.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium text-gray-700">{article.author}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(article.publishDate)}</span>
              </div>
              
              <Link href={`/article/${article.id}`} className="group">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-black dark:text-white transition-colors line-clamp-2">
                  {article.title}
                </h2>
                
                {article.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {truncateContent(article.description)}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-black dark:text-white font-medium text-sm group-hover:text-black dark:text-white transition-colors">
                    Read more →
                  </span>
                  <div className="flex items-center text-xs text-gray-400">
                    <span>{index === 0 ? 'Featured' : `Article ${index + 1}`}</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
