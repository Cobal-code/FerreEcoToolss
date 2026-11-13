/**
 * Sale End Date Utility
 * 
 * Generates consistent, deterministic sale end dates based on product ID.
 * This ensures:
 * - Same end date across all users
 * - Consistent values between page reloads
 * - Realistic durations (24h, 48h, 72h cycles)
 * - Automatic renewal when offers expire
 */

// Base reference date: Monday Jan 20, 2025 at midnight UTC
// This serves as the "anchor" for all sale cycles
const BASE_EPOCH = new Date('2025-01-20T00:00:00Z').getTime();

// Sale cycle durations in hours based on product characteristics
const SALE_CYCLES = [24, 36, 48, 72] as const;

/**
 * Get a deterministic sale end date for a product.
 * 
 * The algorithm:
 * 1. Use product ID to determine which cycle duration (24h, 36h, 48h, 72h)
 * 2. Calculate which cycle we're currently in since the base epoch
 * 3. Return the end of the current cycle
 * 
 * This ensures all users see the same countdown for the same product,
 * and offers automatically renew at the end of each cycle.
 */
export function getSaleEndDate(productId: number): Date {
  // Determine cycle duration based on product ID (consistent per product)
  const cycleIndex = productId % SALE_CYCLES.length;
  const cycleDurationHours = SALE_CYCLES[cycleIndex];
  const cycleDurationMs = cycleDurationHours * 60 * 60 * 1000;
  
  // Add a product-specific offset to stagger offer end times
  // This prevents all products from ending at the same time
  const productOffset = (productId * 7) % cycleDurationHours; // 0 to cycleDuration hours offset
  const productOffsetMs = productOffset * 60 * 60 * 1000;
  
  const now = Date.now();
  const adjustedEpoch = BASE_EPOCH + productOffsetMs;
  
  // Calculate how many complete cycles have passed since adjusted epoch
  const timeSinceEpoch = now - adjustedEpoch;
  const completeCycles = Math.floor(timeSinceEpoch / cycleDurationMs);
  
  // Calculate the end of the current cycle
  const currentCycleEnd = adjustedEpoch + ((completeCycles + 1) * cycleDurationMs);
  
  return new Date(currentCycleEnd);
}

/**
 * Check if a sale has expired for a product.
 * In our system, sales auto-renew, so this is mainly for UI states.
 */
export function isSaleExpired(productId: number): boolean {
  const endDate = getSaleEndDate(productId);
  return Date.now() > endDate.getTime();
}

/**
 * Get the remaining time for a sale in a structured format.
 */
export function getSaleTimeRemaining(productId: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const endDate = getSaleEndDate(productId);
  const now = Date.now();
  const difference = endDate.getTime() - now;
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
    isExpired: false,
  };
}
