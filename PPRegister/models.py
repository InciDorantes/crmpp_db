from django.db import models
from django.contrib.auth.models import User
import datetime

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('admin', 'Administrador'),
        ('editor', 'Editor'),
        ('viewer', 'Consultor'),
        ('superuser', 'SuperUser'),
        ('ultrauser', 'UltraUser'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    area = models.CharField(max_length=255, default="")
    dependencia = models.CharField(max_length=255, default="")
    siglas = models.CharField(max_length=255, default="")
    clasificacion = models.CharField(max_length=255, default="")
    enlace_titular = models.TextField(default="")
    correo_titular = models.CharField(max_length=255, default="")
    enlace_suplente =models.TextField(default="")
    correo_suplente = models.CharField(max_length=255, default="")

    # Solo necesitas UNA de estas dos relaciones, según lo que quieras hacer:
    # Un editor puede permitir a ciertos usuarios (consultores) ver sus registros
    allowed_viewers = models.ManyToManyField(
        User,
        related_name='can_view_editors',
        blank=True,
        help_text="Usuarios que pueden consultar los registros de este editor"
    )

    def __str__(self):
        return f'{self.user.username} ({self.role})'

#PROGRAMA PRESUPUESTARIO
class programas_p (models.Model):
    id_pp = models.AutoField(primary_key=True)
    nombre_pp = models.CharField(max_length=255)
    num_pp = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"nombre_pp: {self.nombre_pp} | id_pp ={self.id_pp} | num_pp ={self.num_pp} |user ={self.user}"

class permisos_pps(models.Model):
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE)
    users = models.ForeignKey(User, on_delete=models.CASCADE )
    editor = models.BooleanField(default=False)  # Nuevo campo

    def __str__(self):
        return f"Usuario: {self.users.username} | nombre_pp: {self.id_pp.nombre_pp} | Editor: {'Sí' if self.editor else 'No'}"


#ARBOL DE PROBLEMAS V2
class Nodo(models.Model):
    TIPO_CHOICES = [
        (1, 'Causa Indirecta'),
        (2, 'Causa Directa'),
        (3, 'Problema Central'),
        (4, 'Efecto Directo'),
        (5, 'Efecto Indirecto'),
        (6, 'Efecto Superior'),
    ]
    id_nodo =  models.AutoField(primary_key=True)
    id_html = models.CharField(max_length=100, unique=True)
    texto = models.TextField()
    tipo = models.IntegerField(choices=TIPO_CHOICES)
    posicion_x = models.IntegerField()
    posicion_y = models.IntegerField()
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE, related_name="nodos" )

    @property
    def es_origen_de(self):
        return self.conexiones_salida.all()

    @property
    def es_destino_de(self):
        return self.conexiones_entrada.all()
    
class Conexion(models.Model):
    origen = models.ForeignKey(Nodo, on_delete=models.CASCADE, related_name='conexiones_salida')
    destino = models.ForeignKey(Nodo, on_delete=models.CASCADE, related_name='conexiones_entrada')

#ARBOL DE OBJETIVO V2
class NodoAO(models.Model):
    TIPO_CHOICES = [
        (1, 'Medio Indirecto'),
        (2, 'Medio Directo'),
        (3, 'Solucion problema'),
        (4, 'Fin Directo'),
        (5, 'Fin Indirecto'),
        (6, 'Fin Superior'),
    ]
    id_nodo =  models.AutoField(primary_key=True)
    id_html = models.CharField(max_length=100, unique=True)
    texto = models.TextField()
    tipo = models.IntegerField(choices=TIPO_CHOICES)
    posicion_x = models.IntegerField()
    posicion_y = models.IntegerField()
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE, related_name="nodosAO" )

    @property
    def es_origen_de(self):
        return self.conexionesAO_salida.all()

    @property
    def es_destino_de(self):
        return self.conexionesAO_entrada.all()
    
class ConexionAO(models.Model):
    origen = models.ForeignKey(NodoAO, on_delete=models.CASCADE, related_name='conexiones_salida')
    destino = models.ForeignKey(NodoAO, on_delete=models.CASCADE, related_name='conexiones_entrada')


#POBLACIÓN OBJETIVO FORMATO 5
class PoblacionObjetivo(models.Model):
    TIPOS = [
        ("referencia", "Población de Referencia"),
        ("potencial", "Población Potencial o Afectada"),
        ("objetivo", "Población Objetivo"),
        ("postergada", "Población Postergada"),
    ]

    tipo = models.CharField(max_length=20, choices=TIPOS)
    descripcion = models.TextField()
    hombres = models.PositiveIntegerField(default=0)
    mujeres = models.PositiveIntegerField(default=0)
    hablantes_lengua = models.PositiveIntegerField(default=0)
    grupos_edad = models.TextField()
    otros = models.TextField()
    cuantificacion = models.PositiveIntegerField(default=0)
    medios_verificacion = models.TextField()
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE, related_name="poblacion_objetivo")


    def __str__(self):
        return f"{self.get_tipo_display()} - {self.id_pp.nombre_pp}"
    
#ALINEACIÓN AL PLAN ESTATAL
class APED(models.Model):
    id_aped = models.AutoField(primary_key=True)
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE)

    def __str__(self):
        return f"Captura {self.id_aped} para programa {self.id_pp.nombre_pp}"
    
class Directriz(models.Model):
    id_directriz= models.AutoField(primary_key=True)
    directriz = models.CharField(max_length=255)
    id_aped =  models.ForeignKey(APED, on_delete=models.CASCADE)

    def __str__(self):
       return f"id_directriz: {self.id_directriz} | directriz: {self.directriz} | id_pp: {self.id_aped.id_aped}"

class Vertiente(models.Model):
    id_vertiente= models.AutoField(primary_key=True)
    vertiente = models.CharField(max_length=255)
    id_directriz = models.ForeignKey(Directriz, on_delete=models.CASCADE)
    id_aped =  models.ForeignKey(APED, on_delete=models.CASCADE)

    def __str__(self):
        return f"id_vertiente: {self.id_vertiente} | vertiente: {self.vertiente} | id_pp: {self.id_aped.id_aped}"

class ObjetivoEstrategico(models.Model):
    id_objetivo_estrategico= models.AutoField(primary_key=True)
    objetivo_estrategico = models.CharField(max_length=255)
    id_vertiente = models.ForeignKey(Vertiente, on_delete=models.CASCADE)
    id_aped =  models.ForeignKey(APED, on_delete=models.CASCADE)

    def __str__(self):
        return f"id_objetivo_estrategico: {self.id_objetivo_estrategico} | objetivo_estrategico: {self.objetivo_estrategico} | id_aped: {self.id_aped.id_aped}"

class ObjetivoEspecifico(models.Model):
    id_objetivo_especifico= models.AutoField(primary_key=True)
    objetivo_especifico = models.CharField(max_length=255)
    id_objetivo_estrategico = models.ForeignKey(ObjetivoEstrategico, on_delete=models.CASCADE)

    def __str__(self):
        return f"id_objetivo_especifico: {self.id_objetivo_especifico} | objetivo_especifico: {self.objetivo_especifico} | id_objetivo_estrategico: {self.id_objetivo_estrategico.objetivo_estrategico}"

class LineaAccion(models.Model):
    id_linea_accion = models.AutoField(primary_key=True)
    linea_accion = models.CharField(max_length=255)
    id_objetivo_especifico = models.ForeignKey(ObjetivoEspecifico, on_delete=models.CASCADE)

    def __str__(self):
        return f"id_linea_accion: {self.id_linea_accion} | linea_accion: {self.linea_accion} | id_objetivo_especifico: {self.id_objetivo_especifico.objetivo_especifico}"
    
#BIENES Y SERVICIOS
class BienServicio(models.Model):
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE, related_name='bienes_servicios')
    bien = models.TextField()
    descripcion = models.TextField()
    criterio_calidad = models.TextField()
    criterio = models.TextField()

    def __str__(self):
        return f"bien:{self.bien} | descripcion:{self.descripcion} | criterio_calidad: {self.criterio_calidad} | criterio: {self.criterio}"
    
#MATRIZ DE INDICADORES
class FinMir(models.Model):
    id_fin =  models.AutoField(primary_key=True)
    objetivo = models.TextField()
    indicador = models.CharField(max_length=255)
    supuesto = models.TextField()
    medio_verificacion = models.TextField()
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE, related_name='fines')

class PropositoMir (models.Model):
    id_proposito = models.AutoField(primary_key=True)
    objetivo = models.TextField()
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE, related_name='propositos')

class IndicadorPropositoMir (models.Model):
    id_indicador_proposito = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    supuesto = models.TextField()
    medio_verificacion = models.TextField()
    id_proposito = models.ForeignKey(PropositoMir, on_delete=models.CASCADE, related_name="indicadores")

class ComponenteMir (models.Model):
    id_componente = models.AutoField(primary_key=True)
    objetivo = models.TextField()
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE, related_name='componentes')

class IndicadorComponenteMir (models.Model):
    id_indicador_componente = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    supuesto = models.TextField()
    medio_verificacion = models.TextField()
    id_componente = models.ForeignKey(ComponenteMir, on_delete=models.CASCADE, related_name="indicadores")

class ActividadMir (models.Model):
    id_actividad = models.AutoField(primary_key=True)
    objetivo = models.CharField(max_length=255)
    id_componente = models.ForeignKey(ComponenteMir, on_delete=models.CASCADE, related_name="actividades")

class IndicadorActividadMir (models.Model):
    id_indicador_actividad = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    supuesto = models.TextField()
    medio_verificacion = models.TextField()
    id_actividad = models.ForeignKey(ActividadMir, on_delete=models.CASCADE, related_name="indicadores")


#FICHAS
class Componente(models.Model):
    nombre = models.CharField(max_length=255, blank=True)
    numero =  models.CharField(max_length=255)
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        # Generar nombre compuesto: ejemplo "123_componente_1"
        self.nombre = f"{self.id_pp.id_pp}_componente_{self.numero}"
        super().save(*args, **kwargs)
    def __str__(self):
        return f"Componente {self.numero} para programa {self.id_pp.nombre_pp} (id_pp={self.id_pp.id_pp})"

class Actividad(models.Model):
    componente = models.ForeignKey(Componente, on_delete=models.CASCADE)
    numero = models.CharField(max_length=50)
    nombre = models.CharField(max_length=255, blank=True)

    def save(self, *args, **kwargs):
        # "idpp_componente_numcomponente_actividad_numactividad"
        self.nombre = f"{self.componente.id_pp.id_pp}_componente_{self.componente.numero}_actividad_{self.numero}"
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ('componente', 'numero')

class FichaIndicador(models.Model):
    TIPO_CHOICES = [
        ('fin', 'Fin'),
        ('proposito', 'Propósito'),
        ('componente', 'Componente'),
        ('actividad', 'Actividad'),
    ]

    TIPO_INDICADOR_CHOICES = [
        ('porcentaje', 'Porcentaje'),
        ('promedio', 'Promedio'),
        ('variacion_porcentual', 'Variación porcentual'),
        ('razon', 'Razón'),
        ('tasa', 'Tasa'),
        ('diferencia', 'Diferencia'),
        ('indice', 'Índice'),
        ('conteo', 'Conteo'),
        ('lugar', 'Lugar'),
        ('nivel', 'Nivel'),
        ('promedio_variaciones', 'Promedio móvil de las variaciones de tres años'),
        ('promedio_tresaños', 'Promedio móvil de tres años'),
        ('sumatoria', 'Sumatoria'),
    ]

    PERIODICIDAD_CHOICES = [
        ('Mensual', 'Mensual'),
        ('Bimestral', 'Bimestral'),
        ('Trimestral', 'Trimestral'),
        ('Semestral', 'Semestral'),
        ('Bianual', 'Bianual'),
        ('Trianual', 'Trianual'),
        ('Quinquenal', 'Quinquenal'),
        ('Sexenal', 'Sexenal'),
    ]

    TENDENCIA_CHOICES = [
        ('Ascendente', 'Ascendente'),
        ('Descendente', 'Descendente'),
        ('Constante', 'Constante'),
    ]

    AMBITO_CHOICES = [
        ('Resultados a largo plazo', 'Resultados a largo plazo'),
        ('Resultados a mediano plazo', 'Resultados a mediano plazo'),
        ('Servicios/bienes', 'Servicios/bienes'),
        ('Servicios/bienes', 'Servicios/bienes'),
        ('Actividad', 'Actividad'),
        ('Insumos', 'Insumos'),
    ]

    DESEMPENO_CHOICES = [
        ('eficacia', 'Eficacia'),
        ('eficiencia', 'Eficiencia'),
        ('calidad', 'Calidad'),
        ('economia', 'Economía'),
    ]

    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE)
    tipo_ficha = models.CharField(max_length=20, choices=TIPO_CHOICES)
    objetivo = models.TextField()
    nombre_indicador = models.CharField(max_length=255)

    # Metadatos con choices definidos
    definicion = models.TextField(blank=True)
    tipo_indicador = models.CharField(max_length=50, choices=TIPO_INDICADOR_CHOICES)
    tipo_algoritmo = models.CharField(max_length=50, blank=True)
    periodicidad = models.CharField(max_length=20, choices=PERIODICIDAD_CHOICES,  default='Anual'  )
    tendencia = models.CharField(max_length=20, choices=TENDENCIA_CHOICES,  default='Ascendente'  )
    ambito_medicion = models.CharField(max_length=50, choices=AMBITO_CHOICES,  default='Resultados a largo plazo'  )
    dimension_desempeno = models.CharField(max_length=20, choices=DESEMPENO_CHOICES,  default='Eficacia' )

    # Relaciones jerárquicas
    componente = models.ForeignKey('Componente', on_delete=models.CASCADE, null=True, blank=True, related_name='fichas')
    actividad = models.ForeignKey('Actividad', on_delete=models.CASCADE, null=True, blank=True, related_name='fichas')

    def __str__(self):
        return f'{self.get_tipo_ficha_display()} - {self.nombre_indicador}'
    
class Variable(models.Model):
    ficha = models.ForeignKey(FichaIndicador, on_delete=models.CASCADE, related_name='variables')
    nombre = models.CharField(max_length=255)
    medio_verificacion = models.TextField()
    orden = models.PositiveSmallIntegerField(default=0)  # Para ordenar visualmente en el frontend

    def __str__(self):
        return f"{self.nombre} ({self.ficha.nombre_indicador})"
    
class LineaBase(models.Model):
    variable = models.OneToOneField(Variable, on_delete=models.CASCADE, related_name='linea_base')
    valor = models.DecimalField(max_digits=20, decimal_places=2)
    unidad_medida = models.CharField(max_length=100)
    fecha = models.DateField(default=datetime.date(2000, 2, 17))

    resultado_estimado = models.DecimalField(max_digits=20, decimal_places=2)
    unidad_resultado = models.CharField(max_length=100)
    fecha_resultado = models.DateField(default='2000-02-17')

class Meta(models.Model):
    variable = models.OneToOneField(Variable, on_delete=models.CASCADE, related_name='meta')
    valor = models.DecimalField(max_digits=20, decimal_places=2)
    unidad_medida = models.CharField(max_length=100)
    fecha = models.DateField(default=datetime.date(2000, 2, 17))

    resultado_estimado = models.DecimalField(max_digits=20, decimal_places=2)
    unidad_resultado = models.CharField(max_length=100)
    fecha_resultado = models.DateField(default=datetime.date(2000, 2, 17))

#FORMATO 1
class FormatoUno(models.Model):
    id_formatouno = models.AutoField(primary_key=True)
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE, related_name='detalles')
    nombre= models.CharField(max_length=255)
    lugar_implementacion =  models.TextField()
    objetivo = models.TextField()
    descripcion = models.TextField()
    poblacion_objetivo = models.TextField()
    bienes_servicios = models.TextField()
    resultados_evaluacion = models.TextField()
    vinculo_documento =  models.TextField()

    
# FORMATO 2
INTERDEPENDENCIA_CHOICES = [
    ('complementario', "1= Complementario"),
    ('dupli', '2= Posible Duplicidad'),
]

class FormatoDos(models.Model):
    id_formatodos =models.AutoField(primary_key=True)
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE, related_name='formatodos')
    nombre = models.CharField(max_length=255)
    tipo_programa = models.CharField(max_length=50)
    objetivo = models.TextField()
    poblacion_objetivo = models.TextField()
    bienes_servicios = models.TextField()
    cobertura = models.CharField(max_length=255)
    institucion_coordinadora = models.TextField()
    interdependencia = models.CharField(choices=INTERDEPENDENCIA_CHOICES)
    descripcion_interdependencia = models.TextField()


#FORMATO 3
class FormatoTres (models.Model):
    id_formatotres =models.AutoField(primary_key=True)
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE, related_name='formatotres')
    tipo_actor =models.CharField(max_length=255)
    nombre = models.CharField(max_length=255)
    descripcion =models.TextField()
    posicion = models.CharField(max_length=255)
    influencia = models.CharField(max_length=255)

    
#FORMATO 4
class FormatoCuatro(models.Model):
    id_pp = models.OneToOneField(
        programas_p,
        on_delete=models.CASCADE,
        related_name='formato_cuatro'
    )

    # Campos para cada criterio
    descripcion_nivel_ingreso = models.TextField()
    justificacion_nivel_ingreso = models.TextField()

    descripcion_sexo = models.TextField()
    justificacion_sexo = models.TextField()

    descripcion_grupo_etario = models.TextField()
    justificacion_grupo_etario = models.TextField()

    descripcion_lengua_indigena = models.TextField()
    justificacion_lengua_indigena = models.TextField()

    descripcion_ubicacion_geografica = models.TextField()
    justificacion_ubicacion_geografica = models.TextField()

    descripcion_otros_criterios = models.TextField(blank=True, null=True)
    justificacion_otros_criterios = models.TextField(blank=True, null=True)

#FORMATO 6
class Municipios (models.Model):
    id_municipio = models.AutoField(primary_key=True)
    municipio =models.CharField(max_length=255)
    poblacion = models.IntegerField(default=0)

class Formato6(models.Model):
    id_municipio = models.ForeignKey(Municipios, on_delete=models.CASCADE)
    id_pp= models.ForeignKey(programas_p, on_delete=models.CASCADE)

    localidades = models.PositiveIntegerField(default=0)  # Número de localidades
    cuantificacion_general = models.PositiveIntegerField(default=0)  # Input libre

    # Seis tipos de cuantificación fijos
    tipo1 = models.PositiveIntegerField(default=0)
    tipo2 = models.PositiveIntegerField(default=0)
    tipo3 = models.PositiveIntegerField(default=0)
    tipo4 = models.PositiveIntegerField(default=0)
    tipo5 = models.PositiveIntegerField(default=0)
    tipo6 = models.PositiveIntegerField(default=0)

    # Dos porcentajes fijos
    porcentaje1 = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    porcentaje2 = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)

    class Meta:
        unique_together = ('id_municipio', 'id_pp')

#FORMATO 9
class Formato9(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE, related_name="registros_formato")
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE)  # el programa actual

    funcion = models.TextField(blank=True)
    interactua_con = models.TextField(blank=True)
    mecanismo = models.TextField(blank=True)
    responsabilidad = models.TextField(blank=True)
    atribucion = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.username.username} | {self.id_pp.id_pp}"

#FORMATO 12
class FormatoDoce(models.Model):
    variable = models.ForeignKey(Variable, on_delete=models.CASCADE, related_name='formatodoce')
    registro = models.CharField(max_length=255, blank=True, null=True)
    desagregacion = models.TextField(blank=True, null=True)
    programa = models.TextField(blank=True, null=True)
    instrumentos = models.CharField(max_length=255, blank=True, null=True)
    responsable = models.CharField(max_length=255, blank=True, null=True)
    periodicidad = models.CharField(max_length=100, blank=True, null=True)
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE)  

    def __str__(self):
        return f'Registro de {self.variable.nombre}'

#FORMATO 13
class FormatoTrece(models.Model):
    nombre_reporte = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    periodicidad = models.CharField(max_length=100, blank=True)
    responsable_integracion = models.CharField(max_length=255, blank=True)
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE)  # el programa actual
    
    # Opcional: si quieres distinguir entre los predeterminados y los agregados por el usuario
    es_predeterminado = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre_reporte
    
#FORMATO 14
class FormatoCatorce(models.Model):
    ficha = models.ForeignKey(FichaIndicador, on_delete=models.CASCADE, related_name='formato14')
    variable = models.ForeignKey(Variable, on_delete=models.CASCADE, related_name='formato14')
    meta_2025 = models.PositiveIntegerField(default=0)
    meta_2026 = models.PositiveIntegerField(default=0)
    meta_2027 = models.PositiveIntegerField(default=0)
    meta_2028 = models.PositiveIntegerField(default=0)
    meta_2029 = models.PositiveIntegerField(default=0)
    meta_2030 = models.PositiveIntegerField(default=0)
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE)
    
#FORMATO 15
class FormatoQuince(models.Model):
    concepto = models.CharField(max_length=255)
    total = models.PositiveIntegerField(default=0)

    # Campos para cada año
    anio_2025 = models.PositiveIntegerField(default=0) 
    anio_2026 = models.PositiveIntegerField(default=0)
    anio_2027 = models.PositiveIntegerField(default=0)
    anio_2028 = models.PositiveIntegerField(default=0)
    anio_2029 = models.PositiveIntegerField(default=0)
    anio_2030 = models.PositiveIntegerField(default=0)
    poblacion_objetivo = models.ForeignKey(PoblacionObjetivo, on_delete=models.CASCADE,related_name='filas_formato15')
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE)
    

    def __str__(self):
        return self.concepto
    
#FORMATO 16
class FormatoDieciseis(models.Model):
    id_registro = models.AutoField(primary_key=True)
    componente = models.ForeignKey(ComponenteMir, on_delete=models.CASCADE, related_name='formato16')
    meta_medianoplazo = models.TextField()
    meta_2025 = models.TextField()
    meta_2026= models.TextField()
    meta_2027 = models.TextField()
    meta_2028 = models.TextField()
    meta_2029 = models.TextField()
    meta_2030 = models.TextField()

class Subformato16 (models.Model):
    registro = models.ForeignKey(FormatoDieciseis, on_delete=models.CASCADE, related_name='subformato16')
    presupuesto_2025 = models.PositiveIntegerField(default=0)
    cog = models.PositiveIntegerField(choices=[(1000, '1000'), (2000, '2000'), (3000, '3000'),
                                              (4000, '4000'), (5000, '5000'), (6000, '6000'),
                                              (7000, '7000'), (8000, '8000'), (9000, '9000')])
    presupuesto_2026= models.PositiveIntegerField(default=0)
    presupuesto_2027 = models.PositiveIntegerField(default=0)
    presupuesto_2028 = models.PositiveIntegerField(default=0)
    presupuesto_2029 = models.PositiveIntegerField(default=0)
    presupuesto_2030 = models.PositiveIntegerField(default=0)
    
#FORMATO 17
class FuenteFinanciamiento (models.Model):
    id_ff = models.AutoField(primary_key=True)
    numero = models.IntegerField(default=0)
    nombre = models.CharField(max_length=255)

class RegistroFormatoDieciciete (models.Model):
    id_registro = models.AutoField(primary_key=True)
    id_ff =  models.ForeignKey(FuenteFinanciamiento, on_delete=models.CASCADE)
    presupuesto_2025 = models.PositiveIntegerField(default=0)
    presupuesto_2026 = models.PositiveIntegerField(default=0)
    presupuesto_2027 = models.PositiveIntegerField(default=0)
    presupuesto_2028 = models.PositiveIntegerField(default=0)
    presupuesto_2029 = models.PositiveIntegerField(default=0)
    presupuesto_2030 = models.PositiveIntegerField(default=0)
    id_pp = models.ForeignKey(programas_p, on_delete=models.CASCADE)