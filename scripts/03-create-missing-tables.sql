-- Create clinics table
CREATE TABLE IF NOT EXISTS clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  district TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  available_days TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  opening_time TIME DEFAULT '08:00:00',
  closing_time TIME DEFAULT '17:00:00',
  specialties TEXT[] DEFAULT ARRAY['Maternal Health', 'Prenatal Care', 'Postnatal Care'],
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

-- Insert sample clinics
INSERT INTO clinics (name, address, phone, email, district, latitude, longitude) VALUES
('Freetown Maternal Health Center', '15 Wilkinson Road, Freetown', '+232 76 123 456', 'info@fmhc.sl', 'Western Area Urban', 8.4657, -13.2317),
('Bo Government Hospital', 'Hospital Road, Bo', '+232 76 234 567', 'info@bogh.sl', 'Bo', 7.9644, -11.7383),
('Kenema Government Hospital', 'Hangha Road, Kenema', '+232 76 345 678', 'info@kenemahosp.sl', 'Kenema', 7.8767, -11.1900),
('Makeni Government Hospital', 'Magburaka Road, Makeni', '+232 76 456 789', 'info@makenigh.sl', 'Bombali', 8.8859, -12.0438),
('Koidu Government Hospital', 'Sefadu Road, Koidu', '+232 76 567 890', 'info@koidugh.sl', 'Kono', 8.6439, -10.9708);

-- Insert sample pregnancy training videos
INSERT INTO pregnancy_videos (title, description, video_url, thumbnail_url, duration_minutes, category, language, views) VALUES
('Prenatal Care Basics', 'Essential prenatal care tips for a healthy pregnancy. Learn about regular checkups, nutrition, and warning signs.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/pregnant-woman-at-doctor.jpg', 15, 'Prenatal Care', 'English', 1250),
('Nutrition During Pregnancy', 'What to eat and avoid during pregnancy for optimal health. Discover the best foods for you and your baby.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/healthy-pregnancy-food.png', 20, 'Nutrition', 'English', 980),
('Safe Exercises for Pregnant Women', 'Gentle exercises to stay fit and healthy during pregnancy. Safe movements for each trimester.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/pregnant-woman-exercising.png', 18, 'Exercise', 'English', 750),
('Preparing for Labor and Delivery', 'What to expect during labor and how to prepare. Breathing techniques and pain management strategies.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/woman-in-labor.jpg', 25, 'Labor & Delivery', 'English', 1500),
('Breastfeeding Techniques', 'How to breastfeed your baby successfully. Proper latching, positioning, and common challenges.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/mother-breastfeeding-baby.jpg', 22, 'Breastfeeding', 'English', 1100),
('Postnatal Care for Mother', 'Taking care of yourself after giving birth. Recovery tips, emotional health, and when to seek help.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/mother-with-newborn.jpg', 16, 'Postnatal Care', 'English', 820),
('Newborn Baby Care', 'Essential tips for caring for your newborn. Bathing, diapering, sleep schedules, and soothing techniques.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/newborn-baby-care.jpg', 20, 'Baby Care', 'English', 1350);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_category ON pregnancy_videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_language ON pregnancy_videos(language);
CREATE INDEX IF NOT EXISTS idx_clinics_district ON clinics(district);
