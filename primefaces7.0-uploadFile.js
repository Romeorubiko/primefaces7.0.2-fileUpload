(function (a) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], a)
    } else {
        if (typeof exports === "object") {
            a(require("jquery"))
        } else {
            a(window.jQuery)
        }
    }
}(function (c) {
    var a = 0, d = c, b = "parseJSON";
    if ("JSON" in window && "parse" in JSON) {
        d = JSON;
        b = "parse"
    }
    c.ajaxTransport("iframe", function (f) {
        if (f.async) {
            var e = f.initialIframeSrc || "javascript:false;", h, g, i;
            return {
                send: function (j, k) {
                    h = c('<form style="display:none;"></form>');
                    h.attr("accept-charset", f.formAcceptCharset);
                    i = /\?/.test(f.url) ? "&" : "?";
                    if (f.type === "DELETE") {
                        f.url = f.url + i + "_method=DELETE";
                        f.type = "POST"
                    } else {
                        if (f.type === "PUT") {
                            f.url = f.url + i + "_method=PUT";
                            f.type = "POST"
                        } else {
                            if (f.type === "PATCH") {
                                f.url = f.url + i + "_method=PATCH";
                                f.type = "POST"
                            }
                        }
                    }
                    a += 1;
                    g = c('<iframe src="' + e + '" name="iframe-transport-' + a + '"></iframe>').bind("load", function () {
                        var l, m = c.isArray(f.paramName) ? f.paramName : [f.paramName];
                        g.unbind("load").bind("load", function () {
                            var n;
                            try {
                                n = g.contents();
                                if (!n.length || !n[0].firstChild) {
                                    throw new Error()
                                }
                            } catch (o) {
                                n = undefined
                            }
                            k(200, "success", {iframe: n});
                            c('<iframe src="' + e + '"></iframe>').appendTo(h);
                            window.setTimeout(function () {
                                h.remove()
                            }, 0)
                        });
                        h.prop("target", g.prop("name")).prop("action", f.url).prop("method", f.type);
                        if (f.formData) {
                            c.each(f.formData, function (n, o) {
                                c('<input type="hidden"/>').prop("name", o.name).val(o.value).appendTo(h)
                            })
                        }
                        if (f.fileInput && f.fileInput.length && f.type === "POST") {
                            l = f.fileInput.clone();
                            f.fileInput.after(function (n) {
                                return l[n]
                            });
                            if (f.paramName) {
                                f.fileInput.each(function (n) {
                                    c(this).prop("name", m[n] || f.paramName)
                                })
                            }
                            h.append(f.fileInput).prop("enctype", "multipart/form-data").prop("encoding", "multipart/form-data");
                            f.fileInput.removeAttr("form")
                        }
                        h.submit();
                        if (l && l.length) {
                            f.fileInput.each(function (o, n) {
                                var p = c(l[o]);
                                c(n).prop("name", p.prop("name")).attr("form", p.attr("form"));
                                p.replaceWith(n)
                            })
                        }
                    });
                    h.append(g).appendTo(document.body)
                }, abort: function () {
                    if (g) {
                        g.unbind("load").prop("src", e)
                    }
                    if (h) {
                        h.remove()
                    }
                }
            }
        }
    });
    c.ajaxSetup({
        converters: {
            "iframe text": function (e) {
                return e && c(e[0].body).text()
            }, "iframe json": function (e) {
                return e && d[b](c(e[0].body).text())
            }, "iframe html": function (e) {
                return e && c(e[0].body).html()
            }, "iframe xml": function (e) {
                var f = e && e[0];
                return f && c.isXMLDoc(f) ? f : c.parseXML((f.XMLDocument && f.XMLDocument.xml) || c(f.body).html())
            }, "iframe script": function (e) {
                return e && c.globalEval(c(e[0].body).text())
            }
        }
    })
}));
(function (a) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "jquery-ui/ui/widget"], a)
    } else {
        if (typeof exports === "object") {
            a(require("jquery"), require("./vendor/jquery.ui.widget"))
        } else {
            a(window.jQuery)
        }
    }
}(function (b) {
    b.support.fileInput = !(new RegExp("(Android (1\\.[0156]|2\\.[01]))|(Windows Phone (OS 7|8\\.0))|(XBLWP)|(ZuneWP)|(WPDesktop)|(w(eb)?OSBrowser)|(webOS)|(Kindle/(1\\.0|2\\.[05]|3\\.0))").test(window.navigator.userAgent) || b('<input type="file"/>').prop("disabled"));
    b.support.xhrFileUpload = !!(window.ProgressEvent && window.FileReader);
    b.support.xhrFormDataFileUpload = !!window.FormData;
    b.support.blobSlice = window.Blob && (Blob.prototype.slice || Blob.prototype.webkitSlice || Blob.prototype.mozSlice);

    function a(c) {
        var d = c === "dragover";
        return function (g) {
            g.dataTransfer = g.originalEvent && g.originalEvent.dataTransfer;
            var f = g.dataTransfer;
            if (f && b.inArray("Files", f.types) !== -1 && this._trigger(c, b.Event(c, {delegatedEvent: g})) !== false) {
                g.preventDefault();
                if (d) {
                    f.dropEffect = "copy"
                }
            }
        }
    }

    b.widget("blueimp.fileupload", {
        options: {
            dropZone: b(document),
            pasteZone: undefined,
            fileInput: undefined,
            replaceFileInput: true,
            paramName: undefined,
            singleFileUploads: true,
            limitMultiFileUploads: undefined,
            limitMultiFileUploadSize: undefined,
            limitMultiFileUploadSizeOverhead: 512,
            sequentialUploads: false,
            limitConcurrentUploads: undefined,
            forceIframeTransport: false,
            redirect: undefined,
            redirectParamName: undefined,
            postMessage: undefined,
            multipart: true,
            maxChunkSize: undefined,
            uploadedBytes: undefined,
            recalculateProgress: true,
            progressInterval: 100,
            bitrateInterval: 500,
            autoUpload: true,
            messages: {uploadedBytes: "Uploaded bytes exceed file size"},
            i18n: function (d, c) {
                d = this.messages[d] || d.toString();
                if (c) {
                    b.each(c, function (e, f) {
                        d = d.replace("{" + e + "}", f)
                    })
                }
                return d
            },
            formData: function (c) {
                return c.serializeArray()
            },
            add: function (d, c) {
                if (d.isDefaultPrevented()) {
                    return false
                }
                if (c.autoUpload || (c.autoUpload !== false && b(this).fileupload("option", "autoUpload"))) {
                    c.process().done(function () {
                        c.submit()
                    })
                }
            },
            processData: false,
            contentType: false,
            cache: false,
            timeout: 0
        },
        _specialOptions: ["fileInput", "dropZone", "pasteZone", "multipart", "forceIframeTransport"],
        _blobSlice: b.support.blobSlice && function () {
            var c = this.slice || this.webkitSlice || this.mozSlice;
            return c.apply(this, arguments)
        },
        _BitrateTimer: function () {
            this.timestamp = ((Date.now) ? Date.now() : (new Date()).getTime());
            this.loaded = 0;
            this.bitrate = 0;
            this.getBitrate = function (e, d, c) {
                var f = e - this.timestamp;
                if (!this.bitrate || !c || f > c) {
                    this.bitrate = (d - this.loaded) * (1000 / f) * 8;
                    this.loaded = d;
                    this.timestamp = e
                }
                return this.bitrate
            }
        },
        _isXHRUpload: function (c) {
            return !c.forceIframeTransport && ((!c.multipart && b.support.xhrFileUpload) || b.support.xhrFormDataFileUpload)
        },
        _getFormData: function (c) {
            var d;
            if (b.type(c.formData) === "function") {
                return c.formData(c.form)
            }
            if (b.isArray(c.formData)) {
                return c.formData
            }
            if (b.type(c.formData) === "object") {
                d = [];
                b.each(c.formData, function (e, f) {
                    d.push({name: e, value: f})
                });
                return d
            }
            return []
        },
        _getTotal: function (d) {
            var c = 0;
            b.each(d, function (e, f) {
                c += f.size || 1
            });
            return c
        },
        _initProgressObject: function (d) {
            var c = {loaded: 0, total: 0, bitrate: 0};
            if (d._progress) {
                b.extend(d._progress, c)
            } else {
                d._progress = c
            }
        },
        _initResponseObject: function (c) {
            var d;
            if (c._response) {
                for (d in c._response) {
                    if (c._response.hasOwnProperty(d)) {
                        delete c._response[d]
                    }
                }
            } else {
                c._response = {}
            }
        },
        _onProgress: function (g, f) {
            if (g.lengthComputable) {
                var d = ((Date.now) ? Date.now() : (new Date()).getTime()), c;
                if (f._time && f.progressInterval && (d - f._time < f.progressInterval) && g.loaded !== g.total) {
                    return
                }
                f._time = d;
                c = Math.floor(g.loaded / g.total * (f.chunkSize || f._progress.total)) + (f.uploadedBytes || 0);
                this._progress.loaded += (c - f._progress.loaded);
                this._progress.bitrate = this._bitrateTimer.getBitrate(d, this._progress.loaded, f.bitrateInterval);
                f._progress.loaded = f.loaded = c;
                f._progress.bitrate = f.bitrate = f._bitrateTimer.getBitrate(d, c, f.bitrateInterval);
                this._trigger("progress", b.Event("progress", {delegatedEvent: g}), f);
                this._trigger("progressall", b.Event("progressall", {delegatedEvent: g}), this._progress)
            }
        },
        _initProgressListener: function (c) {
            var d = this, e = c.xhr ? c.xhr() : b.ajaxSettings.xhr();
            if (e.upload) {
                b(e.upload).bind("progress", function (f) {
                    var g = f.originalEvent;
                    f.lengthComputable = g.lengthComputable;
                    f.loaded = g.loaded;
                    f.total = g.total;
                    d._onProgress(f, c)
                });
                c.xhr = function () {
                    return e
                }
            }
        },
        _deinitProgressListener: function (c) {
            var d = c.xhr ? c.xhr() : b.ajaxSettings.xhr();
            if (d.upload) {
                b(d.upload).unbind("progress")
            }
        },
        _isInstanceOf: function (c, d) {
            return Object.prototype.toString.call(d) === "[object " + c + "]"
        },
        _initXHRData: function (d) {
            var f = this, h, e = d.files[0], c = d.multipart || !b.support.xhrFileUpload,
                g = b.type(d.paramName) === "array" ? d.paramName[0] : d.paramName;
            d.headers = b.extend({}, d.headers);
            if (d.contentRange) {
                d.headers["Content-Range"] = d.contentRange
            }
            if (!c || d.blob || !this._isInstanceOf("File", e)) {
                d.headers["Content-Disposition"] = 'attachment; filename="' + encodeURI(e.uploadName || e.name) + '"'
            }
            if (!c) {
                d.contentType = e.type || "application/octet-stream";
                d.data = d.blob || e
            } else {
                if (b.support.xhrFormDataFileUpload) {
                    if (d.postMessage) {
                        h = this._getFormData(d);
                        if (d.blob) {
                            h.push({name: g, value: d.blob})
                        } else {
                            b.each(d.files, function (i, j) {
                                h.push({name: (b.type(d.paramName) === "array" && d.paramName[i]) || g, value: j})
                            })
                        }
                    } else {
                        if (f._isInstanceOf("FormData", d.formData)) {
                            h = d.formData
                        } else {
                            h = new FormData();
                            b.each(this._getFormData(d), function (i, j) {
                                h.append(j.name, j.value)
                            })
                        }
                        if (d.blob) {
                            h.append(g, d.blob, e.uploadName || e.name)
                        } else {
                            b.each(d.files, function (i, j) {
                                if (f._isInstanceOf("File", j) || f._isInstanceOf("Blob", j)) {
                                    h.append((b.type(d.paramName) === "array" && d.paramName[i]) || g, j, j.uploadName || j.name)
                                }
                            })
                        }
                    }
                    d.data = h
                }
            }
            d.blob = null
        },
        _initIframeSettings: function (c) {
            var d = b("<a></a>").prop("href", c.url).prop("host");
            c.dataType = "iframe " + (c.dataType || "");
            c.formData = this._getFormData(c);
            if (c.redirect && d && d !== location.host) {
                c.formData.push({name: c.redirectParamName || "redirect", value: c.redirect})
            }
        },
        _initDataSettings: function (c) {
            if (this._isXHRUpload(c)) {
                if (!this._chunkedUpload(c, true)) {
                    if (!c.data) {
                        this._initXHRData(c)
                    }
                    this._initProgressListener(c)
                }
                if (c.postMessage) {
                    c.dataType = "postmessage " + (c.dataType || "")
                }
            } else {
                this._initIframeSettings(c)
            }
        },
        _getParamName: function (c) {
            var d = b(c.fileInput), e = c.paramName;
            if (!e) {
                e = [];
                d.each(function () {
                    var f = b(this), g = f.prop("name") || "files[]", h = (f.prop("files") || [1]).length;
                    while (h) {
                        e.push(g);
                        h -= 1
                    }
                });
                if (!e.length) {
                    e = [d.prop("name") || "files[]"]
                }
            } else {
                if (!b.isArray(e)) {
                    e = [e]
                }
            }
            return e
        },
        _initFormSettings: function (c) {
            if (!c.form || !c.form.length) {
                c.form = b(c.fileInput.prop("form"));
                if (!c.form.length) {
                    c.form = b(this.options.fileInput.prop("form"))
                }
            }
            c.paramName = this._getParamName(c);
            if (!c.url) {
                c.url = c.form.prop("action") || location.href
            }
            c.type = (c.type || (b.type(c.form.prop("method")) === "string" && c.form.prop("method")) || "").toUpperCase();
            if (c.type !== "POST" && c.type !== "PUT" && c.type !== "PATCH") {
                c.type = "POST"
            }
            if (!c.formAcceptCharset) {
                c.formAcceptCharset = c.form.attr("accept-charset")
            }
        },
        _getAJAXSettings: function (d) {
            var c = b.extend({}, this.options, d);
            this._initFormSettings(c);
            this._initDataSettings(c);
            return c
        },
        _getDeferredState: function (c) {
            if (c.state) {
                return c.state()
            }
            if (c.isResolved()) {
                return "resolved"
            }
            if (c.isRejected()) {
                return "rejected"
            }
            return "pending"
        },
        _enhancePromise: function (c) {
            c.success = c.done;
            c.error = c.fail;
            c.complete = c.always;
            return c
        },
        _getXHRPromise: function (f, e, d) {
            var c = b.Deferred(), g = c.promise();
            e = e || this.options.context || g;
            if (f === true) {
                c.resolveWith(e, d)
            } else {
                if (f === false) {
                    c.rejectWith(e, d)
                }
            }
            g.abort = c.promise;
            return this._enhancePromise(g)
        },
        _addConvenienceMethods: function (g, f) {
            var d = this, c = function (e) {
                return b.Deferred().resolveWith(d, e).promise()
            };
            f.process = function (h, e) {
                if (h || e) {
                    f._processQueue = this._processQueue = (this._processQueue || c([this])).then(function () {
                        if (f.errorThrown) {
                            return b.Deferred().rejectWith(d, [f]).promise()
                        }
                        return c(arguments)
                    }).then(h, e)
                }
                return this._processQueue || c([this])
            };
            f.submit = function () {
                if (this.state() !== "pending") {
                    f.jqXHR = this.jqXHR = (d._trigger("submit", b.Event("submit", {delegatedEvent: g}), this) !== false) && d._onSend(g, this)
                }
                return this.jqXHR || d._getXHRPromise()
            };
            f.abort = function () {
                if (this.jqXHR) {
                    return this.jqXHR.abort()
                }
                this.errorThrown = "abort";
                d._trigger("fail", null, this);
                return d._getXHRPromise(false)
            };
            f.state = function () {
                if (this.jqXHR) {
                    return d._getDeferredState(this.jqXHR)
                }
                if (this._processQueue) {
                    return d._getDeferredState(this._processQueue)
                }
            };
            f.processing = function () {
                return !this.jqXHR && this._processQueue && d._getDeferredState(this._processQueue) === "pending"
            };
            f.progress = function () {
                return this._progress
            };
            f.response = function () {
                return this._response
            }
        },
        _getUploadedBytes: function (e) {
            var c = e.getResponseHeader("Range"), f = c && c.split("-"), d = f && f.length > 1 && parseInt(f[1], 10);
            return d && d + 1
        },
        _chunkedUpload: function (n, h) {
            n.uploadedBytes = n.uploadedBytes || 0;
            var g = this, e = n.files[0], f = e.size, c = n.uploadedBytes, d = n.maxChunkSize || f, j = this._blobSlice,
                k = b.Deferred(), m = k.promise(), i, l;
            if (!(this._isXHRUpload(n) && j && (c || (b.type(d) === "function" ? d(n) : d) < f)) || n.data) {
                return false
            }
            if (h) {
                return true
            }
            if (c >= f) {
                e.error = n.i18n("uploadedBytes");
                return this._getXHRPromise(false, n.context, [null, "error", e.error])
            }
            l = function () {
                var q = b.extend({}, n), p = q._progress.loaded;
                q.blob = j.call(e, c, c + (b.type(d) === "function" ? d(q) : d), e.type);
                q.chunkSize = q.blob.size;
                q.contentRange = "bytes " + c + "-" + (c + q.chunkSize - 1) + "/" + f;
                g._trigger("chunkbeforesend", null, q);
                g._initXHRData(q);
                g._initProgressListener(q);
                i = ((g._trigger("chunksend", null, q) !== false && b.ajax(q)) || g._getXHRPromise(false, q.context)).done(function (o, s, r) {
                    c = g._getUploadedBytes(r) || (c + q.chunkSize);
                    if (p + q.chunkSize - q._progress.loaded) {
                        g._onProgress(b.Event("progress", {
                            lengthComputable: true,
                            loaded: c - q.uploadedBytes,
                            total: c - q.uploadedBytes
                        }), q)
                    }
                    n.uploadedBytes = q.uploadedBytes = c;
                    q.result = o;
                    q.textStatus = s;
                    q.jqXHR = r;
                    g._trigger("chunkdone", null, q);
                    g._trigger("chunkalways", null, q);
                    if (c < f) {
                        l()
                    } else {
                        k.resolveWith(q.context, [o, s, r])
                    }
                }).fail(function (o, s, r) {
                    q.jqXHR = o;
                    q.textStatus = s;
                    q.errorThrown = r;
                    g._trigger("chunkfail", null, q);
                    g._trigger("chunkalways", null, q);
                    k.rejectWith(q.context, [o, s, r])
                }).always(function () {
                    g._deinitProgressListener(q)
                })
            };
            this._enhancePromise(m);
            m.abort = function () {
                return i.abort()
            };
            l();
            return m
        },
        _beforeSend: function (d, c) {
            if (this._active === 0) {
                this._trigger("start");
                this._bitrateTimer = new this._BitrateTimer();
                this._progress.loaded = this._progress.total = 0;
                this._progress.bitrate = 0
            }
            this._initResponseObject(c);
            this._initProgressObject(c);
            c._progress.loaded = c.loaded = c.uploadedBytes || 0;
            c._progress.total = c.total = this._getTotal(c.files) || 1;
            c._progress.bitrate = c.bitrate = 0;
            this._active += 1;
            this._progress.loaded += c.loaded;
            this._progress.total += c.total
        },
        _onDone: function (c, h, g, e) {
            var f = e._progress.total, d = e._response;
            if (e._progress.loaded < f) {
                this._onProgress(b.Event("progress", {lengthComputable: true, loaded: f, total: f}), e)
            }
            d.result = e.result = c;
            d.textStatus = e.textStatus = h;
            d.jqXHR = e.jqXHR = g;
            this._trigger("done", null, e)
        },
        _onFail: function (e, g, f, d) {
            var c = d._response;
            if (d.recalculateProgress) {
                this._progress.loaded -= d._progress.loaded;
                this._progress.total -= d._progress.total
            }
            c.jqXHR = d.jqXHR = e;
            c.textStatus = d.textStatus = g;
            c.errorThrown = d.errorThrown = f;
            this._trigger("fail", null, d)
        },
        _onAlways: function (e, f, d, c) {
            this._trigger("always", null, c)
        },
        _onSend: function (i, g) {
            if (!g.submit) {
                this._addConvenienceMethods(i, g)
            }
            var h = this, k, c, j, d, l = h._getAJAXSettings(g), f = function () {
                h._sending += 1;
                l._bitrateTimer = new h._BitrateTimer();
                k = k || (((c || h._trigger("send", b.Event("send", {delegatedEvent: i}), l) === false) && h._getXHRPromise(false, l.context, c)) || h._chunkedUpload(l) || b.ajax(l)).done(function (e, n, m) {
                    h._onDone(e, n, m, l)
                }).fail(function (e, n, m) {
                    h._onFail(e, n, m, l)
                }).always(function (n, o, m) {
                    h._deinitProgressListener(l);
                    h._onAlways(n, o, m, l);
                    h._sending -= 1;
                    h._active -= 1;
                    if (l.limitConcurrentUploads && l.limitConcurrentUploads > h._sending) {
                        var e = h._slots.shift();
                        while (e) {
                            if (h._getDeferredState(e) === "pending") {
                                e.resolve();
                                break
                            }
                            e = h._slots.shift()
                        }
                    }
                    if (h._active === 0) {
                        h._trigger("stop")
                    }
                });
                return k
            };
            this._beforeSend(i, l);
            if (this.options.sequentialUploads || (this.options.limitConcurrentUploads && this.options.limitConcurrentUploads <= this._sending)) {
                if (this.options.limitConcurrentUploads > 1) {
                    j = b.Deferred();
                    this._slots.push(j);
                    d = j.then(f)
                } else {
                    this._sequence = this._sequence.then(f, f);
                    d = this._sequence
                }
                d.abort = function () {
                    c = [undefined, "abort", "abort"];
                    if (!k) {
                        if (j) {
                            j.rejectWith(l.context, c)
                        }
                        return f()
                    }
                    return k.abort()
                };
                return this._enhancePromise(d)
            }
            return f()
        },
        _onAdd: function (q, m) {
            var p = this, v = true, u = b.extend({}, this.options, m), f = m.files, s = f.length,
                g = u.limitMultiFileUploads, k = u.limitMultiFileUploadSize, t = u.limitMultiFileUploadSizeOverhead,
                o = 0, n = this._getParamName(u), d, c, r, l, h = 0;
            if (!s) {
                return false
            }
            if (k && f[0].size === undefined) {
                k = undefined
            }
            if (!(u.singleFileUploads || g || k) || !this._isXHRUpload(u)) {
                r = [f];
                d = [n]
            } else {
                if (!(u.singleFileUploads || k) && g) {
                    r = [];
                    d = [];
                    for (l = 0; l < s; l += g) {
                        r.push(f.slice(l, l + g));
                        c = n.slice(l, l + g);
                        if (!c.length) {
                            c = n
                        }
                        d.push(c)
                    }
                } else {
                    if (!u.singleFileUploads && k) {
                        r = [];
                        d = [];
                        for (l = 0; l < s; l = l + 1) {
                            o += f[l].size + t;
                            if (l + 1 === s || ((o + f[l + 1].size + t) > k) || (g && l + 1 - h >= g)) {
                                r.push(f.slice(h, l + 1));
                                c = n.slice(h, l + 1);
                                if (!c.length) {
                                    c = n
                                }
                                d.push(c);
                                h = l + 1;
                                o = 0
                            }
                        }
                    } else {
                        d = n
                    }
                }
            }
            m.originalFiles = f;
            b.each(r || f, function (e, i) {
                var j = b.extend({}, m);
                j.files = r ? i : [i];
                j.paramName = d[e];
                p._initResponseObject(j);
                p._initProgressObject(j);
                p._addConvenienceMethods(q, j);
                v = p._trigger("add", b.Event("add", {delegatedEvent: q}), j);
                return v
            });
            return v
        },
        _replaceFileInput: function (f) {
            var c = f.fileInput, d = c.clone(true), e = c.is(document.activeElement);
            f.fileInputClone = d;
            b("<form></form>").append(d)[0].reset();
            c.after(d).detach();
            if (e) {
                d.focus()
            }
            b.cleanData(c.unbind("remove"));
            this.options.fileInput = this.options.fileInput.map(function (g, h) {
                if (h === c[0]) {
                    return d[0]
                }
                return h
            });
            if (c[0] === this.element[0]) {
                this.element = d
            }
        },
        _handleFileTreeEntry: function (h, j) {
            var e = this, i = b.Deferred(), c = [], k, d = function (l) {
                if (l && !l.entry) {
                    l.entry = h
                }
                i.resolve([l])
            }, g = function (l) {
                e._handleFileTreeEntries(l, j + h.name + "/").done(function (m) {
                    i.resolve(m)
                }).fail(d)
            }, f = function () {
                k.readEntries(function (l) {
                    if (!l.length) {
                        g(c)
                    } else {
                        c = c.concat(l);
                        f()
                    }
                }, d)
            };
            j = j || "";
            if (h.isFile) {
                if (h._file) {
                    h._file.relativePath = j;
                    i.resolve(h._file)
                } else {
                    h.file(function (l) {
                        l.relativePath = j;
                        i.resolve(l)
                    }, d)
                }
            } else {
                if (h.isDirectory) {
                    k = h.createReader();
                    f()
                } else {
                    i.resolve([])
                }
            }
            return i.promise()
        },
        _handleFileTreeEntries: function (c, e) {
            var d = this;
            return b.when.apply(b, b.map(c, function (f) {
                return d._handleFileTreeEntry(f, e)
            })).then(function () {
                return Array.prototype.concat.apply([], arguments)
            })
        },
        _getDroppedFiles: function (d) {
            d = d || {};
            var c = d.items;
            if (c && c.length && (c[0].webkitGetAsEntry || c[0].getAsEntry)) {
                return this._handleFileTreeEntries(b.map(c, function (f) {
                    var e;
                    if (f.webkitGetAsEntry) {
                        e = f.webkitGetAsEntry();
                        if (e) {
                            e._file = f.getAsFile()
                        }
                        return e
                    }
                    return f.getAsEntry()
                }))
            }
            return b.Deferred().resolve(b.makeArray(d.files)).promise()
        },
        _getSingleFileInputFiles: function (e) {
            e = b(e);
            var c = e.prop("webkitEntries") || e.prop("entries"), d, f;
            if (c && c.length) {
                return this._handleFileTreeEntries(c)
            }
            d = b.makeArray(e.prop("files"));
            if (!d.length) {
                f = e.prop("value");
                if (!f) {
                    return b.Deferred().resolve([]).promise()
                }
                d = [{name: f.replace(/^.*\\/, "")}]
            } else {
                if (d[0].name === undefined && d[0].fileName) {
                    b.each(d, function (g, h) {
                        h.name = h.fileName;
                        h.size = h.fileSize
                    })
                }
            }
            return b.Deferred().resolve(d).promise()
        },
        _getFileInputFiles: function (c) {
            if (!(c instanceof b) || c.length === 1) {
                return this._getSingleFileInputFiles(c)
            }
            return b.when.apply(b, b.map(c, this._getSingleFileInputFiles)).then(function () {
                return Array.prototype.concat.apply([], arguments)
            })
        },
        _onChange: function (f) {
            var c = this, d = {fileInput: b(f.target), form: b(f.target.form)};
            this._getFileInputFiles(d.fileInput).always(function (e) {
                d.files = e;
                if (c.options.replaceFileInput) {
                    c._replaceFileInput(d)
                }
                if (c._trigger("change", b.Event("change", {delegatedEvent: f}), d) !== false) {
                    c._onAdd(f, d)
                }
            })
        },
        _onPaste: function (f) {
            var c = f.originalEvent && f.originalEvent.clipboardData && f.originalEvent.clipboardData.items,
                d = {files: []};
            if (c && c.length) {
                b.each(c, function (e, h) {
                    var g = h.getAsFile && h.getAsFile();
                    if (g) {
                        d.files.push(g)
                    }
                });
                if (this._trigger("paste", b.Event("paste", {delegatedEvent: f}), d) !== false) {
                    this._onAdd(f, d)
                }
            }
        },
        _onDrop: function (g) {
            g.dataTransfer = g.originalEvent && g.originalEvent.dataTransfer;
            var c = this, f = g.dataTransfer, d = {};
            if (f && f.files && f.files.length) {
                g.preventDefault();
                this._getDroppedFiles(f).always(function (e) {
                    d.files = e;
                    if (c._trigger("drop", b.Event("drop", {delegatedEvent: g}), d) !== false) {
                        c._onAdd(g, d)
                    }
                })
            }
        },
        _onDragOver: a("dragover"),
        _onDragEnter: a("dragenter"),
        _onDragLeave: a("dragleave"),
        _initEventHandlers: function () {
            if (this._isXHRUpload(this.options)) {
                this._on(this.options.dropZone, {
                    dragover: this._onDragOver,
                    drop: this._onDrop,
                    dragenter: this._onDragEnter,
                    dragleave: this._onDragLeave
                });
                this._on(this.options.pasteZone, {paste: this._onPaste})
            }
            if (b.support.fileInput) {
                this._on(this.options.fileInput, {change: this._onChange})
            }
        },
        _destroyEventHandlers: function () {
            this._off(this.options.dropZone, "dragenter dragleave dragover drop");
            this._off(this.options.pasteZone, "paste");
            this._off(this.options.fileInput, "change")
        },
        _destroy: function () {
            this._destroyEventHandlers()
        },
        _setOption: function (c, d) {
            var e = b.inArray(c, this._specialOptions) !== -1;
            if (e) {
                this._destroyEventHandlers()
            }
            this._super(c, d);
            if (e) {
                this._initSpecialOptions();
                this._initEventHandlers()
            }
        },
        _initSpecialOptions: function () {
            var c = this.options;
            if (c.fileInput === undefined) {
                c.fileInput = this.element.is('input[type="file"]') ? this.element : this.element.find('input[type="file"]')
            } else {
                if (!(c.fileInput instanceof b)) {
                    c.fileInput = b(c.fileInput)
                }
            }
            if (!(c.dropZone instanceof b)) {
                c.dropZone = b(c.dropZone)
            }
            if (!(c.pasteZone instanceof b)) {
                c.pasteZone = b(c.pasteZone)
            }
        },
        _getRegExp: function (e) {
            var d = e.split("/"), c = d.pop();
            d.shift();
            return new RegExp(d.join("/"), c)
        },
        _isRegExpOption: function (c, d) {
            return c !== "url" && b.type(d) === "string" && /^\/.*\/[igm]{0,3}$/.test(d)
        },
        _initDataAttributes: function () {
            var d = this, c = this.options, e = this.element.data();
            b.each(this.element[0].attributes, function (g, f) {
                var h = f.name.toLowerCase(), i;
                if (/^data-/.test(h)) {
                    h = h.slice(5).replace(/-[a-z]/g, function (j) {
                        return j.charAt(1).toUpperCase()
                    });
                    i = e[h];
                    if (d._isRegExpOption(h, i)) {
                        i = d._getRegExp(i)
                    }
                    c[h] = i
                }
            })
        },
        _create: function () {
            this._initDataAttributes();
            this._initSpecialOptions();
            this._slots = [];
            this._sequence = this._getXHRPromise(true);
            this._sending = this._active = 0;
            this._initProgressObject(this);
            this._initEventHandlers()
        },
        active: function () {
            return this._active
        },
        progress: function () {
            return this._progress
        },
        add: function (d) {
            var c = this;
            if (!d || this.options.disabled) {
                return
            }
            if (d.fileInput && !d.files) {
                this._getFileInputFiles(d.fileInput).always(function (e) {
                    d.files = e;
                    c._onAdd(null, d)
                })
            } else {
                d.files = b.makeArray(d.files);
                this._onAdd(null, d)
            }
        },
        send: function (g) {
            if (g && !this.options.disabled) {
                if (g.fileInput && !g.files) {
                    var e = this, c = b.Deferred(), h = c.promise(), d, f;
                    h.abort = function () {
                        f = true;
                        if (d) {
                            return d.abort()
                        }
                        c.reject(null, "abort", "abort");
                        return h
                    };
                    this._getFileInputFiles(g.fileInput).always(function (i) {
                        if (f) {
                            return
                        }
                        if (!i.length) {
                            c.reject();
                            return
                        }
                        g.files = i;
                        d = e._onSend(null, g);
                        d.then(function (j, l, k) {
                            c.resolve(j, l, k)
                        }, function (j, l, k) {
                            c.reject(j, l, k)
                        })
                    });
                    return this._enhancePromise(h)
                }
                g.files = b.makeArray(g.files);
                if (g.files.length) {
                    return this._onSend(null, g)
                }
            }
            return this._getXHRPromise(false, g && g.context)
        }
    })
}));
PrimeFaces.widget.FileUpload = PrimeFaces.widget.BaseWidget.extend({
    IMAGE_TYPES: /(\.|\/)(gif|jpe?g|png)$/i, init: function (a) {
        this._super(a);
        if (this.cfg.disabled) {
            return
        }
        this.ucfg = {};
        this.form = this.jq.closest("form");
        this.buttonBar = this.jq.children(".ui-fileupload-buttonbar");
        this.chooseButton = this.buttonBar.children(".ui-fileupload-choose");
        this.uploadButton = this.buttonBar.children(".ui-fileupload-upload");
        this.cancelButton = this.buttonBar.children(".ui-fileupload-cancel");
        this.content = this.jq.children(".ui-fileupload-content");
        this.filesTbody = this.content.find("> div.ui-fileupload-files > div");
        this.sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        this.files = [];
        this.fileAddIndex = 0;
        this.cfg.invalidFileMessage = this.cfg.invalidFileMessage || "Invalid file type";
        this.cfg.invalidSizeMessage = this.cfg.invalidSizeMessage || "Invalid file size";
        this.cfg.fileLimitMessage = this.cfg.fileLimitMessage || "Maximum number of files exceeded";
        this.cfg.messageTemplate = this.cfg.messageTemplate || "{name} {size}";
        this.cfg.previewWidth = this.cfg.previewWidth || 80;
        this.uploadedFileCount = 0;
        this.fileId = 0;
        this.renderMessages();
        this.bindEvents();
        var c = this, e = this.form.attr("action"), d = this.form.children("input[name*='javax.faces.encodedURL']");
        var b = null;
        if (d.length > 0) {
            b = 'form[action="' + e + '"]';
            e = d.val()
        }
        this.ucfg = {
            url: e,
            portletForms: b,
            paramName: this.id,
            dataType: "xml",
            dropZone: (this.cfg.dnd === false) ? null : this.jq,
            sequentialUploads: this.cfg.sequentialUploads,
            formData: function () {
                return c.createPostData()
            },
            beforeSend: function (g, f) {
                g.setRequestHeader("Faces-Request", "partial/ajax");
                g.pfSettings = f;
                g.pfArgs = {}
            },
            start: function (f) {
                if (c.cfg.onstart) {
                    c.cfg.onstart.call(c)
                }
            },
            add: function (i, g) {
                c.chooseButton.removeClass("ui-state-hover ui-state-focus");
                if (c.fileAddIndex === 0) {
                    c.clearMessages()
                }
                if (c.cfg.fileLimit && (c.uploadedFileCount + c.files.length + 1) > c.cfg.fileLimit) {
                    c.clearMessages();
                    c.showMessage({summary: c.cfg.fileLimitMessage});
                    return
                }
                var f = g.files ? g.files[0] : null;
                if (f) {
                    var h = c.validate(f);
                    if (h) {
                        c.showMessage({summary: h, filename: f.name, filesize: f.size});
                        c.postSelectFile(g)
                    } else {
                        if (c.cfg.onAdd) {
                            c.cfg.onAdd.call(c, f, function (j) {
                                f = j;
                                g.files[0] = j;
                                this.addFileToRow(f, g)
                            })
                        } else {
                            c.addFileToRow(f, g)
                        }
                    }
                }
            },
            send: function (j, h) {
                if (!window.FormData) {
                    for (var g = 0; g < h.files.length; g++) {
                        var f = h.files[g];
                        if (f.row) {
                            f.row.children(".ui-fileupload-progress").find("> .ui-progressbar > .ui-progressbar-value").addClass("ui-progressbar-value-legacy").css({
                                width: "100%",
                                display: "block"
                            })
                        }
                    }
                }
            },
            fail: function (g, f) {
                if (f.errorThrown === "abort") {
                    if (c.cfg.oncancel) {
                        c.cfg.oncancel.call(c)
                    }
                    return
                }
                if (c.cfg.onerror) {
                    c.cfg.onerror.call(c, f.jqXHR, f.textStatus, f.jqXHR.pfArgs)
                }
            },
            progress: function (k, j) {
                if (window.FormData) {
                    var f = parseInt(j.loaded / j.total * 100, 10);
                    for (var h = 0; h < j.files.length; h++) {
                        var g = j.files[h];
                        if (g.row) {
                            g.row.children(".ui-fileupload-progress").find("> .ui-progressbar > .ui-progressbar-value").css({
                                width: f + "%",
                                display: "block"
                            })
                        }
                    }
                }
            },
            done: function (g, f) {
                c.uploadedFileCount += f.files.length;
                c.removeFiles(f.files);
                PrimeFaces.ajax.Response.handle(f.result, f.textStatus, f.jqXHR, null)
            },
            always: function (g, f) {
                if (c.cfg.oncomplete) {
                    c.cfg.oncomplete.call(c, f.jqXHR.pfArgs)
                }
            }
        };
        this.jq.fileupload(this.ucfg)
    }, addFileToRow: function (c, f) {
        var g = this,
            i = $('<div class="ui-fileupload-row"></div>')
                .append('<div class="ui-fileupload-preview"></td>')
                .append("<div>" + PrimeFaces.escapeHTML(c.name) + "</div>")
                .append("<div>" + this.formatSize(c.size) + "</div>")
                .append('<div class="ui-fileupload-progress"></div>')
                .append('<div><button class="ui-fileupload-cancel ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only"><span class="ui-button-icon-left ui-icon ui-icon ui-icon-close"></span><span class="ui-button-text">ui-button</span></button></div>').appendTo(this.filesTbody);
        if (this.filesTbody.children(".ui-fileupload-row").length > 1) {
            $('<div class="ui-widget-content"></div>').prependTo(i)
        }
        if (window.File && window.FileReader && g.IMAGE_TYPES.test(c.name)) {
            var h = $("<canvas></canvas>").appendTo(i.children("div.ui-fileupload-preview")),
                b = h.get(0).getContext("2d"), d = window.URL || window.webkitURL, a = d.createObjectURL(c),
                e = new Image();
            e.onload = function () {
                var k = null, j = null, l = 1;
                if (g.cfg.previewWidth > this.width) {
                    k = this.width
                } else {
                    k = g.cfg.previewWidth;
                    l = g.cfg.previewWidth / this.width
                }
                var j = parseInt(this.height * l);
                h.attr({width: k, height: j});
                b.drawImage(e, 0, 0, k, j)
            };
            e.src = a
        }
        i.children("div.ui-fileupload-progress").append('<div class="ui-progressbar ui-widget ui-widget-content ui-corner-all" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="ui-progressbar-value ui-widget-header ui-corner-left" style="display: none; width: 0%;"></div></div>');
        c.row = i;
        c.row.data("fileId", this.fileId++);
        c.row.data("filedata", f);
        this.files.push(c);
        if (this.cfg.auto) {
            this.upload()
        }
        this.postSelectFile(f)
    }, postSelectFile: function (a) {
        if (this.files.length > 0) {
            this.enableButton(this.uploadButton);
            this.enableButton(this.cancelButton)
        }
        this.fileAddIndex++;
        if (this.fileAddIndex === (a.originalFiles.length)) {
            this.fileAddIndex = 0
        }
    }, bindEvents: function () {
        var b = this;
        PrimeFaces.skinButton(this.buttonBar.children("button"));
        this.chooseButton.on("mouseover.fileupload", function () {
            var c = $(this);
            if (!c.prop("disabled")) {
                c.addClass("ui-state-hover")
            }
        }).on("mouseout.fileupload", function () {
            $(this).removeClass("ui-state-active ui-state-hover")
        }).on("mousedown.fileupload", function () {
            var c = $(this);
            if (!c.prop("disabled")) {
                c.addClass("ui-state-active").removeClass("ui-state-hover")
            }
        }).on("mouseup.fileupload", function () {
            $(this).removeClass("ui-state-active").addClass("ui-state-hover")
        });
        var a = false;
        this.chooseButton.on("focus.fileupload", function () {
            $(this).addClass("ui-state-focus")
        }).on("blur.fileupload", function () {
            $(this).removeClass("ui-state-focus");
            a = false
        });
        this.chooseButton.on("click.fileupload", function () {
            b.chooseButton.children("input").trigger("click")
        }).on("keydown.fileupload", function (f) {
            var d = $.ui.keyCode, c = f.which;
            if (c === d.SPACE || c === d.ENTER) {
                b.chooseButton.children("input").trigger("click");
                $(this).blur();
                f.preventDefault()
            }
        });
        this.chooseButton.children("input").on("click", function (c) {
            if (a) {
                a = false;
                c.preventDefault();
                c.stopPropagation()
            } else {
                a = true
            }
        });
        this.uploadButton.on("click.fileupload", function (c) {
            b.disableButton(b.uploadButton);
            b.disableButton(b.cancelButton);
            b.upload();
            c.preventDefault()
        });
        this.cancelButton.on("click.fileupload", function (c) {
            b.clear();
            b.disableButton(b.uploadButton);
            b.disableButton(b.cancelButton);
            c.preventDefault()
        });
        this.clearMessageLink.on("click.fileupload", function (c) {
            b.messageContainer.fadeOut(function () {
                b.messageList.children().remove()
            });
            c.preventDefault()
        });
        this.rowActionSelector = this.jqId + " .ui-fileupload-files button";
        this.rowCancelActionSelector = this.jqId + " .ui-fileupload-files .ui-fileupload-cancel";
        this.clearMessagesSelector = this.jqId + " .ui-messages .ui-messages-close";
        $(document).off("mouseover.fileupload mouseout.fileupload mousedown.fileupload mouseup.fileupload focus.fileupload blur.fileupload click.fileupload ", this.rowCancelActionSelector).on("mouseover.fileupload", this.rowCancelActionSelector, null, function (c) {
            $(this).addClass("ui-state-hover")
        }).on("mouseout.fileupload", this.rowCancelActionSelector, null, function (c) {
            $(this).removeClass("ui-state-hover ui-state-active")
        }).on("mousedown.fileupload", this.rowCancelActionSelector, null, function (c) {
            $(this).addClass("ui-state-active").removeClass("ui-state-hover")
        }).on("mouseup.fileupload", this.rowCancelActionSelector, null, function (c) {
            $(this).addClass("ui-state-hover").removeClass("ui-state-active")
        }).on("focus.fileupload", this.rowCancelActionSelector, null, function (c) {
            $(this).addClass("ui-state-focus")
        }).on("blur.fileupload", this.rowCancelActionSelector, null, function (c) {
            $(this).removeClass("ui-state-focus")
        }).on("click.fileupload", this.rowCancelActionSelector, null, function (d) {
            var f = $(this).closest(".ui-fileupload-row");
            var c = $.grep(b.files, function (e) {
                return (e.row.data("fileId") === f.data("fileId"))
            });
            if (c[0]) {
                if (c[0].ajaxRequest) {
                    c[0].ajaxRequest.abort()
                }
                b.removeFile(c[0]);
                if (b.files.length === 0) {
                    b.disableButton(b.uploadButton);
                    b.disableButton(b.cancelButton)
                }
            }
            d.preventDefault()
        })
    }, upload: function () {
        for (var a = 0; a < this.files.length; a++) {
            this.files[a].ajaxRequest = this.files[a].row.data("filedata");
            this.files[a].ajaxRequest.submit()
        }
    }, createPostData: function () {
        var a = this.cfg.process ? this.id + " " + PrimeFaces.expressions.SearchExpressionFacade.resolveComponents(this.cfg.process).join(" ") : this.id;
        var b = this.form.serializeArray();
        var d = PrimeFaces.ajax.Request.extractParameterNamespace(this.form);
        PrimeFaces.ajax.Request.addParam(b, PrimeFaces.PARTIAL_REQUEST_PARAM, true, d);
        PrimeFaces.ajax.Request.addParam(b, PrimeFaces.PARTIAL_PROCESS_PARAM, a, d);
        PrimeFaces.ajax.Request.addParam(b, PrimeFaces.PARTIAL_SOURCE_PARAM, this.id, d);
        if (this.cfg.update) {
            var c = PrimeFaces.expressions.SearchExpressionFacade.resolveComponents(this.cfg.update).join(" ");
            PrimeFaces.ajax.Request.addParam(b, PrimeFaces.PARTIAL_UPDATE_PARAM, c, d)
        }
        return b
    }, formatSize: function (a) {
        if (a === undefined) {
            return ""
        }
        if (a === 0) {
            return "N/A"
        }
        var b = parseInt(Math.floor(Math.log(a) / Math.log(1024)));
        if (b === 0) {
            return a + " " + this.sizes[b]
        } else {
            return (a / Math.pow(1024, b)).toFixed(1) + " " + this.sizes[b]
        }
    }, removeFiles: function (b) {
        for (var a = 0; a < b.length; a++) {
            this.removeFile(b[a])
        }
    }, removeFile: function (a) {
        var b = this;
        this.files = $.grep(this.files, function (c) {
            return (c.row.data("fileId") === a.row.data("fileId"))
        }, true);
        b.removeFileRow(a.row);
        a.row = null
    }, removeFileRow: function (a) {
        if (a) {
            this.disableButton(a.find("> div:last-child").children(".ui-fileupload-cancel"));
            a.fadeOut(function () {
                $(this).remove()
            })
        }
    }, clear: function () {
        for (var a = 0; a < this.files.length; a++) {
            this.removeFileRow(this.files[a].row);
            this.files[a].row = null
        }
        this.clearMessages();
        this.files = []
    }, validate: function (a) {
        if (this.cfg.allowTypes && !(this.cfg.allowTypes.test(a.type) || this.cfg.allowTypes.test(a.name))) {
            return this.cfg.invalidFileMessage
        }
        if (this.cfg.maxFileSize && a.size > this.cfg.maxFileSize) {
            return this.cfg.invalidSizeMessage
        }
        return null
    }, renderMessages: function () {
        var a = '<div class="ui-messages ui-widget ui-helper-hidden ui-fileupload-messages"><div class="ui-messages-error ui-corner-all"><a class="ui-messages-close" href="#"><span class="ui-icon ui-icon-close"></span></a><span class="ui-messages-error-icon"></span><ul></ul></div></div>';
        this.messageContainer = $(a).prependTo(this.content);
        this.messageList = this.messageContainer.find("> .ui-messages-error > ul");
        this.clearMessageLink = this.messageContainer.find("> .ui-messages-error > a.ui-messages-close")
    }, clearMessages: function () {
        this.messageContainer.hide();
        this.messageList.children().remove()
    }, showMessage: function (c) {
        var a = c.summary, b = "";
        if (c.filename && c.filesize) {
            b = this.cfg.messageTemplate.replace("{name}", c.filename).replace("{size}", this.formatSize(c.filesize))
        }
        this.messageList.append('<li><span class="ui-messages-error-summary">' + PrimeFaces.escapeHTML(a) + '</span><span class="ui-messages-error-detail">' + PrimeFaces.escapeHTML(b) + "</span></li>");
        this.messageContainer.show()
    }, disableButton: function (a) {
        a.prop("disabled", true).attr("aria-disabled", true).addClass("ui-state-disabled").removeClass("ui-state-hover ui-state-active ui-state-focus")
    }, enableButton: function (a) {
        a.prop("disabled", false).attr("aria-disabled", false).removeClass("ui-state-disabled")
    }
});
PrimeFaces.widget.SimpleFileUpload = PrimeFaces.widget.BaseWidget.extend({
    init: function (a) {
        this._super(a);
        this.cfg.invalidSizeMessage = this.cfg.invalidSizeMessage || "Invalid file size";
        this.maxFileSize = this.cfg.maxFileSize;
        if (this.cfg.skinSimple) {
            this.button = this.jq.children(".ui-button");
            this.input = $(this.jqId + "_input");
            this.display = this.jq.children(".ui-fileupload-filename");
            if (!this.input.prop("disabled")) {
                this.bindEvents()
            }
        }
    }, bindEvents: function () {
        var a = this;
        this.button.on("mouseover.fileupload", function () {
            var b = $(this);
            if (!b.prop("disabled")) {
                b.addClass("ui-state-hover")
            }
        }).on("mouseout.fileupload", function () {
            $(this).removeClass("ui-state-active ui-state-hover")
        }).on("mousedown.fileupload", function () {
            var b = $(this);
            if (!b.prop("disabled")) {
                b.addClass("ui-state-active").removeClass("ui-state-hover")
            }
        }).on("mouseup.fileupload", function () {
            $(this).removeClass("ui-state-active").addClass("ui-state-hover")
        });
        this.input.on("change.fileupload", function () {
            var c = a.input[0].files;
            var b = c.length > 0 ? c[c.length - 1] : null;
            var d = a.validate(a.input[0], b);
            if (d) {
                a.display.text(d)
            } else {
                a.display.text(a.input.val().replace(/\\/g, "/").replace(/.*\//, ""))
            }
        }).on("focus.fileupload", function () {
            a.button.addClass("ui-state-focus")
        }).on("blur.fileupload", function () {
            a.button.removeClass("ui-state-focus")
        })
    }, validate: function (a, b) {
        var c = this;
        if (b && c.cfg.maxFileSize && b.size > c.cfg.maxFileSize) {
            $(a).replaceWith($(a).val("").clone(true));
            return c.cfg.invalidSizeMessage
        }
        return null
    }
});
