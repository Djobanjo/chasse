import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, ImageOverlay } from 'react-leaflet'
import L from 'leaflet'


function GetMapInstance({ setMapInstance }) {
  const map = useMap();
  useEffect(() => {
    if (map) {
      setMapInstance(map);
    }
  }, [map, setMapInstance]);
  return null;
}


function Recenter({ position }){
  const map = useMap()
  useEffect(() => {
    
    if (position) map.panTo([position.lat, position.lng],17, {animate: true})
  }, [position, map])
  return null
}
const bounds = [
  [-20.9038, 55.4871], // sud-ouest (latitude plus petite, longitude plus petite)
  [-20.9001, 55.4810]  // nord-est (latitude plus grande, longitude plus grande)
];
// const centerLat = (bounds[0][0] + bounds[1][0]) / 2;
// const centerLng = (bounds[0][1] + bounds[1][1]) / 2;

// const scale = 0.7; // réduction à 50%
// const height = (bounds[1][0] - bounds[0][0]) * scale / 2;
// const width = (bounds[1][1] - bounds[0][1]) * scale / 2;

// const newBounds = [
//   [centerLat - height, centerLng - width],
//   [centerLat + height, centerLng + width]
// ];


const userIcon = L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149060.png', iconSize: [32,32], iconAnchor: [16,32] })
const stepIcon = L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png', iconSize: [30,30], iconAnchor: [15,30] })

export default function GameMap({ etapes, currentIndex, dernierePosition, onCenterRequested }) {
  // Ajoute une ref pour stocker l'instance de la carte Leaflet
  const mapRef = useRef(null)

  return (
    <div className="map-wrap">
      <MapContainer
        bounds={bounds}
        minZoom={17}
        maxZoom={18}
        style={{ height: '70vh', width: '80%', margin:'20px auto', borderRadius:10 }}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* <ImageOverlay
          url="public/carte.png"
          bounds={bounds}
        /> */}
        <GetMapInstance setMapInstance={map =>(mapRef.current = map)} />
        {dernierePosition && (
          <Marker position={[dernierePosition.lat, dernierePosition.lng]} icon={userIcon}>
            <Popup>Vous êtes ici</Popup>
          </Marker>
        )}
        

        {etapes
          .filter((e, idx) => {
            if (e.id === 'start') return true;         // toujours afficher point de départ
            if (idx < currentIndex) return true;        // afficher étapes déjà validées
            if (idx === currentIndex) return true;      // afficher étape actuelle (même si pas encore validée)
            
            return false;                               // cacher les suivantes
          })
          .map((e, idx) => (
            <Marker key={e.id || idx} position={[e.lat, e.lng]} icon={stepIcon}>
              <Popup>{e.valide ? `✅ ${e.nom}` : e.nom}</Popup>
            </Marker>
          ))}


        <Recenter position={dernierePosition} />
      </MapContainer>

      <div className="map-actions">
        <button
          className="btn"
          // disabled={!mapRef.current || !dernierePosition}
          onClick={() => {
            console.log('Dernière position:', dernierePosition)
            if (mapRef.current && dernierePosition) {

              
              mapRef.current.pantTo([dernierePosition.lat, dernierePosition.lng], 18, {animate: true});
            }
          }}
        >
          📌 Moi
        </button>
      </div>
    </div>
  )
}
