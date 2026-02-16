from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import models, schemas
from ..core.dependencies import get_current_user

router = APIRouter(prefix="/api/posts", tags=["Posts"])


@router.post("/", response_model=schemas.PostResponse)
def create_post(
    post_data: schemas.PostCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    new_post = models.Post(
        user_id=current_user.id,
        title=post_data.title,
        content=post_data.content,
        status="draft"
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post


@router.get("/", response_model=List[schemas.PostResponse])
def get_posts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Post).filter(
        models.Post.user_id == current_user.id
    ).order_by(models.Post.updated_at.desc()).all()


@router.get("/{post_id}", response_model=schemas.PostResponse)
def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    post = db.query(models.Post).filter(
        models.Post.id == post_id,
        models.Post.user_id == current_user.id
    ).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    return post


@router.patch("/{post_id}", response_model=schemas.PostResponse)
def update_post(
    post_id: int,
    post_data: schemas.PostUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    post = db.query(models.Post).filter(
        models.Post.id == post_id,
        models.Post.user_id == current_user.id
    ).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post_data.title is not None:
        post.title = post_data.title

    if post_data.content is not None:
        post.content = post_data.content

    if post_data.status is not None:
        post.status = post_data.status

    db.commit()
    db.refresh(post)

    return post


@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    post = db.query(models.Post).filter(
        models.Post.id == post_id,
        models.Post.user_id == current_user.id
    ).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    db.delete(post)
    db.commit()

    return {"message": "Post deleted successfully"}
