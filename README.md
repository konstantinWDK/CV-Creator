# 📝 CV Creator - Generador de Currículums Profesional

Una aplicación web moderna, rápida y minimalista diseñada para ayudarte a crear currículums impactantes en cuestión de minutos. Construida con **React 19** y **Vite**, esta herramienta prioriza la privacidad (almacenamiento local) y la facilidad de uso.

![Captura de pantalla del proyecto](public/screenshot.png) *(Nota: Asegúrate de añadir una captura de pantalla real en la carpeta public)*

## ✨ Características Principales

- **Vista Previa en Tiempo Real**: Visualiza los cambios instantáneamente mientras editas tu información.
- **Múltiples Plantillas**: Elige entre varios diseños profesionales (Minimalista, Moderno, Profesional, Clásico).
- **Descarga en PDF**: Genera un archivo PDF de alta calidad optimizado para formato A4.
- **Privacidad Total**: Tus datos se guardan exclusivamente en el `localStorage` de tu navegador. No enviamos tu información a ningún servidor.
- **Gestión de Múltiples CVs**: Crea, guarda y elimina diferentes versiones de tu currículum fácilmente.
- **Interactividad Avanzada**: 
  - Reordena secciones de experiencia y educación mediante **Arrastrar y Soltar (Drag & Drop)**.
  - Generación automática de **Códigos QR** (enlace a LinkedIn, GitHub o web personal).
  - Editor de texto enriquecido para descripciones detalladas.
- **Diseño Responsivo**: Totalmente funcional tanto en escritorio como en dispositivos móviles.

## 🚀 Tecnologías Utilizadas

- **Core**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilos**: CSS nativo con variables modernas y efectos de "Glassmorphism".
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Generación de PDF**: [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Utilidades**: 
  - `date-fns` para manejo de fechas.
  - `qrcode.react` para códigos QR dinámicos.
  - `react-quill-new` para la edición de texto.

## 🛠️ Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/konstantinWDK/CV-Creator.git
   cd CV-Creator
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abre tu navegador** en la dirección que indique la terminal (normalmente `http://localhost:5173`).

## 📖 Cómo utilizarlo

1. **Datos Personales**: Rellena tu información básica y sube una foto si lo deseas.
2. **Experiencia y Educación**: Añade tus hitos profesionales. Puedes arrastrar los bloques para cambiar su orden cronológico o de importancia.
3. **Personalización**: Ve a la pestaña de **Configuración Global** para cambiar la plantilla, la tipografía o los márgenes.
4. **Guardar**: Haz clic en el icono del disquete para guardar los cambios en tu navegador.
5. **Descargar**: Pulsa el botón de descarga para generar tu PDF listo para enviar.

---
Desarrollado con ❤️ por [WEBMASTERK](https://github.com/konstantinWDK)
