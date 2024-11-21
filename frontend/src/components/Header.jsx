import styles from "./Header.module.css";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "../context/MobileContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBookmark,
  faRightFromBracket,
  faMagnifyingGlass,
  faBars,
  faPenToSquare,
  faCircleCheck,
  faSortDown,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import companyLogo from "../assets/pinkLogo.png";

//Import Clerk Hooks
import { useUser, useClerk } from "@clerk/clerk-react";

export default function Header() {
  const [menuVisible, setMenuVisible] = useState(false);

  const { user } = useUser(); //Use Clerk hook to get current user
  const { openSignIn, openSignUp, signOut, openUserProfile } = useClerk(); //Clerk methods for login, signup and signout
  const isMobile = useIsMobile();

  //refs used for handling user clicks related to the header mobile menu
  const mobileMenuRef = useRef(null);
  const mobileMenuBtnRef = useRef(null);

  function toggleMobileMenu() {
    setMenuVisible(!menuVisible);
  }

  return (
    <nav className={styles.wrapper}>
      <img
        src={companyLogo}
        alt="Company Logo"
        className={styles.companyLogo}
      ></img>

      <ul className={styles.centerNavLinks}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/jobs">Search</Link>
        </li>
      </ul>

      {user && !isMobile ? (
        <div className={styles.userProfileContainer}>
          {user.username ||
            user.firstName ||
            (user.fullName && (
              <>
                <FontAwesomeIcon
                  icon={faSortDown}
                  className={styles.faSortDown}
                />
                <p>
                  {user.firstName
                    ? user.firstName
                    : user.username
                    ? user.username
                    : user.fullName && user.fullName}
                </p>
              </>
            ))}
          <img src={user.imageUrl}></img>
          <div className={styles.profileDropDownMenu}>
            <nav>
              <ul>
                <li>
                  <button onClick={() => openUserProfile()}>
                    <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                    Profile
                  </button>
                </li>
                <li>
                  <Link to="/saved-jobs">
                    <FontAwesomeIcon icon={faBookmark} />
                    Saved Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/skills">
                    <FontAwesomeIcon icon={faCircleCheck} />
                    Skills
                  </Link>
                </li>
                <li>
                  <button onClick={() => signOut()}>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      ) : (
        !isMobile && (
          <ul className={styles.userNotLoggedIn}>
            <li>
              <button onClick={() => openSignIn()}>Login</button>
            </li>
            <li>
              <button onClick={() => openSignUp()}>Sign Up</button>
            </li>
          </ul>
        )
      )}
      {/* Mobile UI */}
      {isMobile && (
        <button
          ref={mobileMenuBtnRef}
          className={styles.mobileMenuToggle}
          onBlur={(e) => {
            //Close mobile menu if user clicks outside of the mobile menu button and mobile menu
            if (
              !mobileMenuBtnRef.current.contains(e.relatedTarget) &&
              !mobileMenuRef.current.contains(e.relatedTarget)
            ) {
              setMenuVisible(false);
            }
          }}
          onClick={toggleMobileMenu}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}

      {isMobile && (
        <nav
          ref={mobileMenuRef}
          className={`${styles.mobileMenu}
        ${menuVisible ? styles.visible : ""}`}
        >
          <ul>
            {user ? (
              <>
                {user.picture && (
                  <li>
                    <img src={user.picture}></img>
                  </li>
                )}
                <li>
                  <button onClick={() => signOut()}>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button onClick={() => openSignIn()}>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    Login
                  </button>
                </li>
                <li>
                  <button onClick={() => openSignUp()}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                    Sign Up
                  </button>
                </li>
              </>
            )}
            <li>
              <a href="/jobs">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                Search
              </a>
            </li>
            <li>
              <a href="/">
                <FontAwesomeIcon icon={faHome} />
                Home
              </a>
            </li>
            {user && (
              <>
                <li>
                  <button onClick={() => openUserProfile()}>
                    <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                    Profile
                  </button>
                </li>
                <li>
                  <a href="/saved-jobs">
                    <FontAwesomeIcon icon={faBookmark} />
                    Saved Jobs
                  </a>
                </li>
                <li>
                  <a href="/skills">
                    <FontAwesomeIcon icon={faCircleCheck} />
                    Skills
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </nav>
  );
}
