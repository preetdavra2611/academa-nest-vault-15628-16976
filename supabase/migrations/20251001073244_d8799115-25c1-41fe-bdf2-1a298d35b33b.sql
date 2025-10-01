-- Delete old subjects that were present before user's custom subjects
-- Keep only the subjects with codes: EM101, EP101, FP101, CIVIL101, EG101, 
-- EM201, BEEE201, OOP201, FME201, WS201, BCPS201, IICT201,
-- DM301, DSA301, DE301, ITW301, DBMS301

DELETE FROM public.subjects WHERE code IN (
  'CS101', 'EC101', 'IT101',  -- Semester 1 old subjects
  'CS102',  -- Semester 2 old subjects  
  'CS201', 'CS202', 'EC201', 'IT201',  -- Semester 3 old subjects
  'CS301', 'CS302', 'CS303', 'EC301', 'EC302', 'IT301', 'IT302',  -- Semester 5 old subjects
  'CS401', 'CS402', 'EC401', 'EC402', 'IT401', 'IT402',  -- Semester 7 old subjects
  'CS501'  -- Semester 8 old subjects
);