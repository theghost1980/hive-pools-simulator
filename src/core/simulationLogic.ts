// c:\Users\saturno\Downloads\HIVE-Projects\HIve-Pools-Simulator\hive-pools-simulator\src\core\simulationLogic.ts
/**
 * Calcula la Pérdida Impermanente (Impermanent Loss).
 * La fórmula asume que conoces el cambio en el ratio de precios.
 * k = P_final / P_inicial (donde P es el precio de tokenA en términos de tokenB, o viceversa)
 * IL = (2 * sqrt(k) / (1 + k)) - 1
 *
 * @param initialPriceRatio El ratio de precios inicial (ej. precioTokenA_inicial / precioTokenB_inicial).
 * @param finalPriceRatio El ratio de precios final (ej. precioTokenA_final / precioTokenB_final).
 * @returns El porcentaje de Impermanent Loss (ej. -0.05 para -5%). Un valor negativo indica una pérdida.
 */
export const calculateImpermanentLoss = (
  initialPriceRatio: number,
  finalPriceRatio: number
): number => {
  if (initialPriceRatio <= 0) {
    // Evitar división por cero o sqrt de negativo si finalPriceRatio también es 0 o negativo.
    console.error("Initial price ratio must be positive.");
    return 0; // O lanzar un error, según cómo quieras manejarlo.
  }
  // Asegurarse que finalPriceRatio no cause problemas con Math.sqrt si es 0 o negativo
  // aunque la lógica de priceRatioChange ya lo manejaría si initialPriceRatio es positivo.
  if (finalPriceRatio < 0) {
    console.error(
      "Final price ratio cannot be negative if initial is positive."
    );
    return 0; // O manejar de otra forma
  }

  const priceRatioChange = finalPriceRatio / initialPriceRatio;
  if (priceRatioChange < 0) {
    // Esto no debería ocurrir si ambos ratios son positivos
    console.error(
      "Price ratio change resulted in a negative number, check inputs."
    );
    return 0;
  }
  const il = (2 * Math.sqrt(priceRatioChange)) / (1 + priceRatioChange) - 1;
  return il;
};
