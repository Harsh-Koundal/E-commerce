import { deleteData, getData } from "@/lib/api";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Search, Plus, Trash2, Edit3, AlertTriangle } from "lucide-react";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const getAllBlogs = async () => {
    try {
      const res = await getData("/blogs");
      setBlogs(res);
    } catch (error) {
      console.log("Error fetching blogs:", error.message);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );
    if (!confirmDelete) return;

    try {
      await deleteData(`/blogs/${id}`);
      toast.success("Blog deleted successfully");
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.log("Error deleting blog:", error.message);
      toast.error("Some error occurred while deleting blog");
    }
  };

  // Filter blogs by title
  const filteredBlogs = blogs.filter((blog) =>
    blog?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Blog Management</h2>
        <Link
          to="/admin/dashboard/new-blog"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          Add New Blog
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading blogs...</div>
        ) : filteredBlogs.length > 0 ? (
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Published On</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr
                  key={blog?._id}
                  className="border-t hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 font-medium">{blog?.title}</td>
                  <td className="px-6 py-4">{blog?.category || "General"}</td>
                  <td className="px-6 py-4">
                    {new Date(blog?.publishedAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <Link
                      to={`/admin/dashboard/edit-blog/${blog?._id}`}
                      className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-all duration-200"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog?._id, blog?.title)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <AlertTriangle className="h-12 w-12 mb-3 text-gray-400" />
            <p className="text-lg font-medium">No blogs found</p>
            <p className="text-sm text-gray-400 mb-4">
              Try adding a new blog or searching with a different keyword.
            </p>
            <Link
              to="/admin/dashboard/new-blog"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-all"
            >
              Add New Blog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;
