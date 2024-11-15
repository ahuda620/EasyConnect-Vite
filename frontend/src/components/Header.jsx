import styles from "./Header.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "../context/MobileContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faFileLines,
  faBookmark,
  faRightFromBracket,
  faMagnifyingGlass,
  faBars,
  faPenToSquare,
  faCircleCheck,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import companyLogo from "../assets/pinkLogo.png";

//Import Clerk Hooks
import { useUser, useClerk } from "@clerk/clerk-react";

export default function Header() {
  const { user } = useUser(); //Use Clerk hook to get current user
  const { openSignIn, openSignUp, signOut, openUserProfile } = useClerk(); //Clerk methods for login, signup and signout
  const isMobile = useIsMobile();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleMenuVisible = () => {
    setMenuVisible(!menuVisible);
  };

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

      {user ? (
        <div className={styles.userProfileContainer}>
          {user.username || user.firstName || user.fullName ? (
            <>
              <FontAwesomeIcon
                icon={faSortDown}
                className={styles.faSortDown}
              />
              <p>
                Welcome, {user.username || user.firstName || user.fullName}!
              </p>
            </>
          ) : (
            <p>{user.primaryEmailAddress}</p>
          )}
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
        <ul className={styles.userNotLoggedIn}>
          <li>
            <button onClick={() => openSignIn()}>Login</button>
          </li>
          <li>
            <button onClick={() => openSignUp()}>Sign Up</button>
          </li>
        </ul>
      )}
      {/* Mobile UI */}
      {isMobile && (
        <button className={styles.mobileMenuToggle} onClick={handleMenuVisible}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}

      {isMobile && (
        <nav
          className={`${styles.mobileMenu}
        ${menuVisible ? styles.visible : ""}`}
        >
          <ul>
            {user ? (
              <>
                <li>
                  <img src={user.picture}></img>
                </li>
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
                  <a href="/api/auth/login">
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    Login
                  </a>
                </li>
                <li>
                  <a href="#">
                    <FontAwesomeIcon icon={faPenToSquare} />
                    Signup
                  </a>
                </li>
              </>
            )}
            <li>
              <a href="#">
                <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                Profile
              </a>
            </li>
            <li>
              <a href="#">
                <FontAwesomeIcon icon={faFileLines} />
                Applications
              </a>
            </li>
            <li>
              <a href="#">
                <FontAwesomeIcon icon={faBookmark} />
                Saved Jobs
              </a>
            </li>
            <li>
              <a href="#">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                Placeholder
              </a>
            </li>
            <li>
              <a href="#">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                Placeholder
              </a>
            </li>
            <li>
              <a href="#">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                Placeholder
              </a>
            </li>
            <li>
              <a href="#">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                Placeholder
              </a>
            </li>
          </ul>
        </nav>
      )}
    </nav>
  );
}
