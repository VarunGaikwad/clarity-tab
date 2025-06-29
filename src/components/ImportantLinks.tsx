import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import Dialog from "./Dialog";
import { useUserData } from "../hooks/useUserData";
import { FaTrash, FaEdit } from "react-icons/fa";

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
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [links, setLinks] = useState(userData?.links || []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState({ title: "", url: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  useEffect(() => {
    if (isSearchVisible) {
      const timeout = setTimeout(() => {
        const input = document.getElementById(
          "custom-search-input"
        ) as HTMLInputElement;
        input?.focus();
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isSearchVisible]);

  // Keyboard shortcuts for search and closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        setIsSearchVisible(true);
      }
      if (e.key === "Escape") {
        setIsSearchVisible(false);
        setSearchTerm("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isDialogOpen) {
      setInputValue({ title: "", url: "" });
      setEditIndex(null);
    }
  }, [isDialogOpen]);

  useEffect(() => {
    if (setUserData) {
      setUserData((prev) => ({ ...prev, links }));
    }
  }, [links, setUserData]);

  const handleDelete = (indexToDelete: number) => {
    if (confirm("Are you sure you want to delete this link?")) {
      setLinks((prevLinks) =>
        prevLinks.filter((_, index) => index !== indexToDelete)
      );
    }
  };

  const handleInputChange =
    (field: keyof typeof inputValue) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue((prev) => ({ ...prev, [field]: e.target.value }));
    };

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

  const handleSubmit = (e: React.FormEvent) => {
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

    if (editIndex !== null) {
      // Edit mode
      setLinks((prev) =>
        prev.map((link, idx) =>
          idx === editIndex ? { title: title.trim(), url: url.trim() } : link
        )
      );
    } else {
      // Add mode
      setLinks((prev) => [...prev, { title: title.trim(), url: url.trim() }]);
    }

    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (isDialogOpen) return; // Don’t reset while opening
    setInputValue({ title: "", url: "" });
    setEditIndex(null);
  }, [isDialogOpen]);

  return (
    <div className="absolute top-0 left-0 p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 w-4/6">
      <Dialog
        title={editIndex !== null ? "Edit Link" : "Add Link"}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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

      {isSearchVisible && (
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
              if (e.key === "Enter") window.open(link.url, "_self");
            }}
            className="group relative flex items-center gap-2 rounded-lg bg-black bg-opacity-20 px-2 py-1 text-xs text-white transition duration-500 ease-in-out hover:bg-opacity-50 hover:scale-105 focus:bg-opacity-50 focus:scale-105"
          >
            <a href={link.url} className="flex items-center gap-2">
              <div className="relative flex items-center gap-2">
                <div className="relative size-8">
                  <img
                    src={`https://favvyvision.onrender.com/favicon?domain=${
                      new URL(link.url).origin
                    }`}
                    alt={`${link.title} favicon`}
                    className="size-8 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  <div
                    style={{ display: "none" }}
                    className="absolute inset-0 size-8 items-center justify-center rounded-full bg-gray-700 text-xs font-semibold text-white"
                  >
                    {link.title
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word[0]?.toUpperCase())
                      .join("")}
                  </div>
                </div>
                {link.title}
              </div>
            </a>
            <FaTrash
              size={12}
              className="absolute top-1 right-1 cursor-pointer text-red-500 opacity-0 transition group-hover:opacity-100 hover:text-red-700"
              onClick={() => handleDelete(idx)}
            />
            <FaEdit
              size={12}
              className="absolute top-1 right-5 cursor-pointer text-blue-400 opacity-0 transition group-hover:opacity-100 hover:text-blue-600"
              onClick={() => {
                setEditIndex(idx);
                setInputValue(link);
                setIsDialogOpen(true);
              }}
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
