'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import './carousel.css'; // We'll create this next
import { Room } from '@/types/room';

export default function Carousel({room}:{room?: Room}) {
  const carouselImages = [
    '/images/slider/1.jpg',
    '/images/slider/2.jpg',
    '/images/slider/3.jpg',
    '/images/slider/4.jpg',
    '/images/slider/5.jpg',
  ];

  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      loop={true}
      className="h-screen w-full"
    >
      {room ? (
        room.images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <Image
                src={src.url}
                alt={`Room ${index + 1}`}
                fill
                className="object-contain"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))
      ):(
        carouselImages.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <Image
                src={src}
                alt={`Room ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))
      )
    }
    </Swiper>
  );
}