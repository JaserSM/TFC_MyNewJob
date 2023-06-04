
from sqlalchemy import Column, Integer, String, Float
from database import Base


class Company(Base):
    __tablename__ = 'company'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)
    web = Column(String)
    reputation = Column(Float)
    n_employees = Column(Integer)


    def __repr__(self):
        return (
            f'Company(id={self.id}, name={self.name}, web={self.web}, '
            f'reputation={self.reputation}, n_employees={self.n_employees} '
        )
