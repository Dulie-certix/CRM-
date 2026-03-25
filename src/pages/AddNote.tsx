import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FileText, AlignLeft, Tag, Calendar, ImagePlus, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import { NoteFormData } from '../types/note';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const AddNote: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<NoteFormData>({ defaultValues: { status: 'pending' } });

  const [loading, setLoading]     = useState(false);
  const [apiError, setApiError]   = useState('');
  const [preview, setPreview]     = useState<string | null>(null);
  const navigate = useNavigate();

  const imageFiles = watch('image');
  React.useEffect(() => {
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
      await api.post('/notes', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/notes');
    } catch {
      setApiError('Failed to create note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="New Note"
      subtitle="Fill in the details below to create a new note"
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

            {/* Status + Due Date row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status */}
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

              {/* Due date */}
              <Input
                label="Due Date"
                type="date"
                leftIcon={<Calendar size={14} />}
                title="Select the date this note is due"
                {...register('dueDate')}
              />
            </div>

            {/* Image upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary flex items-center gap-1.5">
                <ImagePlus size={14} className="text-text-muted" />
                Attachment <span className="text-text-muted font-normal">(optional)</span>
              </label>

              {preview ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPreview(null)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white
                               flex items-center justify-center text-xs hover:bg-black/70 transition"
                  >
                    ✕
                  </button>
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
              <Button type="submit" loading={loading} icon={<FileText size={14} />}>
                Create Note
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default AddNote;
