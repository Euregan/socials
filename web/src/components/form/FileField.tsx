import { useEffect, useId, useRef, useState, type JSX } from "react";
import {
  FileText,
  FileLock2,
  FileSpreadsheet,
  Trash,
  Repeat2,
  Upload,
  FileUser,
} from "lucide-react";
import * as styles from "./FileField.css";
import { Spinner } from "../data/Spinner";
import { Button } from "./Button";

const formatSize = (bytes: number, fractionDigits = 1): string => {
  // We return early, because there cannot be partial bytes (10.2 B makes no sense, and neither does 10.0 B)
  if (Math.abs(bytes) < 1000) {
    return bytes + " B";
  }

  const units = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  let unit = 0;
  for (
    ;
    Math.round(Math.abs(bytes) * 10) / 10 >= 1000 && unit < units.length;
    unit++
  ) {
    bytes /= 1000;
  }

  return bytes.toFixed(fractionDigits) + " " + units[unit];
};

const fileToIcon = (file: File): JSX.Element => {
  switch (file.type) {
    case "text/x-opml+xml":
      return <FileSpreadsheet />;
    case "application/pdf":
      return <FileText />;
    case "image/png":
    case "image/jpeg":
      return <FileUser />;
    default:
      return <FileLock2 />;
  }
};

const getErrorMessageFromDragging = (
  dragging: Array<DataTransferItem>,
): string | null => {
  if (dragging.length > 1) {
    return "Please drag only one file.";
  }

  const [file] = dragging;

  if (!file) {
    return "Please drag a file.";
  }

  return null;
};

type FileInputProps = {
  /** The label providing a succinct description of the input */
  label: string;
  /** The default value of the file */
  value?: File | null;
  /** The maximum size of the file, in MB */
  maxSize: number;
  /** A callback called when a file is uploaded and removed. It needs to return a promise */
  onChange: (file: File | null) => Promise<unknown> | void;
  /** A longer description to help the user understand the input's purpose */
  description?: string;
  /** A validation error. This should not contain upload errors, as they are handled by the component */
  error?: string;
};

export const FileField = ({
  label,
  value,
  maxSize,
  onChange,
  error: externalErrorMessage,
  description,
}: FileInputProps) => {
  const labelId = useId();
  const errorId = useId();

  const [file, setFile] = useState<null | File>(value || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [dragging, setDragging] = useState<null | Array<DataTransferItem>>(
    null,
  );

  const ref = useRef<HTMLInputElement>(null);

  const onFileInput = async (file: File | null) => {
    // maxSize is in MB, file.size is in B
    if (file && file.size > maxSize * 1000 * 1000) {
      return setError(
        `You cannot upload a file greater than ${formatSize(
          maxSize * 1000 * 1000,
        )}. Please select a smaller file.`,
      );
    }

    if (file) {
      setFile(file);
    }
    setLoading(true);
    setUploadError(null);

    try {
      await onChange(file);
      if (!file) {
        setFile(null);
      }
    } catch {
      setLoading(false);
      setUploadError(
        `An error occured during the ${file ? "upload" : "deletion"}.`,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dragging) {
      setError(getErrorMessageFromDragging(dragging));
    } else {
      setError(uploadError);
    }
  }, [dragging, uploadError]);

  let style = styles.input.default;
  if (externalErrorMessage) {
    style = styles.input.externalError;
  }
  if (error && !file) {
    style = styles.input.error;
  }
  if (error && file) {
    style = styles.input.uploadError;
  }
  if (dragging && !error) {
    style = styles.input.dragging;
  }
  if (file && !error) {
    style = styles.input.filled;
  }

  return (
    <div className={styles.container}>
      <label className={styles.container}>
        <div className={styles.label} id={labelId}>
          {label}
        </div>
        <div
          className={style}
          onDrop={(event) => {
            event.preventDefault();

            if (
              !getErrorMessageFromDragging([...event.dataTransfer.items]) &&
              event.dataTransfer.files?.[0]
            ) {
              onFileInput(event.dataTransfer.files[0]);
            }

            setDragging(null);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragEnter={(event) => setDragging([...event.dataTransfer.items])}
          onDragExit={() => setDragging(null)}
        >
          <div className={styles.file}>
            <div className={styles.icon}>
              {loading && <Spinner />}
              {!loading && !file && <Upload />}
              {!loading && file && fileToIcon(file)}
            </div>
            {file && (
              <div>
                <div className={styles.filename}>
                  {error ? error : file.name}
                </div>
                <div className={styles.filesize}>
                  {error ? file.name : formatSize(file.size)}
                </div>
              </div>
            )}
            {file && !loading && (
              <div className={styles.actions}>
                {error && (
                  <Button onClick={() => onFileInput(file)}>
                    <Repeat2 />
                  </Button>
                )}
                <Button
                  onClick={() => {
                    onFileInput(null);
                    // Clearing the field manually specifically for Chrome :(
                    if (ref.current) {
                      ref.current.value = "";
                    }
                  }}
                >
                  <Trash />
                </Button>
              </div>
            )}
          </div>
          {!file && (
            <div className={styles.details}>
              <div>{error || "Click to upload or drag and drop"}</div>
              <div className={styles.rules}>
                max.{" "}
                {/* maxSize is in MB, so we convert it to bytes. As the maximum sizes are round numbers, we don't display fraction digits */}
                {formatSize(maxSize * 1000 * 1000, 0)}
              </div>
            </div>
          )}
          <input
            ref={ref}
            aria-labelledby={labelId}
            aria-describedby={errorId}
            className={styles.hidden}
            type="file"
            onChange={(event) =>
              event.target.files?.[0] && onFileInput(event.target.files[0])
            }
          />
        </div>
      </label>
      {description && <div className={styles.description}>{description}</div>}
      {externalErrorMessage && (
        <div id={errorId} className={styles.error}>
          {externalErrorMessage}
        </div>
      )}
    </div>
  );
};
