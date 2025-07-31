'use client';

import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useMovieVideos, useTVVideos } from '@/hooks/use-tmdb';
import { MediaType, TMDBVideo } from '@/types/tmdb';

interface VideoPlayerProps {
  mediaId: number;
  mediaType: MediaType;
  title: string;
}

export function VideoPlayer({ mediaId, mediaType, title }: VideoPlayerProps) {
  const [selectedVideo, setSelectedVideo] = useState<TMDBVideo | null>(null);

  // Fetch videos based on media type
  const {
    data: movieVideos,
    isLoading: movieLoading,
    isError: movieError,
  } = useMovieVideos(mediaType === MediaType.MOVIE ? mediaId : 0);

  const {
    data: tvVideos,
    isLoading: tvLoading,
    isError: tvError,
  } = useTVVideos(mediaType === MediaType.TV ? mediaId : 0);

  const videos = mediaType === MediaType.MOVIE ? movieVideos : tvVideos;
  const isLoading = mediaType === MediaType.MOVIE ? movieLoading : tvLoading;
  const isError = mediaType === MediaType.MOVIE ? movieError : tvError;

  // Select the best video (prefer official trailers)
  useEffect(() => {
    if (videos?.results && videos.results.length > 0) {
      // Try to find an official trailer
      const officialTrailers = videos.results.filter(
        (video) => video.official && video.type === 'Trailer' && video.site === 'YouTube'
      );
      const officialTrailer = officialTrailers[Math.floor(Math.random() * officialTrailers.length)];

      // Fallback to any random trailer
      const trailers = videos.results.filter(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
      );
      const anyTrailer = trailers[Math.floor(Math.random() * trailers.length)];

      // Fallback to any YouTube video
      const anyYouTube = videos.results.find((video) => video.site === 'YouTube');

      setSelectedVideo(officialTrailer || anyTrailer || anyYouTube || videos.results[0]);
    }
  }, [videos]);

  if (isLoading) {
    return (
      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Unable to load trailer</AlertTitle>
        <AlertDescription>
          We couldn&apos;t load the trailer for &quot;{title}&quot;. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!videos?.results || videos.results.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No trailer available</AlertTitle>
        <AlertDescription>
          Unfortunately, no trailer is available for &quot;{title}&quot; at this time.
        </AlertDescription>
      </Alert>
    );
  }

  if (!selectedVideo) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Video unavailable</AlertTitle>
        <AlertDescription>
          The trailer for &quot;{title}&quot; cannot be played right now.
        </AlertDescription>
      </Alert>
    );
  }

  // Render YouTube embed if available
  if (selectedVideo.site === 'YouTube') {
    return (
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=0&rel=0&modestbranding=1`}
          title={selectedVideo.name}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // Fallback for non-YouTube videos
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Unsupported video source</AlertTitle>
      <AlertDescription>
        This video is hosted on {selectedVideo.site}, which is not currently supported.
      </AlertDescription>
    </Alert>
  );
}
