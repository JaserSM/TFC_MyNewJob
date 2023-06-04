from sqlalchemy import Column, Integer, String
from database import Base


class Web(Base):
    __tablename__ = 'web'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)
    link = Column(String, unique=True, nullable=False)

    def __repr__(self):
        return (
            f'Web(id={self.id}, name={self.name}, link={self.link})'
        )
