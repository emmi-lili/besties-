---
name: Warm Scrapbook Minimal
version: 1.0.0
description: >
  Identidad visual de la mitad privada de Amiguis — cuaderno compartido,
  cápsulas y memoria. El frontmatter es la fuente compilada; la prosa aclara
  intención. Ante conflicto de valores, gana el frontmatter.
colors:
  primary: "#994126"
  on-primary: "#FFFFFF"
  primary-container: "#FFDBCF"
  on-primary-container: "#3B0900"
  secondary: "#5C6B4A"
  on-secondary: "#FFFFFF"
  secondary-container: "#E0E8D4"
  on-secondary-container: "#171E0F"
  tertiary: "#7A5C3E"
  on-tertiary: "#FFFFFF"
  tertiary-container: "#F5DFC4"
  on-tertiary-container: "#2B1700"
  error: "#BA1A1A"
  on-error: "#FFFFFF"
  error-container: "#FFDAD6"
  on-error-container: "#410002"
  surface: "#fff8f5"
  surface-dim: "#E0D8D4"
  surface-bright: "#fff8f5"
  surface-container-lowest: "#FFFFFF"
  surface-container-low: "#FAF2EE"
  surface-container: "#F4ECE8"
  surface-container-high: "#EEE6E2"
  surface-container-highest: "#E9E1DD"
  on-surface: "#1C1412"
  on-surface-variant: "#53433E"
  outline: "#85736D"
  outline-variant: "#D8C2BB"
  inverse-surface: "#312825"
  inverse-on-surface: "#FBEFEA"
  inverse-primary: "#FFB59A"
  accent-gold: "#D4AF77"
  accent-blush: "#E8B49B"
  scrim: "#000000"
  shadow: "#000000"
elevation:
  level1: "0 1px 2px rgba(28, 20, 18, 0.05), 0 1px 3px rgba(153, 65, 38, 0.04)"
  level2: "0 2px 6px rgba(28, 20, 18, 0.06), 0 4px 12px rgba(153, 65, 38, 0.06)"
  level3: "0 6px 16px rgba(28, 20, 18, 0.08), 0 12px 28px rgba(153, 65, 38, 0.08)"
typography:
  display: "Playfair Display"
  body: "Plus Jakarta Sans"
  scale:
    display-lg: { size: "3.5rem", lineHeight: "1.1", weight: "500" }
    headline-lg: { size: "2rem", lineHeight: "1.2", weight: "500" }
    headline-md: { size: "1.5rem", lineHeight: "1.25", weight: "500" }
    headline-sm: { size: "1.25rem", lineHeight: "1.3", weight: "500" }
    title-md: { size: "1.125rem", lineHeight: "1.4", weight: "600" }
    body-lg: { size: "1.0625rem", lineHeight: "1.6", weight: "400" }
    body-md: { size: "0.9375rem", lineHeight: "1.55", weight: "400" }
    label-md: { size: "0.8125rem", lineHeight: "1.4", weight: "500" }
    label-sm: { size: "0.6875rem", lineHeight: "1.3", weight: "500" }
layout:
  column-max: "480px"
  notebook-page: "440px"
  nav-items: ["Diario", "Cápsulas", "Lugares", "Nosotras"]
motion:
  duration-min: "200ms"
  duration-max: "400ms"
  seal-hold: "1200ms"
---

# Warm Scrapbook Minimal

Cuaderno compartido: papel tibio, tipografía con voz humana (Playfair) frente a interfaz (Plus Jakarta Sans), profundidad de papel — nunca sombra Material dura.

## Acentos fuera del set M3

El frontmatter no incluye dos acentos que la prosa necesita. Se agregan como tokens de producto:

- **Oro antiguo** `#D4AF77` (`accent-gold`) — pineado, rachas, sellos de colección.
- **Rubor** `#E8B49B` (`accent-blush`) — reacciones y etiquetas emocionales.

## Reglas

- Serif = escribió una persona. Sans = escribió el sistema.
- Polaroids: rotación estable ±1.5° derivada del id.
- Sin hexadecimales en componentes: solo tokens.
- Copy de cifrado: solo si el código cifra. Mientras no, "Solo tú y [nombre] pueden ver estos sobres".
