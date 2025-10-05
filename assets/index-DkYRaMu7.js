(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const i of document.querySelectorAll('link[rel="modulepreload"]')) s(i);
  new MutationObserver((i) => {
    for (const o of i)
      if (o.type === "childList")
        for (const r of o.addedNodes)
          r.tagName === "LINK" && r.rel === "modulepreload" && s(r);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(i) {
    const o = {};
    return (
      i.integrity && (o.integrity = i.integrity),
      i.referrerPolicy && (o.referrerPolicy = i.referrerPolicy),
      i.crossOrigin === "use-credentials"
        ? (o.credentials = "include")
        : i.crossOrigin === "anonymous"
        ? (o.credentials = "omit")
        : (o.credentials = "same-origin"),
      o
    );
  }
  function s(i) {
    if (i.ep) return;
    i.ep = !0;
    const o = t(i);
    fetch(i.href, o);
  }
})();
const nt = "modulepreload",
  st = function (n) {
    return "/" + n;
  },
  xe = {},
  Le = function (e, t, s) {
    let i = Promise.resolve();
    if (t && t.length > 0) {
      let g = function (p) {
        return Promise.all(
          p.map((d) =>
            Promise.resolve(d).then(
              (w) => ({ status: "fulfilled", value: w }),
              (w) => ({ status: "rejected", reason: w })
            )
          )
        );
      };
      var r = g;
      document.getElementsByTagName("link");
      const a = document.querySelector("meta[property=csp-nonce]"),
        c = a?.nonce || a?.getAttribute("nonce");
      i = g(
        t.map((p) => {
          if (((p = st(p)), p in xe)) return;
          xe[p] = !0;
          const d = p.endsWith(".css"),
            w = d ? '[rel="stylesheet"]' : "";
          if (document.querySelector(`link[href="${p}"]${w}`)) return;
          const E = document.createElement("link");
          if (
            ((E.rel = d ? "stylesheet" : nt),
            d || (E.as = "script"),
            (E.crossOrigin = ""),
            (E.href = p),
            c && E.setAttribute("nonce", c),
            document.head.appendChild(E),
            d)
          )
            return new Promise((F, u) => {
              E.addEventListener("load", F),
                E.addEventListener("error", () =>
                  u(new Error(`Unable to preload CSS for ${p}`))
                );
            });
        })
      );
    }
    function o(a) {
      const c = new Event("vite:preloadError", { cancelable: !0 });
      if (((c.payload = a), window.dispatchEvent(c), !c.defaultPrevented))
        throw a;
    }
    return i.then((a) => {
      for (const c of a || []) c.status === "rejected" && o(c.reason);
      return e().catch(o);
    });
  };
var it = Object.defineProperty,
  Ie = (n) => {
    throw TypeError(n);
  },
  ot = (n, e, t) =>
    e in n
      ? it(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t })
      : (n[e] = t),
  m = (n, e, t) => ot(n, typeof e != "symbol" ? e + "" : e, t),
  De = (n, e, t) => e.has(n) || Ie("Cannot " + t),
  ie = (n, e, t) => (De(n, e, "read from private field"), e.get(n)),
  rt = (n, e, t) =>
    e.has(n)
      ? Ie("Cannot add the same private member more than once")
      : e instanceof WeakSet
      ? e.add(n)
      : e.set(n, t),
  at = (n, e, t, s) => (De(n, e, "write to private field"), e.set(n, t), t),
  fe = new Intl.Collator(0, { numeric: 1 }).compare;
function Re(n, e, t) {
  return (
    (n = n.split(".")),
    (e = e.split(".")),
    fe(n[0], e[0]) ||
      fe(n[1], e[1]) ||
      ((e[2] = e.slice(2).join(".")),
      (t = /[.-]/.test((n[2] = n.slice(2).join(".")))),
      t == /[.-]/.test(e[2]) ? fe(n[2], e[2]) : t ? -1 : 1)
  );
}
const ct = "host",
  Ae = "queue/data",
  lt = "queue/join",
  Pe = "upload",
  ut = "login",
  ce = "config",
  dt = "info",
  pt = "runtime",
  ht = "sleeptime",
  ft = "heartbeat",
  mt = "component_server",
  gt = "reset",
  _t = "cancel",
  wt = "app_id",
  yt = "https://gradio-space-api-fetcher-v2.hf.space/api",
  Be = "This application is currently busy. Please try again. ",
  ee = "Connection errored out. ",
  V = "Could not resolve app config. ",
  vt = "Could not get space status. ",
  bt = "Could not get API info. ",
  ve = "Space metadata could not be loaded. ",
  $t = "Invalid URL. A full URL path is required.",
  kt = "Not authorized to access this space. ",
  Fe = "Invalid credentials. Could not login. ",
  Et = "Login credentials are required to access this space.",
  St = "File system access is only available in Node.js environments",
  ze = "Root URL not found in client config",
  xt = "Error uploading file";
function Lt(n, e, t) {
  return e.startsWith("http://") || e.startsWith("https://")
    ? t
      ? n
      : e
    : n + e;
}
async function je(n, e, t) {
  try {
    return (
      (
        await (
          await fetch(`https://huggingface.co/api/spaces/${n}/jwt`, {
            headers: {
              Authorization: `Bearer ${e}`,
              ...(t ? { Cookie: t } : {}),
            },
          })
        ).json()
      ).token || !1
    );
  } catch {
    return !1;
  }
}
function Pt(n) {
  let e = {};
  return (
    n.forEach(({ api_name: t, id: s }) => {
      t && (e[t] = s);
    }),
    e
  );
}
async function jt(n) {
  const e = this.options.hf_token
    ? { Authorization: `Bearer ${this.options.hf_token}` }
    : {};
  if (
    ((e["Content-Type"] = "application/json"),
    typeof window < "u" &&
      window.gradio_config &&
      location.origin !== "http://localhost:9876")
  ) {
    if (
      (window.gradio_config.current_page &&
        (n = n.substring(0, n.lastIndexOf("/"))),
      window.gradio_config.dev_mode)
    ) {
      let t = _e(n, this.deep_link ? ce + "?deep_link=" + this.deep_link : ce);
      const s = await this.fetch(t, { headers: e, credentials: "include" }),
        i = await Oe(s, n, !!this.options.auth);
      window.gradio_config = {
        ...i,
        current_page: window.gradio_config.current_page,
      };
    }
    return (window.gradio_config.root = n), { ...window.gradio_config };
  } else if (n) {
    let t = _e(n, this.deep_link ? ce + "?deep_link=" + this.deep_link : ce);
    const s = await this.fetch(t, { headers: e, credentials: "include" });
    return Oe(s, n, !!this.options.auth);
  }
  throw new Error(V);
}
async function Oe(n, e, t) {
  var s, i;
  if (n?.status === 401 && !t) {
    const o = await n.json(),
      r = (s = o?.detail) == null ? void 0 : s.auth_message;
    throw new Error(r || Et);
  } else if (n?.status === 401 && t) throw new Error(Fe);
  if (n?.status === 200) {
    let o = await n.json();
    return (
      (o.root = e),
      (i = o.dependencies) == null ||
        i.forEach((r, a) => {
          r.id === void 0 && (r.id = a);
        }),
      o
    );
  } else if (n?.status === 401) throw new Error(kt);
  throw new Error(V);
}
async function Ot() {
  const { http_protocol: n, host: e } = await ue(
    this.app_reference,
    this.options.hf_token
  );
  try {
    if (this.options.auth) {
      const t = await Me(
        n,
        e,
        this.options.auth,
        this.fetch,
        this.options.hf_token
      );
      t && this.set_cookies(t);
    }
  } catch (t) {
    throw Error(t.message);
  }
}
async function Me(n, e, t, s, i) {
  const o = new FormData();
  o.append("username", t?.[0]), o.append("password", t?.[1]);
  let r = {};
  i && (r.Authorization = `Bearer ${i}`);
  const a = await s(`${n}//${e}/${ut}`, {
    headers: r,
    method: "POST",
    body: o,
    credentials: "include",
  });
  if (a.status === 200) return a.headers.get("set-cookie");
  throw a.status === 401 ? new Error(Fe) : new Error(ve);
}
function me(n) {
  if (n.startsWith("http")) {
    const { protocol: e, host: t, pathname: s } = new URL(n);
    return {
      ws_protocol: e === "https:" ? "wss" : "ws",
      http_protocol: e,
      host: t + (s !== "/" ? s : ""),
    };
  }
  return { ws_protocol: "wss", http_protocol: "https:", host: new URL(n).host };
}
const Je = (n) => {
    let e = [];
    return (
      n.split(/,(?=\s*[^\s=;]+=[^\s=;]+)/).forEach((t) => {
        const [s, i] = t.split(";")[0].split("=");
        s && i && e.push(`${s.trim()}=${i.trim()}`);
      }),
      e
    );
  },
  be = /^[a-zA-Z0-9_\-\.]+\/[a-zA-Z0-9_\-\.]+$/,
  Ct = /.*hf\.space\/{0,1}.*$/;
async function ue(n, e) {
  const t = {};
  e && (t.Authorization = `Bearer ${e}`);
  const s = n.trim().replace(/\/$/, "");
  if (be.test(s))
    try {
      const i = (
        await (
          await fetch(`https://huggingface.co/api/spaces/${s}/${ct}`, {
            headers: t,
          })
        ).json()
      ).host;
      return { space_id: n, ...me(i) };
    } catch {
      throw new Error(ve);
    }
  if (Ct.test(s)) {
    const { ws_protocol: i, http_protocol: o, host: r } = me(s);
    return {
      space_id: r.split("/")[0].replace(".hf.space", ""),
      ws_protocol: i,
      http_protocol: o,
      host: r,
    };
  }
  return { space_id: !1, ...me(s) };
}
const _e = (...n) => {
  try {
    return n.reduce(
      (e, t) => (
        (e = e.replace(/\/+$/, "")),
        (t = t.replace(/^\/+/, "")),
        new URL(t, e + "/").toString()
      )
    );
  } catch {
    throw new Error($t);
  }
};
function Tt(n, e, t) {
  const s = { named_endpoints: {}, unnamed_endpoints: {} };
  return (
    Object.keys(n).forEach((i) => {
      (i === "named_endpoints" || i === "unnamed_endpoints") &&
        ((s[i] = {}),
        Object.entries(n[i]).forEach(([o, { parameters: r, returns: a }]) => {
          var c, g, p, d;
          const w =
              ((c = e.dependencies.find(
                (u) => u.api_name === o || u.api_name === o.replace("/", "")
              )) == null
                ? void 0
                : c.id) ||
              t[o.replace("/", "")] ||
              -1,
            E =
              w !== -1
                ? (g = e.dependencies.find((u) => u.id == w)) == null
                  ? void 0
                  : g.types
                : { generator: !1, cancel: !1 };
          if (
            w !== -1 &&
            ((d =
              (p = e.dependencies.find((u) => u.id == w)) == null
                ? void 0
                : p.inputs) == null
              ? void 0
              : d.length) !== r.length
          ) {
            const u = e.dependencies
              .find((y) => y.id == w)
              .inputs.map((y) => {
                var T;
                return (T = e.components.find((A) => A.id === y)) == null
                  ? void 0
                  : T.type;
              });
            try {
              u.forEach((y, T) => {
                if (y === "state") {
                  const A = {
                    component: "state",
                    example: null,
                    parameter_default: null,
                    parameter_has_default: !0,
                    parameter_name: null,
                    hidden: !0,
                  };
                  r.splice(T, 0, A);
                }
              });
            } catch (y) {
              console.error(y);
            }
          }
          const F = (u, y, T, A) => ({
            ...u,
            description: qt(u?.type, T),
            type: Ut(u?.type, y, T, A) || "",
          });
          s[i][o] = {
            parameters: r.map((u) =>
              F(u, u?.component, u?.serializer, "parameter")
            ),
            returns: a.map((u) => F(u, u?.component, u?.serializer, "return")),
            type: E,
          };
        }));
    }),
    s
  );
}
function Ut(n, e, t, s) {
  if (e === "Api") return n.type;
  switch (n?.type) {
    case "string":
      return "string";
    case "boolean":
      return "boolean";
    case "number":
      return "number";
  }
  if (t === "JSONSerializable" || t === "StringSerializable") return "any";
  if (t === "ListStringSerializable") return "string[]";
  if (e === "Image")
    return s === "parameter" ? "Blob | File | Buffer" : "string";
  if (t === "FileSerializable")
    return n?.type === "array"
      ? s === "parameter"
        ? "(Blob | File | Buffer)[]"
        : "{ name: string; data: string; size?: number; is_file?: boolean; orig_name?: string}[]"
      : s === "parameter"
      ? "Blob | File | Buffer"
      : "{ name: string; data: string; size?: number; is_file?: boolean; orig_name?: string}";
  if (t === "GallerySerializable")
    return s === "parameter"
      ? "[(Blob | File | Buffer), (string | null)][]"
      : "[{ name: string; data: string; size?: number; is_file?: boolean; orig_name?: string}, (string | null))][]";
}
function qt(n, e) {
  return e === "GallerySerializable"
    ? "array of [file, label] tuples"
    : e === "ListStringSerializable"
    ? "array of strings"
    : e === "FileSerializable"
    ? "array of files or single file"
    : n?.description;
}
function ge(n, e) {
  switch (n.msg) {
    case "send_data":
      return { type: "data" };
    case "send_hash":
      return { type: "hash" };
    case "queue_full":
      return {
        type: "update",
        status: {
          queue: !0,
          message: Be,
          stage: "error",
          code: n.code,
          success: n.success,
        },
      };
    case "heartbeat":
      return { type: "heartbeat" };
    case "unexpected_error":
      return {
        type: "unexpected_error",
        status: {
          queue: !0,
          message: n.message,
          session_not_found: n.session_not_found,
          stage: "error",
          success: !1,
        },
      };
    case "broken_connection":
      return {
        type: "broken_connection",
        status: { queue: !0, message: n.message, stage: "error", success: !1 },
      };
    case "estimation":
      return {
        type: "update",
        status: {
          queue: !0,
          stage: e || "pending",
          code: n.code,
          size: n.queue_size,
          position: n.rank,
          eta: n.rank_eta,
          success: n.success,
        },
      };
    case "progress":
      return {
        type: "update",
        status: {
          queue: !0,
          stage: "pending",
          code: n.code,
          progress_data: n.progress_data,
          success: n.success,
        },
      };
    case "log":
      return { type: "log", data: n };
    case "process_generating":
      return {
        type: "generating",
        status: {
          queue: !0,
          message: n.success ? null : n.output.error,
          stage: n.success ? "generating" : "error",
          code: n.code,
          progress_data: n.progress_data,
          eta: n.average_duration,
          changed_state_ids: n.success ? n.output.changed_state_ids : void 0,
        },
        data: n.success ? n.output : null,
      };
    case "process_streaming":
      return {
        type: "streaming",
        status: {
          queue: !0,
          message: n.output.error,
          stage: "streaming",
          time_limit: n.time_limit,
          code: n.code,
          progress_data: n.progress_data,
          eta: n.eta,
        },
        data: n.output,
      };
    case "process_completed":
      return "error" in n.output
        ? {
            type: "update",
            status: {
              queue: !0,
              title: n.output.title,
              message: n.output.error,
              visible: n.output.visible,
              duration: n.output.duration,
              stage: "error",
              code: n.code,
              success: n.success,
            },
          }
        : {
            type: "complete",
            status: {
              queue: !0,
              message: n.success ? void 0 : n.output.error,
              stage: n.success ? "complete" : "error",
              code: n.code,
              progress_data: n.progress_data,
              changed_state_ids: n.success
                ? n.output.changed_state_ids
                : void 0,
            },
            data: n.success ? n.output : null,
          };
    case "process_starts":
      return {
        type: "update",
        status: {
          queue: !0,
          stage: "pending",
          code: n.code,
          size: n.rank,
          position: 0,
          success: n.success,
          eta: n.eta,
        },
        original_msg: "process_starts",
      };
  }
  return { type: "none", status: { stage: "error", queue: !0 } };
}
const Nt = (n = [], e) => {
  const t = e ? e.parameters : [];
  if (Array.isArray(n))
    return (
      e &&
        t.length > 0 &&
        n.length > t.length &&
        console.warn("Too many arguments provided for the endpoint."),
      n
    );
  const s = [],
    i = Object.keys(n);
  return (
    t.forEach((o, r) => {
      if (n.hasOwnProperty(o.parameter_name)) s[r] = n[o.parameter_name];
      else if (o.parameter_has_default) s[r] = o.parameter_default;
      else
        throw new Error(
          `No value provided for required parameter: ${o.parameter_name}`
        );
    }),
    i.forEach((o) => {
      if (!t.some((r) => r.parameter_name === o))
        throw new Error(
          `Parameter \`${o}\` is not a valid keyword argument. Please refer to the API for usage.`
        );
    }),
    s.forEach((o, r) => {
      if (o === void 0 && !t[r].parameter_has_default)
        throw new Error(
          `No value provided for required parameter: ${t[r].parameter_name}`
        );
    }),
    s
  );
};
async function It() {
  if (this.api_info) return this.api_info;
  const { hf_token: n } = this.options,
    { config: e } = this,
    t = { "Content-Type": "application/json" };
  if ((n && (t.Authorization = `Bearer ${n}`), !!e))
    try {
      let s, i;
      if (typeof window < "u" && window.gradio_api_info)
        i = window.gradio_api_info;
      else {
        if (Re(e?.version || "2.0.0", "3.30") < 0)
          s = await this.fetch(yt, {
            method: "POST",
            body: JSON.stringify({ serialize: !1, config: JSON.stringify(e) }),
            headers: t,
            credentials: "include",
          });
        else {
          const o = _e(e.root, this.api_prefix, dt);
          s = await this.fetch(o, { headers: t, credentials: "include" });
        }
        if (!s.ok) throw new Error(ee);
        i = await s.json();
      }
      return (
        "api" in i && (i = i.api),
        i.named_endpoints["/predict"] &&
          !i.unnamed_endpoints[0] &&
          (i.unnamed_endpoints[0] = i.named_endpoints["/predict"]),
        Tt(i, e, this.api_map)
      );
    } catch (s) {
      throw new Error("Could not get API info. " + s.message);
    }
}
async function Dt(n, e, t) {
  var s;
  const i = {};
  (s = this == null ? void 0 : this.options) != null &&
    s.hf_token &&
    (i.Authorization = `Bearer ${this.options.hf_token}`);
  const o = 1e3,
    r = [];
  let a;
  for (let c = 0; c < e.length; c += o) {
    const g = e.slice(c, c + o),
      p = new FormData();
    g.forEach((w) => {
      p.append("files", w);
    });
    try {
      const w = t
        ? `${n}${this.api_prefix}/${Pe}?upload_id=${t}`
        : `${n}${this.api_prefix}/${Pe}`;
      a = await this.fetch(w, {
        method: "POST",
        body: p,
        headers: i,
        credentials: "include",
      });
    } catch (w) {
      throw new Error(ee + w.message);
    }
    if (!a.ok) {
      const w = await a.text();
      return { error: `HTTP ${a.status}: ${w}` };
    }
    const d = await a.json();
    d && r.push(...d);
  }
  return { files: r };
}
async function Rt(n, e, t, s) {
  let i = (Array.isArray(n) ? n : [n]).map((r) => r.blob);
  const o = i.filter((r) => r.size > (s ?? 1 / 0));
  if (o.length)
    throw new Error(
      `File size exceeds the maximum allowed size of ${s} bytes: ${o
        .map((r) => r.name)
        .join(", ")}`
    );
  return await Promise.all(
    await this.upload_files(e, i, t).then(async (r) => {
      if (r.error) throw new Error(r.error);
      return r.files
        ? r.files.map(
            (a, c) =>
              new $e({
                ...n[c],
                path: a,
                url: `${e}${this.api_prefix}/file=${a}`,
              })
          )
        : [];
    })
  );
}
class $e {
  constructor({
    path: e,
    url: t,
    orig_name: s,
    size: i,
    blob: o,
    is_stream: r,
    mime_type: a,
    alt_text: c,
    b64: g,
  }) {
    m(this, "path"),
      m(this, "url"),
      m(this, "orig_name"),
      m(this, "size"),
      m(this, "blob"),
      m(this, "is_stream"),
      m(this, "mime_type"),
      m(this, "alt_text"),
      m(this, "b64"),
      m(this, "meta", { _type: "gradio.FileData" }),
      (this.path = e),
      (this.url = t),
      (this.orig_name = s),
      (this.size = i),
      (this.blob = t ? void 0 : o),
      (this.is_stream = r),
      (this.mime_type = a),
      (this.alt_text = c),
      (this.b64 = g);
  }
}
class At {
  constructor(e, t) {
    m(this, "type"),
      m(this, "command"),
      m(this, "meta"),
      m(this, "fileData"),
      (this.type = "command"),
      (this.command = e),
      (this.meta = t);
  }
}
typeof process < "u" && process.versions && process.versions.node;
function Ce(n, e, t) {
  for (; t.length > 1; ) {
    const i = t.shift();
    if (typeof i == "string" || typeof i == "number") n = n[i];
    else throw new Error("Invalid key type");
  }
  const s = t.shift();
  if (typeof s == "string" || typeof s == "number") n[s] = e;
  else throw new Error("Invalid key type");
}
async function we(n, e = void 0, t = [], s = !1, i = void 0) {
  if (Array.isArray(n)) {
    let o = [];
    return (
      await Promise.all(
        n.map(async (r, a) => {
          var c;
          let g = t.slice();
          g.push(String(a));
          const p = await we(
            n[a],
            s
              ? ((c = i?.parameters[a]) == null ? void 0 : c.component) ||
                  void 0
              : e,
            g,
            !1,
            i
          );
          o = o.concat(p);
        })
      ),
      o
    );
  } else {
    if (
      (globalThis.Buffer && n instanceof globalThis.Buffer) ||
      n instanceof Blob
    )
      return [{ path: t, blob: new Blob([n]), type: e }];
    if (typeof n == "object" && n !== null) {
      let o = [];
      for (const r of Object.keys(n)) {
        const a = [...t, r],
          c = n[r];
        o = o.concat(await we(c, void 0, a, !1, i));
      }
      return o;
    }
  }
  return [];
}
function Bt(n, e) {
  var t, s;
  let i =
    (s = (t = e?.dependencies) == null ? void 0 : t.find((o) => o.id == n)) ==
    null
      ? void 0
      : s.queue;
  return i != null ? !i : !e.enable_queue;
}
function Ft(n, e) {
  return new Promise((t, s) => {
    const i = new MessageChannel();
    (i.port1.onmessage = ({ data: o }) => {
      i.port1.close(), t(o);
    }),
      window.parent.postMessage(n, e, [i.port2]);
  });
}
function oe(n, e, t, s, i = !1) {
  if (s === "input" && !i)
    throw new Error("Invalid code path. Cannot skip state inputs for input.");
  if (s === "output" && i) return n;
  let o = [],
    r = 0;
  const a = s === "input" ? e.inputs : e.outputs;
  for (let c = 0; c < a.length; c++) {
    const g = a[c],
      p = t.find((d) => d.id === g);
    if (p?.type === "state") {
      if (i)
        if (n.length === a.length) {
          const d = n[r];
          o.push(d), r++;
        } else o.push(null);
      else {
        r++;
        continue;
      }
      continue;
    } else {
      const d = n[r];
      o.push(d), r++;
    }
  }
  return o;
}
async function zt(n, e, t) {
  const s = this;
  await Mt(s, e);
  const i = await we(e, void 0, [], !0, t);
  return (
    (
      await Promise.all(
        i.map(async ({ path: o, blob: r, type: a }) => {
          if (!r) return { path: o, type: a };
          const c = await s.upload_files(n, [r]),
            g = c.files && c.files[0];
          return {
            path: o,
            file_url: g,
            type: a,
            name: typeof File < "u" && r instanceof File ? r?.name : void 0,
          };
        })
      )
    ).forEach(({ path: o, file_url: r, type: a, name: c }) => {
      if (a === "Gallery") Ce(e, r, o);
      else if (r) {
        const g = new $e({ path: r, orig_name: c });
        Ce(e, g, o);
      }
    }),
    e
  );
}
async function Mt(n, e) {
  var t, s;
  if (
    !(
      ((t = n.config) != null && t.root) ||
      ((s = n.config) != null && s.root_url)
    )
  )
    throw new Error(ze);
  await We(n, e);
}
async function We(n, e, t = []) {
  for (const s in e)
    e[s] instanceof At
      ? await Jt(n, e, s)
      : typeof e[s] == "object" &&
        e[s] !== null &&
        (await We(n, e[s], [...t, s]));
}
async function Jt(n, e, t) {
  var s, i;
  let o = e[t];
  const r =
    ((s = n.config) == null ? void 0 : s.root) ||
    ((i = n.config) == null ? void 0 : i.root_url);
  if (!r) throw new Error(ze);
  try {
    let a, c;
    if (typeof process < "u" && process.versions && process.versions.node) {
      const w = await Le(
        () => import("./__vite-browser-external-DYxpcVy9-BIHI7g3E.js"),
        []
      );
      (c = (
        await Le(async () => {
          const { resolve: E } = await import(
            "./__vite-browser-external-DYxpcVy9-BIHI7g3E.js"
          );
          return { resolve: E };
        }, [])
      ).resolve(process.cwd(), o.meta.path)),
        (a = await w.readFile(c));
    } else throw new Error(St);
    const g = new Blob([a], { type: "application/octet-stream" }),
      p = await n.upload_files(r, [g]),
      d = p.files && p.files[0];
    if (d) {
      const w = new $e({ path: d, orig_name: o.meta.name || "" });
      e[t] = w;
    }
  } catch (a) {
    console.error(xt, a);
  }
}
async function Wt(n, e, t) {
  const s = { "Content-Type": "application/json" };
  this.options.hf_token &&
    (s.Authorization = `Bearer ${this.options.hf_token}`);
  try {
    var i = await this.fetch(n, {
      method: "POST",
      body: JSON.stringify(e),
      headers: { ...s, ...t },
      credentials: "include",
    });
  } catch {
    return [{ error: ee }, 500];
  }
  let o, r;
  try {
    (o = await i.json()), (r = i.status);
  } catch (a) {
    (o = { error: `Could not parse server response: ${a}` }), (r = 500);
  }
  return [o, r];
}
async function Ht(n, e = {}) {
  let t = !1,
    s = !1;
  if (!this.config) throw new Error("Could not resolve app config");
  if (typeof n == "number") this.config.dependencies.find((i) => i.id == n);
  else {
    const i = n.replace(/^\//, "");
    this.config.dependencies.find((o) => o.id == this.api_map[i]);
  }
  return new Promise(async (i, o) => {
    const r = this.submit(n, e, null, null, !0);
    let a;
    for await (const c of r)
      c.type === "data" && (s && i(a), (t = !0), (a = c)),
        c.type === "status" &&
          (c.stage === "error" && o(c),
          c.stage === "complete" && ((s = !0), t && i(a)));
  });
}
async function ae(n, e, t) {
  let s =
      e === "subdomain"
        ? `https://huggingface.co/api/spaces/by-subdomain/${n}`
        : `https://huggingface.co/api/spaces/${n}`,
    i,
    o;
  try {
    if (((i = await fetch(s)), (o = i.status), o !== 200)) throw new Error();
    i = await i.json();
  } catch {
    t({
      status: "error",
      load_status: "error",
      message: vt,
      detail: "NOT_FOUND",
    });
    return;
  }
  if (!i || o !== 200) return;
  const {
    runtime: { stage: r },
    id: a,
  } = i;
  switch (r) {
    case "STOPPED":
    case "SLEEPING":
      t({
        status: "sleeping",
        load_status: "pending",
        message: "Space is asleep. Waking it up...",
        detail: r,
      }),
        setTimeout(() => {
          ae(n, e, t);
        }, 1e3);
      break;
    case "PAUSED":
      t({
        status: "paused",
        load_status: "error",
        message:
          "This space has been paused by the author. If you would like to try this demo, consider duplicating the space.",
        detail: r,
        discussions_enabled: await Te(a),
      });
      break;
    case "RUNNING":
    case "RUNNING_BUILDING":
      t({
        status: "running",
        load_status: "complete",
        message: "Space is running.",
        detail: r,
      });
      break;
    case "BUILDING":
      t({
        status: "building",
        load_status: "pending",
        message: "Space is building...",
        detail: r,
      }),
        setTimeout(() => {
          ae(n, e, t);
        }, 1e3);
      break;
    case "APP_STARTING":
      t({
        status: "starting",
        load_status: "pending",
        message: "Space is starting...",
        detail: r,
      }),
        setTimeout(() => {
          ae(n, e, t);
        }, 1e3);
      break;
    default:
      t({
        status: "space_error",
        load_status: "error",
        message: "This space is experiencing an issue.",
        detail: r,
        discussions_enabled: await Te(a),
      });
      break;
  }
}
const He = async (n, e) => {
    let t = 0;
    const s = 12,
      i = 5e3;
    return new Promise((o) => {
      ae(n, be.test(n) ? "space_name" : "subdomain", (r) => {
        e(r),
          r.status === "running" ||
          r.status === "error" ||
          r.status === "paused" ||
          r.status === "space_error"
            ? o()
            : (r.status === "sleeping" || r.status === "building") &&
              (t < s
                ? (t++,
                  setTimeout(() => {
                    He(n, e).then(o);
                  }, i))
                : o());
      });
    });
  },
  Gt = /^(?=[^]*\b[dD]iscussions{0,1}\b)(?=[^]*\b[dD]isabled\b)[^]*$/;
async function Te(n) {
  try {
    const e = await fetch(
        `https://huggingface.co/api/spaces/${n}/discussions`,
        { method: "HEAD" }
      ),
      t = e.headers.get("x-error-message");
    return !(!e.ok || (t && Gt.test(t)));
  } catch {
    return !1;
  }
}
async function Vt(n, e) {
  const t = {};
  e && (t.Authorization = `Bearer ${e}`);
  try {
    const s = await fetch(`https://huggingface.co/api/spaces/${n}/${pt}`, {
      headers: t,
    });
    if (s.status !== 200)
      throw new Error("Space hardware could not be obtained.");
    const { hardware: i } = await s.json();
    return i.current;
  } catch (s) {
    throw new Error(s.message);
  }
}
async function Zt(n, e, t) {
  const s = {};
  t && (s.Authorization = `Bearer ${t}`);
  const i = { seconds: e };
  try {
    const o = await fetch(`https://huggingface.co/api/spaces/${n}/${ht}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...s },
      body: JSON.stringify(i),
    });
    if (o.status !== 200)
      throw new Error(
        "Could not set sleep timeout on duplicated Space. Please visit *ADD HF LINK TO SETTINGS* to set a timeout manually to reduce billing charges."
      );
    return await o.json();
  } catch (o) {
    throw new Error(o.message);
  }
}
const Ue = [
  "cpu-basic",
  "cpu-upgrade",
  "cpu-xl",
  "t4-small",
  "t4-medium",
  "a10g-small",
  "a10g-large",
  "a10g-largex2",
  "a10g-largex4",
  "a100-large",
  "zero-a10g",
  "h100",
  "h100x8",
];
async function Kt(n, e) {
  const { hf_token: t, private: s, hardware: i, timeout: o, auth: r } = e;
  if (i && !Ue.includes(i))
    throw new Error(
      `Invalid hardware type provided. Valid types are: ${Ue.map(
        (y) => `"${y}"`
      ).join(",")}.`
    );
  const { http_protocol: a, host: c } = await ue(n, t);
  let g = null;
  if (r) {
    const y = await Me(a, c, r, fetch);
    y && (g = Je(y));
  }
  const p = {
      Authorization: `Bearer ${t}`,
      "Content-Type": "application/json",
      ...(g ? { Cookie: g.join("; ") } : {}),
    },
    d = (
      await (
        await fetch("https://huggingface.co/api/whoami-v2", { headers: p })
      ).json()
    ).name,
    w = n.split("/")[1],
    E = { repository: `${d}/${w}` };
  s && (E.private = !0);
  let F;
  try {
    i || (F = await Vt(n, t));
  } catch (y) {
    throw Error(ve + y.message);
  }
  const u = i || F || "cpu-basic";
  E.hardware = u;
  try {
    const y = await fetch(`https://huggingface.co/api/spaces/${n}/duplicate`, {
      method: "POST",
      headers: p,
      body: JSON.stringify(E),
    });
    if (y.status === 409)
      try {
        return await ye.connect(`${d}/${w}`, e);
      } catch (A) {
        throw (console.error("Failed to connect Client instance:", A), A);
      }
    else if (y.status !== 200) throw new Error(y.statusText);
    const T = await y.json();
    return await Zt(`${d}/${w}`, o || 300, t), await ye.connect(Yt(T.url), e);
  } catch (y) {
    throw new Error(y);
  }
}
function Yt(n) {
  const e = /https:\/\/huggingface.co\/spaces\/([^/]+\/[^/]+)/,
    t = n.match(e);
  if (t) return t[1];
}
var G;
class Xt extends TransformStream {
  constructor(e = { allowCR: !1 }) {
    super({
      transform: (t, s) => {
        for (t = ie(this, G) + t; ; ) {
          const i = t.indexOf(`
`),
            o = e.allowCR ? t.indexOf("\r") : -1;
          if (o !== -1 && o !== t.length - 1 && (i === -1 || i - 1 > o)) {
            s.enqueue(t.slice(0, o)), (t = t.slice(o + 1));
            continue;
          }
          if (i === -1) break;
          const r = t[i - 1] === "\r" ? i - 1 : i;
          s.enqueue(t.slice(0, r)), (t = t.slice(i + 1));
        }
        at(this, G, t);
      },
      flush: (t) => {
        if (ie(this, G) === "") return;
        const s =
          e.allowCR && ie(this, G).endsWith("\r")
            ? ie(this, G).slice(0, -1)
            : ie(this, G);
        t.enqueue(s);
      },
    }),
      rt(this, G, "");
  }
}
G = new WeakMap();
function Qt(n) {
  let e = new TextDecoderStream(),
    t = new Xt({ allowCR: !0 });
  return n.pipeThrough(e).pipeThrough(t);
}
function en(n) {
  let e = /[:]\s*/.exec(n),
    t = e && e.index;
  if (t) return [n.substring(0, t), n.substring(t + e[0].length)];
}
function qe(n, e, t) {
  n.get(e) || n.set(e, t);
}
async function* tn(n, e) {
  if (!n.body) return;
  let t = Qt(n.body),
    s,
    i = t.getReader(),
    o;
  for (;;) {
    if (e && e.aborted) return i.cancel();
    if (((s = await i.read()), s.done)) return;
    if (!s.value) {
      o && (yield o), (o = void 0);
      continue;
    }
    let [r, a] = en(s.value) || [];
    r &&
      (r === "data"
        ? (o || (o = {}),
          (o[r] = o[r]
            ? o[r] +
              `
` +
              a
            : a))
        : r === "event"
        ? (o || (o = {}), (o[r] = a))
        : r === "id"
        ? (o || (o = {}), (o[r] = +a || a))
        : r === "retry" && (o || (o = {}), (o[r] = +a || void 0)));
  }
}
async function nn(n, e) {
  let t = new Request(n, e);
  qe(t.headers, "Accept", "text/event-stream"),
    qe(t.headers, "Content-Type", "application/json");
  let s = await fetch(t);
  if (!s.ok) throw s;
  return tn(s, t.signal);
}
async function sn() {
  let {
    event_callbacks: n,
    unclosed_events: e,
    pending_stream_messages: t,
    stream_status: s,
    config: i,
    jwt: o,
  } = this;
  const r = this;
  if (!i) throw new Error("Could not resolve app config");
  s.open = !0;
  let a = null,
    c = new URLSearchParams({ session_hash: this.session_hash }).toString(),
    g = new URL(`${i.root}${this.api_prefix}/${Ae}?${c}`);
  if ((o && g.searchParams.set("__sign", o), (a = this.stream(g)), !a)) {
    console.warn("Cannot connect to SSE endpoint: " + g.toString());
    return;
  }
  (a.onmessage = async function (p) {
    let d = JSON.parse(p.data);
    if (d.msg === "close_stream") {
      ke(s, r.abort_controller);
      return;
    }
    const w = d.event_id;
    if (!w) await Promise.all(Object.keys(n).map((E) => n[E](d)));
    else if (n[w] && i) {
      d.msg === "process_completed" &&
        ["sse", "sse_v1", "sse_v2", "sse_v2.1", "sse_v3"].includes(
          i.protocol
        ) &&
        e.delete(w);
      let E = n[w];
      typeof window < "u" && typeof document < "u" ? setTimeout(E, 0, d) : E(d);
    } else t[w] || (t[w] = []), t[w].push(d);
  }),
    (a.onerror = async function (p) {
      console.error(p),
        await Promise.all(
          Object.keys(n).map((d) =>
            n[d]({ msg: "broken_connection", message: ee })
          )
        );
    });
}
function ke(n, e) {
  n && ((n.open = !1), e?.abort());
}
function on(n, e, t) {
  n[e]
    ? t.data.forEach((s, i) => {
        let o = rn(n[e][i], s);
        (n[e][i] = o), (t.data[i] = o);
      })
    : ((n[e] = []),
      t.data.forEach((s, i) => {
        n[e][i] = s;
      }));
}
function rn(n, e) {
  return (
    e.forEach(([t, s, i]) => {
      n = an(n, s, t, i);
    }),
    n
  );
}
function an(n, e, t, s) {
  if (e.length === 0) {
    if (t === "replace") return s;
    if (t === "append") return n + s;
    throw new Error(`Unsupported action: ${t}`);
  }
  let i = n;
  for (let r = 0; r < e.length - 1; r++) i = i[e[r]];
  const o = e[e.length - 1];
  switch (t) {
    case "replace":
      i[o] = s;
      break;
    case "append":
      i[o] += s;
      break;
    case "add":
      Array.isArray(i) ? i.splice(Number(o), 0, s) : (i[o] = s);
      break;
    case "delete":
      Array.isArray(i) ? i.splice(Number(o), 1) : delete i[o];
      break;
    default:
      throw new Error(`Unknown action: ${t}`);
  }
  return n;
}
function cn(n, e = {}) {
  const t = {
    close: () => {
      console.warn("Method not implemented.");
    },
    onerror: null,
    onmessage: null,
    onopen: null,
    readyState: 0,
    url: n.toString(),
    withCredentials: !1,
    CONNECTING: 0,
    OPEN: 1,
    CLOSED: 2,
    addEventListener: () => {
      throw new Error("Method not implemented.");
    },
    dispatchEvent: () => {
      throw new Error("Method not implemented.");
    },
    removeEventListener: () => {
      throw new Error("Method not implemented.");
    },
  };
  return (
    nn(n, e)
      .then(async (s) => {
        t.readyState = t.OPEN;
        try {
          for await (const i of s) t.onmessage && t.onmessage(i);
          t.readyState = t.CLOSED;
        } catch (i) {
          t.onerror && t.onerror(i), (t.readyState = t.CLOSED);
        }
      })
      .catch((s) => {
        console.error(s), t.onerror && t.onerror(s), (t.readyState = t.CLOSED);
      }),
    t
  );
}
function ln(n, e = {}, t, s, i) {
  var o;
  try {
    let r = function ($) {
        (i || Ke[$.type]) && p($);
      },
      a = function () {
        for (Qe = !0; se.length > 0; ) se.shift()({ value: void 0, done: !0 });
      },
      c = function ($) {
        se.length > 0 ? se.shift()($) : pe.push($);
      },
      g = function ($) {
        c(un($)), a();
      },
      p = function ($) {
        c({ value: $, done: !1 });
      },
      d = function () {
        return pe.length > 0
          ? Promise.resolve(pe.shift())
          : new Promise(($) => se.push($));
      };
    const { hf_token: w } = this.options,
      {
        fetch: E,
        app_reference: F,
        config: u,
        session_hash: y,
        api_info: T,
        api_map: A,
        stream_status: Y,
        pending_stream_messages: X,
        pending_diff_streams: l,
        event_callbacks: h,
        unclosed_events: b,
        post_data: _,
        options: L,
        api_prefix: S,
      } = this,
      N = this;
    if (!T) throw new Error("No API found");
    if (!u) throw new Error("Could not resolve app config");
    let { fn_index: f, endpoint_info: Q, dependency: H } = dn(T, n, A, u),
      te = Nt(e, Q),
      U,
      z,
      B = u.protocol ?? "ws",
      ne = "",
      Z = () => ne;
    const v = typeof n == "number" ? "/predict" : n;
    let j,
      x = null,
      M = !1,
      de = {},
      K =
        typeof window < "u" && typeof document < "u"
          ? new URLSearchParams(window.location.search).toString()
          : "";
    const Ke =
      ((o = L?.events) == null
        ? void 0
        : o.reduce(($, J) => (($[J] = !0), $), {})) || {};
    async function Ye() {
      let $ = {},
        J = {};
      B === "ws"
        ? (U && U.readyState === 0
            ? U.addEventListener("open", () => {
                U.close();
              })
            : U.close(),
          ($ = { fn_index: f, session_hash: y }))
        : (($ = { event_id: x }),
          (J = { event_id: x, session_hash: y, fn_index: f }));
      try {
        if (!u) throw new Error("Could not resolve app config");
        "event_id" in J &&
          (await E(`${u.root}${S}/${_t}`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(J),
          })),
          await E(`${u.root}${S}/${gt}`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify($),
          });
      } catch {
        console.warn(
          "The `/reset` endpoint could not be called. Subsequent endpoint results may be unreliable."
        );
      }
    }
    const Xe = async ($) => {
      await this._resolve_heartbeat($);
    };
    async function Ee($) {
      if (!u) return;
      let J = $.render_id;
      (u.components = [
        ...u.components.filter((q) => q.props.rendered_in !== J),
        ...$.components,
      ]),
        (u.dependencies = [
          ...u.dependencies.filter((q) => q.rendered_in !== J),
          ...$.dependencies,
        ]);
      const he = u.components.some((q) => q.type === "state"),
        O = u.dependencies.some((q) =>
          q.targets.some((I) => I[1] === "unload")
        );
      (u.connect_heartbeat = he || O),
        await Xe(u),
        r({ type: "render", data: $, endpoint: v, fn_index: f });
    }
    this.handle_blob(u.root, te, Q).then(async ($) => {
      var J;
      if (
        ((j = {
          data: oe($, H, u.components, "input", !0) || [],
          event_data: t,
          fn_index: f,
          trigger_id: s,
        }),
        Bt(f, u))
      )
        r({
          type: "status",
          endpoint: v,
          stage: "pending",
          queue: !1,
          fn_index: f,
          time: new Date(),
        }),
          _(
            `${u.root}${S}/run${v.startsWith("/") ? v : `/${v}`}${
              K ? "?" + K : ""
            }`,
            { ...j, session_hash: y }
          )
            .then(([O, q]) => {
              const I = O.data;
              q == 200
                ? (r({
                    type: "data",
                    endpoint: v,
                    fn_index: f,
                    data: oe(I, H, u.components, "output", L.with_null_state),
                    time: new Date(),
                    event_data: t,
                    trigger_id: s,
                  }),
                  O.render_config && Ee(O.render_config),
                  r({
                    type: "status",
                    endpoint: v,
                    fn_index: f,
                    stage: "complete",
                    eta: O.average_duration,
                    queue: !1,
                    time: new Date(),
                  }))
                : r({
                    type: "status",
                    stage: "error",
                    endpoint: v,
                    fn_index: f,
                    message: O.error,
                    queue: !1,
                    time: new Date(),
                  });
            })
            .catch((O) => {
              r({
                type: "status",
                stage: "error",
                message: O.message,
                endpoint: v,
                fn_index: f,
                queue: !1,
                time: new Date(),
              });
            });
      else if (B == "ws") {
        const { ws_protocol: O, host: q } = await ue(F, w);
        r({
          type: "status",
          stage: "pending",
          queue: !0,
          endpoint: v,
          fn_index: f,
          time: new Date(),
        });
        let I = new URL(
          `${O}://${Lt(q, u.root, !0)}/queue/join${K ? "?" + K : ""}`
        );
        this.jwt && I.searchParams.set("__sign", this.jwt),
          (U = new WebSocket(I)),
          (U.onclose = (D) => {
            D.wasClean ||
              r({
                type: "status",
                stage: "error",
                broken: !0,
                message: ee,
                queue: !0,
                endpoint: v,
                fn_index: f,
                time: new Date(),
              });
          }),
          (U.onmessage = function (D) {
            const R = JSON.parse(D.data),
              { type: C, status: P, data: k } = ge(R, de[f]);
            if (C === "update" && P && !M)
              r({
                type: "status",
                endpoint: v,
                fn_index: f,
                time: new Date(),
                ...P,
              }),
                P.stage === "error" && U.close();
            else if (C === "hash") {
              U.send(JSON.stringify({ fn_index: f, session_hash: y }));
              return;
            } else
              C === "data"
                ? U.send(JSON.stringify({ ...j, session_hash: y }))
                : C === "complete"
                ? (M = P)
                : C === "log"
                ? r({
                    type: "log",
                    title: k.title,
                    log: k.log,
                    level: k.level,
                    endpoint: v,
                    duration: k.duration,
                    visible: k.visible,
                    fn_index: f,
                  })
                : C === "generating" &&
                  r({
                    type: "status",
                    time: new Date(),
                    ...P,
                    stage: P?.stage,
                    queue: !0,
                    endpoint: v,
                    fn_index: f,
                  });
            k &&
              (r({
                type: "data",
                time: new Date(),
                data: oe(k.data, H, u.components, "output", L.with_null_state),
                endpoint: v,
                fn_index: f,
                event_data: t,
                trigger_id: s,
              }),
              M &&
                (r({
                  type: "status",
                  time: new Date(),
                  ...M,
                  stage: P?.stage,
                  queue: !0,
                  endpoint: v,
                  fn_index: f,
                }),
                U.close()));
          }),
          Re(u.version || "2.0.0", "3.6") < 0 &&
            addEventListener("open", () => U.send(JSON.stringify({ hash: y })));
      } else if (B == "sse") {
        r({
          type: "status",
          stage: "pending",
          queue: !0,
          endpoint: v,
          fn_index: f,
          time: new Date(),
        });
        var he = new URLSearchParams({
          fn_index: f.toString(),
          session_hash: y,
        }).toString();
        let O = new URL(`${u.root}${S}/${Ae}?${K ? K + "&" : ""}${he}`);
        if (
          (this.jwt && O.searchParams.set("__sign", this.jwt),
          (z = this.stream(O)),
          !z)
        )
          return Promise.reject(
            new Error("Cannot connect to SSE endpoint: " + O.toString())
          );
        z.onmessage = async function (q) {
          const I = JSON.parse(q.data),
            { type: D, status: R, data: C } = ge(I, de[f]);
          if (D === "update" && R && !M)
            r({
              type: "status",
              endpoint: v,
              fn_index: f,
              time: new Date(),
              ...R,
            }),
              R.stage === "error" && (z?.close(), a());
          else if (D === "data") {
            let [P, k] = await _(`${u.root}${S}/queue/data`, {
              ...j,
              session_hash: y,
              event_id: x,
            });
            k !== 200 &&
              (r({
                type: "status",
                stage: "error",
                message: ee,
                queue: !0,
                endpoint: v,
                fn_index: f,
                time: new Date(),
              }),
              z?.close(),
              a());
          } else
            D === "complete"
              ? (M = R)
              : D === "log"
              ? r({
                  type: "log",
                  title: C.title,
                  log: C.log,
                  level: C.level,
                  endpoint: v,
                  duration: C.duration,
                  visible: C.visible,
                  fn_index: f,
                })
              : (D === "generating" || D === "streaming") &&
                r({
                  type: "status",
                  time: new Date(),
                  ...R,
                  stage: R?.stage,
                  queue: !0,
                  endpoint: v,
                  fn_index: f,
                });
          C &&
            (r({
              type: "data",
              time: new Date(),
              data: oe(C.data, H, u.components, "output", L.with_null_state),
              endpoint: v,
              fn_index: f,
              event_data: t,
              trigger_id: s,
            }),
            M &&
              (r({
                type: "status",
                time: new Date(),
                ...M,
                stage: R?.stage,
                queue: !0,
                endpoint: v,
                fn_index: f,
              }),
              z?.close(),
              a()));
        };
      } else if (
        B == "sse_v1" ||
        B == "sse_v2" ||
        B == "sse_v2.1" ||
        B == "sse_v3"
      ) {
        r({
          type: "status",
          stage: "pending",
          queue: !0,
          endpoint: v,
          fn_index: f,
          time: new Date(),
        });
        let O = "";
        typeof window < "u" &&
          typeof document < "u" &&
          (O = (J = window?.location) == null ? void 0 : J.hostname);
        const q = O.includes(".dev.")
          ? `https://moon-${O.split(".")[1]}.dev.spaces.huggingface.tech`
          : "https://huggingface.co";
        (typeof window < "u" &&
        typeof document < "u" &&
        window.parent != window &&
        window.supports_zerogpu_headers
          ? Ft("zerogpu-headers", q)
          : Promise.resolve(null)
        )
          .then((I) =>
            _(`${u.root}${S}/${lt}?${K}`, { ...j, session_hash: y }, I)
          )
          .then(async ([I, D]) => {
            if (D === 503)
              r({
                type: "status",
                stage: "error",
                message: Be,
                queue: !0,
                endpoint: v,
                fn_index: f,
                time: new Date(),
              });
            else if (D === 422)
              r({
                type: "status",
                stage: "error",
                message: I.detail,
                queue: !0,
                endpoint: v,
                fn_index: f,
                code: "validation_error",
                time: new Date(),
              }),
                a();
            else if (D !== 200)
              r({
                type: "status",
                stage: "error",
                broken: !1,
                message: I.detail,
                queue: !0,
                endpoint: v,
                fn_index: f,
                time: new Date(),
              });
            else {
              (x = I.event_id), (ne = x);
              let R = async function (C) {
                try {
                  const {
                    type: P,
                    status: k,
                    data: W,
                    original_msg: et,
                  } = ge(C, de[f]);
                  if (P == "heartbeat") return;
                  if (P === "update" && k && !M)
                    r({
                      type: "status",
                      endpoint: v,
                      fn_index: f,
                      time: new Date(),
                      original_msg: et,
                      ...k,
                    });
                  else if (P === "complete") M = k;
                  else if (
                    P == "unexpected_error" ||
                    P == "broken_connection"
                  ) {
                    console.error("Unexpected error", k?.message);
                    const tt = P === "broken_connection";
                    r({
                      type: "status",
                      stage: "error",
                      message: k?.message || "An Unexpected Error Occurred!",
                      queue: !0,
                      endpoint: v,
                      broken: tt,
                      session_not_found: k?.session_not_found,
                      fn_index: f,
                      time: new Date(),
                    });
                  } else if (P === "log") {
                    r({
                      type: "log",
                      title: W.title,
                      log: W.log,
                      level: W.level,
                      endpoint: v,
                      duration: W.duration,
                      visible: W.visible,
                      fn_index: f,
                    });
                    return;
                  } else
                    (P === "generating" || P === "streaming") &&
                      (r({
                        type: "status",
                        time: new Date(),
                        ...k,
                        stage: k?.stage,
                        queue: !0,
                        endpoint: v,
                        fn_index: f,
                      }),
                      W &&
                        H.connection !== "stream" &&
                        ["sse_v2", "sse_v2.1", "sse_v3"].includes(B) &&
                        on(l, x, W));
                  W &&
                    (r({
                      type: "data",
                      time: new Date(),
                      data: oe(
                        W.data,
                        H,
                        u.components,
                        "output",
                        L.with_null_state
                      ),
                      endpoint: v,
                      fn_index: f,
                    }),
                    W.render_config && (await Ee(W.render_config)),
                    M &&
                      (r({
                        type: "status",
                        time: new Date(),
                        ...M,
                        stage: k?.stage,
                        queue: !0,
                        endpoint: v,
                        fn_index: f,
                      }),
                      a())),
                    (k?.stage === "complete" || k?.stage === "error") &&
                      (h[x] && delete h[x], x in l && delete l[x]);
                } catch (P) {
                  console.error("Unexpected client exception", P),
                    r({
                      type: "status",
                      stage: "error",
                      message: "An Unexpected Error Occurred!",
                      queue: !0,
                      endpoint: v,
                      fn_index: f,
                      time: new Date(),
                    }),
                    ["sse_v2", "sse_v2.1", "sse_v3"].includes(B) &&
                      (ke(Y, N.abort_controller), (Y.open = !1), a());
                }
              };
              x in X && (X[x].forEach((C) => R(C)), delete X[x]),
                (h[x] = R),
                b.add(x),
                Y.open || (await this.open_stream());
            }
          });
      }
    });
    let Qe = !1;
    const pe = [],
      se = [],
      Se = {
        [Symbol.asyncIterator]: () => Se,
        next: d,
        throw: async ($) => (g($), d()),
        return: async () => (a(), d()),
        cancel: Ye,
        event_id: Z,
      };
    return Se;
  } catch (r) {
    throw (console.error("Submit function encountered an error:", r), r);
  }
}
function un(n) {
  return { then: (e, t) => t(n) };
}
function dn(n, e, t, s) {
  let i, o, r;
  if (typeof e == "number")
    (i = e),
      (o = n.unnamed_endpoints[i]),
      (r = s.dependencies.find((a) => a.id == e));
  else {
    const a = e.replace(/^\//, "");
    (i = t[a]),
      (o = n.named_endpoints[e.trim()]),
      (r = s.dependencies.find((c) => c.id == t[a]));
  }
  if (typeof i != "number")
    throw new Error(
      "There is no endpoint matching that name of fn_index matching that number."
    );
  return { fn_index: i, endpoint_info: o, dependency: r };
}
class ye {
  constructor(e, t = { events: ["data"] }) {
    m(this, "app_reference"),
      m(this, "options"),
      m(this, "deep_link", null),
      m(this, "config"),
      m(this, "api_prefix", ""),
      m(this, "api_info"),
      m(this, "api_map", {}),
      m(this, "session_hash", Math.random().toString(36).substring(2)),
      m(this, "jwt", !1),
      m(this, "last_status", {}),
      m(this, "cookies", null),
      m(this, "stream_status", { open: !1 }),
      m(this, "closed", !1),
      m(this, "pending_stream_messages", {}),
      m(this, "pending_diff_streams", {}),
      m(this, "event_callbacks", {}),
      m(this, "unclosed_events", new Set()),
      m(this, "heartbeat_event", null),
      m(this, "abort_controller", null),
      m(this, "stream_instance", null),
      m(this, "current_payload"),
      m(this, "ws_map", {}),
      m(this, "view_api"),
      m(this, "upload_files"),
      m(this, "upload"),
      m(this, "handle_blob"),
      m(this, "post_data"),
      m(this, "submit"),
      m(this, "predict"),
      m(this, "open_stream"),
      m(this, "resolve_config"),
      m(this, "resolve_cookies");
    var s;
    (this.app_reference = e),
      (this.deep_link =
        ((s = t.query_params) == null ? void 0 : s.deep_link) || null),
      t.events || (t.events = ["data"]),
      (this.options = t),
      (this.current_payload = {}),
      (this.view_api = It.bind(this)),
      (this.upload_files = Dt.bind(this)),
      (this.handle_blob = zt.bind(this)),
      (this.post_data = Wt.bind(this)),
      (this.submit = ln.bind(this)),
      (this.predict = Ht.bind(this)),
      (this.open_stream = sn.bind(this)),
      (this.resolve_config = jt.bind(this)),
      (this.resolve_cookies = Ot.bind(this)),
      (this.upload = Rt.bind(this)),
      (this.fetch = this.fetch.bind(this)),
      (this.handle_space_success = this.handle_space_success.bind(this)),
      (this.stream = this.stream.bind(this));
  }
  get_url_config(e = null) {
    if (!this.config) throw new Error(V);
    e === null && (e = window.location.href);
    const t = (r) => r.replace(/^\/+|\/+$/g, "");
    let s = t(new URL(this.config.root).pathname),
      i = t(new URL(e).pathname),
      o;
    return (
      i.startsWith(s) ? (o = t(i.substring(s.length))) : (o = ""),
      this.get_page_config(o)
    );
  }
  get_page_config(e) {
    if (!this.config) throw new Error(V);
    let t = this.config;
    return (
      e in t.page || (e = ""),
      {
        ...t,
        current_page: e,
        layout: t.page[e].layout,
        components: t.components.filter((s) =>
          t.page[e].components.includes(s.id)
        ),
        dependencies: this.config.dependencies.filter((s) =>
          t.page[e].dependencies.includes(s.id)
        ),
      }
    );
  }
  fetch(e, t) {
    const s = new Headers(t?.headers || {});
    if (
      (this && this.cookies && s.append("Cookie", this.cookies),
      this && this.options.headers)
    )
      for (const i in this.options.headers)
        s.append(i, this.options.headers[i]);
    return fetch(e, { ...t, headers: s });
  }
  stream(e) {
    const t = new Headers();
    if (
      (this && this.cookies && t.append("Cookie", this.cookies),
      this && this.options.headers)
    )
      for (const s in this.options.headers)
        t.append(s, this.options.headers[s]);
    return (
      this &&
        this.options.hf_token &&
        t.append("Authorization", `Bearer ${this.options.hf_token}`),
      (this.abort_controller = new AbortController()),
      (this.stream_instance = cn(e.toString(), {
        credentials: "include",
        headers: t,
        signal: this.abort_controller.signal,
      })),
      this.stream_instance
    );
  }
  async init() {
    var e;
    this.options.auth && (await this.resolve_cookies()),
      await this._resolve_config().then(({ config: t }) =>
        this._resolve_heartbeat(t)
      ),
      (this.api_info = await this.view_api()),
      (this.api_map = Pt(
        ((e = this.config) == null ? void 0 : e.dependencies) || []
      ));
  }
  async _resolve_heartbeat(e) {
    if (
      (e &&
        ((this.config = e),
        (this.api_prefix = e.api_prefix || ""),
        this.config &&
          this.config.connect_heartbeat &&
          this.config.space_id &&
          this.options.hf_token &&
          (this.jwt = await je(
            this.config.space_id,
            this.options.hf_token,
            this.cookies
          ))),
      e.space_id &&
        this.options.hf_token &&
        (this.jwt = await je(e.space_id, this.options.hf_token)),
      this.config && this.config.connect_heartbeat)
    ) {
      const t = new URL(
        `${this.config.root}${this.api_prefix}/${ft}/${this.session_hash}`
      );
      this.jwt && t.searchParams.set("__sign", this.jwt),
        this.heartbeat_event || (this.heartbeat_event = this.stream(t));
    }
  }
  static async connect(e, t = { events: ["data"] }) {
    const s = new this(e, t);
    return (
      t.session_hash && (s.session_hash = t.session_hash), await s.init(), s
    );
  }
  async reconnect() {
    const e = new URL(`${this.config.root}${this.api_prefix}/${wt}`);
    let t;
    try {
      const s = await this.fetch(e);
      if (!s.ok) throw new Error();
      t = (await s.json()).app_id;
    } catch {
      return "broken";
    }
    return t !== this.config.app_id ? "changed" : "connected";
  }
  close() {
    (this.closed = !0), ke(this.stream_status, this.abort_controller);
  }
  set_current_payload(e) {
    this.current_payload = e;
  }
  static async duplicate(e, t = { events: ["data"] }) {
    return Kt(e, t);
  }
  async _resolve_config() {
    const {
        http_protocol: e,
        host: t,
        space_id: s,
      } = await ue(this.app_reference, this.options.hf_token),
      { status_callback: i } = this.options;
    s && i && (await He(s, i));
    let o;
    try {
      let r = `${e}//${t}`;
      if (((o = await this.resolve_config(r)), !o)) throw new Error(V);
      return this.config_success(o);
    } catch (r) {
      if (s && i)
        ae(
          s,
          be.test(s) ? "space_name" : "subdomain",
          this.handle_space_success
        );
      else
        throw (
          (i &&
            i({
              status: "error",
              message: "Could not load this space.",
              load_status: "error",
              detail: "NOT_FOUND",
            }),
          Error(r))
        );
    }
  }
  async config_success(e) {
    if (
      ((this.config = e),
      (this.api_prefix = e.api_prefix || ""),
      this.config.auth_required)
    )
      return this.prepare_return_obj();
    try {
      this.api_info = await this.view_api();
    } catch (t) {
      console.error(bt + t.message);
    }
    return this.prepare_return_obj();
  }
  async handle_space_success(e) {
    var t;
    if (!this) throw new Error(V);
    const { status_callback: s } = this.options;
    if ((s && s(e), e.status === "running"))
      try {
        if (
          ((this.config = await this._resolve_config()),
          (this.api_prefix =
            ((t = this == null ? void 0 : this.config) == null
              ? void 0
              : t.api_prefix) || ""),
          !this.config)
        )
          throw new Error(V);
        return await this.config_success(this.config);
      } catch (i) {
        throw (
          (s &&
            s({
              status: "error",
              message: "Could not load this space.",
              load_status: "error",
              detail: "NOT_FOUND",
            }),
          i)
        );
      }
  }
  async component_server(e, t, s) {
    var i;
    if (!this.config) throw new Error(V);
    const o = {},
      { hf_token: r } = this.options,
      { session_hash: a } = this;
    r && (o.Authorization = `Bearer ${this.options.hf_token}`);
    let c,
      g = this.config.components.find((d) => d.id === e);
    (i = g?.props) != null && i.root_url
      ? (c = g.props.root_url)
      : (c = this.config.root);
    let p;
    if ("binary" in s) {
      p = new FormData();
      for (const d in s.data) d !== "binary" && p.append(d, s.data[d]);
      p.set("component_id", e.toString()),
        p.set("fn_name", t),
        p.set("session_hash", a);
    } else
      (p = JSON.stringify({
        data: s,
        component_id: e,
        fn_name: t,
        session_hash: a,
      })),
        (o["Content-Type"] = "application/json");
    r && (o.Authorization = `Bearer ${r}`);
    try {
      const d = await this.fetch(`${c}${this.api_prefix}/${mt}/`, {
        method: "POST",
        body: p,
        headers: o,
        credentials: "include",
      });
      if (!d.ok)
        throw new Error(
          "Could not connect to component server: " + d.statusText
        );
      return await d.json();
    } catch (d) {
      console.warn(d);
    }
  }
  set_cookies(e) {
    this.cookies = Je(e).join("; ");
  }
  prepare_return_obj() {
    return {
      config: this.config,
      predict: this.predict,
      submit: this.submit,
      view_api: this.view_api,
      component_server: this.component_server,
    };
  }
  async connect_ws(e) {
    return new Promise((t, s) => {
      let i;
      try {
        i = new WebSocket(e);
      } catch {
        this.ws_map[e] = "failed";
        return;
      }
      (this.ws_map[e] = "pending"),
        (i.onopen = () => {
          (this.ws_map[e] = i), t();
        }),
        (i.onerror = (o) => {
          console.error("WebSocket error:", o),
            this.close_ws(e),
            (this.ws_map[e] = "failed"),
            t();
        }),
        (i.onclose = () => {
          this.ws_map[e] = "closed";
        }),
        (i.onmessage = (o) => {});
    });
  }
  async send_ws_message(e, t) {
    if (!(e in this.ws_map)) await this.connect_ws(e);
    else if (
      this.ws_map[e] === "pending" ||
      this.ws_map[e] === "closed" ||
      this.ws_map[e] === "failed"
    )
      return;
    const s = this.ws_map[e];
    s instanceof WebSocket ? s.send(JSON.stringify(t)) : this.post_data(e, t);
  }
  async close_ws(e) {
    if (e in this.ws_map) {
      const t = this.ws_map[e];
      t instanceof WebSocket && (t.close(), delete this.ws_map[e]);
    }
  }
}
const Ge = "Mostafa-XS1/Flower_Identifier",
  pn = "/predict";
function Ve(n) {
  if (!n) return "";
  let e = String(n).trim();
  return (
    (e = e.replace(/\s+/g, "_")),
    (e = e.replace(/[^\w\-\.\(\)]/g, "")),
    /\.(jpe?g|png|gif|svg|webp)$/i.test(e) || (e = `${e}.jpg`),
    e
  );
}
function Ze(n) {
  return `https://en.wikipedia.org/wiki/File:${encodeURIComponent(n)}`;
}
function hn(n, e = 320) {
  const t = `${e}px-${n}`;
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/${encodeURIComponent(
    t
  )}`;
}
function le(n, e, t = 320) {
  try {
    const s = new URL(n),
      i = "/wikipedia/commons/",
      o = s.pathname.indexOf(i);
    if (o === -1) return null;
    const a = `/wikipedia/commons/thumb/${s.pathname.slice(
      o + i.length
    )}/${t}px-${e}`;
    return `${s.origin}${a}`;
  } catch {
    return null;
  }
}
async function re(n) {
  try {
    const e = await fetch(n, { mode: "cors" });
    if (!e.ok) return null;
    const t = await e.blob();
    return !t || t.size === 0 ? null : t;
  } catch {
    return null;
  }
}
async function fn(n) {
  const e = "https://en.wikipedia.org/w/api.php",
    t = new URLSearchParams({
      action: "query",
      titles: `File:${n}`,
      prop: "imageinfo",
      iiprop: "url",
      format: "json",
      origin: "*",
    });
  try {
    const s = await fetch(`${e}?${t.toString()}`, { mode: "cors" });
    if (!s.ok) return null;
    const i = await s.json();
    if (!i.query || !i.query.pages) return null;
    const o = i.query.pages;
    for (const r in o) {
      const a = o[r];
      if (a.missing) continue;
      const c = a.imageinfo && a.imageinfo[0];
      if (c && c.url) return { originalUrl: c.url };
    }
    return null;
  } catch {
    return null;
  }
}
async function mn(n, e, t = 320) {
  try {
    const s = await fetch(n, { mode: "cors" });
    if (!s.ok) return null;
    const i = await s.text(),
      r = new DOMParser().parseFromString(i, "text/html"),
      a = r.querySelector('meta[property="og:image"], meta[name="og:image"]');
    if (a && a.content) {
      const p = a.content.startsWith("//") ? `https:${a.content}` : a.content,
        d = le(p, e, t);
      return { originalUrl: p, thumbUrl: d ?? p };
    }
    const c = r.querySelector('a[href*="upload.wikimedia.org"]');
    if (c && c.href) {
      const p = c.href.startsWith("//") ? `https:${c.href}` : c.href,
        d = le(p, e, t);
      return { originalUrl: p, thumbUrl: d ?? p };
    }
    const g = r.querySelector("img");
    if (g && g.src) {
      const p = g.src.startsWith("//") ? `https:${g.src}` : g.src,
        d = le(p, e, t);
      return { originalUrl: p, thumbUrl: d ?? p };
    }
    return null;
  } catch {
    return null;
  }
}
async function gn(n) {
  const e = Ve(n),
    t = Ze(e);
  try {
    const o = hn(e, 320),
      r = await re(o);
    if (r)
      return {
        blob: r,
        filename: decodeURIComponent(new URL(o).pathname.split("/").pop()),
        filePage: t,
      };
  } catch {}
  const s = await fn(e);
  if (s && s.originalUrl) {
    const o = s.originalUrl,
      r = le(o, e, 320);
    if (r) {
      const c = await re(r);
      if (c)
        return {
          blob: c,
          filename: decodeURIComponent(new URL(r).pathname.split("/").pop()),
          filePage: t,
        };
    }
    const a = await re(o);
    if (a)
      return {
        blob: a,
        filename: decodeURIComponent(new URL(o).pathname.split("/").pop()),
        filePage: t,
      };
  }
  const i = await mn(t, e, 320);
  if (i) {
    if (i.thumbUrl) {
      const o = await re(i.thumbUrl);
      if (o)
        return {
          blob: o,
          filename: decodeURIComponent(
            new URL(i.thumbUrl).pathname.split("/").pop()
          ),
          filePage: t,
        };
    }
    if (i.originalUrl) {
      const o = await re(i.originalUrl);
      if (o)
        return {
          blob: o,
          filename: decodeURIComponent(
            new URL(i.originalUrl).pathname.split("/").pop()
          ),
          filePage: t,
        };
    }
  }
  return { blob: null, filename: e, filePage: t };
}
const Ne = ye
  .connect(Ge)
  .catch(
    (n) => (console.warn("Gradio client connect failed:", n), Promise.reject(n))
  );
document.addEventListener("DOMContentLoaded", () => {
  const n = document.getElementById("plantName"),
    e = document.getElementById("identifyBtn"),
    t = document.getElementById("clearResultBtn"),
    s = document.getElementById("fileInput"),
    i = document.getElementById("dropZone"),
    o = document.getElementById("result"),
    r = document.getElementById("fileStatus");
  function a(l) {
    return String(l)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function c(l) {
    o.innerHTML = l;
  }
  function g(l = "Identifying…") {
    c(
      `<div class="result-spinner">${a(
        l
      )}</div><div class="result-wait">🔄 <em>Waiting for model...</em></div>`
    );
  }
  function p(l) {
    c(`<div class="result-error"><strong>Error:</strong> ${a(l)}</div>`);
  }
  function d(l) {
    try {
      if (Array.isArray(l)) {
        if (l.length === 0) return "<div>No results</div>";
        const h = l[0];
        return h &&
          typeof h == "object" &&
          ("label" in h || "name" in h || "class" in h)
          ? `<ul style="padding-left:18px">${l
              .map((_) => {
                const L = _.label ?? _.name ?? _.class ?? JSON.stringify(_),
                  S = _.score ?? _.probability ?? _.confidence ?? null;
                return `<li><strong>${a(L)}</strong>${
                  S != null ? ` — ${(S * 100).toFixed(1)}%` : ""
                }</li>`;
              })
              .join("")}</ul>`
          : `<ol style="padding-left:18px">${l
              .map((_) => `<li>${a(String(_))}</li>`)
              .join("")}</ol>`;
      } else if (typeof l == "object" && l !== null) {
        if ("label" in l || "score" in l) {
          const _ = l.label ?? l.name ?? JSON.stringify(l),
            L = l.score ?? l.probability ?? l.confidence ?? null;
          return `<div><strong>${a(_)}</strong>${
            L != null ? ` — ${(L * 100).toFixed(1)}%` : ""
          }</div>`;
        }
        return `<ul style="padding-left:18px">${Object.keys(l)
          .map(
            (_) =>
              `<li><strong>${a(_)}</strong>: ${a(JSON.stringify(l[_]))}</li>`
          )
          .join("")}</ul>`;
      } else return `<div>${a(String(l))}</div>`;
    } catch {
      return `<pre>${a(JSON.stringify(l, null, 2))}</pre>`;
    }
  }
  const w = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
  function E(l) {
    const h = l
        .split(/\n-{3,}\n/)
        .map((_) => _.trim())
        .filter(Boolean),
      b = [];
    for (const _ of h) {
      const S =
        _.split(/\n/)
          .map((j) => j.trim())
          .filter(Boolean)[0] || "";
      let N = "",
        f = null,
        Q = null,
        H = null;
      const te = S.match(/#{2,3}\s*([^\(]+?)\s*\((\d+(?:\.\d+)?)%\)/i);
      if (te) {
        (N = te[1].trim()), (f = parseFloat(te[2]));
        const j = S.match(/\*\*\[([^\]]+)\]\((https?:\/\/[^\)]+)\)\*\*/);
        if (j) (Q = j[1]), (H = j[2]);
        else {
          const x = S.match(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/);
          x && ((Q = x[1]), (H = x[2]));
        }
      } else {
        const j = S.match(/^(.+?)\s*\((\d+(?:\.\d+)?)%\)/);
        j
          ? ((N = j[1].trim()), (f = parseFloat(j[2])))
          : (N = S.split(/\s+/)[0] || S);
      }
      let U = null;
      const z = _.match(/\*\*Blooming Period:\*\*\s*([^*]+)/i);
      z && (U = z[1].trim());
      let B = [];
      const ne = _.match(/\*\*Likely Locations:\*\*\s*([\s\S]+)/i);
      if (ne) {
        const j = ne[1];
        let x;
        for (; (x = w.exec(j)) !== null; ) B.push({ text: x[1], url: x[2] });
      } else {
        let j;
        for (; (j = w.exec(_)) !== null; ) B.push({ text: j[1], url: j[2] });
      }
      let Z = _.replace(S, "").trim();
      (Z = Z.replace(/\*\*Blooming Period:\*\*[\s\S]*/i, "")
        .replace(/\*\*Likely Locations:\*\*[\s\S]*/i, "")
        .trim()),
        (Z = Z.replace(/\*\*\[[^\]]+\]\([^\)]+\)\*\*/, "").trim());
      const v = Z.replace(/\n+/g, " ").trim().slice(0, 600);
      b.push({
        title: N || "",
        confidence: f,
        wikiText: Q,
        wikiUrl: H,
        description: v,
        bloom: U,
        locations: B,
      });
    }
    return b;
  }
  function F(l) {
    return !l || l.length === 0
      ? "<div>No predictions</div>"
      : l
          .map((h) => {
            const b =
                h.confidence != null
                  ? `<span class="confidence-badge">${h.confidence.toFixed(
                      2
                    )}%</span>`
                  : "",
              _ = h.wikiUrl
                ? `<a href="${a(h.wikiUrl)}" target="_blank" rel="noopener">${a(
                    h.title
                  )}</a>`
                : a(h.title),
              L = h.description
                ? `<p class="result-desc">${a(h.description)}</p>`
                : "",
              S = h.bloom
                ? `<div class="result-bloom"><strong>Blooming Period:</strong> ${a(
                    h.bloom
                  )}</div>`
                : "",
              N =
                h.locations && h.locations.length
                  ? `<div class="result-locations"><strong>Likely Locations:</strong> ${h.locations
                      .map(
                        (f) =>
                          `<a href="${a(
                            f.url
                          )}" target="_blank" rel="noopener">${a(f.text)}</a>`
                      )
                      .join(" · ")}</div>`
                  : "";
            return `
        <div class="result-item">
          <div class="result-item-inner">
            <div class="result-title">${_}${b}</div>
          </div>
          ${L}
          ${S}
          ${N}
        </div>
      `;
          })
          .join("");
  }
  async function u(l) {
    g();
    try {
      const b = await (await Ne).predict(pn, { image: l }),
        _ = b?.data ?? b;
      if (typeof _ == "string") {
        const N = E(_);
        c(
          `<div class="result-heading">Result</div>${F(
            N
          )}<details class="result-raw"><summary>Raw output</summary><pre>${a(
            _
          )}</pre></details>`
        );
        return;
      }
      if (Array.isArray(_) && _.length === 1 && typeof _[0] == "string") {
        const N = E(_[0]);
        c(
          `<div class="result-heading">Result</div>${F(
            N
          )}<details class="result-raw"><summary>Raw output</summary><pre>${a(
            _[0]
          )}</pre></details>`
        );
        return;
      }
      const L = d(_),
        S = `<details class="result-raw"><summary>Raw JSON</summary><pre>${a(
          JSON.stringify(b, null, 2)
        )}</pre></details>`;
      c(`<div class="result-heading">Result</div>${L}${S}`);
    } catch (h) {
      console.error(h), p(h?.message ?? String(h));
    }
  }
  function y(l, h, b) {
    const _ = URL.createObjectURL(l),
      L = b
        ? `<div class="result-filepage-link"><a href="${a(
            b
          )}" target="_blank" rel="noopener">Open file page on Wikipedia</a></div>`
        : "",
      S = `
      <div class="result-preview">
        <div class="result-heading">Preview</div>
        <img class="result-preview-img" src="${_}" alt="preview"/>
        <div class="result-filename"><small>${a(
          h ?? "uploaded image"
        )}</small></div>
        ${L}
      </div>
    `;
    c(S);
    const N = new File([l], h ?? "image.jpg", { type: l.type || "image/jpeg" });
    u(N);
  }
  async function T() {
    const l = n.value?.trim();
    if (!l) {
      p("Please type a plant name first.");
      return;
    }
    g(`Fetching image for "${l}"…`);
    const h = await gn(l);
    if (!h || !h.blob) {
      const b = h?.filePage || Ze(Ve(l));
      p(
        `Image fetch failed for "${l}". You can open the file page: <a href="${a(
          b
        )}" target="_blank" rel="noopener">${a(b)}</a>`
      );
      return;
    }
    y(h.blob, h.filename, h.filePage);
  }
  function A() {
    (o.innerHTML = ""), (n.value = ""), (r.textContent = "No file chosen");
  }
  function Y(l) {
    l && ((r.textContent = l.name), y(l, l.name));
  }
  (function () {
    function h(b) {
      b.preventDefault(), b.stopPropagation();
    }
    ["dragenter", "dragover", "dragleave", "drop"].forEach((b) => {
      i.addEventListener(b, h, !1), document.addEventListener(b, h, !1);
    }),
      i.addEventListener("dragover", () => i.classList.add("dragover")),
      i.addEventListener("dragleave", () => i.classList.remove("dragover")),
      i.addEventListener("drop", (b) => {
        i.classList.remove("dragover");
        const _ = b.dataTransfer;
        if (!_) return;
        const L = _.files;
        if (!L || L.length === 0) {
          p("No file detected in dropped item.");
          return;
        }
        const S = L[0];
        Y(S);
      }),
      i.addEventListener("click", () => s.click()),
      i.addEventListener("keydown", (b) => {
        (b.key === "Enter" || b.key === " ") && s.click();
      });
  })(),
    e.addEventListener("click", () => T()),
    n.addEventListener("keydown", (l) => {
      l.key === "Enter" && (l.preventDefault(), T());
    }),
    t.addEventListener("click", () => A()),
    s.addEventListener("change", (l) => {
      const h = l.target.files?.[0];
      h && Y(h), (l.target.value = "");
    }),
    (window.openModal = () => {
      const l = document.getElementById("howModal");
      l && l.setAttribute("aria-hidden", "false");
    }),
    (window.closeModal = () => {
      const l = document.getElementById("howModal");
      l && l.setAttribute("aria-hidden", "true");
    });
  const X = document.getElementById("contactBtn");
  X &&
    X.addEventListener("click", () =>
      alert("Contact us at bloomshift@example.com (placeholder)")
    ),
    (async function () {
      try {
        await Ne, console.log("Gradio client connected to", Ge);
      } catch (h) {
        console.warn("Could not connect to Gradio client:", h?.message ?? h);
      }
    })(),
    (window.handleTextInput = T),
    (window.clearResult = A);
});
