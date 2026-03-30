"use client";
import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon issue with Next.js/Webpack
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapView({ position }: { position: [number, number] }) {
  // If no position provided effectively, default to a safe point.
  const center = position?.[0] ? position : [51.505, -0.09] as [number, number];

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%", zIndex: 0 }}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <Marker position={center} icon={icon} />
    </MapContainer>
  );
}
