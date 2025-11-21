import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../../lib/api";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { FaRegEdit } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
const AddNewBlog = () => {
  const modules = {
    toolbar: [
      [{ header: [2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };
  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "list",  
    "header",
    "link",
    "image",
  ];
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };
  const handleTagKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setTagInput("");
    }
  };
  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res=await postData("/blogs", formData);
      const {_id}=res;
      if(res&&res?._id) {
        toast.success("Blog created successfully!")
        navigate(`/admin/dashboard/blog`);
      }
      else {
        navigate("/blog")
      }
    } catch (err) {
      console.error(err);
      toast.success("Failed to create blog!")
      setError("Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 mt-5 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-lg mb-5">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex gap-2 items-center"><FaRegEdit /> Add New Blog</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Blog Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter blog title"
            required
          />

        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Blog Content
          </label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={handleContentChange}
            className="bg-white rounded-lg"
            modules={modules}
            formats={formats}
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Cover image URL
          </label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Paste image URL"
            required
          />
          {formData.image && (
            <div className="mt-3">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-48 h-32 object-cover rounded-lg shadow-md border"
              />
            </div>
          )}
        </div>
        <div>
          <label className="block font-medium text-gray-700 mb-1">Tags</label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Type a tag and press Enter"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.tags.map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-indigo-600 hover:text-red-500 font-bold"
                >
                  <RxCross1 />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {loading ? "Saving..." : "Create Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewBlog;
