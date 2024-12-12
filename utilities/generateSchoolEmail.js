// // const generateSchoolEmail = (fullname) => {
// //     const schoolDomain = 'ckms.edu'; // Replace with your actual school domain
// //     const username = fullname.toLowerCase().replace(/\s+/g, '') //+ enrollmentNumber.slice(-4); // e.g., 'johndoe1234'
// //     return `${username}@${schoolDomain}`;
// //  };

// // module.exports = generateSchoolEmail;
// const Student = require('../models/Student');

// const updateGenderField = async () => {
//     try {
//         // Update documents with old gender values to new values
//         await Student.updateMany(
//             { gender: 'male' }, // Match old value
//             { $set: { gender: 'Male' } } // Update to new value
//         );

//         await Student.updateMany(
//             { gender: 'female' }, // Match old value
//             { $set: { gender: 'Female' } } // Update to new value
//         );

//         console.log('Gender field updated successfully');
//     } catch (error) {
//         console.error('Error updating gender field:', error);
//     }
// };


// module.exports = updateGenderField;
