# Floweshop · חי עציץ ופרח

Web de la floristería con interfaz en hebreo (RTL), fondo de estuco y tonos crema, oliva y dorado.

## Ejecutar

Requiere Node.js y npm. No necesita instalar dependencias.

```sh
npm start
```

Abrir http://127.0.0.1:4180. La variable `PORT` permite cambiar el puerto.

## Páginas

- Inicio: `/`
- Catálogo con filtros: `/#/products`
- Producto, variantes de color y cuatro vistas: `/#/product/roses`
- Personalizador The Studio: `/#/studio`

The Studio permite seleccionar un color o todos, tamaño, ocasión, presupuesto y notas. La imagen muestra una variante de referencia, no una simulación de la mezcla final. El botón de pedido prepara un mensaje de WhatsApp; el visitante decide enviarlo. Precio, disponibilidad y envío se confirman con la floristería.

## Archivos

La web se encuentra en `atelier/`. HTML, CSS y JavaScript sin dependencias; servidor local en `atelier/server.mjs`. Imágenes y fuentes se sirven desde `atelier/assets/`.

Montserrat se usa para los caracteres compatibles; Heebo local cubre el hebreo. Las imágenes de variantes son recreaciones con IA basadas en trabajos de la tienda, no prueba de existencias. El logo corresponde a la tienda. Las fotografías de referencia descargadas, archivos temporales y paquetes ZIP no forman parte de este repositorio.

## Comprobaciones

```sh
npm run check
```

Se comprobaron en el navegador la navegación, filtros y selección de colores del Studio. No hay carrito ni pasarela de pago.
