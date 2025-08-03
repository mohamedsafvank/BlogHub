import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // ✅ Move fetchProfileAndPosts outside
  const fetchProfileAndPosts = async () => {
    try {
      const token = localStorage.getItem("token");

      const profileRes = await fetch("http://localhost:5000/api/auth/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!profileRes.ok) {
        console.error("Failed to fetch profile");
        return;
      }

      const profileData = await profileRes.json();
      setProfile(profileData);

      const postsRes = await fetch(`http://localhost:5000/api/blogs/${profileData.Id}`);
      if (!postsRes.ok) {
        console.error("Failed to fetch posts");
        return;
      }

      const postsData = await postsRes.json();
      setPosts(postsData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Post deleted successfully!");
        // reload posts immediately
        fetchProfileAndPosts();
      } else {
        toast.error(data.message || "Failed to delete post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchProfileAndPosts();
  }, []);

  if (!profile) {
    return <div className="text-center py-10 text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-xl mt-12">
      <ToastContainer position="top-center" />
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Welcome, {profile.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-700">User Details</h2>
          <p className="mb-2"><span className="font-semibold">Name:</span> {profile.name}</p>
          <p><span className="font-semibold">Email:</span> {profile.email}</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-700">Post Info</h2>
          <p><span className="font-semibold">Total Posts:</span> {posts.length}</p>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate("/create")}
          className="bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-semibold py-3 px-8 rounded-md shadow-md"
        >
          Create New Post
        </button>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500 text-lg">No posts found.</p>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post._id} className="p-6 bg-gray-50 rounded-lg shadow border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-700">{post.content.slice(0, 120)}...</p>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() =>
                      navigate(
                        `/edit/${post._id}?title=${encodeURIComponent(post.title)}&image=${encodeURIComponent(
                          post.image
                        )}&content=${encodeURIComponent(post.content)}`
                      )
                    }
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;
