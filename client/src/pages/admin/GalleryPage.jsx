import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { TrashIcon, PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const fileRef = useRef();

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await API.get('/settings');
      setImages(res.data?.galleryImages || []);
    } catch { toast.error('Failed to load gallery'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const handleUpload = async () => {
    if (!file) return toast.error('Please select an image');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('caption', caption);
      await API.post('/settings/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Image uploaded!');
      setFile(null); setPreview(null); setCaption('');
      fetchGallery();
    } catch { toast.error('Upload failed. Check Cloudinary settings.'); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await API.delete(`/settings/gallery/${id}`);
      toast.success('Image deleted');
      fetchGallery();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-white">Gallery Management</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Upload photos to display on the public website gallery</p>
        </div>

        {/* Upload Section */}
        <div className="card p-6">
          <h3 className="font-semibold text-navy-900 dark:text-white mb-4">Upload New Image</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Drop zone */}
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 dark:border-navy-700 hover:border-gold-400 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group"
            >
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-lg" />
              ) : (
                <>
                  <ArrowUpTrayIcon className="w-10 h-10 text-gray-300 dark:text-navy-700 group-hover:text-gold-400 transition-colors" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center">Click to select image<br /><span className="text-xs text-gray-400">JPG, PNG, WEBP – Max 5MB</span></p>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Caption (optional)</label>
                <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="e.g. Library interior" className="input-field" />
              </div>
              {file && (
                <div className="p-3 bg-gray-50 dark:bg-navy-800 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">📎 {file.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
              )}
              <button onClick={handleUpload} disabled={uploading || !file} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {uploading ? <><span className="w-4 h-4 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />Uploading...</> : <><ArrowUpTrayIcon className="w-4 h-4" />Upload Image</>}
              </button>
              {file && (
                <button onClick={() => { setFile(null); setPreview(null); setCaption(''); }} className="w-full text-sm text-gray-400 hover:text-red-500 transition-colors">✕ Clear selection</button>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : images.length === 0 ? (
          <div className="card p-12 text-center">
            <PhotoIcon className="w-12 h-12 text-gray-300 dark:text-navy-700 mx-auto mb-3" />
            <p className="text-gray-400 dark:text-gray-500">No images uploaded yet.</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{images.length} image{images.length !== 1 ? 's' : ''} in gallery</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {images.map((img) => (
                  <motion.div key={img._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="group relative rounded-xl overflow-hidden aspect-square bg-gray-100 dark:bg-navy-800">
                    <img src={img.url} alt={img.caption || 'Gallery'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/50 transition-all flex items-center justify-center">
                      <button onClick={() => handleDelete(img._id)} className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-xl shadow-lg">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    {img.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-navy-900/70 text-white text-xs p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                        {img.caption}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
