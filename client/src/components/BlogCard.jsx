import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => (
  <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
    <h2 className="text-xl font-bold">{blog.title}</h2>
    <p className="text-sm text-gray-600">by {blog.author?.name}</p>
    <p className="mt-2 text-gray-800 line-clamp-3">{blog.content}</p>
    <Link to={`/blogs/${blog._id}`} className="text-blue-500 mt-2 inline-block">Read More</Link>
  </div>
);

export default BlogCard;
