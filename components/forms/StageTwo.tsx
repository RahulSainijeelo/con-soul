"use client";

import { UseFormReturn, FieldErrors } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, Quote, Eye, EyeOff, Youtube, Twitter, Info } from "lucide-react";
import { useState } from "react";

interface StageTwoProps {
  form: UseFormReturn<any>;
  errors: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function StageTwo({ form, errors, handleInputChange }: StageTwoProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [showEmbedHelp, setShowEmbedHelp] = useState(false);
  const content = form.watch("content");
  
  const insertText = (before: string, after: string = "") => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    form.setValue("content", newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const formatText = (type: string) => {
    switch (type) {
      case 'bold':
        insertText('**', '**');
        break;
      case 'italic':
        insertText('*', '*');
        break;
      case 'quote':
        insertText('\n> ');
        break;
      case 'list':
        insertText('\n- ');
        break;
      case 'youtube':
        insertText('\n[YOUTUBE]https://www.youtube.com/watch?v=VIDEO_ID[/YOUTUBE]\n');
        break;
      case 'twitter':
        insertText('\n[TWITTER]https://x.com/username/status/TWEET_ID[/TWITTER]\n');
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Article Content</h2>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowEmbedHelp(!showEmbedHelp)}
            className="flex items-center gap-2"
          >
            <Info size={16} />
            Embed Help
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2"
          >
            {isPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {isPreview ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      {/* Embed Instructions */}
      {showEmbedHelp && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">How to Embed Content</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <Youtube size={16} className="text-red-500" />
                YouTube Videos
              </h4>
              <p className="text-sm text-blue-700 mb-2">To embed a YouTube video:</p>
              <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
                <li>Go to the YouTube video you want to embed</li>
                <li>Copy the video URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)</li>
                <li>Use this format in your content:</li>
              </ol>
              <code className="block bg-white p-2 mt-2 rounded text-sm">
                [YOUTUBE]https://www.youtube.com/watch?v=VIDEO_ID[/YOUTUBE]
              </code>
            </div>

            <div>
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <Twitter size={16} className="text-blue-400" />
                Twitter/X Posts
              </h4>
              <p className="text-sm text-blue-700 mb-2">To embed a Twitter/X post:</p>
              <ol className="text-sm text-blue-700 list-decimal list-inside space-y-1">
                <li>Go to the Twitter/X post you want to embed</li>
                <li>Copy the post URL (e.g., https://twitter.com/username/status/1234567890)</li>
                <li>Use this format in your content:</li>
              </ol>
              <code className="block bg-white p-2 mt-2 rounded text-sm">
                [TWITTER]https://twitter.com/username/status/TWEET_ID[/TWITTER]
              </code>
            </div>
          </div>
        </div>
      )}

      {!isPreview ? (
        <>
          {/* Formatting Toolbar */}
          <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText('bold')}
              title="Bold"
            >
              <Bold size={16} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText('italic')}
              title="Italic"
            >
              <Italic size={16} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText('quote')}
              title="Quote"
            >
              <Quote size={16} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText('list')}
              title="List"
            >
              <List size={16} />
            </Button>
            <div className="border-l border-gray-300 mx-2"></div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText('youtube')}
              title="Embed YouTube Video"
              className="text-red-600 hover:text-red-700"
            >
              <Youtube size={16} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => formatText('twitter')}
              title="Embed Twitter Post"
              className="text-blue-500 hover:text-blue-600"
            >
              <Twitter size={16} />
            </Button>
          </div>

          {/* Content Editor */}
          <div>
            <Label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Article Content *
            </Label>
            <Textarea
              id="content"
              name="content"
              value={form.watch("content") || ""}
              onChange={handleInputChange}
              placeholder="Write your article here...

You can use simple formatting:
- **Bold text**
- *Italic text*  
- > Quotes
- - Lists

For embeds:
- [YOUTUBE]https://www.youtube.com/watch?v=VIDEO_ID[/YOUTUBE]
- [TWITTER]https://x.com/username/status/TWEET_ID[/TWITTER]

Start typing your story..."
              className="w-full min-h-[500px] font-mono text-sm leading-relaxed resize-y"
            />
            <div className="flex justify-between mt-1">
              <div>
                {errors.content && (
                  <p className="text-sm text-red-600">{errors.content.message}</p>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {content?.length || 0} characters
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Content Preview</h3>
          <div className="prose prose-gray max-w-none">
            <ContentPreview content={content || ""} />
          </div>
        </div>
      )}

      {/* Writing Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">Writing Tips</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Write clear, concise paragraphs</li>
          <li>• Use subheadings to break up long sections</li>
          <li>• Include quotes from relevant sources</li>
          <li>• Embed multimedia content to enhance your story</li>
          <li>• Fact-check all information before publishing</li>
        </ul>
      </div>
    </div>
  );
}

// Content Preview Component with Embed Support [web:177][web:178][web:182]
function ContentPreview({ content }: { content: string }) {
  if (!content) {
    return <p className="text-gray-500 italic">Start writing to see preview...</p>;
  }

  // Process the content for preview
  let processedContent = content
    // Handle YouTube embeds [web:177][web:178]
    .replace(/\[YOUTUBE\](https:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+))\[\/YOUTUBE\]/g, 
      (match, url, videoId) => {
        return `<div class="my-6">
          <div class="aspect-video w-full max-w-2xl mx-auto bg-gray-100 rounded-lg overflow-hidden border">
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
    // Handle Twitter embeds [web:182]
    .replace(/\[TWITTER\](https:\/\/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+))\[\/TWITTER\]/g,
      (match, url, tweetId) => {
        return `<div class="my-6">
          <div class="max-w-lg mx-auto border border-gray-200 rounded-lg p-4 bg-white">
            <div class="flex items-center space-x-3 mb-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-gray-900">Twitter Post</p>
                <p class="text-sm text-gray-500">Embedded content</p>
              </div>
            </div>
            <p class="text-gray-700 text-sm">
              This Twitter post will be embedded here when published.
            </p>
            <div class="mt-3 pt-3 border-t border-gray-100">
              <a href="${url}" target="_blank" class="text-blue-500 text-sm hover:underline">
                View original post →
              </a>
            </div>
          </div>
        </div>`;
      })
    // Handle basic markdown formatting
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-300 pl-4 italic text-gray-700 my-4">$1</blockquote>')
    .replace(/^- (.*$)/gim, '<li class="list-disc ml-6">$1</li>');

  // Convert line breaks to paragraphs
  const paragraphs = processedContent.split('\n\n').filter(p => p.trim());
  const htmlContent = paragraphs.map(paragraph => {
    if (paragraph.includes('<div class="my-6">') || paragraph.includes('<blockquote') || paragraph.includes('<li')) {
      return paragraph;
    }
    return `<p class="mb-4 leading-relaxed">${paragraph.replace(/\n/g, '<br>')}</p>`;
  }).join('');

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}
