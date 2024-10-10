"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export const deleteFiles = async (file: string) => {
  try {
    const res = await utapi.deleteFiles(file);
    console.log(res);
    if (res.success) {
      return { success: "Image deleted successfully" };
    }
    return { error: "Could not delete image" };
  } catch (error) {
    console.error("UTAPI: Error deleting files", error);
    return { error: "Could not delete image" };
  }
};
