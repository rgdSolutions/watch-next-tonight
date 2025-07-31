import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MediaType } from '@/types/tmdb';

import { VideoPlayer } from '../video-player';

// Mock the hooks module
const mockUseMovieVideos = vi.fn();
const mockUseTVVideos = vi.fn();

vi.mock('@/hooks/use-tmdb', () => ({
  useMovieVideos: () => mockUseMovieVideos(),
  useTVVideos: () => mockUseTVVideos(),
}));

const mockYouTubeVideo = {
  id: '1',
  iso_639_1: 'en',
  iso_3166_1: 'US',
  key: 'dQw4w9WgXcQ',
  name: 'Official Trailer',
  site: 'YouTube',
  size: 1080,
  type: 'Trailer',
  official: true,
  published_at: '2024-01-01T00:00:00.000Z',
};

const mockVimeoVideo = {
  id: '2',
  iso_639_1: 'en',
  iso_3166_1: 'US',
  key: '123456789',
  name: 'Teaser',
  site: 'Vimeo',
  size: 720,
  type: 'Teaser',
  official: false,
  published_at: '2024-01-01T00:00:00.000Z',
};

describe('VideoPlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMovieVideos.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });
    mockUseTVVideos.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });
  });

  it('should render loading state while fetching videos', () => {
    mockUseMovieVideos.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<VideoPlayer mediaId={123} mediaType={MediaType.MOVIE} title="Test Movie" />);

    const skeleton = document.querySelector('.aspect-video');
    expect(skeleton).toBeInTheDocument();
  });

  it('should render YouTube video player when trailer is available', async () => {
    mockUseMovieVideos.mockReturnValue({
      data: { id: 123, results: [mockYouTubeVideo] },
      isLoading: false,
      error: null,
    });

    render(<VideoPlayer mediaId={123} mediaType={MediaType.MOVIE} title="Test Movie" />);

    await waitFor(() => {
      const iframe = screen.getByTitle('Official Trailer');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute(
        'src',
        expect.stringContaining('youtube.com/embed/dQw4w9WgXcQ')
      );
    });
  });

  it('should show no trailer message when no videos are available', async () => {
    mockUseMovieVideos.mockReturnValue({
      data: { id: 123, results: [] },
      isLoading: false,
      error: null,
    });

    render(<VideoPlayer mediaId={123} mediaType={MediaType.MOVIE} title="Test Movie" />);

    await waitFor(() => {
      expect(screen.getByText('No trailer available')).toBeInTheDocument();
      expect(
        screen.getByText(/Unfortunately, no trailer is available for "Test Movie"/)
      ).toBeInTheDocument();
    });
  });

  it('should prioritize official trailers over other videos', async () => {
    const unofficialTrailer = { ...mockYouTubeVideo, official: false, key: 'unofficial' };
    const officialTrailer = { ...mockYouTubeVideo, official: true, key: 'official' };

    mockUseMovieVideos.mockReturnValue({
      data: { id: 123, results: [unofficialTrailer, officialTrailer] },
      isLoading: false,
      error: null,
    });

    render(<VideoPlayer mediaId={123} mediaType={MediaType.MOVIE} title="Test Movie" />);

    await waitFor(() => {
      const iframe = screen.getByTitle('Official Trailer');
      expect(iframe).toHaveAttribute('src', expect.stringContaining('youtube.com/embed/official'));
    });
  });

  it('should show unsupported source message for non-YouTube videos', async () => {
    mockUseMovieVideos.mockReturnValue({
      data: { id: 123, results: [mockVimeoVideo] },
      isLoading: false,
      error: null,
    });

    render(<VideoPlayer mediaId={123} mediaType={MediaType.MOVIE} title="Test Movie" />);

    await waitFor(() => {
      expect(screen.getByText('Unsupported video source')).toBeInTheDocument();
      expect(screen.getByText(/This video is hosted on Vimeo/)).toBeInTheDocument();
    });
  });

  it('should work with TV shows', async () => {
    mockUseTVVideos.mockReturnValue({
      data: { id: 456, results: [mockYouTubeVideo] },
      isLoading: false,
      error: null,
    });

    render(<VideoPlayer mediaId={456} mediaType={MediaType.TV} title="Test TV Show" />);

    await waitFor(() => {
      const iframe = screen.getByTitle('Official Trailer');
      expect(iframe).toBeInTheDocument();
    });
  });

  it('should include proper YouTube embed parameters', async () => {
    mockUseMovieVideos.mockReturnValue({
      data: { id: 123, results: [mockYouTubeVideo] },
      isLoading: false,
      error: null,
    });

    render(<VideoPlayer mediaId={123} mediaType={MediaType.MOVIE} title="Test Movie" />);

    await waitFor(() => {
      const iframe = screen.getByTitle('Official Trailer');
      const src = iframe.getAttribute('src');
      expect(src).toContain('autoplay=0');
      expect(src).toContain('rel=0');
      expect(src).toContain('modestbranding=1');
    });
  });
});
