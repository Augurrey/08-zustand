"use client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error",
  description: "An error occurred while fetching note details.",
};

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return <p>Could not fetch note details. {error.message}</p>;
}
