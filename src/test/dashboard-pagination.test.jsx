import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard.jsx';

vi.mock('../../src/api/auth', () => ({
  logoutUser: vi.fn(),
}));

const fetchBlogs = vi.fn();
const fetchMyBlogs = vi.fn();
const fetchTrendingBlogs = vi.fn();
const deleteBlog = vi.fn();

vi.mock('../../src/api/blogs', () => ({
  fetchBlogs: (...args) => fetchBlogs(...args),
  fetchMyBlogs: (...args) => fetchMyBlogs(...args),
  fetchTrendingBlogs: (...args) => fetchTrendingBlogs(...args),
  deleteBlog: (...args) => deleteBlog(...args),
}));

describe('Dashboard pagination controls', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'token');
    localStorage.setItem('user', JSON.stringify({ name: 'Vishnu' }));
    fetchBlogs.mockResolvedValue({
      items: [{ _id: '1', title: 'Blog 1' }],
      totalPages: 3,
      total: 18,
    });
    fetchMyBlogs.mockResolvedValue({ items: [], totalPages: 1, total: 0 });
    fetchTrendingBlogs.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('shows and updates pagination controls', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const pagerLabels = await screen.findAllByText(/Page 1 \/ 3/i);
    expect(pagerLabels.length).toBeGreaterThan(0);

    fireEvent.click(screen.getAllByRole('button', { name: 'Next' })[0]);

    await waitFor(() => {
      expect(fetchBlogs).toHaveBeenCalledWith({ page: 2, limit: 6 });
    });
  });
});
