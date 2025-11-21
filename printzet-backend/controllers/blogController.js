import Blog from "../models/Blog.js";
import sendResponse from "../utils/sendResponse.js";

export const createBlog = async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;

    const blog = new Blog({ title, content, imageUrl });
    await blog.save();

    return sendResponse(res, 201, "Blog created successfully", "success", blog);
  } catch (error) {
    return sendResponse(res, 500, "Failed to create blog", "error");
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ publishedAt: -1 });
    return sendResponse(res, 200, "Blogs fetched successfully", "success", blogs);
  } catch (error) {
    return sendResponse(res, 500, "Failed to fetch blogs", "error");
  }
};

export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return sendResponse(res, 404, "Blog not found", "error");
    return sendResponse(res, 200, "Blog fetched", "success", blog);
  } catch (error) {
    return sendResponse(res, 500, "Failed to fetch blog", "error");
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!blog) return sendResponse(res, 404, "Blog not found", "error");
    return sendResponse(res, 200, "Blog updated successfully", "success", blog);
  } catch (error) {
    return sendResponse(res, 500, "Failed to update blog", "error");
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return sendResponse(res, 404, "Blog not found", "error");
    return sendResponse(res, 200, "Blog deleted successfully", "success");
  } catch (error) {
    return sendResponse(res, 500, "Failed to delete blog", "error");
  }
};
