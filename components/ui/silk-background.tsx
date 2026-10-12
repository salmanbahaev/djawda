"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Flowing silk adapted from
 * https://21st.dev/@waleedkibhen/components/silk-background-animation
 * (vvisedev Crafts). The original paints a 2D canvas; this is the same
 * fold formula on a single WebGL quad so a phone can hold 60fps.
 */

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
uniform vec2 uResolution;
uniform float uTime;
uniform float uDpr;

void main() {
  vec2 frag = gl_FragCoord.xy / max(uDpr, 1.0);
  float px = frag.x;
  float py = frag.y;
  float on = step(mod(floor(px), 2.0), 0.0) * step(mod(floor(py), 2.0), 0.0);

  float k = px / uResolution.x * 2.0;
  float v = py / uResolution.y * 2.0;
  float dx = k;
  float dy = v + 0.03 * sin(8.0 * dx - uTime);
  float pattern = 0.6 + 0.4 * sin(
    5.0 * (dx + dy + cos(3.0 * dx + 5.0 * dy) + 0.02 * uTime) +
    sin(20.0 * (dx + dy - 0.1 * uTime))
  );

  float e = 2.71828;
  float nx = e * sin(e * px);
  float ny = e * sin(e * py);
  float noise = nx * ny * (1.0 + px);
  noise = noise - floor(noise);
  float shade = max(0.0, pattern - noise / 15.0 * 0.8);
  vec3 col = vec3(0.50, 0.50, 0.52) * shade * on;

  vec2 uv = frag / uResolution - 0.5;
  float vig = smoothstep(0.22, 0.95, length(uv * vec2(1.15, 1.35)));
  col = mix(col, vec3(0.0), vig * 0.62);
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function SilkBackground() {
  const host = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const root = host.current;
    const canvas = root?.querySelector("canvas");
    if (!root || !canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uDpr = gl.getUniformLocation(program, "uDpr");

    let raf = 0;
    let visible = true;
    let running = true;
    const started = performance.now();

    const draw = (time: number) => {
      const width = Math.max(1, root.clientWidth);
      const height = Math.max(1, root.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, width < 768 ? 1.25 : 1.5);
      const bw = Math.round(width * dpr);
      const bh = Math.round(height * dpr);
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      gl.viewport(0, 0, bw, bh);
      gl.uniform2f(uResolution, width, height);
      gl.uniform1f(uDpr, dpr);
      const elapsed = reduce ? 1.4 : ((time - started) / 1000) * 0.65;
      gl.uniform1f(uTime, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (time: number) => {
      if (!running) return;
      if (!visible) {
        raf = 0;
        return;
      }
      draw(time);
      if (!reduce) raf = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (visible && !reduce && raf === 0) raf = requestAnimationFrame(loop);
      },
      { threshold: 0.02 },
    );
    observer.observe(root);
    draw(started);
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, [reduce]);

  return (
    <div ref={host} className="absolute inset-0 bg-[#070708]" aria-hidden>
      <canvas className="block h-full w-full" />
    </div>
  );
}
