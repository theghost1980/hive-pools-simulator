# DEVLOGS

## Sesión: 2025-06-07

### Resumen de Actividades:

1.  **Análisis Inicial del Proyecto:**

    - Revisión general de la estructura del proyecto y archivos de configuración (`package.json`, `tsconfig.json`).
    - Identificación del objetivo principal: Simulador de pools de liquidez en Hive.

2.  **Planificación y Diseño:**

    - Discusión y definición de wireframes conceptuales para la interfaz del simulador.
    - Creación de una lista de tareas (To-Do) detallada para el desarrollo del simulador.

3.  **Revisión de Código Existente:**

    - Análisis de los siguientes archivos proporcionados:
      - `src/api/BaseApi.ts`: Funciones genéricas para `fetch` GET/POST.
      - `src/api/DHiveClientApi.ts`: Cliente `dhive` y función para historial de cuenta.
      - `src/utils/ssc-library-util.ts`: Inicialización del cliente `SSC` de Hive Engine.
      - `src/pages/pools.tsx`: Página para listar pools y sus posiciones.
      - `src/pages/positions.tsx`: Página para buscar y detallar posiciones de un usuario.

4.  **Desarrollo del Componente `Simulator` (`src/pages/simulator.tsx`):**
    - **Selección de Pool:**
      - Implementación de la carga y visualización de la lista de pools de Hive Engine usando `SscLibraryUtils`.
      - Permitir al usuario seleccionar un pool de un desplegable.
      - Mostrar información detallada del pool seleccionado (cantidades, precios, shares, etc.).
    - **Definición de Posición:**
      - Añadir inputs para que el usuario ingrese las cantidades de los tokens del par.
      - Implementar cálculo automático de la cantidad del segundo token basado en el ratio actual del pool cuando se ingresa la cantidad del primero.
    - **Parámetros de Proyección:**
      - Añadir inputs para el horizonte temporal de la simulación (días).
      - Añadir inputs para que el usuario ingrese los porcentajes de fee para el token base y el token quote.
    - **Cálculo de Simulación (`handleCalculateSimulation`):**
      - Implementación inicial del botón "Calcular Proyección".
      - Validación de entradas del usuario.
      - Llamada a la API externa del usuario (`testhivelpindex.duckdns.org/public/pool-fees`) para obtener datos de fees diarias estimadas.
      - Cálculo de las fees totales estimadas para el período de simulación.
      - Implementación del cálculo de Pérdida Impermanente (IL) utilizando `calculateImpermanentLoss` (asumiendo inicialmente que no hay cambio en el precio relativo de los tokens).
      - Mostrar los resultados estimados (fees totales en USD e IL en porcentaje).
    - **Mejoras y Correcciones:**
      - Ajuste en el manejo de la respuesta de la API de fees para usar el campo `totalFeesPoolUSD`.
      - Corrección de importaciones faltantes (`BaseApi`, `calculateImpermanentLoss`).

### Próximos Pasos Sugeridos (Continuación):

- Refinar los cálculos de la simulación (valor inicial/final en USD, IL en USD, HODL vs LP).
- Permitir al usuario simular cambios de precio para un cálculo de IL más dinámico.
- Mejorar la presentación de los resultados.
