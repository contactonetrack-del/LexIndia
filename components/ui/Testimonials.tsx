'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Small Business Owner, Delhi',
    image: 'https://i.pravatar.cc/150?img=11',
    text: 'LexIndia made finding a trusted corporate lawyer so simple. The transparent fee structure and verified profiles gave me the confidence I needed to handle my contract disputes.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Tenant, Mumbai',
    image: 'https://i.pravatar.cc/150?img=5',
    text: 'I was facing an illegal eviction. Through LexIndia, I booked a consultation within minutes. The lawyer guided me perfectly using the Rent Control Act. Highly recommended!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Vikram Singh',
    role: 'Software Engineer, Bangalore',
    image: 'https://i.pravatar.cc/150?img=59',
    text: 'The legal guides are incredibly detailed. Before even speaking to a lawyer, I understood my rights entirely. The UI is completely frictionless and modern.',
    rating: 4,
  },
  {
    id: 4,
    name: 'Anjali Desai',
    role: 'Homebuyer, Pune',
    image: 'https://i.pravatar.cc/150?img=44',
    text: 'Used the platform to find a property lawyer for my flat registration. The entire process was seamless. No hidden fees, no unprofessional behavior. Top notch service.',
    rating: 5,
  },
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const handleNext = () => {
    setCurrentIndex((current) => (current + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1));
  };

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-yellow-50 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Real Stories, Real Justice
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Don&apos;t just take our word for it. Hear from Indians who found the right legal help exactly when they needed it.
          </motion.p>
        </div>

        <div 
          className="max-w-4xl mx-auto relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 z-20">
            <button 
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[#1E3A8A] hover:scale-110 transition-all focus:outline-none"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 z-20">
            <button 
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[#1E3A8A] hover:scale-110 transition-all focus:outline-none"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="relative h-[320px] sm:h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8"
              >
                <div className="flex-shrink-0 relative">
                  <Quote className="absolute -top-4 -left-4 w-10 h-10 text-[#D4AF37] opacity-50 z-0" />
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-md relative z-10">
                    <Image 
                      src={testimonials[currentIndex].image} 
                      alt={testimonials[currentIndex].name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 96px, 128px"
                    />
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex justify-center md:justify-start gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < testimonials[currentIndex].rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-lg md:text-xl text-gray-700 font-medium italic mb-6">
                    &quot;{testimonials[currentIndex].text}&quot;
                  </p>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonials[currentIndex].name}</h4>
                    <p className="text-sm text-gray-500">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-[#1E3A8A] w-6' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
