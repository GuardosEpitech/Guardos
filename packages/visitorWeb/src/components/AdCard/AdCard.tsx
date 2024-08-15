import React, { useEffect } from 'react';
import styles from './AdCard.module.scss';

interface AdCardProps {
  adClient: string;
  adSlot: string;
  adFormat?: string;
}

const AdCard: React.FC<AdCardProps> = ({ adClient, adSlot, adFormat = 'auto' }) => {
  useEffect(() => {
    const loadAdsenseScript = () => {
      if (!document.getElementById('adsense-script')) {
        const script = document.createElement('script');
        script.id = 'adsense-script';
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js`;
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.push({});
        };
      } else {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
      }
    };

    loadAdsenseScript();
  }, []);

  return (
    <div className={styles.AdCard}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
      ></ins>
    </div>
  );
};

export default AdCard;
