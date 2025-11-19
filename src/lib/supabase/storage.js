// lib/supabase/storage.ts
import { createClient } from './client';

export const uploadCoverImage = async (file) => {
  try {
    const supabase = createClient();

    // Create unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const filename = `${timestamp}-${random}-${file.name}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('blog-covers') // bucket name
      .upload(`covers/${filename}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('blog-covers')
      .getPublicUrl(`covers/${filename}`);

    return publicUrlData?.publicUrl || null;
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
};

export const deleteCoverImage = async (imageUrl) => {
  try {
    const supabase = createClient();

    // Extract filename from URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage.from('blog-covers').remove([`covers/${filename}`]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete failed:', error);
    return false;
  }
};
