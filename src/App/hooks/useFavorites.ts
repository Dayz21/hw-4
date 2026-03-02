import { rootStore } from "@/store/rootStore";
import { useEffect } from "react";
import { reaction, type IReactionDisposer } from "mobx";

export const useFavorites = () => {
    useEffect(() => {
        let dispose: IReactionDisposer | null = null;

        dispose = reaction(
            () => rootStore.userStore.isAuthorized,
            async (isAuthorized) => {
                if (isAuthorized) {
                    await rootStore.favoritesStore.fetchFavorites();
                } else {
                    rootStore.favoritesStore.clear();
                }
            },
            { fireImmediately: true }
        );

        return () => {
            dispose?.();
        };
    }, []);
}