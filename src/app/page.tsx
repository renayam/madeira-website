"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const images = [
  {
    src: "/images/20150907_165528.jpg",
    alt: "Description 1",
  },
  {
    src: "/images/20150907_165528.jpg",
    alt: "Description 2",
  },
  {
    src: "/images/20161201_164646.jpg",
    alt: "Description 3",
  },
  {
    src: "/images/20170314_120327.jpg",
    alt: "Description 4",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary">
      <div className="w-full max-w-6xl px-4 py-8">
        <Swiper
          loop
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          // pagination={{ clickable: true }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          className="h-[700px] w-full overflow-hidden rounded-xl" // Increased height
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="relative">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="(max-width: 1536px) 100vw, 1536px"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h2 className="text-2xl font-semibold text-white">
                  {image.alt}
                </h2>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
