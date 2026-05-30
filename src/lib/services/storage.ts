import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

export const storageService = {
  // Upload product image
  async uploadProductImage(file: File, productId: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `products/${productId}/${fileName}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  // Upload multiple product images
  async uploadProductImages(
    files: File[],
    productId: string
  ): Promise<string[]> {
    try {
      const uploadPromises = files.map((file) =>
        this.uploadProductImage(file, productId)
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  },

  // Delete product image
  async deleteProductImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  },

  // Delete all product images
  async deleteAllProductImages(productId: string): Promise<void> {
    try {
      const folderRef = ref(storage, `products/${productId}`);
      const listResult = await listAll(folderRef);

      const deletePromises = listResult.items.map((itemRef) =>
        deleteObject(itemRef)
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting product images:", error);
      throw error;
    }
  },

  // Upload category image
  async uploadCategoryImage(file: File, categoryId: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `categories/${categoryId}/${fileName}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading category image:", error);
      throw error;
    }
  },
};
