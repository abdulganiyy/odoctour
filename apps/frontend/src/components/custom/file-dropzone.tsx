import React from "react";
import { useDropzone, type Accept } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface FileDropzoneProps {
  files: { filename: string; filecontents: string }[];
  name: string;
  maxFiles: number;
  maxSize: number; // Max file size in bytes (5 MB = 5 * 1024 * 1024)
  accept?: Accept;
  isProfilePicture?: boolean;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  files,
  name,
  maxFiles,
  maxSize,
  accept,
  isProfilePicture,
}) => {
  const { setValue, setError, clearErrors } = useFormContext();

  // Convert file to Base64
  const getBase64 = async (file: File): Promise<string> => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const base64String =
          (reader.result as string).split("base64,")[1] || "";
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const acceptedFileTypes = accept
    ? Object.values(accept)
        .reduce((acc, curr) => [...acc, ...curr], [])
        .map((type) => type.replace(".", ""))
        .join(", ") // => e.g. 'jpg, png, pdf'
    : "";

  const onDrop = async (acceptedFiles: File[]) => {
    // Clear any previous validation errors
    clearErrors(name);

    // Validate the combined number of existing + new files
    if (acceptedFiles.length + files.length > maxFiles) {
      setError(name, {
        type: "maxFiles",
        message: `Only ${maxFiles} files are allowed.`,
      });
      return;
    }

    const oversizedFiles = acceptedFiles.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError(name, {
        type: "maxSize",
        message: `Some files are larger than the allowed size of ${maxSize / 1024 / 1024} MB.`,
      });
      return;
    }

    // Convert each file to base64 and store it along with the file name
    // File name is for display purposes/improved UX on form, and may be ignored/mapped out when sent to API
    const fileObjects = await Promise.all(
      acceptedFiles.map(async (file) => {
        const filecontents = await getBase64(file);
        return { filename: file.name, filecontents, mimeType: file.type };
      })
    );

    // Keep previously attached files and add new ones
    setValue(name, [...files, ...fileObjects]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize,
    accept,
  });

  return (
    <div className="flex flex-col">
      <div
        {...getRootProps()}
        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-center p-4 cursor-pointer"
      >
        <input {...getInputProps()} />
        <div className="text-sm text-gray-400 flex flex-col gap-3">
          <p>Drag & drop files here, or click to select files</p>
          {accept && (
            <p>The following file types are accepted: {acceptedFileTypes}</p>
          )}
        </div>
      </div>

      <div className="mt-4 text-sm font-medium leading-none">
        {files?.length > 0 && (
          <ul className="flex flex-col gap-2 list-none list-inside">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between">
                {/* File name label */}
                <div className="flex items-center gap-2">
                  <span>{file.filename}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => {
                    const updatedFiles = files.filter((_, i) => i !== index);
                    setValue(name, updatedFiles);
                  }}
                >
                  <X className="w-4 h-4 text-gray-500" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FileDropzone;
