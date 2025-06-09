import { useState } from "react";

type TagDropdownProps = {
  tags: string[];
};

export default function TagDropdown({ tags }: TagDropdownProps) {
  const [open, setOpen] = useState(false);

  if (!tags || tags.length === 0) return null;

  const [first, ...rest] = tags;

  return (
    <div className="relative inline-block text-left">
      <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
        {first}
      </span>

      {rest.length > 0 && (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex items-center bg-gray-200 text-gray-800 text-sm font-medium px-2 py-0.5 rounded hover:bg-gray-300"
          >
            +{rest.length}
          </button>

          {open && (
            <div className="absolute z-10 mt-2 w-40 bg-white border border-gray-300 rounded shadow-md">
              <ul className="p-2">
                {rest.map((tag, idx) => (
                  <li
                    key={idx}
                    className="mb-1 bg-blue-100 text-blue-800 text-sm font-medium px-2 py-0.5 rounded"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
