const express = require('express');
const app = express()
const router = express.Router();
const countAllStudents = require('./countstudent');
const countAllTeachers = require("./countteacher");
const countAllClasses = require('./countclasses');
const dbConnect_students = require('./dbConnect(students)');
const dbConnect_teachers = require('./dbConnect(teachers)')
const dbConnect_SchoolClasses = require('./dbConnect(class)')
const { ObjectId } = require('mongodb'); 



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get("/managestudents", async (req, res) => {
    try {
        const collection = await dbConnect_students();
        const students = await collection.find({}, { projection: { Name: 1, Cls: 1, subject: 1, roll: 1, contact: 1, fees: 1, _id: 1 } }).toArray();
        const studentsData = students.map(student => ({
            _id: student._id, 
            name: student.Name,
            cls: student.Cls,
            subject: student.subject,
            roll: student.roll,
            contact: student.contact,
            fees: student.fees
        })).filter(student => student.name !== undefined && student.cls !== undefined && student.subject !== undefined && student.roll !== undefined && student.contact !== undefined && student.fees !== undefined);
        console.log(studentsData);
        studentsData.forEach(name => console.log(name));
        res.render('managestudents', { studentsData });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/manageteachers", async (req, res) => {
    try {
        const collection = await dbConnect_teachers();
        const teachers = await collection.find({}, {projection: {name: 1, cnic: 1,address: 1, contact: 1, salary: 1, _id: 1}}).toArray();
        const teachersData = teachers.map(teacher => ({
            name: teacher.name,
            cnic: teacher.cnic,
            contact: teacher.contact,
            address: teacher.address,
            salary: teacher.salary,
            _id: teacher._id
        })).filter(teacher => teacher.name !== undefined && teacher.cnic !== undefined && teacher.contact !== undefined && teacher.address !== undefined && teacher.salary !== undefined && teacher._id !== undefined)
        teachersData.forEach(name => console.log(name))
        res.render('manageteachers', {teachersData})
    } 
    catch (error) {
        console.error('Error fetching teachers:', error);
    }
});

router.get("/manageclasses", async (req, res) => {
    try {
        const collection = await dbConnect_SchoolClasses();
        const classes = await collection.find({}, { projection: { classnumber: 1, classhead: 1, section: 1, _id: 1}}).toArray();
        const classesData = classes.map(cls => ({
            classnumber: cls.classnumber,
            classhead: cls.classhead,
            section: cls.section,
            _id: cls._id
        })).filter(cls => cls.classnumber !== undefined && cls.classhead !== undefined && cls.section !== undefined && cls._id !== undefined);
        classesData.forEach(num => console.log(num))
        res.render("manageclasses", {classesData});
    } 
    catch (error) {
        console.error("Encounter error ", error)
    }
});
router.post('/delete-student', async (req, res) => {
    try {
        const studentId = req.body.studentId;
        const collection = await dbConnect_students();
        const result = await collection.deleteOne({ _id: new ObjectId(studentId) }); 
        if (result.deletedCount === 1) {
            res.redirect('/managestudents');
        } else {
            res.status(404).send('Student not found');
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.post("/delete-teacher", async (req,res) => {
    try {
        const teacherId = req.body.teacherId;
        const collection = await dbConnect_teachers();
        const result = await collection.deleteOne({ _id: new ObjectId(teacherId) });
        if (result.deletedCount === 1) {
            res.redirect('/manageteachers');
        }
        else{
            res.status(404).send('Teacher not found');
        }
    } 
    catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).send('internal server error')
    }
})
router.post("/delete-classes", async (req,res) => {
    try {
        const classId = req.body.classId;
        const collection = await dbConnect_SchoolClasses();
        const result = await collection.deleteOne({ _id: new ObjectId(classId) });
        if(result.deletedCount === 1){
            res.redirect('/manageclasses');
        }
        else{
            res.status(404).send('Class not found');
        }
    } 
    catch (error) {
        console.error(error)
    }
})

router.get('/', (req, res) => {
    res.render('index', { al_message: null });
});

router.get('/dashboard', async (req, res) => {
    try {
        const Stud = await countAllStudents();
        const Teach = await countAllTeachers();
        const SchoolClasses = await countAllClasses();
        res.render("dashboard", { Stud, Teach, SchoolClasses });
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        res.status(500).send("Internal Server Error");
    }
});



router.get("/add-stud", (req, res) => {
    res.render("add-std");
});
router.post('/addstudent', async (req,res) => {
    const {name, roll, cls, subject, contact, fees} = req.body;

    try {
        const collection = await dbConnect_students();
        await collection.insertOne({
            Name: name,
            Cls: cls,
            roll: roll,
            subject: subject,
            contact: contact,
            fees: fees
        })
        res.redirect("/managestudents");
    } 
    catch (error) {
        console.log("error while inserting data to database", error)
    }
    
})
router.get("/addteacher", (req,res)=>{
    res.render('addteacher')
})
router.get("/add-class", (req,res) => {
    res.render("add-class");
})
router.post("/addclass", async (req,res) =>{
    const {Clshead, clsnum, Section} = req.body;
    try {
        const collection = await dbConnect_SchoolClasses();
        collection.insertOne({
            classnumber: clsnum,
            classhead: Clshead,
            section: Section
        })
        res.redirect("/manageclasses")
    } 
    catch (error) {
        console.error(error)
    }
})
router.post('/addteachers', async (req,res) => {
    const {name, cnic, address, contact, salary} = req.body;

    try {
        const collection = await dbConnect_teachers();
        await collection.insertOne({
            name: name,
            cnic: cnic,
            address: address,
            contact: contact,
            salary: salary
        })
        res.redirect("/manageteachers");
    } 
    catch (error) {
        console.log("error while inserting data to database", error)
    }
})


router.get('*', (req, res) => {
    res.status(404).sendFile(__dirname + '/404_page.html');
});

module.exports = router;
