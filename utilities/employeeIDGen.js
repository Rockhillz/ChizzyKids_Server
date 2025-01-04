const employeeIdGen = (year) => {
    const prefix = "CKGS";
    const holder = "TE"
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${holder}-${randomNum}`;
 };
 
 module.exports = employeeIdGen;