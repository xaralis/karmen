from datetime import datetime

from server import app, celery
from server.database import settings
from server.database import printers
from server.database import network_devices
from server.services.network import do_arp_scan, get_avahi_hostname
from server.tasks.sniff_printer import sniff_printer


@celery.task(name="discover_printers")
def discover_printers():
    if not settings.get_val("network_discovery"):
        return
    app.logger.debug("Discovering network printers...")
    now = datetime.utcnow()
    to_deactivate = printers.get_printers()
    to_skip_ip = [
        device["ip"]
        for device in network_devices.get_network_devices()
        if (device["retry_after"] and device["retry_after"] > now) or device["disabled"]
    ]
    for line in do_arp_scan(settings.get_val("network_interface")):
        (ip, _) = line
        to_deactivate = [printer for printer in to_deactivate if printer["ip"] != ip]
        if ip in to_skip_ip:
            continue
        hostname = get_avahi_hostname(ip)
        # it's communicating, let's sniff it for a printer
        sniff_printer.delay(hostname, ip)

    for printer in to_deactivate:
        app.logger.debug(
            "%s (%s) was not encountered on the network, deactivating"
            % (printer["hostname"], printer["ip"])
        )
        printer["client_props"]["connected"] = False
        printers.update_printer(**printer)
