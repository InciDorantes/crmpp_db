from django.urls import path
from .import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('registro/<int:id_pp>/', views.registro, name='registro'),
    path('visualizar/<int:id_pp>/', views.visualizar, name='visualizar'),
    path('descargar/<int:id_pp>/', views.generar_excel, name='generar_excel'),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)