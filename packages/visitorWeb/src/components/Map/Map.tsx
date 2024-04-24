import React, { useRef, useEffect, useState, useMemo } from "react";
import ReactDOMServer from 'react-dom/server';
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { Point } from 'ol/geom';
import { fromLonLat, useGeographic } from 'ol/proj';
import "ol/ol.css";
import { Feature, Overlay } from "ol";
import VectorSource from "ol/source/Vector";
import { Vector as VL } from "ol/layer";
import { Style, Icon } from "ol/style";
import markerIcon from "../../assets/marker.png";
import styles from "./Map.module.scss";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { NavigateTo } from "@src/utils/NavigateTo";
import { IRestaurantFrontEnd } from "shared/models/restaurantInterfaces";
import {useTranslation} from "react-i18next";

const Berlin = [13.409523443447888, 52.52111129522459];
const Epitech = [13.328820, 52.508540]; // long,lat

useGeographic();

const layer = new TileLayer({
  source: new OSM(),
});

const view = new View({
  center: Epitech,
  zoom: 15,
});

const stylesMarker = {
  'icon': new Style({
    image: new Icon({
      anchor: [0.5, 1],
      src: markerIcon,
      scale: 0.05,
    }),
  }),
};

const PageBtn = () => {
  return createTheme({
    typography: {
      button: {
        fontFamily: "Montserrat",
        textTransform: "none",
        fontSize: "1.13rem",
        fontWeight: "500",
      },
    },
    palette: {
      primary: {
        main: "#AC2A37",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#094067",
        contrastText: "#ffffff",
      },
    },
    shape: {
      borderRadius: 5,
    },
  });
};

interface MapProps {
  data: IRestaurantFrontEnd[]
}

const MapView = (props: MapProps) => {
  const navigate = useNavigate();
  const mapElement = useRef();
  const [map, setMap] = useState(null);
  const element = useRef(null);
  const [clickedFeature, setClickedFeature] = useState<IRestaurantFrontEnd | null>(null);
  const [popupContent, setPopupContent] = useState<JSX.Element | null>(null);
  const {t} = useTranslation();

  const testMarkerL = useMemo(() => {
    let markerList: Feature[] = [];
    if (props.data) {
      for (const elem of props.data) {
        const obj = new Feature({
          type: 'icon',
          geometry: new Point([parseFloat(elem.location.longitude), parseFloat(elem.location.latitude)]),
          description: elem.name,
          telephone: elem.phoneNumber,
          address:
            elem.location.streetName + ' ' + elem.location.streetNumber +
            ', ' + elem.location.postalCode + ' ' + elem.location.city,
          index: elem.uid,
          objectR: elem,
          name: 'Marker',
        });
        markerList.push(obj);
      };
    }
    return markerList;
  }, [props.data]);

  const vectorLayer = useMemo(() => new VL({
    source: new VectorSource({
      features: testMarkerL,
    }),
    style: function (feature) {
      return stylesMarker['icon'];
    },
  }), [testMarkerL]);

  vectorLayer.set('name', 'markerLayer');

  useEffect(() => {
    if (!mapElement.current) {
      return;
    }

    const map = new Map({
      target: mapElement.current,
      view: view,
      layers: [layer],
    });
    setMap(map);

  }, []);

  useEffect(() => {
    if (map) {
      map.getLayers().forEach((layer: any) => {
        if (layer && layer.get('name') === 'markerLayer') {
          map.removeLayer(layer);
        }
      });
      map.addLayer(vectorLayer);
    }
  }, [vectorLayer, map]);

  const popup = useMemo(() => new Overlay({
    element: element.current,
    stopEvent: false,
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  }), [element]);

  useEffect(() => {
    if (map) {
      map.addOverlay(popup);
    };
  }, [popup]);

  useEffect(() => {
    if (map) {
      const handleMapClick = (evt: any) => {
        if (!map || !popup) {
          console.error('Map or popup not initialized properly');
          return;
        }

        if (popup.getPosition()) {
          popup.setPosition(undefined);
          setClickedFeature(null);
        }

        const feature = map.forEachFeatureAtPixel(evt.pixel,
          function (feature: Feature) {
            return feature;
          });
          if (!feature) {
            popup.setPosition(undefined);
            return;
          }
        popup.setPosition(feature.getGeometry().getCoordinates());
        const restaurant = feature.get('objectR') as IRestaurantFrontEnd;
        const picture = restaurant.pictures[0];
        const rating = restaurant.rating;
        const description = feature.get('description');
        const telephone = feature.get('telephone');
        const address = feature.get('address');
        setPopupContent(
          <div>
            <img src={picture} alt={t('components.Map.alt-img')} className={styles.popupImg} />
            <h2>{description}</h2>
            <p>{t('components.Map.rating', {rating: rating})}</p>
            <p>{t('components.Map.logout', {phone: telephone})}</p>
            <p>{t('components.Map.address', {address: address})}</p>
            <ThemeProvider theme={PageBtn()}>
              <Button
                variant="contained"
                sx={{ width: "12.13rem" }}
                onClick={() => NavigateTo("/menu", navigate, {
                  menu: restaurant.categories,
                  restoName: restaurant.name,
                  address: `${restaurant.location.streetName} 
              ${restaurant.location.streetNumber}, 
              ${restaurant.location.postalCode} 
              ${restaurant.location.city}, 
              ${restaurant.location.country}`,
                })}
              >
                {t('components.Map.resto-page')}
              </Button>
            </ThemeProvider>
          </div>
        );
        
        setClickedFeature(restaurant);
      };

      const handlePointerMove = (e: any) => {
        const pixel = map.getEventPixel(e.originalEvent);
        const hit = map.hasFeatureAtPixel(pixel);
        map.getTarget().style.cursor = hit ? 'pointer' : '';
      };

      map.on('click', handleMapClick);
      map.on('pointermove', handlePointerMove);

      return () => {
        map.un('click', handleMapClick);
        map.un('pointermove', handlePointerMove);
      };
    }
  }, [map, popup, navigate]);

  return (
    <>
      <div ref={mapElement} className={styles.map} id="map" />
      {clickedFeature && (
        <div id="popup" className={styles.popup}>
          <a href="#" id="popup-closer" className="ol-popup-closer"></a>
          <div className={styles.popoverContent} id="popup-content">
            {popupContent}
          </div>
        </div>
      )}
    </>
  );
};

export default MapView;
