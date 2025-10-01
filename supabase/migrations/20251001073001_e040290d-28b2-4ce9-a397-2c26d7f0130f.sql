-- Insert subjects for Semester 1
INSERT INTO public.subjects (name, code, semester, department_id) VALUES
  ('Engineering Maths – 1', 'EM101', 1, NULL),
  ('Engineering Physics', 'EP101', 1, NULL),
  ('Fundamental Of Programming', 'FP101', 1, NULL),
  ('Elements Of Civil Engineering', 'CIVIL101', 1, NULL),
  ('Engineering Graphics', 'EG101', 1, NULL)
ON CONFLICT (code) DO NOTHING;

-- Insert subjects for Semester 2
INSERT INTO public.subjects (name, code, semester, department_id) VALUES
  ('Engineering Maths – 2', 'EM201', 2, NULL),
  ('Basic Electrical & Electronic Engineering', 'BEEE201', 2, NULL),
  ('Object Oriented Programming Using C++', 'OOP201', 2, NULL),
  ('Fundamental Of Mechanical Engineering', 'FME201', 2, NULL),
  ('Workshop', 'WS201', 2, NULL),
  ('Business Communication And Presentation Skills', 'BCPS201', 2, NULL),
  ('Introduction To Information & Communication Technology', 'IICT201', 2, NULL)
ON CONFLICT (code) DO NOTHING;

-- Insert subjects for Semester 3
INSERT INTO public.subjects (name, code, semester, department_id) VALUES
  ('Discrete Mathematics', 'DM301', 3, NULL),
  ('Data Structure & Algorithms', 'DSA301', 3, NULL),
  ('Digital Electronics', 'DE301', 3, NULL),
  ('IT Workshop', 'ITW301', 3, NULL),
  ('Database Management Systems', 'DBMS301', 3, NULL)
ON CONFLICT (code) DO NOTHING;