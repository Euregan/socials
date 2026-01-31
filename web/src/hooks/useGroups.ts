import { useCallback, useEffect } from "react";
import { createStore, useStore } from "zustand";
import api, { useDeleteGroupMutation } from "../api";

const { query } = api(`${import.meta.env.VITE_API_URL}/graphql`);

type Group = {
  id: number;
  name: string;
  icon: string;
  excludeFromGlobalView: boolean;
};

type GroupState = {
  loading: boolean;
  groups: Array<Group>;
  setGroups: (groups: Array<Group>) => void;
};

const groupStore = createStore<GroupState>()((set) => ({
  loading: true,
  groups: [],
  setGroups: (groups) => set({ groups, loading: false }),
}));

let status: "blank" | "initializing" | "initialized" = "blank";

export const useGroups = () => {
  const { groups, loading, setGroups } = useStore(groupStore);

  const [deleteGroup] = useDeleteGroupMutation(["id"]);

  useEffect(() => {
    if (status === "blank") {
      status = "initializing";
      query
        .groups(["id", "name", "icon", "excludeFromGlobalView"])
        .then((groups) => {
          status = "initialized";
          setGroups(groups);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = useCallback(
    async (groupId: number) => {
      await deleteGroup({ groupId });
      // TODO: Handle concurrency
      setGroups(groups.filter((group) => group.id !== groupId));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groups],
  );

  return {
    groups,
    remove,
    loading,
  };
};
