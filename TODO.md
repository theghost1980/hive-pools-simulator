Wireframes Conceptuales (Descripciones de Interfaz)

Wireframe General de la Aplicación

plaintext
+--------------------------------------------------------------------------+
| [Título: Simulador de Pools de Liquidez Hive] [Ayuda (?)] [Acerca de] |
+--------------------------------------------------------------------------+
| |
| SECCIÓN 1: Configuración de la Simulación |
| Sub-Sección 1.1: Selección del Pool |
| Sub-Sección 1.2: Definición de la Posición (Nueva o Existente) |
| |
+--------------------------------------------------------------------------+
| |
| SECCIÓN 2: Parámetros de Proyección |
| Sub-Sección 2.1: Horizonte Temporal |
| Sub-Sección 2.2: Escenario de Precios (Opcional Avanzado) |
| Sub-Sección 2.3: Escenario de Volumen/Fees (Opcional Avanzado) |
| |
+--------------------------------------------------------------------------+
| |
| [ BOTÓN GRANDE: CALCULAR PROYECCIÓN ] |
| |
+--------------------------------------------------------------------------+
| |
| SECCIÓN 3: Resultados de la Simulación |
| Sub-Sección 3.1: Resumen Principal (Comparativa HODL vs LP) |
| Sub-Sección 3.2: Desglose de Ganancias, Fees e Impermanent Loss |
| (Opcional: Gráficos simples) |
| |
+--------------------------------------------------------------------------+
Detalle de Secciones:

Sección 1: Configuración de la Simulación

plaintext
+--- SECCIÓN 1: Configuración de la Simulación ---------------------------+
| |
| 1.1 Elige un Pool: |
| [Selector Desplegable de Pools (ej: SWAP.HIVE:BEE) ▼ ] |
| Información del Pool (se actualiza al seleccionar): |
| - Liquidez Total: $\_**\_ (TokenA: \_\_**, TokenB: \_**\_) |
| - Volumen 24h: $\_\_** |
| - Fees Estimadas 24h (Pool): $\_**\_ |
| |
| 1.2 Define tu Posición: |
| ( ) Simular Nueva Posición |
| Cantidad Token A: [**\_\_\_\***\*] [Símbolo Token A] |
| Cantidad Token B: [_________] [Símbolo Token B] |
| (Opcional: autocompletar un token si se ingresa el otro) |
| > Valor Inicial Estimado: $\_**\_ |
| > % del Pool Estimado: \_\_\*\*% |
| |
| ( ) Cargar Posición Existente (del Pool seleccionado) |
| Usuario Hive: [___________] [Botón: Cargar] |
| (Al cargar, mostrar cantidades y % del pool) |
| |
+--------------------------------------------------------------------------+
Sección 2: Parámetros de Proyección

plaintext
+--- SECCIÓN 2: Parámetros de Proyección ---------------------------------+
| |
| 2.1 Horizonte Temporal: |
| Simular por: [ 30 ] días (Slider o input con presets: 1,7,30,90,custom)|
| |
| 2.2 Escenario de Precios (Opcional - por defecto precios actuales): |
| [ ] Mantener precios actuales (marcado por defecto) |
| Si se desmarca o se elige "Avanzado": |
| Precio Futuro Token A (vs USD o TokenB): [_________] |
| Precio Futuro Token B (vs USD o TokenA): [_________] |
| (Presets opcionales: "Alcista Token A", "Mercado Lateral", etc.) |
| |
| 2.3 Escenario de Volumen/Fees (Opcional - por defecto datos 24h): |
| [ ] Usar datos de fees/volumen de las últimas 24h (marcado por defecto)|
| Si se desmarca o se elige "Avanzado": |
| Cambio en Volumen Diario Esperado: [ 0 ] % (ej. +20%, -10%) |
| (Esto recalcularía las fees proyectadas) |
| |
+--------------------------------------------------------------------------+
Sección 3: Resultados de la Simulación

plaintext
+--- SECCIÓN 3: Resultados de la Simulación ------------------------------+
| |
| Resumen Comparativo (para el período de \_\_ días): |
| ---------------------------------------------------------------------- |
| | | Si Haces HODL | En Pool Liquidez |
| |-------------------------------|------------------|------------------|
| | Valor Inicial de Activos | $AAAA | $AAAA |
| | Token A Inicial | TTTTa | TTTTa |
| | Token B Inicial | TTTTb | TTTTb |
| |-------------------------------|------------------|------------------|
| | Valor Final Estimado | $BBBB | $CCCC |
| | Token A Final Estimado | TTTTa | TTTTx |
| | Token B Final Estimado | TTTTb | TTTTy |
| ---------------------------------------------------------------------- |
| |
| Desglose de la Posición en Pool: |
| + Fees Ganadas Estimadas: $FFFF (TokenA: FFa, TokenB: FFb) |
| - Pérdida Impermanente (IL): $IIII (II.ii %) |
| ---------------------------------------------------------------------- |
| = Resultado Neto (Pool vs HODL): $NNNN (Color verde si >0, rojo si <0)|
| (Explicación: LP fue $NNNN [mejor/peor] que HODL) |
| |
| (Opcional: Botón "Ver detalles avanzados" con gráficos o logs) |
| |
+--------------------------------------------------------------------------+

Resumen de Tareas (To-Do List)

Aquí tienes un desglose de las tareas principales para desarrollar el simulador:

**Fase 0: Backend y Entorno de Pruebas**

- **[BACKEND] Revisión de Cálculos de Fees:**
  - Investigar por qué los cálculos de fees en el endpoint `https://testhivelpindex.duckdns.org/public/pool-fees` actualmente solo funcionan correctamente para el par BEE:DEC y no para otros pools de liquidez.
- **[BACKEND] Entorno de Pruebas Local:**
  - Descargar una copia de los datos del índice a un entorno local.
  - Habilitar el servicio del índice localmente para facilitar las pruebas y depuración antes de desplegar cambios en el VPS.

Fase 1: Lógica Central y Datos

- **[CORE] Cálculo de Fees Acumuladas (Refinamiento):**
  - Estimar las fees generadas específicamente para la _posición del usuario_ (actualmente se calculan las fees totales del pool y se proyectan, pero no se asigna una porción al LP simulado). Esto implicaría considerar el porcentaje del pool que representaría la posición simulada.
- **[CORE] Lógica de Proyección de Posición:**
  - Simular cómo cambian las cantidades de Token A y Token B en la posición del LP a medida que los precios fluctúan (debido al rebalanceo constante del pool y acumulación de fees en los tokens del pool).
- **[DATA] Integración con API de Hive/Hive Engine (para el simulador):**
  - Obtener posiciones de liquidez de un usuario específico (para la funcionalidad "Cargar Posición Existente" en el simulador).
- **[DATA] Integración con tu Índice de Datos (Opcional/Avanzado):**
  - Acceder a los datos de trading de 24h (volumen) por par desde tu índice para escenarios de proyección de volumen/fees más avanzados.

Fase 2: Interfaz de Usuario (React Components)

- **[UI] Componente de Entrada de Posición:**
  - Implementar la opción para cargar una posición existente de un usuario Hive.
- **[UI] Componente de Parámetros de Simulación (Avanzado):**
  - Inputs para que el usuario especifique precios futuros esperados para los tokens (para un cálculo de IL dinámico).
  - Inputs para que el usuario simule cambios en el volumen diario del pool (para proyecciones de fees más flexibles).
- **[UI] Componente de Visualización de Resultados (Refinamiento):**
  - Mostrar claramente el valor inicial de la posición en USD.
  - Calcular y mostrar el valor final estimado de la posición si se hubiera hecho HODL (en USD y tokens).
  - Calcular y mostrar el valor final estimado de la posición en el pool (en USD y tokens).
  - Mostrar el valor del Impermanent Loss en USD.
  - Mostrar el resultado neto (Pool vs HODL) en USD.
  - Usar indicadores visuales (colores) para el resultado neto.

Fase 3: Estado y Flujo

- (Las tareas principales de esta fase están cubiertas en su forma básica, se refinarán a medida que se añadan más funcionalidades)

Fase 4: Mejoras y Refinamientos (Opcional/Iterativo)

- **[UX] Tooltips y Ayudas Contextuales:**
  - Añadir explicaciones más detalladas y tooltips para los diferentes parámetros y resultados.
- **[UX] Modo Simple vs. Avanzado:**
  - Diseñar e implementar una forma clara de alternar entre una vista simple con defaults y una vista avanzada con más parámetros de simulación.
- **[UX] Gráficos (si se decide implementar):**
  - Desarrollar visualizaciones simples (ej. gráficos de barras) para comparar HODL vs LP o mostrar el impacto del IL.
- **[TEST] Pruebas:**
  - Implementar pruebas unitarias para la lógica de cálculo.
  - Realizar pruebas de interfaz de usuario más exhaustivas.
