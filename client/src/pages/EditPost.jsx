import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const EditPost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const [title, setTitle] = useState(params.get("title") || "");
  const [content, setContent] = useState(params.get("content") || "");
  const [imageFile, setImageFile] = useState(null);

  const postId = location.pathname.split("/edit/")[1];
  const fileInputRef = useRef();

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      return toast.error("Title and content are required.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${postId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        if (res.ok) {
          toast.success("Post updated successfully!");
          setTimeout(() => navigate("/profile"), 1000); // waits 1 sec
        }

      } else {
        toast.error(data.message || "Failed to update post.");
      }
    } catch (err) {
      console.error("Error updating post:", err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>

      <form className="space-y-4" onSubmit={handleUpdate} encType="multipart/form-data">
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
          onChange={(e) => {
            const file = e.target.files[0];
            setImageFile(file);
            if (file) {
              setImagePreview(URL.createObjectURL(file));
            }
          }}
          className="w-full border p-2"
        />

        <button
          type="submit"
          className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
        >
          Update
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default EditPost;
