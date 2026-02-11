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
    luminosidade: Optional[float] = None
    vento: Vento
