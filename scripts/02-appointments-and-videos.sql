-- Create clinics table
CREATE TABLE IF NOT EXISTS clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  website TEXT,
  district TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_featured BOOLEAN DEFAULT FALSE,
  hours TEXT DEFAULT 'Mon-Fri: 8:00 AM - 5:00 PM',
  available_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  opening_time TIME DEFAULT '08:00:00',
  closing_time TIME DEFAULT '17:00:00',
  specialties TEXT[] DEFAULT ARRAY['Maternal Health', 'Prenatal Care', 'Postnatal Care'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_email TEXT,
  clinic_id UUID REFERENCES clinics(id),
  doctor_name TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pregnancy_videos table
CREATE TABLE IF NOT EXISTS pregnancy_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_minutes INTEGER,
  category TEXT NOT NULL CHECK (category IN ('Prenatal Care', 'Nutrition', 'Exercise', 'Labor & Delivery', 'Postnatal Care', 'Breastfeeding', 'Baby Care')),
  language TEXT DEFAULT 'English',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Princess Christian Maternity Hospital as featured clinic
INSERT INTO clinics (name, address, phone, email, website, district, latitude, longitude, is_featured, hours, specialties) VALUES
('Princess Christian Maternity Hospital', 'FQRJ+2CP Fourah Bay, Freetown', '+232 76 111 222', 'info@pcmh.sl', 'https://pcmh.sl', 'Western Area Urban', 8.4903, -13.2186, TRUE, 'Open 24 Hours', ARRAY['Maternal Health', 'Prenatal Care', 'Labor & Delivery', 'Postnatal Care', 'Emergency Obstetrics']);

-- Insert other sample clinics
INSERT INTO clinics (name, address, phone, district, latitude, longitude, specialties) VALUES
('Freetown Maternal Health Center', '15 Wilkinson Road, Freetown', '+232 76 123 456', 'Western Area Urban', 8.4657, -13.2317, ARRAY['Maternal Health', 'Prenatal Care', 'Postnatal Care']),
('Bo Government Hospital', 'Hospital Road, Bo', '+232 76 234 567', 'Bo', 7.9644, -11.7383, ARRAY['Maternal Health', 'General Medicine', 'Emergency Care']),
('Kenema Government Hospital', 'Hangha Road, Kenema', '+232 76 345 678', 'Kenema', 7.8767, -11.1900, ARRAY['Maternal Health', 'Pediatrics', 'Surgery']),
('Makeni Government Hospital', 'Magburaka Road, Makeni', '+232 76 456 789', 'Bombali', 8.8859, -12.0438, ARRAY['Maternal Health', 'Family Planning', 'Prenatal Care']),
('Koidu Government Hospital', 'Sefadu Road, Koidu', '+232 76 567 890', 'Kono', 8.6439, -10.9708, ARRAY['Maternal Health', 'Postnatal Care', 'Child Health']);

-- Insert sample pregnancy training videos
INSERT INTO pregnancy_videos (title, description, video_url, thumbnail_url, duration_minutes, category, language) VALUES
('Prenatal Care Basics', 'Essential prenatal care tips for a healthy pregnancy', 'https://example.com/videos/prenatal-basics', '/pregnant-woman-at-doctor.jpg', 15, 'Prenatal Care', 'English'),
('Nutrition During Pregnancy', 'What to eat and avoid during pregnancy for optimal health', 'https://example.com/videos/pregnancy-nutrition', '/healthy-pregnancy-food.png', 20, 'Nutrition', 'English'),
('Safe Exercises for Pregnant Women', 'Gentle exercises to stay fit and healthy during pregnancy', 'https://example.com/videos/pregnancy-exercise', '/pregnant-woman-exercising.png', 18, 'Exercise', 'English'),
('Preparing for Labor and Delivery', 'What to expect during labor and how to prepare', 'https://example.com/videos/labor-prep', '/woman-in-labor.jpg', 25, 'Labor & Delivery', 'English'),
('Breastfeeding Techniques', 'How to breastfeed your baby successfully', 'https://example.com/videos/breastfeeding', '/mother-breastfeeding-baby.jpg', 22, 'Breastfeeding', 'English'),
('Postnatal Care for Mother', 'Taking care of yourself after giving birth', 'https://example.com/videos/postnatal-care', '/mother-with-newborn.jpg', 16, 'Postnatal Care', 'English'),
('Newborn Baby Care', 'Essential tips for caring for your newborn', 'https://example.com/videos/newborn-care', '/newborn-baby-care.jpg', 20, 'Baby Care', 'English');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_clinic ON appointments(clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_videos_category ON pregnancy_videos(category);
CREATE INDEX IF NOT EXISTS idx_clinics_district ON clinics(district);
CREATE INDEX IF NOT EXISTS idx_clinics_featured ON clinics(is_featured);
