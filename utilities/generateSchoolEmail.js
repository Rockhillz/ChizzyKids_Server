const generateSchoolEmail = (fullname) => {
    const schoolDomain = 'ckms.edu'; // Replace with your actual school domain
    const username = fullname.toLowerCase().replace(/\s+/g, '') //+ enrollmentNumber.slice(-4); // e.g., 'johndoe1234'
    return `${username}@${schoolDomain}`;
 };

module.exports = generateSchoolEmail;