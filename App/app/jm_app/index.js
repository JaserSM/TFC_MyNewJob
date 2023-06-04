const Tabulator = require('tabulator-tables')
const shell = require('electron').shell
const { Sequelize, DataTypes, Model, QueryTypes } = require('sequelize')
const { ipcRenderer } = require('electron')
const ipc = ipcRenderer
const { BrowserWindow } = require('@electron/remote')
const fs = require('fs')
const util = require('util')
//const run_script = require('./main.js')

async function connect (sequelizee) {
  try {
    await sequelizee.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

class Job extends Model { }
class JobTech extends Model { }
class Tech extends Model { }
class Interview extends Model { }
class Company extends Model { }
class Web extends Model { }

const PATH_DB = './resources/app/scraping_1/configs/ConfigDB.txt'
let USER
let PASS
// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);

function getStuff() {
  return readFile(PATH_DB);
}
let sequelize
getStuff().then(data => {
  console.log(data.toString());
  console.log((data.toString().replace('\r','')).toString().split('\n'));
  USER = (data.toString().replace('\r','')).toString().split('\n')[0]
  PASS = (data.toString().replace('\r','')).toString().split('\n')[1]
  sequelize = new Sequelize('postgres://' + USER + ':' + PASS + '@localhost:5432/job_offers')
  connect(sequelize)
  // *** OBJECT MODELS ***
  // - JOBS -
  Job.init({
    // Model attributes are defined here
    web: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false
    },
    company: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false
    },
    offer_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    scraping_date: {
      type: DataTypes.DATE
    },
    salary: {
      type: DataTypes.STRING
    },
    location: {
      type: DataTypes.STRING
    },
    experience: {
      type: DataTypes.INTEGER
    },
    contract: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    like_dislike: {
      type: DataTypes.INTEGER
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Job', // We need to choose the model name
    tableName: 'job_offer', 
    timestamps: true, // don't forget to enable timestamps!
    createdAt: false, // I don't want createdAt
    updatedAt: false // I want updatedAt to actually be called updateTimestamp
  })
  console.log(Job === sequelize.models.Job)
  const job1 = Job.build({ web: 2, link: 'job1.com', company: 'Gran empresa', position: 'developer invent', offer_date: '1299-01-18' })
  // console.log(item1.name)
  // job1.save()

  // - WEBS -
  Web.init({
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false
      // allowNull defaults to true
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Web', // We need to choose the model name
    tableName: 'web',
    // don't forget to enable timestamps!
    timestamps: true,

    // I don't want createdAt
    createdAt: false,

    // I want updatedAt to actually be called updateTimestamp
    updatedAt: false
  })

  // - COMPANYS -
  Company.init({
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false
      // allowNull defaults to true
    },
    web: {
      type: DataTypes.STRING
    },
    reputation: {
      type: DataTypes.DOUBLE // or decimal ????
    },
    n_employees: {
      type: DataTypes.INTEGER
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Company', // We need to choose the model name
    tableName: 'company',
    // don't forget to enable timestamps!
    timestamps: true,

    // I don't want createdAt
    createdAt: false,

    // I want updatedAt to actually be called updateTimestamp
    updatedAt: false
  })

  // - INTERVIEWS -
  Interview.init({
    // Model attributes are defined here
    offer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
      // allowNull defaults to true
    },
    date: {
      type: DataTypes.DATE
    },
    duration: {
      type: DataTypes.INTEGER
    },
    text_notes: {
      type: DataTypes.TEXT
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Interview', // We need to choose the model name
    tableName: 'interview',
    // don't forget to enable timestamps!
    timestamps: true,

    // I don't want createdAt
    createdAt: false,

    // I want updatedAt to actually be called updateTimestamp
    updatedAt: false
  })

  // - TECH - 

  Tech.init({
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING
    },
    level: {
      type: DataTypes.INTEGER
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Tech', // We need to choose the model name
    tableName: 'technology',
    // don't forget to enable timestamps!
    timestamps: true,

    // I don't want createdAt
    createdAt: false,

    // I want updatedAt to actually be called updateTimestamp
    updatedAt: false
  })

  // - JOB_TECH - 

  JobTech.init({
    // Model attributes are defined here
    offer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    tech_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'JobTech', // We need to choose the model name
    tableName: 'job_tech',
    // don't forget to enable timestamps!
    timestamps: true,

    // I don't want createdAt
    createdAt: false,

    // I want updatedAt to actually be called updateTimestamp
    updatedAt: false
  })
})

console.log(USER, PASS)
//const sequelize = new Sequelize('postgres://postgres:1415@localhost:5432/job_offers')

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// *** CONNECTION ***
async function connect () {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
//connect()

// *** ELEMENTS ***
let lastSearch = 0

// - windows -
const TRASH_DISLIKE = document.getElementById('trash_dislike')
const ASIDE = document.getElementById('aside')
const main = document.getElementById('main')
const TOP_BTNS = document.getElementById('top_btns')

const JOBS = document.getElementById('container_jobs')
const ASIDE_JOBS = document.getElementById('jobs_aside')
const FOOTER_JOBS = document.getElementById('footer_jobs')

const COMPANIES = document.getElementById('container_companies')
const ASIDE_COMPANIES = document.getElementById('companies_aside')
const FOOTER_COMPANIES = document.getElementById('footer_companies')

const PORTALS = document.getElementById('container_portals')
const ASIDE_PORTALS = document.getElementById('portals_aside')
const FOOTER_PORTALS = document.getElementById('footer_portals')

const INTERVIEWS = document.getElementById('container_interviews')
const ASIDE_INTERVIEWS = document.getElementById('interviews_aside')
const FOOTER_INTERVIEWS = document.getElementById('footer_interviews')

const TECHNOLOGIES = document.getElementById('container_technologies')
const ASIDE_TECHNOLOGIES = document.getElementById('technologies_aside')
const FOOTER_TECHNOLOGIES = document.getElementById('footer_technologies')

// - inputs -

// asideJOBS
const asideJobInterviews = document.getElementById('aside_jobs_interviews')
const asideJobsWeb = document.getElementById('aside_jobs_web')
const asideJobsLink = document.getElementById('aside_jobs_link')
const asideJobOfferLink = document.getElementById('aside_job_offer_link')
const asideJobsCompany = document.getElementById('aside_jobs_company')
const asideJobsPosition = document.getElementById('aside_jobs_position')
const asideJobsOfferDate = document.getElementById('aside_jobs_offer_date')
const asideJobsScrapingDate = document.getElementById('aside_jobs_scraping_date')
const asideJobsSalary = document.getElementById('aside_jobs_salary')
const asideJobsLocation = document.getElementById('aside_jobs_location')
const asideJobsExperience = document.getElementById('aside_jobs_experience')
const asideJobsContract = document.getElementById('aside_jobs_contract')
const asideJobsTechnologies = document.getElementById('aside_jobs_technologies')
const asideJobsDescription = document.getElementById('aside_jobs_description')

// asideWEBS
const asideWebId = document.getElementById('aside_id_web')
const asideWebName = document.getElementById('aside_portal_name')
const asideWebLink = document.getElementById('aside_portal_link')
const asideWebLinkIcon = document.getElementById('aside_web_link_icon')
const asideWebNOffers = document.getElementById('aside_portal_n_offers')

// asideCOMPANIES
const asideCompanyId = document.getElementById('aside_id_company')
const asideCompanyNOffers = document.getElementById('aside_n_offers_company')
const asideCompanyName = document.getElementById('aside_company_name')
const asideCompanyWeb = document.getElementById('aside_company_web')
const asideCompanyReputation = document.getElementById('aside_company_reputation')
const asideCompanyEmployees = document.getElementById('aside_company_employees')

// asideINTERVIEWS
const asideInterviewsId = document.getElementById('aside_id_interview')
const asideInterviewsOfferId = document.getElementById('aside_interviews_offer_id')
const asideInterviewsDate = document.getElementById('aside_interviews_date')
const asideInterviewsDuration = document.getElementById('aside_interviews_duration')
const asideInterviewsNotes = document.getElementById('aside_interviews_notes')

// asideTEHCNOLOGIES
const asideTechId = document.getElementById('aside_id_technology')
const asideTechName = document.getElementById('aside_technology_name')
const asideTechLevel = document.getElementById('aside_technology_level')
const asideTechRequest = document.getElementById('aside_request_technology')

// - labels -
const asideIdJob = document.getElementById('aside_id_job')
const asideJobLabelWeb = document.getElementById('aside_job_label_web')
const asideJobLabelCompany = document.getElementById('aside_job_label_company')

// *** TABS ***
const tabWebs = document.getElementById('tab_webs')
const tabCompanies = document.getElementById('tab_companies')
const tabJobs = document.getElementById('tab_jobs')
const tabInterviews = document.getElementById('tab_interviews')
const tabTechs = document.getElementById('tab_techs')

// *** TABS ***
const targets = document.querySelectorAll('[data-target]')
const content = document.querySelectorAll('[data-content]')
targets.forEach(target => {
  target.addEventListener('click', () => {
    content.forEach(c => {
      c.classList.remove('active')
    })

    const t = document.querySelector(target.dataset.target)
    t.classList.add('active')

    if (JOBS.classList.contains('active')) {
      keepAside()
      TRASH_DISLIKE.style.cssText = 'visibility: visible;'
      ASIDE_JOBS.classList.add('active')
      FOOTER_JOBS.classList.add('active')
    } else if (COMPANIES.classList.contains('active')) {
      keepAside()
      TRASH_DISLIKE.style.cssText = 'display: none;'
      ASIDE_COMPANIES.classList.add('active')
      FOOTER_COMPANIES.classList.add('active')
    } else if (PORTALS.classList.contains('active')) {
      keepAside()
      TRASH_DISLIKE.style.cssText = 'display: none;'
      ASIDE_PORTALS.classList.add('active')
      FOOTER_PORTALS.classList.add('active')
    } else if (INTERVIEWS.classList.contains('active')) {
      keepAside()
      TRASH_DISLIKE.style.cssText = 'display: none;'
      ASIDE_INTERVIEWS.classList.add('active')
      FOOTER_INTERVIEWS.classList.add('active')
    } else if (TECHNOLOGIES.classList.contains('active')) {
      keepAside()
      TRASH_DISLIKE.style.cssText = 'display: none;'
      ASIDE_TECHNOLOGIES.classList.add('active')
      FOOTER_TECHNOLOGIES.classList.add('active')
    }
  })
})

// *** TABLES ***

// - JOBS -
const tableJobs = new Tabulator(JOBS, {
  columns: [
    {title: 'Like', field: 'like_dislike', hozAlign: 'center', sorter: 'number', formatter: function (cell) {
      if (cell.getValue() === 0) {
        console.log(cell.getValue())
      } else if (cell.getValue() === 1) {
        const value = '<span class="icon icon-thumbs-up"></span>'
        return value
      } else if (cell.getValue() === 2) {
        const value = '<span class="icon icon-thumbs-down"></span>'
        return value
      }
    },
    cellClick: async function (e, cell) {
      let Id = asideIdJob.innerText
      Id = Id.split(' ')[1]

      const job = await Job.findOne({
        where: {
          id: Id
        }
      })
      console.log('jooooooooooob: ', job.id)
      console.log('jooooooooooob: ', job.like_dislike)

      job.save()
      if (cell.getValue() === 0) {
        job.like_dislike = 1
        console.log(cell.getValue())
        const value = 1
        // const value = '<span class="icon icon-thumbs-up"></span>'
        cell.setValue(value)
      } else if (cell.getValue() === 1) {
        job.like_dislike = 2
        console.log(cell.getValue())
        const value = 2
        // const value = '<span class="icon icon-thumbs-down"></span>'
        cell.setValue(value)
      } else if (cell.getValue() === 2) {
        job.like_dislike = 0
        console.log(cell.getValue())
        const value = 0
        // const value = null
        cell.setValue(value)
      } else {
        job.like_dislike = 1
        console.log(cell.getValue())
        const value = 1
        // const value = '<span class="icon icon-thumbs-up"></span>'
        cell.setValue(value)
      }
      job.save()
    }},
    { title: 'Id', field: 'id', sorter: 'number' },
    { title: 'Web', field: 'web', sorter: 'string' },
    { title: 'Position', field: 'position', sorter: 'string', width: 300 },
    { title: 'Company', field: 'company', sorter: 'number' },
    { title: 'Salary', field: 'salary', sorter: 'string' },
    { title: 'Loc', field: 'location', sorter: 'string' },
    { title: 'Ex', field: 'experience', sorter: 'number' },
    { title: 'Contract', field: 'contract', sorter: 'string' },
    { title: 'Offer_Date', field: 'offer_date', sorter: 'string', formatter: function(cell) {
      var value = cell.getValue()
      value = value.getDate() + '-' + (value.getMonth() + 1) + '-' + value.getFullYear()
      return value
    }},
    { title: 'Scraping_Date', field: 'scraping_date', sorter: 'string', formatter: function(cell){
      var value = cell.getValue()
      value = value.getDate() + '-' + (value.getMonth() + 1) + '-' + value.getFullYear()
      return value
    }},
    { title: 'Description', field: 'description', sorter: 'string', width: 500 },
    { title: 'Link', field: 'link', sorter: 'string', width: 500 }
  ],
  selectable: 1,
  initialSort: [
    { column: 'id', dir: 'asc' } // sort by this first
  ]
})

// - COMPANYS -
const tableCompanys = new Tabulator(COMPANIES, {
  columns: [
    { title: 'Id', field: 'id', sorter: 'number' },
    { title: 'Name', field: 'name', sorter: 'string' },
    { title: 'Nº Offers', field: 'n_ofertas', sorter: 'number'},
    { title: 'Web', field: 'web', sorter: 'string' },
    { title: 'Reputation', field: 'reputation', sorter: 'number' },
    { title: 'n_Employees', field: 'n_employees', sorter: 'number' }
  ],
  selectable: 1,
  initialSort: [
    { column: 'id', dir: 'asc' } // sort by this first
  ]
})

// - PORTALS -
const tablePortals = new Tabulator(PORTALS, {
  columns: [
    { title: 'Id', field: 'id', sorter: 'number' },
    { title: 'Name', field: 'name', sorter: 'string' },
    { title: 'Link', field: 'link', sorter: 'string' },
    { title: 'Nº Offers', field: 'n_ofertas', sorter: 'number'}
  ],
  selectable: 1,
  initialSort: [
    { column: 'id', dir: 'asc' } // sort by this first
  ]
})

// - INTERVIEWS -
const tableInterviews = new Tabulator(INTERVIEWS, {
  columns: [
    { title: 'Id', field: 'id', sorter: 'number' },
    { title: 'Offer_ID', field: 'offer_id', sorter: 'number' },
    { title: 'DateTime', field: 'date', sorter: 'string', formatter: function(cell) {
      var value = cell.getValue()
      if (value != null) {
        value = value.getDate() + '-' + (value.getMonth() + 1) + '-' + value.getFullYear() + ' ' 
        + value.getHours() + ':' + value.getMinutes() + ':' + value.getSeconds()
        return value
      }
    }},
    { title: 'Duration', field: 'duration', sorter: 'number' },
    { title: 'Notes', field: 'text_notes', sorter: 'string', width: 500 }
  ],
  selectable: 1,
  initialSort: [
    { column: 'id', dir: 'asc' } // sort by this first
  ]
})

// - TECHS -
const tableTech = new Tabulator(TECHNOLOGIES, {
  columns: [
    { title: 'Id', field: 'id', sorter: 'number' },
    { title: 'Name', field: 'name', sorter: 'string' },
    { title: 'Level', field: 'level', sorter: 'number' },
    { title: 'Nº Request', field:'n_request', sorter: 'number' }
  ],
  selectable: 1,
  initialSort: [
    { column: 'id', dir: 'asc' } // sort by this first
  ]
})


// *** TABLES - CLICK FUNCTIONS ***
// - CLICK tableJOBS -
tableJobs.on('rowClick', async function (e, row, cell) {
  const job = row.getData()
  // console.log(JSON.stringify(job))
  console.log(job.link)

  asideIdJob.innerText = 'ID: ' + job.id

  asideJobsWeb.value = job.web
  const webs = await Web.findAll({
    where: {
      name: job.web
    }
  })
  const jobDB = await Job.findOne({
    where: {
      id: job.id
    }
  })
  asideJobsWeb.value = webs[0].id
  asideJobLabelWeb.innerText = '- ' + webs[0].name
  if (webs[0].name == 'infoempleo') {
    job.link = webs[0].link + 'ofertasdetrabajo/' + jobDB.link
  } else {
    job.link = webs[0].link + jobDB.link
  }

  asideJobsLink.value = job.link
  asideJobsPosition.value = job.position

  let value = job.offer_date
  value = value.getDate() + '-' + (value.getMonth() + 1) + '-' + value.getFullYear()
  asideJobsOfferDate.value = value

  value = job.scraping_date
  value = value.getDate() + '-' + (value.getMonth() + 1) + '-' + value.getFullYear()
  asideJobsScrapingDate.value = value

  asideJobsSalary.value = job.salary
  asideJobsLocation.value = job.location
  asideJobsExperience.value = job.experience
  asideJobsContract.value = job.contract
  asideJobsDescription.value = job.description

  let techs = ''
  let jobTechs = await JobTech.findAll({
    where: {
      offer_id: job.id
    }
  })
  console.log(jobTechs)
  for (const jobtech of jobTechs) {
    let tech = await Tech.findOne({
      where: {
        id: jobtech.tech_id
      }
    })
    techs += tech.name + ', '
  }

  asideJobsTechnologies.value = techs

  const interviews = await Interview.findAll({
    where: {
      offer_id: job.id
    }
  })

  asideJobInterviews.innerText = interviews.length

  const company = await Company.findOne({
    where: {
      name: job.company
    }
  })
  asideJobsCompany.value = company.id
  asideJobLabelCompany.innerText = '- ' + company.name
})

asideJobOfferLink.addEventListener('click', async () => {

  let link = asideJobsLink.value
  if (link !== '') {
    shell.openExternal(asideJobsLink.value)
  }
})

// - CLICK tableWEBS -
tablePortals.on('rowClick', async function (e, row, cell) {
  const web= row.getData()
  console.log(web.name)

  asideWebId.innerText = 'ID: ' + web.id
  asideWebNOffers.innerText = 'Nº Offers: ' + web.n_ofertas
  asideWebName.value = web.name
  asideWebLink.value = web.link

})
asideWebLinkIcon.addEventListener('click', async () => {

  let link = asideWebLink.value
  if (link !== '') {
    shell.openExternal(asideWebLink.value)
  }
})

// - CLICK tableCOMPANY -
tableCompanys.on('rowClick', async function (e, row, cell) {
  const company = row.getData()
  console.log(company.name)

  asideCompanyId.innerText = 'ID: ' + company.id
  asideCompanyNOffers.innerText = 'Nº Offers: ' + company.n_ofertas
  asideCompanyWeb.value = company.web
  asideCompanyEmployees.value = company.n_employees

  asideCompanyName.value = company.name
  if (company.reputation != null) {
    asideCompanyReputation.value = Math.round(company.reputation)
  } else {
    asideCompanyReputation.value = 0
  }
  
})

// - CLICK tableINTERVIEWS -
tableInterviews.on('rowClick', async function (e, row, cell) {
  const interview = row.getData()
  console.log(interview.id)

  asideInterviewsId.innerText = 'ID: ' + interview.id
  asideInterviewsOfferId.value = interview.offer_id
  asideInterviewsDate.value = interview.date
  asideInterviewsDuration.value = interview.duration
  asideInterviewsNotes.value = interview.text_notes
})

// - CLICK tableTECH -
tableTech.on('rowClick', async function (e, row, cell) {
  const tech = row.getData()
  console.log(tech.name)

  asideTechId.innerText = 'ID: ' + tech.id

  asideTechName.value = tech.name
  if (tech.level != null) {
    asideTechLevel.value = tech.level
  } else {
    asideTechLevel.value = 0
  }
  asideTechRequest.innerText = 'Nº Request: ' + tech.n_request
})



// DB FUNCTIONS

async function selectOneWeb (Id) {
  const web = await Web.findOne({
    where: {
      id: Id
    }
  })
  return web
}

async function selectAll () {
  const allJobs = await Job.findAll()
  // console.log('All items:', JSON.stringify(allJobs, null, 2))
  // allJobs.forEach(job => console.log(job.company))
  // for (let i = 0; i < allJobs.length; i++) {
  // console.log(JSON.stringify(allJobs[i]))
  // }
  return allJobs
}

const getAll = () => {
  return new Promise((resolve, reject) => {
    const allJobs = Job.findAll()
    let listado = []
    allJobs.forEach(job => listado.push(job))
    resolve(listado)
  })
}

// selectAll()

async function selectMany () {
  const item = await Job.findAll({
    where: {
      id: 1
    }
  })
  console.log(item[0])
  console.log(JSON.stringify(item[0]))
  console.log(item[0].name)
}

// selectMany()
/*
async function selectOne (Id) {
  const job = await Job.findOne({
    where: {
      id: Id
    }
  })
  console.log(job)
  console.log(JSON.stringify(job))
  return job
} */

// selectOne()

async function updateOne () {
  const item = await Job.findOne({
    where: {
      id: 1
    }
  })
  item.name = 'milk and milka'
  await item.save()
}

// updateOne()

const buscarTodos = () => {
  selectAll().then(allJobs => {
    representaJobs(allJobs)
  })
}

async function representaJobs (jobs) {
  tableJobs.clearData()
  tableJobs.replaceData(jobs)

  // Cargamos el nombre del Portal y de la Compañía:
  let allRows = tableJobs.getRows()

  for (const row of allRows) {
    let cells = row.getCells()
    let idJob = cells[1].getValue()
    let idWeb = cells[2].getValue()
    let idCompany = cells[4].getValue()
    const web = await Web.findOne({
      where: {
        id: idWeb
      }
    })
    const company = await Company.findOne({
      where: {
        id: idCompany
      }
    })
    tableJobs.updateData([{ id: idJob, web: web.name, company: company.name }]) // update data
  }
}

const btnAllJobs = document.getElementById('btn_jobs_find_all')
btnAllJobs.addEventListener('click', async () => {
  const jobs = await Job.findAll()
  representaJobs(jobs)
})
const btnAllCompanies = document.getElementById('btn_companies_find_all')
btnAllCompanies.addEventListener('click', async () => {
  const allCompanies = await Company.findAll()
  tableCompanys.clearData()
  tableCompanys.replaceData(allCompanies)

  let allRows = tableCompanys.getRows()
  for (const row of allRows) {
    let cells = row.getCells()
    let idCompany = cells[0].getValue()
    const jobs = await Job.findAll({
      where: {
        company: idCompany
      }
    })
    tableCompanys.updateData([{ id: idCompany, n_ofertas: jobs.length }]) // update data
  }
})
const btnAllPortals = document.getElementById('btn_portals_find_all')
btnAllPortals.addEventListener('click', async () => {
  const allPortals = await Web.findAll()
  tablePortals.clearData()
  tablePortals.replaceData(allPortals)

  const OfertasIndeed = await Job.findAll({
    where: {
      web: 1
    }
  })
  const OfertasTecnoempleo = await Job.findAll({
    where: {
      web: 2
    }
  })
  tablePortals.updateData([{ id: 1, n_ofertas: OfertasIndeed.length },{ id: 2, n_ofertas: OfertasTecnoempleo.length }]) // update data
})
const btnAllInterviews = document.getElementById('btn_interviews_find_all')
btnAllInterviews.addEventListener('click', async () => {
  const allInterviews = await Interview.findAll()
  tableInterviews.clearData()
  tableInterviews.replaceData(allInterviews)
})
const btnAllTech = document.getElementById('btn_technologies_find_all')
btnAllTech.addEventListener('click', async () => {
  const allTech = await Tech.findAll()
  tableTech.clearData()
  tableTech.replaceData(allTech)

  let allRows = tableTech.getRows()
  for (const row of allRows) {
    let cells = row.getCells()
    let idTech = cells[0].getValue()
    const job_techs = await JobTech.findAll({
      where: {
        tech_id: idTech
      }
    })
    tableTech.updateData([{ id: idTech, n_request: job_techs.length }]) // update data
  }

})

// *** WEB SEE OFFERS ***
const btnPortalSeeOffers = document.getElementById('btn_portal_see_offers')
btnPortalSeeOffers.addEventListener('click', async () => {
  PORTALS.classList.remove('active')
  ASIDE_PORTALS.classList.remove('active')
  FOOTER_PORTALS.classList.remove('active')
  tabWebs.selected = false

  JOBS.classList.add('active')
  keepAside()
  TRASH_DISLIKE.style.cssText = 'visibility: visible;'
  ASIDE_JOBS.classList.add('active')
  FOOTER_JOBS.classList.add('active')
  tabJobs.selected = true

  let webId = asideWebId.innerText
  webId = webId.split(' ')[1]

  const offers = await Job.findAll({
    where: {
      web: webId
    }
  })

  representaJobs(offers)
})

// *** COMPANY SEE OFFERS ***
const btnCompanySeeOffers = document.getElementById('btn_company_see_offers')
btnCompanySeeOffers.addEventListener('click', async () => {
  COMPANIES.classList.remove('active')
  ASIDE_COMPANIES.classList.remove('active')
  FOOTER_COMPANIES.classList.remove('active')
  tabCompanies.selected = false

  JOBS.classList.add('active')
  keepAside()
  TRASH_DISLIKE.style.cssText = 'visibility: visible;'
  ASIDE_JOBS.classList.add('active')
  FOOTER_JOBS.classList.add('active')
  tabJobs.selected = true

  let companyId = asideCompanyId.innerText
  companyId = companyId.split(' ')[1]

  const offers = await Job.findAll({
    where: {
      company: companyId
    }
  })

  representaJobs(offers)
})

// *** TECH SEE OFFERS ***
const btnTechSeeOffers = document.getElementById('btn_tech_see_offers')
btnTechSeeOffers.addEventListener('click', async () => {
  TECHNOLOGIES.classList.remove('active')
  ASIDE_TECHNOLOGIES.classList.remove('active')
  FOOTER_TECHNOLOGIES.classList.remove('active')
  tabTechs.selected = false

  JOBS.classList.add('active')
  keepAside()
  TRASH_DISLIKE.style.cssText = 'visibility: visible;'
  ASIDE_JOBS.classList.add('active')
  FOOTER_JOBS.classList.add('active')
  tabJobs.selected = true

  let techId = asideTechId.innerText
  techId = techId.split(' ')[1]

  let queryFilter = 'SELECT job.* FROM public.job_tech as jt'
    + ' inner join public.job_offer as job on jt.offer_id = job.id'
    + ' where jt.tech_id = ' + techId
    + ' group by job.id'

  const jobsFilter = await sequelize.query( queryFilter, { type: QueryTypes.SELECT })
  representaJobs(jobsFilter)
})

// *** BTN FILTER JOBS ***
const btnJobFilter = document.getElementById('btn_jobs_filter')
const jobFooterSwitch = document.getElementById('my_job_footer_switch')
const jobFooterTechLevel = document.getElementById('my_job_footer_input_tech_level')
const jobFooterInputWeb = document.getElementById('my_job_footer_input_web')
const jobFooterInputCompany = document.getElementById('my_job_footer_input_company')
const jobFooterInputPosition = document.getElementById('my_job_footer_input_position')
const jobFooterInputLocation = document.getElementById('my_job_footer_input_location')
const jobFooterInputSalary = document.getElementById('my_job_footer_input_salary')
btnJobFilter.addEventListener('click', async () => {
  let queryFilter = 'SELECT job.* FROM job_offer as job '
  let where = ' WHERE '
  let someFilter = false

  if (jobFooterTechLevel.value !== '0') {
    queryFilter = 'SELECT job.* FROM public.job_tech as jt' 
    +' inner join public.job_offer as job on jt.offer_id = job.id'
    +' inner join public.technology as tech on jt.tech_id = tech.id '
    console.log(queryFilter)

    if (someFilter == false) {
      where += 'tech.level >= ' + jobFooterTechLevel.value
    }
    else {
      where += ' and tech.level >= ' + jobFooterTechLevel.value
    }
    someFilter = true
  }
  if (jobFooterInputPosition.value !== '') {
    if (someFilter == false) {
      where += "job.position ilike '%" + jobFooterInputPosition.value + "%'"
    }
    else {
      where += " and job.position ilike '%" + jobFooterInputPosition.value + "%'"
    }
    someFilter = true
  }
  if (jobFooterInputWeb.value !== '') {
    queryFilter += ' inner join public.web as w on job.web = w.id '
    if (someFilter == false) {
      where += "w.name ilike '%" + jobFooterInputWeb.value + "%'"
    }
    else {
      where += " and w.name ilike '%" + jobFooterInputWeb.value + "%'"
    }
    someFilter = true
  }
  if (jobFooterInputCompany.value !== '') {
    queryFilter += ' inner join public.company as c on job.company = c.id '
    if (someFilter == false) {
      where += "c.name ilike '%" + jobFooterInputCompany.value + "%'"
    }
    else {
      where += " and c.name ilike '%" + jobFooterInputCompany.value + "%'"
    }
    someFilter = true
  }
  if (jobFooterSwitch.toggled !== false) {
    if (someFilter === false) {
      where += 'job.like_dislike = 1'
    } else {
      where += ' and job.like_dislike = 1'
    }
    someFilter = true
  }
  if (jobFooterInputLocation.value !== '') {
    if (someFilter == false) {
      where += "job.location ilike '%" + jobFooterInputLocation.value + "%'"
    }
    else {
      where += " and job.location ilike '%" + jobFooterInputLocation.value + "%'"
    }
    someFilter = true
  }

  if (someFilter === true) {
    queryFilter += where
  }
  if (jobFooterTechLevel.value !== '0') {
    queryFilter += ' group by job.id order by job.id asc'
  }
  console.log(queryFilter)

  const jobsFilter = await sequelize.query( queryFilter, { type: QueryTypes.SELECT })
  representaJobs(jobsFilter)
})

// *** BTN FILTER COMPANIES ***
const btnCompanyFilter = document.getElementById('btn_companies_filter')
const companiesFooterFilterName = document.getElementById('my_companies_footer_input_name')
btnCompanyFilter.addEventListener('click', async () => {
  let companyName = companiesFooterFilterName.value
  if (companyName != ''){
    let queryFilter = "SELECT * FROM company where name ilike '%" + companyName + "%'"
    const companiesFilter = await sequelize.query( queryFilter, { type: QueryTypes.SELECT })
    tableCompanys.clearData()
    tableCompanys.replaceData(companiesFilter)
  }
})

// *** BTN FILTER INTERVIEWS ***
const btnInterviewFilter = document.getElementById('btn_interviews_filter')
const interviewsFooterFilterOfferID = document.getElementById('my_interviews_footer_input_offer_id')
btnInterviewFilter.addEventListener('click', async () => {
  let offerID = interviewsFooterFilterOfferID.value
  if (offerID  != ''){
    const interviewsFilter = await Interview.findAll({
      where: {
        offer_id: offerID
      }
    })
    tableInterviews.clearData()
    tableInterviews.replaceData(interviewsFilter)
  }
})

// *** BTN FILTER INTERVIEWS ***
const btnTechFilter = document.getElementById('btn_technologies_filter')
const techFooterFilterName = document.getElementById('my_technologies_footer_name')
btnTechFilter.addEventListener('click', async () => {
  let techName = techFooterFilterName.value
  if (techName != ''){
    let queryFilter = "SELECT * FROM technology where name ilike '%" + techName + "%'"
    const techsFilter = await sequelize.query( queryFilter, { type: QueryTypes.SELECT })
    tableTech.clearData()
    tableTech.replaceData(techsFilter)
  }
})

// *** BTN EXTEND ASIDE ***
const btnIcon = document.getElementById('btn_aside_icon')
const aside = document.getElementById('aside')
const btnExtendAside = document.getElementById('btn_extend_aside')
btnExtendAside.addEventListener('click', () => {
  extendAside()
})

function extendAside() {
  if (btnIcon.href === '#chevron-right') {
    btnIcon.href = '#chevron-left'
    main.style.cssText = 'grid-template-columns: 1fr 35px;'
    aside.style.cssText = 'overflow-y: hide;'
  } else {
    btnIcon.href = '#chevron-right'
    main.style.cssText = 'grid-template-columns: 7fr 3fr;'
    aside.style.cssText = 'overflow-y: scroll;'
  }
}
function keepAside() {
  if (btnIcon.href === '#chevron-right') {
    btnIcon.href = '#chevron-right'
    main.style.cssText = 'grid-template-columns: 7fr 3fr;'
    aside.style.cssText = 'overflow-y: scroll;'
  } else {
    btnIcon.href = '#chevron-left'
    main.style.cssText = 'grid-template-columns: 1fr 35px;'
    aside.style.cssText = 'overflow-y: hide;'
  }
}


function toTimestamp (year, month, day, hour, minute, second) {
  const datum = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
  return datum.getTime()
}
// ---------- BOTONES UPDATE ----------
// *** BTN UPDATE JOB ***
const btnUpdateJob = document.getElementById('btn_update_job')
btnUpdateJob.addEventListener('click', async () => {
  let Id = asideIdJob.innerText
  Id = Id.split(' ')[1]

  const job = await Job.findOne({
    where: {
      id: Id
    }
  })
  console.log('jooooooooooob: ', job.id)

  job.position = asideJobsPosition.value

  const newDate = new Date()

  const value1 = asideJobsOfferDate.value
  const time1 = toTimestamp(value1.split('-')[2], value1.split('-')[1], value1.split('-')[0], newDate.getHours(), newDate.getMinutes(), newDate.getSeconds())
  const time1B = toTimestamp(value1.split('-')[2], value1.split('-')[1], (value1.split('-')[0] - 1), newDate.getHours(), newDate.getMinutes(), newDate.getSeconds())
  job.offer_date = time1

  const value2 = asideJobsScrapingDate.value
  const time2 = toTimestamp(value2.split('-')[2], value2.split('-')[1], value2.split('-')[0], newDate.getHours(), newDate.getMinutes(), newDate.getSeconds())
  const time2B = toTimestamp(value2.split('-')[2], value2.split('-')[1], (value2.split('-')[0] - 1), newDate.getHours(), newDate.getMinutes(), newDate.getSeconds())
  job.scraping_date = time2

  job.salary = asideJobsSalary.value
  job.location = asideJobsLocation.value
  if (asideJobsExperience.value != ''){
    job.experience = asideJobsExperience.value
  }
  job.contract = asideJobsContract.value
  job.description = asideJobsDescription.value

  await job.save()
  // await sleep(10)

  // job.offer_date = time1B
  // job.scraping_date = time2B
  tableJobs.updateData([{ id: job.id, position: job.position, offer_date: job.offer_date,
                        scraping_date: job.scraping_date, salary: job.salary, location: job.location, 
                        experience: job.experience, contract: job.contract, description: job.description }]) // update data
})

// *** BTN UPDATE COMPANY ***
const btnUpdateCompany = document.getElementById('btn_update_company')
btnUpdateCompany.addEventListener('click', async () => {
  let Id = asideCompanyId.innerText
  Id = Id.split(' ')[1]
  console.log(Id)

  const company = await Company.findOne({
    where: {
      id: Id
    }
  })

  company.reputation = asideCompanyReputation.value
  company.web = asideCompanyWeb.value
  console.log(asideCompanyEmployees.value)
  if (asideCompanyEmployees.value != ''){
    company.n_employees = asideCompanyEmployees.value
  }

  await company.save()
  
  tableCompanys.updateData([{ id: company.id, web: company.web, reputation: company.reputation, n_employees: company.n_employees}]) // update data
})

// *** BTN UPDATE TECH ***
const btnUpdateTech = document.getElementById('btn_update_technology')
btnUpdateTech.addEventListener('click', async () => {
  let Id = asideTechId.innerText
  Id = Id.split(' ')[1]

  const tech = await Tech.findOne({
    where: {
      id: Id
    }
  })

  tech.level = asideTechLevel.value
  await tech.save()

  tableTech.updateData([{ id: tech.id, level: tech.level}]) // update data
})

// *** BTN UPDATE INTERVIEW ***
const btnUpdateInterview = document.getElementById('btn_update_interview')
btnUpdateInterview.addEventListener('click', async () => {
  let Id = asideInterviewsId.innerText
  Id = Id.split(' ')[1]

  const interview = await Interview.findOne({
    where: {
      id: Id
    }
  })

  if (asideInterviewsDate.value != ''){
    const value1 = asideInterviewsDate.value
    const date = value1.split(' ')[0]
    const time = value1.split(' ')[1]
    const time1 = toTimestamp(date.split('-')[2], date.split('-')[1], date.split('-')[0], time.split(':')[0], time.split(':')[1], time.split(':')[2])
    interview.date = time1
  }
  if (asideInterviewsDuration.value != ''){
    interview.duration = asideInterviewsDuration.value
  }
  interview.text_notes = asideInterviewsNotes.value

  await interview.save()

  tableInterviews.updateData([{ id: interview.id, date: interview.date, duration: interview.duration, text_notes: interview.text_notes}]) // update data
})

// *** BTN PAPELERA ***
const btnPapelera = document.getElementById('trash')
btnPapelera.addEventListener('click', async () => {
  if (tabJobs.selected == true) {
    console.log('papelera - JOBS')
    let Id = asideIdJob.innerText
    Id = Id.split(' ')[1]

    const job = await Job.findOne({
      where: {
        id: Id
      }
    })
    console.log('jooooooooooob: ', job.id)

    const rows = tableJobs.getSelectedRows()
    console.log('rooooow: ', rows[0].delete())
    await job.destroy()
  } 
  else if (tabWebs.selected == true) {
    console.log('papelera - WEBS')
    let Id = asideWebId.innerText
    Id = Id.split(' ')[1]

    const jobs = await Job.findAll({
      where: {
        web: Id
      }
    })
    for (const job of jobs) {
      await job.destroy()
    }
    const webs = await Web.findAll()

    tablePortals.clearData()
    tablePortals.replaceData(webs)

    const OfertasIndeed = await Job.findAll({
      where: {
        web: 1
      }
    })
    const OfertasTecnoempleo = await Job.findAll({
      where: {
        web: 2
      }
    })
    tablePortals.updateData([{ id: 1, n_ofertas: OfertasIndeed.length },{ id: 2, n_ofertas: OfertasTecnoempleo.length }]) // update data
  } 
  else if (tabCompanies.selected == true) {
    console.log('papelera - COMPANIES')
    let Id = asideCompanyId.innerText
    Id = Id.split(' ')[1]

    const company = await Company.findOne({
      where: {
        id: Id
      }
    })
    const rows = tableCompanys.getSelectedRows()
    rows[0].delete()
    await company.destroy()
  } 
  else if (tabInterviews.selected == true) {
    console.log('papelera - INTERVIEWS')
    let Id = asideInterviewsId.innerText
    Id = Id.split(' ')[1]

    const interview = await Interview.findOne({
      where: {
        id: Id
      }
    })
    const rows = tableInterviews.getSelectedRows()
    rows[0].delete()
    await interview.destroy()
  } 
  else if (tabTechs.selected == true) {
    console.log('papelera - TECHS')
    let Id = asideTechId.innerText
    Id = Id.split(' ')[1]
    
    const tech = await Tech.findOne({
      where: {
        id: Id
      }
    })
    const rows = tableTech.getSelectedRows()
    rows[0].delete()
    await tech.destroy()
  } 
  else {
    console.log('papelera ...... No tab encontrado')
  }

})
// *** BTN PAPELERA DISLIKES ***
const btnPapeleraDislike = document.getElementById('trash_dislike')
btnPapeleraDislike.addEventListener('click', async () => {
  let allRows = tableJobs.getRows()

  for (const row of allRows) {
    const cells = row.getCells()
    const cell_like = cells[0].getValue()
    const cell_id = cells[1].getValue()
    if (cell_like == 2){
      row.delete()
      const job = await Job.findOne({
        where: {
          id: cell_id
        }
      })
      await job.destroy()
    }
  }
})

// *** BTN ADD INTERVIEW ***
const btnAddInterview = document.getElementById('btn_job_add_interview')
btnAddInterview.addEventListener('click', async () => {
  JOBS.classList.remove('active')
  ASIDE_JOBS.classList.remove('active')
  FOOTER_JOBS.classList.remove('active')
  tabJobs.selected = false

  INTERVIEWS.classList.add('active')
  keepAside()
  TRASH_DISLIKE.style.cssText = 'display: none;'
  ASIDE_INTERVIEWS.classList.add('active')
  FOOTER_INTERVIEWS.classList.add('active')
  tabInterviews.selected = true

  let offerId = asideIdJob.innerText
  offerId = offerId.split(' ')[1]
  const newInterview = Interview.build({ offer_id: offerId})
  
  await newInterview.save()

  const interviews = await Interview.findAll({
    where: {
      offer_id: offerId
    }
  })
  interview = interviews[interviews.length - 1]

  asideInterviewsId.innerText = interview.id
  asideInterviewsOfferId.value = interview.offer_id

  const allInterviews = await Interview.findAll()
  tableInterviews.clearData()
  tableInterviews.replaceData(allInterviews)
})
// *** BTN SEE INTERVIEW ***
const btnSeeInterview = document.getElementById('btn_job_view_interviews')
btnSeeInterview.addEventListener('click', async () => {
  JOBS.classList.remove('active')
  ASIDE_JOBS.classList.remove('active')
  FOOTER_JOBS.classList.remove('active')
  tabJobs.selected = false

  INTERVIEWS.classList.add('active')
  keepAside()
  TRASH_DISLIKE.style.cssText = 'display: none;'
  ASIDE_INTERVIEWS.classList.add('active')
  FOOTER_INTERVIEWS.classList.add('active')
  tabInterviews.selected = true

  let offerId = asideIdJob.innerText
  offerId = offerId.split(' ')[1]

  const interviews = await Interview.findAll({
    where: {
      offer_id: offerId
    }
  })
  tableInterviews.clearData()
  tableInterviews.replaceData(interviews)
})

// *** BTNS TOP BAR ***
// - Close Btn -
const closeBtn = document.getElementById('closeBtn')
closeBtn.addEventListener('click', () => {
  ipc.send('closeApp')
})
// - FullScreen Btn -
const maxResBtn = document.getElementById('maxResBtn')
maxResBtn.addEventListener('click', () => {
  ipc.send('maximizeApp')
})
// - Minimize Btn -
const minimizeBtn = document.getElementById('minimizeBtn')
minimizeBtn.addEventListener('click', () => {
  ipc.send('minimizeBtn')
})


// *** BTN MENU BAR ***
let boolMenuBar = false
const btnTopMenu = document.getElementById('showHideMenus')
const menuBar = document.getElementById('menuBar')
const topBtns = document.getElementById('top_btns')
const centralContainer = document.getElementById('central_container')
btnTopMenu.addEventListener('click', () => {
  if (boolMenuBar === false) {
    menuBar.style.cssText = 'height: 30px; visibility: visible;'
    topBtns.style.cssText = 'margin-top: 62px;'
    centralContainer.style.cssText = 'height: calc(100% - 141px);'
    boolMenuBar = true
  } else {
    menuBar.style.cssText = 'height: 0px; visibility: hidden;'
    topBtns.style.cssText = 'margin-top: 32px;'
    centralContainer.style.cssText = 'height: calc(100% - 111px);'
    boolMenuBar = false
  }

  // ipc.send('loadExplorer')
  // ipc.send('loadShell')
})

const btnRunScraping = document.getElementById('run_scraping')
btnRunScraping.addEventListener('click', () => {
  ipc.send('runScraping')
})

const btnConfig = document.getElementById('config')
btnConfig.addEventListener('click', () => {

  ipc.send('loadConfig')
  
})

const btnDocument = document.getElementById('doc')
btnDocument.addEventListener('click', () => {
  ipc.send('loadDoc')
})

const btnContacto = document.getElementById('contact')
btnContacto.addEventListener('click', () => {
  let winnew = new BrowserWindow({
    width: 750,
    height: 500,
    resizable: false
  })
  winnew.loadFile('contact.html')
  winnew.setMenu(null)

  winnew.on('closed', () => {
    win=null
  })
})

