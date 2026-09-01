// Lista de locales "Destacados del mes" (plan de monetizacion futuro).
// Cada linea es el id del sitio (se genera automaticamente en app.js como
// slugify(categoria + "-" + nombre)) seguido de un comentario legible con el
// nombre real para poder editar esta lista a mano sin confundirse.
//
// COMO ACTUALIZAR CADA MES:
//   1. Busca el sitio en el mapa o en data.js.
//   2. Anade o quita su id de este array (el comentario es solo referencia,
//      lo unico que lee el codigo es el string del id).
//   3. Guarda y sube el cambio (git add destacados.js && git commit && git push).
// No hace falta tocar data.js para nada de esto.
//
// Generado automaticamente el 2026-09-01 con gen_destacados.js: 100 locales
// (restaurantes/sidrerias/ocio nocturno) de Gijon elegidos al azar como
// ejemplo de partida. A partir de ahora esta lista se gestiona a mano segun
// quien pague la cuota mensual.
const DESTACADOS_MES = [
  "restaurantes-985-taberna", // 985 taberna (restaurantes) - Gijón
  "ocio-ambigu", // Ambigú (ocio) - Gijón/Xixón
  "ocio-arde-lvcvs", // Arde Lvcvs (ocio) - Calle Marqués de Casa Valdés 37, Gijón/Xixón
  "restaurantes-auga", // Auga (restaurantes) - Muelle de la Madera, Cimavilla, Gijon
  "ocio-bambara", // Bambara (ocio) - Calle Marqués de San Esteban, Gijón/Xixón
  "ocio-bar-de-fonso", // Bar de Fonso (ocio) - Gijón
  "ocio-bar-el-carmen", // Bar El Carmen (ocio) - Gijón
  "ocio-bar-sidreria-mari", // Bar Sidreria Mari (ocio) - Gijón
  "restaurantes-bovino", // Bovino (restaurantes) - Gijón
  "ocio-buddha", // Buddha (ocio) - Gijón
  "ocio-cabare", // Cabaré (ocio) - Gijón
  "ocio-cafe-de-alteis", // Cafe de Alteis (ocio) - Avenida de Salvador Allende, Gijón/Xixón
  "restaurantes-cafe-vinateria-la-septima", // Café Vinatería La Séptima (restaurantes) - Calle del Instituto 7, Gijón/Xixón
  "ocio-cafeteria-bambi", // Cafeteria Bambi (ocio) - Gijón
  "ocio-cafeteria-san-pedro", // Cafeteria San Pedro (ocio) - Gijón/Xixón
  "restaurantes-casa-alberto", // Casa Alberto (restaurantes) - Gijón
  "ocio-casa-aurora", // Casa Aurora (ocio) - Gijón
  "restaurantes-casa-koty", // Casa Koty (restaurantes) - Gijón
  "restaurantes-casa-narciandi", // Casa Narciandi (restaurantes) - Gijón
  "restaurantes-casa-yoli", // Casa Yoli (restaurantes) - Gijón
  "ocio-cerveceria-juar", // Cervecería Juar (ocio) - Gijón
  "restaurantes-ciudadela", // Ciudadela (restaurantes) - Gijon
  "restaurantes-el-albero", // El Albero (restaurantes) - Gijón
  "restaurantes-el-balcon-del-mar", // El Balcón del Mar (restaurantes) - Barrio Portuarios, Gijón/Xixón
  "restaurantes-el-carruaje", // El Carruaje (restaurantes) - Calle San José, Gijón
  "restaurantes-el-cencerro", // El Cencerro (restaurantes) - Calle del Decano Prendes Pando 24, Gijón/Xixón
  "restaurantes-el-coleccionista", // El Coleccionista (restaurantes) - Calle Melquiades Álvarez 9, Gijón
  "restaurantes-el-llavianu", // El llavianu (restaurantes) - Plaza de la Ciudad de La Habana, Gijón
  "restaurantes-el-mancu", // El Mancu (restaurantes) - Gijón
  "ocio-el-palacio", // El Palacio (ocio) - Gijón
  "restaurantes-el-prau-del-sol", // El Prau del Sol (restaurantes) - Gijón
  "restaurantes-el-sauco", // El Sauco (restaurantes) - Gijón
  "restaurantes-el-tasqueru", // El Tasqueru (restaurantes) - Gijón
  "restaurantes-el-trasgu-farton", // El Trasgu Fartón (restaurantes) - Calle Luanco 16, Gijón/Xixón
  "ocio-el-traspaso", // El Traspaso (ocio) - Gijón
  "ocio-el-vinedo", // El Viñedo (ocio) - Gijón
  "restaurantes-finca-villa-maria", // Finca Villa Maria (restaurantes) - Gijón
  "restaurantes-fumu", // Fumu (restaurantes) - Calle Marqués de San Esteban 5, Gijón
  "restaurantes-galastur", // Galastur (restaurantes) - Calle Bobes 6, Gijón
  "restaurantes-gebres", // Gebres (restaurantes) - Gijón
  "restaurantes-gepetto", // Gepetto (restaurantes) - Gijón
  "ocio-gota-a-gota", // gota a gota (ocio) - Gijón
  "restaurantes-kebap-nuevo-roces", // Kebap Nuevo Roces (restaurantes) - Gijón
  "ocio-la-botelluka", // La botelluka (ocio) - Gijón
  "restaurantes-la-casa-del-fideo-ran-ramen-de-china", // La Casa del Fideo Ran (Ramen de China) (restaurantes) - Calle Doctor Aquilino Hurlé 42, Gijón
  "ocio-la-clave-x", // La clave (ocio) - Gijón
  "ocio-la-cuenta-de-la-vieja", // La Cuenta de la Vieja (ocio) - Gijón/Xixón
  "restaurantes-la-huerta", // La Huerta (restaurantes) - Gijón
  "ocio-la-mala-uva", // La Mala Uva (ocio) - Gijón
  "ocio-la-nevera-de-tarantino", // La nevera de Tarantino (ocio) - Gijón
  "restaurantes-la-posada-blanca", // La Posada Blanca (restaurantes) - Carretera de La Providencia, Gijón
  "ocio-la-querendona-en-gijon", // La Querendona en Gijón (ocio) - Gijón
  "ocio-la-salsa", // La Salsa (ocio) - Gijón
  "restaurantes-la-terraza-de-viesques", // La Terraza de Viesques (restaurantes) - Calle Compositor Facundo de la Viña 16, Gijón
  "restaurantes-la-tonada", // La tonada (restaurantes) - Gijón
  "restaurantes-la-vaina", // La Vaina (restaurantes) - Calle Cervantes, Gijón/Xixón
  "ocio-la-vida-alegre", // La vida alegre (ocio) - Gijón
  "restaurantes-laexcusa-perfecta", // Laexcusa Perfecta (restaurantes) - Gijón
  "restaurantes-las-candelas", // Las Candelas (restaurantes) - Gijón/Xixón
  "restaurantes-llagar-del-trole", // Llagar del Trole (restaurantes) - Carretera del Trole 80, Gijón
  "restaurantes-los-caracoles", // Los Caracoles (restaurantes) - Gijón
  "ocio-los-espumeros", // Los Espumeros (ocio) - Gijón
  "restaurantes-los-molcajetes-x", // Los Molcajetes (restaurantes) - Gijón
  "restaurantes-meson-don-silo", // Mesón Don Silo (restaurantes) - Carretera de la Vizcaína 28, Gijón/Xixón
  "restaurantes-pasiones-vegan-bar", // Pasiones vegan bar (restaurantes) - Calle Premio Real 18, Gijón
  "restaurantes-punto-caramelo", // Punto caramelo (restaurantes) - Calle Caridad 5, Gijón
  "restaurantes-que-no-te-lo-cuenten-gastrobar", // Que no te lo cuenten Gastrobar (restaurantes) - Gijón
  "restaurantes-rawcoco-green-bar", // RawCoco Green Bar (restaurantes) - Gijón
  "restaurantes-restaurante-a-caldeira", // Restaurante A Caldeira (restaurantes) - Carretera Campa de Torres 1500, Gijón/Xixón
  "restaurantes-restaurante-magnifico", // Restaurante Magnifico (restaurantes) - Calle Capua 10, Gijón
  "restaurantes-restaurante-marieva-palace", // Restaurante Marieva Palace (restaurantes) - Autovía Oviedo - Gijón/Xixón (Autovía Industrial), Gijón
  "ocio-rub-a-dub-bar", // Rub a Dub Bar (ocio) - Calle del Rosario 50, Gijón
  "ocio-sala-acapulco", // Sala Acapulco (ocio) - Gijón
  "ocio-salamanca", // Salamanca (ocio) - Gijón
  "restaurantes-san-bernardo-iv", // San Bernardo IV (restaurantes) - Gijón
  "restaurantes-sancho-la-merced", // Sancho la Merced (restaurantes) - Gijón
  "ocio-senor-lupulo-despacho-de-cervezas", // Señor Lúpulo. Despacho de cervezas (ocio) - Calle San Antonio 5, Gijón
  "sidrerias-sidreria-boal", // Sidrería Boal (sidrerias) - Gijón
  "sidrerias-sidreria-canteli", // Sidreria Canteli (sidrerias) - Calle Almacenes 4, Gijón/Xixón
  "sidrerias-sidreria-dannys", // Sidreria Dannys (sidrerias) - Gijón
  "ocio-sidreria-el-lavaderu", // Sidreria El Lavaderu (ocio) - Gijón/Xixón
  "sidrerias-sidreria-el-mayu-del-infanzon", // Sidrería El Mayu del Infanzón (sidrerias) - Gijón
  "sidrerias-sidreria-el-mundial", // Sidreria El Mundial (sidrerias) - Gijón
  "sidrerias-sidreria-el-nuevo-parque", // Sidreria El Nuevo Parque (sidrerias) - Gijón
  "sidrerias-sidreria-gancedo", // Sidreria Gancedo (sidrerias) - Gijón
  "ocio-sidreria-la-cabana-del-santu", // Sidrería La Cabaña del Santu (ocio) - Calle Río Sella 9, Gijón
  "sidrerias-sidreria-la-falcata", // Sidreria La Falcata (sidrerias) - Gijón
  "sidrerias-sidreria-nava", // Sidreria Nava (sidrerias) - Plaza de La Serena 1, Gijón
  "sidrerias-sidreria-poniente", // Sidrería Poniente (sidrerias) - Gijón
  "sidrerias-sidreria-victoria", // Sidrería Victoria (sidrerias) - C/ Santa María 24, Gijón
  "sidrerias-sidreria-xixon", // Sidrería Xixón (sidrerias) - Gijón
  "restaurantes-tandoori", // Tandoori (restaurantes) - Calle Vizconde de Campo Grande 4, Gijón
  "ocio-teo", // Teo (ocio) - Gijón
  "restaurantes-terra-tapas", // Terra Tapas (restaurantes) - Calle Saavedra 32, Gijón
  "ocio-terraza-de-la-bodeguita-del-medio", // Terraza de La Bodeguita del Medio (ocio) - Gijón
  "ocio-the-seven", // The Seven (ocio) - Gijón
  "restaurantes-uria", // Uría (restaurantes) - Gijón
  "ocio-varsovia", // Varsovia (ocio) - Calle Cabrales 18, Gijón
  "ocio-vermuteria-taperia", // Vermutería & tapería (ocio) - Gijón
  "restaurantes-villa-lucia", // Villa Lucia (restaurantes) - Calle Leoncio Suárez 13, Gijón
];
