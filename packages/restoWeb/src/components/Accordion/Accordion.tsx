import React, { useState } from "react";
import styles from "./Accordion.module.scss";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {React.Children.count(children) > 0 && (
        <div className={styles.accordion}>
          <div
            className={`${styles.accordionHeader} ${isOpen ? styles.active : ""}`}
            onClick={toggleAccordion}
          >
            {title}
            <span className={styles.dropdownIcon}>▼</span>
          </div>
          {isOpen && <div className={styles.accordionContent}>{children}</div>}
        </div>
      )}
    </>
  );
};

export default Accordion;
