import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import { X, CloudUpload } from "lucide-react";
import apiService from "@/lib/apiService";

interface PictureUploadProps {
  name: string;
  maxSize: number; // Max file size in bytes (5 MB = 5 * 1024 * 1024)
  file: any;
}

const PictureUpload: React.FC<PictureUploadProps> = ({
  name,
  maxSize,
  file,
}) => {
  const [errorMessage, setErrorMessage] = useState("");

  const { setValue, setError, clearErrors, getValues } = useFormContext();

  //   console.log(getValues("picture"));
  //   console.log(file);

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

  const onChange = async (e: any) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > maxSize) {
        setErrorMessage(`File size should be less than ${maxSize}MB`);
        return;
      }
    }

    const contents = await getBase64(file);

    try {
      const response = await apiService.post("/document", {
        filename: file.name,
        contents,
        type: "Photo",
        mimetype: file.type,
      });

      setValue(name, {
        id: response.id,
        filename: response.filename,
        url: response.url,
      });
    } catch (error: any) {
      console.log(error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="picture-upload" className="h-20 w-20 rounded-full">
        {file.url ? (
          <div>
            <img
              className="rounded-full w-20 h-20"
              src={file.url}
              alt="profile image"
            />
          </div>
        ) : (
          <div className="rounded-full w-20 h-20 flex justify-center items-center bg-gray-400">
            <CloudUpload />
          </div>
        )}
      </label>
      <input
        onChange={onChange}
        id="picture-upload"
        accept="image/*"
        type="file"
        className="hidden"
      />
      {errorMessage && <span>{errorMessage}</span>}
    </div>
  );
};

export default PictureUpload;
