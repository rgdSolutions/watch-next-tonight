import { useIsMobileScreenWidth } from '@/hooks/use-is-mobile-screen-width';

export const Header = () => {
  const isMobile = useIsMobileScreenWidth();

  return (
    <div className="text-center mb-4">
      <h1
        className="text-4xl font-bold tracking-tight mb-2
                  md:text-5xl
                  lg:text-6xl"
      >
        Watch Next Tonight
      </h1>
      {!isMobile && (
        <p
          className="text-muted-foreground text-lg
                 md:text-xl"
        >
          Find your perfect movie or show in just a few clicks
        </p>
      )}
    </div>
  );
};
