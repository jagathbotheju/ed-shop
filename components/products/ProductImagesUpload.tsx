"use client";
import { useUploadThing } from "@/lib/uploadthing";
import { useDropzone } from "@uploadthing/react";
import { CloudUpload, Trash2 } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import _ from "lodash";
import { toast } from "sonner";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

const ProductImagesUpload = ({ images, onChange }: Props) => {
  const { startUpload } = useUploadThing("imageUploader");
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const onDrop = useCallback(async (imageFiles: File[]) => {
    if (!_.isEmpty(imageFiles)) {
      const uploadedImages = await startUpload(imageFiles);
      const urls = uploadedImages?.map((item) => item.url);
      if (urls) {
        setImageUrls([...imageUrls, ...urls]);
        onChange([...images, ...urls]);
        console.log("image uploaded", urls);
      } else {
        return toast.error("Error uploading images...");
      }
    }

    // onChange(URL.createObjectURL(acceptedFiles[0]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(["image/*"]),
  });

  return (
    <div className="flex flex-wrap gap-4">
      {images &&
        images.map((image) => (
          <div key={image} className="h-[200px] w-[200px] relative rounded-md">
            <Image
              src={image}
              alt="image"
              // width={500}
              // height={500}
              fill
              className="top-0 left-0 relative w-full h-full object-top object-cover rounded-md"
            />
          </div>
        ))}

      <div
        {...getRootProps()}
        className="flex h-[200px] w-[200px] cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50 border-2 border-dashed items-center justify-center"
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center py-5 text-grey-500 text-slate-500 w-[200px] h-[200px]">
          <CloudUpload className="h-10 w-10" />
          <h3 className="mb-2 mt-2">Drag photo here</h3>
          <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
        </div>
      </div>
    </div>
  );
};
export default ProductImagesUpload;
