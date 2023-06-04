from datetime import datetime
from sqlalchemy import select
from database import SessionLocal
from job_offer import JobOffer
from web import Web
from company import Company
from technology import Tech

job = JobOffer(link='invent_link2352352', company='Microsoft', position='Backend .NET developer',
             offer_date=datetime(2023, 3, 2), salary='2.000€', location='Valencia', experience=2,
             description='Server-side application development using C#')

session = SessionLocal()

def insert_job(job):
    link = job.link
    print('------ INSERT JOB ------')
    try:
        session.add(job)
        session.commit()
        print('------ NEW JOB ------')
        job = session.query(JobOffer).filter_by(link=link).first()
        print('job.id: ', job.id)
        return job.id
    except:
        print('------ Job UPDATE------')
        session.rollback()
        job_db = session.query(JobOffer).filter_by(link=link).first()
        if job.position != None:
            job_db.position = job.position
        if job.offer_date != None:
            job_db.offer_date = job.offer_date

        job_db.scraping_date = datetime.now()
        if job.salary != None:
            job_db.salary = job.salary
        if job.location != None:
            job_db.location = job.location
        if job.experience != None:
            job_db.experience = job.experience
        if job.contract != None:
            job_db.contract = job.contract
        if job.description != None:
            job_db.description = job.description

        session.commit()
        print('job.id: ', job_db.id)
        return job_db.id
#insert_job(job)
def insert_job_tech(job_tech):
    try:
        session.add(job_tech)
        session.commit()
        print('------ NEW JOB_TECH ------')
    except:
        session.rollback()



jobs = [
    JobOffer(link='invent_link2352352', company='Microsoft', position='Backend .NET developer',
             offer_date=datetime(2023, 3, 2), salary='2.000€', location='Valencia', experience=2,
             description='Server-side application development using C#'),
    JobOffer(link='invent_link23523522', company='Mi', position='Bac .NET developer',
             offer_date=datetime(2023, 3, 1), salary='2.000€', location='Valencia', experience=2,
             description='Server-side application development using C#')
]

webs = [
    Web(name='indeed', link='https://es.indeed.com/'),
    Web(name='tecnoempleo', link='https://www.tecnoempleo.com/')
]

session = SessionLocal()
#session.add(job2)
#session.commit()

def getJobByLink(link):
    stmt = select(JobOffer).where(JobOffer.link == link)
    job = session.scalars(stmt).one()
    return job

def create_jobs(job_offers):
    print('SIZE', len(job_offers))
    print('CREATE JOBS')
    for job in job_offers:
        print('------ NEW JOB ------')
        session.add(job)
    session.commit()

def create_webs(webs):
    print('SIZE', len(webs))
    print('CREATE webs')
    for web in webs:
        print('------ NEW web ------')
        session.add(web)
    session.commit()

#create_webs(webs)
def insert_tech(tech):
    print('------ TECH ------')
    tech_db = session.query(Tech).filter(Tech.name.ilike(tech.name)).first()
    try:
        if tech_db == None:
            session.add(tech)
            session.commit()
            print('------ NEW TECH ------')
            tech = session.query(Tech).filter_by(name=tech.name).first()
            print('tech.id: ', tech.id)
            return tech.id
        else:
            print('------ Tech UPDATE------')
            if tech.level != None:
                tech_db.level = tech.level
            session.commit()
            print('tech.id: ', tech_db.id)
            return tech_db.id
    except Exception as ex:
        print(ex)

#create_jobs(jobs)

def insert_company(company):
    print('------ INSERT Company ------')
    try:
        session.add(company)
        session.commit()
        print('------ NEW Company ------')
        company = session.query(Company).filter_by(name=company.name).first()
        print('company.id: ', company.id)
        return company.id
    except:
        print('------ Company UPDATE------')
        session.rollback()
        company_db = session.query(Company).filter_by(name=company.name).first()
        if company.web != '':
            company_db.web = company.web
        if company.reputation != None:
            company_db.reputation = company.reputation
        if company.n_employees != None:
            company_db.n_employees = company.n_employees
        session.commit()
        print('company.id: ', company_db.id)
        return company_db.id

def print_all_jobs():
    job_records = session.query(JobOffer).all()
    for job in job_records:
        print(job)

#print_all_jobs()
