'use client';

import { Globe, Loader2, MapPin } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCountryCodeFromCoordinates } from '@/lib/country-codes';

interface LocationStepProps {
  onComplete: (country: string) => void;
}

export function LocationStep({ onComplete }: LocationStepProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);

  const detectLocation = useCallback(async () => {
    setIsDetecting(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        });
      });

      const { latitude, longitude } = position.coords;
      const countryCode = await getCountryCodeFromCoordinates(latitude, longitude);
      onComplete(countryCode);
    } catch (error) {
      console.error('Location detection error:', error);
      // Permission denied or error - default to USA
      onComplete('US');
    } finally {
      setIsDetecting(false);
    }
  }, [onComplete]);

  const useUSA = () => {
    onComplete('US');
  };

  useEffect(() => {
    // Auto-detect location on component mount
    if (!hasAsked) {
      setHasAsked(true);
      detectLocation();
    }
  }, [detectLocation, hasAsked]);

  return (
    <div className="max-w-md mx-auto">
      <Card className="glass-panel rounded-2xl border-keyline shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 glow-ring flex items-center justify-center">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-display tracking-tight">
            Where are you watching from?
          </CardTitle>
          <p className="text-muted-foreground font-light">
            We need your location to show available content in your region
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            onClick={detectLocation}
            disabled={isDetecting}
            className="w-full h-12 rounded-full aurora-bg border-0 font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            size="lg"
          >
            {isDetecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Detecting your location...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-2" />
                Auto-detect my location
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-keyline-bright" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="rounded-full bg-secondary/70 backdrop-blur px-3 py-0.5 tracking-widest text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={useUSA}
            className="w-full h-12 rounded-full border-keyline-bright bg-secondary/30 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-secondary/60 hover:text-primary"
            size="lg"
          >
            <Globe className="w-4 h-4 mr-2" />
            Continue with USA
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
