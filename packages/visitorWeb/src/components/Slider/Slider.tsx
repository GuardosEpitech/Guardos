import React from "react";
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from "swiper/react";

import AVTR1 from "../../assets/gluten-free.png";
import AVTR2 from "../../assets/menu.png";
import AVTR3 from "../../assets/qr-code.png";
import AVTR4 from "../../assets/user.png";
import styles from "./Slider.module.scss";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import {useTranslation} from "react-i18next";

const Slider = () => {
  const {t} = useTranslation();
  const data = [
    {
      avatar: AVTR1,
      name: t('components.Slider.allergen-friendly'),
      review: t('components.Slider.allergen-friendly-review')
    },
    {
      avatar: AVTR2,
      name: t('components.Slider.modern-menu'),
      review:
        t('components.Slider.modern-menu-review')
    },
    {
      avatar: AVTR3,
      name: t('components.Slider.qr-scanning'),
      review:
        t('components.Slider.qr-scanning-review')
    },
    {
      avatar: AVTR4,
      name: t('components.Slider.user-profiles'),
      review:
        t('components.Slider.user-profiles-review')
    }
  ];

  return (
    <section id="testimonials" className={styles.sectionTestimonials}>
      <Swiper
      modules={[Pagination]}
        className={`${styles.container} ${styles.testimonials__container}`}
        // install Swiper modules
        spaceBetween={40}
        slidesPerView={1}
        pagination={{ clickable: true }}
        onSwiper={(swiper:any) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
      >
        {data.map(({ avatar, name, review }, index) => {
          return (
            <SwiperSlide key={index} className={styles.testimonials}>
              <div className={styles.client__avatar}>
                <img src={avatar} alt="" />
              </div>
              <h3 className={styles.client__name}>{name}</h3>
              <p className={styles.client__review}>{review}</p>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default Slider;
