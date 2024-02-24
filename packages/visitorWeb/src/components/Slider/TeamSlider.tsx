import React from 'react';
import SwiperCore from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import styles from "./TeamSlider.module.scss";

import josi from "@src/assets/profile/josi.png";
import gylian from "@src/assets/profile/gylian.png";
import marc from "@src/assets/profile/mark.png";
import ramon from "@src/assets/profile/ramon.png";
import renan from "@src/assets/profile/renan.png";
import alban from "@src/assets/profile/alban.png";

SwiperCore.use([Navigation, Pagination, Autoplay]);

const teamMembers = [
  { id: 1, name: 'Josefine Mende', position: 'Team Leader', avatar: josi },
  { id: 2, name: 'Marc Pister', position: 'Backend Developer', avatar: marc },
  { id: 3, name: 'Ramon Werner', position: 'Frontend Developer', avatar: ramon },
  { id: 4, name: 'Renan Dubois', position: 'Backend Developer', avatar: renan },
  { id: 5, name: 'Alban De-Tourtier', position: 'Mobile Developer', avatar: alban },
  { id: 6, name: 'Gylian Karsch', position: 'Frontend Developer', avatar: gylian }
];

const TeamSlider = () => {
  const swiperParams = {
    slidesPerView: 3,
    spaceBetween: 20,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      clickable: true
    },
    autoplay: {
      delay: 6000,
    },
    breakpoints: {
      100: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      500: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      1100: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
  };

  return (
    <div className={styles.teamSlider}>
      <Swiper {...swiperParams}>
        {teamMembers.map((member:any) => (
          <SwiperSlide key={member.id}>
            <div className={styles.teamMember}>
              <img src={member.avatar} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.position}</p>
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </Swiper>
    </div>
  );
};

export default TeamSlider;