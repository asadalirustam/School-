const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const AcademicSession = require('./models/AcademicSession');
const Subject = require('./models/Subject');
const Class = require('./models/Class');

// Load environment variables
dotenv.config();

const seedDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log('No MONGO_URI provided in .env, skipping backend seed DB connection.');
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for comprehensive seeding...');

    // 1. Seed Accounts for ALL 6 ROLES
    const rolesToSeed = [
      { name: 'Dr. Eleanor Vance', email: 'principal@school.com', password: 'principalpassword', role: 'Principal' },
      { name: 'Prof. Marcus Brody', email: 'exam@school.com', password: 'exampassword', role: 'Examination Incharge' },
      { name: 'Sarah Jenkins', email: 'accountant@school.com', password: 'accountantpassword', role: 'Accountant' },
      { name: 'Prof. Alan Grant', email: 'teacher@school.com', password: 'teacherpassword', role: 'Teacher' },
      { name: 'Alice Smith', email: 'student@school.com', password: 'studentpassword', role: 'Student' },
      { name: 'Robert Smith', email: 'parent@school.com', password: 'parentpassword', role: 'Parent' }
    ];

    for (const r of rolesToSeed) {
      const exists = await User.findOne({ email: r.email });
      if (!exists) {
        await User.create({
          name: r.name,
          email: r.email,
          password: r.password,
          role: r.role,
          status: 'Active'
        });
        console.log(`Seeded user role ${r.role}: ${r.email}`);
      }
    }

    // 2. Seed Academic Session
    let activeSession = await AcademicSession.findOne({ isActive: true });
    if (!activeSession) {
      activeSession = await AcademicSession.create({
        name: '2026-2027',
        isActive: true,
        startDate: new Date('2026-04-01'),
        endDate: new Date('2027-03-31')
      });
      console.log('Academic Session seeded: 2026-2027 (Active)');
    }

    // 3. Seed Subjects
    const subjectsData = [
      { name: 'Mathematics', code: 'MATH-101', creditHours: 4 },
      { name: 'General Science', code: 'SCI-101', creditHours: 3 },
      { name: 'English Literature', code: 'ENG-101', creditHours: 3 },
      { name: 'Physics Laboratory', code: 'PHY-201', creditHours: 4 },
      { name: 'Chemistry', code: 'CHEM-201', creditHours: 4 },
      { name: 'Computer Science', code: 'CS-301', creditHours: 4 },
      { name: 'World History', code: 'HIS-102', creditHours: 3 }
    ];

    const createdSubjects = [];
    for (const sub of subjectsData) {
      let foundSub = await Subject.findOne({ code: sub.code });
      if (!foundSub) {
        foundSub = await Subject.create(sub);
        console.log(`Subject seeded: ${sub.name}`);
      }
      createdSubjects.push(foundSub._id);
    }

    // 4. Seed Classes
    const classesData = [
      { name: 'Grade 10', sections: ['A', 'B', 'C'], subjects: createdSubjects.slice(0, 4) },
      { name: 'Grade 9', sections: ['A', 'B'], subjects: createdSubjects.slice(0, 3) },
      { name: 'Grade 11', sections: ['A', 'Science'], subjects: createdSubjects.slice(3, 7) },
      { name: 'Grade 12', sections: ['A', 'B'], subjects: createdSubjects.slice(0, 6) }
    ];

    for (const cls of classesData) {
      const classExists = await Class.findOne({ name: cls.name });
      if (!classExists) {
        await Class.create(cls);
        console.log(`Class seeded: ${cls.name}`);
      }
    }

    console.log('Backend database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding notice / warning:', error.message);
    process.exit(0);
  }
};

seedDB();
