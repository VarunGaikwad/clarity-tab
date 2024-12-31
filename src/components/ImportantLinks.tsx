import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import Dialog from "./Dialog";
import { useUserData } from "../hooks/useUserData";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState({ title: "", url: "" });
  const [links, setLinks] = useState(userData?.links || []);

  useEffect(() => {
    setInputValue({ title: "", url: "" });
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

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();

    const { title, url } = inputValue;

    if (title.length <= 3) {
      alert("Title must be more than 3 characters.");
      return;
    }

    if (!isValidUrl(url)) {
      alert("Invalid URL.");
      return;
    }

    setLinks((prevLinks) => [...prevLinks, inputValue]);
    setIsDialogOpen(false);
  };

  const handleInputChange =
    (field: keyof typeof inputValue) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue((prev) => ({ ...prev, [field]: event.target.value }));
    };

  return (
    <div className="absolute top-0 left-0 p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      <Dialog
        title="Add Link"
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
        <form onSubmit={handleAdd} className="flex gap-2 flex-col">
          <input
            type="text"
            value={inputValue.title}
            placeholder="Title"
            onChange={handleInputChange("title")}
            className="w-full bg-white bg-opacity-5 p-2 outline-none rounded-md"
          />
          <input
            type="text"
            value={inputValue.url}
            placeholder="URL"
            onChange={handleInputChange("url")}
            className="w-full bg-white bg-opacity-5 p-2 outline-none rounded-md"
          />
          <input type="submit" className="hidden" />
        </form>
      </Dialog>
      {links.map((link, idx) => (
        <div
          key={idx}
          className="relative text-xs flex items-center gap-2 bg-black p-2 rounded-lg transform duration-500 ease-in-out bg-opacity-10 hover:bg-opacity-50 hover:scale-105 group"
        >
          <a href={link.url} className="flex items-center gap-2">
            <img
              width={32}
              src={`https://www.google.com/s2/favicons?sz=32&domain=${link.url}`}
              alt={`${link.title} icon`}
            />
            {link.title}
          </a>
          <FaTrash
            size={12}
            className="absolute top-1 right-1 text-red-500 opacity-0 cursor-pointer hover:text-red-700 group-hover:opacity-100"
            onClick={() => handleDelete(idx)}
          />
        </div>
      ))}
      {links.length < 15 && (
        <div
          onClick={() => setIsDialogOpen(true)}
          className="cursor-pointer relative text-xs flex items-center gap-2 bg-black p-2 rounded-lg transform duration-500 ease-in-out bg-opacity-10 hover:bg-opacity-50 hover:scale-105 group"
        >
          <IoMdAdd size={28} />
          Add More
        </div>
      )}
    </div>
  );
}
