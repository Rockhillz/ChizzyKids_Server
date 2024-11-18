const generateStudentID = (year) => {
    const prefix = "CKMS";
    const category = "ST"
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${category}-${year}-${randomNum}`;
 };
 
 module.exports = generateStudentID; 