from .subfunctionsaves import capitalize_if_string #, openai_contest
from django.core.exceptions import ObjectDoesNotExist
import json
from collections import defaultdict
from django.db.models import Case, When, Value, IntegerField
#MODELOS
from PPRegister.models import programas_p, UserProfile
from PPRegister.models import PoblacionObjetivo
from PPRegister.models import APED, Directriz, Vertiente, ObjetivoEstrategico, ObjetivoEspecifico, LineaAccion
from PPRegister.models import FinMir, PropositoMir, IndicadorPropositoMir, ComponenteMir, IndicadorComponenteMir,ActividadMir, IndicadorActividadMir
from PPRegister.models import Componente, Actividad, FichaIndicador,Variable,LineaBase, Meta
from PPRegister.models import Nodo, Conexion, NodoAO, ConexionAO, Formato9, Municipios, Formato6, FormatoDoce, FormatoTrece, FormatoQuince
from PPRegister.models import RegistroFormatoDieciciete, FuenteFinanciamiento, FormatoCatorce, FormatoDieciseis, Subformato16


def estructura_AP(id_pp):
    nodos_qs = Nodo.objects.filter(id_pp=id_pp)
    nodos = list(nodos_qs.values('id_nodo','id_html', 'texto', 'tipo', 'posicion_x', 'posicion_y'))

    ids_nodos= nodos_qs.values_list('id_nodo', flat=True)

    conexiones = list(
        Conexion.objects.filter(
            origen__id_nodo__in=ids_nodos,
            destino__id_nodo__in=ids_nodos
        ).values('origen_id', 'destino_id') 
    )

    return ({'nodos': nodos, 'conexiones': conexiones})

def estructura_AO(id_pp):
    nodos_qs = NodoAO.objects.filter(id_pp=id_pp)
    nodos = list(nodos_qs.values('id_nodo','id_html', 'texto', 'tipo', 'posicion_x', 'posicion_y'))

    ids_nodos= nodos_qs.values_list('id_nodo', flat=True)

    conexiones = list(
        ConexionAO.objects.filter(
            origen__id_nodo__in=ids_nodos,
            destino__id_nodo__in=ids_nodos
        ).values('origen_id', 'destino_id') 
    )

    return ({'nodos': nodos, 'conexiones': conexiones})

# Diccionario de mapeo de tipo problema -> tipo objetivo
PROBLEMA_OBJETIVO_MAP = {
    1: (1, 'medio indirecto'),
    2: (2, 'medio directo'),
    3: (3, 'solución del problema'),
    4: (4, 'fin directo'),
    5: (5, 'fin indirecto'),
    6: (6, 'fin superior'),
}
def generar_arbol_objetivos(data):
    """
    Genera un árbol de objetivos a partir de un árbol de problemas, manteniendo
    las conexiones y posiciones para que se visualice igual en jsPlumb.

    Parámetro:
    - data: dict con 'nodos' y 'conexiones'

    Retorna:
    - dict con 'nodos' transformados y 'conexiones' iguales
    """
    reemplazos = {
    "efecto_superior": "fin_superior",
    "efecto_indirecto": "fin_indirecto",
    "efecto_directo": "fin_directo",
    "causa_directa": "medio_directo",
    "causa_indirecta": "medio_indirecto",
    "problema_central": "solucion_problema"
    }

    nodos_problema = data['nodos']
    conexiones = data['conexiones']
    
    nodos_objetivo = []

    for nodo in nodos_problema:
        texto_problema = nodo['texto']
        tipo_problema = nodo['tipo']

        if tipo_problema not in PROBLEMA_OBJETIVO_MAP:
            continue  # Ignorar tipos no válidos

        tipo_objetivo, etiqueta_objetivo = PROBLEMA_OBJETIVO_MAP[tipo_problema]

        texto_objetivo = ""
        # openai_contest(
        #     a=texto_problema,
        #     problema=f"problema tipo {tipo_problema}",
        #     objetivo=etiqueta_objetivo
        # )

        id_str = nodo['id_html']
        partes = id_str.split("_", 2)
        primera_parte = f"{partes[0]}_{partes[1]}"
        resto = id_str[len(primera_parte) + 1:] 
        nueva_parte = reemplazos.get(primera_parte, primera_parte)
        id_html_ao = f"{nueva_parte}_{resto}"
        
        nodos_objetivo.append({
            'id_nodo': nodo['id_nodo'],
            'id_html': id_html_ao,
            'texto': texto_objetivo,
            'tipo': tipo_objetivo,
            'posicion_x': nodo['posicion_x'],
            'posicion_y': nodo['posicion_y']
        })

    return {
        'nodos': nodos_objetivo,
        'conexiones': conexiones 
    }

def generar_estructura_aped(id_pp):
    try:
        apeds = APED.objects.filter(id_pp_id=id_pp)
        estructura = {}

        for i, aped in enumerate(apeds, start=1):
            registro_key = f"registro{i}"
            estructura[registro_key] = {
                'directriz': '',
                'vertiente': '',
                'objetivo_estrategico': '',
                'objetivo_especifico': [],
                'linea_accion': []
            }

            directriz = aped.directriz_set.first()
            if directriz:
                estructura[registro_key]['directriz'] = directriz.directriz

                vertiente = directriz.vertiente_set.first()
                if vertiente:
                    estructura[registro_key]['vertiente'] = vertiente.vertiente

                    obj_estrategico = vertiente.objetivoestrategico_set.first()
                    if obj_estrategico:
                        estructura[registro_key]['objetivo_estrategico'] = obj_estrategico.objetivo_estrategico

                        objetivos_especificos = obj_estrategico.objetivoespecifico_set.all()
                        for obj_esp in objetivos_especificos:
                            estructura[registro_key]['objetivo_especifico'].append(obj_esp.objetivo_especifico)

                            lineas = obj_esp.lineaaccion_set.all()
                            for linea in lineas:
                                estructura[registro_key]['linea_accion'].append(linea.linea_accion)

        return estructura

    except Exception as e:
        print(f"Error al generar estructura APED: {str(e)}")
        return {}

def generar_data_mir (pp_id):
    # Recuperar objetos
    fin = FinMir.objects.filter(id_pp=pp_id).first()
    proposito = PropositoMir.objects.filter(id_pp=pp_id).first()
    componentes = ComponenteMir.objects.filter(id_pp=pp_id)

    # Construir el JSON
    datos_mir = {
        "fin": {
            "fin": {
                "objetivo": fin.objetivo if fin else "",
                "indicador": fin.indicador if fin else "",
                "medio_verificacion": fin.medio_verificacion if fin else "",
                "supuestos": fin.supuesto if fin else ""
            }
        },
        "proposito": {
            "proposito": {
                "objetivo": proposito.objetivo if proposito else "",
                "indicadores": {
                    str(i+1): {
                        "name": indicador.nombre if indicador else "",
                        "medio": indicador.medio_verificacion if indicador else "",
                        "supuesto": indicador.supuesto if indicador else "",
                    }
                    for i, indicador in enumerate(IndicadorPropositoMir.objects.filter(id_proposito=proposito))
                }
            }
        },
        "componente": {}
    }

    for i, componente in enumerate(componentes, 1):
        actividades = ActividadMir.objects.filter(id_componente=componente)
        indicadores = IndicadorComponenteMir.objects.filter(id_componente=componente)

        datos_mir["componente"][f"componente_{i}"] = {
            "objetivo": componente.objetivo,
            "indicadores": {
                f"indicador_{j+1}": {
                    "nombre": ind.nombre,
                    "medio": ind.medio_verificacion,
                    "supuesto": ind.supuesto,
                } for j, ind in enumerate(indicadores)
            },
            "actividades": {
                f"actividad_{k+1}": {
                    "objetivo": act.objetivo,
                    "indicadores": {
                        f"indicador_{l+1}": {
                            "nombre": ia.nombre,
                            "medio": ia.medio_verificacion,
                            "supuesto": ia.supuesto,
                        } for l, ia in enumerate(IndicadorActividadMir.objects.filter(id_actividad=act))
                    }
                } for k, act in enumerate(actividades)
            }
        }

    return datos_mir    

def obtener_ficha_fin_estructurada(programa_id):
    try:
        # Obtener instancia del programa
        programa = programas_p.objects.get(id_pp=programa_id)

        # Obtener ficha con tipo FIN asociada a ese programa
        ficha = FichaIndicador.objects.get(id_pp=programa, tipo_ficha='fin')

        datos = {
            'ficha_fin': {
                'parte1': {
                    'objetivo': ficha.objetivo,
                    'indicador': ficha.nombre_indicador
                },
                'metadatos': {
                    'fin_definicion': ficha.definicion,
                    'fin_tipo_indicador': ficha.tipo_indicador,
                    'fin_algoritmo': ficha.tipo_algoritmo,
                    'fin_periocidadcalc': capitalize_if_string(ficha.periodicidad),
                    'fin_tendencia': capitalize_if_string(ficha.tendencia),
                    'fin_amed': capitalize_if_string(ficha.ambito_medicion),
                    'fin_dimdesp': capitalize_if_string(ficha.dimension_desempeno),
                },
                'vars': {},
                'lbvr': {
                    'resultado_formula_lvbr': '0',
                    'fin_result_um_lbvr': '',
                    'fin_result_date_lbvr': None
                },
                'meta': {
                    'resultado_formula_meta': '0',
                    'fin_result_um_meta': '',
                    'fin_result_date_meta': None
                }
            }
        }

        # Obtener las variables asociadas a la ficha y ordenarlas
        variables = ficha.variables.all().order_by('orden')
        if not variables.exists():
            # No hay variables → devuelvo solo el diccionario con valores por defecto
            return datos

        # 1) Recorro hasta 3 variables para llenar valores individuales (b, c, d)
        letras = ['b', 'c', 'd']
        for idx, variable in enumerate(variables[:3]):
            letra = letras[idx]
            datos['ficha_fin']['vars'][f'fin_name_{letra}'] = variable.nombre
            datos['ficha_fin']['vars'][f'fin_mv_{letra}']   = variable.medio_verificacion or ''

            # 2) Validar Línea Base (OneToOne). Si no existe, lb = None
            try:
                lb = variable.linea_base
            except LineaBase.DoesNotExist:
                lb = None

            if lb:
                datos['ficha_fin']['lbvr'][f'fin_valor_{letra}_lbvr'] = float(lb.valor)
                datos['ficha_fin']['lbvr'][f'fin_um_{letra}_lbvr']    = lb.unidad_medida
                datos['ficha_fin']['lbvr'][f'fin_date_{letra}_lbvr'] = (
                    lb.fecha.strftime('%Y-%m-%d') if lb.fecha else ''
                )
            else:
                datos['ficha_fin']['lbvr'][f'fin_valor_{letra}_lbvr'] = ''
                datos['ficha_fin']['lbvr'][f'fin_um_{letra}_lbvr']    = ''
                datos['ficha_fin']['lbvr'][f'fin_date_{letra}_lbvr'] = ''

            # 3) Validar Meta (OneToOne). Si no existe, m = None
            try:
                m = variable.meta
            except Meta.DoesNotExist:
                m = None

            if m:
                datos['ficha_fin']['meta'][f'fin_valor_{letra}_meta'] = float(m.valor)
                datos['ficha_fin']['meta'][f'fin_um_{letra}_meta']    = m.unidad_medida
                datos['ficha_fin']['meta'][f'fin_date_{letra}_meta'] = (
                    m.fecha.strftime('%Y-%m-%d') if m.fecha else ''
                )
            else:
                datos['ficha_fin']['meta'][f'fin_valor_{letra}_meta'] = ''
                datos['ficha_fin']['meta'][f'fin_um_{letra}_meta']    = ''
                datos['ficha_fin']['meta'][f'fin_date_{letra}_meta'] = ''

        # 4) Calcular “totales” usando:
        #    • segunda variable (índice 1) si len >= 2
        #    • la única variable (índice 0) si len == 1
        #    • valores por defecto si no hay variables (pero ese caso ya salió arriba).
        if len(variables) >= 1:
            if len(variables) > 1:
                target = variables[1]
            else:
                target = variables[0]

            # 4.1) Total Línea Base
            try:
                lb2 = target.linea_base
                datos['ficha_fin']['lbvr']['resultado_formula_lvbr'] = float(lb2.resultado_estimado or 0)
                datos['ficha_fin']['lbvr']['fin_result_um_lbvr']      = lb2.unidad_resultado or ''
                datos['ficha_fin']['lbvr']['fin_result_date_lbvr']    = (
                    lb2.fecha_resultado.strftime('%Y-%m-%d') if lb2.fecha_resultado else ''
                )
            except LineaBase.DoesNotExist:
                datos['ficha_fin']['lbvr']['resultado_formula_lvbr'] = 0
                datos['ficha_fin']['lbvr']['fin_result_um_lbvr']      = ''
                datos['ficha_fin']['lbvr']['fin_result_date_lbvr']    = ''

            # 4.2) Total Meta
            try:
                m2 = target.meta
                datos['ficha_fin']['meta']['resultado_formula_meta']  = float(m2.resultado_estimado or 0)
                datos['ficha_fin']['meta']['fin_result_um_meta']      = m2.unidad_resultado or ''
                datos['ficha_fin']['meta']['fin_result_date_meta']    = (
                    m2.fecha_resultado.strftime('%Y-%m-%d') if m2.fecha_resultado else ''
                )
            except Meta.DoesNotExist:
                datos['ficha_fin']['meta']['resultado_formula_meta']  = 0
                datos['ficha_fin']['meta']['fin_result_um_meta']      = ''
                datos['ficha_fin']['meta']['fin_result_date_meta']    = ''
        # else: (no entra aquí porque ya cubrimos len == 0 más arriba)

        return datos

    except ObjectDoesNotExist:
        return None

def obtener_ficha_proposito_estructurada(id_pp):
    data_json = {}
    fichas = FichaIndicador.objects.filter(id_pp=id_pp, tipo_ficha='proposito').order_by('id')

    for idx, ficha in enumerate(fichas, start=1):
        data_json[f'proposito_objetivo_{idx}'] = ficha.objetivo or ''
        data_json[f'proposito_indicador_{idx}'] = ficha.nombre_indicador or ''
        data_json[f'proposito_definicion_{idx}'] = ficha.definicion or ''
        data_json[f'proposito_tipo_indicador_{idx}'] = ficha.tipo_indicador or ''
        data_json[f'proposito_tipo_algoritmo_{idx}'] = ficha.tipo_algoritmo or ''
        data_json[f'proposito_periocidadcalc_{idx}'] = ficha.periodicidad or ''
        data_json[f'proposito_tendencia_{idx}'] = ficha.tendencia or ''
        data_json[f'proposito_amed_{idx}'] = ficha.ambito_medicion or ''
        data_json[f'proposito_dimdesp_{idx}'] = ficha.dimension_desempeno or ''

        variables = Variable.objects.filter(ficha=ficha)
        if variables.exists():
            for variable in variables:
                letra = {1: 'b', 2: 'c', 3: 'd'}.get(variable.orden, 'x')
                data_json[f'proposito_name_{letra}_{idx}'] = variable.nombre or ''
                data_json[f'proposito_mv_{letra}_{idx}'] = variable.medio_verificacion or ''

                # Línea base
                try:
                    lb = LineaBase.objects.get(variable=variable)
                    data_json[f'proposito_valor_{letra}_lbvr_{idx}'] = str(lb.valor or '')
                    data_json[f'proposito_um_{letra}_lbvr_{idx}'] = lb.unidad_medida or ''
                    data_json[f'proposito_date_{letra}_lbvr_{idx}'] = lb.fecha.isoformat() if lb.fecha else ''
                    data_json[f'proposito_result_um_lbvr_{idx}'] = lb.unidad_resultado or ''
                    data_json[f'proposito_result_date_lbvr_{idx}'] = lb.fecha_resultado.isoformat() if lb.fecha_resultado else ''
                    data_json[f'resultado_formula_lvbr_prop_{idx}'] = str(lb.resultado_estimado or '')
                except LineaBase.DoesNotExist:
                    pass

                # Meta
                try:
                    meta = Meta.objects.get(variable=variable)
                    data_json[f'proposito_valor_{letra}_meta_{idx}'] = str(meta.valor or '')
                    data_json[f'proposito_um_{letra}_meta_{idx}'] = meta.unidad_medida or ''
                    data_json[f'proposito_date_{letra}_meta_{idx}'] = meta.fecha.isoformat() if meta.fecha else ''
                    data_json[f'proposito_result_um_meta_{idx}'] = meta.unidad_resultado or ''
                    data_json[f'proposito_result_date_meta_{idx}'] = meta.fecha_resultado.isoformat() if meta.fecha_resultado else ''
                    data_json[f'resultado_formula_meta_prop_{idx}'] = str(meta.resultado_estimado or '')
                except Meta.DoesNotExist:
                    pass

    return data_json

def estructurar_fichas(id_pp):
    fichas_queryset = FichaIndicador.objects.filter(id_pp=id_pp).order_by('id')
    fichas_dict = {}

    # Contadores para tipo 'proposito'
    proposito_counter = 0

    # Agrupaciones para numeración de componente y actividad
    componentes_map = {}  # componente.id -> contador
    actividades_map = {}  # (componente.id, actividad.id) -> contador
    actividades_orden = {}  # actividad.id -> orden global

    # Preparar orden por actividad
    actividades_queryset = FichaIndicador.objects.filter(id_pp=id_pp, tipo_ficha='actividad').exclude(actividad=None).order_by('actividad_id')
    actividad_ids_ordenados = sorted(set(a.actividad.id for a in actividades_queryset))
    for idx, act_id in enumerate(actividad_ids_ordenados, start=1):
        actividades_orden[act_id] = idx

    for ficha in fichas_queryset:
        ficha_id = ficha.id

        # ----- CÓDIGO ORDENADO -----
        if ficha.tipo_ficha == 'fin':
            codigo_ordenado = 'fin'

        elif ficha.tipo_ficha == 'proposito':
            proposito_counter += 1
            codigo_ordenado = f'proposito{proposito_counter}'

        elif ficha.tipo_ficha == 'componente':
            comp_id = ficha.componente.id if ficha.componente else None
            if comp_id:
                if comp_id not in componentes_map:
                    componentes_map[comp_id] = []
                componentes_map[comp_id].append(ficha)
                # Orden por ID para determinar número
                orden = sorted(componentes_map[comp_id], key=lambda x: x.id).index(ficha) + 1
                codigo_ordenado = f'C{comp_id}Indi{orden}'
            else:
                codigo_ordenado = 'componente-sin-id'

        elif ficha.tipo_ficha == 'actividad':
            comp_id = ficha.componente.id if ficha.componente else None
            act_id = ficha.actividad.id if ficha.actividad else None
            if comp_id and act_id:
                clave = (comp_id, act_id)
                if clave not in actividades_map:
                    actividades_map[clave] = []
                actividades_map[clave].append(ficha)
                orden = sorted(actividades_map[clave], key=lambda x: x.id).index(ficha) + 1
                act_orden = actividades_orden.get(act_id, act_id)
                codigo_ordenado = f'C{comp_id}A{act_orden}Ind{orden}'
            else:
                codigo_ordenado = 'actividad-sin-id'

        else:
            codigo_ordenado = 'otro'

        # ----- PARTE 1 -----
        parte1 = {
            'objetivo': ficha.objetivo,
            'indicador': ficha.nombre_indicador,
            'codigo_ordenado': codigo_ordenado
        }

        # ----- METADATOS -----
        metadatos = {
            'definicion': ficha.definicion,
            'tipo_indicador': ficha.tipo_indicador,
            'tipo_algoritmo': ficha.tipo_algoritmo,
            'periodicidad': ficha.periodicidad,
            'tendencia': ficha.tendencia,
            'ambito_medicion': ficha.ambito_medicion,
            'dimension_desempeno': ficha.dimension_desempeno
        }

        # ----- VARIABLES, LINEABASE, META -----
        variables_dict = {}
        lineabase_dict = {}
        meta_dict = {}

        variables_e = Variable.objects.filter(ficha=ficha)
        if variables_e.exists():
            for variable in ficha.variables.all().order_by('orden'):
                var_id = variable.id

                variables_dict[var_id] = {
                    'name': variable.nombre,
                    'medio_verificacion': variable.medio_verificacion
                }

                if hasattr(variable, 'linea_base'):
                    lb = variable.linea_base
                    lineabase_dict[var_id] = {
                        'valor': float(lb.valor),
                        'unidad_medida': lb.unidad_medida,
                        'fecha': lb.fecha.strftime('%Y-%m-%d')
                    }
                    lineabase_dict['resultado'] = {
                        'valor': float(lb.resultado_estimado),
                        'unidad_medida': lb.unidad_resultado,
                        'fecha': lb.fecha_resultado.strftime('%Y-%m-%d')
                    }

                if hasattr(variable, 'meta'):
                    m = variable.meta
                    meta_dict[var_id] = {
                        'valor': float(m.valor),
                        'unidad_medida': m.unidad_medida,
                        'fecha': m.fecha.strftime('%Y-%m-%d')
                    }
                    meta_dict['resultado'] = {
                        'valor': float(m.resultado_estimado),
                        'unidad_medida': m.unidad_resultado,
                        'fecha': m.fecha_resultado.strftime('%Y-%m-%d')
                    }

        # ----- FINAL -----
        fichas_dict[ficha_id] = {
            'parte1': parte1,
            'metadatos': metadatos,
            'variable': variables_dict,
            'lineabase': lineabase_dict,
            'meta': meta_dict
        }

    return fichas_dict

def generar_estructura_componentes(id_pp):
    try:
        programa = programas_p.objects.get(id_pp=id_pp)
        componentes = Componente.objects.filter(id_pp=programa)
        
        estructura = {}
        
        for componente in componentes:
            num_componente = componente.numero
            fichas = FichaIndicador.objects.filter(componente=componente, tipo_ficha='componente')
            
            for idx, ficha in enumerate(fichas, start=1):
                # Parte 1
                estructura[f'objetivo_componente_{num_componente}_indicador_{idx}'] = ficha.objetivo
                estructura[f'indicador_componente_{num_componente}_indicador_{idx}'] = ficha.nombre_indicador
                
                # Metadatos
                estructura[f'definicion_componente_{num_componente}_indicador_{idx}'] = ficha.definicion
                estructura[f'tipo_indicador_componente_{num_componente}_indicador_{idx}'] = capitalize_if_string(ficha.tipo_indicador)
                estructura[f'algoritmo_componente_{num_componente}_indicador_{idx}'] = ficha.tipo_algoritmo
                estructura[f'periocidadcalc_componente_{num_componente}_indicador_{idx}'] = ficha.periodicidad
                estructura[f'tendencia_componente_{num_componente}_indicador_{idx}'] = ficha.tendencia
                estructura[f'amed_componente_{num_componente}_indicador_{idx}'] = ficha.ambito_medicion
                estructura[f'dimdesp_componente_{num_componente}_indicador_{idx}'] = ficha.dimension_desempeno
                
                # Variables, Línea Base y Metas
                variables = ficha.variables.all().order_by('orden')
                if variables.exists():
                    letras = ['b', 'c', 'd']
                    
                    for var, letra in zip(variables, letras):
                        if var:
                            # Variables
                            estructura[f'name_{letra}_componente_{num_componente}_indicador_{idx}'] = var.nombre
                            estructura[f'mv_{letra}_componente_{num_componente}_indicador_{idx}'] = var.medio_verificacion
                            
                            # Línea Base
                            if hasattr(var, 'linea_base'):
                                lb = var.linea_base
                                estructura[f'valor_{letra}_lbvr_componente_{num_componente}_indicador_{idx}'] = str(lb.valor)
                                estructura[f'um_{letra}_lbvr_componente_{num_componente}_indicador_{idx}'] = lb.unidad_medida
                                estructura[f'date_{letra}_lbvr_componente_{num_componente}_indicador_{idx}'] = lb.fecha.strftime('%Y-%m-%d')
                                estructura[f'resultado_formula_lbvr_componente_{num_componente}_indicador_{idx}'] = str(lb.resultado_estimado)
                                estructura[f'result_lbvr_componente_{num_componente}_indicador_{idx}'] = lb.unidad_resultado
                                estructura[f'result_date_lbvr_componente_{num_componente}_indicador_{idx}'] = lb.fecha_resultado.strftime('%Y-%m-%d')
                            
                            # Metas
                            if hasattr(var, 'meta'):
                                m = var.meta
                                estructura[f'valor_{letra}_meta_componente_{num_componente}_indicador_{idx}'] = str(m.valor)
                                estructura[f'um_{letra}_meta_componente_{num_componente}_indicador_{idx}'] = m.unidad_medida
                                estructura[f'date_{letra}_meta_componente_{num_componente}_indicador_{idx}'] = m.fecha.strftime('%Y-%m-%d')
                                estructura[f'resultado_formula_meta_componente_{num_componente}_indicador_{idx}'] = str(m.resultado_estimado)
                                estructura[f'result_meta_componente_{num_componente}_indicador_{idx}'] = m.unidad_resultado
                                estructura[f'result_date_meta_componente_{num_componente}_indicador_{idx}'] = m.fecha_resultado.strftime('%Y-%m-%d')

        return {'status': 'ok', 'data': estructura}
    
    except Exception as e:
        return {'status': 'error', 'message': str(e)}

def generar_estructura_actividades(id_pp):
    try:
        programa = programas_p.objects.get(id_pp=id_pp)
        componentes = Componente.objects.filter(id_pp=programa)
        
        estructura = {}
        
        for componente in componentes:
            num_componente = componente.numero
            actividades = Actividad.objects.filter(componente=componente)
            
            for actividad in actividades:
                num_actividad = actividad.numero
                fichas = FichaIndicador.objects.filter(actividad=actividad, tipo_ficha='actividad')
                
                for idx, ficha in enumerate(fichas, start=1):
                    # Parte 1
                    estructura[f'objetivo_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = ficha.objetivo
                    estructura[f'indicador_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = ficha.nombre_indicador
                    
                    # Metadatos
                    estructura[f'definicion_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = ficha.definicion
                    estructura[f'tipo_indicador_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = capitalize_if_string(ficha.tipo_indicador)
                    estructura[f'algoritmo_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = ficha.tipo_algoritmo
                    estructura[f'periocidadcalc_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = ficha.periodicidad
                    estructura[f'tendencia_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = ficha.tendencia
                    estructura[f'amed_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = ficha.ambito_medicion
                    estructura[f'dimdesp_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = ficha.dimension_desempeno
                    
                    # Variables, Línea Base y Metas
                    variables = ficha.variables.all().order_by('orden')
                    if variables.exists():
                        letras = ['b', 'c', 'd']
                        
                        for var, letra in zip(variables, letras):
                            if var:
                                # Variables
                                estructura[f'name_{letra}_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = var.nombre
                                estructura[f'mv_{letra}_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = var.medio_verificacion
                                
                                # Línea Base
                                if hasattr(var, 'linea_base'):
                                    lb = var.linea_base
                                    estructura[f'valor_{letra}_lbvr_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = str(lb.valor)
                                    estructura[f'um_{letra}_lbvr_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = lb.unidad_medida
                                    estructura[f'date_{letra}_lbvr_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = lb.fecha.strftime('%Y-%m-%d')
                                    estructura[f'resultado_formula_lbvr_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = str(lb.resultado_estimado)
                                    estructura[f'result_lbvr_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = lb.unidad_resultado
                                    estructura[f'result_date_lbvr_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = lb.fecha_resultado.strftime('%Y-%m-%d')
                                
                                # Metas
                                if hasattr(var, 'meta'):
                                    m = var.meta
                                    estructura[f'valor_{letra}_meta_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = str(m.valor)
                                    estructura[f'um_{letra}_meta_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = m.unidad_medida
                                    estructura[f'date_{letra}_meta_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = m.fecha.strftime('%Y-%m-%d')
                                    estructura[f'resultado_formula_meta_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = str(m.resultado_estimado)
                                    estructura[f'result_meta_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = m.unidad_resultado
                                    estructura[f'result_date_meta_componente_{num_componente}_actividad_{num_actividad}_indicador_{idx}'] = m.fecha_resultado.strftime('%Y-%m-%d')

        return {'status': 'ok', 'data': estructura}
    
    except Exception as e:
        return {'status': 'error', 'message': str(e)}  

def estructura_poblacion_obj(id_pp):
    poblaciones = PoblacionObjetivo.objects.filter(id_pp=id_pp)
    TIPOS = {
        "referencia": "Población de Referencia",
        "potencial": "Población Potencial o Afectada",
        "objetivo": "Población Objetivo",
        "postergada": "Población Postergada"
    }

    TIPOS_INVERSO = {v: k for k, v in TIPOS.items()}

    poblaciones_dict = {}   

    for tipo_key, tipo_nombre in TIPOS.items():
        p = poblaciones.filter(tipo=tipo_key).first()
        poblaciones_dict[tipo_key] = {
            'descripcion': p.descripcion if p else '',
            'hombres': p.hombres if p else '',
            'mujeres': p.mujeres if p else '',
            'hablantes_lengua': p.hablantes_lengua if p else '',
            'grupos_edad': p.grupos_edad if p else '',
            'otros': p.otros if p else '',
            'cuantificacion': p.cuantificacion if p else '',
            'medios_verificacion': p.medios_verificacion if p else '',
        }
    return poblaciones_dict

def estructuraF9(permisos, id_pp):
    usuarios_con_datos = []

    for permiso in permisos:
        user = permiso.users
        try:
            perfil = UserProfile.objects.get(user=user)
            dependencia = perfil.dependencia
            siglas = perfil.siglas
            area = perfil.area
        except UserProfile.DoesNotExist:
            dependencia = "No definido"
            siglas = "No definido"
            area = "No definido"
        
        # Buscar si ya hay datos en Formato9 para este usuario y este programa
        datos_formato = Formato9.objects.filter(username=user, id_pp=id_pp).first()

        usuarios_con_datos.append({
            'username': user.username,
            'dependencia': dependencia,
            'area': area,
            'siglas': siglas,
            'funcion': datos_formato.funcion if datos_formato else '',
            'interactua_con': datos_formato.interactua_con if datos_formato else '',
            'mecanismo': datos_formato.mecanismo if datos_formato else '',
            'responsabilidad': datos_formato.responsabilidad if datos_formato else '',
            'atribucion': datos_formato.atribucion if datos_formato else '',
        })
    return usuarios_con_datos

def estructura_usuarios(user, tipo_usuario):
    #obtener todos los usuarios de la misma clasificación
        perfil = user.userprofile
        clasificacion = perfil.clasificacion
        if tipo_usuario == "superuser":
            user_profiles = UserProfile.objects.all()
        else:
            user_profiles = UserProfile.objects.filter(clasificacion=clasificacion)

        data = [
            {
                "username": up.user.username,
                "role": up.role,
                "area": up.area,
                "dependencia": up.dependencia,
                "siglas": up.siglas,
                "clasificacion": up.clasificacion,
                "correo_titular": up.correo_titular,
                "correo_suplente": up.correo_suplente
            }
                for up in user_profiles
        ]
        # Convertir a JSON
        usuarios_json = json.dumps(data, ensure_ascii=False, indent=2)

        return usuarios_json

def estructura_formato6(id_pp):
    municipios = Municipios.objects.all()

    # Obtener registros guardados para este id_pp
    registros_guardados = Formato6.objects.filter(id_pp=id_pp)

    # Convertir en diccionario indexado por id_municipio para acceso rápido
    if Formato6.objects.filter(id_pp__id_pp=id_pp).exists():
        datos_guardados = {
            registro.id_municipio_id: {
                'localidades': registro.localidades,
                'cuantificacion_general': registro.cuantificacion_general,
                'tipo1': int(registro.tipo1),
                'tipo2': int(registro.tipo2),
                'tipo3': int(registro.tipo3),
                'tipo4': int(registro.tipo4),
                'tipo5': int(registro.tipo5),
                'tipo6': int(registro.tipo6),
                'porcentaje1': float(registro.porcentaje1),
                'porcentaje2': float(registro.porcentaje2),
            }
            for registro in registros_guardados
        }
    else:
        datos_guardados = {
            municipio.id_municipio: {
                'localidades': 0,
                'cuantificacion_general': 0,
                'tipo1': 0,
                'tipo2': 0,
                'tipo3': 0,
                'tipo4': 0,
                'tipo5': 0,
                'tipo6': 0,
                'porcentaje1': float(0),
                'porcentaje2': float(0),
            }
            for municipio in municipios
        }
    return datos_guardados


def estructura_formatoDoce(id_pp):
    fichas = FichaIndicador.objects.filter(id_pp=id_pp).prefetch_related('variables__formatodoce').annotate(
                orden_tipo=Case(
                    When(tipo_ficha='fin', then=Value(0)),
                    When(tipo_ficha='proposito', then=Value(1)),
                    When(tipo_ficha='componente', then=Value(2)),
                    When(tipo_ficha='actividad', then=Value(3)),
                    default=Value(3),
                    output_field=IntegerField()
                )
            ).order_by('orden_tipo', 'nombre_indicador')
    filas = []

    for ficha in fichas:
        for variable in ficha.variables.all()[:2]:  # ¡solo toma las primeras 2 variables!
            registro = variable.formatodoce.first()  # Si hay registro, lo toma; si no, manda vacío

            filas.append({
                'nombre_indicador': ficha.nombre_indicador,
                'nombre_variable': variable.nombre,
                'registro': registro.registro if registro else '',
                'desagregacion': registro.desagregacion if registro else '',
                'instrumentos': registro.instrumentos if registro else '',
                'programa': registro.programa if registro else '',
                'responsable': registro.responsable if registro else '',
                'periodicidad': registro.periodicidad if registro else '',
            })

    return filas


def estructura_formatoTrece(id_pp):
    programa = programas_p.objects.get(id_pp=id_pp)
    registros = FormatoTrece.objects.filter(id_pp=programa)

    datos = {}

    for i, r in enumerate(registros):
        datos[str(i)] = {
            'nombre_reporte': r.nombre_reporte,
            'descripcion':     r.descripcion,
            'periodicidad':    r.periodicidad,
            'responsable':     r.responsable_integracion,
            'es_predeterminado': r.es_predeterminado,
        }
    data =json.dumps(datos)
    return data

def estructura_formatoCatorce_envio(id):
    fichas = FichaIndicador.objects.filter(id_pp=id, tipo_ficha__in=["proposito", "componente"]).annotate(
        orden_tipo=Case(
            When(tipo_ficha='proposito', then=Value(0)),
            When(tipo_ficha='componente', then=Value(1)),
            default=Value(2),
            output_field=IntegerField()
        )
    ).order_by('orden_tipo', 'nombre_indicador')
    print(f"fichas:{fichas}")

    tabla = []

    for ficha in fichas:
        fichaid = ficha.id
        variables = list(ficha.variables.all()[:2])  # Máximo 2 variables
        if not variables:
            continue  # Si no hay variables, salta

        variable = variables[0] 
        resultado = (
            variable.linea_base.resultado_estimado
            if hasattr(variable, 'linea_base') and variable.linea_base and variable.linea_base.resultado_estimado is not None
            else "N/A"
        )

        medios = [
            v.medio_verificacion.strip()
            for v in variables
            if v.medio_verificacion and v.medio_verificacion.strip()
        ]
        medios_concatenados = "; ".join(set(medios)) if medios else "N/A"

        # Buscar si ya hay una fila guardada en FormatoCatorce
        try:
            registro = FormatoCatorce.objects.get(ficha=ficha, variable=variable, id_pp=id)
            metas = {
                '2025': registro.meta_2025,
                '2026': registro.meta_2026,
                '2027': registro.meta_2027,
                '2028': registro.meta_2028,
                '2029': registro.meta_2029,
                '2030': registro.meta_2030,
            }
        except FormatoCatorce.DoesNotExist:
            metas = {
                '2025': 0,
                '2026': 0,
                '2027': 0,
                '2028': 0,
                '2029': 0,
                '2030': 0,
            }
        print(fichaid)
        tabla.append({
            'fichaId': fichaid,
            'tipo': ficha.tipo_ficha or "Sin tipo",
            'indicador': ficha.nombre_indicador or "Sin nombre",
            'resultado': resultado,
            'medios': medios_concatenados,
            'metas': metas
        })
    return tabla

def generar_estructura_f16(id_pp):
    componentes = ComponenteMir.objects.filter(id_pp=id_pp)

    estructura = []

    for componente in componentes:
        # Intenta obtener el formato16, puede no existir aún
        formato16 = FormatoDieciseis.objects.filter(componente=componente).first()

        # Si existe formato16, obtenemos sus subformatos ordenados por cog
        subformatos = []
        if formato16:
            subformatos_qs = formato16.subformato16.all().order_by('cog')
            for sf in subformatos_qs:
                subformatos.append({
                    'cog': sf.cog,
                    'presupuesto_2025': sf.presupuesto_2025,
                    'presupuesto_2026': sf.presupuesto_2026,
                    'presupuesto_2027': sf.presupuesto_2027,
                    'presupuesto_2028': sf.presupuesto_2028,
                    'presupuesto_2029': sf.presupuesto_2029,
                    'presupuesto_2030': sf.presupuesto_2030,
                })
        else:
            # No hay datos guardados, llenamos subformatos con valores cero para cada cog
            for cog in [1000,2000,3000,4000,5000,6000,7000,8000,9000]:
                subformatos.append({
                    'cog': cog,
                    'presupuesto_2025': 0,
                    'presupuesto_2026': 0,
                    'presupuesto_2027': 0,
                    'presupuesto_2028': 0,
                    'presupuesto_2029': 0,
                    'presupuesto_2030': 0,
                })

        estructura.append({
            'id_componente': componente.id_componente,
            'objetivo': componente.objetivo,
            'formato16': {
                'meta_medianoplazo': formato16.meta_medianoplazo if formato16 else '',
                'meta_2025': formato16.meta_2025 if formato16 else '',
                'meta_2026': formato16.meta_2026 if formato16 else '',
                'meta_2027': formato16.meta_2027 if formato16 else '',
                'meta_2028': formato16.meta_2028 if formato16 else '',
                'meta_2029': formato16.meta_2029 if formato16 else '',
                'meta_2030': formato16.meta_2030 if formato16 else '',
                'subformato': subformatos,
            }
        })

    return estructura

def estructura_formato17(id_pp):
    registros = RegistroFormatoDieciciete.objects.filter(id_pp__id_pp=id_pp).select_related('id_ff')
    data = {}
    for r in registros:
        # Usar id_ff como clave, y los presupuestos como valor
        data[r.id_ff.id_ff] = {
            'nombre_ff': r.id_ff.id_ff,
            '2025': r.presupuesto_2025,
            '2026': r.presupuesto_2026,
            '2027': r.presupuesto_2027,
            '2028': r.presupuesto_2028,
            '2029': r.presupuesto_2029,
            '2030': r.presupuesto_2030,
        }

    json_data = json.dumps(data)

    return json_data

def estructura_formato15(id_pp ):
     # Estructurar datos del formato 15
    poblaciones = PoblacionObjetivo.objects.filter(id_pp=id_pp)
    registros_f15 = FormatoQuince.objects.filter(id_pp=id_pp).select_related('poblacion_objetivo')
    datos_f15 = {}
    for registro in registros_f15:
        concepto_key = registro.concepto.lower().replace(' ', '_')
        poblacion_key = registro.poblacion_objetivo.tipo if registro.poblacion_objetivo else 'general'
        
        if poblacion_key not in datos_f15:
            datos_f15[poblacion_key] = {}
            
        datos_f15[poblacion_key][concepto_key] = {
            'anio_2025': registro.anio_2025,
            'anio_2026': registro.anio_2026,
            'anio_2027': registro.anio_2027,
            'anio_2028': registro.anio_2028,
            'anio_2029': registro.anio_2029,
            'anio_2030': registro.anio_2030,
            'total': registro.total
        }
    return datos_f15