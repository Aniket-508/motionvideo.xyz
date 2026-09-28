import { defineConfig } from "oxlint";
import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";
import tanstack from "ultracite/oxlint/tanstack";

export default defineConfig({
  extends: [core, react, tanstack, antiSlop],
  // Better Auth CLI output (`pnpm auth:schema`); regenerated, not hand-edited.
  ignorePatterns: [...(core.ignorePatterns ?? []), "src/server/db/schema.ts"],
});
