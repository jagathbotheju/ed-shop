"use client";
import { z } from "zod";
import { useFormContext, useFieldArray } from "react-hook-form";
import { VariantSchema } from "@/lib/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { UploadDropzone } from "@/lib/uploadthing";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";
import { Trash, Trash2 } from "lucide-react";
import { Reorder } from "framer-motion";
import { useState } from "react";
import { deleteFiles } from "@/server/backend/actions/uploadActions";
import { toast } from "sonner";

const VariantImages = () => {
  const [active, setActive] = useState(0);
  const { getValues, setError, control } =
    useFormContext<z.infer<typeof VariantSchema>>();

  const { fields, remove, append, update, move } = useFieldArray({
    name: "images",
    control,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      <div className="col-span-1">
        <FormField
          control={control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <UploadDropzone
                  className="ut-allowed-content:text-secondary-foreground ut-label:text-primary ut-upload-icon:text-primary/50 hover:bg-primary/10 transition-all duration-500 ease-in-out border-secondary ut-button:bg-primary/75 ut-button:ut-readying:bg-secondary"
                  endpoint="variantUploader"
                  onUploadError={(error) => {
                    return setError("images", {
                      type: "validate",
                      message: error.message,
                    });
                  }}
                  onClientUploadComplete={(files) => {
                    console.log("upload complete", files);
                    const images = getValues("images");
                    images.map((field, imageIndex) => {
                      if (field.url.search("blob:") === 0) {
                        const image = files.find(
                          (img) => img.name === field.name
                        );
                        if (image) {
                          update(imageIndex, {
                            url: image.url,
                            name: image.name,
                            size: image.size,
                            key: image.key,
                          });
                        }
                      }
                    });
                    return;
                  }}
                  onBeforeUploadBegin={(files) => {
                    files.map((file) =>
                      append({
                        name: file.name,
                        size: file.size,
                        url: URL.createObjectURL(file),
                        key: "",
                      })
                    );
                    return files;
                  }}
                  config={{ mode: "auto" }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="rounded-md overflow-x-auto col-span-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <Reorder.Group
            as="tbody"
            values={fields}
            onReorder={(e) => {
              const activeElement = fields[active];
              e.map((item, index) => {
                if (item === activeElement) {
                  move(active, index);
                  setActive(index);
                }
              });
            }}
          >
            {fields.map((field, index) => (
              <Reorder.Item
                as="tr"
                key={field.id}
                id={field.id}
                value={field}
                onDragStart={() => setActive(index)}
                className={cn(
                  field.url.search("blob:") === 0 &&
                    "animate-pulse transition-all",
                  "text-sm font-bold text-muted-foreground hover:text-primary cursor-pointer"
                )}
              >
                <TableCell>{field.name}</TableCell>
                <TableCell>
                  {(field.size / (1024 * 1024)).toFixed(2)} MB
                </TableCell>
                <TableCell>
                  <div className="flex justify-center items-center">
                    <Image
                      src={field.url}
                      alt={field.name}
                      className="rounded-md overflow-hidden object-contain"
                      width={72}
                      height={48}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      if (field.key) {
                        remove(index);
                        deleteFiles(field?.key).then((res) => {
                          if (res.success) {
                            return toast.success("Image deleted successfully");
                          } else {
                            return toast.error("Could not delete image");
                          }
                        });
                      }
                    }}
                    className="scale-75"
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </TableCell>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </Table>
      </div>
    </div>
  );
};
export default VariantImages;
