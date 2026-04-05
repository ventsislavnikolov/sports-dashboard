import { Store } from "@tanstack/store";

interface ActiveFixtureState {
  comparedPlayerIds: [number | null, number | null];
  fixtureId: number | null;
  selectedPlayerId: number | null;
}

export const activeFixtureStore = new Store<ActiveFixtureState>({
  fixtureId: null,
  selectedPlayerId: null,
  comparedPlayerIds: [null, null],
});

export function setFixtureId(id: number | null) {
  activeFixtureStore.setState((prev) => ({
    ...prev,
    fixtureId: id,
    selectedPlayerId: null,
    comparedPlayerIds: [null, null],
  }));
}

export function setSelectedPlayerId(id: number | null) {
  activeFixtureStore.setState((prev) => ({
    ...prev,
    selectedPlayerId: id,
  }));
}

export function toggleComparedPlayer(id: number) {
  activeFixtureStore.setState((prev) => {
    const [slot0, slot1] = prev.comparedPlayerIds;

    if (slot0 === id) return { ...prev, comparedPlayerIds: [null, slot1] };
    if (slot1 === id) return { ...prev, comparedPlayerIds: [slot0, null] };
    if (slot0 === null) return { ...prev, comparedPlayerIds: [id, slot1] };
    if (slot1 === null) return { ...prev, comparedPlayerIds: [slot0, id] };

    return { ...prev, comparedPlayerIds: [id, slot1] };
  });
}
