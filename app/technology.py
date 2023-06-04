
from sqlalchemy import Column, Integer, String
from database import Base


class Tech(Base):
    __tablename__ = 'technology'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)
    level = Column(Integer)


    def __repr__(self):
        return (
            f'Company(id={self.id}, name={self.name}, level={self.level} '
        )
