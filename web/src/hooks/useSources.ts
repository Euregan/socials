import { useCallback, useEffect } from "react";
import { createStore, useStore } from "zustand";
import api, { useDeleteSourceMutation, type SourceType } from "../api";

const { query } = api(`${import.meta.env.VITE_API_URL}/graphql`);

type Source = {
  id: number;
  name: string;
  hasThumbnail: boolean;
  type: SourceType;
  remoteId: string;
};

type SourceState = {
  loading: boolean;
  sources: Array<Source>;
  setSources: (sources: Array<Source>) => void;
};

const sourceStore = createStore<SourceState>()((set) => ({
  loading: true,
  sources: [],
  setSources: (sources) => set({ sources, loading: false }),
}));

let status: "blank" | "initializing" | "initialized" = "blank";

export const useSources = () => {
  const { sources, loading, setSources } = useStore(sourceStore);

  const [deleteSource] = useDeleteSourceMutation(["id"]);

  useEffect(() => {
    if (status === "blank") {
      status = "initializing";
      query
        .sources(["id", "name", "hasThumbnail", "type", "remoteId"])
        .then((sources) => {
          status = "initialized";
          setSources(sources);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = useCallback(
    async (sourceId: number) => {
      await deleteSource({ sourceId });
      // TODO: Handle concurrency
      setSources(sources.filter((source) => source.id !== sourceId));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sources],
  );

  return {
    sources,
    remove,
    loading,
  };
};
