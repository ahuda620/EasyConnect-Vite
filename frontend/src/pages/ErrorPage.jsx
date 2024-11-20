import styles from "./ErrorPage.module.css";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className={styles.errorPage}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className={styles.errorDetails}>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
