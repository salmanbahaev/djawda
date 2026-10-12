"use client";

import dynamic from "next/dynamic";
import type { FlowFieldProps } from "@/components/ui/flow-field";

const FlowField = dynamic(() => import("@/components/ui/flow-field").then((mod) => mod.FlowField), {
  ssr: false,
});

export function FlowFieldLazy(props: FlowFieldProps) {
  return <FlowField {...props} />;
}
