import React, { useEffect, useState } from "react";
import { BaseApi } from "../api/BaseApi";
import Loader from "../components/Loader";
import { calculateImpermanentLoss } from "../core/simulationLogic";
import { Pool } from "../interfaces/pools.interface";
import { SscLibraryUtils } from "../utils/ssc-library-util";

interface SimulationResult {
  totalFeesUSD: number | null;
  impermanentLossPercentage: number | null;
  // --- Campos para el futuro ---
  // initialValueUSD?: number;
  // impermanentLossUSD?: number;
  // finalValueLP_USD?: number;
  // hodlValueUSD?: number;
  // netResultUSD?: number;
}

const Simulator = () => {
  const [allPools, setAllPools] = useState<Pool[]>([]);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [isLoadingPools, setIsLoadingPools] = useState<boolean>(true);

  // Estados para la definición de la posición
  const [amountTokenA, setAmountTokenA] = useState<string>("");
  const [amountTokenB, setAmountTokenB] = useState<string>("");

  // Estados para los parámetros de proyección
  const [simulationDays, setSimulationDays] = useState<string>("30"); // Default 30 días
  const [feePercentageBase, setFeePercentageBase] = useState<string>("0.1"); // Default 0.1%
  const [feePercentageQuote, setFeePercentageQuote] = useState<string>("0.1"); // Default 0.1%

  // Estados para los resultados de la simulación
  const [simulationResult, setSimulationResult] =
    useState<SimulationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPools = async () => {
      setIsLoadingPools(true);
      try {
        // Usamos el método find de sscjs. El callback es opcional si usas await.
        // La API de ssc.find puede devolver directamente la promesa si no se pasa callback.
        // Vamos a asumir que SscLibraryUtils.ssc.find puede ser usado con async/await
        // o adaptarlo para que lo sea. Por ahora, lo usaré como en tu pools.tsx.
        const result: Pool[] = await SscLibraryUtils.ssc.find(
          "marketpools",
          "pools",
          {},
          1000, // Límite, ajusta si hay más de 1000 pools
          0,
          []
        );
        setAllPools(result || []);
      } catch (error) {
        console.error("Failed to fetch pools:", error);
        setAllPools([]);
        setIsLoadingPools(false);
      }
    };

    fetchPools();
  }, []);

  const handlePoolSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const poolId = event.target.value;
    const pool = allPools.find((p) => p._id.toString() === poolId) || null; // Asumiendo que Pool tiene _id
    setSelectedPool(pool);
    // Resetear cantidades al cambiar de pool
    setAmountTokenA("");
    setAmountTokenB("");
    setSimulationResult(null); // Limpiar resultados anteriores
    setCalculationError(null); // Limpiar errores anteriores
    console.log("Selected Pool:", pool); // Para depuración
  };

  const handleAmountTokenAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountTokenA(value);

    if (
      selectedPool &&
      selectedPool.baseQuantity > 0 &&
      selectedPool.quoteQuantity > 0
    ) {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue) && value.trim() !== "") {
        // Token A es el base, Token B es el quote
        const calculatedAmountB =
          (numericValue * selectedPool.quoteQuantity) /
          selectedPool.baseQuantity;
        setAmountTokenB(calculatedAmountB.toFixed(8)); // Usar 8 decimales por defecto
      } else {
        setAmountTokenB(""); // Limpiar el otro campo si el input es inválido o vacío
      }
    } else if (value.trim() === "") {
      setAmountTokenB("");
    }
  };

  const handleAmountTokenBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountTokenB(value);

    if (
      selectedPool &&
      selectedPool.baseQuantity > 0 &&
      selectedPool.quoteQuantity > 0
    ) {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue) && value.trim() !== "") {
        // Token B es el quote, Token A es el base
        const calculatedAmountA =
          (numericValue * selectedPool.baseQuantity) /
          selectedPool.quoteQuantity;
        setAmountTokenA(calculatedAmountA.toFixed(8)); // Usar 8 decimales por defecto
      } else {
        setAmountTokenA(""); // Limpiar el otro campo si el input es inválido o vacío
      }
    } else if (value.trim() === "") {
      setAmountTokenA("");
    }
  };

  const handleCalculateSimulation = async () => {
    setIsCalculating(true);
    setSimulationResult(null);
    setCalculationError(null);

    if (!selectedPool) {
      setCalculationError("Por favor, selecciona un pool.");
      setIsCalculating(false);
      return;
    }

    const amountANum = parseFloat(amountTokenA);
    const amountBNum = parseFloat(amountTokenB);
    const daysNum = parseInt(simulationDays, 10);
    const feeBaseNum = parseFloat(feePercentageBase);
    const feeQuoteNum = parseFloat(feePercentageQuote);

    if (
      isNaN(amountANum) ||
      isNaN(amountBNum) ||
      amountANum <= 0 ||
      amountBNum <= 0 ||
      isNaN(daysNum) ||
      daysNum <= 0 ||
      isNaN(feeBaseNum) ||
      feeBaseNum < 0 ||
      isNaN(feeQuoteNum) ||
      feeQuoteNum < 0
    ) {
      setCalculationError(
        "Por favor, ingresa valores válidos para la posición, días y porcentajes de fee."
      );
      setIsCalculating(false);
      return;
    }

    try {
      // 1. Calcular Fees Totales Estimadas (usando tu API)
      // Asumimos que tu API espera los porcentajes tal cual los ingresa el usuario (ej. 0.1 para 0.1%)
      // Si tu API espera decimales (ej. 0.001 para 0.1%), ajusta feeBaseNum/100 y feeQuoteNum/100.
      const feeApiUrl = `https://testhivelpindex.duckdns.org/public/pool-fees?tokenPair=${selectedPool.tokenPair}&feePercentageBaseToken=${feeBaseNum}&feePercentageQuoteToken=${feeQuoteNum}`;
      const feeData = await BaseApi.get(feeApiUrl);
      console.log("Fee data:", feeData); //TODO REM
      if (!feeData || typeof feeData.totalFeesPoolUSD !== "number") {
        setCalculationError(
          "No se pudieron obtener los datos de fees de la API o el formato es incorrecto."
        );
        setIsCalculating(false);
        return;
      }
      const totalFeesUSD = feeData.totalFeesPoolUSD * daysNum;

      // 2. Calcular Impermanent Loss
      // Por ahora, asumimos que los precios no cambian (finalPriceRatio = initialPriceRatio)
      // selectedPool.quotePrice es el precio del token base (A) en términos del token quote (B)
      const initialPriceRatio = selectedPool.quotePrice; // Ej: 1 HIVE = 0.4 BEE, quotePrice = 0.4
      const finalPriceRatio = initialPriceRatio; // Asunción: sin cambio de precio
      const ilPercentage = calculateImpermanentLoss(
        initialPriceRatio,
        finalPriceRatio
      );

      setSimulationResult({
        totalFeesUSD: totalFeesUSD,
        impermanentLossPercentage: ilPercentage * 100, // Convertir a porcentaje
      });
    } catch (error: any) {
      console.error("Error calculating simulation:", error);
      setCalculationError(
        `Error en el cálculo: ${error.message || "Error desconocido"}`
      );
    } finally {
      setIsCalculating(false);
    }
  };

  // Helper para obtener los símbolos de los tokens
  const [baseTokenSymbol, quoteTokenSymbol] = selectedPool?.tokenPair.split(
    ":"
  ) || ["TokenA", "TokenB"];

  return (
    <div>
      <h2>Simulador de Posiciones en Pools de Liquidez</h2>

      <section id="pool-selection">
        <h3>1. Selecciona un Pool</h3>
        {isLoadingPools && !allPools.length ? (
          <Loader />
        ) : (
          <select onChange={handlePoolSelection} defaultValue="">
            <option value="" disabled>
              -- Elige un pool --
            </option>
            {allPools.map((pool) => (
              <option key={pool._id} value={pool._id}>
                {" "}
                {/* Asumiendo que Pool tiene _id y tokenPair */}
                {pool.tokenPair}
              </option>
            ))}
          </select>
        )}
      </section>

      {selectedPool && (
        <section id="selected-pool-info">
          <h4>Información del Pool Seleccionado:</h4>
          <p>
            <strong>Par:</strong> {selectedPool.tokenPair}
          </p>
          <p>
            <strong>Tokens Base ({baseTokenSymbol}):</strong>{" "}
            {Number(selectedPool.baseQuantity).toLocaleString()}
          </p>
          <p>
            <strong>Tokens Quote ({quoteTokenSymbol}):</strong>{" "}
            {Number(selectedPool.quoteQuantity).toLocaleString()}
          </p>
          <p>
            <strong>Total Shares:</strong>{" "}
            {Number(selectedPool.totalShares).toLocaleString()}
          </p>
          <p>
            <strong>Precio Base:</strong> {selectedPool.basePrice}
          </p>
          <p>
            <strong>Precio Quote:</strong> {selectedPool.quotePrice}
          </p>
          <p>
            <strong>Precisión:</strong> {selectedPool.precision}
          </p>
          <p>
            <strong>Creador:</strong> {selectedPool.creator}
          </p>
        </section>
      )}

      {selectedPool && (
        <>
          <section id="position-definition">
            <h3>2. Define tu Posición (Nueva)</h3>
            <div>
              <label htmlFor="amountTokenA">Cantidad {baseTokenSymbol}:</label>
              <input
                type="number"
                id="amountTokenA"
                value={amountTokenA}
                onChange={handleAmountTokenAChange}
                placeholder="0.0"
              />
            </div>
            <div>
              <label htmlFor="amountTokenB">Cantidad {quoteTokenSymbol}:</label>
              <input
                type="number"
                id="amountTokenB"
                value={amountTokenB}
                onChange={handleAmountTokenBChange}
                placeholder="0.0"
              />
            </div>
          </section>

          <section id="projection-parameters">
            <h3>3. Parámetros de Proyección</h3>
            <div>
              <label htmlFor="simulationDays">Horizonte Temporal (días):</label>
              <input
                type="number"
                id="simulationDays"
                value={simulationDays}
                onChange={(e) => setSimulationDays(e.target.value)}
                placeholder="30"
              />
            </div>
            <div>
              <label htmlFor="feePercentageBase">
                Porcentaje Fee Token Base (%):
              </label>
              <input
                type="number"
                id="feePercentageBase"
                value={feePercentageBase}
                onChange={(e) => setFeePercentageBase(e.target.value)}
                placeholder="0.1"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="feePercentageQuote">
                Porcentaje Fee Token Quote (%):
              </label>
              <input
                type="number"
                id="feePercentageQuote"
                value={feePercentageQuote}
                onChange={(e) => setFeePercentageQuote(e.target.value)}
                placeholder="0.1"
                step="0.01"
              />
            </div>
          </section>

          <button onClick={handleCalculateSimulation} disabled={isCalculating}>
            {isCalculating ? "Calculando..." : "Calcular Proyección"}
          </button>
          {calculationError && (
            <div style={{ color: "red", marginTop: "10px" }}>
              <p>Error: {calculationError}</p>
            </div>
          )}

          {simulationResult && !calculationError && (
            <section id="simulation-results" style={{ marginTop: "20px" }}>
              <h3>4. Resultados Estimados de la Simulación</h3>
              <p>
                <strong>Fees Totales Estimadas Ganadas:</strong> $
                {simulationResult.totalFeesUSD?.toFixed(2)}
              </p>
              <p>
                <strong>Pérdida Impermanente (IL) Estimada:</strong>{" "}
                {simulationResult.impermanentLossPercentage?.toFixed(2)}%
              </p>
              <small>
                (Nota: El IL se calcula asumiendo que el precio relativo entre
                los tokens no cambia. Funcionalidad para simular cambios de
                precio se añadirá próximamente.)
              </small>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Simulator;
