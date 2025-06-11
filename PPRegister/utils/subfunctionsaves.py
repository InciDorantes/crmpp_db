from datetime import datetime
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from collections import Counter
import math
from django.db.models import Q
from math import sqrt
import os
from PPRegister.models import Nodo, Conexion, NodoAO, ConexionAO

# import openai
# client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
# completion = client.chat.completions.create(
#   model="gpt-4o-mini",
#   messages=[
#       {
#           "role": "user",
#           "content": "Escribe las partes del arbol de objetivos con base al arbol de problemas"
#       }
#   ]
# )

def parse_decimal(value, default=0):
    try:
        d = Decimal(value)
    except (InvalidOperation, TypeError, ValueError):
        d = Decimal(default)
    # Redondea a 1 decimal
    return d.quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)
def parse_date(value):
    try:
        return datetime.strptime(value, '%Y-%m-%d').date() if value else None
    except (ValueError, TypeError):
        return None
    
def capitalize_if_string(value):
    if isinstance(value, str) and value:
        return value.capitalize()
    return value

def safe_int(val):
    try:
        return int(val)
    except (TypeError, ValueError):
        return 0
    
def fecha_valida(fecha_str):
    return fecha_str if fecha_str else '2000-02-17'

def tipo_str_a_codigo(tipo_str):
    tipos = {
        'causa_indirecta': 1,
        'causa_directa': 2,
        'problema_central': 3,
        'efecto_directo': 4,
        'efecto_indirecto': 5,
        'efecto_superior': 6
    }
    return tipos.get(tipo_str.lower(), 0)

def tipo_str_a_codigo_ao(tipo_str):
    tipos = {
        'medio_indirecto': 1,
        'medio_directo': 2,
        'solucion_problema': 3,
        'fin_directo': 4,
        'fin_indirecto': 5,
        'fin_superior': 6
    }
    return tipos.get(tipo_str.lower(), 0)

# def openai_contest(a, problema, objetivo):
#     system_prompt = (f"De un arbol de problemas, considerando su {a} que es '{problema}', genera su {objetivo}, en una frase simple, considerando al sujeto si es que lo hay, no des contexto, solo la respuesta directamente con una frase sin comillas.")
#     response = client.chat.completions.create(
#         model="gpt-4o",
#         messages=[
#             {"role": "system", "content": system_prompt}
#         ]
#     )
    
#     return response.choices[0].message.content

#Modificación al AO por el AP

def detectar_cambios_arbol_problemas(arbol_viejo, arbol_nuevo):
    # Paso 1: Obtener los id_html de cada árbol
    ids_html_viejo = set(nodo['id_html'] for nodo in arbol_viejo['nodos'])
    ids_html_nuevo = set(nodo['id_html'] for nodo in arbol_nuevo['nodos'])

    # Paso 2: Identificar nodos nuevos y eliminados
    ids_nodos_nuevos = ids_html_nuevo - ids_html_viejo
    ids_nodos_eliminados = ids_html_viejo - ids_html_nuevo

    hubo_cambios = bool(ids_nodos_nuevos or ids_nodos_eliminados)

    # Paso 3: Crear diccionarios para acceso rápido
    dic_nuevo = {n['id_html']: n for n in arbol_nuevo['nodos']}
    dic_viejo = {n['id_html']: n for n in arbol_viejo['nodos']}

    # Paso 4: Obtener nodos completos
    nodos_nuevos = [dic_nuevo[id_html] for id_html in ids_nodos_nuevos]
    nodos_eliminados = [dic_viejo[id_html] for id_html in ids_nodos_eliminados]

    # Paso 5: Obtener todas las conexiones (origen_id_html, destino_id_html) en cada árbol

    # Paso 1: Mapear id_nodo a id_html en arbol_viejo
    id_nodo_a_id_html = {nodo['id_nodo']: nodo['id_html'] for nodo in arbol_viejo['nodos']}
    # Paso 2: Construir conjuntos de conexiones
    conexiones_nuevo = set(
        (conexion['origen'], conexion['destino']) for conexion in arbol_nuevo.get('conexiones', [])
    )
    conexiones_viejo = set()
    for conexion in arbol_viejo.get('conexiones', []):
        origen_id_html = id_nodo_a_id_html.get(conexion['origen_id'])
        destino_id_html = id_nodo_a_id_html.get(conexion['destino_id'])
        if origen_id_html and destino_id_html:
            conexiones_viejo.add((origen_id_html, destino_id_html))

    # Paso 3: Identificar conexiones nuevas y eliminadas
    conexiones_nuevas = conexiones_nuevo - conexiones_viejo
    conexiones_eliminadas = conexiones_viejo - conexiones_nuevo 

    return nodos_nuevos, conexiones_nuevas, nodos_eliminados, conexiones_eliminadas, hubo_cambios

def actualizar_arbol_objetivos(nuevos_nodos, nuevas_conexiones, nodos_eliminados, conexiones_eliminadas, id_pp):
    print(f"nuevo con: {nuevas_conexiones}")
    """
    Actualiza el árbol de objetivos en la base de datos (NodoAO y ConexionAO),
    creando nodos nuevos (con texto vacío y posición igual al árbol nuevo) y conexiones nuevas,
    y eliminando nodos y conexiones eliminadas.

    El id_html se transforma según equivalencias.
    """
    equivalencias = {
        "efecto_superior": "fin_superior",
        "efecto_indirecto": "fin_indirecto",
        "efecto_directo": "fin_directo",
        "causa_directa": "medio_directo",
        "causa_indirecta": "medio_indirecto",
        "problema_central": "solucion_problema"
    }

    tipo_objetivo = {
        "causa_indirecta": 1,
        "causa_directa": 2,
        "problema_central": 3,
        "efecto_directo": 4,
        "efecto_indirecto": 5,
        "efecto_superior": 6,
    }
    print("entro la funcion")

    def transformar_id_html(id_str):
        partes = id_str.split("_", 2)
        primera_parte = f"{partes[0]}_{partes[1]}"
        resto = id_str[len(primera_parte) + 1:] 
        nueva_parte = equivalencias.get(primera_parte, primera_parte)
        id_html = f"{nueva_parte}_{resto}"
        return id_html 

    id_map = {}  # para mapear id_html viejo -> NodoAO recién creado
    # 1. Crear nodos nuevos con texto vacío y posición del nodo nuevo
    for nodo in nuevos_nodos:
        id_html_ao = transformar_id_html(nodo['id_html'])
        print(id_html_ao)
        
        tipo = tipo_objetivo.get(nodo['tipo'], None)
        print(tipo)
        
        if tipo is None:
            continue  # o manejar error si el tipo no está en el dict

        # Verificar si ya existe el nodo para no crear duplicados
        nodo_ao_existente = NodoAO.objects.filter(id_html=id_html_ao, id_pp_id=id_pp).first()
        if nodo_ao_existente:
            id_map[nodo['id_html']] = nodo_ao_existente
            continue

        nodo_ao = NodoAO.objects.create(
            id_html=id_html_ao,
            texto="",  # texto vacío según indicación
            tipo=tipo,
            posicion_x=nodo['posicion_x'],
            posicion_y=nodo['posicion_y'],
            id_pp_id=id_pp
        )
        id_map[nodo['id_html']] = nodo_ao

    # 2. Crear conexiones nuevas
    for origen_html_pp, destino_html_pp in nuevas_conexiones:
        origen_html_ao = transformar_id_html(origen_html_pp)
        destino_html_ao = transformar_id_html(destino_html_pp)

        origen_nodo = id_map.get(origen_html_pp) or NodoAO.objects.filter(id_html=origen_html_ao, id_pp_id=id_pp).first()
        destino_nodo = id_map.get(destino_html_pp) or NodoAO.objects.filter(id_html=destino_html_ao, id_pp_id=id_pp).first()

        if origen_nodo and destino_nodo:
            existe = ConexionAO.objects.filter(origen=origen_nodo, destino=destino_nodo).exists()
            if not existe:
                ConexionAO.objects.create(origen=origen_nodo, destino=destino_nodo)

    # 3. Eliminar conexiones eliminadas
    for origen_html_pp, destino_html_pp in conexiones_eliminadas:
        origen_html_ao = transformar_id_html(origen_html_pp)
        destino_html_ao = transformar_id_html(destino_html_pp)
        print(origen_html_ao, destino_html_ao)

        ConexionAO.objects.filter(
            origen__id_html=origen_html_ao,
            destino__id_html=destino_html_ao,
            origen__id_pp=id_pp,
            destino__id_pp=id_pp
        ).delete()
        print("conexion eliminada")

    # 4. Eliminar nodos eliminados
    for nodo in nodos_eliminados:
        print(f"nodo a elimianr:{nodo['id_nodo'] }")
        NodoAO.objects.filter(id_html=transformar_id_html(nodo['id_html']), id_pp_id=id_pp).delete()

