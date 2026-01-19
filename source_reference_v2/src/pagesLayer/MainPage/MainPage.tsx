'use client';

import { AboutSection } from '@/widgets/AboutSection';
import { FaqsSection } from '@/widgets/FaqsSection';
import { HeroSection } from '@/widgets/HeroSection';
import { LocationSection } from '@/widgets/LocationSection';
import { ReviewsSection } from '@/widgets/ReviewsSection';
import { ServiceSection } from '@/widgets/ServiceSection';
import { TipsSection } from '@/widgets/TipsSection';
import { Preloader } from '@/shared/ui/pre-loader';
import { ContentWrapper } from '@/shared/ui/content-wrapper';
import { useState } from 'react';
import { cn } from '@/shared/libs/cn';

export const MainPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // useScrollSnap({ enabled: isLoaded });

  return (
    <>
      {!isLoaded && (
        <Preloader
          className={cn('transition-opacity duration-500', isLoaded ? 'opacity-100' : 'opacity-0')}
          onComplete={() => setIsLoaded(true)}
        />
      )}
      <main className={cn('transition-opacity duration-500', isLoaded ? 'opacity-100' : 'opacity-0')}>
        <HeroSection isLoaded={isLoaded} />
        <ContentWrapper>
          <AboutSection />
          <ServiceSection />
          <LocationSection />
          <ReviewsSection />
          <TipsSection />
          <FaqsSection />
        </ContentWrapper>
      </main>
    </>
  );
};
