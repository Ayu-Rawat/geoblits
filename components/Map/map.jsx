"use client";
import React, { useEffect, useCallback, useRef, useState } from "react";
import 'leaflet/dist/leaflet.css';

function Map({ country }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then(L => {
        setLeafletLoaded(true);
      });
    }
  }, []);

  const createMap = useCallback(async () => {
    if (!leafletLoaded || !mapRef.current) return;

    const L = await import('leaflet');
    
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 1.5,
        minZoom: 1,
        maxZoom: 13,
        worldCopyJump: false,
        zoomControl: false,  // Disable zoom controls
        attributionControl: false,  // Disable attribution
      });

      // Set bounds to prevent panning outside world
      const bounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));
      mapInstanceRef.current.setMaxBounds(bounds);
      mapInstanceRef.current.on("drag", () => {
        mapInstanceRef.current.panInsideBounds(bounds, { animate: false });
      });
    }

    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
      );
      const data = await response.json();

      // Clear previous layers
      mapInstanceRef.current.eachLayer(layer => {
        mapInstanceRef.current.removeLayer(layer);
      });

      // Add GeoJSON with custom style
      L.geoJSON(data, {
        style: (feature) => ({
          color: "black",
          weight: 1.5,
          fillColor: feature.properties.name === country ? "#3b82f6" : "#f3f4f6",
          fillOpacity: 1,
        }),
      }).addTo(mapInstanceRef.current);

      // Center on selected country
      if (country) {
        const countryFeature = data.features.find(
          f => f.properties.name === country
        );
        if (countryFeature) {
          mapInstanceRef.current.fitBounds(L.geoJSON(countryFeature).getBounds(), {
            padding: [20, 20]
          });
        }
      }
    } catch (err) {
      console.error("Error loading map data:", err);
    }
  }, [country, leafletLoaded]);

  useEffect(() => {
    if (leafletLoaded) {
      createMap();
    }
  }, [createMap, leafletLoaded]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ 
        height: '500px', 
        width: '100%',
        backgroundColor: '#f3f4f6'
      }}
      className="z-0"
    />
  );
}

export default Map;