import pandas as pd
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import transaction
from django.contrib.auth.hashers import make_password
from PPRegister.models import UserProfile  # Ajusta si tu app no se llama "usuarios"


class Command(BaseCommand):
    help = 'Crea usuarios y perfiles a partir de un archivo Excel, y agrega columna de contraseña'

    def add_arguments(self, parser):
        parser.add_argument('archivo_excel', type=str, help='Ruta al archivo .xlsx')

    def handle(self, *args, **options):
        archivo = options['archivo_excel']

        try:
            df = pd.read_excel(archivo)
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error leyendo el archivo: {e}"))
            return

        total = len(df)
        creados = 0
        errores = 0
        contraseñas_generadas = []

        for i, row in df.iterrows():
            username = str(row['user']).strip()
            siglas = str(row.get('siglas', '')).strip()
            area = str(row.get('area', '')).strip()
            clasificacion = str(row.get('clasificacion', '')).strip()
            email_titular = str(row['Correo de enlace titular']).strip()
            role = str(row['role']).strip()

            # Generar contraseña como "user*siglas"
            contraseña_plana = f"{username}*{siglas}"
            contraseñas_generadas.append(contraseña_plana)

            try:
                with transaction.atomic():
                    user, created = User.objects.get_or_create(
                        username=username,
                        defaults={
                            'email': email_titular,
                            'password': make_password(contraseña_plana),
                        }
                    )

                    profile, _ = UserProfile.objects.get_or_create(user=user)
                    profile.role = role
                    profile.dependencia = row.get('dependencia', '')
                    profile.area = area
                    profile.siglas = siglas
                    profile.clasificacion = clasificacion
                    profile.enlace_titular = row.get('Nombre de enlace titular', '')
                    profile.correo_titular = email_titular
                    profile.enlace_suplente = row.get('Nombre de enlace suplente', '')
                    profile.correo_suplente = row.get('Correo de enlace suplente', '')
                    profile.save()

                    creados += 1
                    self.stdout.write(self.style.SUCCESS(f'✔ Usuario procesado: {username}'))

            except Exception as e:
                errores += 1
                self.stderr.write(self.style.ERROR(f'❌ Error con {username}: {e}'))
                contraseñas_generadas[-1] = 'ERROR'

        # Añadir columna de contraseña al DataFrame
        df['contraseña'] = contraseñas_generadas

        # Guardar el archivo con contraseñas (sobrescribe el original)
        try:
            df.to_excel(archivo, index=False)
            self.stdout.write(self.style.SUCCESS(f'\n📝 Excel actualizado con contraseñas: {archivo}'))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'⚠️ No se pudo guardar el Excel actualizado: {e}'))

        self.stdout.write(self.style.SUCCESS(
            f"\n✅ Proceso terminado. Total: {total}, Creados/Actualizados: {creados}, Errores: {errores}"
        ))
