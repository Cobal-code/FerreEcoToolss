// Ubicación del negocio, compartida por el mapa de Contacto y el de Inicio.

export const LAT = 4.1254775326449495;
export const LNG = -73.54500527328169;
export const BUSINESS_NAME = "Ferelectricos Castellanos Ferreecotools";
export const BUSINESS_ADDRESS = "Calle 27B #60BE-18, Manzana 79 Casa 7, Barrio La Reliquia, Villavicencio";

/** Abre la ubicación en Google Maps */
export const GOOGLE_MAPS_URL = `https://www.google.com/maps?q=${LAT},${LNG}`;
/** Abre Google Maps con la ruta hacia el negocio ("Cómo llegar") */
export const GOOGLE_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;
/** Mapa incrustado de Google Maps */
export const EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(
  BUSINESS_NAME
)}@${LAT},${LNG}&ll=${LAT},${LNG}&z=17&output=embed`;
