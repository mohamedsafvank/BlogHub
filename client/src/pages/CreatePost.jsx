import { useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const fileInputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !imageFile) {
      return toast.error("All fields are required.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", imageFile);

    try {
      const res = await fetch("http://localhost:5000/api/blogs", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        toast.success("Post created successfully!");
        setTitle("");
        setContent("");
        setImageFile(null);
        fileInputRef.current.value = "";
      } else {
        toast.error(data.message || "Failed to create post.");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>

      <form className="space-y-4" onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          className="w-full p-2 border rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full border p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Publish
        </button>
      </form>

      {/* Toast container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default CreatePost;
