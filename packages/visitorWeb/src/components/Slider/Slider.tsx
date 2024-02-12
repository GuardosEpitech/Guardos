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

const data = [
  {
    avatar: AVTR1,
    name: "Allergen friendly",
    review: "On our user page you can filter restaurants by allergens and never have a problem with them again. Restaurants are encouraged to write a complete transparent presentation of their allergens every time."
  },
  {
    avatar: AVTR2,
    name: "Modern Menus",
    review:
      "We offer various options for our restaurant partners to easily create their menu cards for their customers. You can choose from several options of templates for the menus."
  },
  {
    avatar: AVTR3,
    name: "QR-Scanning",
    review:
      "To make it easier for our partner restaurants to recognize the allergens of their products, we offer a QR scanning function that can automatically recognize the allergens of your products."
  },
  {
    avatar: AVTR4,
    name: "User Profiles",
    review:
      "Save your favorite restaurants and your settings on our site / app. So you never have to start a new search again. Collect points and experiences to get percentages on some restaurants."
  }
];

const Slider = () => {
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
