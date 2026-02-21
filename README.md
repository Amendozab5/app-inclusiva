# Plataforma Inclusiva Académica

Proyecto integral que combina un backend en **Spring Boot** y un frontend moderno en **Angular**. La plataforma está diseñada bajo principios de accesibilidad, seguridad y rendimiento premium.

## 🚀 Arquitectura del Proyecto

Este repositorio contiene:
-   📂 `backend/`: API Rest funcional con Spring Boot 3, Spring Security y JWT.
-   📂 `frontend/`: Aplicación SPA con Angular 17, diseño Glassmorphism y accesibilidad mejorada.

## 🛠️ Tecnologías Utilizadas

### Backend
-   **Java 17** con **Spring Boot 3.x**
-   **Spring Security** + **JWT** (Autenticación sin estado)
-   **Spring Data JPA** + **PostgreSQL**
-   **Lombok** (Productividad)
-   **Maven** (Gestión de dependencias)

### Frontend
-   **Angular 17+** (Standalone components)
-   **Google Fonts (Inter)** & **Lucide Icons**
-   **Vanilla CSS** (Sistema de diseño premium personalizado)
-   Gestión de estados reactiva con **RxJS**

## 🏁 Cómo empezar

### Requisitos previos
-   **JDK 17** o superior
-   **Node.js 18** o superior
-   **PostgreSQL** con una base de datos llamada `app_inclusiva`

### Ejecución del Backend
1. Entra en el directorio `backend`:
   ```bash
   cd backend
   ```
2. Ejecuta el servidor:
   ```bash
   ./mvnw spring-boot:run
   ```
   *El backend correrá en `http://localhost:8080`*

### Ejecución del Frontend
1. Entra en el directorio `frontend`:
   ```bash
   cd frontend
   ```
2. Instala dependencias (si es la primera vez):
   ```bash
   npm install
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   ng serve
   ```
   *Accede a `http://localhost:4200`*

## 🔐 Credenciales de Prueba (Default)
-   **Admin**: `admin@app.com` / `admin123`

## 👥 Colaboración
Si deseas colaborar:
1. Haz un Fork del proyecto.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-mejora`).
3. Haz un commit de tus cambios (`git commit -m 'Añadida mejora X'`).
4. Sube la rama (`git push origin feature/nueva-mejora`).
5. Abre un Pull Request.

---
© 2026 Plataforma Inclusiva Académica.
