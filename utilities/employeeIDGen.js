const employeeIdGen = (year) => {
    const prefix = "CKMS";
    const holder = "TE"
    const randomNum = Math.floor(1000000000 + Math.random() * 9000000000);
    return `${prefix}-${holder}-${randomNum}`;
 };
 
 module.exports = employeeIdGen;