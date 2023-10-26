#!/bin/bash

echo "Käynnistetään sovellus..."

# Vaiheet api-kansion osalta
echo "Asennetaan riippuvuudet api-kansiossa..."
cd api
npm install
cd ..

# Vaiheet web_tehtava3-kansion osalta
echo "Asennetaan riippuvuudet ja rakennetaan web_tehtava3-kansiossa..."
cd web_tehtava3
npm install
npm run build
cd ..

echo "Sovelluksen käynnistys valmis."
echo "Käynnistetään sovellus ajalla docker-compose.yml..."
docker-compose up --build