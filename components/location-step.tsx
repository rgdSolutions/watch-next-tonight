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
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Where are you watching from?</CardTitle>
          <p className="text-muted-foreground">
            We need your location to show available content in your region
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button onClick={detectLocation} disabled={isDetecting} className="w-full h-12" size="lg">
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
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button variant="outline" onClick={useUSA} className="w-full h-12" size="lg">
            <Globe className="w-4 h-4 mr-2" />
            Continue with USA
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
