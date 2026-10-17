import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import NotesByTagClient from "./Notes.client";

interface NoteTagProps {
  params: Promise<{ slug: string[] }>;
}

const PER_PAGE = 12;

const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

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
