import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "collabor8.settings")

import django

django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from chat import routing as chat_routing
from rtc.routing import websocket_urlpatterns as rtc_websocket_urlpatterns


application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(
                chat_routing.websocket_urlpatterns
                + rtc_websocket_urlpatterns  # Merging both routing lists
            )
        ),
    }
)
