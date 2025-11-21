import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getData, updateData } from "../../lib/api";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { IoCreate } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import { FadeLoader } from "react-spinners";
const EditBlog = () => {
  const modules = {
    toolbar: [
      [{ 'header': [3,false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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
  ];
  const { id } = useParams();
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

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const blog = await getData(`/blogs/${id}`);
        setFormData({
          title: blog?.title || "",
          content: blog?.content || "",
          imageUrl: blog?.imageUrl || "",
          tags: blog?.tag || [],
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load blog details");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTitleChange = (value) => {
    setFormData((prev) => ({ ...prev, title: value }));
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
      const res=await updateData(`/blogs/${id}`, formData);
      toast.success("blog updated successfully")
      navigate(`/admin/dashboard/blog`);
    } catch (err) {
      console.error(err);
      setError("Failed to update blog");
      navigate('/blog')
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 ">
            <div className="text-center">
                <FadeLoader color="blue" />
                Loading....
            </div>
        </div>
    );
}
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl p-8 mt-10 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-lg mb-5 mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex gap-2 items-center">
        <IoCreate /> Edit Blog
      </h2>

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

        {/* Image */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Cover Image URL
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
          {formData.imageUrl && (
            <div className="mt-3">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-48 h-32 object-cover rounded-lg shadow-md border"
              />
            </div>
          )}
        </div>

        {/* Tags */}
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

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg font-medium bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
