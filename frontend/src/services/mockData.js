// Central Comprehensive Mock Data Store for School & College Management System

export const MOCK_USERS = {
  'principal@school.com': {
    id: 'demo-id-principal',
    name: 'Dr. Eleanor Vance',
    email: 'principal@school.com',
    role: 'Principal',
    title: 'School Principal & Chief Administrator',
    department: 'Administration',
    phone: '+1 (555) 019-2831',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    joinedDate: '2018-08-15',
    status: 'Active'
  },
  'exam@school.com': {
    id: 'demo-id-exam',
    name: 'Prof. Marcus Brody',
    email: 'exam@school.com',
    role: 'Examination Incharge',
    title: 'Head of Examination & Academic Assessment',
    department: 'Examination Office',
    phone: '+1 (555) 019-8842',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
    joinedDate: '2019-09-01',
    status: 'Active'
  },
  'accountant@school.com': {
    id: 'demo-id-accountant',
    name: 'Sarah Jenkins',
    email: 'accountant@school.com',
    role: 'Accountant',
    title: 'Chief Financial Officer & Senior Accountant',
    department: 'Finance & Accounts',
    phone: '+1 (555) 019-3321',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    joinedDate: '2020-01-10',
    status: 'Active'
  },
  'teacher@school.com': {
    id: 'demo-id-teacher',
    name: 'Prof. Alan Grant',
    email: 'teacher@school.com',
    role: 'Teacher',
    title: 'Senior Physics & Science Instructor',
    department: 'Science & Technology',
    phone: '+1 (555) 019-4490',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    joinedDate: '2021-03-12',
    status: 'Active'
  },
  'student@school.com': {
    id: 'demo-id-student',
    name: 'Alice Smith',
    email: 'student@school.com',
    role: 'Student',
    title: 'Grade 10 - Section A (Roll No: 23)',
    department: 'High School',
    phone: '+1 (555) 019-7711',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    joinedDate: '2023-08-20',
    status: 'Active',
    admissionNo: 'ADM-1001',
    class: 'Grade 10',
    section: 'A',
    rollNo: '23'
  },
  'parent@school.com': {
    id: 'demo-id-parent',
    name: 'Robert Smith',
    email: 'parent@school.com',
    role: 'Parent',
    title: 'Parent / Guardian of Alice Smith',
    department: 'Guardian Portal',
    phone: '+1 (555) 019-5566',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    joinedDate: '2023-08-20',
    status: 'Active',
    children: [
      { id: 'mock1', name: 'Alice Smith', class: 'Grade 10-A', rollNo: '23', admissionNo: 'ADM-1001' },
      { id: 'mock4', name: 'Liam Smith', class: 'Grade 9-A', rollNo: '12', admissionNo: 'ADM-1004' }
    ]
  }
};

export const MOCK_SESSIONS = [
  { _id: 'sess-1', name: '2026-2027', startDate: '2026-04-01', endDate: '2027-03-31', isActive: true, description: 'Current Active Academic Year' },
  { _id: 'sess-2', name: '2025-2026', startDate: '2025-04-01', endDate: '2026-03-31', isActive: false, description: 'Previous Academic Session' },
  { _id: 'sess-3', name: '2024-2025', startDate: '2024-04-01', endDate: '2025-03-31', isActive: false, description: 'Archived Academic Session' }
];

export const MOCK_SUBJECTS = [
  { _id: 'sub-1', name: 'Mathematics', code: 'MATH-101', creditHours: 4, type: 'Core', classCount: 4, description: 'Algebra, Geometry, and Trigonometry fundamentals' },
  { _id: 'sub-2', name: 'General Science', code: 'SCI-101', creditHours: 3, type: 'Core', classCount: 3, description: 'Basic Principles of Physics, Chemistry & Biology' },
  { _id: 'sub-3', name: 'English Literature', code: 'ENG-101', creditHours: 3, type: 'Core', classCount: 4, description: 'Grammar, Reading Comprehension & Classic Literature' },
  { _id: 'sub-4', name: 'Physics Laboratory', code: 'PHY-201', creditHours: 4, type: 'Practical', classCount: 2, description: 'Kinematics, Thermodynamics & Practical Experiments' },
  { _id: 'sub-5', name: 'Chemistry', code: 'CHEM-201', creditHours: 4, type: 'Core', classCount: 2, description: 'Organic & Inorganic Chemical Reactions' },
  { _id: 'sub-6', name: 'Computer Science', code: 'CS-301', creditHours: 4, type: 'Elective', classCount: 3, description: 'Programming logic, Web Development & Algorithms' },
  { _id: 'sub-7', name: 'World History', code: 'HIS-102', creditHours: 3, type: 'Core', classCount: 2, description: 'Ancient Empires to Modern Geopolitics' }
];

export const MOCK_CLASSES = [
  { _id: 'c1', name: 'Grade 10', sections: ['A', 'B', 'C'], roomNumber: 'Room 101', classTeacher: 'Prof. Alan Grant', totalStudents: 38, subjects: [MOCK_SUBJECTS[0], MOCK_SUBJECTS[1], MOCK_SUBJECTS[2], MOCK_SUBJECTS[3]] },
  { _id: 'c2', name: 'Grade 9', sections: ['A', 'B'], roomNumber: 'Room 102', classTeacher: 'Dr. Ellie Sattler', totalStudents: 34, subjects: [MOCK_SUBJECTS[0], MOCK_SUBJECTS[1], MOCK_SUBJECTS[2], MOCK_SUBJECTS[6]] },
  { _id: 'c3', name: 'Grade 11', sections: ['A', 'Science', 'Commerce'], roomNumber: 'Lab Block B', classTeacher: 'Mr. Ian Malcolm', totalStudents: 42, subjects: [MOCK_SUBJECTS[0], MOCK_SUBJECTS[3], MOCK_SUBJECTS[4], MOCK_SUBJECTS[5]] },
  { _id: 'c4', name: 'Grade 12', sections: ['A', 'B'], roomNumber: 'Senior Wing 204', classTeacher: 'Mrs. Clara Oswald', totalStudents: 40, subjects: [MOCK_SUBJECTS[0], MOCK_SUBJECTS[3], MOCK_SUBJECTS[4], MOCK_SUBJECTS[5]] }
];

export const MOCK_TEACHERS = [
  {
    _id: 't-1',
    employeeId: 'EMP-101',
    firstName: 'Alan',
    lastName: 'Grant',
    name: 'Prof. Alan Grant',
    email: 'teacher@school.com',
    phone: '+1 (555) 019-4490',
    qualification: 'M.Sc. Physics & Applied Mathematics',
    specialization: 'Physics & Advanced Mathematics',
    assignedClasses: ['Grade 10', 'Grade 11'],
    salary: 4500,
    status: 'Active',
    joinDate: '2021-03-12',
    address: '42 Academic Way, Cambridge, MA'
  },
  {
    _id: 't-2',
    employeeId: 'EMP-102',
    firstName: 'Ellie',
    lastName: 'Sattler',
    name: 'Dr. Ellie Sattler',
    email: 'ellie.sattler@school.com',
    phone: '+1 (555) 019-4491',
    qualification: 'Ph.D. Biological Sciences',
    specialization: 'Biology & Environmental Science',
    assignedClasses: ['Grade 9', 'Grade 10'],
    salary: 4800,
    status: 'Active',
    joinDate: '2020-05-18',
    address: '18 Bio Park Avenue, Boston, MA'
  },
  {
    _id: 't-3',
    employeeId: 'EMP-103',
    firstName: 'Ian',
    lastName: 'Malcolm',
    name: 'Mr. Ian Malcolm',
    email: 'ian.malcolm@school.com',
    phone: '+1 (555) 019-4492',
    qualification: 'M.Sc. Statistics & Chaos Theory',
    specialization: 'Higher Mathematics & Statistics',
    assignedClasses: ['Grade 11', 'Grade 12'],
    salary: 4600,
    status: 'Active',
    joinDate: '2019-11-04',
    address: '77 Quantum St, Newton, MA'
  },
  {
    _id: 't-4',
    employeeId: 'EMP-104',
    firstName: 'Clara',
    lastName: 'Oswald',
    name: 'Mrs. Clara Oswald',
    email: 'clara.oswald@school.com',
    phone: '+1 (555) 019-4493',
    qualification: 'M.A. English Literature & Creative Writing',
    specialization: 'English Literature',
    assignedClasses: ['Grade 9', 'Grade 12'],
    salary: 4200,
    status: 'Active',
    joinDate: '2022-01-15',
    address: '104 Beacon St, Boston, MA'
  },
  {
    _id: 't-5',
    employeeId: 'EMP-105',
    firstName: 'Henry',
    lastName: 'Wu',
    name: 'Dr. Henry Wu',
    email: 'henry.wu@school.com',
    phone: '+1 (555) 019-4494',
    qualification: 'Ph.D. Organic Chemistry',
    specialization: 'Advanced Chemistry',
    assignedClasses: ['Grade 11', 'Grade 12'],
    salary: 5000,
    status: 'Active',
    joinDate: '2018-09-01',
    address: '55 Laboratory Lane, Cambridge, MA'
  }
];

export const MOCK_STUDENTS = [
  {
    _id: 'mock1',
    admissionNo: 'ADM-1001',
    rollNo: '23',
    firstName: 'Alice',
    lastName: 'Smith',
    dob: '2012-05-15',
    gender: 'Female',
    class: { _id: 'c1', name: 'Grade 10' },
    section: 'A',
    parentName: 'Robert Smith',
    parentPhone: '+1 (555) 019-5566',
    parentEmail: 'parent@school.com',
    status: 'Active',
    address: '123 Maple Street, Cityville',
    attendance: '96.5%',
    gpa: '3.92',
    feeStatus: 'Paid'
  },
  {
    _id: 'mock2',
    admissionNo: 'ADM-1002',
    rollNo: '14',
    firstName: 'James',
    lastName: 'Doe',
    dob: '2012-09-21',
    gender: 'Male',
    class: { _id: 'c1', name: 'Grade 10' },
    section: 'A',
    parentName: 'John Doe',
    parentPhone: '+1 (555) 019-2211',
    parentEmail: 'john.doe@email.com',
    status: 'Active',
    address: '456 Oak Avenue, Metroville',
    attendance: '94.0%',
    gpa: '3.75',
    feeStatus: 'Partial'
  },
  {
    _id: 'mock3',
    admissionNo: 'ADM-1003',
    rollNo: '08',
    firstName: 'Sophia',
    lastName: 'Chen',
    dob: '2012-01-11',
    gender: 'Female',
    class: { _id: 'c1', name: 'Grade 10' },
    section: 'B',
    parentName: 'Mary Chen',
    parentPhone: '+1 (555) 019-3344',
    parentEmail: 'mary.chen@email.com',
    status: 'Active',
    address: '789 Pine Road, Cityville',
    attendance: '98.2%',
    gpa: '4.00',
    feeStatus: 'Paid'
  },
  {
    _id: 'mock4',
    admissionNo: 'ADM-1004',
    rollNo: '12',
    firstName: 'Liam',
    lastName: 'Wilson',
    dob: '2013-03-30',
    gender: 'Male',
    class: { _id: 'c2', name: 'Grade 9' },
    section: 'A',
    parentName: 'David Wilson',
    parentPhone: '+1 (555) 019-4455',
    parentEmail: 'david.wilson@email.com',
    status: 'Active',
    address: '101 Cedar Blvd, Metroville',
    attendance: '91.8%',
    gpa: '3.60',
    feeStatus: 'Pending'
  },
  {
    _id: 'mock5',
    admissionNo: 'ADM-1005',
    rollNo: '05',
    firstName: 'Emma',
    lastName: 'Watson',
    dob: '2013-07-19',
    gender: 'Female',
    class: { _id: 'c2', name: 'Grade 9' },
    section: 'B',
    parentName: 'Chris Watson',
    parentPhone: '+1 (555) 019-5566',
    parentEmail: 'chris.watson@email.com',
    status: 'Active',
    address: '202 Elm Lane, Springfield',
    attendance: '95.0%',
    gpa: '3.88',
    feeStatus: 'Paid'
  },
  {
    _id: 'mock6',
    admissionNo: 'ADM-1006',
    rollNo: '19',
    firstName: 'Noah',
    lastName: 'Miller',
    dob: '2011-11-03',
    gender: 'Male',
    class: { _id: 'c3', name: 'Grade 11' },
    section: 'Science',
    parentName: 'Laura Miller',
    parentPhone: '+1 (555) 019-6677',
    parentEmail: 'laura.miller@email.com',
    status: 'Active',
    address: '303 Birch Court, Cityville',
    attendance: '93.5%',
    gpa: '3.80',
    feeStatus: 'Paid'
  },
  {
    _id: 'mock7',
    admissionNo: 'ADM-1007',
    rollNo: '02',
    firstName: 'Olivia',
    lastName: 'Brown',
    dob: '2010-04-25',
    gender: 'Female',
    class: { _id: 'c4', name: 'Grade 12' },
    section: 'A',
    parentName: 'Thomas Brown',
    parentPhone: '+1 (555) 019-7788',
    parentEmail: 'thomas.brown@email.com',
    status: 'Active',
    address: '404 Walnut St, Metroville',
    attendance: '97.4%',
    gpa: '3.95',
    feeStatus: 'Paid'
  }
];

export const MOCK_TIMETABLE = [
  { day: 'Monday', period: '1st (08:30 - 09:15 AM)', subject: 'Mathematics', teacher: 'Prof. Alan Grant', room: 'Room 101', class: 'Grade 10-A' },
  { day: 'Monday', period: '2nd (09:15 - 10:00 AM)', subject: 'Physics Lab', teacher: 'Prof. Alan Grant', room: 'Science Lab 1', class: 'Grade 10-A' },
  { day: 'Monday', period: '3rd (10:15 - 11:00 AM)', subject: 'English Literature', teacher: 'Mrs. Clara Oswald', room: 'Room 101', class: 'Grade 10-A' },
  { day: 'Monday', period: '4th (11:00 - 11:45 AM)', subject: 'Computer Science', teacher: 'Mr. Ian Malcolm', room: 'Computer Lab 2', class: 'Grade 10-A' },
  { day: 'Tuesday', period: '1st (08:30 - 09:15 AM)', subject: 'General Science', teacher: 'Dr. Ellie Sattler', room: 'Bio Lab', class: 'Grade 10-A' },
  { day: 'Tuesday', period: '2nd (09:15 - 10:00 AM)', subject: 'Mathematics', teacher: 'Prof. Alan Grant', room: 'Room 101', class: 'Grade 10-A' },
  { day: 'Tuesday', period: '3rd (10:15 - 11:00 AM)', subject: 'World History', teacher: 'Prof. Marcus Brody', room: 'Room 101', class: 'Grade 10-A' },
  { day: 'Wednesday', period: '1st (08:30 - 09:15 AM)', subject: 'Chemistry', teacher: 'Dr. Henry Wu', room: 'Chem Lab 3', class: 'Grade 10-A' },
  { day: 'Wednesday', period: '2nd (09:15 - 10:00 AM)', subject: 'English Literature', teacher: 'Mrs. Clara Oswald', room: 'Room 101', class: 'Grade 10-A' },
  { day: 'Thursday', period: '1st (08:30 - 09:15 AM)', subject: 'Mathematics', teacher: 'Prof. Alan Grant', room: 'Room 101', class: 'Grade 10-A' },
  { day: 'Thursday', period: '2nd (09:15 - 10:00 AM)', subject: 'Physics Lab', teacher: 'Prof. Alan Grant', room: 'Science Lab 1', class: 'Grade 10-A' },
  { day: 'Friday', period: '1st (08:30 - 09:15 AM)', subject: 'Computer Science', teacher: 'Mr. Ian Malcolm', room: 'Computer Lab 2', class: 'Grade 10-A' },
  { day: 'Friday', period: '2nd (09:15 - 10:00 AM)', subject: 'Physical Education / Sports', teacher: 'Coach Roberts', room: 'Sports Complex', class: 'Grade 10-A' }
];

export const MOCK_ATTENDANCE = [
  { _id: 'att-1', studentName: 'Alice Smith', admissionNo: 'ADM-1001', rollNo: '23', class: 'Grade 10-A', date: '2026-07-28', status: 'Present', remark: 'On time' },
  { _id: 'att-2', studentName: 'James Doe', admissionNo: 'ADM-1002', rollNo: '14', class: 'Grade 10-A', date: '2026-07-28', status: 'Present', remark: 'On time' },
  { _id: 'att-3', studentName: 'Sophia Chen', admissionNo: 'ADM-1003', rollNo: '08', class: 'Grade 10-B', date: '2026-07-28', status: 'Present', remark: 'On time' },
  { _id: 'att-4', studentName: 'Liam Wilson', admissionNo: 'ADM-1004', rollNo: '12', class: 'Grade 9-A', date: '2026-07-28', status: 'Late', remark: '15 mins traffic delay' },
  { _id: 'att-5', studentName: 'Emma Watson', admissionNo: 'ADM-1005', rollNo: '05', class: 'Grade 9-B', date: '2026-07-28', status: 'Leave', remark: 'Approved medical leave' },
  { _id: 'att-6', studentName: 'Noah Miller', admissionNo: 'ADM-1006', rollNo: '19', class: 'Grade 11-Science', date: '2026-07-28', status: 'Present', remark: 'On time' },
  { _id: 'att-7', studentName: 'Olivia Brown', admissionNo: 'ADM-1007', rollNo: '02', class: 'Grade 12-A', date: '2026-07-28', status: 'Present', remark: 'On time' }
];

export const MOCK_EXAMS = [
  { _id: 'exam-1', name: 'First Term Final Examination 2026', type: 'Final', session: '2026-2027', startDate: '2026-08-10', endDate: '2026-08-25', status: 'Scheduled', published: true, description: 'Comprehensive term evaluation across all subjects' },
  { _id: 'exam-2', name: 'Mid-Term Progress Assessment 2026', type: 'Midterm', session: '2026-2027', startDate: '2026-06-01', endDate: '2026-06-12', status: 'Completed', published: true, description: 'Mid-session academic progress evaluation' },
  { _id: 'exam-3', name: 'Monthly Physics & Science Quiz', type: 'Quiz', session: '2026-2027', startDate: '2026-07-15', endDate: '2026-07-15', status: 'Completed', published: true, description: 'Unit test evaluation' }
];

export const MOCK_DATESHEETS = [
  { _id: 'ds-1', examName: 'First Term Final Examination 2026', class: 'Grade 10', subject: 'Mathematics', code: 'MATH-101', date: '2026-08-10', time: '09:00 AM - 12:00 PM', hall: 'Main Auditorium Hall A', supervisor: 'Prof. Alan Grant' },
  { _id: 'ds-2', examName: 'First Term Final Examination 2026', class: 'Grade 10', subject: 'General Science', code: 'SCI-101', date: '2026-08-12', time: '09:00 AM - 12:00 PM', hall: 'Science Building Block 2', supervisor: 'Dr. Ellie Sattler' },
  { _id: 'ds-3', examName: 'First Term Final Examination 2026', class: 'Grade 10', subject: 'English Literature', code: 'ENG-101', date: '2026-08-14', time: '09:00 AM - 12:00 PM', hall: 'Main Auditorium Hall B', supervisor: 'Mrs. Clara Oswald' },
  { _id: 'ds-4', examName: 'First Term Final Examination 2026', class: 'Grade 10', subject: 'Physics Laboratory', code: 'PHY-201', date: '2026-08-17', time: '09:00 AM - 11:30 AM', hall: 'Physics Lab 1', supervisor: 'Prof. Alan Grant' },
  { _id: 'ds-5', examName: 'First Term Final Examination 2026', class: 'Grade 10', subject: 'Computer Science', code: 'CS-301', date: '2026-08-19', time: '09:00 AM - 12:00 PM', hall: 'Computer Center 1', supervisor: 'Mr. Ian Malcolm' }
];

export const MOCK_MARKS = [
  { _id: 'm-1', studentName: 'Alice Smith', admissionNo: 'ADM-1001', rollNo: '23', class: 'Grade 10', section: 'A', subject: 'Mathematics', totalMarks: 100, obtainedMarks: 95, grade: 'A+', remarks: 'Outstanding performance & problem-solving skills' },
  { _id: 'm-2', studentName: 'Alice Smith', admissionNo: 'ADM-1001', rollNo: '23', class: 'Grade 10', section: 'A', subject: 'General Science', totalMarks: 100, obtainedMarks: 91, grade: 'A+', remarks: 'Excellent lab report and scientific analysis' },
  { _id: 'm-3', studentName: 'Alice Smith', admissionNo: 'ADM-1001', rollNo: '23', class: 'Grade 10', section: 'A', subject: 'English Literature', totalMarks: 100, obtainedMarks: 94, grade: 'A+', remarks: 'Great essay writing and literary breakdown' },
  { _id: 'm-4', studentName: 'James Doe', admissionNo: 'ADM-1002', rollNo: '14', class: 'Grade 10', section: 'A', subject: 'Mathematics', totalMarks: 100, obtainedMarks: 84, grade: 'A', remarks: 'Good accuracy in calculus' },
  { _id: 'm-5', studentName: 'James Doe', admissionNo: 'ADM-1002', rollNo: '14', class: 'Grade 10', section: 'A', subject: 'General Science', totalMarks: 100, obtainedMarks: 88, grade: 'A', remarks: 'Strong conceptual grasp' },
  { _id: 'm-6', studentName: 'Sophia Chen', admissionNo: 'ADM-1003', rollNo: '08', class: 'Grade 10', section: 'B', subject: 'Mathematics', totalMarks: 100, obtainedMarks: 99, grade: 'A+', remarks: 'Perfect score in final proofs' }
];

export const MOCK_RESULTS = [
  { _id: 'res-1', studentName: 'Alice Smith', admissionNo: 'ADM-1001', rollNo: '23', class: 'Grade 10-A', totalMarks: 500, obtainedMarks: 472, percentage: 94.4, gpa: 3.92, rank: 1, status: 'Passed (Distinction)', publishedDate: '2026-06-20' },
  { _id: 'res-2', studentName: 'Sophia Chen', admissionNo: 'ADM-1003', rollNo: '08', class: 'Grade 10-B', totalMarks: 500, obtainedMarks: 485, percentage: 97.0, gpa: 4.00, rank: 1, status: 'Passed (Distinction)', publishedDate: '2026-06-20' },
  { _id: 'res-3', studentName: 'James Doe', admissionNo: 'ADM-1002', rollNo: '14', class: 'Grade 10-A', totalMarks: 500, obtainedMarks: 430, percentage: 86.0, gpa: 3.75, rank: 2, status: 'Passed (First Division)', publishedDate: '2026-06-20' },
  { _id: 'res-4', studentName: 'Noah Miller', admissionNo: 'ADM-1006', rollNo: '19', class: 'Grade 11-Science', totalMarks: 500, obtainedMarks: 445, percentage: 89.0, gpa: 3.80, rank: 1, status: 'Passed (First Division)', publishedDate: '2026-06-20' }
];

export const MOCK_FEE_STRUCTURES = [
  { _id: 'fs-1', class: 'Grade 10', tuitionFee: 450, labFee: 80, libraryFee: 35, sportsFee: 50, examFee: 65, totalAmount: 680, frequency: 'Monthly' },
  { _id: 'fs-2', class: 'Grade 9', tuitionFee: 420, labFee: 70, libraryFee: 35, sportsFee: 50, examFee: 60, totalAmount: 635, frequency: 'Monthly' },
  { _id: 'fs-3', class: 'Grade 11', tuitionFee: 500, labFee: 100, libraryFee: 40, sportsFee: 50, examFee: 75, totalAmount: 765, frequency: 'Monthly' },
  { _id: 'fs-4', class: 'Grade 12', tuitionFee: 520, labFee: 110, libraryFee: 40, sportsFee: 50, examFee: 80, totalAmount: 800, frequency: 'Monthly' }
];

export const MOCK_FEE_COLLECTIONS = [
  { _id: 'fc-1', receiptNo: 'REC-2026-001', studentName: 'Alice Smith', admissionNo: 'ADM-1001', class: 'Grade 10-A', category: 'Tuition & Lab Fee', amountPaid: 680, paymentMethod: 'Card / Online', paidDate: '2026-07-05', status: 'Paid', receivedBy: 'Sarah Jenkins' },
  { _id: 'fc-2', receiptNo: 'REC-2026-002', studentName: 'Sophia Chen', admissionNo: 'ADM-1003', class: 'Grade 10-B', category: 'Tuition & Lab Fee', amountPaid: 680, paymentMethod: 'Bank Transfer', paidDate: '2026-07-06', status: 'Paid', receivedBy: 'Sarah Jenkins' },
  { _id: 'fc-3', receiptNo: 'REC-2026-003', studentName: 'James Doe', admissionNo: 'ADM-1002', class: 'Grade 10-A', category: 'Tuition Fee (Partial)', amountPaid: 450, paymentMethod: 'Cash', paidDate: '2026-07-10', status: 'Partial', receivedBy: 'Sarah Jenkins' },
  { _id: 'fc-4', receiptNo: 'REC-2026-004', studentName: 'Emma Watson', admissionNo: 'ADM-1005', class: 'Grade 9-B', category: 'Tuition & Lab Fee', amountPaid: 635, paymentMethod: 'Card', paidDate: '2026-07-12', status: 'Paid', receivedBy: 'Sarah Jenkins' },
  { _id: 'fc-5', receiptNo: 'REC-2026-005', studentName: 'Olivia Brown', admissionNo: 'ADM-1007', class: 'Grade 12-A', category: 'Tuition & Exam Fee', amountPaid: 800, paymentMethod: 'Online Transfer', paidDate: '2026-07-15', status: 'Paid', receivedBy: 'Sarah Jenkins' }
];

export const MOCK_EXPENSES = [
  { _id: 'exp-1', title: 'Advanced Science Physics & Bio Lab Equipment', category: 'Lab Equipment', amount: 2400, date: '2026-07-10', vendor: 'BioTech Scientific Supplies', approvedBy: 'Dr. Eleanor Vance', paymentStatus: 'Completed' },
  { _id: 'exp-2', title: 'Monthly Electricity & HVAC Utility Expenses', category: 'Utilities', amount: 1250, date: '2026-07-15', vendor: 'City Power & Light Co.', approvedBy: 'Sarah Jenkins', paymentStatus: 'Completed' },
  { _id: 'exp-3', title: 'Campus High-Speed Dedicated Internet Fiber', category: 'Technology', amount: 450, date: '2026-07-18', vendor: 'CyberFiber Telecom', approvedBy: 'Sarah Jenkins', paymentStatus: 'Completed' },
  { _id: 'exp-4', title: 'Library New Books & Journal Subscriptions', category: 'Library', amount: 850, date: '2026-07-20', vendor: 'Academic Press Publications', approvedBy: 'Dr. Eleanor Vance', paymentStatus: 'Completed' },
  { _id: 'exp-5', title: 'Annual Football & Basketball League Equipment', category: 'Sports', amount: 600, date: '2026-07-22', vendor: 'Champion Sports Gear', approvedBy: 'Sarah Jenkins', paymentStatus: 'Completed' }
];

export const MOCK_SALARIES = [
  { _id: 'sal-1', employeeName: 'Prof. Alan Grant', employeeId: 'EMP-101', role: 'Teacher', basicSalary: 4000, allowance: 500, deduction: 100, netSalary: 4400, monthYear: 'July 2026', status: 'Paid', paymentDate: '2026-07-25' },
  { _id: 'sal-2', employeeName: 'Dr. Ellie Sattler', employeeId: 'EMP-102', role: 'Teacher', basicSalary: 4300, allowance: 500, deduction: 100, netSalary: 4700, monthYear: 'July 2026', status: 'Paid', paymentDate: '2026-07-25' },
  { _id: 'sal-3', employeeName: 'Mr. Ian Malcolm', employeeId: 'EMP-103', role: 'Teacher', basicSalary: 4100, allowance: 500, deduction: 100, netSalary: 4500, monthYear: 'July 2026', status: 'Paid', paymentDate: '2026-07-25' },
  { _id: 'sal-4', employeeName: 'Mrs. Clara Oswald', employeeId: 'EMP-104', role: 'Teacher', basicSalary: 3800, allowance: 400, deduction: 100, netSalary: 4100, monthYear: 'July 2026', status: 'Processing', paymentDate: 'Pending' },
  { _id: 'sal-5', employeeName: 'Dr. Henry Wu', employeeId: 'EMP-105', role: 'Teacher', basicSalary: 4500, allowance: 500, deduction: 100, netSalary: 4900, monthYear: 'July 2026', status: 'Paid', paymentDate: '2026-07-25' }
];

export const MOCK_NOTICES = [
  { _id: 'not-1', title: 'First Term Final Examination Date Sheet Published', content: 'The comprehensive examination schedule for Grade 9 through Grade 12 has been finalized and published. All students are advised to check their respective date sheets.', targetGroup: 'All', priority: 'High', date: '2026-07-26', author: 'Prof. Marcus Brody' },
  { _id: 'not-2', title: 'Parent-Teacher Conference Scheduled for Next Friday', content: 'We invite all parents to attend the term review meeting on Friday at 02:00 PM in the Main Auditorium to discuss student academic progress and attendance.', targetGroup: 'Parents', priority: 'High', date: '2026-07-24', author: 'Dr. Eleanor Vance' },
  { _id: 'not-3', title: 'Annual Inter-School Sports Meet 2026 Registration Open', content: 'Students interested in participating in football, basketball, athletics, or chess can submit their names to the sports coordinator before August 5th.', targetGroup: 'Students', priority: 'Medium', date: '2026-07-20', author: 'Sports Department' },
  { _id: 'not-4', title: 'Faculty Academic Curriculum Review Meeting', content: 'All teaching faculty members are requested to submit mid-term syllabus progress reports by Wednesday afternoon.', targetGroup: 'Teachers', priority: 'Medium', date: '2026-07-18', author: 'Dr. Eleanor Vance' }
];
