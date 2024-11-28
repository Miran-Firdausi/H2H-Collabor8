from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("task_automation.urls")),
    path("", include("projects.urls")),
    path("", include("chat.urls")),
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.jwt")),
    path("auth/", include("djoser.social.urls")),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# urlpatterns += [re_path(r"^.*", TemplateView.as_view(template_name="index.html"))]
