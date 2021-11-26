import { Link, useLoaderData } from "remix";
import { getPosts } from '../../posts'
import type { Post } from '../../posts'

export const loader = () => getPosts()

export default function Posts() {
  const posts: Post[] = useLoaderData();

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}