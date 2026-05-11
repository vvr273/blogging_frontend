import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App.jsx';

vi.mock('../../pages/LoginSignup', () => ({ default: () => <div>LoginSignup</div> }));
vi.mock('../../pages/VerifyEmail', () => ({ default: () => <div>Verify</div> }));
vi.mock('../../pages/ForgotPassword', () => ({ default: () => <div>Forgot</div> }));
vi.mock('../../pages/ResetPassword', () => ({ default: () => <div>Reset</div> }));
vi.mock('../../pages/Dashboard', () => ({ default: () => <div>Dashboard</div> }));
vi.mock('../../pages/About', () => ({ default: () => <div>About</div> }));
vi.mock('../../pages/Settings', () => ({ default: () => <div>Settings</div> }));
vi.mock('../../pages/blogpages/BlogListPage', () => ({ default: () => <div>Blogs</div> }));
vi.mock('../../pages/blogpages/EditBlogPage', () => ({ default: () => <div>Edit</div> }));
vi.mock('../../pages/blogpages/NewPost', () => ({ default: () => <div>NewPost</div> }));
vi.mock('../../pages/ReadBlog', () => ({ default: () => <div>ReadBlog</div> }));
vi.mock('../hooks/useAutoLogout', () => ({ default: () => {} }));
vi.mock('../api/auth', () => ({ logoutUser: vi.fn() }));

describe('App routing auth behavior', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('redirects logged-in user away from /login to dashboard', async () => {
    localStorage.setItem('token', 'test-token');
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
  });

  it('redirects unauthenticated user from protected route to login', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('LoginSignup')).toBeInTheDocument();
  });
});
