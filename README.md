# Musk Frontend Final

Aplicación web para lectura de noticias. Proyecto final de la escuela Musk en la dirección de Frontend Developer

-   **Deploy en Vercel**: https://musk-frontend-final-1.vercel.app/
-   **GitHib**: https://github.com/denzakh/musk-frontend-final-1
-   **Figma**: https://www.figma.com/design/lo6iXkyCzPPlJOd6BPX2cR/musk-final-1?node-id=0-1&t=zzJyocICcnrHrd8e-1

---

![](https://github.com/denzakh/musk-frontend-final-1/raw/main/doc/desktop-dark.jpg)

## 🛠 Tecnologías utilizadas

-   **React** — biblioteca para construir interfaces de usuario.
-   **TypeScript** — JavaScript tipado.
-   **React Router** — para gestionar las rutas de las diferentes secciones de la aplicación (categorías de noticias).
-   **Vite** — herramienta de construcción rápida para proyectos.
-   **Vitest** — framework para pruebas unitarias.
-   **Testing Library** — librería para testeo de componentes React.
-   **Axios** — cliente HTTP para consumir APIs.
-   **News API** — API externa para obtener noticias.
-   **Tailwind** — estilos personalizados.
-   **ESLint** — herramienta de análisis de código para mantener buenas prácticas.

![](https://github.com/denzakh/musk-frontend-final-1/raw/main/doc/desktop-white.jpg)

## ✨ Funcionalidades principales

-   Visualización de noticias actualizadas desde una API externa.
-   Filtro de noticias por categoría.
-   Gestión de noticias favoritas.
-   Búsqueda de noticias por palabra clave.
-   Modo oscuro y claro (dark mode toggle) a través de un hook personalizado.
-   Skeletons para carga de noticias (efecto de carga).
-   Arquitectura modular basada en componentes reutilizables.
-   Pruebas unitarias para garantizar calidad y funcionamiento del proyecto.

![](https://github.com/denzakh/musk-frontend-final-1/raw/main/doc/mobile.jpg)

## 📰 Características de la NewsAPI

"Las solicitudes del navegador no están permitidas en el plan Desarrollador, excepto las solicitudes desde el localhost" https://newsapi.org/pricing Debido a esto, al realizar la implementación en Vercell es necesario utilizar un servidor proxy.

Los parámetros `category` y `sources` no se pueden utilizar juntos. Por lo tanto, en la aplicación estas solicitudes se dividen en diferentes páginas.

Hay límites en la cantidad de solicitudes por día.

![](https://github.com/denzakh/musk-frontend-final-1/raw/main/doc/filter.jpg)

## 🧪 Pruebas

El proyecto incluye pruebas unitarias para los principales componentes:

-   `Navbar.test.tsx` — pruebas para el componente Navbar.
-   `NewsCard.test.tsx` — pruebas para el componente NewsCard.
-   `Category.test.tsx` — pruebas para la página Category.
-   `FilterPage.test.tsx` — pruebas para la página FilterPage.
-   `App.test.tsx` — pruebas de integración para la aplicación completa.
-   `newsApi.test.ts` — pruebas para los servicios de la API
-   `useDarkMode.test.tsx` — pruebas para el hook personalizado useDarkMode.
-   `localStorage.test.ts` — pruebas para las utilidades de manejo de localStorage.

Además, se utiliza la carpeta `__snapshots__` para almacenar capturas de los componentes.

## 🚀 Instalación y ejecución

1. **Clonar el repositorio:**

```bash
git clone https://github.com/denzakh/musk-frontend-final-1.git
cd musk-frontend-final-1
```

2. **Instalar las dependencias:**

```bash
npm install
```

3. **Instalar Vercel CLI globalmente**. La API de noticias no permite recibirlas directamente desde el navegador, por lo que se necesita un servidor intermedio.

```bash
npm i -g vercel
```

4. **Iniciar el proyecto en modo desarrollo:**

```bash
npm run vercel
```

5. **Ejecutar las pruebas:**

```bash
npm run test
```

## 📁 Estructura del proyecto

```
src/
├── assets/
├── components/
│   ├── Navbar.tsx
│   ├── Navbar.test.tsx
│   ├── NewsCard.tsx
│   ├── NewsCard.test.tsx
│   ├── NewsCardSkeleton.tsx
│   └── __snapshots__/
├── hooks/
│   ├── useDarkMode.ts
│   └── useDarkMode.test.tsx
├── pages/
│   ├── Category.tsx
│   ├── Category.test.tsx
│   ├── Favorites.tsx
│   ├── FilterPage.tsx
│   └── FilterPage.test.tsx
├── services/
│   └── newsApi.ts
├── types/
│   └── news.ts
├── utils/
├── App.tsx
├── App.css
├── index.css
├── main.tsx
├── setupTests.ts
└── vite-env.d.ts

/
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```
