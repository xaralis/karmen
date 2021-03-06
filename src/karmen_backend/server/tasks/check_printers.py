import redis
from server import app, celery
from server.database import printers
from server import drivers

redis = redis.Redis(
    host=app.config["WEBCAM_PROXY_CACHE_HOST"],
    port=app.config["WEBCAM_PROXY_CACHE_PORT"],
)


@celery.task(name="check_printers")
def check_printers():
    app.logger.debug("Checking known printers...")
    for raw_printer in printers.get_printers():
        printer = drivers.get_printer_instance(raw_printer)
        printer.is_alive()

        if printer.client.connected:
            webcam = printer.webcam()
            try:
                if "stream" in webcam:
                    redis.set("webcam_%s" % (printer.ip,), webcam["stream"])
                else:
                    redis.delete("webcam_%s" % (printer.ip,))
            except Exception as e:
                app.logger.error(
                    "Cannot save webcam proxy information into cache: %s", e
                )

        printers.update_printer(
            name=printer.name,
            hostname=printer.hostname,
            ip=printer.ip,
            client=printer.client_name(),
            client_props={
                "version": printer.client.version,
                "connected": printer.client.connected,
                "read_only": printer.client.read_only,
            },
        )
