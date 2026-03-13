'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import Image from 'next/image';

import { useLanguage } from '@/lib/LanguageContext';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Small Business Owner, Delhi',
    image: 'https://i.pravatar.cc/150?img=11',
    text: 'LexIndia made finding a trusted corporate lawyer simple. The fee visibility and verified profiles gave me confidence immediately.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Tenant, Mumbai',
    image: 'https://i.pravatar.cc/150?img=5',
    text: 'I booked a consultation within minutes and got practical guidance for an eviction issue without wasting time.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Vikram Singh',
    role: 'Software Engineer, Bangalore',
    image: 'https://i.pravatar.cc/150?img=59',
    text: 'The platform helped me understand my options before I ever spoke with a lawyer.',
    rating: 4,
  },
  {
    id: 4,
    name: 'Anjali Desai',
    role: 'Homebuyer, Pune',
    image: 'https://i.pravatar.cc/150?img=44',
    text: 'The experience felt clear and professional from search to booking.',
    rating: 5,
  },
];

const heading = 'Real stories, real outcomes';
const subheading =
  'Feedback from people who used LexIndia to move faster and make clearer legal decisions.';
const previousLabel = 'Previous testimonial';
const nextLabel = 'Next testimonial';

export function TestimonialsCarousel() {
  const { lang } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered || lang !== 'en') return;
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, lang]);

  if (lang !== 'en') {
    return null;
  }

  const handleNext = () => {
    setCurrentIndex((current) => (current + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1));
  };

  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl opacity-50" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold text-foreground"
          >
            {heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            {subheading}
          </motion.p>
        </div>

        <div
          className="relative mx-auto max-w-4xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute top-1/2 z-20 -translate-y-1/2 md:-left-12 -left-4">
            <button
              onClick={handlePrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-lg transition-all hover:scale-110 hover:text-primary focus:outline-none"
              aria-label={previousLabel}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>

          <div className="absolute top-1/2 z-20 -right-4 -translate-y-1/2 md:-right-12">
            <button
              onClick={handleNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-lg transition-all hover:scale-110 hover:text-primary focus:outline-none"
              aria-label={nextLabel}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="relative h-[320px] sm:h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="absolute inset-0 flex flex-col items-center gap-8 rounded-3xl border border-border bg-surface p-8 shadow-sm md:flex-row md:p-12"
              >
                <div className="relative flex-shrink-0">
                  <Quote className="absolute -left-4 -top-4 z-0 h-10 w-10 text-accent/60" />
                  <div className="relative z-10 h-24 w-24 overflow-hidden rounded-full border-4 border-background shadow-md md:h-32 md:w-32">
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
                  <div className="mb-4 flex justify-center gap-1 md:justify-start">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`h-5 w-5 ${index < testimonials[currentIndex].rating ? 'fill-accent text-accent' : 'text-border'}`}
                      />
                    ))}
                  </div>
                  <p className="mb-6 text-lg font-medium italic text-foreground md:text-xl">
                    &quot;{testimonials[currentIndex].text}&quot;
                  </p>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">{testimonials[currentIndex].name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-6 bg-primary' : 'w-2.5 bg-border hover:bg-muted-foreground'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
