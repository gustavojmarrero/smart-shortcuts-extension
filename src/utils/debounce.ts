/**
 * Debounce utility para reducir llamadas frecuentes a funciones costosas
 * Útil para optimizar operaciones de guardado en Firestore
 */

/**
 * Crea una función debounced que retrasa la invocación de func hasta que
 * hayan pasado `delay` milisegundos desde la última vez que se llamó
 *
 * @param func - Función a debounce
 * @param delay - Tiempo de espera en milisegundos
 * @returns Función debounced
 *
 * @example
 * const saveDebounced = debounce((data) => {
 *   saveToFirestore(data);
 * }, 500);
 *
 * // Solo se ejecutará una vez después de 500ms de la última llamada
 * saveDebounced(data1);
 * saveDebounced(data2);
 * saveDebounced(data3);
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    // Cancelar timeout anterior si existe
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Crear nuevo timeout
    timeoutId = setTimeout(() => {
      func.apply(context, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Crea una función throttled que solo invoca func como máximo una vez
 * por cada `limit` milisegundos
 *
 * Diferencia con debounce:
 * - Debounce: Espera a que se detengan las llamadas
 * - Throttle: Ejecuta al menos una vez cada X tiempo, sin importar cuántas veces se llame
 *
 * @param func - Función a throttle
 * @param limit - Tiempo mínimo entre ejecuciones en milisegundos
 * @returns Función throttled
 *
 * @example
 * const handleScroll = throttle(() => {
 *   console.log('Scroll position:', window.scrollY);
 * }, 100);
 *
 * // Se ejecutará como máximo una vez cada 100ms, sin importar cuántas veces se llame
 * window.addEventListener('scroll', handleScroll);
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}
