import BreadcrumbNavigation from "@/components/Breadcrumb-Navigation/BreadcrumbNavigation";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiFilter } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { deleteData, getData } from "@/lib/api";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { CiEdit } from "react-icons/ci";
import { CiTrash } from "react-icons/ci";
import { FadeLoader } from "react-spinners";
const blogS_PER_PAGE = 3;

const Blog = () => {
    const [blog, setblog] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        try {
            const getAllBlogs = async () => {
                const res = await getData("/blogs");
                setblog(res);
            };
            getAllBlogs();
        }
        catch (error) {
            console.log("some error occured while fetching the blog", error.message)
            toast.error("error.message")
        }

    }, []);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const uniqueTags = [...new Set(blog.map((blog) => blog.tag))];

    const handleTagToggle = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const handleDelete = async (id) => {
        try {
          const res = await deleteData(`/blogs/${id}`)
          toast.success("deleted successfully")
        } catch (error) {
          console.log("some error occured while deleting the blog", error.message)
          toast.error("some error occured while deleting blog")
        }
      }

    const filteredblogs = blog?.filter((blog) => {
        const matchesSearch =
            blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag =
            selectedTags.length === 0 || selectedTags.includes(blog.tag);
        return matchesSearch && matchesTag;
    });

    const totalPages = Math.ceil(filteredblogs.length / blogS_PER_PAGE);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [filteredblogs, currentPage, totalPages]);

    const paginatedblogs = filteredblogs?.slice(
        (currentPage - 1) * blogS_PER_PAGE,
        currentPage * blogS_PER_PAGE
    );

    const getPageNumbers = () => {
        const totalNumbers = 3;
        const half = Math.floor(totalNumbers / 2);
        let start = Math.max(1, currentPage - half);
        let end = start + totalNumbers - 1;
        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - totalNumbers + 1);
        }
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };
    return (
        <div className="py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
                <BreadcrumbNavigation />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Latest Blog Articles
                </h2>
                <p className="text-gray-600 text-base sm:text-lg">
                    Stay updated with our latest insights and tips on printing.
                </p>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center gap-3 sm:gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full md:w-2/3 lg:w-1/2 px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                    <button
                        onClick={() => setIsFilterModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg 
                   border border-gray-300 text-gray-700 hover:bg-gray-100 transition w-full md:w-auto"
                    >
                        <CiFilter className="text-xl" />
                        Filter
                    </button>
                </div>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                        {paginatedblogs?.length === 0 ? (
                            <p className="text-gray-500 text-center">No matching blog articles found.</p>
                        ) : (
                            paginatedblogs?.map((blog) => (
                                <div
                                    key={blog?._id}
                                    className="bg-white flex flex-col md:flex-row rounded-lg overflow-hidden border border-gray-200 
                         shadow hover:shadow-md transition duration-300"
                                >
                                    <div className="w-full md:w-1/3 h-48 md:h-auto">
                                        <img
                                            src={blog?.imageUrl}
                                            alt={blog?.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="text-xs sm:text-sm text-gray-500 mb-2">
                                            Printzet Team •{" "}
                                            {new Date(blog?.publishedAt).toLocaleDateString("en-IN", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </div>
                                        <Link to={`/blog/${blog?._id}`}>
                                            <h3 className="text-lg sm:text-xl font-semibold hover:underline hover:text-blue-700">
                                                {blog?.title}
                                            </h3>
                                        </Link>
                                        <div
                                            className="text-gray-700 mt-2 text-sm sm:text-base"
                                            dangerouslySetInnerHTML={{
                                                __html:
                                                    blog?.content?.replace(/<[^>]+>/g, "").length > 80
                                                        ? blog.content.replace(/<[^>]+>/g, "").slice(0, 80) + "..."
                                                        : blog.content.replace(/<[^>]+>/g, ""),
                                            }}
                                        ></div>
                                        <Link
                                            to={`/blog/${blog?._id}`}
                                            className="inline-block mt-3 text-blue-600 hover:underline font-semibold text-sm sm:text-base"
                                        >
                                            Read More...
                                        </Link>

                                        {user?.isAdmin && (
                                            <div className="mt-auto pt-4 border-t flex flex-wrap gap-4 text-gray-600 text-sm justify-between">
                                                <Link
                                                    to={`/admin/dashboard/edit-blog/${blog?._id}`}
                                                    className="flex items-center gap-1 hover:text-blue-600"
                                                >
                                                    <CiEdit className="text-lg" />
                                                    Edit
                                                </Link>
                                                <button
                                                    className="flex items-center gap-1 hover:text-red-600"
                                                    onClick={() => handleDelete(blog?._id)}
                                                >
                                                    <CiTrash className="text-lg" />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="border-t pt-4 mt-8">
                                <div className="flex flex-wrap justify-center items-center gap-2 text-sm">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded-lg font-medium ${currentPage === 1
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-gray-200"
                                            }`}
                                    >
                                        PREVIOUS
                                    </button>
                                    {getPageNumbers().map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-full font-medium ${currentPage === page
                                                ? "bg-blue-500 text-white"
                                                : "hover:bg-gray-200"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded-lg font-medium ${currentPage === totalPages
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-gray-200"
                                            }`}
                                    >
                                        NEXT
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <aside className="w-full lg:w-72">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow">
                            <h4 className="text-lg font-semibold mb-4">Recent Blogs</h4>
                            <ul className="space-y-3">
                                {blog?.slice(0, 5).map((b) => (
                                    <li key={b?._id}>
                                        <Link
                                            to={`/blog/${b?._id}`}
                                            className="text-blue-600 hover:underline text-sm sm:text-base"
                                        >
                                            {b?.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
            {isFilterModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center sm:items-center px-4">
                    <div
                        className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-md p-6 relative border border-gray-200 
                 animate-slideUp sm:animate-fadeIn"
                    >
                        <h3 className="text-lg sm:text-xl font-semibold mb-5 text-gray-800 border-b pb-3">
                            Filter by Tags
                        </h3>
                        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                            {uniqueTags?.length > 1 ? (
                                uniqueTags?.map((tag) => (
                                    <label
                                        key={tag}
                                        className="flex items-center space-x-2 text-gray-700 text-sm cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedTags?.includes(tag)}
                                            onChange={() => handleTagToggle(tag)}
                                            className="accent-blue-600 w-4 h-4"
                                        />
                                        <span>{tag}</span>
                                    </label>
                                ))
                            ) : (
                                <div className="text-blue-700">Coming Soon.....</div>
                            )}
                        </div>
                        <div className="flex justify-between items-center mt-6 border-t pt-4">
                            <button
                                onClick={() => {
                                    setSelectedTags([]);
                                    setCurrentPage(1);
                                }}
                                className="text-sm text-red-500 hover:underline hover:text-red-600 transition"
                            >
                                Clear All
                            </button>

                            <button
                                onClick={() => setIsFilterModalOpen(false)}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                            >
                                Apply Filters
                            </button>
                        </div>
                        <button
                            onClick={() => setIsFilterModalOpen(false)}
                            className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
                        >
                            <IoMdClose className="text-3xl text-black mt-1" />
                        </button>
                    </div>
                </div>
            )}

        </div>


    );
};

export default Blog;
