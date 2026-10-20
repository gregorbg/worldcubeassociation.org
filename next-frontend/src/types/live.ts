import type { ByPersonLiveResult, LiveRoundAdmin, RoundLiveResult } from "@/types/openapi";
import { PartialExcept } from "@/lib/types/objects";

export type LiveResult = RoundLiveResult | ByPersonLiveResult;
export type LiveRoundState = LiveRoundAdmin["state"];
export type PendingLiveResult = PartialExcept<
  LiveResult,
  "registration_id" | "attempts"
>;
