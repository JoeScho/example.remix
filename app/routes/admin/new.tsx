import { useActionData, redirect, Form, useTransition } from 'remix';
import { createPost } from '../../posts';
import invariant from 'tiny-invariant';
import type { ActionFunction } from 'remix';

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

  invariant(typeof title === 'string', 'Title must be a string');
  invariant(typeof slug === 'string', 'Slug must be a string');
  invariant(typeof markdown === 'string', 'Markdown must be a string');

  if (Object.keys(errors).length) {
    return errors;
  }

  await createPost({ title, slug, markdown });

  return redirect('/admin');
};


export default function NewPost() {
  const errors = useActionData();
  let transition = useTransition();

  return (
    <Form method='post'>
      <p>
        <label>
          Post Title: {' '}
          {errors?.title && <em>Title is required</em>}
          <input type='text' name='title' />
        </label>
      </p>
      <p>
        <label>
          Post Slug:
          {errors?.slug && <em>Slug is required</em>}
          <input type='text' name='slug' />
        </label>
      </p>
      <p>
        <label htmlFor='markdown'>Markdown</label>{' '}
        {errors?.markdown && <em>Markdown is required</em>}
        <br />
        <textarea rows={20} name='markdown' />
      </p>
      <p>
        <button type='submit'>
          {transition.submission
            ? "Creating..."
            : "Create Post"}
        </button>
      </p>
    </Form>
  );
}