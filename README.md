# docker_tehtava3
Tehtävänä oli suunnitella ja toteuttaa mikropalveluperiaatteella toimiva labran toimintojen ja palveluiden keskitetty hallintasivusto tai muu 'konsolinäkymä'. Eli siis webbisivu, jonka voi asettaa esim. windows työasemalla oletussivuksi, johon on kerätty kaikki labran laitteiden ja työkalujen hallinta-, palvelu- ja toimintakuvaukset sekä osoitteet. 

### Toiminnat
  Lisätä laitteita
  Muokata laitteita
  Poistaa laitteita
  Kirjautuminen ja rekiströityminen

### Mitä hyödynsin tehtävässä
  Frontend: nginx:stable-alpine, React
  Backend: Node.js, Express
  Tietokanta: Mysql, phpmyadmin
  
# Kuinka käynnistää

### Aja vain run.sh scripti
  bash run.sh

### Palvelimien osoitteet
  server: localhost:5000
  client: localhost:3000
  phpmyadmin: localhost:8080
    Käyttäjätunnus: root
    Salasana: root

# Käyttöohjeet 

Kun olet käynnistänyt sovelluksen niin  mene osoitteelen ** localhost:3000 **

###  Jos haluat lisätä dataa niin sinun pitää kirjautua 
  1. Paina login näppäintä 
  <img width="475" alt="image" src="https://github.com/Waisatifi/docker_tehtava3/assets/95131163/bf889571-b6f2-4a76-8d47-8244d7b95a88">
  
  2. Sinulle avautuu login sivu, paina rekister näppäintä
  <img width="236" alt="image" src="https://github.com/Waisatifi/docker_tehtava3/assets/95131163/fa9d4216-3a0d-403d-8ee7-3fbf268a2ea2">
  
  3. Kun olet olet luonut käyttäjä tilin niin pääset lisäämän,muokkaaman ja poistamaan tietoja.
  <img width="471" alt="image" src="https://github.com/Waisatifi/docker_tehtava3/assets/95131163/ee5d558a-61d9-4464-8caa-05afd7a0077b">


  ### Ensimmäiseksi luo käyttäjä jotta pääset lisää verkkoja

