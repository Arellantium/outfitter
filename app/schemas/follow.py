from pydantic import BaseModel

class FollowBase(BaseModel):
    id: int
    follower_id: int
    seguito_id: int

    class Config:
        from_attributes = True