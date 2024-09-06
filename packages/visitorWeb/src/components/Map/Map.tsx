import React, { useRef, useEffect, useState, useMemo } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import "ol/ol.css";
import { Feature, Overlay } from "ol";
import VectorSource from "ol/source/Vector";
import { Vector as VL } from "ol/layer";
import { Style, Icon } from "ol/style";
import markerIcon from "../../assets/marker.png";
import blueDotBig from "../../assets/blueDotBig.png";
import styles from "./Map.module.scss";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { NavigateTo } from "@src/utils/NavigateTo";
import { IRestaurantFrontEnd } from "shared/models/restaurantInterfaces";
import { useTranslation } from "react-i18next";

const Epitech = [13.328820, 52.508540]; // long, lat

const stylesMarker = {
  'icon': new Style({
    image: new Icon({
      anchor: [0.5, 1],
      src: markerIcon,
      scale: 0.05,
    }),
  }),
  'location': new Style({
    image: new Icon({
      anchor: [0.5, 0.5],
      src: blueDotBig,
      scale: 0.01,
    }),
  }),
};

const PageBtn = () => {
  return createTheme({
    typography: {
      button: {
        fontFamily: "Calibri",
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
  data: IRestaurantFrontEnd[];
  userPosition?: { lat: number; lng: number } | null;
}

const MapView = (props: MapProps) => {
  const navigate = useNavigate();
  const mapElement = useRef<HTMLDivElement>(null);
  const element = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [clickedFeature, setClickedFeature] = useState<IRestaurantFrontEnd | null>(null);
  const [popupContent, setPopupContent] = useState<JSX.Element | null>(null);
  const { t } = useTranslation();

  const createFeatures = (data: IRestaurantFrontEnd[]) => {
    return data
      .filter(elem => elem.location && elem.location.longitude && elem.location.latitude)
      .map(elem => {
        const [lon, lat] = [parseFloat(elem.location.longitude), parseFloat(elem.location.latitude)];
        return new Feature({
          type: 'icon',
          geometry: new Point(fromLonLat([lon, lat])),
          description: elem.name,
          telephone: elem.phoneNumber,
          address: `${elem.location.streetName} ${elem.location.streetNumber}, ${elem.location.postalCode} ${elem.location.city}`,
          index: elem.uid,
          objectR: elem,
          name: 'Marker',
        });
      });
  };

  const locationMarkerL = useMemo(() => {
    if (!props.userPosition) return [];
    const [lon, lat] = [props.userPosition.lng, props.userPosition.lat];
    const locationMarker = new Feature({
      type: 'location',
      geometry: new Point(fromLonLat([lon, lat])),
    });
    return [locationMarker];
  }, [props.userPosition]);

  const testMarkerL = useMemo(() => createFeatures(props.data), [props.data]);

  const [vectorLayerLoc, setVectorLayerLoc] = useState<VL<VectorSource> | null>(null);
  const [vectorLayer, setVectorLayer] = useState<VL<VectorSource> | null>(null);

  useEffect(() => {
    if (mapElement.current && !map) {
      const initialView = new View({
        center: props.userPosition ? fromLonLat([props.userPosition.lng, props.userPosition.lat]) : fromLonLat(Epitech),
        zoom: 15,
      });

      const mapInstance = new Map({
        target: mapElement.current,
        layers: [new TileLayer({ source: new OSM() })],
        view: initialView,
      });

      setMap(mapInstance);
    }
  }, [map, props.userPosition]);

  useEffect(() => {
    if (map) {
      map.getLayers().forEach((layer: any) => {
        if (layer instanceof VL) {
          map.removeLayer(layer);
        }
      });

      if (locationMarkerL.length > 0) {
        const sourceLoc = new VectorSource({
          features: locationMarkerL,
        });

        const newVectorLayerLoc = new VL({
          source: sourceLoc,
          style: stylesMarker['location'],
        });

        setVectorLayerLoc(newVectorLayerLoc);
        map.addLayer(newVectorLayerLoc);
      }

      if (testMarkerL.length > 0) {
        const sourceMarkers = new VectorSource({
          features: testMarkerL,
        });

        const newVectorLayer = new VL({
          source: sourceMarkers,
          style: stylesMarker['icon'],
        });

        setVectorLayer(newVectorLayer);
        map.addLayer(newVectorLayer);
      }
    }
  }, [map, locationMarkerL, testMarkerL]);

  useEffect(() => {
    if (map && props.userPosition) {
      map.updateSize();
      map.getView().setCenter(fromLonLat([props.userPosition.lng, props.userPosition.lat]));
      map.getView().setZoom(15);
    }
  }, [map, props.userPosition, testMarkerL]);

  useEffect(() => {
    if (element.current && map) {
      const popup = new Overlay({
        element: element.current,
        stopEvent: false,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      });

      map.addOverlay(popup);

      const handleMapClick = (evt: any) => {
        if (!popup) return;

        popup.setPosition(undefined);
        setClickedFeature(null);

        const feature = map.forEachFeatureAtPixel(evt.pixel, (feature: Feature) => feature);
        if (feature) {
          const geometry = feature.getGeometry();
          if (geometry instanceof Point) {
            popup.setPosition(geometry.getCoordinates());
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
                <p>{t('components.Map.rating', { rating })}</p>
                <p>{t('components.Map.logout', { phone: telephone })}</p>
                <p>{t('components.Map.address', { address })}</p>
                <ThemeProvider theme={PageBtn()}>
                  <Button
                    variant="contained"
                    sx={{ width: "12.13rem" }}
                    onClick={() => NavigateTo(`/menu/${restaurant.uid}`, navigate, {
                      menu: restaurant.categories,
                      restoName: restaurant.name,
                      restoID: restaurant.uid,
                      address: `${restaurant.location.streetName} ${restaurant.location.streetNumber}, ${restaurant.location.postalCode} ${restaurant.location.city}, ${restaurant.location.country}`,
                      menuDesignID: restaurant.menuDesignID
                    })}
                  >
                    {t('components.Map.resto-page')}
                  </Button>
                </ThemeProvider>
              </div>
            );
            setClickedFeature(restaurant);
          }
        }
      };

      const handlePointerMove = (evt: any) => {
        if (evt.dragging) return;
        const pixel = map.getEventPixel(evt.originalEvent);
        const hit = map.hasFeatureAtPixel(pixel);
        const targetElement = map.getTarget() as HTMLElement;
        if (targetElement) {
          targetElement.style.cursor = hit ? 'pointer' : '';
        }
      };

      map.on('click', handleMapClick);
      map.on('pointermove', handlePointerMove);

      return () => {
        map.un('click', handleMapClick);
        map.un('pointermove', handlePointerMove);
        if (map) {
          map.removeOverlay(popup);
        }
      };
    }
  }, [map, element, navigate, t]);

  return (
    <>
      <div ref={mapElement} className={styles.map} id="map" />
      <div ref={element} id="popup" className={styles.popup}>
        <a href="#" id="popup-closer" className="ol-popup-closer"></a>
        <div className={styles.popoverContent} id="popup-content">
          {popupContent}
        </div>
      </div>
    </>
  );
};

export default MapView;
