# 🚗 TravelST - README

## 📖 Introducción

TravelST es una **aplicación móvil** diseñada para facilitar el retorno de los alumnos de **Duoc UC** a sus hogares tras la jornada académica. En el contexto de la pandemia, muchos estudiantes se han enfrentado a desafíos en el transporte. Esta aplicación busca resolver esas dificultades, promoviendo la colaboración entre estudiantes y fomentando un ambiente de compañerismo.


## 🌍 Contexto

Durante la pandemia, las instituciones de educación superior se vieron obligadas a adaptar sus modalidades de enseñanza, pasando de clases presenciales a remotas. Con el regreso gradual a la presencialidad, han surgido problemas en el transporte de los estudiantes, especialmente en horas vespertinas. Las principales dificultades son:

- ❌ Falta de transporte público en horario vespertino.
- 💸 Alto costo de servicios de transporte particular (Uber, taxi, etc.).
- 🚶‍♂️ Ausencia de movilización propia.
- 🏫 Falta de transporte facilitado por la institución.


## 🎯 Objetivos de la App

TravelST tiene como objetivos principales:

- ⏱ **Reducir los tiempos** para encontrar movilización de retorno.
- 🤝 **Fomentar el compañerismo** entre alumnos.
- 📚 **Instar a los alumnos** a asistir presencialmente a clases.
- 🌱 **Reducir la huella de carbono** promoviendo el uso compartido de vehículos.


## 🔄 Funcionamiento de la Aplicación

La lógica de funcionamiento de TravelST es la siguiente:

1. **Registro de Conductores**: 
   - 🚗 Alumnos con vehículo ingresan a la App, programan su viaje de retorno y fijan el costo por persona.
   
2. **Consulta de Pasajeros**:
   - 📲 Alumnos sin movilización propia verifican si hay vehículos disponibles.
   - 🔄 Si no hay capacidad de transporte, pueden volver a intentar.
   - ✔️ Si hay capacidad, solicitan el viaje.

3. **Organización del Viaje**:
   - 👥 Los alumnos se reúnen, pagan su tarifa y comienzan el viaje.


## ⚙️ Tecnologías Utilizadas

TravelST se desarrollará utilizando las siguientes tecnologías:

- **Ionic**: Para el desarrollo de aplicaciones móviles multiplataforma.
- **Angular**: Para la estructura de la aplicación y manejo de la lógica del frontend.
- **TypeScript**: Para una programación más robusta y escalable.
- **HTML, CSS, JavaScript**: Para la creación de la interfaz de usuario.
- **Node.js**: Para el desarrollo del backend y manejo de la lógica del servidor.
- **GitHub**: Para el control de versiones y colaboración en el desarrollo.
- **JSON**: Para el intercambio de datos entre el cliente y el servidor.
- **Visual Studio Code**: Como entorno de desarrollo integrado.
- **Firebase**: Como plataforma para el desarrollo de aplicaciones web y Mobile

## ⚙️ APIs y configuraciones implementadas
1. **Firebase**:
   - **Fireauth**: Para realizar inicio de sesión de la aplicación
   - **Firestore**: Para almacenamiento de usuarios y viajes registrados
   - **Hosting**: Para ver la página web alojado: https://travelst-e4d8f.web.app/
2. **APIs consumidas**:
   - **Mindicador**: Valor dólar a peso chileno, implementado en el precio de registro de viajes.
   - **PokeAPI**: Imágenes de Pokémon, implementado para fotos de perfiles de forma aleatoria
3. **Código QR**: Código QR implementado en la página de usuarios, lo cual el código tiene información del RUT del usuario logueado

## ⚙️ Instalación del proyecto

1. **Clonar repositorio**:
  ```
  git clone https://github.com/Ca-LeFort/TravelST_Ionic.git
  ```

2. **Instalar Depedencias**:
Dirígete a la carpeta del proyecto TravelST y ejecuta los siguientes comandos:
```
npm install
npm install leaflet
npm install @types/leaflet
npm install leaflet-control-geocoder
npm install leaflet-routing-machine
npm install @types/leaflet-routing-machine
npm install angularx-qrcode
npm install firebase
npm install @angular/fire
```

3. **Ejecutar Proyecto**:
Para comenzar la ejecución y visualizar su funcionamiento, deberás ejecutar el siguiente comando en una terminal (cmd o bash):
```
ionic serve
```

## 🆘 Soporte

Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto con el equipo de desarrollo:

- **Correo Electrónico**: support@travelsTapp.com

¡Gracias por tu interés en **TravelST**! Juntos, podemos hacer que el transporte entre compañeros sea más accesible y eficiente. 🚀

