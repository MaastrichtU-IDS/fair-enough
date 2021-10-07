from typing import TYPE_CHECKING

# from sqlalchemy import Boolean, Column, Integer, String
# from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from typing import Optional, List

class User(BaseModel):
    id: str
    sub: str = Field(...)
    name: Optional[str] = None
    family_name: Optional[str] = None
    given_name: Optional[str] = None
    assessments: List[str] = []
