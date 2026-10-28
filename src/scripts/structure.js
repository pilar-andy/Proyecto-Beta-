/**
 * structure.js — dibuja la Interfaz 2: diagrama, pasos en curso y capas.
 * Se ilumina según el estado del agente (state.js).
 */

import { subscribe, PHASE } from './state.js';
import { STEP_LABELS } from './agent.js';
import { LAYERS, STEP_NODES } from './structure-data.js';

const CX = 180;
const CY = 140;
const R = 78;

// Posición de cada nodo alrededor del núcleo y cómo se alinea su etiqueta.
const NODES = {
  input:  { x: CX,     y: CY - R, label: { x: CX,         y: CY - R - 20, anchor: 'middle' } },
  tools:  { x: CX + R, y: CY,     label: { x: CX + R + 18, y: CY + 4,     anchor: 'start'  } },
  output: { x: CX,     y: CY + R, label: { x: CX,         y: CY + R + 30, anchor: 'middle' } },
  memory: { x: CX - R, y: CY,     label: { x: CX - R - 18, y: CY + 4,     anchor: 'end'    } },
};

const NAMES = Object.fromEntries(LAYERS.map((l) => [l.id, l.name]));

function diagramMarkup() {
  const links = Object.values(NODES)
    .map((n) => `<line class="d-link" x1="${CX}" y1="${CY}" x2="${n.x}" y2="${n.y}"/>`)
    .join('');

  const nodes = Object.entries(NODES)
    .map(([id, n]) => `
      <g class="d-node" data-node="${id}" data-active="false">
        <circle class="d-halo" cx="${n.x}" cy="${n.y}" r="20"/>
        <circle class="d-node-dot" cx="${n.x}" cy="${n.y}" r="9"/>
        <text class="d-label" x="${n.label.x}" y="${n.label.y}" text-anchor="${n.label.anchor}">${NAMES[id]}</text>
      </g>`)
    .join('');

  return `
    <defs>
      <linearGradient id="coreGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="var(--core-a)"/>
        <stop offset="1" stop-color="var(--core-b)"/>
      </linearGradient>
    </defs>
    <circle class="d-ring" cx="${CX}" cy="${CY}" r="${R}"/>
    ${links}
    <g class="d-orbit" data-on="false"><circle cx="${CX}" cy="${CY - R}" r="4.5"/></g>
    ${nodes}
    <g class="d-core" data-node="agent" data-active="false">
      <circle class="d-core-ring" cx="${CX}" cy="${CY}" r="36"/>
      <circle cx="${CX}" cy="${CY}" r="30" fill="url(#coreGrad)"/>
      <text class="d-core-text" x="${CX}" y="${CY + 4}">${NAMES.agent}</text>
    </g>`;
}

export function initStructure({ diagram, steps, layers }) {
  diagram.innerHTML = diagramMarkup();   // texto generado aquí mismo, sin datos del usuario

  // Pasos en curso
  const stepEls = STEP_LABELS.map((label) => {
    const li = document.createElement('li');
    li.className = 'step';
    li.dataset.state = 'pending';
    const text = document.createElement('span');
    text.className = 'step-text';
    text.textContent = label;
    li.append(text);
    steps.append(li);
    return li;
  });

  // Capas de la estructura
  LAYERS.forEach((layer) => {
    const li = document.createElement('li');
    li.className = 'layer';

    const head = document.createElement('div');
    head.className = 'layer-head';
    const name = document.createElement('h3');
    name.className = 'layer-name';
    name.textContent = layer.name;
    const tag = document.createElement('span');
    tag.className = 'layer-tag';
    tag.textContent = layer.tag;
    head.append(name, tag);

    const text = document.createElement('p');
    text.className = 'layer-text';
    text.textContent = layer.text;

    li.append(head, text);
    layers.append(li);
  });

  const nodeEls = diagram.querySelectorAll('[data-node]');
  const orbit = diagram.querySelector('.d-orbit');

  subscribe((s) => {
    const working = s.phase === PHASE.WORKING;
    const activeNode = working ? STEP_NODES[s.step] : null;

    nodeEls.forEach((el) => {
      el.dataset.active = String(el.dataset.node === activeNode);
    });
    orbit.dataset.on = String(working);

    stepEls.forEach((li, i) => {
      let stateName = 'pending';
      if (s.phase === PHASE.DONE) stateName = 'done';
      else if (working) stateName = i < s.step ? 'done' : i === s.step ? 'active' : 'pending';
      li.dataset.state = stateName;
      if (stateName === 'active') li.setAttribute('aria-current', 'step');
      else li.removeAttribute('aria-current');
    });
  });
}
