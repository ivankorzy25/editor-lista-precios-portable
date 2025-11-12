# 📋 CAMBIOS: CAMPOS COMPLETOS EN PRODUCTOS

## 🎯 Objetivo Completado

Se agregaron **28 campos nuevos** a la colección `productos` en Directus para eliminar TODOS los datos hardcodeados del sistema. Ahora cada producto puede mostrar información completa tanto para uso público como interno.

---

## ✅ Campos Agregados

### 💰 PRECIOS (Uso Público)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `precio_con_iva` | decimal | Precio final para el cliente (con IVA) |
| `precio_sin_iva` | decimal | Precio base sin impuestos |
| `iva_monto` | decimal | Monto del IVA en USD |
| `iva_porcentaje` | decimal | Porcentaje de IVA (ej: 10.5, 21) - Default: 10.5 |

### 🔒 COSTOS (Uso Interno)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `precio_compra_contado` | decimal | Precio de compra al contado |
| `bonificacion_porcentaje` | decimal | Porcentaje de bonificación - Default: 25 |
| `descuento_contado_porcentaje` | decimal | Descuento adicional por pago contado - Default: 8 |
| `margen_ganancia` | decimal | Margen de ganancia en USD |
| `margen_ganancia_porcentaje` | decimal | Porcentaje de ganancia |

### 💳 OPCIONES DE PAGO
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `pago_contado_precio1` | decimal | Opción de pago contado 1 |
| `pago_contado_precio2` | decimal | Opción de pago contado 2 |
| `pago_contado_precio3` | decimal | Opción de pago contado 3 |
| `pago_financiado_precio1` | decimal | Opción de pago financiado 1 |
| `pago_financiado_precio2` | decimal | Opción de pago financiado 2 |
| `pago_financiado_precio3` | decimal | Opción de pago financiado 3 |

### ⚙️ ESPECIFICACIONES TÉCNICAS
| Campo | Tipo | Opciones |
|-------|------|----------|
| `combustible` | select | Nafta, Diesel, Gas, Eléctrico |
| `insonorizado` | boolean | Tiene carcasa insonorizada |
| `cabina` | boolean | Incluye cabina |
| `tablero_transfer` | boolean | Tiene tablero de transferencia |
| `tipo_dolar` | select | BNA, Blue, MEP, CCL - Default: BNA |
| `potencia` | string | Potencia (ej: 3000 W) |
| `tension` | string | Tensión (ej: 220V-12V/AVR) |
| `motor` | string | Motor (ej: 6,5 HP) |
| `arranque` | select | Manual, Eléctrico, Ambos |
| `peso` | string | Peso (ej: 46,5 Kg) |

### 📝 INFORMACIÓN ADICIONAL
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `accesorios` | text | Lista de accesorios incluidos |
| `garantia` | string | Período de garantía |
| `financiacion` | string | Opciones de financiación |

---

## 🔧 Scripts Creados

### `add-campos-completos.js`
Script que crea todos los campos automáticamente en Directus.

**Uso:**
```bash
node add-campos-completos.js
```

---

## 📊 Cambios en el Frontend

### Archivo: `script-v2-clean.js`

#### Función `viewProduct()` Actualizada (líneas 306-403)

La función ahora popula dinámicamente TODOS los campos del producto:

```javascript
// PRECIOS PÚBLICOS
setElementText('modalSalePricePublic', producto.precio_con_iva ? `USD ${producto.precio_con_iva}` : 'Consultar');
setElementText('modalListPrice', producto.precio_sin_iva ? `USD ${producto.precio_sin_iva}` : '');
setElementText('modalIVAAmount', producto.iva_monto ? `USD ${producto.iva_monto}` : '');
setElementText('modalIVAInfo', producto.iva_porcentaje ? `${producto.iva_porcentaje}% del precio base` : '');

// COSTOS (USO INTERNO)
setElementText('modalPurchasePrice', producto.precio_compra_contado ? `USD ${producto.precio_compra_contado}` : '');
setElementText('modalDiscountInfo', `Bonificación ${producto.bonificacion_porcentaje || 0}% + Contado ${producto.descuento_contado_porcentaje || 0}%`);
setElementText('modalProfitMargin', producto.margen_ganancia ? `USD ${producto.margen_ganancia}` : '');
setElementText('modalProfitPercent', producto.margen_ganancia_porcentaje ? `${producto.margen_ganancia_porcentaje}% de ganancia` : '');

// OPCIONES DE PAGO
const contadoHTML = `
    ${producto.pago_contado_precio1 ? `<p>USD ${producto.pago_contado_precio1}</p>` : ''}
    ${producto.pago_contado_precio2 ? `<p>USD ${producto.pago_contado_precio2}</p>` : ''}
    ${producto.pago_contado_precio3 ? `<p>USD ${producto.pago_contado_precio3}</p>` : ''}
    <small>Bonif ${producto.bonificacion_porcentaje || 0}% + Contado ${producto.descuento_contado_porcentaje || 0}%</small>
`;
setElementHTML('modalCashPrice', contadoHTML);

// ESPECIFICACIONES TÉCNICAS
setElementText('modalFuelType', producto.combustible ? capitalize(producto.combustible) : '-');
setElementText('modalSoundproof', producto.insonorizado ? 'Sí' : 'No');
setElementText('modalCabin', producto.cabina ? 'Sí' : 'No');
setElementText('modalControlPanel', producto.tablero_transfer ? 'Sí' : 'No');
setElementText('modalIVAType', producto.iva_porcentaje ? `${producto.iva_porcentaje}%` : '-');
setElementText('modalDollarType', producto.tipo_dolar || '-');

// INFORMACIÓN ADICIONAL
setElementText('modalAccessories', producto.accesorios || '-');
setElementText('modalWarranty', producto.garantia || '-');
setElementText('modalFinancing', producto.financiacion || '-');
```

#### Funciones Auxiliares Agregadas

```javascript
function setElementText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
}

function setElementHTML(id, html) {
    const element = document.getElementById(id);
    if (element) element.innerHTML = html;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
```

---

## 🎨 Modal Actualizado (index.html)

El modal ya incluye todos los elementos HTML necesarios:

- ✅ `modalSalePricePublic` - Precio con IVA
- ✅ `modalListPrice` - Precio sin IVA
- ✅ `modalIVAAmount` - Monto IVA
- ✅ `modalIVAInfo` - Info IVA
- ✅ `modalPurchasePrice` - Precio compra
- ✅ `modalDiscountInfo` - Descuentos
- ✅ `modalProfitMargin` - Margen ganancia
- ✅ `modalProfitPercent` - % Ganancia
- ✅ `modalCashPrice` - Precios contado
- ✅ `modalFinancedPrice` - Precios financiado
- ✅ `modalFuelType` - Combustible
- ✅ `modalSoundproof` - Insonorizado
- ✅ `modalCabin` - Cabina
- ✅ `modalControlPanel` - Tablero/Transfer
- ✅ `modalIVAType` - Tipo IVA
- ✅ `modalDollarType` - Tipo Dólar
- ✅ `modalAccessories` - Accesorios
- ✅ `modalWarranty` - Garantía
- ✅ `modalFinancing` - Financiación

---

## 🚀 Cómo Usar

### 1. Completar datos en Directus

```
1. Ir a http://localhost:8055/admin/content/productos
2. Seleccionar un producto
3. Completar los nuevos campos en sus grupos:
   - 💰 Precios (públicos)
   - 🔒 Costos (interno)
   - 💳 Pagos
   - ⚙️ Especificaciones
   - 📝 Adicional
4. Guardar
```

### 2. Ver en Frontend

```
1. Abrir index.html
2. Hacer click en cualquier producto
3. El modal mostrará TODA la información
4. Toggle "Modo Uso Interno" para ver costos
```

---

## 🎁 Ventajas

✅ **Cero hardcode**: Toda la información viene de Directus
✅ **Datos estructurados**: Campos tipados (decimal, boolean, select)
✅ **Validación automática**: Directus valida los datos
✅ **Control de visibilidad**: Público vs Interno
✅ **Facilidad de edición**: Todo desde Directus Admin
✅ **Escalable**: Agregar más campos cuando sea necesario

---

## 📝 Ejemplo de Producto Completo

Ver producto `GL3300AM` en Directus - tiene todos los campos completados como ejemplo.

---

## 🔄 Próximos Pasos

1. ✅ Campos creados en Directus
2. ✅ Frontend actualizado para mostrar campos
3. ✅ Modal HTML completo
4. ⏳ Poblar datos en todos los productos
5. ⏳ Probar modo público vs interno
6. ⏳ Ajustar estilos si es necesario

---

**Versión:** 2.1
**Fecha:** Noviembre 2025
**Estado:** ✅ Completado y listo para usar
