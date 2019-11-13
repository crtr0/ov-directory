const csv = require('csv-parser')
const fs = require('fs')
const template = require('../data/template.json')
const results = []

const getGradeIndex = (selection) => {
    return selection.split(' - ')[0].trim()
}

const getTeacher = (selection) => {
    return selection.split(' - ')[1].trim()
}

const buildKid = (row, index) => {
    let kid = {}
    kid.fname = row[`kid_${index}_fname`].trim()
    kid.lname = row[`kid_${index}_lname`].trim()
    kid.parent1 = {}
    kid.parent1.lname = row[`parent_1_lname`].trim()
    kid.parent1.fname = row[`parent_1_fname`].trim()
    kid.parent1.email = row[`parent_1_email`].trim()
    kid.parent1.phone = row[`parent_1_phone`].trim()
    if (row[`parent_2_lname`].trim() !== '') {
        kid.parent2 = {}
        kid.parent2.lname = row[`parent_2_lname`].trim()
        kid.parent2.fname = row[`parent_2_fname`].trim()
        kid.parent2.email = row[`parent_2_email`].trim()
        kid.parent2.phone = row[`parent_2_phone`].trim()
    }
    return kid
}

const addKidToDirectory = (directory, row, index) => {
    let kid = buildKid(row, index)
    let selection = row[`kid_${index}_teacher`]
    if (selection && selection !== '') {
        let gradeIndex = getGradeIndex(row[`kid_${index}_teacher`])
        let name = getTeacher(row[`kid_${index}_teacher`])
        let teacher = directory.grades[gradeIndex].teachers.find((t) => {return t.lname === name})
        if (teacher) {
            if (!teacher.kids) {
                teacher.kids = []
            }
            // if kid is already in array, delete the older one
            let exists = teacher.kids.find((k) => {return k.lname === kid.lname && k.fname === kid.fname})
            if (exists) {
                console.log(`Duplicate kid found: ${exists.fname} ${exists.lname}`)
                teacher.kids =  teacher.kids.filter((k) => {return !(k.lname === kid.lname && k.fname === kid.fname)})
            }
            teacher.kids.push(kid)
        }
        else {
            console.log(`Could not find teacher "${row[`kid_${index}_teacher`]}" in template`)
        }
    }
}

const addRowToDirectory = (directory, row) => {
    if (row.kid_1_fname) {
        addKidToDirectory(directory, row, 1)
    }
    if (row.kid_2_fname) {
        addKidToDirectory(directory, row, 2)
    }
    if (row.kid_3_fname) {
        addKidToDirectory(directory, row, 3)
    }
    if (row.kid_4_fname) {
        addKidToDirectory(directory, row, 4)
    }
    if (row.kid_5_fname) {
        addKidToDirectory(directory, row, 5)
    }
}


const normalize = (rows) => {
    for (let i in rows) {
        let row = rows[i]
        addRowToDirectory(template, row)
    }
    console.log(`${rows.length} rows processed`);

    fs.writeFileSync(__dirname + '/../data/directory.json', JSON.stringify(template));
}

fs.createReadStream(process.argv[2])
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    normalize(results)
  })