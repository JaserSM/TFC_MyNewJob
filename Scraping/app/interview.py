from sqlalchemy import Column, Integer, DateTime, Text, ForeignKey
from database import Base


class Interview(Base):
    __tablename__ = 'interview'

    id = Column(Integer, primary_key=True, autoincrement=True)
    offer_id = Column(Integer,
                      ForeignKey(
                          "job_offer.id",
                          name="interview_job_offer_id_fkey",
                          ondelete="CASCADE",
                          onupdate="CASCADE"
                      ), nullable=False)
    date = Column(DateTime)
    duration = Column(Integer)
    text_notes = Column(Text)

    def __repr__(self):
        return (
            f'Company(id={self.id}, name={self.name}, web={self.web}, '
            f'reputation={self.reputation}, n_employees={self.n_employees} '
        )
