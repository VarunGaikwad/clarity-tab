import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import Dialog from "./Dialog";
import { useUserData } from "../hooks/useUserData";
import CachedFavicon from "./CachedFavicon";

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function ImportantLinks() {
  const { userData, setUserData } = useUserData();

  const [links, setLinks] = useState(userData?.links || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState({ title: "", url: "" });
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Cache favicons and keyboard shortcuts
  useEffect(() => {
    const cacheFavicons = async () => {
      try {
        const cache = await caches.open("favicons");
        const urls = links.map(
          ({ url }) => `/favicone/${new URL(url).hostname}?s=256`
        );
        await cache.addAll(urls);
      } catch (e) {
        // Silently ignore caching errors
      }
    };

    cacheFavicons();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => {
          const input = document.getElementById(
            "custom-search-input"
          ) as HTMLInputElement;
          input?.focus();
        }, 10);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchTerm("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [links]);

  // Reset dialog inputs when dialog opens/closes
  useEffect(() => {
    setInputValue({ title: "", url: "" });
  }, [isDialogOpen]);

  // Sync links to userData
  useEffect(() => {
    if (setUserData) {
      setUserData((prev) => ({ ...prev, links }));
    }
  }, [links, setUserData]);

  // Delete link handler
  const handleDelete = (indexToDelete: number) => {
    if (confirm("Are you sure you want to delete this link?")) {
      setLinks((prevLinks) =>
        prevLinks.filter((_, index) => index !== indexToDelete)
      );
    }
  };

  // Add link handler
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const { title, url } = inputValue;

    if (title.trim().length <= 3) {
      alert("Title must be more than 3 characters.");
      return;
    }

    if (!isValidUrl(url)) {
      alert("Invalid URL.");
      return;
    }

    setLinks((prev) => [...prev, { title: title.trim(), url: url.trim() }]);
    setIsDialogOpen(false);
  };

  // Input change handler generator
  const handleInputChange =
    (field: keyof typeof inputValue) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue((prev) => ({ ...prev, [field]: e.target.value }));
    };

  // Filter and focus search results on Enter key
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const matchIndex = links.findIndex((link) =>
        link.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (matchIndex !== -1) {
        const element = document.getElementById(`link-${matchIndex}`);
        element?.focus();
      }
    }
  };

  return (
    <div className="absolute top-0 left-0 p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 w-4/6">
      <Dialog
        title="Add Link"
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
        <form onSubmit={handleAdd} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Title"
            value={inputValue.title}
            onChange={handleInputChange("title")}
            className="w-full bg-white bg-opacity-5 p-2 rounded-md outline-none"
          />
          <input
            type="text"
            placeholder="URL"
            value={inputValue.url}
            onChange={handleInputChange("url")}
            className="w-full bg-white bg-opacity-5 p-2 rounded-md outline-none"
          />
          <input type="submit" className="hidden" />
        </form>
      </Dialog>

      {searchOpen && (
        <input
          id="custom-search-input"
          type="text"
          placeholder="Search links..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="fixed bottom-10 left-1/2 z-50 w-1/3 -translate-x-1/2 rounded-md bg-black bg-opacity-30 px-3 py-2 text-white shadow outline-none"
        />
      )}

      {links
        .sort((a, b) => a.url.length - b.url.length)
        .map((link, idx) => (
          <div
            key={idx}
            id={`link-${idx}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") window.open(links[idx].url, "_self");
            }}
            className="group relative flex items-center gap-2 rounded-lg bg-black bg-opacity-20 px-2 py-1 text-xs text-white transition duration-500 ease-in-out hover:bg-opacity-50 hover:scale-105 focus:bg-opacity-50 focus:scale-105"
          >
            <a href={link.url} className="flex items-center gap-2">
              <CachedFavicon url={link.url} title={link.title} />
              {link.title}
            </a>
            <FaTrash
              size={12}
              className="absolute top-1 right-1 cursor-pointer text-red-500 opacity-0 transition group-hover:opacity-100 hover:text-red-700"
              onClick={() => handleDelete(idx)}
            />
          </div>
        ))}

      {links.length < 30 && (
        <div
          onClick={() => setIsDialogOpen(true)}
          className="group relative flex cursor-pointer items-center gap-2 rounded-lg bg-black bg-opacity-10 p-2 text-xs text-white transition duration-500 ease-in-out hover:bg-opacity-50 hover:scale-105 focus:bg-opacity-50 focus:scale-105"
        >
          <IoMdAdd size={28} />
          Add More
        </div>
      )}
    </div>
  );
}
