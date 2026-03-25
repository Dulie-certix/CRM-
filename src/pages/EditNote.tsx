import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, AlignLeft, Tag, Calendar, ImagePlus, ArrowLeft, Save } from 'lucide-react';
import api from '../api/axios';
import { Note, NoteFormData } from '../types/note';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const EditNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<NoteFormData>();

  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [apiError, setApiError] = useState('');
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [preview, setPreview]   = useState<string | null>(null);
  const navigate = useNavigate();

  /* Fetch note */
  useEffect(() => {
    api.get<Note>(`/notes/${id}`)
      .then((res) => {
        const { title, description, status, dueDate, image } = res.data;
        reset({
          title,
          description,
          status,
          dueDate: dueDate ? dueDate.slice(0, 10) : '',
        });
        if (image) setExistingImage(image);
      })
      .catch(() => setApiError('Note not found'))
      .finally(() => setFetching(false));
  }, [id, reset]);

  /* New image preview */
  const imageFiles = watch('image');
  useEffect(() => {
    const file = imageFiles?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [imageFiles]);

  const onSubmit = async (data: NoteFormData) => {
    setLoading(true);
    setApiError('');
    try {
      const fd = new FormData();
      fd.append('title', data.title);
      fd.append('description', data.description);
      fd.append('status', data.status);
      if (data.dueDate) fd.append('dueDate', data.dueDate);
      if (data.image?.[0]) fd.append('image', data.image[0]);
      await api.put(`/notes/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/notes');
    } catch {
      setApiError('Failed to update note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Layout title="Edit Note">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  const displayImage = preview ?? existingImage;

  return (
    <Layout
      title="Edit Note"
      subtitle="Update the details of your note"
      actions={
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft size={14} />}
          onClick={() => navigate('/notes')}
        >
          Back to Notes
        </Button>
      }
    >
      <div className="max-w-2xl">
        <Card>
          {apiError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-danger text-sm rounded-lg px-4 py-3 mb-5">
              <span>⚠</span> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <Input
              label="Note Title"
              placeholder="Enter a descriptive title..."
              leftIcon={<FileText size={14} />}
              error={errors.title?.message}
              {...register('title', { required: 'Title is required' })}
            />

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary flex items-center gap-1.5">
                <AlignLeft size={14} className="text-text-muted" />
                Description
              </label>
              <textarea
                rows={5}
                placeholder="Describe what this note is about, key details, next steps..."
                className={`form-textarea${errors.description ? ' error' : ''}`}
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && (
                <p className="text-xs text-danger">{errors.description.message}</p>
              )}
            </div>

            {/* Status + Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary flex items-center gap-1.5">
                  <Tag size={14} className="text-text-muted" />
                  Status
                </label>
                <select className="form-select" {...register('status')}>
                  <option value="" disabled>Select a status...</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <Input
                label="Due Date"
                type="date"
                leftIcon={<Calendar size={14} />}
                title="Select the date this note is due"
                {...register('dueDate')}
              />
            </div>

            {/* Image */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary flex items-center gap-1.5">
                <ImagePlus size={14} className="text-text-muted" />
                Attachment{' '}
                {existingImage && !preview && (
                  <span className="text-xs text-text-muted font-normal">(current image shown)</span>
                )}
              </label>

              {displayImage ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border">
                  <img src={displayImage} alt="Preview" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 flex items-center justify-center
                                    bg-black/40 opacity-0 hover:opacity-100 transition cursor-pointer">
                    <span className="text-white text-sm font-medium">Replace image</span>
                    <input type="file" accept="image/*" className="hidden" {...register('image')} />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed
                                  border-border bg-background hover:border-primary/50 hover:bg-primary/5
                                  cursor-pointer transition group">
                  <ImagePlus size={22} className="text-text-muted group-hover:text-primary transition mb-2" />
                  <span className="text-sm text-text-secondary group-hover:text-primary transition">
                    Click to upload image
                  </span>
                  <span className="text-xs text-text-muted mt-0.5">PNG, JPG, WEBP up to 5MB</span>
                  <input type="file" accept="image/*" className="hidden" {...register('image')} />
                </label>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/notes')}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading} icon={<Save size={14} />}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default EditNote;
