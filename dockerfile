# Usa la imagen oficial de Python 3.11 con una base slim
FROM python:3.11-slim

# Establece el directorio de trabajo en /app
WORKDIR /app

# Instala las dependencias del sistema necesarias para compilar paquetes
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    musl-dev \
    libffi-dev \
    graphviz \
    && rm -rf /var/lib/apt/lists/*

# Copia el archivo de requisitos
COPY requirements.txt .

# Instala las dependencias de Python en el contenedor
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copia el resto del código fuente
COPY . .

# Expone el puerto 8000 para el servidor
EXPOSE 8000

# Definir un comando para ejecutar el servidor de desarrollo (usualmente con Django)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
