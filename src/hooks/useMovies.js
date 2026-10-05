import { useCallback, useEffect, useReducer } from "react";
import { getMovies } from "../api/tmdb";

const initial = { items: [], page: 0, totalPages: 1, status: "loading", error: null };

function reducer(state, action) {
  switch (action.type) {
    case "reset":
      return { ...initial };
    case "loading_more":
      return { ...state, status: "loading_more", error: null };
    case "success":
      return {
        items: action.page === 1 ? action.results : [...state.items, ...action.results],
        page: action.page,
        totalPages: action.totalPages,
        status: "success",
        error: null,
      };
    case "error":
      return { ...state, status: "error", error: action.error };
    default:
      return state;
  }
}

/** Handles searching, genre filtering and "load more" pagination in one reducer. */
export default function useMovies({ query, genre }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [attempt, bump] = useReducer((n) => n + 1, 0);

  // New query/genre (or retry) -> start from page 1
  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: "reset" });
    getMovies({ query, genre, page: 1 }, controller.signal)
      .then((data) =>
        dispatch({ type: "success", page: 1, results: data.results, totalPages: data.total_pages })
      )
      .catch((err) => err.name !== "AbortError" && dispatch({ type: "error", error: err.message }));
    return () => controller.abort();
  }, [query, genre, attempt]);

  const loadMore = useCallback(() => {
    dispatch({ type: "loading_more" });
    getMovies({ query, genre, page: state.page + 1 })
      .then((data) =>
        dispatch({
          type: "success",
          page: state.page + 1,
          results: data.results,
          totalPages: data.total_pages,
        })
      )
      .catch((err) => dispatch({ type: "error", error: err.message }));
  }, [query, genre, state.page]);

  return {
    movies: state.items,
    loading: state.status === "loading",
    loadingMore: state.status === "loading_more",
    error: state.error,
    hasMore: state.page < state.totalPages,
    loadMore,
    retry: bump,
  };
}
