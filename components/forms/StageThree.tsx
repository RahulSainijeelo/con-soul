"use client";

import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

interface StageThreeProps {
  formData: {
    title: string;
    author: string;
    category: string;
    shortDescription: string;
    content: string;
    images?: any;
  };
}

export function StageThree({ formData }: StageThreeProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Article Preview</h2>
      
      {/* Article Preview */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        
        {/* Featured Image */}
        {formData.images && formData.images.length > 0 && (
          <div className="aspect-video w-full">
            <img 
              src={formData.images[0].url.url||formData.images[0].url} 
              alt={formData.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Article Header */}
        <div className="p-6">
          <div className="mb-4">
            <Badge className="bg-orange-500 text-white mb-2">
              {formData.category}
            </Badge>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {formData.title || "Article Title"}
          </h1>
          
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            {formData.shortDescription || "Article description will appear here."}
          </p>
          
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
              <span className="font-medium">{formData.author || "Author"}</span>
            </div>
            <span className="mx-3">•</span>
            <span>{new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          
          {/* Article Content Preview */}
          <div className="prose prose-lg max-w-none">
            <ContentPreview content={formData.content || ""} />
          </div>
          
          {/* Additional Images Gallery */}
          {formData.images && formData.images.length > 1 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.slice(1).map((image:any, idx:any) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden border">
                    <img 
                      src={image.url.url||image.url} 
                      alt={`Gallery image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metadata Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Word count:</span>
            <span className="ml-2 font-medium">{formData.content?.split(/\s+/).length || 0} words</span>
          </div>
          <div>
            <span className="text-gray-600">Reading time:</span>
            <span className="ml-2 font-medium">{Math.ceil((formData.content?.split(/\s+/).length || 0) / 200)} min</span>
          </div>
          <div>
            <span className="text-gray-600">Images:</span>
            <span className="ml-2 font-medium">{formData.images?.length || 0} images</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Content Preview Component with proper rendering
function ContentPreview({ content }: { content: string }) {
  useEffect(() => {
    // Load Twitter widget script after component mounts
    if (window.twttr) {
      window.twttr.widgets.load();
    } else {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      document.head.appendChild(script);
    }
  }, [content]);

  if (!content) {
    return <p className="text-gray-500 italic">No content to preview.</p>;
  }

  // Process the content for preview
  let processedContent = content
    // Handle YouTube embeds
    .replace(/\[YOUTUBE\](https:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+))\[\/YOUTUBE\]/g, 
      (match, url, videoId) => {
        return `<div class="my-8">
          <div class="aspect-video w-full max-w-3xl mx-auto bg-gray-100 rounded-lg overflow-hidden border shadow-sm">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/${videoId}" 
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
              class="w-full h-full">
            </iframe>
          </div>
        </div>`;
      })
    // Handle Twitter embeds with actual Twitter widget
    .replace(/\[TWITTER\](https:\/\/(?:twitter\.com|x\.com)\/(\w+)\/status\/(\d+))\[\/TWITTER\]/g,
      (match, url, username, tweetId) => {
        return `<div class="my-8 flex justify-center">
          <blockquote class="twitter-tweet" data-theme="light" data-width="550" data-dnt="true">
            <p lang="en" dir="ltr">Loading tweet...</p>
            <a href="${url}">View Tweet</a>
          </blockquote>
        </div>`;
      })
    // Handle basic markdown formatting
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>')
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-orange-300 pl-6 py-2 my-6 bg-orange-50 italic text-gray-700 rounded-r-lg">$1</blockquote>')
    .replace(/^- (.*$)/gim, '<li class="list-disc ml-6 mb-1 text-gray-800">$1</li>');

  // Convert line breaks to paragraphs
  const paragraphs = processedContent.split('\n\n').filter(p => p.trim());
  const htmlContent = paragraphs.map(paragraph => {
    if (paragraph.includes('<div class="my-8">') || 
        paragraph.includes('<blockquote') || 
        paragraph.includes('<li class="list-disc')) {
      return paragraph;
    }
    return `<p class="mb-6 leading-relaxed text-gray-800 text-lg">${paragraph.replace(/\n/g, '<br>')}</p>`;
  }).join('');

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      className="twitter-content"
    />
  );
}

// Add TypeScript declaration for Twitter widget
declare global {
  interface Window {
    twttr: {
      widgets: {
        load: (element?: HTMLElement | undefined) => Promise<void>;
      };
    };
  }
}
