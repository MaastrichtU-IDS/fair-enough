from celery import Celery

celery_app = Celery(
    "worker", 
    broker="amqp://guest@queue//", 
    backend="amqp://guest@queue//",
    # include=['app.worker.run_evaluation']
)

celery_app.conf.task_routes = {"app.worker.run_evaluation": "main-queue"}
