-- Insert sample departments
INSERT INTO public.departments (name, code) VALUES
  ('Computer Science and Engineering', 'CSE'),
  ('Information Technology', 'IT'),
  ('Electronics and Communication', 'ECE'),
  ('Mechanical Engineering', 'MECH'),
  ('Civil Engineering', 'CIVIL'),
  ('Electrical Engineering', 'EEE')
ON CONFLICT (code) DO NOTHING;

-- Insert sample subjects for CSE
INSERT INTO public.subjects (name, code, department_id, semester)
SELECT 
  subj.name,
  subj.code,
  d.id,
  subj.semester
FROM (
  VALUES
    ('Data Structures', 'CS201', 3),
    ('Algorithms', 'CS202', 3),
    ('Database Management Systems', 'CS301', 5),
    ('Operating Systems', 'CS302', 5),
    ('Computer Networks', 'CS401', 7),
    ('Software Engineering', 'CS402', 7),
    ('Programming in C', 'CS101', 1),
    ('Object Oriented Programming', 'CS102', 2),
    ('Web Technologies', 'CS303', 5),
    ('Machine Learning', 'CS501', 8)
) AS subj(name, code, semester)
CROSS JOIN public.departments d
WHERE d.code = 'CSE'
ON CONFLICT (code) DO NOTHING;

-- Insert sample subjects for IT
INSERT INTO public.subjects (name, code, department_id, semester)
SELECT 
  subj.name,
  subj.code,
  d.id,
  subj.semester
FROM (
  VALUES
    ('Programming Fundamentals', 'IT101', 1),
    ('Data Structures and Algorithms', 'IT201', 3),
    ('Database Systems', 'IT301', 5),
    ('Web Development', 'IT302', 5),
    ('Cloud Computing', 'IT401', 7),
    ('Information Security', 'IT402', 7)
) AS subj(name, code, semester)
CROSS JOIN public.departments d
WHERE d.code = 'IT'
ON CONFLICT (code) DO NOTHING;

-- Insert sample subjects for ECE
INSERT INTO public.subjects (name, code, department_id, semester)
SELECT 
  subj.name,
  subj.code,
  d.id,
  subj.semester
FROM (
  VALUES
    ('Circuit Theory', 'EC101', 1),
    ('Digital Electronics', 'EC201', 3),
    ('Signals and Systems', 'EC301', 5),
    ('Communication Systems', 'EC302', 5),
    ('Microprocessors', 'EC401', 7),
    ('VLSI Design', 'EC402', 7)
) AS subj(name, code, semester)
CROSS JOIN public.departments d
WHERE d.code = 'ECE'
ON CONFLICT (code) DO NOTHING;