"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { ControllerRenderProps, useFormContext } from "react-hook-form";
import { InputProps } from "@/components/ui/input";
import { forwardRef, useEffect, useState } from "react";
import _ from "lodash";

type Props = InputProps & {
  tags: string[];
  onChange: (tags: string[]) => void;
};

const VariantTags = forwardRef<HTMLInputElement, Props>(
  ({ tags, onChange, ...rest }, ref) => {
    const [tagData, setTagData] = useState("");
    const [focused, setFocused] = useState(false);
    const { setFocus, trigger, formState, reset, getValues } = useFormContext();
    const { errors } = formState;

    const setTags = () => {
      if (tagData) {
        const newTagData = new Set([...tags, tagData]);
        onChange(Array.from(newTagData));
        setTagData("");
      }
    };

    // console.log("tags****", tags);

    return (
      <div className="flex flex-col gap-3" onClick={() => setFocus("tags")}>
        {tags.length > 0 && (
          <motion.div className="rounded-md flex flex-wrap items-center gap-2">
            <AnimatePresence>
              {tags.map((tag, index) => (
                <motion.div
                  key={tag}
                  className="relative"
                  animate={{ scale: 1 }}
                  initial={{ scale: 0 }}
                  exit={{ scale: 0 }}
                >
                  <div className="p-1 bg-primary rounded-md">{tag}</div>
                  <Button
                    asChild
                    size="icon"
                    variant="outline"
                    className="absolute -top-2 -right-2 cursor-pointer"
                    onClick={() =>
                      onChange(tags.filter((item) => item !== tag))
                    }
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        <Input
          {...rest}
          value={tagData}
          placeholder="add tags"
          onChange={(e) => {
            setTagData(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setTags();
            }
            if (e.key === "Backspace" && !tagData && tags.length > 0) {
              e.preventDefault();
              const newTags = [...tags];
              newTags.pop();
              onChange(newTags);
            }
          }}
          onFocus={(e) => setFocused(true)}
          onBlurCapture={(e) => setFocused(false)}
          // onBlur={() => trigger("tags")}
          ref={ref}
          // {...register("tags")}
        />
      </div>
    );
  }
);

VariantTags.displayName = "VariantTags";
export default VariantTags;
