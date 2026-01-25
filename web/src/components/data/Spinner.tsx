import * as styles from "./Spinner.css";

export const Spinner = () => (
  <svg
    viewBox="22 22 44 44"
    fill="transparent"
    width="1.2em"
    height="1.2em"
    className={styles.spinner}
    role="progressbar"
  >
    <circle cx="44" cy="44" r="18.6" className={styles.backgroundCircle} />
    <circle cx="44" cy="44" r="18.6" className={styles.spinnerCircle} />
  </svg>
);
