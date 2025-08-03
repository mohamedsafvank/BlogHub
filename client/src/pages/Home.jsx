import { useEffect, useState } from "react";

const dummyPosts = [
  {
    id: 1,
    title: "Understanding React Hooks",
    author: "Jane Doe",
    date: "2025-07-20",
    excerpt: "A beginner's guide to useState, useEffect, and custom hooks in React.",
    image: "https://miro.medium.com/v2/resize:fit:1400/1*-Ijet6kVJqGgul6adezDLQ.png",
  },
  {
    id: 2,
    title: "Mastering MongoDB Aggregations",
    author: "John Smith",
    date: "2025-07-22",
    excerpt: "Learn how to perform powerful data analysis using MongoDB aggregation pipelines.",
    image: "https://studio3t.com/wp-content/uploads/2018/10/Mongodb.png",
  },
  {
    id: 3,
    title: "CSS Grid vs Flexbox",
    author: "Emily Johnson",
    date: "2025-07-25",
    excerpt: "When to use CSS Grid and when to choose Flexbox for responsive design.",
    image: "https://atyantik.com/wp-content/uploads/2025/03/flexbox-vs-grid.jpg",
  },
  {
    id: 4,
    title: "Building REST APIs with Express",
    author: "Michael Lee",
    date: "2025-07-28",
    excerpt: "How to set up routes, middlewares, and error handling in an Express app.",
    image: "https://bs-uploads.toptal.io/blackfish-uploads/components/open_graph_image/10227551/og_image/optimized/secure-rest-api-in-nodejs-18f43b3033c239da5d2525cfd9fdc98f.png",
  },
];

const Home = () => {
  const [fetchedPosts, setFetchedPosts] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/blogs");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json(); 
        
        setFetchedPosts(data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

 const renderPostCard = (post) => {
  const imageUrl = post.image.startsWith("http")
    ? post.image
    : `http://localhost:5000${post.image}`;

  return (
    <div
      key={post.id || post._id} // support both dummy (id) and backend (_id)
      className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <img
        src={imageUrl}
        alt={post.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        <p className="text-gray-500 text-sm mb-2">
          By {post.author} | {new Date(post.date).toDateString()}
        </p>
        <p className="text-gray-700 mb-4">{post.excerpt || post.content?.slice(0, 100) + "..."}</p>
        <button className="text-blue-600 hover:underline font-medium">
          Read More →
        </button>
      </div>
    </div>
  );
};


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to BlogHub</h1>
      <p className="text-gray-600 mb-8">Explore posts from different users.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
        {dummyPosts.map(renderPostCard)}
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        {fetchedPosts.length > 0 ? (
          fetchedPosts.map(renderPostCard)
        ) : (
          <p className="text-gray-500">Loading or no blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
