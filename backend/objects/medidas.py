from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class Medidas(BaseModel):
    id: Optional[int] = None
    data: Optional[datetime] = None

    temp1: Optional[float] = None
    temp2: Optional[float] = None
    temp3: Optional[float] = None
    temp4: Optional[float] = None

    umid1: Optional[float] = None
    umid2: Optional[float] = None
    umid3: Optional[float] = None

    press1: Optional[float] = None
    press2: Optional[float] = None
    press3: Optional[float] = None

    lum: Optional[float] = None
    vel_vent: Optional[float] = None
    dir_vent: Optional[float] = None

    class Config:
        schema_extra = {
            "example": {
                "data": "2026-02-10T12:00:00",
                "temp1": 25.3,
                "umid1": 60.5,
                "press1": 1013.25,
                "lum": 123.4,
                "vel_vent": 3.2,
                "dir_vent": 180
            }
        }
