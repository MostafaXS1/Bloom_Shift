(function () {
  const n = document.createElement("link").relList;
  if (n && n.supports && n.supports("modulepreload")) return;
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
const Xe = "modulepreload",
  Ye = function (e) {
    return "/" + e;
  },
  ke = {},
  xe = function (n, t, s) {
    let i = Promise.resolve();
    if (t && t.length > 0) {
      let w = function (f) {
        return Promise.all(
          f.map((u) =>
            Promise.resolve(u).then(
              (_) => ({ status: "fulfilled", value: _ }),
              (_) => ({ status: "rejected", reason: _ })
            )
          )
        );
      };
      var r = w;
      document.getElementsByTagName("link");
      const a = document.querySelector("meta[property=csp-nonce]"),
        c = a?.nonce || a?.getAttribute("nonce");
      i = w(
        t.map((f) => {
          if (((f = Ye(f)), f in ke)) return;
          ke[f] = !0;
          const u = f.endsWith(".css"),
            _ = u ? '[rel="stylesheet"]' : "";
          if (document.querySelector(`link[href="${f}"]${_}`)) return;
          const k = document.createElement("link");
          if (
            ((k.rel = u ? "stylesheet" : Xe),
            u || (k.as = "script"),
            (k.crossOrigin = ""),
            (k.href = f),
            c && k.setAttribute("nonce", c),
            document.head.appendChild(k),
            u)
          )
            return new Promise((z, d) => {
              k.addEventListener("load", z),
                k.addEventListener("error", () =>
                  d(new Error(`Unable to preload CSS for ${f}`))
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
      return n().catch(o);
    });
  };
var Qe = Object.defineProperty,
  De = (e) => {
    throw TypeError(e);
  },
  et = (e, n, t) =>
    n in e
      ? Qe(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t })
      : (e[n] = t),
  m = (e, n, t) => et(e, typeof n != "symbol" ? n + "" : n, t),
  qe = (e, n, t) => n.has(e) || De("Cannot " + t),
  ie = (e, n, t) => (qe(e, n, "read from private field"), n.get(e)),
  tt = (e, n, t) =>
    n.has(e)
      ? De("Cannot add the same private member more than once")
      : n instanceof WeakSet
      ? n.add(e)
      : n.set(e, t),
  nt = (e, n, t, s) => (qe(e, n, "write to private field"), n.set(e, t), t),
  pe = new Intl.Collator(0, { numeric: 1 }).compare;
function Ae(e, n, t) {
  return (
    (e = e.split(".")),
    (n = n.split(".")),
    pe(e[0], n[0]) ||
      pe(e[1], n[1]) ||
      ((n[2] = n.slice(2).join(".")),
      (t = /[.-]/.test((e[2] = e.slice(2).join(".")))),
      t == /[.-]/.test(n[2]) ? pe(e[2], n[2]) : t ? -1 : 1)
  );
}
const st = "host",
  Ie = "queue/data",
  it = "queue/join",
  Se = "upload",
  ot = "login",
  ae = "config",
  rt = "info",
  at = "runtime",
  ct = "sleeptime",
  lt = "heartbeat",
  dt = "component_server",
  ut = "reset",
  pt = "cancel",
  ht = "app_id",
  ft = "https://gradio-space-api-fetcher-v2.hf.space/api",
  Be = "This application is currently busy. Please try again. ",
  ee = "Connection errored out. ",
  Z = "Could not resolve app config. ",
  gt = "Could not get space status. ",
  mt = "Could not get API info. ",
  we = "Space metadata could not be loaded. ",
  _t = "Invalid URL. A full URL path is required.",
  wt = "Not authorized to access this space. ",
  Re = "Invalid credentials. Could not login. ",
  yt = "Login credentials are required to access this space.",
  vt = "File system access is only available in Node.js environments",
  ze = "Root URL not found in client config",
  bt = "Error uploading file";
function $t(e, n, t) {
  return n.startsWith("http://") || n.startsWith("https://")
    ? t
      ? e
      : n
    : e + n;
}
async function Le(e, n, t) {
  try {
    return (
      (
        await (
          await fetch(`https://huggingface.co/api/spaces/${e}/jwt`, {
            headers: {
              Authorization: `Bearer ${n}`,
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
function Et(e) {
  let n = {};
  return (
    e.forEach(({ api_name: t, id: s }) => {
      t && (n[t] = s);
    }),
    n
  );
}
async function kt(e) {
  const n = this.options.hf_token
    ? { Authorization: `Bearer ${this.options.hf_token}` }
    : {};
  if (
    ((n["Content-Type"] = "application/json"),
    typeof window < "u" &&
      window.gradio_config &&
      location.origin !== "http://localhost:9876")
  ) {
    if (
      (window.gradio_config.current_page &&
        (e = e.substring(0, e.lastIndexOf("/"))),
      window.gradio_config.dev_mode)
    ) {
      let t = ge(e, this.deep_link ? ae + "?deep_link=" + this.deep_link : ae);
      const s = await this.fetch(t, { headers: n, credentials: "include" }),
        i = await Pe(s, e, !!this.options.auth);
      window.gradio_config = {
        ...i,
        current_page: window.gradio_config.current_page,
      };
    }
    return (window.gradio_config.root = e), { ...window.gradio_config };
  } else if (e) {
    let t = ge(e, this.deep_link ? ae + "?deep_link=" + this.deep_link : ae);
    const s = await this.fetch(t, { headers: n, credentials: "include" });
    return Pe(s, e, !!this.options.auth);
  }
  throw new Error(Z);
}
async function Pe(e, n, t) {
  var s, i;
  if (e?.status === 401 && !t) {
    const o = await e.json(),
      r = (s = o?.detail) == null ? void 0 : s.auth_message;
    throw new Error(r || yt);
  } else if (e?.status === 401 && t) throw new Error(Re);
  if (e?.status === 200) {
    let o = await e.json();
    return (
      (o.root = n),
      (i = o.dependencies) == null ||
        i.forEach((r, a) => {
          r.id === void 0 && (r.id = a);
        }),
      o
    );
  } else if (e?.status === 401) throw new Error(wt);
  throw new Error(Z);
}
async function xt() {
  const { http_protocol: e, host: n } = await ce(
    this.app_reference,
    this.options.hf_token
  );
  try {
    if (this.options.auth) {
      const t = await Ue(
        e,
        n,
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
async function Ue(e, n, t, s, i) {
  const o = new FormData();
  o.append("username", t?.[0]), o.append("password", t?.[1]);
  let r = {};
  i && (r.Authorization = `Bearer ${i}`);
  const a = await s(`${e}//${n}/${ot}`, {
    headers: r,
    method: "POST",
    body: o,
    credentials: "include",
  });
  if (a.status === 200) return a.headers.get("set-cookie");
  throw a.status === 401 ? new Error(Re) : new Error(we);
}
function he(e) {
  if (e.startsWith("http")) {
    const { protocol: n, host: t, pathname: s } = new URL(e);
    return {
      ws_protocol: n === "https:" ? "wss" : "ws",
      http_protocol: n,
      host: t + (s !== "/" ? s : ""),
    };
  }
  return { ws_protocol: "wss", http_protocol: "https:", host: new URL(e).host };
}
const Fe = (e) => {
    let n = [];
    return (
      e.split(/,(?=\s*[^\s=;]+=[^\s=;]+)/).forEach((t) => {
        const [s, i] = t.split(";")[0].split("=");
        s && i && n.push(`${s.trim()}=${i.trim()}`);
      }),
      n
    );
  },
  ye = /^[a-zA-Z0-9_\-\.]+\/[a-zA-Z0-9_\-\.]+$/,
  St = /.*hf\.space\/{0,1}.*$/;
async function ce(e, n) {
  const t = {};
  n && (t.Authorization = `Bearer ${n}`);
  const s = e.trim().replace(/\/$/, "");
  if (ye.test(s))
    try {
      const i = (
        await (
          await fetch(`https://huggingface.co/api/spaces/${s}/${st}`, {
            headers: t,
          })
        ).json()
      ).host;
      return { space_id: e, ...he(i) };
    } catch {
      throw new Error(we);
    }
  if (St.test(s)) {
    const { ws_protocol: i, http_protocol: o, host: r } = he(s);
    return {
      space_id: r.split("/")[0].replace(".hf.space", ""),
      ws_protocol: i,
      http_protocol: o,
      host: r,
    };
  }
  return { space_id: !1, ...he(s) };
}
const ge = (...e) => {
  try {
    return e.reduce(
      (n, t) => (
        (n = n.replace(/\/+$/, "")),
        (t = t.replace(/^\/+/, "")),
        new URL(t, n + "/").toString()
      )
    );
  } catch {
    throw new Error(_t);
  }
};
function Lt(e, n, t) {
  const s = { named_endpoints: {}, unnamed_endpoints: {} };
  return (
    Object.keys(e).forEach((i) => {
      (i === "named_endpoints" || i === "unnamed_endpoints") &&
        ((s[i] = {}),
        Object.entries(e[i]).forEach(([o, { parameters: r, returns: a }]) => {
          var c, w, f, u;
          const _ =
              ((c = n.dependencies.find(
                (d) => d.api_name === o || d.api_name === o.replace("/", "")
              )) == null
                ? void 0
                : c.id) ||
              t[o.replace("/", "")] ||
              -1,
            k =
              _ !== -1
                ? (w = n.dependencies.find((d) => d.id == _)) == null
                  ? void 0
                  : w.types
                : { generator: !1, cancel: !1 };
          if (
            _ !== -1 &&
            ((u =
              (f = n.dependencies.find((d) => d.id == _)) == null
                ? void 0
                : f.inputs) == null
              ? void 0
              : u.length) !== r.length
          ) {
            const d = n.dependencies
              .find((v) => v.id == _)
              .inputs.map((v) => {
                var C;
                return (C = n.components.find((q) => q.id === v)) == null
                  ? void 0
                  : C.type;
              });
            try {
              d.forEach((v, C) => {
                if (v === "state") {
                  const q = {
                    component: "state",
                    example: null,
                    parameter_default: null,
                    parameter_has_default: !0,
                    parameter_name: null,
                    hidden: !0,
                  };
                  r.splice(C, 0, q);
                }
              });
            } catch (v) {
              console.error(v);
            }
          }
          const z = (d, v, C, q) => ({
            ...d,
            description: jt(d?.type, C),
            type: Pt(d?.type, v, C, q) || "",
          });
          s[i][o] = {
            parameters: r.map((d) =>
              z(d, d?.component, d?.serializer, "parameter")
            ),
            returns: a.map((d) => z(d, d?.component, d?.serializer, "return")),
            type: k,
          };
        }));
    }),
    s
  );
}
function Pt(e, n, t, s) {
  if (n === "Api") return e.type;
  switch (e?.type) {
    case "string":
      return "string";
    case "boolean":
      return "boolean";
    case "number":
      return "number";
  }
  if (t === "JSONSerializable" || t === "StringSerializable") return "any";
  if (t === "ListStringSerializable") return "string[]";
  if (n === "Image")
    return s === "parameter" ? "Blob | File | Buffer" : "string";
  if (t === "FileSerializable")
    return e?.type === "array"
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
function jt(e, n) {
  return n === "GallerySerializable"
    ? "array of [file, label] tuples"
    : n === "ListStringSerializable"
    ? "array of strings"
    : n === "FileSerializable"
    ? "array of files or single file"
    : e?.description;
}
function fe(e, n) {
  switch (e.msg) {
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
          code: e.code,
          success: e.success,
        },
      };
    case "heartbeat":
      return { type: "heartbeat" };
    case "unexpected_error":
      return {
        type: "unexpected_error",
        status: {
          queue: !0,
          message: e.message,
          session_not_found: e.session_not_found,
          stage: "error",
          success: !1,
        },
      };
    case "broken_connection":
      return {
        type: "broken_connection",
        status: { queue: !0, message: e.message, stage: "error", success: !1 },
      };
    case "estimation":
      return {
        type: "update",
        status: {
          queue: !0,
          stage: n || "pending",
          code: e.code,
          size: e.queue_size,
          position: e.rank,
          eta: e.rank_eta,
          success: e.success,
        },
      };
    case "progress":
      return {
        type: "update",
        status: {
          queue: !0,
          stage: "pending",
          code: e.code,
          progress_data: e.progress_data,
          success: e.success,
        },
      };
    case "log":
      return { type: "log", data: e };
    case "process_generating":
      return {
        type: "generating",
        status: {
          queue: !0,
          message: e.success ? null : e.output.error,
          stage: e.success ? "generating" : "error",
          code: e.code,
          progress_data: e.progress_data,
          eta: e.average_duration,
          changed_state_ids: e.success ? e.output.changed_state_ids : void 0,
        },
        data: e.success ? e.output : null,
      };
    case "process_streaming":
      return {
        type: "streaming",
        status: {
          queue: !0,
          message: e.output.error,
          stage: "streaming",
          time_limit: e.time_limit,
          code: e.code,
          progress_data: e.progress_data,
          eta: e.eta,
        },
        data: e.output,
      };
    case "process_completed":
      return "error" in e.output
        ? {
            type: "update",
            status: {
              queue: !0,
              title: e.output.title,
              message: e.output.error,
              visible: e.output.visible,
              duration: e.output.duration,
              stage: "error",
              code: e.code,
              success: e.success,
            },
          }
        : {
            type: "complete",
            status: {
              queue: !0,
              message: e.success ? void 0 : e.output.error,
              stage: e.success ? "complete" : "error",
              code: e.code,
              progress_data: e.progress_data,
              changed_state_ids: e.success
                ? e.output.changed_state_ids
                : void 0,
            },
            data: e.success ? e.output : null,
          };
    case "process_starts":
      return {
        type: "update",
        status: {
          queue: !0,
          stage: "pending",
          code: e.code,
          size: e.rank,
          position: 0,
          success: e.success,
          eta: e.eta,
        },
        original_msg: "process_starts",
      };
  }
  return { type: "none", status: { stage: "error", queue: !0 } };
}
const Ot = (e = [], n) => {
  const t = n ? n.parameters : [];
  if (Array.isArray(e))
    return (
      n &&
        t.length > 0 &&
        e.length > t.length &&
        console.warn("Too many arguments provided for the endpoint."),
      e
    );
  const s = [],
    i = Object.keys(e);
  return (
    t.forEach((o, r) => {
      if (e.hasOwnProperty(o.parameter_name)) s[r] = e[o.parameter_name];
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
async function Tt() {
  if (this.api_info) return this.api_info;
  const { hf_token: e } = this.options,
    { config: n } = this,
    t = { "Content-Type": "application/json" };
  if ((e && (t.Authorization = `Bearer ${e}`), !!n))
    try {
      let s, i;
      if (typeof window < "u" && window.gradio_api_info)
        i = window.gradio_api_info;
      else {
        if (Ae(n?.version || "2.0.0", "3.30") < 0)
          s = await this.fetch(ft, {
            method: "POST",
            body: JSON.stringify({ serialize: !1, config: JSON.stringify(n) }),
            headers: t,
            credentials: "include",
          });
        else {
          const o = ge(n.root, this.api_prefix, rt);
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
        Lt(i, n, this.api_map)
      );
    } catch (s) {
      throw new Error("Could not get API info. " + s.message);
    }
}
async function Nt(e, n, t) {
  var s;
  const i = {};
  (s = this == null ? void 0 : this.options) != null &&
    s.hf_token &&
    (i.Authorization = `Bearer ${this.options.hf_token}`);
  const o = 1e3,
    r = [];
  let a;
  for (let c = 0; c < n.length; c += o) {
    const w = n.slice(c, c + o),
      f = new FormData();
    w.forEach((_) => {
      f.append("files", _);
    });
    try {
      const _ = t
        ? `${e}${this.api_prefix}/${Se}?upload_id=${t}`
        : `${e}${this.api_prefix}/${Se}`;
      a = await this.fetch(_, {
        method: "POST",
        body: f,
        headers: i,
        credentials: "include",
      });
    } catch (_) {
      throw new Error(ee + _.message);
    }
    if (!a.ok) {
      const _ = await a.text();
      return { error: `HTTP ${a.status}: ${_}` };
    }
    const u = await a.json();
    u && r.push(...u);
  }
  return { files: r };
}
async function Ct(e, n, t, s) {
  let i = (Array.isArray(e) ? e : [e]).map((r) => r.blob);
  const o = i.filter((r) => r.size > (s ?? 1 / 0));
  if (o.length)
    throw new Error(
      `File size exceeds the maximum allowed size of ${s} bytes: ${o
        .map((r) => r.name)
        .join(", ")}`
    );
  return await Promise.all(
    await this.upload_files(n, i, t).then(async (r) => {
      if (r.error) throw new Error(r.error);
      return r.files
        ? r.files.map(
            (a, c) =>
              new ve({
                ...e[c],
                path: a,
                url: `${n}${this.api_prefix}/file=${a}`,
              })
          )
        : [];
    })
  );
}
class ve {
  constructor({
    path: n,
    url: t,
    orig_name: s,
    size: i,
    blob: o,
    is_stream: r,
    mime_type: a,
    alt_text: c,
    b64: w,
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
      (this.path = n),
      (this.url = t),
      (this.orig_name = s),
      (this.size = i),
      (this.blob = t ? void 0 : o),
      (this.is_stream = r),
      (this.mime_type = a),
      (this.alt_text = c),
      (this.b64 = w);
  }
}
class Dt {
  constructor(n, t) {
    m(this, "type"),
      m(this, "command"),
      m(this, "meta"),
      m(this, "fileData"),
      (this.type = "command"),
      (this.command = n),
      (this.meta = t);
  }
}
typeof process < "u" && process.versions && process.versions.node;
function je(e, n, t) {
  for (; t.length > 1; ) {
    const i = t.shift();
    if (typeof i == "string" || typeof i == "number") e = e[i];
    else throw new Error("Invalid key type");
  }
  const s = t.shift();
  if (typeof s == "string" || typeof s == "number") e[s] = n;
  else throw new Error("Invalid key type");
}
async function me(e, n = void 0, t = [], s = !1, i = void 0) {
  if (Array.isArray(e)) {
    let o = [];
    return (
      await Promise.all(
        e.map(async (r, a) => {
          var c;
          let w = t.slice();
          w.push(String(a));
          const f = await me(
            e[a],
            s
              ? ((c = i?.parameters[a]) == null ? void 0 : c.component) ||
                  void 0
              : n,
            w,
            !1,
            i
          );
          o = o.concat(f);
        })
      ),
      o
    );
  } else {
    if (
      (globalThis.Buffer && e instanceof globalThis.Buffer) ||
      e instanceof Blob
    )
      return [{ path: t, blob: new Blob([e]), type: n }];
    if (typeof e == "object" && e !== null) {
      let o = [];
      for (const r of Object.keys(e)) {
        const a = [...t, r],
          c = e[r];
        o = o.concat(await me(c, void 0, a, !1, i));
      }
      return o;
    }
  }
  return [];
}
function qt(e, n) {
  var t, s;
  let i =
    (s = (t = n?.dependencies) == null ? void 0 : t.find((o) => o.id == e)) ==
    null
      ? void 0
      : s.queue;
  return i != null ? !i : !n.enable_queue;
}
function At(e, n) {
  return new Promise((t, s) => {
    const i = new MessageChannel();
    (i.port1.onmessage = ({ data: o }) => {
      i.port1.close(), t(o);
    }),
      window.parent.postMessage(e, n, [i.port2]);
  });
}
function oe(e, n, t, s, i = !1) {
  if (s === "input" && !i)
    throw new Error("Invalid code path. Cannot skip state inputs for input.");
  if (s === "output" && i) return e;
  let o = [],
    r = 0;
  const a = s === "input" ? n.inputs : n.outputs;
  for (let c = 0; c < a.length; c++) {
    const w = a[c],
      f = t.find((u) => u.id === w);
    if (f?.type === "state") {
      if (i)
        if (e.length === a.length) {
          const u = e[r];
          o.push(u), r++;
        } else o.push(null);
      else {
        r++;
        continue;
      }
      continue;
    } else {
      const u = e[r];
      o.push(u), r++;
    }
  }
  return o;
}
async function It(e, n, t) {
  const s = this;
  await Bt(s, n);
  const i = await me(n, void 0, [], !0, t);
  return (
    (
      await Promise.all(
        i.map(async ({ path: o, blob: r, type: a }) => {
          if (!r) return { path: o, type: a };
          const c = await s.upload_files(e, [r]),
            w = c.files && c.files[0];
          return {
            path: o,
            file_url: w,
            type: a,
            name: typeof File < "u" && r instanceof File ? r?.name : void 0,
          };
        })
      )
    ).forEach(({ path: o, file_url: r, type: a, name: c }) => {
      if (a === "Gallery") je(n, r, o);
      else if (r) {
        const w = new ve({ path: r, orig_name: c });
        je(n, w, o);
      }
    }),
    n
  );
}
async function Bt(e, n) {
  var t, s;
  if (
    !(
      ((t = e.config) != null && t.root) ||
      ((s = e.config) != null && s.root_url)
    )
  )
    throw new Error(ze);
  await Me(e, n);
}
async function Me(e, n, t = []) {
  for (const s in n)
    n[s] instanceof Dt
      ? await Rt(e, n, s)
      : typeof n[s] == "object" &&
        n[s] !== null &&
        (await Me(e, n[s], [...t, s]));
}
async function Rt(e, n, t) {
  var s, i;
  let o = n[t];
  const r =
    ((s = e.config) == null ? void 0 : s.root) ||
    ((i = e.config) == null ? void 0 : i.root_url);
  if (!r) throw new Error(ze);
  try {
    let a, c;
    if (typeof process < "u" && process.versions && process.versions.node) {
      const _ = await xe(
        () => import("./__vite-browser-external-DYxpcVy9-BIHI7g3E.js"),
        []
      );
      (c = (
        await xe(async () => {
          const { resolve: k } = await import(
            "./__vite-browser-external-DYxpcVy9-BIHI7g3E.js"
          );
          return { resolve: k };
        }, [])
      ).resolve(process.cwd(), o.meta.path)),
        (a = await _.readFile(c));
    } else throw new Error(vt);
    const w = new Blob([a], { type: "application/octet-stream" }),
      f = await e.upload_files(r, [w]),
      u = f.files && f.files[0];
    if (u) {
      const _ = new ve({ path: u, orig_name: o.meta.name || "" });
      n[t] = _;
    }
  } catch (a) {
    console.error(bt, a);
  }
}
async function zt(e, n, t) {
  const s = { "Content-Type": "application/json" };
  this.options.hf_token &&
    (s.Authorization = `Bearer ${this.options.hf_token}`);
  try {
    var i = await this.fetch(e, {
      method: "POST",
      body: JSON.stringify(n),
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
async function Ut(e, n = {}) {
  let t = !1,
    s = !1;
  if (!this.config) throw new Error("Could not resolve app config");
  if (typeof e == "number") this.config.dependencies.find((i) => i.id == e);
  else {
    const i = e.replace(/^\//, "");
    this.config.dependencies.find((o) => o.id == this.api_map[i]);
  }
  return new Promise(async (i, o) => {
    const r = this.submit(e, n, null, null, !0);
    let a;
    for await (const c of r)
      c.type === "data" && (s && i(a), (t = !0), (a = c)),
        c.type === "status" &&
          (c.stage === "error" && o(c),
          c.stage === "complete" && ((s = !0), t && i(a)));
  });
}
async function re(e, n, t) {
  let s =
      n === "subdomain"
        ? `https://huggingface.co/api/spaces/by-subdomain/${e}`
        : `https://huggingface.co/api/spaces/${e}`,
    i,
    o;
  try {
    if (((i = await fetch(s)), (o = i.status), o !== 200)) throw new Error();
    i = await i.json();
  } catch {
    t({
      status: "error",
      load_status: "error",
      message: gt,
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
          re(e, n, t);
        }, 1e3);
      break;
    case "PAUSED":
      t({
        status: "paused",
        load_status: "error",
        message:
          "This space has been paused by the author. If you would like to try this demo, consider duplicating the space.",
        detail: r,
        discussions_enabled: await Oe(a),
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
          re(e, n, t);
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
          re(e, n, t);
        }, 1e3);
      break;
    default:
      t({
        status: "space_error",
        load_status: "error",
        message: "This space is experiencing an issue.",
        detail: r,
        discussions_enabled: await Oe(a),
      });
      break;
  }
}
const Je = async (e, n) => {
    let t = 0;
    const s = 12,
      i = 5e3;
    return new Promise((o) => {
      re(e, ye.test(e) ? "space_name" : "subdomain", (r) => {
        n(r),
          r.status === "running" ||
          r.status === "error" ||
          r.status === "paused" ||
          r.status === "space_error"
            ? o()
            : (r.status === "sleeping" || r.status === "building") &&
              (t < s
                ? (t++,
                  setTimeout(() => {
                    Je(e, n).then(o);
                  }, i))
                : o());
      });
    });
  },
  Ft = /^(?=[^]*\b[dD]iscussions{0,1}\b)(?=[^]*\b[dD]isabled\b)[^]*$/;
async function Oe(e) {
  try {
    const n = await fetch(
        `https://huggingface.co/api/spaces/${e}/discussions`,
        { method: "HEAD" }
      ),
      t = n.headers.get("x-error-message");
    return !(!n.ok || (t && Ft.test(t)));
  } catch {
    return !1;
  }
}
async function Mt(e, n) {
  const t = {};
  n && (t.Authorization = `Bearer ${n}`);
  try {
    const s = await fetch(`https://huggingface.co/api/spaces/${e}/${at}`, {
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
async function Jt(e, n, t) {
  const s = {};
  t && (s.Authorization = `Bearer ${t}`);
  const i = { seconds: n };
  try {
    const o = await fetch(`https://huggingface.co/api/spaces/${e}/${ct}`, {
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
const Te = [
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
async function Wt(e, n) {
  const { hf_token: t, private: s, hardware: i, timeout: o, auth: r } = n;
  if (i && !Te.includes(i))
    throw new Error(
      `Invalid hardware type provided. Valid types are: ${Te.map(
        (v) => `"${v}"`
      ).join(",")}.`
    );
  const { http_protocol: a, host: c } = await ce(e, t);
  let w = null;
  if (r) {
    const v = await Ue(a, c, r, fetch);
    v && (w = Fe(v));
  }
  const f = {
      Authorization: `Bearer ${t}`,
      "Content-Type": "application/json",
      ...(w ? { Cookie: w.join("; ") } : {}),
    },
    u = (
      await (
        await fetch("https://huggingface.co/api/whoami-v2", { headers: f })
      ).json()
    ).name,
    _ = e.split("/")[1],
    k = { repository: `${u}/${_}` };
  s && (k.private = !0);
  let z;
  try {
    i || (z = await Mt(e, t));
  } catch (v) {
    throw Error(we + v.message);
  }
  const d = i || z || "cpu-basic";
  k.hardware = d;
  try {
    const v = await fetch(`https://huggingface.co/api/spaces/${e}/duplicate`, {
      method: "POST",
      headers: f,
      body: JSON.stringify(k),
    });
    if (v.status === 409)
      try {
        return await _e.connect(`${u}/${_}`, n);
      } catch (q) {
        throw (console.error("Failed to connect Client instance:", q), q);
      }
    else if (v.status !== 200) throw new Error(v.statusText);
    const C = await v.json();
    return await Jt(`${u}/${_}`, o || 300, t), await _e.connect(Ht(C.url), n);
  } catch (v) {
    throw new Error(v);
  }
}
function Ht(e) {
  const n = /https:\/\/huggingface.co\/spaces\/([^/]+\/[^/]+)/,
    t = e.match(n);
  if (t) return t[1];
}
var G;
class Gt extends TransformStream {
  constructor(n = { allowCR: !1 }) {
    super({
      transform: (t, s) => {
        for (t = ie(this, G) + t; ; ) {
          const i = t.indexOf(`
`),
            o = n.allowCR ? t.indexOf("\r") : -1;
          if (o !== -1 && o !== t.length - 1 && (i === -1 || i - 1 > o)) {
            s.enqueue(t.slice(0, o)), (t = t.slice(o + 1));
            continue;
          }
          if (i === -1) break;
          const r = t[i - 1] === "\r" ? i - 1 : i;
          s.enqueue(t.slice(0, r)), (t = t.slice(i + 1));
        }
        nt(this, G, t);
      },
      flush: (t) => {
        if (ie(this, G) === "") return;
        const s =
          n.allowCR && ie(this, G).endsWith("\r")
            ? ie(this, G).slice(0, -1)
            : ie(this, G);
        t.enqueue(s);
      },
    }),
      tt(this, G, "");
  }
}
G = new WeakMap();
function Zt(e) {
  let n = new TextDecoderStream(),
    t = new Gt({ allowCR: !0 });
  return e.pipeThrough(n).pipeThrough(t);
}
function Kt(e) {
  let n = /[:]\s*/.exec(e),
    t = n && n.index;
  if (t) return [e.substring(0, t), e.substring(t + n[0].length)];
}
function Ne(e, n, t) {
  e.get(n) || e.set(n, t);
}
async function* Vt(e, n) {
  if (!e.body) return;
  let t = Zt(e.body),
    s,
    i = t.getReader(),
    o;
  for (;;) {
    if (n && n.aborted) return i.cancel();
    if (((s = await i.read()), s.done)) return;
    if (!s.value) {
      o && (yield o), (o = void 0);
      continue;
    }
    let [r, a] = Kt(s.value) || [];
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
async function Xt(e, n) {
  let t = new Request(e, n);
  Ne(t.headers, "Accept", "text/event-stream"),
    Ne(t.headers, "Content-Type", "application/json");
  let s = await fetch(t);
  if (!s.ok) throw s;
  return Vt(s, t.signal);
}
async function Yt() {
  let {
    event_callbacks: e,
    unclosed_events: n,
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
    w = new URL(`${i.root}${this.api_prefix}/${Ie}?${c}`);
  if ((o && w.searchParams.set("__sign", o), (a = this.stream(w)), !a)) {
    console.warn("Cannot connect to SSE endpoint: " + w.toString());
    return;
  }
  (a.onmessage = async function (f) {
    let u = JSON.parse(f.data);
    if (u.msg === "close_stream") {
      be(s, r.abort_controller);
      return;
    }
    const _ = u.event_id;
    if (!_) await Promise.all(Object.keys(e).map((k) => e[k](u)));
    else if (e[_] && i) {
      u.msg === "process_completed" &&
        ["sse", "sse_v1", "sse_v2", "sse_v2.1", "sse_v3"].includes(
          i.protocol
        ) &&
        n.delete(_);
      let k = e[_];
      typeof window < "u" && typeof document < "u" ? setTimeout(k, 0, u) : k(u);
    } else t[_] || (t[_] = []), t[_].push(u);
  }),
    (a.onerror = async function (f) {
      console.error(f),
        await Promise.all(
          Object.keys(e).map((u) =>
            e[u]({ msg: "broken_connection", message: ee })
          )
        );
    });
}
function be(e, n) {
  e && ((e.open = !1), n?.abort());
}
function Qt(e, n, t) {
  e[n]
    ? t.data.forEach((s, i) => {
        let o = en(e[n][i], s);
        (e[n][i] = o), (t.data[i] = o);
      })
    : ((e[n] = []),
      t.data.forEach((s, i) => {
        e[n][i] = s;
      }));
}
function en(e, n) {
  return (
    n.forEach(([t, s, i]) => {
      e = tn(e, s, t, i);
    }),
    e
  );
}
function tn(e, n, t, s) {
  if (n.length === 0) {
    if (t === "replace") return s;
    if (t === "append") return e + s;
    throw new Error(`Unsupported action: ${t}`);
  }
  let i = e;
  for (let r = 0; r < n.length - 1; r++) i = i[n[r]];
  const o = n[n.length - 1];
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
  return e;
}
function nn(e, n = {}) {
  const t = {
    close: () => {
      console.warn("Method not implemented.");
    },
    onerror: null,
    onmessage: null,
    onopen: null,
    readyState: 0,
    url: e.toString(),
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
    Xt(e, n)
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
function sn(e, n = {}, t, s, i) {
  var o;
  try {
    let r = function ($) {
        (i || We[$.type]) && f($);
      },
      a = function () {
        for (Ze = !0; se.length > 0; ) se.shift()({ value: void 0, done: !0 });
      },
      c = function ($) {
        se.length > 0 ? se.shift()($) : de.push($);
      },
      w = function ($) {
        c(on($)), a();
      },
      f = function ($) {
        c({ value: $, done: !1 });
      },
      u = function () {
        return de.length > 0
          ? Promise.resolve(de.shift())
          : new Promise(($) => se.push($));
      };
    const { hf_token: _ } = this.options,
      {
        fetch: k,
        app_reference: z,
        config: d,
        session_hash: v,
        api_info: C,
        api_map: q,
        stream_status: X,
        pending_stream_messages: Y,
        pending_diff_streams: l,
        event_callbacks: g,
        unclosed_events: b,
        post_data: p,
        options: L,
        api_prefix: x,
      } = this,
      U = this;
    if (!C) throw new Error("No API found");
    if (!d) throw new Error("Could not resolve app config");
    let { fn_index: h, endpoint_info: Q, dependency: H } = rn(C, e, q, d),
      te = Ot(n, Q),
      N,
      F,
      R = d.protocol ?? "ws",
      ne = "",
      K = () => ne;
    const y = typeof e == "number" ? "/predict" : e;
    let j,
      S = null,
      M = !1,
      le = {},
      V =
        typeof window < "u" && typeof document < "u"
          ? new URLSearchParams(window.location.search).toString()
          : "";
    const We =
      ((o = L?.events) == null
        ? void 0
        : o.reduce(($, J) => (($[J] = !0), $), {})) || {};
    async function He() {
      let $ = {},
        J = {};
      R === "ws"
        ? (N && N.readyState === 0
            ? N.addEventListener("open", () => {
                N.close();
              })
            : N.close(),
          ($ = { fn_index: h, session_hash: v }))
        : (($ = { event_id: S }),
          (J = { event_id: S, session_hash: v, fn_index: h }));
      try {
        if (!d) throw new Error("Could not resolve app config");
        "event_id" in J &&
          (await k(`${d.root}${x}/${pt}`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(J),
          })),
          await k(`${d.root}${x}/${ut}`, {
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
    const Ge = async ($) => {
      await this._resolve_heartbeat($);
    };
    async function $e($) {
      if (!d) return;
      let J = $.render_id;
      (d.components = [
        ...d.components.filter((D) => D.props.rendered_in !== J),
        ...$.components,
      ]),
        (d.dependencies = [
          ...d.dependencies.filter((D) => D.rendered_in !== J),
          ...$.dependencies,
        ]);
      const ue = d.components.some((D) => D.type === "state"),
        O = d.dependencies.some((D) =>
          D.targets.some((A) => A[1] === "unload")
        );
      (d.connect_heartbeat = ue || O),
        await Ge(d),
        r({ type: "render", data: $, endpoint: y, fn_index: h });
    }
    this.handle_blob(d.root, te, Q).then(async ($) => {
      var J;
      if (
        ((j = {
          data: oe($, H, d.components, "input", !0) || [],
          event_data: t,
          fn_index: h,
          trigger_id: s,
        }),
        qt(h, d))
      )
        r({
          type: "status",
          endpoint: y,
          stage: "pending",
          queue: !1,
          fn_index: h,
          time: new Date(),
        }),
          p(
            `${d.root}${x}/run${y.startsWith("/") ? y : `/${y}`}${
              V ? "?" + V : ""
            }`,
            { ...j, session_hash: v }
          )
            .then(([O, D]) => {
              const A = O.data;
              D == 200
                ? (r({
                    type: "data",
                    endpoint: y,
                    fn_index: h,
                    data: oe(A, H, d.components, "output", L.with_null_state),
                    time: new Date(),
                    event_data: t,
                    trigger_id: s,
                  }),
                  O.render_config && $e(O.render_config),
                  r({
                    type: "status",
                    endpoint: y,
                    fn_index: h,
                    stage: "complete",
                    eta: O.average_duration,
                    queue: !1,
                    time: new Date(),
                  }))
                : r({
                    type: "status",
                    stage: "error",
                    endpoint: y,
                    fn_index: h,
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
                endpoint: y,
                fn_index: h,
                queue: !1,
                time: new Date(),
              });
            });
      else if (R == "ws") {
        const { ws_protocol: O, host: D } = await ce(z, _);
        r({
          type: "status",
          stage: "pending",
          queue: !0,
          endpoint: y,
          fn_index: h,
          time: new Date(),
        });
        let A = new URL(
          `${O}://${$t(D, d.root, !0)}/queue/join${V ? "?" + V : ""}`
        );
        this.jwt && A.searchParams.set("__sign", this.jwt),
          (N = new WebSocket(A)),
          (N.onclose = (I) => {
            I.wasClean ||
              r({
                type: "status",
                stage: "error",
                broken: !0,
                message: ee,
                queue: !0,
                endpoint: y,
                fn_index: h,
                time: new Date(),
              });
          }),
          (N.onmessage = function (I) {
            const B = JSON.parse(I.data),
              { type: T, status: P, data: E } = fe(B, le[h]);
            if (T === "update" && P && !M)
              r({
                type: "status",
                endpoint: y,
                fn_index: h,
                time: new Date(),
                ...P,
              }),
                P.stage === "error" && N.close();
            else if (T === "hash") {
              N.send(JSON.stringify({ fn_index: h, session_hash: v }));
              return;
            } else
              T === "data"
                ? N.send(JSON.stringify({ ...j, session_hash: v }))
                : T === "complete"
                ? (M = P)
                : T === "log"
                ? r({
                    type: "log",
                    title: E.title,
                    log: E.log,
                    level: E.level,
                    endpoint: y,
                    duration: E.duration,
                    visible: E.visible,
                    fn_index: h,
                  })
                : T === "generating" &&
                  r({
                    type: "status",
                    time: new Date(),
                    ...P,
                    stage: P?.stage,
                    queue: !0,
                    endpoint: y,
                    fn_index: h,
                  });
            E &&
              (r({
                type: "data",
                time: new Date(),
                data: oe(E.data, H, d.components, "output", L.with_null_state),
                endpoint: y,
                fn_index: h,
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
                  endpoint: y,
                  fn_index: h,
                }),
                N.close()));
          }),
          Ae(d.version || "2.0.0", "3.6") < 0 &&
            addEventListener("open", () => N.send(JSON.stringify({ hash: v })));
      } else if (R == "sse") {
        r({
          type: "status",
          stage: "pending",
          queue: !0,
          endpoint: y,
          fn_index: h,
          time: new Date(),
        });
        var ue = new URLSearchParams({
          fn_index: h.toString(),
          session_hash: v,
        }).toString();
        let O = new URL(`${d.root}${x}/${Ie}?${V ? V + "&" : ""}${ue}`);
        if (
          (this.jwt && O.searchParams.set("__sign", this.jwt),
          (F = this.stream(O)),
          !F)
        )
          return Promise.reject(
            new Error("Cannot connect to SSE endpoint: " + O.toString())
          );
        F.onmessage = async function (D) {
          const A = JSON.parse(D.data),
            { type: I, status: B, data: T } = fe(A, le[h]);
          if (I === "update" && B && !M)
            r({
              type: "status",
              endpoint: y,
              fn_index: h,
              time: new Date(),
              ...B,
            }),
              B.stage === "error" && (F?.close(), a());
          else if (I === "data") {
            let [P, E] = await p(`${d.root}${x}/queue/data`, {
              ...j,
              session_hash: v,
              event_id: S,
            });
            E !== 200 &&
              (r({
                type: "status",
                stage: "error",
                message: ee,
                queue: !0,
                endpoint: y,
                fn_index: h,
                time: new Date(),
              }),
              F?.close(),
              a());
          } else
            I === "complete"
              ? (M = B)
              : I === "log"
              ? r({
                  type: "log",
                  title: T.title,
                  log: T.log,
                  level: T.level,
                  endpoint: y,
                  duration: T.duration,
                  visible: T.visible,
                  fn_index: h,
                })
              : (I === "generating" || I === "streaming") &&
                r({
                  type: "status",
                  time: new Date(),
                  ...B,
                  stage: B?.stage,
                  queue: !0,
                  endpoint: y,
                  fn_index: h,
                });
          T &&
            (r({
              type: "data",
              time: new Date(),
              data: oe(T.data, H, d.components, "output", L.with_null_state),
              endpoint: y,
              fn_index: h,
              event_data: t,
              trigger_id: s,
            }),
            M &&
              (r({
                type: "status",
                time: new Date(),
                ...M,
                stage: B?.stage,
                queue: !0,
                endpoint: y,
                fn_index: h,
              }),
              F?.close(),
              a()));
        };
      } else if (
        R == "sse_v1" ||
        R == "sse_v2" ||
        R == "sse_v2.1" ||
        R == "sse_v3"
      ) {
        r({
          type: "status",
          stage: "pending",
          queue: !0,
          endpoint: y,
          fn_index: h,
          time: new Date(),
        });
        let O = "";
        typeof window < "u" &&
          typeof document < "u" &&
          (O = (J = window?.location) == null ? void 0 : J.hostname);
        const D = O.includes(".dev.")
          ? `https://moon-${O.split(".")[1]}.dev.spaces.huggingface.tech`
          : "https://huggingface.co";
        (typeof window < "u" &&
        typeof document < "u" &&
        window.parent != window &&
        window.supports_zerogpu_headers
          ? At("zerogpu-headers", D)
          : Promise.resolve(null)
        )
          .then((A) =>
            p(`${d.root}${x}/${it}?${V}`, { ...j, session_hash: v }, A)
          )
          .then(async ([A, I]) => {
            if (I === 503)
              r({
                type: "status",
                stage: "error",
                message: Be,
                queue: !0,
                endpoint: y,
                fn_index: h,
                time: new Date(),
              });
            else if (I === 422)
              r({
                type: "status",
                stage: "error",
                message: A.detail,
                queue: !0,
                endpoint: y,
                fn_index: h,
                code: "validation_error",
                time: new Date(),
              }),
                a();
            else if (I !== 200)
              r({
                type: "status",
                stage: "error",
                broken: !1,
                message: A.detail,
                queue: !0,
                endpoint: y,
                fn_index: h,
                time: new Date(),
              });
            else {
              (S = A.event_id), (ne = S);
              let B = async function (T) {
                try {
                  const {
                    type: P,
                    status: E,
                    data: W,
                    original_msg: Ke,
                  } = fe(T, le[h]);
                  if (P == "heartbeat") return;
                  if (P === "update" && E && !M)
                    r({
                      type: "status",
                      endpoint: y,
                      fn_index: h,
                      time: new Date(),
                      original_msg: Ke,
                      ...E,
                    });
                  else if (P === "complete") M = E;
                  else if (
                    P == "unexpected_error" ||
                    P == "broken_connection"
                  ) {
                    console.error("Unexpected error", E?.message);
                    const Ve = P === "broken_connection";
                    r({
                      type: "status",
                      stage: "error",
                      message: E?.message || "An Unexpected Error Occurred!",
                      queue: !0,
                      endpoint: y,
                      broken: Ve,
                      session_not_found: E?.session_not_found,
                      fn_index: h,
                      time: new Date(),
                    });
                  } else if (P === "log") {
                    r({
                      type: "log",
                      title: W.title,
                      log: W.log,
                      level: W.level,
                      endpoint: y,
                      duration: W.duration,
                      visible: W.visible,
                      fn_index: h,
                    });
                    return;
                  } else
                    (P === "generating" || P === "streaming") &&
                      (r({
                        type: "status",
                        time: new Date(),
                        ...E,
                        stage: E?.stage,
                        queue: !0,
                        endpoint: y,
                        fn_index: h,
                      }),
                      W &&
                        H.connection !== "stream" &&
                        ["sse_v2", "sse_v2.1", "sse_v3"].includes(R) &&
                        Qt(l, S, W));
                  W &&
                    (r({
                      type: "data",
                      time: new Date(),
                      data: oe(
                        W.data,
                        H,
                        d.components,
                        "output",
                        L.with_null_state
                      ),
                      endpoint: y,
                      fn_index: h,
                    }),
                    W.render_config && (await $e(W.render_config)),
                    M &&
                      (r({
                        type: "status",
                        time: new Date(),
                        ...M,
                        stage: E?.stage,
                        queue: !0,
                        endpoint: y,
                        fn_index: h,
                      }),
                      a())),
                    (E?.stage === "complete" || E?.stage === "error") &&
                      (g[S] && delete g[S], S in l && delete l[S]);
                } catch (P) {
                  console.error("Unexpected client exception", P),
                    r({
                      type: "status",
                      stage: "error",
                      message: "An Unexpected Error Occurred!",
                      queue: !0,
                      endpoint: y,
                      fn_index: h,
                      time: new Date(),
                    }),
                    ["sse_v2", "sse_v2.1", "sse_v3"].includes(R) &&
                      (be(X, U.abort_controller), (X.open = !1), a());
                }
              };
              S in Y && (Y[S].forEach((T) => B(T)), delete Y[S]),
                (g[S] = B),
                b.add(S),
                X.open || (await this.open_stream());
            }
          });
      }
    });
    let Ze = !1;
    const de = [],
      se = [],
      Ee = {
        [Symbol.asyncIterator]: () => Ee,
        next: u,
        throw: async ($) => (w($), u()),
        return: async () => (a(), u()),
        cancel: He,
        event_id: K,
      };
    return Ee;
  } catch (r) {
    throw (console.error("Submit function encountered an error:", r), r);
  }
}
function on(e) {
  return { then: (n, t) => t(e) };
}
function rn(e, n, t, s) {
  let i, o, r;
  if (typeof n == "number")
    (i = n),
      (o = e.unnamed_endpoints[i]),
      (r = s.dependencies.find((a) => a.id == n));
  else {
    const a = n.replace(/^\//, "");
    (i = t[a]),
      (o = e.named_endpoints[n.trim()]),
      (r = s.dependencies.find((c) => c.id == t[a]));
  }
  if (typeof i != "number")
    throw new Error(
      "There is no endpoint matching that name of fn_index matching that number."
    );
  return { fn_index: i, endpoint_info: o, dependency: r };
}
class _e {
  constructor(n, t = { events: ["data"] }) {
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
    (this.app_reference = n),
      (this.deep_link =
        ((s = t.query_params) == null ? void 0 : s.deep_link) || null),
      t.events || (t.events = ["data"]),
      (this.options = t),
      (this.current_payload = {}),
      (this.view_api = Tt.bind(this)),
      (this.upload_files = Nt.bind(this)),
      (this.handle_blob = It.bind(this)),
      (this.post_data = zt.bind(this)),
      (this.submit = sn.bind(this)),
      (this.predict = Ut.bind(this)),
      (this.open_stream = Yt.bind(this)),
      (this.resolve_config = kt.bind(this)),
      (this.resolve_cookies = xt.bind(this)),
      (this.upload = Ct.bind(this)),
      (this.fetch = this.fetch.bind(this)),
      (this.handle_space_success = this.handle_space_success.bind(this)),
      (this.stream = this.stream.bind(this));
  }
  get_url_config(n = null) {
    if (!this.config) throw new Error(Z);
    n === null && (n = window.location.href);
    const t = (r) => r.replace(/^\/+|\/+$/g, "");
    let s = t(new URL(this.config.root).pathname),
      i = t(new URL(n).pathname),
      o;
    return (
      i.startsWith(s) ? (o = t(i.substring(s.length))) : (o = ""),
      this.get_page_config(o)
    );
  }
  get_page_config(n) {
    if (!this.config) throw new Error(Z);
    let t = this.config;
    return (
      n in t.page || (n = ""),
      {
        ...t,
        current_page: n,
        layout: t.page[n].layout,
        components: t.components.filter((s) =>
          t.page[n].components.includes(s.id)
        ),
        dependencies: this.config.dependencies.filter((s) =>
          t.page[n].dependencies.includes(s.id)
        ),
      }
    );
  }
  fetch(n, t) {
    const s = new Headers(t?.headers || {});
    if (
      (this && this.cookies && s.append("Cookie", this.cookies),
      this && this.options.headers)
    )
      for (const i in this.options.headers)
        s.append(i, this.options.headers[i]);
    return fetch(n, { ...t, headers: s });
  }
  stream(n) {
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
      (this.stream_instance = nn(n.toString(), {
        credentials: "include",
        headers: t,
        signal: this.abort_controller.signal,
      })),
      this.stream_instance
    );
  }
  async init() {
    var n;
    this.options.auth && (await this.resolve_cookies()),
      await this._resolve_config().then(({ config: t }) =>
        this._resolve_heartbeat(t)
      ),
      (this.api_info = await this.view_api()),
      (this.api_map = Et(
        ((n = this.config) == null ? void 0 : n.dependencies) || []
      ));
  }
  async _resolve_heartbeat(n) {
    if (
      (n &&
        ((this.config = n),
        (this.api_prefix = n.api_prefix || ""),
        this.config &&
          this.config.connect_heartbeat &&
          this.config.space_id &&
          this.options.hf_token &&
          (this.jwt = await Le(
            this.config.space_id,
            this.options.hf_token,
            this.cookies
          ))),
      n.space_id &&
        this.options.hf_token &&
        (this.jwt = await Le(n.space_id, this.options.hf_token)),
      this.config && this.config.connect_heartbeat)
    ) {
      const t = new URL(
        `${this.config.root}${this.api_prefix}/${lt}/${this.session_hash}`
      );
      this.jwt && t.searchParams.set("__sign", this.jwt),
        this.heartbeat_event || (this.heartbeat_event = this.stream(t));
    }
  }
  static async connect(n, t = { events: ["data"] }) {
    const s = new this(n, t);
    return (
      t.session_hash && (s.session_hash = t.session_hash), await s.init(), s
    );
  }
  async reconnect() {
    const n = new URL(`${this.config.root}${this.api_prefix}/${ht}`);
    let t;
    try {
      const s = await this.fetch(n);
      if (!s.ok) throw new Error();
      t = (await s.json()).app_id;
    } catch {
      return "broken";
    }
    return t !== this.config.app_id ? "changed" : "connected";
  }
  close() {
    (this.closed = !0), be(this.stream_status, this.abort_controller);
  }
  set_current_payload(n) {
    this.current_payload = n;
  }
  static async duplicate(n, t = { events: ["data"] }) {
    return Wt(n, t);
  }
  async _resolve_config() {
    const {
        http_protocol: n,
        host: t,
        space_id: s,
      } = await ce(this.app_reference, this.options.hf_token),
      { status_callback: i } = this.options;
    s && i && (await Je(s, i));
    let o;
    try {
      let r = `${n}//${t}`;
      if (((o = await this.resolve_config(r)), !o)) throw new Error(Z);
      return this.config_success(o);
    } catch (r) {
      if (s && i)
        re(
          s,
          ye.test(s) ? "space_name" : "subdomain",
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
  async config_success(n) {
    if (
      ((this.config = n),
      (this.api_prefix = n.api_prefix || ""),
      this.config.auth_required)
    )
      return this.prepare_return_obj();
    try {
      this.api_info = await this.view_api();
    } catch (t) {
      console.error(mt + t.message);
    }
    return this.prepare_return_obj();
  }
  async handle_space_success(n) {
    var t;
    if (!this) throw new Error(Z);
    const { status_callback: s } = this.options;
    if ((s && s(n), n.status === "running"))
      try {
        if (
          ((this.config = await this._resolve_config()),
          (this.api_prefix =
            ((t = this == null ? void 0 : this.config) == null
              ? void 0
              : t.api_prefix) || ""),
          !this.config)
        )
          throw new Error(Z);
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
  async component_server(n, t, s) {
    var i;
    if (!this.config) throw new Error(Z);
    const o = {},
      { hf_token: r } = this.options,
      { session_hash: a } = this;
    r && (o.Authorization = `Bearer ${this.options.hf_token}`);
    let c,
      w = this.config.components.find((u) => u.id === n);
    (i = w?.props) != null && i.root_url
      ? (c = w.props.root_url)
      : (c = this.config.root);
    let f;
    if ("binary" in s) {
      f = new FormData();
      for (const u in s.data) u !== "binary" && f.append(u, s.data[u]);
      f.set("component_id", n.toString()),
        f.set("fn_name", t),
        f.set("session_hash", a);
    } else
      (f = JSON.stringify({
        data: s,
        component_id: n,
        fn_name: t,
        session_hash: a,
      })),
        (o["Content-Type"] = "application/json");
    r && (o.Authorization = `Bearer ${r}`);
    try {
      const u = await this.fetch(`${c}${this.api_prefix}/${dt}/`, {
        method: "POST",
        body: f,
        headers: o,
        credentials: "include",
      });
      if (!u.ok)
        throw new Error(
          "Could not connect to component server: " + u.statusText
        );
      return await u.json();
    } catch (u) {
      console.warn(u);
    }
  }
  set_cookies(n) {
    this.cookies = Fe(n).join("; ");
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
  async connect_ws(n) {
    return new Promise((t, s) => {
      let i;
      try {
        i = new WebSocket(n);
      } catch {
        this.ws_map[n] = "failed";
        return;
      }
      (this.ws_map[n] = "pending"),
        (i.onopen = () => {
          (this.ws_map[n] = i), t();
        }),
        (i.onerror = (o) => {
          console.error("WebSocket error:", o),
            this.close_ws(n),
            (this.ws_map[n] = "failed"),
            t();
        }),
        (i.onclose = () => {
          this.ws_map[n] = "closed";
        }),
        (i.onmessage = (o) => {});
    });
  }
  async send_ws_message(n, t) {
    if (!(n in this.ws_map)) await this.connect_ws(n);
    else if (
      this.ws_map[n] === "pending" ||
      this.ws_map[n] === "closed" ||
      this.ws_map[n] === "failed"
    )
      return;
    const s = this.ws_map[n];
    s instanceof WebSocket ? s.send(JSON.stringify(t)) : this.post_data(n, t);
  }
  async close_ws(n) {
    if (n in this.ws_map) {
      const t = this.ws_map[n];
      t instanceof WebSocket && (t.close(), delete this.ws_map[n]);
    }
  }
}
const Ce = "Mostafa-XS1/Flower_Identifier",
  an = "/predict",
  cn = (e) =>
    `https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunflower_sky_backdrop.jpg/250px-${encodeURIComponent(
      e
    )}.jpg`;
document.addEventListener("DOMContentLoaded", () => {
  const e = document.getElementById("plantName"),
    n = document.getElementById("identifyBtn"),
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
  function w(l = "Identifying…") {
    c(
      `<div style="font-weight:600">${a(
        l
      )}</div><div style="margin-top:8px">🔄 <em>Waiting for model...</em></div>`
    );
  }
  function f(l) {
    c(`<div style="color:crimson"><strong>Error:</strong> ${a(l)}</div>`);
  }
  function u(l) {
    try {
      if (Array.isArray(l)) {
        if (l.length === 0) return "<div>No results</div>";
        const g = l[0];
        return g &&
          typeof g == "object" &&
          ("label" in g || "name" in g || "class" in g)
          ? `<ul style="padding-left:18px">${l
              .map((p) => {
                const L = p.label ?? p.name ?? p.class ?? JSON.stringify(p),
                  x = p.score ?? p.probability ?? p.confidence ?? null;
                return `<li><strong>${a(L)}</strong>${
                  x != null ? ` — ${(x * 100).toFixed(1)}%` : ""
                }</li>`;
              })
              .join("")}</ul>`
          : `<ol style="padding-left:18px">${l
              .map((p) => `<li>${a(String(p))}</li>`)
              .join("")}</ol>`;
      } else if (typeof l == "object" && l !== null) {
        if ("label" in l || "score" in l) {
          const p = l.label ?? l.name ?? JSON.stringify(l),
            L = l.score ?? l.probability ?? l.confidence ?? null;
          return `<div><strong>${a(p)}</strong>${
            L != null ? ` — ${(L * 100).toFixed(1)}%` : ""
          }</div>`;
        }
        return `<ul style="padding-left:18px">${Object.keys(l)
          .map(
            (p) =>
              `<li><strong>${a(p)}</strong>: ${a(JSON.stringify(l[p]))}</li>`
          )
          .join("")}</ul>`;
      } else return `<div>${a(String(l))}</div>`;
    } catch {
      return `<pre>${a(JSON.stringify(l, null, 2))}</pre>`;
    }
  }
  const _ = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
  function k(l) {
    const g = l
        .split(/\n-{3,}\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      b = [];
    for (const p of g) {
      const x =
        p
          .split(/\n/)
          .map((j) => j.trim())
          .filter(Boolean)[0] || "";
      let U = "",
        h = null,
        Q = null,
        H = null;
      const te = x.match(/#{2,3}\s*([^\(]+?)\s*\((\d+(?:\.\d+)?)%\)/i);
      if (te) {
        (U = te[1].trim()), (h = parseFloat(te[2]));
        const j = x.match(/\*\*\[([^\]]+)\]\((https?:\/\/[^\)]+)\)\*\*/);
        if (j) (Q = j[1]), (H = j[2]);
        else {
          const S = x.match(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/);
          S && ((Q = S[1]), (H = S[2]));
        }
      } else {
        const j = x.match(/^(.+?)\s*\((\d+(?:\.\d+)?)%\)/);
        j
          ? ((U = j[1].trim()), (h = parseFloat(j[2])))
          : (U = x.split(/\s+/)[0] || x);
      }
      let N = null;
      const F = p.match(/\*\*Blooming Period:\*\*\s*([^*]+)/i);
      F && (N = F[1].trim());
      let R = [];
      const ne = p.match(/\*\*Likely Locations:\*\*\s*([\s\S]+)/i);
      if (ne) {
        const j = ne[1];
        let S;
        for (; (S = _.exec(j)) !== null; ) R.push({ text: S[1], url: S[2] });
      } else {
        let j;
        for (; (j = _.exec(p)) !== null; ) R.push({ text: j[1], url: j[2] });
      }
      let K = p.replace(x, "").trim();
      (K = K.replace(/\*\*Blooming Period:\*\*[\s\S]*/i, "")
        .replace(/\*\*Likely Locations:\*\*[\s\S]*/i, "")
        .trim()),
        (K = K.replace(/\*\*\[[^\]]+\]\([^\)]+\)\*\*/, "").trim());
      const y = K.replace(/\n+/g, " ").trim().slice(0, 600);
      b.push({
        title: U || "",
        confidence: h,
        wikiText: Q,
        wikiUrl: H,
        description: y,
        bloom: N,
        locations: R,
      });
    }
    return b;
  }
  function z(l) {
    return !l || l.length === 0
      ? "<div>No predictions</div>"
      : l
          .map((g) => {
            const b =
                g.confidence != null
                  ? `<span style="font-weight:700; color:#2e7d32; margin-left:8px">${g.confidence.toFixed(
                      2
                    )}%</span>`
                  : "",
              p = g.wikiUrl
                ? `<a href="${a(g.wikiUrl)}" target="_blank" rel="noopener">${a(
                    g.title
                  )}</a>`
                : a(g.title),
              L = g.description
                ? `<p style="margin-top:8px;color:#333">${a(g.description)}</p>`
                : "",
              x = g.bloom
                ? `<div style="margin-top:8px"><strong>Blooming Period:</strong> ${a(
                    g.bloom
                  )}</div>`
                : "",
              U =
                g.locations && g.locations.length
                  ? `<div style="margin-top:8px"><strong>Likely Locations:</strong> ${g.locations
                      .map(
                        (h) =>
                          `<a href="${a(
                            h.url
                          )}" target="_blank" rel="noopener">${a(h.text)}</a>`
                      )
                      .join(" · ")}</div>`
                  : "";
            return `
        <div style="padding:12px;border-radius:10px;border:1px solid #e6f7f2;background:#fff;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="font-size:16px;font-weight:700;color:#1e6a70">${p}${b}</div>
          </div>
          ${L}
          ${x}
          ${U}
        </div>
      `;
          })
          .join("");
  }
  const d = _e
    .connect(Ce)
    .catch(
      (l) => (
        console.warn("Gradio client connect failed:", l), Promise.reject(l)
      )
    );
  async function v(l) {
    w();
    try {
      const b = await (await d).predict(an, { image: l }),
        p = b?.data ?? b;
      if (typeof p == "string") {
        const U = k(p);
        c(
          `<div style="font-weight:700;margin-bottom:8px">Result</div>${z(
            U
          )}<details style="margin-top:12px"><summary>Raw output</summary><pre style="white-space:pre-wrap">${a(
            p
          )}</pre></details>`
        );
        return;
      }
      if (Array.isArray(p) && p.length === 1 && typeof p[0] == "string") {
        const U = k(p[0]);
        c(
          `<div style="font-weight:700;margin-bottom:8px">Result</div>${z(
            U
          )}<details style="margin-top:12px"><summary>Raw output</summary><pre style="white-space:pre-wrap">${a(
            p[0]
          )}</pre></details>`
        );
        return;
      }
      const L = u(p),
        x = `<details style="margin-top:12px"><summary>Raw JSON</summary><pre style="white-space:pre-wrap">${a(
          JSON.stringify(b, null, 2)
        )}</pre></details>`;
      c(`<div style="font-weight:700;margin-bottom:8px">Result</div>${L}${x}`);
    } catch (g) {
      console.error(g), f(g?.message ?? String(g));
    }
  }
  function C(l, g) {
    const b = URL.createObjectURL(l);
    c(`<div>
                <div style="font-weight:700;margin-bottom:8px">Preview</div>
                <img src="${b}" alt="preview" style="max-width:320px;border-radius:8px;display:block;margin-bottom:12px"/>
                <div style="margin-bottom:12px"><small>${a(
                  g ?? "uploaded image"
                )}</small></div>
              </div>`);
    const p = new File([l], g ?? "image.jpg", { type: l.type || "image/jpeg" });
    v(p);
  }
  async function q() {
    const l = e.value?.trim();
    if (!l) {
      f("Please type a plant name first.");
      return;
    }
    const g = encodeURIComponent(l),
      b = cn(l);
    w(`Fetching image for "${l}"…`);
    try {
      const p = await fetch(b);
      if (!p.ok)
        throw new Error(`Image fetch failed (${p.status}) for URL: ${b}`);
      const L = await p.blob();
      C(L, `250px-${g}.jpg`);
    } catch (p) {
      console.error(p),
        f(`Couldn't fetch image for "${l}". (${p?.message ?? ""})`);
    }
  }
  function X() {
    (o.innerHTML = ""), (e.value = ""), (r.textContent = "No file chosen");
  }
  function Y(l) {
    l && ((r.textContent = l.name), C(l, l.name));
  }
  (function () {
    function g(b) {
      b.preventDefault(), b.stopPropagation();
    }
    ["dragenter", "dragover", "dragleave", "drop"].forEach((b) => {
      i.addEventListener(b, g, !1), document.addEventListener(b, g, !1);
    }),
      i.addEventListener("dragover", () => i.classList.add("dragover")),
      i.addEventListener("dragleave", () => i.classList.remove("dragover")),
      i.addEventListener("drop", (b) => {
        i.classList.remove("dragover");
        const p = b.dataTransfer;
        if (!p) return;
        const L = p.files;
        if (!L || L.length === 0) {
          f("No file detected in dropped item.");
          return;
        }
        const x = L[0];
        Y(x);
      }),
      i.addEventListener("click", () => s.click()),
      i.addEventListener("keydown", (b) => {
        (b.key === "Enter" || b.key === " ") && s.click();
      });
  })(),
    n.addEventListener("click", () => q()),
    e.addEventListener("keydown", (l) => {
      l.key === "Enter" && (l.preventDefault(), q());
    }),
    t.addEventListener("click", () => X()),
    s.addEventListener("change", (l) => {
      const g = l.target.files?.[0];
      g && Y(g), (l.target.value = "");
    }),
    (window.openModal = () => {
      document.getElementById("howModal").style.display = "flex";
    }),
    (window.closeModal = () => {
      document.getElementById("howModal").style.display = "none";
    }),
    document.getElementById("contactBtn").addEventListener("click", () => {
      alert("Contact us at bloomshift@example.com (placeholder)");
    }),
    (async function () {
      try {
        await d, console.log("Gradio client connected to", Ce);
      } catch (g) {
        console.warn("Could not connect to Gradio client:", g?.message ?? g);
      }
    })(),
    (window.handleTextInput = q),
    (window.clearResult = X);
});
