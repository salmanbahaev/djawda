import type { Metadata } from "next";
import KeystaticApp from "./keystatic";

export const metadata: Metadata = {
  title: "Джавда",
};

export default function KeystaticLayout() {
  return <KeystaticApp />;
}
