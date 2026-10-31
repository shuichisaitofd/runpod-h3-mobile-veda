/* H3 Veda test: 10Eros-Max INT8 switch. Adds a small "10Eros" button with download + ON/OFF.
   When ON, the I2V workflow's model file name is swapped in the browser right after it is fetched. */
(function () {
  'use strict';
  var KEY = 'h3eros_state_v1';
  var FILE = '10Eros_Max_H3_FL2VA-INT8-ConvRot.safetensors';
  var UNET_ID = '105:6';
  var st = { on: true };
  var info = null; // { status, downloaded, total, error } from the pod, or null
  var pill, panel, timer = null;
  try { var s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s) st.on = !!s.on; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function api(path) { return typeof window.apiUrl === 'function' ? window.apiUrl(path) : path; }

  window.h3ErosApply = function (wf) {
    if (!st.on || !wf || !installed()) return wf;
    var n = wf[UNET_ID];
    if (!n || n.class_type !== 'UNETLoader') {
      Object.keys(wf).forEach(function (k) { if (wf[k] && wf[k].class_type === 'UNETLoader') n = wf[k]; });
    }
    if (n && n.inputs) n.inputs.unet_name = FILE;
    return wf;
  };

  var prevFetch = window.fetch.bind(window);
  window.fetch = async function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    if (/\/h3-mobile\/api\/workflow\/i2v(?:[?#]|$)/.test(url)) {
      var res = await prevFetch(input, init);
      if (!res.ok || !st.on) return res;
      try {
        var wf = window.h3ErosApply(await res.clone().json());
        return new Response(JSON.stringify(wf), { status: res.status, statusText: res.statusText, headers: res.headers });
      } catch (e) { return res; }
    }
    return prevFetch(input, init);
  };

  function gb(n) { return (n / 1073741824).toFixed(1); }
  function label() { return !st.on ? '10Eros OFF' : (info && !installed() ? '10Eros 未導入' : '10Eros ON'); }
  function installed() { return info && info.status === 'installed'; }

  function refresh() {
    prevFetch(api('/h3-mobile/api/eros/status')).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      info = j; render();
      var busy = j && (j.status === 'downloading' || j.status === 'verifying' || j.status === 'queued');
      clearTimeout(timer);
      if (busy && panel && panel.style.display !== 'none') timer = setTimeout(refresh, 3000);
    }).catch(function () { info = null; render(); });
  }

  function css() {
    var s = document.createElement('style');
    s.textContent = '#erosPill{position:fixed;right:130px;bottom:76px;z-index:99999;padding:10px 14px;border-radius:22px;border:0;font:600 14px/1 system-ui,sans-serif;color:#fff;background:#555;box-shadow:0 2px 8px rgba(0,0,0,.4)}#erosPill.on{background:#8a4fd6}' +
      '#erosPanel{position:fixed;right:10px;bottom:128px;z-index:99999;width:min(320px,calc(100vw - 20px));padding:14px;border-radius:14px;background:#1c1c1e;color:#fff;font:14px/1.5 system-ui,sans-serif;box-shadow:0 4px 18px rgba(0,0,0,.6);display:none;max-height:calc(100vh - 150px);overflow-y:auto}' +
      '#erosPanel h3{margin:0 0 8px;font-size:15px}#erosPanel .row{display:flex;gap:8px;align-items:center;margin:8px 0}' +
      '#erosPanel button{padding:10px 12px;border-radius:10px;border:1px solid #666;background:#2c2c2e;color:#fff;font-size:14px}#erosPanel button.sel{background:#8a4fd6;border-color:#8a4fd6}#erosPanel button:disabled{opacity:.4}' +
      '#erosPanel .note{font-size:12px;color:#bbb}#erosPanel .warn{font-size:13px;color:#ffb4a8}#erosPanel .bar{height:8px;border-radius:4px;background:#444;overflow:hidden}#erosPanel .bar>div{height:100%;background:#8a4fd6}';
    document.head.appendChild(s);
  }

  function render() {
    if (!pill) return;
    pill.textContent = label(); pill.className = st.on ? 'on' : '';
    if (panel.style.display === 'none') return;
    var stat = info ? info.status : null, body;
    if (!info) body = '<div class="warn">Pod の状態を確認できません。Pod が起動してから開いてください。</div>';
    else if (stat === 'installed') body = '<div>状態: <b>導入済み</b></div>';
    else if (stat === 'downloading' || stat === 'queued' || stat === 'verifying') {
      var pct = info.total ? Math.min(100, Math.round(info.downloaded / info.total * 100)) : 0;
      body = '<div>状態: <b>' + (stat === 'verifying' ? '確認中…(数分かかります)' : 'ダウンロード中 ' + pct + '%') + '</b></div><div class="bar"><div style="width:' + (stat === 'verifying' ? 100 : pct) + '%"></div></div><div class="note">' + gb(info.downloaded) + ' / ' + gb(info.total || 0) + ' GB。この画面を開いたままで大丈夫です。</div>';
    } else {
      body = '<div>状態: <b>未導入</b>(約21GB、起動時に自動で始まります)</div>' + (stat === 'error' ? '<div class="warn">失敗: ' + String(info.error || '').replace(/</g, '&lt;') + '</div>' : '') +
        '<div class="row"><button id="eDl">10Eros-Max INT8 をダウンロード</button></div>';
    }
    panel.innerHTML = '<h3>10Eros-Max INT8(画像から動画のみ)</h3>' + body +
      '<div class="row"><button id="eOff" class="' + (st.on ? '' : 'sel') + '">OFF(通常モデル)</button><button id="eOn" class="' + (st.on ? 'sel' : '') + '"' + (installed() ? '' : ' disabled') + '>ON(10Eros)</button></div>' +
      '<div class="note">Podの起動時に、10Eros-Maxを自動でダウンロードします。ONの間は10Eros-Maxで作ります(Vedaの設定もそのまま使えます)。このイメージには通常のH3の本体モデルを入れていないので、OFFにすると生成できません。</div>';
    var dl = panel.querySelector('#eDl');
    if (dl) dl.onclick = function () {
      dl.disabled = true;
      prevFetch(api('/h3-mobile/api/eros/prepare'), { method: 'POST' }).then(function () { refresh(); }).catch(function () { refresh(); });
    };
    panel.querySelector('#eOff').onclick = function () { st.on = false; save(); render(); };
    panel.querySelector('#eOn').onclick = function () { if (installed()) { st.on = true; save(); render(); } };
  }

  function init() {
    css();
    pill = document.createElement('button'); pill.id = 'erosPill'; pill.type = 'button';
    panel = document.createElement('div'); panel.id = 'erosPanel'; panel.style.display = 'none';
    pill.onclick = function () { panel.style.display = panel.style.display === 'none' ? 'block' : 'none'; if (panel.style.display !== 'none') refresh(); render(); };
    document.body.appendChild(panel); document.body.appendChild(pill);
    render(); refresh();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
