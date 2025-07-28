'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentCard } from '@/components/content-card';
import { TrailerModal } from '@/components/trailer-modal';
import { Shuffle, RotateCcw } from 'lucide-react';
import { mockContentData } from '@/lib/mock-data';

interface UserPreferences {
  country: string;
  genres: string[];
  recency: string;
}

interface ContentDisplayProps {
  preferences: UserPreferences;
  onBackToPreferences: () => void;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'movie' | 'tv';
  platform: string;
  coverArt: string;
  rating: number;
  year: number;
  genre: string[];
  trailerUrl?: string;
  description: string;
}

const PLATFORMS = [
  { id: 'netflix', name: 'Netflix', color: '#E50914' },
  { id: 'prime', name: 'Prime Video', color: '#00A8E6' },
  { id: 'disney', name: 'Disney+', color: '#113CCF' },
  { id: 'appletv', name: 'Apple TV+', color: '#1D1D1F' },
  { id: 'max', name: 'MAX', color: '#7B2CBF' },
];

export function ContentDisplay({ preferences, onBackToPreferences }: ContentDisplayProps) {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState<ContentItem | null>(null);

  useEffect(() => {
    // Initialize with mock data
    setContentItems(mockContentData);
  }, []);

  const handleShuffle = async (itemId?: string) => {
    setIsShuffling(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (itemId) {
      // Shuffle individual item
      setContentItems(prev => prev.map(item => {
        if (item.id === itemId) {
          // In a real app, this would fetch new content from API
          const shuffledItem = { ...item, id: `${item.id}-shuffled-${Date.now()}` };
          return shuffledItem;
        }
        return item;
      }));
    } else {
      // Shuffle all items
      setContentItems(mockContentData.map(item => ({
        ...item,
        id: `${item.id}-shuffled-${Date.now()}`
      })));
    }
    
    setIsShuffling(false);
  };

  const handleTrailerClick = (item: ContentItem) => {
    setSelectedTrailer(item);
  };

  const groupedContent = PLATFORMS.reduce((acc, platform) => {
    const platformContent = contentItems.filter(item => item.platform === platform.id);
    const movie = platformContent.find(item => item.type === 'movie');
    const tvShow = platformContent.find(item => item.type === 'tv');
    
    acc[platform.id] = { movie, tvShow, platform };
    return acc;
  }, {} as Record<string, { movie?: ContentItem; tvShow?: ContentItem; platform: typeof PLATFORMS[0] }>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Your Recommendations</h2>
        <p className="text-muted-foreground">
          Based on your preferences, here are the top-rated options available tonight
        </p>
        
        {/* Preferences Summary */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <Badge variant="secondary">📍 {preferences.country === 'US' ? 'USA' : preferences.country}</Badge>
          {preferences.genres.map(genre => (
            <Badge key={genre} variant="secondary">🎭 {genre}</Badge>
          ))}
          <Badge variant="secondary">📅 {preferences.recency}</Badge>
        </div>
      </div>

      {/* Global Shuffle Button */}
      <div className="text-center">
        <Button
          onClick={() => handleShuffle()}
          disabled={isShuffling}
          size="lg"
          className="gap-2"
        >
          {isShuffling ? (
            <RotateCcw className="w-4 h-4 animate-spin" />
          ) : (
            <Shuffle className="w-4 h-4" />
          )}
          Shuffle All Options
        </Button>
      </div>

      {/* Content Grid */}
      <div className="space-y-8">
        {PLATFORMS.map(platform => {
          const content = groupedContent[platform.id];
          
          return (
            <Card key={platform.id} className="overflow-hidden">
              <CardContent className="p-6">
                {/* Platform Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: platform.color }}
                  />
                  <h3 className="text-xl font-semibold">{platform.name}</h3>
                </div>

                {/* Content Items */}
                <div className="grid grid-cols-1 gap-4
                               md:grid-cols-2"
                >
                  {content.movie && (
                    <ContentCard
                      item={content.movie}
                      onTrailerClick={handleTrailerClick}
                      onShuffle={handleShuffle}
                      isShuffling={isShuffling}
                    />
                  )}
                  {content.tvShow && (
                    <ContentCard
                      item={content.tvShow}
                      onTrailerClick={handleTrailerClick}
                      onShuffle={handleShuffle}
                      isShuffling={isShuffling}
                    />
                  )}
                  
                  {!content.movie && !content.tvShow && (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      No content available for {platform.name} with your current preferences
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Back Button */}
      <div className="text-center pt-4">
        <Button
          variant="outline"
          onClick={onBackToPreferences}
          size="lg"
        >
          Change Preferences
        </Button>
      </div>

      {/* Trailer Modal */}
      {selectedTrailer && (
        <TrailerModal
          item={selectedTrailer}
          isOpen={!!selectedTrailer}
          onClose={() => setSelectedTrailer(null)}
        />
      )}
    </div>
  );
}