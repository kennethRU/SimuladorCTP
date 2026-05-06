# Simulador de Capacitación — CTP Carrizal

Plan de capacitación en habilidades blandas · 9 módulos interactivos · IA con Groq

## Estructura del proyecto

```
simulador-ctp/
├── index.html          ← Página principal
├── vercel.json         ← Configuración de Vercel
├── css/
│   └── style.css       ← Todos los estilos
├── js/
│   ├── data.js         ← Datos de los 9 módulos
│   ├── sims.js         ← Los 9 simuladores
│   └── app.js          ← Router y estado global
└── api/
    └── chat.js         ← Función serverless (proxy Groq)
```

---

## Despliegue en Vercel (paso a paso)

### Paso 1 — Crear repositorio en GitHub
1. Vaya a [github.com](https://github.com) e inicie sesión (cree cuenta si no tiene).
2. Haga clic en **"New repository"**.
3. Nómbrelo `simulador-ctp`, márquelo como **Public**, haga clic en **Create**.
4. Suba todos los archivos del proyecto a ese repositorio.
   - Opción sencilla: arrastre la carpeta completa al repositorio desde el navegador.

### Paso 2 — Conectar Vercel
1. Vaya a [vercel.com](https://vercel.com) e inicie sesión con su cuenta de GitHub.
2. Haga clic en **"Add New Project"**.
3. Seleccione el repositorio `simulador-ctp`.
4. Haga clic en **Deploy** (sin cambiar ningún ajuste).

### Paso 3 — Agregar la API key de Groq
1. En el panel de Vercel, vaya a su proyecto → **Settings** → **Environment Variables**.
2. Agregue una variable:
   - **Name:** `GROQ_API_KEY`
   - **Value:** su API key de Groq (obténgala en [console.groq.com](https://console.groq.com))
3. Haga clic en **Save**.
4. Vaya a **Deployments** → haga clic en los 3 puntos → **Redeploy**.

### Paso 4 — Compartir el enlace
Vercel le asigna un enlace como `https://simulador-ctp.vercel.app`.
Compártalo con los docentes por WhatsApp, correo o el aula virtual.

---

## Obtener la API key de Groq (gratuita)

1. Vaya a [console.groq.com](https://console.groq.com)
2. Cree una cuenta gratuita.
3. En el menú lateral, haga clic en **API Keys** → **Create API Key**.
4. Copie la clave generada y úsela en el Paso 3 de arriba.

El plan gratuito de Groq incluye 30 solicitudes por minuto y 14,400 por día — más que suficiente para un grupo de docentes.

---

## Módulos incluidos

| # | Módulo | Fase | Horas | Tipo |
|---|--------|------|-------|------|
| 1 | Manejo del Tiempo | 1 | 8h | Matriz de Eisenhower |
| 2 | Adaptabilidad y Resiliencia | 1 | 8h | Toma de decisiones |
| 3 | Comunicación Efectiva | 2 | 6h | **Chat con IA** |
| 4 | Resolución de Conflictos | 2 | 6h | Toma de decisiones |
| 5 | Pensamiento Crítico | 2 | 6h | Análisis de datos |
| 6 | Inteligencia Emocional | 2 | 6h | 5 situaciones |
| 7 | Trabajo en Equipo | 3 | 4h | Asignación de roles |
| 8 | Liderazgo Pedagógico | 3 | 4h | **Texto evaluado por IA** |
| 9 | Creatividad e Innovación | 3 | 6h | Diseño de estrategia |

**Total: 54 horas · 3 fases · 9 habilidades blandas**
