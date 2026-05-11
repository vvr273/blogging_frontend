import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ReadBlog from '../../pages/ReadBlog.jsx';

const fetchBlog = vi.fn();
const addComment = vi.fn();
const editComment = vi.fn();
const deleteComment = vi.fn();
const deleteBlog = vi.fn();
const toggleLike = vi.fn();

vi.mock('../../src/api/blogs', () => ({
  fetchBlog: (...args) => fetchBlog(...args),
  addComment: (...args) => addComment(...args),
  editComment: (...args) => editComment(...args),
  deleteComment: (...args) => deleteComment(...args),
  deleteBlog: (...args) => deleteBlog(...args),
  toggleLike: (...args) => toggleLike(...args),
}));

const blogPayload = {
  _id: 'b1',
  title: 'Test Blog',
  description: 'Desc',
  content: '<p>Content</p>',
  createdAt: new Date().toISOString(),
  author: { _id: 'u1', name: 'Author' },
  likes: [],
  comments: [{ _id: 'c1', text: 'old comment', user: { _id: 'u2', name: 'User2' }, createdAt: new Date().toISOString() }],
  commentsPagination: { nextCursor: null },
};

describe('ReadBlog comment interactions', () => {
  beforeEach(() => {
    localStorage.setItem('token', 't1');
    localStorage.setItem('user', JSON.stringify({ _id: 'u2', name: 'User2' }));
    fetchBlog.mockResolvedValue(blogPayload);
    addComment.mockResolvedValue({ ...blogPayload, comments: [...blogPayload.comments, { _id: 'c2', text: 'new', user: { _id: 'u2', name: 'User2' }, createdAt: new Date().toISOString() }], commentsPagination: { nextCursor: null } });
    editComment.mockResolvedValue({ ...blogPayload, comments: [{ ...blogPayload.comments[0], text: 'updated' }], commentsPagination: { nextCursor: null } });
    deleteComment.mockResolvedValue({ ...blogPayload, comments: [], commentsPagination: { nextCursor: null } });
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('supports add/edit/delete comment flow', async () => {
    render(
      <MemoryRouter initialEntries={['/blog/b1']}>
        <Routes>
          <Route path="/blog/:id" element={<ReadBlog />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Test Blog')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('What are your thoughts?'), { target: { value: 'hello' } });
    fireEvent.click(screen.getByText('Post'));

    await waitFor(() => expect(addComment).toHaveBeenCalled());

    fireEvent.click(screen.getAllByText('Edit')[0]);
    fireEvent.change(screen.getByDisplayValue('old comment'), { target: { value: 'updated' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => expect(editComment).toHaveBeenCalled());

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    fireEvent.click(screen.getAllByText('Delete')[0]);

    await waitFor(() => expect(deleteComment).toHaveBeenCalled());
  });
});
