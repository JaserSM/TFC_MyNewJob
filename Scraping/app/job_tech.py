
from sqlalchemy import Column, BIGINT, ForeignKey
from database import Base


class JobTech(Base):
    __tablename__ = 'job_tech'

    offer_id = Column(
        BIGINT,
        ForeignKey(
            "job_offer.id",
            name="job_tech_offer_id_fkey",
            ondelete="CASCADE",
            onupdate="CASCADE"
        ),
        primary_key=True
    )

    tech_id = Column(
        BIGINT,
        ForeignKey(
            "technology.id",
            name="job_tech_technology_id_fkey",
            ondelete="CASCADE",
            onupdate="CASCADE"
        ),
        primary_key=True
    )
