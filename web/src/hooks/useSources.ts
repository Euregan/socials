import { useEffect } from "react";
import { createStore, useStore } from "zustand";
import api, { type SourceType } from "../api";

const { query } = api(`${import.meta.env.VITE_API_URL}/graphql`);

type Source = {
  id: number;
  name: string;
  hasThumbnail: boolean;
  type: SourceType;
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

  useEffect(() => {
    if (status === "blank") {
      status = "initializing";
      query.sources(["id", "name", "hasThumbnail", "type"]).then((sources) => {
        status = "initialized";
        setSources(sources);
      });
    }
  }, []);

  return {
    sources,
    loading,
  };
};
