"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePortfolio } from "@/components/PortfolioContext";
import { redirect } from "next/navigation";

export default function Home() {
  const { portfolioItems } = usePortfolio();

  useEffect(() => {
    redirect("/client/portfolio");
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center ">
      <div className="w-full max-w-6xl px-4 py-8">
        <Swiper
          loop
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          // pagination={{ clickable: true }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          className="h-[700px] w-full overflow-hidden rounded-xl" // Increased height
        >
          {portfolioItems.map((item, index) => (
            <SwiperSlide key={item.id} className="relative">
              <Image
                src={item.mainImage}
                alt={item.altText}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="(max-width: 1536px) 100vw, 1536px"
              />
              <div className="absolute bottom-0 left-0 right-0  from-black/70 to-transparent p-6">
                <h2 className="text-2xl font-semibold text-white">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-200">{item.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="mt-8 flex justify-center">
        <motion.div
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/client/portfolio"
            className="rounded-full  px-6 py-3 text-white shadow-lg transition-colors duration-300 "
          >
            Découvrir nos services
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
