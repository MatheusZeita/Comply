import { useMMKVString } from "react-native-mmkv";
import { storage } from "@/lib/storage";

const SEARCH_HISTORY_KEY = "search_history";
const MAX_HISTORY_ITEMS = 15;

export const useSearchHistory = () => {
  const [historyJson, setHistoryJson] = useMMKVString(
    SEARCH_HISTORY_KEY,
    storage
  );

  const history: string[] = historyJson ? JSON.parse(historyJson) : [];

  const addSearchTerm = (term: string) => {
    if (!term.trim()) return;

    const updated = [
      term.trim(),
      ...history.filter((t) => t.toLowerCase() !== term.toLowerCase()),
    ].slice(0, MAX_HISTORY_ITEMS);

    setHistoryJson(JSON.stringify(updated));
  };

  const removeSearchTerm = (term: string) => {
    const updated = history.filter((t) => t !== term);
    setHistoryJson(JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistoryJson(undefined);
  };

  return {
    history,
    addSearchTerm,
    removeSearchTerm,
    clearHistory,
  };
};
