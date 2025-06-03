import React, { useState, Fragment } from 'react';
import { useSpring, animated } from 'react-spring';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  options: {image: string, title?: string, description?: string}[];
  width?: string;
  height?: string;
}

const Carousel: React.FC<CarouselProps> = ({ 
  options,
  width = '100%',
  height = '400px'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const props = useSpring({
    from: { transform: 'translateX(0%)' },
    to: { transform: `translateX(-${currentIndex * 100 /options.length}%)` },
    config: { tension: 220, friction: 20 },
    immediate: false
  });

  const nextSlide = () => {
    setCurrentIndex(current => 
      current === options.length - 1 ? 0 : current + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex(current => 
      current === 0 ? options.length - 1 : current - 1
    );
  };

  return (
    <div 
      className="relative overflow-hidden " 
      style={{ width, height }}
    >
      <animated.div
        className="flex h-full"
        style={{
          ...props,
          width: `${options.length * 100}%`,
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        
        {options.map((option, index) => {
          
          const title = option.title;
          const description = option.description;
          const image = option.image;
          const withTitle = title? 50 : 100;
          
          return (
            <Fragment key={index}>
              {title && (
                <div 
                  className="flex flex-col justify-center items-center p-10 large:p-44"
                  style={{ width: `${withTitle / options.length}%` }}> 
                  <h1 className="text-black text-6xl font-bold mb-10">{title}</h1>
                  <p className="text-white text-3xl">{description}</p>
                </div>
              )}
              <div
                key={index}
                className="relative"
                style={{ 
                  width: `${withTitle / options.length}%`,
                  flexShrink: 0,
                  flexGrow: 0
                }}
              >
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-contain"
                  style={{ maxWidth: '100%' }}
                />            
              </div>
            </Fragment>
        )})}

      
      </animated.div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/75 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/75 transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {options.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentIndex === index ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
