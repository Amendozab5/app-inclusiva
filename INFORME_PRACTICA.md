# Informe de Práctica Experimental Detallado: Plataforma Inclusiva Académica

## 📊 1. Arquitectura de Referencia del Sistema
La arquitectura implementada sigue el patrón de **Separación de Responsabilidades (SoC)**, garantizando que el sistema sea modular, seguro y fácil de mantener a largo plazo.

### 1.1 Modelo N-Tier (Tres Capas)
*   **Capa de Presentación (Client-Side):** Utiliza **Angular 17** con una arquitectura de "Standalone Components". Esto elimina la necesidad de módulos complejos y acelera la carga inicial mediante *Lazy Loading*. La UI implementa una estética "Premium Glassmorphism" para una experiencia de usuario moderna.
*   **Capa de Servicio y Negocio (Server-Side):** Basada en **Spring Boot 3.2.x**. Esta capa expone una **API RESTful** segura. Se encarga de la lógica de negocio, reglas de validación y la gestión de la seguridad mediante **Spring Security**.
*   **Capa de Datos (Persistence):** Se apoya en **PostgreSQL**. El acceso a los datos se realiza a través de **Spring Data JPA**, lo que permite una abstracción total del lenguaje SQL y protege contra inyecciones de código.

// Aquí va una imagen que muestra el diagrama de arquitectura lógica, detallando la comunicación entre Angular (TypeScript) y Spring Boot (Java) a través de JSON.

### 1.2 Flujo de Seguridad y Autenticación
El sistema implementa un flujo de seguridad basado en **Stateless Authentication** con interceptores en el frontend para adjuntar el token en cada petición.
// Aquí va una imagen que muestra el flujo de captura de pantalla del Login y la generación del token JWT en la consola de desarrollador.

---

## 🛠️ 2. Justificación Tecnológica y Decisión de Diseño
Cada herramienta fue seleccionada no solo por su popularidad, sino por su capacidad de integrarse en un ecosistema inclusivo.

### 2.1 Backend: El Núcleo Robusto
*   **Java 17 (LTS):** Elegido por sus mejoras en rendimiento y nuevas características de lenguaje (como Records) que simplifican los DTOs.
*   **Spring Security + JWT:** Fundamental para la inclusión. Permite que el sistema reconozca el rol del usuario (`ADMIN`, `EDITOR`, etc.) y adapte la interfaz de forma dinámica.

```java
/**
 * Justificación: Control de Acceso Granular.
 * Este código asegura que solo los Administradores puedan ver y editar usuarios,
 * protegiendo la privacidad de los datos sensibles.
 */
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/listar-todos")
public ResponseEntity<List<UsuarioDTO>> listarUsuarios() {
    return ResponseEntity.ok(usuarioService.findAll());
}
```

### 2.2 Frontend: Accesibilidad Adaptativa
*   **Vanilla CSS:** Se decidió no usar frameworks pesados (como Tailwind o Bootstrap) para evitar la "polución" del DOM. Esto permite que los selectores de accesibilidad sean 100% precisos.
*   **Angular Standalone:** Facilita la creación de componentes transversales como el `AccessibilityMenuComponent`.

```typescript
/**
 * Justificación: Lógica de Inclusión Reactiva.
 * Usamos el DOM estándar para reaccionar a cambios de contraste sin 
 * afectar el rendimiento de la aplicación.
 */
applyAccessibilitySettings() {
  const body = document.body;
  // Cambiamos el tamaño de fuente global usando variables CSS
  body.style.setProperty('--global-font-size', `${this.fontSize}px`);
  // Alternamos el modo de alto contraste para sensibilidad visual
  this.highContrast ? body.classList.add('hc-active') : body.classList.remove('hc-active');
}
```

// Aquí va una imagen que muestra la estructura de carpetas del proyecto, evidenciando la modularidad y el orden del código fuente.

---

## ♿ 3. Apartado de Inclusión: Diseño Universal (UDL)
La inclusión en este proyecto se aborda desde la **proactividad**, no como una corrección posterior.

### 3.1 Funcionalidades de Inclusión Operativas
1.  **Visor de Detalles Magnificado:** Al abrir un producto, la imagen y el texto se presentan en un modal optimizado para evitar distracciones visuales (cluttering).
2.  **Soporte nativo para Lectores de Pantalla:** Se han integrado atributos `aria-label` en iconos que no tienen texto visible (como los botones de borrar o cerrar sesión).
3.  **Navegación Asistida:** El menú flotante de accesibilidad permite a usuarios con daltonismo u otras discapacidades visuales alternar esquemas de color de alta legibilidad.

// Aquí va una imagen que muestra la comparación "Lado a Lado" entre el Modo Normal y el Modo de Alto Contraste.

### 3.2 Evaluación de Calidad (Compliance)
La calidad se midió bajo tres ejes fundamentales:
*   **Efectividad:** ¿Pueden todos los usuarios realizar un CRUD? (Validado mediante pruebas de usuario).
*   **Eficiencia:** El sistema carga en menos de 2 segundos en condiciones normales.
*   **Satisfacción Inclusiva:** Uso de la herramienta **WAVE** para certificar que el ratio de contraste cumple con **AA (WCAG 2.1)**.

| Componente | Validación de Calidad | Evidencia Técnica |
| :--- | :--- | :--- |
| Tabla de Usuarios | Responsividad total | Grid de 1 a 4 columnas |
| Formulario Registro | Validaciones en tiempo real | Feedback visual inmediato |
| Menú Accesibilidad | Persistencia de estado | Uso de LocalStorage |
| Seguridad de API | Bloqueo de rutas ilegales | HTTP 403 Forbidden |

// Aquí va una imagen que muestra el panel de auditoría de Google Chrome Lighthouse con un puntaje alto en Accesibilidad y Mejores Prácticas.

---

## 📝 4. Conclusiones de la Práctica Experimental
La práctica demuestra que el desarrollo moderno no está reñido con la accesibilidad. Al utilizar tecnologías de vanguardia como **Spring Boot** y **Angular**, logramos un sistema que es:
1.  **Seguro:** Gracias a la implementación de JWT y roles.
2.  **Escalable:** Debido a la arquitectura de micro-servicios lógicos.
3.  **Humano:** Al priorizar la inclusión como un requisito funcional de primer orden.

// Aquí va una imagen que demuestra el éxito de la prueba final: la creación exitosa de un producto y su visualización correcta en el catálogo.

---
**Elaborado para:** Asignatura de Aplicaciones Web – Universidad Técnica de Quevedo.
**Propósito:** Evidenciar la integración de competencias de diseño, backend y frontend inclusivo.
