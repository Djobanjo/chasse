# Chasse au trésor 



## Installer
```bash
npm install
npm run dev
```

## Points importants
- Testez en HTTPS ou sur localhost pour que `navigator.geolocation` fonctionne.
- Ajustez les étapes dans `src/App.jsx` (factory `buildInitialSteps`).
- Le composant `GameMap` utilise React-Leaflet (MapContainer, Marker, TileLayer).
