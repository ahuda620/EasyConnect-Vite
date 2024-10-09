import styles from "./Header.module.css";
import { useState } from "react";
// import { useUser } from "@auth0/nextjs-auth0/client";
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
} from "@fortawesome/free-solid-svg-icons";
import companyLogo from "../assets/companyLogo.png";

export default function Header() {
  //   const { user, error, isLoading } = useUser();
  const user = false;
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
          <a href="#">Placeholder</a>
        </li>
        <li>
          <a href="#">Placeholder</a>
        </li>
        <li>
          <a href="#">Placeholder</a>
        </li>
        <li>
          <a href="#">Placeholder</a>
        </li>
      </ul>

      {user ? (
        <div className={styles.userLoggedIn}>
          <div className={styles.userProfileContainer}>
            <p>Welcome, {user.given_name}!</p>
            <img src={user.picture}></img>
            <div className={styles.dropDownMenuTriangle}></div>
            <div className={styles.profileDropDownMenu}>
              <nav>
                <ul>
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
                    <a href="/api/auth/logout">
                      <FontAwesomeIcon icon={faRightFromBracket} />
                      Logout
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      ) : (
        <ul className={styles.userNotLoggedIn}>
          <li>
            <a href="/api/auth/login">Login</a>
          </li>
          <li>
            <a href="#">Sign Up</a>
          </li>
        </ul>
      )}

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
                  <a href="/api/auth/logout">
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    Logout
                  </a>
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
