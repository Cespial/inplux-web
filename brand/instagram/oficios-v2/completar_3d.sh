#!/bin/zsh
# Completa los cuadros que falten de cada plano (Blender a veces se cierra a mitad; tres_d.py reanuda).
cd "$(dirname "$0")"
typeset -A ESPERADOS; ESPERADOS=(cincel 96 titulo 72 acueducto 192)
for p in cincel titulo acueducto; do
  for sufijo in -previa ""; do
    flag=""; [[ "$sufijo" == "-previa" ]] && flag="--previa"
    for intento in 1 2 3 4 5 6; do
      n=$(ls out/3d/$p$sufijo 2>/dev/null | wc -l | tr -d ' ')
      [[ "$n" -ge "${ESPERADOS[$p]}" ]] && break
      echo "$p$sufijo: $n/${ESPERADOS[$p]}, intento $intento"
      blender -b -P tres_d.py -- $p $flag > tmp/completar_${p}${sufijo}_$intento.log 2>&1
    done
  done
done
echo COMPLETO
