from django.http import HttpResponse
from django.http import JsonResponse, HttpResponseRedirect
from django.db import transaction
from django.db.models import Prefetch
from django.contrib import messages
from django.urls import reverse
from django.template.loader import render_to_string
import traceback
import re

#FUNCIONES
from .subfunctionsaves import parse_decimal, parse_date, capitalize_if_string, safe_int, fecha_valida,tipo_str_a_codigo,tipo_str_a_codigo_ao, detectar_cambios_arbol_problemas,  actualizar_arbol_objetivos
from .structurefuncions import estructura_AP, generar_arbol_objetivos, estructura_AO, estructura_formatoDoce 
#MODELOS
from PPRegister.models import User, UserProfile, programas_p, permisos_pps
from PPRegister.models import PoblacionObjetivo, BienServicio
from PPRegister.models import APED, Directriz, Vertiente, ObjetivoEstrategico, ObjetivoEspecifico, LineaAccion
from PPRegister.models import FinMir, PropositoMir, IndicadorPropositoMir, ComponenteMir, IndicadorComponenteMir,ActividadMir, IndicadorActividadMir
from PPRegister.models import Componente, Actividad, FichaIndicador,Variable,LineaBase, Meta
from PPRegister.models import FormatoUno, FormatoDos, FormatoTres, FormatoCuatro
from PPRegister.models import Nodo, Conexion, NodoAO, ConexionAO, FormatoCatorce, FormatoDieciseis, Subformato16, FormatoQuince
from PPRegister.models import Formato9, Formato6, Municipios, FormatoDoce, FormatoTrece, RegistroFormatoDieciciete,FuenteFinanciamiento
                    
def guardar_poblacion_objetivo( pp, data):
    try:
        TIPOS = {
            "referencia": "Población de Referencia",
            "potencial": "Población Potencial o Afectada",
            "objetivo": "Población Objetivo",
            "postergada": "Población Postergada"
        }

        for tipo_key in TIPOS.keys():
            obj, creado = PoblacionObjetivo.objects.update_or_create(
                tipo=tipo_key,
                id_pp=pp,
                defaults={
                    'descripcion': data.get(f"descripcion_{tipo_key}", ""),
                    'hombres': safe_int(data.get(f"hombres_{tipo_key}")),
                    'mujeres': safe_int(data.get(f"mujeres_{tipo_key}")),
                    'hablantes_lengua': safe_int(data.get(f"hablantes_{tipo_key}")),
                    'grupos_edad': data.get(f"grupos_edad_{tipo_key}", ""),  # Evita que sea None
                    'otros':data.get(f"otros_{tipo_key}", ""),
                    'cuantificacion':safe_int(data.get(f"cuanti_{tipo_key}")),
                    'medios_verificacion': data.get(f"medios_{tipo_key}", ""),
                }
            )
        return JsonResponse({'status': 'ok', 'message': 'Formato 5 guardado correctamente.'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f"Error del back: {str(e)}"})
    

def guardar_bienes_servicios(request, pp, data):
    try:
        # Elimina los anteriores
        BienServicio.objects.filter(id_pp=pp).delete()

        for item in data.get('bienes_servicios', []):
            BienServicio.objects.create(
                id_pp=pp,
                bien=item.get('bien'),
                descripcion=item.get('descripcion'),
                criterio_calidad=item.get('criticidad'),
                criterio=item.get('criterio'),
            )

        return JsonResponse({'status': 'success', 'message': 'Datos guardados correctamente'})
    
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

def guardarAPED(data, id_pp):
    try:
        aped_existentes =  APED.objects.filter(id_pp_id=id_pp)
        aped_existentes.delete()

        for registro in data.values():
            aped = APED.objects.create(id_pp_id=id_pp)
            # Crear Directriz
            directriz = Directriz.objects.create(
                directriz=registro['directriz'],
                id_aped=aped
            )
            
            # Crear Vertiente
            vertiente = Vertiente.objects.create(
                vertiente=registro['vertiente'],
                id_directriz=directriz,
                id_aped=aped
            )
            
            # Crear Objetivo Estratégico
            obj_estrategico = ObjetivoEstrategico.objects.create(
                objetivo_estrategico=registro['objetivo_estrategico'],
                id_vertiente=vertiente,
                id_aped=aped
            )
            
            # Crear Objetivos Específicos
            for obj_esp in registro['objetivos_especificos']:
                obj_especifico = ObjetivoEspecifico.objects.create(
                    objetivo_especifico=obj_esp,
                    id_objetivo_estrategico=obj_estrategico
                )
                
                # Crear Líneas de Acción (asumiendo que están relacionadas)
                for linea_accion in registro['lineas_accion']:
                    LineaAccion.objects.create(
                        linea_accion=linea_accion,
                        id_objetivo_especifico=obj_especifico
                    )
        
        
        return JsonResponse({'status': 'ok', 'message': 'Formato 7 guardado correctamente.'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f"Error del back: {str(e)}"})

def guardar_datos_mir(request, pp, data, is_ajax=True):
    try:
        # === 0. BORRAR DATOS ANTERIORES DE ESA PP ===
        FinMir.objects.filter(id_pp=pp).delete()
        IndicadorPropositoMir.objects.filter(id_proposito__id_pp=pp).delete()
        PropositoMir.objects.filter(id_pp=pp).delete()

        # Borrado en cascada de componentes, actividades e indicadores
        IndicadorActividadMir.objects.filter(id_actividad__id_componente__id_pp=pp).delete()
        ActividadMir.objects.filter(id_componente__id_pp=pp).delete()
        IndicadorComponenteMir.objects.filter(id_componente__id_pp=pp).delete()
        ComponenteMir.objects.filter(id_pp=pp).delete()

        # === 1. GUARDAR FIN ===
        fin_data = data.get("fin", {}).get("fin", {})
        FinMir.objects.create(
            objetivo=fin_data.get("objetivo", ""),
            indicador=fin_data.get("indicador", ""),
            supuesto=fin_data.get("supuestos", ""),
            medio_verificacion=fin_data.get("medio_verificacion", ""),
            id_pp=pp
        )

        # === 2. GUARDAR PROPÓSITO ===
        proposito_data = data.get("proposito", {}).get("proposito", {})
        proposito = PropositoMir.objects.create(
            objetivo=proposito_data.get("objetivo", ""),
            id_pp=pp
        )

        indicadores_proposito = proposito_data.get("indicadores", {})
        for key, indicador in indicadores_proposito.items():
            IndicadorPropositoMir.objects.create(
                nombre=indicador.get("name", ""),
                supuesto=indicador.get("supuesto", ""),
                medio_verificacion=indicador.get("medio", ""),
                id_proposito=proposito
            )

        # === 3. GUARDAR COMPONENTES Y SUS INDICADORES Y ACTIVIDADES ===
        componentes_data = data.get("componente", {})
        for key_c, componente_dict in componentes_data.items():
            componente = ComponenteMir.objects.create(
                objetivo=componente_dict.get("objetivo", ""),
                id_pp=pp
            )

            # Indicadores del componente
            indicadores_c = componente_dict.get("indicadores", {})
            for key_ic, indicador in indicadores_c.items():
                IndicadorComponenteMir.objects.create(
                    nombre=indicador.get("nombre", ""),
                    supuesto=indicador.get("supuesto", ""),
                    medio_verificacion=indicador.get("medio", ""),
                    id_componente=componente
                )

            # Actividades del componente
            actividades = componente_dict.get("actividades", {})
            for key_a, actividad_dict in actividades.items():
                actividad = ActividadMir.objects.create(
                    objetivo=actividad_dict.get("objetivo", ""),
                    id_componente=componente
                )

                # Indicadores de la actividad
                indicadores_a = actividad_dict.get("indicadores", {})
                for key_ia, indicador in indicadores_a.items():
                    IndicadorActividadMir.objects.create(
                        nombre=indicador.get("nombre", ""),
                        supuesto=indicador.get("supuesto", ""),
                        medio_verificacion=indicador.get("medio", ""),
                        id_actividad=actividad
                    )

        return JsonResponse({
            'status': 'success',
            'message': 'MIR guardada correctamente'
        })

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Error al guardar MIR: {str(e)}'
        }, status=500)

def guardar_ficha_fin(id_pp, data_json):
    try:
        with transaction.atomic():
            # Eliminar fichas FIN previas del programa
            FichaIndicador.objects.filter(id_pp=id_pp, tipo_ficha='fin').delete()

            # Extraer datos del JSON
            indi = data_json.get('indi', {})
            metadatos = data_json.get('metadatos', {})
            vars_ = data_json.get('vars', {})
            lbvr = data_json.get('lbvr', {})
            meta = data_json.get('meta', {})

            # Crear nueva ficha FIN
            ficha_fin = FichaIndicador.objects.create(
                id_pp=id_pp,
                tipo_ficha='fin',
                nombre_indicador=indi.get('indicador_fin', ''),
                objetivo=indi.get('objetivo_fin', ''),
                definicion=metadatos.get('fin_definicion', ''),
                tipo_indicador=metadatos.get('fin_tipo_indicador', ''),
                tipo_algoritmo=metadatos.get('fin_tipo_algoritmo', ''),
                periodicidad=metadatos.get('fin_periocidadcalc', 'anual').lower(),
                tendencia=metadatos.get('fin_tendencia', '').lower(),
                ambito_medicion=metadatos.get('fin_amed', '').replace('/', '_').lower(),
                dimension_desempeno=metadatos.get('fin_dimdesp', '').lower(),
                componente=None,
                actividad=None,
            )

            for letra in ['b', 'c', 'd']:
                nombre_var = vars_.get(f'fin_name_{letra}', '').strip()
                if not nombre_var:
                    # Si no hay nombre, no hay variable que crear para esa letra
                    continue
                
                # Crear Variable
                variable = Variable.objects.create(
                    ficha=ficha_fin,
                    nombre=nombre_var,
                    medio_verificacion=vars_.get(f'fin_mv_{letra}', ''),
                    orden=0  # o ajusta si tienes orden específico
                )
                
                # Crear Línea Base solo si valor está presente (podrías ajustar según necesites)
                valor_lb = lbvr.get(f'fin_valor_{letra}_lbvr')
                if valor_lb is not None and valor_lb != '':
                    linea_base = LineaBase.objects.create(
                        variable=variable,
                        valor=str(valor_lb),
                        unidad_medida=lbvr.get(f'fin_um_{letra}_lbvr', ''),
                        fecha=parse_date(lbvr.get(f'fin_date_{letra}_lbvr')),
                        resultado_estimado=str(lbvr.get('resultado_formula_lvbr')),
                        unidad_resultado=lbvr.get('fin_result_um_lbvr', ''),
                        fecha_resultado=parse_date(lbvr.get('fin_result_date_lbvr')),
                    )
                
                # Crear Meta solo si valor está presente
                valor_meta = meta.get(f'fin_valor_{letra}_meta')
                if valor_meta is not None and valor_meta != '':
                    meta_obj = Meta.objects.create(
                        variable=variable,
                        valor=str(valor_meta),
                        unidad_medida=meta.get(f'fin_um_{letra}_meta', ''),
                        fecha=parse_date(meta.get(f'fin_date_{letra}_meta')),
                        resultado_estimado=str(meta.get('resultado_formula_meta')),
                        unidad_resultado=meta.get('fin_result_um_meta', ''),
                        fecha_resultado=parse_date(meta.get('fin_result_date_meta')),
                    )

        
        return JsonResponse({
            'status': 'success',
            'message': 'Ficha de Fin guardada correctamente'
        })

    except Exception as e:
        print("Ocurrió un error en guardar_ficha_fin:")
        traceback.print_exc()  # 🔴 Esto imprime el traceback en la terminal

        return JsonResponse({
            'status': 'error',
            'message': f'Error al guardar MIR: {str(e)}'
        }, status=500)

def guardar_fichas_proposito(id_pp, data_json, request):
    try:
        # Si viene con claves tipo '0', '1', 'action', 'id_pp', lo filtramos
        fichas = []
        for k, v in data_json.items():
            if k.isdigit():
                fichas.append(v)

        if not fichas:
            return JsonResponse({'status': 'error', 'mensaje': 'No se encontraron fichas en los datos recibidos'})

        # Eliminar fichas anteriores del mismo propósito
        FichaIndicador.objects.filter(id_pp=id_pp, tipo_ficha='proposito').delete()

        # Iterar sobre cada ficha
        for ficha_data in fichas:
            parte1 = ficha_data.get('parte1', {})
            metadatos = ficha_data.get('metadatos', {})
            vars_data = ficha_data.get('vars', {})
            lbvr = ficha_data.get('lbvr', {})
            meta = ficha_data.get('meta', {})

            ficha = FichaIndicador.objects.create(
                id_pp=id_pp,
                tipo_ficha='proposito',
                objetivo=parte1.get('objetivo', ''),
                nombre_indicador=parte1.get('indicador', ''),
                definicion=metadatos.get('definicion', ''),
                tipo_indicador=metadatos.get('tipo_indicador', ''),
                tipo_algoritmo=metadatos.get('algoritmo', ''),
                periodicidad=metadatos.get('periocidadcalc', ''),
                tendencia=metadatos.get('tendencia', ''),
                ambito_medicion=metadatos.get('amed', ''),
                dimension_desempeno=metadatos.get('dimdesp', ''),
            )

            for letra, orden in {'b': 1, 'c': 2, 'd': 3}.items():
                # Buscar la clave que empiece con 'proposito_name_<letra>_' y extraer el sufijo
                nombre_var = None
                mv_var = None
                sufijo = None

                for key in vars_data:
                    if key.startswith(f'proposito_name_{letra}_'):
                        nombre_var = vars_data[key]
                        sufijo = key.split(f'proposito_name_{letra}_')[-1]
                        mv_var = vars_data.get(f'proposito_mv_{letra}_' + sufijo)
                        break

                if nombre_var:
                    variable = Variable.objects.create(
                        ficha=ficha,
                        nombre=nombre_var,
                        medio_verificacion=mv_var or '',
                        orden=orden
                    )

                    # LINEA BASE
                    LineaBase.objects.create(
                        variable=variable,
                        valor=lbvr.get(f'proposito_valor_{letra}_lbvr_' + sufijo, 0) or 0,
                        unidad_medida=lbvr.get(f'proposito_um_{letra}_lbvr_' + sufijo, ''),
                        fecha=lbvr.get(f'proposito_date_{letra}_lbvr_' + sufijo, '2000-02-17'),
                        resultado_estimado=lbvr.get('resultado_formula_lvbr_prop', 0) or 0,
                        unidad_resultado=lbvr.get('proposito_result_um_lbvr', ''),
                        fecha_resultado=lbvr.get('proposito_result_date_lbvr', '2000-02-17')
                    )

                    # META
                    Meta.objects.create(
                        variable=variable,
                        valor=meta.get(f'proposito_valor_{letra}_meta_' + sufijo, 0) or 0,
                        unidad_medida=meta.get(f'proposito_um_{letra}_meta_' + sufijo, ''),
                        fecha=meta.get(f'proposito_date_{letra}_meta_' + sufijo, '2000-02-17'),
                        resultado_estimado=meta.get('resultado_formula_meta_prop', 0) or 0,
                        unidad_resultado=meta.get('proposito_result_um_meta', ''),
                        fecha_resultado=meta.get('proposito_result_date_meta', '2000-02-17')
                    )

        return JsonResponse({'status': 'ok', 
                             'mensaje': 'Fichas de propósito guardadas correctamente',})

    except Exception as e:
        import traceback
        print("Error:", e)
        traceback.print_exc()
        return JsonResponse({'status': 'error', 'mensaje': str(e)})

def guardar_fichas_componentes(id_pp, data):
    try:
        with transaction.atomic():
            # Borrar fichas tipo componente existentes
            FichaIndicador.objects.filter(id_pp=id_pp, tipo_ficha='componente').delete()

            programa = programas_p.objects.get(id_pp=id_pp)

            for componente in data:
                numero_componente = componente.get('numero_componente')

                # Obtener o crear el componente sin pasar 'nombre', se genera en save()
                componente_obj, created = Componente.objects.get_or_create(
                    id_pp=programa,
                    numero=numero_componente,
                    defaults={}
                )
                if not created:
                    # Forzar actualización para recalcular nombre si fuera necesario
                    componente_obj.save()

                indicadores = componente.get('indicadores', [])

                for idx, indicador in enumerate(indicadores, start=1):
                    parte1 = indicador.get('parte1', {})
                    metadatos = indicador.get('metadatos', {})
                    vars_data = indicador.get('vars', {})
                    lbvr = indicador.get('lbvr', {})
                    meta = indicador.get('meta', {})

                    ficha = FichaIndicador.objects.create(
                        id_pp_id=id_pp,
                        tipo_ficha='componente',
                        objetivo=parte1.get('objetivo', ''),
                        nombre_indicador=parte1.get('indicador', ''),
                        definicion=metadatos.get('definicion', ''),
                        tipo_indicador=metadatos.get('tipo_indicador', '').lower(),
                        tipo_algoritmo=metadatos.get('algoritmo', ''),
                        periodicidad=metadatos.get('periocidadcalc', 'Anual'),
                        tendencia=metadatos.get('tendencia', 'Ascendente'),
                        ambito_medicion=metadatos.get('amed', 'Resultados a mediano plazo'),
                        dimension_desempeno=metadatos.get('dimdesp', 'eficacia'),
                        componente=componente_obj
                    )

                    letras = ['b', 'c', 'd']
                    for letra in letras:
                        nombre = vars_data.get(f'name_{letra}_componente_{numero_componente}_indicador_{idx}', '').strip()
                        medio = vars_data.get(f'mv_{letra}_componente_{numero_componente}_indicador_{idx}', '').strip()
                        if nombre:
                            variable = Variable.objects.create(
                                ficha=ficha,
                                nombre=nombre,
                                medio_verificacion=medio,
                                orden=letras.index(letra)
                            )

                            LineaBase.objects.create(
                                variable=variable,
                                valor=lbvr.get(f'valor_{letra}_lbvr_componente_{numero_componente}_indicador_{idx}', 0) or 0,
                                unidad_medida=lbvr.get(f'um_{letra}_lbvr_componente_{numero_componente}_indicador_{idx}', ''),
                                fecha=fecha_valida(lbvr.get(f"date_{letra}_lbvr_componente_{numero_componente}_indicador_{idx}")),
                                resultado_estimado=lbvr.get('resultado_formula', 0) or 0,
                                unidad_resultado=lbvr.get(f"result_lbvr_componente_{numero_componente}_indicador_{idx}", 'error'),
                                fecha_resultado=fecha_valida(lbvr.get(f"result_date_lbvr_componente_{numero_componente}_indicador_{idx}"))
                            )

                            Meta.objects.create(
                                variable=variable,
                                valor=meta.get(f'valor_{letra}_meta_componente_{numero_componente}_indicador_{idx}', 0) or 0,
                                unidad_medida=meta.get(f'um_{letra}_meta_componente_{numero_componente}_indicador_{idx}', ''),
                                fecha=fecha_valida(meta.get(f"date_{letra}_meta_componente_{numero_componente}_indicador_{idx}")),
                                resultado_estimado=meta.get('resultado_formula', 0) or 0,
                                unidad_resultado=meta.get(f"result_meta_componente_{numero_componente}_indicador_{idx}", 'error'),
                                fecha_resultado=fecha_valida(meta.get(f"result_date_meta_componente_{numero_componente}_indicador_{idx}"))
                            )

        return JsonResponse({'status': 'ok', 'message': 'Fichas de componente guardadas correctamente.'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f"Error del back: {str(e)}"})

def guardar_fichas_componentes_actividad(id_pp, data):
    try:
        with transaction.atomic():
            # Borra fichas anteriores
            FichaIndicador.objects.filter(id_pp=id_pp, tipo_ficha='actividad').delete()

            pp = programas_p.objects.get(id_pp=id_pp)  

            for item in data:
                numero_componente = item.get('componente_numero')
                numero_actividad = item.get('actividad_numero')
                indicador_numero = item.get('indicador_numero')
                datos = item.get('datos', {})

                componente_obj, _ = Componente.objects.get_or_create(id_pp=pp, numero=numero_componente)
                actividad_obj, _ = Actividad.objects.get_or_create(componente=componente_obj, numero=numero_actividad)

                parte1 = datos.get('parte1', {})
                metadatos = datos.get('metadatos', {})
                vars_data = datos.get('vars', {})
                lbvr = datos.get('lbvr', {})
                meta = datos.get('meta', {})

                ficha = FichaIndicador.objects.create(
                    id_pp=pp,  # ✅ CORREGIDO
                    tipo_ficha='actividad',
                    objetivo=parte1.get('objetivo', '') or '',
                    nombre_indicador=parte1.get('indicador', '') or '',
                    definicion=metadatos.get('definicion', '') or '',
                    tipo_indicador=metadatos.get('tipo_indicador', 'porcentaje').lower(),
                    tipo_algoritmo=metadatos.get('algoritmo', '') or '',
                    periodicidad=metadatos.get('periocidadcalc', 'Anual'),
                    tendencia=metadatos.get('tendencia', 'Ascendente'),
                    ambito_medicion=metadatos.get('amed', 'Resultados a mediano plazo'),
                    dimension_desempeno=metadatos.get('dimdesp', 'eficacia'),
                    componente=componente_obj,
                    actividad=actividad_obj
                )

                letras = ['b', 'c', 'd']
                for letra in letras:
                    nombre = vars_data.get(f'name_{letra}_componente_{numero_componente}_actividad_{numero_actividad}_indicador_{indicador_numero}', '').strip()
                    medio = vars_data.get(f'mv_{letra}_componente_{numero_componente}_actividad_{numero_actividad}_indicador_{indicador_numero}', '').strip()
                    if nombre != '':
                        variable = Variable.objects.create(
                            ficha=ficha,
                            nombre=nombre,
                            medio_verificacion=medio,
                            orden=letras.index(letra)
                        )

                        LineaBase.objects.create(
                            variable=variable,
                            valor=lbvr.get(f'valor_{letra}_lbvr_componente_{numero_componente}_actividad_{numero_actividad}_indicador_{indicador_numero}', 0) or 0,
                            unidad_medida=lbvr.get(f'um_{letra}_lbvr_componente_{numero_componente}_actividad_{numero_actividad}_indicador_{indicador_numero}', ''),
                            fecha=fecha_valida(lbvr.get(f'date_{letra}_lbvr_componente_{numero_componente}_actividad_{numero_actividad}_indicador_{indicador_numero}')),
                            resultado_estimado=lbvr.get(f'resultado_formula_lbvr_componente_{numero_componente}_actividad_{numero_actividad}_indicador_{indicador_numero}', 0) or 0,
                            unidad_resultado=lbvr.get(f'result_lbvr_componente_{numero_componente}_actividad_{numero_actividad}_indicador_{indicador_numero}', 'error'),
                            fecha_resultado=fecha_valida(lbvr.get(f'result_date_lbvr_componente_{numero_componente}_actividad_{numero_actividad}_indicador_{indicador_numero}'))
                        )

                        Meta.objects.create(
                            variable=variable,
                            valor=meta.get(f'valor_{letra}_meta_componente_{numero_componente}_actividad_{numero_actividad}_indicador_{indicador_numero}', 0) or 0,
                            unidad_medida=meta.get(f'um_{letra}_meta_componente_{numero_componente}_actividad_{numero_actividad}_indicador_{indicador_numero}', ''),
                            fecha=fecha_valida(meta.get(f'date_{letra}_meta_componente_{numero_componente}_actividad_{numero_actividad}_indicador_{indicador_numero}')),
                            resultado_estimado=meta.get(f'resultado_formula_meta_componente_{numero_componente}_actividad_{numero_actividad}_indicador_{indicador_numero}', 0) or 0,
                            unidad_resultado=meta.get(f'result_meta_componente_{numero_componente}_actividad_{numero_actividad}_indicador_{indicador_numero}', 'error'),
                            fecha_resultado=fecha_valida(meta.get(f'result_date_meta_componente_{numero_componente}_actividad_{numero_actividad}_indicador_{indicador_numero}'))
                        )

        return JsonResponse({'status': 'ok', 'message': 'Fichas actividad guardadas correctamente.'})

    except Exception as e:
        print(str(e))
        return JsonResponse({'status': 'error', 'message': f"Error del back: {str(e)}"})

def guardarFormatoUno(data, id_pp):
    try:
        programa = programas_p.objects.get(id_pp=id_pp)
    except programas_p.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Programa presupuestario no encontrado.'})

    try:
        FormatoUno.objects.filter(id_pp=programa).delete()

        registros_guardados = []

        for key in data:
            if key.isdigit():  # Solo las claves tipo '0', '1', etc.
                fila = data[key]

                # Detectar el sufijo dinámico
                try:
                    sufijo = list(fila.keys())[0].split("_formato1_")[1]
                except IndexError:
                    continue  # Ignorar si no se puede extraer el sufijo

                # Extraer campos con sufijo dinámico
                nombre = fila.get(f'nombre_formato1_{sufijo}', '')
                lugar = fila.get(f'lugar_formato1_{sufijo}', '')
                objetivo = fila.get(f'objetivo_formato1_{sufijo}', '')
                descripcion = fila.get(f'descripcion_formato1_{sufijo}', '')
                poblacion = fila.get(f'poblacion_formato1_{sufijo}', '')
                bienes = fila.get(f'bys_formato1_{sufijo}', '')
                resultados = fila.get(f'resultados_formato1_{sufijo}', '')
                vinculo = fila.get(f'vinculo_formato1_{sufijo}', '')

                registro = FormatoUno.objects.create(
                    id_pp=programa,
                    nombre=nombre,
                    lugar_implementacion=lugar,
                    objetivo=objetivo,
                    descripcion=descripcion,
                    poblacion_objetivo=poblacion,
                    bienes_servicios=bienes,
                    resultados_evaluacion=resultados,
                    vinculo_documento=vinculo
                )
                registros_guardados.append(registro)

        return JsonResponse({'status': 'ok', 'message': 'Formato 1 Guardado Correctamente'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f"Error del back: {str(e)}"})

def guardarFormatoDos(data, id_pp):
    try:
        programa = programas_p.objects.get(id_pp=id_pp)
    except programas_p.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Programa presupuestario no encontrado.'})

    try:
        FormatoDos.objects.filter(id_pp=programa).delete()

        registros_guardados = []

        for key in data:
            if key.isdigit():  # Solo las claves tipo '0', '1', etc.
                fila = data[key]

                # Extraer campos con sufijo dinámico
                nombre = fila.get('nombre', '')
                tipo_programa = fila.get('tipo', '')
                objetivo = fila.get('objetivo', '')
                poblacion_objetivo = fila.get('poblacion', '')
                bienes_servicios = fila.get('bys', '')
                cobertura = fila.get('cobertura', '')
                institucion_coordinadora = fila.get('institucion_coordinadora', '')
                interdependencia = fila.get('interdependencia', '')
                descripcion_interdependencia = fila.get('descripinter', '')

                registro = FormatoDos.objects.create(
                    id_pp=programa,
                    nombre=nombre,
                    tipo_programa =tipo_programa,
                    objetivo=objetivo,
                    poblacion_objetivo =poblacion_objetivo,
                    bienes_servicios = bienes_servicios,
                    cobertura = cobertura,
                    institucion_coordinadora = institucion_coordinadora,
                    interdependencia = interdependencia,
                    descripcion_interdependencia = descripcion_interdependencia
                )
                registros_guardados.append(registro)

        return JsonResponse({'status': 'ok', 'message': 'Formato 2 Guardado Correctamente back'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f"Error del back: {str(e)}"})

def guardarFormatoTres(data, id_pp):
    try:
        programa = programas_p.objects.get(id_pp=id_pp)
    except programas_p.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Programa presupuestario no encontrado.'})

    try:
        FormatoTres.objects.filter(id_pp=programa).delete()

        registros_guardados = []

        for key in data:
            if key.isdigit():  # Solo las claves tipo '0', '1', etc.
                fila = data[key]

                # Detectar el sufijo dinámico
                try:
                    sufijo = list(fila.keys())[0].split("_formato3_")[1]
                except IndexError:
                    continue  # Ignorar si no se puede extraer el sufijo

                # Extraer campos con sufijo dinámico
                tipo_actor = fila.get(f'tipo_formato3_{sufijo}', '')
                nombre = fila.get(f'nombre_formato3_{sufijo}', '')
                descripcion = fila.get(f'descripcion_formato3_{sufijo}', '')
                posicion = fila.get(f'posicion_formato3_{sufijo}', '')
                influencia = fila.get(f'influencia_formato3_{sufijo}', '')

                registro = FormatoTres.objects.create(
                    id_pp=programa,
                    tipo_actor = tipo_actor,
                    nombre=nombre,
                    descripcion=descripcion,
                    posicion=posicion,
                    influencia=influencia,
                )
                registros_guardados.append(registro)

        return JsonResponse({'status': 'ok', 'message': 'Formato 3 Guardado Correctamente'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f"Error del back: {str(e)}"})

def guardarFormatoCuatro(data, id_pp):
    try:
        programa = programas_p.objects.get(id_pp=id_pp)
    except programas_p.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Programa presupuestario no encontrado.'})

    try:
        # Crear diccionario base para los campos
        campos = {
            'descripcion_nivel_ingreso': '',
            'justificacion_nivel_ingreso': '',

            'descripcion_sexo': '',
            'justificacion_sexo': '',

            'descripcion_grupo_etario': '',
            'justificacion_grupo_etario': '',

            'descripcion_lengua_indigena': '',
            'justificacion_lengua_indigena': '',

            'descripcion_ubicacion_geografica': '',
            'justificacion_ubicacion_geografica': '',

            'descripcion_otros_criterios': '',
            'justificacion_otros_criterios': '',
        }

        # Mapear criterios a nombres de campos
        mapeo = {
            'Nivel de ingreso': ('descripcion_nivel_ingreso', 'justificacion_nivel_ingreso'),
            'Sexo': ('descripcion_sexo', 'justificacion_sexo'),
            'Grupo etario': ('descripcion_grupo_etario', 'justificacion_grupo_etario'),
            'Condición del hablante de lengua indígena': ('descripcion_lengua_indigena', 'justificacion_lengua_indigena'),
            'Ubicación geográfica': ('descripcion_ubicacion_geografica', 'justificacion_ubicacion_geografica'),
            'Otros criterios': ('descripcion_otros_criterios', 'justificacion_otros_criterios'),
        }

        # Llenar los campos a partir del data
        for key in data:
            if key.isdigit():
                fila = data[key]
                criterio = fila.get('criterio')
                descripcion = fila.get('descripcion', '')
                justificacion = fila.get('justificacion', '')

                if criterio in mapeo:
                    campo_des, campo_just = mapeo[criterio]
                    campos[campo_des] = descripcion
                    campos[campo_just] = justificacion

        # Eliminar si ya existe
        FormatoCuatro.objects.filter(id_pp=programa).delete()

        # Crear nuevo
        FormatoCuatro.objects.create(id_pp=programa, **campos)

        return JsonResponse({'status': 'ok', 'message': 'Formato 4 guardado correctamente.'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f"Error del back: {str(e)}"})
    
def guardarArbolProblemaNuevo (data, id_pp):
    nodos = data.get('nodos', [])
    conexiones = data.get('conexiones', [])

    try:   #si ya existen los 2 arboles pero cambiaste el de problemas 
          if  Nodo.objects.filter(id_pp__id_pp=id_pp).exists() and NodoAO.objects.filter(id_pp__id_pp=id_pp).exists():
              arbol_viejo = estructura_AP(id_pp)
              arbol_nuevo = data
              #entonces comparar la estructura para saber si cambio
              nuevos_nodos, nuevas_conexiones, nodos_eliminados, conexiones_eliminadas, hubo_cambios = detectar_cambios_arbol_problemas(arbol_viejo, arbol_nuevo)
              if hubo_cambios:
                #si cambio aplicar los cambios de nodos y conexiones
                actualizar_arbol_objetivos(nuevos_nodos, nuevas_conexiones, nodos_eliminados, conexiones_eliminadas, id_pp)
                arbol_obj = estructura_AO(id_pp)

              else:
                  print("La estructura es la misma.")

          Nodo.objects.filter(id_pp__id_pp=id_pp).delete()

          # Guardar nodos
          nodos_dict = {}
          for nodo in nodos:
              n = Nodo.objects.create(
                  id_html=nodo['id_html'],
                  texto=nodo['texto'],
                  tipo=tipo_str_a_codigo(nodo['tipo']),
                  posicion_x=nodo['posicion_x'],
                  posicion_y=nodo['posicion_y'],
                  id_pp_id = id_pp  
              )
              nodos_dict[nodo['id_html']] = n

          # Guardar conexiones
          for conn in conexiones:
              Conexion.objects.create(
                  origen=nodos_dict[conn['origen']],
                  destino=nodos_dict[conn['destino']]
              )
        
          #si no hay arbol de objetivo
          if NodoAO.objects.filter(id_pp__id_pp=id_pp).count() == 0:
            arbol_obj = generar_arbol_objetivos(estructura_AP(id_pp))
          else:
            arbol_obj = estructura_AO(id_pp)

          return JsonResponse({   
                'success': True,
                'message': 'Árbol de problemas actualizado correctamente',
                'tree_data_ao_json':arbol_obj,
            })

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f"back: {str(e)}"}, status=400) 

def guardarArbolObjetivosNuevo (data, id_pp):

    nodos = data.get('nodos', [])
    conexiones = data.get('conexiones', [])

    try:
          NodoAO.objects.filter(id_pp__id_pp=id_pp).delete()

          # Guardar nodos
          nodos_dict = {}
          for nodo in nodos:
              n = NodoAO.objects.create(
                  id_html=nodo['id_html'],
                  texto=nodo['texto'],
                  tipo=tipo_str_a_codigo_ao(nodo['tipo']),
                  posicion_x=nodo['posicion_x'],
                  posicion_y=nodo['posicion_y'],
                  id_pp_id = id_pp  
              )
              nodos_dict[nodo['id_html']] = n

          # Guardar conexiones
          for conn in conexiones:
              ConexionAO.objects.create(
                  origen=nodos_dict[conn['origen']],
                  destino=nodos_dict[conn['destino']]
              )
        

          return JsonResponse({   
                'success': True,
                'message': 'Árbol de Objetivos ha sido actualizado correctamente'
            })

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f"back: {str(e)}"}, status=400) 
    
def guardarFormatoNueve(datos, id_pp_value):
    try:
        try:
            programa = programas_p.objects.get(id_pp=id_pp_value)
        except programas_p.DoesNotExist:
            raise ValueError("Programa no encontrado")

        with transaction.atomic():
            # 1. Lista de usernames enviados desde el frontend
            usernames_recibidos = [entrada.get("username") for entrada in datos if entrada.get("username")]

            # 2. Obtener permisos actuales en BD para ese programa
            permisos_actuales = permisos_pps.objects.filter(id_pp=programa)
            usernames_actuales = [permiso.users.username for permiso in permisos_actuales]

            # 3. Detectar usuarios a eliminar (que ya no están en el frontend)
            usernames_a_eliminar = set(usernames_actuales) - set(usernames_recibidos)

            # 4. Filtrar usuarios que NO pueden ser eliminados por su rol
            usernames_protegidos = set(
                UserProfile.objects.filter(
                    user__username__in=usernames_a_eliminar,
                    role__in=['editor', 'superuser', 'ultrauser']
                ).values_list('user__username', flat=True)
            )

            # 5. Filtrar los que sí se pueden eliminar
            usernames_a_eliminar_final = usernames_a_eliminar - usernames_protegidos
            # 4. Eliminar permisos y datos de Formato9 de esos usuarios
            for username in usernames_a_eliminar_final:
                try:
                    user = User.objects.get(username=username)
                    permisos_pps.objects.filter(id_pp=programa, users=user).delete()
                    Formato9.objects.filter(id_pp=programa, username=user).delete()
                except User.DoesNotExist:
                    continue

            # 5. Guardar o actualizar los datos recibidos
            for entrada in datos:
                username_str = entrada.get("username")
                try:
                    user = User.objects.get(username=username_str)
                except User.DoesNotExist:
                    continue

                # Crear permiso si no existe
                permisos_pps.objects.get_or_create(
                    id_pp=programa,
                    users=user,
                    defaults={"editor": False}
                )

                # Crear o actualizar Formato9
                Formato9.objects.update_or_create(
                    username=user,
                    id_pp=programa,
                    defaults={
                        "funcion": entrada.get("funcion", ""),
                        "interactua_con": entrada.get("interactua_con", ""),
                        "mecanismo": entrada.get("mecanismo_coordinacion", ""),
                        "responsabilidad": entrada.get("responsabilidad", ""),
                        "atribucion": entrada.get("atribucion_recapy", ""),
                    }
                )

        return JsonResponse({'status': 'ok', 'message': 'Formato 9 guardado correctamente.'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f"Error del back: {str(e)}"})

def guardarFormatoSeis(registros,id_pp):
    try:
        if len(registros) != 106:
            raise ValueError("Se esperaban 106 municipios, se recibieron {}".format(len(registros)))
        
        # Eliminar registros previos
        Formato6.objects.filter(id_pp=id_pp).delete()

        nuevos_registros = []

        for reg in registros:
            nombre_municipio = reg['municipio']
            try:
                municipio = Municipios.objects.get(municipio=nombre_municipio)
            except Municipios.DoesNotExist:
                raise ValueError(f"Municipio no encontrado: {nombre_municipio}")

            nuevo = Formato6(
                id_municipio=municipio,
                id_pp_id=id_pp,
                localidades=reg.get('localidades', 0),
                cuantificacion_general=reg.get('cuantificacion_general', 0),
                tipo1=reg.get('tipo1', 0),
                tipo2=reg.get('tipo2', 0),
                tipo3=reg.get('tipo3', 0),
                tipo4=reg.get('tipo4', 0),
                tipo5=reg.get('tipo5', 0),
                tipo6=reg.get('tipo6', 0),
                porcentaje1=reg.get('porcentaje1', 0.0),
                porcentaje2=reg.get('porcentaje2', 0.0),
            )
            nuevos_registros.append(nuevo)

        # Guardar todos los registros
        Formato6.objects.bulk_create(nuevos_registros)

        return JsonResponse({'status': 'ok', 'message': 'Formato 6 guardado correctamente.'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f"Error del back: {str(e)}"})

def guardarFormatoDoce(data, id_pp):
    try:
        id_pp_obj = programas_p.objects.get(id_pp=id_pp)
        
        fichas = FichaIndicador.objects.filter(id_pp=id_pp_obj)
        variables = Variable.objects.filter(ficha__in=fichas).distinct()
        
        with transaction.atomic():
            for entrada in data:
                nombre_variable = entrada.get('variable')
                if not nombre_variable:
                    continue
                
                variable_obj = variables.filter(nombre=nombre_variable).first()
                if not variable_obj:
                    continue
                
                # Eliminar registros que tengan la misma variable y el mismo id_pp
                FormatoDoce.objects.filter(variable=variable_obj, id_pp=id_pp_obj).delete()
                
                # Crear nuevo registro
                FormatoDoce.objects.create(
                    variable=variable_obj,
                    registro=entrada.get('registro', ''),
                    desagregacion=entrada.get('desagregacion', ''),
                    instrumentos=entrada.get('instrumentos', ''),
                    programa=entrada.get('programa', ''),
                    responsable=entrada.get('responsable', ''),
                    periodicidad=entrada.get('periodicidad', ''),
                    id_pp=id_pp_obj
                )
        
        return JsonResponse({'status': 'ok', 'message': 'Formato 12 guardado correctamente.'})
    
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f"Error del back: {str(e)}"})
    
def guardarFormatoTrece(data,id_pp): 
    REPORTE_PREDETERMINADOS = [
        "Avance trimestral de indicadores de Programas Presupuestarios",
        "Informe de Gobierno"
    ]
    programa = programas_p.objects.get(id_pp=id_pp)
    try:
        FormatoTrece.objects.filter(id_pp=programa).delete()

        # 🟢 Crear los nuevos registros
        for item in data:
            nombre = item.get('nombre_reporte', '').strip()
            descripcion = item.get('descripcion', '')
            periodicidad = item.get('periodicidad', '')
            responsable = item.get('responsable_integracion', '')
            es_predeterminado = nombre in REPORTE_PREDETERMINADOS

            FormatoTrece.objects.create(
                nombre_reporte=nombre,
                descripcion=descripcion,
                periodicidad=periodicidad,
                responsable_integracion=responsable,
                id_pp=programa,
                es_predeterminado=es_predeterminado
            )

        return JsonResponse({'status': 'ok', 'message': 'Formato 12 guardado correctamente back.'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f"Error del back: {str(e)}"})

def guardarFormatoCatorce(data, id_pp):
    try:
        with transaction.atomic():
            id_pp_obj = programas_p.objects.get(id_pp=id_pp)
            FormatoCatorce.objects.filter(id_pp=id_pp_obj).delete()

            nuevos = []

            for fila in data:
                try:
                    ficha = FichaIndicador.objects.get(id=fila['fichaId'])
                    variable = ficha.variables.first()  # Asumimos UNA variable por ficha
                    if not variable:
                        continue  # Saltar si no hay variable asociada
                except FichaIndicador.DoesNotExist:
                    continue  # Ficha no encontrada, se ignora

                nuevo = FormatoCatorce(
                    ficha=ficha,
                    variable=variable,
                    meta_2025=fila['metas'].get('2025') or 0,
                    meta_2026=fila['metas'].get('2026') or 0,
                    meta_2027=fila['metas'].get('2027') or 0,
                    meta_2028=fila['metas'].get('2028') or 0,
                    meta_2029=fila['metas'].get('2029') or 0,
                    meta_2030=fila['metas'].get('2030') or 0,
                    id_pp=id_pp_obj
                )
                nuevos.append(nuevo)

            FormatoCatorce.objects.bulk_create(nuevos)
            
        return JsonResponse({'status': 'ok', 'message': 'Formato 14 guardado correctamente.'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f"Error del back: {str(e)}"})
       
def guardarFormatoQuince(data, id_pp):
    try:
        id_pp_obj = programas_p.objects.get(id_pp=id_pp)
    except programas_p.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': f"No existe el programa con id {id_pp}"})

    try:
        # Puedes tener varias poblaciones objetivo ligadas a un id_pp,
        # aquí asumimos que quieres la más reciente o específica lógica:
        id_pp_obj = programas_p.objects.get(id_pp=id_pp)
        poblaciones = PoblacionObjetivo.objects.filter(id_pp=id_pp_obj)
        if not poblaciones.exists():
            return JsonResponse({'status': 'error', 'message': f"No hay población objetivo ligada al programa {id_pp}"})

        with transaction.atomic():
            FormatoQuince.objects.filter(id_pp=id_pp_obj).delete()
            poblaciones_obj = PoblacionObjetivo.objects.filter(id_pp=id_pp_obj, tipo='objetivo').first()
            for item in data:
                concepto = item.get("concepto")
                if not concepto:
                    continue

                FormatoQuince.objects.update_or_create(
                    concepto=concepto,
                    poblacion_objetivo=poblaciones_obj,
                    defaults={
                        "total": item.get("total") or 0,
                        "anio_2025": item.get("2025") or 0,
                        "anio_2026": item.get("2026") or 0,
                        "anio_2027": item.get("2027") or 0,
                        "anio_2028": item.get("2028") or 0,
                        "anio_2029": item.get("2029") or 0,
                        "anio_2030": item.get("2030") or 0,
                        "id_pp": id_pp_obj
                    }
                )

            return JsonResponse({'status': 'ok', 'message': 'Formato 15 guardado correctamente.'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f"Error del servidor: {str(e)}"})

def guardarFormatoDieciseis(data, id_pp):
    try:
        with transaction.atomic():
            id_pp_obj = programas_p.objects.get(id_pp=id_pp)
            componentes = ComponenteMir.objects.filter(id_pp=id_pp_obj)
            formato_ids = FormatoDieciseis.objects.filter(componente__in=componentes).values_list('id_registro', flat=True)

            Subformato16.objects.filter(registro_id__in=formato_ids).delete()
            FormatoDieciseis.objects.filter(id_registro__in=formato_ids).delete()

            # Procesar nuevos datos
            for comp_data in data:
                id_componente = comp_data.get('idComponente')
                objetivo = comp_data.get('objetivo', '')
                metas = comp_data.get('metas', {})
                presupuestos = comp_data.get('presupuestos', [])

                try:
                    componente = ComponenteMir.objects.get(id_componente=id_componente, id_pp=id_pp_obj)
                except ComponenteMir.DoesNotExist:
                    continue  # Saltar si no se encuentra el componente

                # Crear FormatoDieciseis
                formato16 = FormatoDieciseis.objects.create(
                    componente=componente,
                    meta_medianoplazo=metas.get('2025', ''),
                    meta_2025=metas.get('2025', ''),
                    meta_2026=metas.get('2026', ''),
                    meta_2027=metas.get('2027', ''),
                    meta_2028=metas.get('2028', ''),
                    meta_2029=metas.get('2029', ''),
                    meta_2030=metas.get('2030', '')
                )

                # Agrupar presupuestos por COG
                cog_presupuestos = {}
                for item in presupuestos:
                    try:
                        cog = int(item.get('cog', 0))
                        anio = int(item.get('anio', 0))
                        valor = int(item.get('valor') or 0)
                    except (ValueError, TypeError):
                        continue  # Saltar si los datos están mal formateados

                    if cog <= 0 or anio not in range(2025, 2031):
                        continue  # Validación básica

                    if cog not in cog_presupuestos:
                        cog_presupuestos[cog] = {a: 0 for a in range(2025, 2031)}

                    cog_presupuestos[cog][anio] = valor

                # Crear un Subformato16 por COG
                for cog, valores in cog_presupuestos.items():
                    Subformato16.objects.create(
                        registro=formato16,
                        cog=cog,
                        presupuesto_2025=valores.get(2025, 0),
                        presupuesto_2026=valores.get(2026, 0),
                        presupuesto_2027=valores.get(2027, 0),
                        presupuesto_2028=valores.get(2028, 0),
                        presupuesto_2029=valores.get(2029, 0),
                        presupuesto_2030=valores.get(2030, 0),
                    )

        return JsonResponse({'status': 'ok', 'message': 'Formato 16 guardado correctamente.'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f"Error del back: {str(e)}"})

             
def guardarFormatoDieciciete(data, id_pp):
    try:
        with transaction.atomic():
            id_pp_obj = programas_p.objects.get(id_pp=id_pp)
            RegistroFormatoDieciciete.objects.filter(id_pp=id_pp_obj).delete()
            for item in data:
                id_ff = item.get('id_ff', '')
                presupuesto = item.get('valores', {})
                p_2025= safe_int(presupuesto.get('2025', 0))
                p_2026= safe_int(presupuesto.get('2026', 0))
                p_2027 = safe_int(presupuesto.get('2027', 0))
                p_2028 = safe_int(presupuesto.get('2028', 0))
                p_2029 = safe_int(presupuesto.get('2029', 0))
                p_2030 = safe_int(presupuesto.get('2030', 0))
                
                ff = FuenteFinanciamiento.objects.get(id_ff=id_ff)
                RegistroFormatoDieciciete.objects.create(
                    id_ff = ff,
                    presupuesto_2025 = p_2025,
                    presupuesto_2026 = p_2026,
                    presupuesto_2027 = p_2027,
                    presupuesto_2028 = p_2028,
                    presupuesto_2029 = p_2029,
                    presupuesto_2030 = p_2030,
                    id_pp = id_pp_obj

                )
        return JsonResponse({'status': 'ok', 'message': 'Formato 17 guardado correctamente.'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f"Error del back: {str(e)}"})
    
