"use client";

import { useEffect } from "react";
import { pruneCart } from "@/app/actions/cart";

/** Once a payment is confirmed, drops the bought courses (and a spent promo) from the cart. */
export function PruneCart() {
  useEffect(() => {
    pruneCart().catch(() => {});
  }, []);
  return null;
}
