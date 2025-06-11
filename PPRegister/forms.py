from django import forms
from .models import ProblemaCentral, CausaDirecta, CausaIndirecta, EfectoSuperior

class ProblemaCentralForm(forms.ModelForm):
    class Meta:
        model = ProblemaCentral
        fields = ['problema_central']

class CausaDirectaForm(forms.ModelForm):
    class Meta:
        model = CausaDirecta
        fields = ['causa_directa']

class CausaIndirectaForm(forms.ModelForm):
    class Meta:
        model = CausaIndirecta
        fields = ['causa_indirecta']

class EfectoSuperiorForm(forms.ModelForm):
    class Meta:
        model = EfectoSuperior
        fields = ['efecto_superior']

