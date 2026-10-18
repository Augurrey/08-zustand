import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import NotesByTagClient from "./Notes.client";
import { Metadata } from "next";

interface NoteTagProps {
  params: Promise<{ slug: string[] }>;
}

type NetadataProps = {
  params: Promise<{ slug: string[] }>;
};

const PER_PAGE = 12;

const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export async function generateMetadata({
  params,
}: NetadataProps): Promise<Metadata> {
  const { slug } = await params;
  const noteTag = slug[0];
  return {
    title: `Notes - ${noteTag}`,
    description: `Browse notes tegged with ${noteTag}. NoteHub allows you to filter and view notes based on specific tags for better organization.`,
  };
}

export default async function NotesByTag({ params }: NoteTagProps) {
  const { slug } = await params;

  const currentTag = slug[0];

  const tag =
    currentTag.toLowerCase() === "all"
      ? ""
      : (tags.find((item) => item.toLowerCase() === currentTag.toLowerCase()) ??
        "");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, tag],
    queryFn: () => fetchNotes("", 1, PER_PAGE, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesByTagClient key={tag} tag={tag} />
    </HydrationBoundary>
  );
}
