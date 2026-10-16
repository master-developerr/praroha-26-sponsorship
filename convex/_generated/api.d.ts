/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as analytics from "../analytics.js";
import type * as assignments from "../assignments.js";
import type * as calls from "../calls.js";
import type * as commitments from "../commitments.js";
import type * as companies from "../companies.js";
import type * as followUps from "../followUps.js";
import type * as gamification from "../gamification.js";
import type * as notifications from "../notifications.js";
import type * as pipeline from "../pipeline.js";
import type * as proposals from "../proposals.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  analytics: typeof analytics;
  assignments: typeof assignments;
  calls: typeof calls;
  commitments: typeof commitments;
  companies: typeof companies;
  followUps: typeof followUps;
  gamification: typeof gamification;
  notifications: typeof notifications;
  pipeline: typeof pipeline;
  proposals: typeof proposals;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
