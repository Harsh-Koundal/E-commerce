import { getData } from "@/lib/api";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { FadeLoader } from "react-spinners";
const SingleBlog = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState();
    const [suggestions, setSuggestions] = useState([]);
    useEffect(() => {
        try {
            const fetchSuggestions = async () => {
                try {
                    const res = await getData("/blogs");
                    const filtered = res.filter((b) => String(b._id) !== String(id));
                    setSuggestions(filtered.slice(0, 3));
                } catch (error) {
                    console.error("Error fetching suggestions:", error.message);
                    toast.error("Failed to fetch suggestions");
                }
            };
            const getBlog = async () => {
                const res = await getData(`/blogs/${id}`);
                setBlog(res);
            };
            getBlog();
            fetchSuggestions()
        }
        catch (error) {
            console.log("some error occured while fetching the blog", error.message)
            toast.error("error.message")
        }

    }, [id]);
    if (!blog) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 ">
                <div className="text-center">
                    <FadeLoader color="blue" />
                    Loading....
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen px-4 py-10 overflow-x-hidden">
            <div className="flex gap-1 items-center text-sm text-gray-700 relative top-5 lg:left-10 mb-10">
                <Link
                    to="/"
                    className="text-blue-600 hover:underline font-medium"
                >
                    Home
                </Link>
                &gt;
                <Link
                    to="/blog"
                    className="text-blue-600 hover:underline font-medium"
                >
                    Blog
                </Link>
                &gt;
                <span className="text-gray-700 font-semibold sm:flex md:hidden lg:hidden ">{blog.title.slice(0, 20) + "...."}</span>
                <span className="text-gray-700 font-semibold hidden sm:hidden md:flex lg:hidden ">{blog.title.slice(0, 40) + "...."}</span>
                <span className="text-gray-700 font-semibold hidden sm:hidden md:hidden lg:flex ">{blog.title.slice(0, 60) + "...."}</span>
            </div>
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-lg overflow-hidden border border-gray-300 shadow">
                        <img
                            src={blog?.imageUrl}
                            alt={blog?.title}
                            className="w-full h-96 object-cover"
                        />
                        <div className="p-6">
                            <p className="text-gray-600 text-sm mb-2 font-semibold">
                                Printzet Team • {new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                            <p className="text-gray-500 text-sm mb-4">

                            </p>
                            <h1 className="text-3xl font-bold mb-4 text-gray-900">
                                {blog.title}
                            </h1>
                            <div className="text-gray-700 text-lg leading-relaxed">
                                <div
                                    className="prose prose-custom max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(blog.content)
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/3 space-y-6">
                    <h2 className="text-2xl font-bold border-b pb-2">
                        Other blogs you may like
                    </h2>

                    {suggestions.map((s) => (
                        <div
                            key={s?._id}
                            className="bg-white border rounded shadow-sm overflow-hidden"
                        >
                            <img
                                src={s.imageUrl}
                                alt={s.title}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <Link
                                    to={`/blog/${s?._id}`}>
                                    <h3 className="text-md font-semibold text-gray-800 mb-2">
                                        {s.title}
                                    </h3>
                                </Link>
                                <Link
                                    to={`/blog/${s?._id}`}
                                    className="inline-block mt-1 text-indigo-600 hover:underline font-semibold"
                                >
                                    Read More
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SingleBlog;
