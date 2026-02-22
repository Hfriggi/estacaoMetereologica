from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime


class Temperatura(BaseModel):
    sensor1: Optional[float] = None
    sensor2: Optional[float] = None
    sensor3: Optional[float] = None
    sensor4: Optional[float] = None


class Umidade(BaseModel):
    sensor1: Optional[float] = None
    sensor2: Optional[float] = None
    sensor3: Optional[float] = None


class Pressao(BaseModel):
    sensor1: Optional[float] = None
    sensor2: Optional[float] = None
    sensor3: Optional[float] = None


class Vento(BaseModel):
    velocidade: Optional[float] = None
    direcao: Optional[float] = None

class MedidaResponse(BaseModel):
    id: int
    data: datetime
    temperatura: Temperatura
    umidade: Umidade
    pressao: Pressao
    luminosidade: Optional[float]
    vento: Vento

    @classmethod
    def from_db(cls, row: dict):
        return cls(
            id=row["id"],
            data=row["data"],
            temperatura=Temperatura(
                sensor1=row.get("temp1"),
                sensor2=row.get("temp2"),
                sensor3=row.get("temp3"),
                sensor4=row.get("temp4"),
            ),
            umidade=Umidade(
                sensor1=row.get("umid1"),
                sensor2=row.get("umid2"),
                sensor3=row.get("umid3"),
            ),
            pressao=Pressao(
                sensor1=row.get("press1"),
                sensor2=row.get("press2"),
                sensor3=row.get("press3"),
            ),
            luminosidade=row.get("lum"),
            vento=Vento(
                velocidade=row.get("vel_vent"),
                direcao=row.get("dir_vent"),
            )
        )