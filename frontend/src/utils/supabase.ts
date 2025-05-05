import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_REACT_APP_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadFileToSupabase(file: File, onProgress?: (progress: number) => void): Promise<string> {
  const filePath = `prescriptions/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('prescriptions')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  // Get the public URL
  const { data: publicUrlData } = supabase.storage.from('prescriptions').getPublicUrl(filePath);
  if (!publicUrlData?.publicUrl) throw new Error('Failed to get public URL');
  return publicUrlData.publicUrl;
} 