"use client";

import { useGifs } from "@/hooks/use-gifs";
import {
  useClearHistories,
  useCreateHistory,
  useListHistories,
} from "@/hooks/use-history";
import { useState } from "react";

export default function Home() {
  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState("");
  const [limit, setLimit] = useState(10);

  const { data, refetch, isLoading, isRefetching } = useGifs({
    limit,
    queryString: input || "Code Challange",
  });
  const { data: historiesData } = useListHistories();
  const { mutate: createHistory } = useCreateHistory();
  const { mutate: clearHistories } = useClearHistories();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
    createHistory({ queryString: input });
  };

  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 10);
    setTimeout(() => {
      refetch();
    }, 100);
  };

  const handleClear = () => {
    setInput("");
    setLimit(10);
    setTimeout(() => {
      refetch();
    }, 100);
  };

  const handleSetInput = (queryString: string) => {
    setInput(queryString);
    setTimeout(() => {
      refetch();
    }, 100);
    setShowHistory(false);
  };

  return (
    <main className="flex items-center h-screen w-full flex-col p-2">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="relative">
          <input
            className="border border-gray-300 rounded-md p-2 w-96"
            type="text"
            placeholder="Search a gif"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 100)}
          />
          {showHistory && (
            <ul className="absolute top-12 left-0 bg-white w-96 z-20 flex flex-col gap-2 bg-transparent">
              {(historiesData?.histories.length || 0) > 0 ? (
                historiesData?.histories.map((history) => (
                  <li
                    key={history.id}
                    className="w-96 border border-gray-300 rounded-md p-2 cursor-pointer hover:bg-gray-100 bg-white"
                    onClick={() => handleSetInput(history.queryString)}
                  >
                    {history.queryString}
                  </li>
                ))
              ) : (
                <li className="w-96 border border-gray-300 rounded-md p-2 bg-white">
                  No history
                </li>
              )}
            </ul>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-2 mt-2 w-full"
          >
            Submit
          </button>
          <button
            onClick={handleClear}
            className="bg-blue-500 text-white rounded-md p-2 mt-2 w-full"
          >
            Clear
          </button>
          {historiesData?.histories.length > 0 && (
            <button
              onClick={() => clearHistories()}
              className="bg-blue-500 text-white rounded-md p-2 mt-2 w-full"
            >
              Clear History
            </button>
          )}
        </div>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full max-w-6xl overflow-y-auto">
          {data?.data.map((gif) => (
            <li key={gif.id}>
              <img
                src={gif.images.original.url}
                alt={gif.title}
                className="rounded-md"
              />
            </li>
          ))}
        </ul>
      )}
      {data && (
        <button
          onClick={handleLoadMore}
          className="bg-blue-500 text-white rounded-md p-2 mt-2 w-80"
          disabled={isRefetching}
        >
          {isRefetching ? "Loading..." : "Load More"}
        </button>
      )}
    </main>
  );
}
