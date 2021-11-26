import { useLoaderData, useActionData, redirect, Form, useTransition } from 'remix';
import type { LoaderFunction, ActionFunction } from 'remix';
import { getPost, createPost } from '../../../posts';
import invariant from 'tiny-invariant';
import { useState } from 'react';

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'expected params.slug');
  return getPost(params.slug);
};

export const action: ActionFunction = async ({ request }) => {
  await new Promise(res => setTimeout(res, 1000));
  const formData = await request.formData();

  const title = formData.get('title');
  const slug = formData.get('slug');
  const markdown = formData.get('markdown');

  let errors = {};
  if (!title) Object.assign(errors, { title: true });
  if (!slug) Object.assign(errors, { slug: true });
  if (!markdown) Object.assign(errors, { markdown: true });

  invariant(typeof title === 'string', `Title must be a string [${title}]`);
  invariant(typeof slug === 'string', `Slug must be a string [${slug}]`);
  invariant(typeof markdown === 'string', `Markdown must be a string [${markdown}]`);

  if (Object.keys(errors).length) {
    return errors;
  }

  await createPost({ title, slug, markdown });

  return redirect('/admin');
};

export default function EditPost() {
  const errors = useActionData();
  const post = useLoaderData();
  let transition = useTransition();

  const [postTitle, setPostTitle] = useState(post.title)
  const [postMarkdown, setPostMarkdown] = useState(post.markdown)

  return (
    <Form method='post'>
      <p>
        <label>
          Post Title: {' '}
          {errors?.title && <em>Title is required</em>}
          <input type='text' name='title' value={postTitle} onChange={(ev) => setPostTitle(ev.target.value)}/>
        </label>
      </p>
      <p>
        <label>
          Post Slug:
          {errors?.slug && <em>Slug is required</em>}
          <input type='text' name='slug' value={post.slug} readOnly/>
        </label>
      </p>
      <p>
        <label htmlFor='markdown'>Markdown</label>{' '}
        {errors?.markdown && <em>Markdown is required</em>}
        <br />
        <textarea rows={20} name='markdown' value={postMarkdown} onChange={(ev) => setPostMarkdown(ev.target.value)}/>
      </p>
      <p>
        <button type='submit'>
          {transition.submission
            ? "Saving..."
            : "Save Post"}
        </button>
      </p>
    </Form>
  );
}