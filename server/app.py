#!env/bin/python

from datetime import datetime
from flashcard.core.config import APP_NAME
from flashcard.core import events as _e
from flashcard.core.review import get_latest_deck_review, get_deck_score
from flashcard.models.schema import User, Deck, Card
from flashcard.routes import routes_blueprint
from flashcard import event
from celery.schedules import crontab
from flask import Flask
from celery import Celery
from flashcard.core.utils import send_mail
from sqlalchemy.sql import func
import pandas as pd
from io import StringIO

def create_app() -> Flask:
    app = Flask(APP_NAME, template_folder="template", static_folder="static")
    
    event.emit("before_start", app)
    app.register_blueprint(routes_blueprint)

    return app

def make_celery(app):
    #Celery configuration
    app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
    app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/0'
    app.config['CELERYBEAT_SCHEDULE'] = {
        # Executes every minute
        'DailyRemainder-Task': {
            'task': 'daily_remainder',
            'schedule': crontab(hour=18, minute=0)
        },
        'MonthlyReport-Task': {
            'task': 'monthly_report',
            'schedule': crontab(0, 0, day_of_month='1')
        }
    }

    celery = Celery(app.import_name, broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)
    TaskBase = celery.Task
    class ContextTask(TaskBase):
        abstract = True
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)
    celery.Task = ContextTask
    return celery

app: Flask = create_app()

if __name__ == "__main__":
    # start beat: celery -A main.celery beat --loglevel=INFO
    # start worker: celery -A main.celery worker --loglevel=info
    app.run(load_dotenv=False, port=80, threaded=True)