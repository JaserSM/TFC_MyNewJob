from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from database import Base


class JobOffer(Base):
    __tablename__ = 'job_offer'

    id = Column(Integer, primary_key=True, autoincrement=True)
    web = Column(Integer,
                 ForeignKey(
                     "web.id",
                     name="job_offer_web_id_fkey",
                     ondelete="CASCADE",
                     onupdate="CASCADE"
                 ), nullable=False)
    link = Column(String, unique=True, nullable=False)
    company = Column(Integer,
                     ForeignKey(
                         "company.id",
                         name="job_offer_company_id_fkey",
                         ondelete="CASCADE",
                         onupdate="CASCADE"
                     ), nullable=False)
    position = Column(String, nullable=False)
    offer_date = Column(DateTime, nullable=False)
    scraping_date = Column(DateTime, default=datetime.utcnow)
    salary = Column(String)
    location = Column(String)
    experience = Column(Integer)
    contract = Column(String)
    description = Column(Text)
    like_dislike = Column(Integer)
    state = Column(Integer)

    def __repr__(self):
        return (
            f'JobOffer(id={self.id}, web={self.web}, link={self.link}, company={self.company}, '
            f'position={self.position}, offer_date={self.offer_date}, '
            f'scraping_date={self.scraping_date}, salary={self.salary}, '
            f'location={self.location}, experience={self.experience}, '
            f'description={self.description})'
        )
