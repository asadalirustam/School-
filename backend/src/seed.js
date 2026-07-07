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
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Seed Roles
    const principalExists = await User.findOne({ role: 'Principal' });
    if (!principalExists) {
      await User.create({
        name: 'Principal Administrator',
        email: 'principal@school.com',
        password: 'principalpassword',
        role: 'Principal',
        status: 'Active'
      });
      console.log('Principal seeded: principal@school.com / principalpassword');
    }

    const examInchargeExists = await User.findOne({ role: 'Examination Incharge' });
    if (!examInchargeExists) {
      await User.create({
        name: 'Exam Incharge Office',
        email: 'exam@school.com',
        password: 'exampassword',
        role: 'Examination Incharge',
        status: 'Active'
      });
      console.log('Examination Incharge seeded: exam@school.com / exampassword');
    }

    const accountantExists = await User.findOne({ role: 'Accountant' });
    if (!accountantExists) {
      await User.create({
        name: 'Accountant Department',
        email: 'accountant@school.com',
        password: 'accountantpassword',
        role: 'Accountant',
        status: 'Active'
      });
      console.log('Accountant seeded: accountant@school.com / accountantpassword');
    }

    // 2. Seed Academic Session
    let activeSession = await AcademicSession.findOne({ isActive: true });
    if (!activeSession) {
      activeSession = await AcademicSession.create({
        name: '2026-2027',
        isActive: true
      });
      console.log('Academic Session seeded: 2026-2027 (Active)');
    }

    // 3. Seed some default Subjects
    const mathExists = await Subject.findOne({ code: 'MATH-101' });
    let mathSub, scienceSub, englishSub;

    if (!mathExists) {
      mathSub = await Subject.create({ name: 'Mathematics', code: 'MATH-101', creditHours: 4 });
      scienceSub = await Subject.create({ name: 'General Science', code: 'SCI-101', creditHours: 3 });
      englishSub = await Subject.create({ name: 'English Literature', code: 'ENG-101', creditHours: 3 });
      console.log('Subjects seeded: Mathematics, General Science, English');
    } else {
      mathSub = await Subject.findOne({ code: 'MATH-101' });
      scienceSub = await Subject.findOne({ code: 'SCI-101' });
      englishSub = await Subject.findOne({ code: 'ENG-101' });
    }

    // 4. Seed default Classes
    const classExists = await Class.findOne({ name: 'Grade 10' });
    if (!classExists) {
      await Class.create({
        name: 'Grade 10',
        sections: ['A', 'B'],
        subjects: [mathSub._id, scienceSub._id, englishSub._id]
      });
      await Class.create({
        name: 'Grade 9',
        sections: ['A'],
        subjects: [mathSub._id, scienceSub._id, englishSub._id]
      });
      console.log('Classes seeded: Grade 10, Grade 9');
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
