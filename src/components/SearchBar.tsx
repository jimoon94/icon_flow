"use client";

import { useRef, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  history?: string[];
  onAddHistory?: (query: string) => void;
  onRemoveHistory?: (query: string) => void;
}

export default function SearchBar({ value, onChange, history = [], onAddHistory, onRemoveHistory }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredHistory = value.trim()
    ? history.filter((q) => q.toLowerCase().includes(value.toLowerCase()) && q !== value)
    : history;

  const showDropdown = focused && filteredHistory.length > 0;

  const handleSelect = (query: string) => {
    onChange(query);
    onAddHistory?.(query);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      onAddHistory?.(value);
      inputRef.current?.blur();
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (dropdownRef.current?.contains(e.relatedTarget as Node)) return;
    setFocused(false);
    if (value.trim()) onAddHistory?.(value);
  };

  return (
    <div className="relative w-full max-w-xl">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="아이콘 검색 — 한국어·영어 모두 지원 (예: 화살표, arrow, 날씨, chart...)"
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer z-10"
        >
          ✕
        </button>
      )}

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">최근 검색</span>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onRemoveHistory && filteredHistory.forEach(onRemoveHistory); }}
              className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            >
              전체 삭제
            </button>
          </div>
          {filteredHistory.map((query) => (
            <div
              key={query}
              className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 group"
            >
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(query)}
                className="flex items-center gap-2 flex-1 text-left cursor-pointer"
              >
                <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-700 dark:text-gray-300">{query}</span>
              </button>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onRemoveHistory?.(query)}
                className="text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ml-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
