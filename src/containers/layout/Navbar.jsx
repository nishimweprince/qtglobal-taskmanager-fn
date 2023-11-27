import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import Button from '../../components/inputs/Button';
import { faChevronCircleDown, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toggleDropdown } from '../../redux/features/navbarSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.account);

  const dispatch = useDispatch();

  const { dropdownOpen } = useSelector((state) => state.navbar);

  const { pathname } = useLocation();

  const navMenu = [
    {
      title: 'Home',
      path: '/',
    },
    {
      title: 'Tasks Management',
      path: '/tasks',
    },
  ];

  if (pathname.startsWith('/auth')) {
    return null;
  }

  return (
    <nav className="w-[90%] mx-auto p-4 py-6 flex items-center justify-between relative">
      <section className="flex items-center gap-8">
        <h1 className="text-[20px] text-primary font-semibold uppercase">
          Task Manager
        </h1>
        <ul className="flex items-center gap-2">
          {navMenu.map((item, index) => {
            return (
              <li key={index}>
                <Button
                  value={item?.title}
                  background={false}
                  route={item?.path}
                />
              </li>
            );
          })}
        </ul>
      </section>
      <section>
        <Button
          background={false}
          className={`${user ? 'flex' : 'hidden'} hover:!no-underline`}
          value={
            <span className="flex items-center gap-4">
              <h4 className="font-medium text-[18px]">{user?.name}</h4>
              <FontAwesomeIcon
                className="text-[18px]"
                icon={dropdownOpen ? faChevronCircleUp : faChevronCircleDown}
              />
            </span>
          }
          onClick={(e) => {
            e.preventDefault();
            dispatch(toggleDropdown(!dropdownOpen));
          }}
        />
        <Button
          className={`${user ? 'hidden' : 'flex'}`}
          value="Login"
          route="/auth/login"
        />
        <NavDropdown isOpen={dropdownOpen} />
      </section>
    </nav>
  );
};

export const NavDropdown = ({ isOpen = false }) => {
  const dropDownLinks = [
    {
      title: 'Profile',
      path: '/user/profile',
    },
    {
      title: 'Settings',
      path: '/settings',
    },
    {
      title: 'Logout',
      path: '/auth/login',
    },
  ];

  const navigate = useNavigate();

  return (
    <menu
      className={`${
        isOpen ? 'translate-y-0' : 'translate-y-[-400px]'
      } rounded-md py-0 bg-white ease-in-out shadow-lg duration-500 absolute min-w-[20rem] border-[.5px] z-[999] top-[10vh] right-0 flex flex-col gap-0 items-start`}
    >
      <span className="flex flex-col gap-0 items-start w-full py-4">
        {dropDownLinks.map((link, index) => {
          return (
            <li key={index} className="cursor-pointer w-full">
              <Link
                className="w-full p-4 hover:bg-primary text-accent hover:!text-white flex items-start justify-start"
                onClick={(e) => {
                  if (link.title === 'Logout') {
                    e.preventDefault();
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    navigate('/auth/login')
                    window.location.reload();
                  }
                }}
                to={link.path}
                state={{ from: window.location.pathname }}
              >
                <span className="flex items-center gap-2">
                  <p className="text-[16px]">{link.title}</p>
                </span>
              </Link>
            </li>
          );
        })}
      </span>
    </menu>
  );
};

NavDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default Navbar;
