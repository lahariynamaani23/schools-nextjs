import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Head from 'next/head';

export default function AddSchool() {
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState('');
  const [preview, setPreview] = useState('');

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
    mode: 'onTouched'
  });

  const imageFile = watch('image');

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setServerMsg('');
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k === 'image') {
          if (v && v[0]) formData.append('image', v[0]);
        } else {
          formData.append(k, v);
        }
      });

      const res = await fetch('/api/schools/create', {
        method: 'POST',
        body: formData
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed to save');

      setServerMsg('✅ School saved successfully!');
      reset();
      setPreview('');
    } catch (e) {
      setServerMsg('❌ ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview('');
    }
  };

  return (
    <main className="container">
      <Head><title>Add School</title></Head>
      <div className="header">
        <h1 className="title">Add School</h1>
        <div className="nav">
          <Link href="/showSchools">Show Schools</Link>
          <Link href="/">Home</Link>
        </div>
      </div>

      <form className="card" onSubmit={handleSubmit(onSubmit)}>
        <div style={{display:'grid', gridTemplateColumns:'1fr', gap:'1rem'}}>

          <div>
            <label className="label">School Name *</label>
            <input className="input" placeholder="e.g., Sunrise High School"
              {...register('name', { required: 'Name is required', minLength: { value: 3, message: 'At least 3 characters' }})} />
            {errors.name && <p className="error">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Email *</label>
            <input className="input" type="email" placeholder="school@example.com"
              {...register('email_id', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
              })} />
            {errors.email_id && <p className="error">{errors.email_id.message}</p>}
          </div>

          <div>
            <label className="label">Contact Number *</label>
            <input className="input" placeholder="10-digit number"
              {...register('contact', {
                required: 'Contact is required',
                pattern: { value: /^\d{10}$/, message: 'Enter a 10-digit number' }
              })} />
            {errors.contact && <p className="error">{errors.contact.message}</p>}
          </div>

          <div>
            <label className="label">Address *</label>
            <textarea className="input" rows={2} placeholder="Street, locality"
              {...register('address', { required: 'Address is required', minLength: { value: 5, message: 'At least 5 characters' }})} />
            {errors.address && <p className="error">{errors.address.message}</p>}
          </div>

          <div>
            <label className="label">City *</label>
            <input className="input" placeholder="City"
              {...register('city', { required: 'City is required' })} />
            {errors.city && <p className="error">{errors.city.message}</p>}
          </div>

          <div>
            <label className="label">State *</label>
            <input className="input" placeholder="State"
              {...register('state', { required: 'State is required' })} />
            {errors.state && <p className="error">{errors.state.message}</p>}
          </div>

          <div>
            <label className="label">School Image (JPG/PNG, up to 10MB)</label>
            <input className="input" type="file" accept="image/*"
              {...register('image')} onChange={handleImageChange} />
            {preview && <img src={preview} alt="preview" className="preview" />}
          </div>

          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save School'}
          </button>

          {serverMsg && <p className="subtitle" aria-live="polite">{serverMsg}</p>}
        </div>
      </form>
    </main>
  );
}
