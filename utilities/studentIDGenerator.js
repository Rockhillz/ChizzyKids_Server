const generateStudentID = (year) => {
    const prefix = "CKMS";
    const category = "ST"
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${category}-${year}-${randomNum}`;
 };
 
 module.exports = generateStudentID; 